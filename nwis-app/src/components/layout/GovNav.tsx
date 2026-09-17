'use client';

import React from 'react';
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
  HardHat
} from 'lucide-react';
import { useAppStore } from '../../store/app-store';

export const GovNav: React.FC = () => {
  const pathname = usePathname();
  const { currentRole, setRole, activeWellId, alerts } = useAppStore();

  const openAlertsCount = alerts.filter((a) => a.status === 'new').length;

  // ─── Role-Tailored Navigation Menus (Uncluttered, Focused) ───
  const getNavSections = () => {
    switch (currentRole) {
      case 'field_engineer':
        return [
          {
            title: 'Rig Floor Operations',
            items: [
              {
                name: 'Rig Cockpit (GLK-14)',
                href: `/wells/${activeWellId}`,
                icon: Layers,
                description: 'Depth track & 75m window',
                badge: 'LIVE'
              },
              {
                name: '75m Lookahead Alerts',
                href: '/alerts',
                icon: Bell,
                description: 'Corridor hazard countdown',
                badgeCount: openAlertsCount
              },
              {
                name: 'Well Replay Validator',
                href: '/replay',
                icon: Activity,
                description: 'Verify lookahead before spud'
              },
              {
                name: 'Cross-Formation Analogs',
                href: '/analogs',
                icon: GitCompare,
                description: 'Offset lithology twins'
              }
            ]
          },
          {
            title: 'Institutional Knowledge',
            items: [
              {
                name: 'Memory Decay Index',
                href: '/decay-index',
                icon: TrendingDown,
                description: 'Field knowledge erosion'
              },
              {
                name: 'Fleet Overview',
                href: '/dashboard',
                icon: LayoutDashboard,
                description: 'Basin wide context'
              }
            ]
          }
        ];

      case 'admin':
        return [
          {
            title: 'Provenance & Archival Audit',
            items: [
              {
                name: 'Ingestion Pipeline',
                href: '/admin/ingestion',
                icon: Database,
                description: 'OCR & table extraction audit',
                badge: '94% OCR'
              },
              {
                name: 'Source Document Register',
                href: '/admin/sources',
                icon: FileText,
                description: 'WCR / DDR paper pedigree'
              },
              {
                name: 'Memory Decay Index',
                href: '/decay-index',
                icon: TrendingDown,
                description: 'Digitization priority ranking',
                badge: '88 RISK'
              }
            ]
          },
          {
            title: 'Operations Monitor',
            items: [
              {
                name: 'Basin Overview',
                href: '/dashboard',
                icon: LayoutDashboard,
                description: 'Fleet-wide live monitoring'
              },
              {
                name: 'Historical Replay',
                href: '/replay',
                icon: Activity,
                description: 'Incident verification'
              }
            ]
          }
        ];

      case 'operations_manager':
      default:
        return [
          {
            title: 'Basin Management',
            items: [
              {
                name: 'Basin Overview',
                href: '/dashboard',
                icon: LayoutDashboard,
                description: 'Fleet status & hazard meters'
              },
              {
                name: 'Fleet Wells Register',
                href: `/wells/${activeWellId}`,
                icon: Layers,
                description: 'Active rigs & offset matches'
              },
              {
                name: 'Memory Decay Index',
                href: '/decay-index',
                icon: TrendingDown,
                description: 'Knowledge erosion by field',
                badge: 'DIGBOI 88%'
              },
              {
                name: 'Cross-Formation Analogs',
                href: '/analogs',
                icon: GitCompare,
                description: 'Petrophysical twin engine'
              }
            ]
          },
          {
            title: 'Hazard & Verification',
            items: [
              {
                name: 'Hazard Advisories',
                href: '/alerts',
                icon: Bell,
                description: 'Active lookahead notices',
                badgeCount: openAlertsCount
              },
              {
                name: 'Incident Replay',
                href: '/replay',
                icon: Activity,
                description: 'Lookahead benchmark testing'
              },
              {
                name: 'Ingestion Audit',
                href: '/admin/ingestion',
                icon: Database,
                description: 'OCR confidence status'
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
      initials: 'PB'
    },
    operations_manager: {
      name: 'D. Deka',
      roleTitle: 'Drilling Superintendent',
      initials: 'DD'
    },
    admin: {
      name: 'M. Saikia',
      roleTitle: 'Data Governance Auditor',
      initials: 'MS'
    }
  }[currentRole];

  return (
    <nav className="w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#11141a] p-4 shrink-0 flex flex-col justify-between transition-colors" aria-label="Console Navigation">
      <div className="space-y-6">
        
        {/* Brand Logo */}
        <div className="pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-neutral-950 dark:bg-neutral-900 flex items-center justify-center border border-neutral-800 shadow-xs">
              <div className="relative flex flex-col gap-0.5 items-center">
                <span className="w-3.5 h-0.5 rounded-xs bg-amber-500" />
                <span className="w-3.5 h-0.5 rounded-xs bg-amber-600" />
                <span className="w-3.5 h-0.5 rounded-xs bg-amber-700" />
              </div>
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight text-neutral-950 dark:text-white">
                NWIS Console
              </div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                Oil India Limited
              </div>
            </div>
          </Link>
        </div>

        {/* Dynamic Role Navigation Sections */}
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1.5">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-2">
              {section.title}
            </div>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname.startsWith(item.href);

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                        isActive
                          ? 'bg-neutral-100 dark:bg-neutral-800/90 text-neutral-950 dark:text-white font-bold shadow-2xs'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-600' : 'text-neutral-400 dark:text-neutral-500'}`} />
                        <span className="truncate">{item.name}</span>
                      </div>

                      {/* Clean badge indicators: only where needed */}
                      {item.badgeCount !== undefined && item.badgeCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-mono font-bold">
                          {item.badgeCount}
                        </span>
                      )}

                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 text-[9px] font-mono font-bold">
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

      {/* User Card at Bottom of Nav (Clean & Uncluttered) */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2.5">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-neutral-950 text-white font-bold font-mono text-xs flex items-center justify-center shrink-0">
              {roleMeta.initials}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-neutral-900 dark:text-white text-xs truncate">
                {roleMeta.name}
              </div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono truncate">
                {roleMeta.roleTitle}
              </div>
            </div>
          </div>
          <Link
            href="/login"
            title="Switch User Role / Log Out"
            className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white p-1 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex items-center justify-between text-[10px] text-neutral-400 dark:text-neutral-500 font-mono px-1">
          <span>eRTMAC v4.1 Connected</span>
          <Link href="/" className="hover:underline hover:text-neutral-600 dark:hover:text-neutral-300">
            Exit Console
          </Link>
        </div>
      </div>
    </nav>
  );
};
