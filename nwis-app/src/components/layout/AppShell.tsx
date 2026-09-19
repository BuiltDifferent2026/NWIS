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

  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f8] dark:bg-[#090c13] text-[#0b0c0c] dark:text-[#f1f5f9] antialiased transition-colors">
      {/* Skip to main content link (Accessibility requirement under GIGW / WCAG) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-[#ffdd00] focus:text-[#0b0c0c] focus:p-2 focus:font-bold focus:outline-2"
      >
        Skip to main content
      </a>

      {/* Government Operations Header */}
      <GovHeader />

      {/* Main Body Shell: Left Nav + Content Area */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <GovNav />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f4f6f8] dark:bg-[#090c13] transition-colors"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
