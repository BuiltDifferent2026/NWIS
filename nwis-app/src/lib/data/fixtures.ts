import {
  Well,
  DrillingEvent,
  RiskCorridor,
  Alert,
  FeedbackEntry,
  IngestionBatch,
  SourceDocument,
  OffsetWellResult
} from './types';

// ─── Realistic Wells (Assam-Arakan Basin, Oil India Limited / ONGC Archive) ───
export const MOCK_WELLS: Well[] = [
  {
    id: "well-glk-14",
    name: "OIL-GLK-14",
    field: "Geleki",
    status: "active",
    surfaceCoords: { lat: 26.9654, lng: 94.7521 },
    spudDate: "2026-07-12",
    currentDepthMD: 2165,
    currentDepthTVD: 2110,
    currentFormation: "Tipam Sandstone",
    trajectoryType: "deviated",
    operator: "Oil India Limited",
    rig: "OIL-E2000-IV",
    totalDepthMD: 3850
  },
  {
    id: "well-dgb-09",
    name: "OIL-DGB-09",
    field: "Digboi",
    status: "active",
    surfaceCoords: { lat: 27.3821, lng: 95.6312 },
    spudDate: "2026-08-01",
    currentDepthMD: 1395,
    currentDepthTVD: 1380,
    currentFormation: "Girujan Clay",
    trajectoryType: "vertical",
    operator: "Oil India Limited",
    rig: "OIL-F1500-II",
    totalDepthMD: 2900
  },
  {
    id: "well-glk-03",
    name: "OIL-GLK-03",
    field: "Geleki",
    status: "completed",
    surfaceCoords: { lat: 26.9588, lng: 94.7465 },
    spudDate: "1988-03-14",
    currentDepthMD: 3420,
    currentDepthTVD: 3380,
    currentFormation: "Barail Group",
    trajectoryType: "deviated",
    operator: "Oil India Limited",
    totalDepthMD: 3420
  },
  {
    id: "well-glk-07",
    name: "OIL-GLK-07",
    field: "Geleki",
    status: "completed",
    surfaceCoords: { lat: 26.9712, lng: 94.7601 },
    spudDate: "1996-09-20",
    currentDepthMD: 3650,
    currentDepthTVD: 3590,
    currentFormation: "Barail Group",
    trajectoryType: "deviated",
    operator: "Oil India Limited",
    totalDepthMD: 3650
  },
  {
    id: "well-glk-11",
    name: "OIL-GLK-11",
    field: "Geleki",
    status: "completed",
    surfaceCoords: { lat: 26.9602, lng: 94.7580 },
    spudDate: "2012-11-04",
    currentDepthMD: 3510,
    currentDepthTVD: 3450,
    currentFormation: "Barail Group",
    trajectoryType: "deviated",
    operator: "Oil India Limited",
    totalDepthMD: 3510
  },
  {
    id: "well-dgb-02",
    name: "OIL-DGB-02",
    field: "Digboi",
    status: "historical",
    surfaceCoords: { lat: 27.3795, lng: 95.6288 },
    spudDate: "1975-04-10",
    currentDepthMD: 2650,
    currentDepthTVD: 2650,
    currentFormation: "Tipam Sandstone",
    trajectoryType: "vertical",
    operator: "Assam Oil Division (AOD)",
    totalDepthMD: 2650
  },
  {
    id: "well-dgb-06",
    name: "OIL-DGB-06",
    field: "Digboi",
    status: "completed",
    surfaceCoords: { lat: 27.3855, lng: 95.6345 },
    spudDate: "1989-10-18",
    currentDepthMD: 2840,
    currentDepthTVD: 2810,
    currentFormation: "Tipam Sandstone",
    trajectoryType: "vertical",
    operator: "Oil India Limited",
    totalDepthMD: 2840
  },
  {
    id: "well-khs-02",
    name: "OIL-KHS-02",
    field: "Kharsang",
    status: "completed",
    surfaceCoords: { lat: 27.2750, lng: 95.9520 },
    spudDate: "1986-06-15",
    currentDepthMD: 3120,
    currentDepthTVD: 3050,
    currentFormation: "Barail Group",
    trajectoryType: "deviated",
    operator: "Oil India Limited",
    totalDepthMD: 3120
  },
  {
    id: "well-khs-04",
    name: "OIL-KHS-04",
    field: "Kharsang",
    status: "completed",
    surfaceCoords: { lat: 27.2810, lng: 95.9580 },
    spudDate: "1998-02-28",
    currentDepthMD: 3280,
    currentDepthTVD: 3210,
    currentFormation: "Barail Group",
    trajectoryType: "deviated",
    operator: "Oil India Limited",
    totalDepthMD: 3280
  },
  {
    id: "well-pbd-01",
    name: "OIL-PBD-01",
    field: "Pengri-Bardumsha",
    status: "completed",
    surfaceCoords: { lat: 27.3100, lng: 95.7400 },
    spudDate: "2005-08-14",
    currentDepthMD: 3750,
    currentDepthTVD: 3680,
    currentFormation: "Barail Group",
    trajectoryType: "horizontal",
    operator: "Oil India Limited",
    totalDepthMD: 3750
  }
];

// ─── Historical Drilling Events (DDR / WCR Archives) ───
export const MOCK_EVENTS: DrillingEvent[] = [
  {
    id: "evt-01",
    wellId: "well-glk-03",
    wellName: "OIL-GLK-03",
    field: "Geleki",
    eventType: "mud_loss",
    formation: "Tipam Sandstone",
    depthInterval: { from: 2210, to: 2245 },
    outcome: "npt_hours_lost",
    nptHours: 28.5,
    mitigationApplied: "Pumped 45 bbl medium-nut-plug LCM pill; capped ECD at 10.3 ppg",
    mitigationSuccess: true,
    narrative: "Encountered total mud loss (32 m³/hr) at 2,215m in Upper Tipam fractured sandstone under 10.9 ppg mud weight.",
    sourceDocument: {
      name: "WCR-GLK-03-1988",
      page: 42,
      confidence: "STRUCTURED-HIGH"
    }
  },
  {
    id: "evt-02",
    wellId: "well-glk-07",
    wellName: "OIL-GLK-07",
    field: "Geleki",
    eventType: "mud_loss",
    formation: "Tipam Sandstone",
    depthInterval: { from: 2260, to: 2295 },
    outcome: "npt_hours_lost",
    nptHours: 34.0,
    mitigationApplied: "Set thixotropic cement plug across 2,260-2,295m interval; re-drilled with 10.1 ppg fluid",
    mitigationSuccess: true,
    narrative: "Severe partial loss turning to total loss at 2,280m MD. Bit dropped 0.4m into sub-seismic micro-fracture zone.",
    sourceDocument: {
      name: "WCR-GLK-07-1996",
      page: 19,
      confidence: "OCR-HIGH"
    }
  },
  {
    id: "evt-03",
    wellId: "well-glk-11",
    wellName: "OIL-GLK-11",
    field: "Geleki",
    eventType: "mud_loss",
    formation: "Tipam Sandstone",
    depthInterval: { from: 2225, to: 2250 },
    outcome: "resolved",
    nptHours: 8.0,
    mitigationApplied: "Pre-treated active pits with 30 ppb mixed fiber LCM before entering interval",
    mitigationSuccess: true,
    narrative: "Minor seepage loss (4 m³/hr) managed with pre-mixed LCM pill without total lost circulation.",
    sourceDocument: {
      name: "DDR-GLK-11-2012",
      page: 104,
      confidence: "OCR-HIGH"
    }
  },
  {
    id: "evt-04",
    wellId: "well-glk-03",
    wellName: "OIL-GLK-03",
    field: "Geleki",
    eventType: "kick_overpressure",
    formation: "Barail Group",
    depthInterval: { from: 2940, to: 2985 },
    outcome: "npt_hours_lost",
    nptHours: 42.0,
    mitigationApplied: "Shut-in well; weighted up mud system from 11.2 to 12.8 ppg via Wait & Weight method",
    mitigationSuccess: true,
    narrative: "Gas influx detected after 4m ROP break at 2,955m MD. Pit gain of 18 bbl within 12 minutes.",
    sourceDocument: {
      name: "WCR-GLK-03-1988",
      page: 78,
      confidence: "STRUCTURED-HIGH"
    }
  },
  {
    id: "evt-05",
    wellId: "well-dgb-02",
    wellName: "OIL-DGB-02",
    field: "Digboi",
    eventType: "stuck_pipe",
    formation: "Girujan Clay",
    depthInterval: { from: 1410, to: 1460 },
    outcome: "npt_hours_lost",
    nptHours: 56.0,
    mitigationApplied: "Spotted pipe-lax soaking solution; jarred down for 14 hours before freeing string",
    mitigationSuccess: true,
    narrative: "Mechanical stuck pipe occurred during connection at 1,420m MD due to reactive smectite clay swelling.",
    sourceDocument: {
      name: "WCR-DGB-02-1975",
      page: 28,
      confidence: "OCR-LOW"
    }
  },
  {
    id: "evt-06",
    wellId: "well-dgb-06",
    wellName: "OIL-DGB-06",
    field: "Digboi",
    eventType: "stuck_pipe",
    formation: "Girujan Clay",
    depthInterval: { from: 1480, to: 1530 },
    outcome: "resolved",
    nptHours: 12.5,
    mitigationApplied: "Controlled ROP to <10 m/hr and raised KCl concentration to 9% with PHPA polymer encapsulation",
    mitigationSuccess: true,
    narrative: "Tight hole encountered on trip at 1,510m. Reamed interval with inhibited polymer fluid.",
    sourceDocument: {
      name: "WCR-DGB-06-1989",
      page: 50,
      confidence: "STRUCTURED-HIGH"
    }
  },
  {
    id: "evt-07",
    wellId: "well-khs-02",
    wellName: "OIL-KHS-02",
    field: "Kharsang",
    eventType: "torque_spike",
    formation: "Girujan Clay",
    depthInterval: { from: 1470, to: 1520 },
    outcome: "resolved",
    nptHours: 16.0,
    mitigationApplied: "Added 2.5% lubricant to mud pit, lowered RPM from 90 to 65",
    mitigationSuccess: true,
    narrative: "Torsional slip-stick vibration in tectonically stressed borehole near Naga thrust fault.",
    sourceDocument: {
      name: "WCR-KHS-02-1986",
      page: 54,
      confidence: "OCR-MEDIUM"
    }
  },
  {
    id: "evt-08",
    wellId: "well-glk-07",
    wellName: "OIL-GLK-07",
    field: "Geleki",
    eventType: "kick_overpressure",
    formation: "Barail Group",
    depthInterval: { from: 2970, to: 3010 },
    outcome: "npt_hours_lost",
    nptHours: 36.0,
    mitigationApplied: "Circulated out influx through choke manifold; weighted system to 12.9 ppg",
    mitigationSuccess: true,
    narrative: "Pore pressure transition from 10.4 ppg to 12.7 ppg over 30m interval. Gas units spiked to 480 units.",
    sourceDocument: {
      name: "WCR-GLK-07-1996",
      page: 89,
      confidence: "OCR-HIGH"
    }
  }
];

// ─── Risk Corridors (Built from offset incidents + DISCONFIRMING evidence) ───
export const MOCK_RISK_CORRIDORS: RiskCorridor[] = [
  {
    id: "corridor-glk-tipam-loss",
    formation: "Tipam Sandstone",
    field: "Geleki",
    eventType: "mud_loss",
    depthInterval: { from: 2180, to: 2340 },
    evidenceCount: 5,
    eventFrequency: 0.62,
    successfulMitigationRate: 0.85,
    disconfirmingWellCount: 4, // 4 wells crossed safely with NO incident
    observedFactSummary: "5 of 9 offset wells in Geleki encountering Upper Tipam sandstone suffered severe lost circulation (12-35 m³/hr) between 2,180m and 2,340m MD.",
    modelRiskSummary: "High probability (62%) of sudden severe mud loss if equivalent circulating density (ECD) exceeds 10.5 ppg in this fractured interval.",
    recommendedMitigation: "Pre-treat active system with 35 ppb mixed-fiber LCM prior to 2,150m MD. Restrict flow rate to cap ECD at 10.3 ppg. Stage high-viscosity pill on standby."
  },
  {
    id: "corridor-glk-barail-kick",
    formation: "Barail Group",
    field: "Geleki",
    eventType: "kick_overpressure",
    depthInterval: { from: 2920, to: 3050 },
    evidenceCount: 4,
    eventFrequency: 0.70,
    successfulMitigationRate: 0.80,
    disconfirmingWellCount: 2, // 2 wells crossed safely
    observedFactSummary: "Pore pressure gradient abruptly steepens from 10.2 ppg to 12.8 ppg equivalent within an 80m vertical span across 4 Geleki offset wells.",
    modelRiskSummary: "High kick probability (70%) upon penetrating Barail coal-sand interface between 2,940m and 3,020m MD.",
    recommendedMitigation: "Increase mud density to 12.5 ppg before drilling past 2,900m. Perform flow checks on any ROP increase >4 m/hr. Record slow pump rates every 50m."
  },
  {
    id: "corridor-dgb-girujan-stuck",
    formation: "Girujan Clay",
    field: "Digboi",
    eventType: "stuck_pipe",
    depthInterval: { from: 1380, to: 1540 },
    evidenceCount: 4,
    eventFrequency: 0.57,
    successfulMitigationRate: 0.75,
    disconfirmingWellCount: 3, // 3 wells crossed safely
    observedFactSummary: "Reactive smectite clay beds caused mechanical pipe sticking during tripping on 4 Digboi wells between 1,380m and 1,540m MD.",
    modelRiskSummary: "Moderate-to-high pack-off risk (57%) if mud filtrate loss exceeds 6 ml/30min or potassium chloride drops below 7%.",
    recommendedMitigation: "Maintain 8-10% KCl with PHPA polymer encapsulation. Conduct short wiper trips every 90m drilled. Limit pipe stationary time to under 3 minutes."
  },
  {
    id: "corridor-khs-girujan-torque",
    formation: "Girujan Clay",
    field: "Kharsang",
    eventType: "torque_spike",
    depthInterval: { from: 1450, to: 1600 },
    evidenceCount: 3,
    eventFrequency: 0.50,
    successfulMitigationRate: 0.90,
    disconfirmingWellCount: 3, // 3 wells crossed safely
    observedFactSummary: "Tectonic compressive stress adjacent to the Naga Thrust fault caused severe borehole breakout and torque oscillations exceeding 16 kft-lbs.",
    modelRiskSummary: "Moderate risk (50%) of MWD pulser signal loss and bit damage if rotary speed exceeds 80 RPM.",
    recommendedMitigation: "Deploy anti-stall tool in BHA. Add 2.5% lubricating agent. Limit RPM to 55-70 with WOB capped under 18 klbs."
  }
];

// ─── Proactive Alerts (Fact / Estimate / Recommendation separation) ───
export const MOCK_ALERTS: Alert[] = [
  {
    id: "alert-glk14-tipam-loss",
    wellId: "well-glk-14",
    corridorId: "corridor-glk-tipam-loss",
    firedAt: "2026-09-15 00:45 UTC",
    currentDepth: 2165.0,
    riskLevel: "high",
    status: "new",
    fact: "5 of 9 offset wells in Geleki field (including OIL-GLK-03 at 2,215m and OIL-GLK-07 at 2,280m) encountered total lost circulation exceeding 25 m³/hr between 2,180m and 2,340m MD in the Upper Tipam Sandstone. (Source: WCR-GLK-03-1988/p42 [STRUCTURED-HIGH]; WCR-GLK-07-1996/p19 [OCR-HIGH]).",
    estimate: "StrataSense correlation model estimates a 62% probability of severe fluid loss beginning within 15 meters of current bit depth (2,165m MD), driven by unsealed tectonic micro-fractures under ECD > 10.5 ppg.",
    recommendation: "Pre-treat active mud system with 35 ppb coarse/medium mixed-fiber LCM pill prior to passing 2,175m MD. Restrict pump rate to keep ECD below 10.3 ppg. Stage LCM squeezer on deck.",
    disconfirmingEvidence: "4 offset wells (including OIL-GLK-11 and OIL-GLK-09) successfully traversed this exact depth interval with ZERO mud loss by proactively capping ECD at 10.2 ppg and pre-treating with 30 ppb fiber LCM.",
    matchedOffsetWells: [
      {
        well: MOCK_WELLS.find((w) => w.id === "well-glk-03")!,
        distanceKm: 0.9,
        similarityScore: 0.88,
        similarityBreakdown: {
          formationMatch: 0.95,
          depthAlignment: 0.92,
          trajectorySimilarity: 0.85,
          operationalParamSimilarity: 0.82,
          geographicProximity: 0.98
        },
        matchedEvents: [MOCK_EVENTS.find((e) => e.id === "evt-01")!]
      },
      {
        well: MOCK_WELLS.find((w) => w.id === "well-glk-07")!,
        distanceKm: 1.1,
        similarityScore: 0.84,
        similarityBreakdown: {
          formationMatch: 0.95,
          depthAlignment: 0.86,
          trajectorySimilarity: 0.82,
          operationalParamSimilarity: 0.80,
          geographicProximity: 0.95
        },
        matchedEvents: [MOCK_EVENTS.find((e) => e.id === "evt-02")!]
      },
      {
        well: MOCK_WELLS.find((w) => w.id === "well-glk-11")!,
        distanceKm: 0.8,
        similarityScore: 0.82,
        similarityBreakdown: {
          formationMatch: 0.90,
          depthAlignment: 0.88,
          trajectorySimilarity: 0.80,
          operationalParamSimilarity: 0.85,
          geographicProximity: 0.99
        },
        matchedEvents: [MOCK_EVENTS.find((e) => e.id === "evt-03")!]
      }
    ]
  },
  {
    id: "alert-dgb09-girujan-stuck",
    wellId: "well-dgb-09",
    corridorId: "corridor-dgb-girujan-stuck",
    firedAt: "2026-09-14 22:15 UTC",
    currentDepth: 1395.0,
    riskLevel: "moderate",
    status: "new",
    fact: "4 offset wells in Digboi field (including OIL-DGB-02 at 1,420m) suffered differential and mechanical stuck pipe in the Girujan Clay seal between 1,380m and 1,540m MD, causing an aggregate 84.5 NPT hours. (Source: WCR-DGB-02-1975/p28 [OCR-LOW]; WCR-DGB-06-1989/p50 [STRUCTURED-HIGH]).",
    estimate: "Model estimates a 57% likelihood of tight hole or pipe pack-off upon reaching 1,410m MD if potassium ion concentration in the water-based mud remains below 8%.",
    recommendation: "Increase KCl concentration to 8-10% with PHPA polymer encapsulation. Conduct a 5-stand wiper trip every 90m drilled. Limit pipe stationary time during connections to <3 minutes.",
    disconfirmingEvidence: "3 offset wells (including OIL-DGB-06) drilled through Girujan clay without sticking after maintaining 9% KCl and performing short wiper trips.",
    matchedOffsetWells: [
      {
        well: MOCK_WELLS.find((w) => w.id === "well-dgb-02")!,
        distanceKm: 0.4,
        similarityScore: 0.79,
        similarityBreakdown: {
          formationMatch: 0.85,
          depthAlignment: 0.80,
          trajectorySimilarity: 0.90,
          operationalParamSimilarity: 0.65,
          geographicProximity: 0.98
        },
        matchedEvents: [MOCK_EVENTS.find((e) => e.id === "evt-05")!]
      },
      {
        well: MOCK_WELLS.find((w) => w.id === "well-dgb-06")!,
        distanceKm: 0.5,
        similarityScore: 0.83,
        similarityBreakdown: {
          formationMatch: 0.90,
          depthAlignment: 0.85,
          trajectorySimilarity: 0.90,
          operationalParamSimilarity: 0.75,
          geographicProximity: 0.96
        },
        matchedEvents: [MOCK_EVENTS.find((e) => e.id === "evt-06")!]
      }
    ]
  },
  {
    id: "alert-glk14-barail-kick-lookahead",
    wellId: "well-glk-14",
    corridorId: "corridor-glk-barail-kick",
    firedAt: "2026-09-14 18:00 UTC",
    currentDepth: 2165.0,
    riskLevel: "low",
    status: "acknowledged",
    fact: "4 offset wells entering the Barail Group between 2,920m and 3,050m MD encountered sharp pore pressure ramp from 10.2 ppg to 12.8 ppg equivalent. (Source: WCR-GLK-03-1988/p78 [STRUCTURED-HIGH]).",
    estimate: "Longer-range lookahead advisory: Barail overpressure horizon will be reached at approximately 2,940m MD. Severe kick risk (70%) if mud weight is not pre-conditioned before 2,900m.",
    recommendation: "Verify barite inventory on rig site (minimum 120 MT). Schedule intermediate casing shoe leak-off test (LOT) at Barail boundary.",
    disconfirmingEvidence: "2 offset wells drilled through Barail with no influx by proactively weighting mud to 12.6 ppg ahead of target depth.",
    matchedOffsetWells: [
      {
        well: MOCK_WELLS.find((w) => w.id === "well-glk-03")!,
        distanceKm: 0.9,
        similarityScore: 0.88,
        similarityBreakdown: {
          formationMatch: 0.95,
          depthAlignment: 0.92,
          trajectorySimilarity: 0.85,
          operationalParamSimilarity: 0.82,
          geographicProximity: 0.98
        },
        matchedEvents: [MOCK_EVENTS.find((e) => e.id === "evt-04")!]
      }
    ]
  }
];

// ─── Initial Mock Feedback History ───
export const MOCK_FEEDBACK: FeedbackEntry[] = [
  {
    alertId: "alert-glk14-barail-kick-lookahead",
    engineerAction: "acknowledge",
    note: "Reviewed in morning operations call. Barite inventory verified at 145 MT on rig site.",
    timestamp: "2026-09-14 19:30 UTC",
    userRole: "field_engineer"
  }
];

// ─── Admin: Ingestion Pipeline Batches ───
export const MOCK_INGESTION_BATCHES: IngestionBatch[] = [
  {
    id: "batch-2026-08",
    batchName: "Geleki Field Legacy DDR Ingestion (1990-2015)",
    sourceType: "ocr_ddr",
    ingestionDate: "2026-08-22",
    totalDocuments: 248,
    extractedEventsCount: 64,
    confidenceDistribution: {
      structuredHigh: 38,
      ocrHigh: 112,
      ocrMedium: 65,
      ocrLow: 24,
      manualReview: 9
    },
    status: "completed"
  },
  {
    id: "batch-2026-07",
    batchName: "Digboi Well Completion Reports (1970-1995)",
    sourceType: "ocr_wcr",
    ingestionDate: "2026-07-15",
    totalDocuments: 180,
    extractedEventsCount: 42,
    confidenceDistribution: {
      structuredHigh: 15,
      ocrHigh: 72,
      ocrMedium: 58,
      ocrLow: 25,
      manualReview: 10
    },
    status: "completed"
  },
  {
    id: "batch-2026-09",
    batchName: "Kharsang & Pengri Mud Logs (2000-2020)",
    sourceType: "mud_log",
    ingestionDate: "2026-09-02",
    totalDocuments: 94,
    extractedEventsCount: 18,
    confidenceDistribution: {
      structuredHigh: 45,
      ocrHigh: 32,
      ocrMedium: 12,
      ocrLow: 4,
      manualReview: 1
    },
    status: "completed"
  }
];

// ─── Admin: Source Document Register ───
export const MOCK_SOURCE_DOCS: SourceDocument[] = [
  {
    id: "src-01",
    documentName: "WCR-GLK-03-1988",
    documentType: "Well Completion Report (WCR)",
    wellName: "OIL-GLK-03",
    field: "Geleki",
    dateRange: "1988-01-12 to 1988-06-20",
    pageCount: 128,
    ingestionConfidence: "STRUCTURED-HIGH",
    extractedEventsCount: 8,
    archiveReference: "OIL-DULIAJAN-ARCHIVE-BOX-412/A"
  },
  {
    id: "src-02",
    documentName: "WCR-GLK-07-1996",
    documentType: "Well Completion Report (WCR)",
    wellName: "OIL-GLK-07",
    field: "Geleki",
    dateRange: "1996-08-04 to 1997-01-15",
    pageCount: 142,
    ingestionConfidence: "OCR-HIGH",
    extractedEventsCount: 6,
    archiveReference: "OIL-DULIAJAN-ARCHIVE-BOX-438/C"
  },
  {
    id: "src-03",
    documentName: "DDR-GLK-11-2012",
    documentType: "Daily Drilling Report (DDR)",
    wellName: "OIL-GLK-11",
    field: "Geleki",
    dateRange: "2012-11-04 to 2013-03-10",
    pageCount: 196,
    ingestionConfidence: "OCR-HIGH",
    extractedEventsCount: 5,
    archiveReference: "OIL-DULIAJAN-DIGITAL-SCAN-GLK11"
  },
  {
    id: "src-04",
    documentName: "WCR-DGB-02-1975",
    documentType: "Well Completion Report (WCR)",
    wellName: "OIL-DGB-02",
    field: "Digboi",
    dateRange: "1975-03-01 to 1975-08-14",
    pageCount: 86,
    ingestionConfidence: "OCR-LOW",
    extractedEventsCount: 4,
    archiveReference: "AOD-DIGBOI-HIST-BOX-12"
  },
  {
    id: "src-05",
    documentName: "WCR-DGB-06-1989",
    documentType: "Well Completion Report (WCR)",
    wellName: "OIL-DGB-06",
    field: "Digboi",
    dateRange: "1989-09-10 to 1990-02-18",
    pageCount: 110,
    ingestionConfidence: "STRUCTURED-HIGH",
    extractedEventsCount: 7,
    archiveReference: "OIL-DULIAJAN-ARCHIVE-BOX-420/B"
  },
  {
    id: "src-06",
    documentName: "WCR-KHS-02-1986",
    documentType: "Well Completion Report (WCR)",
    wellName: "OIL-KHS-02",
    field: "Kharsang",
    dateRange: "1986-05-18 to 1986-11-30",
    pageCount: 98,
    ingestionConfidence: "OCR-MEDIUM",
    extractedEventsCount: 5,
    archiveReference: "OIL-KHS-OPS-RECORDS-86"
  }
];
