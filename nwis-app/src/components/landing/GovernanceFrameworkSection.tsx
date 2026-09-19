'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, GitCompare, FileCheck2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export const GovernanceFrameworkSection: React.FC = () => {
  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-[#0c0f16] transition-colors">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-neutral-950 dark:text-white font-mono uppercase tracking-wide">
                PSU Governance &amp; Safety Boundary Framework
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-sans">
                Three strict architectural guardrails safeguarding eRTMAC critical systems and statutory PSU compliance.
              </p>
            </div>
          </div>
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-mono font-bold self-start sm:self-auto">
            AIR-GAPPED COMPLIANT
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          
          <Card className="p-5 rounded-2xl bg-white dark:bg-[#12151c] border border-neutral-200 dark:border-neutral-800/90 space-y-2 shadow-2xs">
            <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>1. Strict Read-Only Bridge</span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 font-sans text-xs leading-relaxed">
              Enforces a one-way JSON contract (<code className="text-amber-600 dark:text-amber-400 font-bold font-mono">GET /live-state/{'{well_id}'}</code>). NWIS cannot transmit control packets or write back to rig hardware actuators or eRTMAC valves.
            </p>
          </Card>

          <Card className="p-5 rounded-2xl bg-white dark:bg-[#12151c] border border-neutral-200 dark:border-neutral-800/90 space-y-2 shadow-2xs">
            <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2 text-xs">
              <GitCompare className="w-4 h-4 shrink-0" />
              <span>2. Stratigraphic Similarity &gt; Distance</span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 font-sans text-xs leading-relaxed">
              Matches formation facies, pressure regimes, and structural dip over raw Euclidean distance—preventing misleading offset correlations across complex Naga thrust faults.
            </p>
          </Card>

          <Card className="p-5 rounded-2xl bg-white dark:bg-[#12151c] border border-neutral-200 dark:border-neutral-800/90 space-y-2 shadow-2xs">
            <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-2 text-xs">
              <FileCheck2 className="w-4 h-4 text-amber-500 shrink-0" />
              <span>3. Document Provenance &amp; Audit</span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 font-sans text-xs leading-relaxed">
              Every advisory cites original WCR and daily drilling report page citations with OCR confidence tiers and human superintendent verification signatures (DGMS &amp; OISD-GDN-178 Aligned).
            </p>
          </Card>

        </div>

      </div>
    </section>
  );
};
