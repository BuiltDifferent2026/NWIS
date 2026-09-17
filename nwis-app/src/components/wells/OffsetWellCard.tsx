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
      className={`rounded-2xl border transition-all duration-200 p-4.5 shadow-xs hover:shadow-md ${
        isSelected
          ? 'border-amber-500 bg-amber-500/5 dark:bg-amber-950/20 shadow-amber-500/10'
          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] hover:border-amber-500/40'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-neutral-950 dark:text-white text-sm tracking-tight">
              {offsetWell.name}
            </h4>
            <StatusBadge status={offsetWell.status} size="sm" />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
            {offsetWell.field} Field • Block {offsetWell.block} • {offsetWell.totalDepthMD}m TD
          </p>
        </div>

        {/* Dual Metric Badges: Distance (Geospatial) vs Similarity (Geological/Depth) */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <div className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase font-bold">Distance</div>
            <div className="text-xs font-mono font-bold text-neutral-950 dark:text-white flex items-center justify-end gap-1">
              <MapPin className="w-3 h-3 text-sky-600 dark:text-sky-400" />
              {distKm} km
            </div>
          </div>
          <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800" />
          <div className="text-right">
            <div className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase font-bold">Similarity</div>
            <div
              className={`text-xs font-mono font-bold flex items-center justify-end gap-1 ${
                simPercent >= 75
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : simPercent >= 50
                  ? 'text-amber-700 dark:text-amber-400'
                  : 'text-neutral-600 dark:text-neutral-400'
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
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-1">
          <span>Composite Geological Correlation</span>
          <span className="text-neutral-950 dark:text-white font-bold">{sim.total.toFixed(2)} / 1.00</span>
        </div>
        <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${simPercent}%` }}
            className={`h-full transition-all duration-500 rounded-full ${
              simPercent >= 75
                ? 'bg-gradient-to-r from-amber-600 to-emerald-500'
                : 'bg-gradient-to-r from-amber-700 to-amber-500'
            }`}
          />
        </div>
      </div>

      {/* Historical Incidents Summary in this offset well */}
      {events.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-400 font-mono text-[11px] font-semibold">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>{events.length} Historical Incident{events.length > 1 ? 's' : ''} Documented</span>
          </div>
          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
            {events.reduce((acc, e) => acc + e.nptHours, 0).toFixed(1)} hrs NPT
          </span>
        </div>
      )}

      {/* Expandable Breakdown Drawer */}
      <div className="mt-2.5">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full py-1 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 flex items-center justify-center gap-1 transition font-bold"
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
          <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
              <span className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                <Layers className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                Stratigraphic Sequence Match (30%)
              </span>
              <span className="font-bold">{Math.round(sim.formationMatch * 100)}%</span>
            </div>
            <div className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
              <span className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                <Gauge className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                Depth Alignment (25%)
              </span>
              <span className="font-bold">{Math.round(sim.depthAlignment * 100)}%</span>
            </div>
            <div className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
              <span className="text-neutral-500 dark:text-neutral-400">Trajectory Concordance (15%)</span>
              <span className="font-bold">{Math.round(sim.trajectorySimilarity * 100)}%</span>
            </div>
            <div className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
              <span className="text-neutral-500 dark:text-neutral-400">Operational & Mud Match (15%)</span>
              <span className="font-bold">{Math.round(sim.operationalSimilarity * 100)}%</span>
            </div>
            <div className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
              <span className="text-neutral-500 dark:text-neutral-400">Geographic Proximity (15%)</span>
              <span className="font-bold">{Math.round(sim.geographicProximity * 100)}%</span>
            </div>

            <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <ConfidenceBadge level={offsetWell.confidenceLevel} />
              <Link
                href={`/wells/${offsetWell.id}`}
                className="text-xs text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 hover:underline flex items-center gap-1 font-bold"
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
