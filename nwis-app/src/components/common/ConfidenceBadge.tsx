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
        return 'bg-[#3FAE68]/15 text-[#3FAE68] border-[#3FAE68]/40';
      case 'OCR-HIGH':
        return 'bg-[#D9F2EE] text-[#26A69A] border-[#3FC3B6]/50';
      case 'OCR-MEDIUM':
        return 'bg-[#F2B84B]/15 text-[#F2B84B] border-[#F2B84B]/50';
      case 'OCR-LOW':
        return 'bg-[#ED1C24]/15 text-[#ED1C24] border-[#ED1C24]/50';
      case 'MANUAL-REVIEW':
        return 'bg-[#34435A]/15 text-[#34435A] dark:text-[#D9F2EE] border-[#34435A]/40';
      default:
        return 'bg-[#6B7280]/15 text-[#6B7280] border-[#E2E5E8]';
    }
  };

  return (
    <span
      title={sourceDoc ? `Extraction Pedigree: ${level} | Source: ${sourceDoc}` : `Extraction Pedigree: ${level}`}
      className={`inline-flex items-center gap-1 rounded-none px-1.5 py-0.5 text-[10px] font-mono font-medium border uppercase tracking-wider ${getBadgeStyle()} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {level}
    </span>
  );
};
