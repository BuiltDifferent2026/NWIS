import os
import json
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.models.ddr_models import (
    DDRNormalizedData,
    ApproveDDRRequest,
    ActiveWellContext,
    OffsetAnalysisResponse,
    RiskCorridorResponse,
    OffsetWell,
    SimilarityBreakdown
)
from app.services.ddr_parser import DDRSectionParser

# Path to mock offset wells data
MOCK_DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "mock_offset_wells.json")

def load_mock_offset_data() -> Dict[str, Any]:
    with open(MOCK_DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

app = FastAPI(
    title="AntarRig eRTMAC-NWIS DDR Intelligence Service",
    description="Section-aware Daily Drilling Report (DDR) upload, extraction, and decision-support API.",
    version="2.0.0"
)

# Enable CORS for frontend running on localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory Active Well Store initialized with clean fabricated defaults
DEFAULT_MOCK = load_mock_offset_data()

current_active_well: ActiveWellContext = ActiveWellContext(
    well_id=DEFAULT_MOCK["target_well_default"]["well_id"],
    basin=DEFAULT_MOCK["target_well_default"]["basin"],
    location="LOC_ALPHA",
    rig_name="RIG_X",
    present_depth_md_m=DEFAULT_MOCK["target_well_default"]["present_depth_md_m"],
    progress_24h_m=76.0,
    present_operation="DRILLING",
    hole_size_in="8.5",
    current_formation=DEFAULT_MOCK["target_well_default"]["formation"],
    formation_top_md_m=DEFAULT_MOCK["target_well_default"]["formation_top_md_m"],
    relative_depth_m=DEFAULT_MOCK["target_well_default"]["relative_depth_m"],
    mud_weight_ppg=DEFAULT_MOCK["target_well_default"]["mud_weight_ppg"],
    wob_t=12.0,
    torque_on_bottom_ft_lb=11000.0,
    rpm=120.0,
    flow_rate_gpm=550.0,
    spp_psi=2800.0,
    npt_today_h=2.5,
    updated_at=datetime.now(timezone.utc).isoformat()
)

latest_extracted_ddr: Optional[DDRNormalizedData] = None
parser = DDRSectionParser()

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AntarRig-DDR-Backend",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.post("/api/ddr/upload", response_model=DDRNormalizedData)
async def upload_ddr(
    file: Optional[UploadFile] = File(None),
    use_sample: bool = Form(False)
):
    """
    Accept an .xlsx DDR file, parse sections and label-value fields,
    and return normalized structured JSON with provenance and validation metrics.
    """
    global latest_extracted_ddr

    try:
        if use_sample or file is None:
            # Load the populated sample file from samples directory
            sample_candidates = [
                os.path.join(os.path.dirname(__file__), "..", "..", "samples", "sample_ddr_with_mock_values.xlsx"),
                os.path.join(os.path.dirname(__file__), "..", "..", "samples", "DDR_Template_Anonymized.xlsx"),
                "sample_ddr_with_mock_values.xlsx",
                "DDR_Template_Anonymized.xlsx"
            ]
            sample_path = None
            for p in sample_candidates:
                if os.path.exists(p):
                    sample_path = p
                    break

            if sample_path:
                with open(sample_path, "rb") as f:
                    content = f.read()
                filename = os.path.basename(sample_path)
            else:
                raise HTTPException(status_code=404, detail="Sample DDR workbook file not found")
        else:
            filename = file.filename or "DDR_Upload.xlsx"
            if not filename.lower().endswith(".xlsx"):
                raise HTTPException(
                    status_code=400,
                    detail="Invalid file format. Please upload an Excel .xlsx spreadsheet."
                )
            content = await file.read()

        extracted_data = parser.parse_workbook(content, filename=filename)
        latest_extracted_ddr = extracted_data
        return extracted_data

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"DDR Section-Aware Parser error: {str(e)}"
        )

@app.get("/api/ddr/download-sample")
def download_sample_ddr():
    """
    Serve the anonymized sample DDR spreadsheet (.xlsx) with explicit
    Content-Disposition attachment and filename headers so browsers save it directly
    with the correct .xlsx extension.
    """
    sample_candidates = [
        os.path.join(os.path.dirname(__file__), "..", "..", "samples", "sample_ddr_with_mock_values.xlsx"),
        os.path.join(os.path.dirname(__file__), "..", "..", "nwis-app", "public", "samples", "sample_ddr_with_mock_values.xlsx"),
        "sample_ddr_with_mock_values.xlsx"
    ]
    for p in sample_candidates:
        if os.path.exists(p):
            from fastapi.responses import FileResponse
            return FileResponse(
                path=p,
                filename="sample_ddr_with_mock_values.xlsx",
                media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                headers={
                    "Content-Disposition": 'attachment; filename="sample_ddr_with_mock_values.xlsx"',
                    "Access-Control-Expose-Headers": "Content-Disposition"
                }
            )
    raise HTTPException(status_code=404, detail="Sample DDR file not found on server")

@app.post("/api/ddr/approve", response_model=ActiveWellContext)
def approve_ddr(request: ApproveDDRRequest):
    """
    Accept edited/approved extracted DDR context, update active-well context,
    and mark the active well as updated.
    """
    global current_active_well, latest_extracted_ddr

    data = request.modified_data
    latest_extracted_ddr = data

    # Safely convert extracted field values to active well model types
    def get_num(field, default_val=0.0):
        val = getattr(field, "value", None)
        if val is not None and isinstance(val, (int, float)):
            return float(val)
        return default_val

    def get_str(field, default_val=""):
        val = getattr(field, "value", None)
        return str(val) if val is not None else default_val

    well_id = get_str(data.well.well_id, "WELL_A")
    basin = get_str(data.well.basin, "ASSAM_ARAKAN")
    location = get_str(data.well.location, "LOC_ALPHA")
    rig_name = get_str(data.well.rig_name, "RIG_X")
    present_depth = get_num(data.well.present_depth_md_m, 2145.0)
    progress_24h = get_num(data.well.progress_24h_m, 76.0)
    present_op = get_str(data.well.present_operation, "DRILLING")
    hole_size = get_str(data.well.hole_size_in, "8.5")

    formation_name = get_str(data.formation.current_formation, "FORMATION_ALPHA")
    top_md = get_num(data.formation.top_md_m, 2080.0)
    rel_depth = get_num(data.formation.relative_depth_m, round(present_depth - top_md, 2))

    mud_wt = get_num(data.drilling_parameters.mud_weight_ppg, 10.2)
    wob = get_num(data.drilling_parameters.wob_t, 12.0)
    torque = get_num(data.drilling_parameters.torque_on_bottom_ft_lb, 11000.0)
    rpm = get_num(data.drilling_parameters.rpm, 120.0)
    gpm = get_num(data.drilling_parameters.flow_rate_gpm, 550.0)
    spp = get_num(data.drilling_parameters.spp_psi, 2800.0)
    npt_today = get_num(data.time_accounting.npt_24h_h, get_num(data.time_accounting.hours_lost, 2.5))

    current_active_well = ActiveWellContext(
        well_id=well_id,
        basin=basin,
        location=location,
        rig_name=rig_name,
        present_depth_md_m=present_depth,
        progress_24h_m=progress_24h,
        present_operation=present_op,
        hole_size_in=hole_size,
        current_formation=formation_name,
        formation_top_md_m=top_md,
        relative_depth_m=rel_depth,
        mud_weight_ppg=mud_wt,
        wob_t=wob,
        torque_on_bottom_ft_lb=torque,
        rpm=rpm,
        flow_rate_gpm=gpm,
        spp_psi=spp,
        npt_today_h=npt_today,
        updated_at=datetime.now(timezone.utc).isoformat(),
        status_banner="Prototype Active-Well Context Update",
        ui_note=(
            "Context is updated from an approved representative DDR extraction. "
            "Production integration will use a read-only eRTMAC feed/export."
        )
    )

    return current_active_well

@app.get("/api/active-well/context", response_model=ActiveWellContext)
def get_active_well_context():
    """Return the latest approved active-well context."""
    return current_active_well

@app.get("/api/offset-analysis", response_model=OffsetAnalysisResponse)
def get_offset_analysis():
    """
    Use approved active-well context and mock offset-well history.
    Return top comparable wells (Well B, Well C, Well D) with 6-factor score breakdowns.
    """
    mock_data = load_mock_offset_data()
    offset_list = []

    for w in mock_data.get("offset_wells", []):
        sb = w["similarity_breakdown"]
        offset_list.append(OffsetWell(
            well_id=w["well_id"],
            distance_km=w["distance_km"],
            similarity_score=w["similarity_score"],
            formation_alignment=w["formation_alignment"],
            depth_alignment=w["depth_alignment"],
            trajectory=w["trajectory"],
            match_reason=w["match_reason"],
            is_closest=w.get("is_closest", False),
            is_best_comparison=w.get("is_best_comparison", False),
            similarity_breakdown=SimilarityBreakdown(
                formation_match=sb["formation_match"],
                relative_depth_alignment=sb["relative_depth_alignment"],
                trajectory_similarity=sb["trajectory_similarity"],
                drilling_parameter_similarity=sb["drilling_parameter_similarity"],
                rig_type_context=sb["rig_type_context"],
                geographic_proximity=sb["geographic_proximity"]
            ),
            historical_event=w.get("historical_event")
        ))

    return OffsetAnalysisResponse(
        target_well_id=current_active_well.well_id,
        target_formation=current_active_well.current_formation,
        target_relative_depth_m=current_active_well.relative_depth_m,
        closest_vs_best_explanation="Closest well is not always the best comparison well.",
        comparison_wells=offset_list
    )

@app.get("/api/risk-corridor", response_model=RiskCorridorResponse)
def get_risk_corridor():
    """
    Return illustrative historical risk corridor based on formation and formation-relative depth.
    Deterministic alert logic:
      - Within 30m before corridor start (60m - 90m): Watch
      - Inside corridor (90m - 140m): High
      - Otherwise: Normal
    """
    mock_data = load_mock_offset_data()
    corridor_cfg = mock_data.get("historical_risk_corridor", {})
    playbook_cfg = mock_data.get("mitigation_playbook", {})

    c_start = float(corridor_cfg.get("corridor_relative_depth_start_m", 90.0))
    c_end = float(corridor_cfg.get("corridor_relative_depth_end_m", 140.0))
    curr_rel = float(current_active_well.relative_depth_m)

    # Calculate distance to corridor entry
    if curr_rel < c_start:
        dist_to_corridor = round(c_start - curr_rel, 2)
    elif curr_rel > c_end:
        dist_to_corridor = 0.0
    else:
        dist_to_corridor = 0.0

    # Deterministic alert level logic
    if c_start <= curr_rel <= c_end:
        alert_level = "High"
    elif (c_start - 30.0) <= curr_rel < c_start:
        alert_level = "Watch"
    else:
        alert_level = "Normal"

    return RiskCorridorResponse(
        corridor_name="Illustrative Risk-Corridor Simulation",
        target_formation=current_active_well.current_formation,
        corridor_relative_depth_start_m=c_start,
        corridor_relative_depth_end_m=c_end,
        current_relative_depth_m=curr_rel,
        distance_to_corridor_m=dist_to_corridor,
        evidence_count=int(corridor_cfg.get("evidence_count", 5)),
        alert_level=alert_level,
        historical_event_type=corridor_cfg.get("historical_event_type", "Severe Lost Circulation (30-55 m³/hr)"),
        disclaimer=(
            "Illustrative evidence-backed corridor simulation; not a production drilling "
            "command or a trained risk prediction model."
        ),
        mitigation_playbook={
            "title": "Evidence-Linked Historical Mitigation Playbook",
            "disclaimer": (
                "Historical evidence only. Final operational action remains subject to "
                "approved OIL procedures and engineer judgment."
            ),
            "steps": playbook_cfg.get("steps", [])
        }
    )
