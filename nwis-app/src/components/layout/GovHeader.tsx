'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  HardHat, 
  Bell, 
  ExternalLink,
  Activity,
  Layers,
  GitCompare,
  Database,
  Scale,
  Sparkles,
  Info,
  CheckCircle2,
  X,
  Search
} from 'lucide-react';
import { useAppStore } from '../../store/app-store';
import { INITIAL_LIVE_TELEMETRY } from '@/data/live-state';
import { UserRole } from '@/lib/data/types';
import { AskNwisDrawer } from '@/components/common/AskNwisDrawer';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export const GovHeader: React.FC = () => {
  const pathname = usePathname();
  const { currentRole, setRole, activeWellId, setActiveWellId, alerts } = useAppStore();
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [showErtmacBridgeModal, setShowErtmacBridgeModal] = useState<boolean>(false);
  
  const [fontSizeLevel, setFontSizeLevel] = useState<'sm' | 'md' | 'lg'>('md');
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  // Unread high-priority notifications
  const unreadAlerts = alerts.filter((a) => a.status === 'new').length;

  return (
    <>
      <header className="border-b border-[#d0d7de] dark:border-[#1e3a5f] bg-white dark:bg-[#071d36] sticky top-0 z-40 transition-colors shadow-xs">
        
        {/* ─── 1. National Tricolor Accent Strip ─── */}
        <div className="gov-in-tricolor" />

        {/* ─── 2. GIGW Top Accessibility & Ministry Identification Bar ─── */}
        <div className="gov-in-topbar px-4 py-1.5 flex items-center justify-between text-[11px] font-sans border-b border-[#d0d7de] dark:border-[#1e3a5f]">
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-semibold text-[#1f2328] dark:text-[#cbd5e1]">
              <div className="w-5 h-5 rounded-full bg-[#0b3c6d] text-white flex items-center justify-center font-serif text-[10px] font-extrabold border border-[#ff9933]">
                🏛️
              </div>
              <span className="font-bold text-[#b45309] dark:text-[#f59e0b]">भारत सरकार</span>
              <span className="text-[#8c959f]">|</span>
              <span>Government of India</span>
            </div>
            <span className="hidden md:inline text-[#8c959f]">·</span>
            <div className="hidden md:flex items-center gap-1 text-[#57606a] dark:text-[#94a3b8]">
              <span>पेट्रोलियम एवं प्राकृतिक गैस मंत्रालय</span>
              <span className="text-[#8c959f]">|</span>
              <span>Ministry of Petroleum &amp; Natural Gas</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 font-mono text-[11px]">
            {/* National Initiative Badge */}
            <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 bg-[#fff8eb] dark:bg-[#1a2312] border border-[#fde68a] dark:border-[#3f6212] text-[10px] text-[#92400e] dark:text-[#bef264] font-bold">
              🇮🇳 आत्मनिर्भर ऊर्जा | Atmanirbhar Energy Security
            </span>

            {/* SIH / Problem Statement Tag */}
            <span className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#f0f2f5] dark:bg-[#0c2847] border border-[#d0d7de] dark:border-[#1e3a5f] text-[10px] text-[#0b3c6d] dark:text-[#60a5fa] font-bold">
              SIH 2026: PS #26121
            </span>

            {/* Font Size Accessibility Controls */}
            <div className="hidden sm:flex items-center gap-1 border border-[#d0d7de] dark:border-[#1e3a5f] bg-white dark:bg-[#0c2847] px-1 py-0.2">
              <button
                type="button"
                onClick={() => setFontSizeLevel('sm')}
                className={`px-1 text-[10px] ${fontSizeLevel === 'sm' ? 'font-bold text-[#0b3c6d] dark:text-[#60a5fa]' : 'text-[#57606a]'}`}
                title="Decrease Font Size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSizeLevel('md')}
                className={`px-1 text-[11px] ${fontSizeLevel === 'md' ? 'font-bold text-[#0b3c6d] dark:text-[#60a5fa]' : 'text-[#57606a]'}`}
                title="Standard Font Size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSizeLevel('lg')}
                className={`px-1 text-[12px] ${fontSizeLevel === 'lg' ? 'font-bold text-[#0b3c6d] dark:text-[#60a5fa]' : 'text-[#57606a]'}`}
                title="Increase Font Size"
              >
                A+
              </button>
            </div>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="px-2 py-0.5 border border-[#d0d7de] dark:border-[#1e3a5f] bg-white dark:bg-[#0c2847] hover:bg-[#edf2f7] dark:hover:bg-[#12365c] text-[#0b3c6d] dark:text-[#93c5fd] font-bold text-[10px] transition-colors cursor-pointer"
            >
              {lang === 'en' ? 'हिन्दी' : 'English'}
            </button>

            {/* Theme Toggle Button */}
            <ThemeToggle />
          </div>

        </div>

        {/* ─── 3. Main Indian PSU Branding & Operations Ribbon ─── */}
        <div className="px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-[#071d36]">
          
          {/* Brand & Organization Title */}
          <div className="flex items-center gap-3.5">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xs bg-[#0b3c6d] dark:bg-[#0a2f58] border-2 border-[#ff9933] text-white font-mono font-bold text-xs flex flex-col items-center justify-center tracking-wider shadow-xs">
                <span className="text-[11px] leading-tight font-black text-[#ff9933]">OIL</span>
                <span className="text-[8px] leading-tight text-white/90 font-bold">INDIA</span>
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-base text-[#0b3c6d] dark:text-[#93c5fd] font-sans tracking-tight">
                    ऑयल इंडिया लिमिटेड | Oil India Limited
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#fffbeb] dark:bg-[#1c2a1c] text-[#b45309] dark:text-[#34d399] border border-[#fde68a] dark:border-[#166534] font-mono font-bold">
                    Navratna CPSE
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#1f2328] dark:text-[#f0f2f5] font-sans flex items-center gap-1.5 mt-0.5">
                  <span className="text-[#b45309] dark:text-[#fbbf24] font-bold">निकटवर्ती कूप आसूचना प्रणाली (NWIS)</span>
                  <span className="text-[#8c959f] font-normal">·</span>
                  <span className="text-[#57606a] dark:text-[#94a3b8] font-normal text-[11px]">
                    eRTMAC Subsurface Offset Intelligence Companion (Assam-Arakan Basin)
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Right Operational Control Group */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            
            {/* Live eRTMAC Status Tag */}
            <button
              onClick={() => setShowErtmacBridgeModal(true)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-xs border border-[#bbf7d0] dark:border-[#166534] bg-[#f0fdf4] dark:bg-[#0c2419] text-[11px] font-mono hover:bg-[#dcfce7] transition-colors cursor-pointer"
              title="Click to view eRTMAC Bridge contract specifications"
            >
              <span className="w-2 h-2 rounded-full bg-[#138808] animate-pulse" />
              <span className="font-bold text-[#0e6406] dark:text-[#4ade80]">eRTMAC:</span>
              <span className="text-[#1f2328] dark:text-[#cbd5e1] font-semibold">WITSML (380ms)</span>
            </button>

            {/* Quick Well Selector */}
            <div className="flex items-center gap-1 text-xs font-mono">
              <label htmlFor="active-well-select" className="text-[#57606a] dark:text-[#94a3b8] text-[10px] uppercase font-bold">
                Well:
              </label>
              <select
                id="active-well-select"
                value={activeWellId}
                onChange={(e) => setActiveWellId(e.target.value)}
                className="border border-[#d0d7de] dark:border-[#1e3a5f] bg-white dark:bg-[#0c2847] text-[#1f2328] dark:text-[#f0f2f5] rounded-xs px-2 py-1 text-xs font-bold focus:outline-2 focus:outline-[#ff9933]"
              >
                <option value="well-glk-14">OIL-GLK-14 (Geleki · Active)</option>
                <option value="well-dgb-09">OIL-DGB-09 (Digboi · Active)</option>
                <option value="well-khs-04">OIL-KHS-04 (Kharsang · Standby)</option>
              </select>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center gap-1 text-xs font-mono">
              <select
                value={currentRole}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="border border-[#d0d7de] dark:border-[#1e3a5f] bg-white dark:bg-[#0c2847] text-[#1f2328] dark:text-[#f0f2f5] rounded-xs px-2 py-1 text-xs font-medium focus:outline-2 focus:outline-[#ff9933]"
                title="Switch Operating Role Persona"
              >
                <option value="field_engineer">Lead Rig Engineer</option>
                <option value="operations_manager">Drilling Superintendent</option>
                <option value="admin">PSU Data Auditor</option>
              </select>
            </div>

            {/* Alert Inbox Jump */}
            <Link
              href="/alerts"
              className="relative p-1.5 rounded-xs border border-[#d0d7de] dark:border-[#1e3a5f] bg-white dark:bg-[#0c2847] text-[#57606a] dark:text-[#94a3b8] hover:text-[#0b3c6d] dark:hover:text-[#93c5fd] hover:bg-[#edf2f7] dark:hover:bg-[#12365c] transition-colors"
              title={`${unreadAlerts} Open Hazard Advisories`}
              aria-label="Alert Inbox"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 px-1 bg-[#c92a2a] text-white text-[9px] font-mono font-bold rounded-xs leading-tight">
                  {unreadAlerts}
                </span>
              )}
            </Link>

            {/* Subsurface Copilot Button */}
            <button
              onClick={() => setIsCopilotOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#0b3c6d] hover:bg-[#072a4d] text-white text-xs font-bold font-sans transition-colors cursor-pointer shadow-2xs border border-[#0b3c6d]"
            >
              <Search className="w-3.5 h-3.5 text-[#ff9933]" />
              <span className="hidden md:inline">Search Archives</span>
            </button>
          </div>

        </div>
      </header>

      {/* Ask NWIS Copilot Drawer */}
      <AskNwisDrawer isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} />

      {/* eRTMAC Bridge Contract Modal */}
      {showErtmacBridgeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#101520] border border-[#d1d5db] dark:border-[#232c3f] rounded-xs max-w-lg w-full p-5 space-y-4 shadow-lg animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#d1d5db] dark:border-[#232c3f]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#00703c]" />
                <h3 className="font-bold text-sm text-[#0b0c0c] dark:text-[#f1f5f9] font-sans">
                  eRTMAC Bridge Architectural Contract
                </h3>
              </div>
              <button
                onClick={() => setShowErtmacBridgeModal(false)}
                className="p-1 rounded-xs hover:bg-[#f3f4f6] dark:hover:bg-[#192336] text-[#4b5563] dark:text-[#94a3b8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-[#4b5563] dark:text-[#cbd5e1] space-y-3 leading-relaxed font-sans">
              <p>
                NWIS is an <strong>advisory-only read consumer</strong> designed to run in parallel with Oil India Limited&apos;s real-time drilling management system (eRTMAC).
              </p>
              <div className="p-3 bg-[#f8fafc] dark:bg-[#141b2a] border border-[#d1d5db] dark:border-[#232c3f] rounded-xs space-y-1.5 font-mono text-[11px]">
                <div className="text-[#0b0c0c] dark:text-[#f8fafc] font-bold">Safety Guarantees:</div>
                <div className="text-[#00703c] dark:text-[#34d399]">✓ Zero telemetry write commands to rig surface instrumentation</div>
                <div className="text-[#00703c] dark:text-[#34d399]">✓ WITSML 1.4.1.1 / ETP 1.2 compliant read stream</div>
                <div className="text-[#00703c] dark:text-[#34d399]">✓ Failsafe isolation: rig drilling is unaffected if NWIS goes offline</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowErtmacBridgeModal(false)}
                className="px-3 py-1.5 bg-[#1d70b8] hover:bg-[#003078] text-white rounded-xs text-xs font-bold font-sans cursor-pointer"
              >
                Close Specification
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
