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
  RotateCcw,
  ShieldAlert
} from 'lucide-react';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useAppStore } from '@/store/app-store';

export default function HomePage() {
  const { setRole } = useAppStore();

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
      badgeColor: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
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
      badgeColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
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
      badgeColor: 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800',
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
      badgeColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
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
      badgeColor: 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
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
      badgeColor: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#090b0f] text-neutral-900 dark:text-neutral-100 transition-colors">
      
      {/* ─── Top Architectural Announcement Bar ─── */}
      <div className="bg-neutral-900 text-neutral-300 text-[11px] font-mono py-1.5 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold tracking-wide uppercase">
              SIH 2026 • SIH26121
            </span>
            <span className="text-neutral-400 hidden sm:inline">•</span>
            <span>Oil India Limited — Nearby Wells Intelligence System (eRTMAC-NWIS)</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-neutral-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              PSU Data Sovereign
            </span>
            <span>•</span>
            <span>Assam-Arakan Basin Archives (1889–2026)</span>
          </div>
        </div>
      </div>

      {/* ─── Modern Top Navigation Header with 3-Bar Strata Logo ─── */}
      <header className="sticky top-0 z-40 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#0a0c10]/95 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Logo with 3-Bar Strata */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-neutral-950 dark:bg-neutral-900 flex items-center justify-center border border-neutral-800 shadow-xs group-hover:border-amber-600 transition-colors shrink-0">
              <div className="relative flex flex-col gap-0.5 items-center">
                <span className="w-4 h-1 rounded-xs bg-amber-500" />
                <span className="w-4 h-1 rounded-xs bg-amber-600" />
                <span className="w-4 h-1 rounded-xs bg-amber-700" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-neutral-950 dark:text-white">
                  NWIS
                </span>
                <span className="px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[9px] font-mono font-bold uppercase tracking-wider">
                  eRTMAC COMPANION
                </span>
              </div>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono hidden sm:block">
                Nearby Wells Intelligence System
              </span>
            </div>
          </Link>

          {/* Quick Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-neutral-100 dark:bg-[#111622] p-1 rounded-xl border border-neutral-200 dark:border-[#1a2333] text-xs font-mono font-bold">
            <Link href="/operations" className="px-3 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/80 dark:hover:bg-[#171f30] transition-colors">
              Operations
            </Link>
            <Link href="/replay" className="px-3 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/80 dark:hover:bg-[#171f30] transition-colors">
              Well Replay
            </Link>
            <Link href="/analogs" className="px-3 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/80 dark:hover:bg-[#171f30] transition-colors">
              Offset Analogs
            </Link>
            <Link href="/dashboard" className="px-3 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/80 dark:hover:bg-[#171f30] transition-colors">
              Fleet Register
            </Link>
            <Link href="/decay-index" className="px-3 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/80 dark:hover:bg-[#171f30] transition-colors">
              Decay Index
            </Link>
            <Link href="/admin/ingestion" className="px-3 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/80 dark:hover:bg-[#171f30] transition-colors">
              Ingestion
            </Link>
          </nav>

          {/* Header Controls */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="px-3 py-1.5 text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/operations"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-950 dark:bg-amber-600 hover:bg-neutral-800 dark:hover:bg-amber-700 text-white text-xs font-bold font-mono shadow-xs transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Launch Cockpit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1">
        
        {/* ─── Hero Section with Blueprint Pattern ─── */}
        <section className="relative overflow-hidden bg-white dark:bg-[#090b0f] border-b border-neutral-200 dark:border-neutral-800 pt-10 pb-16 lg:py-20 transition-colors">
          
          {/* Blueprint Grid Lines */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px'
            }}
          />

          {/* Marginal Cross-Hatch Rulers */}
          <div className="absolute top-0 bottom-0 left-0 w-8 border-r border-neutral-200/60 dark:border-neutral-800/60 hidden xl:block bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.02),rgba(0,0,0,0.02)_4px,transparent_4px,transparent_8px)] dark:bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.02),rgba(255,255,255,0.02)_4px,transparent_4px,transparent_8px)]" />
          <div className="absolute top-0 bottom-0 right-0 w-8 border-l border-neutral-200/60 dark:border-neutral-800/60 hidden xl:block bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.02),rgba(0,0,0,0.02)_4px,transparent_4px,transparent_8px)] dark:bg-[repeating-linear-gradient(-45deg,rgba(255,255,255,0.02),rgba(255,255,255,0.02)_4px,transparent_4px,transparent_8px)]" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 z-10">
            
            {/* Hero Text */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-semibold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                <span>eRTMAC Subsurface Institutional Memory Layer</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] text-neutral-950 dark:text-white leading-[1.08]">
                130 Years of Subsurface Memory.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600">
                  Activated Before You Drill.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed max-w-2xl mx-auto">
                Real-time offset well intelligence platform designed strictly alongside Oil India&apos;s <strong>eRTMAC</strong>. Correlates historical Well Completion Reports and Daily Drilling Reports across the <strong>Assam-Arakan Basin</strong> to deliver depth-aware proactive hazard lookaheads.
              </p>

              {/* Primary Call-to-Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono text-xs">
                <Link
                  href="/operations"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-extrabold rounded-xl bg-gradient-to-r from-amber-700 via-amber-600 to-orange-700 text-white hover:from-amber-800 hover:to-orange-800 transition-all shadow-md shadow-amber-900/20 hover:shadow-lg shrink-0 cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-amber-200" />
                  <span>Launch Live Operations (OIL-GLK-14)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/replay"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#12151c] text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-2xs cursor-pointer"
                >
                  <Activity className="w-4 h-4 text-amber-500" />
                  <span>Historical Replay Simulator</span>
                </Link>
              </div>

              {/* Quick Evaluator Role Selector */}
              <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/90 dark:bg-[#12151c]/90 text-xs font-mono w-full max-w-lg mx-auto shadow-2xs">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400">
                    Evaluator 1-Click Role Login:
                  </span>
                  <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400">
                    FOR EVALUATORS
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setRole('operations_manager')}
                    className="p-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-amber-500 text-center font-bold text-neutral-900 dark:text-white transition-colors hover:shadow-xs cursor-pointer"
                  >
                    Operations Mgr
                  </Link>
                  <Link
                    href="/operations"
                    onClick={() => setRole('field_engineer')}
                    className="p-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-amber-500 text-center font-bold text-neutral-900 dark:text-white transition-colors hover:shadow-xs cursor-pointer"
                  >
                    Rig Engineer
                  </Link>
                  <Link
                    href="/admin/ingestion"
                    onClick={() => setRole('admin')}
                    className="p-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-amber-500 text-center font-bold text-neutral-900 dark:text-white transition-colors hover:shadow-xs cursor-pointer"
                  >
                    PSU Auditor
                  </Link>
                </div>
              </div>

              {/* Footnote Reassurance */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Read-only eRTMAC companion
                </span>
                <span className="text-neutral-300 dark:text-neutral-700">•</span>
                <span>Air-gapped on-premise sovereign</span>
                <span className="text-neutral-300 dark:text-neutral-700">•</span>
                <span>75m proactive lead-time</span>
              </div>

            </div>

            {/* ─── High-Tech Live Interactive Bit Terminal Console ─── */}
            <div className="max-w-5xl mx-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-[#11141d] shadow-xl overflow-hidden backdrop-blur-xs transition-all">
              
              {/* Terminal Title Bar */}
              <div className="px-4 py-3 bg-neutral-100 dark:bg-[#0c0f17] border-b border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="font-extrabold text-neutral-950 dark:text-white ml-1">
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
                    onClick={() => setSimulatedDepth(2165.4)}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs transition-colors cursor-pointer"
                    title="Reset simulation to 2,165.4m"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsLiveSimulating(!isLiveSimulating)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      isLiveSimulating
                        ? 'bg-amber-500 hover:bg-amber-600 text-neutral-950 shadow-xs'
                        : 'bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white'
                    }`}
                  >
                    {isLiveSimulating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{isLiveSimulating ? 'Simulating Bit' : 'Simulate Advance'}</span>
                  </button>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    STREAM ACTIVE
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                
                {/* 4 Telemetry Parameter Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                  <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a24] border border-neutral-200 dark:border-neutral-800 space-y-1">
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block font-bold uppercase tracking-wider">
                      Bit Depth (MD)
                    </span>
                    <div className="text-2xl font-extrabold text-neutral-950 dark:text-white tabular-nums">
                      {simulatedDepth.toFixed(1)}m
                    </div>
                    <span className="text-[10px] text-neutral-500 block">TVD: 2,110.2m</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a24] border border-neutral-200 dark:border-neutral-800 space-y-1">
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block font-bold uppercase tracking-wider">
                      Drilling ROP
                    </span>
                    <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      14.8 m/h
                    </div>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-500 block">Steady Advance</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a24] border border-neutral-200 dark:border-neutral-800 space-y-1">
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block font-bold uppercase tracking-wider">
                      Rotary Torque
                    </span>
                    <div className="text-2xl font-extrabold text-neutral-950 dark:text-white tabular-nums">
                      11.2 kft-lb
                    </div>
                    <span className="text-[10px] text-neutral-500 block">RPM: 82 • WOB: 16.5k</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a24] border border-neutral-200 dark:border-neutral-800 space-y-1">
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block font-bold uppercase tracking-wider">
                      Mud Weight (IN)
                    </span>
                    <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
                      9.8 ppg
                    </div>
                    <span className="text-[10px] text-amber-700 dark:text-amber-500 block">ECD Margin: +0.42</span>
                  </div>
                </div>

                {/* Calibrated Lookahead Corridor Bar */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#0e111a] border border-neutral-200 dark:border-neutral-800 space-y-2 font-mono">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                    <span className="text-neutral-500 dark:text-neutral-400 font-bold uppercase text-[10px]">
                      Geological Lookahead Corridor (2,100m – 2,240m MD)
                    </span>
                    <span className="font-bold">
                      {isHazardReached ? (
                        <span className="text-rose-600 dark:text-rose-400 font-extrabold">Inside Upper Tipam Loss Interval (Severe Mud Loss Risk)</span>
                      ) : isTriggered ? (
                        <span className="text-amber-600 dark:text-amber-400 font-extrabold">Mandatory LCM Staging Triggered (75m Lookahead Active)</span>
                      ) : (
                        <span className="text-neutral-600 dark:text-neutral-300">
                          Trigger tripwire in <strong className="text-amber-600 dark:text-amber-400">{distanceToTrigger.toFixed(1)}m</strong> (~{Math.round(distanceToTrigger / 14.8 * 60)} min lead time)
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Progress Corridor Bar */}
                  <div className="relative h-6 rounded-lg bg-neutral-200 dark:bg-[#181d28] overflow-hidden border border-neutral-300 dark:border-neutral-700 flex items-center">
                    {/* Drilled Zone */}
                    <div 
                      style={{ width: `${Math.min(100, Math.max(0, (simulatedDepth - 2100) / 140 * 100))}%` }}
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 transition-all duration-300"
                    />

                    {/* Trigger tripwire marker at 2,180m (57.1%) */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10 border-r border-dashed border-amber-900"
                      style={{ left: '57.1%' }}
                      title="Action Trigger Point (2,180m)"
                    />

                    {/* Loss zone (red stripes) starting at 2,240m (100%) */}
                    <div 
                      className="absolute top-0 bottom-0 right-0 w-10 bg-rose-600/80"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, rgba(225,29,72,0.9), rgba(225,29,72,0.9) 6px, rgba(190,18,60,0.9) 6px, rgba(190,18,60,0.9) 12px)'
                      }}
                      title="Severe Loss Horizon (2,240m)"
                    />

                    {/* Active Bit Cursor */}
                    <div 
                      className="absolute top-0 bottom-0 w-1.5 bg-neutral-950 dark:bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] z-20 transition-all duration-300"
                      style={{ left: `calc(${Math.min(100, Math.max(0, (simulatedDepth - 2100) / 140 * 100))}% - 3px)` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400 pt-0.5">
                    <span>2,100m (Girujan Seal)</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">Active Bit: {simulatedDepth.toFixed(1)}m</span>
                    <span className="text-amber-700 dark:text-amber-400 font-bold">Action Trigger: 2,180m</span>
                    <span className="text-rose-700 dark:text-rose-400 font-bold">Severe Loss: 2,240m</span>
                  </div>
                </div>

                {/* Active Proactive Alert Card */}
                <div className={`p-4 rounded-xl border-2 transition-all space-y-3 ${
                  isHazardReached
                    ? 'border-rose-400 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/20'
                    : isTriggered
                    ? 'border-amber-400 dark:border-amber-500/70 bg-amber-50/80 dark:bg-amber-950/20'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151f]'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className={`w-4 h-4 ${isHazardReached ? 'text-rose-600' : isTriggered ? 'text-amber-600' : 'text-neutral-400'}`} />
                      <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[9px] font-mono font-bold uppercase tracking-wider">
                        PROACTIVE LOOKAHEAD
                      </span>
                      <span className="text-xs font-bold font-mono text-neutral-900 dark:text-white">
                        Approaching Upper Tipam Micro-Fracture Loss Horizon
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold border border-amber-300 dark:border-amber-800 shrink-0 self-start sm:self-auto">
                      {distanceToHazard > 0 ? `${distanceToHazard.toFixed(1)}m Ahead • Corridor GLK-COR-03` : 'Loss Zone Reached'}
                    </span>
                  </div>

                  {/* 3-Part Separation Summary */}
                  <div className="space-y-2 text-xs font-mono">
                    <div className="text-neutral-700 dark:text-neutral-300 font-sans leading-relaxed">
                      <strong className="text-neutral-950 dark:text-white font-mono text-xs">Observed Ground Truth: </strong>
                      5 of 8 offset wells in Geleki suffered severe lost circulation (avg 28.4h NPT). <strong>OIL-GLK-07</strong> suffered total mud loss (420 bbls) at 2,280m MD when mud weight reached 10.8 ppg.
                    </div>

                    <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-[#090b12] border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 font-sans leading-relaxed">
                      <strong className="text-emerald-700 dark:text-emerald-400 font-mono text-xs">Recommended Rig Advisory: </strong>
                      Pre-stage 35 ppb medium-nut-plug LCM pill in active Pit #2 before 2,180m MD. Cap ECD &lt; 10.2 ppg. (Validated by <strong>OIL-GLK-05</strong> clean run).
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-200/60 dark:border-neutral-800/80 text-[11px] font-mono">
                    <span className="text-neutral-500 dark:text-neutral-400">
                      Best Stratigraphic Analog: <strong className="text-amber-700 dark:text-amber-400">OIL-GLK-07 (87% Sim · 1.8km SE)</strong>
                    </span>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Link 
                        href="/operations" 
                        className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold font-mono text-xs transition-colors text-center cursor-pointer"
                      >
                        <span>Acknowledge & Stage Pill</span>
                      </Link>
                      <Link 
                        href="/replay" 
                        className="px-3.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold font-mono text-xs transition-colors text-center cursor-pointer"
                      >
                        <span>Verify Replay</span>
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ─── 4 Executive Architecture & Trust Metrics ─── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto pt-1 font-mono">
              
              <div className="p-4 rounded-2xl bg-white dark:bg-[#12151c] border border-neutral-200 dark:border-neutral-800 space-y-1 shadow-2xs">
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase block font-bold">CATALOGED WELLS</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">1,670+</div>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">Across 6 Assam Fields</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#12151c] border border-neutral-200 dark:border-neutral-800 space-y-1 shadow-2xs">
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase block font-bold">LOOKAHEAD BUFFER</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 dark:text-amber-400">75m MD</div>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">3.5–5h Advance Warning</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#12151c] border border-neutral-200 dark:border-neutral-800 space-y-1 shadow-2xs">
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase block font-bold">AVG NPT SAVED</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">34 hrs</div>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">≈ $503k / incident avoided</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#12151c] border border-neutral-200 dark:border-neutral-800 space-y-1 shadow-2xs">
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase block font-bold">PSU SOVEREIGNTY</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">100%</div>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">Air-Gapped & On-Premise</span>
              </div>

            </div>

          </div>

        </section>

        {/* ─── Balanced 6-Module Operational Suite Grid ─── */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-[#0c0e14] transition-colors">
          <div className="max-w-6xl mx-auto space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-[11px] font-mono font-semibold mb-2">
                  <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>SIH26121 EVALUATION WORKSPACES</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-mono">
                  Assam Basin Drilling Intelligence Modules
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-mono mt-1">
                  Six integrated modules bridging live eRTMAC rig streaming with 130 years of archival memory across the Naga Thrust Belt.
                </p>
              </div>
              <span className="text-xs font-mono text-neutral-500">6 Functional Workspaces</span>
            </div>

            {/* 3x2 Responsive Balanced Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {modules.map((m) => {
                const Icon = m.icon;
                return (
                  <Card
                    key={m.title}
                    className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-6 shadow-xs hover:shadow-md hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-5 group"
                  >
                    <div className="space-y-3">
                      
                      {/* Card Header with Icon & Badge */}
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-800 dark:text-neutral-200 group-hover:bg-amber-50 dark:group-hover:bg-amber-950/40 group-hover:text-amber-700 dark:group-hover:text-amber-400 group-hover:border-amber-200 dark:group-hover:border-amber-800 transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${m.badgeColor}`}>
                          {m.badge}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-neutral-950 dark:text-white font-mono leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {m.title}
                      </h3>

                      <p className="text-xs text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    {/* Miniature Instrument Preview Badge */}
                    <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#0c0f16] border border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400 text-[10px] block font-bold">{m.preview.label}</span>
                        <span className="font-bold text-neutral-900 dark:text-neutral-200 text-[11px]">{m.preview.val}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-neutral-500 dark:text-neutral-400 text-[10px] block">{m.preview.status}</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400 text-[11px]">{m.preview.metric}</span>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-3">
                      <Link
                        href={m.href}
                        className="w-full inline-flex items-center justify-between px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/90 hover:bg-amber-600 dark:hover:bg-amber-600 hover:text-white dark:hover:text-white text-neutral-800 dark:text-neutral-200 text-xs font-bold font-mono transition-all group-hover:bg-amber-600 group-hover:text-white cursor-pointer"
                      >
                        <span>{m.actionText}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>

          </div>
        </section>

        {/* ─── Operational Workflow: Reactive vs NWIS Proactive ─── */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#090b0f] transition-colors">
          <div className="max-w-6xl mx-auto space-y-8">
            
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-mono font-semibold">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>OPERATIONAL VALUE COMPARISON</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-mono">
                How NWIS Proactively Intervenes on the Rig Floor
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-sans max-w-2xl mx-auto leading-relaxed">
                Direct operational comparison of conventional reactive post-incident response versus NWIS lookahead intelligence across the Upper Tipam Sandstone loss interval.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
              
              {/* Conventional Reactive Path */}
              <Card className="p-6 rounded-2xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/40 dark:bg-[#120b0e] space-y-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-rose-200 dark:border-rose-900/40">
                  <span className="font-bold text-rose-700 dark:text-rose-400 uppercase text-[11px] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Conventional Reactive Drilling (eRTMAC Alone)</span>
                  </span>
                  <Badge className="bg-rose-600 text-white text-[9px] font-mono font-bold">
                    34h NPT INCURRED
                  </Badge>
                </div>
                <div className="space-y-3 text-neutral-700 dark:text-neutral-300 font-sans text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#181115] border border-rose-200/80 dark:border-rose-900/40 space-y-1">
                    <div className="text-neutral-950 dark:text-white font-mono font-bold text-[11px] flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center text-[10px]">1</span>
                      <span>Blind Entry</span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px] pl-5">
                      Bit penetrates Upper Tipam Sandstone micro-fractures without historical analog awareness. Real-time surface parameters look normal until loss begins.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-[#181115] border border-rose-200/80 dark:border-rose-900/40 space-y-1">
                    <div className="text-neutral-950 dark:text-white font-mono font-bold text-[11px] flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center text-[10px]">2</span>
                      <span>Catastrophic Fluid Loss</span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px] pl-5">
                      Mud weight 10.8 ppg breaks open depleted fracture network; total fluid loss (420 bbls) strikes at 2,280m MD with complete return loss.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-[#181115] border border-rose-200/80 dark:border-rose-900/40 space-y-1">
                    <div className="text-neutral-950 dark:text-white font-mono font-bold text-[11px] flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center text-[10px]">3</span>
                      <span>Reactive Scramble</span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px] pl-5">
                      Drilling operations halt for 34 hours while rig crew frantically sources LCM pill chemicals and mixes heavy fiber squeeze pills under emergency conditions.
                    </p>
                  </div>
                </div>
              </Card>

              {/* NWIS Proactive Path */}
              <Card className="p-6 rounded-2xl border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-[#091410] space-y-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-200 dark:border-emerald-900/40">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase text-[11px] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>NWIS Real-Time Companion Workflow</span>
                  </span>
                  <Badge className="bg-emerald-600 text-white text-[9px] font-mono font-bold">
                    ZERO NPT LOSS
                  </Badge>
                </div>
                <div className="space-y-3 text-neutral-700 dark:text-neutral-300 font-sans text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#0d1c16] border border-emerald-200/80 dark:border-emerald-900/40 space-y-1">
                    <div className="text-neutral-950 dark:text-white font-mono font-bold text-[11px] flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px]">1</span>
                      <span>75m Advance Notice</span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-[11px] pl-5">
                      Watcher triggers depth-calibrated advisory at 2,180m MD, surfacing OIL-GLK-07 historical loss post-mortem 4.2 hours ahead of bit entry.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-[#0d1c16] border border-emerald-200/80 dark:border-emerald-900/40 space-y-1">
                    <div className="text-neutral-950 dark:text-white font-mono font-bold text-[11px] flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px]">2</span>
                      <span>Pre-emptive Conditioning</span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-[11px] pl-5">
                      Mud engineer stages 35 ppb mixed-fiber nut-plug pill in suction pit and caps circulating ECD at 10.2 ppg (mitigation proven by offset GLK-05).
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-[#0d1c16] border border-emerald-200/80 dark:border-emerald-900/40 space-y-1">
                    <div className="text-neutral-950 dark:text-white font-mono font-bold text-[11px] flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px]">3</span>
                      <span>Clean Safe Passage</span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-[11px] pl-5">
                      Bit traverses 2,240m–2,350m without any fluid loss or pack-off. Rig saves 34 hours of non-productive time and ₹42L in emergency pill treatments.
                    </p>
                  </div>
                </div>
              </Card>

            </div>

          </div>
        </section>

        {/* ─── PSU Governance & Safety Framework ─── */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-[#0c0f16] transition-colors">
          <div className="max-w-6xl mx-auto space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-neutral-950 dark:text-white font-mono uppercase tracking-wide">
                    PSU Governance &amp; Safety Boundary Framework
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-sans">
                    Three strict architectural guardrails safeguarding eRTMAC critical systems and statutory PSU compliance.
                  </p>
                </div>
              </div>
              <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-mono font-bold self-start sm:self-auto">
                AIR-GAPPED COMPLIANT
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <Card className="p-5 rounded-2xl bg-white dark:bg-[#12151c] border border-neutral-200 dark:border-neutral-800/90 space-y-2 shadow-2xs">
                <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>1. Strict Read-Only Bridge</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 font-sans text-xs leading-relaxed">
                  One-way contract (<code className="text-amber-600 dark:text-amber-400 font-bold font-mono">GET /live-state/{'{well_id}'}</code>). NWIS never sends control commands to rig hardware or eRTMAC valves.
                </p>
              </Card>

              <Card className="p-5 rounded-2xl bg-white dark:bg-[#12151c] border border-neutral-200 dark:border-neutral-800/90 space-y-2 shadow-2xs">
                <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2 text-xs">
                  <GitCompare className="w-4 h-4 shrink-0" />
                  <span>2. Stratigraphic Similarity &gt; Distance</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 font-sans text-xs leading-relaxed">
                  Matches formation facies, pressure regimes, and structural dip over raw Euclidean distance—preventing misleading offset correlations across complex Naga thrust faults.
                </p>
              </Card>

              <Card className="p-5 rounded-2xl bg-white dark:bg-[#12151c] border border-neutral-200 dark:border-neutral-800/90 space-y-2 shadow-2xs">
                <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-2 text-xs">
                  <FileCheck2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>3. Document Provenance &amp; Audit</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 font-sans text-xs leading-relaxed">
                  Every advisory cites original WCR and daily report page citations with OCR confidence tiers and human superintendent verification signatures (DGMS &amp; OISD-GDN-178 Aligned).
                </p>
              </Card>
            </div>

          </div>
        </section>

      </main>

      {/* ─── Clean Industrial Footer ─── */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#07090f] text-neutral-600 dark:text-neutral-400 py-6 px-4 sm:px-6 text-xs font-mono transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            Built for <strong>Oil India Limited</strong> · eRTMAC Companion Architecture
          </div>
          <div className="flex flex-wrap items-center gap-3 text-neutral-500 text-[11px]">
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> DGMS &amp; OISD-GDN-178 Aligned
            </span>
            <span>•</span>
            <span>Assam-Arakan Basin Archives (1889–2026)</span>
            <span>•</span>
            <span>© 2026 Oil India Limited</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
