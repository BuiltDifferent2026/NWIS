'use client';

import React from 'react';
import { 
  ShieldCheck, 
  GitCompare, 
  Activity, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Database,
  Layers
} from 'lucide-react';
import Link from 'next/link';

export const DifferentiatorsSection: React.FC = () => {
  return (
    <section id="differentiators" className="py-16 px-4 sm:px-6 border-t border-neutral-200 dark:border-[#1e2536] bg-white dark:bg-[#090c13] transition-colors">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
            CORE ARCHITECTURAL PILLARS
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-mono">
            Why NWIS Stands Out
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
            Engineered specifically around Oil India Limited&apos;s operational constraints, Assam thrust-belt geology, and PSU data sovereignty.
          </p>
        </div>

        {/* ─── 4 Differentiator Cards Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Pillar 1 */}
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-[#1e273b] bg-neutral-50/50 dark:bg-[#0e121a] shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-neutral-950 dark:text-white font-mono leading-snug">
                1. Sits Alongside eRTMAC, Never Replaces It
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                A strict one-way, read-only API contract: NWIS ingests current live depth and telemetry from eRTMAC, but <strong>never sends commands back to rig controls</strong>. Preserves safety boundaries with zero boundary creep.
              </p>
            </div>
            <div className="pt-2 border-t border-neutral-200 dark:border-[#1a2233] text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
              Contract: GET /live-state/{'{well_id}'}
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-[#1e273b] bg-neutral-50/50 dark:bg-[#0e121a] shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <GitCompare className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-neutral-950 dark:text-white font-mono leading-snug">
                2. Similarity ≠ Distance
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                Ranks offset wells across formation match, depth alignment, trajectory profile, and parameters. Surfacing <strong>OIL-GLK-07 (3.1 km, 0.84 sim)</strong> over a closer well with mismatched lithology.
              </p>
            </div>
            <div className="pt-2 border-t border-neutral-200 dark:border-[#1a2233] text-[10px] font-mono text-amber-700 dark:text-amber-400 font-semibold">
              Multidimensional Composite Scoring
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-[#1e273b] bg-neutral-50/50 dark:bg-[#0e121a] shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-neutral-950 dark:text-white font-mono leading-snug">
                3. Proactive Lookahead Advisories (-75m)
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                Background corridor watcher continuously tracks bit depth relative to historical hazard intervals. Fires evidence-backed warnings <strong>75 meters before entering the loss zone</strong>.
              </p>
            </div>
            <div className="pt-2 border-t border-neutral-200 dark:border-[#1a2233] text-[10px] font-mono text-amber-700 dark:text-amber-400 font-semibold">
              Pre-Emptive Pill Staging Window
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-[#1e273b] bg-neutral-50/50 dark:bg-[#0e121a] shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-neutral-950 dark:text-white font-mono leading-snug">
                4. Auditable Source Provenance
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                Every advisory strictly separates <strong>Fact vs. Estimate vs. Suggested Mitigation</strong>, directly linked to scanned WCR page citations and confidence provenance tags.
              </p>
            </div>
            <div className="pt-2 border-t border-neutral-200 dark:border-[#1a2233] text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
              WCR / DDR Scanned Traceability
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
