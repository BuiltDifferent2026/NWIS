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
  Filter,
  CheckCircle2,
  Info,
  Calendar,
  Search,
  ExternalLink,
  Flame,
  X,
  Cpu,
  Boxes,
  FileSpreadsheet,
  Network
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { MEMORY_DECAY_INDEX, MemoryDecayIndex } from '@/data/live-state';

// Rich field archival dossiers for interactive inspector modal
interface FieldDossier {
  discoveryYear: number;
  totalLegacyWells: number;
  primaryArchiveLocation: string;
  storageCondition: string;
  paperDegradationState: 'CRITICAL_BRITTLE' | 'SEVERE_OXIDATION' | 'MODERATE' | 'CONTROLLED';
  atRiskFormations: string[];
  keyLegacyOffsetWells: string[];
  recommendedAction: string;
  estimatedDigitizationHours: number;
}

const FIELD_DOSSIERS: Record<string, FieldDossier> = {
  Digboi: {
    discoveryYear: 1889,
    totalLegacyWells: 1120,
    primaryArchiveLocation: 'Digboi Heritage Geological Repository (Record Room B-4)',
    storageCondition: 'High humidity storage, non-climate controlled; significant page yellowing & ink bleeding on 1920–1960 records.',
    paperDegradationState: 'CRITICAL_BRITTLE',
    atRiskFormations: ['Upper Tipam Sandstone', 'Digboi Sandstone', 'Girujan Clay'],
    keyLegacyOffsetWells: ['OIL-DGB-004', 'OIL-DGB-019', 'OIL-DGB-088', 'OIL-DGB-104'],
    recommendedAction: 'Immediate high-resolution planetary scanning & multi-column OCR for 851 fragile mud log sheets.',
    estimatedDigitizationHours: 640
  },
  Kharsang: {
    discoveryYear: 1976,
    totalLegacyWells: 82,
    primaryArchiveLocation: 'Arunachal Sub-Basin Exploration Office Archival Locker',
    storageCondition: 'Thermal fax paper fading on 1980s daily drilling reports; thrust fault correlation notes in hand-drawn binders.',
    paperDegradationState: 'SEVERE_OXIDATION',
    atRiskFormations: ['Girujan Claystone', 'Tipam Sandstone', 'Surma Group'],
    keyLegacyOffsetWells: ['KH-07', 'KH-12', 'KH-23'],
    recommendedAction: 'Extract tectonic thrust-fault shear and wellbore collapse learnings before physical logs are illegible.',
    estimatedDigitizationHours: 180
  },
  Geleki: {
    discoveryYear: 1968,
    totalLegacyWells: 148,
    primaryArchiveLocation: 'Nazira Central Technical Records Complex (Vault 2)',
    storageCondition: '300 DPI legacy black-and-white TIFF scans from 2002; unindexed metadata and missing casing seat tables.',
    paperDegradationState: 'MODERATE',
    atRiskFormations: ['Tipam Sandstone', 'Barail Main Sand', 'Kopili Shale'],
    keyLegacyOffsetWells: ['OIL-GLK-02', 'OIL-GLK-07', 'OIL-GLK-14 (Offset)', 'OIL-GLK-38'],
    recommendedAction: 'Entity vectorization of Barail high-pressure kick mitigation reports to safeguard current infill program.',
    estimatedDigitizationHours: 240
  },
  Rudrasagar: {
    discoveryYear: 1960,
    totalLegacyWells: 96,
    primaryArchiveLocation: 'Sibsagar Basin Records Cell',
    storageCondition: 'Typed cyclostyled reports with uneven carbon density; handwritten annotations in margins on formation fluid samples.',
    paperDegradationState: 'SEVERE_OXIDATION',
    atRiskFormations: ['Barail Coal-Shale', 'Kopili Formation', 'Sylhet Limestone'],
    keyLegacyOffsetWells: ['RDS-03', 'RDS-18', 'RDS-42'],
    recommendedAction: 'Harmonize inconsistent regional naming of Eocene Kopili abnormal pressure zones into standard OIL stratigraphy.',
    estimatedDigitizationHours: 190
  },
  Lakwa: {
    discoveryYear: 1964,
    totalLegacyWells: 190,
    primaryArchiveLocation: 'Lakwa Field Engineering Office Archives',
    storageCondition: 'Partial PDF scans available; bit record tables and hydraulic optimization sheets detached from primary WCRs.',
    paperDegradationState: 'MODERATE',
    atRiskFormations: ['Tipam Sandstone (Pebble Beds)', 'Bokabil Formation', 'Girujan Clay'],
    keyLegacyOffsetWells: ['LAK-08', 'LAK-31', 'LAK-79'],
    recommendedAction: 'Map Tipam pebble-bed drill string vibration post-mortems to modern PDC bit selection workflows.',
    estimatedDigitizationHours: 210
  },
  'Pengri-Bardumsha': {
    discoveryYear: 1992,
    totalLegacyWells: 34,
    primaryArchiveLocation: 'Duliajan Central IT & Subsurface Server',
    storageCondition: 'Mostly digital PDFs with scanned directional surveys; minor legacy paper survey slips requiring azimuth recalibration.',
    paperDegradationState: 'CONTROLLED',
    atRiskFormations: ['Tipam Sandstone', 'Barail Sandstone'],
    keyLegacyOffsetWells: ['PB-02', 'PB-09', 'PB-14'],
    recommendedAction: 'Cross-reference trajectory surveys with geological marker shifts in recent fault block.',
    estimatedDigitizationHours: 65
  }
};

export default function MemoryDecayIndexPage() {
  const [selectedField, setSelectedField] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [reportExported, setReportExported] = useState<boolean>(false);
  const [showMethodology, setShowMethodology] = useState<boolean>(false);
  const [activeDossierField, setActiveDossierField] = useState<string | null>(null);
  const [digitizationTriggered, setDigitizationTriggered] = useState<string | null>(null);

  const filteredData = MEMORY_DECAY_INDEX.filter((item) => {
    if (selectedField !== 'all' && item.field.toLowerCase() !== selectedField.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim() !== '' && !item.field.toLowerCase().includes(searchQuery.toLowerCase()) && !item.keyVulnerability.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const totalLegacy = MEMORY_DECAY_INDEX.reduce((acc, curr) => acc + curr.totalLegacyWells, 0);
  const totalAtRisk = MEMORY_DECAY_INDEX.reduce((acc, curr) => acc + curr.atRiskRecordCount, 0);
  const totalPaperOnly = MEMORY_DECAY_INDEX.reduce((acc, curr) => acc + Math.round(curr.atRiskRecordCount * (curr.paperOnlyPercentage / (curr.paperOnlyPercentage + curr.scannedUnstructuredPercentage || 1))), 0);
  const avgDecay = Math.round(
    MEMORY_DECAY_INDEX.reduce((acc, curr) => acc + curr.decayRiskScore, 0) / MEMORY_DECAY_INDEX.length
  );

  const handleExport = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  const handleTriggerDigitization = (fieldName: string) => {
    setDigitizationTriggered(fieldName);
    setTimeout(() => setDigitizationTriggered(null), 3500);
  };

  const getDecayBadgeColor = (score: number) => {
    if (score >= 75) return 'text-[#ED1C24] bg-[#FDF2F2] border-[#E05252]';
    if (score >= 55) return 'text-[#F2B84B] bg-[#F5F7F8] border-[#E2E5E8]';
    return 'text-[#3FAE68] bg-[#D9F2EE] border-[#3FC3B6]';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* ─── Breadcrumb ─── */}
      <Breadcrumb
        items={[
          { label: 'Institutional Memory', href: '/dashboard' },
          { label: 'Decay Index' }
        ]}
      />

      {/* ─── Header Strip ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#252B33] dark:text-white font-mono">
              Institutional Memory Decay Index
            </h1>
            <Badge className="bg-[#ED1C24]/10 text-[#ED1C24] border-[#E05252] text-[10px] font-mono font-bold rounded-none">
              BASIN RISK: 65/100
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-neutral-400 mt-1">
            Quantifying subsurface institutional knowledge erosion across legacy Assam-Arakan assets. Prioritizing physical archives before paper degradation and retired personnel knowledge loss.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowMethodology(!showMethodology)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-none border border-[#E2E5E8] bg-white hover:bg-[#F5F7F8] text-[#252B33] text-xs font-mono font-bold transition-colors shadow-2xs"
          >
            <Info className="w-3.5 h-3.5 text-[#3FC3B6]" />
            <span>{showMethodology ? 'Hide Formula' : 'Decay Formula'}</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-none border border-[#222222] bg-[#34435A] hover:bg-[#222222] text-white text-xs font-bold font-mono shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#3FC3B6]" />
            <span>{reportExported ? 'PDF Report Ready' : 'Export Audit PDF'}</span>
          </button>
        </div>
      </div>

      {/* ─── Collapsible Methodology Specification Box ─── */}
      {showMethodology && (
        <Card className="rounded-none border border-[#3FC3B6] bg-[#D9F2EE]/30 p-5 shadow-2xs space-y-3 transition-all animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#26A69A] font-bold font-mono text-xs uppercase tracking-wide">
              <Cpu className="w-4 h-4 text-[#3FC3B6]" />
              <span>PSU Subsurface Knowledge Decay Formulation (SIH-OIL-DEC-01)</span>
            </div>
            <button 
              onClick={() => setShowMethodology(false)}
              className="text-[#6B7280] hover:text-[#252B33]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xs font-mono text-[#252B33] space-y-2 leading-relaxed">
            <div className="p-3 bg-white rounded-none border border-[#3FC3B6] font-mono text-xs">
              <span className="text-[#26A69A] font-bold">Decay Index Formula:</span>{' '}
              <code className="text-[#252B33] dark:text-white font-bold">
                D(field) = [ 0.40 × Paper% ] + [ 0.25 × UnindexedScan% ] + [ 0.20 × (AvgAge / 60) × 100 ] + [ 0.15 × HazardSeverityScore ]
              </code>
            </div>
            <p className="text-[11px] text-[#6B7280] dark:text-neutral-400 font-sans">
              • <strong>Paper Deterioration Weight (40%):</strong> Highest weight attributed to acidic paper records susceptible to humidity in Upper Assam climate.<br />
              • <strong>Unindexed Scan Penalty (25%):</strong> TIFF scans stored without tabular OCR are computationally invisible to live drilling lookahead systems.<br />
              • <strong>Senior Rig Superintendent Memory Loss:</strong> Institutional knowledge carried solely by retired engineers without documented WCR post-mortems.
            </p>
          </div>
        </Card>
      )}

      {/* ─── Key KPI Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <Card className="rounded-none border border-[#E2E5E8] bg-white p-5 shadow-2xs flex flex-col justify-between space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#6B7280]">
              Highest Decay Risk
            </span>
            <Badge className="bg-[#ED1C24]/10 text-[#ED1C24] border-[#E05252] text-[9px] font-mono font-bold rounded-none">
              CRITICAL
            </Badge>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono text-[#ED1C24]">
              Digboi: 88/100
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5">
              54-year average record age (1889 vintage)
            </p>
          </div>
          <div className="pt-2 border-t border-[#E2E5E8] text-[11px] text-[#6B7280] font-mono">
            Vulnerability: <strong className="text-[#252B33] dark:text-white">Depleted reservoir losses</strong>
          </div>
        </Card>

        {/* KPI 2 */}
        <Card className="rounded-none border border-[#E2E5E8] bg-white p-5 shadow-2xs flex flex-col justify-between space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#6B7280]">
              Total At-Risk Records
            </span>
            <Badge className="bg-[#F5F7F8] text-[#F2B84B] border-[#E2E5E8] text-[9px] font-mono font-bold rounded-none">
              UNPROTECTED
            </Badge>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono text-[#252B33] dark:text-white">
              {totalAtRisk.toLocaleString()} Records
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5">
              581 Paper-only + 532 Unindexed TIFF scans
            </p>
          </div>
          <div className="pt-2 border-t border-[#E2E5E8] text-[11px] text-[#6B7280] font-mono">
            Covering <strong className="text-[#252B33] dark:text-white">6 Assam asset fields</strong>
          </div>
        </Card>

        {/* KPI 3 */}
        <Card className="rounded-none border border-[#E2E5E8] bg-white p-5 shadow-2xs flex flex-col justify-between space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#6B7280]">
              Monitored Legacy Wells
            </span>
            <Badge className="bg-[#D9F2EE] text-[#26A69A] border-[#3FC3B6] text-[9px] font-mono font-bold rounded-none">
              BASIN CATALOG
            </Badge>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono text-[#252B33] dark:text-white">
              {totalLegacy.toLocaleString()} Wells
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Spud dates between 1889 and 2020
            </p>
          </div>
          <div className="pt-2 border-t border-[#E2E5E8] text-[11px] text-[#6B7280] font-mono">
            Average Basin Decay: <strong className="text-[#F2B84B]">{avgDecay}/100</strong>
          </div>
        </Card>

        {/* KPI 4 */}
        <Card className="rounded-none border border-[#E2E5E8] bg-white p-5 shadow-2xs flex flex-col justify-between space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#6B7280]">
              Digitization Priority
            </span>
            <Badge className="bg-[#D9F2EE] text-[#26A69A] border-[#3FC3B6] text-[9px] font-mono font-bold rounded-none">
              BATCH #4 ACTIVE
            </Badge>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono text-[#34435A] dark:text-[#3FC3B6]">
              851 Digboi WCRs
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Requires layout OCR & stratigraphy linking
            </p>
          </div>
          <div className="pt-2 border-t border-[#E2E5E8] text-[11px] text-[#6B7280] font-mono">
            Pipeline Throughput: <strong className="text-[#3FAE68]">14 pages/min</strong>
          </div>
        </Card>

      </div>

      {/* ─── Interactive Comparison Matrix Table ─── */}
      <Card className="rounded-none border border-[#E2E5E8] bg-white shadow-2xs overflow-hidden">
        
        {/* Table Filter Bar */}
        <div className="p-4 border-b border-[#E2E5E8] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#F5F7F8]">
          <div>
            <h2 className="text-sm font-extrabold text-[#252B33] dark:text-white font-mono uppercase tracking-wide">
              Field Knowledge Preservation Register
            </h2>
            <p className="text-xs text-[#6B7280]">
              Real-time audit of paper vs. scanned unstructured vs. vectorized structured WCR &amp; DDR records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#6B7280]" />
              <input 
                type="text"
                placeholder="Search field or hazard..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-none border border-[#E2E5E8] dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[#252B33] dark:text-white text-xs placeholder:text-[#6B7280] focus:outline-hidden focus:border-[#3FC3B6]"
              />
            </div>

            {/* Field Dropdown Filter */}
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="border border-[#E2E5E8] dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-none px-2.5 py-1.5 text-xs font-bold text-[#252B33] dark:text-white focus:outline-hidden focus:border-[#3FC3B6]"
            >
              <option value="all">All Assam Fields (6)</option>
              <option value="digboi">Digboi Field</option>
              <option value="kharsang">Kharsang Field</option>
              <option value="geleki">Geleki Field</option>
              <option value="rudrasagar">Rudrasagar Field</option>
              <option value="lakwa">Lakwa Field</option>
              <option value="pengri-bardumsha">Pengri-Bardumsha</option>
            </select>
          </div>
        </div>

        {/* Semantic Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-200 dark:border-neutral-800 text-xs font-mono uppercase bg-neutral-100/70 dark:bg-neutral-900/60">
                <TableHead className="font-bold text-neutral-700 dark:text-neutral-300">Field Asset</TableHead>
                <TableHead className="font-bold text-neutral-700 dark:text-neutral-300">Total Wells</TableHead>
                <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 min-w-[220px]">
                  Format Distribution (Dig / Scan / Paper)
                </TableHead>
                <TableHead className="font-bold text-neutral-700 dark:text-neutral-300">At-Risk Count</TableHead>
                <TableHead className="font-bold text-neutral-700 dark:text-neutral-300">Avg Age</TableHead>
                <TableHead className="font-bold text-neutral-700 dark:text-neutral-300">Decay Score</TableHead>
                <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 min-w-[260px]">Key Knowledge Vulnerability</TableHead>
                <TableHead className="font-bold text-neutral-700 dark:text-neutral-300 text-right">Archival Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row) => {
                const dossier = FIELD_DOSSIERS[row.field];
                return (
                  <TableRow 
                    key={row.field} 
                    className="border-neutral-100 dark:border-neutral-800/80 hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    
                    {/* Field Name + Discovery */}
                    <TableCell className="font-extrabold text-neutral-950 dark:text-white text-xs">
                      <div>
                        <span>{row.field}</span>
                        {dossier && (
                          <span className="block text-[10px] text-neutral-400 dark:text-neutral-500 font-mono font-normal">
                            Disc: {dossier.discoveryYear}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Total Wells */}
                    <TableCell className="font-mono text-xs text-neutral-700 dark:text-neutral-300 font-bold">
                      {row.totalLegacyWells}
                    </TableCell>

                    {/* Stacked Format Distribution Bar */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="h-2.5 w-full rounded-none bg-[#E2E5E8] border border-[#E2E5E8] overflow-hidden flex">
                          <div 
                            style={{ width: `${row.digitizedPercentage}%` }} 
                            className="bg-[#3FAE68] h-full" 
                            title={`Digitized & Vectorized: ${row.digitizedPercentage}%`}
                          />
                          <div 
                            style={{ width: `${row.scannedUnstructuredPercentage}%` }} 
                            className="bg-[#F2B84B] h-full" 
                            title={`Scanned Unstructured TIFF: ${row.scannedUnstructuredPercentage}%`}
                          />
                          <div 
                            style={{ width: `${row.paperOnlyPercentage}%` }} 
                            className="bg-[#ED1C24] h-full" 
                            title={`Fragile Paper Archive: ${row.paperOnlyPercentage}%`}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-[#3FAE68] font-bold">{row.digitizedPercentage}% Dig</span>
                          <span className="text-[#F2B84B] font-bold">{row.scannedUnstructuredPercentage}% Scan</span>
                          <span className="text-[#ED1C24] font-bold">{row.paperOnlyPercentage}% Paper</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* At-Risk Records */}
                    <TableCell className="font-mono text-xs font-extrabold text-[#ED1C24]">
                      {row.atRiskRecordCount} records
                    </TableCell>

                    {/* Avg Age */}
                    <TableCell className="font-mono text-xs text-[#6B7280]">
                      {row.averageRecordAgeYears} yrs
                    </TableCell>

                    {/* Decay Score */}
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className={`font-mono text-xs font-bold rounded-none ${getDecayBadgeColor(row.decayRiskScore)}`}>
                          {row.decayRiskScore} / 100
                        </Badge>
                      </div>
                    </TableCell>

                    {/* Vulnerability */}
                    <TableCell className="text-xs text-[#252B33] font-sans leading-relaxed">
                      {row.keyVulnerability}
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right">
                      <button
                        type="button"
                        onClick={() => setActiveDossierField(row.field)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-none text-xs font-mono font-bold bg-[#F5F7F8] hover:bg-[#3FC3B6] hover:text-[#252B33] text-[#252B33] border border-[#E2E5E8] transition-colors cursor-pointer"
                      >
                        <span>Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </TableCell>

                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Legend strip */}
        <div className="p-3.5 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0c0f17] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-500 dark:text-neutral-400">
          <div className="flex flex-wrap items-center gap-5">
            <span className="font-bold text-neutral-700 dark:text-neutral-300 uppercase text-[11px]">Format Legend:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              <span>Structured &amp; Vectorized</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-none bg-[#F2B84B] inline-block" />
              <span>Unindexed TIFF / PDF Scans</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-none bg-[#ED1C24] inline-block" />
              <span>Fragile Paper Archives</span>
            </div>
          </div>

          <Link
            href="/admin/ingestion"
            className="text-[#26A69A] hover:text-[#3FC3B6] hover:underline font-bold inline-flex items-center gap-1 text-xs"
          >
            <span>Open Ingestion Pipeline Console</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

      </Card>

      {/* ─── Field Archive Detail Drawer / Inspector Modal ─── */}
      {activeDossierField && FIELD_DOSSIERS[activeDossierField] && (
        <div className="fixed inset-0 z-50 bg-[#222222]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full rounded-none border border-[#E2E5E8] bg-white p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-start justify-between pb-3 border-b border-[#E2E5E8]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-none bg-[#34435A] border border-[#222222] text-[#3FC3B6] flex items-center justify-center font-extrabold font-mono">
                  {activeDossierField.substring(0, 3).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold font-mono text-[#252B33] dark:text-white">
                    {activeDossierField} Field Archival Preservation Dossier
                  </h3>
                  <span className="text-xs text-[#6B7280] font-mono">
                    Discovered: {FIELD_DOSSIERS[activeDossierField].discoveryYear} • {FIELD_DOSSIERS[activeDossierField].totalLegacyWells} Historical Wells
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setActiveDossierField(null)}
                className="p-1 rounded-none text-[#6B7280] hover:text-[#252B33] hover:bg-[#F5F7F8] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs font-mono">
              {/* Storage & Condition */}
              <div className="p-3.5 rounded-none bg-[#F5F7F8] border border-[#E2E5E8] space-y-1.5">
                <div className="text-[#6B7280] uppercase text-[10px] font-bold">Physical Repository Location</div>
                <div className="text-[#252B33] dark:text-white font-bold">{FIELD_DOSSIERS[activeDossierField].primaryArchiveLocation}</div>
                <div className="text-[#6B7280] font-sans text-xs pt-1 leading-relaxed">
                  {FIELD_DOSSIERS[activeDossierField].storageCondition}
                </div>
              </div>

              {/* Grid 2-col info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-none bg-[#F5F7F8] border border-[#E2E5E8] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#6B7280]">At-Risk Formations</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {FIELD_DOSSIERS[activeDossierField].atRiskFormations.map((f) => (
                      <Badge key={f} variant="outline" className="text-[10px] font-mono bg-white rounded-none border-[#E2E5E8]">
                        {f}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-none bg-[#F5F7F8] border border-[#E2E5E8] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#6B7280]">Critical Legacy Offset Wells</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {FIELD_DOSSIERS[activeDossierField].keyLegacyOffsetWells.map((w) => (
                      <span key={w} className="px-2 py-0.5 rounded-none bg-[#D9F2EE] text-[#26A69A] border border-[#3FC3B6] font-bold text-[10px]">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="p-3.5 rounded-none bg-[#FDF2F2] border border-[#E05252] space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#ED1C24]">Preservation Action Plan</span>
                <p className="text-xs text-[#252B33] font-sans leading-relaxed">
                  {FIELD_DOSSIERS[activeDossierField].recommendedAction}
                </p>
                <div className="pt-1 text-[11px] text-[#6B7280]">
                  Est. Layout OCR & Vectorization: <strong>{FIELD_DOSSIERS[activeDossierField].estimatedDigitizationHours} CPU Hours</strong>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E2E5E8]">
              <span className="text-[11px] font-mono text-[#6B7280]">
                {digitizationTriggered === activeDossierField ? (
                  <span className="text-[#3FAE68] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Dispatched to Ingestion Queue
                  </span>
                ) : (
                  'Ready for Batch OCR Ingestion'
                )}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveDossierField(null)}
                  className="px-3.5 py-1.5 rounded-none border border-[#E2E5E8] bg-white text-[#252B33] dark:text-neutral-300 text-xs font-mono font-bold hover:bg-[#F5F7F8] transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerDigitization(activeDossierField)}
                  className="px-3.5 py-1.5 rounded-none bg-[#34435A] hover:bg-[#222222] text-white text-xs font-mono font-bold transition-colors shadow-2xs cursor-pointer border border-[#222222]"
                >
                  Prioritize Ingestion
                </button>
              </div>
            </div>

          </Card>
        </div>
      )}

      {/* ─── Complete 4-Stage Knowledge Preservation Roadmap ─── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold font-mono text-[#252B33] dark:text-white uppercase tracking-wide">
              Subsurface Ingestion &amp; Memory Preservation Architecture
            </h2>
            <p className="text-xs text-[#6B7280]">
              Four-stage automated pipeline transforming century-old hand-drafted drilling archives into real-time eRTMAC hazard lookaheads.
            </p>
          </div>
          <Badge className="bg-[#D9F2EE] text-[#26A69A] border-[#3FC3B6] text-[10px] font-mono font-bold rounded-none">
            STAGE 3 VECTORIZED
          </Badge>
                 {/* Stage 01 */}
          <Card className="rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] p-5 shadow-2xs flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-none bg-[#34435A] dark:bg-[#1E2532] text-[#3FC3B6] border border-[#222222] dark:border-[#364356] flex items-center justify-center font-extrabold text-xs font-mono">
                  01
                </div>
                <Badge variant="outline" className="text-[9px] font-mono bg-[#D9F2EE] dark:bg-[#3FC3B6]/20 text-[#26A69A] dark:text-[#3FC3B6] border-[#3FC3B6] rounded-none">
                  94.2% ACCURACY
                </Badge>
              </div>
              <h3 className="text-sm font-extrabold text-[#252B33] dark:text-white">
                Layout-Aware Optical Ingestion
              </h3>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] leading-relaxed font-sans">
                Prioritizing 851 fragile Digboi records. Multi-column table OCR captures mud weight schedules, casing seats, and bit records into verified JSON schemas.
              </p>
            </div>
            <div className="pt-2 border-t border-[#E2E5E8] dark:border-[#364356] text-[10px] font-mono text-[#6B7280] dark:text-[#94A3B8] flex items-center justify-between">
              <span>851 records queued</span>
              <span className="text-[#ED1C24] font-bold">Digboi Focus</span>
            </div>
          </Card>

          {/* Stage 02 */}
          <Card className="rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] p-5 shadow-2xs flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-none bg-[#34435A] dark:bg-[#1E2532] text-[#3FC3B6] border border-[#222222] dark:border-[#364356] flex items-center justify-center font-extrabold text-xs font-mono">
                  02
                </div>
                <Badge variant="outline" className="text-[9px] font-mono bg-[#D9F2EE] dark:bg-[#3FC3B6]/20 text-[#26A69A] dark:text-[#3FC3B6] border-[#3FC3B6] rounded-none">
                  18,450 ENTITIES
                </Badge>
              </div>
              <h3 className="text-sm font-extrabold text-[#252B33] dark:text-white">
                Stratigraphic Entity Normalization
              </h3>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] leading-relaxed font-sans">
                Harmonizes historical lithology aliases (e.g. Tipam Ss, Girujan Clay, Barail Main Sand) to standardized OIL Assam-Arakan stratigraphic taxonomy.
              </p>
            </div>
            <div className="pt-2 border-t border-[#E2E5E8] dark:border-[#364356] text-[10px] font-mono text-[#6B7280] dark:text-[#94A3B8] flex items-center justify-between">
              <span>1,670 legacy wells</span>
              <span className="text-[#3FAE68] font-bold">Standard Taxonomy</span>
            </div>
          </Card>

          {/* Stage 03 — PREVIOUSLY EMPTY, NOW COMPLETE AND RICH */}
          <Card className="rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] p-5 shadow-2xs flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-none bg-[#34435A] dark:bg-[#1E2532] text-[#3FC3B6] border border-[#222222] dark:border-[#364356] flex items-center justify-center font-extrabold text-xs font-mono">
                  03
                </div>
                <Badge variant="outline" className="text-[9px] font-mono bg-[#D9F2EE] dark:bg-[#3FC3B6]/20 text-[#26A69A] dark:text-[#3FC3B6] border-[#3FC3B6] rounded-none">
                  &lt;120ms QUERY
                </Badge>
              </div>
              <h3 className="text-sm font-extrabold text-[#252B33] dark:text-white">
                Geospatial &amp; Depth Vector Indexing
              </h3>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] leading-relaxed font-sans">
                Dense embedding of historical DDR post-mortems, mud loss incidents, and kick events into pgvector with 3D spatial bit coordinates.
              </p>
            </div>
            <div className="pt-2 border-t border-[#E2E5E8] dark:border-[#364356] text-[10px] font-mono text-[#6B7280] dark:text-[#94A3B8] flex items-center justify-between">
              <span>1.2M vector chunks</span>
              <span className="text-[#26A69A] dark:text-[#3FC3B6] font-bold">Dense Subsurface RAG</span>
            </div>
          </Card>

          {/* Stage 04 — REAL-TIME LOOKAHEAD DISPATCH */}
          <Card className="rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] p-5 shadow-2xs flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-none bg-[#34435A] dark:bg-[#1E2532] text-[#3FC3B6] border border-[#222222] dark:border-[#364356] flex items-center justify-center font-extrabold text-xs font-mono">
                  04
                </div>
                <Badge variant="outline" className="text-[9px] font-mono bg-[#D9F2EE] dark:bg-[#3FC3B6]/20 text-[#26A69A] dark:text-[#3FC3B6] border-[#3FC3B6] rounded-none">
                  ZERO DRIFT
                </Badge>
              </div>
              <h3 className="text-sm font-extrabold text-[#252B33] dark:text-white">
                Real-Time eRTMAC Lookahead
              </h3>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] leading-relaxed font-sans">
                Matches active telemetry (depth, ROP, torque) against analog offset corridors, pushing proactive hazard advisories 50–100m prior to loss horizons.
              </p>
            </div>
            <div className="pt-2 border-t border-[#E2E5E8] dark:border-[#364356] text-[10px] font-mono text-[#6B7280] dark:text-[#94A3B8] flex items-center justify-between">
              <span>50m–100m Lookahead</span>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
