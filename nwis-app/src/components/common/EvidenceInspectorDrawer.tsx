'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  FileSearch, 
  Sparkles,
  Clock,
  Layers,
  Check,
  Flag
} from 'lucide-react';
import { ConfidenceTag } from '@/lib/data/types';

interface EvidenceInspectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wellName?: string;
  sourceRef?: string;
  incidentDepth?: number;
  formationName?: string;
  confidence?: ConfidenceTag;
  nptHours?: number;
  mitigationApplied?: string;
  narrative?: string;
}

export const EvidenceInspectorDrawer: React.FC<EvidenceInspectorDrawerProps> = ({
  isOpen,
  onClose,
  wellName = 'OIL-GLK-07',
  sourceRef = 'WCR-GLK-07-1996 · Page 19',
  incidentDepth = 2280,
  formationName = 'Upper Tipam Sandstone',
  confidence = 'OCR-HIGH',
  nptHours = 34,
  mitigationApplied = 'Stage 45 bbl medium-nut-plug LCM pill; capped ECD at 10.4 ppg.',
  narrative = 'While drilling 12-1/4" hole section through Upper Tipam sand at 2,280m MD, sudden total loss of returns occurred (35 m³/hr). Pit level dropped 18 m³ before driller pulled off bottom. Mixed and spotted 45 bbl mica-fiber LCM pill with 25 ppb concentration. Regained partial returns after 6 hrs; completed cement squeeze plug at 2,275m.'
}) => {
  const [activeTab, setActiveTab] = useState<'ocr_view' | 'extracted_fields' | 'provenance'>('ocr_view');
  const [verificationState, setVerificationState] = useState<'unverified' | 'confirmed' | 'flagged'>('unverified');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0d111a] border-l border-neutral-200 dark:border-[#1f293d] h-full flex flex-col text-neutral-900 dark:text-neutral-100 shadow-2xl">
        
        {/* ─── Top Header ─── */}
        <div className="p-4 border-b border-neutral-200 dark:border-[#1f293d] flex items-center justify-between bg-neutral-50 dark:bg-[#111622]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm font-mono text-neutral-950 dark:text-white tracking-tight">
                  Archival Source Document Inspector
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-500/30">
                  {confidence}
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                {sourceRef} · Well: <strong className="text-neutral-950 dark:text-white">{wellName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ─── Tab Switcher ─── */}
        <div className="px-4 pt-3 pb-2 border-b border-neutral-200 dark:border-[#1f293d] flex items-center gap-2 bg-neutral-100/70 dark:bg-[#0d111a]">
          <button
            onClick={() => setActiveTab('ocr_view')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              activeTab === 'ocr_view'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60'
            }`}
          >
            Scanned Document & OCR Layer
          </button>
          <button
            onClick={() => setActiveTab('extracted_fields')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              activeTab === 'extracted_fields'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60'
            }`}
          >
            Normalized Schema Event
          </button>
          <button
            onClick={() => setActiveTab('provenance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              activeTab === 'provenance'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60'
            }`}
          >
            Audit & Provenance Trail
          </button>
        </div>

        {/* ─── Main Content ─── */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          
          {/* TAB 1: OCR VIEW */}
          {activeTab === 'ocr_view' && (
            <div className="space-y-4">
              
              {/* Paper Document Preview Simulation */}
              <div className="p-4 rounded-xl bg-[#faf8f5] text-neutral-900 border border-amber-200/80 shadow-inner font-serif space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-neutral-300 pb-2 text-[10px] font-mono uppercase text-neutral-600">
                  <span>OIL INDIA LIMITED · DULIAJAN HQ</span>
                  <span>ARCHIVAL DRILLING INTELLIGENCE</span>
                  <span>DOC-ID: {sourceRef}</span>
                </div>

                <div className="text-center py-1">
                  <h4 className="font-bold text-sm tracking-wide uppercase text-neutral-900">
                    Well Completion & Post-Drilling Operational Log
                  </h4>
                  <p className="text-[11px] italic text-neutral-600">Well: {wellName} | Horizon: {formationName} | Ref: {sourceRef}</p>
                </div>

                <div className="border border-neutral-300 p-2.5 rounded bg-[#fffefc] text-[11px] leading-relaxed space-y-2">
                  <div className="font-bold font-mono text-[10px] text-amber-900 uppercase">
                    Section 4.3: Geological Risk Corridor & Remedial Measures
                  </div>
                  
                  {/* Highlighted Bounding Box OCR Extraction */}
                  <div className="p-2.5 bg-amber-100/90 border-2 border-amber-600/70 rounded-md text-neutral-900 relative">
                    <span className="absolute -top-2.5 right-2 px-1.5 py-0.2 bg-amber-600 text-white font-mono text-[9px] font-bold rounded">
                      EXTRACTION LAYER ({confidence})
                    </span>
                    <p className="font-mono text-[11px] leading-relaxed">
                      &quot;Depth: <strong>{incidentDepth}.00 m MD</strong>. Formation: <strong>{formationName}</strong>. Narrative: {narrative}. Applied Remedial Program: <strong>{mitigationApplied}</strong>. Total Non-Productive Time (NPT): <strong>{nptHours} hours</strong>.&quot;
                    </p>
                  </div>

                  <p className="text-[10px] text-neutral-500 italic">
                    Assam-Arakan Subsurface Basin Archive · Ingestion Verified by OIL India Geosciences
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-1">
                  <span>{sourceRef}</span>
                  <span>Scanned at 300 DPI TIFF / Ingested via OCR Layer</span>
                </div>
              </div>

              {/* Confidence Callout */}
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#141a27] border border-neutral-200 dark:border-[#222b3d] space-y-1 text-neutral-800 dark:text-neutral-300">
                <div className="flex items-center gap-2 font-mono text-amber-700 dark:text-amber-400 font-bold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Extraction Provenance: {confidence} (Tesseract 5 + LayoutLM v3)</span>
                </div>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                  The depth value ({incidentDepth}m MD) and formation event for {wellName} were cross-referenced against historical Daily Drilling Reports with 94% entity match score.
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: EXTRACTED FIELDS */}
          {activeTab === 'extracted_fields' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#131926] border border-neutral-200 dark:border-[#1e273a]">
                <div className="font-mono text-[11px] text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-2 font-bold">
                  Normalized Drilling Incident Schema
                </div>
                
                <div className="grid grid-cols-2 gap-2.5 font-mono text-[11px]">
                  <div className="p-2 rounded bg-white dark:bg-[#0d121c] border border-neutral-200 dark:border-[#1a2333]">
                    <span className="text-neutral-500 text-[10px] block">Well Identifier</span>
                    <strong className="text-neutral-950 dark:text-white text-xs">{wellName}</strong>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-[#0d121c] border border-neutral-200 dark:border-[#1a2333]">
                    <span className="text-neutral-500 text-[10px] block">Target Formation</span>
                    <strong className="text-amber-700 dark:text-amber-400 text-xs">{formationName}</strong>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-[#0d121c] border border-neutral-200 dark:border-[#1a2333]">
                    <span className="text-neutral-500 text-[10px] block">Incident Depth</span>
                    <strong className="text-rose-700 dark:text-rose-400 text-xs">{incidentDepth} m MD</strong>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-[#0d121c] border border-neutral-200 dark:border-[#1a2333]">
                    <span className="text-neutral-500 text-[10px] block">NPT Lost</span>
                    <strong className="text-neutral-950 dark:text-white text-xs">{nptHours} Hours</strong>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-[#0d121c] border border-neutral-200 dark:border-[#1a2333] col-span-2">
                    <span className="text-neutral-500 text-[10px] block">Historical Mitigation Program</span>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs font-sans mt-0.5">{mitigationApplied}</p>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-[#0d121c] border border-neutral-200 dark:border-[#1a2333] col-span-2">
                    <span className="text-neutral-500 text-[10px] block">Normalized Event Narrative</span>
                    <p className="text-neutral-700 dark:text-neutral-300 text-xs font-sans mt-0.5 leading-relaxed">{narrative}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROVENANCE & GOVERNANCE */}
          {activeTab === 'provenance' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-[#131926] border border-neutral-200 dark:border-[#1e273a] space-y-2">
                <div className="font-mono text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Audit & Governance Policy Compliance</span>
                </div>
                <p className="text-[11px] text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                  This historical record is classified under <strong>{confidence}</strong>. Under OIL India's NWIS safety rules, records with OCR-HIGH or STRUCTURED-HIGH are permitted to calibrate proactive risk corridor buffers.
                </p>
              </div>

              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="p-2.5 rounded bg-white dark:bg-[#0e131d] border border-neutral-200 dark:border-[#1a2333] flex items-center justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Ingested Date</span>
                  <span className="text-neutral-950 dark:text-white font-semibold">2026-08-14 11:24 IST</span>
                </div>
                <div className="p-2.5 rounded bg-white dark:bg-[#0e131d] border border-neutral-200 dark:border-[#1a2333] flex items-center justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Archive Reference</span>
                  <span className="text-amber-700 dark:text-amber-400 font-semibold">OIL-ARCHIVE-GLK-1996-BOX-12</span>
                </div>
                <div className="p-2.5 rounded bg-white dark:bg-[#0e131d] border border-neutral-200 dark:border-[#1a2333] flex items-center justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Human Verification Status</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">Confirmed by Sr. Geologist (2026)</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ─── Bottom Actions (Human-in-the-Loop) ─── */}
        <div className="p-4 border-t border-neutral-200 dark:border-[#1f293d] bg-neutral-50 dark:bg-[#111622] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
            {verificationState === 'confirmed' ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Extraction verified by engineer
              </span>
            ) : verificationState === 'flagged' ? (
              <span className="text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1">
                <Flag className="w-3.5 h-3.5" /> Flagged for OCR manual re-review
              </span>
            ) : (
              <span>Reviewing archival evidence for decision-support</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setVerificationState('flagged')}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800/80 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-mono transition-colors cursor-pointer"
            >
              Flag for Re-OCR
            </button>
            <button
              onClick={() => setVerificationState('confirmed')}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-mono transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Confirm Extraction</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
