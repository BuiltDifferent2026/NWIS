'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const ShiftRemindersCard: React.FC = () => {
  const tasks = [
    {
      title: 'Upper Tipam Horizon Penetration',
      sub: 'Expected at 2,180m MD (~1.2 hrs at 14.8 m/h ROP)',
      tag: 'CRITICAL DEPTH',
      tagClass: 'gov-tag-amber'
    },
    {
      title: 'Slow Pump Rate (SPR) Check',
      sub: 'Log dynamic pressure every 50m for kick baseline',
      tag: 'ROUTINE',
      tagClass: 'gov-tag-grey'
    },
    {
      title: 'Active Pit LCM Pill Volume',
      sub: 'Ensure 35 bbl medium-nut-plug pill staged in Pit #2',
      tag: 'ACTION REQ',
      tagClass: 'gov-tag-red'
    }
  ];

  return (
    <div className="gov-panel flex flex-col justify-between space-y-3 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wide font-mono">
            Shift Operations Checklist
          </h4>
          <span className="text-[10px] text-muted-foreground font-mono">
            Next 4-Hour Lookahead Watchlist
          </span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          Geleki Rig #04
        </span>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {tasks.map((task, idx) => (
          <div 
            key={idx}
            className="p-2.5 bg-secondary/30 border border-border space-y-0.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-foreground">
                {task.title}
              </span>
              <span className={`gov-tag ${task.tagClass} text-[9px]`}>
                {task.tag}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono">
              {task.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] font-mono">
        <span className="text-muted-foreground">Handover: 06:00 UTC</span>
        <Link
          href="/wells/well-glk-14"
          className="text-xs font-bold text-[#1d70b8] dark:text-[#60a5fa] hover:underline flex items-center gap-1"
        >
          <span>Rig Workspace</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};
