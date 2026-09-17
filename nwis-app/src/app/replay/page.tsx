'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Pause, RotateCcw, Activity, ShieldAlert, Sparkles, Compass } from 'lucide-react';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { DepthTrack } from '../../components/common/DepthTrack';
import { FactEstimateRecommendation } from '../../components/common/FactEstimateRecommendation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_WELLS, MOCK_RISK_CORRIDORS } from '../../lib/data/fixtures';
import { Well, RiskCorridor } from '../../lib/data/types';

export default function WellReplayPage() {
  const replayCandidateWells = MOCK_WELLS.filter(
    (w) => w.id === 'well-glk-07' || w.id === 'well-glk-03' || w.id === 'well-dgb-02'
  );

  const [selectedWellId, setSelectedWellId] = useState<string>('well-glk-07');
  const [currentDepth, setCurrentDepth] = useState<number>(2120);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(5); // meters per second

  // Target historical well metadata
  const well = MOCK_WELLS.find((w) => w.id === selectedWellId) || MOCK_WELLS[3];

  // Specific historical benchmark parameters
  const historicalIncidentDepth =
    selectedWellId === 'well-glk-07'
      ? 2280 // Severe mud loss at 2,280m
      : selectedWellId === 'well-glk-03'
      ? 2215 // Mud loss at 2,215m
      : 1420; // Stuck pipe at 1,420m

  const alertTriggerDepth =
    selectedWellId === 'well-glk-07'
      ? 2205 // Fired 75m in advance
      : selectedWellId === 'well-glk-03'
      ? 2145
      : 1360;

  const relevantCorridors = MOCK_RISK_CORRIDORS.filter(
    (c) => c.field.toLowerCase() === well.field.toLowerCase()
  );

  // Timer loop for replay simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentDepth((prev) => {
          if (prev >= 2350) {
            setIsPlaying(false);
            return 2350;
          }
          return Math.round((prev + playbackSpeed * 0.5) * 10) / 10;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const isAlertFired = currentDepth >= alertTriggerDepth;
  const isPastIncident = currentDepth >= historicalIncidentDepth;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Breadcrumb items={[{ label: 'Well Replay Simulator' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-mono font-semibold mb-1">
            <Activity className="w-3.5 h-3.5 text-amber-700" />
            <span>PRE-SPUD LOOKAHEAD VERIFICATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
            Historical Well Replay Simulator
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5 font-medium">
            Proving that NWIS fires hazard advisories <strong>75 meters before</strong> the drill bit reaches the historical incident horizon.
          </p>
        </div>

        <Badge variant="outline" className="text-xs font-mono bg-neutral-100 text-neutral-800 border-neutral-300 py-1.5 px-3 self-start sm:self-auto">
          BENCHMARK MODE
        </Badge>
      </div>

      {/* ─── Simulation Controls Deck ─── */}
      <Card className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Well Selector */}
          <div className="flex items-center gap-3">
            <label htmlFor="replay-well" className="text-xs font-mono font-bold text-neutral-500 uppercase">
              Benchmark Well:
            </label>
            <select
              id="replay-well"
              value={selectedWellId}
              onChange={(e) => {
                setSelectedWellId(e.target.value);
                setCurrentDepth(2120);
                setIsPlaying(false);
              }}
              className="border border-neutral-200 bg-neutral-50 rounded-xl px-3 py-1.5 text-xs font-bold text-neutral-900 font-mono focus:outline-hidden"
            >
              {replayCandidateWells.map((rw) => (
                <option key={rw.id} value={rw.id}>
                  {rw.name} ({rw.field} • Historical Loss Horizon)
                </option>
              ))}
            </select>
          </div>

          {/* Primary Controls */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-2xs transition-colors ${
                isPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-neutral-950 hover:bg-neutral-800'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Replay</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Start Replay</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setCurrentDepth(2120);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-bold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
              <span>Reset</span>
            </button>

            {/* Speed Multiplier */}
            <div className="inline-flex rounded-xl border border-neutral-200 bg-neutral-100 p-1 text-xs font-mono">
              {[2, 5, 15, 30].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-colors ${
                    playbackSpeed === spd ? 'bg-white text-neutral-950 shadow-2xs' : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Depth Scrubber */}
        <div className="space-y-1.5 pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-600">
            <span>Interval: 2,100m MD</span>
            <span className="font-extrabold text-neutral-950">
              Live Bit Depth: <strong className="text-amber-700 font-mono text-sm">{currentDepth.toFixed(1)}m MD</strong>
            </span>
            <span>Interval End: 2,350m MD</span>
          </div>
          <input
            type="range"
            min={2100}
            max={2350}
            step={0.5}
            value={currentDepth}
            onChange={(e) => setCurrentDepth(Number(e.target.value))}
            className="w-full h-2 bg-neutral-200 rounded-lg cursor-pointer accent-amber-600"
          />
        </div>

        {/* ─── Predicted vs Actual Readout Strip (Clean & Spacious) ─── */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-neutral-500 uppercase text-[10px] block font-bold">1. Current Live Bit Depth</span>
              <span className="text-lg font-extrabold text-neutral-950 mt-0.5 block">{currentDepth.toFixed(1)}m MD</span>
            </div>
            <div>
              <span className="text-neutral-500 uppercase text-[10px] block font-bold">2. Proactive Alert Trigger Horizon</span>
              <span className="text-lg font-extrabold text-amber-700 mt-0.5 block">{alertTriggerDepth}m MD</span>
              <span className="text-[11px] text-neutral-500 block mt-0.5">
                {isAlertFired ? '✓ Alert Triggered' : `${(alertTriggerDepth - currentDepth).toFixed(1)}m until trigger`}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 uppercase text-[10px] block font-bold">3. Historical Incident Depth</span>
              <span className="text-lg font-extrabold text-rose-700 mt-0.5 block">{historicalIncidentDepth}m MD</span>
              <span className="text-[11px] text-neutral-500 block mt-0.5">
                Lead-time: <strong className="text-neutral-900 font-bold">75m proactive lookahead</strong>
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* ─── Replay Depth Track & Dynamic Alert Card ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Custom SVG Depth Track */}
        <div className="lg:col-span-5">
          <DepthTrack
            currentDepthMD={currentDepth}
            maxDepthMD={2600}
            historicalIncidentDepth={historicalIncidentDepth}
            riskCorridors={relevantCorridors}
            showComparisonReadout={true}
            height={520}
          />
        </div>

        {/* Right: Dynamic Fired Alert Card */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h2 className="text-sm font-extrabold text-neutral-950 uppercase tracking-wide">
                Proactive Corridor Watcher Feed
              </h2>
              {isAlertFired ? (
                <Badge className="bg-rose-50 text-rose-800 border-rose-200 font-mono text-[10px] font-bold">
                  ADVISORY ACTIVE
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-neutral-100 text-neutral-600 border-neutral-200 font-mono text-[10px]">
                  MONITORING
                </Badge>
              )}
            </div>

            {isAlertFired ? (
              <div className="space-y-4">
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-rose-900 block">
                    ⚠ Proactive Alert Fired at {alertTriggerDepth}m MD ({historicalIncidentDepth - alertTriggerDepth}m before historical loss)
                  </span>
                  <p className="text-neutral-700 leading-relaxed">
                    The drill bit has entered the proactive buffer zone. In 1996, OIL-GLK-07 drilled through this horizon blind and suffered total lost circulation at {historicalIncidentDepth}m MD. NWIS fires this operational advisory now to enable pre-treatment before penetrating the micro-fractured sandstone.
                  </p>
                </div>

                <FactEstimateRecommendation
                  fact={`Historical drilling records in Geleki field reveal 5 offset wells suffered total lost circulation exceeding 25 m³/hr between 2,180m and 2,340m MD. In this well (OIL-GLK-07), drillers suffered total loss at ${historicalIncidentDepth}m MD losing 34 NPT hours.`}
                  estimate={`Pore pressure & fracture gradient model predicts severe micro-fracture loss starting within 15 meters. If equivalent circulating density (ECD) exceeds 10.4 ppg, total lost circulation is 62% probable.`}
                  recommendation={`Stage 45 bbl medium-nut-plug LCM pill now prior to drilling past 2,220m. Restrict pump flow rate to cap ECD at 10.2 ppg.`}
                  disconfirmingEvidence={`4 offset wells (OIL-GLK-11, OIL-GLK-09) successfully traversed past ${historicalIncidentDepth}m MD with zero losses by capping ECD at 10.2 ppg.`}
                  riskLevel="high"
                  sourceReference="WCR-GLK-07-1996 (Page 19) [OCR-HIGH]"
                />
              </div>
            ) : (
              <div className="py-20 text-center text-xs font-mono text-neutral-500 space-y-1">
                <div className="text-neutral-800 font-bold">Bit currently in safe formation interval ({currentDepth.toFixed(0)}m MD)</div>
                <p className="text-neutral-400">Advance depth past {alertTriggerDepth}m MD to witness the proactive advisory trigger.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
