'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
    <div className="space-y-6 max-w-[1520px] mx-auto pb-12 animate-in fade-in duration-150 text-[#252B33] dark:text-white">
      
      {/* ─── Breadcrumb ─── */}
      <Breadcrumb
        items={[
          { label: 'Basin Console', href: '/' },
          { label: 'Archive & Evidence' },
          { label: 'Hybrid Ingestion Pipeline' }
        ]}
      />

      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#E2E5E8] dark:border-[#364356]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-none bg-[#3FAE68] animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#252B33] dark:text-white font-mono">
              Hybrid Ingestion Pipeline &amp; OCR Pedigree
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#94A3B8] max-w-3xl leading-relaxed font-sans">
            Two-path ingestion converting structured real-time eRTMAC databases and 130+ years of historical scanned WCR/DDR archives into unified, audit-compliant drilling event schemas.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/admin/sources"
            className="px-3 py-1.5 rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#1E2532] hover:bg-[#F5F7F8] dark:hover:bg-[#34435A] text-[#252B33] dark:text-white text-xs font-mono font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#3FC3B6]" />
            <span>Document Register</span>
            <ArrowRight className="w-3 h-3 text-[#6B7280] dark:text-[#94A3B8]" />
          </Link>

          <Badge className="text-xs font-mono font-bold bg-[#D9F2EE] dark:bg-[#3FC3B6]/20 text-[#26A69A] dark:text-[#3FC3B6] border border-[#3FC3B6] py-1.5 px-3 rounded-none">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5 inline text-[#26A69A] dark:text-[#3FC3B6]" />
            OISD-GDN-178 &amp; DGMS AUDIT READY
          </Badge>
          <button
            type="button"
            onClick={handleReScan}
            disabled={isReScanning}
            className="px-3 py-1.5 rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#1E2532] hover:bg-[#F5F7F8] dark:hover:bg-[#34435A] text-[#252B33] dark:text-white text-xs font-mono font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-[#34435A] dark:text-[#3FC3B6] ${isReScanning ? 'animate-spin' : ''}`} />
            <span>{isReScanning ? 'Scanning...' : 'Trigger Re-Scan'}</span>
          </button>
        </div>
      </div>

      {/* ─── Two-Path Pipeline Architecture Diagram ─── */}
      <div className="rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] p-5 shadow-2xs space-y-5 transition-colors">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2E5E8] dark:border-[#364356]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-none bg-[#D9F2EE] dark:bg-[#3FC3B6]/20 border border-[#3FC3B6] flex items-center justify-center text-[#26A69A] dark:text-[#3FC3B6]">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold font-mono text-[#252B33] dark:text-white uppercase tracking-wider">
                Two-Path Convergence Engine Architecture
              </h2>
              <span className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] font-mono">
                Decoupled ingestion streams merging deterministic live telemetry with layout-aware archival computer vision
              </span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-none bg-[#F5F7F8] dark:bg-[#1E2532] text-[#252B33] dark:text-white text-[10px] font-mono font-bold border border-[#E2E5E8] dark:border-[#364356]">
            CONVERGENCE RATIO: 100%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* ─── Path A: Structured Data ─── */}
          <div className="p-4 rounded-none bg-[#F5F7F8] dark:bg-[#1E2532] border border-[#E2E5E8] dark:border-[#364356] space-y-3.5 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-none bg-[#D9F2EE] dark:bg-[#3FC3B6]/20 text-[#26A69A] dark:text-[#3FC3B6] border border-[#3FC3B6] text-xs font-mono font-extrabold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#26A69A] dark:text-[#3FC3B6]" />
                  PATH A: STRUCTURED DATA
                </span>
                <span className="text-[11px] font-mono font-semibold text-[#6B7280] dark:text-[#94A3B8]">
                  eRTMAC DB / CSV / WITSML
                </span>
              </div>
              <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] font-sans">
                Deterministic real-time sensor streams and structured relational well databases.
              </p>
            </div>
            
            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-none bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] shadow-2xs">
                <div className="text-[10px] uppercase font-bold text-[#6B7280] dark:text-[#94A3B8] mb-0.5">Stage 01 · Input Ingestion</div>
                <div className="text-[#252B33] dark:text-white font-semibold">
                  eRTMAC live dump, SQL tables, and WITSML 1.4/2.0 sensor feeds
                </div>
              </div>

              <div className="flex justify-center text-[#26A69A] dark:text-[#3FC3B6] font-bold">
                <ArrowDown className="w-4 h-4 text-[#26A69A] dark:text-[#3FC3B6]" />
              </div>

              <div className="p-3 rounded-none bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] shadow-2xs">
                <div className="text-[10px] uppercase font-bold text-[#6B7280] dark:text-[#94A3B8] mb-0.5">Stage 02 · Schema Mapping &amp; Normalization</div>
                <div className="text-[#252B33] dark:text-white font-semibold">
                  Unit harmonization: <code className="bg-[#D9F2EE] dark:bg-[#3FC3B6]/20 text-[#26A69A] dark:text-[#3FC3B6] px-1 py-0.5 font-bold">ft → m</code>, <code className="bg-[#D9F2EE] dark:bg-[#3FC3B6]/20 text-[#26A69A] dark:text-[#3FC3B6] px-1 py-0.5 font-bold">lbs → kft·lb</code>, <code className="bg-[#D9F2EE] dark:bg-[#3FC3B6]/20 text-[#26A69A] dark:text-[#3FC3B6] px-1 py-0.5 font-bold">psi → ppg</code>
                </div>
              </div>

              <div className="flex justify-center text-[#26A69A] dark:text-[#3FC3B6] font-bold">
                <ArrowDown className="w-4 h-4 text-[#26A69A] dark:text-[#3FC3B6]" />
              </div>

              {/* High-Contrast Crisp Output Box */}
              <div className="p-3 rounded-none bg-[#D9F2EE]/40 dark:bg-[#3FC3B6]/15 border-2 border-[#3FC3B6] text-[#252B33] dark:text-white shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-extrabold text-[#26A69A] dark:text-[#3FC3B6] text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#26A69A] dark:text-[#3FC3B6]" />
                    <span>OUTPUT TAG: STRUCTURED-HIGH</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-none bg-[#26A69A] dark:bg-[#3FC3B6] text-white dark:text-[#191E26] text-[10px] font-extrabold">
                    CONFIDENCE: 1.00
                  </span>
                </div>
                <p className="text-[11px] text-[#252B33] dark:text-[#94A3B8] font-sans mt-1">
                  100% deterministic truth. Direct mapping with zero optical ambiguity.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Path B: Unstructured Archival OCR ─── */}
          <div className="p-4 rounded-none bg-[#F5F7F8] dark:bg-[#1E2532] border border-[#E2E5E8] dark:border-[#364356] space-y-3.5 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-none bg-[#FDF2F2] dark:bg-[#ED1C24]/20 text-[#ED1C24] border border-[#E05252] text-xs font-mono font-extrabold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#ED1C24]" />
                  PATH B: UNSTRUCTURED ARCHIVAL OCR
                </span>
                <span className="text-[11px] font-mono font-semibold text-[#6B7280] dark:text-[#94A3B8]">
                  Scanned WCRs / DDRs (1889–2020)
                </span>
              </div>
              <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] font-sans">
                Computer vision &amp; NLP extraction over 130+ years of typewritten physical archives.
              </p>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-none bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] shadow-2xs">
                <div className="text-[10px] uppercase font-bold text-[#6B7280] dark:text-[#94A3B8] mb-0.5">Stage 01 · Page Layout Segmentation</div>
                <div className="text-[#252B33] dark:text-white font-semibold">
                  LayoutLMv3 bounding-box detection (Table grid vs handwriting vs narrative log)
                </div>
              </div>

              <div className="flex justify-center text-[#ED1C24] font-bold">
                <ArrowDown className="w-4 h-4 text-[#ED1C24]" />
              </div>

              <div className="p-3 rounded-none bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] shadow-2xs">
                <div className="text-[10px] uppercase font-bold text-[#6B7280] dark:text-[#94A3B8] mb-0.5">Stage 02 · Layout-Aware OCR &amp; Stratigraphic NLP</div>
                <div className="text-[#252B33] dark:text-white font-semibold">
                  Tesseract 5 + Assam geological dictionary (Tipam, Barail, Kopili, Girujan)
                </div>
              </div>

              <div className="flex justify-center text-[#ED1C24] font-bold">
                <ArrowDown className="w-4 h-4 text-[#ED1C24]" />
              </div>

              {/* High-Contrast Crisp Output Box */}
              <div className="p-3 rounded-none bg-[#FDF2F2]/40 dark:bg-[#ED1C24]/15 border-2 border-[#ED1C24] text-[#252B33] dark:text-white shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-extrabold text-[#ED1C24] text-xs">
                    <Sparkles className="w-4 h-4 text-[#ED1C24]" />
                    <span>OUTPUT: 3-TIER STRATIFICATION</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#6B7280] dark:text-[#94A3B8]">
                    AUTOMATED + AUDIT
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1.5 font-mono text-[10px] font-extrabold">
                  <span className="px-2 py-0.5 rounded-none bg-[#D9F2EE] dark:bg-[#3FC3B6]/20 text-[#26A69A] dark:text-[#3FC3B6] border border-[#3FC3B6]">
                    OCR-HIGH (≥90%)
                  </span>
                  <span className="px-2 py-0.5 rounded-none bg-[#FEF9EE] dark:bg-[#F2B84B]/20 text-[#C68A1B] dark:text-[#F2B84B] border border-[#F2B84B]">
                    OCR-MED (75–89%)
                  </span>
                  <span className="px-2 py-0.5 rounded-none bg-[#FDF2F2] dark:bg-[#ED1C24]/20 text-[#ED1C24] border border-[#E05252]">
                    MANUAL-REVIEW (&lt;75%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Summary KPI Metrics ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] p-4 shadow-2xs space-y-1.5 transition-colors">
          <div className="flex items-center justify-between text-[#6B7280] dark:text-[#94A3B8]">
            <span className="uppercase text-[10px] font-mono font-bold tracking-wider">TOTAL ARCHIVAL RECORDS</span>
            <BookOpen className="w-4 h-4 text-[#3FC3B6]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#252B33] dark:text-white">
            {totalDocs} Scanned
          </div>
          <div className="flex items-center justify-between text-xs font-mono pt-1 text-[#6B7280] dark:text-[#94A3B8] border-t border-[#E2E5E8] dark:border-[#364356]">
            <span>Assam Basin Archives</span>
            <span className="text-[#3FAE68] font-bold">6 Fields Ingested</span>
          </div>
        </Card>

        <Card className="rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] p-4 shadow-2xs space-y-1.5 transition-colors">
          <div className="flex items-center justify-between text-[#6B7280] dark:text-[#94A3B8]">
            <span className="uppercase text-[10px] font-mono font-bold tracking-wider">EXTRACTED DRILLING EVENTS</span>
            <AlertTriangle className="w-4 h-4 text-[#F2B84B]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#ED1C24]">
            {totalEvents} Incidents
          </div>
          <div className="flex items-center justify-between text-xs font-mono pt-1 text-[#6B7280] dark:text-[#94A3B8] border-t border-[#E2E5E8] dark:border-[#364356]">
            <span>Mud losses &amp; kicks</span>
            <span className="text-[#ED1C24] font-bold">64 Severe Losses</span>
          </div>
        </Card>

        <Card className="rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] p-4 shadow-2xs space-y-1.5 transition-colors">
          <div className="flex items-center justify-between text-[#6B7280] dark:text-[#94A3B8]">
            <span className="uppercase text-[10px] font-mono font-bold tracking-wider">STRUCTURED PRECISION</span>
            <CheckCircle2 className="w-4 h-4 text-[#26A69A] dark:text-[#3FC3B6]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#26A69A] dark:text-[#3FC3B6]">
            94.2% High Conf.
          </div>
          <div className="flex items-center justify-between text-xs font-mono pt-1 text-[#6B7280] dark:text-[#94A3B8] border-t border-[#E2E5E8] dark:border-[#364356]">
            <span>Structured + OCR-High</span>
            <span className="text-[#26A69A] dark:text-[#3FC3B6] font-bold">Verified Tiers</span>
          </div>
        </Card>

        <Card className="rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] p-4 shadow-2xs space-y-1.5 transition-colors">
          <div className="flex items-center justify-between text-[#6B7280] dark:text-[#94A3B8]">
            <span className="uppercase text-[10px] font-mono font-bold tracking-wider">HUMAN REVIEW QUEUE</span>
            <Scale className="w-4 h-4 text-[#3FC3B6]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#252B33] dark:text-white">
            12 Pending
          </div>
          <div className="flex items-center justify-between text-xs font-mono pt-1 text-[#6B7280] dark:text-[#94A3B8] border-t border-[#E2E5E8] dark:border-[#364356]">
            <span>Awaiting Superintendent</span>
            <span className="text-[#ED1C24] font-bold">Manual Flagged</span>
          </div>
        </Card>

      </div>

      {/* ─── Batches Table & Deep-Dive Deck ─── */}
      <Card className="rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] shadow-2xs overflow-hidden transition-colors">
        
        {/* Table Header Controls */}
        <div className="p-4 sm:p-5 border-b border-[#E2E5E8] dark:border-[#364356] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F5F7F8] dark:bg-[#1E2532]">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-[#252B33] dark:text-white font-mono">
              Archival Ingestion Batches &amp; OCR Confidence Distribution
            </h2>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] font-sans mt-0.5">
              Click any batch row to inspect underlying OCR character recognitions, metadata confidence tiers, and provenance trails.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono bg-white dark:bg-[#1E2532] text-[#252B33] dark:text-white border-[#E2E5E8] dark:border-[#364356] px-3 py-1 rounded-none">
              {batches.length} Vectorized Batches
            </Badge>
          </div>
        </div>

        {/* High-Contrast Crisp Batches Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-[#F5F7F8] dark:bg-[#1E2532] border-b border-[#E2E5E8] dark:border-[#364356] text-[11px] text-[#252B33] dark:text-white font-extrabold">
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
            <tbody className="divide-y divide-[#E2E5E8] dark:divide-[#364356] text-[#252B33] dark:text-white">
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
                        ? 'bg-[#D9F2EE]/30 dark:bg-[#3FC3B6]/15 border-l-4 border-l-[#26A69A] dark:border-l-[#3FC3B6]'
                        : 'hover:bg-[#F5F7F8] dark:hover:bg-[#1E2532]'
                    }`}
                  >
                    <td className="p-3.5 font-bold text-[#252B33] dark:text-white">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-[#3FC3B6] shrink-0" />
                        <span>{batch.batchName}</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-none bg-[#F5F7F8] dark:bg-[#191E26] text-[#252B33] dark:text-white font-bold uppercase text-[10px] border border-[#E2E5E8] dark:border-[#364356]">
                        {batch.sourceType.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-3.5 text-[#6B7280] dark:text-[#94A3B8] font-semibold">
                      {batch.ingestionDate}
                    </td>

                    <td className="p-3.5 font-extrabold text-[#252B33] dark:text-white">
                      {batch.totalDocuments}
                    </td>

                    <td className="p-3.5 font-extrabold text-[#ED1C24]">
                      {batch.extractedEventsCount}
                    </td>

                    <td className="p-3.5">
                      <div className="space-y-1.5">
                        {/* Segmented Visual Progress Bar */}
                        <div className="w-full h-2 rounded-none bg-[#E2E5E8] dark:bg-[#191E26] overflow-hidden flex">
                          <div style={{ width: `${highPct}%` }} className="h-full bg-[#26A69A] dark:bg-[#3FC3B6]" title={`High: ${highCount}`} />
                          <div style={{ width: `${medPct}%` }} className="h-full bg-[#F2B84B]" title={`Med: ${medCount}`} />
                          <div style={{ width: `${lowPct}%` }} className="h-full bg-[#ED1C24]" title={`Low: ${lowCount}`} />
                        </div>
                        {/* High-Contrast Number Pills */}
                        <div className="flex items-center gap-1.5 text-[10px] font-extrabold font-mono">
                          <span className="px-1.5 py-0.2 rounded-none bg-[#D9F2EE] dark:bg-[#3FC3B6]/20 text-[#26A69A] dark:text-[#3FC3B6] border border-[#3FC3B6]">
                            {highCount} High
                          </span>
                          <span className="px-1.5 py-0.2 rounded-none bg-[#FEF9EE] dark:bg-[#F2B84B]/20 text-[#C68A1B] dark:text-[#F2B84B] border border-[#F2B84B]">
                            {medCount} Med
                          </span>
                          <span className="px-1.5 py-0.2 rounded-none bg-[#FDF2F2] dark:bg-[#ED1C24]/20 text-[#ED1C24] border border-[#E05252]">
                            {lowCount} Low
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-none text-[10px] font-extrabold bg-[#D9F2EE] dark:bg-[#3FC3B6]/20 text-[#26A69A] dark:text-[#3FC3B6] border border-[#3FC3B6] flex items-center gap-1 w-max">
                        <span className="w-1.5 h-1.5 rounded-none bg-[#3FAE68] inline-block" />
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
                        className="px-3 py-1.5 rounded-none bg-[#ED1C24] hover:bg-[#C9141B] text-white font-bold font-mono text-[11px] transition-all inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
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
          <div className="p-5 border-t-2 border-[#E2E5E8] dark:border-[#364356] bg-[#F5F7F8] dark:bg-[#1E2532] space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E5E8] dark:border-[#364356]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-none bg-[#D9F2EE] dark:bg-[#3FC3B6]/20 text-[#26A69A] dark:text-[#3FC3B6] border border-[#3FC3B6] flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm font-mono text-[#252B33] dark:text-white">
                    Active Inspection: {selectedBatch.batchName}
                  </h3>
                  <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] font-mono">
                    Ingested on {selectedBatch.ingestionDate} · {selectedBatch.totalDocuments} Scanned Archives · {selectedBatch.extractedEventsCount} Calibrated Hazards
                  </p>
                </div>
              </div>

              {/* Sub-Tabs */}
              <div className="flex items-center gap-1 bg-[#E2E5E8] dark:bg-[#242D3B] p-1 rounded-none border border-[#E2E5E8] dark:border-[#364356] text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 rounded-none font-bold transition-colors cursor-pointer ${
                    activeTab === 'preview'
                      ? 'bg-[#34435A] dark:bg-[#3FC3B6] text-white dark:text-[#191E26] shadow-2xs'
                      : 'text-[#6B7280] dark:text-[#94A3B8] hover:text-[#252B33] dark:hover:text-white'
                  }`}
                >
                  OCR Text vs Schema
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('schema')}
                  className={`px-3 py-1 rounded-none font-bold transition-colors cursor-pointer ${
                    activeTab === 'schema'
                      ? 'bg-[#34435A] dark:bg-[#3FC3B6] text-white dark:text-[#191E26] shadow-2xs'
                      : 'text-[#6B7280] dark:text-[#94A3B8] hover:text-[#252B33] dark:hover:text-white'
                  }`}
                >
                  Engine Telemetry
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('queue')}
                  className={`px-3 py-1 rounded-none font-bold transition-colors cursor-pointer ${
                    activeTab === 'queue'
                      ? 'bg-[#34435A] dark:bg-[#3FC3B6] text-white dark:text-[#191E26] shadow-2xs'
                      : 'text-[#6B7280] dark:text-[#94A3B8] hover:text-[#252B33] dark:hover:text-white'
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
                <div className="p-4 rounded-none bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E5E8] dark:border-[#364356]">
                    <span className="font-mono text-xs font-extrabold text-[#252B33] dark:text-white flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#3FC3B6]" />
                      RAW ARCHIVAL OCR OUTPUT (300 DPI SCAN)
                    </span>
                    <Badge className="bg-[#D9F2EE] dark:bg-[#3FC3B6]/20 text-[#26A69A] dark:text-[#3FC3B6] border border-[#3FC3B6] text-[10px] font-mono rounded-none">
                      WCR-GLK-07-p19
                    </Badge>
                  </div>

                  <div className="p-3.5 rounded-none bg-[#F5F7F8] dark:bg-[#191E26] border border-[#E2E5E8] dark:border-[#364356] text-[#252B33] dark:text-white font-mono text-xs leading-relaxed space-y-2">
                    <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] italic">
                      [OIL INDIA LIMITED · WELL COMPLETION REPORT 1996 · SECTION 4.3]
                    </p>
                    <p>
                      &quot;...drilling 12-1/4 inch hole at <strong className="text-[#ED1C24] bg-[#FDF2F2] dark:bg-[#ED1C24]/20 px-1 font-bold">2280m MD</strong> in Upper Tipam Sandstone. Severe lost circulation occurred with pit drop of 18 m3. Pumped <strong className="text-[#26A69A] dark:text-[#3FC3B6] bg-[#D9F2EE] dark:bg-[#3FC3B6]/20 px-1 font-bold">45 bbls medium-nut-plug LCM pill (25 ppb)</strong>. Capped ECD at 10.4 ppg. Total lost time was <strong className="text-[#ED1C24] bg-[#FDF2F2] dark:bg-[#ED1C24]/20 px-1 font-bold">34 hours</strong> before circulation stabilized...&quot;
                    </p>
                    <div className="pt-2 text-[10px] text-[#6B7280] dark:text-[#94A3B8] flex items-center justify-between border-t border-[#E2E5E8] dark:border-[#364356]">
                      <span>OCR Engine: Tesseract 5.3 + LayoutLMv3</span>
                      <span className="font-bold text-[#26A69A] dark:text-[#3FC3B6]">Confidence: 94.2%</span>
                    </div>
                  </div>
                </div>

                {/* Right: Normalized JSON Schema */}
                <div className="p-4 rounded-none bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E5E8] dark:border-[#364356]">
                    <span className="font-mono text-xs font-extrabold text-[#252B33] dark:text-white flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-[#26A69A] dark:text-[#3FC3B6]" />
                      UNIFIED CANONICAL JSON EVENT RECORD
                    </span>
                    <Badge className="bg-[#D9F2EE] dark:bg-[#3FC3B6]/20 text-[#26A69A] dark:text-[#3FC3B6] border border-[#3FC3B6] text-[10px] font-mono rounded-none">
                      VALIDATED SCHEMA
                    </Badge>
                  </div>

                  <pre className="p-3.5 rounded-none bg-[#191E26] border border-[#E2E5E8] dark:border-[#364356] text-[11px] font-mono text-[#3FC3B6] overflow-x-auto leading-relaxed">
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
                <div className="p-3.5 rounded-none bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] space-y-1">
                  <span className="text-[#6B7280] dark:text-[#94A3B8] uppercase text-[10px] font-bold block">OCR ENGINE MODEL</span>
                  <strong className="text-[#252B33] dark:text-white text-sm block">Tesseract 5.3 + LayoutLMv3</strong>
                  <span className="text-[#26A69A] dark:text-[#3FC3B6] text-[11px] font-bold">Word Accuracy: 95.8%</span>
                </div>

                <div className="p-3.5 rounded-none bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] space-y-1">
                  <span className="text-[#6B7280] dark:text-[#94A3B8] uppercase text-[10px] font-bold block">PRE-PROCESSING FILTERS</span>
                  <strong className="text-[#252B33] dark:text-white text-sm block">Gaussian Deskew + Denoise</strong>
                  <span className="text-[#6B7280] dark:text-[#94A3B8] text-[11px]">300 DPI Grayscale TIFF</span>
                </div>

                <div className="p-3.5 rounded-none bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] space-y-1">
                  <span className="text-[#6B7280] dark:text-[#94A3B8] uppercase text-[10px] font-bold block">DOMAIN VOCABULARY</span>
                  <strong className="text-[#252B33] dark:text-white text-sm block">Assam Stratigraphic Lexicon</strong>
                  <span className="text-[#26A69A] dark:text-[#3FC3B6] text-[11px] font-bold">4,200 Geologic Terms</span>
                </div>
              </div>
            )}

            {/* TAB 3: Verification Queue */}
            {activeTab === 'queue' && (
              <div className="p-4 rounded-none bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#252B33] dark:text-white">Flagged Low-Confidence Records Awaiting Superintendent Sign-off</span>
                  <Badge className="bg-[#FDF2F2] dark:bg-[#ED1C24]/20 text-[#ED1C24] border border-[#E05252] rounded-none">
                    12 Items in Queue
                  </Badge>
                </div>
                <div className="divide-y divide-[#E2E5E8] dark:divide-[#364356]">
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <strong className="text-[#252B33] dark:text-white">OIL-GLK-02 (1988 DDR #42)</strong>
                      <p className="text-[#6B7280] dark:text-[#94A3B8] text-[11px] font-sans">
                        OCR read &quot;lost 240 bbls at 2,190m&quot; (Faded carbon-copy typewriter text). Conf score: 68%.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsInspectorOpen(true)}
                      className="px-2.5 py-1 rounded-none bg-[#ED1C24] hover:bg-[#C9141B] text-white font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      Audit Scan
                    </button>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <strong className="text-[#252B33] dark:text-white">OIL-DGB-112 (1974 Mud Log)</strong>
                      <p className="text-[#6B7280] dark:text-[#94A3B8] text-[11px] font-sans">
                        Ambiguous formation boundary between Barail Main Sand and Kopili Shale. Conf score: 71%.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsInspectorOpen(true)}
                      className="px-2.5 py-1 rounded-none bg-[#ED1C24] hover:bg-[#C9141B] text-white font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      Audit Scan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono">
              <span className="text-[#6B7280] dark:text-[#94A3B8]">
                Vector Embedding Engine: <strong className="text-[#252B33] dark:text-white">bge-large-en-v1.5 (Air-Gapped Local Embeddings)</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsInspectorOpen(true)}
                  className="px-3.5 py-1.5 rounded-none bg-[#ED1C24] hover:bg-[#C9141B] text-white font-extrabold font-mono transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
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
