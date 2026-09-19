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
  GitCompare, 
  TrendingDown, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '../../store/app-store';

export const GovNav: React.FC = () => {
  const pathname = usePathname();
  const { currentRole, activeWellId, alerts, isSidebarCollapsed, toggleSidebar } = useAppStore();

  const openAlertsCount = alerts.filter((a) => a.status === 'new').length;

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

  const navSections = [
    {
      title: 'Drilling Operations',
      titleHindi: 'ड्रिलिंग परिचालन',
      items: [
        {
          name: 'Operations Overview',
          href: '/',
          icon: LayoutDashboard,
          isExact: true
        },
        {
          name: 'Live Operations Cockpit',
          href: '/operations',
          icon: Layers,
          badgeText: 'OIL-GLK-14'
        },
        {
          name: 'Historical Replay Simulator',
          href: '/replay',
          icon: Activity
        },
        {
          name: 'Hazard Advisories Inbox',
          href: '/alerts',
          icon: Bell,
          badgeCount: openAlertsCount
        },
        {
          name: 'Offset Well Correlation',
          href: '/analogs',
          icon: GitCompare
        },
        {
          name: 'Basin Fleet Register',
          href: '/dashboard',
          icon: LayoutDashboard
        }
      ]
    },
    {
      title: 'Institutional Memory',
      titleHindi: 'संस्थागत अभिलेख व ज्ञान',
      items: [
        {
          name: 'Memory Decay Index',
          href: '/decay-index',
          icon: TrendingDown
        },
        {
          name: 'Archival Ingestion Pipeline',
          href: '/admin/ingestion',
          icon: Database
        },
        {
          name: 'Source Document Register',
          href: '/admin/sources',
          icon: FileText
        }
      ]
    }
  ];

  const roleMeta = {
    field_engineer: {
      name: 'P. Bora',
      roleTitle: 'Lead Rig Engineer',
      initials: 'PB',
      rig: 'OIL-E2000-IV (Geleki)'
    },
    operations_manager: {
      name: 'D. Deka',
      roleTitle: 'Drilling Superintendent',
      initials: 'DD',
      rig: 'Basin Operations Central'
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
      className={`border-r border-[#d0d7de] dark:border-[#1e3a5f] bg-[#f8f9fa] dark:bg-[#071d36] shrink-0 flex flex-col justify-between transition-all duration-150 ease-in-out hidden md:flex select-none ${
        isSidebarCollapsed ? 'w-[56px] p-1.5' : 'w-60 p-3'
      }`}
      aria-label="Operational Navigation"
    >
      <div className="space-y-4">

        {/* ─── Active Target Well Summary Box ─── */}
        {!isSidebarCollapsed ? (
          <div className="p-2.5 bg-white dark:bg-[#0c2847] border border-[#d0d7de] dark:border-[#1e3a5f] rounded-xs space-y-1 shadow-2xs">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#57606a] dark:text-[#94a3b8] uppercase font-bold">Target Rig Stream</span>
              <span className="text-[#0e6406] dark:text-[#34d399] font-bold">● ACTIVE</span>
            </div>
            <div className="flex items-center justify-between font-mono">
              <Link href="/operations" className="font-bold text-xs text-[#0b3c6d] dark:text-[#93c5fd] hover:underline">
                OIL-GLK-14
              </Link>
              <span className="text-xs text-[#b45309] dark:text-[#fbbf24] font-bold">2,165.4m</span>
            </div>
            <div className="text-[10px] text-[#57606a] dark:text-[#94a3b8] font-sans flex justify-between">
              <span>Upper Tipam</span>
              <span className="text-[#b45309] font-bold">74.6m to Hazard</span>
            </div>
          </div>
        ) : (
          <div className="p-1 bg-white dark:bg-[#0c2847] border border-[#d0d7de] dark:border-[#1e3a5f] rounded-xs text-center font-mono text-[9px] font-bold">
            <Link href="/operations" title="OIL-GLK-14 @ 2,165.4m" className="text-[#0b3c6d] dark:text-[#93c5fd]">
              GLK-14
            </Link>
          </div>
        )}

        {/* ─── Navigation Link Sections ─── */}
        <div className="space-y-3">
          {navSections.map((section, idx) => (
            <div key={section.title} className="space-y-1">
              {!isSidebarCollapsed ? (
                <div className="px-2 py-1">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0b3c6d] dark:text-[#93c5fd]">
                    {section.title}
                  </div>
                  <div className="text-[9px] text-[#57606a] dark:text-[#94a3b8] font-sans">
                    {section.titleHindi}
                  </div>
                </div>
              ) : (
                idx > 0 && <div className="border-t border-[#d0d7de] dark:border-[#1e3a5f] my-1.5 mx-1" />
              )}

              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.isExact ? pathname === item.href : (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href));

                  if (isSidebarCollapsed) {
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          title={item.name}
                          className={`relative flex items-center justify-center w-10 h-10 mx-auto rounded-xs transition-colors ${
                            isActive
                              ? 'bg-white dark:bg-[#0c2847] text-[#0b3c6d] dark:text-[#93c5fd] border-l-3 border-[#ff9933] shadow-2xs font-bold'
                              : 'text-[#57606a] dark:text-[#94a3b8] hover:text-[#1f2328] dark:hover:text-[#f0f2f5] hover:bg-white dark:hover:bg-[#0c2847]'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          {item.badgeCount !== undefined && item.badgeCount > 0 && (
                            <span className="absolute top-1 right-1 px-1 rounded-xs bg-[#c92a2a] text-white text-[9px] font-mono font-bold leading-tight">
                              {item.badgeCount}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  }

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-xs text-xs transition-colors ${
                          isActive
                            ? 'bg-white dark:bg-[#0c2847] text-[#0b3c6d] dark:text-[#93c5fd] font-bold border-l-3 border-[#ff9933] shadow-2xs'
                            : 'text-[#57606a] dark:text-[#94a3b8] hover:text-[#1f2328] dark:hover:text-[#f0f2f5] hover:bg-white dark:hover:bg-[#0c2847] font-normal border-l-3 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#0b3c6d] dark:text-[#ff9933]' : 'text-[#8c959f] dark:text-[#94a3b8]'}`} />
                          <span className="truncate">{item.name}</span>
                        </div>

                        {item.badgeCount !== undefined && item.badgeCount > 0 && (
                          <span className="px-1.5 py-0.2 bg-[#c92a2a] text-white text-[10px] font-mono font-bold rounded-xs">
                            {item.badgeCount}
                          </span>
                        )}

                        {item.badgeText && (
                          <span className="text-[10px] font-mono text-[#57606a] dark:text-[#94a3b8]">
                            {item.badgeText}
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

      {/* ─── Bottom Status & Sidebar Collapse ─── */}
      <div className="pt-2 border-t border-[#d1d5db] dark:border-[#232c3f] space-y-2">
        {!isSidebarCollapsed ? (
          <>
            <div className="px-2 py-1.5 bg-[#f8fafc] dark:bg-[#141b2a] border border-[#d1d5db] dark:border-[#232c3f] rounded-xs text-[11px] font-sans">
              <div className="font-bold text-[#0b0c0c] dark:text-[#f8fafc]">
                {roleMeta.name}
              </div>
              <div className="text-[#6b7280] dark:text-[#94a3b8]">
                {roleMeta.roleTitle} · {roleMeta.rig}
              </div>
            </div>

            <button
              type="button"
              onClick={toggleSidebar}
              className="w-full flex items-center justify-between px-2.5 py-1.5 border border-[#d1d5db] dark:border-[#232c3f] bg-white dark:bg-[#141b2a] hover:bg-[#f3f4f6] dark:hover:bg-[#192336] text-[#4b5563] dark:text-[#94a3b8] text-xs font-mono rounded-xs transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Collapse</span>
              </div>
              <span className="text-[10px] text-[#6b7280] dark:text-[#94a3b8]">Ctrl+B</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={toggleSidebar}
            className="w-full p-2 border border-[#d1d5db] dark:border-[#232c3f] bg-white dark:bg-[#141b2a] hover:bg-[#f3f4f6] dark:hover:bg-[#192336] text-[#4b5563] dark:text-[#94a3b8] rounded-xs flex items-center justify-center transition-colors cursor-pointer"
            title="Expand Sidebar (Ctrl+B)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </aside>
  );
};
