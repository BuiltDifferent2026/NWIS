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
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. What happened before (Observed Historical Fact) */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-xs font-extrabold text-neutral-900 dark:text-white uppercase tracking-wide font-mono">
                1. What Happened Before
              </span>
              <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 font-bold uppercase">Fact</span>
            </div>
            <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">{fact}</p>
          </div>
          {sourceReference && (
            <div className="mt-4 pt-2.5 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 font-mono">
              <span className="font-bold text-neutral-900 dark:text-neutral-200">Source: </span>
              {sourceReference}
            </div>
          )}
        </div>

        {/* 2. What the model estimates (Model-Estimated Risk) */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-xs font-extrabold text-neutral-900 dark:text-white uppercase tracking-wide font-mono">
                2. Model Risk Estimate
              </span>
              {riskLevel && <StatusTag label={riskLevel.toUpperCase()} />}
            </div>
            <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">{estimate}</p>
          </div>
          <div className="mt-4 pt-2.5 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 font-mono">
            <span className="font-bold text-neutral-900 dark:text-neutral-200">Logic: </span>
            Assam Basin Stratigraphic Model v3.2
          </div>
        </div>

        {/* 3. Suggested mitigation (Recommendation) */}
        <div className="rounded-2xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/40 dark:bg-amber-950/20 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-amber-200 dark:border-amber-800/60">
              <span className="text-xs font-extrabold text-amber-900 dark:text-amber-300 uppercase tracking-wide font-mono">
                3. Suggested Mitigation
              </span>
              <StatusTag label="RECOMMENDED" variant="amber" />
            </div>
            <p className="text-sm text-neutral-900 dark:text-white leading-relaxed font-semibold font-sans">{recommendation}</p>
          </div>
          <div className="mt-4 pt-2.5 border-t border-amber-200 dark:border-amber-800/60 text-xs text-neutral-600 dark:text-neutral-400 font-mono">
            <span className="font-bold text-neutral-900 dark:text-neutral-200">Protocol: </span>
            OIL Field Best Practice Guide
          </div>
        </div>
      </div>

      {/* Disconfirming Evidence Panel (Deliberate Product Principle) */}
      {disconfirmingEvidence && (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex-1">
            <span className="font-extrabold text-neutral-950 dark:text-white uppercase tracking-wide mr-2 font-mono text-[11px]">
              Disconfirming Safe Passes:
            </span>
            <span className="text-neutral-700 dark:text-neutral-300">{disconfirmingEvidence}</span>
          </div>
          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono shrink-0 px-2 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800">
            Balances Risk • Prevents Alarm Fatigue
          </span>
        </div>
      )}
    </div>
  );
};
