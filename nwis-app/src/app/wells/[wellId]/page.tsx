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
import { useAppStore } from '../../../store/app-store';

// Dynamic import for Leaflet map to prevent SSR issues
const WellMapInner = dynamic(
  () => import('../../../components/map/WellMapInner').then((mod) => mod.WellMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="h-[460px] w-full border border-neutral-300 bg-neutral-100 flex flex-col items-center justify-center text-neutral-600 font-mono text-xs">
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
      <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-5 w-48 bg-neutral-200 dark:bg-[#1E2532] rounded-none" />
        <div className="h-28 rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] p-6 shadow-xs" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 h-[480px] rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B]" />
          <div className="lg:col-span-5 h-[480px] rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B]" />
        </div>
      </div>
    );
  }

  // Sorted offsets based on user toggle (Never collapse distance and similarity!)
  const displayedOffsets = [...offsetWells].sort((a, b) => {
    if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
    return b.similarityScore - a.similarityScore;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumb Trail */}
      <Breadcrumb
        items={[
          { label: 'Basin Overview', href: '/dashboard' },
          { label: well.name }
        ]}
      />

      {/* Well Header Block */}
      <div className="rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] p-5 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <h1 className="text-2xl font-extrabold text-[#252B33] dark:text-white font-mono tracking-tight">
                {well.name}
              </h1>
              <StatusTag label={well.status.toUpperCase()} />
              <span className="text-xs font-mono text-[#6B7280] dark:text-[#94A3B8]">
                Rig: <strong className="text-[#252B33] dark:text-white">{well.rig}</strong> • Operator: <strong className="text-[#252B33] dark:text-white">{well.operator}</strong>
              </span>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] font-sans">
              Field: <strong className="text-[#252B33] dark:text-white">{well.field}</strong> • Coordinates: <span className="font-mono">{well.surfaceCoords.lat}°N, {well.surfaceCoords.lng}°E</span> • Spud Date: <span className="font-mono">{well.spudDate}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-[#F5F7F8] dark:bg-[#1E2532] px-3.5 py-2">
              <span className="text-[#6B7280] dark:text-[#94A3B8] text-[10px] uppercase font-bold block">Bit Depth (MD)</span>
              <span className="text-base font-extrabold text-[#252B33] dark:text-white">{well.currentDepthMD || well.totalDepthMD}m</span>
            </div>
            <div className="rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-[#F5F7F8] dark:bg-[#1E2532] px-3.5 py-2">
              <span className="text-[#6B7280] dark:text-[#94A3B8] text-[10px] uppercase font-bold block">Formation</span>
              <span className="text-base font-extrabold text-[#3FC3B6]">{well.currentFormation || 'Tipam Sandstone'}</span>
            </div>
            <div className="rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-[#F5F7F8] dark:bg-[#1E2532] px-3.5 py-2">
              <span className="text-[#6B7280] dark:text-[#94A3B8] text-[10px] uppercase font-bold block">Trajectory</span>
              <span className="text-base font-extrabold text-[#252B33] dark:text-white capitalize">{well.trajectoryType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Simultaneous Legibility Layout: Map on Left, Depth Track on Right ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Offset Well Map */}
        <div className="lg:col-span-7 rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] p-5 flex flex-col shadow-xs">
          <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-[#E2E5E8] dark:border-[#364356] gap-2">
            <div>
              <h2 className="text-sm font-extrabold text-[#252B33] dark:text-white uppercase tracking-wide">
                Geospatial Offset Well Map
              </h2>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
                Proximity radius around {well.name} in {well.field} Field.
              </p>
            </div>

            {/* Radius Selector */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#6B7280] dark:text-[#94A3B8]">Radius:</span>
              <select
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-[#F5F7F8] dark:bg-[#1E2532] text-[#252B33] dark:text-white px-2.5 py-1 text-xs font-bold font-mono focus:outline-hidden"
              >
                <option value={10}>10 km</option>
                <option value={25}>25 km</option>
                <option value={50}>50 km</option>
              </select>
            </div>
          </div>

          <div className="flex-1 min-h-[560px] rounded-none overflow-hidden border border-[#E2E5E8] dark:border-[#364356]">
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

      {/* ─── Confidence Corridors: Showing DISCONFIRMING evidence with equal weight ─── */}
      <div className="rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] p-5 shadow-xs">
        <div className="pb-3 mb-4 border-b border-[#E2E5E8] dark:border-[#364356] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-extrabold text-[#252B33] dark:text-white uppercase tracking-wide">
              Subsurface Confidence Corridors & Disconfirming Evidence
            </h2>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
              Showing both hazard evidence and offset wells that crossed safely with zero incident.
            </p>
          </div>
          <span className="text-xs font-mono text-[#6B7280] dark:text-[#94A3B8]">
            Assam Basin Stratigraphic Calibration
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {riskCorridors.map((rc) => (
            <div key={rc.id} className="rounded-none border border-[#E2E5E8] dark:border-[#364356] p-4 bg-[#F5F7F8] dark:bg-[#1E2532] text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E5E8] dark:border-[#364356]">
                <span className="font-extrabold text-[#252B33] dark:text-white font-mono text-sm">
                  {rc.formation} ({rc.depthInterval.from}m–{rc.depthInterval.to}m MD)
                </span>
                <StatusTag label={`${rc.eventType.replace('_', ' ').toUpperCase()}`} />
              </div>

              {/* Dual Visual Weight: Risk Evidence alongside Disconfirming Evidence */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-none border border-[#ED1C24]/30 bg-[#ED1C24]/10 p-3">
                  <span className="text-[10px] font-extrabold text-[#ED1C24] uppercase block font-mono">
                    Historical Incidents
                  </span>
                  <div className="font-extrabold text-base text-[#ED1C24] font-mono mt-0.5">
                    {rc.evidenceCount} Wells Affected
                  </div>
                  <span className="text-[11px] text-[#ED1C24]/80 font-mono">
                    Frequency: {Math.round(rc.eventFrequency * 100)}%
                  </span>
                </div>

                <div className="rounded-none border border-[#3FAE68]/30 bg-[#3FAE68]/10 p-3">
                  <span className="text-[10px] font-extrabold text-[#3FAE68] uppercase block font-mono">
                    Disconfirming Safe Passes
                  </span>
                  <div className="font-extrabold text-base text-[#3FAE68] font-mono mt-0.5">
                    {rc.disconfirmingWellCount} Wells Passed Safely
                  </div>
                  <span className="text-[11px] text-[#3FAE68]/80 font-mono">
                    Mitigation Success: {Math.round(rc.successfulMitigationRate * 100)}%
                  </span>
                </div>
              </div>

              <p className="text-[#252B33] dark:text-white leading-relaxed text-xs">
                <strong className="text-[#252B33] dark:text-white">Historical Fact: </strong>{rc.observedFactSummary}
              </p>
              <div className="pt-2 border-t border-[#E2E5E8] dark:border-[#364356] text-xs text-[#6B7280] dark:text-[#94A3B8]">
                <strong className="text-[#252B33] dark:text-white">Recommended Pre-treatment: </strong>{rc.recommendedMitigation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Offset Well Comparison List (Both Distance & Similarity Always Shown) ─── */}
      <div className="rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] p-5 shadow-xs">
        <div className="pb-3 mb-4 border-b border-[#E2E5E8] dark:border-[#364356] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-[#252B33] dark:text-white">
              Offset Wells Comparison Register
            </h2>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
              Ranked by dual independent metrics: pure map distance (km) vs composite stratigraphic & operational similarity (0-1).
            </p>
          </div>

          {/* Sort Switcher */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#6B7280] dark:text-[#94A3B8]">Sort by:</span>
            <div className="inline-flex rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-[#F5F7F8] dark:bg-[#1E2532] p-1">
              <button
                type="button"
                onClick={() => setSortBy('similarity')}
                className={`rounded-none px-3 py-1 font-bold text-xs transition-colors cursor-pointer ${
                  sortBy === 'similarity'
                    ? 'bg-[#34435A] text-white shadow-xs'
                    : 'text-[#6B7280] dark:text-[#94A3B8] hover:text-[#252B33] dark:hover:text-white'
                }`}
              >
                Similarity Score
              </button>
              <button
                type="button"
                onClick={() => setSortBy('distance')}
                className={`rounded-none px-3 py-1 font-bold text-xs transition-colors cursor-pointer ${
                  sortBy === 'distance'
                    ? 'bg-[#34435A] text-white shadow-xs'
                    : 'text-[#6B7280] dark:text-[#94A3B8] hover:text-[#252B33] dark:hover:text-white'
                }`}
              >
                Map Distance (km)
              </button>
            </div>
          </div>
        </div>

        {/* List of Offset Wells */}
        <div className="space-y-3">
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
