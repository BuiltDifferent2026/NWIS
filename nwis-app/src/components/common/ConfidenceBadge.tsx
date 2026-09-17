import React from 'react';
import { ConfidenceLevel } from '../../data/wells';

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  className?: string;
  sourceDoc?: string;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ level, className = '', sourceDoc }) => {
  const getBadgeStyle = () => {
    switch (level) {
      case 'STRUCTURED-HIGH':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'OCR-HIGH':
        return 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
      case 'OCR-MEDIUM':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'OCR-LOW':
        return 'bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'MANUAL-REVIEW':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700';
    }
  };

  return (
    <span
      title={sourceDoc ? `Extraction Pedigree: ${level} | Source: ${sourceDoc}` : `Extraction Pedigree: ${level}`}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold border uppercase tracking-wider ${getBadgeStyle()} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {level}
    </span>
  );
};
