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
    <div className="rounded-none border border-[#E2E5E8] bg-white overflow-hidden transition-all shadow-2xs">
      {/* Primary Row: Distance and Similarity are explicitly separated and visible */}
      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-sm text-[#252B33] dark:text-white font-mono">{well.name}</span>
            <StatusTag label={well.status.toUpperCase()} />
            <span className="text-xs text-[#6B7280]">
              {well.field} Field • <span className="capitalize">{well.trajectoryType}</span> • TD: <span className="font-mono font-bold">{well.totalDepthMD}m</span>
            </span>
          </div>
          <div className="text-xs text-[#6B7280] mt-1 font-sans">
            Spud: <span className="font-mono">{well.spudDate}</span> • Operator: <strong className="text-[#252B33] dark:text-neutral-200">{well.operator || 'Oil India Limited'}</strong>
          </div>
        </div>

        {/* Both Metrics Always Shown - Never Collapsed */}
        <div className="flex items-center gap-4 shrink-0 flex-wrap sm:flex-nowrap">
          <div className="border-l-2 border-[#E2E5E8] pl-3">
            <div className="text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wide font-mono">
              Map Distance
            </div>
            <div className="text-sm font-mono font-extrabold text-[#252B33] dark:text-white">
              {distanceKm} km
            </div>
          </div>

          <div className="border-l-2 border-[#E2E5E8] pl-3">
            <div className="text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wide font-mono">
              Similarity Score
            </div>
            <div className="text-sm font-mono font-extrabold text-[#26A69A] flex items-center gap-1.5">
              <span>{(similarityScore * 100).toFixed(0)}%</span>
              <span className="text-xs text-[#6B7280] font-normal">({similarityScore.toFixed(2)})</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-none px-3 py-1.5 text-xs font-bold font-mono transition-colors border border-[#E2E5E8] dark:border-neutral-700 bg-[#F5F7F8] dark:bg-neutral-800 hover:bg-[#E2E5E8] dark:hover:bg-neutral-700 text-[#252B33] dark:text-neutral-200 cursor-pointer shrink-0"
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Hide Breakdown [-]' : 'View Breakdown [+]'}
          </button>
        </div>
      </div>

      {/* Expandable Breakdown Drawer */}
      {isExpanded && (
        <div className="border-t border-[#E2E5E8] bg-[#F5F7F8] p-4 space-y-4">
          {/* 5-Vector Similarity Component Weights */}
          <div>
            <div className="text-xs font-extrabold text-[#252B33] dark:text-white uppercase tracking-wide mb-2.5 font-mono">
              Composite Similarity Breakdown (5 Weighted Vectors)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
              <div className="rounded-none border border-[#E2E5E8] bg-white p-2.5 shadow-2xs">
                <div className="text-[10px] text-[#6B7280] uppercase">1. Formation (30%)</div>
                <div className="font-extrabold text-[#252B33] dark:text-white text-sm mt-0.5">
                  {Math.round(similarityBreakdown.formationMatch * 100)}%
                </div>
              </div>
              <div className="rounded-none border border-[#E2E5E8] bg-white p-2.5 shadow-2xs">
                <div className="text-[10px] text-[#6B7280] uppercase">2. Depth Align (25%)</div>
                <div className="font-extrabold text-[#252B33] dark:text-white text-sm mt-0.5">
                  {Math.round(similarityBreakdown.depthAlignment * 100)}%
                </div>
              </div>
              <div className="rounded-none border border-[#E2E5E8] bg-white p-2.5 shadow-2xs">
                <div className="text-[10px] text-[#6B7280] uppercase">3. Trajectory (15%)</div>
                <div className="font-extrabold text-[#252B33] dark:text-white text-sm mt-0.5">
                  {Math.round(similarityBreakdown.trajectorySimilarity * 100)}%
                </div>
              </div>
              <div className="rounded-none border border-[#E2E5E8] bg-white p-2.5 shadow-2xs">
                <div className="text-[10px] text-[#6B7280] uppercase">4. Operations (15%)</div>
                <div className="font-extrabold text-[#252B33] dark:text-white text-sm mt-0.5">
                  {Math.round(similarityBreakdown.operationalParamSimilarity * 100)}%
                </div>
              </div>
              <div className="rounded-none border border-[#E2E5E8] bg-white p-2.5 shadow-2xs">
                <div className="text-[10px] text-[#6B7280] uppercase">5. Geographic (15%)</div>
                <div className="font-extrabold text-[#252B33] dark:text-white text-sm mt-0.5">
                  {Math.round(similarityBreakdown.geographicProximity * 100)}%
                </div>
              </div>
            </div>
          </div>

          {/* Matched Historical Events from this offset well */}
          {matchedEvents.length > 0 ? (
            <div>
              <div className="text-xs font-extrabold text-[#252B33] dark:text-white uppercase tracking-wide mb-2 font-mono">
                Documented Events in this Offset Well ({matchedEvents.length})
              </div>
              <div className="space-y-2">
                {matchedEvents.map((evt) => (
                  <div key={evt.id} className="rounded-none border border-[#E2E5E8] bg-white p-3 text-xs shadow-2xs space-y-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#252B33] dark:text-white font-mono">
                          {evt.eventType.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-[#6B7280] font-mono text-[11px]">
                          @ {evt.depthInterval.from}m–{evt.depthInterval.to}m MD ({evt.formation})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {evt.nptHours && (
                          <span className="font-extrabold text-[#ED1C24] font-mono text-[11px]">{evt.nptHours} hrs NPT</span>
                        )}
                        <StatusTag label={evt.sourceDocument.confidence} />
                      </div>
                    </div>
                    <p className="text-[#252B33] dark:text-neutral-300 leading-relaxed">{evt.narrative}</p>
                    {evt.mitigationApplied && (
                      <div className="text-[#6B7280] text-[11px]">
                        <span className="font-bold text-[#252B33] dark:text-neutral-200">Applied Mitigation: </span>
                        {evt.mitigationApplied}
                      </div>
                    )}
                    <div className="text-[10px] text-[#6B7280] font-mono">
                      Source Document: {evt.sourceDocument.name}
                      {evt.sourceDocument.page ? ` (Page ${evt.sourceDocument.page})` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-xs text-[#6B7280] italic">
              No critical incidents documented in offset records across this formation interval.
            </div>
          )}

          {showLinkToWell && (
            <div className="pt-2 border-t border-[#E2E5E8] dark:border-neutral-800 text-right">
              <Link
                href={`/wells/${well.id}`}
                className="text-xs font-bold text-[#26A69A] hover:text-[#3FC3B6] hover:underline inline-flex items-center gap-1 font-mono"
              >
                Open Full Well Workspace for {well.name} →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
