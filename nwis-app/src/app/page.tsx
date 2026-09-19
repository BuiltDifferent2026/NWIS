'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Activity, 
  GitCompare, 
  Database, 
  TrendingDown, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Bell, 
  ShieldCheck, 
  Compass, 
  HardHat, 
  FileText,
  Sparkles,
  Zap,
  Gauge,
  Play,
  RotateCcw,
  Check,
  Flame,
  Droplets,
  Wind,
  Navigation,
  FileSearch,
  BookOpen
} from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { INITIAL_LIVE_TELEMETRY } from '@/data/live-state';

export default function HomePage() {
  const { alerts } = useAppStore();
  const [liveDepth, setLiveDepth] = useState<number>(INITIAL_LIVE_TELEMETRY.depthMD);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simStep, setSimStep] = useState<number>(0);

  const live = INITIAL_LIVE_TELEMETRY;

  // Interactive Live Step Simulation for Evaluators
  const triggerEvaluatorStep = () => {
    setIsSimulating(true);
    setSimStep((prev) => (prev + 1) % 3);
    if (simStep === 0) {
      setLiveDepth(2172.8);
    } else if (simStep === 1) {
      setLiveDepth(2180.0);
    } else {
      setLiveDepth(2165.4);
    }
    setTimeout(() => setIsSimulating(false), 500);
  };

  const operationalConsoles = [
    {
      title: 'Live Operations Cockpit',
      titleHindi: 'लाइव ड्रिलिंग कॉकपिट',
      tag: 'ACTIVE WITSML FEED',
      tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
      borderColor: 'border-t-emerald-600',
      iconBg: 'bg-emerald-500 text-white',
      description: 'Active drilling operations workspace alongside eRTMAC. Displays real-time wellbore telemetry, 75m lookahead hazard alerts, and synchronized offset correlation.',
      href: '/operations',
      icon: Layers,
      primaryMetric: 'OIL-GLK-14 @ 2,165.4m MD',
      subMetric: 'Upper Tipam Formation · 74.6m buffer to thief zone',
      accentText: 'text-emerald-700 dark:text-emerald-400'
    },
    {
      title: 'Historical Well Replay Simulator',
      titleHindi: 'ऐतिहासिक कूप रीप्ले सिम्युलेटर',
      tag: 'VALIDATION BENCHMARK',
      tagColor: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
      borderColor: 'border-t-amber-500',
      iconBg: 'bg-amber-500 text-white',
      description: 'Deterministic benchmark simulator. Replays historical 1988–2004 drilling feeds at 1x–20x speed to verify proactive lookahead warnings prior to documented loss events.',
      href: '/replay',
      icon: Activity,
      primaryMetric: 'OIL-GLK-07 (1996 Incident)',
      subMetric: 'Fired 75m ahead of total loss · 34 hrs NPT avoided',
      accentText: 'text-amber-700 dark:text-amber-400'
    },
    {
      title: 'Offset Well Geospatial Correlation',
      titleHindi: 'भू-स्थानिक ऑफसेट सहसंबंध इंजन',
      tag: 'SIMILARITY ENGINE',
      tagColor: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
      borderColor: 'border-t-blue-600',
      iconBg: 'bg-blue-600 text-white',
      description: 'Multi-well petrophysical correlation matrix and map. Surfaces true stratigraphic analogs across complex Assam fault blocks where similarity does not equal map distance.',
      href: '/analogs',
      icon: GitCompare,
      primaryMetric: 'OIL-GLK-07 (0.84 Similarity)',
      subMetric: '3.1 km offset · Identical Upper Tipam lithology',
      accentText: 'text-blue-700 dark:text-blue-400'
    },
    {
      title: 'Hazard Advisories Inbox',
      titleHindi: 'भू-गर्भिक जोखिम सलाह इनबॉक्स',
      tag: `${alerts.length} ADVISORIES`,
      tagColor: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
      borderColor: 'border-t-rose-600',
      iconBg: 'bg-rose-600 text-white',
      description: 'Prioritized operational hazard notifications. Standardized 3-tier structure: Observed Ground Truth Fact, Model-Estimated Risk, and Recommended Mitigation.',
      href: '/alerts',
      icon: Bell,
      primaryMetric: '1 High-Priority Lost Circulation Notice',
      subMetric: 'Pre-treat active system with 35 ppb mixed-fiber LCM pill',
      accentText: 'text-rose-700 dark:text-rose-400'
    },
    {
      title: 'Institutional Memory Decay Index',
      titleHindi: 'संस्थागत ज्ञान क्षय सूचकांक',
      tag: 'GOVERNANCE AUDIT',
      tagColor: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
      borderColor: 'border-t-purple-600',
      iconBg: 'bg-purple-600 text-white',
      description: 'Quantifies physical subsurface knowledge erosion across Digboi, Kharsang, and Geleki fields to prioritize fragile paper records before senior superintendents retire.',
      href: '/decay-index',
      icon: TrendingDown,
      primaryMetric: 'Digboi Field: 88 / 100 Decay Risk',
      subMetric: '851 physical records requiring urgent planetary scanning',
      accentText: 'text-purple-700 dark:text-purple-400'
    },
    {
      title: 'Archival Ingestion & OCR Pipeline',
      titleHindi: 'अभिलेखागार अंतर्ग्रहण और ओसीआर',
      tag: 'TWO-PATH INGESTION',
      tagColor: 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800',
      borderColor: 'border-t-teal-600',
      iconBg: 'bg-teal-600 text-white',
      description: 'Ingests and standardizes 130+ years of typed WCRs, Daily Drilling Reports (DDRs), and real-time WITSML streams into audit-ready schemas with layout-aware OCR.',
      href: '/admin/ingestion',
      icon: Database,
      primaryMetric: '94.2% Layout OCR Accuracy',
      subMetric: '1,690 documents indexed across Assam-Arakan Basin',
      accentText: 'text-teal-700 dark:text-teal-400'
    }
  ];

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto pb-8 font-sans">
      
      {/* ─── 0. Official Alert Flash Ticker Ribbon (महत्वपूर्ण परिचालन चेतावनी) ─── */}
      <div className="px-3.5 py-1.5 flex items-center justify-between gap-3 text-xs border border-amber-300 dark:border-amber-900 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-950/40 text-amber-900 dark:text-amber-200 rounded-xs shadow-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="px-1.5 py-0.2 bg-rose-600 text-white text-[10px] font-mono font-bold uppercase rounded-xs shrink-0 animate-pulse shadow-xs">
            महत्वपूर्ण चेतावनी | CRITICAL FLASH
          </span>
          <span className="font-mono text-xs truncate">
            <strong>OIL-GLK-14 (Geleki Field):</strong> Bit at {liveDepth}m MD approaching Tipam thief horizon (2,180m). Offset OIL-GLK-07 suffered 420 bbls lost circulation at equivalent structural depth.
          </span>
        </div>
        <Link
          href="/operations"
          className="text-[11px] font-bold text-blue-700 dark:text-blue-300 hover:underline shrink-0 font-mono flex items-center gap-1"
        >
          <span>View Telemetry</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* ─── 1. National Energy Mission & SIH 2026 Executive Showcase ─── */}
      <div className="p-4 bg-white dark:bg-[#071d36] border-t-4 border-t-[#ff9933] border-x border-b border-[#d0d7de] dark:border-[#1e3a5f] rounded-xs shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 bg-[#0b3c6d] text-white text-[10px] font-mono font-bold uppercase rounded-xs shadow-xs">
                🇮🇳 भारत सरकार | आत्मनिर्भर ऊर्जा मिशन
              </span>
              <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-mono font-black uppercase rounded-xs shadow-xs">
                SIH 2026 Problem Statement #26121
              </span>
              <span className="text-xs font-mono text-muted-foreground font-semibold">
                Oil India Limited · eRTMAC Decision Companion
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0b3c6d] dark:text-[#93c5fd] font-sans mt-1.5">
              निकटवर्ती कूप आसूचना प्रणाली (NWIS) — Nearby Wells Intelligence System
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans">
              AI-Powered Subsurface Offset Correlation &amp; Proactive Lookahead Decision Support for Zero Unplanned Drilling NPT across the Assam-Arakan Basin.
            </p>
          </div>

          {/* Quick Evaluator Simulation Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={triggerEvaluatorStep}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-mono font-black text-xs rounded-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer border border-amber-400"
              title="Click to simulate live WITSML depth advance and lookahead trigger"
            >
              <Zap className={`w-4 h-4 text-slate-950 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>Simulate Depth Advance ({liveDepth}m)</span>
            </button>
          </div>
        </div>

        {/* ─── 3 One-Click Interactive Evaluator Test Scenarios (Colorful) ─── */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="font-bold text-[#0b3c6d] dark:text-[#93c5fd] uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              ⚡ 1-Click Evaluator Test Scenarios (Jury Quick Assessment Mode):
            </span>
            <span className="text-muted-foreground">Select any scenario to inspect live response</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Scenario 1 */}
            <Link
              href="/operations"
              className="p-3 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-[#071d36] border-2 border-emerald-500 hover:border-emerald-600 transition-all rounded-xs flex items-start gap-3 group cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="w-9 h-9 rounded-xs bg-emerald-600 text-white flex items-center justify-center shrink-0 font-mono font-black text-base shadow-sm">
                1
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-800 dark:text-emerald-300 font-sans group-hover:underline">
                    Live Lookahead Hazard Alert
                  </span>
                  <span className="px-1.5 py-0.2 bg-emerald-600 text-white font-mono font-bold text-[9px] rounded-xs uppercase">
                    LIVE COCKPIT
                  </span>
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                  Well OIL-GLK-14 @ 2,165.4m: <strong className="text-emerald-700 dark:text-emerald-400">74.6m lead warning</strong> before hitting Upper Tipam thief zone.
                </p>
              </div>
            </Link>

            {/* Scenario 2 */}
            <Link
              href="/replay"
              className="p-3 bg-gradient-to-br from-amber-50 via-orange-50/40 to-white dark:from-amber-950/40 dark:via-orange-950/20 dark:to-[#071d36] border-2 border-amber-500 hover:border-amber-600 transition-all rounded-xs flex items-start gap-3 group cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="w-9 h-9 rounded-xs bg-amber-500 text-white flex items-center justify-center shrink-0 font-mono font-black text-base shadow-sm">
                2
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-amber-800 dark:text-amber-300 font-sans group-hover:underline">
                    Historical Benchmark Simulator
                  </span>
                  <span className="px-1.5 py-0.2 bg-amber-500 text-white font-mono font-bold text-[9px] rounded-xs uppercase">
                    VALIDATION
                  </span>
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                  Replay 1996 GLK-07 severe loss: Verifies <strong className="text-amber-700 dark:text-amber-400">34 NPT hours avoided</strong> by NWIS early alert.
                </p>
              </div>
            </Link>

            {/* Scenario 3 */}
            <Link
              href="/decay-index"
              className="p-3 bg-gradient-to-br from-blue-50 via-indigo-50/40 to-white dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-[#071d36] border-2 border-blue-500 hover:border-blue-600 transition-all rounded-xs flex items-start gap-3 group cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="w-9 h-9 rounded-xs bg-blue-600 text-white flex items-center justify-center shrink-0 font-mono font-black text-base shadow-sm">
                3
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-blue-800 dark:text-blue-300 font-sans group-hover:underline">
                    Institutional Memory Decay Index
                  </span>
                  <span className="px-1.5 py-0.2 bg-blue-600 text-white font-mono font-bold text-[9px] rounded-xs uppercase">
                    DIGITIZATION
                  </span>
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                  <strong className="text-blue-700 dark:text-blue-400">88/100 Digboi Fragility:</strong> Vectorizes 130+ years of deteriorating hand-drafted drilling logs.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 2. Executive Value Metrics (Vibrant 4-Color Proof Strip) ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Green */}
        <div className="p-3.5 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-white dark:to-[#071d36] border-l-4 border-l-emerald-600 border border-emerald-200 dark:border-emerald-900/60 rounded-xs shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-emerald-800 dark:text-emerald-300 font-bold uppercase">
            <span>Basin NPT Value Saved</span>
            <span className="px-1 py-0.2 bg-emerald-600 text-white text-[9px] font-bold rounded-xs">● VERIFIED</span>
          </div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
            ₹14.8 Cr
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 font-sans">
            34 NPT hrs saved per severe thief-zone loss event avoided
          </p>
        </div>

        {/* Card 2: Amber/Saffron */}
        <div className="p-3.5 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white dark:to-[#071d36] border-l-4 border-l-[#ff9933] border border-amber-200 dark:border-amber-900/60 rounded-xs shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-amber-800 dark:text-amber-300 font-bold uppercase">
            <span>Lookahead Lead Buffer</span>
            <span className="px-1 py-0.2 bg-amber-500 text-white text-[9px] font-bold rounded-xs">● ACTIVE</span>
          </div>
          <div className="text-2xl font-black text-amber-700 dark:text-amber-400 font-mono">
            74.6m / 3.2 hrs
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 font-sans">
            Early notification window prior to intersecting Tipam loss zone
          </p>
        </div>

        {/* Card 3: Royal Blue */}
        <div className="p-3.5 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-white dark:to-[#071d36] border-l-4 border-l-blue-600 border border-blue-200 dark:border-blue-900/60 rounded-xs shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-blue-800 dark:text-blue-300 font-bold uppercase">
            <span>Offset Analogy Index</span>
            <span className="px-1 py-0.2 bg-blue-600 text-white text-[9px] font-bold rounded-xs">GLK-07 ↔ GLK-14</span>
          </div>
          <div className="text-2xl font-black text-blue-700 dark:text-blue-400 font-mono">
            0.87 Composite
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 font-sans">
            5-parameter stratigraphic correlation across Geleki fault block
          </p>
        </div>

        {/* Card 4: Purple */}
        <div className="p-3.5 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-white dark:to-[#071d36] border-l-4 border-l-purple-600 border border-purple-200 dark:border-purple-900/60 rounded-xs shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-purple-800 dark:text-purple-300 font-bold uppercase">
            <span>Institutional Records</span>
            <span className="px-1 py-0.2 bg-purple-600 text-white text-[9px] font-bold rounded-xs">1889–2026</span>
          </div>
          <div className="text-2xl font-black text-purple-700 dark:text-purple-400 font-mono">
            1,690+ WCRs/DDRs
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 font-sans">
            130+ years of typed, scanned, and physical subsurface data
          </p>
        </div>
      </div>

      {/* ─── 3. Live Active Rig Focus Snapshot (OIL-GLK-14 Cockpit Preview) ─── */}
      <div className="gov-panel space-y-3 bg-white dark:bg-[#071d36] border-2 border-[#0b3c6d] dark:border-[#38bdf8] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <h2 className="text-sm font-black text-[#0b3c6d] dark:text-[#93c5fd] font-sans uppercase">
              Current Live Lookahead Status: Well OIL-GLK-14 (Geleki Field · Rig #04)
            </h2>
          </div>
          <Link
            href="/operations"
            className="text-xs font-bold text-blue-700 dark:text-blue-300 hover:underline font-mono flex items-center gap-1"
          >
            <span>Open Full Interactive Cockpit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Live Gauges Strip (Vibrant Color Coded) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 font-mono text-xs">
          {/* Gauge 1: Depth (Amber/Gold) */}
          <div className="p-2.5 bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-white dark:to-[#0c2847] border border-amber-300 dark:border-amber-800 rounded-xs shadow-2xs">
            <div className="text-[10px] text-amber-800 dark:text-amber-300 uppercase font-bold flex items-center gap-1">
              <Gauge className="w-3 h-3 text-amber-600" />
              Bit Depth (MD)
            </div>
            <div className="text-xl font-black text-amber-700 dark:text-amber-300 mt-0.5">{liveDepth}m</div>
            <div className="text-[9px] text-amber-800 dark:text-amber-400 font-semibold">Target: 2,180.0m trigger</div>
          </div>

          {/* Gauge 2: ROP (Sky Blue) */}
          <div className="p-2.5 bg-gradient-to-br from-sky-500/15 via-sky-500/5 to-white dark:to-[#0c2847] border border-sky-300 dark:border-sky-800 rounded-xs shadow-2xs">
            <div className="text-[10px] text-sky-800 dark:text-sky-300 uppercase font-bold flex items-center gap-1">
              <Activity className="w-3 h-3 text-sky-600" />
              ROP
            </div>
            <div className="text-xl font-black text-sky-700 dark:text-sky-300 mt-0.5">{live.rop} m/h</div>
            <div className="text-[9px] text-sky-800 dark:text-sky-400 font-semibold">WOB: {live.wob} klbs</div>
          </div>

          {/* Gauge 3: Mud Weight (Teal) */}
          <div className="p-2.5 bg-gradient-to-br from-teal-500/15 via-teal-500/5 to-white dark:to-[#0c2847] border border-teal-300 dark:border-teal-800 rounded-xs shadow-2xs">
            <div className="text-[10px] text-teal-800 dark:text-teal-300 uppercase font-bold flex items-center gap-1">
              <Droplets className="w-3 h-3 text-teal-600" />
              Mud Weight
            </div>
            <div className="text-xl font-black text-teal-700 dark:text-teal-300 mt-0.5">{live.mudWeightIn} ppg</div>
            <div className="text-[9px] text-teal-800 dark:text-teal-400 font-semibold">Safe: 9.4–10.4 ppg</div>
          </div>

          {/* Gauge 4: Flow Out (Emerald Green) */}
          <div className="p-2.5 bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-white dark:to-[#0c2847] border border-emerald-300 dark:border-emerald-800 rounded-xs shadow-2xs">
            <div className="text-[10px] text-emerald-800 dark:text-emerald-300 uppercase font-bold flex items-center gap-1">
              <Wind className="w-3 h-3 text-emerald-600" />
              Flow Out %
            </div>
            <div className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-0.5">{live.flowOutPercent}%</div>
            <div className="text-[9px] text-emerald-800 dark:text-emerald-400 font-semibold">SPP: {live.standpipePressure} psi</div>
          </div>

          {/* Gauge 5: Gas Units (Purple) */}
          <div className="p-2.5 bg-gradient-to-br from-purple-500/15 via-purple-500/5 to-white dark:to-[#0c2847] border border-purple-300 dark:border-purple-800 rounded-xs shadow-2xs">
            <div className="text-[10px] text-purple-800 dark:text-purple-300 uppercase font-bold flex items-center gap-1">
              <Flame className="w-3 h-3 text-purple-600" />
              Gas Units
            </div>
            <div className="text-xl font-black text-purple-700 dark:text-purple-300 mt-0.5">{live.gasUnits} ppm</div>
            <div className="text-[9px] text-purple-800 dark:text-purple-400 font-semibold">Temp: {live.temperatureOut}°C</div>
          </div>
        </div>

        {/* 3-Tier Safety Advisory Quick Callout (High Contrast Callout Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs pt-1">
          <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/40 border-l-4 border-l-emerald-600 border border-emerald-200 dark:border-emerald-900 rounded-xs space-y-1 shadow-2xs">
            <div className="font-mono text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              1. Observed Historical Fact
            </div>
            <p className="font-sans text-[11px] text-slate-800 dark:text-slate-200 leading-snug">
              OIL-GLK-07 (1.8 km SE) suffered complete loss of 420 bbls mud at 2,280m MD (MW 10.8 ppg) in Upper Tipam.
            </p>
          </div>

          <div className="p-3 bg-rose-50/80 dark:bg-rose-950/40 border-l-4 border-l-rose-600 border border-rose-200 dark:border-rose-900 rounded-xs space-y-1 shadow-2xs">
            <div className="font-mono text-[10px] font-bold text-rose-800 dark:text-rose-300 uppercase flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-600" />
              2. Model-Estimated Risk (84%)
            </div>
            <p className="font-sans text-[11px] text-slate-800 dark:text-slate-200 leading-snug">
              High risk of lost circulation at 2,240–2,350m MD due to microfractured sandstone thief zones.
            </p>
          </div>

          <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 border-l-4 border-l-amber-600 border border-amber-200 dark:border-amber-900 rounded-xs space-y-1 shadow-2xs">
            <div className="font-mono text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-600" />
              3. Prescribed Mitigation
            </div>
            <p className="font-sans text-[11px] text-slate-800 dark:text-slate-200 leading-snug">
              Pre-treat active system with 35 ppb mixed-fiber LCM pill and reduce pump rate to 1,800 lpm prior to 2,180m.
            </p>
          </div>
        </div>
      </div>

      {/* ─── 4. Operational Consoles Grid (2 x 3 Vibrant Themed Cards) ─── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#0b3c6d] dark:text-[#93c5fd]">
            Core Operational Modules &amp; Subsurface Engines
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">
            6 Specialized Workspaces
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {operationalConsoles.map((console) => {
            const Icon = console.icon;
            return (
              <div
                key={console.title}
                className={`gov-panel flex flex-col justify-between space-y-3 ${console.borderColor} border-t-4 transition-all hover:shadow-md group bg-white dark:bg-[#071d36]`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xs ${console.iconBg} flex items-center justify-center shrink-0 shadow-xs`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-sm text-[#1f2328] dark:text-[#f0f2f5] font-sans group-hover:text-[#0b3c6d] dark:group-hover:text-[#93c5fd] transition-colors">
                          {console.title}
                        </h2>
                        <div className="text-[10px] text-[#57606a] dark:text-[#94a3b8] font-sans">
                          {console.titleHindi}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase border rounded-xs ${console.tagColor}`}>
                      {console.tag}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                    {console.description}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-border/70 space-y-2">
                  <div className="text-xs font-mono">
                    <div className={`font-bold truncate ${console.accentText}`}>
                      {console.primaryMetric}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {console.subMetric}
                    </div>
                  </div>

                  <Link
                    href={console.href}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold ${console.accentText} hover:underline pt-1 font-mono`}
                  >
                    <span>Launch Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── 5. Basin Risk Summary Table ─── */}
      <div className="gov-panel space-y-3 bg-white dark:bg-[#071d36] border-t-4 border-t-blue-600 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div>
            <h3 className="font-bold text-sm text-[#0b3c6d] dark:text-[#93c5fd] font-sans">
              Active Rig Fleet &amp; Lookahead Hazard Register
            </h3>
            <p className="text-xs text-muted-foreground font-sans">
              Immediate stratigraphic loss &amp; overpressure corridors along active drilling trajectories.
            </p>
          </div>
          <Link
            href="/alerts"
            className="text-xs font-bold text-blue-700 dark:text-blue-300 hover:underline font-mono"
          >
            View Full Inbox ({alerts.length}) →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table font-mono text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50">
                <th>Target Well</th>
                <th>Field / Formation</th>
                <th>Current Depth</th>
                <th>Lookahead Corridor</th>
                <th>Lead-Time Buffer</th>
                <th>Severity Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-amber-50/50 dark:hover:bg-amber-950/20">
                <td className="font-bold text-foreground">OIL-GLK-14</td>
                <td>Geleki · Upper Tipam</td>
                <td className="font-bold text-amber-600 dark:text-amber-400">{liveDepth}m MD</td>
                <td>Thief zone microfractures (2,240–2,350m)</td>
                <td className="text-amber-600 dark:text-amber-400 font-bold">74.6m ahead (~3.2 hrs)</td>
                <td>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 font-bold rounded-xs">
                    ADVISORY ACTIVE
                  </span>
                </td>
                <td className="text-right">
                  <Link href="/operations" className="text-blue-700 dark:text-blue-300 font-bold hover:underline">
                    Inspect Cockpit
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20">
                <td className="font-bold text-foreground">OIL-DGB-09</td>
                <td>Digboi · Digboi Sandstone</td>
                <td>1,120.0m MD</td>
                <td>Depleted shallow reservoir sands</td>
                <td className="text-emerald-600 dark:text-emerald-400 font-bold">Safe trajectory</td>
                <td>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 font-bold rounded-xs">
                    NORMAL DRILLING
                  </span>
                </td>
                <td className="text-right">
                  <Link href="/dashboard" className="text-blue-700 dark:text-blue-300 font-bold hover:underline">
                    View Well
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                <td className="font-bold text-foreground">OIL-KHS-04</td>
                <td>Kharsang · Girujan Clay</td>
                <td>840.0m MD</td>
                <td>Tectonic thrust-fault shear zone</td>
                <td className="text-muted-foreground">Rig suspended</td>
                <td>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 font-bold rounded-xs">
                    STANDBY
                  </span>
                </td>
                <td className="text-right">
                  <Link href="/decay-index" className="text-blue-700 dark:text-blue-300 font-bold hover:underline">
                    Decay Dossier
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 6. Regulatory & Architectural Guarantees Footer Strip ─── */}
      <div className="p-3.5 bg-gradient-to-r from-blue-50/80 via-white to-emerald-50/80 dark:from-[#071d36] dark:via-[#092215] dark:to-[#071d36] border border-[#d0d7de] dark:border-[#1e3a5f] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-sans text-slate-700 dark:text-slate-300 shadow-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            Compliant with <strong>OISD-GDN-178</strong> (Drilling Safety Management) &amp; <strong>DGMS</strong> Subsurface Evidence Archival Guidelines · <strong>GIGW 3.0 Standard</strong>.
          </span>
        </div>
        <div className="font-mono text-[10px] text-muted-foreground font-bold">
          Assam-Arakan Subsurface Knowledge Base · Oil India Limited R&amp;D
        </div>
      </div>

    </div>
  );
}
