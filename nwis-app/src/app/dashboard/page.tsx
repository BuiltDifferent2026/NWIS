'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  HardHat, 
  ShieldAlert, 
  CheckCircle2, 
  Info, 
  ArrowUpRight, 
  ArrowDownRight, 
  BarChart2, 
  Users, 
  TrendingDown, 
  Layers, 
  Calendar, 
  ChevronDown, 
  Download, 
  Filter, 
  MoreHorizontal, 
  ArrowUpDown,
  Check,
  ChevronRight,
  Sparkles,
  Activity,
  Gauge,
  Compass,
  Droplets,
  FileText,
  Radio,
  Clock,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { WELLS } from '@/data/wells';
import { INITIAL_LIVE_TELEMETRY, MEMORY_DECAY_INDEX } from '@/data/live-state';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { EvidenceInspectorDrawer } from '@/components/common/EvidenceInspectorDrawer';
import { ConfidenceTag } from '@/lib/data/types';

// High-fidelity offset wells data from Geleki Field (Assam-Arakan Basin)
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
    sourceConfidence: 'OCR-HIGH' as ConfidenceTag,
    sourceRef: 'WCR-GLK-07-1996 · Page 19',
    status: 'incident' as const
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
    mitigationUsed: 'Weighted mud sweep with bentonite booster',
    nptHours: 4,
    sourceConfidence: 'OCR-LOW' as ConfidenceTag,
    sourceRef: 'DDR-GLK-02-1981 · Page 15',
    status: 'incident' as const
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
    sourceConfidence: 'STRUCTURED-HIGH' as ConfidenceTag,
    sourceRef: 'WCR-GLK-03-1988 · Page 42',
    status: 'incident' as const
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
    sourceConfidence: 'OCR-HIGH' as ConfidenceTag,
    sourceRef: 'DDR-GLK-11-2012 · Page 104',
    status: 'incident' as const
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
    sourceConfidence: 'STRUCTURED-HIGH' as ConfidenceTag,
    sourceRef: 'WCR-GLK-05-2001 · Page 28',
    status: 'clean' as const
  }
];

export default function DashboardPage() {
  const { currentRole, alerts, activeWellId, acknowledgeAlert } = useAppStore();
  const [selectedRange] = useState('OIL-GLK-14: 2,165.4m MD');
  const [frequency] = useState('75m Buffer');
  const [subscriberTimeframe] = useState('Weekly');
  const [distributionTimeframe] = useState('Monthly');
  const [activeSortTab, setActiveSortTab] = useState<'similarity' | 'distance'>('similarity');
  const [alertAcknowledged, setAlertAcknowledged] = useState(false);
  const [selectedEvidenceWell, setSelectedEvidenceWell] = useState(GELEKI_OFFSET_WELLS[0]);
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);

  const activeWells = WELLS.filter((w) => w.status === 'drilling');
  const liveData = INITIAL_LIVE_TELEMETRY;

  // Sorting offset wells based on active tab
  const sortedOffsets = [...GELEKI_OFFSET_WELLS].sort((a, b) => {
    if (activeSortTab === 'distance') return a.distanceKm - b.distanceKm;
    return b.similarityScore - a.similarityScore;
  });

  const handleOpenEvidence = (well: typeof GELEKI_OFFSET_WELLS[0]) => {
    setSelectedEvidenceWell(well);
    setIsEvidenceDrawerOpen(true);
  };

  const handleAcknowledge = () => {
    acknowledgeAlert('alert-glk-14-loss', 'Acknowledged by shift engineer. LCM pill preparation staged.');
    setAlertAcknowledged(true);
  };

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto pb-12 font-sans">
      
      {/* ─── Top Dashboard Header & Action Controls ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Assam-Arakan Basin Fleet Operations
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              2 RIGS DRILLING · LIVE WITSML
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
            Continuous subsurface hazard watcher tracking active bit positions and lookahead horizons alongside eRTMAC live feeds.
          </p>
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Well Run / Depth Selector */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#12151c] text-xs font-medium text-neutral-700 dark:text-neutral-300 shadow-2xs cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-colors">
            <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="font-mono">{selectedRange}</span>
          </div>

          {/* Lookahead Horizon Dropdown */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#12151c] text-xs font-medium text-neutral-700 dark:text-neutral-300 shadow-2xs cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-colors">
            <span>{frequency}</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </div>

          {/* Filter Button */}
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#12151c] text-neutral-700 dark:text-neutral-300 text-xs font-medium gap-1.5 h-8 shadow-2xs hover:bg-neutral-50 dark:hover:bg-neutral-800/80"
          >
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <span>Filter</span>
          </Button>

          {/* Export Button */}
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#12151c] text-neutral-700 dark:text-neutral-300 text-xs font-medium gap-1.5 h-8 shadow-2xs hover:bg-neutral-50 dark:hover:bg-neutral-800/80"
          >
            <Download className="w-3.5 h-3.5 text-neutral-400" />
            <span>Export DDR</span>
          </Button>

          {/* Simulator Direct Link */}
          <Link
            href="/replay"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold font-mono transition-colors shadow-2xs"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Validate in Replay</span>
          </Link>
        </div>
      </div>

      {/* ─── A. LIVE RIG TELEMETRY STRIP (OIL-GLK-14) ─── */}
      <Card className="rounded-2xl border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-4 shadow-xs">
        {/* Top Info Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-mono font-bold text-xs">
              OIL INDIA FLEET · RIG #4
            </div>
            <div className="text-sm font-bold text-neutral-900 dark:text-white font-mono">
              OIL-GLK-14
            </div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-sans">
              Geleki Field · Assam–Arakan Basin · Rig: <strong className="text-neutral-800 dark:text-neutral-200 font-mono">OIL-E2000-IV</strong> · Spud: 12-Jul-2026
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 font-medium text-[11px] flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-amber-500" />
              eRTMAC Feed: <strong className="text-neutral-900 dark:text-white">{liveData.latencyMs}ms Latency</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 font-medium text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" />
              NWIS Memory: <strong className="text-neutral-900 dark:text-white">14 Analogs Synced</strong>
            </span>
          </div>
        </div>

        {/* 6-Metric Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3">
          
          {/* 1. Bit Depth */}
          <div className="p-3 rounded-xl bg-neutral-50/70 dark:bg-[#0a0d13] border border-neutral-200/60 dark:border-neutral-800/80 space-y-1">
            <div className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase font-bold tracking-wider flex items-center justify-between">
              <span>BIT DEPTH (MD)</span>
              <Gauge className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-neutral-900 dark:text-white">
              {liveData.depthMD} <span className="text-xs font-normal text-neutral-400">m</span>
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
              TVD: {liveData.depthTVD} m · Δ +2.4 m/h
            </div>
          </div>

          {/* 2. Formation */}
          <div className="p-3 rounded-xl bg-neutral-50/70 dark:bg-[#0a0d13] border border-neutral-200/60 dark:border-neutral-800/80 space-y-1">
            <div className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase font-bold tracking-wider flex items-center justify-between">
              <span>FORMATION</span>
              <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-base font-bold text-neutral-900 dark:text-white truncate font-mono">
              Upper Tipam
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono truncate">
              Sandstone · 12-1/4&quot; Hole
            </div>
          </div>

          {/* 3. Penetration Rate (ROP) */}
          <div className="p-3 rounded-xl bg-neutral-50/70 dark:bg-[#0a0d13] border border-neutral-200/60 dark:border-neutral-800/80 space-y-1">
            <div className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase font-bold tracking-wider flex items-center justify-between">
              <span>PENETRATION RATE</span>
              <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {liveData.rop} <span className="text-xs font-normal text-neutral-400">m/h</span>
            </div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
              ✓ Stable ROP Trend
            </div>
          </div>

          {/* 4. Surface Torque */}
          <div className="p-3 rounded-xl bg-neutral-50/70 dark:bg-[#0a0d13] border border-neutral-200/60 dark:border-neutral-800/80 space-y-1">
            <div className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase font-bold tracking-wider flex items-center justify-between">
              <span>SURFACE TORQUE</span>
              <Compass className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-neutral-900 dark:text-white">
              {liveData.torque} <span className="text-xs font-normal text-neutral-400">kft-lb</span>
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
              WOB: {liveData.wob} klbs · 82 RPM
            </div>
          </div>

          {/* 5. Mud Weight (In) */}
          <div className="p-3 rounded-xl bg-neutral-50/70 dark:bg-[#0a0d13] border border-neutral-200/60 dark:border-neutral-800/80 space-y-1">
            <div className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase font-bold tracking-wider flex items-center justify-between">
              <span>MUD WEIGHT (IN)</span>
              <Droplets className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
              {liveData.mudWeightIn} <span className="text-xs font-normal text-neutral-400">ppg</span>
            </div>
            <div className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">
              ECD Window: &le; 10.4 ppg
            </div>
          </div>

          {/* 6. Standpipe Pressure (SPP) */}
          <div className="p-3 rounded-xl bg-neutral-50/70 dark:bg-[#0a0d13] border border-neutral-200/60 dark:border-neutral-800/80 space-y-1">
            <div className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase font-bold tracking-wider flex items-center justify-between">
              <span>STANDPIPE PRESSURE</span>
              <AlertTriangle className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-neutral-900 dark:text-white">
              {liveData.standpipePressure} <span className="text-xs font-normal text-neutral-400">psi</span>
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
              Flow: 2,450 lpm · Out: {liveData.flowOutPercent}%
            </div>
          </div>

        </div>
      </Card>

      {/* ─── B. ROW 1: TOP 4 KPI CARDS (MATCHING DESIGN SYSTEM) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Active Drilling Rigs */}
        <Card className="rounded-2xl border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
              <HardHat className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Active Drilling Rigs</span>
            </div>
            <span title="Rigs currently drilling with live eRTMAC feeds">
              <Info className="w-3.5 h-3.5 text-neutral-400 cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-300" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-neutral-900 dark:text-white">
              {activeWells.length} Rigs Active
            </div>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 text-[11px] font-semibold font-mono">
              15.8% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            OIL-GLK-14 &amp; OIL-DGB-09 • Upper Tipam
          </div>
        </Card>

        {/* Card 2: Open Advisories */}
        <Card className="rounded-2xl border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Open Advisories</span>
            </div>
            <span title="Active geological risk lookahead countdown">
              <Info className="w-3.5 h-3.5 text-neutral-400 cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-300" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-neutral-900 dark:text-white">
              {alerts.length} High Risk
            </div>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60 text-[11px] font-semibold font-mono">
              74.6m Buffer <ArrowDownRight className="w-3 h-3" />
            </span>
          </div>
          <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            Geleki fluid loss corridor in 14.6m (Pre-treat LCM)
          </div>
        </Card>

        {/* Card 3: Proactive Lookahead Horizon */}
        <Card className="rounded-2xl border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Proactive Lookahead</span>
            </div>
            <span title="Continuous lookahead buffer advance">
              <Info className="w-3.5 h-3.5 text-neutral-400 cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-300" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-neutral-900 dark:text-white">
              74.6m Buffer
            </div>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60 text-[11px] font-semibold font-mono">
              14 Analogs <Sparkles className="w-3 h-3" />
            </span>
          </div>
          <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            Imminent thief sandstone entry · Lead time ~3.2 hrs
          </div>
        </Card>

        {/* Card 4: Avoided NPT & Safe Passes */}
        <Card className="rounded-2xl border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Avoided NPT &amp; Safe Passes</span>
            </div>
            <span title="Historical disconfirming safe passes benchmark">
              <Info className="w-3.5 h-3.5 text-neutral-400 cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-300" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-neutral-900 dark:text-white">
              34.0 NPT h
            </div>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 text-[11px] font-semibold font-mono">
              3 Wells Safe <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            Zero losses with ECD &le; 10.3 ppg (Zero alert fatigue)
          </div>
        </Card>

      </div>

      {/* ─── C. PROACTIVE HAZARD ADVISORY (STRICT 3-PART SEPARATION) ─── */}
      <Card className="rounded-2xl border-amber-300/80 dark:border-amber-900/60 bg-white dark:bg-[#12151c] p-5 sm:p-6 shadow-sm space-y-4 relative overflow-hidden">
        
        {/* Advisory Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 animate-pulse">
                HIGH SEVERITY ADVISORY
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-500/30">
                PROACTIVE 75m HORIZON
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                Trigger: <strong className="text-neutral-900 dark:text-white">14.6m Ahead</strong> (at 2,180m MD)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-950 dark:text-white mt-1">
              Imminent Thief Sandstone Total Mud Loss Corridor (2,240m MD)
            </h2>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="text-right">
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block uppercase font-bold">Composite Confidence</span>
              <strong className="text-amber-700 dark:text-amber-400 text-sm">0.82 (High)</strong>
            </div>
            <div className="text-right border-l border-neutral-200 dark:border-neutral-800 pl-3">
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block uppercase font-bold">Offset Evidence</span>
              <strong className="text-neutral-900 dark:text-white text-sm">5 Analog Wells</strong>
            </div>
          </div>
        </div>

        {/* Strict 3-Part Separation Grid: Fact vs Estimate vs Mitigation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* 1. Observed Historical Fact (GROUND TRUTH) */}
          <div className="p-4 rounded-xl bg-neutral-50/70 dark:bg-[#0a0d13] border-l-4 border-l-blue-600 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between shadow-2xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200/60 dark:border-neutral-800 text-xs font-mono font-bold uppercase text-blue-700 dark:text-blue-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  1. Observed Historical Fact
                </span>
                <span className="px-1.5 py-0.2 bg-blue-500/15 text-blue-700 dark:text-blue-400 text-[10px] font-bold rounded">
                  GROUND TRUTH
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
                <strong className="text-blue-700 dark:text-blue-400">5 offset wells</strong> in Geleki encountering Upper Tipam sandstones experienced severe lost circulation (12–35 m³/hr) between 2,180m and 2,350m MD. Historical average NPT: <strong className="text-rose-600 dark:text-rose-400">28.4 hours lost per incident</strong> (~₹42.6 Lakhs loss).
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-neutral-200/60 dark:border-neutral-800 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 flex justify-between">
              <span>Primary Analog: <strong className="text-neutral-900 dark:text-white">OIL-GLK-07</strong></span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">WCR-1996/p19</span>
            </div>
          </div>

          {/* 2. Model-Estimated Risk (75m LOOKAHEAD) */}
          <div className="p-4 rounded-xl bg-neutral-50/70 dark:bg-[#0a0d13] border-l-4 border-l-amber-500 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between shadow-2xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200/60 dark:border-neutral-800 text-xs font-mono font-bold uppercase text-amber-700 dark:text-amber-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  2. Model-Estimated Risk
                </span>
                <span className="px-1.5 py-0.2 bg-amber-500/15 text-amber-800 dark:text-amber-400 text-[10px] font-bold rounded">
                  75m LOOKAHEAD
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
                Current trajectory and formation-relative depth indicate imminent entry into micro-fractured thief sandstones within approximately <strong className="text-amber-700 dark:text-amber-400">74.6 m MD</strong>. Excessive ECD (&gt;10.4 ppg) is <strong className="text-rose-600 dark:text-rose-400">68% correlated</strong> with immediate severe fluid loss.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-neutral-200/60 dark:border-neutral-800 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 flex justify-between">
              <span>Lithology Twin: <strong className="text-neutral-900 dark:text-white">0.84 Similarity</strong></span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">Lead time: ~3.2 hrs</span>
            </div>
          </div>

          {/* 3. Recommended Mitigation (ACTION PLAN) */}
          <div className="p-4 rounded-xl bg-neutral-50/70 dark:bg-[#0a0d13] border-l-4 border-l-emerald-600 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between shadow-2xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200/60 dark:border-neutral-800 text-xs font-mono font-bold uppercase text-emerald-700 dark:text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  3. Recommended Mitigation
                </span>
                <span className="px-1.5 py-0.2 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded">
                  ACTION PLAN
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
                Stage <strong className="text-emerald-700 dark:text-emerald-400">35 ppb mixed-fiber LCM pill</strong> in active suction pit prior to 2,190 m MD; <strong className="text-emerald-700 dark:text-emerald-400">Cap ECD at 10.4 ppg</strong>; Standby secondary cement squeezer on deck. (Proven recovery in OIL-GLK-07 &amp; OIL-GLK-11).
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-neutral-200/60 dark:border-neutral-800 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 flex justify-between">
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">Non-Binding Decision Support</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Ready to Apply</span>
            </div>
          </div>

        </div>

        {/* Provenance & Disconfirming Clean Evidence Bar */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2 flex-wrap font-mono text-[11px]">
            <span className="text-neutral-500 dark:text-neutral-400 font-semibold">Source Provenance:</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold">STRUCTURED-HIGH: 3</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-400 font-bold">OCR-HIGH: 2</span>
            <span className="px-2 py-0.5 rounded-md bg-neutral-500/15 border border-neutral-500/30 text-neutral-600 dark:text-neutral-400 font-bold">MANUAL-REVIEW: 0</span>
          </div>

          <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200 text-xs font-sans bg-emerald-500/10 border border-emerald-500/25 p-2 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>Disconfirming Evidence:</strong> 3 offset wells (OIL-GLK-05, OIL-GLK-11) crossed safely with zero losses by capping ECD &lt; 10.3 ppg.
            </span>
          </div>

        </div>

        {/* Action Buttons Deck */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenEvidence(GELEKI_OFFSET_WELLS[0])}
              className="rounded-xl border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#12151c] text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 gap-1.5 h-8 shadow-2xs hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>Review Evidence (WCR-1996/p19)</span>
            </Button>

            <Link
              href="/replay"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#12151c] text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 h-8 shadow-2xs hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <Activity className="w-3.5 h-3.5 text-amber-600" />
              <span>Validate in Replay Simulator</span>
            </Link>
          </div>

          <div>
            {alertAcknowledged ? (
              <span className="px-3.5 py-1.5 bg-emerald-600 text-white font-bold text-xs font-mono rounded-xl flex items-center gap-1.5 shadow-2xs">
                <Check className="w-3.5 h-3.5" />
                Advisory Acknowledged &amp; Staged on Deck
              </span>
            ) : (
              <Button
                onClick={handleAcknowledge}
                size="sm"
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-mono gap-1.5 h-8 shadow-2xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Acknowledge Advisory &amp; Log to Audit</span>
              </Button>
            )}
          </div>
        </div>

      </Card>

      {/* ─── D. ROW 2: MIDDLE SPLIT (FORMATION STRATA 60% + SHIFT INCIDENTS 40%) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Card: Lookahead & Formation Strata Ribbon Chart (7 cols) */}
        <Card className="lg:col-span-7 rounded-2xl border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs transition-colors">
          {/* Header */}
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white">
              <BarChart2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Lookahead Hazard Horizon &amp; Formation Strata</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-neutral-200 dark:border-neutral-800 text-[11px] font-medium h-7 px-2.5 gap-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <Filter className="w-3 h-3" />
                Filter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-neutral-200 dark:border-neutral-800 text-[11px] font-medium h-7 px-2.5 gap-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <ArrowUpDown className="w-3 h-3" />
                Sort
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-neutral-200 dark:border-neutral-800 text-[11px] font-medium h-7 w-7 p-0 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Metric Row */}
          <div className="flex items-baseline justify-between mt-1 mb-6">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-neutral-900 dark:text-white">
                2,180.5 m MD
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 text-[11px] font-semibold font-mono">
                  14.6m to Loss Zone <ArrowUpRight className="w-3 h-3" />
                </span>
                <span className="text-neutral-500 dark:text-neutral-400 font-medium font-mono">
                  + 75m buffer increased
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-semibold font-mono text-neutral-800 dark:text-neutral-300">
                Target: 3,420 m TD
              </div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                ROP: 14.8 m/h • Torque: 18.4 kft-lb
              </div>
            </div>
          </div>

          {/* Connected Ribbon Stacked Formation Strata Chart */}
          <div className="relative w-full h-56 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 540 220" preserveAspectRatio="none">
              <defs>
                <linearGradient id="strataTerracotta" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ea580c" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity="0.25" />
                </linearGradient>
                <linearGradient id="strataAmber" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.22" />
                </linearGradient>
                <linearGradient id="strataOchre" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#eab308" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#eab308" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="strataEmerald" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#059669" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="strataSlate" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#475569" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#475569" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Connecting Ribbons: Depth Stage 1 -> Depth Stage 2 */}
              <path d="M 125 155 C 190 155, 200 150, 265 150 L 265 175 C 200 175, 190 180, 125 180 Z" fill="url(#strataTerracotta)" />
              <path d="M 125 130 C 190 130, 200 132, 265 132 L 265 146 C 200 146, 190 151, 125 151 Z" fill="url(#strataAmber)" />
              <path d="M 125 110 C 190 110, 200 118, 265 118 L 265 128 C 200 128, 190 126, 125 126 Z" fill="url(#strataOchre)" />
              <path d="M 125 96 C 190 96, 200 106, 265 106 L 265 114 C 200 114, 190 106, 125 106 Z" fill="url(#strataEmerald)" />
              <path d="M 125 86 C 190 86, 200 98, 265 98 L 265 103 C 200 103, 190 93, 125 93 Z" fill="url(#strataSlate)" />

              {/* Connecting Ribbons: Depth Stage 2 -> Depth Stage 3 */}
              <path d="M 275 150 C 340 150, 350 145, 415 145 L 415 180 C 350 180, 340 175, 275 175 Z" fill="url(#strataTerracotta)" />
              <path d="M 275 132 C 340 132, 350 115, 415 115 L 415 141 C 350 141, 340 146, 275 146 Z" fill="url(#strataAmber)" />
              <path d="M 275 118 C 340 118, 350 90, 415 90 L 415 111 C 350 111, 340 128, 275 128 Z" fill="url(#strataOchre)" />
              <path d="M 275 106 C 340 106, 350 68, 415 68 L 415 86 C 350 86, 340 114, 275 114 Z" fill="url(#strataEmerald)" />
              <path d="M 275 98 C 340 98, 350 50, 415 50 L 415 64 C 350 64, 340 103, 275 103 Z" fill="url(#strataSlate)" />

              {/* ─── Column 1: Spud Entry (2,100m) ─── */}
              <text x="100" y="70" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="monospace" fill="#737373">2,100m</text>
              <rect x="78" y="155" width="46" height="25" rx="5" fill="#ea580c" />
              <rect x="78" y="130" width="46" height="21" rx="5" fill="#d97706" />
              <rect x="78" y="110" width="46" height="16" rx="5" fill="#eab308" />
              <rect x="78" y="96" width="46" height="10" rx="4" fill="#059669" />
              <rect x="78" y="86" width="46" height="7" rx="3" fill="#475569" />
              <text x="100" y="200" textAnchor="middle" fontSize="11" fontWeight="600" fill="#737373">Upper Tipam</text>

              {/* ─── Column 2: Current Bit (2,180m) ─── */}
              <text x="270" y="82" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="monospace" fill="#d97706">2,180m ★</text>
              <rect x="248" y="150" width="46" height="25" rx="5" fill="#ea580c" />
              <rect x="248" y="132" width="46" height="14" rx="5" fill="#d97706" />
              <rect x="248" y="118" width="46" height="10" rx="4" fill="#eab308" />
              <rect x="248" y="106" width="46" height="8" rx="4" fill="#059669" />
              <rect x="248" y="98" width="46" height="5" rx="2.5" fill="#475569" />
              <text x="270" y="200" textAnchor="middle" fontSize="11" fontWeight="600" fill="#d97706">Loss Horizon</text>

              {/* ─── Column 3: Lookahead Target (2,250m) ─── */}
              <text x="440" y="36" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="monospace" fill="#737373">2,250m</text>
              <rect x="418" y="145" width="46" height="35" rx="5" fill="#ea580c" />
              <rect x="418" y="115" width="46" height="26" rx="5" fill="#d97706" />
              <rect x="418" y="90" width="46" height="21" rx="5" fill="#eab308" />
              <rect x="418" y="68" width="46" height="18" rx="5" fill="#059669" />
              <rect x="418" y="50" width="46" height="14" rx="5" fill="#475569" />
              <text x="440" y="200" textAnchor="middle" fontSize="11" fontWeight="600" fill="#737373">Barail Sand</text>
            </svg>
          </div>

          {/* Chart Strata Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-600 dark:text-neutral-400 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#ea580c]" />
              <span>Surma Group</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#d97706]" />
              <span>Tipam Sandstone</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#eab308]" />
              <span>Barail Arenaceous</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#059669]" />
              <span>Kopili Shale</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#475569]" />
              <span>Girujan Clay</span>
            </div>
          </div>
        </Card>

        {/* Right Card: Shift Incident Alerts (5 cols) */}
        <Card className="lg:col-span-5 rounded-2xl border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white">
                <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Shift Incident Alerts</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-neutral-200/80 dark:border-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 shadow-2xs cursor-pointer">
                <span>{subscriberTimeframe}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </div>
            </div>

            {/* Metric Row */}
            <div className="mt-1 mb-6 space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-neutral-900 dark:text-white">
                24 Shift Hours
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 text-[11px] font-semibold">
                  8.3% margin <ArrowUpRight className="w-3 h-3" />
                </span>
                <span className="text-neutral-500 dark:text-neutral-400 font-medium">
                  + 3 alerts logged
                </span>
              </div>
            </div>
          </div>

          {/* 7-Day Bar Chart with Tuesday Highlight */}
          <div className="w-full pt-4">
            <div className="flex items-end justify-between gap-2 h-44 px-2">
              
              {/* Sun */}
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full max-w-[28px] h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 transition-all hover:opacity-80" />
                <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">Sun</span>
              </div>

              {/* Mon */}
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full max-w-[28px] h-20 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 transition-all hover:opacity-80" />
                <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">Mon</span>
              </div>

              {/* Tue (Highlighted active bar with 14.6m badge) */}
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="text-[10px] font-bold font-mono text-amber-700 dark:text-amber-400 leading-none">
                  14.6m
                </div>
                <div className="w-full max-w-[28px] h-32 rounded-lg bg-gradient-to-t from-amber-700 via-amber-600 to-orange-500 shadow-md shadow-amber-600/20" />
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">Tue</span>
              </div>

              {/* Wed */}
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full max-w-[28px] h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 transition-all hover:opacity-80" />
                <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">Wed</span>
              </div>

              {/* Thu */}
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full max-w-[28px] h-24 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 transition-all hover:opacity-80" />
                <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">Thu</span>
              </div>

              {/* Fri */}
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full max-w-[28px] h-28 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 transition-all hover:opacity-80" />
                <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">Fri</span>
              </div>

              {/* Sat */}
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full max-w-[28px] h-22 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 transition-all hover:opacity-80" />
                <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">Sat</span>
              </div>

            </div>
          </div>
        </Card>

      </div>

      {/* ─── E. ROW 3: BOTTOM SPLIT (MEMORY DECAY 40% + OFFSET WELL TABLE 60%) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Card: Memory Decay Distribution (5 cols) */}
        <Card className="lg:col-span-5 rounded-2xl border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white">
                <TrendingDown className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Memory Decay Distribution</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-neutral-200/80 dark:border-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 shadow-2xs cursor-pointer">
                <span>{distributionTimeframe}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </div>
            </div>

            {/* 3 Metrics with color indicators */}
            <div className="grid grid-cols-3 gap-3 pt-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                  <span className="w-1.5 h-3 rounded-xs bg-rose-600" />
                  <span>Digboi</span>
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-neutral-900 dark:text-white mt-1">
                  88/100
                </div>
                <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                  851 Paper Only
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                  <span className="w-1.5 h-3 rounded-xs bg-amber-600" />
                  <span>Kharsang</span>
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-neutral-900 dark:text-white mt-1">
                  65/100
                </div>
                <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                  51 Scanned Logs
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                  <span className="w-1.5 h-3 rounded-xs bg-emerald-600" />
                  <span>Geleki</span>
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-neutral-900 dark:text-white mt-1">
                  42/100
                </div>
                <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                  80 Digital Synced
                </div>
              </div>
            </div>
          </div>

          {/* Semi-Circle Donut Gauge with Radial Rays */}
          <div className="relative w-full h-44 flex items-end justify-center overflow-hidden pt-2">
            <svg className="w-72 h-36" viewBox="0 0 240 120">
              {/* Radial Background Ticks */}
              {Array.from({ length: 37 }).map((_, i) => {
                const angle = 180 + i * (180 / 36);
                const rad = (angle * Math.PI) / 180;
                const x1 = 120 + 96 * Math.cos(rad);
                const y1 = 120 + 96 * Math.sin(rad);
                const x2 = 120 + 104 * Math.cos(rad);
                const y2 = 120 + 104 * Math.sin(rad);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="currentColor"
                    className="text-neutral-200 dark:text-neutral-800"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Gauge Track */}
              <path
                d="M 30 120 A 90 90 0 0 1 210 120"
                fill="none"
                stroke="currentColor"
                className="text-neutral-100 dark:text-neutral-800"
                strokeWidth="24"
              />

              {/* Arc 1: Digboi Paper-Only Risk (Rose ~50%) */}
              <path
                d="M 30 120 A 90 90 0 0 1 120 30"
                fill="none"
                stroke="#e11d48"
                strokeWidth="24"
                strokeLinecap="butt"
              />

              {/* Arc 2: Kharsang Scanned TIFFs (Amber ~35%) */}
              <path
                d="M 124 30 A 90 90 0 0 1 190 65"
                fill="none"
                stroke="#d97706"
                strokeWidth="24"
                strokeLinecap="butt"
              />

              {/* Arc 3: Geleki Verified Digital (Emerald ~15%) */}
              <path
                d="M 193 68 A 90 90 0 0 1 210 120"
                fill="none"
                stroke="#059669"
                strokeWidth="24"
                strokeLinecap="butt"
              />
            </svg>
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-500 dark:text-neutral-400 font-sans flex items-center justify-between">
            <span>Legacy Wells Ingested: <strong>1,350 Records</strong></span>
            <Link href="/decay-index" className="text-amber-600 dark:text-amber-400 hover:underline font-mono font-semibold">
              Explore Decay Index →
            </Link>
          </div>
        </Card>

        {/* Right Card: Offset Well Correlation Table (Dual-Signal Engine) (7 cols) */}
        <Card className="lg:col-span-7 rounded-2xl border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs transition-colors">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white">
                  <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Offset Well Correlation Table</span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30">
                  DUAL SIGNAL ENGINE
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-sans mt-0.5">
                Comparison of geographic distance vs composite petrophysical similarity (Similarity ≠ Distance).
              </p>
            </div>

            {/* Sort Switcher */}
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-neutral-500 text-[11px] mr-1">Sort:</span>
              <button
                onClick={() => setActiveSortTab('similarity')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeSortTab === 'similarity'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Composite Similarity
              </button>
              <button
                onClick={() => setActiveSortTab('distance')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeSortTab === 'distance'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Map Distance (km)
              </button>
            </div>
          </div>

          {/* Operational Dual-Signal Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-neutral-100 dark:border-neutral-800">
                  <TableHead className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono">Well &amp; Spud</TableHead>
                  <TableHead className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono">Distance</TableHead>
                  <TableHead className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono">Similarity</TableHead>
                  <TableHead className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono">Historical Event &amp; NPT</TableHead>
                  <TableHead className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider text-right font-mono">Evidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOffsets.map((offset) => (
                  <TableRow 
                    key={offset.id}
                    className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 border-neutral-100 dark:border-neutral-800"
                  >
                    {/* Well Name & Badges */}
                    <TableCell>
                      <div className="flex items-center gap-2 font-mono">
                        <Link 
                          href={`/wells/${offset.id}`}
                          className="font-bold text-xs text-neutral-900 dark:text-white hover:text-amber-600 transition-colors"
                        >
                          {offset.name}
                        </Link>
                        {offset.isBestComparison && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold font-mono bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-500/30">
                            BEST ANALOG
                          </span>
                        )}
                        {offset.isGeographicallyClosest && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                            CLOSEST
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans">
                        Spud {offset.spudYear} · {offset.formationMatch.split('(')[0]}
                      </div>
                    </TableCell>

                    {/* Distance */}
                    <TableCell className="font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      {offset.distanceKm} km
                    </TableCell>

                    {/* Similarity Score with Progress Bar */}
                    <TableCell className="w-36">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-neutral-900 dark:text-white w-8">
                          {offset.similarityScore.toFixed(2)}
                        </span>
                        <div className="flex-1 h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              offset.similarityScore > 0.8
                                ? 'bg-amber-600'
                                : offset.similarityScore > 0.6
                                ? 'bg-emerald-600'
                                : 'bg-neutral-400'
                            }`}
                            style={{ width: `${offset.similarityScore * 100}%` }} 
                          />
                        </div>
                      </div>
                    </TableCell>

                    {/* Historical Event & NPT */}
                    <TableCell className="text-xs">
                      {offset.status === 'clean' ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Zero Loss Clean Pass
                        </span>
                      ) : (
                        <div>
                          <span className="text-rose-600 dark:text-rose-400 font-semibold font-mono block">
                            {offset.historicalEvent}
                          </span>
                          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                            NPT: {offset.nptHours} hrs lost
                          </span>
                        </div>
                      )}
                    </TableCell>

                    {/* Action Button */}
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEvidence(offset)}
                        className="rounded-lg border-neutral-200 dark:border-neutral-800 text-[11px] font-mono font-bold h-7 px-2.5 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer shadow-2xs"
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        <span>Inspect</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

      </div>

      {/* ─── F. EVIDENCE INSPECTOR MODAL DRAWER ─── */}
      <EvidenceInspectorDrawer
        isOpen={isEvidenceDrawerOpen}
        onClose={() => setIsEvidenceDrawerOpen(false)}
        wellName={selectedEvidenceWell.name}
        sourceRef={selectedEvidenceWell.sourceRef}
        incidentDepth={parseInt(selectedEvidenceWell.depthAlignment.replace(/[^0-9]/g, '')) || 2280}
        formationName={selectedEvidenceWell.formationMatch.split('(')[0].trim()}
        confidence={selectedEvidenceWell.sourceConfidence}
        nptHours={selectedEvidenceWell.nptHours}
        mitigationApplied={selectedEvidenceWell.mitigationUsed}
        narrative={`Encountered ${selectedEvidenceWell.historicalEvent} while traversing ${selectedEvidenceWell.formationMatch} at ${selectedEvidenceWell.depthAlignment}. Mitigation applied: ${selectedEvidenceWell.mitigationUsed}. Total Non-Productive Time (NPT) logged: ${selectedEvidenceWell.nptHours} hours.`}
      />

    </div>
  );
}
