'use client';

import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Leaf, 
  Users, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export const ImpactPillarsSection: React.FC = () => {
  return (
    <section id="impact" className="py-16 px-4 sm:px-6 border-t border-neutral-200 dark:border-[#1e2536] bg-white dark:bg-[#090c13] transition-colors">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
            BASIN &amp; STAKEHOLDER VALUE
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-mono">
            One Intelligent Well → Multiple Impacts
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
            Every historical well logged in Assam makes the next active well safer, faster, and more cost-effective.
          </p>
        </div>

        {/* ─── 5 Impact Pillars Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Impact 1: Safety */}
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-[#1e273b] bg-neutral-50/50 dark:bg-[#0e121a] shadow-xs space-y-3 hover:border-amber-500/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400 block font-bold">SAFETY PILLAR</span>
                <h3 className="text-sm font-bold text-neutral-950 dark:text-white font-mono">
                  Safety &amp; Well Control
                </h3>
              </div>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
              Provides proactive lookahead warnings for tectonic overpressure ramps and formation-specific wellbore instability before the bit enters problematic horizons.
            </p>
          </div>

          {/* Impact 2: Operational */}
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-[#1e273b] bg-neutral-50/50 dark:bg-[#0e121a] shadow-xs space-y-3 hover:border-amber-500/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400 block font-bold">OPERATIONAL PILLAR</span>
                <h3 className="text-sm font-bold text-neutral-950 dark:text-white font-mono">
                  Non-Productive Time (NPT) Reduction
                </h3>
              </div>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
              Dramatically cuts lost circulation and stuck pipe NPT hours through pre-emptive LCM pill staging and hydraulics verification based on proven offset outcomes.
            </p>
          </div>

          {/* Impact 3: Environmental */}
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-[#1e273b] bg-neutral-50/50 dark:bg-[#0e121a] shadow-xs space-y-3 hover:border-amber-500/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400 block font-bold">ENVIRONMENTAL PILLAR</span>
                <h3 className="text-sm font-bold text-neutral-950 dark:text-white font-mono">
                  Eco-Sensitive Zone Protection
                </h3>
              </div>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
              Mitigates blowout and fluid spill risks across environmentally sensitive upstream operating zones in Upper Assam through disciplined lookahead barrier management.
            </p>
          </div>

          {/* Impact 4: Knowledge & Workforce */}
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-[#1e273b] bg-neutral-50/50 dark:bg-[#0e121a] shadow-xs space-y-3 hover:border-amber-500/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400 block font-bold">WORKFORCE PILLAR</span>
                <h3 className="text-sm font-bold text-neutral-950 dark:text-white font-mono">
                  Preserving Institutional Memory
                </h3>
              </div>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
              Captures decades of retiring drilling superintendents&apos; experiential heuristics into permanent, searchable knowledge assets—accelerating new engineer onboarding.
            </p>
          </div>

          {/* Impact 5: Strategic PSU Sovereignty */}
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-[#1e273b] bg-neutral-50/50 dark:bg-[#0e121a] shadow-xs space-y-3 hover:border-amber-500/40 transition-colors md:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400 block font-bold">NATIONAL SOVEREIGNTY</span>
                <h3 className="text-sm font-bold text-neutral-950 dark:text-white font-mono">
                  Indigenous PSU Capability &amp; Data Sovereignty
                </h3>
              </div>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
              Eliminates dependence on expensive foreign software suites (Landmark/DecisionSpace, SLB) that are tuned to Western basins. NWIS provides an indigenous, PSU-owned platform calibrated directly to Indian geology and deployed 100% on-premise.
            </p>
          </div>

        </div>

        {/* ─── Stakeholder-Segmented Benefits Grid ─── */}
        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-[#1e273b] bg-neutral-50/80 dark:bg-[#0e121a] space-y-4">
          <h3 className="text-sm font-extrabold text-neutral-950 dark:text-white font-mono uppercase tracking-wide">
            Stakeholder-Segmented Value Delivery
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#121724] border border-neutral-200 dark:border-[#1a2333] space-y-1">
              <strong className="text-amber-600 dark:text-amber-400 font-mono text-xs block">For Field Engineers</strong>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-[11px]">
                Instant evidence-backed answers to &quot;has this happened nearby before and what worked?&quot; without leaving eRTMAC.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#121724] border border-neutral-200 dark:border-[#1a2333] space-y-1">
              <strong className="text-amber-600 dark:text-amber-400 font-mono text-xs block">For Operations Managers</strong>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-[11px]">
                Fleet-wide risk exposure across all active rigs with drill-down evidence for shift handovers and reviews.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#121724] border border-neutral-200 dark:border-[#1a2333] space-y-1">
              <strong className="text-amber-600 dark:text-amber-400 font-mono text-xs block">For Oil India Limited</strong>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-[11px]">
                A permanent, growing digital institutional memory asset that survives staff turnover and retired knowledge loss.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#121724] border border-neutral-200 dark:border-[#1a2333] space-y-1">
              <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-xs block">For India (Energy Security)</strong>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-[11px]">
                Higher drilling efficiency at a Maharatna PSU, contributing to domestic crude production and energy self-reliance.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
