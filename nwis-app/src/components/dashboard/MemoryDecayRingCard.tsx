'use client';

import React from 'react';
import { TrendingDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const MemoryDecayRingCard: React.FC = () => {
  const decayPercentage = 88;
  const paperPercentage = 58;
  const digitizedPercentage = 24;
  const unstructuredPercentage = 18;

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (decayPercentage / 100) * circumference;

  return (
    <div className="gov-panel flex flex-col justify-between space-y-3 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wide font-mono">
            Institutional Memory Decay
          </h4>
          <span className="text-[10px] text-muted-foreground font-mono">
            Basin Archive Vulnerability Index
          </span>
        </div>
        <span className="gov-tag gov-tag-red">CRITICAL RISK</span>
      </div>

      {/* Donut Ring */}
      <div className="flex items-center justify-center py-2">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-32 h-32 -rotate-90 transform" viewBox="0 0 130 130">
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-border"
              strokeWidth="10"
            />
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="none"
              stroke="#d4351c"
              strokeWidth="10"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold font-mono text-foreground">
              {decayPercentage}%
            </span>
            <span className="text-[9px] font-mono uppercase text-muted-foreground font-bold">
              Digboi Risk
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-1 text-xs font-mono pt-1 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Paper-Only (1889–1975):</span>
          <span className="font-bold text-[#d4351c] dark:text-[#f87171]">{paperPercentage}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Unindexed TIFF Scans:</span>
          <span className="font-bold text-[#b25900] dark:text-[#fbbf24]">{unstructuredPercentage}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Vectorized &amp; Structured:</span>
          <span className="font-bold text-[#00703c] dark:text-[#34d399]">{digitizedPercentage}%</span>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="pt-2 border-t border-border flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground font-sans">
          851 records need planetary scanning.
        </span>
        <Link
          href="/decay-index"
          className="text-xs font-bold text-[#1d70b8] dark:text-[#60a5fa] hover:underline inline-flex items-center gap-1 font-mono"
        >
          <span>Decay Index</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};
