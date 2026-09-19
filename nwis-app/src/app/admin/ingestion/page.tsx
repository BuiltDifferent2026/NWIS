'use client';

import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { IngestionBatch } from '@/lib/data/types';
import { getIngestionBatches } from '@/lib/data/service';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  FileCheck, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowDown, 
  ArrowRight, 
  FileText, 
  Cpu, 
  Layers,
  AlertTriangle,
  Scale,
  Sparkles,
  Eye,
  Check,
  RotateCcw,
  Download,
  Filter,
  Search,
  ExternalLink,
  Code2,
  BookOpen,
  Info
} from 'lucide-react';
import { EvidenceInspectorDrawer } from '@/components/common/EvidenceInspectorDrawer';

export default function AdminIngestionPage() {
  const [batches, setBatches] = useState<IngestionBatch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<IngestionBatch | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'schema' | 'queue'>('preview');
  const [isReScanning, setIsReScanning] = useState<boolean>(false);

  useEffect(() => {
    async function loadBatches() {
      const data = await getIngestionBatches();
      setBatches(data);
      if (data.length > 0) setSelectedBatch(data[0]);
    }
    loadBatches();
  }, []);

  const totalDocs = batches.reduce((acc, b) => acc + b.totalDocuments, 0);
  const totalEvents = batches.reduce((acc, b) => acc + b.extractedEventsCount, 0);

  const handleReScan = () => {
    setIsReScanning(true);
    setTimeout(() => {
      setIsReScanning(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-[1520px] mx-auto pb-12 animate-in fade-in duration-150">
      
      {/* ─── Breadcrumb ─── */}
      <Breadcrumb
        items={[
          { label: 'Basin Console', href: '/' },
          { label: 'Archive & Evidence' },
          { label: 'Hybrid Ingestion Pipeline' }
        ]}
      />

      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1 border-b border-neutral-200 dark:border-[#1a2333]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-mono">
              Hybrid Ingestion Pipeline &amp; OCR Pedigree
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
            Two-path ingestion converting structured real-time eRTMAC databases and 130+ years of historical scanned WCR/DDR archives into unified, audit-compliant drilling event schemas.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Badge className="text-xs font-mono font-bold bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30 py-1.5 px-3">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5 inline text-amber-600 dark:text-amber-400" />
            OISD-GDN-178 &amp; DGMS AUDIT READY
          </Badge>
          <button
            type="button"
            onClick={handleReScan}
            disabled={isReScanning}
            className="px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-[#222d42] bg-white dark:bg-[#101420] hover:bg-neutral-50 dark:hover:bg-[#161c2c] text-neutral-800 dark:text-neutral-200 text-xs font-mono font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-amber-600 dark:text-amber-400 ${isReScanning ? 'animate-spin' : ''}`} />
            <span>{isReScanning ? 'Scanning...' : 'Trigger Re-Scan'}</span>
          </button>
        </div>
      </div>

      {/* ─── Two-Path Pipeline Architecture Diagram ─── */}
      <div className="rounded-2xl border border-neutral-200 dark:border-[#1e273b] bg-white dark:bg-[#0c0f17] p-5 shadow-xs space-y-5 transition-colors">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200 dark:border-[#1a2233]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold font-mono text-neutral-950 dark:text-white uppercase tracking-wider">
                Two-Path Convergence Engine Architecture
              </h2>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                Decoupled ingestion streams merging deterministic live telemetry with layout-aware archival computer vision
              </span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-[#161c28] text-neutral-700 dark:text-neutral-300 text-[10px] font-mono font-bold border border-neutral-200 dark:border-neutral-700">
            CONVERGENCE RATIO: 100%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* ─── Path A: Structured Data ─── */}
          <div className="p-4 rounded-xl bg-neutral-50/80 dark:bg-[#111624] border border-neutral-200 dark:border-[#1e273b] space-y-3.5 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-mono font-extrabold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  PATH A: STRUCTURED DATA
                </span>
                <span className="text-[11px] font-mono font-semibold text-neutral-600 dark:text-neutral-400">
                  eRTMAC DB / CSV / WITSML
                </span>
              </div>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-sans">
                Deterministic real-time sensor streams and structured relational well databases.
              </p>
            </div>
            
            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-lg bg-white dark:bg-[#0c0f17] border border-neutral-200 dark:border-[#1a2333] shadow-2xs">
                <div className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 mb-0.5">Stage 01 · Input Ingestion</div>
                <div className="text-neutral-900 dark:text-neutral-100 font-semibold">
                  eRTMAC live dump, SQL tables, and WITSML 1.4/2.0 sensor feeds
                </div>
              </div>

              <div className="flex justify-center text-neutral-400 dark:text-neutral-600 font-bold">
                <ArrowDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-[#0c0f17] border border-neutral-200 dark:border-[#1a2333] shadow-2xs">
                <div className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 mb-0.5">Stage 02 · Schema Mapping &amp; Normalization</div>
                <div className="text-neutral-900 dark:text-neutral-100 font-semibold">
                  Unit harmonization: <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-emerald-700 dark:text-emerald-400 font-bold">ft → m</code>, <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-emerald-700 dark:text-emerald-400 font-bold">lbs → kft·lb</code>, <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-emerald-700 dark:text-emerald-400 font-bold">psi → ppg</code>
                </div>
              </div>

              <div className="flex justify-center text-neutral-400 dark:text-neutral-600 font-bold">
                <ArrowDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>

              {/* High-Contrast Crisp Output Box */}
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/70 dark:border-emerald-500 text-neutral-950 dark:text-emerald-100 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-extrabold text-emerald-900 dark:text-emerald-300 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>OUTPUT TAG: STRUCTURED-HIGH</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200 text-[10px] font-extrabold">
                    CONFIDENCE: 1.00
                  </span>
                </div>
                <p className="text-[11px] text-emerald-900/80 dark:text-emerald-300/90 font-sans mt-1">
                  100% deterministic truth. Direct mapping with zero optical ambiguity.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Path B: Unstructured Archival OCR ─── */}
          <div className="p-4 rounded-xl bg-neutral-50/80 dark:bg-[#111624] border border-neutral-200 dark:border-[#1e273b] space-y-3.5 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-mono font-extrabold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  PATH B: UNSTRUCTURED ARCHIVAL OCR
                </span>
                <span className="text-[11px] font-mono font-semibold text-neutral-600 dark:text-neutral-400">
                  Scanned WCRs / DDRs (1889–2020)
                </span>
              </div>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-sans">
                Computer vision &amp; NLP extraction over 130+ years of typewritten physical archives.
              </p>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-lg bg-white dark:bg-[#0c0f17] border border-neutral-200 dark:border-[#1a2333] shadow-2xs">
                <div className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 mb-0.5">Stage 01 · Page Layout Segmentation</div>
                <div className="text-neutral-900 dark:text-neutral-100 font-semibold">
                  LayoutLMv3 bounding-box detection (Table grid vs handwriting vs narrative log)
                </div>
              </div>

              <div className="flex justify-center text-neutral-400 dark:text-neutral-600 font-bold">
                <ArrowDown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-[#0c0f17] border border-neutral-200 dark:border-[#1a2333] shadow-2xs">
                <div className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 mb-0.5">Stage 02 · Layout-Aware OCR &amp; Stratigraphic NLP</div>
                <div className="text-neutral-900 dark:text-neutral-100 font-semibold">
                  Tesseract 5 + Assam geological dictionary (Tipam, Barail, Kopili, Girujan)
                </div>
              </div>

              <div className="flex justify-center text-neutral-400 dark:text-neutral-600 font-bold">
                <ArrowDown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>

              {/* High-Contrast Crisp Output Box */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-500/70 dark:border-amber-500 text-neutral-950 dark:text-amber-100 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-extrabold text-amber-900 dark:text-amber-300 text-xs">
                    <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>OUTPUT: 3-TIER STRATIFICATION</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-neutral-600 dark:text-neutral-400">
                    AUTOMATED + AUDIT
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1.5 font-mono text-[10px] font-extrabold">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    OCR-HIGH (≥90%)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    OCR-MED (75–89%)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
                    MANUAL-REVIEW (&lt;75%)
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ─── Common Target Schema & Governance Guarantee Banner ─── */}
        <div className="p-4 sm:p-5 rounded-xl bg-neutral-50 dark:bg-[#070b13] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#1e273b] shadow-xs space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span className="font-mono font-extrabold text-xs sm:text-sm text-neutral-950 dark:text-white uppercase tracking-wider">
                  Common Target Schema &amp; Strict Governance Guarantee
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed max-w-3xl">
                Both structured databases and archival OCR records normalize into the identical strictly-typed schema before indexing into the vector database.
              </p>
            </div>

            <div className="px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-900 dark:text-amber-200 text-xs font-mono shrink-0">
              <strong className="text-amber-800 dark:text-amber-300 font-bold uppercase text-[10px] block">Mandatory DGMS Safety Policy:</strong>
              <span>Low-confidence (OCR-LOW) data is strictly quarantined from triggering high-severity lookahead alarms.</span>
            </div>
          </div>

          {/* Syntax Highlighted Schema Pill Box */}
          <div className="p-3 rounded-lg bg-white dark:bg-black/60 border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono flex flex-wrap items-center gap-2 shadow-2xs">
            <span className="text-neutral-500 dark:text-neutral-400 font-bold uppercase text-[10px]">Unified Event Model:</span>
            <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-amber-800 dark:text-amber-300 border border-neutral-200 dark:border-neutral-700 font-bold">well_id</span>
            <span className="text-neutral-400 dark:text-neutral-500">•</span>
            <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-emerald-800 dark:text-emerald-300 border border-neutral-200 dark:border-neutral-700 font-bold">formation</span>
            <span className="text-neutral-400 dark:text-neutral-500">•</span>
            <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-sky-800 dark:text-sky-300 border border-neutral-200 dark:border-neutral-700 font-bold">depth_md</span>
            <span className="text-neutral-400 dark:text-neutral-500">•</span>
            <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-rose-800 dark:text-rose-300 border border-neutral-200 dark:border-neutral-700 font-bold">incident_event</span>
            <span className="text-neutral-400 dark:text-neutral-500">•</span>
            <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-amber-800 dark:text-amber-200 border border-neutral-200 dark:border-neutral-700 font-bold">root_cause</span>
            <span className="text-neutral-400 dark:text-neutral-500">•</span>
            <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-purple-800 dark:text-purple-300 border border-neutral-200 dark:border-neutral-700 font-bold">mitigation_applied</span>
            <span className="text-neutral-400 dark:text-neutral-500">•</span>
            <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-cyan-800 dark:text-cyan-300 border border-neutral-200 dark:border-neutral-700 font-bold">npt_hours</span>
            <span className="text-neutral-400 dark:text-neutral-500">•</span>
            <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-emerald-800 dark:text-emerald-300 border border-neutral-200 dark:border-neutral-700 font-bold">confidence_tier</span>
            <span className="text-neutral-400 dark:text-neutral-500">•</span>
            <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 font-bold">provenance_ref</span>
          </div>
        </div>

      </div>

      {/* ─── Summary KPI Metrics ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="rounded-2xl border border-neutral-200 dark:border-[#1e273b] bg-white dark:bg-[#0c0f17] p-4 shadow-xs space-y-1.5 transition-colors">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="uppercase text-[10px] font-mono font-bold tracking-wider">TOTAL ARCHIVAL RECORDS</span>
            <BookOpen className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-950 dark:text-white">
            {totalDocs} Scanned
          </div>
          <div className="flex items-center justify-between text-xs font-mono pt-1 text-neutral-600 dark:text-neutral-400 border-t border-neutral-100 dark:border-[#1a2333]">
            <span>Assam Basin Archives</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">6 Fields Ingested</span>
          </div>
        </Card>

        <Card className="rounded-2xl border border-neutral-200 dark:border-[#1e273b] bg-white dark:bg-[#0c0f17] p-4 shadow-xs space-y-1.5 transition-colors">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="uppercase text-[10px] font-mono font-bold tracking-wider">EXTRACTED DRILLING EVENTS</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-700 dark:text-amber-400">
            {totalEvents} Incidents
          </div>
          <div className="flex items-center justify-between text-xs font-mono pt-1 text-neutral-600 dark:text-neutral-400 border-t border-neutral-100 dark:border-[#1a2333]">
            <span>Mud losses &amp; kicks</span>
            <span className="text-amber-700 dark:text-amber-400 font-bold">64 Severe Losses</span>
          </div>
        </Card>

        <Card className="rounded-2xl border border-neutral-200 dark:border-[#1e273b] bg-white dark:bg-[#0c0f17] p-4 shadow-xs space-y-1.5 transition-colors">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="uppercase text-[10px] font-mono font-bold tracking-wider">STRUCTURED PRECISION</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400">
            94.2% High Conf.
          </div>
          <div className="flex items-center justify-between text-xs font-mono pt-1 text-neutral-600 dark:text-neutral-400 border-t border-neutral-100 dark:border-[#1a2333]">
            <span>Structured + OCR-High</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">Verified Tiers</span>
          </div>
        </Card>

        <Card className="rounded-2xl border border-neutral-200 dark:border-[#1e273b] bg-white dark:bg-[#0c0f17] p-4 shadow-xs space-y-1.5 transition-colors">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
            <span className="uppercase text-[10px] font-mono font-bold tracking-wider">HUMAN REVIEW QUEUE</span>
            <Scale className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-950 dark:text-white">
            12 Pending
          </div>
          <div className="flex items-center justify-between text-xs font-mono pt-1 text-neutral-600 dark:text-neutral-400 border-t border-neutral-100 dark:border-[#1a2333]">
            <span>Awaiting Superintendent</span>
            <span className="text-rose-700 dark:text-rose-400 font-bold">Manual Flagged</span>
          </div>
        </Card>

      </div>

      {/* ─── Batches Table & Deep-Dive Deck ─── */}
      <Card className="rounded-2xl border border-neutral-200 dark:border-[#1e273b] bg-white dark:bg-[#0c0f17] shadow-xs overflow-hidden transition-colors">
        
        {/* Table Header Controls */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-[#1a2233] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-neutral-950 dark:text-white font-mono">
              Archival Ingestion Batches &amp; OCR Confidence Distribution
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-sans mt-0.5">
              Click any batch row to inspect underlying OCR character recognitions, metadata confidence tiers, and provenance trails.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono bg-neutral-50 dark:bg-[#121723] text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-[#1e2638] px-3 py-1">
              {batches.length} Vectorized Batches
            </Badge>
          </div>
        </div>

        {/* High-Contrast Crisp Batches Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-neutral-100 dark:bg-[#111624] border-b border-neutral-200 dark:border-[#1a2233] text-[11px] text-neutral-800 dark:text-neutral-300 font-extrabold">
                <th className="p-3.5 text-left">BATCH IDENTIFIER</th>
                <th className="p-3.5 text-left">SOURCE TYPE</th>
                <th className="p-3.5 text-left">INGESTION DATE</th>
                <th className="p-3.5 text-left">DOCUMENTS</th>
                <th className="p-3.5 text-left">EVENTS</th>
                <th className="p-3.5 text-left min-w-[220px]">CONFIDENCE BREAKDOWN</th>
                <th className="p-3.5 text-left">STATUS</th>
                <th className="p-3.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-[#182030] text-neutral-900 dark:text-neutral-100">
              {batches.map((batch) => {
                const isSelected = selectedBatch?.id === batch.id;
                const highCount = batch.confidenceDistribution.structuredHigh + batch.confidenceDistribution.ocrHigh;
                const medCount = batch.confidenceDistribution.ocrMedium;
                const lowCount = batch.confidenceDistribution.ocrLow;
                const totalDist = Math.max(1, highCount + medCount + lowCount);
                const highPct = (highCount / totalDist) * 100;
                const medPct = (medCount / totalDist) * 100;
                const lowPct = (lowCount / totalDist) * 100;

                return (
                  <tr
                    key={batch.id}
                    onClick={() => setSelectedBatch(batch)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-amber-500/10 dark:bg-[#151c2c] border-l-4 border-l-amber-500'
                        : 'hover:bg-neutral-50 dark:hover:bg-[#0f1420]'
                    }`}
                  >
                    <td className="p-3.5 font-bold text-neutral-950 dark:text-white">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>{batch.batchName}</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300 font-bold uppercase text-[10px] border border-neutral-200 dark:border-neutral-700">
                        {batch.sourceType.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-3.5 text-neutral-700 dark:text-neutral-300 font-semibold">
                      {batch.ingestionDate}
                    </td>

                    <td className="p-3.5 font-extrabold text-neutral-900 dark:text-neutral-100">
                      {batch.totalDocuments}
                    </td>

                    <td className="p-3.5 font-extrabold text-amber-700 dark:text-amber-400">
                      {batch.extractedEventsCount}
                    </td>

                    <td className="p-3.5">
                      <div className="space-y-1.5">
                        {/* Segmented Visual Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden flex">
                          <div style={{ width: `${highPct}%` }} className="h-full bg-emerald-500" title={`High: ${highCount}`} />
                          <div style={{ width: `${medPct}%` }} className="h-full bg-amber-500" title={`Med: ${medCount}`} />
                          <div style={{ width: `${lowPct}%` }} className="h-full bg-rose-500" title={`Low: ${lowCount}`} />
                        </div>
                        {/* High-Contrast Number Pills */}
                        <div className="flex items-center gap-1.5 text-[10px] font-extrabold font-mono">
                          <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                            {highCount} High
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                            {medCount} Med
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
                            {lowCount} Low
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1 w-max">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        {batch.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBatch(batch);
                          setIsInspectorOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold font-mono text-[11px] transition-all inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect OCR</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ─── Active Batch Deep-Dive Deck (In-Page Inspector) ─── */}
        {selectedBatch && (
          <div className="p-5 border-t-2 border-neutral-200 dark:border-[#1a2333] bg-neutral-50/70 dark:bg-[#090d16] space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-[#1a2333]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm font-mono text-neutral-950 dark:text-white">
                    Active Inspection: {selectedBatch.batchName}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                    Ingested on {selectedBatch.ingestionDate} · {selectedBatch.totalDocuments} Scanned Archives · {selectedBatch.extractedEventsCount} Calibrated Hazards
                  </p>
                </div>
              </div>

              {/* Sub-Tabs */}
              <div className="flex items-center gap-1 bg-neutral-200/80 dark:bg-[#121724] p-1 rounded-xl border border-neutral-300 dark:border-[#1c2438] text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    activeTab === 'preview'
                      ? 'bg-white dark:bg-[#1c2538] text-neutral-950 dark:text-white shadow-xs'
                      : 'text-neutral-700 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                  }`}
                >
                  OCR Text vs Schema
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('schema')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    activeTab === 'schema'
                      ? 'bg-white dark:bg-[#1c2538] text-neutral-950 dark:text-white shadow-xs'
                      : 'text-neutral-700 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                  }`}
                >
                  Engine Telemetry
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('queue')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    activeTab === 'queue'
                      ? 'bg-white dark:bg-[#1c2538] text-neutral-950 dark:text-white shadow-xs'
                      : 'text-neutral-700 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                  }`}
                >
                  Verification Queue ({selectedBatch.confidenceDistribution.manualReview || 12})
                </button>
              </div>
            </div>

            {/* TAB 1: OCR Text vs Normalized Schema */}
            {activeTab === 'preview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                {/* Left: Raw Archival Scanned Typewriter Text */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#0e121a] border border-neutral-200 dark:border-[#1e273b] space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-[#1a2333]">
                    <span className="font-mono text-xs font-extrabold text-neutral-950 dark:text-white flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      RAW ARCHIVAL OCR OUTPUT (300 DPI SCAN)
                    </span>
                    <Badge className="bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-[10px] font-mono">
                      WCR-GLK-07-p19
                    </Badge>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#faf8f5] dark:bg-[#07090e] border border-amber-200 dark:border-[#1e273b] text-neutral-900 dark:text-neutral-200 font-mono text-xs leading-relaxed space-y-2">
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 italic">
                      [OIL INDIA LIMITED · WELL COMPLETION REPORT 1996 · SECTION 4.3]
                    </p>
                    <p>
                      &quot;...drilling 12-1/4 inch hole at <strong className="text-amber-900 dark:text-amber-300 bg-amber-200/60 dark:bg-amber-950/80 px-1">2280m MD</strong> in Upper Tipam Sandstone. Severe lost circulation occurred with pit drop of 18 m3. Pumped <strong className="text-amber-900 dark:text-amber-300 bg-amber-200/60 dark:bg-amber-950/80 px-1">45 bbls medium-nut-plug LCM pill (25 ppb)</strong>. Capped ECD at 10.4 ppg. Total lost time was <strong className="text-rose-900 dark:text-rose-300 bg-rose-200/60 dark:bg-rose-950/80 px-1">34 hours</strong> before circulation stabilized...&quot;
                    </p>
                    <div className="pt-2 text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800">
                      <span>OCR Engine: Tesseract 5.3 + LayoutLMv3</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">Confidence: 94.2%</span>
                    </div>
                  </div>
                </div>

                {/* Right: Normalized JSON Schema */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#0e121a] border border-neutral-200 dark:border-[#1e273b] space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-[#1a2333]">
                    <span className="font-mono text-xs font-extrabold text-neutral-950 dark:text-white flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      UNIFIED CANONICAL JSON EVENT RECORD
                    </span>
                    <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[10px] font-mono">
                      VALIDATED SCHEMA
                    </Badge>
                  </div>

                  <pre className="p-3.5 rounded-lg bg-neutral-100 dark:bg-black border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-900 dark:text-neutral-100 overflow-x-auto leading-relaxed">
{`{
  "well_id": "OIL-GLK-07",
  "formation": "Upper Tipam Sandstone",
  "depth_md": 2280.0,
  "incident_event": "SEVERE_LOST_CIRCULATION",
  "mud_loss_bbl": 420,
  "mitigation_applied": "45 bbl 25 ppb medium nut-plug LCM pill",
  "ecd_cap_ppg": 10.4,
  "npt_hours": 34.0,
  "confidence_tier": "OCR-HIGH",
  "source_provenance": "WCR-GLK-07-1996:p19",
  "verified_by_superintendent": true
}`}
                  </pre>
                </div>

              </div>
            )}

            {/* TAB 2: Engine Telemetry */}
            {activeTab === 'schema' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#0e121a] border border-neutral-200 dark:border-[#1e273b] space-y-1">
                  <span className="text-neutral-500 uppercase text-[10px] font-bold block">OCR ENGINE MODEL</span>
                  <strong className="text-neutral-950 dark:text-white text-sm block">Tesseract 5.3 + LayoutLMv3</strong>
                  <span className="text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">Word Accuracy: 95.8%</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-[#0e121a] border border-neutral-200 dark:border-[#1e273b] space-y-1">
                  <span className="text-neutral-500 uppercase text-[10px] font-bold block">PRE-PROCESSING FILTERS</span>
                  <strong className="text-neutral-950 dark:text-white text-sm block">Gaussian Deskew + Denoise</strong>
                  <span className="text-neutral-600 dark:text-neutral-400 text-[11px]">300 DPI Grayscale TIFF</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-[#0e121a] border border-neutral-200 dark:border-[#1e273b] space-y-1">
                  <span className="text-neutral-500 uppercase text-[10px] font-bold block">DOMAIN VOCABULARY</span>
                  <strong className="text-neutral-950 dark:text-white text-sm block">Assam Stratigraphic Lexicon</strong>
                  <span className="text-amber-700 dark:text-amber-400 text-[11px] font-bold">4,200 Geologic Terms</span>
                </div>
              </div>
            )}

            {/* TAB 3: Verification Queue */}
            {activeTab === 'queue' && (
              <div className="p-4 rounded-xl bg-white dark:bg-[#0e121a] border border-neutral-200 dark:border-[#1e273b] space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-950 dark:text-white">Flagged Low-Confidence Records Awaiting Superintendent Sign-off</span>
                  <Badge className="bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300">
                    12 Items in Queue
                  </Badge>
                </div>
                <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <strong className="text-neutral-950 dark:text-white">OIL-GLK-02 (1988 DDR #42)</strong>
                      <p className="text-neutral-600 dark:text-neutral-400 text-[11px] font-sans">
                        OCR read &quot;lost 240 bbls at 2,190m&quot; (Faded carbon-copy typewriter text). Conf score: 68%.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsInspectorOpen(true)}
                      className="px-2.5 py-1 rounded bg-amber-600 text-neutral-950 font-bold text-[11px]"
                    >
                      Audit Scan
                    </button>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <strong className="text-neutral-950 dark:text-white">OIL-DGB-112 (1974 Mud Log)</strong>
                      <p className="text-neutral-600 dark:text-neutral-400 text-[11px] font-sans">
                        Ambiguous formation boundary between Barail Main Sand and Kopili Shale. Conf score: 71%.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsInspectorOpen(true)}
                      className="px-2.5 py-1 rounded bg-amber-600 text-neutral-950 font-bold text-[11px]"
                    >
                      Audit Scan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono">
              <span className="text-neutral-600 dark:text-neutral-400">
                Vector Embedding Engine: <strong className="text-neutral-900 dark:text-neutral-200">bge-large-en-v1.5 (Air-Gapped Local Embeddings)</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsInspectorOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-950 font-extrabold font-mono transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Launch Archival Document Inspector Drawer</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </Card>

      {/* ─── Evidence Inspector Drawer ─── */}
      <EvidenceInspectorDrawer
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        wellName={selectedBatch?.id === 'batch-2026-07' ? 'OIL-DGB-88' : 'OIL-GLK-07'}
        sourceRef={selectedBatch?.id === 'batch-2026-07' ? 'WCR-DGB-88-1978 · Page 12' : 'WCR-GLK-07-1996 · Page 19'}
        incidentDepth={selectedBatch?.id === 'batch-2026-07' ? 1840 : 2280}
        formationName={selectedBatch?.id === 'batch-2026-07' ? 'Barail Coal-Shale Unit' : 'Upper Tipam Sandstone'}
        confidence="OCR-HIGH"
        nptHours={selectedBatch?.id === 'batch-2026-07' ? 48 : 34}
        mitigationApplied={selectedBatch?.id === 'batch-2026-07' ? 'Squeeze cemented perfs at 1,835m; raised barite mud to 11.2 ppg.' : '45 bbl medium-nut-plug LCM pill spotted; ECD capped @ 10.4 ppg.'}
      />

    </div>
  );
}
