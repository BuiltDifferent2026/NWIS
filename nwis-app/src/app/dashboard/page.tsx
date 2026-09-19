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
import { Breadcrumb } from '@/components/layout/Breadcrumb';

export default function DashboardPage() {
  const { currentRole, alerts } = useAppStore();
  const [fieldFilter, setFieldFilter] = useState<string>('all');

  const activeWells = WELLS.filter((w) => w.status === 'drilling');
  const allFilteredWells = WELLS.filter((w) => {
    if (fieldFilter !== 'all' && w.field.toLowerCase() !== fieldFilter.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 max-w-[1440px] mx-auto pb-12 font-sans">
      
      <Breadcrumb
        items={[
          { label: 'Drilling Operations', href: '/' },
          { label: 'Basin Fleet Register' }
        ]}
      />

      {/* ─── Header ─── */}
      <div className="bg-gradient-to-r from-card via-card to-card border-2 border-[#138808]/40 shadow-sm p-4 rounded-sm space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff9933] via-white dark:via-slate-200 to-[#138808]" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="px-2 py-0.5 bg-blue-500/15 border border-blue-500/40 text-blue-700 dark:text-blue-400 font-mono font-bold text-xs rounded-xs">
                OIL INDIA FLEET
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-sans">
                Assam-Arakan Basin Fleet Register
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                2 RIGS ONLINE · TELEMETRY ACTIVE
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-sans mt-1">
              Continuous subsurface hazard watcher tracking active bit positions and lookahead horizons alongside eRTMAC live feeds.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <Link
              href="/operations"
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Launch Active Cockpit (GLK-14)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Top 4 KPI Metrics in Rich Colorful Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 font-mono">
          <div className="p-3 bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/30 rounded-xs space-y-0.5">
            <div className="text-[10px] text-blue-700 dark:text-blue-300 uppercase font-bold">ACTIVE RIGS</div>
            <div className="text-2xl font-black text-foreground">{activeWells.length} Rigs Drilling</div>
            <div className="text-[10px] text-muted-foreground font-sans">OIL-GLK-14 &amp; OIL-DGB-09</div>
          </div>
          <div className="p-3 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 rounded-xs space-y-0.5">
            <div className="text-[10px] text-amber-700 dark:text-amber-300 uppercase font-bold">OPEN ADVISORIES</div>
            <div className="text-2xl font-black text-amber-700 dark:text-amber-400">{alerts.length} Active Notice</div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-sans font-medium">Geleki Upper Tipam Loss</div>
          </div>
          <div className="p-3 bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30 rounded-xs space-y-0.5">
            <div className="text-[10px] text-purple-700 dark:text-purple-300 uppercase font-bold">PROACTIVE LOOKAHEAD</div>
            <div className="text-2xl font-black text-purple-700 dark:text-purple-400">75.0m Buffer</div>
            <div className="text-[10px] text-muted-foreground font-sans">Advance trigger horizon</div>
          </div>
          <div className="p-3 bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/30 rounded-xs space-y-0.5">
            <div className="text-[10px] text-emerald-700 dark:text-emerald-300 uppercase font-bold">SAFE PASSAGES</div>
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">3 Wells Cleared</div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-sans font-medium">Zero loss with ECD &lt; 10.2</div>
          </div>
        </div>
      </div>

      {/* Main Table: Active Wells Register */}
      <div className="gov-panel space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
          <div>
            <h2 className="font-bold text-sm text-foreground font-sans uppercase">
              Active &amp; Historical Well Register
            </h2>
            <p className="text-xs text-muted-foreground font-sans">
              Surface coordinates, target formation intervals, and live telemetry status.
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-muted-foreground font-bold">Field Filter:</span>
            <select
              value={fieldFilter}
              onChange={(e) => setFieldFilter(e.target.value)}
              className="border border-border bg-card text-foreground px-2.5 py-1 text-xs font-mono rounded-xs focus:outline-2 focus:outline-[#ff9933] cursor-pointer"
            >
              <option value="all">All Fields</option>
              <option value="geleki">Geleki Field</option>
              <option value="digboi">Digboi Field</option>
              <option value="kharsang">Kharsang Field</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table font-mono text-xs">
            <thead>
              <tr>
                <th>Well Identifier</th>
                <th>Field Name</th>
                <th>Current Depth</th>
                <th>Formation Horizon</th>
                <th>Operating Status</th>
                <th className="text-right">Workspace</th>
              </tr>
            </thead>
            <tbody>
              {allFilteredWells.map((w) => {
                const isDrilling = w.status === 'drilling';
                return (
                  <tr key={w.id}>
                    <td className="font-bold text-foreground">
                      <Link href={`/wells/${w.id}`} className="hover:text-blue-600 hover:underline">
                        {w.name}
                      </Link>
                      <div className="text-[10px] text-muted-foreground font-normal">Rig: {w.rig}</div>
                    </td>
                    <td className="text-foreground">{w.field}</td>
                    <td className="font-bold text-foreground">{w.currentDepthMD || w.totalDepthMD}m MD</td>
                    <td className="font-sans text-xs font-medium">
                      {w.formationTops[w.formationTops.length - 1]?.formationName || 'Tipam Sandstone'}
                    </td>
                    <td>
                      {isDrilling ? (
                        <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold rounded-xs">
                          ● DRILLING ACTIVE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-secondary text-muted-foreground border border-border font-bold rounded-xs">
                          {w.status.toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td className="text-right">
                      <Link
                        href={`/wells/${w.id}`}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xs text-[11px] font-mono font-bold transition-colors inline-flex items-center gap-1 shadow-xs"
                      >
                        <span>Open Workspace</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
