'use client';

import React from 'react';
import { Database, ShieldCheck, HardHat, Compass, Mountain, Flame } from 'lucide-react';

export const BasinTrustRibbon: React.FC = () => {
  const trustNodes = [
    {
      name: 'Oil India Limited',
      subtitle: 'Duliajan Upstream Operations',
      icon: Flame
    },
    {
      name: 'eRTMAC Center',
      subtitle: 'Real-Time Monitoring Companion',
      icon: HardHat
    },
    {
      name: 'Digboi 1889 Archive',
      subtitle: '130+ Years of Indian Drilling',
      icon: Database
    },
    {
      name: 'Naga Thrust Belt',
      subtitle: 'Complex Overpressure Regimes',
      icon: Mountain
    },
    {
      name: 'PSU Data Governance',
      subtitle: 'Air-Gapped / On-Premise Sovereign',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-[#0c0e14] py-6 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center md:text-left mb-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-bold">
            Engineered for Upstream Operations & Strategic Energy Self-Reliance
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
          {trustNodes.map((node) => {
            const Icon = node.icon;
            return (
              <div 
                key={node.name}
                className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] shadow-xs hover:border-amber-500/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 text-neutral-700 dark:text-neutral-300">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-neutral-950 dark:text-white truncate">
                    {node.name}
                  </div>
                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate font-mono">
                    {node.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
