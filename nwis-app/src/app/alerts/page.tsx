'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '../../store/app-store';
import { StatusTag } from '../../components/common/StatusTag';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { ChevronRight } from 'lucide-react';

export default function AlertsListPage() {
  const { alerts } = useAppStore();

  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [wellFilter, setWellFilter] = useState<string>('all');

  const filteredAlerts = alerts.filter((alert) => {
    if (riskFilter !== 'all' && alert.riskLevel !== riskFilter) return false;
    if (statusFilter !== 'all' && alert.status !== statusFilter) return false;
    if (wellFilter !== 'all' && alert.wellId !== wellFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4 max-w-[1440px] mx-auto pb-12 font-sans">
      <Breadcrumb
        items={[
          { label: 'Drilling Operations', href: '/' },
          { label: 'Hazard Advisories Inbox' }
        ]}
      />

      {/* ─── Header ─── */}
      <div className="bg-gradient-to-r from-card via-card to-card border-2 border-[#138808]/40 shadow-sm p-4 rounded-sm space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff9933] via-white dark:via-slate-200 to-[#138808]" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="px-2 py-0.5 bg-rose-500/15 border border-rose-500/40 text-rose-700 dark:text-rose-400 font-mono font-bold text-xs rounded-xs">
                OISD HAZARD AUDIT
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-sans">
                Hazard Advisories Inbox
              </h1>
              <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-700 dark:text-rose-400 font-bold text-xs rounded-xs animate-pulse">
                {alerts.length} ADVISORIES ACTIVE
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-sans mt-1">
              Lookahead subsurface hazard advisories generated from active telemetry and multi-well offset correlations.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-bold rounded-xs">
              ⚡ 75m Early Warning Active
            </span>
          </div>
        </div>

        {/* Filter Strip with Rich Inputs */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pt-1">
          <span className="font-bold text-foreground uppercase text-[11px]">Filter Advisories:</span>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <label htmlFor="risk-filter" className="text-muted-foreground uppercase text-[10px] font-bold">
                Risk:
              </label>
              <select
                id="risk-filter"
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="border border-border bg-card text-foreground px-2.5 py-1 text-xs font-mono rounded-xs focus:outline-2 focus:outline-[#ff9933] cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value="high">High Risk</option>
                <option value="moderate">Moderate Risk</option>
                <option value="low">Low Risk</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <label htmlFor="status-filter" className="text-muted-foreground uppercase text-[10px] font-bold">
                Status:
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-border bg-card text-foreground px-2.5 py-1 text-xs font-mono rounded-xs focus:outline-2 focus:outline-[#ff9933] cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="new">New (Unacknowledged)</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="rejected">Rejected</option>
                <option value="mitigation_applied">Mitigation Applied</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <label htmlFor="well-filter" className="text-muted-foreground uppercase text-[10px] font-bold">
                Well:
              </label>
              <select
                id="well-filter"
                value={wellFilter}
                onChange={(e) => setWellFilter(e.target.value)}
                className="border border-border bg-card text-foreground px-2.5 py-1 text-xs font-mono rounded-xs focus:outline-2 focus:outline-[#ff9933] cursor-pointer"
              >
                <option value="all">All Active Wells</option>
                <option value="well-glk-14">OIL-GLK-14 (Geleki)</option>
                <option value="well-dgb-09">OIL-DGB-09 (Digboi)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="gov-panel space-y-2">
        <div className="overflow-x-auto">
          <table className="gov-table font-mono text-xs">
            <thead>
              <tr>
                <th>Advisory Title &amp; Corridor</th>
                <th>Target Well</th>
                <th>Predicted Depth</th>
                <th>Severity</th>
                <th>Confidence</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert) => (
                <tr key={alert.id}>
                  <td>
                    <div className="font-bold text-foreground font-sans text-sm">{alert.fact.length > 60 ? `${alert.fact.slice(0, 60)}...` : alert.fact}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">Corridor: {alert.corridorId}</div>
                  </td>
                  <td className="font-bold text-foreground">{alert.wellId.toUpperCase()}</td>
                  <td className="font-bold text-amber-700 dark:text-amber-400">{alert.currentDepth}m MD</td>
                  <td>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-xs ${
                      alert.riskLevel === 'high' ? 'bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30' :
                      alert.riskLevel === 'moderate' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30' :
                      'bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/30'
                    }`}>
                      {alert.riskLevel.toUpperCase()} RISK
                    </span>
                  </td>
                  <td>
                    <span className="font-bold text-blue-700 dark:text-blue-400">{alert.matchedOffsetWells?.[0]?.similarityScore ? alert.matchedOffsetWells[0].similarityScore.toFixed(2) : '0.88'} Match</span>
                  </td>
                  <td>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-xs ${
                      alert.status === 'acknowledged' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30' :
                      alert.status === 'mitigation_applied' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/30' :
                      'bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                    }`}>
                      {alert.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="text-right">
                    <Link
                      href={`/alerts/${alert.id}`}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xs text-[11px] font-mono transition-colors inline-flex items-center gap-1 shadow-xs"
                    >
                      <span>Review</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
