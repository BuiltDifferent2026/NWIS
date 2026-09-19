'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  RotateCcw,
  Activity,
  ShieldAlert,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Gauge,
  ChevronDown,
  FastForward,
  Clock,
  Square,
  SkipBack,
  SkipForward,
  Layers,
  Radio,
  TrendingDown,
  TrendingUp,
  Minus,
} from 'lucide-react';
import { EvidenceInspectorDrawer } from '@/components/common/EvidenceInspectorDrawer';

interface ReplayScenario {
  id: string;
  name: string;
  field: string;
  formation: string;
  eventType: string;
  spudYear: string;
  startDepth: number;
  maxDepth: number;
  alertTriggerDepth: number;
  historicalIncidentDepth: number;
  hazardDescription: string;
  historicalNptHours: number;
  sourceDocRef: string;
  confidence: 'STRUCTURED-HIGH' | 'OCR-HIGH' | 'OCR-MEDIUM';
  fact: string;
  estimate: string;
  recommendation: string;
  cleanPassageEvidence: string;
  // Telemetry parameters for realism
  baseROP: number;
  baseTorque: number;
  baseMudWeight: number;
  baseSPP: number;
  baseFlowRate: number;
  hazardROP: number;
  hazardTorque: number;
  hazardMudWeight: number;
}

const REPLAY_SCENARIOS: ReplayScenario[] = [
  {
    id: 'well-glk-07',
    name: 'OIL-GLK-07',
    field: 'Geleki',
    formation: 'Upper Tipam Sandstone',
    eventType: 'Lost Circulation / Severe Thief Zone',
    spudYear: '1996',
    startDepth: 2120,
    maxDepth: 2360,
    alertTriggerDepth: 2205,
    historicalIncidentDepth: 2280,
    hazardDescription: 'Severe lost circulation (35 m³/hr) under excessive ECD in micro-fractured Tipam sand.',
    historicalNptHours: 34,
    sourceDocRef: 'WCR-GLK-07-1996 · Page 19',
    confidence: 'OCR-HIGH',
    fact: 'In 1996, OIL-GLK-07 drilled through Upper Tipam without lookahead intelligence and suffered sudden total lost circulation at 2,280m MD, losing 18 m³ pit volume and 34 NPT hours.',
    estimate: 'Formation-relative correlation indicates entry into high-permeability thief sandstone at 2,280m MD. If ECD exceeds 10.4 ppg, immediate mud loss is 78% probable.',
    recommendation: 'Pre-treat active system with 35 ppb mixed-fiber LCM pill prior to 2,190m MD. Cap ECD at 10.4 ppg. Maintain secondary squeeze pill on deck.',
    cleanPassageEvidence: '4 offset wells (OIL-GLK-11, OIL-GLK-09) traversed past 2,280m MD safely with zero losses by capping ECD at 10.2 ppg.',
    baseROP: 14.8, baseTorque: 11.2, baseMudWeight: 10.2, baseSPP: 2840, baseFlowRate: 890,
    hazardROP: 4.5, hazardTorque: 17.8, hazardMudWeight: 10.4,
  },
  {
    id: 'well-glk-03',
    name: 'OIL-GLK-03',
    field: 'Geleki',
    formation: 'Upper Tipam Sandstone',
    eventType: 'Moderate Mud Loss',
    spudYear: '1988',
    startDepth: 2060,
    maxDepth: 2300,
    alertTriggerDepth: 2140,
    historicalIncidentDepth: 2215,
    hazardDescription: 'Moderate fluid loss (22 m³/hr) upon penetrating unsealed sand-shale boundary.',
    historicalNptHours: 18,
    sourceDocRef: 'WCR-GLK-03-1988 · Page 42',
    confidence: 'STRUCTURED-HIGH',
    fact: 'OIL-GLK-03 experienced 22 m³/hr mud loss at 2,215m MD. Operations stalled for 18 hours to mix and spot 30 ppb calcium carbonate and mica pill.',
    estimate: 'Proximity model indicates upper boundary of fractured sandstone interval within 75m. Formation pressure test predicts 0.44 psi/ft fracture gradient.',
    recommendation: 'Spot 25 bbl medium-particle LCM pill in suction pit before 2,150m. Reduce flow rate by 15% to mitigate annular pressure spikes.',
    cleanPassageEvidence: '2 offset wells passed this sub-interval with zero fluid loss after using fine CaCO3 pre-treatment.',
    baseROP: 16.2, baseTorque: 10.8, baseMudWeight: 10.0, baseSPP: 2750, baseFlowRate: 920,
    hazardROP: 7.2, hazardTorque: 14.5, hazardMudWeight: 10.3,
  },
  {
    id: 'well-glk-09',
    name: 'OIL-GLK-09',
    field: 'Geleki',
    formation: 'Barail Group (Coal-Shale)',
    eventType: 'High-Pressure Gas Kick',
    spudYear: '2004',
    startDepth: 2580,
    maxDepth: 2820,
    alertTriggerDepth: 2665,
    historicalIncidentDepth: 2740,
    hazardDescription: 'Gas influx (480 psi SICP) requiring well shut-in and weight-up to 11.6 ppg.',
    historicalNptHours: 52,
    sourceDocRef: 'DDR-GLK-09-2004-DAY68',
    confidence: 'OCR-HIGH',
    fact: 'Severe gas kick encountered at 2,740m MD in Barail Coal seam. Dynamic shut-in with 480 psi on drillpipe; 52 hours NPT incurred while circulating influx via choke manifold.',
    estimate: 'Barail Coal interval contains isolated high-pressure pocket (estimated pore pressure 11.2 ppg equivalent). Gas detection index elevated in offset OIL-GLK-02.',
    recommendation: 'Perform slow pump rate check at 2,640m. Stage barite weighting material to increase mud weight from 10.6 to 11.2 ppg before 2,660m.',
    cleanPassageEvidence: 'OIL-GLK-14 successfully drilled this horizon at 11.3 ppg with zero influx.',
    baseROP: 8.5, baseTorque: 15.4, baseMudWeight: 10.6, baseSPP: 3100, baseFlowRate: 780,
    hazardROP: 1.2, hazardTorque: 24.5, hazardMudWeight: 11.6,
  },
  {
    id: 'well-dgb-19',
    name: 'OIL-DGB-19',
    field: 'Digboi',
    formation: 'Digboi Sandstone',
    eventType: 'Depleted Reservoir Severe Loss',
    spudYear: '1972',
    startDepth: 1180,
    maxDepth: 1420,
    alertTriggerDepth: 1265,
    historicalIncidentDepth: 1340,
    hazardDescription: 'Total loss into depleted pressure sink (< 7.2 ppg pore pressure).',
    historicalNptHours: 41,
    sourceDocRef: 'WCR-DGB-19-1972 · Archival Scan',
    confidence: 'OCR-MEDIUM',
    fact: 'In 1972, DGB-19 suffered catastrophic losses into depleted crestal sand at 1,340m MD. Complete mud column loss; 41 NPT hours to cure with cement plugs.',
    estimate: 'Historical production records show this fault compartment was heavily depleted by 1968. Fracture gradient reduced to 9.2 ppg.',
    recommendation: 'Switch to low-density mud system (8.8 ppg) with pre-mixed cross-linked polymer pill before 1,280m MD.',
    cleanPassageEvidence: 'Recent infill wells DGB-44 and DGB-51 used aerated mud to drill through depleted zone with zero losses.',
    baseROP: 12.0, baseTorque: 9.8, baseMudWeight: 9.4, baseSPP: 2400, baseFlowRate: 850,
    hazardROP: 3.0, hazardTorque: 16.0, hazardMudWeight: 9.8,
  },
];

// Sparkline SVG bar component
function SparkBar({ values, color, height = 24 }: { values: number[]; color: string; height?: number }) {
  if (!values.length) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return (
    <svg className="w-full h-full" preserveAspectRatio="none" viewBox={`0 0 ${values.length * 3} ${height}`}>
      {values.map((v, i) => {
        const h = Math.max(2, ((v - min) / range) * (height - 4));
        return (
          <rect
            key={i}
            x={i * 3}
            y={height - h}
            width={2}
            height={h}
            fill={color}
            opacity={0.8}
          />
        );
      })}
    </svg>
  );
}

// Circular gauge SVG component
function ArcGauge({
  value,
  min,
  max,
  label,
  unit,
  colorClass,
  warning,
}: {
  value: number;
  min: number;
  max: number;
  label: string;
  unit: string;
  colorClass: string;
  warning?: boolean;
}) {
  const pct = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const r = 34;
  const cx = 44;
  const cy = 44;

  const arcPath = (fromDeg: number, toDeg: number, radius: number) => {
    const from = { x: cx + radius * Math.cos(fromDeg * Math.PI / 180), y: cy + radius * Math.sin(fromDeg * Math.PI / 180) };
    const to = { x: cx + radius * Math.cos(toDeg * Math.PI / 180), y: cy + radius * Math.sin(toDeg * Math.PI / 180) };
    const large = Math.abs(toDeg - fromDeg) > 180 ? 1 : 0;
    return `M ${from.x} ${from.y} A ${radius} ${radius} 0 ${large} 1 ${to.x} ${to.y}`;
  };

  const fillColor = warning ? '#EF4444' : colorClass === 'amber' ? '#F59E0B' : colorClass === 'emerald' ? '#10B981' : '#38BDF8';

  return (
    <div className="flex flex-col items-center">
      <svg width={88} height={64} viewBox="0 0 88 72">
        {/* Background arc */}
        <path
          d={arcPath(-120, 120, r)}
          fill="none"
          stroke="currentColor"
          className="text-neutral-200 dark:text-[#1e2a3a]"
          strokeWidth={6}
          strokeLinecap="round"
        />
        {/* Fill arc */}
        <path
          d={arcPath(-120, -120 + pct * 240, r)}
          fill="none"
          stroke={fillColor}
          strokeWidth={6}
          strokeLinecap="round"
          style={{ transition: 'all 0.3s ease' }}
        />
        {/* Center value */}
        <text 
          x={cx} 
          y={cy + 4} 
          textAnchor="middle" 
          className="fill-neutral-950 dark:fill-white font-bold font-mono text-[11px]"
        >
          {value.toFixed(1)}
        </text>
        <text 
          x={cx} 
          y={cy + 16} 
          textAnchor="middle" 
          className="fill-neutral-500 dark:fill-neutral-400 font-mono text-[8px]"
        >
          {unit}
        </text>
      </svg>
      <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mt-0.5">{label}</span>
    </div>
  );
}

export default function WellReplayPage() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('well-glk-07');
  const scenario = REPLAY_SCENARIOS.find((s) => s.id === selectedScenarioId) || REPLAY_SCENARIOS[0];

  const [currentDepth, setCurrentDepth] = useState<number>(scenario.startDepth);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(5);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState<boolean>(false);

  // History buffer for sparklines — rolling 48 samples
  const [ropHistory, setRopHistory] = useState<number[]>(Array(48).fill(scenario.baseROP));
  const [torqueHistory, setTorqueHistory] = useState<number[]>(Array(48).fill(scenario.baseTorque));
  const [sppHistory, setSppHistory] = useState<number[]>(Array(48).fill(scenario.baseSPP));

  const handleScenarioChange = (id: string) => {
    setSelectedScenarioId(id);
    const target = REPLAY_SCENARIOS.find((s) => s.id === id) || REPLAY_SCENARIOS[0];
    setCurrentDepth(target.startDepth);
    setIsPlaying(false);
    setRopHistory(Array(48).fill(target.baseROP));
    setTorqueHistory(Array(48).fill(target.baseTorque));
    setSppHistory(Array(48).fill(target.baseSPP));
  };

  const isAlertFired = currentDepth >= scenario.alertTriggerDepth;
  const isPastIncident = currentDepth >= scenario.historicalIncidentDepth;
  const distanceToIncident = Math.max(0, Math.round((scenario.historicalIncidentDepth - currentDepth) * 10) / 10);
  const progressPct = ((currentDepth - scenario.startDepth) / (scenario.maxDepth - scenario.startDepth)) * 100;

  // Simulated telemetry — realistic noise + state transitions
  const noise = (base: number, pct = 0.04) => base * (1 + (Math.random() - 0.5) * 2 * pct);
  const simulatedROP = isPastIncident ? noise(scenario.hazardROP, 0.12) : isAlertFired ? noise((scenario.baseROP + scenario.hazardROP) / 2, 0.08) : noise(scenario.baseROP, 0.05);
  const simulatedTorque = isPastIncident ? noise(scenario.hazardTorque, 0.1) : isAlertFired ? noise((scenario.baseTorque + scenario.hazardTorque) / 2, 0.06) : noise(scenario.baseTorque, 0.04);
  const simulatedMW = isAlertFired ? noise(scenario.hazardMudWeight, 0.02) : noise(scenario.baseMudWeight, 0.01);
  const simulatedSPP = isPastIncident ? noise(scenario.baseSPP * 0.65, 0.08) : isAlertFired ? noise(scenario.baseSPP * 0.92, 0.04) : noise(scenario.baseSPP, 0.03);
  const simulatedFlowRate = isPastIncident ? noise(scenario.baseFlowRate * 0.55, 0.1) : noise(scenario.baseFlowRate, 0.02);
  const simulatedWOB = isPastIncident ? noise(8.2, 0.15) : noise(16.8, 0.06);
  const simulatedRPM = isPastIncident ? noise(48, 0.1) : noise(120, 0.03);
  const simulatedECD = noise(simulatedMW * 1.018, 0.01);
  const pitVolume = isPastIncident ? noise(scenario.baseFlowRate * 0.38, 0.12) : noise(scenario.baseFlowRate * 0.98, 0.02);

  // Timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentDepth((prev) => {
          if (prev >= scenario.maxDepth) {
            setIsPlaying(false);
            return scenario.maxDepth;
          }
          const next = Math.round((prev + playbackSpeed * 0.4) * 10) / 10;
          // Update spark histories
          setRopHistory((h) => [...h.slice(-47), simulatedROP]);
          setTorqueHistory((h) => [...h.slice(-47), simulatedTorque]);
          setSppHistory((h) => [...h.slice(-47), simulatedSPP]);
          return next;
        });
      }, 120);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, scenario.maxDepth, simulatedROP, simulatedTorque, simulatedSPP]);

  const statusPhase: 'safe' | 'warning' | 'incident' = isPastIncident ? 'incident' : isAlertFired ? 'warning' : 'safe';

  const phaseColors = {
    safe:     { border: 'border-emerald-300 dark:border-[#1a2a1a]', dot: 'bg-emerald-500', label: 'SAFE ZONE', labelColor: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50/70 dark:bg-[#0c1219]' },
    warning:  { border: 'border-amber-400 dark:border-amber-500/60', dot: 'bg-amber-500', label: 'ADVISORY ACTIVE', labelColor: 'text-amber-800 dark:text-amber-400', bg: 'bg-amber-50/80 dark:bg-amber-950/15' },
    incident: { border: 'border-rose-400 dark:border-rose-500/70', dot: 'bg-rose-500', label: 'INCIDENT HORIZON', labelColor: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-50/80 dark:bg-rose-950/15' },
  };
  const phase = phaseColors[statusPhase];

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-12 font-mono animate-in fade-in duration-150">

      {/* ════════════════════════════════════════════════════════
          TOP HEADER — Console Title + Scenario Selector
      ════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Historical Well Replay Simulator
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Proactive advisory lookahead — 75m MD before historical hazard depth
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Scenario selector */}
          <label className="text-xs font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider shrink-0 font-bold">
            Scenario:
          </label>
          <div className="relative">
            <select
              value={selectedScenarioId}
              onChange={(e) => handleScenarioChange(e.target.value)}
              className="appearance-none bg-white dark:bg-[#111823] border border-neutral-300 dark:border-[#1e2a3a] text-neutral-900 dark:text-neutral-200 text-xs font-mono px-3 py-1.5 pr-7 rounded-xl focus:outline-hidden focus:border-amber-500 cursor-pointer shadow-2xs"
            >
              {REPLAY_SCENARIOS.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name} — {sc.eventType}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          MAIN CONSOLE — 3-COLUMN LAYOUT
      ════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

        {/* ── COL 1: Depth Track + Formation Column (3 cols) ── */}
        <div className="xl:col-span-3 flex flex-col gap-4">

          {/* Bit Depth + Progress */}
          <div className="rounded-2xl border border-neutral-200 dark:border-[#1a2333] bg-white dark:bg-[#0b0f17] p-4 space-y-3 shadow-xs transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-bold">
                Current Bit Depth
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                statusPhase === 'incident' ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800' :
                statusPhase === 'warning' ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800' :
                'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              }`}>
                {phase.label}
              </span>
            </div>

            <div className="text-center py-2">
              <div className="text-4xl font-extrabold text-neutral-950 dark:text-white tabular-nums tracking-tight">
                {currentDepth.toFixed(1)}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-bold">m MD</div>
            </div>

            {/* Depth progress track */}
            <div className="space-y-1.5">
              <div className="relative h-2.5 rounded-full bg-neutral-200 dark:bg-[#141c27] overflow-hidden border border-neutral-300 dark:border-neutral-700/50">
                {/* Alert zone marker */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-amber-500"
                  style={{ left: `${((scenario.alertTriggerDepth - scenario.startDepth) / (scenario.maxDepth - scenario.startDepth)) * 100}%` }}
                />
                {/* Incident zone marker */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-rose-500"
                  style={{ left: `${((scenario.historicalIncidentDepth - scenario.startDepth) / (scenario.maxDepth - scenario.startDepth)) * 100}%` }}
                />
                {/* Progress */}
                <div
                  className={`h-full rounded-full transition-all duration-200 ${
                    statusPhase === 'incident' ? 'bg-rose-500' :
                    statusPhase === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-neutral-500 dark:text-neutral-400 font-bold">
                <span>{scenario.startDepth}m</span>
                <span className="text-amber-700 dark:text-amber-400">ADV {scenario.alertTriggerDepth}m</span>
                <span className="text-rose-700 dark:text-rose-400">{scenario.historicalIncidentDepth}m</span>
                <span>TD {scenario.maxDepth}m</span>
              </div>
            </div>

            {/* Distance to incident */}
            <div className={`rounded-xl p-3 text-center border ${
              isPastIncident ? 'border-rose-300 dark:border-rose-500/30 bg-rose-50/80 dark:bg-rose-950/20' :
              isAlertFired  ? 'border-amber-300 dark:border-amber-500/30 bg-amber-50/80 dark:bg-amber-950/15' :
              'border-neutral-200 dark:border-[#1a2333] bg-neutral-50 dark:bg-[#0e1520]'
            }`}>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1 font-bold">
                Δ to Incident Depth
              </div>
              <div className={`text-2xl font-extrabold tabular-nums ${
                isPastIncident ? 'text-rose-600 dark:text-rose-400' :
                isAlertFired  ? 'text-amber-700 dark:text-amber-400' : 'text-neutral-900 dark:text-neutral-300'
              }`}>
                {isPastIncident
                  ? `+${(currentDepth - scenario.historicalIncidentDepth).toFixed(1)}`
                  : distanceToIncident.toFixed(1)}
                <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400 ml-1">m</span>
              </div>
              <div className="text-[10px] text-neutral-600 dark:text-neutral-400 mt-0.5 font-bold">
                {isPastIncident ? 'Past incident horizon' : isAlertFired ? 'LOOKAHEAD BUFFER ACTIVE' : 'Formation safe corridor'}
              </div>
            </div>
          </div>

          {/* Formation / Lithology Column */}
          <div className="rounded-2xl border border-neutral-200 dark:border-[#1a2333] bg-white dark:bg-[#0b0f17] p-4 space-y-3 flex-1 shadow-xs transition-colors">
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-bold">Formation Log</div>

            <div className="space-y-2">
              {/* Simulated formation zones */}
              {[
                { name: 'Alluvium / Overburden', depth: `${scenario.startDepth - 200}–${scenario.startDepth}m`, color: '#8B7355', opacity: 0.8 },
                { name: scenario.formation.split(' ').slice(0, 2).join(' '), depth: `${scenario.startDepth}–${scenario.alertTriggerDepth}m`, color: '#F59E0B', opacity: 0.9 },
                { name: '⚠ Hazard Zone', depth: `${scenario.alertTriggerDepth}–${scenario.historicalIncidentDepth}m`, color: '#EF4444', opacity: 0.95 },
                { name: 'Sub-formation', depth: `${scenario.historicalIncidentDepth}–${scenario.maxDepth}m`, color: '#6B7280', opacity: 0.7 },
              ].map((zone, i) => {
                const zoneStart = [scenario.startDepth - 200, scenario.startDepth, scenario.alertTriggerDepth, scenario.historicalIncidentDepth][i];
                const zoneEnd = [scenario.startDepth, scenario.alertTriggerDepth, scenario.historicalIncidentDepth, scenario.maxDepth][i];
                const isActive = currentDepth >= zoneStart && currentDepth < zoneEnd;
                const isPast = currentDepth >= zoneEnd;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${
                      isActive
                        ? 'border-amber-400 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/20 shadow-xs'
                        : isPast
                        ? 'border-neutral-200 dark:border-[#151e2a] bg-neutral-100/60 dark:bg-[#0d1320] opacity-70'
                        : 'border-neutral-200 dark:border-[#1a2333] bg-neutral-50 dark:bg-[#0e1520]'
                    }`}
                  >
                    <div
                      className="w-3 h-10 rounded-xs shrink-0"
                      style={{ backgroundColor: zone.color, opacity: zone.opacity }}
                    />
                    <div>
                      <div className={`text-[11px] font-bold ${isActive ? 'text-amber-800 dark:text-amber-300' : 'text-neutral-800 dark:text-neutral-300'}`}>
                        {isActive && <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1 animate-pulse" />}
                        {zone.name}
                      </div>
                      <div className="text-[9px] text-neutral-500 dark:text-neutral-400 mt-0.5 font-mono">{zone.depth}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Provenance tag */}
            <div className="pt-2 border-t border-neutral-200 dark:border-[#1a2333] text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
              <span>{scenario.sourceDocRef}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                scenario.confidence === 'STRUCTURED-HIGH' ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' :
                scenario.confidence === 'OCR-HIGH' ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800' :
                'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}>{scenario.confidence}</span>
            </div>
          </div>
        </div>

        {/* ── COL 2: Live Telemetry Gauges + Log Strips (5 cols) ── */}
        <div className="xl:col-span-5 flex flex-col gap-4">

          {/* ARC GAUGES PANEL */}
          <div className="rounded-2xl border border-neutral-200 dark:border-[#1a2333] bg-white dark:bg-[#0b0f17] p-4 shadow-xs transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                Live Replay Telemetry
              </span>
              <span className="text-[10px] text-neutral-600 dark:text-neutral-400 tabular-nums font-bold">
                {scenario.name} · {scenario.field} Field
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <ArcGauge value={simulatedROP}    min={0}   max={25}   label="ROP"    unit="m/h"   colorClass="emerald" warning={simulatedROP < 5} />
              <ArcGauge value={simulatedTorque}  min={5}   max={30}   label="TORQUE" unit="kft·lb" colorClass="amber"   warning={simulatedTorque > 20} />
              <ArcGauge value={simulatedMW}      min={8.5} max={14}   label="MWT IN" unit="ppg"   colorClass="blue"    warning={simulatedMW > 12} />
              <ArcGauge value={simulatedWOB}     min={0}   max={30}   label="WOB"    unit="klbs"  colorClass="amber"   warning={simulatedWOB < 10} />
            </div>
          </div>

          {/* MULTI-CHANNEL LOG STRIP */}
          <div className="rounded-2xl border border-neutral-200 dark:border-[#1a2333] bg-white dark:bg-[#0b0f17] p-4 flex-1 space-y-3 shadow-xs transition-colors">
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-bold">
              Channel Trend Logs
            </div>

            {/* ROP Channel */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span className="text-neutral-800 dark:text-neutral-300 font-bold">ROP</span>
                  <span className="text-neutral-500 dark:text-neutral-400">Rate of Penetration</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200 tabular-nums">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{simulatedROP.toFixed(1)}</span>
                  <span className="text-neutral-500">m/h</span>
                  {simulatedROP < scenario.baseROP * 0.6
                    ? <TrendingDown className="w-3 h-3 text-rose-500" />
                    : <TrendingUp className="w-3 h-3 text-emerald-500" />}
                </div>
              </div>
              <div className="h-7 bg-neutral-100 dark:bg-[#0e1520] rounded-lg border border-neutral-200 dark:border-[#1a2333] overflow-hidden">
                <SparkBar values={ropHistory} color="#10B981" height={28} />
              </div>
            </div>

            {/* Torque Channel */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  <span className="text-neutral-800 dark:text-neutral-300 font-bold">TORQUE</span>
                  <span className="text-neutral-500 dark:text-neutral-400">Rotary Torque</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200 tabular-nums">
                  <span className={`font-bold ${simulatedTorque > 20 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>{simulatedTorque.toFixed(1)}</span>
                  <span className="text-neutral-500">kft·lb</span>
                  {simulatedTorque > scenario.baseTorque * 1.3
                    ? <TrendingUp className="w-3 h-3 text-rose-500" />
                    : <Minus className="w-3 h-3 text-neutral-400" />}
                </div>
              </div>
              <div className="h-7 bg-neutral-100 dark:bg-[#0e1520] rounded-lg border border-neutral-200 dark:border-[#1a2333] overflow-hidden">
                <SparkBar values={torqueHistory} color="#F59E0B" height={28} />
              </div>
            </div>

            {/* SPP Channel */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                  <span className="text-neutral-800 dark:text-neutral-300 font-bold">SPP</span>
                  <span className="text-neutral-500 dark:text-neutral-400">Standpipe Pressure</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200 tabular-nums">
                  <span className={`font-bold ${simulatedSPP < scenario.baseSPP * 0.7 ? 'text-rose-600 dark:text-rose-400' : 'text-blue-600 dark:text-blue-400'}`}>
                    {Math.round(simulatedSPP)}
                  </span>
                  <span className="text-neutral-500">psi</span>
                  {simulatedSPP < scenario.baseSPP * 0.8
                    ? <TrendingDown className="w-3 h-3 text-rose-500" />
                    : <Minus className="w-3 h-3 text-neutral-400" />}
                </div>
              </div>
              <div className="h-7 bg-neutral-100 dark:bg-[#0e1520] rounded-lg border border-neutral-200 dark:border-[#1a2333] overflow-hidden">
                <SparkBar values={sppHistory} color="#3B82F6" height={28} />
              </div>
            </div>

            {/* Secondary KPIs grid */}
            <div className="pt-3 border-t border-neutral-200 dark:border-[#1a2333] grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'RPM', value: simulatedRPM.toFixed(0), unit: 'rpm', warn: simulatedRPM < 60 },
                { label: 'FLOW RATE', value: Math.round(simulatedFlowRate).toString(), unit: 'l/min', warn: simulatedFlowRate < scenario.baseFlowRate * 0.65 },
                { label: 'ECD', value: simulatedECD.toFixed(2), unit: 'ppg', warn: simulatedECD > 10.5 },
              ].map(({ label, value, unit, warn }) => (
                <div key={label} className={`rounded-xl p-2 border ${warn ? 'border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-950/15' : 'border-neutral-200 dark:border-[#1a2333] bg-neutral-50 dark:bg-[#0e1520]'}`}>
                  <div className="text-[9px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-bold">{label}</div>
                  <div className={`text-sm font-extrabold tabular-nums mt-0.5 ${warn ? 'text-rose-600 dark:text-rose-400' : 'text-neutral-900 dark:text-neutral-100'}`}>{value}</div>
                  <div className="text-[9px] text-neutral-500">{unit}</div>
                </div>
              ))}
            </div>

            {/* Pit volume (key indicator for lost circ) */}
            <div className="rounded-xl border border-neutral-200 dark:border-[#1a2333] bg-neutral-50 dark:bg-[#0e1520] p-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-bold">Active Pit Volume</span>
                <span className={`text-[10px] font-bold ${pitVolume < scenario.baseFlowRate * 0.6 ? 'text-rose-600 dark:text-rose-400' : 'text-neutral-700 dark:text-neutral-300'}`}>
                  {(pitVolume * 0.2).toFixed(0)} m³
                </span>
              </div>
              <div className="relative h-2 bg-neutral-200 dark:bg-[#141c27] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${pitVolume < scenario.baseFlowRate * 0.6 ? 'bg-rose-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(100, (pitVolume / scenario.baseFlowRate) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* PLAYBACK CONTROL DECK */}
          <div className="rounded-2xl border border-neutral-200 dark:border-[#1a2333] bg-white dark:bg-[#0b0f17] p-4 shadow-xs transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Primary Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentDepth(scenario.startDepth)}
                  className="w-8 h-8 rounded-xl border border-neutral-200 dark:border-[#1e2a3a] bg-neutral-100 dark:bg-[#0d1320] flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                  title="Reset to start"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all cursor-pointer shadow-md ${
                    isPlaying
                      ? 'bg-amber-600 text-neutral-950 hover:bg-amber-500'
                      : 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentDepth(scenario.maxDepth)}
                  className="w-8 h-8 rounded-xl border border-neutral-200 dark:border-[#1e2a3a] bg-neutral-100 dark:bg-[#0d1320] flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                  title="Skip to end"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>

                {/* Step controls */}
                <div className="flex items-center gap-1 ml-1">
                  <button
                    type="button"
                    onClick={() => setCurrentDepth((p) => Math.max(scenario.startDepth, Math.round((p - 10) * 10) / 10))}
                    className="px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-[#1e2a3a] bg-neutral-100 dark:bg-[#0d1320] text-neutral-700 dark:text-neutral-400 text-[10px] hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer font-bold"
                  >
                    −10m
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentDepth((p) => Math.min(scenario.maxDepth, Math.round((p + 10) * 10) / 10))}
                    className="px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-[#1e2a3a] bg-neutral-100 dark:bg-[#0d1320] text-neutral-700 dark:text-neutral-400 text-[10px] hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer font-bold"
                  >
                    +10m
                  </button>
                </div>
              </div>

              {/* Speed selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mr-1 font-bold">Speed</span>
                {[1, 5, 10, 20].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      playbackSpeed === spd
                        ? 'bg-amber-500/20 text-amber-800 dark:text-amber-400 border border-amber-500/50'
                        : 'border border-neutral-200 dark:border-[#1e2a3a] text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                    }`}
                  >
                    {spd}×
                  </button>
                ))}
              </div>
            </div>

            {/* Scrub slider */}
            <div className="mt-3">
              <input
                type="range"
                min={scenario.startDepth}
                max={scenario.maxDepth}
                step="0.5"
                value={currentDepth}
                onChange={(e) => setCurrentDepth(parseFloat(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-amber-500 bg-neutral-200 dark:bg-[#1a2333]"
              />
            </div>
          </div>
        </div>

        {/* ── COL 3: Advisory + Evidence Panel (4 cols) ── */}
        <div className="xl:col-span-4 flex flex-col gap-4">

          {/* STATUS HEADER */}
          <div className={`rounded-2xl border-2 p-4 shadow-xs transition-colors ${phase.border} ${phase.bg}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${phase.dot} ${isAlertFired ? 'animate-pulse' : ''}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${phase.labelColor}`}>{phase.label}</span>
              </div>
              <span className="text-[10px] text-neutral-600 dark:text-neutral-400 tabular-nums font-bold">{currentDepth.toFixed(1)}m MD</span>
            </div>

            {/* Context */}
            <div className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
              {statusPhase === 'safe' && (
                <span>Monitoring <strong className="text-neutral-950 dark:text-neutral-200">{scenario.formation}</strong>. Advance to <strong className="text-amber-700 dark:text-amber-400">{scenario.alertTriggerDepth}m MD</strong> to trigger the proactive advisory ({distanceToIncident.toFixed(0)}m ahead).</span>
              )}
              {statusPhase === 'warning' && (
                <span>Corridor watcher triggered <strong className="text-amber-700 dark:text-amber-400">{(currentDepth - scenario.alertTriggerDepth).toFixed(0)}m ago</strong>. Historical incident was at <strong className="text-rose-700 dark:text-rose-400">{scenario.historicalIncidentDepth}m</strong> — {distanceToIncident.toFixed(0)}m ahead.</span>
              )}
              {statusPhase === 'incident' && (
                <span>Historical incident horizon breached. In {scenario.spudYear}, <strong className="text-rose-700 dark:text-rose-300">{scenario.historicalNptHours} NPT hours</strong> were lost here. NWIS would have fired advisory <strong className="text-amber-700 dark:text-amber-400">{scenario.historicalIncidentDepth - scenario.alertTriggerDepth}m earlier</strong>.</span>
              )}
            </div>
          </div>

          {/* NPT SAVINGS METRIC */}
          <div className="rounded-2xl border border-neutral-200 dark:border-[#1a2333] bg-white dark:bg-[#0b0f17] p-4 flex items-center gap-4 shadow-xs transition-colors">
            <div className="w-14 h-14 rounded-full border-2 border-emerald-500/30 flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/20 shrink-0">
              <div className="text-center">
                <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 leading-none">{scenario.historicalNptHours}</div>
                <div className="text-[9px] text-emerald-700 dark:text-emerald-500 mt-0.5 font-bold">hrs</div>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-bold">NPT Saved via Lookahead</div>
              <div className="text-xs text-neutral-800 dark:text-neutral-300 mt-0.5 font-sans leading-snug">
                Historical incident cost <strong className="text-neutral-950 dark:text-white">{scenario.historicalNptHours} hrs NPT</strong>. Proactive advisory eliminated this risk window.
              </div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 font-bold">≈ ${(scenario.historicalNptHours * 14800).toLocaleString()} avoided cost</div>
            </div>
          </div>

          {/* 3-PART SEPARATION */}
          <div className={`rounded-2xl border p-4 space-y-3 flex-1 transition-all duration-300 shadow-xs ${
            isAlertFired 
              ? 'border-amber-300 dark:border-amber-500/40 bg-white dark:bg-[#0c1018]' 
              : 'border-neutral-200 dark:border-[#1a2333] bg-white dark:bg-[#0b0f17] opacity-80'
          }`}>

            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
              <AlertTriangle className={`w-3.5 h-3.5 ${isAlertFired ? 'text-amber-500' : 'text-neutral-400'}`} />
              Intelligence Separation
              {!isAlertFired && <span className="text-neutral-400 dark:text-neutral-500 text-[9px] ml-auto normal-case tracking-normal">Advance bit to activate</span>}
            </div>

            {/* 1. Ground Truth */}
            <div className="rounded-xl border border-neutral-200 dark:border-[#1a2333] bg-neutral-50 dark:bg-[#0e1520] p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">1 · Observed Ground Truth</span>
                <span className="text-[9px] text-neutral-500 font-bold">{scenario.spudYear} record</span>
              </div>
              <p className={`text-[11px] leading-relaxed font-sans ${isAlertFired ? 'text-neutral-800 dark:text-neutral-300' : 'text-neutral-600 dark:text-neutral-400'}`}>
                {scenario.fact}
              </p>
            </div>

            {/* 2. Model Estimate */}
            <div className={`rounded-xl border p-3 space-y-1.5 ${isAlertFired ? 'border-amber-300 dark:border-amber-500/20 bg-amber-50/70 dark:bg-amber-950/10' : 'border-neutral-200 dark:border-[#1a2333] bg-neutral-50 dark:bg-[#0e1520]'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-bold uppercase tracking-wider ${isAlertFired ? 'text-amber-800 dark:text-amber-400' : 'text-neutral-500'}`}>2 · Model-Estimated Risk</span>
                <span className="text-[9px] text-neutral-500 font-bold">SIMILARITY MODEL</span>
              </div>
              <p className={`text-[11px] leading-relaxed font-sans ${isAlertFired ? 'text-neutral-900 dark:text-neutral-200' : 'text-neutral-600 dark:text-neutral-400'}`}>
                {scenario.estimate}
              </p>
            </div>

            {/* 3. Mitigation */}
            <div className={`rounded-xl border p-3 space-y-1.5 ${isAlertFired ? 'border-amber-400 dark:border-amber-500/30 bg-amber-100/60 dark:bg-amber-950/20' : 'border-neutral-200 dark:border-[#1a2333] bg-neutral-50 dark:bg-[#0e1520]'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-bold uppercase tracking-wider ${isAlertFired ? 'text-amber-900 dark:text-amber-300' : 'text-neutral-500'}`}>3 · Engineering Mitigation</span>
                <span className={`text-[9px] font-bold ${isAlertFired ? 'text-amber-700 dark:text-amber-400' : 'text-neutral-500'}`}>ADVISORY ONLY</span>
              </div>
              <p className={`text-[11px] leading-relaxed font-sans font-medium ${isAlertFired ? 'text-neutral-950 dark:text-white' : 'text-neutral-600 dark:text-neutral-400'}`}>
                {scenario.recommendation}
              </p>
            </div>

            {/* Clean Pass Evidence */}
            {isAlertFired && (
              <div className="rounded-xl border border-emerald-300 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/10 p-2.5 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-neutral-800 dark:text-neutral-300 font-sans leading-relaxed">
                  <strong className="text-emerald-700 dark:text-emerald-400">Disconfirming evidence:</strong> {scenario.cleanPassageEvidence}
                </p>
              </div>
            )}
          </div>

          {/* EVIDENCE CTA */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEvidenceOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#111823] border border-neutral-200 dark:border-[#1e2a3a] hover:border-amber-500/50 text-neutral-800 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              <span>Inspect Archival WCR</span>
            </button>
            <Link
              href="/operations"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#111823] border border-neutral-200 dark:border-[#1e2a3a] hover:border-neutral-400 dark:hover:border-neutral-600 text-neutral-700 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white text-xs font-bold transition-all shadow-2xs"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>Live Ops</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Evidence Inspector Drawer */}
      <EvidenceInspectorDrawer
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
        wellName={scenario.name.split(' ')[0]}
        sourceRef={scenario.sourceDocRef}
        incidentDepth={scenario.historicalIncidentDepth}
        formationName={scenario.formation}
        confidence={scenario.confidence}
        nptHours={scenario.historicalNptHours}
        mitigationApplied={scenario.recommendation}
        narrative={scenario.fact}
      />
    </div>
  );
}
