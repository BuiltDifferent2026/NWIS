'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  MapPin, 
  Compass, 
  Layers, 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  ArrowRight,
  Radio,
  ExternalLink,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { WELLS } from '@/data/wells';

// Dynamically import Leaflet Map to avoid SSR issues
const WellMapInner = dynamic(
  () => import('@/components/map/WellMapInner').then((mod) => mod.WellMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="h-[620px] w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-[#0c1017] flex flex-col items-center justify-center text-neutral-500 font-mono text-xs gap-2">
        <Radio className="w-5 h-5 text-amber-500 animate-pulse" />
        <span>Initializing Assam Basin Geospatial Correlation Engine...</span>
      </div>
    )
  }
);

export default function GeospatialMapPage() {
  const [selectedField, setSelectedField] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [radiusKm, setRadiusKm] = useState<number>(25);
  const [centerWellId, setCenterWellId] = useState<string>('well-glk-14');
  const [sortBy, setSortBy] = useState<'distance' | 'similarity'>('similarity');

  const centerWell = WELLS.find((w) => w.id === centerWellId) || WELLS[0];

  return (
    <div className="space-y-5 max-w-[1520px] mx-auto pb-12 animate-in fade-in duration-150">
      
      {/* ─── Breadcrumb Navigation ─── */}
      <Breadcrumb
        items={[
          { label: 'Operations', href: '/operations' },
          { label: 'Geospatial Well Map' }
        ]}
      />

      {/* ─── Header & Filter Controls ─── */}
      <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0e121a] p-5 shadow-xs transition-colors space-y-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
                <MapPin className="w-4 h-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-mono">
                Geospatial Well Map & Coordinate Intelligence
              </h1>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-[10px] font-mono font-bold">
                Assam–Arakan Basin
              </span>
            </div>
            
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-sans">
              Interactive multi-layer offset well mapping, radial proximity calibration, custom coordinates workbench, and 1-click clipboard tools.
            </p>
          </div>

          {/* Quick jump to active well */}
          <Link
            href="/operations"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 hover:border-amber-500 transition-colors shrink-0"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Active Rig: {centerWell.name} (2,165.4m)</span>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400 ml-1" />
          </Link>
        </div>

        {/* ── Toolbar: Field Filter, Radius, Search, Center Well, and Sorting ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1 text-xs font-mono">
          
          {/* Active Center Well Selector */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block">
              Active Rig / Center Well
            </label>
            <select
              value={centerWellId}
              onChange={(e) => setCenterWellId(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-2.5 py-2 font-bold text-neutral-900 dark:text-white focus:outline-hidden"
            >
              {WELLS.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.field} · {w.status})
                </option>
              ))}
            </select>
          </div>

          {/* Basin Field Filter */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block">
              Basin Field Filter
            </label>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-2.5 py-2 font-bold text-neutral-900 dark:text-white focus:outline-hidden"
            >
              <option value="all">All Assam Fields</option>
              <option value="Geleki">Geleki Field</option>
              <option value="Digboi">Digboi Field</option>
              <option value="Rudrasagar">Rudrasagar Field</option>
              <option value="Lakwa">Lakwa Field</option>
              <option value="Kharsang">Kharsang Field</option>
              <option value="Moran">Moran Field</option>
            </select>
          </div>

          {/* Radial Search Proximity */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block">
              Proximity Radius
            </label>
            <select
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-2.5 py-2 font-bold text-neutral-900 dark:text-white focus:outline-hidden"
            >
              <option value={10}>10 km Radius</option>
              <option value={25}>25 km Standard Radius</option>
              <option value={50}>50 km Regional Search</option>
              <option value={100}>100 km Basin Wide</option>
            </select>
          </div>

          {/* Search Query Input */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block">
              Search Wells / Blocks
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-neutral-400" />
              <input
                type="text"
                placeholder="Search GLK-07, Tipam..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl pl-8 pr-2.5 py-2 text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Ranking Mode Sorter */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block">
              Ranking Mode
            </label>
            <div className="inline-flex w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-0.5">
              <button
                type="button"
                onClick={() => setSortBy('similarity')}
                className={`flex-1 py-1.5 rounded-lg text-center font-bold text-[11px] cursor-pointer transition-colors ${
                  sortBy === 'similarity'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Similarity
              </button>
              <button
                type="button"
                onClick={() => setSortBy('distance')}
                className={`flex-1 py-1.5 rounded-lg text-center font-bold text-[11px] cursor-pointer transition-colors ${
                  sortBy === 'distance'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Distance
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* ─── Main Geospatial Console with Dedicated Sidebar Tabs ─── */}
      <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0b0f18] p-4 sm:p-5 shadow-xs overflow-hidden transition-colors">
        <div className="min-h-[640px] w-full">
          <WellMapInner
            centerWellId={centerWellId}
            radiusKm={radiusKm}
            searchQuery={searchQuery}
            selectedField={selectedField}
            sortBy={sortBy}
          />
        </div>
      </section>
    </div>
  );
}
