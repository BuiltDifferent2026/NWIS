'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { GovHeader } from './GovHeader';
import { GovNav } from './GovNav';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  // The landing page ('/') and login page ('/login') render with their own dedicated full-width layouts
  const isPublicPage = pathname === '/' || pathname === '/login';

  if (isPublicPage) {
    return <>{children}</>;
  }

  // Enterprise console layout with top bar, sidebar, and main workspace
  return (
    <div className="h-full flex flex-col bg-neutral-50 dark:bg-[#090b0f] text-neutral-900 dark:text-neutral-100 antialiased transition-colors">
      {/* Skip to main content link (Accessibility requirement) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-amber-400 focus:text-neutral-950 focus:p-2 focus:font-bold"
      >
        Skip to main content
      </a>

      {/* Modern Operations Top Bar */}
      <GovHeader />

      {/* Main Body Shell: Left Nav + Content Area */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <GovNav />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-50 dark:bg-[#090b0f] transition-colors"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
