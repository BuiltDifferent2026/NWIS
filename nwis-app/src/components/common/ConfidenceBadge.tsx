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
        return 'gov-tag-green';
      case 'OCR-HIGH':
        return 'gov-tag-blue';
      case 'OCR-MEDIUM':
        return 'gov-tag-amber';
      case 'OCR-LOW':
        return 'gov-tag-amber';
      case 'MANUAL-REVIEW':
        return 'gov-tag-red';
      default:
        return 'gov-tag-grey';
    }
  };

  return (
    <span
      title={sourceDoc ? `Extraction Pedigree: ${level} | Source: ${sourceDoc}` : `Extraction Pedigree: ${level}`}
      className={`gov-tag ${getBadgeStyle()} ${className}`}
    >
      {level}
    </span>
  );
};
