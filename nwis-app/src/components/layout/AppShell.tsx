'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { GovHeader } from './GovHeader';
import { GovNav } from './GovNav';
import { AskNwisDrawer } from '@/components/common/AskNwisDrawer';
import { useAppStore } from '@/store/app-store';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { isCopilotOpen, setCopilotOpen, toggleCopilot } = useAppStore();

  // Global keyboard shortcut: Super/Cmd/Ctrl + K to open & close AI Copilot
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        toggleCopilot();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCopilot]);

  // The landing page ('/') and login page ('/login') render with their own dedicated full-width layouts
  const isPublicPage = pathname === '/' || pathname === '/login';

  if (isPublicPage) {
    return <>{children}</>;
  }

  // Enterprise console layout: Left sidebar (full height) + Right column (Top bar + content)
  return (
    <div className="h-screen w-full flex bg-[#F5F7F8] dark:bg-[#191E26] text-[#252B33] dark:text-white antialiased transition-colors overflow-hidden">
      {/* Skip to main content link (Accessibility requirement) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-[#3FC3B6] focus:text-[#252B33] focus:p-2 focus:font-bold"
      >
        Skip to main content
      </a>

      {/* Left Sidebar Navigation (Full Height) */}
      <GovNav />

      {/* Right Column: Top Bar + Scrollable Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <GovHeader />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-7 bg-[#F5F7F8] dark:bg-[#191E26] transition-colors"
        >
          {children}
        </main>
      </div>

      {/* Global AI Copilot Modal Drawer */}
      <AskNwisDrawer
        isOpen={isCopilotOpen}
        onClose={() => setCopilotOpen(false)}
      />
    </div>
  );
}
