'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Activity, 
  GitCompare, 
  Database, 
  TrendingDown, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Sparkles,
  Gauge,
  Flame,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Compass,
  Clock,
  HardHat,
  Cpu,
  FileText,
  SlidersHorizontal,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  // Interactive live terminal simulator on the homepage
  const [simulatedDepth, setSimulatedDepth] = useState<number>(2165.4);
  const [isLiveSimulating, setIsLiveSimulating] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLiveSimulating) {
      timer = setInterval(() => {
        setSimulatedDepth((prev) => {
          if (prev >= 2260.0) return 2140.0;
          return Math.round((prev + 0.8) * 10) / 10;
        });
      }, 400);
    }
    return () => clearInterval(timer);
  }, [isLiveSimulating]);

  const hazardDepth = 2240.0;
  const triggerDepth = 2180.0;
  const distanceToHazard = Math.max(0, Math.round((hazardDepth - simulatedDepth) * 10) / 10);
  const distanceToTrigger = Math.max(0, Math.round((triggerDepth - simulatedDepth) * 10) / 10);
  const isTriggered = simulatedDepth >= triggerDepth;
  const isHazardReached = simulatedDepth >= hazardDepth;

  // 6 balanced operational modules (2x3 grid, zero empty slots)
  const modules = [
    {
      title: 'Live Operations Cockpit',
      badge: 'CORE COCKPIT',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      description: 'Active drilling workspace alongside eRTMAC. Real-time wellbore telemetry, 75m lookahead hazard alert countdown, and synchronized geospatial offset map.',
      href: '/operations',
      icon: Layers,
      actionText: 'Launch Live Operations',
      preview: {
        label: 'Active Well',
        val: 'OIL-GLK-14 @ 2,165m',
        metric: '14.8 m/h ROP',
        status: 'Streaming'
      }
    },
    {
      title: 'Historical Well Replay Simulator',
      badge: 'VALIDATION ENGINE',
      badgeColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      description: 'Deterministic benchmark simulator. Replays historical 1988–2004 drilling feeds at 1x–20x to verify proactive lookahead alerts before documented losses.',
      href: '/replay',
      icon: Activity,
      actionText: 'Run Replay Simulator',
      preview: {
        label: 'Validated Scenario',
        val: 'OIL-GLK-07 (1996)',
        metric: '34h NPT Avoided',
        status: 'Falsifiable'
      }
    },
    {
      title: 'GeoSpatial Offset Correlation',
      badge: 'STRATIGRAPHIC TWINS',
      badgeColor: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      description: 'Multi-well correlation panel & petrophysical similarity engine. Surfaces true stratigraphic analogs across complex Assam fault blocks (Similarity ≠ Distance).',
      href: '/analogs',
      icon: GitCompare,
      actionText: 'Explore Offset Analogs',
      preview: {
        label: 'Best Geological Twin',
        val: 'OIL-GLK-07 (87% Sim)',
        metric: '1.8 km SE Offset',
        status: 'Correlated'
      }
    },
    {
      title: 'Fleet Well Register & Watcher',
      badge: 'BASIN FLEET',
      badgeColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      description: 'Assam-Arakan basin-wide multi-rig register tracking active drilling corridors, calibrated lookahead proximity gauges, and shift operations checklists.',
      href: '/dashboard',
      icon: Compass,
      actionText: 'Open Fleet Register',
      preview: {
        label: 'Active Rig Fleet',
        val: '3 Rigs Drilling',
        metric: 'GLK-COR-03 Watcher',
        status: 'Live Stream'
      }
    },
    {
      title: 'Archival OCR & Ingestion Pipeline',
      badge: 'TWO-PATH INGESTION',
      badgeColor: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      description: 'Standardizes 130+ years of typewritten WCRs & daily drilling logs into structured schemas with bounding-box OCR, layout parsing, and human-in-the-loop audit.',
      href: '/admin/ingestion',
      icon: Database,
      actionText: 'Inspect Ingestion Pipeline',
      preview: {
        label: 'Layout OCR Accuracy',
        val: '94.2% Conf Score',
        metric: '14 pages / min',
        status: 'Batch #4'
      }
    },
    {
      title: 'Institutional Memory Decay Index',
      badge: 'GOVERNANCE AUDIT',
      badgeColor: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
      description: 'Quantifies subsurface knowledge loss risks across Digboi, Kharsang, and Geleki to prioritize fragile physical records before senior superintendents retire.',
      href: '/decay-index',
      icon: TrendingDown,
      actionText: 'Check Field Risk Index',
      preview: {
        label: 'Highest Decay Risk',
        val: 'Digboi: 88 / 100',
        metric: '851 At-Risk WCRs',
        status: 'Critical'
      }
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#07090f] text-neutral-900 dark:text-neutral-100 transition-colors">
      
      {/* ─── Modern Top Navigation Header ─── */}
      <header className="sticky top-0 z-40 border-b border-neutral-200 dark:border-[#1a2233] bg-white/95 dark:bg-[#080b12]/95 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          
          {/* Logo & Platform Identifier */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-neutral-950 font-mono font-extrabold text-xs shadow-xs ring-1 ring-amber-400/40">
              OIL
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-neutral-950 dark:text-white font-mono">
                  NWIS
                </span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-[9px] font-mono font-bold uppercase tracking-wider">
                  eRTMAC COMPANION
                </span>
              </div>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono hidden sm:block">
                Nearby Wells Intelligence System
              </span>
            </div>
          </Link>

          {/* Quick Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-neutral-100 dark:bg-[#111622] p-1 rounded-xl border border-neutral-200 dark:border-[#1a2333] text-xs font-mono">
            <Link href="/operations" className="px-3 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/80 dark:hover:bg-[#171f30] font-medium transition-colors">
              Operations
            </Link>
            <Link href="/replay" className="px-3 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/80 dark:hover:bg-[#171f30] font-medium transition-colors">
              Well Replay
            </Link>
            <Link href="/analogs" className="px-3 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/80 dark:hover:bg-[#171f30] font-medium transition-colors">
              Offset Analogs
            </Link>
            <Link href="/dashboard" className="px-3 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/80 dark:hover:bg-[#171f30] font-medium transition-colors">
              Fleet Register
            </Link>
            <Link href="/decay-index" className="px-3 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/80 dark:hover:bg-[#171f30] font-medium transition-colors">
              Decay Index
            </Link>
            <Link href="/admin/ingestion" className="px-3 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/80 dark:hover:bg-[#171f30] font-medium transition-colors">
              Ingestion
            </Link>
          </nav>

          {/* Header Controls */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Link
              href="/operations"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-950 text-xs font-bold font-mono shadow-xs transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Launch Cockpit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </header>

      {/* ─── Main Hero Section ─── */}
      <main className="flex-1">
        <section className="relative pt-8 pb-12 px-4 sm:px-6 overflow-hidden">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[650px] h-[300px] bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto space-y-8 relative z-10">
            
            {/* Hero Text */}
            <div className="text-center max-w-3xl mx-auto space-y-3.5">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>OIL INDIA LIMITED · SUBSURFACE COMPANION SYSTEM</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.12] font-sans">
                130 Years of Subsurface Memory.{' '}
                <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 bg-clip-text text-transparent">
                  Predicted 75m Before You Drill.
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed max-w-2xl mx-auto">
                Real-time offset well intelligence platform designed strictly alongside Oil India&apos;s <strong>eRTMAC</strong>. Correlates historical Well Completion Reports and Daily Drilling Reports across the <strong>Assam-Arakan Basin</strong> to deliver depth-aware proactive hazard lookaheads.
              </p>

              {/* Primary Call-to-Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono text-xs">
                <Link
                  href="/operations"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>Launch Operations Cockpit (OIL-GLK-14)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/replay"
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-[#222d42] bg-white dark:bg-[#101420] hover:bg-neutral-50 dark:hover:bg-[#161c2c] text-neutral-800 dark:text-neutral-200 font-bold transition-colors flex items-center gap-2 shadow-2xs"
                >
                  <Activity className="w-4 h-4 text-amber-500" />
                  <span>Historical Well Replay Simulator</span>
                </Link>
              </div>

            </div>

            {/* ─── High-Tech Live Lookahead Terminal (Hero Visual) ─── */}
            <div className="max-w-4xl mx-auto rounded-2xl border border-neutral-200 dark:border-[#1e273b] bg-white dark:bg-[#0c0f17] shadow-xl overflow-hidden transition-colors">
              
              {/* Terminal Title Bar */}
              <div className="p-3.5 px-5 bg-neutral-100/80 dark:bg-[#090d16] border-b border-neutral-200 dark:border-[#1a2233] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="font-extrabold text-neutral-950 dark:text-white">
                    eRTMAC TELEMETRY LOOKAHEAD CONSOLE
                  </span>
                  <span className="text-neutral-400 dark:text-neutral-500 hidden sm:inline">•</span>
                  <span className="text-neutral-600 dark:text-neutral-400 hidden sm:inline">
                    WELL: OIL-GLK-14 (Geleki Field · Upper Tipam)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsLiveSimulating(!isLiveSimulating)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-colors flex items-center gap-1.5 ${
                      isLiveSimulating
                        ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40'
                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {isLiveSimulating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{isLiveSimulating ? 'Simulating Bit' : 'Simulate Advance'}</span>
                  </button>

                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    STREAM ACTIVE
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-4">
                
                {/* 4 Telemetry Parameter Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  
                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#121622] border border-neutral-200 dark:border-[#1a2333] space-y-0.5">
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block font-bold">BIT DEPTH (MD)</span>
                    <strong className="text-xl text-neutral-950 dark:text-white font-extrabold tabular-nums">
                      {simulatedDepth.toFixed(1)}m
                    </strong>
                    <span className="text-[10px] text-neutral-500 block">TVD: 2,110.2m</span>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#121622] border border-neutral-200 dark:border-[#1a2333] space-y-0.5">
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block font-bold">DRILLING ROP</span>
                    <strong className="text-xl text-emerald-600 dark:text-emerald-400 font-extrabold tabular-nums">
                      14.8 m/h
                    </strong>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-500 block">Steady Advance</span>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#121622] border border-neutral-200 dark:border-[#1a2333] space-y-0.5">
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block font-bold">ROTARY TORQUE</span>
                    <strong className="text-xl text-neutral-950 dark:text-white font-extrabold tabular-nums">
                      11.2 kft-lb
                    </strong>
                    <span className="text-[10px] text-neutral-500 block">RPM: 82 • WOB: 16.5k</span>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#121622] border border-neutral-200 dark:border-[#1a2333] space-y-0.5">
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block font-bold">MUD WEIGHT (IN)</span>
                    <strong className="text-xl text-amber-600 dark:text-amber-400 font-extrabold tabular-nums">
                      9.8 ppg
                    </strong>
                    <span className="text-[10px] text-amber-700 dark:text-amber-500 block">ECD Margin: +0.42</span>
                  </div>

                </div>

                {/* Calibrated Lookahead Corridor Bar */}
                <div className="space-y-1.5 p-3.5 rounded-xl bg-neutral-50 dark:bg-[#090d16] border border-neutral-200 dark:border-[#1a2333]">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-neutral-500 dark:text-neutral-400 font-bold uppercase text-[10px]">
                      Geological Lookahead Corridor (2,100m – 2,240m MD)
                    </span>
                    <span className="font-bold text-amber-700 dark:text-amber-400">
                      {isHazardReached ? (
                        <span className="text-rose-600 dark:text-rose-400">Inside Upper Tipam Loss Interval</span>
                      ) : isTriggered ? (
                        <span className="text-amber-700 dark:text-amber-300">Mandatory LCM Staging Triggered</span>
                      ) : (
                        `Trigger in ${distanceToTrigger.toFixed(1)}m (~${Math.round(distanceToTrigger / 14.8 * 60)} min)`
                      )}
                    </span>
                  </div>

                  {/* Progress Corridor Bar */}
                  <div className="relative h-6 rounded-lg bg-neutral-200 dark:bg-[#161c28] overflow-hidden border border-neutral-300 dark:border-neutral-700 flex items-center">
                    {/* Drilled Zone */}
                    <div 
                      style={{ width: `${Math.min(100, Math.max(0, (simulatedDepth - 2100) / 140 * 100))}%` }}
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 transition-all duration-300"
                    />

                    {/* Trigger tripwire marker at 2,180m (57.1%) */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10 border-r border-dashed border-amber-900"
                      style={{ left: '57.1%' }}
                    />

                    {/* Loss zone (red stripes) starting at 2,240m (100%) */}
                    <div 
                      className="absolute top-0 bottom-0 right-0 w-8 bg-rose-600/80"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, rgba(225,29,72,0.9), rgba(225,29,72,0.9) 6px, rgba(190,18,60,0.9) 6px, rgba(190,18,60,0.9) 12px)'
                      }}
                    />

                    {/* Active Bit Cursor */}
                    <div 
                      className="absolute top-0 bottom-0 w-1.5 bg-neutral-950 dark:bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] z-20 transition-all duration-300"
                      style={{ left: `calc(${Math.min(100, Math.max(0, (simulatedDepth - 2100) / 140 * 100))}% - 3px)` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                    <span>2,100m (Girujan Seal)</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">Active Bit: {simulatedDepth.toFixed(1)}m</span>
                    <span className="text-amber-700 dark:text-amber-400 font-bold">Action Trigger: 2,180m</span>
                    <span className="text-rose-700 dark:text-rose-400 font-bold">Severe Loss: 2,240m</span>
                  </div>
                </div>

                {/* Active Proactive Alert Card */}
                <div className={`p-4 rounded-xl border-2 transition-all space-y-2.5 ${
                  isHazardReached
                    ? 'border-rose-400 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/20'
                    : isTriggered
                    ? 'border-amber-400 dark:border-amber-500/70 bg-amber-50/80 dark:bg-amber-950/20'
                    : 'border-neutral-200 dark:border-[#1e273b] bg-neutral-50/70 dark:bg-[#101420]'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[9px] font-mono font-bold uppercase tracking-wider">
                        PROACTIVE LOOKAHEAD
                      </span>
                      <span className="text-xs font-bold font-mono text-neutral-900 dark:text-white">
                        Approaching Upper Tipam Micro-Fracture Loss Horizon
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold border border-amber-300 dark:border-amber-800 shrink-0">
                      {distanceToHazard.toFixed(1)}m Ahead • Corridor GLK-COR-03
                    </span>
                  </div>

                  {/* 3-Part Separation Summary */}
                  <div className="space-y-1.5 text-xs font-sans text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    <p>
                      <strong className="font-mono text-[10px] uppercase text-neutral-900 dark:text-white font-bold">Ground Truth:</strong>{' '}
                      5 of 8 offset wells in Geleki suffered severe lost circulation (avg 28.4h NPT). <strong>OIL-GLK-07</strong> suffered total mud loss (420 bbls) at 2,280m MD when mud weight reached 10.8 ppg.
                    </p>
                    <p className="text-amber-900 dark:text-amber-200">
                      <strong className="font-mono text-[10px] uppercase text-amber-700 dark:text-amber-400 font-bold">Rig Advisory:</strong>{' '}
                      Pre-stage 35 ppb medium-nut-plug LCM pill in active Pit #2 before 2,180m MD. Cap ECD &lt; 10.2 ppg. (Validated by <strong>OIL-GLK-05</strong> clean run).
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800 text-[11px] font-mono">
                    <span className="text-neutral-500 dark:text-neutral-400">
                      Best Analog: <strong className="text-amber-700 dark:text-amber-400">OIL-GLK-07 (87% Sim · 1.8km SE)</strong>
                    </span>
                    <Link 
                      href="/operations" 
                      className="text-amber-800 dark:text-amber-400 hover:underline font-bold flex items-center gap-1"
                    >
                      <span>Correlate in Live Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>

            {/* ─── 4 Executive Architecture & Trust Metrics ─── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto pt-1 font-mono">
              
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#0c0f17] border border-neutral-200 dark:border-[#1a2333] space-y-1 shadow-2xs">
                <span className="text-[10px] text-neutral-500 uppercase block font-bold">CATALOGED WELLS</span>
                <div className="text-2xl font-extrabold text-neutral-950 dark:text-white">1,670+</div>
                <span className="text-[10px] text-neutral-500 block">Across 6 Assam Fields</span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#0c0f17] border border-neutral-200 dark:border-[#1a2333] space-y-1 shadow-2xs">
                <span className="text-[10px] text-neutral-500 uppercase block font-bold">LOOKAHEAD BUFFER</span>
                <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">75m MD</div>
                <span className="text-[10px] text-neutral-500 block">3.5–5h Advance Warning</span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#0c0f17] border border-neutral-200 dark:border-[#1a2333] space-y-1 shadow-2xs">
                <span className="text-[10px] text-neutral-500 uppercase block font-bold">AVG NPT SAVED</span>
                <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">34 hrs</div>
                <span className="text-[10px] text-neutral-500 block">≈ $503k / incident avoided</span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#0c0f17] border border-neutral-200 dark:border-[#1a2333] space-y-1 shadow-2xs">
                <span className="text-[10px] text-neutral-500 uppercase block font-bold">PSU SOVEREIGNTY</span>
                <div className="text-2xl font-extrabold text-neutral-950 dark:text-white">100%</div>
                <span className="text-[10px] text-neutral-500 block">Air-Gapped & On-Premise</span>
              </div>

            </div>

          </div>

        </section>

        {/* ─── Balanced 6-Module Operational Suite Grid ─── */}
        <section className="py-12 px-4 sm:px-6 border-t border-neutral-200 dark:border-[#1a2233] bg-neutral-50/60 dark:bg-[#080b12] transition-colors">
          <div className="max-w-6xl mx-auto space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-mono">
                  Assam Basin Drilling Intelligence Modules
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">
                  Six integrated modules bridging live eRTMAC rig streaming with 130 years of archival memory.
                </p>
              </div>
              <span className="text-xs font-mono text-neutral-500">6 Functional Workspaces</span>
            </div>

            {/* 3x2 Responsive Balanced Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules.map((m) => {
                const Icon = m.icon;
                return (
                  <Link
                    key={m.title}
                    href={m.href}
                    className="p-5 rounded-2xl border border-neutral-200 dark:border-[#1a2233] bg-white dark:bg-[#0c0f17] shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-500/60 hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="space-y-3">
                      
                      {/* Card Header with Icon & Badge */}
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${m.badgeColor}`}>
                          {m.badge}
                        </span>
                      </div>

                      <h3 className="text-sm font-extrabold text-neutral-950 dark:text-white font-mono leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {m.title}
                      </h3>

                      <p className="text-xs text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    {/* Miniature Instrument Preview Badge */}
                    <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-[#111622] border border-neutral-200 dark:border-[#1a2333] flex items-center justify-between text-[11px] font-mono">
                      <div>
                        <span className="text-neutral-500 text-[10px] block">{m.preview.label}</span>
                        <span className="font-bold text-neutral-900 dark:text-neutral-200">{m.preview.val}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-neutral-500 text-[10px] block">{m.preview.status}</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">{m.preview.metric}</span>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="pt-2 border-t border-neutral-100 dark:border-[#161e2e] flex items-center justify-between text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                      <span>{m.actionText}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>

          </div>
        </section>

        {/* ─── Operational Workflow: Reactive vs NWIS Proactive ─── */}
        <section className="py-12 px-4 sm:px-6 border-t border-neutral-200 dark:border-[#1a2233] bg-white dark:bg-[#07090f]">
          <div className="max-w-6xl mx-auto space-y-6">
            
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <h3 className="text-lg sm:text-xl font-extrabold font-mono text-neutral-950 dark:text-white">
                How NWIS Proactively Intervenes on the Rig Floor
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                Comparison of conventional reactive post-incident response vs. NWIS lookahead intelligence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              
              {/* Conventional Reactive Path */}
              <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-700 dark:text-rose-400 uppercase text-[11px] flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    Conventional Reactive Drilling (eRTMAC Alone)
                  </span>
                  <Badge className="bg-rose-600 text-white text-[9px]">34h NPT INCURRED</Badge>
                </div>
                <div className="space-y-2 text-neutral-700 dark:text-neutral-300 font-sans text-xs">
                  <div className="p-2.5 rounded-lg bg-white/80 dark:bg-[#0e121a] border border-rose-200 dark:border-rose-900/40">
                    <strong className="text-neutral-950 dark:text-white font-mono text-[11px]">1. Blind Entry:</strong> Bit penetrates Upper Tipam Sandstone micro-fractures without historical analog awareness.
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/80 dark:bg-[#0e121a] border border-rose-200 dark:border-rose-900/40">
                    <strong className="text-neutral-950 dark:text-white font-mono text-[11px]">2. Catastrophic Loss:</strong> Mud weight 10.8 ppg breaks fracture gradient; total fluid loss (420 bbls) at 2,280m MD.
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/80 dark:bg-[#0e121a] border border-rose-200 dark:border-rose-900/40">
                    <strong className="text-neutral-950 dark:text-white font-mono text-[11px]">3. Reactive Scramble:</strong> Drilling halts for 34 hours while crew mixes heavy fiber LCM pills and runs squeeze jobs.
                  </div>
                </div>
              </div>

              {/* NWIS Proactive Path */}
              <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase text-[11px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    NWIS Real-Time Companion Workflow
                  </span>
                  <Badge className="bg-emerald-600 text-white text-[9px]">ZERO NPT LOSS</Badge>
                </div>
                <div className="space-y-2 text-neutral-700 dark:text-neutral-300 font-sans text-xs">
                  <div className="p-2.5 rounded-lg bg-white/80 dark:bg-[#0e121a] border border-emerald-200 dark:border-emerald-900/40">
                    <strong className="text-neutral-950 dark:text-white font-mono text-[11px]">1. 75m Advance Notice:</strong> Watcher triggers advisory at 2,180m MD, surfacing OIL-GLK-07 historical loss post-mortem.
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/80 dark:bg-[#0e121a] border border-emerald-200 dark:border-emerald-900/40">
                    <strong className="text-neutral-950 dark:text-white font-mono text-[11px]">2. Pre-emptive Conditioning:</strong> Crew stages 35 ppb nut-plug pill in suction pit and caps ECD at 10.2 ppg (proven by GLK-05).
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/80 dark:bg-[#0e121a] border border-emerald-200 dark:border-emerald-900/40">
                    <strong className="text-neutral-950 dark:text-white font-mono text-[11px]">3. Clean Passage:</strong> Bit traverses 2,240m–2,350m without fluid loss. 34 hours of NPT avoided.
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ─── PSU Governance & Safety Framework ─── */}
        <section className="py-8 px-4 sm:px-6 border-t border-neutral-200 dark:border-[#1a2233] bg-neutral-50/70 dark:bg-[#080b12] transition-colors">
          <div className="max-w-6xl mx-auto space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-extrabold text-neutral-950 dark:text-white font-mono uppercase tracking-wide">
                  PSU Governance &amp; Safety Boundary Framework
                </h3>
              </div>
              <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-mono font-bold">
                AIR-GAPPED COMPLIANT
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0c0f17] border border-neutral-200 dark:border-[#1a2233] space-y-1">
                <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>1. Strict Read-Only Bridge</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 font-sans text-[11px] leading-relaxed">
                  One-way contract (<code className="text-amber-600 dark:text-amber-400 font-bold">GET /live-state/{'{well_id}'}</code>). NWIS never sends control commands to rig hardware or eRTMAC valves.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0c0f17] border border-neutral-200 dark:border-[#1a2233] space-y-1">
                <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <GitCompare className="w-3.5 h-3.5" />
                  <span>2. Geological Similarity &gt; Distance</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 font-sans text-[11px] leading-relaxed">
                  Matches formation facies &amp; pressure regimes over raw geographic distance to avoid misleading offset correlations across fault blocks.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0c0f17] border border-neutral-200 dark:border-[#1a2233] space-y-1">
                <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>3. Document Provenance &amp; Audit</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 font-sans text-[11px] leading-relaxed">
                  Every advisory cites original WCR and daily report page citations with OCR confidence tiers and human superintendent verification signatures.
                </p>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* ─── Clean Industrial Footer ─── */}
      <footer className="border-t border-neutral-200 dark:border-[#1a2233] bg-white dark:bg-[#07090f] text-neutral-600 dark:text-neutral-400 py-4 px-4 sm:px-6 text-xs font-mono transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            Built for <strong>Oil India Limited</strong> · eRTMAC Companion Architecture
          </div>
          <div className="flex items-center gap-3 text-neutral-500 text-[11px]">
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> DGMS &amp; OISD-GDN-178 Aligned
            </span>
            <span>•</span>
            <span>Assam-Arakan Basin Archives (1889–2026)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
