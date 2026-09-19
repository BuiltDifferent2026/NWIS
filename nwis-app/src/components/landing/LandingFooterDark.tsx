'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, HardHat, ExternalLink, Activity, Layers, GitCompare, Database, TrendingDown } from 'lucide-react';

export const LandingFooterDark: React.FC = () => {
  return (
    <footer className="border-t border-neutral-200 dark:border-[#1e2536] bg-white dark:bg-[#07090f] text-neutral-600 dark:text-neutral-400 py-12 px-4 sm:px-6 text-xs transition-colors">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Top Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Context */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white font-mono font-extrabold text-xs shadow-xs">
                OIL
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base font-mono text-neutral-950 dark:text-white">
                  NWIS
                </span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[9px] font-mono font-bold uppercase">
                  eRTMAC Companion
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-sans max-w-md leading-relaxed">
              AI-Powered Offset Well Knowledge and Decision Support Platform for Drilling Operations across the Assam–Arakan Basin. Purpose-built for <strong>Oil India Limited</strong>.
            </p>

            <div className="text-[11px] font-mono text-neutral-500 space-y-1">
              <div>Problem Statement ID: <strong className="text-neutral-900 dark:text-neutral-200">SIH26121</strong> · Theme: <strong className="text-neutral-900 dark:text-neutral-200">Smart Automation</strong></div>
              <div>Subsurface Memory: <span className="text-amber-500">1889–2026 Assam Basin Records</span></div>
            </div>
          </div>

          {/* Console Modules Links */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-mono font-bold uppercase text-neutral-950 dark:text-white tracking-wider">
              Prototype Console Modules
            </span>
            <ul className="space-y-1.5 font-mono text-xs">
              <li>
                <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Operations Workspace (OIL-GLK-14)</span>
                </Link>
              </li>
              <li>
                <Link href="/replay" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-500" />
                  <span>Historical Replay Simulator</span>
                </Link>
              </li>
              <li>
                <Link href="/analogs" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <GitCompare className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Offset Intelligence &amp; Analogs</span>
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Lookahead Advisories Queue
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Audit Links */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-mono font-bold uppercase text-neutral-950 dark:text-white tracking-wider">
              Governance &amp; Archiving
            </span>
            <ul className="space-y-1.5 font-mono text-xs">
              <li>
                <Link href="/admin/ingestion" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Hybrid Ingestion Pipeline</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/sources" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Archival Source Documents Register
                </Link>
              </li>
              <li>
                <Link href="/decay-index" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                  <span>Memory Decay Index by Field</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Fleet Basin Overview
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-neutral-200 dark:border-[#1a2233] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-mono">
          <div>
            © 2026 NWIS Platform · Built for <strong>Oil India Limited</strong> (A Maharatna PSU).
          </div>
          
          <div className="flex items-center gap-4 text-neutral-500">
            <span className="flex items-center gap-1 text-emerald-500">
              <ShieldCheck className="w-3.5 h-3.5" /> On-Premise Air-Gapped Ready
            </span>
            <span>·</span>
            <span>Naga Thrust Belt Stratigraphy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
