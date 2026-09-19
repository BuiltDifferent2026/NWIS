'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export const LandingNav: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0a0c10]/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      {/* Top Architectural Announcement Strip */}
      <div className="bg-neutral-900 text-neutral-300 text-[11px] font-mono py-1.5 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold tracking-wide uppercase">
              SIH 2026 • SIH26121
            </span>
            <span className="text-neutral-400 hidden sm:inline">•</span>
            <span>Oil India Limited — Nearby Wells Intelligence System (eRTMAC-NWIS)</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-neutral-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              PSU Data Sovereign
            </span>
            <span>•</span>
            <span>Assam-Arakan Basin Archives (1889–2026)</span>
          </div>
        </div>
      </div>

      {/* Main Blueprint Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo with Strata Icon */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-neutral-950 dark:bg-neutral-900 flex items-center justify-center border border-neutral-800 shadow-xs group-hover:border-amber-600 transition-colors">
              <div className="relative flex flex-col gap-0.5 items-center">
                <span className="w-4 h-1 rounded-xs bg-amber-500" />
                <span className="w-4 h-1 rounded-xs bg-amber-600" />
                <span className="w-4 h-1 rounded-xs bg-amber-700" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-neutral-950 dark:text-white">
                  NWIS
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                  eRTMAC Companion
                </span>
              </div>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 tracking-wide">
                Oil India Limited • Offset-Well Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Demo Module Links */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-mono font-bold text-neutral-600 dark:text-neutral-300">
            <Link href="/dashboard" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
              Fleet Cockpit
            </Link>
            <Link href="/replay" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors flex items-center gap-1">
              <span>Well Replay</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">
                Demo
              </span>
            </Link>
            <Link href="/analogs" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
              Lithology Analogs
            </Link>
            <Link href="/decay-index" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
              Memory Decay
            </Link>
            <Link href="/admin/ingestion" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
              Ingestion Audit
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="px-3.5 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-neutral-950 dark:bg-amber-600 text-white hover:bg-neutral-800 dark:hover:bg-amber-700 transition-colors shadow-xs border border-neutral-800 dark:border-amber-500"
            >
              <span>Launch Console</span>
              <ArrowRight className="w-4 h-4 text-amber-400 dark:text-white" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
