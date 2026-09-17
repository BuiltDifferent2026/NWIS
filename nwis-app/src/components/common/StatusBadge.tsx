import React from 'react';
import { WellStatus } from '../../data/wells';
import { Severity } from '../../data/events';

interface StatusBadgeProps {
  status: WellStatus | Severity | 'LIVE_STREAMING' | 'INTERMITTENT' | 'OFFLINE';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', pulse = false }) => {
  const getStyles = () => {
    switch (status) {
      case 'drilling':
      case 'LIVE_STREAMING':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'completed':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'suspended':
      case 'INTERMITTENT':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'planned':
      case 'OFFLINE':
        return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700';
      case 'critical':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800 font-bold';
      case 'high':
        return 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700 font-semibold';
      case 'medium':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'low':
        return 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800';
      default:
        return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'LIVE_STREAMING': return 'eRTMAC SYNCED';
      case 'INTERMITTENT': return 'SYNC DELAY';
      case 'OFFLINE': return 'OFFLINE';
      default: return status.toUpperCase();
    }
  };

  const isLive = status === 'drilling' || status === 'LIVE_STREAMING' || status === 'critical';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono tracking-wider uppercase ${
        size === 'sm' ? 'text-[10px]' : 'text-xs px-2.5 py-1'
      } ${getStyles()}`}
    >
      {(pulse || isLive) && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"></span>
        </span>
      )}
      {getLabel()}
    </span>
  );
};
