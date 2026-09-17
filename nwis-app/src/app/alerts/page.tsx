'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '../../store/app-store';
import { StatusTag } from '../../components/common/StatusTag';
import { Breadcrumb } from '../../components/layout/Breadcrumb';

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
    <div className="space-y-6 max-w-7xl mx-auto">
      <Breadcrumb items={[{ label: 'Alert Inbox' }]} />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
          Proactive Alert Inbox
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Subsurface hazard advisories generated ahead of depth by correlating live rig data against 130+ years of offset well records.
        </p>
      </div>

      {/* Filter Strip */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-neutral-950 dark:text-white uppercase">Filter Advisories:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Risk Level Filter */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="risk-filter" className="text-neutral-500 dark:text-neutral-400 uppercase text-[11px]">
              Risk Level:
            </label>
            <select
              id="risk-filter"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-2.5 py-1 text-xs font-bold text-neutral-900 dark:text-white focus:outline-hidden"
            >
              <option value="all">All Levels</option>
              <option value="high">High Risk Only</option>
              <option value="moderate">Moderate Risk Only</option>
              <option value="low">Low Risk Only</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="status-filter" className="text-neutral-500 dark:text-neutral-400 uppercase text-[11px]">
              Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-2.5 py-1 text-xs font-bold text-neutral-900 dark:text-white focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="new">New (Unacknowledged)</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="rejected">Rejected</option>
              <option value="mitigation_applied">Mitigation Applied</option>
            </select>
          </div>

          {/* Well Filter */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="well-filter" className="text-neutral-500 dark:text-neutral-400 uppercase text-[11px]">
              Well:
            </label>
            <select
              id="well-filter"
              value={wellFilter}
              onChange={(e) => setWellFilter(e.target.value)}
              className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-2.5 py-1 text-xs font-bold text-neutral-900 dark:text-white focus:outline-hidden"
            >
              <option value="all">All Active Wells</option>
              <option value="well-glk-14">OIL-GLK-14 (Geleki)</option>
              <option value="well-dgb-09">OIL-DGB-09 (Digboi)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts Table Card */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
          <span className="font-extrabold text-neutral-950 dark:text-white">
            Advisory Register ({filteredAlerts.length} Entries)
          </span>
          <span className="text-neutral-500 dark:text-neutral-400 font-mono">
            eRTMAC Proactive Corridor Watcher Feed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table" aria-label="Proactive alerts list">
            <thead>
              <tr>
                <th scope="col">Advisory Identifier</th>
                <th scope="col">Subject Well</th>
                <th scope="col">Trigger Depth</th>
                <th scope="col">Risk Level</th>
                <th scope="col">Status</th>
                <th scope="col">Timestamp</th>
                <th scope="col">Historical Fact Summary</th>
                <th scope="col" className="text-right">Inspection</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-neutral-500 dark:text-neutral-400 italic">
                    No advisories match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr key={alert.id}>
                    <td className="font-mono font-bold text-xs">
                      <Link
                        href={`/alerts/${alert.id}`}
                        className="text-amber-700 dark:text-amber-400 hover:underline"
                      >
                        {alert.id}
                      </Link>
                    </td>
                    <td className="font-mono text-xs font-bold uppercase text-neutral-900 dark:text-white">
                      {alert.wellId.replace('well-', 'OIL-').toUpperCase()}
                    </td>
                    <td className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-200">
                      {alert.currentDepth}m MD
                    </td>
                    <td>
                      <StatusTag label={`${alert.riskLevel.toUpperCase()}`} />
                    </td>
                    <td>
                      <StatusTag label={alert.status.replace('_', ' ').toUpperCase()} />
                    </td>
                    <td className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                      {alert.firedAt}
                    </td>
                    <td className="text-xs max-w-xs text-neutral-700 dark:text-neutral-300">
                      {alert.fact.slice(0, 75)}...
                    </td>
                    <td className="text-right">
                      <Link
                        href={`/alerts/${alert.id}`}
                        className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline font-mono"
                      >
                        Review Protocol →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
