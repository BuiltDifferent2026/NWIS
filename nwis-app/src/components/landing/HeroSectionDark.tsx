'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Activity, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  Radio,
  FileText,
  Clock,
  Gauge,
  Compass
} from 'lucide-react';

export const HeroSectionDark: React.FC = () => {
  return (
    <section className="relative pt-12 pb-16 px-4 sm:px-6 overflow-hidden">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-amber-600/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto space-y-12 relative z-10">
        
        {/* ─── Hero Headline & Description ─── */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>eRTMAC Subsurface Institutional Memory Layer</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.1]">
            130 Years of Subsurface Memory.{' '}
            <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 bg-clip-text text-transparent">
              Activated Before You Drill.
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed max-w-3xl mx-auto">
            An AI-powered offset-well intelligence platform that sits strictly alongside Oil India&apos;s <strong>eRTMAC</strong>. Transmuting fragmented Daily Drilling Reports and 1950s–1990s Well Completion Reports into proactive depth-aware hazard advisories across the <strong>Naga Thrust &amp; Fold Belt</strong>.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono text-xs">
            <Link
              href="/"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-amber-200" />
              <span>Enter Operations Cockpit (OIL-GLK-14)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/replay"
              className="px-5 py-3 rounded-xl border border-neutral-300 dark:border-[#26334a] bg-white dark:bg-[#121723] hover:bg-neutral-50 dark:hover:bg-[#182133] text-neutral-800 dark:text-neutral-200 font-bold transition-colors flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-amber-500" />
              <span>Launch Historical Well Replay Simulator</span>
            </Link>
          </div>

          {/* Quick Subsurface Assurance */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 pt-1">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Strictly 1-Way Read-Only eRTMAC Feed
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              Zero Outbound Rig Control Commands
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              100% On-Premise Air-Gapped Ready
            </span>
          </div>

        </div>

        {/* ─── Hero Industrial Application Cockpit Mockup ─── */}
        <div className="max-w-4xl mx-auto rounded-2xl border-2 border-neutral-800/80 dark:border-[#222d42] bg-[#0c1018] p-4 sm:p-6 shadow-2xl relative overflow-hidden text-neutral-200 font-mono">
          
          {/* Top Mockup Title Bar */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1c2438] text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-neutral-400 text-[11px] ml-2 font-bold">
                eRTMAC :: OIL-GLK-14 (Geleki Field · Upper Tipam)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                WITSML STREAM LIVE
              </span>
            </div>
          </div>

          {/* Cockpit Readout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Bit Depth & Telemetry */}
            <div className="p-4 rounded-xl bg-[#121724] border border-[#1e273b] space-y-2">
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                BIT DEPTH (MD)
              </div>
              <div className="text-3xl font-extrabold text-white">
                2,165.4 <span className="text-xs font-normal text-neutral-400">m</span>
              </div>
              <div className="text-xs text-amber-400 font-semibold flex items-center justify-between">
                <span>Approaching Upper Tipam Sandstone</span>
                <span className="text-neutral-400">TVD: 2,110.2m</span>
              </div>
            </div>

            {/* Live ROP & Torque */}
            <div className="p-4 rounded-xl bg-[#121724] border border-[#1e273b] space-y-2">
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                LIVE ROP / TORQUE / MUD WT
              </div>
              <div className="text-2xl font-extrabold text-white flex items-center gap-3">
                <span>14.8 <span className="text-xs font-normal text-neutral-400">m/h</span></span>
                <span className="text-neutral-600">|</span>
                <span className="text-amber-400">11.2 <span className="text-xs font-normal text-neutral-400">kft-lb</span></span>
              </div>
              <div className="text-xs text-neutral-400 flex items-center justify-between">
                <span>Mud Wt: 10.2 ppg (WBM)</span>
                <span className="text-emerald-400">SPP: 2,850 psi</span>
              </div>
            </div>

          </div>

          {/* Proactive Advisory Banner in Mockup */}
          <div className="mt-4 p-4 rounded-xl border-2 border-amber-500/70 bg-gradient-to-br from-amber-500/15 via-[#141a27] to-amber-950/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold">
                  PROACTIVE ALERT FIRED
                </span>
                <span className="text-xs font-bold text-amber-300">
                  Lost Circulation Thief Zone Hazard
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-neutral-900 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                74.6m Buffer Ahead
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-neutral-300 font-sans">
              <p>
                <strong className="text-white font-mono text-[11px] uppercase">Fact:</strong> 5 offset wells in Geleki experienced severe mud losses (28.4 NPT hrs avg) at 2,240–2,350m MD.
              </p>
              <p className="text-amber-200">
                <strong className="text-amber-300 font-mono text-[11px] uppercase">Recommended:</strong> Stage 35 ppb mixed-fiber LCM pill now. Cap ECD at 10.4 ppg prior to 2,190m MD.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-amber-500/30 text-[11px]">
              <span className="text-neutral-400">
                Nearest Analog: <strong className="text-amber-400 font-mono">OIL-GLK-07 (0.84 Similarity · 3.1 km)</strong>
              </span>
              <span className="text-neutral-400 font-mono">
                Source: <strong className="text-white">WCR-GLK-07-1996/p19</strong>
              </span>
            </div>
          </div>

        </div>

        {/* ─── PSU Key Metrics Strip ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4">
          
          <div className="p-4 rounded-xl bg-white dark:bg-[#0e121a] border border-neutral-200 dark:border-[#1e273b] space-y-1 shadow-xs">
            <span className="text-neutral-500 dark:text-neutral-400 uppercase text-[10px] font-mono font-bold block">INDEXED ASSAM WELLS</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-950 dark:text-white">1,000+</div>
            <span className="text-neutral-500 text-xs font-mono">Digboi, Geleki, Kharsang</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#0e121a] border border-neutral-200 dark:border-[#1e273b] space-y-1 shadow-xs">
            <span className="text-neutral-500 dark:text-neutral-400 uppercase text-[10px] font-mono font-bold block">PROACTIVE LOOKAHEAD</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400">75 m</div>
            <span className="text-neutral-500 text-xs font-mono">Pre-event warning buffer</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#0e121a] border border-neutral-200 dark:border-[#1e273b] space-y-1 shadow-xs">
            <span className="text-neutral-500 dark:text-neutral-400 uppercase text-[10px] font-mono font-bold block">AVG NPT SAVED / INCIDENT</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">34 hrs</div>
            <span className="text-neutral-500 text-xs font-mono">~$420k cost avoidance</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#0e121a] border border-neutral-200 dark:border-[#1e273b] space-y-1 shadow-xs">
            <span className="text-neutral-500 dark:text-neutral-400 uppercase text-[10px] font-mono font-bold block">PSU DATA GOVERNANCE</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-950 dark:text-white">100%</div>
            <span className="text-neutral-500 text-xs font-mono">On-premise air-gapped</span>
          </div>

        </div>

      </div>

    </section>
  );
};
