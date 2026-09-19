'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  HardHat, 
  Bell, 
  ExternalLink,
  Activity,
  Layers,
  GitCompare,
  Database,
  Scale,
  Sparkles,
  Info,
  CheckCircle2,
  X
} from 'lucide-react';
import { useAppStore } from '../../store/app-store';
import { INITIAL_LIVE_TELEMETRY } from '@/data/live-state';
import { UserRole } from '@/lib/data/types';
import { AskNwisDrawer } from '@/components/common/AskNwisDrawer';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export const GovHeader: React.FC = () => {
  const pathname = usePathname();
  const { currentRole, setRole, activeWellId, setActiveWellId, alerts } = useAppStore();
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [showErtmacBridgeModal, setShowErtmacBridgeModal] = useState<boolean>(false);
  
  // Unread high-priority notifications
  const unreadAlerts = alerts.filter((a) => a.status === 'new').length;

  const navItems = [
    {
      name: 'Operations',
      href: '/operations',
      icon: Layers,
      match: (p: string) => p.startsWith('/operations') || p === '/dashboard' || p.startsWith('/wells'),
      badge: 'LIVE'
    },
    {
      name: 'Well Replay',
      href: '/replay',
      icon: Activity,
      match: (p: string) => p.startsWith('/replay'),
      badge: 'DEMO'
    },
    {
      name: 'Offset Intelligence',
      href: '/analogs',
      icon: GitCompare,
      match: (p: string) => p.startsWith('/analogs'),
    },
    {
      name: 'Archive & Evidence',
      href: '/admin/ingestion',
      icon: Database,
      match: (p: string) => p.startsWith('/admin'),
    },
    {
      name: 'Governance',
      href: '/decay-index',
      icon: Scale,
      match: (p: string) => p.startsWith('/decay-index'),
    },
    {
      name: 'Home',
      href: '/',
      icon: Sparkles,
      match: (p: string) => p === '/' || p === '/landing',
    }
  ];

  return (
    <>
      <header className="border-b border-neutral-200 dark:border-[#1e2536] bg-white dark:bg-[#0c0f17] sticky top-0 z-40 transition-colors shadow-xs">
        
        {/* ─── Clean Header Bar ─── */}
        <div className="px-4 py-2.5 flex items-center justify-between gap-4">
          
          {/* Brand & eRTMAC Tag */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 dark:from-amber-600 dark:to-amber-800 flex items-center justify-center text-white font-mono font-extrabold text-sm shadow-sm ring-1 ring-amber-500/30">
              OIL
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-neutral-950 dark:text-white font-mono">
                NWIS
              </span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[9px] font-mono font-bold uppercase tracking-wider">
                eRTMAC
              </span>
            </div>
          </Link>

          {/* Right Control Group */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Shift Context Badge */}
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-[#141a27] border border-neutral-200 dark:border-[#1e2638] text-[11px] font-mono text-neutral-700 dark:text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Shift: <strong className="text-neutral-950 dark:text-white">Day (06:00–18:00)</strong></span>
              <span className="text-neutral-400 dark:text-neutral-600">|</span>
              <span className="text-neutral-500">Rig OIL-E2000-IV</span>
            </div>

            {/* Role Switcher Pill */}
            <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-[#141a27] border border-neutral-200 dark:border-[#1e2638] rounded-xl px-2.5 py-1">
              <HardHat className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[9px] font-mono uppercase text-neutral-400 leading-none">Role</span>
                <select
                  value={currentRole}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="bg-transparent text-xs font-bold text-neutral-900 dark:text-neutral-100 cursor-pointer focus:outline-hidden font-sans py-0.5"
                  title="Switch User Role View"
                >
                  <option value="field_engineer">P. Bora (Rig Engineer)</option>
                  <option value="operations_manager">D. Deka (Superintendent)</option>
                  <option value="admin">M. Saikia (PSU Auditor)</option>
                </select>
              </div>
            </div>

            {/* Return / Connected to eRTMAC button */}
            <button
              type="button"
              onClick={() => setShowErtmacBridgeModal(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-600/40 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-300 text-xs font-semibold font-mono transition-colors"
            >
              <ExternalLink className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>eRTMAC Bridge</span>
            </button>

            {/* Ask NWIS Copilot */}
            <button
              type="button"
              onClick={() => setIsCopilotOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span className="hidden sm:inline">Ask NWIS</span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Alert Bell */}
            <Link
              href="/alerts"
              title={unreadAlerts > 0 ? `${unreadAlerts} active lookahead advisories` : 'No unread advisories'}
              className="relative p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#192233] transition-colors border border-neutral-200 dark:border-[#1e2638] bg-white dark:bg-[#121723]"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-mono font-bold text-white ring-2 ring-white dark:ring-[#0c0f17]">
                  {unreadAlerts}
                </span>
              )}
            </Link>

          </div>

        </div>

      </header>

      {/* Slide-Out AI Copilot Drawer */}
      <AskNwisDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />

      {/* eRTMAC Bridge & Safety Contract Modal */}
      {showErtmacBridgeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#0f141f] border border-[#263147] rounded-2xl max-w-xl w-full p-6 text-neutral-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e273b] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white font-mono">eRTMAC System Boundary & Integration</h3>
                  <p className="text-[11px] text-neutral-400">Strict Read-Only Integration Contract</p>
                </div>
              </div>
              <button
                onClick={() => setShowErtmacBridgeModal(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-neutral-300">
              <div className="p-3 rounded-xl bg-[#151c2c] border border-[#222d44] space-y-2">
                <div className="font-mono text-amber-400 font-semibold text-[11px] uppercase tracking-wider">
                  Operational Safety Boundary
                </div>
                <p className="leading-relaxed text-neutral-300">
                  NWIS sits strictly alongside Oil India's <strong>eRTMAC</strong> (real-time monitoring system). NWIS provides the missing <strong>institutional memory layer</strong> and depth-aware offset hazard correlation.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Inbound (Read-Only)</span>
                  </div>
                  <p className="text-[10px] text-emerald-200/80 font-sans">
                    Reads live state: <code className="text-white">GET /live-state/OIL-GLK-14</code> ({INITIAL_LIVE_TELEMETRY.depthMD}m MD, formation, ROP, torque, mud wt).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/60 text-rose-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Outbound (Zero Control)</span>
                  </div>
                  <p className="text-[10px] text-rose-200/80 font-sans">
                    Zero write commands to rig hardware or eRTMAC controls. Advisory and decision-support only.
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-neutral-400 bg-neutral-900/60 p-3 rounded-xl border border-neutral-800 space-y-1">
                <div className="font-mono text-white font-bold">PSU Deployment Specifications:</div>
                <ul className="list-disc list-inside space-y-0.5 text-neutral-300 text-[11px]">
                  <li>100% On-premise air-gapped containerized deployment.</li>
                  <li>Local embedding models (no third-party cloud API dependencies).</li>
                  <li>DGMS & OISD auditable decision and acknowledgement trails.</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#1e273b]">
              <button
                onClick={() => setShowErtmacBridgeModal(false)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold font-mono transition-colors"
              >
                Close Integration View
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
