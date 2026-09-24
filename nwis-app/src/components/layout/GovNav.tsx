'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MapPin,
  SlidersVertical,
  AlertTriangle,
  Database,
  FileText,
  BarChart3,
  Settings,
  Activity,
  Compass,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Search,
  HardHat,
  LogOut
} from 'lucide-react';
import { useAppStore } from '../../store/app-store';
import { UserRole } from '@/lib/data/types';

export const GovNav: React.FC = () => {
  const pathname = usePathname();
  const {
    currentRole,
    setRole,
    alerts,
    isSidebarCollapsed,
    toggleSidebar,
    toggleCopilot
  } = useAppStore();

  const openAlertsCount = alerts.filter((a) => a.status === 'new').length || 3;

  // Keyboard shortcut: Ctrl+B or Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  // Primary navigation strictly matching Oil India NWIS specification
  const primaryNavItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      description: 'Fleet & basin register'
    },
    {
      name: 'Nearby Wells',
      href: '/operations',
      icon: MapPin,
      description: 'Active well & offset proximity',
      activeMatch: ['/operations', '/wells']
    },
    {
      name: 'Well Correlation',
      href: '/analogs',
      icon: SlidersVertical,
      description: 'Stratigraphic formation alignment'
    },
    {
      name: 'Risk Alerts',
      href: '/alerts',
      icon: AlertTriangle,
      description: 'Active lookahead hazard warnings',
      badgeCount: openAlertsCount
    },
    {
      name: 'Well Knowledge Base',
      href: '/decay-index',
      icon: Database,
      description: 'Memory decay & institutional knowledge'
    },
    {
      name: 'Reports & Documents',
      href: '/admin/sources',
      icon: FileText,
      description: 'WCR & DDR archival repository'
    },
    {
      name: 'Analytics',
      href: '/prediction-gap',
      icon: BarChart3,
      description: 'Geological prediction gap index'
    },
    {
      name: 'Settings',
      href: '/login',
      icon: Settings,
      description: 'Console persona & system configuration'
    }
  ];

  // Secondary Engineering Modules for deep verification
  const engineeringModules = [
    {
      name: 'Geospatial Map',
      href: '/map',
      icon: Compass,
      description: 'Custom coordinates & offset radius'
    },
    {
      name: 'Well Replay Validator',
      href: '/replay',
      icon: Activity,
      description: 'Deterministic lookahead simulator'
    },
    {
      name: 'Ingestion Pipeline',
      href: '/admin/ingestion',
      icon: Cpu,
      description: 'Scanned OCR to structured schema'
    }
  ];

  const isItemActive = (item: typeof primaryNavItems[0]) => {
    if (item.activeMatch) {
      return item.activeMatch.some(p => pathname.startsWith(p));
    }
    return item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
  };

  return (
    <aside
      className={`border-r border-[#222222] bg-[#34435A] text-[#D9F2EE] shrink-0 flex flex-col justify-between transition-all duration-300 ease-in-out hidden md:flex select-none h-full overflow-y-auto ${
        isSidebarCollapsed ? 'w-[72px] p-2' : 'w-64 p-3'
      }`}
      aria-label="Operational Navigation"
    >
      <div className="space-y-3">

        {/* ─── Top Brand Header with Oil India Logo ─── */}
        <div className="flex items-center justify-between px-1 pt-1 pb-2 border-b border-[#222222]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-white flex items-center justify-center p-0.5 border border-[#222222] shadow-2xs group-hover:border-[#3FC3B6] transition-colors shrink-0">
              <img 
                src="/oil-india-logo.png" 
                alt="Oil India Limited Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white font-sans">
                    NWIS
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-[#26A69A] text-white border border-[#3FC3B6]">
                    eRTMAC
                  </span>
                </div>
                <span className="text-[11px] text-[#D9F2EE] tracking-tight font-medium truncate leading-tight">
                  Nearby Wells Intelligence System
                </span>
                <span className="text-[9px] text-[#D9F2EE]/70 italic leading-tight truncate">
                  For Safer Wells. Smarter Decisions.
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleSidebar}
            title={isSidebarCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar (Ctrl+B)"}
            className="p-1 text-[#D9F2EE] hover:text-white hover:bg-[#26A69A]/30 transition-colors"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" strokeWidth={1.5} /> : <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />}
          </button>
        </div>

        {/* ─── Clean Search Command Bar (No generic AI sparkles) ─── */}
        {isSidebarCollapsed ? (
          <button
            type="button"
            onClick={toggleCopilot}
            title="Search Intelligence (⌘K)"
            className="flex items-center justify-center w-11 h-11 mx-auto bg-[#222222]/40 border border-[#222222] text-[#D9F2EE] hover:text-white hover:border-[#3FC3B6] transition-all cursor-pointer shadow-2xs"
          >
            <Search className="w-4 h-4 text-[#3FC3B6]" strokeWidth={1.5} />
          </button>
        ) : (
          <button
            type="button"
            onClick={toggleCopilot}
            className="flex items-center justify-between w-full px-3 py-2 bg-[#222222]/40 border border-[#222222] hover:border-[#3FC3B6] text-xs font-sans font-medium text-[#D9F2EE] hover:text-white transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#3FC3B6] group-hover:text-white transition-colors shrink-0" strokeWidth={1.5} />
              <span className="text-xs">Search Intelligence</span>
            </div>
            <kbd className="text-[10px] px-1.5 py-0.5 bg-[#222222] text-[#D9F2EE] border border-[#34435A] font-mono">
              ⌘K
            </kbd>
          </button>
        )}

        {/* ─── Primary Navigation Menu ─── */}
        <nav aria-label="Primary Navigation">
          <ul className="space-y-0.5">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item);

              if (isSidebarCollapsed) {
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      title={`${item.name} · ${item.description}`}
                      className={`flex items-center justify-center w-11 h-11 mx-auto transition-all group ${
                        active
                          ? 'bg-[#26A69A] text-white font-bold border-l-4 border-l-[#ED1C24] border-y border-r border-[#3FC3B6] shadow-xs'
                          : 'text-[#D9F2EE] hover:text-white hover:bg-[#222222]/50 font-medium'
                      }`}
                    >
                      <Icon className={`w-[18px] h-[18px] ${active ? 'text-white' : 'text-[#D9F2EE] group-hover:text-white'}`} strokeWidth={1.5} />
                    </Link>
                  </li>
                );
              }

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 text-xs transition-all ${
                      active
                        ? 'bg-[#26A69A] text-white font-bold border-l-4 border-l-[#ED1C24] border-y border-r border-[#3FC3B6] shadow-xs'
                        : 'text-[#D9F2EE] hover:text-white hover:bg-[#222222]/50 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-white' : 'text-[#D9F2EE]'}`} strokeWidth={1.5} />
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badgeCount !== undefined && (
                      <span className="px-2 py-0.5 bg-[#ED1C24] text-white text-[10px] font-mono font-extrabold shadow-2xs">
                        {item.badgeCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ─── Secondary Engineering Modules Section ─── */}
        {!isSidebarCollapsed && (
          <div className="pt-2 border-t border-[#222222] space-y-1">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D9F2EE]/70 px-3 py-1">
              Engineering Tools
            </div>
            <ul className="space-y-0.5">
              {engineeringModules.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-1.5 text-xs transition-all ${
                        active
                          ? 'bg-[#26A69A] text-white font-bold border-l-4 border-l-[#ED1C24] border-y border-r border-[#3FC3B6]'
                          : 'text-[#D9F2EE] hover:text-white hover:bg-[#222222]/50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-[#D9F2EE]'}`} strokeWidth={1.5} />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

      </div>

      {/* ─── Bottom Area: Oil India Branding, eRTMAC Integration, Persona & Sign Out ─── */}
      <div className="pt-3 border-t border-[#222222] space-y-2">

        {!isSidebarCollapsed && (
          <>
            {/* Integrated with eRTMAC Banner */}
            <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#222222]/40 border border-[#222222] text-[10px] font-mono text-[#D9F2EE]">
              <span>Integrated with</span>
              <span className="text-white font-bold flex items-center gap-1">
                <span className="text-[#3FC3B6]">⇆</span> eRTMAC
              </span>
            </div>

            {/* Official Oil India Limited Emblem Branding */}
            <div className="flex items-center gap-2.5 px-2 py-2 bg-[#222222]/40 border border-[#222222]">
              <div className="w-8 h-8 bg-white p-0.5 flex items-center justify-center shrink-0 border border-white/20 shadow-2xs">
                <img 
                  src="/oil-india-logo.png" 
                  alt="Oil India Limited" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white tracking-tight leading-tight">
                  Oil India Limited
                </span>
                <span className="text-[9px] text-[#D9F2EE]/70 italic leading-tight">
                  Conquering Newer Horizons
                </span>
              </div>
            </div>

            {/* Dynamic Console Persona Switcher */}
            <div className="p-2 border border-[#222222] bg-[#222222]/40">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <HardHat className="w-3.5 h-3.5 text-[#3FC3B6]" strokeWidth={1.5} />
                  <span className="text-[10px] text-[#D9F2EE] uppercase font-mono font-bold">
                    Role Persona
                  </span>
                </div>
                <span className="text-[9px] font-bold text-[#3FAE68] font-mono">
                  ACTIVE
                </span>
              </div>
              <select
                value={currentRole}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-[#222222] border border-[#34435A] text-xs font-sans text-white px-2 py-1 cursor-pointer focus:outline-hidden focus:border-[#3FC3B6]"
              >
                <option value="operations_manager">Operations Manager (DD)</option>
                <option value="field_engineer">Drilling Engineer (AM)</option>
                <option value="admin">Lead Auditor (PS)</option>
              </select>
            </div>

            {/* Sign Out Action */}
            <Link
              href="/login"
              className="flex items-center justify-between px-2.5 py-1.5 text-xs font-medium text-[#D9F2EE] hover:text-[#ED1C24] hover:bg-[#ED1C24]/10 transition-all group"
              title="Sign out and return to login"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-3.5 h-3.5 text-[#D9F2EE] group-hover:text-[#ED1C24] transition-colors" strokeWidth={1.5} />
                <span>Sign Out</span>
              </div>
              <span className="text-[10px] font-mono text-[#D9F2EE]/60 group-hover:text-[#ED1C24]">Exit</span>
            </Link>

            {/* Copyright */}
            <div className="text-[9px] text-[#D9F2EE]/60 text-center font-mono pt-0.5">
              © 2026 Oil India Limited
            </div>
          </>
        )}

        {isSidebarCollapsed && (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 p-0.5 bg-white border border-[#222222] shrink-0">
              <img src="/oil-india-logo.png" alt="OIL" className="w-full h-full object-contain" />
            </div>
            <Link
              href="/login"
              title="Sign Out"
              className="p-2 text-[#D9F2EE] hover:text-[#ED1C24] hover:bg-[#ED1C24]/10 transition-colors"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        )}

      </div>
    </aside>
  );
};
