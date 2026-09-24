'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  HardHat, 
  ArrowRight, 
  Lock, 
  Building2,
  ArrowLeft
} from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { UserRole } from '@/lib/data/types';

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
    <div className="min-h-screen bg-[#F5F7F8] flex flex-col justify-between relative overflow-hidden text-[#252B33]">
      
      {/* Background Architectural Blueprint Grid Lines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(34, 34, 34, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34, 34, 34, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Top Header Strip */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-[#E2E5E8] bg-white/95 backdrop-blur-xs">
        <Link href="/" className="flex items-center gap-3">
          <img 
            src="/oil-india-logo.png" 
            alt="Oil India Limited Logo" 
            className="h-8 w-auto object-contain"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-base text-[#252B33] tracking-tight leading-none">
              OIL INDIA LIMITED
            </span>
            <span className="text-[10px] font-mono text-[#6B7280] tracking-wider uppercase mt-0.5">
              NWIS • Upstream Decision Platform
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-mono font-bold text-[#6B7280] hover:text-[#26A69A] transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Overview
        </Link>
      </header>

      {/* Main Form Center Box */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-lg space-y-6">
          
          {/* Card Container */}
          <div className="bg-white rounded-none border border-[#E2E5E8] shadow-xs p-6 sm:p-8 space-y-6">
            
            {/* Header with Oil India Logo & Title */}
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-none bg-[#D9F2EE] border border-[#3FC3B6] text-[#26A69A] text-[11px] font-mono font-bold">
                  <span>MAHARATNA PSU • UPSTREAM ACCESS</span>
                </div>
                <img 
                  src="/oil-india-logo.png" 
                  alt="Oil India Logo" 
                  className="h-7 w-auto object-contain"
                />
              </div>

              <h1 className="text-2xl font-black tracking-tight text-[#252B33]">
                Sign in to Operations Console
              </h1>
              <p className="text-xs text-[#6B7280] mt-1 font-sans">
                Access real-time lookahead advisories, offset well memory, and Assam-Arakan shift logs.
              </p>
            </div>

            {/* 1-Click Judge Quick Role Switcher */}
            <div className="p-3.5 rounded-none bg-[#F5F7F8] border border-[#E2E5E8] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-[#34435A] uppercase">
                  Quick Role Demo Access (1-Click)
                </span>
                <span className="text-[10px] text-[#26A69A] font-mono font-bold px-1.5 py-0.5 bg-[#D9F2EE] border border-[#3FC3B6]">
                  FOR EVALUATORS
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                
                {/* Role 1: Operations Manager */}
                <button
                  type="button"
                  onClick={() => handleRoleQuickLogin('operations_manager', '/dashboard')}
                  className="p-2.5 text-left rounded-none bg-white border border-[#E2E5E8] hover:border-[#3FC3B6] hover:bg-[#D9F2EE]/30 transition-all group cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-[#34435A] group-hover:text-[#26A69A] mb-1.5" />
                  <div className="font-bold text-[#252B33] text-[11px] font-mono">Manager</div>
                  <div className="text-[9px] text-[#6B7280] leading-tight font-sans">Basin fleet view</div>
                </button>

                {/* Role 2: Field Engineer */}
                <button
                  type="button"
                  onClick={() => handleRoleQuickLogin('field_engineer', '/wells/well-glk-14')}
                  className="p-2.5 text-left rounded-none bg-white border border-[#E2E5E8] hover:border-[#3FC3B6] hover:bg-[#D9F2EE]/30 transition-all group cursor-pointer"
                >
                  <HardHat className="w-4 h-4 text-[#34435A] group-hover:text-[#26A69A] mb-1.5" />
                  <div className="font-bold text-[#252B33] text-[11px] font-mono">Field Engineer</div>
                  <div className="text-[9px] text-[#6B7280] leading-tight font-sans">Rig wellbore track</div>
                </button>

                {/* Role 3: PSU Admin */}
                <button
                  type="button"
                  onClick={() => handleRoleQuickLogin('admin', '/admin/ingestion')}
                  className="p-2.5 text-left rounded-none bg-white border border-[#E2E5E8] hover:border-[#3FC3B6] hover:bg-[#D9F2EE]/30 transition-all group cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#34435A] group-hover:text-[#26A69A] mb-1.5" />
                  <div className="font-bold text-[#252B33] text-[11px] font-mono">PSU Auditor</div>
                  <div className="text-[9px] text-[#6B7280] leading-tight font-sans">OCR pedigree audit</div>
                </button>

              </div>
            </div>

            {/* Standard Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-[#252B33] font-bold block">
                  OIL Corporate Email / Badge ID
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-none border border-[#E2E5E8] text-[#252B33] bg-[#F5F7F8] focus:bg-white focus:outline-hidden focus:border-[#3FC3B6] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[#252B33] font-bold block">
                    Security Token / Password
                  </label>
                  <span className="text-[10px] text-[#6B7280]">Default pre-filled</span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-none border border-[#E2E5E8] text-[#252B33] bg-[#F5F7F8] focus:bg-white focus:outline-hidden focus:border-[#3FC3B6] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-none bg-[#ED1C24] hover:bg-[#C9141B] text-white font-bold text-xs font-mono flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <span>Enter Operations Console</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </form>

            {/* Security Notice */}
            <div className="pt-2 border-t border-[#E2E5E8] flex items-start gap-2 text-[10px] text-[#6B7280] font-mono">
              <Lock className="w-3.5 h-3.5 text-[#34435A] shrink-0 mt-0.5" />
              <span>
                Authorized access only. Session tracked under Maharatna PSU digital security protocols. Connected to eRTMAC v4.1 bridge.
              </span>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-[11px] font-mono text-[#6B7280] border-t border-[#E2E5E8] bg-white">
        Oil India Limited (OIL) • eRTMAC Nearby Wells Intelligence System (SIH26121)
      </footer>

    </div>
  );
}
