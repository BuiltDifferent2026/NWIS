from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, Field
from enum import Enum

class ExtractionStatus(str, Enum):
    FOUND = "found"
    MISSING = "missing"
    INVALID = "invalid"
    NEEDS_REVIEW = "needs_review"

class ConfidenceLevel(str, Enum):
    STRUCTURED_HIGH = "STRUCTURED_HIGH"
    STRUCTURED_MEDIUM = "STRUCTURED_MEDIUM"
    LOW = "LOW"

class DataQuality(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class ExtractedField(BaseModel):
    value: Optional[Union[str, float, int, bool]] = None
    unit: Optional[str] = None
    source_cell: Optional[str] = None
    status: ExtractionStatus = ExtractionStatus.MISSING
    confidence: ConfidenceLevel = ConfidenceLevel.STRUCTURED_HIGH
    raw_value: Optional[Any] = None
    edit_history: Optional[List[Dict[str, Any]]] = None

class SourceMetadata(BaseModel):
    document_type: str = "DDR"
    sheet_name: str = "Sheet1"
    filename: Optional[str] = None
    report_date: ExtractedField = Field(default_factory=ExtractedField)

class WellFields(BaseModel):
    well_id: ExtractedField = Field(default_factory=ExtractedField)
    basin: ExtractedField = Field(default_factory=ExtractedField)
    location: ExtractedField = Field(default_factory=ExtractedField)
    rig_name: ExtractedField = Field(default_factory=ExtractedField)
    present_depth_md_m: ExtractedField = Field(default_factory=ExtractedField)
    progress_24h_m: ExtractedField = Field(default_factory=ExtractedField)
    present_operation: ExtractedField = Field(default_factory=ExtractedField)
    hole_size_in: ExtractedField = Field(default_factory=ExtractedField)

class FormationFields(BaseModel):
    top_md_m: ExtractedField = Field(default_factory=ExtractedField)
    current_formation: ExtractedField = Field(default_factory=ExtractedField)
    relative_depth_m: ExtractedField = Field(default_factory=ExtractedField)

class DrillingParameterFields(BaseModel):
    wob_t: ExtractedField = Field(default_factory=ExtractedField)
    torque_on_bottom_ft_lb: ExtractedField = Field(default_factory=ExtractedField)
    torque_off_bottom_ft_lb: ExtractedField = Field(default_factory=ExtractedField)
    rpm: ExtractedField = Field(default_factory=ExtractedField)
    flow_rate_gpm: ExtractedField = Field(default_factory=ExtractedField)
    spp_psi: ExtractedField = Field(default_factory=ExtractedField)
    mud_weight_ppg: ExtractedField = Field(default_factory=ExtractedField)
    viscosity_sec_qt: ExtractedField = Field(default_factory=ExtractedField)
    fluid_loss_cc_30min: ExtractedField = Field(default_factory=ExtractedField)

class BitBHAFields(BaseModel):
    bit_serial_no: ExtractedField = Field(default_factory=ExtractedField)
    bit_type_nozzle: ExtractedField = Field(default_factory=ExtractedField)
    make_iadc: ExtractedField = Field(default_factory=ExtractedField)
    bit_hours_24h: ExtractedField = Field(default_factory=ExtractedField)
    bit_hours_cum: ExtractedField = Field(default_factory=ExtractedField)
    bha_length_m: ExtractedField = Field(default_factory=ExtractedField)
    bha_weight_t: ExtractedField = Field(default_factory=ExtractedField)

class TimeAccountingFields(BaseModel):
    hours_lost: ExtractedField = Field(default_factory=ExtractedField)
    shutdown_reason: ExtractedField = Field(default_factory=ExtractedField)
    operating_time_h: ExtractedField = Field(default_factory=ExtractedField)
    force_majeure_h: ExtractedField = Field(default_factory=ExtractedField)
    repairing_time_h: ExtractedField = Field(default_factory=ExtractedField)
    standby_day_time_h: ExtractedField = Field(default_factory=ExtractedField)
    non_operating_time_h: ExtractedField = Field(default_factory=ExtractedField)
    ilm_time_h: ExtractedField = Field(default_factory=ExtractedField)
    npt_24h_h: ExtractedField = Field(default_factory=ExtractedField)
    monthly_cumulative_npt_h: ExtractedField = Field(default_factory=ExtractedField)

class NarrativeFields(BaseModel):
    operation_details: ExtractedField = Field(default_factory=ExtractedField)
    next_operation: ExtractedField = Field(default_factory=ExtractedField)
    remarks: ExtractedField = Field(default_factory=ExtractedField)

class DetectedSection(BaseModel):
    id: str
    name: str
    color: str  # blue, green, orange, purple, red, yellow
    start_row: int
    end_row: int
    matched_label: str
    fields_extracted_count: int = 0
    sample_preview: Optional[str] = None

class ValidationSummary(BaseModel):
    fields_found: int = 0
    fields_missing: int = 0
    fields_needing_review: int = 0
    data_quality: DataQuality = DataQuality.HIGH
    validation_messages: List[str] = Field(default_factory=list)

class DDRNormalizedData(BaseModel):
    source: SourceMetadata = Field(default_factory=SourceMetadata)
    well: WellFields = Field(default_factory=WellFields)
    formation: FormationFields = Field(default_factory=FormationFields)
    drilling_parameters: DrillingParameterFields = Field(default_factory=DrillingParameterFields)
    bit_bha: BitBHAFields = Field(default_factory=BitBHAFields)
    time_accounting: TimeAccountingFields = Field(default_factory=TimeAccountingFields)
    narrative: NarrativeFields = Field(default_factory=NarrativeFields)
    detected_sections: List[DetectedSection] = Field(default_factory=list)
    validation_summary: ValidationSummary = Field(default_factory=ValidationSummary)
    sheet_preview_grid: Optional[List[Dict[str, Any]]] = None

class ApproveDDRRequest(BaseModel):
    approved_by: Optional[str] = "Lead Drilling Engineer"
    notes: Optional[str] = None
    modified_data: DDRNormalizedData

class ActiveWellContext(BaseModel):
    well_id: str = "WELL_A"
    basin: str = "ASSAM_ARAKAN"
    location: str = "LOC_ALPHA"
    rig_name: str = "RIG_X"
    present_depth_md_m: float = 2145.0
    progress_24h_m: float = 76.0
    present_operation: str = "DRILLING"
    hole_size_in: str = "8.5"
    current_formation: str = "FORMATION_ALPHA"
    formation_top_md_m: float = 2080.0
    relative_depth_m: float = 65.0
    mud_weight_ppg: float = 10.2
    wob_t: float = 12.0
    torque_on_bottom_ft_lb: float = 11000.0
    rpm: float = 120.0
    flow_rate_gpm: float = 550.0
    spp_psi: float = 2800.0
    npt_today_h: float = 2.5
    updated_at: str
    status_banner: str = "Prototype Active-Well Context Update"
    ui_note: str = (
        "Context is updated from an approved representative DDR extraction. "
        "Production integration will use a read-only eRTMAC feed/export."
    )

class SimilarityBreakdown(BaseModel):
    formation_match: float
    relative_depth_alignment: float
    trajectory_similarity: float
    drilling_parameter_similarity: float
    rig_type_context: float
    geographic_proximity: float

class OffsetWell(BaseModel):
    well_id: str
    distance_km: float
    similarity_score: float
    formation_alignment: str
    depth_alignment: str
    trajectory: str
    match_reason: str
    similarity_breakdown: SimilarityBreakdown
    is_closest: bool = False
    is_best_comparison: bool = False
    historical_event: Optional[Dict[str, Any]] = None

class OffsetAnalysisResponse(BaseModel):
    target_well_id: str
    target_formation: str
    target_relative_depth_m: float
    closest_vs_best_explanation: str = "Closest well is not always the best comparison well."
    comparison_wells: List[OffsetWell]

class RiskCorridorResponse(BaseModel):
    corridor_name: str = "Historical Mud-Loss Corridor"
    target_formation: str = "Formation Alpha"
    corridor_relative_depth_start_m: float = 90.0
    corridor_relative_depth_end_m: float = 140.0
    current_relative_depth_m: float = 65.0
    distance_to_corridor_m: float = 25.0
    evidence_count: int = 5
    alert_level: str  # Normal, Watch, High
    historical_event_type: str = "Severe Lost Circulation (30-55 m³/hr)"
    disclaimer: str = (
        "Illustrative evidence-backed corridor simulation; not a production drilling "
        "command or a trained risk prediction model."
    )
    mitigation_playbook: Dict[str, Any]
