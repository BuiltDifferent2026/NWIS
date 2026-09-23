import { NextRequest, NextResponse } from 'next/server';
import { 
  REAL_DATA_PREDICTION_GAPS, 
  FIELD_PREDICTION_GAP_SUMMARIES 
} from '@/data/prediction-gap';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const field = searchParams.get('field');
    const tier = searchParams.get('tier');

    let items = REAL_DATA_PREDICTION_GAPS;

    if (field && field !== 'all') {
      items = items.filter(g => g.field.toLowerCase().includes(field.toLowerCase()));
    }

    if (tier && tier !== 'all') {
      items = items.filter(g => g.seismicConfidence.toLowerCase() === tier.toLowerCase());
    }

    const meanDeltaMeters = items.length > 0
      ? Math.round((items.reduce((acc, g) => acc + Math.abs(g.deltaMeters), 0) / items.length) * 10) / 10
      : 0;

    const maxDeltaMeters = items.length > 0
      ? Math.max(...items.map(g => Math.abs(g.deltaMeters)))
      : 0;

    return NextResponse.json({
      success: true,
      metadata: {
        totalRecords: items.length,
        meanDeltaMeters,
        maxDeltaMeters,
        basinGeologicalRegime: "Naga Thrust & Fold Belt",
        velocityDistortionSummary: "Seismic shadow pull-down from steep dip angle wedge structures"
      },
      fieldSummaries: FIELD_PREDICTION_GAP_SUMMARIES,
      predictionGaps: items
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to compute prediction gap index' },
      { status: 500 }
    );
  }
}
