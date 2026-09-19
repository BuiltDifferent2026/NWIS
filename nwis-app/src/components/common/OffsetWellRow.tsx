'use client';

import React, { useState } from 'react';
import { OffsetWellResult } from '../../lib/data/types';
import { StatusTag } from './StatusTag';
import Link from 'next/link';

interface OffsetWellRowProps {
  offset: OffsetWellResult;
  showLinkToWell?: boolean;
}

export const OffsetWellRow: React.FC<OffsetWellRowProps> = ({
  offset,
  showLinkToWell = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { well, distanceKm, similarityScore, similarityBreakdown, matchedEvents } = offset;

  return (
    <div className="gov-panel space-y-2 font-sans">
      {/* Primary Row: Distance and Similarity are explicitly separated and visible */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-foreground font-mono">{well.name}</span>
            <StatusTag label={well.status.toUpperCase()} />
            <span className="text-xs text-muted-foreground">
              {well.field} Field · <span className="capitalize">{well.trajectoryType}</span> · TD: <span className="font-mono font-bold text-foreground">{well.totalDepthMD}m</span>
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5 font-sans">
            Spud: <span className="font-mono">{well.spudDate}</span> · Operator: <strong className="text-foreground">{well.operator || 'Oil India Limited'}</strong>
          </div>
        </div>

        {/* Both Metrics Always Shown */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap font-mono text-xs">
          <div className="border-l-2 border-border pl-2.5">
            <div className="text-[10px] uppercase font-bold text-muted-foreground">
              Map Distance
            </div>
            <div className="text-xs font-bold text-foreground">
              {distanceKm} km
            </div>
          </div>

          <div className="border-l-2 border-border pl-2.5">
            <div className="text-[10px] uppercase font-bold text-muted-foreground">
              Composite Similarity
            </div>
            <div className="text-xs font-bold text-[#1d70b8] dark:text-[#60a5fa]">
              {(similarityScore * 100).toFixed(0)}% <span className="text-muted-foreground font-normal">({similarityScore.toFixed(2)})</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gov-button-secondary text-xs py-1 px-2.5 shrink-0"
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Hide [-]' : 'Breakdown [+]'}
          </button>
        </div>
      </div>

      {/* Expandable Breakdown Drawer */}
      {isExpanded && (
        <div className="border-t border-border pt-3 space-y-3">
          {/* 5-Vector Similarity Component Weights */}
          <div>
            <div className="text-xs font-bold text-foreground uppercase tracking-wide mb-1.5 font-mono">
              Composite Similarity Breakdown (5 Weighted Vectors)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-xs font-mono">
              <div className="p-2 bg-secondary/50 border border-border">
                <div className="text-[9px] text-muted-foreground uppercase">1. Formation (30%)</div>
                <div className="font-bold text-foreground mt-0.5">
                  {Math.round(similarityBreakdown.formationMatch * 100)}%
                </div>
              </div>
              <div className="p-2 bg-secondary/50 border border-border">
                <div className="text-[9px] text-muted-foreground uppercase">2. Depth Align (25%)</div>
                <div className="font-bold text-foreground mt-0.5">
                  {Math.round(similarityBreakdown.depthAlignment * 100)}%
                </div>
              </div>
              <div className="p-2 bg-secondary/50 border border-border">
                <div className="text-[9px] text-muted-foreground uppercase">3. Trajectory (15%)</div>
                <div className="font-bold text-foreground mt-0.5">
                  {Math.round(similarityBreakdown.trajectorySimilarity * 100)}%
                </div>
              </div>
              <div className="p-2 bg-secondary/50 border border-border">
                <div className="text-[9px] text-muted-foreground uppercase">4. Operations (15%)</div>
                <div className="font-bold text-foreground mt-0.5">
                  {Math.round(similarityBreakdown.operationalParamSimilarity * 100)}%
                </div>
              </div>
              <div className="p-2 bg-secondary/50 border border-border">
                <div className="text-[9px] text-muted-foreground uppercase">5. Geographic (15%)</div>
                <div className="font-bold text-foreground mt-0.5">
                  {Math.round(similarityBreakdown.geographicProximity * 100)}%
                </div>
              </div>
            </div>
          </div>

          {/* Matched Historical Drilling Events */}
          {matchedEvents && matchedEvents.length > 0 && (
            <div>
              <div className="text-xs font-bold text-foreground uppercase tracking-wide mb-1.5 font-mono">
                Historical Incidents &amp; Lessons in {well.name}
              </div>
              <div className="space-y-1.5">
                {matchedEvents.map((evt) => (
                  <div key={evt.id} className="p-2 bg-card border border-border text-xs space-y-1">
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold text-foreground">{evt.eventType.replace('_', ' ').toUpperCase()} @ {evt.depthInterval?.from || 0}m MD</span>
                      <span className="text-muted-foreground">{evt.nptHours || 0} hrs NPT</span>
                    </div>
                    <p className="text-foreground leading-relaxed font-sans">{evt.narrative}</p>
                    <div className="text-[11px] text-muted-foreground font-sans">
                      <strong>Mitigation Applied: </strong>{evt.mitigationApplied || 'Standard LCM Pill'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showLinkToWell && (
            <div className="pt-2 flex justify-end">
              <Link
                href={`/wells/${well.id}`}
                className="text-xs font-bold text-[#1d70b8] dark:text-[#60a5fa] hover:underline font-mono"
              >
                Open Full Well Workspace ({well.name}) →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
