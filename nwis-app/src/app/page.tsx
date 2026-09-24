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
  Compass, 
  ShieldCheck, 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldAlert,
  FileCheck2,
  Lock
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
      badgeColor: 'bg-[#D9F2EE] text-[#26A69A] border-[#3FC3B6]',
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
      badgeColor: 'bg-[#FDF2F2] text-[#ED1C24] border-[#E05252]',
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
      badgeColor: 'bg-[#D9F2EE] text-[#26A69A] border-[#3FC3B6]',
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
      badgeColor: 'bg-[#F5F7F8] text-[#34435A] border-[#E2E5E8]',
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
      badgeColor: 'bg-[#F5F7F8] text-[#252B33] border-[#E2E5E8]',
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
      badgeColor: 'bg-[#FDF2F2] text-[#ED1C24] border-[#E05252]',
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
    <div className="min-h-screen flex flex-col bg-[#F5F7F8] text-[#252B33] transition-colors">
      {/* ─── Top Navigation Header with Oil India Logo ─── */}
      <header className="sticky top-0 z-40 border-b border-[#E2E5E8] bg-white/95 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Logo with Official Oil India Emblem */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white flex items-center justify-center p-0.5 border border-[#E2E5E8] shadow-2xs group-hover:border-[#3FC3B6] transition-colors shrink-0 rounded-none">
              <img 
                src="/oil-india-logo.png" 
                alt="Oil India Limited Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-[#252B33] font-sans">
                  NWIS
                </span>
                <span className="px-1.5 py-0.2 bg-[#D9F2EE] text-[#26A69A] border border-[#3FC3B6] text-[9px] font-mono font-bold uppercase tracking-wider rounded-none">
                  eRTMAC COMPANION
                </span>
              </div>
              <span className="text-[10px] text-[#6B7280] font-bold hidden sm:block leading-tight font-sans">
                Oil India Limited · Nearby Wells Intelligence
              </span>
            </div>
          </Link>

          {/* Quick Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F5F7F8] p-1 rounded-none border border-[#E2E5E8] text-xs font-mono font-bold">
            <Link href="/operations" className="px-3 py-1.5 rounded-none text-[#6B7280] hover:text-[#252B33] hover:bg-white transition-colors">
              Operations
            </Link>
            <Link href="/replay" className="px-3 py-1.5 rounded-none text-[#6B7280] hover:text-[#252B33] hover:bg-white transition-colors">
              Well Replay
            </Link>
            <Link href="/analogs" className="px-3 py-1.5 rounded-none text-[#6B7280] hover:text-[#252B33] hover:bg-white transition-colors">
              Offset Analogs
            </Link>
            <Link href="/dashboard" className="px-3 py-1.5 rounded-none text-[#6B7280] hover:text-[#252B33] hover:bg-white transition-colors">
              Fleet Register
            </Link>
            <Link href="/decay-index" className="px-3 py-1.5 rounded-none text-[#6B7280] hover:text-[#252B33] hover:bg-white transition-colors">
              Decay Index
            </Link>
            <Link href="/admin/ingestion" className="px-3 py-1.5 rounded-none text-[#6B7280] hover:text-[#252B33] hover:bg-white transition-colors">
              Ingestion
            </Link>
          </nav>

          {/* Header Controls */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="px-3 py-1.5 text-xs font-mono font-bold text-[#6B7280] hover:text-[#26A69A] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/operations"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-[#ED1C24] hover:bg-[#C9141B] text-white text-xs font-bold font-mono shadow-2xs transition-colors cursor-pointer"
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
        <section className="relative overflow-hidden bg-white border-b border-[#E2E5E8] pt-10 pb-16 lg:py-20 transition-colors">
          
          {/* Blueprint Grid Lines */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(34, 34, 34, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(34, 34, 34, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px'
            }}
          />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 z-10">
            
            {/* Hero Text */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#F5F7F8] border border-[#E2E5E8] text-[#252B33] text-xs font-semibold shadow-2xs rounded-none">
                <img src="/oil-india-logo.png" alt="Oil India Limited" className="h-5 w-auto object-contain" />
                <span className="w-1.5 h-1.5 bg-[#3FAE68] rounded-none animate-pulse" />
                <span className="font-bold text-[#252B33]">Oil India Limited</span>
                <span className="text-[#6B7280]">·</span>
                <span>eRTMAC Subsurface Institutional Memory Layer</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.035em] text-[#252B33] leading-[1.08]">
                130 Years of Subsurface Memory.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ED1C24] via-[#C9141B] to-[#34435A]">
                  Activated Before You Drill.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#6B7280] font-sans leading-relaxed max-w-2xl mx-auto">
                Real-time offset well intelligence platform designed strictly alongside Oil India&apos;s <strong>eRTMAC</strong>. Correlates historical Well Completion Reports and Daily Drilling Reports across the <strong>Assam-Arakan Basin</strong> to deliver depth-aware proactive hazard lookaheads.
              </p>

              {/* Primary Call-to-Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono text-xs">
                <Link
                  href="/operations"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-extrabold rounded-none bg-[#ED1C24] hover:bg-[#C9141B] text-white transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-white" />
                  <span>Launch Live Operations (OIL-GLK-14)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/replay"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold rounded-none border border-[#E2E5E8] bg-white text-[#252B33] hover:bg-[#F5F7F8] hover:border-[#34435A] transition-colors shadow-2xs cursor-pointer"
                >
                  <Activity className="w-4 h-4 text-[#34435A]" />
                  <span>Historical Replay Simulator</span>
                </Link>
              </div>

              {/* Quick Evaluator Role Selector */}
              <div className="p-3.5 rounded-none border border-[#E2E5E8] bg-[#F5F7F8] text-xs font-mono w-full max-w-lg mx-auto shadow-2xs">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[10px] uppercase font-bold text-[#34435A]">
                    Evaluator 1-Click Role Login:
                  </span>
                  <span className="text-[9px] font-bold text-[#26A69A] px-1.5 py-0.5 bg-[#D9F2EE] border border-[#3FC3B6]">
                    FOR EVALUATORS
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setRole('operations_manager')}
                    className="p-2 rounded-none bg-white border border-[#E2E5E8] hover:border-[#3FC3B6] hover:bg-[#D9F2EE]/30 text-center font-bold text-[#252B33] transition-colors hover:shadow-2xs cursor-pointer"
                  >
                    Operations Mgr
                  </Link>
                  <Link
                    href="/operations"
                    onClick={() => setRole('field_engineer')}
                    className="p-2 rounded-none bg-white border border-[#E2E5E8] hover:border-[#3FC3B6] hover:bg-[#D9F2EE]/30 text-center font-bold text-[#252B33] transition-colors hover:shadow-2xs cursor-pointer"
                  >
                    Rig Engineer
                  </Link>
                  <Link
                    href="/admin/ingestion"
                    onClick={() => setRole('admin')}
                    className="p-2 rounded-none bg-white border border-[#E2E5E8] hover:border-[#3FC3B6] hover:bg-[#D9F2EE]/30 text-center font-bold text-[#252B33] transition-colors hover:shadow-2xs cursor-pointer"
                  >
                    PSU Auditor
                  </Link>
                </div>
              </div>

              {/* Footnote Reassurance */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#6B7280] font-mono">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3FAE68]" />
                  Read-only eRTMAC companion
                </span>
                <span className="text-[#E2E5E8]">•</span>
                <span>Air-gapped on-premise sovereign</span>
                <span className="text-[#E2E5E8]">•</span>
                <span>75m proactive lead-time</span>
              </div>

            </div>

            {/* ─── High-Tech Live Interactive Bit Terminal Console ─── */}
            <div className="max-w-5xl mx-auto rounded-none border border-[#E2E5E8] bg-white shadow-xs overflow-hidden transition-all">
              
              {/* Terminal Title Bar */}
              <div className="px-4 py-3 bg-[#34435A] text-white border-b border-[#222222] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-none bg-[#ED1C24] inline-block" />
                  <span className="w-2.5 h-2.5 rounded-none bg-[#F2B84B] inline-block" />
                  <span className="w-2.5 h-2.5 rounded-none bg-[#3FAE68] inline-block" />
                  <span className="font-extrabold text-white ml-1">
                    eRTMAC TELEMETRY LOOKAHEAD CONSOLE
                  </span>
                  <span className="text-white/40 hidden sm:inline">•</span>
                  <span className="text-white/80 hidden sm:inline">
                    WELL: OIL-GLK-14 (Geleki Field · Upper Tipam)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSimulatedDepth(2165.4)}
                    className="p-1.5 rounded-none border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs transition-colors cursor-pointer"
                    title="Reset simulation to 2,165.4m"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsLiveSimulating(!isLiveSimulating)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-mono font-bold transition-all cursor-pointer ${
                      isLiveSimulating
                        ? 'bg-[#ED1C24] hover:bg-[#C9141B] text-white shadow-2xs'
                        : 'bg-[#3FC3B6] hover:bg-[#26A69A] text-[#222222] hover:text-white'
                    }`}
                  >
                    {isLiveSimulating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{isLiveSimulating ? 'Simulating Bit' : 'Simulate Advance'}</span>
                  </button>

                  <span className="px-2.5 py-1 rounded-none bg-[#D9F2EE] text-[#26A69A] text-[10px] font-mono font-bold border border-[#3FC3B6] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-none bg-[#3FAE68] animate-pulse" />
                    STREAM ACTIVE
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-5 bg-[#F5F7F8]">
                
                {/* 4 Telemetry Parameter Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                  <div className="p-3.5 rounded-none bg-white border border-[#E2E5E8] space-y-1">
                    <span className="text-[10px] text-[#6B7280] block font-bold uppercase tracking-wider">
                      Bit Depth (MD)
                    </span>
                    <div className="text-2xl font-extrabold text-[#252B33] tabular-nums">
                      {simulatedDepth.toFixed(1)}m
                    </div>
                    <span className="text-[10px] text-[#6B7280] block">TVD: 2,110.2m</span>
                  </div>

                  <div className="p-3.5 rounded-none bg-white border border-[#E2E5E8] space-y-1">
                    <span className="text-[10px] text-[#6B7280] block font-bold uppercase tracking-wider">
                      Drilling ROP
                    </span>
                    <div className="text-2xl font-extrabold text-[#26A69A] tabular-nums">
                      14.8 m/h
                    </div>
                    <span className="text-[10px] text-[#26A69A] block font-bold">Steady Advance</span>
                  </div>

                  <div className="p-3.5 rounded-none bg-white border border-[#E2E5E8] space-y-1">
                    <span className="text-[10px] text-[#6B7280] block font-bold uppercase tracking-wider">
                      Rotary Torque
                    </span>
                    <div className="text-2xl font-extrabold text-[#252B33] tabular-nums">
                      11.2 kft-lb
                    </div>
                    <span className="text-[10px] text-[#6B7280] block">RPM: 82 • WOB: 16.5k</span>
                  </div>

                  <div className="p-3.5 rounded-none bg-white border border-[#E2E5E8] space-y-1">
                    <span className="text-[10px] text-[#6B7280] block font-bold uppercase tracking-wider">
                      Mud Weight (IN)
                    </span>
                    <div className="text-2xl font-extrabold text-[#34435A] tabular-nums">
                      9.8 ppg
                    </div>
                    <span className="text-[10px] text-[#34435A] block font-bold">ECD Margin: +0.42</span>
                  </div>
                </div>

                {/* Calibrated Lookahead Corridor Bar */}
                <div className="p-4 rounded-none bg-white border border-[#E2E5E8] space-y-2 font-mono">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                    <span className="text-[#6B7280] font-bold uppercase text-[10px]">
                      Geological Lookahead Corridor (2,100m – 2,240m MD)
                    </span>
                    <span className="font-bold">
                      {isHazardReached ? (
                        <span className="text-[#ED1C24] font-extrabold">Inside Upper Tipam Loss Interval (Severe Mud Loss Risk)</span>
                      ) : isTriggered ? (
                        <span className="text-[#F2B84B] font-extrabold">Mandatory LCM Staging Triggered (75m Lookahead Active)</span>
                      ) : (
                        <span className="text-[#252B33]">
                          Trigger tripwire in <strong className="text-[#ED1C24]">{distanceToTrigger.toFixed(1)}m</strong> (~{Math.round(distanceToTrigger / 14.8 * 60)} min lead time)
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Progress Corridor Bar */}
                  <div className="relative h-6 rounded-none bg-[#E2E5E8] overflow-hidden border border-[#E2E5E8] flex items-center">
                    {/* Drilled Zone */}
                    <div 
                      style={{ width: `${Math.min(100, Math.max(0, (simulatedDepth - 2100) / 140 * 100))}%` }}
                      className="h-full bg-gradient-to-r from-[#26A69A] to-[#3FC3B6] transition-all duration-300"
                    />

                    {/* Trigger tripwire marker at 2,180m (57.1%) */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-[#F2B84B] z-10 border-r border-dashed border-[#222222]"
                      style={{ left: '57.1%' }}
                      title="Action Trigger Point (2,180m)"
                    />

                    {/* Loss zone (red stripes) starting at 2,240m (100%) */}
                    <div 
                      className="absolute top-0 bottom-0 right-0 w-10 bg-[#ED1C24]"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, rgba(237,28,36,0.95), rgba(237,28,36,0.95) 6px, rgba(201,20,27,0.95) 6px, rgba(201,20,27,0.95) 12px)'
                      }}
                      title="Severe Loss Horizon (2,240m)"
                    />

                    {/* Active Bit Cursor */}
                    <div 
                      className="absolute top-0 bottom-0 w-2 bg-[#ED1C24] shadow-[0_0_8px_rgba(237,28,36,0.8)] z-20 transition-all duration-300"
                      style={{ left: `calc(${Math.min(100, Math.max(0, (simulatedDepth - 2100) / 140 * 100))}% - 4px)` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#6B7280] pt-0.5">
                    <span>2,100m (Girujan Seal)</span>
                    <span className="text-[#26A69A] font-bold">Active Bit: {simulatedDepth.toFixed(1)}m</span>
                    <span className="text-[#F2B84B] font-bold">Action Trigger: 2,180m</span>
                    <span className="text-[#ED1C24] font-bold">Severe Loss: 2,240m</span>
                  </div>
                </div>

                {/* Active Proactive Alert Card */}
                <div className={`p-4 rounded-none border transition-all space-y-3 bg-white ${
                  isHazardReached
                    ? 'border-l-4 border-l-[#ED1C24] border-y border-r border-[#E2E5E8]'
                    : isTriggered
                    ? 'border-l-4 border-l-[#F2B84B] border-y border-r border-[#E2E5E8]'
                    : 'border-l-4 border-l-[#3FC3B6] border-y border-r border-[#E2E5E8]'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className={`w-4 h-4 ${isHazardReached ? 'text-[#ED1C24]' : isTriggered ? 'text-[#F2B84B]' : 'text-[#26A69A]'}`} />
                      <span className="px-2 py-0.5 rounded-none bg-[#ED1C24] text-white text-[9px] font-mono font-bold uppercase tracking-wider">
                        PROACTIVE LOOKAHEAD
                      </span>
                      <span className="text-xs font-bold font-mono text-[#252B33]">
                        Approaching Upper Tipam Micro-Fracture Loss Horizon
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-none bg-[#D9F2EE] text-[#26A69A] text-[10px] font-mono font-bold border border-[#3FC3B6] shrink-0 self-start sm:self-auto">
                      {distanceToHazard > 0 ? `${distanceToHazard.toFixed(1)}m Ahead • Corridor GLK-COR-03` : 'Loss Zone Reached'}
                    </span>
                  </div>

                  {/* 3-Part Separation Summary */}
                  <div className="space-y-2 text-xs font-mono">
                    <div className="text-[#252B33] font-sans leading-relaxed">
                      <strong className="text-[#252B33] font-mono text-xs">Observed Ground Truth: </strong>
                      5 of 8 offset wells in Geleki suffered severe lost circulation (avg 28.4h NPT). <strong>OIL-GLK-07</strong> suffered total mud loss (420 bbls) at 2,280m MD when mud weight reached 10.8 ppg.
                    </div>

                    <div className="p-2.5 rounded-none bg-[#F5F7F8] border border-[#E2E5E8] text-[#252B33] font-sans leading-relaxed">
                      <strong className="text-[#26A69A] font-mono text-xs">Recommended Rig Advisory: </strong>
                      Pre-stage 35 ppb medium-nut-plug LCM pill in active Pit #2 before 2,180m MD. Cap ECD &lt; 10.2 ppg. (Validated by <strong>OIL-GLK-05</strong> clean run).
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E2E5E8] text-[11px] font-mono">
                    <span className="text-[#6B7280]">
                      Best Stratigraphic Analog: <strong className="text-[#252B33]">OIL-GLK-07 (87% Sim · 1.8km SE)</strong>
                    </span>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Link 
                        href="/operations" 
                        className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-none bg-[#ED1C24] hover:bg-[#C9141B] text-white font-bold font-mono text-xs transition-colors text-center cursor-pointer shadow-2xs"
                      >
                        <span>Acknowledge & Stage Pill</span>
                      </Link>
                      <Link 
                        href="/replay" 
                        className="px-3.5 py-1.5 rounded-none border border-[#E2E5E8] bg-white hover:bg-[#F5F7F8] text-[#252B33] font-bold font-mono text-xs transition-colors text-center cursor-pointer"
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
              
              <div className="p-4 rounded-none bg-white border border-[#E2E5E8] space-y-1 shadow-2xs">
                <span className="text-[10px] text-[#6B7280] uppercase block font-bold">CATALOGED WELLS</span>
                <div className="text-2xl sm:text-3xl font-black text-[#252B33]">1,670+</div>
                <span className="text-[10px] text-[#6B7280] block">Across 6 Assam Fields</span>
              </div>

              <div className="p-4 rounded-none bg-white border border-[#E2E5E8] space-y-1 shadow-2xs">
                <span className="text-[10px] text-[#6B7280] uppercase block font-bold">LOOKAHEAD BUFFER</span>
                <div className="text-2xl sm:text-3xl font-black text-[#ED1C24]">75m MD</div>
                <span className="text-[10px] text-[#6B7280] block">3.5–5h Advance Warning</span>
              </div>

              <div className="p-4 rounded-none bg-white border border-[#E2E5E8] space-y-1 shadow-2xs">
                <span className="text-[10px] text-[#6B7280] uppercase block font-bold">AVG NPT SAVED</span>
                <div className="text-2xl sm:text-3xl font-black text-[#26A69A]">34 hrs</div>
                <span className="text-[10px] text-[#6B7280] block">≈ $503k / incident avoided</span>
              </div>

              <div className="p-4 rounded-none bg-white border border-[#E2E5E8] space-y-1 shadow-2xs">
                <span className="text-[10px] text-[#6B7280] uppercase block font-bold">PSU SOVEREIGNTY</span>
                <div className="text-2xl sm:text-3xl font-black text-[#34435A]">100%</div>
                <span className="text-[10px] text-[#6B7280] block">Air-Gapped & On-Premise</span>
              </div>

            </div>

          </div>

        </section>

        {/* ─── Balanced 6-Module Operational Suite Grid ─── */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-[#E2E5E8] bg-[#F5F7F8] transition-colors">
          <div className="max-w-6xl mx-auto space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-none bg-[#D9F2EE] border border-[#3FC3B6] text-[#26A69A] text-[11px] font-mono font-bold mb-2">
                  <Compass className="w-3.5 h-3.5 text-[#26A69A]" />
                  <span>SIH26121 EVALUATION WORKSPACES</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#252B33] font-mono">
                  Assam Basin Drilling Intelligence Modules
                </h2>
                <p className="text-xs sm:text-sm text-[#6B7280] font-mono mt-1">
                  Six integrated modules bridging live eRTMAC rig streaming with 130 years of archival memory across the Naga Thrust Belt.
                </p>
              </div>
              <span className="text-xs font-mono text-[#6B7280]">6 Functional Workspaces</span>
            </div>

            {/* 3x2 Responsive Balanced Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {modules.map((m) => {
                const Icon = m.icon;
                return (
                  <Card
                    key={m.title}
                    className="rounded-none border border-[#E2E5E8] bg-white p-6 shadow-2xs hover:shadow-md hover:border-[#3FC3B6] transition-all flex flex-col justify-between space-y-5 group"
                  >
                    <div className="space-y-3">
                      
                      {/* Card Header with Icon & Badge */}
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-none bg-[#F5F7F8] border border-[#E2E5E8] flex items-center justify-center text-[#34435A] group-hover:bg-[#D9F2EE] group-hover:text-[#26A69A] group-hover:border-[#3FC3B6] transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`px-2 py-0.5 rounded-none text-[9px] font-mono font-bold border ${m.badgeColor}`}>
                          {m.badge}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-[#252B33] font-mono leading-snug group-hover:text-[#26A69A] transition-colors">
                        {m.title}
                      </h3>

                      <p className="text-xs text-[#6B7280] font-sans leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    {/* Miniature Instrument Preview Badge */}
                    <div className="p-3 rounded-none bg-[#F5F7F8] border border-[#E2E5E8] flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-[#6B7280] text-[10px] block font-bold">{m.preview.label}</span>
                        <span className="font-bold text-[#252B33] text-[11px]">{m.preview.val}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#6B7280] text-[10px] block">{m.preview.status}</span>
                        <span className="font-bold text-[#26A69A] text-[11px]">{m.preview.metric}</span>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="pt-3 border-t border-[#E2E5E8] flex items-center justify-between gap-3">
                      <Link
                        href={m.href}
                        className="w-full inline-flex items-center justify-between px-3.5 py-2 rounded-none bg-[#F5F7F8] hover:bg-[#ED1C24] text-[#252B33] hover:text-white text-xs font-bold font-mono transition-all group-hover:bg-[#ED1C24] group-hover:text-white cursor-pointer"
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
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-[#E2E5E8] bg-white transition-colors">
          <div className="max-w-6xl mx-auto space-y-8">
            
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#D9F2EE] border border-[#3FC3B6] text-[#26A69A] text-xs font-mono font-bold">
                <ShieldAlert className="w-3.5 h-3.5 text-[#26A69A]" />
                <span>OPERATIONAL VALUE COMPARISON</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#252B33] font-mono">
                How NWIS Proactively Intervenes on the Rig Floor
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] font-sans max-w-2xl mx-auto leading-relaxed">
                Direct operational comparison of conventional reactive post-incident response versus NWIS lookahead intelligence across the Upper Tipam Sandstone loss interval.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
              
              {/* Conventional Reactive Path */}
              <Card className="p-6 rounded-none border border-[#E05252]/40 bg-[#FDF2F2]/60 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#E05252]/30">
                  <span className="font-bold text-[#ED1C24] uppercase text-[11px] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#ED1C24] shrink-0" />
                    <span>Conventional Reactive Drilling (eRTMAC Alone)</span>
                  </span>
                  <Badge className="bg-[#ED1C24] text-white text-[9px] font-mono font-bold rounded-none">
                    34h NPT INCURRED
                  </Badge>
                </div>
                <div className="space-y-3 text-[#252B33] font-sans text-xs">
                  <div className="p-3 rounded-none bg-white border border-[#E05252]/30 space-y-1">
                    <div className="text-[#252B33] font-mono font-bold text-[11px] flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-none bg-[#FDF2F2] text-[#ED1C24] font-bold border border-[#E05252] flex items-center justify-center text-[10px]">1</span>
                      <span>Blind Entry</span>
                    </div>
                    <p className="text-[#6B7280] leading-relaxed text-[11px] pl-5">
                      Bit penetrates Upper Tipam Sandstone micro-fractures without historical analog awareness. Real-time surface parameters look normal until loss begins.
                    </p>
                  </div>
                  <div className="p-3 rounded-none bg-white border border-[#E05252]/30 space-y-1">
                    <div className="text-[#252B33] font-mono font-bold text-[11px] flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-none bg-[#FDF2F2] text-[#ED1C24] font-bold border border-[#E05252] flex items-center justify-center text-[10px]">2</span>
                      <span>Catastrophic Fluid Loss</span>
                    </div>
                    <p className="text-[#6B7280] leading-relaxed text-[11px] pl-5">
                      Mud weight 10.8 ppg breaks open depleted fracture network; total fluid loss (420 bbls) strikes at 2,280m MD with complete return loss.
                    </p>
                  </div>
                  <div className="p-3 rounded-none bg-white border border-[#E05252]/30 space-y-1">
                    <div className="text-[#252B33] font-mono font-bold text-[11px] flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-none bg-[#FDF2F2] text-[#ED1C24] font-bold border border-[#E05252] flex items-center justify-center text-[10px]">3</span>
                      <span>Reactive Scramble</span>
                    </div>
                    <p className="text-[#6B7280] leading-relaxed text-[11px] pl-5">
                      Drilling operations halt for 34 hours while rig crew frantically sources LCM pill chemicals and mixes heavy fiber squeeze pills under emergency conditions.
                    </p>
                  </div>
                </div>
              </Card>

              {/* NWIS Proactive Path */}
              <Card className="p-6 rounded-none border border-[#3FC3B6] bg-[#D9F2EE]/40 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#3FC3B6]/40">
                  <span className="font-bold text-[#26A69A] uppercase text-[11px] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#26A69A] shrink-0" />
                    <span>NWIS Real-Time Companion Workflow</span>
                  </span>
                  <Badge className="bg-[#3FAE68] text-white text-[9px] font-mono font-bold rounded-none">
                    ZERO NPT LOSS
                  </Badge>
                </div>
                <div className="space-y-3 text-[#252B33] font-sans text-xs">
                  <div className="p-3 rounded-none bg-white border border-[#3FC3B6]/40 space-y-1">
                    <div className="text-[#252B33] font-mono font-bold text-[11px] flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-none bg-[#D9F2EE] text-[#26A69A] font-bold border border-[#3FC3B6] flex items-center justify-center text-[10px]">1</span>
                      <span>75m Advance Notice</span>
                    </div>
                    <p className="text-[#6B7280] leading-relaxed text-[11px] pl-5">
                      Watcher triggers depth-calibrated advisory at 2,180m MD, surfacing OIL-GLK-07 historical loss post-mortem 4.2 hours ahead of bit entry.
                    </p>
                  </div>
                  <div className="p-3 rounded-none bg-white border border-[#3FC3B6]/40 space-y-1">
                    <div className="text-[#252B33] font-mono font-bold text-[11px] flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-none bg-[#D9F2EE] text-[#26A69A] font-bold border border-[#3FC3B6] flex items-center justify-center text-[10px]">2</span>
                      <span>Pre-emptive Conditioning</span>
                    </div>
                    <p className="text-[#6B7280] leading-relaxed text-[11px] pl-5">
                      Mud engineer stages 35 ppb mixed-fiber nut-plug pill in suction pit and caps circulating ECD at 10.2 ppg (mitigation proven by offset GLK-05).
                    </p>
                  </div>
                  <div className="p-3 rounded-none bg-white border border-[#3FC3B6]/40 space-y-1">
                    <div className="text-[#252B33] font-mono font-bold text-[11px] flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-none bg-[#D9F2EE] text-[#26A69A] font-bold border border-[#3FC3B6] flex items-center justify-center text-[10px]">3</span>
                      <span>Clean Safe Passage</span>
                    </div>
                    <p className="text-[#6B7280] leading-relaxed text-[11px] pl-5">
                      Bit traverses 2,240m–2,350m without any fluid loss or pack-off. Rig saves 34 hours of non-productive time and ₹42L in emergency pill treatments.
                    </p>
                  </div>
                </div>
              </Card>

            </div>

          </div>
        </section>

        {/* ─── PSU Governance & Safety Framework ─── */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 border-b border-[#E2E5E8] bg-[#F5F7F8] transition-colors">
          <div className="max-w-6xl mx-auto space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-none bg-[#D9F2EE] border border-[#3FC3B6] text-[#26A69A] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#252B33] font-mono uppercase tracking-wide">
                    PSU Governance &amp; Safety Boundary Framework
                  </h3>
                  <p className="text-xs text-[#6B7280] font-sans">
                    Three strict architectural guardrails safeguarding eRTMAC critical systems and statutory PSU compliance.
                  </p>
                </div>
              </div>
              <Badge className="bg-[#D9F2EE] text-[#26A69A] border border-[#3FC3B6] text-[10px] font-mono font-bold self-start sm:self-auto rounded-none">
                AIR-GAPPED COMPLIANT
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <Card className="p-5 rounded-none bg-white border border-[#E2E5E8] space-y-2 shadow-2xs">
                <div className="font-bold text-[#26A69A] flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>1. Strict Read-Only Bridge</span>
                </div>
                <p className="text-[#6B7280] font-sans text-xs leading-relaxed">
                  One-way contract (<code className="text-[#252B33] bg-[#F5F7F8] px-1 py-0.5 border border-[#E2E5E8] font-bold font-mono">GET /live-state/{'{well_id}'}</code>). NWIS never sends control commands to rig hardware or eRTMAC valves.
                </p>
              </Card>

              <Card className="p-5 rounded-none bg-white border border-[#E2E5E8] space-y-2 shadow-2xs">
                <div className="font-bold text-[#34435A] flex items-center gap-2 text-xs">
                  <GitCompare className="w-4 h-4 shrink-0" />
                  <span>2. Stratigraphic Similarity &gt; Distance</span>
                </div>
                <p className="text-[#6B7280] font-sans text-xs leading-relaxed">
                  Matches formation facies, pressure regimes, and structural dip over raw Euclidean distance—preventing misleading offset correlations across complex Naga thrust faults.
                </p>
              </Card>

              <Card className="p-5 rounded-none bg-white border border-[#E2E5E8] space-y-2 shadow-2xs">
                <div className="font-bold text-[#252B33] flex items-center gap-2 text-xs">
                  <FileCheck2 className="w-4 h-4 text-[#ED1C24] shrink-0" />
                  <span>3. Document Provenance &amp; Audit</span>
                </div>
                <p className="text-[#6B7280] font-sans text-xs leading-relaxed">
                  Every advisory cites original WCR and daily report page citations with OCR confidence tiers and human superintendent verification signatures (DGMS &amp; OISD-GDN-178 Aligned).
                </p>
              </Card>
            </div>

          </div>
        </section>

      </main>

      {/* ─── Clean Industrial Footer ─── */}
      <footer className="border-t border-[#E2E5E8] bg-white text-[#6B7280] py-6 px-4 sm:px-6 text-xs font-mono transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <img src="/oil-india-logo.png" alt="Oil India Limited" className="h-6 w-auto object-contain bg-white p-0.5 border border-[#E2E5E8] rounded-none" />
            <span>Built for <strong>Oil India Limited</strong> · eRTMAC Companion Architecture</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[#6B7280] text-[11px]">
            <span className="text-[#3FAE68] flex items-center gap-1 font-bold">
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
