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
        return 'bg-[#3FAE68]/15 text-[#3FAE68] border-[#3FAE68]/40';
      case 'completed':
        return 'bg-[#D9F2EE] text-[#26A69A] border-[#3FC3B6]/50';
      case 'suspended':
      case 'INTERMITTENT':
        return 'bg-[#F2B84B]/15 text-[#F2B84B] border-[#F2B84B]/50';
      case 'planned':
      case 'OFFLINE':
        return 'bg-[#6B7280]/15 text-[#6B7280] border-[#E2E5E8]';
      case 'critical':
      case 'high':
        return 'bg-[#ED1C24]/15 text-[#ED1C24] border-[#ED1C24]/50 font-bold';
      case 'medium':
        return 'bg-[#F2B84B]/15 text-[#F2B84B] border-[#F2B84B]/50';
      case 'low':
        return 'bg-[#D9F2EE] text-[#26A69A] border-[#3FC3B6]/40';
      default:
        return 'bg-[#34435A]/15 text-[#34435A] dark:text-[#D9F2EE] border-[#E2E5E8]';
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
      className={`inline-flex items-center gap-1.5 rounded-none border px-2 py-0.5 font-mono tracking-wider uppercase ${
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
