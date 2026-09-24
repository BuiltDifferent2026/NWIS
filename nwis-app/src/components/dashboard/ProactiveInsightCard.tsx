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
    <div className="rounded-none border border-[#E2E5E8] bg-white text-[#252B33] dark:text-white p-5 shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden transition-colors">
      
      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-none bg-[#D9F2EE] text-[#26A69A] border border-[#3FC3B6]/40 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" strokeWidth={1.5} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#252B33] dark:text-white uppercase tracking-wide">
              Subsurface Lookahead
            </h4>
            <span className="text-[10px] text-[#6B7280] dark:text-neutral-400 font-mono">
              eRTMAC Lookahead Watcher
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-none bg-[#D9F2EE] text-[#26A69A] border border-[#3FC3B6]/40 font-bold">
          LOOKAHEAD: 75m
        </span>
      </div>

      {/* Insight Speech / Callout Bubble */}
      <div className="relative z-10 p-3.5 rounded-none bg-[#F5F7F8] border border-[#E2E5E8] text-xs font-sans text-[#252B33] leading-relaxed space-y-1.5 shadow-2xs">
        <div className="font-bold text-[#252B33] dark:text-white text-[11px] font-mono flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-[#ED1C24]" strokeWidth={1.5} />
          <span>OIL-GLK-14 @ 2,165m MD</span>
        </div>
        <p>
          Approaching Upper Tipam micro-fracture loss horizon. <strong className="text-[#252B33] dark:text-white">5 of 8 offset wells</strong> lost circulation between 2,180m and 2,350m MD. Recommend staging 35 ppb LCM pill prior to 2,190m.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 space-y-2 pt-1 font-mono text-xs">
        {isDone ? (
          <div className="p-2.5 rounded-none bg-[#3FAE68]/15 border border-[#3FAE68]/40 text-[#3FAE68] text-center font-bold flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4 text-[#3FAE68]" />
            <span>{actionLabel}</span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleAcknowledge}
              className="flex-1 py-2 px-3 rounded-none bg-white hover:bg-[#F5F7F8] text-[#252B33] font-bold text-xs border border-[#E2E5E8] transition-colors shadow-2xs cursor-pointer"
            >
              Acknowledge
            </button>
            <button
              type="button"
              onClick={handleStageLCM}
              className="flex-1 py-2 px-3 rounded-none bg-[#3FC3B6] hover:bg-[#26A69A] text-[#252B33] hover:text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
            >
              Stage LCM Pill
            </button>
          </div>
        )}

        <div className="flex items-center justify-between text-[10px] text-[#6B7280] dark:text-neutral-400 pt-1">
          <span>Source: WCR-GLK-07-1996/p19</span>
          <Link href="/alerts" className="text-[#26A69A] hover:text-[#3FC3B6] hover:underline flex items-center gap-1 font-bold">
            <span>Inspect Evidence</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

    </div>
  );
};
