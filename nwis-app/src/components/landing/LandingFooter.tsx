'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-400 text-xs border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-neutral-950 flex items-center justify-center border border-neutral-700">
                <div className="flex flex-col gap-0.5 items-center">
                  <span className="w-3 h-0.5 rounded-xs bg-amber-500" />
                  <span className="w-3 h-0.5 rounded-xs bg-amber-600" />
                  <span className="w-3 h-0.5 rounded-xs bg-amber-700" />
                </div>
              </div>
              <span className="font-bold text-base text-white tracking-tight">
                NWIS
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                eRTMAC Companion
              </span>
            </div>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              AI-Powered Offset Well Knowledge and Decision Support Platform for Drilling Operations across the Assam-Arakan Basin. Built for Oil India Limited.
            </p>
            <div className="pt-2 text-[11px] font-mono text-neutral-500">
              Problem Statement ID: <strong>SIH26121</strong> • Theme: <strong>Smart Automation</strong>
            </div>
          </div>

          {/* Nav Col 1 */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Console Modules
            </div>
            <ul className="space-y-1.5 font-mono text-[11px]">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Operations Dashboard
                </Link>
              </li>
              <li>
                <Link href="/wells/well-glk-14" className="hover:text-white transition-colors">
                  Well Workspace (Map + Track)
                </Link>
              </li>
              <li>
                <Link href="/replay" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Historical Replay Demo</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Live
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="hover:text-white transition-colors">
                  Proactive Alert Inbox
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Col 2 */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Governance & Audit
            </div>
            <ul className="space-y-1.5 font-mono text-[11px]">
              <li>
                <Link href="/admin/ingestion" className="hover:text-white transition-colors">
                  Ingestion Pipeline Status
                </Link>
              </li>
              <li>
                <Link href="/admin/sources" className="hover:text-white transition-colors">
                  Archival Source Register
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Role-Based Authentication
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-500">
          <div>
            © 2026 NWIS Platform • Oil India Limited (A Maharatna PSU)
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              On-Premise Ready
            </span>
            <span>•</span>
            <span>Assam-Arakan Basin Stratigraphy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
