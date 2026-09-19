'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Search, 
  Bell, 
  ChevronDown,
  Layers,
  Radio,
  LogOut
} from 'lucide-react';
import { useAppStore } from '../../store/app-store';
import { UserRole } from '@/lib/data/types';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export const GovHeader: React.FC = () => {
  const { currentRole, setRole, activeWellId, setActiveWellId, alerts, setCopilotOpen } = useAppStore();
  
  const unreadAlerts = alerts.filter((a) => a.status === 'new').length;

  return (
    <header className="h-16 border-b border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#11141a] px-4 md:px-6 flex items-center justify-between gap-4 shrink-0 transition-colors z-30">
      
      {/* Left: Clean Search Bar with ⌘ + K that launches AI Copilot */}
      <div className="flex-1 max-w-md">
        <div 
          onClick={() => setCopilotOpen(true)}
          className="flex items-center justify-between px-3 py-2 text-xs text-neutral-400 dark:text-neutral-500 bg-neutral-50/90 dark:bg-neutral-900/90 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-800 rounded-xl transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-600 transition-colors shrink-0" />
            <span className="text-neutral-600 dark:text-neutral-400 font-normal truncate">
              Ask AI or search 1,690 offset well logs...
            </span>
          </div>
          <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 dark:text-neutral-500 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md shrink-0">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Right: Operational Controls, AI Ask Button & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Quick Well Selector */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/80 text-xs font-mono">
          <Layers className="w-3.5 h-3.5 text-amber-600" />
          <select
            value={activeWellId}
            onChange={(e) => setActiveWellId(e.target.value)}
            className="bg-transparent text-neutral-800 dark:text-neutral-200 font-bold focus:outline-hidden cursor-pointer text-xs"
          >
            <option value="well-glk-14" className="bg-white dark:bg-neutral-900">OIL-GLK-14 (Geleki · Active)</option>
            <option value="well-dgb-09" className="bg-white dark:bg-neutral-900">OIL-DGB-09 (Digboi · Active)</option>
            <option value="well-khr-04" className="bg-white dark:bg-neutral-900">OIL-KHR-04 (Kharsang · Standby)</option>
          </select>
        </div>

        {/* Live eRTMAC Stream Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/40 text-[11px] font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-800 dark:text-emerald-300 font-bold">WITSML Live:</span>
          <span className="text-emerald-900 dark:text-emerald-200">380ms</span>
        </div>

        {/* Notifications Bell */}
        <Link
          href="/alerts"
          title="Notifications"
          className="relative p-2 rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadAlerts > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#11141a]" />
          )}
        </Link>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Profile Chip & Logout */}
        <div className="flex items-center gap-2 pl-2 ml-1 border-l border-neutral-200/80 dark:border-neutral-800">
          <Link
            href="/login"
            title="Switch User Profile"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-amber-900 dark:text-amber-300 font-bold text-xs shrink-0 overflow-hidden shadow-2xs font-mono group-hover:border-amber-500 transition-colors">
              {currentRole === 'operations_manager' ? 'DD' : currentRole === 'field_engineer' ? 'PB' : 'MS'}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <div className="text-xs font-bold text-neutral-900 dark:text-white leading-tight group-hover:text-amber-600 transition-colors">
                {currentRole === 'operations_manager' ? 'D. Deka' : currentRole === 'field_engineer' ? 'P. Bora' : 'M. Saikia'}
              </div>
              <div className="text-[10px] text-neutral-400 dark:text-neutral-500 leading-tight">
                {currentRole === 'operations_manager' ? 'Drilling Supt' : currentRole === 'field_engineer' ? 'Rig Engineer' : 'PSU Auditor'}
              </div>
            </div>
          </Link>

          {/* Explicit Logout Button */}
          <Link
            href="/login"
            title="Sign out of Console"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ml-0.5"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>

      </div>

    </header>
  );
};
