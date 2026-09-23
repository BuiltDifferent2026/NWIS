import { NextRequest, NextResponse } from 'next/server';
import { getAllWells, haversineDistanceKm } from '@/lib/data/service';
import { Well } from '@/lib/data/types';

interface SimilarityWeights {
  formation?: number;
  depth?: number;
  trajectory?: number;
  operational?: number;
  rigType?: number;
  geographic?: number;
}

export function compute6FactorSimilarity(
  wellA: Well,
  wellB: Well,
  customWeights?: SimilarityWeights
) {
  // 1. Formation match
  const formationMatch = wellA.currentFormation === wellB.currentFormation ? 0.95 : 0.45;

  // 2. Depth alignment (normalized)
  const depthA = wellA.currentDepthMD || wellA.totalDepthMD || 3000;
  const depthB = wellB.currentDepthMD || wellB.totalDepthMD || 3000;
  const depthDiff = Math.abs(depthA - depthB);
  const depthAlignment = Math.max(0, 1 - depthDiff / 1500);

  // 3. Trajectory concordance
  const trajectorySimilarity = wellA.trajectoryType === wellB.trajectoryType ? 0.92 : 0.60;

  // 4. Operational parameter similarity (field / tectonic regime)
  const operationalParamSimilarity = wellA.field === wellB.field ? 0.90 : 0.62;

  // 5. Rig type similarity (from Strategy Doc v2 Section 3)
  const rigA = (wellA.rig || '').toLowerCase();
  const rigB = (wellB.rig || '').toLowerCase();
  const rigTypeSimilarity = rigA === rigB ? 1.0 : (rigA.includes('oil') && rigB.includes('oil') ? 0.85 : 0.65);

  // 6. Geographic proximity (haversine distance)
  const dist = haversineDistanceKm(
    wellA.surfaceCoords.lat, wellA.surfaceCoords.lng,
    wellB.surfaceCoords.lat, wellB.surfaceCoords.lng
  );
  const geographicProximity = Math.max(0, 1 - dist / 50);

  const weights = {
    formation: customWeights?.formation ?? 0.25,
    depth: customWeights?.depth ?? 0.20,
    trajectory: customWeights?.trajectory ?? 0.15,
    operational: customWeights?.operational ?? 0.15,
    rigType: customWeights?.rigType ?? 0.10,
    geographic: customWeights?.geographic ?? 0.15
  };

  const total =
    formationMatch * weights.formation +
    depthAlignment * weights.depth +
    trajectorySimilarity * weights.trajectory +
    operationalParamSimilarity * weights.operational +
    rigTypeSimilarity * weights.rigType +
    geographicProximity * weights.geographic;

  return {
    totalScore: Math.round(total * 100) / 100,
    distanceKm: dist,
    breakdown: {
      formationMatch: Math.round(formationMatch * 100) / 100,
      depthAlignment: Math.round(depthAlignment * 100) / 100,
      trajectorySimilarity: Math.round(trajectorySimilarity * 100) / 100,
      operationalParamSimilarity: Math.round(operationalParamSimilarity * 100) / 100,
      rigTypeSimilarity: Math.round(rigTypeSimilarity * 100) / 100,
      geographicProximity: Math.round(geographicProximity * 100) / 100
    },
    weights
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetWellId, candidateWellIds, weights, sortBy = 'similarity' } = body;

    if (!targetWellId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter 'targetWellId'" },
        { status: 400 }
      );
    }

    const allWells = await getAllWells();
    const targetWell = allWells.find(
      w => w.id.toLowerCase() === targetWellId.toLowerCase()
    );

    if (!targetWell) {
      return NextResponse.json(
        { success: false, error: `Target well '${targetWellId}' not found` },
        { status: 404 }
      );
    }

    // Filter candidate wells
    let candidates = allWells.filter(w => w.id.toLowerCase() !== targetWell.id.toLowerCase());
    if (Array.isArray(candidateWellIds) && candidateWellIds.length > 0) {
      const allowed = new Set(candidateWellIds.map((id: string) => id.toLowerCase()));
      candidates = candidates.filter(w => allowed.has(w.id.toLowerCase()));
    }

    const results = candidates.map(candidate => {
      const sim = compute6FactorSimilarity(targetWell, candidate, weights);
      return {
        well: candidate,
        distanceKm: sim.distanceKm,
        similarityScore: sim.totalScore,
        similarityBreakdown: sim.breakdown,
        isDisconfirmingEvidence: candidate.status === 'completed' && candidate.field === targetWell.field
      };
    });

    if (sortBy === 'distance') {
      results.sort((a, b) => a.distanceKm - b.distanceKm);
    } else {
      results.sort((a, b) => b.similarityScore - a.similarityScore);
    }

    return NextResponse.json({
      success: true,
      targetWell,
      candidateCount: results.length,
      formula: "Similarity = w1*Formation + w2*Depth + w3*Trajectory + w4*Operational + w5*RigType + w6*Geographic",
      results
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to compute offset similarity' },
      { status: 500 }
    );
  }
}
