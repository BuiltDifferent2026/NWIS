'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, Check, ArrowRight } from 'lucide-react';
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
    <div className="gov-panel flex flex-col justify-between space-y-3 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wide font-mono">
            Subsurface Lookahead Advisory
          </h4>
          <span className="text-[10px] text-muted-foreground font-mono">
            eRTMAC Corridor Watcher
          </span>
        </div>
        <span className="gov-tag gov-tag-amber">LOOKAHEAD: 75m</span>
      </div>

      {/* Insight Callout */}
      <div className="gov-callout gov-callout-risk text-xs space-y-1">
        <div className="font-bold text-foreground font-mono text-[11px] flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-[#b25900] dark:text-[#fcd34d]" />
          <span>OIL-GLK-14 @ 2,165m MD</span>
        </div>
        <p className="text-foreground leading-relaxed font-sans">
          Approaching Upper Tipam micro-fracture loss horizon. <strong>5 of 8 offset wells</strong> lost circulation between 2,180m and 2,350m MD. Recommend staging 35 ppb LCM pill prior to 2,190m.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1 font-mono text-xs">
        {isDone ? (
          <div className="p-2 bg-[#ebf7f0] dark:bg-[#101c1f] border border-[#a4ddbe] text-[#005a30] dark:text-[#6ee7b7] text-center font-bold flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4 text-[#00703c] dark:text-[#34d399]" />
            <span>{actionLabel}</span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleAcknowledge}
              className="gov-button-secondary text-xs py-1 px-2.5 flex-1"
            >
              Acknowledge
            </button>
            <button
              type="button"
              onClick={handleStageLCM}
              className="gov-button text-xs py-1 px-2.5 flex-1"
            >
              Stage LCM Pill
            </button>
          </div>
        )}

        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border">
          <span>Source: WCR-GLK-07-1996/p19</span>
          <Link href="/alerts" className="text-[#1d70b8] dark:text-[#60a5fa] hover:underline flex items-center gap-1 font-bold">
            <span>Inspect Evidence</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

    </div>
  );
};
