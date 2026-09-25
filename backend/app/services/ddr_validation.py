from typing import List, Tuple
from app.models.ddr_models import (
    DDRNormalizedData, 
    ValidationSummary, 
    DataQuality, 
    ExtractionStatus
)

def validate_ddr_extraction(data: DDRNormalizedData) -> ValidationSummary:
    """
    Validate normalized extracted fields, summarize quality and produce human-readable check messages.
    """
    messages: List[str] = []
    found_count = 0
    missing_count = 0
    review_count = 0
    invalid_count = 0

    # Collect all ExtractedField instances across all models
    field_groups = [
        data.source.model_dump(),
        data.well.model_dump(),
        data.formation.model_dump(),
        data.drilling_parameters.model_dump(),
        data.bit_bha.model_dump(),
        data.time_accounting.model_dump(),
        data.narrative.model_dump()
    ]

    for group in field_groups:
        for k, v in group.items():
            if isinstance(v, dict) and "status" in v:
                st = v.get("status")
                if st == ExtractionStatus.FOUND:
                    found_count += 1
                elif st == ExtractionStatus.MISSING:
                    missing_count += 1
                elif st == ExtractionStatus.NEEDS_REVIEW:
                    review_count += 1
                elif st == ExtractionStatus.INVALID:
                    invalid_count += 1

    # Check required drilling parameters
    has_depth = data.well.present_depth_md_m.status == ExtractionStatus.FOUND
    has_formation = data.formation.current_formation.status == ExtractionStatus.FOUND
    has_top = data.formation.top_md_m.status == ExtractionStatus.FOUND
    has_mud_wt = data.drilling_parameters.mud_weight_ppg.status == ExtractionStatus.FOUND
    has_wob = data.drilling_parameters.wob_t.status == ExtractionStatus.FOUND
    has_npt = (
        data.time_accounting.npt_24h_h.status == ExtractionStatus.FOUND or
        data.time_accounting.hours_lost.status == ExtractionStatus.FOUND
    )
    has_narrative = (
        data.narrative.operation_details.status in (ExtractionStatus.FOUND, ExtractionStatus.NEEDS_REVIEW)
    )

    if has_depth and has_formation and has_mud_wt:
        messages.append("Required drilling parameters detected (Present Depth, Formation, Mud Weight)")
    else:
        messages.append("Notice: Some primary drilling parameters (Depth / Formation / Mud Weight) are unpopulated")

    if has_top and has_formation:
        messages.append("Formation top and formation drilled detected; relative depth computed")
    elif has_formation:
        messages.append("Formation name detected; formation top depth is pending confirmation")

    if has_wob or data.drilling_parameters.rpm.status == ExtractionStatus.FOUND:
        messages.append("Operational mechanical drilling parameters (WOB / RPM / Torque) extracted")

    if has_npt:
        messages.append("NPT categories detected from time accounting summary")

    if has_narrative:
        messages.append("Narrative content available for event extraction and risk review")

    # Assess overall data quality tier
    if has_depth and has_formation and has_mud_wt and found_count >= 15:
        data_quality = DataQuality.HIGH
    elif has_depth or has_formation or found_count >= 8:
        data_quality = DataQuality.MEDIUM
    else:
        data_quality = DataQuality.LOW

    return ValidationSummary(
        fields_found=found_count,
        fields_missing=missing_count,
        fields_needing_review=review_count + invalid_count,
        data_quality=data_quality,
        validation_messages=messages
    )
