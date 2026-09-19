import React from 'react';
import { WellStatus } from '../../data/wells';
import { Severity } from '../../data/events';

interface StatusBadgeProps {
  status: WellStatus | Severity | 'LIVE_STREAMING' | 'INTERMITTENT' | 'OFFLINE';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', pulse = false }) => {
  const getTagClass = () => {
    switch (status) {
      case 'drilling':
      case 'LIVE_STREAMING':
        return 'gov-tag-green';
      case 'completed':
        return 'gov-tag-blue';
      case 'suspended':
      case 'INTERMITTENT':
      case 'medium':
      case 'high':
        return 'gov-tag-amber';
      case 'critical':
        return 'gov-tag-red';
      case 'low':
      case 'planned':
      case 'OFFLINE':
      default:
        return 'gov-tag-grey';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'LIVE_STREAMING': return 'LIVE';
      case 'INTERMITTENT': return 'DELAYED';
      case 'OFFLINE': return 'OFFLINE';
      default: return status.toUpperCase();
    }
  };

  return (
    <span
      className={`gov-tag ${getTagClass()} ${size === 'md' ? 'text-xs px-2 py-0.5' : ''}`}
    >
      {getLabel()}
    </span>
  );
};
