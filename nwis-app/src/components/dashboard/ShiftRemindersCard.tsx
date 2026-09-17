'use client';

import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const ShiftRemindersCard: React.FC = () => {
  const tasks = [
    {
      title: 'Upper Tipam Horizon Penetration',
      sub: 'Expected at 2,180m MD (~1.2 hrs at 14.8 m/h ROP)',
      tag: 'CRITICAL DEPTH',
      tagColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
    },
    {
      title: 'Slow Pump Rate (SPR) Check',
      sub: 'Log dynamic pressure every 50m for kick baseline',
      tag: 'ROUTINE',
      tagColor: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
    },
    {
      title: 'Active Pit LCM Pill Volume',
      sub: 'Ensure 35 bbl medium-nut-plug pill staged in Pit #2',
      tag: 'ACTION REQ',
      tagColor: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
    }
  ];

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wide">
              Shift Operations Checklist
            </h4>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
              Next 4-Hour Lookahead Watchlist
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
          Geleki Rig #04
        </span>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {tasks.map((task, idx) => (
          <div 
            key={idx}
            className="p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/60 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-start justify-between gap-2"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900 dark:text-white">
                  {task.title}
                </span>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${task.tagColor}`}>
                  {task.tag}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                {task.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px]">
        <span className="text-neutral-500 dark:text-neutral-400 font-mono">Shift Handover: 06:00 UTC</span>
        <Link
          href="/wells/well-glk-14"
          className="text-xs font-bold text-neutral-900 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1 transition-colors"
        >
          <span>Open Rig Workspace</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};
