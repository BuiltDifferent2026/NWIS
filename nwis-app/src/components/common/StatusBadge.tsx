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
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'completed':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'suspended':
      case 'INTERMITTENT':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'planned':
      case 'OFFLINE':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      case 'critical':
        return 'bg-red-500/15 text-red-400 border-red-500/40 font-semibold';
      case 'high':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'low':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
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
