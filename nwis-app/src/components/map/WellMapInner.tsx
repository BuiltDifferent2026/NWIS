'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { WELLS, Well, haversineDistance, computeSimilarity } from '../../data/wells';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { Layers, MapPin, Compass, AlertTriangle, ExternalLink, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

interface WellMapInnerProps {
  selectedField: string;
  searchQuery: string;
  radiusKm: number;
  centerWellId: string;
  sortBy: 'distance' | 'similarity';
}

export const WellMapInner: React.FC<WellMapInnerProps> = ({
  selectedField,
  searchQuery,
  radiusKm,
  centerWellId,
  sortBy
}) => {
  const [selectedWell, setSelectedWell] = useState<Well | null>(null);

  const centerWell = WELLS.find((w) => w.id === centerWellId) || WELLS[0];
  const centerLat = centerWell.coordinates.surfaceLat;
  const centerLng = centerWell.coordinates.surfaceLng;

  // Filter wells
  const filteredWells = WELLS.filter((w) => {
    if (selectedField !== 'all' && w.field.toLowerCase() !== selectedField.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        w.name.toLowerCase().includes(q) ||
        w.field.toLowerCase().includes(q) ||
        w.block.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate distance and similarity for all wells relative to centerWell
  const wellsWithMetrics = filteredWells.map((w) => {
    const dist = haversineDistance(centerLat, centerLng, w.coordinates.surfaceLat, w.coordinates.surfaceLng);
    const sim = computeSimilarity(centerWell, w);
    return {
      well: w,
      distanceKm: Math.round(dist * 10) / 10,
      similarity: sim,
      inRadius: dist <= radiusKm
    };
  });

  // Sort by chosen metric
  const sortedWells = [...wellsWithMetrics].sort((a, b) => {
    if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
    return b.similarity.total - a.similarity.total;
  });

  const getMarkerColor = (well: Well) => {
    if (well.id === centerWell.id) return '#22D3EE'; // Cyan for active rig
    if (well.status === 'drilling') return '#10B981'; // Emerald
    if (well.status === 'completed') return '#3B82F6'; // Blue
    if (well.status === 'suspended') return '#F59E0B'; // Amber
    return '#6B7280';
  };

  return (
    <div className="relative flex flex-col lg:flex-row h-full w-full gap-4">
      {/* Map Viewport */}
      <div className="flex-1 relative rounded-xl overflow-hidden border border-white/[0.06] bg-slate-950 min-h-[500px]">
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={10}
          scrollWheelZoom={true}
          className="h-full w-full z-10"
          style={{ background: '#0B0E14' }}
        >
          {/* Dark theme tile layer */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Radius Circle from Active Rig */}
          <Circle
            center={[centerLat, centerLng]}
            radius={radiusKm * 1000}
            pathOptions={{
              color: '#3B82F6',
              fillColor: '#3B82F6',
              fillOpacity: 0.08,
              weight: 1.5,
              dashArray: '4, 4'
            }}
          />

          {/* Well Markers */}
          {wellsWithMetrics.map(({ well, distanceKm, similarity, inRadius }) => {
            const isCenter = well.id === centerWell.id;
            const markerColor = getMarkerColor(well);

            return (
              <CircleMarker
                key={well.id}
                center={[well.coordinates.surfaceLat, well.coordinates.surfaceLng]}
                radius={isCenter ? 11 : inRadius ? 8 : 6}
                pathOptions={{
                  color: isCenter ? '#FFFFFF' : markerColor,
                  fillColor: markerColor,
                  fillOpacity: isCenter ? 1 : inRadius ? 0.85 : 0.45,
                  weight: isCenter ? 3 : 1.5
                }}
                eventHandlers={{
                  click: () => setSelectedWell(well)
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-2 text-xs font-mono bg-slate-900 text-slate-100 rounded">
                    <div className="font-bold flex items-center justify-between gap-2">
                      <span>{well.name}</span>
                      <StatusBadge status={well.status} size="sm" />
                    </div>
                    <div className="text-slate-400 mt-1">
                      {well.field} Field • Block {well.block}
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between gap-4">
                      <div>
                        <span className="text-[10px] text-slate-400 block">DISTANCE</span>
                        <span className="font-bold text-cyan-400">{distanceKm} km</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">SIMILARITY</span>
                        <span className="font-bold text-emerald-400">
                          {Math.round(similarity.total * 100)}%
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/wells/${well.id}`}
                      className="mt-2 block text-center py-1 bg-blue-600 text-white rounded font-bold hover:bg-blue-500"
                    >
                      View Well Details
                    </Link>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Floating Map Legend */}
        <div className="absolute bottom-4 left-4 z-20 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 text-xs font-mono">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Well Status & Layers
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 border border-white" />
              <span className="text-slate-200">Active Rig ({centerWell.name})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-300">Drilling Offset</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-slate-300">Completed Well</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-300">Suspended / Historical</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-800 text-[10px] text-slate-400">
              <span className="w-3 h-0.5 border-t border-dashed border-blue-400" />
              <span>Radius: {radiusKm} km Circle</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side Intelligence Panel: Distance vs Similarity Ranking */}
      <div className="w-full lg:w-96 flex flex-col rounded-xl border border-white/[0.06] bg-slate-900/60 p-4 backdrop-blur-md overflow-hidden">
        <div className="pb-3 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              {sortBy === 'distance' ? (
                <MapPin className="w-4 h-4 text-cyan-400" />
              ) : (
                <Compass className="w-4 h-4 text-emerald-400" />
              )}
              {sortBy === 'distance' ? 'Nearest Offset Wells' : 'Most Similar Wells'}
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {sortedWells.length} Found
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {sortBy === 'distance'
              ? `Geospatial radius from ${centerWell.name}`
              : `Stratigraphic & parameter correlation to ${centerWell.name}`}
          </p>
        </div>

        {/* Well Cards List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 mt-3 pr-1">
          {sortedWells.map(({ well, distanceKm, similarity, inRadius }) => {
            const isCenter = well.id === centerWell.id;
            const simPct = Math.round(similarity.total * 100);

            return (
              <div
                key={well.id}
                onClick={() => setSelectedWell(well)}
                className={`p-3 rounded-lg border transition cursor-pointer text-xs font-mono ${
                  selectedWell?.id === well.id
                    ? 'border-blue-500 bg-blue-950/30'
                    : isCenter
                    ? 'border-cyan-500/40 bg-cyan-950/20'
                    : inRadius
                    ? 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    : 'border-slate-800/50 bg-slate-950/30 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100">{well.name}</span>
                      <StatusBadge status={well.status} size="sm" />
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {well.field} • {well.totalDepthMD}m TD
                    </div>
                  </div>

                  <Link
                    href={`/wells/${well.id}`}
                    className="p-1 rounded text-slate-400 hover:text-blue-400"
                    title="Open Well"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>{distanceKm} km dist</span>
                  </div>
                  <div className="flex items-center justify-end gap-1 font-bold">
                    <Compass className="w-3 h-3 text-emerald-400" />
                    <span className={simPct >= 70 ? 'text-emerald-400' : 'text-amber-400'}>
                      {simPct}% sim
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
