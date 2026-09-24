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
      tagColor: 'bg-[#FDF2F2] text-[#ED1C24] border-[#E05252]/40'
    },
    {
      title: 'Slow Pump Rate (SPR) Check',
      sub: 'Log dynamic pressure every 50m for kick baseline',
      tag: 'ROUTINE',
      tagColor: 'bg-[#F5F7F8] text-[#6B7280] border-[#E2E5E8]'
    },
    {
      title: 'Active Pit LCM Pill Volume',
      sub: 'Ensure 35 bbl medium-nut-plug pill staged in Pit #2',
      tag: 'ACTION REQ',
      tagColor: 'bg-[#FDF2F2] text-[#ED1C24] border-[#E05252]/40'
    }
  ];

  return (
    <div className="rounded-none border border-[#E2E5E8] bg-white p-5 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-none bg-[#34435A] text-white flex items-center justify-center">
            <Clock className="w-4 h-4 text-[#3FC3B6]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#252B33] dark:text-white uppercase tracking-wide">
              Shift Operations Checklist
            </h4>
            <span className="text-[10px] text-[#6B7280] dark:text-neutral-400 font-mono">
              Next 4-Hour Lookahead Watchlist
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono text-[#6B7280] dark:text-neutral-400">
            Geleki Rig #04
        </span>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {tasks.map((task, idx) => (
          <div 
            key={idx}
            className="p-3 rounded-none border border-[#E2E5E8] bg-[#F5F7F8] transition-colors flex items-start justify-between gap-2"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#252B33] dark:text-white">
                  {task.title}
                </span>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-none border ${task.tagColor}`}>
                  {task.tag}
                </span>
              </div>
              <p className="text-[11px] text-[#6B7280] font-mono">
                {task.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-[#E2E5E8] dark:border-neutral-800 flex items-center justify-between text-[11px]">
        <span className="text-[#6B7280] font-mono">Shift Handover: 06:00 UTC</span>
        <Link
          href="/wells/well-glk-14"
          className="text-xs font-bold text-[#26A69A] hover:text-[#3FC3B6] flex items-center gap-1 transition-colors"
        >
          <span>Open Rig Workspace</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};
