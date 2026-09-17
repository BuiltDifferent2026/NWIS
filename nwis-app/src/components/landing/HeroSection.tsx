'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Search, 
  ShieldAlert, 
  CheckCircle2, 
  Database, 
  Activity, 
  Compass, 
  Layers, 
  ChevronRight,
  TrendingDown,
  Sparkles
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [selectedWell, setSelectedWell] = useState('OIL-GLK-14');

  return (
    <section className="relative overflow-hidden bg-white border-b border-neutral-200 pt-10 pb-16 lg:py-20">
      {/* Background Architectural Blueprint Grid Lines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Subtle Side Cross-Hatch Rulers (Like the reference blueprint margins) */}
      <div className="absolute top-0 bottom-0 left-0 w-8 border-r border-neutral-200/60 hidden xl:block bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.02),rgba(0,0,0,0.02)_4px,transparent_4px,transparent_8px)]" />
      <div className="absolute top-0 bottom-0 right-0 w-8 border-l border-neutral-200/60 hidden xl:block bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.02),rgba(0,0,0,0.02)_4px,transparent_4px,transparent_8px)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Mission Typography & Quick Launch (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
              <span>eRTMAC Subsurface Institutional Memory Layer</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] text-neutral-950 leading-[1.06]">
              130 Years of Subsurface Memory.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600">
                Activated Before You Drill.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl leading-relaxed">
              An AI-powered offset-well intelligence platform that sits strictly alongside eRTMAC. Transmuting fragmented Daily Drilling Reports and Well Completion Reports into proactive depth-aware hazard advisories across the Naga Thrust & Fold Belt.
            </p>

            {/* Interactive Search / Quick Launch Box */}
            <div className="pt-2">
              <div className="p-2 sm:p-2.5 rounded-2xl border border-neutral-300 bg-neutral-50 shadow-xs max-w-xl flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 flex items-center">
                  <Search className="absolute left-3.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    defaultValue="OIL-GLK-14 (Geleki • Tipam Sandstone)"
                    placeholder="Search active well or formation..."
                    className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm font-mono text-neutral-900 bg-white border border-neutral-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
                <Link
                  href="/replay"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-amber-700 to-orange-700 text-white hover:from-amber-800 hover:to-orange-800 transition-all shadow-xs shrink-0"
                >
                  <span>See Live Replay</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Footnote reassurance */}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-neutral-500 font-mono">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Strictly 1-way read-only eRTMAC feed
                </span>
                <span>•</span>
                <span>Zero outbound data leakage (Air-gapped capable)</span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-4 border-t border-neutral-200 grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <div className="text-2xl font-bold font-mono text-neutral-950">1,000+</div>
                <div className="text-[11px] text-neutral-500">Indexed Assam Wells</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-amber-700">75m</div>
                <div className="text-[11px] text-neutral-500">Proactive Lookahead</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-emerald-700">34 NPT h</div>
                <div className="text-[11px] text-neutral-500">Saved per Incident</div>
              </div>
            </div>

          </div>

          {/* Right Column: Floating Application Mockup with Landscape Glow (5 cols) */}
          <div className="lg:col-span-5 relative">
            
            {/* Scenic Assam Foothill Backdrop Gradient Container */}
            <div className="relative rounded-3xl p-3 bg-gradient-to-b from-neutral-100 to-neutral-200 border border-neutral-300/80 shadow-xl overflow-hidden">
              
              {/* Subtle Assam landscape image layer / artistic mist */}
              <div 
                className="absolute inset-0 opacity-15 bg-cover bg-center"
                style={{
                  backgroundImage: `radial-gradient(ellipse at bottom, rgba(234, 88, 12, 0.25), transparent 70%)`
                }}
              />

              {/* Floating Window Shell */}
              <div className="relative rounded-2xl bg-neutral-950 text-white border border-neutral-800 shadow-2xl overflow-hidden">
                
                {/* Window Header Bar */}
                <div className="px-4 py-3 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="text-[11px] font-mono text-neutral-400 ml-2">
                      eRTMAC :: OIL-GLK-14
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 text-[10px] font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    STREAM LIVE
                  </div>
                </div>

                {/* Window Body */}
                <div className="p-4 space-y-4 font-mono text-xs">
                  
                  {/* Bit Depth & Parameter Gauges */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                      <span className="text-[10px] text-neutral-400 uppercase block">Bit Depth (MD)</span>
                      <div className="text-xl font-bold text-white mt-0.5">2,165.4 m</div>
                      <span className="text-[10px] text-amber-400 block mt-1">Approaching Upper Tipam</span>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                      <span className="text-[10px] text-neutral-400 uppercase block">Live ROP / Torque</span>
                      <div className="text-xl font-bold text-white mt-0.5">14.8 m/h</div>
                      <span className="text-[10px] text-neutral-400 block mt-1">Torque: 11.2 kft-lb</span>
                    </div>
                  </div>

                  {/* Proactive Alert Card Overlay (Like the AI Insights card in reference image!) */}
                  <div className="relative rounded-xl p-3.5 bg-gradient-to-br from-amber-950/70 via-neutral-900 to-neutral-950 border border-amber-600/50 shadow-lg space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-[11px] text-amber-300 uppercase tracking-wide">
                          Proactive Alert Fired
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30">
                        75m Buffer Ahead
                      </span>
                    </div>

                    {/* Fact */}
                    <div className="text-[11px] text-neutral-300 leading-relaxed font-sans">
                      <strong className="text-white font-mono">Fact: </strong>
                      5 offset wells in Geleki experienced total mud loss (28 NPT hrs) at 2,240m MD.
                    </div>

                    {/* Mitigation Pill */}
                    <div className="p-2 rounded-lg bg-neutral-950/80 border border-neutral-800 text-[10px] text-neutral-300 font-sans">
                      <strong className="text-emerald-400 font-mono">Recommended: </strong>
                      Stage 35 ppb mixed-fiber LCM pill now. Cap ECD at 10.4 ppg prior to 2,190m.
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        href="/alerts"
                        className="flex-1 py-1.5 text-center rounded-lg bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-[11px] transition-colors"
                      >
                        Acknowledge & Stage Pill
                      </Link>
                      <Link
                        href="/replay"
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] transition-colors"
                      >
                        Verify Replay
                      </Link>
                    </div>
                  </div>

                  {/* Offset Evidence Indicator */}
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-neutral-500" />
                      Nearest Analog: <strong className="text-white">OIL-GLK-07</strong> (0.84 Sim)
                    </span>
                    <span className="text-[10px] text-neutral-500">WCR-GLK-07-1996/p19</span>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
