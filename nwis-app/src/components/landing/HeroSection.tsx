'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle2, 
  Activity 
} from 'lucide-react';
import { useAppStore } from '@/store/app-store';

export const HeroSection: React.FC = () => {
  const { setRole } = useAppStore();

  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#090b0f] border-b border-neutral-200 dark:border-neutral-800 pt-12 pb-16 lg:py-24 transition-colors">
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

      {/* Subtle Side Cross-Hatch Rulers (Like the reference blueprint margins) */}
      <div className="absolute top-0 bottom-0 left-0 w-8 border-r border-neutral-200/60 dark:border-neutral-800/60 hidden xl:block bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.02),rgba(0,0,0,0.02)_4px,transparent_4px,transparent_8px)] dark:bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.02),rgba(255,255,255,0.02)_4px,transparent_4px,transparent_8px)]" />
      <div className="absolute top-0 bottom-0 right-0 w-8 border-l border-neutral-200/60 dark:border-neutral-800/60 hidden xl:block bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.02),rgba(0,0,0,0.02)_4px,transparent_4px,transparent_8px)] dark:bg-[repeating-linear-gradient(-45deg,rgba(255,255,255,0.02),rgba(255,255,255,0.02)_4px,transparent_4px,transparent_8px)]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-6">
          
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
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-extrabold rounded-xl bg-gradient-to-r from-amber-700 via-amber-600 to-orange-700 text-white hover:from-amber-800 hover:to-orange-800 transition-all shadow-md shadow-amber-900/20 hover:shadow-lg shrink-0"
              >
                <Activity className="w-4 h-4 text-amber-200" />
                <span>Launch Live Demo Console</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/replay"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#12151c] text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-2xs"
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
                  className="p-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-amber-500 text-center font-bold text-neutral-900 dark:text-white transition-colors hover:shadow-xs"
                >
                  Operations Mgr
                </Link>
                <Link
                  href="/wells/well-glk-14"
                  onClick={() => setRole('field_engineer')}
                  className="p-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-amber-500 text-center font-bold text-neutral-900 dark:text-white transition-colors hover:shadow-xs"
                >
                  Rig Engineer
                </Link>
                <Link
                  href="/admin/ingestion"
                  onClick={() => setRole('admin')}
                  className="p-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-amber-500 text-center font-bold text-neutral-900 dark:text-white transition-colors hover:shadow-xs"
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

          {/* Quick Metrics Bar */}
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-3 gap-6 sm:gap-12 max-w-lg mx-auto w-full">
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950 dark:text-white">1,000+</div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">Indexed Assam Wells</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-700 dark:text-amber-400">75m</div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">Proactive Lookahead</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-700 dark:text-emerald-400">34 NPT h</div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">Saved per Incident</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
