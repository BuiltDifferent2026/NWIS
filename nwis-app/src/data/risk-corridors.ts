// ─── Risk Corridors Data (Geological & Depth-Aware Corridors) ───
import { EventType, Severity, ConfidenceLevel } from './events';

export interface RiskCorridor {
  id: string;
  field: string;
  formationId: string;
  formationName: string;
  depthRange: [number, number]; // [minMD, maxMD]
  eventType: EventType;
  severity: Severity;
  riskScore: number; // 0 to 100
  eventFrequency: number; // percentage, e.g. 57%
  evidenceCount: number; // Number of offset wells with incidents
  cleanPassageCount: number; // Offset wells that traversed safely
  avgNptHours: number;
  totalHistoricalLossUSD?: number;
  observedFact: string;
  modelEstimatedRisk: string;
  suggestedMitigation: string;
  recommendedMudWeightRange: [number, number]; // ppg
  sourceDocuments: {
    wcrRef: string;
    wellName: string;
    incidentDepth: number;
    confidence: ConfidenceLevel;
  }[];
  triggerBufferMeters: number; // e.g. alert triggers 50-100m before depthRange[0]
}

export const RISK_CORRIDORS: RiskCorridor[] = [
  {
    id: 'rc-geleki-tipam-loss',
    field: 'Geleki',
    formationId: 'tipam',
    formationName: 'Tipam Sandstone',
    depthRange: [2180, 2350],
    eventType: 'mud_loss',
    severity: 'high',
    riskScore: 78,
    eventFrequency: 62,
    evidenceCount: 5,
    cleanPassageCount: 3,
    avgNptHours: 28.4,
    totalHistoricalLossUSD: 420000,
    observedFact: '5 of 8 offset wells in Geleki encountering Upper Tipam sandstones experienced severe lost circulation (12–35 m³/hr) between 2,180m and 2,350m MD.',
    modelEstimatedRisk: 'High risk (78%) of total loss within sub-interval 2,210m–2,290m due to unsealed micro-fractures under excessive equivalent circulating density (ECD > 10.8 ppg).',
    suggestedMitigation: 'Pre-treat active system with 35 ppb mixed-fiber LCM prior to 2,150m MD. Cap ECD at 10.4 ppg. Stage LCM pills on stand-by with cement squeezer on deck.',
    recommendedMudWeightRange: [9.8, 10.3],
    sourceDocuments: [
      { wcrRef: 'WCR-GLK-03-1988/p42', wellName: 'Geleki-03', incidentDepth: 2215, confidence: 'STRUCTURED-HIGH' },
      { wcrRef: 'WCR-GLK-07-1996/p19', wellName: 'Geleki-07', incidentDepth: 2280, confidence: 'OCR-HIGH' },
      { wcrRef: 'DDR-GLK-11-2012/p104', wellName: 'Geleki-11', incidentDepth: 2235, confidence: 'OCR-HIGH' },
      { wcrRef: 'WCR-GLK-09-2004/p61', wellName: 'Geleki-09', incidentDepth: 2310, confidence: 'OCR-MEDIUM' },
      { wcrRef: 'DDR-GLK-02-1981/p15', wellName: 'Geleki-02', incidentDepth: 2195, confidence: 'OCR-LOW' }
    ],
    triggerBufferMeters: 75
  },
  {
    id: 'rc-geleki-barail-kick',
    field: 'Geleki',
    formationId: 'barail',
    formationName: 'Barail Group',
    depthRange: [2920, 3110],
    eventType: 'kick',
    severity: 'critical',
    riskScore: 89,
    eventFrequency: 71,
    evidenceCount: 6,
    cleanPassageCount: 2,
    avgNptHours: 54.2,
    totalHistoricalLossUSD: 890000,
    observedFact: 'Barail transition zone exhibits pore pressure ramp from 10.2 ppg equivalent to 13.1 ppg within 80m vertical span across 6 offset wells.',
    modelEstimatedRisk: 'Critical kick probability (89%) upon penetrating Barail coal-sand interfaces between 2,940m and 3,020m MD. Kick intensity historically exceeded 25 bbl/hr influx.',
    suggestedMitigation: 'Increase mud weight to 12.6 ppg before drilling past 2,900m. Establish slow pump rates (SPR) every 50m. Conduct flow check upon 5m/hr ROP break.',
    recommendedMudWeightRange: [12.4, 13.0],
    sourceDocuments: [
      { wcrRef: 'WCR-GLK-04-1991/p78', wellName: 'Geleki-04', incidentDepth: 2955, confidence: 'STRUCTURED-HIGH' },
      { wcrRef: 'WCR-GLK-08-1999/p33', wellName: 'Geleki-08', incidentDepth: 2980, confidence: 'OCR-HIGH' },
      { wcrRef: 'DDR-GLK-12-2015/p89', wellName: 'Geleki-12', incidentDepth: 3012, confidence: 'STRUCTURED-HIGH' }
    ],
    triggerBufferMeters: 100
  },
  {
    id: 'rc-digboi-girujan-swelling',
    field: 'Digboi',
    formationId: 'girujan',
    formationName: 'Girujan Clay',
    depthRange: [1350, 1620],
    eventType: 'stuck_pipe',
    severity: 'high',
    riskScore: 74,
    eventFrequency: 55,
    evidenceCount: 4,
    cleanPassageCount: 3,
    avgNptHours: 36.5,
    totalHistoricalLossUSD: 360000,
    observedFact: 'Reactive smectite clays in Girujan formation caused severe tight hole and mechanical stuck pipe during tripping on 4 Digboi wells.',
    modelEstimatedRisk: 'Elevated risk (74%) of pack-off and mechanical sticking if mud water-loss exceeds 6 ml/30min or potassium chloride concentration drops below 7%.',
    suggestedMitigation: 'Maintain KCl concentration at 8–10% with PHPA polymer encapsulation. Perform short wiper trips every 120m drilled. Limit stationary time to <3 minutes.',
    recommendedMudWeightRange: [10.2, 10.6],
    sourceDocuments: [
      { wcrRef: 'WCR-DGB-02-1975/p28', wellName: 'Digboi-02', incidentDepth: 1420, confidence: 'OCR-MEDIUM' },
      { wcrRef: 'WCR-DGB-06-1989/p50', wellName: 'Digboi-06', incidentDepth: 1510, confidence: 'STRUCTURED-HIGH' },
      { wcrRef: 'DDR-DGB-10-2008/p64', wellName: 'Digboi-10', incidentDepth: 1485, confidence: 'OCR-HIGH' }
    ],
    triggerBufferMeters: 60
  },
  {
    id: 'rc-rudrasagar-kopili-overpressure',
    field: 'Rudrasagar',
    formationId: 'kopili',
    formationName: 'Kopili Formation',
    depthRange: [3520, 3780],
    eventType: 'overpressure',
    severity: 'critical',
    riskScore: 92,
    eventFrequency: 80,
    evidenceCount: 5,
    cleanPassageCount: 1,
    avgNptHours: 72.0,
    totalHistoricalLossUSD: 1250000,
    observedFact: 'Overpressured Kopili marine shale encountered at 3,540m–3,750m in 5 Rudrasagar wells, resulting in shale sloughing and casing collapse risk.',
    modelEstimatedRisk: 'Severe overpressure risk (92%) with pore pressure gradient reaching 0.72 psi/ft (13.8 ppg equivalent). Hole collapse imminent without chemical stabilization.',
    suggestedMitigation: 'Set 9-5/8" casing shoe firmly in lower Barail before penetrating Kopili top. Raise mud weight to 13.6 ppg with glycol anti-sloughing agent.',
    recommendedMudWeightRange: [13.4, 13.9],
    sourceDocuments: [
      { wcrRef: 'WCR-RDS-01-1972/p67', wellName: 'Rudrasagar-01', incidentDepth: 3560, confidence: 'OCR-LOW' },
      { wcrRef: 'WCR-RDS-04-1985/p91', wellName: 'Rudrasagar-04', incidentDepth: 3620, confidence: 'STRUCTURED-HIGH' },
      { wcrRef: 'DDR-RDS-07-2001/p112', wellName: 'Rudrasagar-07', incidentDepth: 3690, confidence: 'OCR-HIGH' }
    ],
    triggerBufferMeters: 80
  },
  {
    id: 'rc-lakwa-tipam-torque',
    field: 'Lakwa',
    formationId: 'tipam',
    formationName: 'Tipam Sandstone',
    depthRange: [2380, 2550],
    eventType: 'torque_spike',
    severity: 'medium',
    riskScore: 65,
    eventFrequency: 48,
    evidenceCount: 4,
    cleanPassageCount: 4,
    avgNptHours: 16.8,
    totalHistoricalLossUSD: 180000,
    observedFact: 'Abrasive interbedded chert and quartz pebbles in Lower Tipam caused severe slip-stick and torsional vibrations exceeding 18 kft-lbs.',
    modelEstimatedRisk: 'Moderate risk (65%) of bit ring-out, MWD pulser failure, and BHA connection damage if rotary speed exceeds 90 RPM.',
    suggestedMitigation: 'Deploy anti-stall tool (AST) in BHA. Add 2.5% liquid lubricant to active pit. Maintain rotary speed between 55–70 RPM with WOB < 18 klbs.',
    recommendedMudWeightRange: [9.9, 10.4],
    sourceDocuments: [
      { wcrRef: 'WCR-LKW-03-1984/p39', wellName: 'Lakwa-03', incidentDepth: 2410, confidence: 'OCR-MEDIUM' },
      { wcrRef: 'DDR-LKW-08-2009/p88', wellName: 'Lakwa-08', incidentDepth: 2475, confidence: 'STRUCTURED-HIGH' }
    ],
    triggerBufferMeters: 50
  },
  {
    id: 'rc-kharsang-girujan-tight-hole',
    field: 'Kharsang',
    formationId: 'girujan',
    formationName: 'Girujan Clay',
    depthRange: [1420, 1680],
    eventType: 'wellbore_instability',
    severity: 'high',
    riskScore: 82,
    eventFrequency: 67,
    evidenceCount: 4,
    cleanPassageCount: 2,
    avgNptHours: 41.2,
    totalHistoricalLossUSD: 510000,
    observedFact: 'Sub-thrust tectonic stress regime in Kharsang causes anisotropic borehole breakout and tight hole during connections across 4 offset wells.',
    modelEstimatedRisk: 'High instability risk (82%) under tectonic compressive stress. Caliper logs from offset Kharsang-02 and 04 show hole enlargement up to 14.5" in 8.5" hole.',
    suggestedMitigation: 'Elevate mud density by 0.5 ppg over pore pressure to provide mechanical hoop support. Back-ream all connections through 1,400–1,680m interval.',
    recommendedMudWeightRange: [11.0, 11.5],
    sourceDocuments: [
      { wcrRef: 'WCR-KHS-02-1986/p54', wellName: 'Kharsang-02', incidentDepth: 1490, confidence: 'STRUCTURED-HIGH' },
      { wcrRef: 'WCR-KHS-04-1998/p76', wellName: 'Kharsang-04', incidentDepth: 1560, confidence: 'OCR-HIGH' }
    ],
    triggerBufferMeters: 70
  }
];

export function getRiskCorridorsByFormation(formationId: string): RiskCorridor[] {
  return RISK_CORRIDORS.filter(rc => rc.formationId === formationId);
}

export function getRiskCorridorsByField(field: string): RiskCorridor[] {
  return RISK_CORRIDORS.filter(rc => rc.field.toLowerCase() === field.toLowerCase());
}

export function getCorridorsNearDepth(depthMD: number, bufferMeters: number = 100): RiskCorridor[] {
  return RISK_CORRIDORS.filter(rc => {
    const minD = rc.depthRange[0] - bufferMeters;
    const maxD = rc.depthRange[1];
    return depthMD >= minD && depthMD <= maxD;
  });
}
