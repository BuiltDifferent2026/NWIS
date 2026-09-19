'use client';

import React from 'react';
import { BookOpen, AlertTriangle, Search, Mountain, ShieldAlert, Layers } from 'lucide-react';

export const ProblemQuadrantSection: React.FC = () => {
  return (
    <section id="problem" className="py-16 px-4 sm:px-6 border-t border-neutral-200 dark:border-[#1e2536] bg-neutral-50/50 dark:bg-[#07090f] transition-colors">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono font-bold uppercase tracking-wider">
            UPSTREAM OPERATIONAL BOTTLENECK
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-mono">
            What Problem Does NWIS Solve?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
            eRTMAC monitors active sensor streams on the rig, but critical historical offset precedents remain trapped in unsearchable physical archives or retiring personnel memory.
          </p>
        </div>

        {/* ─── 4-Quadrant Architecture Diagram Layout ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto relative">
          
          {/* Quadrant 1: Institutional Memory Loss */}
          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-[#1e273b] bg-white dark:bg-[#0e121a] shadow-xs space-y-3 relative group hover:border-amber-500/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-mono font-bold text-sm">
                01
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400 block font-bold">VULNERABILITY 1</span>
                <h3 className="text-base font-bold text-neutral-950 dark:text-white font-mono">
                  Institutional Memory Loss
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
              <strong>130+ years and 1,000+ wells</strong> of drilling history in Digboi and Assam fields reside mostly on paper TIFFs or in retiring engineers&apos; individual memories—with no structured, searchable operational ontology.
            </p>
            <div className="text-[11px] font-mono text-amber-700 dark:text-amber-400 pt-1 flex items-center gap-1.5">
              <span>Impact:</span>
              <span>Repeat mistakes in known depleted reservoir zones.</span>
            </div>
          </div>

          {/* Quadrant 2: Reactive Not Proactive */}
          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-[#1e273b] bg-white dark:bg-[#0e121a] shadow-xs space-y-3 relative group hover:border-rose-500/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center font-mono font-bold text-sm">
                02
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400 block font-bold">VULNERABILITY 2</span>
                <h3 className="text-base font-bold text-neutral-950 dark:text-white font-mono">
                  Reactive, Not Proactive Risk Management
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
              Mud losses, stuck pipe incidents, gas kicks, and overpressure events are typically documented <em>after</em> they happen on the active rig—not anticipated from offset well precedent before the bit reaches that depth.
            </p>
            <div className="text-[11px] font-mono text-rose-700 dark:text-rose-400 pt-1 flex items-center gap-1.5">
              <span>Impact:</span>
              <span>Average 28–60 NPT hours lost per severe incident.</span>
            </div>
          </div>

          {/* Quadrant 3: Fragmented Manual Search */}
          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-[#1e273b] bg-white dark:bg-[#0e121a] shadow-xs space-y-3 relative group hover:border-amber-500/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-mono font-bold text-sm">
                03
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400 block font-bold">VULNERABILITY 3</span>
                <h3 className="text-base font-bold text-neutral-950 dark:text-white font-mono">
                  Fragmented, Time-Consuming Manual Search
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
              Engineers must manually dig through scattered Well Completion Reports (WCRs), Daily Drilling Reports (DDRs), and disparate spreadsheets under extreme shift time pressure—with results dependent on memory.
            </p>
            <div className="text-[11px] font-mono text-amber-700 dark:text-amber-400 pt-1 flex items-center gap-1.5">
              <span>Impact:</span>
              <span>Delayed decision-making during critical drilling breaks.</span>
            </div>
          </div>

          {/* Quadrant 4: Seismic Blind Spot */}
          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-[#1e273b] bg-white dark:bg-[#0e121a] shadow-xs space-y-3 relative group hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-sm">
                04
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400 block font-bold">VULNERABILITY 4</span>
                <h3 className="text-base font-bold text-neutral-950 dark:text-white font-mono">
                  A Real Prediction Blind Spot in OIL&apos;s Own Terrain
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
              In the <strong>Naga Thrust and Fold Belt</strong>, seismic imaging is documented as unreliable due to rugged surface topography, steep dips, and structural complexity. Empirical offset data is the only dependable safety barrier.
            </p>
            <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 pt-1 flex items-center gap-1.5">
              <span>Impact:</span>
              <span>Predictive geological models are weakest where risk is highest.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
