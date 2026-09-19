'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  CheckCircle2, 
  TrendingDown, 
  ArrowRight, 
  Compass, 
  ChevronRight, 
  HardHat, 
  Database 
} from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { WELLS, Well } from '@/data/wells';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { HazardProximityGauge } from '@/components/dashboard/HazardProximityGauge';
import { MemoryDecayRingCard } from '@/components/dashboard/MemoryDecayRingCard';
import { ProactiveInsightCard } from '@/components/dashboard/ProactiveInsightCard';
import { ShiftRemindersCard } from '@/components/dashboard/ShiftRemindersCard';

export default function DashboardPage() {
  const { currentRole, alerts } = useAppStore();
  const [fieldFilter, setFieldFilter] = useState<string>('all');

  // Filter active drilling rigs from rich src/data/wells.ts
  const activeWells = WELLS.filter((w) => w.status === 'drilling');
  const allFilteredWells = WELLS.filter((w) => {
    if (fieldFilter !== 'all' && w.field.toLowerCase() !== fieldFilter.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* ─── Top Greeting & Overview Banner ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-mono">
            Assam-Arakan Basin Fleet
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Real-time subsurface hazard lookahead alongside eRTMAC live drilling feeds.
          </p>
        </div>

        {/* Basin Status Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] shadow-2xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-neutral-900 dark:text-white">Rigs Online: 2</span>
            <span className="text-neutral-400 dark:text-neutral-600">|</span>
            <span className="text-neutral-600 dark:text-neutral-400">Assam Sector</span>
          </div>
        </div>
      </div>

      {/* ─── Role Context Banner (Clean, Uncluttered, Purposeful) ─── */}
      {currentRole === 'field_engineer' && (
        <div className="p-4 rounded-2xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/60 dark:bg-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">Rig Floor Cockpit Focus</span>
                <Badge className="bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700 font-mono text-[10px]">OIL-GLK-14</Badge>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-neutral-950 dark:text-white mt-0.5">
                Approaching Tipam Sandstone Loss Corridor in <span className="text-amber-800 dark:text-amber-400 font-mono font-bold">14.6m</span> (at 2,180m MD)
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/wells/well-glk-14"
              className="px-3.5 py-1.5 rounded-xl bg-neutral-950 dark:bg-amber-600 hover:bg-neutral-800 dark:hover:bg-amber-700 text-white text-xs font-bold font-mono transition-colors shadow-2xs"
            >
              Open Rig Cockpit →
            </Link>
            <Link
              href="/replay"
              className="px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold font-mono transition-colors"
            >
              Validate in Replay
            </Link>
          </div>
        </div>
      )}

      {currentRole === 'admin' && (
        <div className="p-4 rounded-2xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/60 dark:bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">Governance & Ingestion Audit</span>
                <Badge className="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700 font-mono text-[10px]">94.2% OCR Conf</Badge>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-neutral-950 dark:text-white mt-0.5">
                1,690 historical documents vectorized across Assam Basin • 14 unindexed scans pending layout verification
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/ingestion"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold font-mono transition-colors shadow-2xs"
            >
              Ingestion Pipeline →
            </Link>
            <Link
              href="/admin/sources"
              className="px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold font-mono transition-colors"
            >
              Sources Register
            </Link>
          </div>
        </div>
      )}

      {currentRole === 'operations_manager' && (
        <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-xs">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">Basin Oversight Notice</span>
                <Badge className="bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800 font-mono text-[10px]">Digboi 88/100 Decay</Badge>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-neutral-950 dark:text-white mt-0.5">
                Institutional memory decay in Digboi &amp; Kharsang assets requires digitization prioritization to protect infill drilling.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/decay-index"
              className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white text-xs font-bold font-mono transition-colors shadow-2xs"
            >
              Inspect Decay Index →
            </Link>
            <Link
              href="/analogs"
              className="px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold font-mono transition-colors"
            >
              Cross-Formation Analogs
            </Link>
          </div>
        </div>
      )}

      {/* ─── Top 4 Metric Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Active Rigs */}
        <Card className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs flex flex-col justify-between space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
              <HardHat className="w-4 h-4" />
            </div>
            <Badge variant="outline" className="text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-bold">
              DRILLING ACTIVE
            </Badge>
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-neutral-950 dark:text-white">
              {activeWells.length} Rigs Active
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
              OIL-GLK-14 & OIL-DGB-09
            </p>
          </div>
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
            Next formation: <strong className="text-neutral-900 dark:text-neutral-200">Tipam Sandstone</strong>
          </div>
        </Card>

        {/* Card 2: Open Advisories */}
        <Card className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs flex flex-col justify-between space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-800 dark:text-amber-300">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <Badge variant="outline" className="text-[10px] font-mono bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800 font-bold">
              1 HIGH RISK
            </Badge>
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-neutral-950 dark:text-white">
              {alerts.length} Hazard Advisories
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
              Geleki Upper Tipam fluid loss
            </p>
          </div>
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 font-mono flex items-center justify-between">
            <span>Action: Pre-treat LCM</span>
            <Link href="/alerts" className="text-amber-800 dark:text-amber-400 font-bold hover:underline">
              Inspect →
            </Link>
          </div>
        </Card>

        {/* Card 3: Hazard Lookahead Horizon */}
        <Card className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs flex flex-col justify-between space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
              <Compass className="w-4 h-4" />
            </div>
            <Badge variant="outline" className="text-[10px] font-mono bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800 font-bold">
              PROACTIVE LOOKAHEAD
            </Badge>
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-neutral-950 dark:text-white">
              75.0m Buffer
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
              Advance warning lead-time
            </p>
          </div>
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
            Historical loss depth: <strong className="text-neutral-900 dark:text-neutral-200">2,240m MD</strong>
          </div>
        </Card>

        {/* Card 4: Disconfirming Evidence Safe Passes */}
        <Card className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs flex flex-col justify-between space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <Badge variant="outline" className="text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-bold">
              SAFE BENCHMARK
            </Badge>
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-neutral-950 dark:text-white">
              3 Wells Cleared
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
              Zero loss with ECD &le; 10.2 ppg
            </p>
          </div>
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
            Prevents alert fatigue
          </div>
        </Card>

      </div>

      {/* ─── Middle Section: Active Wells Register + Memory Decay Donut ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Active Drilling Register */}
        <div className="lg:col-span-7 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs space-y-4 transition-colors">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="text-sm font-bold text-neutral-950 dark:text-white uppercase tracking-wide">
                Active Wellbore Monitoring Table
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Live bit positions and geological horizons streamed alongside eRTMAC.
              </p>
            </div>

            {/* Field Filter */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-neutral-500 dark:text-neutral-400">Field:</span>
              <select
                value={fieldFilter}
                onChange={(e) => setFieldFilter(e.target.value)}
                className="border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 rounded-lg px-2.5 py-1 text-xs font-bold text-neutral-800 dark:text-neutral-200 focus:outline-hidden"
              >
                <option value="all">All Fields</option>
                <option value="geleki">Geleki Field</option>
                <option value="digboi">Digboi Field</option>
                <option value="kharsang">Kharsang Field</option>
              </select>
            </div>
          </div>

          {/* Semantic Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-neutral-200 dark:border-neutral-800">
                  <TableHead className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Well Identifier</TableHead>
                  <TableHead className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Field</TableHead>
                  <TableHead className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Current Depth (MD)</TableHead>
                  <TableHead className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Formation</TableHead>
                  <TableHead className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Status</TableHead>
                  <TableHead className="text-xs font-bold text-neutral-700 dark:text-neutral-300 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allFilteredWells.slice(0, 5).map((w) => {
                  const isDrilling = w.status === 'drilling';
                  return (
                    <TableRow key={w.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 border-neutral-100 dark:border-neutral-800">
                      <TableCell className="font-bold font-mono text-neutral-900 dark:text-neutral-100 text-xs">
                        <Link href={`/wells/${w.id}`} className="hover:text-amber-700 dark:hover:text-amber-400 hover:underline">
                          {w.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-xs text-neutral-600 dark:text-neutral-400">{w.field}</TableCell>
                      <TableCell className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        {w.currentDepthMD || w.totalDepthMD}m
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700">
                          {w.formationTops[w.formationTops.length - 1]?.formationName || 'Tipam Sandstone'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {isDrilling ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-mono font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            DRILLING
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[10px] font-mono">
                            COMPLETED
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={`/wells/${w.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <span>Workspace</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="pt-2 text-right">
            <Link href="/wells/well-glk-14" className="text-xs font-bold text-amber-800 dark:text-amber-400 hover:underline inline-flex items-center gap-1">
              <span>Open Complete Geospatial & Depth Track Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* Right: Institutional Memory Decay Donut Ring */}
        <div className="lg:col-span-5">
          <MemoryDecayRingCard />
        </div>

      </div>

      {/* ─── Bottom Section: Arc Gauge + Shift Reminders + AI Proactive Insight ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Bottom Col 1: Semi-Circular Arc Gauge */}
        <HazardProximityGauge />

        {/* Bottom Col 2: Shift Operations Reminders */}
        <ShiftRemindersCard />

        {/* Bottom Col 3: AI Proactive Insight Card */}
        <ProactiveInsightCard />

      </div>

    </div>
  );
}
