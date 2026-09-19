'use client';

import React, { useState } from 'react';
import { Well, computeSimilarity, haversineDistance } from '../../data/wells';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { getEventsByWell } from '../../data/events';
import { ChevronDown, ChevronUp, MapPin, Layers, Gauge, AlertCircle, Compass } from 'lucide-react';
import Link from 'next/link';

interface OffsetWellCardProps {
  activeWell: Well;
  offsetWell: Well;
  onSelect?: (well: Well) => void;
  isSelected?: boolean;
}

export const OffsetWellCard: React.FC<OffsetWellCardProps> = ({
  activeWell,
  offsetWell,
  onSelect,
  isSelected = false
}) => {
  const [expanded, setExpanded] = useState(false);

  const distKm = Math.round(
    haversineDistance(
      activeWell.coordinates.surfaceLat,
      activeWell.coordinates.surfaceLng,
      offsetWell.coordinates.surfaceLat,
      offsetWell.coordinates.surfaceLng
    ) * 10
  ) / 10;

  const sim = computeSimilarity(activeWell, offsetWell);
  const simPercent = Math.round(sim.total * 100);
  const events = getEventsByWell(offsetWell.id);

  return (
    <div
      className={`gov-panel space-y-2.5 transition-colors ${
        isSelected ? 'border-l-4 border-l-[#1d70b8] bg-[#eef4f9] dark:bg-[#192336]' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3 font-sans">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-foreground text-sm font-mono">
              {offsetWell.name}
            </h4>
            <StatusBadge status={offsetWell.status} size="sm" />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {offsetWell.field} Field · Block {offsetWell.block} · {offsetWell.totalDepthMD}m TD
          </p>
        </div>

        {/* Dual Metric Badges: Distance vs Similarity */}
        <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground uppercase font-bold">Distance</div>
            <div className="text-xs font-bold text-foreground">
              {distKm} km
            </div>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground uppercase font-bold">Similarity</div>
            <div className="text-xs font-bold text-[#1d70b8] dark:text-[#60a5fa]">
              {simPercent}%
            </div>
          </div>
        </div>
      </div>

      {/* Flat Neutral Similarity Bar */}
      <div className="space-y-1 font-mono text-xs">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Composite Similarity</span>
          <span className="text-foreground font-bold">{sim.total.toFixed(2)} / 1.00</span>
        </div>
        <div className="h-1.5 w-full bg-border rounded-xs overflow-hidden">
          <div
            style={{ width: `${simPercent}%` }}
            className="h-full bg-[#1d70b8] transition-all duration-300"
          />
        </div>
      </div>

      {/* Toggle Button */}
      <div className="pt-1 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            setExpanded(!expanded);
            if (onSelect) onSelect(offsetWell);
          }}
          className="text-xs font-mono font-bold text-[#1d70b8] dark:text-[#60a5fa] hover:underline flex items-center gap-1 cursor-pointer"
        >
          {expanded ? (
            <>
              <span>Hide Details</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>Inspect Stratigraphy &amp; Incidents</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        <Link
          href={`/wells/${offsetWell.id}`}
          className="text-[11px] font-mono text-muted-foreground hover:text-foreground"
        >
          Workspace →
        </Link>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="pt-2 border-t border-border space-y-2 text-xs font-mono">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <div className="p-1.5 bg-card border border-border">
              <span className="text-[9px] text-muted-foreground uppercase block">Formation</span>
              <span className="font-bold text-foreground">{Math.round(sim.formationMatch * 100)}% match</span>
            </div>
            <div className="p-1.5 bg-card border border-border">
              <span className="text-[9px] text-muted-foreground uppercase block">Depth Align</span>
              <span className="font-bold text-foreground">{Math.round(sim.depthAlignment * 100)}%</span>
            </div>
            <div className="p-1.5 bg-card border border-border">
              <span className="text-[9px] text-muted-foreground uppercase block">Trajectory</span>
              <span className="font-bold text-foreground">{Math.round(sim.trajectorySimilarity * 100)}%</span>
            </div>
            <div className="p-1.5 bg-card border border-border">
              <span className="text-[9px] text-muted-foreground uppercase block">Operations</span>
              <span className="font-bold text-foreground">{Math.round(sim.operationalSimilarity * 100)}%</span>
            </div>
          </div>

          {events.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Historical Incidents ({events.length}):</span>
              {events.map((evt) => (
                <div key={evt.id} className="p-1.5 bg-card border border-border text-[11px]">
                  <div className="font-bold text-foreground">{evt.eventType.replace('_', ' ').toUpperCase()} @ {evt.depthMD}m MD ({evt.formationName})</div>
                  <div className="text-muted-foreground">{evt.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
