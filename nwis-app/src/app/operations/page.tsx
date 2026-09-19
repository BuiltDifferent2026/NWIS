'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Layers, 
  Compass, 
  ArrowRight, 
  FileText, 
  ExternalLink, 
  Info,
  Check,
  Search,
  Eye,
  Database,
  Radio,
  Clock,
  Gauge,
  Thermometer,
  Wind,
  Droplets,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { INITIAL_LIVE_TELEMETRY } from '@/data/live-state';
import { DepthTrack } from '@/components/common/DepthTrack';
import { MultiWellCorrelationTrack } from '@/components/common/MultiWellCorrelationTrack';
import { EvidenceInspectorDrawer } from '@/components/common/EvidenceInspectorDrawer';
import { StatusTag } from '@/components/common/StatusTag';

// Dynamically import Leaflet Map to avoid SSR issues
const WellMapInner = dynamic(
  () => import('@/components/map/WellMapInner').then((mod) => mod.WellMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="h-[460px] w-full border border-border bg-secondary flex flex-col items-center justify-center text-muted-foreground font-mono text-xs gap-2">
        <Radio className="w-5 h-5 text-[#1d70b8] animate-pulse" />
        <span>Initializing Assam Basin Geospatial Correlation Engine...</span>
      </div>
    )
  }
);

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
  const { acknowledgeAlert } = useAppStore();
  const [selectedWell, setSelectedWell] = useState(GELEKI_OFFSET_WELLS[0]);
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'similarity' | 'distance'>('similarity');
  const [alertAcknowledged, setAlertAcknowledged] = useState<boolean>(false);
  const [isStratigraphyExpanded, setIsStratigraphyExpanded] = useState<boolean>(true);

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
    <div className="space-y-4 max-w-[1520px] mx-auto pb-12 font-sans">
      
      {/* ─── A. LIVE RIG FEED HEADER & TELEMETRY ─── */}
      <section className="bg-gradient-to-r from-card via-card to-card border-2 border-[#138808]/40 shadow-sm p-4 rounded-sm space-y-3 relative overflow-hidden">
        {/* Tricolor top subtle line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff9933] via-white dark:via-slate-200 to-[#138808]" />
        
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="px-2 py-0.5 bg-[#ff9933]/15 border border-[#ff9933]/40 text-[#b25900] dark:text-[#fbbf24] font-mono font-bold text-xs rounded-xs">
                OIL INDIA RIG #4
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-mono">
                OIL-GLK-14
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                DRILLING ACTIVE · LIVE WITSML
              </span>
              <span className="text-xs text-muted-foreground font-sans">
                Geleki Field · Assam–Arakan Basin · Rig: <strong className="text-foreground">OIL-E2000-IV</strong> · Spud: 12-Jul-2026
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
            <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 font-semibold rounded-xs">
              ⚡ eRTMAC Feed: 380ms Latency
            </span>
            <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 font-semibold rounded-xs">
              🧠 NWIS Memory: 14 Offset Analogs Synced
            </span>
          </div>
        </div>

        {/* Live Telemetry 6-Metric Strip with Rich Colors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          
          {/* Bit Depth */}
          <div className="p-3 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-l-amber-500 border border-amber-500/30 rounded-xs space-y-0.5 shadow-xs">
            <div className="text-[10px] font-mono text-amber-700 dark:text-amber-300 uppercase font-bold tracking-wider flex items-center justify-between">
              <span>BIT DEPTH (MD)</span>
              <Gauge className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-2xl font-black font-mono text-foreground">
              {liveData.depthMD} <span className="text-xs font-normal text-muted-foreground">m</span>
            </div>
            <div className="text-[10px] text-amber-700 dark:text-amber-400 font-mono font-medium">
              TVD: 2,110.2 m · Δ +2.4 m/hr
            </div>
          </div>

          {/* Formation */}
          <div className="p-3 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-l-4 border-l-blue-500 border border-blue-500/30 rounded-xs space-y-0.5 shadow-xs">
            <div className="text-[10px] font-mono text-blue-700 dark:text-blue-300 uppercase font-bold tracking-wider flex items-center justify-between">
              <span>FORMATION</span>
              <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-base font-bold text-foreground truncate">
              Upper Tipam
            </div>
            <div className="text-[10px] text-blue-700 dark:text-blue-400 font-mono truncate font-medium">
              Sandstone · 12-1/4&quot; Hole
            </div>
          </div>

          {/* ROP */}
          <div className="p-3 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-l-4 border-l-emerald-500 border border-emerald-500/30 rounded-xs space-y-0.5 shadow-xs">
            <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 uppercase font-bold tracking-wider flex items-center justify-between">
              <span>PENETRATION RATE</span>
              <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400">
              {liveData.rop} <span className="text-xs font-normal text-muted-foreground">m/h</span>
            </div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-medium">
              ✓ Stable ROP Trend
            </div>
          </div>

          {/* Surface Torque */}
          <div className="p-3 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border-l-4 border-l-purple-500 border border-purple-500/30 rounded-xs space-y-0.5 shadow-xs">
            <div className="text-[10px] font-mono text-purple-700 dark:text-purple-300 uppercase font-bold tracking-wider flex items-center justify-between">
              <span>SURFACE TORQUE</span>
              <Compass className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-black font-mono text-purple-700 dark:text-purple-400">
              {liveData.torque} <span className="text-xs font-normal text-muted-foreground">kft-lb</span>
            </div>
            <div className="text-[10px] text-purple-700 dark:text-purple-400 font-mono font-medium">
              WOB: 16.5 klbs · 120 RPM
            </div>
          </div>

          {/* Mud Weight (In) */}
          <div className="p-3 bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent border-l-4 border-l-cyan-500 border border-cyan-500/30 rounded-xs space-y-0.5 shadow-xs">
            <div className="text-[10px] font-mono text-cyan-700 dark:text-cyan-300 uppercase font-bold tracking-wider flex items-center justify-between">
              <span>MUD WEIGHT (IN)</span>
              <Droplets className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="text-2xl font-black font-mono text-cyan-700 dark:text-cyan-400">
              {liveData.mudWeightIn} <span className="text-xs font-normal text-muted-foreground">ppg</span>
            </div>
            <div className="text-[10px] text-cyan-700 dark:text-cyan-400 font-mono font-medium">
              Target Window: 10.1 - 10.4 ppg
            </div>
          </div>

          {/* Standpipe Pressure & Loss Risk */}
          <div className="p-3 bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border-l-4 border-l-rose-500 border border-rose-500/30 rounded-xs space-y-0.5 shadow-xs">
            <div className="text-[10px] font-mono text-rose-700 dark:text-rose-300 uppercase font-bold tracking-wider flex items-center justify-between">
              <span>STANDPIPE PRESS.</span>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="text-2xl font-black font-mono text-rose-700 dark:text-rose-400">
              {liveData.standpipePressure} <span className="text-xs font-normal text-muted-foreground">psi</span>
            </div>
            <div className="text-[10px] text-rose-700 dark:text-rose-400 font-mono font-bold">
              ⚠ Thief Zone in 74.6m
            </div>
          </div>

        </div>
      </section>

      {/* ─── B. CENTRAL PROACTIVE OPERATIONAL ALERT PANEL ─── */}
      <section className="bg-gradient-to-br from-card via-card to-amber-500/5 border-2 border-amber-500/40 p-4 rounded-sm shadow-sm space-y-4 border-l-8 border-l-amber-500">
        
        {/* Alert Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="gov-tag gov-tag-red">CRITICAL SEVERITY</span>
              <span className="gov-tag gov-tag-amber">{distanceToHazard}m BUFFER AHEAD</span>
              <span className="text-xs font-mono text-muted-foreground">Corridor: GLK-COR-03</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-foreground font-sans">
              Approaching Historical Lost Circulation Corridor (2,240–2,350 m MD)
            </h2>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="text-right">
              <span className="text-[10px] text-muted-foreground block uppercase font-bold">Composite Confidence</span>
              <strong className="text-[#b25900] dark:text-[#fbbf24] text-sm">0.82 (High)</strong>
            </div>
            <div className="text-right border-l border-border pl-3">
              <span className="text-[10px] text-muted-foreground block uppercase font-bold">Offset Evidence</span>
              <strong className="text-foreground text-sm">5 Analog Wells</strong>
            </div>
          </div>
        </div>

        {/* ─── STRICT 3-PART SEPARATION: FACT vs ESTIMATE vs MITIGATION ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          
          {/* 1. OBSERVED HISTORICAL FACT */}
          <div className="p-3.5 bg-gradient-to-br from-blue-500/15 via-blue-500/5 to-card border-l-4 border-l-blue-600 border border-blue-500/30 rounded-xs flex flex-col justify-between shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-blue-500/20 text-xs font-mono font-bold uppercase text-blue-700 dark:text-blue-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  1. Observed Historical Fact
                </span>
                <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-xs">
                  GROUND TRUTH
                </span>
              </div>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed font-sans">
                <strong className="text-blue-700 dark:text-blue-300">5 offset wells</strong> in Geleki encountering Upper Tipam sandstones experienced severe lost circulation (12–35 m³/hr) between 2,180 m and 2,350 m MD. Historical average NPT: <strong className="text-rose-600 dark:text-rose-400">28.4 hours lost per incident</strong> (~₹42.6 Lakhs loss).
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-blue-500/20 text-[11px] font-mono text-muted-foreground flex justify-between">
              <span>Primary Analog: <strong className="text-foreground">OIL-GLK-07</strong></span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">WCR-1996/p19</span>
            </div>
          </div>

          {/* 2. MODEL-ESTIMATED RISK */}
          <div className="p-3.5 bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-card border-l-4 border-l-amber-500 border border-amber-500/30 rounded-xs flex flex-col justify-between shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-amber-500/20 text-xs font-mono font-bold uppercase text-amber-700 dark:text-amber-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  2. Model-Estimated Risk
                </span>
                <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded-xs animate-pulse">
                  75m LOOKAHEAD
                </span>
              </div>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed font-sans">
                Current trajectory and formation-relative depth indicate imminent entry into micro-fractured thief sandstones within approximately <strong className="text-amber-700 dark:text-amber-400">74.6 m MD</strong>. Excessive ECD (&gt;10.4 ppg) is <strong className="text-rose-600 dark:text-rose-400">68% correlated</strong> with immediate severe fluid loss.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-amber-500/20 text-[11px] font-mono text-muted-foreground flex justify-between">
              <span>Lithology Twin: <strong className="text-foreground">0.84 Similarity</strong></span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">Lead time: ~3.2 hrs</span>
            </div>
          </div>

          {/* 3. SUGGESTED MITIGATION */}
          <div className="p-3.5 bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-card border-l-4 border-l-emerald-600 border border-emerald-500/30 rounded-xs flex flex-col justify-between shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-emerald-500/20 text-xs font-mono font-bold uppercase text-emerald-700 dark:text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  3. Recommended Mitigation
                </span>
                <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded-xs">
                  ACTION PLAN
                </span>
              </div>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed font-sans">
                Stage <strong className="text-emerald-700 dark:text-emerald-400">35 ppb mixed-fiber LCM pill</strong> in active suction pit prior to 2,190 m MD; <strong className="text-emerald-700 dark:text-emerald-400">Cap ECD at 10.4 ppg</strong>; Standby secondary cement squeezer on deck. (Proven recovery in OIL-GLK-07 &amp; OIL-GLK-11).
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-500/20 text-[11px] font-mono text-muted-foreground flex justify-between">
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">Non-Binding Decision Support</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Ready to Apply</span>
            </div>
          </div>

        </div>

        {/* Provenance & Disconfirming Clean Evidence Bar */}
        <div className="pt-2 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2 flex-wrap font-mono text-[11px]">
            <span className="text-muted-foreground font-semibold">Source Provenance:</span>
            <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold rounded-xs">STRUCTURED-HIGH: 3</span>
            <span className="px-2 py-0.5 bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-400 font-bold rounded-xs">OCR-HIGH: 2</span>
            <span className="px-2 py-0.5 bg-slate-500/15 border border-slate-500/30 text-slate-700 dark:text-slate-400 font-bold rounded-xs">MANUAL-REVIEW: 0</span>
          </div>

          <div className="flex items-center gap-2 text-foreground text-xs font-sans bg-emerald-500/10 border border-emerald-500/30 p-1.5 rounded-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>Disconfirming Evidence:</strong> 3 offset wells (OIL-GLK-05, OIL-GLK-11) crossed safely with zero losses by capping ECD &lt; 10.3 ppg.
            </span>
          </div>

        </div>

        {/* Action Buttons Deck */}
        <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEvidenceDrawerOpen(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Review Evidence (WCR-1996/p19)</span>
            </button>

            <Link
              href="/replay"
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Validate in Replay Simulator</span>
            </Link>
          </div>

          <div>
            {alertAcknowledged ? (
              <span className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xs flex items-center gap-1.5 shadow-xs">
                <Check className="w-3.5 h-3.5" />
                Advisory Acknowledged by Rig Engineer
              </span>
            ) : (
              <button
                onClick={handleAcknowledge}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Acknowledge Advisory &amp; Log to Audit</span>
              </button>
            )}
          </div>
        </div>

      </section>

      {/* ─── C. GEOSPATIAL OFFSET CORRELATION & MAP ─── */}
      <section className="gov-panel space-y-3">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-foreground font-sans uppercase">
                Geospatial Offset-Well Correlation
              </h2>
              <span className="px-2 py-0.5 bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-400 font-bold text-[10px] rounded-xs">
                Similarity ≠ Distance
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-sans">
              Geleki Field · 25 km search radius from active rig OIL-GLK-14
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground flex-wrap">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">● Active Rig (GLK-14)</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">● Best Analog (GLK-07)</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold">● Incident Well</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">● Clean Pass</span>
          </div>
        </div>

        {/* 4 Colorful Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-3 bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/30 rounded-xs space-y-0.5">
            <div className="text-[10px] font-mono text-blue-700 dark:text-blue-300 uppercase font-bold">OFFSET WELLS</div>
            <div className="text-2xl font-black font-mono text-blue-700 dark:text-blue-300">5 Wells</div>
            <div className="text-[10px] text-muted-foreground font-sans">within 25km radius</div>
          </div>
          <div className="p-3 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 rounded-xs space-y-0.5">
            <div className="text-[10px] font-mono text-amber-700 dark:text-amber-300 uppercase font-bold">BEST ANALOG SIMILARITY</div>
            <div className="text-2xl font-black font-mono text-amber-700 dark:text-amber-300">0.84 Match</div>
            <div className="text-[10px] text-muted-foreground font-sans">OIL-GLK-07 (Exact lithology)</div>
          </div>
          <div className="p-3 bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-500/30 rounded-xs space-y-0.5">
            <div className="text-[10px] font-mono text-rose-700 dark:text-rose-300 uppercase font-bold">INCIDENT RATE</div>
            <div className="text-2xl font-black font-mono text-rose-700 dark:text-rose-300">4 / 5 Wells</div>
            <div className="text-[10px] text-muted-foreground font-sans">historical lost circulation</div>
          </div>
          <div className="p-3 bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/30 rounded-xs space-y-0.5">
            <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 uppercase font-bold">CLEAN PASSAGES</div>
            <div className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-300">1 Well Safe</div>
            <div className="text-[10px] text-muted-foreground font-sans">ECD-controlled baseline</div>
          </div>
        </div>

        {/* Map & Analog Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          
          {/* Map (8 cols) */}
          <div className="lg:col-span-8 border border-border">
            <div className="h-[460px] w-full">
              <WellMapInner
                centerWellId="well-glk-14"
                radiusKm={25}
                searchQuery=""
                selectedField="Geleki"
                sortBy="similarity"
              />
            </div>
            <div className="p-2.5 bg-secondary/50 border-t border-border text-[11px] font-sans text-muted-foreground">
              <strong>Core Distinction:</strong> OIL-GLK-02 is geographically closest at 2.1 km but has low composite similarity (0.42) due to fault block shifting. OIL-GLK-07 at 3.1 km scores 0.84 similarity due to identical Upper Tipam stratigraphy.
            </div>
          </div>

          {/* Right Panel: Selected Well Intelligence (4 cols) */}
          <div className="lg:col-span-4 border border-border divide-y divide-border bg-secondary/20 flex flex-col justify-between">
            <div className="p-3 space-y-3">
              <div className="text-[10px] font-mono uppercase font-bold text-muted-foreground">
                Analog Well Intelligence
              </div>

              {/* Best Analog Detail */}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-foreground font-mono">OIL-GLK-07</span>
                      <span className="gov-tag gov-tag-amber">BEST ANALOG</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">Geleki · Spud 1996 · 3.1 km</div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold font-mono text-[#1d70b8] dark:text-[#60a5fa]">0.84</div>
                    <div className="text-[9px] text-muted-foreground">similarity</div>
                  </div>
                </div>

                <div className="p-2 bg-card border border-border text-xs space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Formation:</span>
                    <span className="text-foreground font-bold">Upper Tipam SS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">NPT Incurred:</span>
                    <span className="text-[#d4351c] dark:text-[#f87171] font-bold">34 hrs lost</span>
                  </div>
                  <div className="text-[11px] text-[#942514] dark:text-[#fca5a5] pt-1 border-t border-border">
                    Total lost circulation at 2,280m MD (35 m³/hr).
                  </div>
                </div>
              </div>

              {/* Closest well detail */}
              <div className="p-2 bg-card border border-border text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-foreground font-mono">OIL-GLK-02</span>
                  <span className="gov-tag gov-tag-grey">CLOSEST (2.1 km) · SIM 0.42</span>
                </div>
                <p className="text-[11px] text-muted-foreground font-sans">
                  Different fault block shifts boundary. Sealed interval limits direct applicability.
                </p>
              </div>

              {/* Clean pass detail */}
              <div className="p-2 bg-card border border-border text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-foreground font-mono">OIL-GLK-05</span>
                  <span className="gov-tag gov-tag-green">CLEAN PASS · SIM 0.72</span>
                </div>
                <p className="text-[11px] text-muted-foreground font-sans">
                  Zero incidents. ECD capped &lt;10.3 ppg with pre-emptive LCM pill.
                </p>
              </div>
            </div>

            <div className="p-2.5 bg-card border-t border-border flex items-center gap-2">
              <button
                onClick={() => setIsEvidenceDrawerOpen(true)}
                className="gov-button text-xs py-1 px-2.5 flex-1"
              >
                Inspect WCR Archive
              </button>
              <Link
                href="/replay"
                className="gov-button-secondary text-xs py-1 px-2.5 flex-1 text-center"
              >
                Replay Run
              </Link>
            </div>
          </div>

        </div>

        {/* ── Progressive Disclosure: Stratigraphic Correlation Track Accordion ── */}
        <div className="pt-2 border-t border-border">
          <button
            onClick={() => setIsStratigraphyExpanded(!isStratigraphyExpanded)}
            className="w-full flex items-center justify-between p-2 bg-secondary/40 border border-border text-xs font-mono font-bold text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            <span>Multi-Well Stratigraphic Tie-Line Alignment (OIL-GLK-14 vs Offsets)</span>
            {isStratigraphyExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isStratigraphyExpanded && (
            <div className="p-3 border border-t-0 border-border bg-card">
              <MultiWellCorrelationTrack currentDepthMD={currentDepth} />
            </div>
          )}
        </div>

      </section>

      {/* ─── D. OFFSET WELL COMPARISON TABLE ─── */}
      <section className="gov-panel space-y-3">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-foreground font-sans uppercase">
                Offset Well Correlation Table
              </h3>
              <span className="gov-tag gov-tag-blue">DUAL SIGNAL ENGINE</span>
            </div>
            <p className="text-xs text-muted-foreground font-sans">
              Explicit side-by-side comparison of geographic distance vs composite petrophysical similarity.
            </p>
          </div>

          {/* Sort Switcher */}
          <div className="flex items-center gap-1 text-xs font-mono">
            <span className="text-muted-foreground text-[11px] mr-1">Sort:</span>
            <button
              onClick={() => setActiveTab('similarity')}
              className={`px-2 py-1 text-xs font-bold border transition-colors cursor-pointer ${
                activeTab === 'similarity'
                  ? 'bg-[#1d70b8] text-white border-[#1d70b8]'
                  : 'bg-card text-muted-foreground border-border hover:text-foreground'
              }`}
            >
              Composite Similarity
            </button>
            <button
              onClick={() => setActiveTab('distance')}
              className={`px-2 py-1 text-xs font-bold border transition-colors cursor-pointer ${
                activeTab === 'distance'
                  ? 'bg-[#1d70b8] text-white border-[#1d70b8]'
                  : 'bg-card text-muted-foreground border-border hover:text-foreground'
              }`}
            >
              Map Distance (km)
            </button>
          </div>
        </div>

        {/* Operational Table */}
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Well ID &amp; Spud</th>
                <th>Distance (km)</th>
                <th>Composite Similarity</th>
                <th>Formation Match</th>
                <th>Depth Alignment</th>
                <th>Historical Event &amp; NPT</th>
                <th>Provenance</th>
                <th className="text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {sortedOffsets.map((offset) => {
                const isSelected = selectedWell.id === offset.id;
                return (
                  <tr
                    key={offset.id}
                    onClick={() => setSelectedWell(offset)}
                    className={`cursor-pointer ${isSelected ? 'gov-row-selected' : ''}`}
                  >
                    <td className="font-bold text-foreground">
                      <div className="flex items-center gap-1.5">
                        <span>{offset.name}</span>
                        {offset.isBestComparison && (
                          <span className="gov-tag gov-tag-amber text-[9px]">BEST ANALOG</span>
                        )}
                        {offset.isGeographicallyClosest && (
                          <span className="gov-tag gov-tag-grey text-[9px]">CLOSEST</span>
                        )}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-normal">Spud: {offset.spudYear}</div>
                    </td>

                    <td className="font-bold text-foreground">
                      {offset.distanceKm} km
                    </td>

                    <td>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">
                          {offset.similarityScore.toFixed(2)}
                        </span>
                        <div className="w-12 h-1.5 bg-border rounded-xs overflow-hidden">
                          <div
                            className="h-full bg-[#1d70b8]"
                            style={{ width: `${offset.similarityScore * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="font-sans text-xs text-foreground">
                      {offset.formationMatch}
                    </td>

                    <td className="text-muted-foreground text-xs">
                      {offset.depthAlignment}
                    </td>

                    <td>
                      {offset.status === 'clean' ? (
                        <span className="text-[#00703c] dark:text-[#34d399] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Zero Losses (Clean)
                        </span>
                      ) : (
                        <div>
                          <span className="text-[#d4351c] dark:text-[#f87171] font-bold block">
                            {offset.historicalEvent}
                          </span>
                          <span className="text-[10px] text-muted-foreground">NPT: {offset.nptHours} hrs</span>
                        </div>
                      )}
                    </td>

                    <td>
                      <span className={`gov-tag ${
                        offset.sourceConfidence === 'STRUCTURED-HIGH'
                          ? 'gov-tag-green'
                          : offset.sourceConfidence === 'OCR-HIGH'
                          ? 'gov-tag-blue'
                          : 'gov-tag-grey'
                      }`}>
                        {offset.sourceConfidence}
                      </span>
                    </td>

                    <td className="text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWell(offset);
                          setIsEvidenceDrawerOpen(true);
                        }}
                        className="px-2 py-0.5 bg-secondary hover:bg-[#1d70b8] hover:text-white border border-border text-[11px] font-mono transition-colors inline-flex items-center gap-1 cursor-pointer"
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

      {/* Archival Evidence Drawer */}
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