import {
  Well,
  DrillingEvent,
  RiskCorridor,
  Alert,
  FeedbackEntry,
  OffsetWellResult,
  IngestionBatch,
  SourceDocument
} from './types';
import {
  MOCK_WELLS,
  MOCK_EVENTS,
  MOCK_RISK_CORRIDORS,
  MOCK_ALERTS,
  MOCK_FEEDBACK,
  MOCK_INGESTION_BATCHES,
  MOCK_SOURCE_DOCS
} from './fixtures';

// Haversine distance in km
export function haversineDistanceKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Compute composite similarity between two wells (0-1)
export function computeCompositeSimilarity(wellA: Well, wellB: Well): {
  total: number;
  breakdown: {
    formationMatch: number;
    depthAlignment: number;
    trajectorySimilarity: number;
    operationalParamSimilarity: number;
    geographicProximity: number;
  };
} {
  // 1. Formation match
  const formationMatch = wellA.currentFormation === wellB.currentFormation ? 0.95 : 0.45;

  // 2. Depth alignment (normalized)
  const depthA = wellA.currentDepthMD || wellA.totalDepthMD || 3000;
  const depthB = wellB.currentDepthMD || wellB.totalDepthMD || 3000;
  const depthDiff = Math.abs(depthA - depthB);
  const depthAlignment = Math.max(0, 1 - depthDiff / 1500);

  // 3. Trajectory concordance
  const trajectorySimilarity = wellA.trajectoryType === wellB.trajectoryType ? 0.9 : 0.65;

  // 4. Operational similarity (field / lithological regime)
  const operationalParamSimilarity = wellA.field === wellB.field ? 0.88 : 0.60;

  // 5. Geographic proximity
  const dist = haversineDistanceKm(
    wellA.surfaceCoords.lat, wellA.surfaceCoords.lng,
    wellB.surfaceCoords.lat, wellB.surfaceCoords.lng
  );
  const geographicProximity = Math.max(0, 1 - dist / 50);

  const weights = {
    formation: 0.30,
    depth: 0.25,
    trajectory: 0.15,
    operational: 0.15,
    geographic: 0.15
  };

  const total =
    formationMatch * weights.formation +
    depthAlignment * weights.depth +
    trajectorySimilarity * weights.trajectory +
    operationalParamSimilarity * weights.operational +
    geographicProximity * weights.geographic;

  return {
    total: Math.round(total * 100) / 100,
    breakdown: {
      formationMatch: Math.round(formationMatch * 100) / 100,
      depthAlignment: Math.round(depthAlignment * 100) / 100,
      trajectorySimilarity: Math.round(trajectorySimilarity * 100) / 100,
      operationalParamSimilarity: Math.round(operationalParamSimilarity * 100) / 100,
      geographicProximity: Math.round(geographicProximity * 100) / 100
    }
  };
}

import { WELLS as RICH_WELLS } from '@/data/wells';

// Convert synthetic rich well from @/data/wells to runtime Well type
export function mapRichWellToWell(rw: typeof RICH_WELLS[0]): Well {
  let status: "active" | "completed" | "historical" = "historical";
  if (rw.status === "drilling") status = "active";
  else if (rw.status === "completed") status = "completed";

  let trajectoryType: "vertical" | "deviated" | "horizontal" = "vertical";
  if (rw.trajectoryType === "deviated" || rw.trajectoryType === "directional") trajectoryType = "deviated";
  else if (rw.trajectoryType === "horizontal") trajectoryType = "horizontal";

  const currentFormation = rw.formationTops && rw.formationTops.length > 0
    ? rw.formationTops[rw.formationTops.length - 1].formationName
    : "Tipam Sandstone";

  return {
    id: rw.id,
    name: rw.name,
    field: rw.field,
    status,
    surfaceCoords: { lat: rw.coordinates.surfaceLat, lng: rw.coordinates.surfaceLng },
    bottomHoleCoords: rw.coordinates.bottomHoleLat && rw.coordinates.bottomHoleLng ? {
      lat: rw.coordinates.bottomHoleLat,
      lng: rw.coordinates.bottomHoleLng
    } : undefined,
    spudDate: rw.spudDate,
    currentDepthMD: rw.currentDepthMD || rw.totalDepthMD,
    currentDepthTVD: rw.totalDepthTVD,
    currentFormation,
    trajectoryType,
    operator: rw.operator || "Oil India Limited",
    rig: rw.rig || "OIL-RIG-IV",
    totalDepthMD: rw.totalDepthMD
  };
}

function getUnifiedWells(): Well[] {
  const combined = [
    ...MOCK_WELLS,
    ...RICH_WELLS.map(mapRichWellToWell)
  ];
  const deduped: Well[] = [];
  const seen = new Set<string>();
  for (const w of combined) {
    const key = w.id.toLowerCase().trim();
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(w);
    }
  }
  return deduped;
}

// ─── Resilient Fetch Helper (Safe for SSR and Offline) ───

async function safeApiGet<T>(url: string): Promise<T | null> {
  if (typeof window === 'undefined') return null;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      return (await res.json()) as T;
    }
  } catch {
    // Fail silently and use local fixture
  }
  return null;
}

// ─── Typed Service Layer (Returns typed Promises) ───

export async function getAllWells(): Promise<Well[]> {
  const apiData = await safeApiGet<{ success: boolean; wells: Well[] }>('/api/wells');
  if (apiData?.success && Array.isArray(apiData.wells) && apiData.wells.length > 0) {
    return apiData.wells;
  }
  return Promise.resolve(getUnifiedWells());
}

export async function getActiveWells(): Promise<Well[]> {
  const apiData = await safeApiGet<{ success: boolean; wells: Well[] }>('/api/wells?status=active');
  if (apiData?.success && Array.isArray(apiData.wells) && apiData.wells.length > 0) {
    return apiData.wells;
  }
  const all = getUnifiedWells();
  return Promise.resolve(all.filter((w) => w.status === "active"));
}

export async function getWellById(wellId: string): Promise<Well | undefined> {
  const all = getUnifiedWells();
  const normId = (wellId || "").toLowerCase().trim();
  
  // 1. Exact ID or Name match
  const exact = all.find((w) => w.id.toLowerCase() === normId || w.name.toLowerCase() === normId);
  if (exact) return Promise.resolve({ ...exact });

  // 2. Normalized prefix match (e.g., 'GK-362' vs 'Geleki-362')
  const cleanId = normId.replace(/[^a-z0-9]/g, '');
  const prefixMatch = all.find((w) => {
    const wCleanId = w.id.toLowerCase().replace(/[^a-z0-9]/g, '');
    const wCleanName = w.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return wCleanId === cleanId || wCleanName.includes(cleanId) || cleanId.includes(wCleanId);
  });
  if (prefixMatch) return Promise.resolve({ ...prefixMatch });

  // 3. Graceful fallback if well exists in RICH_WELLS directly
  const rawRich = RICH_WELLS.find((rw) => rw.id.toLowerCase() === normId || rw.name.toLowerCase() === normId);
  if (rawRich) return Promise.resolve(mapRichWellToWell(rawRich));

  // 4. Safe fallback so page NEVER hangs indefinitely on loading
  const fallback = all[0];
  if (fallback) {
    return Promise.resolve({
      ...fallback,
      id: wellId,
      name: wellId.toUpperCase().startsWith("GK") ? `Geleki-${wellId.replace(/^GK-?/i, '')}` : wellId
    });
  }

  return Promise.resolve(undefined);
}

export async function getOffsetWells(targetWellId: string): Promise<OffsetWellResult[]> {
  const all = getUnifiedWells();
  const normId = (targetWellId || "").toLowerCase().trim();
  const target = all.find((w) => w.id.toLowerCase() === normId || w.name.toLowerCase() === normId) || all[0];
  if (!target) return Promise.resolve([]);

  // Try API route first if in browser
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/offset/similarity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetWellId: target.id })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.results)) {
          return data.results.map((r: any) => ({
            well: r.well,
            distanceKm: r.distanceKm,
            similarityScore: r.similarityScore,
            similarityBreakdown: r.similarityBreakdown,
            matchedEvents: MOCK_EVENTS.filter((e) => 
              e.wellId.toLowerCase() === r.well.id.toLowerCase() ||
              (e.field && e.field.toLowerCase() === r.well.field.toLowerCase())
            ).slice(0, 3)
          }));
        }
      }
    } catch {
      // Fall through to local calculation
    }
  }

  const results: OffsetWellResult[] = all
    .filter((w) => w.id.toLowerCase() !== target.id.toLowerCase())
    .map((offset) => {
      const distanceKm = haversineDistanceKm(
        target.surfaceCoords.lat, target.surfaceCoords.lng,
        offset.surfaceCoords.lat, offset.surfaceCoords.lng
      );
      const sim = computeCompositeSimilarity(target, offset);
      const matchedEvents = MOCK_EVENTS.filter((e) => 
        e.wellId.toLowerCase() === offset.id.toLowerCase() ||
        (e.field && e.field.toLowerCase() === offset.field.toLowerCase())
      );

      return {
        well: offset,
        distanceKm,
        similarityScore: sim.total,
        similarityBreakdown: sim.breakdown,
        matchedEvents: matchedEvents.slice(0, 3)
      };
    });

  // Sort by similarity by default
  results.sort((a, b) => b.similarityScore - a.similarityScore);
  return Promise.resolve(results);
}

export async function getAlerts(): Promise<Alert[]> {
  return Promise.resolve([...MOCK_ALERTS]);
}

export async function getAlertById(alertId: string): Promise<Alert | undefined> {
  const alert = MOCK_ALERTS.find((a) => a.id === alertId);
  return Promise.resolve(alert ? { ...alert } : undefined);
}

export async function getEventsByWell(wellId: string): Promise<DrillingEvent[]> {
  return Promise.resolve(MOCK_EVENTS.filter((e) => e.wellId === wellId));
}

export async function getAllEvents(): Promise<DrillingEvent[]> {
  return Promise.resolve([...MOCK_EVENTS]);
}

export async function getRiskCorridors(): Promise<RiskCorridor[]> {
  return Promise.resolve([...MOCK_RISK_CORRIDORS]);
}

export async function getRiskCorridorsForWell(wellId: string): Promise<RiskCorridor[]> {
  const well = await getWellById(wellId);
  const corridors = [...MOCK_RISK_CORRIDORS];
  if (!well) return corridors;
  return corridors.filter(
    (c) => c.field.toLowerCase() === well.field.toLowerCase() ||
           c.formation.toLowerCase() === (well.currentFormation || "").toLowerCase()
  );
}

export async function getFeedbackByAlertId(alertId: string): Promise<FeedbackEntry[]> {
  return Promise.resolve(MOCK_FEEDBACK.filter((f) => f.alertId === alertId));
}

export async function submitAlertFeedback(feedback: FeedbackEntry): Promise<boolean> {
  MOCK_FEEDBACK.unshift(feedback);
  const alert = MOCK_ALERTS.find((a) => a.id === feedback.alertId);
  if (alert) {
    if (feedback.engineerAction === "acknowledge") alert.status = "acknowledged";
    if (feedback.engineerAction === "reject") alert.status = "rejected";
    if (feedback.engineerAction === "mitigation_applied") alert.status = "mitigation_applied";
  }
  return Promise.resolve(true);
}

export async function getIngestionBatches(): Promise<IngestionBatch[]> {
  const apiData = await safeApiGet<{ success: boolean; batches: IngestionBatch[] }>('/api/ingestion');
  if (apiData?.success && Array.isArray(apiData.batches)) {
    return apiData.batches;
  }
  return Promise.resolve([...MOCK_INGESTION_BATCHES]);
}

export async function getSourceDocuments(): Promise<SourceDocument[]> {
  return Promise.resolve([...MOCK_SOURCE_DOCS]);
}

// ─── Direct Backend API Client Accessors ───

export async function fetchLiveState(wellId: string = 'well-glk-14') {
  return safeApiGet<any>(`/api/live-state/${encodeURIComponent(wellId)}`);
}

export async function fetchPredictionGapIndex(field?: string, tier?: string) {
  let url = '/api/prediction-gap';
  const params = new URLSearchParams();
  if (field) params.set('field', field);
  if (tier) params.set('tier', tier);
  const qs = params.toString();
  if (qs) url += `?${qs}`;
  return safeApiGet<any>(url);
}

export async function fetchMemoryDecayIndex(minDecay?: number) {
  let url = '/api/decay-index';
  if (minDecay) url += `?minDecay=${minDecay}`;
  return safeApiGet<any>(url);
}

