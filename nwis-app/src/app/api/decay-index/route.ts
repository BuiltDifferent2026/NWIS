import { NextRequest, NextResponse } from 'next/server';
import { MEMORY_DECAY_INDEX } from '@/data/live-state';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const minDecay = searchParams.get('minDecay');

    let fields = [...MEMORY_DECAY_INDEX];

    if (minDecay) {
      const threshold = Number(minDecay);
      fields = fields.filter(f => f.decayRiskScore >= threshold);
    }

    // Sort descending by decayRiskScore
    fields.sort((a, b) => b.decayRiskScore - a.decayRiskScore);

    const totalRecordsAtRisk = fields.reduce((acc, f) => acc + (f.atRiskRecordCount || 0), 0);
    const avgDecayScore = Math.round(
      fields.reduce((acc, f) => acc + f.decayRiskScore, 0) / (fields.length || 1)
    );

    return NextResponse.json({
      success: true,
      metadata: {
        totalFieldsAssessed: fields.length,
        averageDecayScore: avgDecayScore,
        highestRiskField: fields[0]?.field || 'Digboi',
        totalPhysicalRecordsAtRisk: totalRecordsAtRisk,
        formula: "DecayScore = 0.45 * PreDigitalRatio + 0.30 * RecordAgeYears + 0.25 * ActiveEngineerGap"
      },
      fields
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve memory decay index' },
      { status: 500 }
    );
  }
}
