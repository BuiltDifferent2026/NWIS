'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 text-xs border-t border-neutral-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand & Problem Statement */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center border border-neutral-800">
              <div className="flex flex-col gap-0.5 items-center">
                <span className="w-3 h-0.5 rounded-xs bg-amber-500" />
                <span className="w-3 h-0.5 rounded-xs bg-amber-600" />
                <span className="w-3 h-0.5 rounded-xs bg-amber-700" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white tracking-tight">NWIS</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                  SIH26121
                </span>
                <span className="text-[11px] text-neutral-400 font-medium">Oil India Limited</span>
              </div>
              <div className="text-[10px] text-neutral-500 font-mono">
                Nearby Wells Intelligence System • Upstream Operations Demo
              </div>
            </div>
          </div>

          {/* Quick Demo Shortcuts */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono font-semibold text-neutral-300">
            <Link href="/dashboard" className="hover:text-amber-400 transition-colors">
              Fleet Cockpit
            </Link>
            <span className="text-neutral-700">•</span>
            <Link href="/replay" className="hover:text-amber-400 transition-colors">
              Replay Simulator
            </Link>
            <span className="text-neutral-700">•</span>
            <Link href="/analogs" className="hover:text-amber-400 transition-colors">
              Analogs
            </Link>
            <span className="text-neutral-700">•</span>
            <Link href="/decay-index" className="hover:text-amber-400 transition-colors">
              Decay Index
            </Link>
            <span className="text-neutral-700">•</span>
            <Link href="/admin/ingestion" className="hover:text-amber-400 transition-colors">
              Ingestion Audit
            </Link>
          </div>

          {/* PSU Sovereignty */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Air-Gapped Sovereign Ready</span>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-neutral-500">
          <div>© 2026 NWIS • Built for Smart India Hackathon (Ministry of Petroleum & Natural Gas)</div>
          <div>Assam-Arakan Basin Stratigraphic Memory (1889–2026)</div>
        </div>

      </div>
    </footer>
  );
};
