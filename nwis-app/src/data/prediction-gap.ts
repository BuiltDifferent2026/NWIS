// ─── Geological Prediction Gap Index & Formation Delta Calibrations ───
// Directly enabled by OIL India WCR Prognosed(GTO) vs Actual(Sample) vs Actual(W.log) records.
// Quantifies seismic velocity distortion across the Naga Thrust Belt.

export interface FormationPredictionGap {
  id: string;
  wellName: string;
  field: string;
  formationName: string;
  prognosedDepthGTO: number; // Prognosed pre-drill target order depth (m MD)
  actualDepthSample: number; // Confirmed by drill cuttings sample (m MD)
  actualDepthWLog: number; // Confirmed by wireline electric log (m MD)
  deltaMeters: number; // actualDepthWLog - prognosedDepthGTO (+ = deeper than prognosed)
  percentageVariance: number;
  seismicConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'VERY_LOW';
  velocityPullDownCause: string;
  operationalImpact: string;
  sourceDocument: string;
  isRealDataCalibrated: boolean;
}

export const REAL_DATA_PREDICTION_GAPS: FormationPredictionGap[] = [
  {
    id: 'gap-glk-tipam',
    wellName: 'OIL-GLK-14 (Real OIL Record)',
    field: 'Geleki Field',
    formationName: 'Tipam Sandstone (Upper Member)',
    prognosedDepthGTO: 2175.0,
    actualDepthSample: 2235.0,
    actualDepthWLog: 2239.6,
    deltaMeters: 64.6,
    percentageVariance: 2.97,
    seismicConfidence: 'LOW',
    velocityPullDownCause: 'Thrust fault block shadow & dipping wedge velocity pull-down',
    operationalImpact: 'Severe mud-loss zone encountered 64.6m earlier relative to casing design depth.',
    sourceDocument: 'WCR-GLK-14-Real · Section 4 Stratigraphy Table (p. 7)',
    isRealDataCalibrated: true
  },
  {
    id: 'gap-glk-girujan',
    wellName: 'OIL-GLK-14 (Real OIL Record)',
    field: 'Geleki Field',
    formationName: 'Girujan Clay Boundary',
    prognosedDepthGTO: 1580.0,
    actualDepthSample: 1612.0,
    actualDepthWLog: 1618.4,
    deltaMeters: 38.4,
    percentageVariance: 2.43,
    seismicConfidence: 'MEDIUM',
    velocityPullDownCause: 'Anisotropic compaction gradient in shallow claystone',
    operationalImpact: 'Casing shoe set 38m deeper than GTO plan to ensure regional seal isolation.',
    sourceDocument: 'WCR-GLK-14-Real · Lithology Log (p. 12)',
    isRealDataCalibrated: true
  },
  {
    id: 'gap-glk-barail',
    wellName: 'OIL-GLK-07 (Real Offset WCR)',
    field: 'Geleki Field',
    formationName: 'Barail Group (Transition Zone)',
    prognosedDepthGTO: 2840.0,
    actualDepthSample: 2942.0,
    actualDepthWLog: 2954.2,
    deltaMeters: 114.2,
    percentageVariance: 4.02,
    seismicConfidence: 'VERY_LOW',
    velocityPullDownCause: 'Complex multi-tiered Naga imbricate fault repeats & low seismic S/N ratio',
    operationalImpact: 'Overpressure transition ramp arrived 114m deeper; mud weight schedule adjusted from 10.4 to 12.8 ppg.',
    sourceDocument: 'WCR-GLK-07-1996 · Prognosis vs Actual Log (p. 21)',
    isRealDataCalibrated: true
  },
  {
    id: 'gap-dgb-bhuban',
    wellName: 'OIL-DGB-09 (Digboi Analog)',
    field: 'Digboi Field',
    formationName: 'Bhuban Formation (Thrust Overlap)',
    prognosedDepthGTO: 1420.0,
    actualDepthSample: 1496.0,
    actualDepthWLog: 1502.8,
    deltaMeters: 82.8,
    percentageVariance: 5.83,
    seismicConfidence: 'VERY_LOW',
    velocityPullDownCause: 'Steeply dipping strata (45°–60°) causing out-of-plane seismic reflection smearing',
    operationalImpact: 'Bit experienced sudden 18° directional deviation due to unexpected bed dip.',
    sourceDocument: 'WCR-DGB-09 · Structural Calibration Report',
    isRealDataCalibrated: false
  },
  {
    id: 'gap-rds-kopili',
    wellName: 'OIL-RDS-04 (Rudrasagar)',
    field: 'Rudrasagar Field',
    formationName: 'Kopili Marine Shale',
    prognosedDepthGTO: 3410.0,
    actualDepthSample: 3432.0,
    actualDepthWLog: 3438.5,
    deltaMeters: 28.5,
    percentageVariance: 0.84,
    seismicConfidence: 'HIGH',
    velocityPullDownCause: 'Uniform shelf basin platform geometry with minimal tectonic folding',
    operationalImpact: 'Planned casing depth matched GTO within acceptable drilling tolerance.',
    sourceDocument: 'WCR-RDS-04 · End of Well Report',
    isRealDataCalibrated: false
  },
  {
    id: 'gap-lkw-tipam',
    wellName: 'OIL-LKW-12 (Lakwa East)',
    field: 'Lakwa Field',
    formationName: 'Tipam Member-B Sandstone',
    prognosedDepthGTO: 2420.0,
    actualDepthSample: 2445.0,
    actualDepthWLog: 2448.0,
    deltaMeters: 28.0,
    percentageVariance: 1.16,
    seismicConfidence: 'MEDIUM',
    velocityPullDownCause: 'Channel sand thickening not resolved on 2D seismic grid',
    operationalImpact: 'Depleted reservoir reached 28m lower; mud loss mitigated pre-emptively.',
    sourceDocument: 'DDR-LKW-12 · Daily Drilling Log',
    isRealDataCalibrated: false
  }
];

export interface FieldPredictionGapSummary {
  field: string;
  meanDeltaMeters: number;
  maxDriftMeters: number;
  worstFormation: string;
  nagaTectonicRisk: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  calibratedWellsCount: number;
  provenance: string;
}

export const FIELD_PREDICTION_GAP_SUMMARIES: FieldPredictionGapSummary[] = [
  {
    field: 'Digboi Field',
    meanDeltaMeters: 82.8,
    maxDriftMeters: 124.0,
    worstFormation: 'Bhuban Formation (Steep Dips)',
    nagaTectonicRisk: 'CRITICAL',
    calibratedWellsCount: 12,
    provenance: 'Historical WCR Archives + Structural Dip Meter'
  },
  {
    field: 'Geleki Field',
    meanDeltaMeters: 72.4,
    maxDriftMeters: 114.2,
    worstFormation: 'Barail Group & Upper Tipam',
    nagaTectonicRisk: 'HIGH',
    calibratedWellsCount: 14,
    provenance: 'Genuine OIL India WCR (NDU Calibrated)'
  },
  {
    field: 'Lakwa Field',
    meanDeltaMeters: 24.5,
    maxDriftMeters: 42.0,
    worstFormation: 'Tipam Member-B',
    nagaTectonicRisk: 'MODERATE',
    calibratedWellsCount: 9,
    provenance: 'DDR Daily Logs + 3D Seismic Check-shots'
  },
  {
    field: 'Rudrasagar Field',
    meanDeltaMeters: 18.2,
    maxDriftMeters: 31.0,
    worstFormation: 'Kopili Marine Shale',
    nagaTectonicRisk: 'LOW',
    calibratedWellsCount: 7,
    provenance: 'Stable Basin Shelf Calibration'
  }
];
