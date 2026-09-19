import React from 'react';
import { StatusTag } from './StatusTag';

interface FactEstimateRecommendationProps {
  fact: string;
  estimate: string;
  recommendation: string;
  disconfirmingEvidence?: string;
  riskLevel?: 'high' | 'moderate' | 'low';
  sourceReference?: string;
  className?: string;
}

export const FactEstimateRecommendation: React.FC<FactEstimateRecommendationProps> = ({
  fact,
  estimate,
  recommendation,
  disconfirmingEvidence,
  riskLevel,
  sourceReference,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* 1. Observed Historical Fact */}
        <div className="gov-callout gov-callout-fact flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-border/70">
              <span className="text-xs font-bold text-foreground uppercase tracking-wide font-mono">
                1. Observed Historical Fact
              </span>
              <span className="text-[10px] font-mono text-muted-foreground font-bold uppercase">Fact</span>
            </div>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed font-sans">{fact}</p>
          </div>
          {sourceReference && (
            <div className="mt-3 pt-2 border-t border-border/50 text-[11px] text-muted-foreground font-mono">
              <span className="font-bold text-foreground">Source: </span>
              {sourceReference}
            </div>
          )}
        </div>

        {/* 2. Model-Estimated Risk */}
        <div className="gov-callout gov-callout-risk flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-border/70">
              <span className="text-xs font-bold text-foreground uppercase tracking-wide font-mono">
                2. Model Risk Estimate
              </span>
              {riskLevel && <StatusTag label={riskLevel.toUpperCase()} />}
            </div>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed font-sans">{estimate}</p>
          </div>
          <div className="mt-3 pt-2 border-t border-border/50 text-[11px] text-muted-foreground font-mono">
            <span className="font-bold text-foreground">Model: </span>
            Assam Basin Stratigraphic Correlation v3.2
          </div>
        </div>

        {/* 3. Suggested Mitigation */}
        <div className="gov-callout gov-callout-mitigation flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-border/70">
              <span className="text-xs font-bold text-foreground uppercase tracking-wide font-mono">
                3. Suggested Mitigation
              </span>
              <StatusTag label="ADVISORY" variant="blue" />
            </div>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed font-semibold font-sans">{recommendation}</p>
          </div>
          <div className="mt-3 pt-2 border-t border-border/50 text-[11px] text-muted-foreground font-mono">
            <span className="font-bold text-foreground">Protocol: </span>
            OIL Field Standard Operating Procedure
          </div>
        </div>
      </div>

      {/* Disconfirming Evidence Panel */}
      {disconfirmingEvidence && (
        <div className="gov-callout gov-callout-safe flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex-1">
            <span className="font-bold text-foreground uppercase tracking-wide mr-2 font-mono text-[11px]">
              Disconfirming Safe Passes:
            </span>
            <span className="text-foreground font-sans">{disconfirmingEvidence}</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono shrink-0">
            Validated Baseline • Alarm Fatigue Protection
          </span>
        </div>
      )}
    </div>
  );
};
