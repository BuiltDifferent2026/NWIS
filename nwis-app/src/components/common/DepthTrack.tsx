'use client';

import React from 'react';
import { RiskCorridor } from '../../lib/data/types';

interface DepthIntervalBand {
  name: string;
  from: number;
  to: number;
  color?: string;
}

interface DepthTrackProps {
  currentDepthMD?: number;
  maxDepthMD?: number;
  historicalIncidentDepth?: number;
  riskCorridors?: RiskCorridor[];
  highlightIntervals?: DepthIntervalBand[];
  showComparisonReadout?: boolean;
  className?: string;
  height?: number;
}

export const DepthTrack: React.FC<DepthTrackProps> = ({
  currentDepthMD = 2165,
  maxDepthMD = 3800,
  historicalIncidentDepth,
  riskCorridors = [],
  highlightIntervals,
  showComparisonReadout = false,
  className = '',
  height = 540
}) => {
  // Default stratigraphic formations if none provided
  const formations: DepthIntervalBand[] = highlightIntervals || [
    { name: 'Alluvium / Dihing', from: 0, to: 600, color: '#1e293b' },
    { name: 'Namsang Formation', from: 600, to: 1200, color: '#1e2230' },
    { name: 'Girujan Clay (Seal)', from: 1200, to: 1800, color: '#1e1b4b' },
    { name: 'Tipam Sandstone (Target)', from: 1800, to: 2600, color: '#451a03' },
    { name: 'Barail Group (Target/Kick)', from: 2600, to: 3500, color: '#3b0764' },
    { name: 'Kopili Formation (Overpressure)', from: 3500, to: maxDepthMD, color: '#4c0519' }
  ];

  const svgWidth = 340;
  const paddingLeft = 60;
  const trackWidth = 240;
  const trackLeft = paddingLeft + 10;

  // Depth-to-Y mapping (0m at top, maxDepth at bottom)
  const depthToY = (depth: number) => {
    const clamped = Math.max(0, Math.min(depth, maxDepthMD));
    return (clamped / maxDepthMD) * (height - 40) + 20;
  };

  const currentY = depthToY(currentDepthMD);
  const incidentY = historicalIncidentDepth ? depthToY(historicalIncidentDepth) : undefined;
  const depthTicks = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500];

  return (
    <div className={`rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] p-5 shadow-xs transition-colors ${className}`}>
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E2E5E8] dark:border-[#364356]">
        <div>
          <span className="text-xs font-extrabold text-[#252B33] dark:text-white uppercase tracking-wide font-mono">
            Stratigraphic Depth-Track (MD)
          </span>
          <div className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] font-mono">
            Vertical Depth Scale • 0m to {maxDepthMD}m MD
          </div>
        </div>

        {/* Replay / Comparison Readout */}
        {showComparisonReadout && historicalIncidentDepth !== undefined && (
          <div className="rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-[#F5F7F8] dark:bg-[#1E2532] px-3 py-1.5 text-xs font-mono">
            <span className="text-[#6B7280] dark:text-[#94A3B8] uppercase text-[10px] block font-bold">
              Advance Comparison:
            </span>
            {currentDepthMD < historicalIncidentDepth ? (
              <span className="font-bold text-[#F2B84B]">
                {(historicalIncidentDepth - currentDepthMD).toFixed(0)}m BEFORE historical incident
              </span>
            ) : (
              <span className="font-bold text-[#ED1C24]">
                {(currentDepthMD - historicalIncidentDepth).toFixed(0)}m PAST historical incident
              </span>
            )}
          </div>
        )}
      </div>

      <div className="relative flex justify-center">
        <svg
          viewBox={`0 0 ${svgWidth} ${height}`}
          className="w-full max-w-[360px] rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-[#F5F7F8] dark:bg-[#191E26] transition-colors"
          style={{ height }}
          role="img"
          aria-label="Stratigraphic depth track visualization"
        >
          {/* Depth Axis Ticks (Left) */}
          {depthTicks.map((tick) => {
            const y = depthToY(tick);
            return (
              <g key={tick}>
                <line
                  x1={paddingLeft - 5}
                  y1={y}
                  x2={paddingLeft + 5}
                  y2={y}
                  stroke="currentColor"
                  className="text-neutral-300 dark:text-neutral-700"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fontFamily="monospace"
                  className="fill-neutral-500 dark:fill-neutral-400"
                >
                  {tick}m
                </text>
              </g>
            );
          })}

          {/* Stratigraphic Formation Intervals */}
          {formations.map((f, i) => {
            const y1 = depthToY(f.from);
            const y2 = depthToY(f.to);
            const bandHeight = y2 - y1;
            return (
              <g key={i}>
                <rect
                  x={trackLeft}
                  y={y1}
                  width={trackWidth}
                  height={bandHeight}
                  fill={f.color || '#1e293b'}
                  stroke="#334155"
                  strokeWidth="1"
                />
                <text
                  x={trackLeft + 8}
                  y={y1 + 14}
                  fontSize="10"
                  fontWeight="600"
                  fill="#ffffff"
                  fontFamily="monospace"
                >
                  {f.name}
                </text>
                <text
                  x={trackLeft + trackWidth - 8}
                  y={y1 + 14}
                  textAnchor="end"
                  fontSize="9"
                  fontFamily="monospace"
                  fill="#94a3b8"
                >
                  {f.from}m–{f.to}m
                </text>
              </g>
            );
          })}

          {/* Risk Corridors (Hatched / Bordered Warning Zones) */}
          {riskCorridors.map((rc) => {
            const y1 = depthToY(rc.depthInterval.from);
            const y2 = depthToY(rc.depthInterval.to);
            const corridorH = y2 - y1;
            return (
              <g key={rc.id}>
                <rect
                  x={trackLeft}
                  y={y1}
                  width={trackWidth}
                  height={corridorH}
                  fill="rgba(202, 53, 53, 0.15)"
                  stroke="#ca3535"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                <rect
                  x={trackLeft + 6}
                  y={y1 + 4}
                  width={trackWidth - 12}
                  height={16}
                  fill="#ca3535"
                />
                <text
                  x={trackLeft + 12}
                  y={y1 + 16}
                  fontSize="9"
                  fontWeight="700"
                  fill="#ffffff"
                  fontFamily="monospace"
                >
                  RISK CORRIDOR: {rc.eventType.replace('_', ' ').toUpperCase()} ({rc.depthInterval.from}–{rc.depthInterval.to}m)
                </text>
              </g>
            );
          })}

          {/* Historical Actual Incident Marker (if passed, for Replay) */}
          {incidentY !== undefined && (
            <g>
              <line
                x1={trackLeft - 10}
                y1={incidentY}
                x2={trackLeft + trackWidth + 10}
                y2={incidentY}
                stroke="#b91c1c"
                strokeWidth="2.5"
              />
              <polygon
                points={`${trackLeft + trackWidth + 4},${incidentY - 6} ${trackLeft + trackWidth + 14},${incidentY} ${trackLeft + trackWidth + 4},${incidentY + 6}`}
                fill="#b91c1c"
              />
              <rect
                x={trackLeft + 10}
                y={incidentY + 3}
                width={190}
                height={15}
                fill="#ffffff"
                stroke="#b91c1c"
                strokeWidth="1"
              />
              <text
                x={trackLeft + 14}
                y={incidentY + 14}
                fontSize="9"
                fontWeight="700"
                fill="#b91c1c"
                fontFamily="monospace"
              >
                HISTORICAL INCIDENT: {historicalIncidentDepth}m MD
              </text>
            </g>
          )}

          {/* Active Bit Current Depth Marker (Teal Solid Line with Flag) */}
          <g>
            <line
              x1={trackLeft - 15}
              y1={currentY}
              x2={trackLeft + trackWidth + 10}
              y2={currentY}
              stroke="#3FC3B6"
              strokeWidth="2.5"
            />
            <polygon
              points={`${trackLeft - 18},${currentY - 6} ${trackLeft - 8},${currentY} ${trackLeft - 18},${currentY + 6}`}
              fill="#3FC3B6"
            />
            <rect
              x={trackLeft + trackWidth - 110}
              y={currentY - 18}
              width={105}
              height={16}
              fill="#3FC3B6"
            />
            <text
              x={trackLeft + trackWidth - 58}
              y={currentY - 6}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill="#222222"
              fontFamily="monospace"
            >
              BIT: {currentDepthMD.toFixed(1)}m MD
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-3 pt-2 border-t border-[#E2E5E8] dark:border-[#364356] flex flex-wrap items-center justify-between text-[11px] text-[#6B7280] dark:text-[#94A3B8] font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-[#3FC3B6] inline-block" /> Live Bit Depth
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-2 bg-[#ED1C24]/15 border border-[#ED1C24] inline-block" /> Risk Corridor
        </span>
        {historicalIncidentDepth && (
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#ED1C24] inline-block" /> Historical Incident
          </span>
        )}
      </div>
    </div>
  );
};
