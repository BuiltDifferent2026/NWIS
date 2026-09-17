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
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-700 dark:text-rose-400">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wide">
              Institutional Memory Decay
            </h4>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
              Basin Archive Vulnerability Index
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold">
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
              className="text-neutral-200 dark:text-neutral-800"
              strokeWidth="12"
            />
            {/* Decay Arc */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#e11d48"
              strokeWidth="12"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Central Donut Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-extrabold font-mono text-neutral-950 dark:text-white tracking-tight">
              {decayPercentage}%
            </span>
            <span className="text-[10px] font-mono uppercase text-neutral-500 dark:text-neutral-400 font-semibold">
              Digboi Risk
            </span>
          </div>
        </div>
      </div>

      {/* Legend Breakdown */}
      <div className="space-y-2 text-xs font-mono pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-600" />
            <span className="text-neutral-600 dark:text-neutral-400">Paper-Only (1889–1975)</span>
          </div>
          <span className="font-bold text-neutral-900 dark:text-white">{paperPercentage}%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
            <span className="text-neutral-600 dark:text-neutral-400">Unstructured Scanned TIFFs</span>
          </div>
          <span className="font-bold text-neutral-900 dark:text-white">{unstructuredPercentage}%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
            <span className="text-neutral-600 dark:text-neutral-400">Digitized & Verified</span>
          </div>
          <span className="font-bold text-neutral-900 dark:text-white">{digitizedPercentage}%</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px]">
        <span className="text-neutral-500 dark:text-neutral-400 font-mono">851 records at immediate risk</span>
        <Link
          href="/decay-index"
          className="text-xs font-bold text-neutral-900 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1 transition-colors"
        >
          <span>Prioritize Digitization</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};
