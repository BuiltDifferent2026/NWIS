'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingDown, 
  AlertTriangle, 
  FileText, 
  Database, 
  Download, 
  ArrowRight, 
  Clock, 
  Layers, 
  ShieldAlert,
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { MEMORY_DECAY_INDEX, MemoryDecayIndex } from '@/data/live-state';

export default function MemoryDecayIndexPage() {
  const [selectedField, setSelectedField] = useState<string>('all');
  const [reportExported, setReportExported] = useState<boolean>(false);

  const filteredData = MEMORY_DECAY_INDEX.filter((item) => {
    if (selectedField !== 'all' && item.field.toLowerCase() !== selectedField.toLowerCase()) {
      return false;
    }
    return true;
  });

  const totalLegacy = MEMORY_DECAY_INDEX.reduce((acc, curr) => acc + curr.totalLegacyWells, 0);
  const totalAtRisk = MEMORY_DECAY_INDEX.reduce((acc, curr) => acc + curr.atRiskRecordCount, 0);
  const avgDecay = Math.round(
    MEMORY_DECAY_INDEX.reduce((acc, curr) => acc + curr.decayRiskScore, 0) / MEMORY_DECAY_INDEX.length
  );

  const handleExport = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 2500);
  };

  const getDecayColor = (score: number) => {
    if (score >= 75) return 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800';
    if (score >= 55) return 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
    return 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* ─── Breadcrumb ─── */}
      <Breadcrumb
        items={[
          { label: 'Institutional Memory', href: '/dashboard' },
          { label: 'Decay Index' }
        ]}
      />

      {/* ─── Header Strip ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-[11px] font-mono font-semibold mb-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>KNOWLEDGE EROSION AUDIT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Institutional Memory Decay Index
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
            Quantifying subsurface institutional knowledge erosion across legacy Assam-Arakan assets.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{reportExported ? 'Report Generated' : 'Export Audit PDF'}</span>
          </button>
        </div>
      </div>

      {/* ─── Key KPI Cards (Spacious, Uncluttered) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <Card className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs flex flex-col justify-between space-y-2">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Highest Decay Risk
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-rose-600 dark:text-rose-400">
              Digboi: 88/100
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              54-year average record age
            </p>
          </div>
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
            Vulnerability: <strong className="text-neutral-900 dark:text-white">Depleted reservoir losses</strong>
          </div>
        </Card>

        {/* KPI 2 */}
        <Card className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs flex flex-col justify-between space-y-2">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Total At-Risk Records
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-neutral-950 dark:text-white">
              {totalAtRisk.toLocaleString()} Records
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Paper-only & unindexed TIFF scans
            </p>
          </div>
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
            Across <strong className="text-neutral-900 dark:text-white">6 asset fields</strong>
          </div>
        </Card>

        {/* KPI 3 */}
        <Card className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs flex flex-col justify-between space-y-2">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Monitored Legacy Wells
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-neutral-950 dark:text-white">
              {totalLegacy.toLocaleString()} Wells
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Drilled between 1889 and 2020
            </p>
          </div>
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
            Average Basin Decay: <strong className="text-amber-700 dark:text-amber-400">{avgDecay}/100</strong>
          </div>
        </Card>

        {/* KPI 4 */}
        <Card className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs flex flex-col justify-between space-y-2">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Digitization Priority
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-amber-700 dark:text-amber-400">
              851 Digboi WCRs
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Requires immediate layout OCR
            </p>
          </div>
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
            Queue status: <strong className="text-emerald-700 dark:text-emerald-400">Ready for Ingestion</strong>
          </div>
        </Card>

      </div>

      {/* ─── Interactive Comparison Matrix Table ─── */}
      <Card className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] shadow-xs overflow-hidden">
        
        {/* Table Filter Bar */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div>
            <h2 className="text-sm font-extrabold text-neutral-950 dark:text-white">
              Field Knowledge Preservation Register
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Breakdown of paper vs. scanned unstructured vs. digitized structured WCR/DDR records.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-neutral-500 dark:text-neutral-400">Field Filter:</span>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl px-2.5 py-1 text-xs font-bold text-neutral-900 dark:text-white focus:outline-hidden"
            >
              <option value="all">All Assam Fields</option>
              <option value="digboi">Digboi</option>
              <option value="kharsang">Kharsang</option>
              <option value="geleki">Geleki</option>
              <option value="rudrasagar">Rudrasagar</option>
              <option value="lakwa">Lakwa</option>
              <option value="pengri-bardumsha">Pengri-Bardumsha</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-200 text-xs font-mono uppercase bg-neutral-50">
                <TableHead className="font-bold text-neutral-700">Field Asset</TableHead>
                <TableHead className="font-bold text-neutral-700">Total Wells</TableHead>
                <TableHead className="font-bold text-neutral-700 min-w-[200px]">Format Distribution (Dig / Scan / Paper)</TableHead>
                <TableHead className="font-bold text-neutral-700">At-Risk Count</TableHead>
                <TableHead className="font-bold text-neutral-700">Avg Record Age</TableHead>
                <TableHead className="font-bold text-neutral-700">Decay Score</TableHead>
                <TableHead className="font-bold text-neutral-700 min-w-[280px]">Key Knowledge Vulnerability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.field} className="border-neutral-100 hover:bg-neutral-50/70 transition-colors">
                  
                  {/* Field */}
                  <TableCell className="font-extrabold text-neutral-950 text-xs">
                    {row.field}
                  </TableCell>

                  {/* Total Wells */}
                  <TableCell className="font-mono text-xs text-neutral-700 font-bold">
                    {row.totalLegacyWells}
                  </TableCell>

                  {/* Stacked Format Distribution Bar */}
                  <TableCell>
                    <div className="space-y-1">
                      <div className="h-2.5 w-full rounded-full bg-neutral-200 overflow-hidden flex">
                        <div 
                          style={{ width: `${row.digitizedPercentage}%` }} 
                          className="bg-emerald-600 h-full" 
                          title={`Digitized: ${row.digitizedPercentage}%`}
                        />
                        <div 
                          style={{ width: `${row.scannedUnstructuredPercentage}%` }} 
                          className="bg-amber-500 h-full" 
                          title={`Scanned Unstructured: ${row.scannedUnstructuredPercentage}%`}
                        />
                        <div 
                          style={{ width: `${row.paperOnlyPercentage}%` }} 
                          className="bg-rose-500 h-full" 
                          title={`Paper Only: ${row.paperOnlyPercentage}%`}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                        <span className="text-emerald-700 font-bold">{row.digitizedPercentage}% Dig</span>
                        <span className="text-amber-700 font-bold">{row.scannedUnstructuredPercentage}% Scan</span>
                        <span className="text-rose-700 font-bold">{row.paperOnlyPercentage}% Paper</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* At-Risk Records */}
                  <TableCell className="font-mono text-xs font-extrabold text-rose-700">
                    {row.atRiskRecordCount}
                  </TableCell>

                  {/* Avg Age */}
                  <TableCell className="font-mono text-xs text-neutral-600">
                    {row.averageRecordAgeYears} years
                  </TableCell>

                  {/* Decay Score */}
                  <TableCell>
                    <Badge variant="outline" className={`font-mono text-xs font-bold ${getDecayColor(row.decayRiskScore)}`}>
                      {row.decayRiskScore} / 100
                    </Badge>
                  </TableCell>

                  {/* Vulnerability */}
                  <TableCell className="text-xs text-neutral-700 font-sans leading-relaxed">
                    {row.keyVulnerability}
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Legend strip */}
        <div className="p-3.5 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 flex flex-wrap items-center gap-5 text-xs font-mono text-neutral-500 dark:text-neutral-400">
          <span className="font-bold text-neutral-700 dark:text-neutral-300 uppercase text-[11px]">Format Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            <span>Structured & Vectorized</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>Unindexed TIFF / PDF Scans</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span>Fragile Paper Archives</span>
          </div>
        </div>

      </Card>

      {/* ─── Knowledge Preservation Roadmap ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <Card className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center justify-center font-bold text-xs font-mono">
            01
          </div>
          <h3 className="text-sm font-extrabold text-neutral-950 dark:text-white">
            Layout-Aware Optical Ingestion
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Prioritizing 851 fragile Digboi records. Multi-column table OCR captures mud weight schedules and casing seats into verified JSON.
          </p>
        </Card>

        <Card className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center justify-center font-bold text-xs font-mono">
            02
          </div>
          <h3 className="text-sm font-extrabold text-neutral-950 dark:text-white">
            Stratigraphic Entity Vectorization
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Normalizes historical lithology nomenclature (e.g. Tipam Ss, Girujan Clay) to standard OIL stratigraphy across 1,690 legacy wells.
          </p>
        </Card>

        <Card className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center font-bold text-xs font-mono">
            03
          </div>
          <h3 className="text-sm font-extrabold text-neutral-950 dark:text-white">
            eRTMAC Live Bridge Ingestion
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Fuses digitized historical risk corridors with live WITSML drilling feeds, eliminating NPT surprises 75m before hazard depth.
          </p>
        </Card>

      </div>

    </div>
  );
}
