'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  HardHat, 
  ArrowRight, 
  Lock, 
  Building2
} from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { UserRole } from '@/lib/data/types';

import { ThemeToggle } from '@/components/common/ThemeToggle';

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useAppStore();

  const [email, setEmail] = useState('d.deka@oilindia.in');
  const [password, setPassword] = useState('••••••••••••');
  const [activeTabRole] = useState<UserRole>('operations_manager');

  const handleRoleQuickLogin = (role: UserRole, targetRoute: string) => {
    setRole(role);
    router.push(targetRoute);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(activeTabRole);
    if (activeTabRole === 'field_engineer') {
      router.push('/wells/well-glk-14');
    } else if (activeTabRole === 'admin') {
      router.push('/admin/ingestion');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#090b0f] text-neutral-900 dark:text-neutral-100 flex flex-col justify-between relative overflow-hidden transition-colors">
      
      {/* Background Architectural Blueprint Grid Lines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Top Header Strip */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-[#11141a]/80 backdrop-blur-xs">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-950 flex items-center justify-center border border-neutral-800">
            <div className="flex flex-col gap-0.5 items-center">
              <span className="w-3.5 h-0.5 rounded-xs bg-amber-500" />
              <span className="w-3.5 h-0.5 rounded-xs bg-amber-600" />
              <span className="w-3.5 h-0.5 rounded-xs bg-amber-700" />
            </div>
          </div>
          <span className="font-extrabold text-base text-neutral-950 dark:text-white tracking-tight">
            NWIS
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
            eRTMAC Companion
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/"
            className="text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            ← Return to Overview
          </Link>
        </div>
      </header>

      {/* Main Form Center Box */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-lg space-y-6">
          
          {/* Card Container */}
          <div className="bg-white dark:bg-[#12151c] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-lg p-6 sm:p-8 space-y-6">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-[11px] font-mono font-semibold mb-2">
                <span>OIL INDIA LIMITED • UPSTREAM ACCESS</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
                Sign in to Operations Console
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                Access real-time lookahead advisories, offset well memory, and shift logs.
              </p>
            </div>

            {/* 1-Click Judge Quick Role Switcher */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-neutral-700 dark:text-neutral-300 uppercase">
                  Quick Role Demo Access (1-Click)
                </span>
                <span className="text-[10px] text-amber-800 dark:text-amber-400 font-mono font-bold">
                  FOR EVALUATORS
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                
                {/* Role 1: Operations Manager */}
                <button
                  type="button"
                  onClick={() => handleRoleQuickLogin('operations_manager', '/dashboard')}
                  className="p-2.5 text-left rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-amber-600 dark:hover:border-amber-500 hover:shadow-xs transition-all group"
                >
                  <Building2 className="w-4 h-4 text-neutral-700 dark:text-neutral-300 group-hover:text-amber-600 mb-1" />
                  <div className="font-extrabold text-neutral-900 dark:text-white text-[11px]">Manager</div>
                  <div className="text-[9px] text-neutral-500 dark:text-neutral-400 leading-tight">Basin fleet view</div>
                </button>

                {/* Role 2: Field Engineer */}
                <button
                  type="button"
                  onClick={() => handleRoleQuickLogin('field_engineer', '/wells/well-glk-14')}
                  className="p-2.5 text-left rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-amber-600 dark:hover:border-amber-500 hover:shadow-xs transition-all group"
                >
                  <HardHat className="w-4 h-4 text-neutral-700 dark:text-neutral-300 group-hover:text-amber-600 mb-1" />
                  <div className="font-extrabold text-neutral-900 dark:text-white text-[11px]">Field Engineer</div>
                  <div className="text-[9px] text-neutral-500 dark:text-neutral-400 leading-tight">Rig wellbore track</div>
                </button>

                {/* Role 3: PSU Admin */}
                <button
                  type="button"
                  onClick={() => handleRoleQuickLogin('admin', '/admin/ingestion')}
                  className="p-2.5 text-left rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-amber-600 dark:hover:border-amber-500 hover:shadow-xs transition-all group"
                >
                  <ShieldCheck className="w-4 h-4 text-neutral-700 dark:text-neutral-300 group-hover:text-amber-600 mb-1" />
                  <div className="font-extrabold text-neutral-900 dark:text-white text-[11px]">PSU Auditor</div>
                  <div className="text-[9px] text-neutral-500 dark:text-neutral-400 leading-tight">OCR pedigree audit</div>
                </button>

              </div>
            </div>

            {/* Standard Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-neutral-700 dark:text-neutral-300 font-bold block">
                  OIL Corporate Email / Badge ID
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white bg-white dark:bg-[#161a24] focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-neutral-700 dark:text-neutral-300 font-bold block">
                    Security Token / Password
                  </label>
                  <span className="text-[10px] text-neutral-400">Default pre-filled</span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white bg-white dark:bg-[#161a24] focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-950 dark:bg-amber-600 hover:bg-neutral-800 dark:hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span>Enter Operations Console</span>
                <ArrowRight className="w-4 h-4 text-amber-400 dark:text-white" />
              </button>
            </form>

            {/* Security Notice */}
            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-start gap-2 text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
              <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
              <span>
                Authorized access only. Session tracked under Maharatna PSU digital security protocols. Connected to eRTMAC v4.1.
              </span>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-[11px] font-mono text-neutral-500 dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#090b0f]">
        Oil India Limited (OIL) • eRTMAC Nearby Wells Intelligence System (SIH26121)
      </footer>

    </div>
  );
}
