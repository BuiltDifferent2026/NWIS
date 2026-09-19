'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle2, 
  Activity,
  Play,
  Pause,
  RotateCcw,
  ShieldAlert,
  Layers,
  Database,
  Compass,
  TrendingDown
} from 'lucide-react';
import { useAppStore } from '@/store/app-store';

export const HeroSection: React.FC = () => {
  const { setRole } = useAppStore();

  // Interactive live terminal simulator
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

  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#090b0f] border-b border-neutral-200 dark:border-neutral-800 pt-12 pb-16 lg:py-20 transition-colors">
      {/* Background Architectural Blueprint Grid Lines */}
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

      {/* Subtle Side Cross-Hatch Rulers */}
      <div className="absolute top-0 bottom-0 left-0 w-8 border-r border-neutral-200/60 dark:border-neutral-800/60 hidden xl:block bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.02),rgba(0,0,0,0.02)_4px,transparent_4px,transparent_8px)] dark:bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.02),rgba(255,255,255,0.02)_4px,transparent_4px,transparent_8px)]" />
      <div className="absolute top-0 bottom-0 right-0 w-8 border-l border-neutral-200/60 dark:border-neutral-800/60 hidden xl:block bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.02),rgba(0,0,0,0.02)_4px,transparent_4px,transparent_8px)] dark:bg-[repeating-linear-gradient(-45deg,rgba(255,255,255,0.02),rgba(255,255,255,0.02)_4px,transparent_4px,transparent_8px)]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Header Block */}
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          
          {/* Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
            <span>eRTMAC Subsurface Institutional Memory Layer</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] text-neutral-950 dark:text-white leading-[1.08] max-w-3xl">
            130 Years of Subsurface Memory.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600">
              Activated Before You Drill.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            An AI-powered offset-well intelligence platform that sits strictly alongside eRTMAC. Transmuting fragmented Daily Drilling Reports and Well Completion Reports into proactive depth-aware hazard advisories across the Naga Thrust & Fold Belt.
          </p>

          {/* Demo Launch Actions & Quick Role Switcher */}
          <div className="pt-2 space-y-5 flex flex-col items-center w-full">
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-extrabold rounded-xl bg-gradient-to-r from-amber-700 via-amber-600 to-orange-700 text-white hover:from-amber-800 hover:to-orange-800 transition-all shadow-md shadow-amber-900/20 hover:shadow-lg shrink-0 cursor-pointer"
              >
                <Activity className="w-4 h-4 text-amber-200" />
                <span>Launch Live Demo Console</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/replay"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#12151c] text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-2xs cursor-pointer"
              >
                <span>Historical Replay Simulator</span>
              </Link>
            </div>

            {/* Quick Evaluator Role Selector */}
            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/90 dark:bg-[#12151c]/90 text-xs font-mono w-full max-w-lg shadow-2xs">
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
                  href="/wells/well-glk-14"
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

        </div>

        {/* ─── High-Tech Live Interactive Bit Terminal Console ─── */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-[#11141d] shadow-xl overflow-hidden backdrop-blur-xs transition-all">
          
          {/* Terminal Titlebar */}
          <div className="px-4 py-3 bg-neutral-100 dark:bg-[#0c0f17] border-b border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono font-bold text-neutral-900 dark:text-neutral-200 ml-1">
                eRTMAC :: OIL-GLK-14 (Geleki Field · Upper Tipam Horizon)
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
                {isLiveSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isLiveSimulating ? 'Simulating Bit' : 'Simulate Advance'}</span>
              </button>

              <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                STREAM ACTIVE
              </span>
            </div>
          </div>

          {/* Terminal Body */}
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

              {/* Corridor Progress Bar */}
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

                {/* Loss zone (red stripes) starting at 2,240m */}
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

              {/* Corridor depth indicators */}
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
                  {distanceToHazard > 0 ? `${distanceToHazard.toFixed(1)}m Buffer Ahead` : 'Loss Zone Reached'}
                </span>
              </div>

              {/* Fact, Recommendation, and Nearest Analog */}
              <div className="space-y-2 text-xs font-mono">
                <div className="text-neutral-700 dark:text-neutral-300 font-sans leading-relaxed">
                  <strong className="text-neutral-950 dark:text-white font-mono text-xs">Observed Fact: </strong>
                  5 offset wells in Geleki experienced total mud loss (average 34 NPT hrs) between 2,240m and 2,280m MD.
                </div>

                <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-[#090b12] border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 font-sans leading-relaxed">
                  <strong className="text-emerald-700 dark:text-emerald-400 font-mono text-xs">Recommended Action: </strong>
                  Stage 35 ppb mixed-fiber LCM pill in reserve pit now. Cap ECD at 10.4 ppg prior to passing 2,190m.
                </div>
              </div>

              {/* Action Buttons & Evidence Citation */}
              <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-200/60 dark:border-neutral-800/80">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 self-start sm:self-auto">
                  <Layers className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Nearest Stratigraphic Analog: <strong className="text-neutral-950 dark:text-white">OIL-GLK-07</strong> (0.84 Sim) · WCR-GLK-07-1996/p19</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Link
                    href="/wells/well-glk-14"
                    className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold font-mono text-xs transition-colors text-center cursor-pointer"
                  >
                    Acknowledge & Stage Pill
                  </Link>
                  <Link
                    href="/replay"
                    className="px-3.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold font-mono text-xs transition-colors text-center cursor-pointer"
                  >
                    Verify Replay
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* ─── 4 Executive Architecture & Trust Metrics ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          
          <div className="p-4 rounded-2xl bg-white dark:bg-[#12151c] border border-neutral-200 dark:border-neutral-800 space-y-1 shadow-2xs">
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase block font-bold">
              Cataloged Wells
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">
              1,670+
            </div>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">
              Across 6 Assam Fields
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#12151c] border border-neutral-200 dark:border-neutral-800 space-y-1 shadow-2xs">
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase block font-bold">
              Lookahead Buffer
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 dark:text-amber-400">
              75m MD
            </div>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">
              3.5–5h Advance Warning
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#12151c] border border-neutral-200 dark:border-neutral-800 space-y-1 shadow-2xs">
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase block font-bold">
              Avg NPT Saved
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">
              34 hrs
            </div>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">
              ≈ $503k / incident avoided
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#12151c] border border-neutral-200 dark:border-neutral-800 space-y-1 shadow-2xs">
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase block font-bold">
              PSU Sovereignty
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">
              100%
            </div>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">
              Air-Gapped & On-Premise
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
