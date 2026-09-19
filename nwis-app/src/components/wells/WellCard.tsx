'use client';

import React from 'react';
import { Well } from '../../data/wells';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
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
      className={`gov-panel space-y-2.5 ${
        isActive ? 'border-l-4 border-l-[#1d70b8] bg-[#eef4f9] dark:bg-[#192336]' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2 font-sans">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-foreground text-sm font-mono">{well.name}</h4>
            {isActive && (
              <span className="gov-tag gov-tag-green text-[9px]">
                ACTIVE RIG
              </span>
            )}
            <StatusBadge status={well.status} size="sm" />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {well.field} Field · Block {well.block}
          </p>
        </div>
        <ConfidenceBadge level={well.confidenceLevel} />
      </div>

      <div className="grid grid-cols-2 gap-1.5 text-xs font-mono bg-secondary/50 p-2 border border-border">
        <div>
          <span className="text-muted-foreground block text-[9px] uppercase">
            {well.status === 'drilling' ? 'Current Depth' : 'Total Depth'}
          </span>
          <span className="font-bold text-foreground">
            {currentDepthMD ?? well.currentDepthMD ?? well.totalDepthMD}m MD
          </span>
        </div>
        <div>
          <span className="text-muted-foreground block text-[9px] uppercase">Trajectory</span>
          <span className="font-bold text-foreground capitalize">{well.trajectoryType}</span>
        </div>
        <div>
          <span className="text-muted-foreground block text-[9px] uppercase">Formations</span>
          <span className="font-bold text-foreground">{well.formationTops.length} Tops</span>
        </div>
        <div>
          <span className="text-muted-foreground block text-[9px] uppercase">Incidents</span>
          <span
            className={`font-bold ${
              criticalEvents.length > 0 ? 'text-[#b25900] dark:text-[#fbbf24]' : 'text-foreground'
            }`}
          >
            {events.length} logs ({criticalEvents.length} alert)
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1.5 border-t border-border font-mono text-xs">
        <span className="text-[11px] text-muted-foreground">
          Rig: <span className="text-foreground">{well.rig}</span>
        </span>
        <Link
          href={`/wells/${well.id}`}
          className="text-xs text-[#1d70b8] dark:text-[#60a5fa] hover:underline"
        >
          View Wellbore →
        </Link>
      </div>
    </div>
  );
};
