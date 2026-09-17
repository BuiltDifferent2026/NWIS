'use client';

import React from 'react';
import { Quote, CheckCircle2 } from 'lucide-react';

export const FieldTestimonial: React.FC = () => {
  return (
    <section className="py-16 bg-neutral-50/50 border-b border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        {/* Centered Endorsement Card matching Reference Layout */}
        <div className="relative p-8 sm:p-12 rounded-3xl bg-white border border-neutral-200/90 shadow-sm space-y-6">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto border border-amber-200">
            <Quote className="w-5 h-5" />
          </div>

          <blockquote className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 leading-snug">
            “In the Naga Thrust Belt where steep dips degrade seismic imaging, NWIS gave our rig crew a 75-meter lookahead before penetrating the Tipam loss horizon. Staging LCM pills in advance saved an estimated 34 NPT hours on a single well.”
          </blockquote>

          <div className="pt-2 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs font-mono text-neutral-500">
            <span className="font-bold text-neutral-800">
              Senior Drilling Superintendent
            </span>
            <span className="hidden sm:inline">•</span>
            <span>Geleki Active Campaign</span>
            <span className="hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified eRTMAC Shift Log
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
