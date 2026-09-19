'use client';

import React from 'react';
import { Compass, AlertTriangle, ArrowRight } from 'lucide-react';
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
  const totalSpan = hazardDepthMD - startDepthMD;
  const distanceToHazard = Math.max(0, Math.round((hazardDepthMD - currentDepthMD) * 10) / 10);
  const distanceToTrigger = Math.max(0, Math.round((triggerDepthMD - currentDepthMD) * 10) / 10);

  const hoursToTrigger = rop > 0 ? distanceToTrigger / rop : 0;
  const minutesToTrigger = Math.round(hoursToTrigger * 60);
  const hoursToHazard = rop > 0 ? (distanceToHazard / rop).toFixed(1) : '0';

  const bitProgressPercent = Math.min(100, Math.max(0, ((currentDepthMD - startDepthMD) / totalSpan) * 100));

  return (
    <div className="gov-panel flex flex-col justify-between space-y-3 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wide font-mono">
            Hazard Proximity Lookahead
          </h4>
          <span className="text-[10px] text-muted-foreground font-mono">
            OIL-GLK-14 · Live Stream
          </span>
        </div>
        <span className="gov-tag gov-tag-green">ACTIVE STREAM</span>
      </div>

      {/* Main Telemetry Readout */}
      <div className="bg-secondary/40 border border-border p-3 space-y-2 font-mono">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-muted-foreground">
              Distance to {hazardType}
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-foreground">
                {distanceToHazard.toFixed(1)}m
              </span>
              <span className="text-xs text-[#b25900] dark:text-[#fbbf24]">
                (~{hoursToHazard} hrs @ {rop} m/h)
              </span>
            </div>
          </div>

          <span className="gov-tag gov-tag-amber text-[10px]">
            TRIGGER IN {distanceToTrigger.toFixed(1)}m ({minutesToTrigger}m)
          </span>
        </div>

        {/* Linear Progress */}
        <div className="space-y-1 pt-1">
          <div className="relative h-3 w-full bg-border overflow-hidden rounded-xs">
            <div
              style={{ width: `${bitProgressPercent}%` }}
              className="h-full bg-[#1d70b8] transition-all duration-300"
            />
          </div>
          <div className="flex justify-between text-[9px] text-muted-foreground">
            <span>2,100m (Start)</span>
            <span className="text-[#b25900]">2,180m (Lookahead Trigger)</span>
            <span className="text-[#d4351c]">2,240m (Thief Zone)</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
        <span className="text-[11px] text-muted-foreground font-sans">
          Recommended: Pre-stage 35 ppb LCM pill.
        </span>
        <Link
          href="/operations"
          className="text-xs font-bold text-[#1d70b8] dark:text-[#60a5fa] hover:underline inline-flex items-center gap-1 font-mono"
        >
          <span>Cockpit</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};
