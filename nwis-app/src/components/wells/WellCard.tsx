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
      className={`rounded-xl border p-4 transition-all duration-200 backdrop-blur-md ${
        isActive
          ? 'bg-blue-950/20 border-blue-500/50 shadow-lg shadow-blue-500/10'
          : 'bg-slate-900/60 border-white/[0.06] hover:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-100 text-sm">{well.name}</h4>
            {isActive && (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500 text-white animate-pulse">
                ACTIVE RIG
              </span>
            )}
            <StatusBadge status={well.status} size="sm" />
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {well.field} Field • Block {well.block}
          </p>
        </div>
        <ConfidenceBadge level={well.confidenceLevel} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950/40 rounded-lg p-2.5 border border-slate-800">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase">
            {well.status === 'drilling' ? 'Current Depth' : 'Total Depth'}
          </span>
          <span className="font-bold text-slate-200">
            {currentDepthMD ?? well.currentDepthMD ?? well.totalDepthMD}m MD
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase">Trajectory</span>
          <span className="font-bold text-slate-200 capitalize">{well.trajectoryType}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase">Formations</span>
          <span className="font-bold text-slate-200">{well.formationTops.length} Tops</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase">Incidents</span>
          <span
            className={`font-bold ${
              criticalEvents.length > 0 ? 'text-amber-400' : 'text-slate-200'
            }`}
          >
            {events.length} logs ({criticalEvents.length} alert)
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80">
        <span className="text-[11px] text-slate-400 font-mono">
          Rig: <span className="text-slate-300">{well.rig}</span>
        </span>
        <Link
          href={`/wells/${well.id}`}
          className="text-xs text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 font-mono"
        >
          View Wellbore →
        </Link>
      </div>
    </div>
  );
};
