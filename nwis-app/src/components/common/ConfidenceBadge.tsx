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
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'OCR-HIGH':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'OCR-MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'OCR-LOW':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'MANUAL-REVIEW':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-700/20 text-slate-400 border-slate-700';
    }
  };

  return (
    <span
      title={sourceDoc ? `Extraction Pedigree: ${level} | Source: ${sourceDoc}` : `Extraction Pedigree: ${level}`}
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-mono font-medium border uppercase tracking-wider ${getBadgeStyle()} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {level}
    </span>
  );
};
