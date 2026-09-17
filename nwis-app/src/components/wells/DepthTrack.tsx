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
    <div className="relative rounded-xl border border-white/[0.06] bg-slate-950/80 backdrop-blur-md p-4 flex flex-col h-full">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
            Stratigraphic Depth Track
          </span>
          <p className="text-[11px] text-slate-400 font-mono">
            {well.name} ({well.field}) • TD: {totalDepth}m MD
          </p>
        </div>
        {currentDepthMD !== undefined && (
          <div className="text-right">
            <span className="text-[10px] font-mono text-cyan-400 uppercase">Bit Depth</span>
            <div className="text-xs font-mono font-bold text-cyan-300 flex items-center justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              {currentDepthMD.toFixed(1)}m MD
            </div>
          </div>
        )}
      </div>

      {/* Main Track Viewport */}
      <div className="relative mt-4 flex-1 min-h-[520px] flex gap-2 overflow-hidden select-none">
        {/* Depth Scale Column */}
        <div className="w-14 relative border-r border-slate-800 flex flex-col justify-between py-1 text-[10px] font-mono text-slate-400">
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
                <span className="w-1.5 h-px bg-slate-700" />
              </div>
            );
          })}
        </div>

        {/* Stratigraphic Column */}
        <div className="relative flex-1 rounded-lg border border-slate-800 overflow-hidden bg-slate-900/40">
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
                    className="font-semibold tracking-tight truncate flex items-center gap-1.5"
                  >
                    <span
                      style={{ backgroundColor: color }}
                      className="w-2 h-2 rounded-full inline-block shrink-0"
                    />
                    {interval.top.formationName}
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-200">
                    {interval.startDepth}m – {interval.endDepth}m
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono italic mt-0.5 truncate">
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
                  className="absolute inset-x-0 bg-red-500/10 border-y-2 border-red-500/40 pointer-events-auto z-10 cursor-pointer flex items-center justify-between px-3 hover:bg-red-500/20 transition"
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-red-400 uppercase bg-red-950/80 px-2 py-0.5 rounded border border-red-500/30">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                    <span>CORRIDOR: {rc.eventType.replace('_', ' ')} ({rc.riskScore}% RISK)</span>
                  </div>
                  <span className="text-[10px] font-mono text-red-300">
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
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-white flex items-center gap-1 shadow-md shadow-black/80 hover:scale-105 transition"
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
              <div className="h-0.5 flex-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <div className="px-2.5 py-1 rounded bg-cyan-500 text-slate-950 font-mono text-[11px] font-bold shadow-lg flex items-center gap-1">
                <ArrowDown className="w-3.5 h-3.5" />
                LIVE BIT: {currentDepthMD.toFixed(1)}m
              </div>
              <div className="h-0.5 flex-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            </div>
          )}
        </div>
      </div>

      {/* Interactive Tooltip Footer */}
      {hoveredEvent && (
        <div className="mt-3 p-3 rounded-lg bg-slate-900 border border-amber-500/40 text-xs font-mono">
          <div className="flex items-center justify-between text-amber-400 font-bold mb-1">
            <span>HISTORICAL EVENT AT {hoveredEvent.depthMD}m MD</span>
            <span>NPT: {hoveredEvent.nptHours} hrs</span>
          </div>
          <p className="text-slate-300 text-xs">{hoveredEvent.description}</p>
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
            <span>Cause: {hoveredEvent.cause}</span>
            <span>Ref: {hoveredEvent.sourceDocument}</span>
          </div>
        </div>
      )}

      {hoveredCorridor && !hoveredEvent && (
        <div className="mt-3 p-3 rounded-lg bg-slate-900 border border-red-500/40 text-xs font-mono">
          <div className="flex items-center justify-between text-red-400 font-bold mb-1">
            <span>HAZARD CORRIDOR: {hoveredCorridor.formationName}</span>
            <span>Risk Score: {hoveredCorridor.riskScore}%</span>
          </div>
          <p className="text-slate-300 text-xs">{hoveredCorridor.observedFact}</p>
        </div>
      )}
    </div>
  );
};
