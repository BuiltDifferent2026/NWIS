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
      <div className="w-full max-w-2xl bg-white dark:bg-[#242D3B] border-l border-[#E2E5E8] dark:border-[#364356] h-full flex flex-col text-[#252B33] dark:text-white shadow-2xl rounded-none">
        
        {/* ─── Top Header ─── */}
        <div className="p-4 border-b border-[#E2E5E8] dark:border-[#364356] flex items-center justify-between bg-[#F5F7F8] dark:bg-[#1E2532]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-none bg-[#D9F2EE] dark:bg-[#3FC3B6]/20 text-[#26A69A] dark:text-[#3FC3B6] flex items-center justify-center border border-[#3FC3B6]">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm font-mono text-[#252B33] dark:text-white tracking-tight">
                  Archival Source Document Inspector
                </h3>
                <span className="px-2 py-0.5 rounded-none text-[10px] font-mono font-bold bg-[#D9F2EE] dark:bg-[#3FC3B6]/20 text-[#26A69A] dark:text-[#3FC3B6] border border-[#3FC3B6]">
                  {confidence}
                </span>
              </div>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] font-mono">
                {sourceRef} · Well: <strong className="text-[#252B33] dark:text-white">{wellName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-none text-[#6B7280] dark:text-[#94A3B8] hover:text-[#252B33] dark:hover:text-white hover:bg-[#E2E5E8] dark:hover:bg-[#34435A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ─── Tab Switcher ─── */}
        <div className="px-4 pt-3 pb-2 border-b border-[#E2E5E8] dark:border-[#364356] flex items-center gap-2 bg-[#F5F7F8] dark:bg-[#1E2532]">
          <button
            onClick={() => setActiveTab('ocr_view')}
            className={`px-3 py-1.5 rounded-none text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'ocr_view'
                ? 'bg-[#34435A] dark:bg-[#3FC3B6] text-white dark:text-[#191E26] shadow-2xs'
                : 'text-[#6B7280] dark:text-[#94A3B8] hover:text-[#252B33] dark:hover:text-white hover:bg-[#E2E5E8] dark:hover:bg-[#34435A]'
            }`}
          >
            Scanned Document &amp; OCR Layer
          </button>
          <button
            onClick={() => setActiveTab('extracted_fields')}
            className={`px-3 py-1.5 rounded-none text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'extracted_fields'
                ? 'bg-[#34435A] dark:bg-[#3FC3B6] text-white dark:text-[#191E26] shadow-2xs'
                : 'text-[#6B7280] dark:text-[#94A3B8] hover:text-[#252B33] dark:hover:text-white hover:bg-[#E2E5E8] dark:hover:bg-[#34435A]'
            }`}
          >
            Normalized Schema Event
          </button>
          <button
            onClick={() => setActiveTab('provenance')}
            className={`px-3 py-1.5 rounded-none text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'provenance'
                ? 'bg-[#34435A] dark:bg-[#3FC3B6] text-white dark:text-[#191E26] shadow-2xs'
                : 'text-[#6B7280] dark:text-[#94A3B8] hover:text-[#252B33] dark:hover:text-white hover:bg-[#E2E5E8] dark:hover:bg-[#34435A]'
            }`}
          >
            Audit &amp; Provenance Trail
          </button>
        </div>

        {/* ─── Main Content ─── */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          
          {/* TAB 1: OCR VIEW */}
          {activeTab === 'ocr_view' && (
            <div className="space-y-4">
              
              {/* Paper Document Preview Simulation */}
              <div className="p-4 rounded-none bg-[#FAFAFA] dark:bg-[#191E26] text-[#252B33] dark:text-white border border-[#E2E5E8] dark:border-[#364356] shadow-inner font-serif space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#E2E5E8] dark:border-[#364356] pb-2 text-[10px] font-mono uppercase text-[#6B7280] dark:text-[#94A3B8]">
                  <span>OIL INDIA LIMITED · DULIAJAN HQ</span>
                  <span>WCR DEPT / GELEKI SECTOR (1996)</span>
                  <span>DOC-ID: OIL-GLK-07-WCR-p19</span>
                </div>

                <div className="text-center py-1">
                  <h4 className="font-bold text-sm tracking-wide uppercase text-[#252B33] dark:text-white">
                    Well Completion &amp; Post-Drilling Operational Log
                  </h4>
                  <p className="text-[11px] italic text-[#6B7280] dark:text-[#94A3B8]">Well: OIL-GLK-07 | Spud: 20-Sep-1996 | Total Depth: 3,650 m MD</p>
                </div>

                <div className="border border-[#E2E5E8] dark:border-[#364356] p-2.5 rounded-none bg-white dark:bg-[#1E2532] text-[11px] leading-relaxed space-y-2">
                  <div className="font-bold font-mono text-[10px] text-[#34435A] dark:text-[#3FC3B6] uppercase">
                    Section 4.3: Lost Circulation Incidents &amp; Remedial Measures
                  </div>
                  
                  {/* Highlighted Bounding Box OCR Extraction */}
                  <div className="p-2.5 bg-[#D9F2EE]/50 dark:bg-[#3FC3B6]/15 border-2 border-[#3FC3B6] rounded-none text-[#252B33] dark:text-white relative">
                    <span className="absolute -top-2.5 right-2 px-1.5 py-0.2 bg-[#26A69A] dark:bg-[#3FC3B6] text-white dark:text-[#191E26] font-mono text-[9px] font-bold rounded-none">
                      OCR EXTRACTION (CONFIDENCE 94%)
                    </span>
                    <p className="font-mono text-[11px] leading-relaxed">
                      &quot;Depth: <strong>2,280.00 m MD</strong> (TVD: 2,242 m). Formation: <strong>Upper Tipam Sandstone</strong>. Encountered sudden severe mud loss of <strong>35.0 m³/hr</strong>. Active pit loss: 18 m³. Pumped <strong>45 bbl medium nut-plug &amp; mica fiber LCM pill</strong> (25 ppb). ECD capped at 10.4 ppg. Total Non-Productive Time (NPT): <strong>34.0 hours</strong>.&quot;
                    </p>
                  </div>

                  <p className="text-[10px] text-[#6B7280] dark:text-[#94A3B8] italic">
                    Drilling Superintendent: Er. A. Baruah · Signed: 14-Oct-1996 · Rig OIL-3
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#6B7280] dark:text-[#94A3B8] pt-1">
                  <span>Page 19 of 142</span>
                  <span>Scanned at 300 DPI TIFF / Ingested via OCR Layer</span>
                </div>
              </div>

              {/* Confidence Callout */}
              <div className="p-3 rounded-none bg-[#F5F7F8] dark:bg-[#1E2532] border border-[#E2E5E8] dark:border-[#364356] space-y-1 text-[#252B33] dark:text-white">
                <div className="flex items-center gap-2 font-mono text-[#26A69A] dark:text-[#3FC3B6] font-bold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Extraction Provenance: OCR-HIGH (Tesseract 5 + LayoutLM v3)</span>
                </div>
                <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] leading-relaxed font-sans">
                  The depth value (2,280m MD) and mud loss quantity were cross-referenced against DDR-GLK-07 Daily Logs (1996) with 94% entity match score.
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: EXTRACTED FIELDS */}
          {activeTab === 'extracted_fields' && (
            <div className="space-y-3">
              <div className="p-3 rounded-none bg-[#F5F7F8] dark:bg-[#1E2532] border border-[#E2E5E8] dark:border-[#364356]">
                <div className="font-mono text-[11px] text-[#34435A] dark:text-[#3FC3B6] uppercase tracking-wider mb-2 font-bold">
                  Normalized Drilling Incident Schema
                </div>
                
                <div className="grid grid-cols-2 gap-2.5 font-mono text-[11px]">
                  <div className="p-2.5 rounded-none bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356]">
                    <span className="text-[#6B7280] dark:text-[#94A3B8] text-[10px] block font-bold">Well Identifier</span>
                    <strong className="text-[#252B33] dark:text-white text-xs">{wellName}</strong>
                  </div>
                  <div className="p-2.5 rounded-none bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356]">
                    <span className="text-[#6B7280] dark:text-[#94A3B8] text-[10px] block font-bold">Target Formation</span>
                    <strong className="text-[#26A69A] dark:text-[#3FC3B6] text-xs">{formationName}</strong>
                  </div>
                  <div className="p-2.5 rounded-none bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356]">
                    <span className="text-[#6B7280] dark:text-[#94A3B8] text-[10px] block font-bold">Incident Depth</span>
                    <strong className="text-[#ED1C24] text-xs">{incidentDepth} m MD</strong>
                  </div>
                  <div className="p-2.5 rounded-none bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356]">
                    <span className="text-[#6B7280] dark:text-[#94A3B8] text-[10px] block font-bold">NPT Lost</span>
                    <strong className="text-[#ED1C24] text-xs">{nptHours} Hours</strong>
                  </div>
                  <div className="p-2.5 rounded-none bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] col-span-2">
                    <span className="text-[#6B7280] dark:text-[#94A3B8] text-[10px] block font-bold">Historical Mitigation Program</span>
                    <p className="text-[#252B33] dark:text-white text-xs font-sans mt-0.5">{mitigationApplied}</p>
                  </div>
                  <div className="p-2.5 rounded-none bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] col-span-2">
                    <span className="text-[#6B7280] dark:text-[#94A3B8] text-[10px] block font-bold">Normalized Event Narrative</span>
                    <p className="text-[#252B33] dark:text-white text-xs font-sans mt-0.5 leading-relaxed">{narrative}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROVENANCE & GOVERNANCE */}
          {activeTab === 'provenance' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-none bg-[#D9F2EE]/40 dark:bg-[#3FC3B6]/15 border border-[#3FC3B6] space-y-2">
                <div className="font-mono text-[#26A69A] dark:text-[#3FC3B6] font-bold text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Audit &amp; Governance Policy Compliance</span>
                </div>
                <p className="text-[11px] text-[#252B33] dark:text-white leading-relaxed font-sans">
                  This historical record is classified under <strong>{confidence}</strong>. Under OIL India&apos;s NWIS safety rules, records with OCR-HIGH or STRUCTURED-HIGH are permitted to calibrate proactive risk corridor buffers.
                </p>
              </div>

              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="p-2.5 rounded-none bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] flex items-center justify-between">
                  <span className="text-[#6B7280] dark:text-[#94A3B8]">Ingested Date</span>
                  <span className="text-[#252B33] dark:text-white font-semibold">2026-08-14 11:24 IST</span>
                </div>
                <div className="p-2.5 rounded-none bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] flex items-center justify-between">
                  <span className="text-[#6B7280] dark:text-[#94A3B8]">Archive Reference</span>
                  <span className="text-[#34435A] dark:text-[#3FC3B6] font-bold">OIL-ARCHIVE-GLK-1996-BOX-12</span>
                </div>
                <div className="p-2.5 rounded-none bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] flex items-center justify-between">
                  <span className="text-[#6B7280] dark:text-[#94A3B8]">Human Verification Status</span>
                  <span className="text-[#3FAE68] font-bold">Confirmed by Sr. Geologist (2026)</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ─── Bottom Actions (Human-in-the-Loop) ─── */}
        <div className="p-4 border-t border-[#E2E5E8] dark:border-[#364356] bg-[#F5F7F8] dark:bg-[#1E2532] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-[#6B7280] dark:text-[#94A3B8]">
            {verificationState === 'confirmed' ? (
              <span className="text-[#3FAE68] font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Extraction verified by engineer
              </span>
            ) : verificationState === 'flagged' ? (
              <span className="text-[#ED1C24] font-bold flex items-center gap-1">
                <Flag className="w-3.5 h-3.5" /> Flagged for OCR manual re-review
              </span>
            ) : (
              <span>Reviewing archival evidence for decision-support</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setVerificationState('flagged')}
              className="px-3 py-1.5 rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] hover:bg-[#F5F7F8] dark:hover:bg-[#34435A] text-[#252B33] dark:text-white text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              Flag for Re-OCR
            </button>
            <button
              onClick={() => setVerificationState('confirmed')}
              className="px-4 py-1.5 rounded-none bg-[#3FAE68] hover:bg-[#2D8B50] text-white text-xs font-bold font-mono transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
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
