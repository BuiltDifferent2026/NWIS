'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Server, 
  Lock, 
  FileCheck, 
  HardHat, 
  Database, 
  ArrowRight, 
  Cpu 
} from 'lucide-react';

export const DarkIntegrationSection: React.FC = () => {
  return (
    <section id="architecture" className="relative bg-neutral-950 text-white overflow-hidden py-24 border-b border-neutral-800">
      
      {/* Subtle Dusk Horizon Glow (Matching Reference Image) */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(234, 88, 12, 0.4), transparent 70%)'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/60 inline-block">
            DATA INTEGRATION & PSU GOVERNANCE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Seamless eRTMAC Integration. <br className="hidden sm:inline" />
            Zero Boundary Creep.
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            Judges ask: <em>&ldquo;Does this interfere with eRTMAC’s safety-critical operations?&rdquo;</em> No. NWIS enforces a strict one-way, read-only contract: it ingests live state, queries its internal historical memory, and fires advisories without ever writing control commands back to rig hardware.
          </p>
        </div>

        {/* The Visual 3-Stage Pipeline Diagram */}
        <div className="p-8 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            
            {/* Stage 1: Dual Input Streams */}
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase">
                <Database className="w-4 h-4" />
                <span>1. Ingestion Sources</span>
              </div>
              <h4 className="text-base font-bold text-white">Hybrid Input Layer</h4>
              <ul className="space-y-2 text-xs text-neutral-400 font-mono">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span><strong>Live eRTMAC Feed:</strong> Read-only depth, ROP, torque, mud weight (JSON / WITSML).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span><strong>130+ Yr Field Archives:</strong> Scanned WCRs, typewritten DDRs, and mud log PDFs.</span>
                </li>
              </ul>
            </div>

            {/* Stage 2: Dual-Store Normalization & Confidence */}
            <div className="p-6 rounded-2xl bg-neutral-950 border border-amber-600/40 space-y-3 relative shadow-lg">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase">
                <Cpu className="w-4 h-4" />
                <span>2. Core Intelligence</span>
              </div>
              <h4 className="text-base font-bold text-white">Stratigraphic Engine</h4>
              <ul className="space-y-2 text-xs text-neutral-400 font-mono">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  <span><strong>Confidence Tagging:</strong> STRUCTURED-HIGH to MANUAL-REVIEW. Low-confidence never triggers critical alarms.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  <span><strong>Corridor Watcher:</strong> Continuously checks live depth against offset hazard intervals.</span>
                </li>
              </ul>
            </div>

            {/* Stage 3: Operational Action & Handover */}
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase">
                <HardHat className="w-4 h-4" />
                <span>3. Rig Floor Action</span>
              </div>
              <h4 className="text-base font-bold text-white">Proactive Delivery</h4>
              <ul className="space-y-2 text-xs text-neutral-400 font-mono">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">•</span>
                  <span><strong>75m Lead-Time Alert:</strong> Drill crew stages LCM or adjusts mud weight before bit enters hazard.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">•</span>
                  <span><strong>Shift Handover Log:</strong> Auditable safety-case documentation for management review.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Connective Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent -translate-y-1/2 pointer-events-none" />

        </div>

        {/* Enterprise-Grade PSU Security & Compliance Badges (Directly Matching Reference Image Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400 mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h5 className="font-bold text-sm text-white">PSU Data Sovereignty</h5>
            <p className="text-xs text-neutral-400 leading-relaxed">
              100% on-premise capable. Operates air-gapped within Oil India’s private corporate intranet without external cloud dependencies.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400 mb-2">
              <Lock className="w-4 h-4" />
            </div>
            <h5 className="font-bold text-sm text-white">Strict Read-Only Bridge</h5>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Defined API contract `GET /live-state/{'{well_id}'}`. NWIS writes zero control commands back into eRTMAC.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400 mb-2">
              <FileCheck className="w-4 h-4" />
            </div>
            <h5 className="font-bold text-sm text-white">Auditability & OISD Alignment</h5>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Every recommendation separates fact, estimate, and action, fulfilling DGMS and OISD safety-case compliance standards.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400 mb-2">
              <Server className="w-4 h-4" />
            </div>
            <h5 className="font-bold text-sm text-white">Self-Auditing Trust Loop</h5>
            <p className="text-xs text-neutral-400 leading-relaxed">
              The system tracks engineer confirmations vs rejections per OCR batch and down-weights inaccurate archival scans over time.
            </p>
          </div>

        </div>

        {/* CTA Strip */}
        <div className="text-center pt-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm transition-all shadow-lg"
          >
            <span>Open eRTMAC Operations Console</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
