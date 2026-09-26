'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Activity,
  Layers,
  Compass,
  ArrowRight,
  FileText,
  ExternalLink,
  SlidersHorizontal,
  Info,
  Check,
  Sparkles,
  Search,
  Eye,
  Database,
  Radio,
  Clock,
  Gauge,
  Thermometer,
  Wind,
  Droplets,
  MapPin,
  Zap,
  ArrowUpDown
} from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { INITIAL_LIVE_TELEMETRY } from '@/data/live-state';
import { DepthTrack } from '@/components/common/DepthTrack';
import { MultiWellCorrelationTrack } from '@/components/common/MultiWellCorrelationTrack';
import { EvidenceInspectorDrawer } from '@/components/common/EvidenceInspectorDrawer';
import { StatusTag } from '@/components/common/StatusTag';
import { MitigationPlaybookCard } from '@/components/playbook/MitigationPlaybookCard';

// High-fidelity offset wells data for OIL-GLK-14 active workspace
const GELEKI_OFFSET_WELLS = [
  {
    id: 'well-glk-07',
    name: 'OIL-GLK-07',
    spudYear: '1996',
    distanceKm: 3.1,
    similarityScore: 0.84,
    isBestComparison: true,
    isGeographicallyClosest: false,
    formationMatch: 'Upper Tipam Sandstone (Exact Lithology Match)',
    depthAlignment: '2,280m MD (Δ +114.6m from active bit)',
    trajectoryType: 'Deviated (18° Inc, S-Profile)',
    historicalEvent: 'Total Lost Circulation (35 m³/hr)',
    mitigationUsed: '45 bbl medium-nut-plug LCM pill + ECD capped @ 10.4 ppg',
    nptHours: 34,
    sourceConfidence: 'OCR-HIGH',
    sourceRef: 'WCR-GLK-07-1996 · Page 19',
    status: 'incident'
  },
  {
    id: 'well-glk-02',
    name: 'OIL-GLK-02',
    spudYear: '1981',
    distanceKm: 2.1,
    similarityScore: 0.42,
    isBestComparison: false,
    isGeographicallyClosest: true,
    formationMatch: 'Girujan Clay Boundary (Fault Block Shift)',
    depthAlignment: '2,195m MD (Sealed interval)',
    trajectoryType: 'Vertical (Un-deviated)',
    historicalEvent: 'Minor seepage (1.5 m³/hr)',
    mitigationUsed: 'Weighted mud sweep',
    nptHours: 4,
    sourceConfidence: 'OCR-LOW',
    sourceRef: 'DDR-GLK-02-1981 · Page 15',
    status: 'incident'
  },
  {
    id: 'well-glk-03',
    name: 'OIL-GLK-03',
    spudYear: '1988',
    distanceKm: 1.8,
    similarityScore: 0.79,
    isBestComparison: false,
    isGeographicallyClosest: false,
    formationMatch: 'Upper Tipam Sandstone',
    depthAlignment: '2,215m MD (Δ +49.6m from active bit)',
    trajectoryType: 'Deviated (14° Inc)',
    historicalEvent: 'Moderate Mud Loss (22 m³/hr)',
    mitigationUsed: '30 ppb mica/calcium carbonate pill',
    nptHours: 18,
    sourceConfidence: 'STRUCTURED-HIGH',
    sourceRef: 'WCR-GLK-03-1988 · Page 42',
    status: 'incident'
  },
  {
    id: 'well-glk-11',
    name: 'OIL-GLK-11',
    spudYear: '2012',
    distanceKm: 1.4,
    similarityScore: 0.76,
    isBestComparison: false,
    isGeographicallyClosest: false,
    formationMatch: 'Upper Tipam Sandstone',
    depthAlignment: '2,235m MD (Δ +69.6m from active bit)',
    trajectoryType: 'Deviated (22° Inc)',
    historicalEvent: 'Partial Loss (14 m³/hr)',
    mitigationUsed: 'Pre-treated active mud with 20 ppb fiber LCM',
    nptHours: 11,
    sourceConfidence: 'OCR-HIGH',
    sourceRef: 'DDR-GLK-11-2012 · Page 104',
    status: 'incident'
  },
  {
    id: 'well-glk-05',
    name: 'OIL-GLK-05',
    spudYear: '2001',
    distanceKm: 2.8,
    similarityScore: 0.72,
    isBestComparison: false,
    isGeographicallyClosest: false,
    formationMatch: 'Upper Tipam Sandstone',
    depthAlignment: '2,240m MD (Traversed Safely)',
    trajectoryType: 'Deviated (16° Inc)',
    historicalEvent: 'Zero Incidents (Clean Passage)',
    mitigationUsed: 'ECD strictly capped < 10.3 ppg; pre-emptive LCM pill',
    nptHours: 0,
    sourceConfidence: 'STRUCTURED-HIGH',
    sourceRef: 'WCR-GLK-05-2001 · Page 28',
    status: 'clean'
  }
];

export default function OperationsPage() {
  const { currentRole, alerts, acknowledgeAlert } = useAppStore();
  const [selectedWell, setSelectedWell] = useState(GELEKI_OFFSET_WELLS[0]);
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'similarity' | 'distance'>('similarity');
  const [alertAcknowledged, setAlertAcknowledged] = useState<boolean>(false);

  const liveData = INITIAL_LIVE_TELEMETRY;
  const currentDepth = liveData.depthMD; // 2,165.4m
  const hazardStartDepth = 2240; // 2,240m MD
  const distanceToHazard = Math.round((hazardStartDepth - currentDepth) * 10) / 10; // 74.6m

  const sortedOffsets = [...GELEKI_OFFSET_WELLS].sort((a, b) => {
    if (activeTab === 'distance') return a.distanceKm - b.distanceKm;
    return b.similarityScore - a.similarityScore;
  });

  const handleAcknowledge = () => {
    acknowledgeAlert('alert-glk-14-loss', 'Acknowledged by shift engineer. LCM pill preparation initiated on deck.');
    setAlertAcknowledged(true);
  };

  return (
    <div className="space-y-5 max-w-[1520px] mx-auto pb-12 animate-in fade-in duration-150">

      {/* ─── A. TOP LIVE-STATE STRIP (eRTMAC Read-Only Feed) ─── */}
      <section className="rounded-2xl border border-neutral-200 dark:border-[#1e273b] bg-white dark:bg-[#0e121a] p-4 sm:p-5 shadow-xs transition-colors">

        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-[#1a2233]">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-mono">
                OIL-GLK-14
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                DRILLING IN PROGRESS
              </span>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-sans">
              Field: <strong className="text-neutral-900 dark:text-neutral-200">Geleki</strong> · Basin: <strong className="text-neutral-900 dark:text-neutral-200">Assam–Arakan Basin</strong> · Rig: <strong className="text-neutral-900 dark:text-neutral-200">OIL-E2000-IV</strong> · Spud: <span className="font-mono">12-Jul-2026</span>
            </p>
          </div>
        </div>

        {/* Live Telemetry KPI Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4">

          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#121722] border border-neutral-200/80 dark:border-[#1a2333] space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase">
              <span>BIT DEPTH (MD)</span>
              <Gauge className="w-3 h-3 text-neutral-400" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold font-mono text-neutral-950 dark:text-white">
              {liveData.depthMD} <span className="text-xs font-normal text-neutral-500">m</span>
            </div>
            <div className="text-[10px] text-neutral-500 font-mono">
              TVD: 2,110.2 m
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#121722] border border-neutral-200/80 dark:border-[#1a2333] space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase">
              <span>FORMATION</span>
              <Layers className="w-3 h-3 text-amber-500" />
            </div>
            <div className="text-sm font-extrabold font-mono text-amber-600 dark:text-amber-400 truncate">
              Upper Tipam
            </div>
            <div className="text-[10px] text-neutral-500 font-mono truncate">
              Tipam Sandstone (12-1/4&quot;)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#121722] border border-neutral-200/80 dark:border-[#1a2333] space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase">
              <span>RATE OF PENETRATION</span>
              <Activity className="w-3 h-3 text-emerald-500" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold font-mono text-neutral-950 dark:text-white">
              {liveData.rop} <span className="text-xs font-normal text-neutral-500">m/h</span>
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
              Stable ROP Trend
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#121722] border border-neutral-200/80 dark:border-[#1a2333] space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase">
              <span>TORQUE</span>
              <Wind className="w-3 h-3 text-neutral-400" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold font-mono text-neutral-950 dark:text-white">
              {liveData.torque} <span className="text-xs font-normal text-neutral-500">kft-lb</span>
            </div>
            <div className="text-[10px] text-neutral-500 font-mono">
              WOB: 16.5 klbs
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#121722] border border-neutral-200/80 dark:border-[#1a2333] space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase">
              <span>MUD WEIGHT (IN)</span>
              <Droplets className="w-3 h-3 text-amber-500" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
              {liveData.mudWeightIn} <span className="text-xs font-normal text-neutral-500">ppg</span>
            </div>
            <div className="text-[10px] text-neutral-500 font-mono">
              Water-Based Mud (WBM)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#121722] border border-neutral-200/80 dark:border-[#1a2333] space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase">
              <span>STANDPIPE PRESSURE</span>
              <Thermometer className="w-3 h-3 text-neutral-400" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold font-mono text-neutral-950 dark:text-white">
              {liveData.standpipePressure} <span className="text-xs font-normal text-neutral-500">psi</span>
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
              Flow Out: {liveData.flowOutPercent}%
            </div>
          </div>

        </div>

      </section>

      {/* ─── B. CENTRAL PROACTIVE OPERATIONAL ALERT PANEL ─── */}
      <section className="rounded-none border-2 border-[#E05252] bg-[#FDF2F2] dark:bg-[#1a1215] p-5 sm:p-6 shadow-md relative overflow-hidden">

        {/* Top Lookahead Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E05252]/30">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#ED1C24] text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2 py-0.5 rounded-none bg-[#ED1C24] text-white font-mono text-[10px] font-extrabold">
                  HIGH SEVERITY
                </span>
                <span className="px-2 py-0.5 rounded-none bg-[#222222] text-[#D9F2EE] font-mono text-[10px] font-bold">
                  {distanceToHazard}m Buffer Ahead
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#ED1C24] dark:text-[#ff6b6b] font-mono">
                Approaching Historical Lost Circulation Corridor (2,240–2,350 m MD)
              </h2>
            </div>
          </div>

          {/* Metric Confidence Badges */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-none bg-white dark:bg-[#151c2a] border border-[#E2E5E8] dark:border-[#222d42] text-[#252B33] dark:text-neutral-200">
              <span className="text-[#6B7280] text-[10px] block font-bold">COMPOSITE CONFIDENCE</span>
              <strong className="text-[#26A69A] text-sm">0.82 (High)</strong>
            </div>
            <div className="px-3 py-1.5 rounded-none bg-white dark:bg-[#151c2a] border border-[#E2E5E8] dark:border-[#222d42] text-[#252B33] dark:text-neutral-200">
              <span className="text-[#6B7280] text-[10px] block font-bold">OFFSET EVIDENCE</span>
              <strong className="text-[#252B33] dark:text-white text-sm">5 Analogous Wells</strong>
            </div>
          </div>
        </div>

        {/* ─── STRICT 3-PART SEPARATION: FACT vs ESTIMATE vs MITIGATION ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-5">

          {/* 1. OBSERVED HISTORICAL FACT */}
          <div className="rounded-none border border-[#E2E5E8] dark:border-[#222c40] bg-white dark:bg-[#121724] p-4 flex flex-col justify-between shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E5E8] dark:border-[#1d2638]">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#252B33] dark:text-neutral-300">
                  1. Observed Historical Fact
                </span>
                <span className="px-1.5 py-0.2 rounded-none bg-[#D9F2EE] text-[#26A69A] font-mono text-[9px] font-bold">
                  GROUND TRUTH
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#252B33] dark:text-neutral-200 leading-relaxed font-sans">
                <strong>5 offset wells</strong> in Geleki encountering Upper Tipam sandstones experienced severe lost circulation (12–35 m³/hr) between 2,180 m and 2,350 m MD. Historical average NPT: <strong>28.4 hours lost per incident</strong> (~$420k loss).
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E2E5E8] dark:border-[#1d2638] text-[11px] font-mono text-[#6B7280] dark:text-neutral-400 flex items-center justify-between">
              <span>Primary Analog: <strong className="text-[#252B33] dark:text-white">OIL-GLK-07</strong></span>
              <span className="text-[#ED1C24] font-bold">WCR-1996/p19</span>
            </div>
          </div>

          {/* 2. MODEL-ESTIMATED RISK */}
          <div className="rounded-none border border-[#F2B84B] dark:border-[#F2B84B]/60 bg-white dark:bg-[#121724] p-4 flex flex-col justify-between shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E5E8] dark:border-[#1d2638]">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#252B33] dark:text-neutral-200">
                  2. Model-Estimated Risk
                </span>
                <span className="px-1.5 py-0.2 rounded-none bg-[#F2B84B]/20 text-[#252B33] font-mono text-[9px] font-bold">
                  SIMILARITY LOOKAHEAD
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#252B33] dark:text-neutral-200 leading-relaxed font-sans">
                Current trajectory and formation-relative depth indicate imminent entry into micro-fractured thief sandstones within approximately <strong>74.6 m MD</strong>. Excessive ECD (&gt;10.4 ppg) is <strong>68% correlated</strong> with immediate severe fluid loss.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E2E5E8] dark:border-[#1d2638] text-[11px] font-mono text-[#6B7280] dark:text-neutral-400 flex items-center justify-between">
              <span>Lithology Twin: <strong className="text-[#26A69A]">0.84 Similarity</strong></span>
              <span>Lookahead: ~3.2 hrs</span>
            </div>
          </div>

          {/* 3. SUGGESTED MITIGATION (Advisory) */}
          <div className="rounded-none border-2 border-[#3FC3B6] bg-[#D9F2EE]/40 dark:bg-[#112423] p-4 flex flex-col justify-between shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#3FC3B6]/40">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#26A69A] dark:text-[#3FC3B6]">
                  3. Suggested Mitigation
                </span>
                <span className="px-1.5 py-0.2 rounded-none bg-[#26A69A] text-white font-mono text-[9px] font-bold">
                  ENGINEERING ADVISORY
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#252B33] dark:text-white leading-relaxed font-medium font-sans">
                Review historical mitigation program: <strong>Stage 35 ppb mixed-fiber LCM pill</strong> in active suction pit prior to 2,190 m MD; <strong>Cap ECD at 10.4 ppg</strong>; Standby secondary cement squeezer on deck. (Proven recovery in OIL-GLK-07 &amp; OIL-GLK-11).
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#3FC3B6]/40 text-[11px] font-mono text-[#26A69A] dark:text-[#3FC3B6] flex items-center justify-between">
              <span>Non-Binding Decision Support</span>
              <span className="font-bold">Advisory Only</span>
            </div>
          </div>

        </div>

        {/* Provenance & Disconfirming Clean Evidence Bar */}
        <div className="mt-4 pt-3 border-t border-[#E05252]/20 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">

          {/* Provenance Composition */}
          <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
            <span className="text-[#6B7280] dark:text-neutral-400">Source Provenance:</span>
            <span className="px-2 py-0.5 rounded-none bg-[#3FAE68]/15 text-[#3FAE68] border border-[#3FAE68]/30 font-bold">
              STRUCTURED-HIGH: 3
            </span>
            <span className="px-2 py-0.5 rounded-none bg-[#D9F2EE] text-[#26A69A] border border-[#3FC3B6]/40 font-bold">
              OCR-HIGH: 2
            </span>
            <span className="px-2 py-0.5 rounded-none bg-[#F5F7F8] text-[#6B7280] border border-[#E2E5E8]">
              MANUAL-REVIEW: 0
            </span>
          </div>

          {/* Clean Evidence Ribbon */}
          <div className="flex items-center gap-2 text-[#252B33] dark:text-neutral-300 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#3FAE68] shrink-0" />
            <span>
              <strong>Disconfirming Evidence:</strong> 3 offset wells (OIL-GLK-05, OIL-GLK-11) crossed with zero losses by capping ECD &lt; 10.3 ppg.
            </span>
          </div>

        </div>

        {/* Action Buttons Deck */}
        <div className="mt-4 pt-4 border-t border-[#E05252]/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsEvidenceDrawerOpen(true)}
              className="px-4 py-2 rounded-none bg-[#34435A] hover:bg-[#222222] text-white text-xs font-bold font-mono transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#3FC3B6]" />
              <span>Review Archival Evidence (WCR-1996/p19)</span>
            </button>

            <a
              href="#mitigation-playbook"
              className="px-4 py-2 rounded-none bg-[#3FC3B6] hover:bg-[#26A69A] text-[#252B33] hover:text-white text-xs font-bold font-mono transition-colors flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-[#252B33]" />
              <span>Execute Mitigation Playbook</span>
            </a>

            <Link
              href="/replay"
              className="px-4 py-2 rounded-none border border-[#E2E5E8] bg-white hover:bg-[#F5F7F8] text-[#252B33] text-xs font-bold font-mono transition-colors flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-[#26A69A]" />
              <span>Validate in Replay Simulator</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {alertAcknowledged ? (
              <span className="px-4 py-2 rounded-none bg-[#3FAE68]/20 text-[#3FAE68] border border-[#3FAE68]/40 text-xs font-mono font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                Advisory Acknowledged by Rig Engineer
              </span>
            ) : (
              <button
                onClick={handleAcknowledge}
                className="px-4 py-2 rounded-none bg-[#ED1C24] hover:bg-[#C9141B] text-white text-xs font-bold font-mono transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Acknowledge Advisory &amp; Log to Audit</span>
              </button>
            )}
          </div>
        </div>

      </section>

      {/* ─── B2. SEQUENTIAL MITIGATION PLAYBOOK (REAL OIL INDIA RECORD EXTRACTION) ─── */}
      <div id="mitigation-playbook" className="scroll-mt-4">
        <MitigationPlaybookCard initialPlaybookId="playbook-glk-mudloss-1" />
      </div>

      {/* ─── C. OFFSET ANALOGS & STRATIGRAPHIC CORRELATION ─── */}
      <section className="rounded-none border border-[#E2E5E8] dark:border-[#1e273b] bg-white dark:bg-[#0b0f18] shadow-sm overflow-hidden">

        {/* Banner with direct link to the new dedicated Geospatial Map Tab */}
        <div className="px-5 py-4 border-b border-[#E2E5E8] dark:border-[#1a2233] bg-[#D9F2EE]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#26A69A]" />
              <h2 className="text-sm font-extrabold text-[#252B33] dark:text-white font-mono uppercase tracking-wide">
                Offset Analogs &amp; Stratigraphic Correlation
              </h2>
            </div>
          </div>

          <Link
            href="/map"
            className="flex items-center gap-2 px-3.5 py-2 rounded-none bg-[#3FC3B6] hover:bg-[#26A69A] text-[#252B33] hover:text-white font-bold font-mono text-xs shadow-xs transition-all shrink-0"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Open Dedicated Well Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Callout insight strip */}
        <div className="px-5 py-3 border-b border-[#E2E5E8] dark:border-neutral-800 bg-[#F5F7F8] dark:bg-[#0c1018] flex items-center gap-3">
          <Info className="w-4 h-4 text-[#26A69A] shrink-0" />
          <p className="text-[11px] font-mono text-[#252B33] dark:text-neutral-300 leading-relaxed">
            <strong className="text-[#252B33] dark:text-white">Key insight:</strong> OIL-GLK-02 is geographically closest at 2.1 km but has a composite similarity of only 0.42 (different fault block). OIL-GLK-07 at 3.1 km scores 0.84 similarity due to identical Upper Tipam stratigraphy — making it the engineering-relevant analog.
          </p>
        </div>

        {/* ── 3-Column Comparative Analog Drill-Down Strip with Scroll Option ── */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
          <div className="grid grid-cols-1 md:grid-cols-3 min-w-[760px] md:min-w-0 border-b border-[#E2E5E8] dark:border-[#1a2233] divide-y md:divide-y-0 md:divide-x divide-[#E2E5E8] dark:divide-[#1a2233]">

            {/* Well 1 — Best Analog */}
            <div className="p-4 space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#252B33] dark:text-white font-mono">OIL-GLK-07</span>
                    <span className="px-1.5 py-0.5 rounded-none text-[9px] font-bold bg-[#26A69A] text-white">BEST ANALOG</span>
                  </div>
                  <div className="text-[10px] text-[#6B7280] font-mono mt-0.5">Geleki · Spud 1996 · 3.1 km</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold text-[#26A69A] font-mono">0.84</div>
                  <div className="text-[9px] text-[#6B7280]">similarity</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                <div className="rounded-none bg-[#F5F7F8] dark:bg-[#0e1520] border border-[#E2E5E8] dark:border-[#1a2333] p-2">
                  <div className="text-[#6B7280] mb-0.5">Formation</div>
                  <div className="text-[#252B33] dark:text-white font-bold text-[10px]">Upper Tipam SS</div>
                </div>
                <div className="rounded-none bg-[#F5F7F8] dark:bg-[#0e1520] border border-[#E2E5E8] dark:border-[#1a2333] p-2">
                  <div className="text-[#6B7280] mb-0.5">NPT Lost</div>
                  <div className="text-[#ED1C24] font-bold">34 hrs</div>
                </div>
                <div className="rounded-none bg-[#FDF2F2] dark:bg-rose-950/20 border border-[#E05252]/40 p-2 col-span-2">
                  <div className="text-[#ED1C24] mb-0.5">Historical Event</div>
                  <div className="text-[#C9141B] dark:text-rose-300 font-bold text-[10px]">Total Lost Circulation @ 2,280m (35 m³/hr)</div>
                </div>
              </div>
              <div className="text-[9px] text-[#6B7280] font-mono flex items-center justify-between pt-1">
                <span className="px-1.5 py-0.5 rounded-none bg-[#D9F2EE] text-[#26A69A] border border-[#3FC3B6]/40">OCR-HIGH</span>
                <span>WCR-GLK-07-1996 · Page 19</span>
              </div>
            </div>

            {/* Well 2 — Closest but low similarity */}
            <div className="p-4 space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#252B33] dark:text-white font-mono">OIL-GLK-02</span>
                    <span className="px-1.5 py-0.5 rounded-none text-[9px] font-bold bg-[#E2E5E8] text-[#252B33] dark:bg-neutral-800 dark:text-neutral-300">CLOSEST</span>
                  </div>
                  <div className="text-[10px] text-[#6B7280] font-mono mt-0.5">Geleki · Spud 1981 · 2.1 km</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold text-[#6B7280] font-mono">0.42</div>
                  <div className="text-[9px] text-[#6B7280]">similarity</div>
                </div>
              </div>
              <div className="text-[10px] font-sans text-[#252B33] dark:text-neutral-400 p-2.5 rounded-none bg-[#F5F7F8] dark:bg-[#0e1520] border border-[#E2E5E8] dark:border-[#1a2333] leading-relaxed">
                <strong className="text-[#252B33] dark:text-neutral-300">Low relevance despite proximity.</strong> Different fault block shifts formation boundary. Girujan Clay sealed interval limits direct applicability to OIL-GLK-14 trajectory.
              </div>
              <div className="text-[9px] text-[#6B7280] font-mono flex items-center justify-between pt-2">
                <span className="px-1.5 py-0.5 rounded-none bg-[#F5F7F8] text-[#6B7280] border border-[#E2E5E8]">OCR-MEDIUM</span>
                <span>DDR-GLK-02-1981 · Page 15</span>
              </div>
            </div>

            {/* Well 3 — Clean Pass */}
            <div className="p-4 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#252B33] dark:text-white font-mono">OIL-GLK-05</span>
                      <span className="px-1.5 py-0.5 rounded-none text-[9px] font-bold bg-[#3FAE68]/15 text-[#3FAE68] border border-[#3FAE68]/30">CLEAN PASS</span>
                    </div>
                    <div className="text-[10px] text-[#6B7280] font-mono mt-0.5">Geleki · Spud 2001 · 2.8 km · sim 0.72</div>
                  </div>
                </div>
                <div className="text-[10px] font-sans text-[#252B33] dark:text-emerald-300 p-2.5 rounded-none bg-[#3FAE68]/10 dark:bg-emerald-950/15 border border-[#3FAE68]/30 leading-relaxed">
                  <CheckCircle2 className="w-3 h-3 inline mr-1 text-[#3FAE68]" />
                  <strong>Zero incidents.</strong> ECD strictly capped &lt;10.3 ppg + pre-emptive LCM pill. This is the disconfirming evidence — proving mitigation works.
                </div>
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setIsEvidenceDrawerOpen(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-none bg-[#34435A] hover:bg-[#222222] text-white text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#3FC3B6]" />
                  Inspect WCR
                </button>
                <Link
                  href="/replay"
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-none border border-[#E2E5E8] bg-white text-[#252B33] text-xs font-mono font-bold hover:bg-[#F5F7F8] transition-colors"
                >
                  <Activity className="w-3.5 h-3.5 text-[#26A69A]" />
                  Replay Simulator
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Multi-Well Stratigraphic Correlation Panel ── */}
        <div className="border-t border-[#E2E5E8] dark:border-[#1a2233] p-5">
          <MultiWellCorrelationTrack
            currentDepthMD={currentDepth}
          />
        </div>

      </section>

      {/* ─── D. OFFSET WELL COMPARISON TABLE (Similarity != Distance Proof) ─── */}
      <section className="rounded-none border border-[#E2E5E8] dark:border-[#1e273b] bg-white dark:bg-[#0e121a] p-5 shadow-xs space-y-4">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E2E5E8] dark:border-[#1a2233]">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-base font-extrabold text-[#252B33] dark:text-white font-mono tracking-tight">
              Offset Well Correlation
            </h3>
          </div>

          {/* Sort Switcher Tabs */}
          <div className="flex items-center gap-1 bg-[#F5F7F8] dark:bg-[#131926] p-1 rounded-none border border-[#E2E5E8] dark:border-[#1e2638] text-xs font-mono">
            <button
              onClick={() => setActiveTab('similarity')}
              className={`px-3 py-1.5 rounded-none font-bold transition-all ${activeTab === 'similarity'
                  ? 'bg-[#3FC3B6] text-[#252B33] shadow-xs'
                  : 'text-[#6B7280] dark:text-neutral-400 hover:text-[#252B33]'
                }`}
            >
              Sort by Composite Similarity
            </button>
            <button
              onClick={() => setActiveTab('distance')}
              className={`px-3 py-1.5 rounded-none font-bold transition-all ${activeTab === 'distance'
                  ? 'bg-[#3FC3B6] text-[#252B33] shadow-xs'
                  : 'text-[#6B7280] dark:text-neutral-400 hover:text-[#252B33]'
                }`}
            >
              Sort by Distance (km)
            </button>
          </div>
        </div>

        {/* Operational Table with Scroll Option */}
        <div className="max-h-[380px] overflow-y-auto overflow-x-auto rounded-none border border-[#E2E5E8] dark:border-[#1a2233] relative scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 scroll-smooth shadow-2xs">
          <table className="w-full text-xs font-sans border-collapse">
            <thead className="sticky top-0 z-20 bg-[#F5F7F8] dark:bg-[#121722] border-b border-[#E2E5E8] dark:border-[#1a2233] backdrop-blur-md shadow-xs">
              <tr className="text-[11px] font-mono text-[#6B7280] dark:text-neutral-400">
                <th className="p-3 text-left">WELL ID &amp; SPUD</th>
                <th className="p-3 text-left">GEO DISTANCE</th>
                <th className="p-3 text-left">COMPOSITE SIMILARITY</th>
                <th className="p-3 text-left">FORMATION MATCH</th>
                <th className="p-3 text-left">DEPTH ALIGNMENT</th>
                <th className="p-3 text-left">HISTORICAL INCIDENT &amp; NPT</th>
                <th className="p-3 text-left">PROVENANCE</th>
                <th className="p-3 text-right">EVIDENCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E5E8] dark:divide-[#182030] text-[#252B33] dark:text-neutral-200 font-mono">
              {sortedOffsets.map((offset) => {
                const isSelected = selectedWell.id === offset.id;
                return (
                  <tr
                    key={offset.id}
                    onClick={() => setSelectedWell(offset)}
                    className={`cursor-pointer transition-colors ${isSelected
                        ? 'bg-[#D9F2EE]/40 dark:bg-[#1a2233]'
                        : 'hover:bg-[#F5F7F8] dark:hover:bg-[#121622]'
                      }`}
                  >
                    <td className="p-3 font-bold text-[#252B33] dark:text-white">
                      <div className="flex items-center gap-2">
                        <span>{offset.name}</span>
                        {offset.isBestComparison && (
                          <span className="px-1.5 py-0.2 rounded-none bg-[#26A69A] text-white text-[9px] font-extrabold uppercase">
                            Best Comparison
                          </span>
                        )}
                        {offset.isGeographicallyClosest && (
                          <span className="px-1.5 py-0.2 rounded-none bg-[#E2E5E8] text-[#252B33] dark:bg-neutral-800 dark:text-neutral-300 text-[9px] font-bold uppercase">
                            Closest Well
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#6B7280] font-normal">Spud: {offset.spudYear}</span>
                    </td>

                    <td className="p-3 text-[#252B33] dark:text-neutral-300 font-bold">
                      {offset.distanceKm} km
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#26A69A] text-sm">
                          {offset.similarityScore.toFixed(2)}
                        </span>
                        <div className="w-16 h-1.5 rounded-none bg-[#E2E5E8] dark:bg-neutral-800 overflow-hidden">
                          <div
                            className="h-full bg-[#3FC3B6] rounded-none"
                            style={{ width: `${offset.similarityScore * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="p-3 font-sans text-[#252B33] dark:text-neutral-300 text-xs">
                      {offset.formationMatch}
                    </td>

                    <td className="p-3 text-[#6B7280] dark:text-neutral-400 text-xs">
                      {offset.depthAlignment}
                    </td>

                    <td className="p-3">
                      {offset.status === 'clean' ? (
                        <span className="text-[#3FAE68] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Zero Losses (0h NPT)
                        </span>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="text-[#ED1C24] font-bold block">
                            {offset.historicalEvent}
                          </span>
                          <span className="text-[10px] text-[#6B7280]">NPT: {offset.nptHours} hrs lost</span>
                        </div>
                      )}
                    </td>

                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-none text-[10px] font-bold ${offset.sourceConfidence === 'STRUCTURED-HIGH'
                          ? 'bg-[#3FAE68]/15 text-[#3FAE68] border border-[#3FAE68]/30'
                          : offset.sourceConfidence === 'OCR-HIGH'
                            ? 'bg-[#D9F2EE] text-[#26A69A] border border-[#3FC3B6]/40'
                            : 'bg-[#F5F7F8] text-[#6B7280] border border-[#E2E5E8]'
                        }`}>
                        {offset.sourceConfidence}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWell(offset);
                          setIsEvidenceDrawerOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-none bg-[#F5F7F8] dark:bg-neutral-800 hover:bg-[#3FC3B6] hover:text-[#252B33] text-[#252B33] dark:text-neutral-300 text-[11px] font-mono transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      <EvidenceInspectorDrawer
        isOpen={isEvidenceDrawerOpen}
        onClose={() => setIsEvidenceDrawerOpen(false)}
        wellName={selectedWell.name}
        sourceRef={selectedWell.sourceRef}
        incidentDepth={selectedWell.status === 'clean' ? 2240 : 2280}
        formationName={selectedWell.formationMatch}
        confidence={selectedWell.sourceConfidence as any}
        nptHours={selectedWell.nptHours}
        mitigationApplied={selectedWell.mitigationUsed}
      />

    </div>
  );
}