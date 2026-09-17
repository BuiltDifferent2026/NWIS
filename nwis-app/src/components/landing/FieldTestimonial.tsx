'use client';

import React from 'react';
import { Quote, CheckCircle2 } from 'lucide-react';

export const FieldTestimonial: React.FC = () => {
  return (
    <section className="py-16 bg-neutral-50/50 dark:bg-[#0c0e14] border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        {/* Centered Endorsement Card matching Reference Layout */}
        <div className="relative p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#12151c] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
          <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800">
            <Quote className="w-5 h-5" />
          </div>

          <blockquote className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 dark:text-white leading-snug">
            “In the Naga Thrust Belt where steep dips degrade seismic imaging, NWIS gave our rig crew a 75-meter lookahead before penetrating the Tipam loss horizon. Staging LCM pills in advance saved an estimated 34 NPT hours on a single well.”
          </blockquote>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs font-mono text-neutral-500 dark:text-neutral-400">
            <span className="font-bold text-neutral-900 dark:text-neutral-200">
              Senior Drilling Superintendent
            </span>
            <span className="hidden sm:inline">•</span>
            <span>Geleki Active Campaign</span>
            <span className="hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified eRTMAC Shift Log
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
