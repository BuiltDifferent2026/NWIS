'use client';

import React from 'react';
import { TrendingDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const MemoryDecayRingCard: React.FC = () => {
  // Digboi Field (highest risk archive)
  const decayPercentage = 88;
  const paperPercentage = 58;
  const digitizedPercentage = 24;
  const unstructuredPercentage = 18;

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (decayPercentage / 100) * circumference;

  return (
    <div className="rounded-none border border-[#E2E5E8] bg-white p-5 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-none bg-[#FDF2F2] border border-[#E05252]/40 flex items-center justify-center text-[#ED1C24]">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#252B33] dark:text-white uppercase tracking-wide">
              Institutional Memory Decay
            </h4>
            <span className="text-[10px] text-[#6B7280] dark:text-neutral-400 font-mono">
              Basin Archive Vulnerability Index
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-none bg-[#ED1C24] text-white border border-transparent font-bold">
          CRITICAL PRIORITY
        </span>
      </div>

      {/* Donut Ring */}
      <div className="flex items-center justify-center py-2">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 140 140">
            {/* Background Circle */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-[#E2E5E8] dark:text-[#364356]"
              strokeWidth="12"
            />
            {/* Decay Arc */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#ED1C24"
              strokeWidth="12"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="butt"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Central Donut Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-extrabold font-mono text-[#252B33] dark:text-white tracking-tight">
              {decayPercentage}%
            </span>
            <span className="text-[10px] font-mono uppercase text-[#6B7280] dark:text-neutral-400 font-semibold">
              Digboi Risk
            </span>
          </div>
        </div>
      </div>

      {/* Legend Breakdown */}
      <div className="space-y-2 text-xs font-mono pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-none bg-[#ED1C24]" />
            <span className="text-[#6B7280]">Paper-Only (1889–1975)</span>
          </div>
          <span className="font-bold text-[#252B33] dark:text-white">{paperPercentage}%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-none bg-[#F2B84B]" />
            <span className="text-[#6B7280]">Unstructured Scanned TIFFs</span>
          </div>
          <span className="font-bold text-[#252B33] dark:text-white">{unstructuredPercentage}%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-none bg-[#3FAE68]" />
            <span className="text-[#6B7280]">Digitized &amp; Verified</span>
          </div>
          <span className="font-bold text-[#252B33] dark:text-white">{digitizedPercentage}%</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-[#E2E5E8] flex items-center justify-between text-[11px]">
        <span className="text-[#6B7280] font-mono">851 records at immediate risk</span>
        <Link
          href="/decay-index"
          className="text-xs font-bold text-[#26A69A] hover:text-[#3FC3B6] flex items-center gap-1 transition-colors"
        >
          <span>Prioritize Digitization</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};
