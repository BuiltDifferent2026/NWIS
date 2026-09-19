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
  const formations: DepthIntervalBand[] = highlightIntervals || [
    { name: 'Alluvium / Dihing', from: 0, to: 600, color: '#64748b' },
    { name: 'Namsang Formation', from: 600, to: 1200, color: '#475569' },
    { name: 'Girujan Clay (Seal)', from: 1200, to: 1800, color: '#334155' },
    { name: 'Tipam Sandstone (Target)', from: 1800, to: 2600, color: '#b25900' },
    { name: 'Barail Group (Kick Zone)', from: 2600, to: 3500, color: '#581c87' },
    { name: 'Kopili Formation (Overpressure)', from: 3500, to: maxDepthMD, color: '#831843' }
  ];

  const svgWidth = 340;
  const paddingLeft = 60;
  const trackWidth = 240;
  const trackLeft = paddingLeft + 10;

  const depthToY = (depth: number) => {
    const clamped = Math.max(0, Math.min(depth, maxDepthMD));
    return (clamped / maxDepthMD) * (height - 40) + 20;
  };

  const currentY = depthToY(currentDepthMD);
  const incidentY = historicalIncidentDepth ? depthToY(historicalIncidentDepth) : undefined;
  const depthTicks = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500];

  return (
    <div className={`gov-panel space-y-3 font-sans ${className}`}>
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <span className="text-xs font-bold text-foreground uppercase tracking-wide font-mono">
            Stratigraphic Depth-Track (MD)
          </span>
          <div className="text-[11px] text-muted-foreground font-mono">
            Vertical Depth Scale · 0m to {maxDepthMD}m MD
          </div>
        </div>

        {showComparisonReadout && historicalIncidentDepth !== undefined && (
          <div className="border border-border bg-secondary px-2.5 py-1 text-xs font-mono">
            <span className="text-muted-foreground uppercase text-[10px] block font-bold">
              Comparison:
            </span>
            {currentDepthMD < historicalIncidentDepth ? (
              <span className="font-bold text-[#b25900] dark:text-[#fbbf24]">
                {(historicalIncidentDepth - currentDepthMD).toFixed(0)}m BEFORE incident
              </span>
            ) : (
              <span className="font-bold text-[#d4351c] dark:text-[#f87171]">
                {(currentDepthMD - historicalIncidentDepth).toFixed(0)}m PAST incident
              </span>
            )}
          </div>
        )}
      </div>

      <div className="relative flex justify-center">
        <svg
          viewBox={`0 0 ${svgWidth} ${height}`}
          className="w-full max-w-[360px] border border-border bg-secondary/30 transition-colors"
          style={{ height }}
          role="img"
          aria-label="Stratigraphic depth track visualization"
        >
          {/* Depth Axis Ticks */}
          {depthTicks.map((tick) => {
            const y = depthToY(tick);
            return (
              <g key={tick}>
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-muted-foreground font-mono text-[10px]"
                >
                  {tick}m
                </text>
                <line
                  x1={paddingLeft - 4}
                  y1={y}
                  x2={paddingLeft + 4}
                  y2={y}
                  stroke="currentColor"
                  className="text-border"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Formations Track */}
          {formations.map((f, i) => {
            const yFrom = depthToY(f.from);
            const yTo = depthToY(f.to);
            const rectHeight = Math.max(2, yTo - yFrom);
            return (
              <g key={i}>
                <rect
                  x={trackLeft}
                  y={yFrom}
                  width={trackWidth}
                  height={rectHeight}
                  fill={f.color}
                  opacity={0.35}
                  stroke="currentColor"
                  className="text-border"
                  strokeWidth="0.5"
                />
                <text
                  x={trackLeft + 8}
                  y={yFrom + 14}
                  className="fill-foreground font-mono font-bold text-[10px]"
                >
                  {f.name}
                </text>
              </g>
            );
          })}

          {/* Risk Corridors Bands */}
          {riskCorridors.map((rc) => {
            const yFrom = depthToY(rc.depthInterval.from);
            const yTo = depthToY(rc.depthInterval.to);
            const rectHeight = Math.max(2, yTo - yFrom);
            return (
              <g key={rc.id}>
                <rect
                  x={trackLeft}
                  y={yFrom}
                  width={trackWidth}
                  height={rectHeight}
                  fill="#d4351c"
                  opacity={0.25}
                  stroke="#d4351c"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={trackLeft + trackWidth - 8}
                  y={yFrom + 12}
                  textAnchor="end"
                  className="fill-[#d4351c] dark:fill-[#fca5a5] font-mono font-bold text-[9px]"
                >
                  ⚠ HAZARD: {rc.eventType.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* Historical Incident Line */}
          {incidentY !== undefined && (
            <g>
              <line
                x1={trackLeft}
                y1={incidentY}
                x2={trackLeft + trackWidth}
                y2={incidentY}
                stroke="#d4351c"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <text
                x={trackLeft + trackWidth - 8}
                y={incidentY - 4}
                textAnchor="end"
                className="fill-[#d4351c] dark:fill-[#fca5a5] font-mono font-bold text-[10px]"
              >
                INCIDENT DEPTH ({historicalIncidentDepth}m)
              </text>
            </g>
          )}

          {/* Current Bit Depth Line */}
          <g>
            <line
              x1={trackLeft - 10}
              y1={currentY}
              x2={trackLeft + trackWidth + 10}
              y2={currentY}
              stroke="#1d70b8"
              strokeWidth="2.5"
            />
            <circle
              cx={trackLeft}
              cy={currentY}
              r="4"
              fill="#1d70b8"
            />
            <text
              x={trackLeft + 12}
              y={currentY - 4}
              className="fill-foreground font-mono font-bold text-[11px]"
            >
              BIT: {currentDepthMD}m MD
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
