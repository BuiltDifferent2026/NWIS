from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "service" in data


def test_upload_sample_ddr():
    response = client.post("/api/ddr/upload?use_sample=true")
    assert response.status_code == 200
    data = response.json()
    assert "validation_summary" in data
    assert data["validation_summary"]["data_quality"] in ["HIGH", "MEDIUM", "LOW"]
    assert "well" in data
    assert "formation" in data
    assert "drilling_parameters" in data
    assert "detected_sections" in data
    assert len(data["detected_sections"]) >= 6
    assert data["well"]["well_id"]["value"] is not None


def test_approve_ddr():
    # First upload sample to get normalized data
    res_upload = client.post("/api/ddr/upload?use_sample=true")
    normalized_data = res_upload.json()

    approve_payload = {
        "modified_data": normalized_data,
        "engineer_notes": "Automated verification test"
    }
    response = client.post("/api/ddr/approve", json=approve_payload)
    assert response.status_code == 200
    data = response.json()
    assert "well_id" in data
    assert "present_depth_md_m" in data
    assert "status_banner" in data
    assert "Prototype Active-Well Context Update" in data["status_banner"]
    assert "read-only eRTMAC feed/export" in data["ui_note"]


def test_get_active_well_context():
    response = client.get("/api/active-well/context")
    assert response.status_code == 200
    data = response.json()
    assert "well_id" in data
    assert "present_depth_md_m" in data
    assert "ui_note" in data
    assert "read-only eRTMAC feed/export" in data["ui_note"]


def test_get_offset_analysis():
    response = client.get("/api/offset-analysis")
    assert response.status_code == 200
    data = response.json()
    assert "comparison_wells" in data
    wells = data["comparison_wells"]
    assert len(wells) == 3
    # Check that Well B is best comparison and Well C is closest
    well_b = next((w for w in wells if "Well B" in w["well_id"]), None)
    well_c = next((w for w in wells if "Well C" in w["well_id"]), None)
    assert well_b is not None
    assert well_b["is_best_comparison"] is True
    assert well_c is not None
    assert well_c["is_closest"] is True
    assert well_b["similarity_score"] > well_c["similarity_score"]


def test_get_risk_corridor():
    response = client.get("/api/risk-corridor")
    assert response.status_code == 200
    data = response.json()
    assert "corridor_relative_depth_start_m" in data
    assert "corridor_relative_depth_end_m" in data
    assert data["alert_level"] in ["Normal", "Watch", "High"]
    assert "disclaimer" in data
    assert "not a production drilling command" in data["disclaimer"]
    assert "mitigation_playbook" in data
