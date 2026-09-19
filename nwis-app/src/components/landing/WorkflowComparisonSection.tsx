'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export const WorkflowComparisonSection: React.FC = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#090b0f] transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-mono font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>OPERATIONAL VALUE COMPARISON</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-mono">
            How NWIS Proactively Intervenes on the Rig Floor
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-sans max-w-2xl mx-auto leading-relaxed">
            Direct operational comparison of conventional reactive post-incident response versus NWIS lookahead intelligence across the Upper Tipam Sandstone loss interval.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
          
          {/* Conventional Reactive Path */}
          <Card className="p-6 rounded-2xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/40 dark:bg-[#120b0e] space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-rose-200 dark:border-rose-900/40">
              <span className="font-bold text-rose-700 dark:text-rose-400 uppercase text-[11px] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Conventional Reactive Drilling (eRTMAC Alone)</span>
              </span>
              <Badge className="bg-rose-600 text-white text-[9px] font-mono font-bold">
                34h NPT INCURRED
              </Badge>
            </div>

            <div className="space-y-3 text-neutral-700 dark:text-neutral-300 font-sans text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-[#181115] border border-rose-200/80 dark:border-rose-900/40 space-y-1">
                <div className="text-neutral-950 dark:text-white font-mono font-bold text-[11px] flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center text-[10px]">1</span>
                  <span>Blind Entry</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px] pl-5">
                  Bit penetrates Upper Tipam Sandstone micro-fractures without historical analog awareness. Real-time surface parameters look normal until loss begins.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#181115] border border-rose-200/80 dark:border-rose-900/40 space-y-1">
                <div className="text-neutral-950 dark:text-white font-mono font-bold text-[11px] flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center text-[10px]">2</span>
                  <span>Catastrophic Fluid Loss</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px] pl-5">
                  Mud weight 10.8 ppg breaks open depleted fracture network; total fluid loss (420 bbls) strikes at 2,280m MD with complete return loss.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#181115] border border-rose-200/80 dark:border-rose-900/40 space-y-1">
                <div className="text-neutral-950 dark:text-white font-mono font-bold text-[11px] flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center text-[10px]">3</span>
                  <span>Reactive Scramble</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px] pl-5">
                  Drilling operations halt for 34 hours while rig crew frantically sources LCM pill chemicals and mixes heavy fiber squeeze pills under emergency conditions.
                </p>
              </div>
            </div>
          </Card>

          {/* NWIS Proactive Path */}
          <Card className="p-6 rounded-2xl border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-[#091410] space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-200 dark:border-emerald-900/40">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>NWIS Real-Time Companion Workflow</span>
              </span>
              <Badge className="bg-emerald-600 text-white text-[9px] font-mono font-bold">
                ZERO NPT LOSS
              </Badge>
            </div>

            <div className="space-y-3 text-neutral-700 dark:text-neutral-300 font-sans text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-[#0d1c16] border border-emerald-200/80 dark:border-emerald-900/40 space-y-1">
                <div className="text-neutral-950 dark:text-white font-mono font-bold text-[11px] flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px]">1</span>
                  <span>75m Advance Notice</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-[11px] pl-5">
                  Watcher triggers depth-calibrated advisory at 2,180m MD, surfacing OIL-GLK-07 historical loss post-mortem 4.2 hours ahead of bit entry.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#0d1c16] border border-emerald-200/80 dark:border-emerald-900/40 space-y-1">
                <div className="text-neutral-950 dark:text-white font-mono font-bold text-[11px] flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px]">2</span>
                  <span>Pre-emptive Conditioning</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-[11px] pl-5">
                  Mud engineer stages 35 ppb mixed-fiber nut-plug pill in suction pit and caps circulating ECD at 10.2 ppg (mitigation proven by offset GLK-05).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#0d1c16] border border-emerald-200/80 dark:border-emerald-900/40 space-y-1">
                <div className="text-neutral-950 dark:text-white font-mono font-bold text-[11px] flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px]">3</span>
                  <span>Clean Safe Passage</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-[11px] pl-5">
                  Bit traverses 2,240m–2,350m without any fluid loss or pack-off. Rig saves 34 hours of non-productive time and ₹42L in emergency pill treatments.
                </p>
              </div>
            </div>
          </Card>

        </div>

      </div>
    </section>
  );
};
