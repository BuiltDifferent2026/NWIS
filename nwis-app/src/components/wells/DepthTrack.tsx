'use client';

import React, { useState } from 'react';
import { Well, FormationTop } from '../../data/wells';
import { FORMATIONS, getFormationById } from '../../data/formations';
import { getEventsByWell, DrillingEvent, EVENT_TYPE_COLORS } from '../../data/events';
import { RISK_CORRIDORS, RiskCorridor } from '../../data/risk-corridors';
import { AlertTriangle, ShieldAlert, ArrowDown, ChevronRight, Info } from 'lucide-react';

interface DepthTrackProps {
  well: Well;
  currentDepthMD?: number;
  highlightCorridors?: boolean;
  onEventClick?: (event: DrillingEvent) => void;
  maxDepthLimit?: number;
}

export const DepthTrack: React.FC<DepthTrackProps> = ({
  well,
  currentDepthMD,
  highlightCorridors = true,
  onEventClick,
  maxDepthLimit
}) => {
  const [hoveredEvent, setHoveredEvent] = useState<DrillingEvent | null>(null);
  const [hoveredCorridor, setHoveredCorridor] = useState<RiskCorridor | null>(null);

  const totalDepth = maxDepthLimit || well.totalDepthMD || 4200;
  const events = getEventsByWell(well.id);
  const fieldCorridors = RISK_CORRIDORS.filter(
    (c) => c.field.toLowerCase() === well.field.toLowerCase()
  );

  // Compute intervals between tops
  const intervals = well.formationTops.map((top, idx) => {
    const nextTop = well.formationTops[idx + 1];
    const endDepth = nextTop ? nextTop.depthMD : totalDepth;
    const formation = getFormationById(top.formationId);
    return {
      top,
      startDepth: top.depthMD,
      endDepth,
      thickness: endDepth - top.depthMD,
      formation,
      topPercent: (top.depthMD / totalDepth) * 100,
      heightPercent: ((endDepth - top.depthMD) / totalDepth) * 100,
    };
  });

  return (
    <div className="relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-4.5 flex flex-col h-full shadow-xs">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            Stratigraphic Depth Track
          </span>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
            {well.name} ({well.field}) • TD: {totalDepth}m MD
          </p>
        </div>
        {currentDepthMD !== undefined && (
          <div className="text-right">
            <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 uppercase font-bold">Bit Depth</span>
            <div className="text-xs font-mono font-extrabold text-neutral-950 dark:text-white flex items-center justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              {currentDepthMD.toFixed(1)}m MD
            </div>
          </div>
        )}
      </div>

      {/* Main Track Viewport */}
      <div className="relative mt-4 flex-1 min-h-[520px] flex gap-2 overflow-hidden select-none">
        {/* Depth Scale Column */}
        <div className="w-14 relative border-r border-neutral-200 dark:border-neutral-800 flex flex-col justify-between py-1 text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
          {[0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000].map((depth) => {
            if (depth > totalDepth) return null;
            const topPct = (depth / totalDepth) * 100;
            return (
              <div
                key={depth}
                style={{ top: `${topPct}%` }}
                className="absolute right-2 -translate-y-1/2 flex items-center gap-1"
              >
                <span>{depth}m</span>
                <span className="w-1.5 h-px bg-neutral-300 dark:bg-neutral-700" />
              </div>
            );
          })}
        </div>

        {/* Stratigraphic Column */}
        <div className="relative flex-1 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-50 dark:bg-[#0d1017]">
          {/* Formations Bands */}
          {intervals.map((interval, i) => {
            const color = interval.formation?.color ?? '#475569';
            return (
              <div
                key={interval.top.formationId + i}
                style={{
                  top: `${interval.topPercent}%`,
                  height: `${interval.heightPercent}%`,
                  backgroundColor: `${color}18`,
                  borderTop: `1px solid ${color}55`,
                }}
                className="absolute inset-x-0 px-3 py-1.5 overflow-hidden transition-colors hover:brightness-125 group cursor-pointer"
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span
                    style={{ color }}
                    className="font-bold tracking-tight truncate flex items-center gap-1.5"
                  >
                    <span
                      style={{ backgroundColor: color }}
                      className="w-2 h-2 rounded-full inline-block shrink-0"
                    />
                    {interval.top.formationName}
                  </span>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
                    {interval.startDepth}m – {interval.endDepth}m
                  </span>
                </div>
                <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono italic mt-0.5 truncate">
                  {interval.formation?.description ?? 'Assam basin lithology'}
                </div>
              </div>
            );
          })}

          {/* Risk Corridors Overlay (Hatched Hazard Zones) */}
          {highlightCorridors &&
            fieldCorridors.map((rc) => {
              const topPct = (rc.depthRange[0] / totalDepth) * 100;
              const heightPct = ((rc.depthRange[1] - rc.depthRange[0]) / totalDepth) * 100;
              return (
                <div
                  key={rc.id}
                  onMouseEnter={() => setHoveredCorridor(rc)}
                  onMouseLeave={() => setHoveredCorridor(null)}
                  style={{
                    top: `${topPct}%`,
                    height: `${heightPct}%`,
                  }}
                  className="absolute inset-x-0 bg-rose-500/10 border-y-2 border-rose-500/40 pointer-events-auto z-10 cursor-pointer flex items-center justify-between px-3 hover:bg-rose-500/20 transition"
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-rose-700 dark:text-rose-400 uppercase bg-white/90 dark:bg-rose-950/80 px-2 py-0.5 rounded border border-rose-300 dark:border-rose-700">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 animate-pulse" />
                    <span>CORRIDOR: {rc.eventType.replace('_', ' ')} ({rc.riskScore}% RISK)</span>
                  </div>
                  <span className="text-[10px] font-mono text-rose-700 dark:text-rose-300 font-bold">
                    {rc.depthRange[0]}m – {rc.depthRange[1]}m MD
                  </span>
                </div>
              );
            })}

          {/* Historical Incident Markers */}
          {events.map((evt) => {
            const topPct = (evt.depthMD / totalDepth) * 100;
            const markerColor = EVENT_TYPE_COLORS[evt.eventType] || '#EF4444';
            return (
              <div
                key={evt.id}
                onMouseEnter={() => setHoveredEvent(evt)}
                onMouseLeave={() => setHoveredEvent(null)}
                onClick={() => onEventClick?.(evt)}
                style={{ top: `${topPct}%` }}
                className="absolute inset-x-0 -translate-y-1/2 z-20 flex items-center justify-between px-2 group cursor-pointer"
              >
                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-amber-500/70 to-transparent" />
                <div
                  style={{ backgroundColor: markerColor }}
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-white flex items-center gap-1 shadow-md hover:scale-105 transition"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>{evt.depthMD}m: {evt.eventType.replace('_', ' ')}</span>
                </div>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-amber-500/70 to-transparent" />
              </div>
            );
          })}

          {/* Live Bit Depth Indicator Line */}
          {currentDepthMD !== undefined && (
            <div
              style={{ top: `${(currentDepthMD / totalDepth) * 100}%` }}
              className="absolute inset-x-0 -translate-y-1/2 z-30 flex items-center justify-between pointer-events-none"
            >
              <div className="h-0.5 flex-1 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              <div className="px-2.5 py-1 rounded bg-amber-500 text-neutral-950 font-mono text-[11px] font-bold shadow-lg flex items-center gap-1">
                <ArrowDown className="w-3.5 h-3.5" />
                LIVE BIT: {currentDepthMD.toFixed(1)}m
              </div>
              <div className="h-0.5 flex-1 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            </div>
          )}
        </div>
      </div>

      {/* Interactive Tooltip Footer */}
      {hoveredEvent && (
        <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-neutral-900 border border-amber-300 dark:border-amber-700 text-xs font-mono">
          <div className="flex items-center justify-between text-amber-800 dark:text-amber-400 font-bold mb-1">
            <span>HISTORICAL EVENT AT {hoveredEvent.depthMD}m MD</span>
            <span>NPT: {hoveredEvent.nptHours} hrs</span>
          </div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs">{hoveredEvent.description}</p>
          <div className="mt-1 flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400">
            <span>Cause: {hoveredEvent.cause}</span>
            <span>Ref: {hoveredEvent.sourceDocument}</span>
          </div>
        </div>
      )}

      {hoveredCorridor && !hoveredEvent && (
        <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-neutral-900 border border-rose-300 dark:border-rose-700 text-xs font-mono">
          <div className="flex items-center justify-between text-rose-800 dark:text-rose-400 font-bold mb-1">
            <span>HAZARD CORRIDOR: {hoveredCorridor.formationName}</span>
            <span>Risk Score: {hoveredCorridor.riskScore}%</span>
          </div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs">{hoveredCorridor.observedFact}</p>
        </div>
      )}
    </div>
  );
};
