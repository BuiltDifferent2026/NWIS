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
      <div className="h-[620px] w-full rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-[#F5F7F8] dark:bg-[#1E2532] flex flex-col items-center justify-center text-[#6B7280] dark:text-[#94A3B8] font-mono text-xs gap-2">
        <Radio className="w-5 h-5 text-[#3FC3B6] animate-pulse" />
        <span>Initializing Assam Basin Geospatial Correlation Engine...</span>
      </div>
    )
  }
);

export default function GeospatialMapPage() {
  const [selectedField, setSelectedField] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [radiusKm, setRadiusKm] = useState<number>(25);
  const [centerWellId, setCenterWellId] = useState<string>('GK-401');
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
      <section className="rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] p-5 shadow-2xs transition-colors space-y-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E2E5E8] dark:border-[#364356]">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-8 h-8 rounded-none bg-[#D9F2EE] dark:bg-[#3FC3B6]/20 text-[#26A69A] dark:text-[#3FC3B6] flex items-center justify-center border border-[#3FC3B6]">
                <MapPin className="w-4 h-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#252B33] dark:text-white font-mono">
                Geospatial Well Map & Coordinate Intelligence
              </h1>
              <span className="px-2 py-0.5 rounded-none bg-[#34435A] text-white border border-[#222222] text-[10px] font-mono font-bold">
                Seven Sisters & Pan-India Basin Grid
              </span>
            </div>
            
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] font-sans">
              Interactive multi-layer offset well mapping, radial proximity calibration, custom coordinates workbench, and 1-click clipboard tools.
            </p>
          </div>

          {/* Quick jump to active well */}
          <Link
            href="/operations"
            className="flex items-center gap-2 px-3 py-1.5 rounded-none border border-[#3FC3B6] bg-[#D9F2EE]/40 dark:bg-[#3FC3B6]/15 text-xs font-mono font-bold text-[#26A69A] dark:text-[#3FC3B6] hover:bg-[#D9F2EE] dark:hover:bg-[#3FC3B6]/25 transition-colors shrink-0"
          >
            <Radio className="w-3.5 h-3.5 text-[#3FAE68] animate-pulse" />
            <span>Active Rig: {centerWell.name} (2,165.4m)</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#26A69A] dark:text-[#3FC3B6] ml-1" />
          </Link>
        </div>

        {/* ── Toolbar: Field Filter, Radius, Search, Center Well, and Sorting ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1 text-xs font-mono">
          
          {/* Active Center Well Selector */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-[#6B7280] dark:text-[#94A3B8] block">
              Active Rig / Center Well
            </label>
            <select
              value={centerWellId}
              onChange={(e) => setCenterWellId(e.target.value)}
              className="w-full bg-[#F5F7F8] dark:bg-[#1E2532] border border-[#E2E5E8] dark:border-[#364356] rounded-none px-2.5 py-2 font-bold text-[#252B33] dark:text-white focus:outline-hidden focus:border-[#3FC3B6]"
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
            <label className="text-[10px] uppercase font-bold text-[#6B7280] dark:text-[#94A3B8] block">
              Basin & Field Filter
            </label>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-full bg-[#F5F7F8] dark:bg-[#1E2532] border border-[#E2E5E8] dark:border-[#364356] rounded-none px-2.5 py-2 font-bold text-[#252B33] dark:text-white focus:outline-hidden focus:border-[#3FC3B6]"
            >
              <option value="all">All Fields & Basins ({WELLS.length} Wells)</option>
              <optgroup label="Seven Sisters — Assam">
                <option value="Geleki">Geleki Field</option>
                <option value="Digboi">Digboi Field</option>
                <option value="Lakwa">Lakwa Field</option>
                <option value="Rudrasagar">Rudrasagar Field</option>
                <option value="Nahorkatiya">Nahorkatiya Field</option>
                <option value="Moran">Moran Field</option>
                <option value="Jorajan">Jorajan Field</option>
                <option value="Tengakhat">Tengakhat Field</option>
                <option value="Borholla">Borholla Field</option>
                <option value="Duliajan">Duliajan Field</option>
                <option value="Amguri">Amguri Field</option>
                <option value="Dhansiri">Dhansiri Field</option>
              </optgroup>
              <optgroup label="Seven Sisters — Tripura">
                <option value="Rokhia">Rokhia Gas Field</option>
                <option value="Baramura">Baramura Gas Field</option>
                <option value="Agartala Dome">Agartala Dome Field</option>
              </optgroup>
              <optgroup label="Seven Sisters — Arunachal Pradesh">
                <option value="Kumchai">Kumchai Field</option>
                <option value="Diyun">Diyun Field</option>
                <option value="Kharsang">Kharsang Field</option>
                <option value="Pasighat">Pasighat Frontier</option>
              </optgroup>
              <optgroup label="Seven Sisters — Nagaland, Mizoram, Manipur, Meghalaya">
                <option value="Changpang">Changpang Field (Nagaland)</option>
                <option value="Tuli">Tuli Field (Nagaland)</option>
                <option value="Bilkhawthlir">Bilkhawthlir (Mizoram)</option>
                <option value="Keifang">Keifang (Mizoram)</option>
                <option value="Churachandpur">Churachandpur (Manipur)</option>
                <option value="Tamenglong">Tamenglong (Manipur)</option>
                <option value="Baghmara">Baghmara (Meghalaya)</option>
                <option value="Dalu">Dalu (Meghalaya)</option>
              </optgroup>
              <optgroup label="Pan-India Basins — Western, Southern & Offshore">
                <option value="Barmer-Mangala">Barmer Mangala (Rajasthan)</option>
                <option value="Barmer-Bhagyam">Barmer Bhagyam (Rajasthan)</option>
                <option value="Ankleshwar">Ankleshwar (Cambay, Gujarat)</option>
                <option value="Gandhar">Gandhar (Cambay, Gujarat)</option>
                <option value="KG Deepwater">KG Deepwater (Andhra Pradesh)</option>
                <option value="Ravva Offshore">Ravva Offshore (KG Basin)</option>
                <option value="Mumbai High">Mumbai High (Offshore Maharashtra)</option>
                <option value="Bassein Gas">Bassein Gas (Offshore Maharashtra)</option>
                <option value="Narimanam">Narimanam (Cauvery, Tamil Nadu)</option>
                <option value="Bhuvanagiri">Bhuvanagiri (Cauvery, Tamil Nadu)</option>
              </optgroup>
            </select>
          </div>

          {/* Radial Search Proximity */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-[#6B7280] dark:text-[#94A3B8] block">
              Proximity Radius
            </label>
            <select
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full bg-[#F5F7F8] dark:bg-[#1E2532] border border-[#E2E5E8] dark:border-[#364356] rounded-none px-2.5 py-2 font-bold text-[#252B33] dark:text-white focus:outline-hidden focus:border-[#3FC3B6]"
            >
              <option value={10}>10 km Local Cluster</option>
              <option value={25}>25 km Standard Radius</option>
              <option value={50}>50 km Regional Search</option>
              <option value={100}>100 km Basin Wide</option>
              <option value={350}>350 km Seven Sisters / Northeast</option>
              <option value={1000}>1,000 km Inter-Basin Regional</option>
              <option value={3000}>3,000 km Pan-India National Grid</option>
            </select>
          </div>

          {/* Search Query Input */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-[#6B7280] dark:text-[#94A3B8] block">
              Search Wells / Blocks
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search GLK-07, Tipam..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F5F7F8] dark:bg-[#1E2532] border border-[#E2E5E8] dark:border-[#364356] rounded-none pl-8 pr-2.5 py-2 text-xs font-mono text-[#252B33] dark:text-white placeholder-[#6B7280] dark:placeholder-[#94A3B8] focus:outline-hidden focus:border-[#3FC3B6]"
              />
            </div>
          </div>

          {/* Ranking Mode Sorter */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-[#6B7280] dark:text-[#94A3B8] block">
              Ranking Mode
            </label>
            <div className="inline-flex w-full rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-[#F5F7F8] dark:bg-[#1E2532] p-0.5">
              <button
                type="button"
                onClick={() => setSortBy('similarity')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-none text-center font-bold text-[11px] cursor-pointer transition-colors ${
                  sortBy === 'similarity'
                    ? 'bg-[#26A69A] dark:bg-[#3FC3B6] text-white dark:text-[#191E26] shadow-2xs'
                    : 'text-[#6B7280] dark:text-[#94A3B8] hover:text-[#252B33] dark:hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span>Similarity</span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy('distance')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-none text-center font-bold text-[11px] cursor-pointer transition-colors ${
                  sortBy === 'distance'
                    ? 'bg-[#F59E0B] text-black shadow-2xs'
                    : 'text-[#6B7280] dark:text-[#94A3B8] hover:text-[#252B33] dark:hover:text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>Distance</span>
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* ─── Main Geospatial Console with Dedicated Sidebar Tabs ─── */}
      <section className="rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] p-4 sm:p-5 shadow-2xs overflow-hidden transition-colors">
        <div className="min-h-[640px] w-full">
          <WellMapInner
            centerWellId={centerWellId}
            radiusKm={radiusKm}
            searchQuery={searchQuery}
            selectedField={selectedField}
            sortBy={sortBy}
            onSortByChange={setSortBy}
          />
        </div>
      </section>
    </div>
  );
}
