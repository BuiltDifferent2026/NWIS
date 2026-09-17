'use client';

import React from 'react';
import { Compass, ShieldCheck } from 'lucide-react';

interface HazardProximityGaugeProps {
  currentDepthMD?: number;
  triggerDepthMD?: number;
  hazardDepthMD?: number;
  rop?: number;
  formation?: string;
  hazardType?: string;
}

export const HazardProximityGauge: React.FC<HazardProximityGaugeProps> = ({
  currentDepthMD = 2165.4,
  triggerDepthMD = 2180.0,
  hazardDepthMD = 2240.0,
  rop = 14.8,
  formation = 'Upper Tipam Sandstone',
  hazardType = 'Lost Circulation Horizon'
}) => {
  const distanceToHazard = Math.max(0, Math.round((hazardDepthMD - currentDepthMD) * 10) / 10);
  const distanceToTrigger = Math.max(0, Math.round((triggerDepthMD - currentDepthMD) * 10) / 10);

  // Gauge percentage calculation (0% at 2100m, 100% at 2240m)
  const span = hazardDepthMD - 2100;
  const progress = Math.min(1, Math.max(0, (currentDepthMD - 2100) / span));

  // SVG Arc calculation for semi-circle
  const radius = 70;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-800 dark:text-amber-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-950 dark:text-white uppercase tracking-wide">
              Hazard Proximity Lookahead
            </h4>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
              Live Corridor Tracker
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
          ACTIVE STREAM
        </div>
      </div>

      {/* Semi-Circular SVG Arc Gauge */}
      <div className="relative flex flex-col items-center justify-center pt-2">
        <div className="relative w-48 h-26 overflow-hidden flex items-end justify-center">
          <svg className="w-48 h-48 -rotate-180 transform" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-neutral-200 dark:text-neutral-800"
              strokeWidth="12"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset="0"
              strokeLinecap="round"
            />
            {/* Progress Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#ea580c"
              strokeWidth="12"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Central Digital Readout */}
          <div className="absolute bottom-1 flex flex-col items-center text-center">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-950 dark:text-white tracking-tight">
              {distanceToHazard.toFixed(1)}m
            </span>
            <span className="text-[10px] font-mono uppercase text-neutral-500 dark:text-neutral-400 font-semibold tracking-wider">
              To Loss Horizon
            </span>
          </div>
        </div>

        <div className="w-full flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400 px-4 pt-1">
          <span>2,100m MD</span>
          <span className="text-amber-800 dark:text-amber-400 font-bold">Trigger in {distanceToTrigger.toFixed(1)}m</span>
          <span>{hazardDepthMD}m MD</span>
        </div>
      </div>

      {/* Footer Parameters */}
      <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] font-mono">
        <div className="text-neutral-600 dark:text-neutral-400">
          Target: <strong className="text-neutral-900 dark:text-neutral-200">{formation}</strong>
        </div>
        <div className="text-neutral-600 dark:text-neutral-400">
          Advance: <strong className="text-neutral-900 dark:text-neutral-200">{rop} m/hr</strong>
        </div>
      </div>

    </div>
  );
};
