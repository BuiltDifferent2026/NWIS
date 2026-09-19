'use client';

import React, { useState } from 'react';
import { 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Compass, 
  Activity, 
  ZoomIn, 
  Eye, 
  Info,
  ChevronRight,
  TrendingDown,
  Gauge
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FormationTop {
  name: string;
  from: number;
  to: number;
  colorDark: string;
  colorLight: string;
  borderDark: string;
  borderLight: string;
  lithology: string;
  hazardRisk?: 'none' | 'moderate' | 'critical';
}

interface MultiWellCorrelationTrackProps {
  currentDepthMD?: number;
  className?: string;
}

export const MultiWellCorrelationTrack: React.FC<MultiWellCorrelationTrackProps> = ({
  currentDepthMD = 2165.4,
  className = ''
}) => {
  const [zoomMode, setZoomMode] = useState<'full' | 'target'>('full');
  const [showTieLines, setShowTieLines] = useState<boolean>(true);
  const [showPPFG, setShowPPFG] = useState<boolean>(true);
  const [hoveredFormation, setHoveredFormation] = useState<string | null>(null);
  const [selectedWell, setSelectedWell] = useState<string>('active');

  // Depth windows
  const minDepth = zoomMode === 'full' ? 0 : 1600;
  const maxDepth = zoomMode === 'full' ? 3800 : 2600;
  const depthSpan = maxDepth - minDepth;

  // Depth-to-Y function for SVG (svg height is 480)
  const svgHeight = 480;
  const topPadding = 45;
  const bottomPadding = 35;
  const usableHeight = svgHeight - topPadding - bottomPadding;

  const depthToY = (depth: number) => {
    const clamped = Math.max(minDepth, Math.min(depth, maxDepth));
    return topPadding + ((clamped - minDepth) / depthSpan) * usableHeight;
  };

  // Stratigraphic Formations for Active Well OIL-GLK-14
  const activeFormations: FormationTop[] = [
    { 
      name: 'Alluvium / Dihing', 
      from: 0, 
      to: 600, 
      colorDark: '#1e293b', 
      colorLight: '#f1f5f9', 
      borderDark: '#334155', 
      borderLight: '#cbd5e1', 
      lithology: 'River Gravel & Coarse Sand' 
    },
    { 
      name: 'Namsang Formation', 
      from: 600, 
      to: 1200, 
      colorDark: '#1e2230', 
      colorLight: '#e2e8f0', 
      borderDark: '#334155', 
      borderLight: '#cbd5e1', 
      lithology: 'Siltstone & Marly Sand' 
    },
    { 
      name: 'Girujan Clay (Seal)', 
      from: 1200, 
      to: 1800, 
      colorDark: '#1e1b4b', 
      colorLight: '#e0e7ff', 
      borderDark: '#3730a3', 
      borderLight: '#a5b4fc', 
      lithology: 'Variegated Regional Shale Caprock',
      hazardRisk: 'none'
    },
    { 
      name: 'Tipam Sandstone (Target)', 
      from: 1800, 
      to: 2600, 
      colorDark: '#451a03', 
      colorLight: '#ffedd5', 
      borderDark: '#b45309', 
      borderLight: '#fdba74', 
      lithology: 'Fractured Sandstone • Loss Horizon',
      hazardRisk: 'critical'
    },
    { 
      name: 'Barail Group (Target)', 
      from: 2600, 
      to: 3500, 
      colorDark: '#3b0764', 
      colorLight: '#f3e8ff', 
      borderDark: '#7e22ce', 
      borderLight: '#d8b4fe', 
      lithology: 'Coal-Shale Alternations • Kick Hazard',
      hazardRisk: 'critical'
    },
    { 
      name: 'Kopili Formation', 
      from: 3500, 
      to: 3800, 
      colorDark: '#4c0519', 
      colorLight: '#ffe4e6', 
      borderDark: '#be123c', 
      borderLight: '#fda4af', 
      lithology: 'Abnormal High Pressure Marine Shale',
      hazardRisk: 'moderate'
    }
  ];

  // Structural shifts for offset wells:
  // GLK-07: +18m dip to SE (formation tops 18m deeper)
  // GLK-05: -10m structural high to NW
  // GLK-02: +35m structural downthrow across fault
  const glk07Shift = 18;
  const glk05Shift = -10;
  const glk02Shift = 35;

  // Well Column layout X coordinates (SVG width = 960)
  const depthAxisWidth = 65;
  const colWidth = 145;
  const colSpacing = 32;

  const colX = {
    axis: 10,
    active: depthAxisWidth + 10,
    glk07: depthAxisWidth + 10 + colWidth + colSpacing,
    glk05: depthAxisWidth + 10 + (colWidth + colSpacing) * 2,
    glk02: depthAxisWidth + 10 + (colWidth + colSpacing) * 3,
    ppfg: depthAxisWidth + 10 + (colWidth + colSpacing) * 4 + 10
  };

  const ppfgWidth = 140;

  // Ticks for depth axis
  const depthTicks = zoomMode === 'full' 
    ? [0, 500, 1000, 1500, 2000, 2500, 3000, 3500] 
    : [1600, 1800, 2000, 2200, 2400, 2600];

  const activeY = depthToY(currentDepthMD);
  const triggerY = depthToY(2180.0);
  const glk07LossY = depthToY(2280.0 + glk07Shift);
  const glk05PassY = depthToY(2285.0 + glk05Shift);
  const glk02KickY = depthToY(2740.0 + glk02Shift);

  return (
    <div className={`gov-panel ${className}`}>
      
      {/* ─── Panel Header & Interactive Toolbar ─── */}
      <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-neutral-50/70 dark:bg-neutral-900/60">
        
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xs bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-300 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider font-mono">
                Multi-Well Stratigraphic Correlation Panel
              </h3>
              <span className="gov-tag gov-tag-neutral">
                GELEKI FAULT BLOCK
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 font-mono">
              Structural &amp; Lithological Tie-Lines · Active Well OIL-GLK-14 vs. Key Analog Offset Wells
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          
          {/* Depth View Mode Toggle */}
          <div className="flex items-center bg-white dark:bg-neutral-950 p-0.5 rounded-xs border border-neutral-300 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setZoomMode('full')}
              className={`px-2 py-1 rounded-xs text-[11px] font-mono font-bold transition-all ${
                zoomMode === 'full'
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Full Wellbore (0–3800m)
            </button>
            <button
              type="button"
              onClick={() => setZoomMode('target')}
              className={`px-2 py-1 rounded-xs text-[11px] font-mono font-bold transition-all flex items-center gap-1 ${
                zoomMode === 'target'
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <ZoomIn className="w-3 h-3" />
              <span>Target Zone (1600–2600m)</span>
            </button>
          </div>

          {/* Layer Toggles */}
          <button
            type="button"
            onClick={() => setShowTieLines(!showTieLines)}
            className={`px-2 py-1 rounded-xs border text-[11px] font-mono font-bold transition-colors ${
              showTieLines
                ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                : 'border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-950'
            }`}
          >
            Tie-Ribbons
          </button>

          <button
            type="button"
            onClick={() => setShowPPFG(!showPPFG)}
            className={`px-2 py-1 rounded-xs border text-[11px] font-mono font-bold transition-colors ${
              showPPFG
                ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                : 'border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-950'
            }`}
          >
            PPFG Window
          </button>

        </div>

      </div>

      {/* ─── Column Legend / Well Card Headers ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 p-3 bg-neutral-100/50 dark:bg-neutral-900/40 border-b border-neutral-200 dark:border-neutral-800 text-xs font-mono">
        
        {/* Active Well Header */}
        <div className="p-2 rounded-xs bg-white dark:bg-neutral-900 border-2 border-amber-600 dark:border-amber-500 space-y-0.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-700 dark:text-amber-400 uppercase text-[10px] flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              ACTIVE DRILLING
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">RIG #04</span>
          </div>
          <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 font-mono">OIL-GLK-14</div>
          <div className="flex items-center justify-between text-[10px] pt-0.5">
            <span className="text-neutral-500">Bit Depth:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">{currentDepthMD}m MD</span>
          </div>
          <div className="text-[10px] text-neutral-500 font-mono">Mud Wt: 9.8 ppg • Upper Tipam</div>
        </div>

        {/* Analog 1: OIL-GLK-07 */}
        <div className="p-2 rounded-xs bg-white dark:bg-neutral-900 border border-red-300 dark:border-red-900/60 space-y-0.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-red-700 dark:text-red-400 uppercase text-[10px] font-mono">
              BEST ANALOG (87%)
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">1.8 km SE</span>
          </div>
          <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 font-mono">OIL-GLK-07</div>
          <div className="flex items-center justify-between text-[10px] pt-0.5 font-mono">
            <span className="text-neutral-500">1996 Incident:</span>
            <span className="font-bold text-red-600 dark:text-red-400">2,280m MD</span>
          </div>
          <div className="text-[10px] text-red-600 dark:text-red-400 font-mono">420 bbls lost (MW 10.8 ppg)</div>
        </div>

        {/* Analog 2: OIL-GLK-05 */}
        <div className="p-2 rounded-xs bg-white dark:bg-neutral-900 border border-emerald-300 dark:border-emerald-900/60 space-y-0.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase text-[10px] font-mono">
              CLEAN PASS (91%)
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">2.4 km NW</span>
          </div>
          <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 font-mono">OIL-GLK-05</div>
          <div className="flex items-center justify-between text-[10px] pt-0.5 font-mono">
            <span className="text-neutral-500">2018 Run:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">Zero Loss</span>
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Pre-treated 35 ppb LCM</div>
        </div>

        {/* Analog 3: OIL-GLK-02 */}
        <div className="p-2 rounded-xs bg-white dark:bg-neutral-900 border border-purple-300 dark:border-purple-900/60 space-y-0.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-purple-700 dark:text-purple-400 uppercase text-[10px] font-mono">
              LOW SIM (42%)
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">0.9 km W</span>
          </div>
          <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 font-mono">OIL-GLK-02</div>
          <div className="flex items-center justify-between text-[10px] pt-0.5 font-mono">
            <span className="text-neutral-500">1984 Kick:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">2,740m MD</span>
          </div>
          <div className="text-[10px] text-neutral-500 font-mono">Barail Gas Influx (480 psi)</div>
        </div>

        {/* PPFG Curve Window Header */}
        <div className="p-2 rounded-xs bg-white dark:bg-neutral-900 border border-sky-300 dark:border-sky-900/60 space-y-0.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sky-700 dark:text-sky-400 uppercase text-[10px] font-mono">
              PRESSURE WINDOW
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">PPFG</span>
          </div>
          <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 font-mono">Drilling Margin</div>
          <div className="flex items-center justify-between text-[10px] pt-0.5 font-mono">
            <span className="text-neutral-500">Safe Window:</span>
            <span className="font-bold text-sky-600 dark:text-sky-400">9.4 – 10.4 ppg</span>
          </div>
          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">GLK-07 broke FG @ 10.8</div>
        </div>

      </div>

      {/* ─── Main SVG Multi-Well Correlation Viewport ─── */}
      <div className="relative w-full overflow-x-auto bg-neutral-50 dark:bg-[#080b12] p-2 flex justify-center">
        <svg
          viewBox={`0 0 ${colX.ppfg + ppfgWidth + 20} ${svgHeight}`}
          className="w-full max-w-[1150px] h-[520px] select-none"
          role="img"
          aria-label="Multi-well stratigraphic depth correlation diagram"
        >
          <defs>
            {/* Striped patterns for hazard intervals */}
            <pattern id="hazardStripeRed" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#ef4444" strokeWidth="2.5" opacity="0.4" />
            </pattern>
            <pattern id="cleanStripeGreen" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#10b981" strokeWidth="2.5" opacity="0.3" />
            </pattern>
            <pattern id="kickStripePurple" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#a855f7" strokeWidth="2.5" opacity="0.3" />
            </pattern>

            {/* Glowing filter for active bit cursor */}
            <filter id="bitGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ── 1. Horizontal Depth Grid Lines Across Entire Canvas ── */}
          {depthTicks.map((tick) => {
            const y = depthToY(tick);
            return (
              <g key={`grid-${tick}`}>
                <line
                  x1={colX.axis + 30}
                  y1={y}
                  x2={colX.ppfg + ppfgWidth}
                  y2={y}
                  stroke="currentColor"
                  className="text-neutral-200 dark:text-neutral-800/80"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                {/* Left Depth Label */}
                <text
                  x={colX.axis + 26}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="600"
                  className="fill-neutral-400 dark:fill-neutral-500"
                >
                  {tick}m
                </text>
              </g>
            );
          })}

          {/* ── 2. Inter-Well Stratigraphic Tie-Ribbons (Geological Correlation Polygons) ── */}
          {showTieLines && activeFormations.map((f) => {
            const y1_act = depthToY(f.from);
            const y2_act = depthToY(f.to);

            const y1_glk07 = depthToY(f.from + glk07Shift);
            const y2_glk07 = depthToY(f.to + glk07Shift);

            const y1_glk05 = depthToY(f.from + glk05Shift);
            const y2_glk05 = depthToY(f.to + glk05Shift);

            const y1_glk02 = depthToY(f.from + glk02Shift);
            const y2_glk02 = depthToY(f.to + glk02Shift);

            const isHovered = hoveredFormation === f.name;

            return (
              <g key={`tie-${f.name}`}>
                {/* Ribbon 1: Active to GLK-07 */}
                <polygon
                  points={`
                    ${colX.active + colWidth},${y1_act}
                    ${colX.glk07},${y1_glk07}
                    ${colX.glk07},${y2_glk07}
                    ${colX.active + colWidth},${y2_act}
                  `}
                  fill={f.colorDark}
                  opacity={isHovered ? 0.45 : 0.18}
                  className="transition-opacity duration-200"
                />
                {/* Top boundary tie-line */}
                <line
                  x1={colX.active + colWidth}
                  y1={y1_act}
                  x2={colX.glk07}
                  y2={y1_glk07}
                  stroke={f.borderDark}
                  strokeWidth={isHovered ? 2 : 1}
                  opacity={isHovered ? 0.9 : 0.4}
                />

                {/* Ribbon 2: GLK-07 to GLK-05 */}
                <polygon
                  points={`
                    ${colX.glk07 + colWidth},${y1_glk07}
                    ${colX.glk05},${y1_glk05}
                    ${colX.glk05},${y2_glk05}
                    ${colX.glk07 + colWidth},${y2_glk07}
                  `}
                  fill={f.colorDark}
                  opacity={isHovered ? 0.45 : 0.18}
                  className="transition-opacity duration-200"
                />
                <line
                  x1={colX.glk07 + colWidth}
                  y1={y1_glk07}
                  x2={colX.glk05}
                  y2={y1_glk05}
                  stroke={f.borderDark}
                  strokeWidth={isHovered ? 2 : 1}
                  opacity={isHovered ? 0.9 : 0.4}
                />

                {/* Ribbon 3: GLK-05 to GLK-02 (Across Fault) */}
                <polygon
                  points={`
                    ${colX.glk05 + colWidth},${y1_glk05}
                    ${colX.glk02},${y1_glk02}
                    ${colX.glk02},${y2_glk02}
                    ${colX.glk05 + colWidth},${y2_glk05}
                  `}
                  fill={f.colorDark}
                  opacity={isHovered ? 0.45 : 0.15}
                  className="transition-opacity duration-200"
                />
                <line
                  x1={colX.glk05 + colWidth}
                  y1={y1_glk05}
                  x2={colX.glk02}
                  y2={y1_glk02}
                  stroke={f.borderDark}
                  strokeWidth={isHovered ? 2 : 1}
                  opacity={isHovered ? 0.9 : 0.35}
                />
              </g>
            );
          })}

          {/* ── 3. Well 1: Active Well OIL-GLK-14 Column ── */}
          <g>
            {/* Column Background */}
            <rect
              x={colX.active}
              y={topPadding}
              width={colWidth}
              height={usableHeight}
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="1.5"
              rx="6"
            />

            {/* Formation Intervals */}
            {activeFormations.map((f) => {
              const y1 = depthToY(f.from);
              const y2 = depthToY(f.to);
              const h = y2 - y1;
              if (h <= 0) return null;
              const isHovered = hoveredFormation === f.name;

              return (
                <g 
                  key={`act-${f.name}`}
                  onMouseEnter={() => setHoveredFormation(f.name)}
                  onMouseLeave={() => setHoveredFormation(null)}
                  className="cursor-pointer"
                >
                  <rect
                    x={colX.active}
                    y={y1}
                    width={colWidth}
                    height={h}
                    fill={f.colorDark}
                    stroke={isHovered ? '#f59e0b' : f.borderDark}
                    strokeWidth={isHovered ? 2 : 1}
                    opacity={0.9}
                  />
                  {/* Formation Name */}
                  {h > 18 && (
                    <text
                      x={colX.active + 6}
                      y={y1 + 13}
                      fontSize="9.5"
                      fontWeight="bold"
                      fill="#ffffff"
                      fontFamily="monospace"
                    >
                      {f.name.split(' ')[0]} {f.name.split(' ')[1] || ''}
                    </text>
                  )}
                  {h > 32 && (
                    <text
                      x={colX.active + 6}
                      y={y1 + 25}
                      fontSize="8"
                      fill="#94a3b8"
                      fontFamily="monospace"
                    >
                      {f.from}m–{f.to}m
                    </text>
                  )}
                </g>
              );
            })}

            {/* Loss Horizon Hazard Zone Stripe in Upper Tipam */}
            <rect
              x={colX.active}
              y={depthToY(2180.0)}
              width={colWidth}
              height={depthToY(2350.0) - depthToY(2180.0)}
              fill="url(#hazardStripeRed)"
              stroke="#ef4444"
              strokeWidth="1"
              strokeDasharray="4 2"
            />

            {/* Mandatory Action Trigger Depth Marker (2,180m) */}
            <g>
              <line
                x1={colX.active}
                y1={triggerY}
                x2={colX.active + colWidth}
                y2={triggerY}
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
              <rect
                x={colX.active + 4}
                y={triggerY - 14}
                width={colWidth - 8}
                height={13}
                rx="3"
                fill="#78350f"
                stroke="#f59e0b"
                strokeWidth="1"
              />
              <text
                x={colX.active + colWidth / 2}
                y={triggerY - 4.5}
                textAnchor="middle"
                fontSize="7.5"
                fontFamily="monospace"
                fontWeight="bold"
                fill="#fef3c7"
              >
                ACTION TRIGGER: 2,180m (14.6m)
              </text>
            </g>

            {/* ACTIVE BIT POSITION CURSOR (2,165.4m) */}
            <g filter="url(#bitGlow)">
              <line
                x1={colX.active - 15}
                y1={activeY}
                x2={colX.active + colWidth + 15}
                y2={activeY}
                stroke="#ea580c"
                strokeWidth="3"
              />
              {/* Bit Indicator Flag */}
              <rect
                x={colX.active + 6}
                y={activeY - 18}
                width={colWidth - 12}
                height={16}
                rx="3"
                fill="#ea580c"
              />
              <text
                x={colX.active + colWidth / 2}
                y={activeY - 6.5}
                textAnchor="middle"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                fill="#ffffff"
              >
                BIT: {currentDepthMD}m MD
              </text>
              {/* Beacon Pulse Point */}
              <circle cx={colX.active - 6} cy={activeY} r="4" fill="#ea580c" />
            </g>
          </g>

          {/* ── 4. Well 2: Best Analog OIL-GLK-07 Column ── */}
          <g>
            <rect
              x={colX.glk07}
              y={topPadding}
              width={colWidth}
              height={usableHeight}
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="1.5"
              rx="6"
            />

            {/* Formation Intervals with +18m shift */}
            {activeFormations.map((f) => {
              const y1 = depthToY(f.from + glk07Shift);
              const y2 = depthToY(f.to + glk07Shift);
              const h = y2 - y1;
              if (h <= 0) return null;
              const isHovered = hoveredFormation === f.name;

              return (
                <g 
                  key={`glk07-${f.name}`}
                  onMouseEnter={() => setHoveredFormation(f.name)}
                  onMouseLeave={() => setHoveredFormation(null)}
                  className="cursor-pointer"
                >
                  <rect
                    x={colX.glk07}
                    y={y1}
                    width={colWidth}
                    height={h}
                    fill={f.colorDark}
                    stroke={isHovered ? '#f59e0b' : f.borderDark}
                    strokeWidth={isHovered ? 2 : 1}
                    opacity={0.8}
                  />
                  {h > 18 && (
                    <text
                      x={colX.glk07 + 6}
                      y={y1 + 13}
                      fontSize="9.5"
                      fontWeight="bold"
                      fill="#e2e8f0"
                      fontFamily="monospace"
                    >
                      {f.name.split(' ')[0]} {f.name.split(' ')[1] || ''}
                    </text>
                  )}
                </g>
              );
            })}

            {/* 1996 HISTORICAL SEVERE LOSS INCIDENT at 2,280m MD */}
            <g>
              {/* Loss Interval Stripe */}
              <rect
                x={colX.glk07}
                y={glk07LossY - 12}
                width={colWidth}
                height={28}
                fill="url(#hazardStripeRed)"
                stroke="#b91c1c"
                strokeWidth="1.5"
              />
              <line
                x1={colX.glk07 - 10}
                y1={glk07LossY}
                x2={colX.glk07 + colWidth + 10}
                y2={glk07LossY}
                stroke="#ef4444"
                strokeWidth="2.5"
              />
              {/* Incident Callout Card */}
              <rect
                x={colX.glk07 + 4}
                y={glk07LossY + 4}
                width={colWidth - 8}
                height={26}
                rx="4"
                fill="#450a0a"
                stroke="#ef4444"
                strokeWidth="1"
              />
              <text
                x={colX.glk07 + colWidth / 2}
                y={glk07LossY + 15}
                textAnchor="middle"
                fontSize="7.5"
                fontFamily="monospace"
                fontWeight="bold"
                fill="#fca5a5"
              >
                1996 LOSS: 2,280m MD
              </text>
              <text
                x={colX.glk07 + colWidth / 2}
                y={glk07LossY + 25}
                textAnchor="middle"
                fontSize="7"
                fontFamily="monospace"
                fill="#fecaca"
              >
                420 bbls • MW: 10.8 ppg
              </text>
            </g>
          </g>

          {/* ── 5. Well 3: Clean Benchmark OIL-GLK-05 Column ── */}
          <g>
            <rect
              x={colX.glk05}
              y={topPadding}
              width={colWidth}
              height={usableHeight}
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="1.5"
              rx="6"
            />

            {activeFormations.map((f) => {
              const y1 = depthToY(f.from + glk05Shift);
              const y2 = depthToY(f.to + glk05Shift);
              const h = y2 - y1;
              if (h <= 0) return null;
              const isHovered = hoveredFormation === f.name;

              return (
                <g 
                  key={`glk05-${f.name}`}
                  onMouseEnter={() => setHoveredFormation(f.name)}
                  onMouseLeave={() => setHoveredFormation(null)}
                  className="cursor-pointer"
                >
                  <rect
                    x={colX.glk05}
                    y={y1}
                    width={colWidth}
                    height={h}
                    fill={f.colorDark}
                    stroke={isHovered ? '#f59e0b' : f.borderDark}
                    strokeWidth={isHovered ? 2 : 1}
                    opacity={0.8}
                  />
                  {h > 18 && (
                    <text
                      x={colX.glk05 + 6}
                      y={y1 + 13}
                      fontSize="9.5"
                      fontWeight="bold"
                      fill="#e2e8f0"
                      fontFamily="monospace"
                    >
                      {f.name.split(' ')[0]} {f.name.split(' ')[1] || ''}
                    </text>
                  )}
                </g>
              );
            })}

            {/* 2018 Clean Passage Corridor Callout */}
            <g>
              <rect
                x={colX.glk05}
                y={glk05PassY - 10}
                width={colWidth}
                height={26}
                fill="url(#cleanStripeGreen)"
                stroke="#10b981"
                strokeWidth="1.5"
              />
              <line
                x1={colX.glk05 - 10}
                y1={glk05PassY}
                x2={colX.glk05 + colWidth + 10}
                y2={glk05PassY}
                stroke="#10b981"
                strokeWidth="2.5"
              />
              <rect
                x={colX.glk05 + 4}
                y={glk05PassY + 4}
                width={colWidth - 8}
                height={26}
                rx="4"
                fill="#064e3b"
                stroke="#10b981"
                strokeWidth="1"
              />
              <text
                x={colX.glk05 + colWidth / 2}
                y={glk05PassY + 15}
                textAnchor="middle"
                fontSize="7.5"
                fontFamily="monospace"
                fontWeight="bold"
                fill="#a7f3d0"
              >
                2018 CLEAN PASS: 2,285m
              </text>
              <text
                x={colX.glk05 + colWidth / 2}
                y={glk05PassY + 25}
                textAnchor="middle"
                fontSize="7"
                fontFamily="monospace"
                fill="#d1fae5"
              >
                0 bbls lost • MW: 9.7 ppg
              </text>
            </g>
          </g>

          {/* ── 6. Well 4: Low Sim / Proximity Warning OIL-GLK-02 Column ── */}
          <g>
            <rect
              x={colX.glk02}
              y={topPadding}
              width={colWidth}
              height={usableHeight}
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="1.5"
              rx="6"
            />

            {activeFormations.map((f) => {
              const y1 = depthToY(f.from + glk02Shift);
              const y2 = depthToY(f.to + glk02Shift);
              const h = y2 - y1;
              if (h <= 0) return null;
              const isHovered = hoveredFormation === f.name;

              return (
                <g 
                  key={`glk02-${f.name}`}
                  onMouseEnter={() => setHoveredFormation(f.name)}
                  onMouseLeave={() => setHoveredFormation(null)}
                  className="cursor-pointer"
                >
                  <rect
                    x={colX.glk02}
                    y={y1}
                    width={colWidth}
                    height={h}
                    fill={f.colorDark}
                    stroke={isHovered ? '#f59e0b' : f.borderDark}
                    strokeWidth={isHovered ? 2 : 1}
                    opacity={0.8}
                  />
                  {h > 18 && (
                    <text
                      x={colX.glk02 + 6}
                      y={y1 + 13}
                      fontSize="9.5"
                      fontWeight="bold"
                      fill="#e2e8f0"
                      fontFamily="monospace"
                    >
                      {f.name.split(' ')[0]} {f.name.split(' ')[1] || ''}
                    </text>
                  )}
                </g>
              );
            })}

            {/* 1984 Barail Kick Incident at 2,740m */}
            {glk02KickY < usableHeight + topPadding && (
              <g>
                <rect
                  x={colX.glk02}
                  y={glk02KickY - 10}
                  width={colWidth}
                  height={24}
                  fill="url(#kickStripePurple)"
                  stroke="#a855f7"
                  strokeWidth="1"
                />
                <line
                  x1={colX.glk02 - 8}
                  y1={glk02KickY}
                  x2={colX.glk02 + colWidth + 8}
                  y2={glk02KickY}
                  stroke="#c084fc"
                  strokeWidth="2"
                />
                <rect
                  x={colX.glk02 + 4}
                  y={glk02KickY + 3}
                  width={colWidth - 8}
                  height={24}
                  rx="3"
                  fill="#3b0764"
                  stroke="#a855f7"
                  strokeWidth="1"
                />
                <text
                  x={colX.glk02 + colWidth / 2}
                  y={glk02KickY + 14}
                  textAnchor="middle"
                  fontSize="7.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                  fill="#e9d5ff"
                >
                  1984 KICK: 2,740m MD
                </text>
                <text
                  x={colX.glk02 + colWidth / 2}
                  y={glk02KickY + 23}
                  textAnchor="middle"
                  fontSize="7"
                  fontFamily="monospace"
                  fill="#f3e8ff"
                >
                  SICP: 480 psi (Gas Influx)
                </text>
              </g>
            )}
          </g>

          {/* ── 7. Right Track: PPFG Drilling Window Curve Track ── */}
          {showPPFG && (
            <g>
              <rect
                x={colX.ppfg}
                y={topPadding}
                width={ppfgWidth}
                height={usableHeight}
                fill="#090d16"
                stroke="#1e293b"
                strokeWidth="1.5"
                rx="6"
              />

              {/* Subsurface PPFG Axis Scale (8 to 12 ppg) */}
              <text x={colX.ppfg + 8} y={topPadding - 8} fontSize="8" fontFamily="monospace" fill="#38bdf8">
                8.0
              </text>
              <text x={colX.ppfg + ppfgWidth / 2} y={topPadding - 8} textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#e2e8f0">
                10.0 ppg
              </text>
              <text x={colX.ppfg + ppfgWidth - 8} y={topPadding - 8} textAnchor="end" fontSize="8" fontFamily="monospace" fill="#f87171">
                12.0
              </text>

              {/* PP Curve (Pore Pressure: Blue line ~8.6 - 9.2 ppg) */}
              <path
                d={`
                  M ${colX.ppfg + 25} ${topPadding}
                  L ${colX.ppfg + 30} ${depthToY(1200)}
                  L ${colX.ppfg + 38} ${depthToY(1800)}
                  L ${colX.ppfg + 42} ${depthToY(2180)}
                  L ${colX.ppfg + 48} ${depthToY(2600)}
                  L ${colX.ppfg + 72} ${depthToY(3500)}
                  L ${colX.ppfg + 92} ${depthToY(3800)}
                `}
                fill="none"
                stroke="#0284c7"
                strokeWidth="1.75"
              />

              {/* MW Planned Curve (Green line: 9.8 ppg) */}
              <line
                x1={colX.ppfg + 68}
                y1={topPadding}
                x2={colX.ppfg + 68}
                y2={topPadding + usableHeight}
                stroke="#10b981"
                strokeWidth="1.75"
                strokeDasharray="4 2"
              />

              {/* FG Curve (Fracture Gradient: Red line ~10.4 ppg, with pinch point in Upper Tipam!) */}
              <path
                d={`
                  M ${colX.ppfg + 95} ${topPadding}
                  L ${colX.ppfg + 90} ${depthToY(1200)}
                  L ${colX.ppfg + 88} ${depthToY(1800)}
                  L ${colX.ppfg + 82} ${depthToY(2280)}
                  L ${colX.ppfg + 94} ${depthToY(2600)}
                  L ${colX.ppfg + 104} ${depthToY(3500)}
                  L ${colX.ppfg + 115} ${depthToY(3800)}
                `}
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
              />

              {/* Highlight Pinch Point where GLK-07 exceeded FG */}
              <circle cx={colX.ppfg + 82} cy={glk07LossY} r="4" fill="#ef4444" />
              <text
                x={colX.ppfg + ppfgWidth - 6}
                y={glk07LossY - 4}
                textAnchor="end"
                fontSize="7.5"
                fontFamily="monospace"
                fontWeight="bold"
                fill="#f87171"
              >
                FG Breach: 10.4 ppg
              </text>

              {/* Legend in PPFG */}
              <g transform={`translate(${colX.ppfg + 10}, ${topPadding + usableHeight - 45})`}>
                <line x1="0" y1="0" x2="14" y2="0" stroke="#0284c7" strokeWidth="2" />
                <text x="18" y="3" fontSize="8" fill="#94a3b8" fontFamily="monospace">Pore Press</text>
                
                <line x1="0" y1="12" x2="14" y2="12" stroke="#10b981" strokeWidth="2" strokeDasharray="3 2" />
                <text x="18" y="15" fontSize="8" fill="#94a3b8" fontFamily="monospace">MW (9.8)</text>

                <line x1="0" y1="24" x2="14" y2="24" stroke="#ef4444" strokeWidth="2" />
                <text x="18" y="27" fontSize="8" fill="#94a3b8" fontFamily="monospace">Frac Grad</text>
              </g>
            </g>
          )}

        </svg>
      </div>

      {/* ─── Bottom Subsurface Intelligence Callout Strip ─── */}
      <div className="p-4 bg-neutral-50 dark:bg-[#0a0d14] border-t border-neutral-200 dark:border-[#1a2233] grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
        
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-neutral-500 uppercase text-[10px] block font-bold">Horizon Advance</span>
            <span className="font-extrabold text-neutral-950 dark:text-white">
              {(2280.0 - currentDepthMD).toFixed(1)}m to GLK-07 Loss
            </span>
            <p className="text-[10px] text-neutral-500">14.6m to mandatory trigger depth (2,180m)</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-neutral-500 uppercase text-[10px] block font-bold">Validated Benchmark</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">OIL-GLK-05 Practice</span>
            <p className="text-[10px] text-neutral-500">Pre-stage 35 ppb LCM pill; maintain ECD &lt; 10.2 ppg</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-neutral-500 uppercase text-[10px] block font-bold">Structural Dip Offset</span>
            <span className="font-extrabold text-neutral-950 dark:text-white">+18m Structural Dip (SE)</span>
            <p className="text-[10px] text-neutral-500">GLK-07 formation tops correlate 18m lower</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-neutral-500 uppercase text-[10px] block font-bold">Fault Disconnection</span>
            <span className="font-extrabold text-neutral-950 dark:text-white">GLK-02 Fault Boundary</span>
            <p className="text-[10px] text-neutral-500">Isolated compartment; disregard Barail kick warning</p>
          </div>
        </div>

      </div>

    </div>
  );
};
