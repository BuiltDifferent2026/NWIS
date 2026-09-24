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
    <div className="rounded-none border border-[#E2E5E8] bg-white p-5 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-none bg-[#D9F2EE] border border-[#3FC3B6]/40 flex items-center justify-center text-[#26A69A]">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#252B33] dark:text-white uppercase tracking-wide">
              Hazard Proximity Lookahead
            </h4>
            <span className="text-[10px] text-[#6B7280] dark:text-neutral-400 font-mono">
              Live Corridor Tracker • eRTMAC Stream
            </span>
          </div>
        </div>
      </div>

      {/* Main Telemetry Readout */}
      <div className="bg-[#F5F7F8] border border-[#E2E5E8] rounded-none p-3.5 space-y-3">
        
        {/* Top Metric Header */}
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] dark:text-neutral-400 font-semibold">
              Distance to {hazardType}
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl font-extrabold font-mono text-[#252B33] dark:text-white tracking-tight">
                {distanceToHazard.toFixed(1)}m
              </span>
              <span className="text-xs font-mono font-semibold text-[#ED1C24]">
                (~{hoursToHazard} hrs @ {rop} m/h)
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-none bg-[#FDF2F2] text-[#ED1C24] border border-[#E05252]/40">
              <AlertTriangle className="w-3 h-3" />
              TRIGGER IN {distanceToTrigger.toFixed(1)}m ({minutesToTrigger}m)
            </span>
          </div>
        </div>

        {/* Precision Industrial Calibrated Corridor Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="relative h-5 w-full rounded-none bg-[#E2E5E8] dark:bg-neutral-800 overflow-hidden border border-[#E2E5E8] dark:border-neutral-700/80 flex items-center">
            
            {/* Safe / Drilled Corridor (Success Green) */}
            <div
              style={{ width: `${bitProgressPercent}%` }}
              className="h-full bg-[#3FAE68] transition-all duration-500"
              title={`Drilled to ${currentDepthMD}m MD`}
            />

            {/* Caution Window (Warning Yellow) */}
            <div
              style={{ width: `${Math.max(0, triggerPercent - bitProgressPercent)}%` }}
              className="h-full bg-[#F2B84B]"
              title={`Advisory Buffer: ${distanceToTrigger.toFixed(1)}m remaining`}
            />

            {/* Critical Hazard Loss Horizon (Brand Red Stripes) */}
            <div
              className="h-full bg-[#ED1C24] relative"
              style={{
                width: `${100 - triggerPercent}%`,
                backgroundImage: 'repeating-linear-gradient(45deg, #ED1C24, #ED1C24 8px, #C9141B 8px, #C9141B 16px)'
              }}
              title={`Severe Loss Horizon from ${triggerDepthMD}m to ${hazardDepthMD}m MD`}
            />

            {/* Bit Position Cursor Indicator */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white dark:bg-neutral-100 shadow-[0_0_8px_rgba(255,255,255,0.9)] z-10"
              style={{ left: `calc(${bitProgressPercent}% - 2px)` }}
            >
              <div className="absolute -top-1 -left-1.5 w-4 h-2 bg-[#222222] dark:bg-white rounded-none border border-white dark:border-neutral-900" />
            </div>

            {/* Trigger Tripwire Marker */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-[#F2B84B] z-10 border-r border-dashed border-[#222222]"
              style={{ left: `${triggerPercent}%` }}
            />
          </div>

          {/* Depth Scale Markings */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#6B7280]">
            <span>{startDepthMD}m MD</span>
            <span className="text-[#3FAE68] font-bold">Bit: {currentDepthMD}m</span>
            <span className="text-[#F2B84B] font-bold">Trigger: {triggerDepthMD}m</span>
            <span className="text-[#ED1C24] font-bold">Loss: {hazardDepthMD}m</span>
          </div>
        </div>

        {/* Mini Corridor Telemetry Chips */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="px-2 py-1.5 rounded-none bg-white border border-[#E2E5E8] text-[10px] font-mono">
            <span className="text-[#6B7280] block text-[9px]">FORMATION</span>
            <span className="font-bold text-[#252B33] dark:text-neutral-200 truncate block">{formation}</span>
          </div>
          <div className="px-2 py-1.5 rounded-none bg-white border border-[#E2E5E8] text-[10px] font-mono">
            <span className="text-[#6B7280] block text-[9px]">CURRENT ROP</span>
            <span className="font-bold text-[#252B33] dark:text-neutral-200 block">{rop} m/hr</span>
          </div>
          <div className="px-2 py-1.5 rounded-none bg-white border border-[#E2E5E8] text-[10px] font-mono">
            <span className="text-[#6B7280] block text-[9px]">OFFSET LOSS RISK</span>
            <span className="font-bold text-[#ED1C24] block">62.5% (5/8 Wells)</span>
          </div>
        </div>

      </div>

      {/* Footer Parameters */}
      <div className="pt-2 border-t border-[#E2E5E8] dark:border-neutral-800 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-[#6B7280] text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3FC3B6]" />
          <span>Corridor ID: GLK-COR-03</span>
        </div>
        <Link 
          href="/operations"
          className="text-[#26A69A] hover:text-[#3FC3B6] font-bold text-xs inline-flex items-center gap-1 transition-colors"
        >
          <span>Correlate Analog Offsets</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

    </div>
  );
};

