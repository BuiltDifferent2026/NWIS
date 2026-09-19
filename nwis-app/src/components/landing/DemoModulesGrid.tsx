'use client';

import React from 'react';
import Link from 'next/link';
import { 
  HardHat, 
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
      title: 'Rig Floor Cockpit & 75m Lookahead',
      subtitle: 'Real-Time Telemetry & Proactive Warning',
      description: 'Sits alongside eRTMAC streaming depth, ROP, torque, and mud weight. Fires hazard advisories 75m before entering the Tipam micro-fracture loss horizon.',
      href: '/wells/well-glk-14',
      icon: HardHat,
      badge: 'LIVE TELEMETRY',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      actionText: 'Open Rig Cockpit',
      metric: '75m Proactive Buffer',
      metricSub: 'OIL-GLK-14 Active Stream'
    },
    {
      title: 'Historical Replay Benchmark Simulator',
      subtitle: 'Falsifiable Lead-Time Verification',
      description: 'Interactive step simulator proving NWIS triggers advisories 75m before reaching the 1996 OIL-GLK-07 total lost circulation horizon (2,280m MD).',
      href: '/replay',
      icon: Activity,
      badge: 'BENCHMARK VERIFIER',
      badgeColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      actionText: 'Launch Simulator',
      metric: '34 NPT Hours Saved',
      metricSub: 'Empirical Verification'
    },
    {
      title: 'Cross-Formation Petrophysical Analogs',
      subtitle: 'Stratigraphic Twin Engine',
      description: 'Calculates 5-vector correlation (stratigraphy, depth, trajectory, operational parameters, geographic proximity) across 25+ Assam-Arakan Basin wells.',
      href: '/analogs',
      icon: GitCompare,
      badge: 'CORRELATION ENGINE',
      badgeColor: 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800',
      actionText: 'Explore Analogs',
      metric: '5-Vector Matrix',
      metricSub: '25+ Basin Wells Indexed'
    },
    {
      title: 'Institutional Memory Decay Index',
      subtitle: 'Basin Knowledge Erosion Quantification',
      description: 'A per-field algorithmic score measuring physical archive deterioration, scanned TIFF percentages, and retiring workforce knowledge risk.',
      href: '/decay-index',
      icon: TrendingDown,
      badge: 'DIGBOI 88% RISK',
      badgeColor: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      actionText: 'Inspect Decay Matrix',
      metric: '851 Records at Risk',
      metricSub: 'Physical Paper Heritage'
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
              Interactive Demo Modules
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xl">
              Select any core scenario below to directly test the platform capabilities built for Oil India Limited.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-950 dark:bg-amber-600 hover:bg-neutral-800 dark:hover:bg-amber-700 text-white text-xs font-bold font-mono transition-colors shadow-xs shrink-0 self-start sm:self-auto"
          >
            <span>Open Fleet Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Interactive Demo Pathway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                {/* Bottom Metric Strip & Action Link */}
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-extrabold font-mono text-neutral-950 dark:text-white">
                      {m.metric}
                    </div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                      {m.metricSub}
                    </div>
                  </div>

                  <Link
                    href={m.href}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-600 dark:hover:bg-amber-600 hover:text-white dark:hover:text-white text-neutral-800 dark:text-neutral-200 text-xs font-bold font-mono transition-all group-hover:bg-amber-600 group-hover:text-white"
                  >
                    <span>{m.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
          <Link
            href="/admin/ingestion"
            className="text-amber-700 dark:text-amber-400 font-bold hover:underline shrink-0 flex items-center gap-1"
          >
            <span>View Ingestion OCR Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
};
