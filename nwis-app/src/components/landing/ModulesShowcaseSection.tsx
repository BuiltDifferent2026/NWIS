'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Activity, 
  GitCompare, 
  Database, 
  TrendingDown, 
  ArrowRight, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const ModulesShowcaseSection: React.FC = () => {
  const modules = [
    {
      title: 'Active Well Operations Workspace',
      badge: 'CORE COCKPIT',
      badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      description: 'The live operational dashboard alongside eRTMAC. Displays active well state (OIL-GLK-14 @ 2,165.4m), fires 74.6m proactive advisories, and links geospatial map with depth track.',
      href: '/',
      icon: Layers,
      highlight: 'Live telemetry + 3-part alert separation + Distance ≠ Similarity map.'
    },
    {
      title: 'Historical Well Replay Simulator',
      badge: 'FALSIFIABLE DEMO',
      badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      description: 'The pre-spud evaluation tool. Replays historical drilling feeds in fast-forward and proves that NWIS fires its lookahead advisory 75m before the recorded loss horizon.',
      href: '/replay',
      icon: Activity,
      highlight: 'Interactive speed controls (1x–20x), live telemetry jitter, and NPT savings tracker.'
    },
    {
      title: 'Offset Intelligence & Petrophysical Twins',
      badge: 'GEOLOGICAL ENGINE',
      badgeColor: 'bg-neutral-100 dark:bg-[#151c2a] text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-[#20293d]',
      description: 'Cross-formation analog matcher based on porosity, permeability, lithology, and overpressure regime—surfacing disconfirming clean passes to prevent alarm fatigue.',
      href: '/analogs',
      icon: GitCompare,
      highlight: 'Multi-radius filtering + Petrophysical parameter vectors.'
    },
    {
      title: 'Hybrid Ingestion Pipeline & OCR Audit',
      badge: 'PROVENANCE AUDIT',
      badgeColor: 'bg-neutral-100 dark:bg-[#151c2a] text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-[#20293d]',
      description: 'Two-path routing architecture converging clean structured database exports and 130+ years of scanned/typewritten WCRs into a common normalized schema.',
      href: '/admin/ingestion',
      icon: Database,
      highlight: 'Layout-aware OCR extractions + Confidence tiers (STRUCTURED-HIGH to MANUAL-REVIEW).'
    },
    {
      title: 'Institutional Memory Decay Index',
      badge: 'DIGITIZATION BACKLOG',
      badgeColor: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
      description: 'Quantifies per-field knowledge erosion (Digboi 88%, Kharsang 76%, Geleki 68%) to prioritize scanning efforts for retiring engineers&apos; notebooks and legacy logs.',
      href: '/decay-index',
      icon: TrendingDown,
      highlight: 'Field risk rankings + PSU safety boundary specifications.'
    }
  ];

  return (
    <section id="modules" className="py-16 px-4 sm:px-6 border-t border-neutral-200 dark:border-[#1e2536] bg-neutral-50/50 dark:bg-[#07090f] transition-colors">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
            PRODUCT CAPABILITIES
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-mono">
            Explore the Prototype Modules
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
            Click into any operational module to experience how NWIS augments drilling decision-making across the Assam-Arakan Basin.
          </p>
        </div>

        {/* ─── Modules Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.title}
                className="p-5 rounded-2xl border border-neutral-200 dark:border-[#1e273b] bg-white dark:bg-[#0e121a] shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${m.badgeColor}`}>
                      {m.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-neutral-950 dark:text-white font-mono leading-snug">
                    {m.title}
                  </h3>

                  <p className="text-xs text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                    {m.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-neutral-100 dark:border-[#1a2233]">
                  <div className="text-[11px] font-mono text-amber-700 dark:text-amber-400">
                    <strong>Key Feature:</strong> {m.highlight}
                  </div>

                  <Link
                    href={m.href}
                    className="inline-flex items-center justify-between w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-[#141a27] hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 dark:hover:text-white text-neutral-800 dark:text-neutral-200 text-xs font-mono font-bold transition-all"
                  >
                    <span>Launch Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
