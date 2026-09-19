'use client';

import React from 'react';
import { Compass, AlertTriangle, Clock, ArrowRight, Gauge, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

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
  const startDepthMD = 2100.0;
  const totalSpan = hazardDepthMD - startDepthMD; // 140m
  const distanceToHazard = Math.max(0, Math.round((hazardDepthMD - currentDepthMD) * 10) / 10);
  const distanceToTrigger = Math.max(0, Math.round((triggerDepthMD - currentDepthMD) * 10) / 10);

  // Time calculations based on current ROP
  const hoursToTrigger = rop > 0 ? distanceToTrigger / rop : 0;
  const minutesToTrigger = Math.round(hoursToTrigger * 60);
  const hoursToHazard = rop > 0 ? (distanceToHazard / rop).toFixed(1) : '0';

  // Percentage calculations for linear corridor
  const bitProgressPercent = Math.min(100, Math.max(0, ((currentDepthMD - startDepthMD) / totalSpan) * 100));
  const triggerPercent = Math.min(100, Math.max(0, ((triggerDepthMD - startDepthMD) / totalSpan) * 100));

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
              Live Corridor Tracker • eRTMAC Stream
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
          ACTIVE STREAM
        </div>
      </div>

      {/* Main Telemetry Readout */}
      <div className="bg-neutral-50 dark:bg-[#0c0f17] border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl p-3.5 space-y-3">
        
        {/* Top Metric Header */}
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold">
              Distance to {hazardType}
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl font-extrabold font-mono text-neutral-950 dark:text-white tracking-tight">
                {distanceToHazard.toFixed(1)}m
              </span>
              <span className="text-xs font-mono font-semibold text-rose-600 dark:text-rose-400">
                (~{hoursToHazard} hrs @ {rop} m/h)
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-3 h-3" />
              TRIGGER IN {distanceToTrigger.toFixed(1)}m ({minutesToTrigger}m)
            </span>
          </div>
        </div>

        {/* Precision Industrial Calibrated Corridor Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="relative h-5 w-full rounded-lg bg-neutral-200 dark:bg-neutral-800 overflow-hidden border border-neutral-300/80 dark:border-neutral-700/80 flex items-center">
            
            {/* Safe / Drilled Corridor (Green) */}
            <div
              style={{ width: `${bitProgressPercent}%` }}
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 transition-all duration-500"
              title={`Drilled to ${currentDepthMD}m MD`}
            />

            {/* Caution Window (Amber) */}
            <div
              style={{ width: `${Math.max(0, triggerPercent - bitProgressPercent)}%` }}
              className="h-full bg-amber-500/80 dark:bg-amber-500/90"
              title={`Advisory Buffer: ${distanceToTrigger.toFixed(1)}m remaining`}
            />

            {/* Critical Hazard Loss Horizon (Rose Hazard Stripes) */}
            <div
              className="h-full bg-rose-600/85 relative"
              style={{
                width: `${100 - triggerPercent}%`,
                backgroundImage: 'repeating-linear-gradient(45deg, rgba(225,29,72,0.9), rgba(225,29,72,0.9) 8px, rgba(190,18,60,0.9) 8px, rgba(190,18,60,0.9) 16px)'
              }}
              title={`Severe Loss Horizon from ${triggerDepthMD}m to ${hazardDepthMD}m MD`}
            />

            {/* Bit Position Cursor Indicator */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white dark:bg-neutral-100 shadow-[0_0_8px_rgba(255,255,255,0.9)] z-10"
              style={{ left: `calc(${bitProgressPercent}% - 2px)` }}
            >
              <div className="absolute -top-1 -left-1.5 w-4 h-2 bg-neutral-950 dark:bg-white rounded-xs border border-white dark:border-neutral-900" />
            </div>

            {/* Trigger Tripwire Marker */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-amber-300 dark:bg-amber-200 z-10 border-r border-dashed border-amber-900"
              style={{ left: `${triggerPercent}%` }}
            />
          </div>

          {/* Depth Scale Markings */}
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
            <span>{startDepthMD}m MD</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">Bit: {currentDepthMD}m</span>
            <span className="text-amber-700 dark:text-amber-400 font-bold">Trigger: {triggerDepthMD}m</span>
            <span className="text-rose-700 dark:text-rose-400 font-bold">Loss: {hazardDepthMD}m</span>
          </div>
        </div>

        {/* Mini Corridor Telemetry Chips */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="px-2 py-1.5 rounded-lg bg-white dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono">
            <span className="text-neutral-500 dark:text-neutral-400 block text-[9px]">FORMATION</span>
            <span className="font-bold text-neutral-900 dark:text-neutral-200 truncate block">{formation}</span>
          </div>
          <div className="px-2 py-1.5 rounded-lg bg-white dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono">
            <span className="text-neutral-500 dark:text-neutral-400 block text-[9px]">CURRENT ROP</span>
            <span className="font-bold text-neutral-900 dark:text-neutral-200 block">{rop} m/hr</span>
          </div>
          <div className="px-2 py-1.5 rounded-lg bg-white dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono">
            <span className="text-neutral-500 dark:text-neutral-400 block text-[9px]">OFFSET LOSS RISK</span>
            <span className="font-bold text-rose-600 dark:text-rose-400 block">62.5% (5/8 Wells)</span>
          </div>
        </div>

      </div>

      {/* Footer Parameters */}
      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>Corridor ID: GLK-COR-03</span>
        </div>
        <Link 
          href="/operations"
          className="text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 font-bold text-xs inline-flex items-center gap-1 transition-colors"
        >
          <span>Correlate Analog Offsets</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

    </div>
  );
};

