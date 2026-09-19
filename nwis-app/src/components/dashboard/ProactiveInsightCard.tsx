'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ShieldAlert, Check, MoreHorizontal, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/app-store';

export const ProactiveInsightCard: React.FC = () => {
  const { applyMitigation, acknowledgeAlert } = useAppStore();
  const [isDone, setIsDone] = useState(false);
  const [actionLabel, setActionLabel] = useState<string | null>(null);

  const handleStageLCM = () => {
    applyMitigation('alert-glk-14-loss', 'LCM pill staged in active pit based on proactive insight.');
    setIsDone(true);
    setActionLabel('LCM Pill Staged in Pit');
  };

  const handleAcknowledge = () => {
    acknowledgeAlert('alert-glk-14-loss', 'Acknowledged by operations superintendent.');
    setIsDone(true);
    setActionLabel('Advisory Acknowledged');
  };

  return (
    <div className="rounded-2xl border border-amber-200 dark:border-neutral-800 bg-amber-50/40 dark:bg-neutral-950 text-neutral-900 dark:text-white p-5 shadow-xs dark:shadow-lg flex flex-col justify-between space-y-4 relative overflow-hidden transition-colors">
      
      {/* Subtle Gradient Atmosphere Glow */}
      <div 
        className="absolute top-0 right-0 w-48 h-48 pointer-events-none opacity-20 dark:opacity-25"
        style={{
          background: 'radial-gradient(circle at top right, rgba(234, 88, 12, 0.35), transparent 70%)'
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-950 dark:text-white uppercase tracking-wide">
              AI Hazard Insight
            </h4>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
              eRTMAC Lookahead Watcher
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-bold">
          LOOKAHEAD: 75m
        </span>
      </div>

      {/* Insight Speech / Callout Bubble */}
      <div className="relative z-10 p-3.5 rounded-xl bg-white dark:bg-neutral-900/90 border border-amber-200/80 dark:border-neutral-800 text-xs font-sans text-neutral-700 dark:text-neutral-300 leading-relaxed space-y-1.5 shadow-2xs">
        <div className="font-bold text-neutral-950 dark:text-white text-[11px] font-mono flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>OIL-GLK-14 @ 2,165m MD</span>
        </div>
        <p>
          Approaching Upper Tipam micro-fracture loss horizon. <strong className="text-neutral-950 dark:text-white">5 of 8 offset wells</strong> lost circulation between 2,180m and 2,350m MD. Recommend staging 35 ppb LCM pill prior to 2,190m.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 space-y-2 pt-1 font-mono text-xs">
        {isDone ? (
          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-center font-bold flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{actionLabel}</span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleAcknowledge}
              className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white font-bold text-xs border border-neutral-300 dark:border-neutral-800 transition-colors shadow-2xs cursor-pointer"
            >
              Acknowledge
            </button>
            <button
              type="button"
              onClick={handleStageLCM}
              className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs transition-colors shadow-xs cursor-pointer"
            >
              Stage LCM Pill
            </button>
          </div>
        )}

        <div className="flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400 pt-1">
          <span>Source: WCR-GLK-07-1996/p19</span>
          <Link href="/alerts" className="text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 font-bold">
            <span>Inspect Evidence</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

    </div>
  );
};
