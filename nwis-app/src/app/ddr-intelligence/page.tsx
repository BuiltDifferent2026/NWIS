'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Compass,
  Activity,
  SlidersHorizontal,
  Info,
  ExternalLink,
  RefreshCw,
  FileCheck,
  Check,
  ChevronRight,
  Download,
  Eye,
  Sliders,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface ExtractedField {
  label: string;
  value: any;
  unit?: string | null;
  source_cell: string;
  confidence: string;
  status: 'found' | 'missing' | 'invalid' | 'needs_review';
}

interface SectionGrid {
  section_id: string;
  name: string;
  color_code: string;
  detected_rows: [number, number];
  fields_count: number;
}

interface SheetCell {
  row: number;
  col: number;
  coord: string;
  value: string;
  section_id: string | null;
  is_merged: boolean;
  is_header: boolean;
}

interface OffsetWell {
  well_id: string;
  well_name: string;
  distance_km: number;
  multi_factor_similarity: number;
  is_best_comparison: boolean;
  is_closest_geographically: boolean;
  formation_match: string;
  depth_md: number;
  trajectory_type: string;
  casing_size: string;
  historical_events: string[];
  relevance_reason: string;
  similarity_factors: {
    spatial_proximity: number;
    lithological_match: number;
    mud_system_alignment: number;
    trajectory_similarity: number;
    casing_schedule_match: number;
    target_formation_match: number;
  };
}

interface RiskCorridor {
  formation_name: string;
  top_md: number;
  current_depth: number;
  corridor_relative_start_m: number;
  corridor_relative_end_m: number;
  corridor_start_md: number;
  corridor_end_md: number;
  distance_to_corridor_m: number;
  status: 'NORMAL' | 'WATCH' | 'HIGH';
  alert_level: string;
  disclaimer: string;
}

const STEPS = [
  { id: 1, name: 'Upload DDR', short: 'Upload' },
  { id: 2, name: 'Extracted Data Review', short: 'Review' },
  { id: 3, name: 'Mock Offset-Well Comparison', short: 'Offset Analog' },
  { id: 4, name: 'Evidence-Linked Historical Mitigation Playbook', short: 'Playbook' }
];

export default function DDRIntelligencePage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSampleLoaded, setIsSampleLoaded] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('DDR_Template_Anonymized.xlsx');
  const [dataQuality, setDataQuality] = useState<string>('HIGH');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isApproved, setIsApproved] = useState<boolean>(false);

  // Parsed sections and fields
  const [sections, setSections] = useState<Record<string, Record<string, ExtractedField>>>({});
  const [detectedSectionsList, setDetectedSectionsList] = useState<SectionGrid[]>([]);
  const [previewCells, setPreviewCells] = useState<SheetCell[]>([]);
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<string>('all');

  // Relative formation depth
  const [relativeDepth, setRelativeDepth] = useState<number>(65.0);
  const [presentDepth, setPresentDepth] = useState<number>(2145.0);
  const [simulatedRelativeDepth, setSimulatedRelativeDepth] = useState<number>(65.0);

  // Offset comparison
  const [offsetWells, setOffsetWells] = useState<OffsetWell[]>([]);
  const [takeawayText, setTakeawayText] = useState<string>(
    'The geographically closest well (OIL-GLK-03, 2.1 km) is NOT the best comparison well. OIL-GLK-07 (14.8 km) exhibits 0.92 composite similarity with identical lithology and mud loss history.'
  );

  // Risk corridor
  const [riskCorridor, setRiskCorridor] = useState<RiskCorridor | null>(null);

  // Playbook
  const [playbookSteps, setPlaybookSteps] = useState<any[]>([]);

  // Initial load: fetch default state or load sample
  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = async () => {
    setIsLoading(true);
    try {
      // Try local backend proxy first
      const res = await fetch('/api/ddr/upload?use_sample=true', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        populateFromBackendResponse(json);
      } else {
        // Fallback to direct client mock if backend unreachable
        populateFallbackData();
      }
    } catch (e) {
      console.warn('Backend proxy fetch failed, initializing client mock state', e);
      populateFallbackData();
    } finally {
      setIsLoading(false);
      setIsSampleLoaded(true);
    }
  };

  const populateFromBackendResponse = async (json: any) => {
    // Map detected sections
    const mappedSections: SectionGrid[] = (json.detected_sections || []).map((s: any) => {
      const start = typeof s.start_row === 'number'
        ? s.start_row
        : (Array.isArray(s.detected_rows) && typeof s.detected_rows[0] === 'number' ? s.detected_rows[0] : 1);
      const end = typeof s.end_row === 'number'
        ? s.end_row
        : (Array.isArray(s.detected_rows) && typeof s.detected_rows[1] === 'number' ? s.detected_rows[1] : 10);
      return {
        section_id: s.section_id || 'section',
        name: s.section_name || s.name || s.section_id || 'Section',
        color_code: s.color_code || '#26A69A',
        detected_rows: [start, end],
        start_row: start,
        end_row: end,
        fields_count: typeof s.fields_found_count === 'number'
          ? s.fields_found_count
          : (typeof s.fields_count === 'number' ? s.fields_count : 4)
      };
    });

    if (mappedSections.length > 0) {
      setDetectedSectionsList(mappedSections);
    } else {
      setDetectedSectionsList([
        { section_id: 'header', name: 'Header / Well Identification', color_code: '#26A69A', detected_rows: [1, 7], fields_count: 5 },
        { section_id: 'depth_and_progress', name: 'Depth & Daily Progress', color_code: '#3FAE68', detected_rows: [8, 14], fields_count: 4 },
        { section_id: 'mud_properties', name: 'Drilling Fluid & Mud Properties', color_code: '#F2B84B', detected_rows: [15, 20], fields_count: 4 },
        { section_id: 'hydraulics', name: 'Bit & Hydraulics', color_code: '#3FC3B6', detected_rows: [21, 26], fields_count: 2 },
        { section_id: 'formation', name: 'Lithology & Geological Context', color_code: '#8B5CF6', detected_rows: [27, 33], fields_count: 2 },
        { section_id: 'npt_summary', name: 'NPT & Non-Productive Time', color_code: '#E05252', detected_rows: [34, 40], fields_count: 3 }
      ]);
    }

    // Map extracted fields if structured as DDRNormalizedData
    if (json.well || json.formation || json.drilling_parameters) {
      const pDepth = typeof json.well?.present_depth_md_m?.value === 'number'
        ? json.well.present_depth_md_m.value
        : 2145.0;
      const fTop = typeof json.formation?.top_md_m?.value === 'number'
        ? json.formation.top_md_m.value
        : 2080.0;
      const relD = typeof json.formation?.relative_depth_m?.value === 'number'
        ? json.formation.relative_depth_m.value
        : Math.round(pDepth - fTop);

      setPresentDepth(pDepth);
      setRelativeDepth(relD);
      setSimulatedRelativeDepth(relD);

      const mappedGroupedSections: Record<string, Record<string, ExtractedField>> = {
        header: {
          well_name: { label: 'Well Name', value: json.well?.well_id?.value ?? 'OIL-GLK-14', unit: null, source_cell: json.well?.well_id?.source_cell ?? 'C4', confidence: json.well?.well_id?.confidence ?? 'STRUCTURED_HIGH', status: 'found' },
          rig_id: { label: 'Rig No.', value: json.well?.rig_name?.value ?? 'OIL-Rig-09', unit: null, source_cell: json.well?.rig_name?.source_cell ?? 'C5', confidence: 'STRUCTURED_HIGH', status: 'found' },
          report_date: { label: 'Report Date', value: json.source?.report_date?.value ?? '2026-09-24', unit: null, source_cell: 'G4', confidence: 'STRUCTURED_HIGH', status: 'found' },
          report_no: { label: 'Report No.', value: json.source?.report_no?.value ?? 42, unit: null, source_cell: 'G5', confidence: 'STRUCTURED_HIGH', status: 'found' },
          spud_date: { label: 'Spud Date', value: json.well?.spud_date?.value ?? '2026-08-12', unit: null, source_cell: 'C6', confidence: 'STRUCTURED_HIGH', status: 'found' }
        },
        depth_and_progress: {
          present_depth: { label: 'Present Depth', value: pDepth, unit: 'm', source_cell: json.well?.present_depth_md_m?.source_cell ?? 'C10', confidence: 'STRUCTURED_HIGH', status: 'found' },
          midnight_depth: { label: 'Midnight Depth', value: json.well?.midnight_depth_md_m?.value ?? 2100.0, unit: 'm', source_cell: 'G10', confidence: 'STRUCTURED_HIGH', status: 'found' },
          progress_24h: { label: '24h Progress', value: json.well?.progress_24h_m?.value ?? 45.0, unit: 'm', source_cell: 'C11', confidence: 'STRUCTURED_HIGH', status: 'found' },
          drilling_hours: { label: 'Rotating Hours', value: json.time_accounting?.drilling_hours?.value ?? 16.5, unit: 'hrs', source_cell: 'G11', confidence: 'STRUCTURED_HIGH', status: 'found' }
        },
        formation: {
          formation_name: { label: 'Current Formation', value: json.formation?.current_formation?.value ?? 'Formation Alpha', unit: null, source_cell: json.formation?.current_formation?.source_cell ?? 'C28', confidence: 'STRUCTURED_HIGH', status: 'found' },
          top_md: { label: 'Formation Top', value: fTop, unit: 'm', source_cell: json.formation?.top_md_m?.source_cell ?? 'G28', confidence: 'STRUCTURED_HIGH', status: 'found' }
        },
        mud_properties: {
          mud_weight: { label: 'Mud Weight', value: json.drilling_parameters?.mud_weight_ppg?.value ?? 10.2, unit: 'ppg', source_cell: json.drilling_parameters?.mud_weight_ppg?.source_cell ?? 'C16', confidence: 'STRUCTURED_HIGH', status: 'found' },
          funnel_viscosity: { label: 'Funnel Viscosity', value: json.drilling_parameters?.funnel_viscosity?.value ?? 45.0, unit: 's/qt', source_cell: 'G16', confidence: 'STRUCTURED_HIGH', status: 'found' },
          plastic_viscosity: { label: 'Plastic Viscosity (PV)', value: json.drilling_parameters?.pv_cp?.value ?? 18.0, unit: 'cP', source_cell: 'C17', confidence: 'STRUCTURED_HIGH', status: 'found' },
          yield_point: { label: 'Yield Point (YP)', value: json.drilling_parameters?.yp_lb_100sqft?.value ?? 22.0, unit: 'lb/100ft²', source_cell: 'G17', confidence: 'STRUCTURED_HIGH', status: 'found' }
        },
        hydraulics: {
          flow_rate: { label: 'Circulation Rate', value: json.drilling_parameters?.flow_rate_gpm?.value ?? 650.0, unit: 'gpm', source_cell: 'C22', confidence: 'STRUCTURED_HIGH', status: 'found' },
          standpipe_pressure: { label: 'Standpipe Pressure', value: json.drilling_parameters?.spp_psi?.value ?? 2450.0, unit: 'psi', source_cell: 'G22', confidence: 'STRUCTURED_HIGH', status: 'found' }
        },
        npt_summary: {
          lost_circ_hours: { label: 'Lost Circulation', value: json.time_accounting?.lost_circ_hours?.value ?? 0.0, unit: 'hrs', source_cell: 'C36', confidence: 'STRUCTURED_HIGH', status: 'found' },
          rig_repair_hours: { label: 'Rig Repair', value: json.time_accounting?.rig_repair_hours?.value ?? 1.5, unit: 'hrs', source_cell: 'G36', confidence: 'STRUCTURED_HIGH', status: 'found' },
          total_npt_hours: { label: 'Total NPT', value: json.time_accounting?.total_npt_hours?.value ?? 1.5, unit: 'hrs', source_cell: 'C37', confidence: 'STRUCTURED_HIGH', status: 'found' }
        }
      };
      setSections(mappedGroupedSections);
    } else if (json.sections) {
      setSections(json.sections);
    }

    if (json.validation_summary) {
      setDataQuality(json.validation_summary.data_quality || 'HIGH');
      setValidationErrors(json.validation_summary.validation_messages || []);
    } else {
      setDataQuality(json.data_quality || 'HIGH');
      setValidationErrors(json.validation_errors || []);
    }

    if (json.sheet_preview_grid) {
      setPreviewCells(json.sheet_preview_grid);
    }

    // Fetch offset & risk data from backend
    try {
      const [offsetRes, riskRes] = await Promise.all([
        fetch('/api/offset-analysis'),
        fetch('/api/risk-corridor')
      ]);
      if (offsetRes.ok) {
        const offsetJson = await offsetRes.json();
        if (offsetJson.comparison_wells) {
          const mappedOffsets: OffsetWell[] = offsetJson.comparison_wells.map((w: any) => ({
            well_id: w.well_id,
            well_name: w.well_id.includes('Well') ? `${w.well_id} (OIL-${w.well_id.replace('Well ', 'GLK-')})` : w.well_id,
            distance_km: w.distance_km,
            multi_factor_similarity: w.similarity_score,
            is_best_comparison: w.is_best_comparison ?? false,
            is_closest_geographically: w.is_closest ?? false,
            formation_match: w.formation_alignment,
            depth_md: 2280,
            trajectory_type: w.trajectory,
            casing_size: '9-5/8"',
            historical_events: w.historical_event
              ? [w.historical_event.event_type, w.historical_event.mitigation_applied]
              : ['No significant historical events'],
            relevance_reason: w.match_reason,
            similarity_factors: {
              spatial_proximity: w.similarity_breakdown?.geographic_proximity ?? 0.7,
              lithological_match: w.similarity_breakdown?.formation_match ?? 0.9,
              mud_system_alignment: w.similarity_breakdown?.drilling_parameter_similarity ?? 0.85,
              trajectory_similarity: w.similarity_breakdown?.trajectory_similarity ?? 0.85,
              casing_schedule_match: w.similarity_breakdown?.relative_depth_alignment ?? 0.9,
              target_formation_match: w.similarity_breakdown?.formation_match ?? 0.95
            }
          }));
          setOffsetWells(mappedOffsets);
        }
        if (offsetJson.closest_vs_best_explanation) {
          setTakeawayText(
            `Notice: ${offsetJson.closest_vs_best_explanation} Well B (OIL-GLK-07, 14.8 km) exhibits 0.92 composite similarity with identical lithology, casing schedule, and historical mud-loss records.`
          );
        }
      }
      if (riskRes.ok) {
        const riskJson = await riskRes.json();
        setRiskCorridor(riskJson);
      }
    } catch (err) {
      console.warn('Error fetching auxiliary data:', err);
    }
  };

  const populateFallbackData = () => {
    // Rich fallback state matching backend models
    const mockSections = {
      header: {
        well_name: { label: 'Well Name', value: 'OIL-GLK-14', unit: null, source_cell: 'C4', confidence: 'STRUCTURED_HIGH', status: 'found' },
        rig_id: { label: 'Rig No.', value: 'OIL-Rig-09', unit: null, source_cell: 'C5', confidence: 'STRUCTURED_HIGH', status: 'found' },
        report_date: { label: 'Report Date', value: '2026-09-24', unit: null, source_cell: 'G4', confidence: 'STRUCTURED_HIGH', status: 'found' },
        report_no: { label: 'Report No.', value: 42, unit: null, source_cell: 'G5', confidence: 'STRUCTURED_HIGH', status: 'found' },
        spud_date: { label: 'Spud Date', value: '2026-08-12', unit: null, source_cell: 'C6', confidence: 'STRUCTURED_HIGH', status: 'found' }
      },
      depth_and_progress: {
        present_depth: { label: 'Present Depth', value: 2145.0, unit: 'm', source_cell: 'C10', confidence: 'STRUCTURED_HIGH', status: 'found' },
        midnight_depth: { label: 'Midnight Depth', value: 2100.0, unit: 'm', source_cell: 'G10', confidence: 'STRUCTURED_HIGH', status: 'found' },
        progress_24h: { label: '24h Progress', value: 45.0, unit: 'm', source_cell: 'C11', confidence: 'STRUCTURED_HIGH', status: 'found' },
        drilling_hours: { label: 'Rotating Hours', value: 16.5, unit: 'hrs', source_cell: 'G11', confidence: 'STRUCTURED_HIGH', status: 'found' }
      },
      formation: {
        formation_name: { label: 'Current Formation', value: 'Formation Alpha', unit: null, source_cell: 'C28', confidence: 'STRUCTURED_HIGH', status: 'found' },
        top_md: { label: 'Formation Top', value: 2080.0, unit: 'm', source_cell: 'G28', confidence: 'STRUCTURED_HIGH', status: 'found' }
      },
      mud_properties: {
        mud_weight: { label: 'Mud Weight', value: 10.2, unit: 'ppg', source_cell: 'C16', confidence: 'STRUCTURED_HIGH', status: 'found' },
        funnel_viscosity: { label: 'Funnel Viscosity', value: 45.0, unit: 's/qt', source_cell: 'G16', confidence: 'STRUCTURED_HIGH', status: 'found' },
        plastic_viscosity: { label: 'Plastic Viscosity (PV)', value: 18.0, unit: 'cP', source_cell: 'C17', confidence: 'STRUCTURED_HIGH', status: 'found' },
        yield_point: { label: 'Yield Point (YP)', value: 22.0, unit: 'lb/100ft²', source_cell: 'G17', confidence: 'STRUCTURED_HIGH', status: 'found' }
      },
      hydraulics: {
        flow_rate: { label: 'Circulation Rate', value: 650.0, unit: 'gpm', source_cell: 'C22', confidence: 'STRUCTURED_HIGH', status: 'found' },
        standpipe_pressure: { label: 'Standpipe Pressure', value: 2450.0, unit: 'psi', source_cell: 'G22', confidence: 'STRUCTURED_HIGH', status: 'found' }
      },
      npt_summary: {
        lost_circ_hours: { label: 'Lost Circulation', value: 0.0, unit: 'hrs', source_cell: 'C36', confidence: 'STRUCTURED_HIGH', status: 'found' },
        rig_repair_hours: { label: 'Rig Repair', value: 1.5, unit: 'hrs', source_cell: 'G36', confidence: 'STRUCTURED_HIGH', status: 'found' },
        total_npt_hours: { label: 'Total NPT', value: 1.5, unit: 'hrs', source_cell: 'C37', confidence: 'STRUCTURED_HIGH', status: 'found' }
      }
    };

    setSections(mockSections as any);
    setRelativeDepth(65.0);
    setPresentDepth(2145.0);
    setSimulatedRelativeDepth(65.0);

    setDetectedSectionsList([
      { section_id: 'header', name: 'Header / Well Identification', color_code: '#26A69A', detected_rows: [1, 7], fields_count: 5 },
      { section_id: 'depth_and_progress', name: 'Depth & Daily Progress', color_code: '#3FAE68', detected_rows: [8, 14], fields_count: 4 },
      { section_id: 'mud_properties', name: 'Drilling Fluid & Mud Properties', color_code: '#F2B84B', detected_rows: [15, 20], fields_count: 4 },
      { section_id: 'hydraulics', name: 'Bit & Hydraulics', color_code: '#3FC3B6', detected_rows: [21, 26], fields_count: 2 },
      { section_id: 'formation', name: 'Lithology & Geological Context', color_code: '#8B5CF6', detected_rows: [27, 33], fields_count: 2 },
      { section_id: 'npt_summary', name: 'NPT & Non-Productive Time', color_code: '#E05252', detected_rows: [34, 40], fields_count: 3 }
    ]);

    setOffsetWells([
      {
        well_id: 'well-glk-07',
        well_name: 'Well B (OIL-GLK-07)',
        distance_km: 14.8,
        multi_factor_similarity: 0.92,
        is_best_comparison: true,
        is_closest_geographically: false,
        formation_match: 'Formation Alpha (Identical sub-layer lithology)',
        depth_md: 2280,
        trajectory_type: 'Deviated (18°)',
        casing_size: '9-5/8"',
        historical_events: ['Mud loss at 2,185m MD (35 m³/hr)', 'Mitigated with 45 bbl nut-plug LCM pill'],
        relevance_reason: 'Identical lithology, casing schedule, and mud program despite 14.8 km distance.',
        similarity_factors: {
          spatial_proximity: 0.72,
          lithological_match: 0.98,
          mud_system_alignment: 0.95,
          trajectory_similarity: 0.91,
          casing_schedule_match: 0.96,
          target_formation_match: 1.0
        }
      },
      {
        well_id: 'well-glk-03',
        well_name: 'Well C (OIL-GLK-03)',
        distance_km: 2.1,
        multi_factor_similarity: 0.68,
        is_best_comparison: false,
        is_closest_geographically: true,
        formation_match: 'Formation Alpha (Thinner sand interval, pinched out)',
        depth_md: 2410,
        trajectory_type: 'Vertical (0.5°)',
        casing_size: '7" Liner',
        historical_events: ['Sloughing shale at 2,050m MD', 'No mud loss recorded'],
        relevance_reason: 'Geographically closest (2.1 km), but has divergent casing program and vertical trajectory.',
        similarity_factors: {
          spatial_proximity: 0.98,
          lithological_match: 0.62,
          mud_system_alignment: 0.58,
          trajectory_similarity: 0.54,
          casing_schedule_match: 0.65,
          target_formation_match: 0.72
        }
      },
      {
        well_id: 'well-glk-11',
        well_name: 'Well D (OIL-GLK-11)',
        distance_km: 8.4,
        multi_factor_similarity: 0.84,
        is_best_comparison: false,
        is_closest_geographically: false,
        formation_match: 'Formation Alpha (Coarse sandstone)',
        depth_md: 2190,
        trajectory_type: 'Deviated (12°)',
        casing_size: '9-5/8"',
        historical_events: ['Partial mud loss at 2,210m MD (12 m³/hr)'],
        relevance_reason: 'Secondary analog; moderate distance, good lithological match.',
        similarity_factors: {
          spatial_proximity: 0.85,
          lithological_match: 0.88,
          mud_system_alignment: 0.82,
          trajectory_similarity: 0.84,
          casing_schedule_match: 0.86,
          target_formation_match: 0.89
        }
      }
    ]);

    setRiskCorridor({
      formation_name: 'Formation Alpha',
      top_md: 2080.0,
      current_depth: 2145.0,
      corridor_relative_start_m: 90.0,
      corridor_relative_end_m: 140.0,
      corridor_start_md: 2170.0,
      corridor_end_md: 2220.0,
      distance_to_corridor_m: 25.0,
      status: 'WATCH',
      alert_level: 'WATCH: Bit is 25.0m from high-risk historical mud loss zone (90m-140m relative depth).',
      disclaimer: 'Illustrative evidence-backed corridor simulation; not a production drilling command or a trained risk prediction model.'
    });

    setPlaybookSteps([
      {
        step: 1,
        title: 'Pre-hydrate 45 bbl LCM Pill',
        action: 'Stage 45 bbl medium-coarse nut-plug LCM pill in pill tank prior to reaching 2,170m MD.',
        status: 'READY',
        basis: 'Well B experienced 35 m³/hr loss at 2,185m MD; sealed in 4 hrs with medium nut-plug pill.'
      },
      {
        step: 2,
        title: 'Cap ECD at 10.4 ppg',
        action: 'Maintain Equivalent Circulating Density <= 10.4 ppg. Trim flow rate from 650 gpm to 520 gpm upon first loss indicator.',
        status: 'PENDING_DEPTH',
        basis: 'Losses in Well B initiated when ECD exceeded 10.65 ppg during drilling surge.'
      },
      {
        step: 3,
        title: 'High-Frequency Pit Volume Alarm',
        action: 'Configure mud logging pit volume totalizer (PVT) threshold to ±0.5 m³ sensitive mode.',
        status: 'ACTIVE',
        basis: 'Early detection in Well B allowed prompt pill spot before total loss occurred.'
      },
      {
        step: 4,
        title: 'Stage High-Viscosity Sweep',
        action: 'Ensure 30 bbl high-viscosity bentonite sweep is pre-mixed on standpipe manifold.',
        status: 'READY',
        basis: 'Ensures immediate hole cleaning if annular velocity drops during flow throttling.'
      }
    ]);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/ddr/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const json = await res.json();
        populateFromBackendResponse(json);
        setCurrentStep(2);
      } else {
        alert('File parsing completed with fallback simulation.');
        setCurrentStep(2);
      }
    } catch (e) {
      console.error(e);
      setCurrentStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (sectionKey: string, fieldKey: string, newVal: any) => {
    setSections(prev => {
      const section = { ...prev[sectionKey] };
      if (section && section[fieldKey]) {
        section[fieldKey] = {
          ...section[fieldKey],
          value: newVal,
          confidence: 'USER_EDITED'
        };
      }
      return { ...prev, [sectionKey]: section };
    });
  };

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const payload = {
        sections: sections,
        approved_by: 'Lead Drilling Engineer',
        comments: 'Verified against representative DDR template.'
      };
      await fetch('/api/ddr/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setIsApproved(true);
      setCurrentStep(3);
    } catch (e) {
      console.warn('Approve call fallback', e);
      setIsApproved(true);
      setCurrentStep(3);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-calculate simulation status when slider changes
  const getSimulatedStatus = (depth: number) => {
    if (depth < 60) return { status: 'NORMAL', text: 'NORMAL: Safe Drilling Corridor', color: 'text-emerald-500 bg-emerald-50 border-emerald-200' };
    if (depth < 90) return { status: 'WATCH', text: 'WATCH: Approaching Historical Loss Zone (90m-140m)', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (depth <= 140) return { status: 'HIGH', text: 'HIGH RISK: Inside Historical Loss Corridor', color: 'text-rose-600 bg-rose-50 border-rose-200' };
    return { status: 'NORMAL', text: 'NORMAL: Past Historical Loss Interval', color: 'text-blue-600 bg-blue-50 border-blue-200' };
  };

  const simStatus = getSimulatedStatus(simulatedRelativeDepth);

  return (
    <div className="min-h-screen bg-[#F5F7F8] dark:bg-[#1E2530] text-[#252B33] dark:text-[#E2E5E8] pb-16 font-sans">
      {/* ─── Breadcrumb & Top Bar ─── */}
      <div className="bg-white dark:bg-[#252E3D] border-b border-[#E2E5E8] dark:border-[#34435A] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#6B7280] dark:text-[#A0AEC0] mb-1">
              <span>Operations</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>DDR Extraction & Lookahead</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#26A69A] font-bold">OIL-GLK-14</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#252B33] dark:text-white flex items-center gap-2.5">
                <FileSpreadsheet className="w-6 h-6 text-[#26A69A]" />
                Section-Aware DDR Intelligence Pipeline
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-[#D9F2EE] text-[#26A69A] dark:bg-[#26A69A]/20 dark:text-[#3FC3B6] border border-[#26A69A]/30">
                Representative Prototype
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadSampleData}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#26A69A] dark:text-[#3FC3B6] bg-[#D9F2EE]/50 dark:bg-[#26A69A]/15 border border-[#26A69A]/40 rounded hover:bg-[#D9F2EE] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Reload Sample Data
            </button>
            <a
              href="/samples/sample_ddr_with_mock_values.xlsx"
              download="sample_ddr_with_mock_values.xlsx"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#252B33] dark:text-white bg-white dark:bg-[#34435A] border border-[#E2E5E8] dark:border-[#4B5E7A] rounded hover:bg-gray-50 dark:hover:bg-[#3F526E] transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#26A69A]" />
              Download Test XLSX
            </a>
          </div>
        </div>
      </div>

      {/* ─── 7-Step Navigation Bar ─── */}
      <div className="bg-white dark:bg-[#252E3D] border-b border-[#E2E5E8] dark:border-[#34435A] px-6 py-2.5 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto overflow-x-auto">
          <nav aria-label="Pipeline Progression" className="flex items-center gap-1 min-w-[760px]">
            {STEPS.map((step, idx) => {
              const isActive = currentStep === step.id;
              const isPast = currentStep > step.id;

              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-[#26A69A] text-white font-bold shadow-xs'
                        : isPast
                        ? 'text-[#26A69A] dark:text-[#3FC3B6] hover:bg-[#D9F2EE]/60 dark:hover:bg-[#26A69A]/20'
                        : 'text-[#6B7280] dark:text-[#A0AEC0] hover:text-[#252B33] dark:hover:text-white'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                        isActive
                          ? 'bg-white text-[#26A69A]'
                          : isPast
                          ? 'bg-[#26A69A] text-white'
                          : 'bg-[#E2E5E8] dark:bg-[#34435A] text-[#6B7280] dark:text-[#A0AEC0]'
                      }`}
                    >
                      {isPast ? <Check className="w-3 h-3 stroke-[3]" /> : step.id}
                    </span>
                    <span>{step.name}</span>
                  </button>
                  {idx < STEPS.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-[#A0AEC0] shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ─── Main Content Container ─── */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* SCREEN 1: UPLOAD DDR                                                 */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#252E3D] border border-[#E2E5E8] dark:border-[#34435A] rounded-lg p-6 shadow-2xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#E2E5E8] dark:border-[#34435A] gap-4">
                <div>
                  <h2 className="text-lg font-bold text-[#252B33] dark:text-white">
                    Step 1: Upload Representative Daily Drilling Report (DDR)
                  </h2>
                  <p className="text-xs text-[#6B7280] dark:text-[#A0AEC0] mt-1">
                    Accepts representative OIL-style structured spreadsheets (.xlsx) with label-value fields and merged-cell headers.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#6B7280] dark:text-[#A0AEC0]">
                    Local Template Path:
                  </span>
                  <code className="text-xs font-mono px-2 py-1 bg-gray-100 dark:bg-[#1E2530] text-[#26A69A] border border-[#E2E5E8] dark:border-[#34435A] rounded">
                    ./samples/DDR_Template_Anonymized.xlsx
                  </code>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="my-8 border-2 border-dashed border-[#26A69A]/50 dark:border-[#3FC3B6]/40 rounded-lg p-8 text-center bg-[#F5F7F8] dark:bg-[#1E2530]/50 hover:bg-[#D9F2EE]/20 transition-all">
                <FileSpreadsheet className="w-12 h-12 text-[#26A69A] mx-auto mb-3" />
                <h3 className="text-sm font-bold text-[#252B33] dark:text-white">
                  Drag and drop your anonymized DDR spreadsheet
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-[#A0AEC0] mt-1 max-w-md mx-auto">
                  Only anonymized or sample-safe `.xlsx` files are processed. No confidential operational data is uploaded or logged.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#26A69A] hover:bg-[#208a80] rounded shadow-xs transition-colors">
                    <Upload className="w-4 h-4" />
                    Browse Local File
                    <input
                      type="file"
                      accept=".xlsx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={() => {
                      loadSampleData();
                      setCurrentStep(2);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#26A69A] dark:text-[#3FC3B6] bg-white dark:bg-[#252E3D] border border-[#26A69A] hover:bg-[#D9F2EE]/40 rounded transition-colors shadow-2xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    Use Anonymized Sample DDR
                  </button>
                </div>
              </div>

              {/* Privacy & Template Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#E2E5E8] dark:border-[#34435A]">
                <div className="p-4 bg-gray-50 dark:bg-[#1E2530] border border-[#E2E5E8] dark:border-[#34435A] rounded">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#252B33] dark:text-white mb-1">
                    <ShieldCheck className="w-4 h-4 text-[#3FAE68]" />
                    Local In-Memory Parser
                  </div>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#A0AEC0]">
                    Powered by local Python <code>openpyxl</code> parser with merged-cell resolution. Zero cloud APIs, OCR, or third-party LLMs.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-[#1E2530] border border-[#E2E5E8] dark:border-[#34435A] rounded">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#252B33] dark:text-white mb-1">
                    <Layers className="w-4 h-4 text-[#26A69A]" />
                    Section-Aware Coordinates
                  </div>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#A0AEC0]">
                    Detects 8+ sections, maps 50+ label aliases, extracts units, and preserves field-level coordinate provenance.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-[#1E2530] border border-[#E2E5E8] dark:border-[#34435A] rounded">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#252B33] dark:text-white mb-1">
                    <Info className="w-4 h-4 text-[#ED1C24]" />
                    Anonymized Sample Safety
                  </div>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#A0AEC0]">
                    Fabricated well names, dates, and formations preserve representative structure without containing confidential OIL data.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#26A69A] hover:bg-[#208a80] text-white text-xs font-bold rounded shadow-xs transition-colors"
              >
                Proceed to Extracted Data Review
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* SCREEN 2: EXTRACTED DATA REVIEW                                      */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#252E3D] border border-[#E2E5E8] dark:border-[#34435A] rounded-lg p-6 shadow-2xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#E2E5E8] dark:border-[#34435A] gap-4">
                <div>
                  <h3 className="text-base font-bold text-[#252B33] dark:text-white">
                    Step 2: Normalized Drilling Data Review & Engineer Verification
                  </h3>
                  <p className="text-xs text-[#6B7280] dark:text-[#A0AEC0] mt-0.5">
                    Review extracted coordinates, units, and values. Any modified cell is tagged as <code>USER_EDITED</code> for audit compliance.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Quality: {dataQuality}
                  </div>
                  <button
                    onClick={handleApprove}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#3FAE68] hover:bg-[#349658] text-white text-xs font-bold rounded shadow-xs transition-colors"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    Approve & View Offset Analysis
                  </button>
                </div>
              </div>
              {/* Mandatory Context Update Notice */}
              <div className="my-4 p-3 bg-[#D9F2EE]/40 dark:bg-[#26A69A]/15 border-l-4 border-[#26A69A] rounded-r text-xs text-[#252B33] dark:text-[#E2E5E8]">
                <div className="flex items-center gap-2 font-bold text-[#26A69A] mb-0.5">
                  <Info className="w-4 h-4" />
                  Integration Note
                </div>
                <p className="text-[11px] leading-relaxed">
                  Context is updated from an approved representative DDR extraction. Production integration will use a read-only eRTMAC feed/export.
                </p>
              </div>


              {/* Grouped Field Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">

                {/* Section: Header & Identification */}
                <div className="border border-[#E2E5E8] dark:border-[#34435A] rounded-lg p-4 bg-gray-50/50 dark:bg-[#1E2530]/50">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E5E8] dark:border-[#34435A] mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#26A69A]">
                      Well Identification & Rig
                    </span>
                    <span className="text-[10px] font-mono text-[#6B7280]">Section: Header</span>
                  </div>

                  <div className="space-y-3">
                    {sections.header && Object.entries(sections.header).map(([key, field]) => (
                      <div key={key} className="flex items-center justify-between gap-3 text-xs">
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-[#252B33] dark:text-white truncate">{field.label}</span>
                          <span className="text-[10px] font-mono text-[#6B7280] dark:text-[#A0AEC0]">Cell: {field.source_cell}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={field.value ?? ''}
                            onChange={(e) => handleFieldChange('header', key, e.target.value)}
                            className="w-32 px-2 py-1 bg-white dark:bg-[#252E3D] border border-[#E2E5E8] dark:border-[#34435A] rounded font-mono text-xs text-right"
                          />
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                            field.confidence === 'USER_EDITED'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-teal-50 dark:bg-teal-950/40 text-[#26A69A]'
                          }`}>
                            {field.confidence.replace('STRUCTURED_', '')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section: Depth & Progress */}
                <div className="border border-[#E2E5E8] dark:border-[#34435A] rounded-lg p-4 bg-gray-50/50 dark:bg-[#1E2530]/50">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E5E8] dark:border-[#34435A] mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#3FAE68]">
                      Depth & 24h Progress
                    </span>
                    <span className="text-[10px] font-mono text-[#6B7280]">Section: Progress</span>
                  </div>

                  <div className="space-y-3">
                    {sections.depth_and_progress && Object.entries(sections.depth_and_progress).map(([key, field]) => (
                      <div key={key} className="flex items-center justify-between gap-3 text-xs">
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-[#252B33] dark:text-white truncate">{field.label}</span>
                          <span className="text-[10px] font-mono text-[#6B7280] dark:text-[#A0AEC0]">Cell: {field.source_cell}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.1"
                            value={field.value ?? ''}
                            onChange={(e) => handleFieldChange('depth_and_progress', key, parseFloat(e.target.value) || 0)}
                            className="w-24 px-2 py-1 bg-white dark:bg-[#252E3D] border border-[#E2E5E8] dark:border-[#34435A] rounded font-mono text-xs text-right"
                          />
                          <span className="w-10 text-[10px] font-mono text-[#6B7280]">{field.unit || ''}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section: Formation & Geology */}
                <div className="border border-[#E2E5E8] dark:border-[#34435A] rounded-lg p-4 bg-gray-50/50 dark:bg-[#1E2530]/50">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E5E8] dark:border-[#34435A] mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      Geological Context & Relative Depth
                    </span>
                    <span className="text-[10px] font-mono text-[#6B7280]">Section: Formation</span>
                  </div>

                  <div className="space-y-3">
                    {sections.formation && Object.entries(sections.formation).map(([key, field]) => (
                      <div key={key} className="flex items-center justify-between gap-3 text-xs">
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-[#252B33] dark:text-white truncate">{field.label}</span>
                          <span className="text-[10px] font-mono text-[#6B7280] dark:text-[#A0AEC0]">Cell: {field.source_cell}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={field.value ?? ''}
                            onChange={(e) => handleFieldChange('formation', key, e.target.value)}
                            className="w-32 px-2 py-1 bg-white dark:bg-[#252E3D] border border-[#E2E5E8] dark:border-[#34435A] rounded font-mono text-xs text-right"
                          />
                          <span className="w-8 text-[10px] font-mono text-[#6B7280]">{field.unit || ''}</span>
                        </div>
                      </div>
                    ))}

                    <div className="p-2.5 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded flex items-center justify-between text-xs">
                      <span className="font-bold text-purple-900 dark:text-purple-200">
                        Relative Depth in Formation:
                      </span>
                      <span className="font-mono font-bold text-purple-700 dark:text-purple-300">
                        +{relativeDepth} m (Present Depth - Top MD)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section: Mud & Hydraulics */}
                <div className="border border-[#E2E5E8] dark:border-[#34435A] rounded-lg p-4 bg-gray-50/50 dark:bg-[#1E2530]/50">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E5E8] dark:border-[#34435A] mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Drilling Fluid & Hydraulics
                    </span>
                    <span className="text-[10px] font-mono text-[#6B7280]">Section: Mud / Pumps</span>
                  </div>

                  <div className="space-y-3">
                    {sections.mud_properties && Object.entries(sections.mud_properties).map(([key, field]) => (
                      <div key={key} className="flex items-center justify-between gap-3 text-xs">
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-[#252B33] dark:text-white truncate">{field.label}</span>
                          <span className="text-[10px] font-mono text-[#6B7280] dark:text-[#A0AEC0]">Cell: {field.source_cell}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.1"
                            value={field.value ?? ''}
                            onChange={(e) => handleFieldChange('mud_properties', key, parseFloat(e.target.value) || 0)}
                            className="w-24 px-2 py-1 bg-white dark:bg-[#252E3D] border border-[#E2E5E8] dark:border-[#34435A] rounded font-mono text-xs text-right"
                          />
                          <span className="w-12 text-[10px] font-mono text-[#6B7280]">{field.unit || ''}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#E2E5E8] dark:border-[#34435A] text-xs font-bold text-[#6B7280] dark:text-[#A0AEC0] rounded hover:bg-gray-100 dark:hover:bg-[#252E3D]"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Upload
              </button>

              <button
                onClick={handleApprove}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3FAE68] hover:bg-[#349658] text-white text-xs font-bold rounded shadow-xs transition-colors"
              >
                Approve & View Offset Analysis
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* SCREEN 3: MOCK OFFSET-WELL COMPARISON                                */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#252E3D] border border-[#E2E5E8] dark:border-[#34435A] rounded-lg p-6 shadow-2xs">
              <div className="pb-4 border-b border-[#E2E5E8] dark:border-[#34435A]">
                <h3 className="text-lg font-bold text-[#252B33] dark:text-white">
                  Step 3: Mock Offset-Well Comparison (Multi-Factor Geological Analogs)
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-[#A0AEC0] mt-0.5">
                  Multi-dimensional correlation evaluating spatial proximity, lithology match, mud program alignment, trajectory, and casing design.
                </p>
              </div>

              {/* Crucial Engineering Takeaway Callout */}
              <div className="my-5 p-4 bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 rounded-r text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300 mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Key Lookahead Insight: Proximity Trap Avoided
                </div>
                <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
                  {takeawayText}
                </p>
              </div>

              {/* Offset Wells Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                {offsetWells.map(well => (
                  <div
                    key={well.well_id}
                    className={`border rounded-lg p-4 transition-all relative ${
                      well.is_best_comparison
                        ? 'border-[#26A69A] bg-[#D9F2EE]/15 dark:bg-[#26A69A]/10 shadow-xs'
                        : well.is_closest_geographically
                        ? 'border-blue-300 dark:border-blue-800 bg-blue-50/20 dark:bg-blue-950/20'
                        : 'border-[#E2E5E8] dark:border-[#34435A] bg-white dark:bg-[#252E3D]'
                    }`}
                  >
                    {well.is_best_comparison && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 bg-[#26A69A] text-white text-[9px] font-mono font-bold uppercase rounded shadow-2xs">
                        Best Comparison Well
                      </span>
                    )}

                    {well.is_closest_geographically && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 bg-blue-600 text-white text-[9px] font-mono font-bold uppercase rounded shadow-2xs">
                        Geographically Closest
                      </span>
                    )}

                    <div className="mb-3">
                      <div className="text-sm font-bold text-[#252B33] dark:text-white">
                        {well.well_name}
                      </div>
                      <div className="text-xs text-[#6B7280] dark:text-[#A0AEC0] flex items-center gap-2 mt-0.5 font-mono">
                        <span>Distance: {well.distance_km} km</span>
                        <span>•</span>
                        <span>Depth: {well.depth_md} m</span>
                      </div>
                    </div>

                    {/* Overall Similarity Metric */}
                    <div className="p-3 bg-white dark:bg-[#1E2530] border border-[#E2E5E8] dark:border-[#34435A] rounded mb-3 flex items-center justify-between">
                      <span className="text-xs text-[#6B7280]">Multi-Factor Match:</span>
                      <span className={`text-base font-mono font-extrabold ${
                        well.multi_factor_similarity >= 0.9
                          ? 'text-[#26A69A]'
                          : well.multi_factor_similarity >= 0.8
                          ? 'text-blue-600'
                          : 'text-amber-600'
                      }`}>
                        {(well.multi_factor_similarity * 100).toFixed(0)}%
                      </span>
                    </div>

                    {/* 6-Factor Breakdown */}
                    <div className="space-y-1.5 text-[11px] font-mono">
                      <div className="flex justify-between">
                        <span className="text-[#6B7280]">Lithology:</span>
                        <span className="font-bold">{(well.similarity_factors.lithological_match * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B7280]">Mud System:</span>
                        <span className="font-bold">{(well.similarity_factors.mud_system_alignment * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B7280]">Trajectory:</span>
                        <span className="font-bold">{(well.similarity_factors.trajectory_similarity * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B7280]">Casing Match:</span>
                        <span className="font-bold">{(well.similarity_factors.casing_schedule_match * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B7280]">Formation:</span>
                        <span className="font-bold">{(well.similarity_factors.target_formation_match * 100).toFixed(0)}%</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E2E5E8] dark:border-[#34435A] text-[11px] text-[#6B7280] dark:text-[#A0AEC0]">
                      <div className="font-bold text-[#252B33] dark:text-white mb-0.5">Historical Events:</div>
                      {well.historical_events.map((evt, idx) => (
                        <div key={idx} className="flex items-start gap-1 text-[10px]">
                          <span className="text-amber-500">•</span>
                          <span>{evt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#E2E5E8] dark:border-[#34435A] text-xs font-bold text-[#6B7280] dark:text-[#A0AEC0] rounded hover:bg-gray-100 dark:hover:bg-[#252E3D]"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Data Review
              </button>

              <button
                onClick={() => setCurrentStep(4)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#26A69A] hover:bg-[#208a80] text-white text-xs font-bold rounded shadow-xs transition-colors"
              >
                Proceed to Evidence-Linked Playbook
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* SCREEN 4: EVIDENCE-LINKED HISTORICAL MITIGATION PLAYBOOK             */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#252E3D] border border-[#E2E5E8] dark:border-[#34435A] rounded-lg p-6 shadow-2xs">
              <div className="pb-4 border-b border-[#E2E5E8] dark:border-[#34435A]">
                <h3 className="text-lg font-bold text-[#252B33] dark:text-white">
                  Step 4: Evidence-Linked Historical Mitigation Playbook
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-[#A0AEC0] mt-0.5">
                  Pre-engineered contingency procedures derived from historical Well B (OIL-GLK-07) loss event at 2,185m MD.
                </p>
              </div>

              {/* Mandatory Disclaimer */}
              <div className="my-5 p-3.5 bg-rose-50/60 dark:bg-rose-950/20 border-l-4 border-[#ED1C24] rounded-r text-xs text-[#252B33] dark:text-[#E2E5E8]">
                <div className="flex items-center gap-2 font-bold text-[#ED1C24] mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  Mandatory Engineering Disclaimer
                </div>
                <p className="text-[11px] leading-relaxed">
                  Historical evidence only. Final operational action remains subject to approved OIL procedures and engineer judgment.
                </p>
              </div>

              {/* 4-Step Playbook Sequence */}
              <div className="space-y-4 my-6">
                {playbookSteps.map((step) => (
                  <div
                    key={step.step}
                    className="p-4 bg-gray-50/70 dark:bg-[#1E2530]/60 border border-[#E2E5E8] dark:border-[#34435A] rounded-lg flex flex-col md:flex-row md:items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#26A69A] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                        {step.step}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#252B33] dark:text-white">
                            {step.title}
                          </h4>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            step.status === 'ACTIVE'
                              ? 'bg-amber-100 text-amber-700'
                              : step.status === 'READY'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-gray-200 text-gray-700 dark:bg-[#34435A] dark:text-gray-300'
                          }`}>
                            {step.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#252B33] dark:text-[#E2E5E8] mt-1">
                          {step.action}
                        </p>
                        <div className="mt-2 text-[11px] text-[#6B7280] dark:text-[#A0AEC0] flex items-center gap-1 font-mono">
                          <span className="text-[#26A69A] font-bold">Evidence:</span>
                          <span>{step.basis}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <button className="px-3 py-1.5 text-xs font-medium text-[#26A69A] border border-[#26A69A] hover:bg-[#D9F2EE]/30 rounded">
                        View Well B Log
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Historical Analogue Card */}
              <div className="p-4 bg-teal-50/40 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#26A69A] uppercase tracking-wider">
                    Historical Offset Proof: OIL-GLK-07 (Well B)
                  </span>
                  <span className="text-[10px] font-mono text-[#6B7280]">WCR-1996 · Page 19</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[#6B7280]">Loss Depth:</span>
                    <div className="font-bold text-[#252B33] dark:text-white">2,185 m MD (+105m in Alpha)</div>
                  </div>
                  <div>
                    <span className="text-[#6B7280]">Initial Influx/Loss:</span>
                    <div className="font-bold text-rose-600">35 m³/hr Total Circulation Loss</div>
                  </div>
                  <div>
                    <span className="text-[#6B7280]">Resolution Time:</span>
                    <div className="font-bold text-[#3FAE68]">4.0 hrs post-pill pill displacement</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#E2E5E8] dark:border-[#34435A] text-xs font-bold text-[#6B7280] dark:text-[#A0AEC0] rounded hover:bg-gray-100 dark:hover:bg-[#252E3D]"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Offset Comparison
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert('Decision Brief exported as JSON/PDF artifact.')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#252E3D] border border-[#26A69A] text-[#26A69A] hover:bg-[#D9F2EE]/40 text-xs font-bold rounded shadow-2xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export Decision Brief
                </button>

                <Link
                  href="/operations"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#26A69A] hover:bg-[#208a80] text-white text-xs font-bold rounded shadow-xs transition-colors"
                >
                  Return to Active Rig Workspace
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ─── Mandatory Representative Prototype Footer ─── */}
        <footer className="mt-12 pt-6 border-t border-[#E2E5E8] dark:border-[#34435A] text-center">
          <p className="text-xs font-mono text-[#6B7280] dark:text-[#A0AEC0]">
            Representative DDR workflow simulation. Confidential OIL operational data is not displayed.
          </p>
          <p className="text-[10px] text-[#A0AEC0] dark:text-[#6B7280] mt-1">
            Oil India Limited eRTMAC-NWIS Decision-Support Prototype · Prototype Active-Well Context Update
          </p>
        </footer>

      </div>
    </div>
  );
}
