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
        <div className="rounded-none border border-[#E2E5E8] bg-white p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E2E5E8]">
              <span className="text-xs font-extrabold text-[#252B33] dark:text-white uppercase tracking-wide font-mono">
                1. What Happened Before
              </span>
              <span className="text-[10px] font-mono text-[#6B7280] font-bold uppercase">Fact</span>
            </div>
            <p className="text-sm text-[#252B33] dark:text-neutral-200 leading-relaxed font-sans">{fact}</p>
          </div>
          {sourceReference && (
            <div className="mt-4 pt-2.5 border-t border-[#E2E5E8] text-xs text-[#6B7280] font-mono">
              <span className="font-bold text-[#252B33] dark:text-neutral-200">Source: </span>
              {sourceReference}
            </div>
          )}
        </div>

        {/* 2. What the model estimates (Model-Estimated Risk) */}
        <div className="rounded-none border border-[#F2B84B]/60 bg-white p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E2E5E8]">
              <span className="text-xs font-extrabold text-[#252B33] dark:text-white uppercase tracking-wide font-mono">
                2. Model Risk Estimate
              </span>
              {riskLevel && <StatusTag label={riskLevel.toUpperCase()} />}
            </div>
            <p className="text-sm text-[#252B33] dark:text-neutral-200 leading-relaxed font-sans">{estimate}</p>
          </div>
          <div className="mt-4 pt-2.5 border-t border-[#E2E5E8] text-xs text-[#6B7280] font-mono">
            <span className="font-bold text-[#252B33] dark:text-neutral-200">Logic: </span>
            Assam Basin Stratigraphic Model v3.2
          </div>
        </div>

        {/* 3. Suggested mitigation (Recommendation) */}
        <div className="rounded-none border border-[#3FC3B6] bg-[#D9F2EE]/40 dark:bg-[#3FC3B6]/15 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#3FC3B6]/40">
              <span className="text-xs font-extrabold text-[#26A69A] dark:text-[#3FC3B6] uppercase tracking-wide font-mono">
                3. Suggested Mitigation
              </span>
              <StatusTag label="RECOMMENDED" variant="green" />
            </div>
            <p className="text-sm text-[#252B33] dark:text-white leading-relaxed font-semibold font-sans">{recommendation}</p>
          </div>
          <div className="mt-4 pt-2.5 border-t border-[#3FC3B6]/40 text-xs text-[#6B7280] font-mono">
            <span className="font-bold text-[#252B33] dark:text-neutral-200">Protocol: </span>
            OIL Field Best Practice Guide
          </div>
        </div>
      </div>

      {/* Disconfirming Evidence Panel (Deliberate Product Principle) */}
      {disconfirmingEvidence && (
        <div className="rounded-none border border-[#E2E5E8] bg-[#F5F7F8] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex-1">
            <span className="font-extrabold text-[#252B33] dark:text-white uppercase tracking-wide mr-2 font-mono text-[11px]">
              Disconfirming Safe Passes:
            </span>
            <span className="text-[#252B33] dark:text-neutral-300">{disconfirmingEvidence}</span>
          </div>
          <span className="text-[10px] text-[#6B7280] font-mono shrink-0 px-2 py-0.5 rounded-none bg-[#E2E5E8] dark:bg-[#1E2532]">
            Balances Risk • Prevents Alarm Fatigue
          </span>
        </div>
      )}
    </div>
  );
};
