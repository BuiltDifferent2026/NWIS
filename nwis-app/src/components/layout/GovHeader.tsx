'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  ShieldCheck, 
  HardHat, 
  Bell,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '../../store/app-store';
import { INITIAL_LIVE_TELEMETRY } from '@/data/live-state';
import { UserRole } from '@/lib/data/types';
import { AskNwisDrawer } from '@/components/common/AskNwisDrawer';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export const GovHeader: React.FC = () => {
  const { currentRole, setRole, activeWellId, setActiveWellId, alerts } = useAppStore();
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  
  // Unread high-priority notifications only
  const unreadAlerts = alerts.filter((a) => a.status === 'new').length;

  return (
    <>
      <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#11141a] sticky top-0 z-40 transition-colors">
        
        {/* ─── Clean Telemetry Ticker Ribbon ─── */}
        <div className="bg-neutral-950 text-neutral-300 px-4 py-1.5 text-[11px] font-mono border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-400 border border-emerald-800/80 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              WITSML 380ms
            </span>
            <span className="text-neutral-600 hidden sm:inline">•</span>
            <span className="text-neutral-300 font-medium hidden sm:inline">
              OIL Rig Live Stream
            </span>
          </div>

          {/* Clean Telemetry Readouts (No visual clutter, balanced spacing) */}
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500">DEPTH</span>
              <strong className="text-white font-bold">{INITIAL_LIVE_TELEMETRY.depthMD}m</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500">ROP</span>
              <strong className="text-amber-400 font-bold">{INITIAL_LIVE_TELEMETRY.rop} m/h</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500">TORQUE</span>
              <strong className="text-white font-bold">{INITIAL_LIVE_TELEMETRY.torque} kft-lb</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500">MUD WT</span>
              <strong className="text-emerald-400 font-bold">{INITIAL_LIVE_TELEMETRY.mudWeightIn} ppg</strong>
            </div>
          </div>

          {/* OIL Sovereignty */}
          <div className="hidden lg:flex items-center gap-1.5 text-neutral-400 text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Oil India Limited • eRTMAC v4.1</span>
          </div>
        </div>

        {/* ─── Main Action Bar: Search, Rig, Role & Notifications ─── */}
        <div className="px-4 py-2.5 flex items-center justify-between gap-4">
          
          {/* Left: Clean Search Trigger (Opens Ask NWIS) */}
          <button
            type="button"
            onClick={() => setIsCopilotOpen(true)}
            className="flex-1 max-w-md flex items-center justify-between px-3.5 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/90 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-800 rounded-xl transition-all text-left shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-600 transition-colors" />
              <span className="text-neutral-600 dark:text-neutral-300 group-hover:text-neutral-950 dark:group-hover:text-white">
                Ask NWIS Copilot or search archives...
              </span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 dark:text-neutral-400 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md">
              ⌘K
            </kbd>
          </button>

          {/* Right: Uncluttered Control Group */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Rig Selector */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono">
              <span className="text-neutral-400 text-[11px]">Rig:</span>
              <select
                value={activeWellId}
                onChange={(e) => setActiveWellId(e.target.value)}
                className="border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-600 rounded-lg px-2.5 py-1 text-xs font-bold text-neutral-900 dark:text-neutral-100 cursor-pointer focus:outline-hidden"
              >
                <option value="well-glk-14">Geleki-14 (Active)</option>
                <option value="well-dgb-09">Digboi-09 (Active)</option>
                <option value="well-khr-04">Kharsang-04 (Standby)</option>
                <option value="well-pgb-01">Pengri-01 (Drilling)</option>
              </select>
            </div>

            {/* Role Switcher Pill & Dropdown */}
            <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-2.5 py-1">
              <HardHat className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[9px] font-mono uppercase text-neutral-400 leading-none">Role</span>
                <select
                  value={currentRole}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="bg-transparent text-xs font-bold text-neutral-900 dark:text-neutral-100 cursor-pointer focus:outline-hidden font-sans py-0.5"
                  title="Switch User Role View"
                >
                  <option value="operations_manager">Operations Manager</option>
                  <option value="field_engineer">Field Engineer</option>
                  <option value="admin">PSU Auditor</option>
                </select>
              </div>
            </div>

            {/* Theme Toggle (Daylight / Dark Control Room) */}
            <ThemeToggle />

            {/* Notification Bell (Restrained & Purposeful) */}
            <Link
              href="/alerts"
              title={unreadAlerts > 0 ? `${unreadAlerts} active advisories` : 'No unread advisories'}
              className="relative p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-neutral-200/60 dark:border-neutral-700 bg-white dark:bg-neutral-900"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-mono font-bold text-white ring-2 ring-white dark:ring-neutral-900">
                  {unreadAlerts}
                </span>
              )}
            </Link>

            {/* Quick Copilot Trigger Button */}
            <button
              type="button"
              onClick={() => setIsCopilotOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask NWIS</span>
            </button>

          </div>

        </div>

      </header>

      {/* Slide-Out AI Copilot Drawer */}
      <AskNwisDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />
    </>
  );
};
