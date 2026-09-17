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
      className={`rounded-xl border transition-all duration-200 bg-slate-900/60 backdrop-blur-md p-4 ${
        isSelected
          ? 'border-blue-500 bg-blue-950/20 shadow-lg shadow-blue-500/10'
          : 'border-white/[0.06] hover:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-100 text-sm tracking-tight">
              {offsetWell.name}
            </h4>
            <StatusBadge status={offsetWell.status} size="sm" />
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {offsetWell.field} Field • Block {offsetWell.block} • {offsetWell.totalDepthMD}m TD
          </p>
        </div>

        {/* Dual Metric Badges: Distance (Geospatial) vs Similarity (Geological/Depth) */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Distance</div>
            <div className="text-xs font-mono font-bold text-slate-200 flex items-center justify-end gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              {distKm} km
            </div>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Similarity</div>
            <div
              className={`text-xs font-mono font-bold flex items-center justify-end gap-1 ${
                simPercent >= 75
                  ? 'text-emerald-400'
                  : simPercent >= 50
                  ? 'text-amber-400'
                  : 'text-slate-400'
              }`}
            >
              <Compass className="w-3 h-3" />
              {simPercent}%
            </div>
          </div>
        </div>
      </div>

      {/* Mini Progress Bar for Composite Similarity */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
          <span>Composite Geological Correlation</span>
          <span className="text-slate-300 font-semibold">{sim.total.toFixed(2)} / 1.00</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${simPercent}%` }}
            className={`h-full transition-all duration-500 rounded-full ${
              simPercent >= 75
                ? 'bg-gradient-to-r from-blue-500 to-emerald-400'
                : 'bg-gradient-to-r from-blue-500 to-amber-400'
            }`}
          />
        </div>
      </div>

      {/* Historical Incidents Summary in this offset well */}
      {events.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px]">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{events.length} Historical Incident{events.length > 1 ? 's' : ''} Documented</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {events.reduce((acc, e) => acc + e.nptHours, 0).toFixed(1)} hrs NPT
          </span>
        </div>
      )}

      {/* Expandable Breakdown Drawer */}
      <div className="mt-2.5">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-1 text-[11px] font-mono text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1 transition"
        >
          {expanded ? (
            <>
              Hide Multi-Vector Breakdown <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              View 5-Vector Similarity Breakdown <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>

        {expanded && (
          <div className="mt-2 pt-2 border-t border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1 text-slate-400">
                <Layers className="w-3 h-3 text-purple-400" />
                Stratigraphic Sequence Match (30%)
              </span>
              <span>{Math.round(sim.formationMatch * 100)}%</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1 text-slate-400">
                <Gauge className="w-3 h-3 text-cyan-400" />
                Depth Alignment (25%)
              </span>
              <span>{Math.round(sim.depthAlignment * 100)}%</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Trajectory Concordance (15%)</span>
              <span>{Math.round(sim.trajectorySimilarity * 100)}%</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Operational & Mud Match (15%)</span>
              <span>{Math.round(sim.operationalSimilarity * 100)}%</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Geographic Proximity (15%)</span>
              <span>{Math.round(sim.geographicProximity * 100)}%</span>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <ConfidenceBadge level={offsetWell.confidenceLevel} />
              <Link
                href={`/wells/${offsetWell.id}`}
                className="text-xs text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1"
              >
                Inspect Well & Logs →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
