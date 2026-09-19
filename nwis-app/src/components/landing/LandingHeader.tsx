'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, HardHat, ExternalLink, Sparkles, ArrowRight, Layers } from 'lucide-react';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export const LandingHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 dark:border-[#1e2536] bg-white/90 dark:bg-[#090c13]/90 backdrop-blur-md transition-colors">
      
      {/* ─── Slim Institutional Context Ribbon ─── */}
      <div className="bg-[#080b11] text-neutral-300 px-4 py-1 text-[11px] font-mono border-b border-[#1a2130] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-700/60 text-[10px] font-bold">
            SIH 2026 · SIH26121
          </span>
          <span className="text-neutral-500 hidden sm:inline">|</span>
          <span className="text-neutral-300 font-medium hidden sm:inline">
            Oil India Limited — Subsurface Institutional Memory
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-bold">eRTMAC Institutional Memory Layer</span>
          <span className="text-neutral-600">·</span>
          <span className="text-neutral-400">Read-Only One-Way Bridge</span>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <div className="flex items-center gap-1 text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/60">
            <ShieldCheck className="w-3 h-3" />
            <span className="font-semibold">PSU Data Sovereignty · On-Premise Ready</span>
          </div>
        </div>
      </div>

      {/* ─── Main Header Navigation ─── */}
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <Link href="/landing" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white font-mono font-extrabold text-sm shadow-sm ring-1 ring-amber-500/30">
            OIL
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-neutral-950 dark:text-white font-mono">
                NWIS
              </span>
              <span className="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[9px] font-mono font-bold uppercase tracking-wider">
                eRTMAC Companion
              </span>
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono leading-none">
              Oil India Limited · Offset Well Intelligence
            </div>
          </div>
        </Link>

        {/* Section Anchor Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-mono font-medium text-neutral-600 dark:text-neutral-300">
          <a href="#problem" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            Problem Statement
          </a>
          <a href="#differentiators" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            Why We Stand Out
          </a>
          <a href="#modules" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            System Modules
          </a>
          <a href="#impact" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            Basin Impact
          </a>
          <a href="#faq" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            Technical Q&amp;A
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold font-mono shadow-xs transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-amber-200" />
            <span>Launch Operations Cockpit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </header>
  );
};
