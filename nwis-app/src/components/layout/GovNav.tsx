'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Layers, 
  Activity, 
  Bell, 
  Database, 
  FileText, 
  LogOut, 
  GitCompare, 
  TrendingDown, 
  Scale, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Radio
} from 'lucide-react';
import { useAppStore } from '../../store/app-store';

export const GovNav: React.FC = () => {
  const pathname = usePathname();
  const { currentRole, setRole, activeWellId, alerts, isSidebarCollapsed, toggleSidebar } = useAppStore();

  const openAlertsCount = alerts.filter((a) => a.status === 'new').length;

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

  const getNavSections = () => {
    switch (currentRole) {
      case 'field_engineer':
        return [
          {
            title: 'Rig Floor Operations',
            items: [
              {
                name: 'Active Well (OIL-GLK-14)',
                shortName: 'Operations',
                href: '/operations',
                icon: Layers,
                description: 'eRTMAC live-state & 75m alert',
                badge: 'LIVE'
              },
              {
                name: 'Historical Replay',
                shortName: 'Replay',
                href: '/replay',
                icon: Activity,
                description: 'Pre-spud lookahead benchmark',
                badge: 'DEMO'
              },
              {
                name: 'Hazard Advisories',
                shortName: 'Advisories',
                href: '/alerts',
                icon: Bell,
                description: 'Corridor hazard queue',
                badgeCount: openAlertsCount
              },
              {
                name: 'Offset Intelligence',
                shortName: 'Analogs',
                href: '/analogs',
                icon: GitCompare,
                description: 'Distance ≠ Similarity engine'
              }
            ]
          },
          {
            title: 'Institutional Memory',
            items: [
              {
                name: 'Memory Decay Index',
                shortName: 'Decay Index',
                href: '/decay-index',
                icon: TrendingDown,
                description: 'Field knowledge risk ranking'
              },
              {
                name: 'Fleet Register',
                shortName: 'Fleet',
                href: '/dashboard',
                icon: LayoutDashboard,
                description: 'Basin wide well list'
              }
            ]
          }
        ];

      case 'admin':
        return [
          {
            title: 'Governance & Auditing',
            items: [
              {
                name: 'Hybrid Ingestion Pipeline',
                shortName: 'Ingestion',
                href: '/admin/ingestion',
                icon: Database,
                description: 'OCR & schema routing audit',
                badge: 'OCR-HIGH'
              },
              {
                name: 'Source Document Archive',
                shortName: 'Sources',
                href: '/admin/sources',
                icon: FileText,
                description: '130+ yr WCR & DDR register'
              },
              {
                name: 'Memory Decay Index',
                shortName: 'Decay Index',
                href: '/decay-index',
                icon: TrendingDown,
                description: 'Prioritized digitization backlog',
                badge: '88 RISK'
              }
            ]
          },
          {
            title: 'Operations & Verification',
            items: [
              {
                name: 'Active Well Workspace',
                shortName: 'Cockpit',
                href: '/operations',
                icon: Layers,
                description: 'Active drilling intelligence'
              },
              {
                name: 'Well Replay Validator',
                shortName: 'Replay',
                href: '/replay',
                icon: Activity,
                description: 'Incident verification suite'
              },
              {
                name: 'Fleet Overview',
                shortName: 'Fleet',
                href: '/dashboard',
                icon: LayoutDashboard,
                description: 'Assam basin monitoring'
              }
            ]
          }
        ];

      case 'operations_manager':
      default:
        return [
          {
            title: 'Active Drilling Intelligence',
            items: [
              {
                name: 'Active Well (OIL-GLK-14)',
                shortName: 'Live Well',
                href: '/operations',
                icon: Layers,
                description: 'eRTMAC live-state & lookahead',
                badge: 'LIVE'
              },
              {
                name: 'Historical Well Replay',
                shortName: 'Replay',
                href: '/replay',
                icon: Activity,
                description: 'Falsifiable lookahead simulator',
                badge: 'DEMO'
              },
              {
                name: 'Offset Intelligence',
                shortName: 'Analogs',
                href: '/analogs',
                icon: GitCompare,
                description: 'Cross-formation correlation'
              },
              {
                name: 'Hazard Advisories',
                shortName: 'Advisories',
                href: '/alerts',
                icon: Bell,
                description: 'Active lookahead notices',
                badgeCount: openAlertsCount
              }
            ]
          },
          {
            title: 'Institutional Memory & Governance',
            items: [
              {
                name: 'Memory Decay Index',
                shortName: 'Decay Index',
                href: '/decay-index',
                icon: TrendingDown,
                description: 'Knowledge loss risk by field',
                badge: 'DIGBOI 88%'
              },
              {
                name: 'Ingestion Pipeline Status',
                shortName: 'Ingestion',
                href: '/admin/ingestion',
                icon: Database,
                description: 'Scanned OCR to structured schema'
              },
              {
                name: 'Source Document Register',
                shortName: 'Archives',
                href: '/admin/sources',
                icon: FileText,
                description: 'WCR & DDR archival repository'
              },
              {
                name: 'Fleet Well Register',
                shortName: 'Fleet',
                href: '/dashboard',
                icon: LayoutDashboard,
                description: 'Assam basin wells overview'
              }
            ]
          }
        ];
    }
  };

  const navSections = getNavSections();

  const roleMeta = {
    field_engineer: {
      name: 'P. Bora',
      roleTitle: 'Lead Rig Engineer',
      initials: 'PB',
      rig: 'OIL-E2000-IV'
    },
    operations_manager: {
      name: 'D. Deka',
      roleTitle: 'Drilling Superintendent',
      initials: 'DD',
      rig: 'Basin Ops Central'
    },
    admin: {
      name: 'M. Saikia',
      roleTitle: 'PSU Data Auditor',
      initials: 'MS',
      rig: 'DGMS / OISD Compliance'
    }
  }[currentRole];

  return (
    <aside 
      className={`border-r border-neutral-200 dark:border-[#1e2536] bg-white dark:bg-[#0c0f17] shrink-0 flex flex-col justify-between transition-all duration-300 ease-in-out hidden md:flex select-none ${
        isSidebarCollapsed ? 'w-[72px] p-2' : 'w-64 p-3.5'
      }`}
      aria-label="Operational Navigation"
    >
      <div className="space-y-4">

        {/* ─── Active Well Indicator Card ─── */}
        {isSidebarCollapsed ? (
          <Link
            href="/operations"
            title="eRTMAC Target: OIL-GLK-14 @ 2,165.4m (Geleki Field · 74.6m to Hazard)"
            className="p-2 rounded-xl bg-neutral-50 dark:bg-[#121723] border border-neutral-200/80 dark:border-[#1e2638] flex flex-col items-center justify-center gap-1 group hover:border-amber-500/50 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[9px] font-extrabold text-neutral-900 dark:text-white text-center leading-tight">
              GLK-14
            </span>
            <span className="font-mono text-[8px] font-bold text-amber-600 dark:text-amber-400">
              2,165m
            </span>
          </Link>
        ) : (
          <Link
            href="/operations"
            className="block p-3 rounded-xl bg-neutral-50 dark:bg-[#121723] border border-neutral-200/80 dark:border-[#1e2638] space-y-1.5 hover:border-amber-500/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 dark:text-neutral-400">
                eRTMAC Target Well
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[9px] font-mono font-bold border border-emerald-500/30">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-neutral-950 dark:text-white font-mono group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                OIL-GLK-14
              </span>
              <span className="text-xs font-mono font-extrabold text-amber-600 dark:text-amber-400">
                2,165.4m
              </span>
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between font-mono">
              <span>Geleki Field · Upper Tipam</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">74.6m Ahead</span>
            </div>
          </Link>
        )}

        {/* ─── Navigation Sections ─── */}
        <div className="space-y-4">
          {navSections.map((section, idx) => (
            <div key={section.title} className="space-y-1">
              {!isSidebarCollapsed ? (
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-2.5 py-1">
                  {section.title}
                </div>
              ) : (
                idx > 0 && <div className="border-t border-neutral-200 dark:border-[#1a2333] my-2 mx-1" />
              )}

              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

                  if (isSidebarCollapsed) {
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          title={`${item.name}${item.description ? ` · ${item.description}` : ''}`}
                          className={`relative flex items-center justify-center w-11 h-11 mx-auto rounded-xl transition-all group ${
                            isActive
                              ? 'bg-amber-500/15 dark:bg-[#1a2233] text-amber-700 dark:text-amber-400 border border-amber-500/40 shadow-2xs font-bold'
                              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#141a27]'
                          }`}
                        >
                          <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                            isActive ? 'text-amber-600 dark:text-amber-400' : 'text-neutral-500 dark:text-neutral-400'
                          }`} />

                          {/* Left active marker bar */}
                          {isActive && (
                            <span className="absolute -left-2 top-2.5 bottom-2.5 w-1 bg-amber-500 rounded-r-full" />
                          )}

                          {/* Badge Count Pip */}
                          {item.badgeCount !== undefined && item.badgeCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-xs">
                              {item.badgeCount}
                            </span>
                          )}

                          {/* Live Indicator Pip */}
                          {item.badge === 'LIVE' && (
                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-[#0c0f17] animate-pulse" />
                          )}
                        </Link>
                      </li>
                    );
                  }

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all ${
                          isActive
                            ? 'bg-amber-500/10 dark:bg-[#1a2233] text-neutral-950 dark:text-white font-bold border border-amber-500/30 dark:border-amber-500/40 shadow-2xs'
                            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#141a27] font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-neutral-400 dark:text-neutral-400'}`} />
                          <span className="truncate leading-tight font-medium">{item.name}</span>
                        </div>

                        {/* Badges */}
                        {item.badgeCount !== undefined && item.badgeCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-mono font-bold shrink-0">
                            {item.badgeCount}
                          </span>
                        )}

                        {item.badge && (
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold shrink-0 ${
                            item.badge === 'LIVE'
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                          }`}>
                            {item.badge}
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

      {/* ─── Bottom User Identity & Collapse Action ─── */}
      <div className="pt-3 border-t border-neutral-200 dark:border-[#1e2536] space-y-2">
        {isSidebarCollapsed ? (
          <div className="space-y-2 flex flex-col items-center">
            <div 
              className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-neutral-50 dark:bg-[#121723] border border-neutral-200/80 dark:border-[#1e2638] relative group cursor-pointer"
              title={`${roleMeta.name} (${roleMeta.roleTitle}) · eRTMAC v4.1 Connected (Read-Only)`}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-amber-700 text-white font-bold font-mono text-xs flex items-center justify-center shadow-xs">
                {roleMeta.initials}
              </div>
              <span className="absolute bottom-1 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0c0f17]" />
            </div>

            {/* Bottom Expand Toggle Button */}
            <button
              type="button"
              onClick={toggleSidebar}
              className="w-10 h-10 rounded-xl border border-neutral-200 dark:border-[#1e2638] bg-neutral-50 dark:bg-[#121723] hover:bg-neutral-100 dark:hover:bg-[#182030] text-neutral-600 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 flex items-center justify-center transition-colors cursor-pointer"
              title="Expand Sidebar (Ctrl+B)"
              aria-label="Expand Sidebar"
            >
              <ChevronRight className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 dark:bg-[#121723] border border-neutral-200/80 dark:border-[#1e2638]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-600 to-amber-700 text-white font-bold font-mono text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {roleMeta.initials}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-neutral-950 dark:text-white text-xs truncate font-mono">
                    {roleMeta.name}
                  </div>
                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate font-sans">
                    {roleMeta.roleTitle}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400 font-mono px-1">
              <span>eRTMAC v4.1 Bridge</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Read-Only</span>
            </div>

            {/* Bottom Collapse Toggle Button */}
            <button
              type="button"
              onClick={toggleSidebar}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-neutral-200 dark:border-[#1e2638] bg-neutral-50 dark:bg-[#121723] hover:bg-neutral-100 dark:hover:bg-[#182030] text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white text-xs font-mono font-bold transition-all cursor-pointer group shadow-2xs"
              title="Collapse Sidebar (Ctrl+B)"
              aria-label="Collapse Sidebar"
            >
              <div className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
                <span>Collapse Sidebar</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-200/70 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-[10px] font-mono">
                Ctrl+B
              </kbd>
            </button>
          </>
        )}
      </div>

    </aside>
  );
};
