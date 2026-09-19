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
  Sparkles,
  HardHat,
  Radio
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

  const openAlertsCount = alerts.filter((a) => a.status === 'new').length || 1;

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

  // Dynamic Role-Based Access: Navigation sections tailored by user role
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

  return (
    <aside 
      className={`border-r border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#11141a] shrink-0 flex flex-col justify-between transition-all duration-300 ease-in-out hidden md:flex select-none h-full overflow-y-auto ${
        isSidebarCollapsed ? 'w-[72px] p-2' : 'w-64 p-3.5'
      }`}
      aria-label="Operational Navigation"
    >
      <div className="space-y-3.5">

        {/* ─── Top Brand Header with 3-Bar Strata Logo ─── */}
        <div className="flex items-center justify-between px-1 pt-1 pb-1">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-neutral-950 dark:bg-neutral-900 flex items-center justify-center border border-neutral-800 shadow-xs group-hover:border-amber-600 transition-colors shrink-0">
              <div className="relative flex flex-col gap-0.5 items-center">
                <span className="w-3.5 h-0.5 rounded-xs bg-amber-500" />
                <span className="w-3.5 h-0.5 rounded-xs bg-amber-600" />
                <span className="w-3.5 h-0.5 rounded-xs bg-amber-700" />
              </div>
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-neutral-950 dark:text-white font-mono">
                    NWIS
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    eRTMAC
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 tracking-wide font-medium truncate">
                  Oil India Limited
                </span>
              </div>
            )}
          </Link>
          
          <button 
            type="button" 
            onClick={toggleSidebar}
            title={isSidebarCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar (Ctrl+B)"}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* ─── Prominent AI Copilot Button ─── */}
        {isSidebarCollapsed ? (
          <button
            type="button"
            onClick={toggleCopilot}
            title="Ask NWIS Copilot (⌘K / Super + K)"
            className="flex items-center justify-center w-11 h-11 mx-auto rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 hover:border-amber-500 transition-all cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={toggleCopilot}
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
        )}

        {/* ─── Active Target Well Indicator Card ─── */}
        {!isSidebarCollapsed ? (
          <Link
            href="/operations"
            className="block p-2.5 rounded-xl bg-neutral-50/90 dark:bg-[#0c0f16] border border-neutral-200/80 dark:border-neutral-800 space-y-1 hover:border-amber-500/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 dark:text-neutral-400">
                eRTMAC Target Well
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[9px] font-mono font-bold border border-emerald-500/30">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                STREAM LIVE
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-neutral-950 dark:text-white font-mono group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                OIL-GLK-14
              </span>
              <span className="text-xs font-mono font-extrabold text-amber-600 dark:text-amber-400">
                2,165.4m
              </span>
            </div>
          </Link>
        ) : (
          <Link
            href="/operations"
            title="eRTMAC Target: OIL-GLK-14 (2,165.4m)"
            className="p-1.5 rounded-xl bg-neutral-50 dark:bg-[#0c0f16] border border-neutral-200/80 dark:border-neutral-800 flex flex-col items-center justify-center gap-0.5 hover:border-amber-500/50 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[9px] font-extrabold text-neutral-900 dark:text-white">GLK-14</span>
          </Link>
        )}

        {/* ─── Dynamic Role-Based Navigation Sections ─── */}
        <div className="space-y-3 pt-1">
          {navSections.map((section, idx) => (
            <div key={section.title} className="space-y-1">
              {!isSidebarCollapsed ? (
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-2.5 py-0.5">
                  {section.title}
                </div>
              ) : (
                idx > 0 && <div className="border-t border-neutral-200 dark:border-neutral-800 my-2 mx-1" />
              )}

              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

                  if (isSidebarCollapsed) {
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          title={`${item.name}${item.description ? ` · ${item.description}` : ''}`}
                          className={`flex items-center justify-center w-11 h-11 mx-auto rounded-xl transition-all group ${
                            isActive
                              ? 'bg-amber-50/80 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 font-bold border border-amber-200/70 dark:border-amber-800/60 shadow-2xs'
                              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100/80 dark:hover:bg-neutral-800/60 font-medium'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-amber-700 dark:text-amber-400' : 'text-neutral-400 dark:text-neutral-500'}`} />
                        </Link>
                      </li>
                    );
                  }

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                          isActive
                            ? 'bg-amber-50/80 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 font-bold border border-amber-200/70 dark:border-amber-800/60 shadow-2xs'
                            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100/80 dark:hover:bg-neutral-800/60 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-700 dark:text-amber-400' : 'text-neutral-400 dark:text-neutral-500'}`} />
                          <span className="truncate">{item.name}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-1">
                          {item.badgeCount !== undefined && (
                            <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-mono font-bold">
                              {item.badgeCount}
                            </span>
                          )}

                          {item.badge && (
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                              item.badge === 'LIVE'
                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

      </div>

      {/* ─── Bottom Area: Dynamic Evaluator Role Selector + Sign Out ─── */}
      <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800 space-y-2">
        
        {!isSidebarCollapsed && (
          <>
            {/* Dynamic Role Switcher Box */}
            <div className="p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/90 dark:bg-[#0c0f16]">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                    <HardHat className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase font-mono font-bold">
                    Console Persona
                  </span>
                </div>
                <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                  ACTIVE
                </span>
              </div>
              <select
                value={currentRole}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-900 dark:text-white rounded-lg px-2 py-1.5 cursor-pointer focus:outline-hidden"
              >
                <option value="operations_manager">Operations Manager</option>
                <option value="field_engineer">Lead Rig Engineer</option>
                <option value="admin">PSU Auditor</option>
              </select>
            </div>

            {/* Active Rig Quick Jump */}
            <Link
              href="/operations"
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
          </>
        )}

        {isSidebarCollapsed && (
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/login"
              title="Sign Out"
              className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </aside>
  );
};
