# AntarRig (eRTMAC-NWIS)

## Section-Aware DDR Ingestion & Lookahead Intelligence Platform

AntarRig is an operational drilling decision-support prototype developed for the **Oil India Limited (OIL)** National Well Information System (NWIS / eRTMAC) ecosystem.

This platform bridges the gap between daily operations and institutional memory by providing:
1. **Section-Aware Local DDR Ingestion**: Parses non-flat, merged-cell Excel spreadsheets (`.xlsx`) using an in-memory coordinate-aware engine without cloud APIs, OCR services, or external LLMs.
2. **Prototype Active-Well Context Update**: Propagates engineer-reviewed drilling context into active telemetry and lookahead services.
3. **Multi-Factor Offset Well Comparison**: Overcomes the "proximity trap" by demonstrating why the geographically closest well is not always the best geological analog.
4. **Illustrative Risk-Corridor Simulation**: Dynamically watches historical hazard intervals (e.g. mud-loss corridors) based on relative formation penetration.
5. **Evidence-Linked Historical Mitigation Playbook**: Provides actionable contingency playbooks directly tied to historical WCR/DDR analog evidence.

---

## Important Disclaimers & Security Boundary

> [!NOTE]
> **Prototype Active-Well Context Update**:
> *Context is updated from an approved representative DDR extraction. Production integration will use a read-only eRTMAC feed/export.*

> [!WARNING]
> **Illustrative Risk-Corridor Simulation**:
> *Illustrative evidence-backed corridor simulation; not a production drilling command or a trained risk prediction model.*

> [!CAUTION]
> **Evidence-Linked Historical Mitigation Playbook**:
> *Historical evidence only. Final operational action remains subject to approved OIL procedures and engineer judgment.*

> [!IMPORTANT]
> **Representative DDR Workflow Simulation**:
> *Confidential OIL operational data is not displayed. The backend works only with anonymized or sample-safe DDR files. It does not include, request, hard-code, log, or upload confidential OIL operational records.*

---

## Architecture Overview

```
NWIS/
├── backend/                             # Python FastAPI Section-Aware Parser Backend
│   ├── app/
│   │   ├── config/
│   │   │   └── ddr_template_mapping.yaml # Section detection boundaries & 50+ field aliases
│   │   ├── data/
│   │   │   └── mock_offset_wells.json   # Anonymized offset wells (Well B, C, D) & playbooks
│   │   ├── models/
│   │   │   └── ddr_models.py            # Pydantic v2 schemas for provenance & normalized JSON
│   │   ├── services/
│   │   │   ├── ddr_normalizer.py        # Units, numeric casting, NPT parser, colon cleaners
│   │   │   ├── ddr_parser.py            # Openpyxl parser with merged-cell coordinate resolution
│   │   │   └── ddr_validation.py        # Data quality scoring (HIGH/MEDIUM/LOW)
│   │   └── main.py                      # FastAPI application & REST endpoints
│   ├── tests/
│   │   ├── test_ddr_parser.py           # Unit tests for parser, aliases, and math
│   │   └── test_api_endpoints.py        # Integration tests for FastAPI endpoints
│   ├── Dockerfile
│   └── requirements.txt
├── nwis-app/                            # Next.js 16 (App Router) + TailwindCSS Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── ddr-intelligence/page.tsx # 7-Screen Stepper Workflow UI
│   │   │   ├── operations/              # Active Rig Workspace
│   │   │   └── ...
│   │   └── components/layout/GovNav.tsx # Navigation bar with DDR Intelligence item
│   ├── public/samples/                  # Bundled test workbooks
│   ├── Dockerfile
│   └── next.config.ts                   # Standalone output & /api/ backend rewrites
├── samples/
│   ├── DDR_Template_Anonymized.xlsx     # Anonymized representative blank OIL template
│   └── sample_ddr_with_mock_values.xlsx # Fabricated populated test workbook
├── docker-compose.yml                   # Unified multi-container deployment
└── pytest.ini                           # Test configuration
```

---

## 4-Step Operational Workflow (`/ddr-intelligence`)

| Step | Screen Name | Key Engineering Capabilities |
| :--- | :--- | :--- |
| **Step 1** | **Upload DDR** | Local file upload or 1-click **Use Anonymized Sample DDR**. Strict local safety notice with path `./samples/DDR_Template_Anonymized.xlsx`. |
| **Step 2** | **Extracted Data Review** | Normalized drilling parameters with field-level provenance (`source_cell`), confidence tier (`STRUCTURED_HIGH`), units, data quality check, and mandatory eRTMAC context note. |
| **Step 3** | **Mock Offset-Well Comparison** | Compares Active Well against 3 analogs (Well B, Well C, Well D). Demonstrates why closest well (Well C, 2.1 km) is inferior to the true analog (Well B, 14.8 km, 0.92 match). |
| **Step 4** | **Evidence-Linked Historical Mitigation Playbook** | 4-step contingency action sequence (LCM pill pre-hydration, ECD cap @ 10.4 ppg, PVT alarm) linked to Well B historical incident record. |

---

## Quickstart Guide

### Option 1: Running Locally with Python & Node.js

#### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

#### 1. Start the Backend Service
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The backend API documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs) and health check at [http://localhost:8000/health](http://localhost:8000/health).

#### 2. Start the Frontend Application
In a separate terminal:
```bash
cd nwis-app
npm install
npm run dev
```
Open [http://localhost:3000/ddr-intelligence](http://localhost:3000/ddr-intelligence) in your browser.

---

### Option 2: Running with Docker Compose

To launch both backend and frontend services simultaneously in isolated containers:

```bash
# Build and run containers
docker-compose up --build -d

# Check service health
docker-compose ps
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **DDR Intelligence Route**: [http://localhost:3000/ddr-intelligence](http://localhost:3000/ddr-intelligence)

To stop the containers:
```bash
docker-compose down
```

---

## Running the Automated Test Suite

The test suite validates openpyxl merged-cell coordinate resolution, label alias matching, unit extraction, relative depth calculation, and all FastAPI endpoints:

```bash
# Run all backend unit & integration tests
./backend/venv/bin/pytest -v
```

Expected output:
```text
backend/tests/test_api_endpoints.py::test_health_check PASSED
backend/tests/test_api_endpoints.py::test_upload_sample_ddr PASSED
backend/tests/test_api_endpoints.py::test_approve_ddr PASSED
backend/tests/test_api_endpoints.py::test_get_active_well_context PASSED
backend/tests/test_api_endpoints.py::test_get_offset_analysis PASSED
backend/tests/test_api_endpoints.py::test_get_risk_corridor PASSED
backend/tests/test_ddr_parser.py::test_merged_cell_resolution PASSED
backend/tests/test_ddr_parser.py::test_label_alias_matching PASSED
backend/tests/test_numeric_parsing_with_units PASSED
backend/tests/test_ddr_parser.py::test_npt_summary_parsing PASSED
backend/tests/test_ddr_parser.py::test_formation_relative_depth_calculation PASSED
backend/tests/test_ddr_parser.py::test_full_workbook_extraction_and_validation PASSED

======================== 12 passed in 0.42s ========================
```

---

## Technical Parser Details

### Merged-Cell Coordinate Resolution
Excel templates frequently merge cells for aesthetic section headers or wide values. Standard parsers often return `None` when reading merged child coordinates. AntarRig pre-indexes every merged cell range:
```python
# Mapped in DDRSectionParser:
# Any coordinate inside merged range (min_row, min_col, max_row, max_col)
# is automatically resolved to its top-left anchor cell.
coord = f"{get_column_letter(min_col)}{min_row}"
```

### Two-Pass Label-Alias Matching
Section fields are resolved in two passes to prevent short generic tokens (e.g. `formation`) from masking specific headers (e.g. `formation top (m)`):
1. **Pass 1 (Exact Match)**: Case-insensitive normalized exact label comparison.
2. **Pass 2 (Prefix Match)**: Handles colon-delimited or inline label combinations (e.g., `PRESENT DEPTH : 2145 m`).

### Relative Depth vs Hazard Corridors
Drilling hazards correlate with formation penetration rather than absolute measured depth (due to structural dipping and fault offsets):
$$\text{Relative Formation Depth} = \text{Present Depth (MD)} - \text{Formation Top (MD)}$$
- For `Present Depth = 2,145m` and `Top MD = 2,080m`, $\Delta = 65\text{m}$.
- Historical loss corridor: $90\text{m} - 140\text{m}$ into the formation.
- Distance to entry: $25\text{m}$ $\rightarrow$ triggers **WATCH** state with proactive LCM pill staging.

---

## Verification & Compliance

- **No Hardcoded Machine Paths**: Configured strictly with relative `./samples/DDR_Template_Anonymized.xlsx` and `<path-to-anonymized-template>`.
- **Zero Confidential Data**: All sample figures, rig IDs, and formation names are fully fabricated and representative.
- **Offline / Local Execution**: Runs entirely on local compute without external third-party cloud dependencies.
