'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  Activity,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  SkipBack,
  SkipForward,
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

function ArcGauge({
  value,
  min,
  max,
  label,
  unit,
  warning,
}: {
  value: number;
  min: number;
  max: number;
  label: string;
  unit: string;
  warning?: boolean;
}) {
  const pct = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const r = 32;
  const cx = 40;
  const cy = 40;

  const arcPath = (fromDeg: number, toDeg: number, radius: number) => {
    const from = { x: cx + radius * Math.cos(fromDeg * Math.PI / 180), y: cy + radius * Math.sin(fromDeg * Math.PI / 180) };
    const to = { x: cx + radius * Math.cos(toDeg * Math.PI / 180), y: cy + radius * Math.sin(toDeg * Math.PI / 180) };
    const large = Math.abs(toDeg - fromDeg) > 180 ? 1 : 0;
    return `M ${from.x} ${from.y} A ${radius} ${radius} 0 ${large} 1 ${to.x} ${to.y}`;
  };

  const fillColor = warning ? '#d4351c' : '#1d70b8';

  return (
    <div className="flex flex-col items-center bg-card p-2 border border-border">
      <svg width={80} height={60} viewBox="0 0 80 65">
        <path
          d={arcPath(-120, 120, r)}
          fill="none"
          stroke="currentColor"
          className="text-border"
          strokeWidth={5}
        />
        <path
          d={arcPath(-120, -120 + pct * 240, r)}
          fill="none"
          stroke={fillColor}
          strokeWidth={5}
          style={{ transition: 'all 0.2s ease' }}
        />
        <text 
          x={cx} 
          y={cy + 4} 
          textAnchor="middle" 
          className="fill-foreground font-bold font-mono text-[11px]"
        >
          {value.toFixed(1)}
        </text>
        <text 
          x={cx} 
          y={cy + 15} 
          textAnchor="middle" 
          className="fill-muted-foreground font-mono text-[8px]"
        >
          {unit}
        </text>
      </svg>
      <span className="text-[9px] font-mono uppercase font-bold text-muted-foreground mt-0.5">{label}</span>
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

  return (
    <div className="space-y-4 max-w-[1520px] mx-auto pb-12 font-sans">

      {/* ─── Top Header & Scenario Selector ─── */}
      <div className="bg-gradient-to-r from-card via-card to-card border-2 border-[#138808]/40 shadow-sm p-4 rounded-sm space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff9933] via-white dark:via-slate-200 to-[#138808]" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="px-2 py-0.5 bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-400 font-mono font-bold text-xs rounded-xs">
                SIMULATION BENCHMARK
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-sans">
                Historical Well Replay Simulator
              </h1>
              <span className="px-2 py-0.5 bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-400 font-bold text-xs rounded-xs">
                FALSIFIABLE 75m LOOKAHEAD
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-sans mt-1">
              Verify proactive alert lead-times and NPT cost avoidance against real historical Well Completion Reports (WCR).
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold rounded-xs">
              ✓ 4 Scenarios Calibrated
            </span>
          </div>
        </div>

        {/* 4 Interactive Scenario Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          {REPLAY_SCENARIOS.map((sc) => {
            const isSelected = sc.id === selectedScenarioId;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => handleScenarioChange(sc.id)}
                className={`p-3 text-left border rounded-xs transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#ff9933]/15 via-card to-card border-2 border-[#ff9933] shadow-md ring-1 ring-[#ff9933]'
                    : 'bg-card/70 border-border hover:border-border hover:bg-secondary/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-xs text-foreground">{sc.name}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 font-bold rounded-xs ${
                    sc.id === 'well-glk-07' ? 'bg-rose-500/20 text-rose-700 dark:text-rose-400' :
                    sc.id === 'well-glk-03' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400' :
                    sc.id === 'well-glk-09' ? 'bg-purple-500/20 text-purple-700 dark:text-purple-400' :
                    'bg-blue-500/20 text-blue-700 dark:text-blue-400'
                  }`}>
                    {sc.spudYear}
                  </span>
                </div>
                <div className="text-xs font-bold text-foreground truncate">{sc.eventType}</div>
                <div className="text-[10px] text-muted-foreground mt-1 flex justify-between font-mono">
                  <span>{sc.field} · {sc.formation.split(' ')[0]}</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">{sc.historicalNptHours}h NPT</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Main Simulation 3-Column Layout ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

        {/* ── COL 1: Depth Track + Formation (3 cols) ── */}
        <div className="xl:col-span-3 flex flex-col gap-3">

          {/* Current Depth Readout */}
          <div className="gov-panel space-y-3 bg-gradient-to-br from-card via-card to-secondary/30">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground uppercase font-bold font-mono">
                Bit Position
              </span>
              <span className={`px-2 py-0.5 text-xs font-bold font-mono rounded-xs ${
                statusPhase === 'incident' ? 'bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30 animate-pulse' :
                statusPhase === 'warning' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 animate-pulse' :
                'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
              }`}>
                ● {statusPhase.toUpperCase()}
              </span>
            </div>

            <div className="text-center py-1">
              <div className="text-4xl font-black text-foreground font-mono tabular-nums tracking-tight">
                {currentDepth.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground font-mono font-bold mt-0.5">METERS MD</div>
            </div>

            {/* Linear Depth Progress with Multi-Color Bands */}
            <div className="space-y-1.5 font-mono">
              <div className="relative h-3 bg-secondary border border-border overflow-hidden rounded-xs">
                <div
                  className="absolute top-0 bottom-0 w-1 bg-amber-500 z-10"
                  style={{ left: `${((scenario.alertTriggerDepth - scenario.startDepth) / (scenario.maxDepth - scenario.startDepth)) * 100}%` }}
                />
                <div
                  className="absolute top-0 bottom-0 w-1 bg-rose-600 z-10"
                  style={{ left: `${((scenario.historicalIncidentDepth - scenario.startDepth) / (scenario.maxDepth - scenario.startDepth)) * 100}%` }}
                />
                <div
                  className={`h-full transition-all duration-150 ${
                    statusPhase === 'incident' ? 'bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-600' :
                    statusPhase === 'warning' ? 'bg-gradient-to-r from-emerald-500 to-amber-500' :
                    'bg-emerald-500'
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                <span>{scenario.startDepth}m</span>
                <span className="text-amber-700 dark:text-amber-400 font-bold">⚡ ADV {scenario.alertTriggerDepth}m</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">⚠ {scenario.historicalIncidentDepth}m</span>
                <span>{scenario.maxDepth}m</span>
              </div>
            </div>

            {/* Distance to Incident Indicator */}
            <div className={`p-3 border rounded-xs text-center ${
              isPastIncident ? 'bg-rose-500/10 border-rose-500/40 text-rose-700 dark:text-rose-300' :
              isAlertFired ? 'bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-300' :
              'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
            }`}>
              <div className="text-[10px] uppercase font-bold font-mono">
                Δ to Historical Hazard
              </div>
              <div className="text-2xl font-black font-mono tabular-nums">
                {isPastIncident
                  ? `+${(currentDepth - scenario.historicalIncidentDepth).toFixed(1)}`
                  : distanceToIncident.toFixed(1)}
                <span className="text-xs font-normal ml-1">m</span>
              </div>
              <div className="text-[10px] font-sans mt-0.5 font-medium">
                {isPastIncident ? 'Past historical incident depth' : isAlertFired ? '⚡ 75m Proactive Lookahead Active' : '✓ Safe pre-hazard window'}
              </div>
            </div>
          </div>

          {/* Formation Stratigraphy */}
          <div className="gov-panel space-y-2 flex-1">
            <div className="text-[10px] text-muted-foreground uppercase font-bold font-mono">
              Formation Zones
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              {[
                { name: 'Overburden / Alluvium', depth: `${scenario.startDepth - 200}–${scenario.startDepth}m`, color: '#64748b' },
                { name: scenario.formation.split(' ').slice(0, 2).join(' '), depth: `${scenario.startDepth}–${scenario.alertTriggerDepth}m`, color: '#2563eb' },
                { name: '⚠ Hazard Interval', depth: `${scenario.alertTriggerDepth}–${scenario.historicalIncidentDepth}m`, color: '#f59e0b' },
                { name: 'Lower Sub-Formation', depth: `${scenario.historicalIncidentDepth}–${scenario.maxDepth}m`, color: '#e11d48' },
              ].map((zone, i) => {
                const zoneStart = [scenario.startDepth - 200, scenario.startDepth, scenario.alertTriggerDepth, scenario.historicalIncidentDepth][i];
                const zoneEnd = [scenario.startDepth, scenario.alertTriggerDepth, scenario.historicalIncidentDepth, scenario.maxDepth][i];
                const isActive = currentDepth >= zoneStart && currentDepth < zoneEnd;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2 p-2 border rounded-xs transition-colors ${
                      isActive
                        ? 'border-blue-500 bg-blue-500/10 shadow-xs'
                        : 'border-border bg-card'
                    }`}
                  >
                    <div className="w-2.5 h-8 rounded-xs shrink-0" style={{ backgroundColor: zone.color }} />
                    <div className="min-w-0">
                      <div className="font-bold text-[11px] text-foreground truncate">
                        {zone.name}
                      </div>
                      <div className="text-[9px] text-muted-foreground">{zone.depth}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-border text-[10px] text-muted-foreground font-mono flex items-center justify-between">
              <span className="truncate">{scenario.sourceDocRef}</span>
              <span className="px-1.5 py-0.5 bg-blue-500/15 text-blue-700 dark:text-blue-400 font-bold rounded-xs">{scenario.confidence}</span>
            </div>
          </div>

        </div>

        {/* ── COL 2: Telemetry + Scrubber Controls (5 cols) ── */}
        <div className="xl:col-span-5 flex flex-col gap-3">

          {/* Gauges */}
          <div className="gov-panel space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground uppercase font-bold font-mono flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                Live Telemetry Playback
              </span>
              <span className="text-[10px] font-mono font-bold text-foreground">
                {scenario.name} · {scenario.field}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <ArcGauge value={simulatedROP} min={0} max={25} label="ROP" unit="m/h" warning={simulatedROP < 5} />
              <ArcGauge value={simulatedTorque} min={5} max={30} label="TORQUE" unit="kft·lb" warning={simulatedTorque > 20} />
              <ArcGauge value={simulatedMW} min={8.5} max={14} label="MWT IN" unit="ppg" warning={simulatedMW > 12} />
              <ArcGauge value={simulatedWOB} min={0} max={30} label="WOB" unit="klbs" warning={simulatedWOB < 10} />
            </div>
          </div>

          {/* Sparkline Channel Trends */}
          <div className="gov-panel space-y-2 flex-1">
            <div className="text-[10px] text-muted-foreground uppercase font-bold font-mono">
              Channel Trend Logs
            </div>

            <div className="space-y-2 font-mono text-xs">
              {/* ROP */}
              <div className="p-2 bg-secondary/40 border border-border rounded-xs space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="font-bold text-blue-700 dark:text-blue-300">PENETRATION RATE (m/h)</span>
                  <span className="font-bold text-foreground">{simulatedROP.toFixed(1)} m/h</span>
                </div>
                <div className="h-6 bg-card border border-border/80 rounded-xs overflow-hidden">
                  <SparkBar values={ropHistory} color="#2563eb" height={24} />
                </div>
              </div>

              {/* Torque */}
              <div className="p-2 bg-secondary/40 border border-border rounded-xs space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="font-bold text-purple-700 dark:text-purple-300">TORQUE (kft·lb)</span>
                  <span className="font-bold text-foreground">{simulatedTorque.toFixed(1)} kft-lb</span>
                </div>
                <div className="h-6 bg-card border border-border/80 rounded-xs overflow-hidden">
                  <SparkBar values={torqueHistory} color="#7c3aed" height={24} />
                </div>
              </div>

              {/* SPP */}
              <div className="p-2 bg-secondary/40 border border-border rounded-xs space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="font-bold text-amber-700 dark:text-amber-300">STANDPIPE PRESSURE (psi)</span>
                  <span className="font-bold text-foreground">{Math.round(simulatedSPP)} psi</span>
                </div>
                <div className="h-6 bg-card border border-border/80 rounded-xs overflow-hidden">
                  <SparkBar values={sppHistory} color="#d97706" height={24} />
                </div>
              </div>
            </div>

            {/* Pit Volume Bar */}
            <div className="p-2.5 bg-secondary/50 border border-border rounded-xs space-y-1 font-mono text-[10px]">
              <div className="flex justify-between">
                <span className="font-bold text-muted-foreground">ACTIVE MUD PIT VOLUME</span>
                <span className="font-bold text-foreground">{(pitVolume * 0.2).toFixed(0)} m³</span>
              </div>
              <div className="h-2 bg-border rounded-xs overflow-hidden">
                <div
                  className={`h-full ${pitVolume < scenario.baseFlowRate * 0.6 ? 'bg-rose-600' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(100, (pitVolume / scenario.baseFlowRate) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Playback Control Deck with Colorful Buttons */}
          <div className="gov-panel space-y-3 bg-gradient-to-r from-card to-secondary/30">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentDepth(scenario.startDepth)}
                  className="px-2.5 py-1.5 bg-secondary hover:bg-border border border-border text-xs cursor-pointer font-bold rounded-xs"
                  title="Reset to start"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 rounded-xs cursor-pointer shadow-xs transition-colors"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Play Replay'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentDepth(scenario.maxDepth)}
                  className="px-2.5 py-1.5 bg-secondary hover:bg-border border border-border text-xs cursor-pointer font-bold rounded-xs"
                  title="Skip to end"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentDepth((p) => Math.max(scenario.startDepth, Math.round((p - 10) * 10) / 10))}
                  className="px-2 py-1 bg-secondary hover:bg-border border border-border text-xs cursor-pointer rounded-xs"
                >
                  −10m
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentDepth((p) => Math.min(scenario.maxDepth, Math.round((p + 10) * 10) / 10))}
                  className="px-2 py-1 bg-secondary hover:bg-border border border-border text-xs cursor-pointer rounded-xs"
                >
                  +10m
                </button>
              </div>

              {/* Speed selection */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-[10px] text-muted-foreground mr-1 font-bold">Speed:</span>
                {[1, 5, 10, 20].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-1 text-xs border cursor-pointer font-bold rounded-xs ${
                      playbackSpeed === spd
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-card text-muted-foreground border-border hover:text-foreground'
                    }`}
                  >
                    {spd}×
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-1">
              <input
                type="range"
                min={scenario.startDepth}
                max={scenario.maxDepth}
                step="0.5"
                value={currentDepth}
                onChange={(e) => setCurrentDepth(parseFloat(e.target.value))}
                className="w-full h-2 rounded-xs appearance-none cursor-pointer accent-[#ff9933] bg-border"
              />
            </div>
          </div>

        </div>

        {/* ── COL 3: Advisory + Falsifiable Verification (4 cols) ── */}
        <div className="xl:col-span-4 flex flex-col gap-3">

          {/* Status Header */}
          <div className="p-3.5 bg-gradient-to-br from-blue-500/15 via-blue-500/5 to-card border-l-4 border-l-blue-600 border border-blue-500/30 rounded-xs space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono uppercase text-blue-700 dark:text-blue-300">
                Replay Horizon Evaluation
              </span>
              <span className="text-xs font-mono font-bold text-foreground">{currentDepth.toFixed(1)}m MD</span>
            </div>

            <p className="text-xs text-foreground font-sans leading-relaxed">
              {statusPhase === 'safe' && (
                <span>Monitoring <strong>{scenario.formation}</strong>. Advance to <strong>{scenario.alertTriggerDepth}m MD</strong> to verify lookahead trigger ({distanceToIncident.toFixed(0)}m ahead of incident).</span>
              )}
              {statusPhase === 'warning' && (
                <span>⚡ Proactive Lookahead triggered <strong>{(currentDepth - scenario.alertTriggerDepth).toFixed(0)}m ago</strong>. Historical incident occurred at <strong>{scenario.historicalIncidentDepth}m</strong>.</span>
              )}
              {statusPhase === 'incident' && (
                <span>⚠ Historical incident depth reached. In {scenario.spudYear}, <strong>{scenario.historicalNptHours} hours NPT</strong> were incurred. NWIS gave <strong>{scenario.historicalIncidentDepth - scenario.alertTriggerDepth}m advance lead-time</strong>.</span>
              )}
            </p>
          </div>

          {/* NPT Comparison Box with Emerald Glow */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-card border-2 border-emerald-500/40 rounded-xs flex items-center gap-3 shadow-xs">
            <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 rounded-xs flex flex-col items-center justify-center font-mono shrink-0">
              <span className="text-xl font-black text-emerald-700 dark:text-emerald-400 leading-none">{scenario.historicalNptHours}h</span>
              <span className="text-[9px] text-emerald-800 dark:text-emerald-300 font-bold">SAVED</span>
            </div>
            <div className="text-xs font-sans">
              <div className="font-bold text-foreground text-sm">₹14.8 Cr Avoided Rig Loss</div>
              <div className="text-muted-foreground leading-tight text-[11px]">
                Pre-emptive LCM pill avoids {scenario.historicalNptHours} hrs downtime per standard OIL India tariff.
              </div>
            </div>
          </div>

          {/* 3-Tier Separation Panel */}
          <div className="gov-panel space-y-2 flex-1">
            <div className="text-[10px] text-muted-foreground uppercase font-bold font-mono flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>3-Tier Advisory Separation</span>
            </div>

            {/* 1. Fact */}
            <div className="p-2.5 bg-blue-500/10 border-l-4 border-l-blue-600 border border-blue-500/20 rounded-xs text-xs space-y-1">
              <div className="font-bold font-mono uppercase text-blue-700 dark:text-blue-300 text-[10px]">
                1. Observed Historical Fact ({scenario.spudYear})
              </div>
              <p className="text-foreground leading-relaxed font-sans">{scenario.fact}</p>
            </div>

            {/* 2. Estimate */}
            <div className="p-2.5 bg-amber-500/10 border-l-4 border-l-amber-500 border border-amber-500/20 rounded-xs text-xs space-y-1">
              <div className="font-bold font-mono uppercase text-amber-700 dark:text-amber-400 text-[10px]">
                2. Model-Estimated Risk
              </div>
              <p className="text-foreground leading-relaxed font-sans">{scenario.estimate}</p>
            </div>

            {/* 3. Mitigation */}
            <div className="p-2.5 bg-emerald-500/10 border-l-4 border-l-emerald-600 border border-emerald-500/20 rounded-xs text-xs space-y-1">
              <div className="font-bold font-mono uppercase text-emerald-700 dark:text-emerald-400 text-[10px]">
                3. Engineering Mitigation
              </div>
              <p className="text-foreground leading-relaxed font-sans">{scenario.recommendation}</p>
            </div>

            {/* Disconfirming safe evidence */}
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xs text-[11px] font-sans text-foreground">
              <strong className="text-emerald-700 dark:text-emerald-400">Disconfirming safe evidence:</strong> {scenario.cleanPassageEvidence}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEvidenceOpen(true)}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xs flex-1 text-center cursor-pointer shadow-xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5 inline mr-1" />
              Inspect Archival Record
            </button>
            <Link
              href="/operations"
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xs flex-1 text-center shadow-xs transition-colors"
            >
              Live Operations →
            </Link>
          </div>

        </div>

      </div>

      {/* Archival Evidence Drawer */}
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
