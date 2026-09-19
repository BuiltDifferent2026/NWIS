'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Activity, 
  GitCompare, 
  TrendingDown, 
  ArrowRight, 
  Compass, 
  Database,
  ShieldCheck
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const DemoModulesGrid: React.FC = () => {
  const modules = [
    {
      title: 'Live Operations Cockpit',
      subtitle: 'Real-Time Telemetry & Proactive Warning',
      description: 'Active drilling workspace alongside eRTMAC. Real-time wellbore telemetry, 75m lookahead hazard alert countdown, and synchronized geospatial offset map.',
      href: '/wells/well-glk-14',
      icon: Layers,
      badge: 'CORE COCKPIT',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      actionText: 'Launch Live Cockpit',
      preview: {
        label: 'Active Well',
        val: 'OIL-GLK-14 @ 2,165m',
        metric: '14.8 m/h ROP',
        status: 'Streaming'
      }
    },
    {
      title: 'Historical Well Replay Simulator',
      subtitle: 'Deterministic Benchmark Verifier',
      description: 'Deterministic benchmark simulator. Replays historical 1988–2004 drilling feeds at 1x–20x to verify proactive lookahead alerts before documented losses.',
      href: '/replay',
      icon: Activity,
      badge: 'VALIDATION ENGINE',
      badgeColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      actionText: 'Run Replay Simulator',
      preview: {
        label: 'Validated Scenario',
        val: 'OIL-GLK-07 (1996)',
        metric: '34h NPT Avoided',
        status: 'Falsifiable'
      }
    },
    {
      title: 'Cross-Formation Petrophysical Analogs',
      subtitle: 'Stratigraphic Twin Correlation Engine',
      description: 'Multi-well correlation panel & petrophysical similarity engine. Surfaces true stratigraphic analogs across complex Assam fault blocks (Similarity ≠ Distance).',
      href: '/analogs',
      icon: GitCompare,
      badge: 'STRATIGRAPHIC TWINS',
      badgeColor: 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800',
      actionText: 'Explore Offset Analogs',
      preview: {
        label: 'Best Geological Twin',
        val: 'OIL-GLK-07 (87% Sim)',
        metric: '1.8 km SE Offset',
        status: 'Correlated'
      }
    },
    {
      title: 'Fleet Well Register & Watcher',
      subtitle: 'Basin-Wide Multi-Rig Oversight',
      description: 'Assam-Arakan basin-wide multi-rig register tracking active drilling corridors, calibrated lookahead proximity gauges, and shift operations checklists.',
      href: '/dashboard',
      icon: Compass,
      badge: 'BASIN FLEET',
      badgeColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      actionText: 'Open Fleet Register',
      preview: {
        label: 'Active Rig Fleet',
        val: '3 Rigs Drilling',
        metric: 'GLK-COR-03 Watcher',
        status: 'Live Stream'
      }
    },
    {
      title: 'Archival OCR & Ingestion Pipeline',
      subtitle: 'Legacy WCR & DDR Vectorization',
      description: 'Standardizes 130+ years of typewritten WCRs & daily drilling logs into structured schemas with bounding-box OCR, layout parsing, and human-in-the-loop audit.',
      href: '/admin/ingestion',
      icon: Database,
      badge: 'DOCUMENT INGESTION',
      badgeColor: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      actionText: 'Inspect Ingestion Pipeline',
      preview: {
        label: 'Layout OCR Accuracy',
        val: '94.2% Conf Score',
        metric: '14 pages / min',
        status: 'Batch #4'
      }
    },
    {
      title: 'Institutional Memory Decay Index',
      subtitle: 'Basin Knowledge Erosion Quantification',
      description: 'Quantifies subsurface knowledge loss risks across Digboi, Kharsang, and Geleki to prioritize fragile physical records before senior superintendents retire.',
      href: '/decay-index',
      icon: TrendingDown,
      badge: 'GOVERNANCE AUDIT',
      badgeColor: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      actionText: 'Check Field Risk Index',
      preview: {
        label: 'Highest Decay Risk',
        val: 'Digboi: 88 / 100',
        metric: '851 At-Risk WCRs',
        status: 'Critical'
      }
    }
  ];

  return (
    <section id="demo-modules" className="py-16 bg-neutral-50/60 dark:bg-[#0c0e14] border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-[11px] font-mono font-semibold mb-2">
              <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>SIH26121 EVALUATION TRACKS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
              Assam Basin Drilling Intelligence Modules
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl">
              Six integrated modules bridging live eRTMAC rig streaming with 130 years of archival memory across the Naga Thrust & Fold Belt.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-950 dark:bg-amber-600 hover:bg-neutral-800 dark:hover:bg-amber-700 text-white text-xs font-bold font-mono transition-colors shadow-xs shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <span>Open Fleet Register</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Balanced Interactive Module Cards (3x2 Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Card
                key={m.title}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-6 shadow-xs hover:shadow-md hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-800 dark:text-neutral-200 group-hover:bg-amber-50 dark:group-hover:bg-amber-950/40 group-hover:text-amber-700 dark:group-hover:text-amber-400 group-hover:border-amber-200 dark:group-hover:border-amber-800 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className={`text-[10px] font-mono font-bold ${m.badgeColor}`}>
                      {m.badge}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-neutral-950 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                      {m.title}
                    </h3>
                    <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {m.subtitle}
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                    {m.description}
                  </p>
                </div>

                {/* Miniature Instrument Preview Badge */}
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#0c0f16] border border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-neutral-500 dark:text-neutral-400 text-[10px] block font-bold">{m.preview.label}</span>
                    <span className="font-bold text-neutral-900 dark:text-neutral-200 text-[11px]">{m.preview.val}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-neutral-500 dark:text-neutral-400 text-[10px] block">{m.preview.status}</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 text-[11px]">{m.preview.metric}</span>
                  </div>
                </div>

                {/* Bottom Action Link */}
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-3">
                  <Link
                    href={m.href}
                    className="w-full inline-flex items-center justify-between px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/90 hover:bg-amber-600 dark:hover:bg-amber-600 hover:text-white dark:hover:text-white text-neutral-800 dark:text-neutral-200 text-xs font-bold font-mono transition-all group-hover:bg-amber-600 group-hover:text-white cursor-pointer"
                  >
                    <span>{m.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Footnote Bar */}
        <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Auditable Pedigree: Every advisory strictly separates observed facts, model estimates, and field mitigations with WCR line citations.</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-amber-700 dark:text-amber-400 font-bold">OIL INDIA LIMITED eRTMAC COMPANION</span>
          </div>
        </div>

      </div>
    </section>
  );
};
