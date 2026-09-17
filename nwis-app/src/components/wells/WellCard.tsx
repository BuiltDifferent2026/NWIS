'use client';

import React from 'react';
import { Well } from '../../data/wells';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { Layers, Activity, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { getEventsByWell } from '../../data/events';

interface WellCardProps {
  well: Well;
  currentDepthMD?: number;
  isActive?: boolean;
}

export const WellCard: React.FC<WellCardProps> = ({ well, currentDepthMD, isActive = false }) => {
  const events = getEventsByWell(well.id);
  const criticalEvents = events.filter((e) => e.severity === 'critical' || e.severity === 'high');

  return (
    <div
      className={`rounded-2xl border p-4.5 transition-all duration-200 shadow-xs hover:shadow-md ${
        isActive
          ? 'bg-amber-500/5 border-amber-500/50 dark:bg-amber-950/20'
          : 'bg-white dark:bg-[#12151c] border-neutral-200 dark:border-neutral-800 hover:border-amber-500/40'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-extrabold text-neutral-950 dark:text-white text-sm">{well.name}</h4>
            {isActive && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500 text-neutral-950 animate-pulse">
                ACTIVE RIG
              </span>
            )}
            <StatusBadge status={well.status} size="sm" />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
            {well.field} Field • Block {well.block}
          </p>
        </div>
        <ConfidenceBadge level={well.confidenceLevel} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono bg-neutral-50 dark:bg-neutral-900/60 rounded-xl p-3 border border-neutral-200/60 dark:border-neutral-800">
        <div>
          <span className="text-neutral-500 dark:text-neutral-400 block text-[10px] uppercase font-bold">
            {well.status === 'drilling' ? 'Current Depth' : 'Total Depth'}
          </span>
          <span className="font-bold text-neutral-950 dark:text-white">
            {currentDepthMD ?? well.currentDepthMD ?? well.totalDepthMD}m MD
          </span>
        </div>
        <div>
          <span className="text-neutral-500 dark:text-neutral-400 block text-[10px] uppercase font-bold">Trajectory</span>
          <span className="font-bold text-neutral-950 dark:text-white capitalize">{well.trajectoryType}</span>
        </div>
        <div>
          <span className="text-neutral-500 dark:text-neutral-400 block text-[10px] uppercase font-bold">Formations</span>
          <span className="font-bold text-neutral-950 dark:text-white">{well.formationTops.length} Tops</span>
        </div>
        <div>
          <span className="text-neutral-500 dark:text-neutral-400 block text-[10px] uppercase font-bold">Incidents</span>
          <span
            className={`font-bold ${
              criticalEvents.length > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-neutral-950 dark:text-white'
            }`}
          >
            {events.length} logs ({criticalEvents.length} alert)
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
          Rig: <span className="text-neutral-800 dark:text-neutral-200 font-bold">{well.rig}</span>
        </span>
        <Link
          href={`/wells/${well.id}`}
          className="text-xs text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 hover:underline flex items-center gap-1 font-mono font-bold"
        >
          View Wellbore →
        </Link>
      </div>
    </div>
  );
};
