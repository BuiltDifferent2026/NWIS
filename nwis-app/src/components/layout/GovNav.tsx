'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Layers, 
  GitCompare, 
  Bell, 
  Activity, 
  TrendingDown, 
  Database, 
  FileText, 
  Sparkles, 
  PanelLeftClose,
  HardHat,
  LogOut
} from 'lucide-react';
import { useAppStore } from '../../store/app-store';
import { UserRole } from '@/lib/data/types';

export const GovNav: React.FC = () => {
  const pathname = usePathname();
  const { currentRole, setRole, alerts, activeWellId, setCopilotOpen } = useAppStore();

  const openAlertsCount = alerts.filter((a) => a.status === 'new').length || 1;

  const navSections = [
    {
      group: 'OPERATIONS',
      items: [
        {
          name: 'Basin Fleet Overview',
          href: '/dashboard',
          icon: LayoutDashboard,
          active: pathname === '/dashboard'
        },
        {
          name: 'Rig Floor Cockpit',
          href: `/wells/${activeWellId}`,
          icon: Layers,
          active: pathname.startsWith('/wells')
        },
        {
          name: 'Lithology Analogs',
          href: '/analogs',
          icon: GitCompare,
          active: pathname === '/analogs'
        },
        {
          name: 'Hazard Advisories',
          href: '/alerts',
          icon: Bell,
          badgeCount: openAlertsCount,
          active: pathname === '/alerts'
        },
      ]
    },
    {
      group: 'MEMORY & AUDIT',
      items: [
        {
          name: 'Historical Replay',
          href: '/replay',
          icon: Activity,
          active: pathname === '/replay'
        },
        {
          name: 'Memory Decay Index',
          href: '/decay-index',
          icon: TrendingDown,
          active: pathname === '/decay-index'
        },
        {
          name: 'Ingestion Pipeline',
          href: '/admin/ingestion',
          icon: Database,
          active: pathname === '/admin/ingestion'
        },
        {
          name: 'Sources Register',
          href: '/admin/sources',
          icon: FileText,
          active: pathname === '/admin/sources'
        },
      ]
    }
  ];

  return (
    <aside className="w-64 border-r border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#11141a] p-4 shrink-0 flex flex-col justify-between transition-colors h-full overflow-y-auto">
      <div className="space-y-4">
        
        {/* Brand Header: Old Strata Logo + NWIS Name */}
        <div className="flex items-center justify-between px-1 pt-1 pb-1">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-neutral-950 dark:bg-neutral-900 flex items-center justify-center border border-neutral-800 shadow-xs group-hover:border-amber-600 transition-colors shrink-0">
              <div className="relative flex flex-col gap-0.5 items-center">
                <span className="w-4 h-1 rounded-xs bg-amber-500" />
                <span className="w-4 h-1 rounded-xs bg-amber-600" />
                <span className="w-4 h-1 rounded-xs bg-amber-700" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-neutral-950 dark:text-white">
                  NWIS
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  eRTMAC
                </span>
              </div>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 tracking-wide font-medium">
                Oil India Limited
              </span>
            </div>
          </Link>
          <button 
            type="button" 
            title="Collapse Sidebar"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* ─── PROMINENT AI COPILOT LAUNCHER IN SIDEBAR ─── */}
        <button
          type="button"
          onClick={() => setCopilotOpen(true)}
          className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-transparent border border-amber-500/30 hover:border-amber-500/60 text-xs font-mono font-bold text-amber-900 dark:text-amber-300 transition-all cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>Ask NWIS Copilot</span>
          </div>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-400 border border-amber-500/30 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Grouped Nav Items (OPERATIONS, MEMORY & AUDIT) */}
        <div className="space-y-4 pt-1">
          {navSections.map((section) => (
            <div key={section.group} className="space-y-1">
              <div className="text-[10px] font-mono font-bold tracking-wider text-neutral-400 dark:text-neutral-500 px-3 uppercase">
                {section.group}
              </div>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                          item.active
                            ? 'bg-amber-50/80 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 font-bold border border-amber-200/70 dark:border-amber-800/60 shadow-2xs'
                            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100/80 dark:hover:bg-neutral-800/60 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${item.active ? 'text-amber-700 dark:text-amber-400' : 'text-neutral-400 dark:text-neutral-500'}`} />
                          <span>{item.name}</span>
                        </div>

                        {item.badgeCount !== undefined && (
                          <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-mono font-bold">
                            {item.badgeCount}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Area: Evaluator Role Selector Card + Quick Jump */}
      <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800 space-y-2">
        
        {/* Role Switcher Box */}
        <div className="p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/90 dark:bg-neutral-900/90">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <HardHat className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase font-mono font-bold">
                Console Persona
              </span>
            </div>
          </div>
          <select
            value={currentRole}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-900 dark:text-white rounded-lg px-2 py-1 cursor-pointer focus:outline-hidden"
          >
            <option value="operations_manager">Operations Manager</option>
            <option value="field_engineer">Lead Rig Engineer</option>
            <option value="admin">PSU Auditor</option>
          </select>
        </div>

        {/* Active Rig Quick Jump */}
        <Link
          href="/wells/well-glk-14"
          className="flex items-center justify-center w-full text-xs font-bold py-2 px-3 rounded-xl bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600 hover:from-amber-800 hover:to-orange-700 text-white shadow-xs transition-all font-mono"
        >
          Rig Cockpit: GLK-14 (2,165m)
        </Link>

        {/* Sign Out Action */}
        <Link
          href="/login"
          className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-500 hover:text-rose-600 dark:text-neutral-400 dark:hover:text-rose-400 hover:bg-rose-50/80 dark:hover:bg-rose-950/30 transition-all group"
          title="Sign out and return to login"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-3.5 h-3.5 text-neutral-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors" />
            <span>Sign Out</span>
          </div>
          <span className="text-[10px] font-mono text-neutral-400 group-hover:text-rose-600 dark:group-hover:text-rose-400">Exit</span>
        </Link>

        {/* Copyright */}
        <div className="text-[10px] text-neutral-400 dark:text-neutral-500 text-center font-mono pt-0.5">
          © 2026 Oil India Limited
        </div>

      </div>
    </aside>
  );
};
