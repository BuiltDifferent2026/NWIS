'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Bell, 
  ChevronDown,
  Layers,
  Radio,
  LogOut,
  Menu
} from 'lucide-react';
import { useAppStore } from '../../store/app-store';
import { UserRole } from '@/lib/data/types';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export const GovHeader: React.FC = () => {
  const { currentRole, setRole, activeWellId, setActiveWellId, alerts, toggleMobileSidebar } = useAppStore();
  
  const unreadAlerts = alerts.filter((a) => a.status === 'new').length || 3;

  return (
    <header className="h-16 border-b border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#1E2532] px-3 md:px-6 flex items-center justify-between gap-2 md:gap-4 shrink-0 transition-colors z-30">
      
      {/* Left: Console & Workspace Indicator */}
      <div className="flex items-center gap-2">
        {/* Mobile Hamburger Menu Toggle Button */}
        <button
          type="button"
          onClick={toggleMobileSidebar}
          title="Open Navigation Menu"
          aria-label="Open Navigation Menu"
          className="md:hidden p-1.5 text-[#252B33] dark:text-white hover:bg-[#F5F7F8] dark:hover:bg-[#2A3545] border border-[#E2E5E8] dark:border-[#364356] transition-colors cursor-pointer shrink-0 shadow-2xs"
        >
          <Menu className="w-4 h-4 text-[#252B33] dark:text-white" strokeWidth={2} />
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3FC3B6] animate-pulse shrink-0" />
          <span className="text-xs font-bold tracking-wider text-[#252B33] dark:text-white font-mono truncate">
            AntarRig DDR Console
          </span>
        </div>
      </div>

      {/* Center & Right: Active Well Status Pill + Bell + Profile */}
      <div className="flex items-center gap-3">
        
        {/* Active Well Status */}
        <Link 
          href="/operations"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#D9F2EE] dark:bg-[#3FC3B6]/15 border border-[#3FC3B6] dark:border-[#3FC3B6]/40 text-xs font-mono transition-colors hover:border-[#26A69A]"
        >
          <span className="w-2 h-2 rounded-full bg-[#3FAE68] animate-pulse" />
          <span className="font-bold text-[#26A69A] dark:text-[#3FC3B6]">
            Active Well: OIL-GLK-14 (Geleki Field)
          </span>
        </Link>

        {/* Official Oil India Badge in Header */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-[#F5F7F8] dark:bg-[#191E26] border border-[#E2E5E8] dark:border-[#364356] shadow-2xs">
          <img 
            src="/oil-india-logo.png" 
            alt="Oil India Limited" 
            className="h-6 w-auto object-contain bg-white p-0.5" 
          />
          <span className="text-[11px] font-bold text-[#252B33] dark:text-slate-200 font-sans">
            Oil India
          </span>
        </div>

        {/* Notification Bell with Red Badge */}
        <Link
          href="/alerts"
          title="Notifications"
          className="relative p-2 text-[#6B7280] dark:text-neutral-400 hover:text-[#252B33] dark:hover:text-white hover:bg-[#F5F7F8] dark:hover:bg-[#2D3747] transition-colors"
        >
          <Bell className="w-4 h-4 text-[#252B33] dark:text-slate-300" strokeWidth={1.5} />
          {unreadAlerts > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#ED1C24] text-white text-[9px] font-bold flex items-center justify-center font-mono">
              {unreadAlerts}
            </span>
          )}
        </Link>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Profile Chip: Dashboard Navy Avatar + Role */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E2E5E8] dark:border-[#364356]">
          <Link
            href="/login"
            title="Switch User Profile"
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-8 h-8 bg-[#34435A] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs font-sans tracking-tight">
              {currentRole === 'operations_manager' ? 'DD' : currentRole === 'field_engineer' ? 'AM' : 'PS'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-[#252B33] dark:text-white leading-tight">
                {currentRole === 'operations_manager' ? 'Operations Manager' : currentRole === 'field_engineer' ? 'Drilling Engineer' : 'Lead Auditor'}
              </span>
              <span className="text-[10px] text-[#6B7280] dark:text-slate-400 leading-tight">
                Oil India Limited
              </span>
            </div>
          </Link>

          {/* Logout Button */}
          <Link
            href="/login"
            title="Sign out of Console"
            className="p-1.5 text-[#6B7280] hover:text-[#ED1C24] dark:hover:text-[#ED1C24] hover:bg-[#ED1C24]/10 transition-colors ml-1"
            aria-label="Logout"
          >
            <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>
        </div>

      </div>

    </header>
  );
};
