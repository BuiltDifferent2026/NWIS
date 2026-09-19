'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Well, OffsetWellResult, RiskCorridor, Alert } from '../../../lib/data/types';
import { getWellById, getOffsetWells, getRiskCorridors, getAlerts } from '../../../lib/data/service';
import { Breadcrumb } from '../../../components/layout/Breadcrumb';
import { StatusTag } from '../../../components/common/StatusTag';
import { OffsetWellRow } from '../../../components/common/OffsetWellRow';
import { DepthTrack } from '../../../components/common/DepthTrack';

const WellMapInner = dynamic(
  () => import('../../../components/map/WellMapInner').then((mod) => mod.WellMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="h-[460px] w-full border border-border bg-secondary flex flex-col items-center justify-center text-muted-foreground font-mono text-xs">
        <span>Loading Assam Basin Geospatial Engine...</span>
      </div>
    )
  }
);

interface WellWorkspacePageProps {
  params: Promise<{ wellId: string }>;
}

export default function WellWorkspacePage({ params }: WellWorkspacePageProps) {
  const { wellId } = use(params);
  const [well, setWell] = useState<Well | null>(null);
  const [offsetWells, setOffsetWells] = useState<OffsetWellResult[]>([]);
  const [riskCorridors, setRiskCorridors] = useState<RiskCorridor[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [sortBy, setSortBy] = useState<'similarity' | 'distance'>('similarity');
  const [radiusKm, setRadiusKm] = useState<number>(25);

  useEffect(() => {
    async function loadWellWorkspace() {
      const w = await getWellById(wellId);
      if (w) {
        setWell(w);
        const offsets = await getOffsetWells(w.id);
        const corridors = await getRiskCorridors();
        const allAlerts = await getAlerts();
        setOffsetWells(offsets);
        const matchingCorridors = corridors.filter((c) => c.field.toLowerCase() === w.field.toLowerCase());
        setRiskCorridors(matchingCorridors.length > 0 ? matchingCorridors : corridors);
        setActiveAlerts(allAlerts.filter((a) => a.wellId === w.id));
      }
    }
    loadWellWorkspace();
  }, [wellId]);

  if (!well) {
    return (
      <div className="space-y-4 max-w-[1400px] mx-auto animate-pulse font-mono text-xs">
        <div className="h-6 w-48 bg-border" />
        <div className="h-24 bg-card border border-border p-4" />
      </div>
    );
  }

  const displayedOffsets = [...offsetWells].sort((a, b) => {
    if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
    return b.similarityScore - a.similarityScore;
  });

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto pb-12 font-sans">
      <Breadcrumb
        items={[
          { label: 'Basin Fleet Register', href: '/dashboard' },
          { label: well.name }
        ]}
      />

      {/* Well Header Block */}
      <div className="gov-panel space-y-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-xl font-bold text-foreground font-mono">
                {well.name}
              </h1>
              <StatusTag label={well.status.toUpperCase()} />
              <span className="text-xs font-mono text-muted-foreground">
                Rig: <strong className="text-foreground">{well.rig}</strong> · Operator: <strong className="text-foreground">{well.operator}</strong>
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-sans">
              Field: <strong className="text-foreground">{well.field}</strong> · Surface: <span className="font-mono">{well.surfaceCoords.lat}°N, {well.surfaceCoords.lng}°E</span> · Spud Date: <span className="font-mono">{well.spudDate}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="p-2 bg-secondary border border-border">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Bit Depth (MD)</span>
              <span className="text-sm font-bold text-foreground">{well.currentDepthMD || well.totalDepthMD}m</span>
            </div>
            <div className="p-2 bg-secondary border border-border">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Formation</span>
              <span className="text-sm font-bold text-[#b25900] dark:text-[#fbbf24]">{well.currentFormation || 'Tipam Sandstone'}</span>
            </div>
            <div className="p-2 bg-secondary border border-border">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Trajectory</span>
              <span className="text-sm font-bold text-foreground capitalize">{well.trajectoryType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simultaneous Legibility Layout: Map on Left, Depth Track on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (7 cols): Map */}
        <div className="lg:col-span-7 gov-panel flex flex-col space-y-3">
          <div className="flex flex-wrap items-center justify-between pb-2 border-b border-border gap-2">
            <div>
              <h2 className="text-xs font-mono uppercase font-bold text-muted-foreground">
                Geospatial Offset Correlation Map
              </h2>
              <p className="text-xs text-muted-foreground font-sans">
                Offset wells within search radius of {well.name}.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-muted-foreground">Radius:</span>
              <select
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="border border-border bg-card text-foreground px-2 py-0.5 text-xs font-mono rounded-xs focus:outline-2 focus:outline-[#ffdd00]"
              >
                <option value={10}>10 km</option>
                <option value={25}>25 km</option>
                <option value={50}>50 km</option>
              </select>
            </div>
          </div>

          <div className="flex-1 min-h-[460px] border border-border">
            <WellMapInner
              selectedField={well.field}
              searchQuery=""
              radiusKm={radiusKm}
              centerWellId={well.id}
              sortBy={sortBy}
            />
          </div>
        </div>

        {/* Right Column (5 cols): Stratigraphic Depth Track */}
        <div className="lg:col-span-5">
          <DepthTrack
            currentDepthMD={well.currentDepthMD || 2165}
            maxDepthMD={well.totalDepthMD || 3800}
            riskCorridors={riskCorridors}
            height={480}
          />
        </div>
      </div>

      {/* Confidence Corridors: Showing DISCONFIRMING evidence */}
      <div className="gov-panel space-y-3">
        <div className="pb-2 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-mono uppercase font-bold text-muted-foreground">
              Subsurface Confidence Corridors &amp; Disconfirming Evidence
            </h2>
            <p className="text-xs text-muted-foreground font-sans">
              Both hazard evidence and offset wells that crossed safely with zero incident.
            </p>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            Assam Basin Stratigraphic Calibration
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {riskCorridors.map((rc) => (
            <div key={rc.id} className="p-3 bg-secondary/30 border border-border text-xs space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-border">
                <span className="font-bold text-foreground font-mono">
                  {rc.formation} ({rc.depthInterval.from}m–{rc.depthInterval.to}m MD)
                </span>
                <StatusTag label={`${rc.eventType.replace('_', ' ').toUpperCase()}`} />
              </div>

              {/* Dual Visual Weight: Risk Evidence vs Disconfirming Evidence */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-card border border-border">
                  <span className="text-[9px] text-[#d4351c] font-bold uppercase block">
                    Historical Incidents
                  </span>
                  <div className="font-bold text-foreground mt-0.5">
                    {rc.evidenceCount} Wells Affected
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Frequency: {Math.round(rc.eventFrequency * 100)}%
                  </span>
                </div>

                <div className="p-2 bg-card border border-border">
                  <span className="text-[9px] text-[#00703c] font-bold uppercase block">
                    Disconfirming Passes
                  </span>
                  <div className="font-bold text-foreground mt-0.5">
                    {rc.disconfirmingWellCount} Clean Passes
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Success: {Math.round(rc.successfulMitigationRate * 100)}%
                  </span>
                </div>
              </div>

              <p className="text-foreground leading-relaxed text-xs font-sans">
                <strong>Historical Fact: </strong>{rc.observedFactSummary}
              </p>
              <div className="pt-1.5 border-t border-border text-xs text-muted-foreground font-sans">
                <strong className="text-foreground">Recommended Mitigation: </strong>{rc.recommendedMitigation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Offset Well Comparison List */}
      <div className="gov-panel space-y-3">
        <div className="pb-2 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xs font-mono uppercase font-bold text-muted-foreground">
              Offset Wells Comparison Register
            </h2>
            <p className="text-xs text-muted-foreground font-sans">
              Ranked by dual independent signals: Map Distance (km) vs Composite Stratigraphic Similarity (0–1).
            </p>
          </div>

          {/* Sort Switcher */}
          <div className="flex items-center gap-1 text-xs font-mono">
            <span className="text-muted-foreground text-[11px] mr-1">Sort:</span>
            <button
              type="button"
              onClick={() => setSortBy('similarity')}
              className={`px-2 py-0.5 border cursor-pointer ${
                sortBy === 'similarity' ? 'bg-[#1d70b8] text-white border-[#1d70b8]' : 'bg-card text-muted-foreground border-border'
              }`}
            >
              Similarity Score
            </button>
            <button
              type="button"
              onClick={() => setSortBy('distance')}
              className={`px-2 py-0.5 border cursor-pointer ${
                sortBy === 'distance' ? 'bg-[#1d70b8] text-white border-[#1d70b8]' : 'bg-card text-muted-foreground border-border'
              }`}
            >
              Map Distance (km)
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {displayedOffsets.map((offset) => (
            <OffsetWellRow
              key={offset.well.id}
              offset={offset}
              showLinkToWell={offset.well.id !== well.id}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
