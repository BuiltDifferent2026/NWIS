// ─── StrataSense / eRTMAC-NWIS Type Definitions ───

export type UserRole = "field_engineer" | "operations_manager" | "admin";

export type Well = {
  id: string;
  name: string;
  field: string;               // e.g. "Digboi", "Geleki", "Kharsang", "Pengri-Bardumsha"
  status: "active" | "completed" | "historical";
  surfaceCoords: { lat: number; lng: number };
  bottomHoleCoords?: { lat: number; lng: number };
  spudDate: string;
  currentDepthMD?: number;     // measured depth, for active wells
  currentDepthTVD?: number;    // true vertical depth
  currentFormation?: string;
  trajectoryType: "vertical" | "deviated" | "horizontal";
  operator?: string;
  rig?: string;
  totalDepthMD?: number;
};

export type ConfidenceTag = "STRUCTURED-HIGH" | "OCR-HIGH" | "OCR-MEDIUM" | "OCR-LOW" | "MANUAL-REVIEW";

export type DrillingEvent = {
  id: string;
  wellId: string;
  wellName?: string;
  field?: string;
  eventType: "mud_loss" | "stuck_pipe" | "kick_overpressure" | "torque_spike";
  formation: string;
  depthInterval: { from: number; to: number };
  outcome: "resolved" | "unresolved" | "npt_hours_lost";
  nptHours?: number;
  mitigationApplied?: string;
  mitigationSuccess?: boolean;
  narrative: string;               // short human-readable summary, not the full OCR text
  sourceDocument: {
    name: string;
    page?: number;
    confidence: ConfidenceTag;
  };
};

export type OffsetWellResult = {
  well: Well;
  distanceKm: number;              // pure haversine — always shown
  similarityScore: number;         // 0–1, composite — always shown separately
  similarityBreakdown: {
    formationMatch: number;
    depthAlignment: number;
    trajectorySimilarity: number;
    operationalParamSimilarity: number;
    geographicProximity: number;
  };
  matchedEvents: DrillingEvent[];
};

export type RiskCorridor = {
  id: string;
  formation: string;
  field: string;
  eventType: DrillingEvent["eventType"];
  depthInterval: { from: number; to: number };
  evidenceCount: number;
  eventFrequency: number;
  successfulMitigationRate: number;   // 0–1
  disconfirmingWellCount: number;     // offset wells that crossed this interval with NO incident — show this too, not just the scary evidence
  observedFactSummary: string;
  modelRiskSummary: string;
  recommendedMitigation: string;
};

export type Alert = {
  id: string;
  wellId: string;
  corridorId: string;
  firedAt: string;
  currentDepth: number;
  riskLevel: "low" | "moderate" | "high";
  status: "new" | "acknowledged" | "rejected" | "mitigation_applied";
  fact: string;            // observed historical fact
  estimate: string;        // model-estimated risk statement
  recommendation: string;  // suggested mitigation, ranked
  matchedOffsetWells: OffsetWellResult[];
  disconfirmingEvidence?: string;
};

export type FeedbackEntry = {
  alertId: string;
  engineerAction: "acknowledge" | "reject" | "incorrect_formation" | "incorrect_depth" | "mitigation_applied";
  note?: string;
  timestamp: string;
  userRole: string;
};

export type IngestionBatch = {
  id: string;
  batchName: string;
  sourceType: "structured_db" | "ocr_wcr" | "ocr_ddr" | "mud_log";
  ingestionDate: string;
  totalDocuments: number;
  extractedEventsCount: number;
  confidenceDistribution: {
    structuredHigh: number;
    ocrHigh: number;
    ocrMedium: number;
    ocrLow: number;
    manualReview: number;
  };
  status: "completed" | "processing" | "flagged_review";
};

export type SourceDocument = {
  id: string;
  documentName: string;
  documentType: "Well Completion Report (WCR)" | "Daily Drilling Report (DDR)" | "Mud Log" | "BHA Post-Mortem";
  wellName: string;
  field: string;
  dateRange: string;
  pageCount: number;
  ingestionConfidence: ConfidenceTag;
  extractedEventsCount: number;
  archiveReference: string;
};
