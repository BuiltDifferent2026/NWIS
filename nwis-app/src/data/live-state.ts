// ─── Live Telemetry Simulation & eRTMAC Bridge Data ───
import { RISK_CORRIDORS, RiskCorridor } from './risk-corridors';
import { getFormationByDepth } from './formations';

export interface ERTMACTelemetry {
  timestamp: string;
  wellId: string;
  wellName: string;
  field: string;
  depthMD: number;
  depthTVD: number;
  rop: number; // m/hr
  wob: number; // klbs
  rpm: number;
  torque: number; // kft-lbs
  standpipePressure: number; // psi
  flowIn: number; // lpm
  flowOutPercent: number; // %
  mudWeightIn: number; // ppg
  mudWeightOut: number; // ppg
  gasUnits: number; // units
  temperatureOut: number; // deg C
  connectionStatus: 'LIVE_STREAMING' | 'INTERMITTENT' | 'OFFLINE';
  latencyMs: number;
  witsmlStreamId: string;
}

export interface ProactiveAlert {
  id: string;
  timestamp: string;
  corridorId: string;
  wellId: string;
  wellName: string;
  currentDepthMD: number;
  targetDepthStart: number;
  distanceToHazardMeters: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  eventType: string;
  eventTitle: string;
  formationName: string;
  confidenceScore: number;
  observedFact: string;
  modelEstimatedRisk: string;
  suggestedMitigation: string;
  cleanPassageEvidence: string;
  offsetWellsCount: number;
  sourceDocsCount: number;
  acknowledged: boolean;
}

export interface MemoryDecayIndex {
  field: string;
  totalLegacyWells: number;
  digitizedPercentage: number;
  paperOnlyPercentage: number;
  scannedUnstructuredPercentage: number;
  atRiskRecordCount: number;
  averageRecordAgeYears: number;
  decayRiskScore: number; // 0-100 (higher = worse knowledge erosion)
  keyVulnerability: string;
}

// Active well simulated telemetry (Approaching Tipam Sandstone loss zone in Geleki)
export const INITIAL_LIVE_TELEMETRY: ERTMACTelemetry = {
  timestamp: new Date().toISOString(),
  wellId: 'well-glk-14',
  wellName: 'Geleki-14 (Active)',
  field: 'Geleki',
  depthMD: 2165.4,
  depthTVD: 2110.2,
  rop: 14.8,
  wob: 16.5,
  rpm: 82,
  torque: 11.2,
  standpipePressure: 2850,
  flowIn: 2450,
  flowOutPercent: 99.4,
  mudWeightIn: 10.2,
  mudWeightOut: 10.2,
  gasUnits: 14,
  temperatureOut: 58.4,
  connectionStatus: 'LIVE_STREAMING',
  latencyMs: 380,
  witsmlStreamId: 'WITSML-ERT-GLK14-RT01'
};

// Institutional Memory Decay Index by field
export const MEMORY_DECAY_INDEX: MemoryDecayIndex[] = [
  {
    field: 'Digboi',
    totalLegacyWells: 1120,
    digitizedPercentage: 24,
    paperOnlyPercentage: 58,
    scannedUnstructuredPercentage: 18,
    atRiskRecordCount: 851,
    averageRecordAgeYears: 54,
    decayRiskScore: 88,
    keyVulnerability: 'Century-old hand-drafted drilling logs deteriorating; key reservoir depleted-zone behavior unindexed.'
  },
  {
    field: 'Geleki',
    totalLegacyWells: 148,
    digitizedPercentage: 46,
    paperOnlyPercentage: 32,
    scannedUnstructuredPercentage: 22,
    atRiskRecordCount: 80,
    averageRecordAgeYears: 32,
    decayRiskScore: 68,
    keyVulnerability: 'Critical Barail high-pressure kick mitigation reports from 1980s stored in scanned paper TIFFs.'
  },
  {
    field: 'Kharsang',
    totalLegacyWells: 82,
    digitizedPercentage: 38,
    paperOnlyPercentage: 44,
    scannedUnstructuredPercentage: 18,
    atRiskRecordCount: 51,
    averageRecordAgeYears: 38,
    decayRiskScore: 76,
    keyVulnerability: 'Tectonic thrust-fault wellbore stability learnings confined to retired drilling superintendent notebooks.'
  },
  {
    field: 'Rudrasagar',
    totalLegacyWells: 96,
    digitizedPercentage: 52,
    paperOnlyPercentage: 28,
    scannedUnstructuredPercentage: 20,
    atRiskRecordCount: 46,
    averageRecordAgeYears: 41,
    decayRiskScore: 62,
    keyVulnerability: 'Eocene Kopili overpressure records scattered across regional archives with inconsistent naming.'
  },
  {
    field: 'Lakwa',
    totalLegacyWells: 190,
    digitizedPercentage: 61,
    paperOnlyPercentage: 21,
    scannedUnstructuredPercentage: 18,
    atRiskRecordCount: 74,
    averageRecordAgeYears: 29,
    decayRiskScore: 51,
    keyVulnerability: 'Tipam pebble-bed drill string vibration post-mortems unmapped to current bit selection workflows.'
  },
  {
    field: 'Pengri-Bardumsha',
    totalLegacyWells: 34,
    digitizedPercentage: 68,
    paperOnlyPercentage: 15,
    scannedUnstructuredPercentage: 17,
    atRiskRecordCount: 11,
    averageRecordAgeYears: 19,
    decayRiskScore: 42,
    keyVulnerability: 'Recent directional trajectory survey deviations require cross-referencing with geological marker shifts.'
  }
];

// Generate proactive alerts based on current depth
export function generateProactiveAlerts(currentDepthMD: number, field: string = 'Geleki'): ProactiveAlert[] {
  const currentFm = getFormationByDepth(currentDepthMD);
  const alerts: ProactiveAlert[] = [];

  for (const corridor of RISK_CORRIDORS) {
    // Check if field matches or if corridor is regional
    if (corridor.field.toLowerCase() !== field.toLowerCase()) continue;

    const [startDepth, endDepth] = corridor.depthRange;
    const distanceToStart = startDepth - currentDepthMD;

    // Trigger if within trigger buffer (e.g. 100m) or inside corridor
    if (distanceToStart <= corridor.triggerBufferMeters && currentDepthMD <= endDepth) {
      const isInside = currentDepthMD >= startDepth;
      const dist = isInside ? 0 : Math.round(distanceToStart * 10) / 10;

      alerts.push({
        id: `alert-${corridor.id}-${Math.floor(currentDepthMD)}`,
        timestamp: new Date().toLocaleTimeString(),
        corridorId: corridor.id,
        wellId: 'well-glk-14',
        wellName: 'Geleki-14',
        currentDepthMD,
        targetDepthStart: startDepth,
        distanceToHazardMeters: dist,
        severity: corridor.severity,
        eventType: corridor.eventType,
        eventTitle: `${corridor.formationName}: ${corridor.eventType.replace('_', ' ').toUpperCase()} HAZARD`,
        formationName: corridor.formationName,
        confidenceScore: corridor.riskScore,
        observedFact: corridor.observedFact,
        modelEstimatedRisk: corridor.modelEstimatedRisk,
        suggestedMitigation: corridor.suggestedMitigation,
        cleanPassageEvidence: `${corridor.cleanPassageCount} offset wells traversed this interval with zero incident after utilizing pre-emptive LCM pills and ECD capping < 10.4 ppg.`,
        offsetWellsCount: corridor.evidenceCount,
        sourceDocsCount: corridor.sourceDocuments.length,
        acknowledged: false
      });
    }
  }

  return alerts;
}
