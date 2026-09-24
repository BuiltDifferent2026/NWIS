import React from 'react';
import { ConfidenceTag } from '../../lib/data/types';

interface StatusTagProps {
  label: string;
  type?: 'risk' | 'status' | 'confidence' | 'outcome';
  variant?: 'red' | 'amber' | 'green' | 'teal' | 'navy' | 'blue' | 'grey';
  className?: string;
}

export const StatusTag: React.FC<StatusTagProps> = ({
  label,
  type,
  variant,
  className = ''
}) => {
  // Infer variant from label if not explicitly provided
  const getVariant = (): 'red' | 'amber' | 'green' | 'teal' | 'navy' | 'blue' | 'grey' => {
    if (variant) return variant;

    const lower = label.toLowerCase();
    // Risk levels & statuses
    if (lower.includes('high') || lower.includes('critical') || lower === 'unresolved' || lower === 'error' || lower === 'rejected') return 'red';
    if (lower.includes('mod') || lower.includes('medium') || lower === 'caution' || lower === 'ocr-low' || lower === 'manual-review' || lower === 'warning') return 'amber';
    if (lower.includes('low') || lower === 'safe' || lower === 'resolved' || lower === 'structured-high' || lower === 'mitigation_applied' || lower === 'success' || lower === 'recommended') return 'green';
    if (lower === 'active' || lower === 'ocr-high' || lower === 'acknowledged' || lower === 'new' || lower === 'drilling' || lower === 'verified') return 'teal';
    return 'grey';
  };

  const v = getVariant();
  const variantClass = `gov-tag-${v === 'blue' ? 'teal' : v}`;

  return (
    <span className={`gov-tag ${variantClass} rounded-none font-mono ${className}`}>
      {label}
    </span>
  );
};
