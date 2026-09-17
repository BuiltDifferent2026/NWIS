import React from 'react';
import { ConfidenceTag } from '../../lib/data/types';

interface StatusTagProps {
  label: string;
  type?: 'risk' | 'status' | 'confidence' | 'outcome';
  variant?: 'red' | 'amber' | 'green' | 'blue' | 'grey';
  className?: string;
}

export const StatusTag: React.FC<StatusTagProps> = ({
  label,
  type,
  variant,
  className = ''
}) => {
  // Infer variant from label if not explicitly provided
  const getVariant = (): 'red' | 'amber' | 'green' | 'blue' | 'grey' => {
    if (variant) return variant;

    const lower = label.toLowerCase();
    // Risk levels
    if (lower === 'high' || lower === 'critical' || lower === 'unresolved') return 'red';
    if (lower === 'moderate' || lower === 'medium' || lower === 'caution' || lower === 'ocr-low' || lower === 'manual-review') return 'amber';
    if (lower === 'low' || lower === 'safe' || lower === 'resolved' || lower === 'structured-high' || lower === 'mitigation_applied') return 'green';
    if (lower === 'active' || lower === 'ocr-high' || lower === 'acknowledged') return 'blue';
    return 'grey';
  };

  const v = getVariant();
  const variantClass = `gov-tag-${v}`;

  return (
    <span className={`gov-tag ${variantClass} ${className}`}>
      {label}
    </span>
  );
};
