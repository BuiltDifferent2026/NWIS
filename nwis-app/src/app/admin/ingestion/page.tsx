'use client';

import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { IngestionBatch } from '@/lib/data/types';
import { getIngestionBatches } from '@/lib/data/service';
import { 
  Database, 
  FileCheck, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowDown, 
  FileText, 
  Cpu, 
  Sparkles, 
  Eye, 
  RotateCcw, 
  Code2, 
  BookOpen 
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
    <div className="space-y-4 max-w-[1400px] mx-auto pb-12 font-sans">
      
      <Breadcrumb
        items={[
          { label: 'Governance & Institutional Memory', href: '/' },
          { label: 'Archival Ingestion Pipeline' }
        ]}
      />

      {/* ─── Header ─── */}
      {/* ─── Header ─── */}
      <div className="gov-panel space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="gov-tag gov-tag-grey">DATA GOVERNANCE</span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
                Archival Ingestion Pipeline &amp; OCR Pedigree
              </h1>
              <span className="gov-tag gov-tag-blue">
                OISD / DGMS AUDIT READY
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-sans mt-1">
              Two-path ingestion converting structured real-time eRTMAC databases and 130+ years of historical scanned WCR/DDR archives into unified schemas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReScan}
              disabled={isReScanning}
              className="gov-button text-xs font-sans flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isReScanning ? 'animate-spin' : ''}`} />
              <span>{isReScanning ? 'Scanning...' : 'Trigger Pipeline Re-Scan'}</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Metrics in Clean Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 font-mono">
          <div className="p-2.5 bg-secondary/40 border border-border rounded-xs space-y-0.5">
            <div className="text-[10px] text-muted-foreground uppercase font-bold">TOTAL SCANNED ARCHIVES</div>
            <div className="text-2xl font-bold text-foreground">{totalDocs} Documents</div>
            <div className="text-[10px] text-muted-foreground font-sans">6 Assam fields</div>
          </div>
          <div className="p-2.5 bg-secondary/40 border border-border rounded-xs space-y-0.5">
            <div className="text-[10px] text-muted-foreground uppercase font-bold">EXTRACTED DRILLING EVENTS</div>
            <div className="text-2xl font-bold text-foreground">{totalEvents} Incidents</div>
            <div className="text-[10px] text-muted-foreground font-sans">Losses, kicks &amp; tight holes</div>
          </div>
          <div className="p-2.5 bg-secondary/40 border border-border rounded-xs space-y-0.5">
            <div className="text-[10px] text-muted-foreground uppercase font-bold">STRUCTURED PRECISION</div>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">94.2% Conf.</div>
            <div className="text-[10px] text-muted-foreground font-sans">High-confidence tier</div>
          </div>
          <div className="p-2.5 bg-secondary/40 border border-border rounded-xs space-y-0.5">
            <div className="text-[10px] text-muted-foreground uppercase font-bold">HUMAN AUDIT QUEUE</div>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">12 Pending</div>
            <div className="text-[10px] text-muted-foreground font-sans">Awaiting superintendent</div>
          </div>
        </div>
      </div>

      {/* Two-Path Pipeline Architecture Diagram */}
      <div className="gov-panel space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#1d70b8]" />
            <h2 className="font-bold text-sm text-foreground font-sans uppercase">
              Two-Path Convergence Pipeline Architecture
            </h2>
          </div>
          <span className="gov-tag gov-tag-green font-mono">
            ✓ Convergence Ratio: 100%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          
          {/* Path A */}
          <div className="gov-callout gov-callout-mitigation space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-border/80">
              <span className="font-bold font-mono text-xs uppercase text-emerald-700 dark:text-emerald-400">
                PATH A: STRUCTURED DATA
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">eRTMAC DB / WITSML</span>
            </div>
            
            <div className="space-y-1.5 text-xs font-mono">
              <div className="p-2 bg-card border border-border rounded-xs">
                <div className="text-[9px] text-muted-foreground uppercase font-bold">Stage 01 · Ingestion</div>
                <div className="text-foreground font-bold">SQL tables, WITSML 1.4/2.0 sensor feeds</div>
              </div>

              <div className="text-center text-muted-foreground font-bold">↓</div>

              <div className="p-2 bg-card border border-border rounded-xs">
                <div className="text-[9px] text-muted-foreground uppercase font-bold">Stage 02 · Unit Normalization</div>
                <div className="text-foreground">Unit harmonization: ft→m, psi→ppg, lbs→kft-lb</div>
              </div>

              <div className="text-center text-muted-foreground font-bold">↓</div>

              <div className="p-2 bg-secondary/60 border border-border rounded-xs text-xs">
                <div className="font-bold text-foreground">OUTPUT TAG: STRUCTURED-HIGH (1.00)</div>
                <div className="text-[11px] text-muted-foreground font-sans">Deterministic sensor stream. Zero OCR ambiguity.</div>
              </div>
            </div>
          </div>

          {/* Path B */}
          <div className="gov-callout gov-callout-risk space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-border/80">
              <span className="font-bold font-mono text-xs uppercase text-amber-700 dark:text-amber-400">
                PATH B: UNSTRUCTURED OCR
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">WCRs &amp; DDRs (1889–2020)</span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="p-2 bg-card border border-border rounded-xs">
                <div className="text-[9px] text-muted-foreground uppercase font-bold">Stage 01 · Segmentation</div>
                <div className="text-foreground font-bold">LayoutLMv3 bounding-box detection</div>
              </div>

              <div className="text-center text-muted-foreground font-bold">↓</div>

              <div className="p-2 bg-card border border-border rounded-xs">
                <div className="text-[9px] text-muted-foreground uppercase font-bold">Stage 02 · Stratigraphic NLP</div>
                <div className="text-foreground">Tesseract 5 + Assam geological lexicon</div>
              </div>

              <div className="text-center text-muted-foreground font-bold">↓</div>

              <div className="p-2 bg-secondary/60 border border-border rounded-xs text-xs">
                <div className="font-bold text-foreground">OUTPUT: OCR-HIGH (≥90%) / OCR-MED (75–89%)</div>
                <div className="text-[11px] text-muted-foreground font-sans">Human-in-the-loop audit for records &lt;75%.</div>
              </div>
            </div>
          </div>

        </div>

        {/* Target Schema Guarantee */}
        <div className="p-2.5 bg-secondary/40 border border-border rounded-xs text-xs font-mono flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-foreground">Common Target Schema:</span>
            <span className="text-muted-foreground">well_id · formation · depth_md · incident_event · root_cause · mitigation · npt_hours · confidence_tier</span>
          </div>
          <span className="gov-tag gov-tag-blue text-[10px]">
            DGMS AUDIT COMPLIANT
          </span>
        </div>
      </div>

      {/* Batches Table & Inspector Deck */}
      <div className="gov-panel space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div>
            <h2 className="font-bold text-sm text-foreground font-sans uppercase">
              Archival Ingestion Batches &amp; OCR Confidence Distribution
            </h2>
            <p className="text-xs text-muted-foreground font-sans">
              Click any batch row to inspect OCR text extraction, normalized schema, and confidence tiers.
            </p>
          </div>
          <span className="gov-tag gov-tag-grey">{batches.length} Vectorized Batches</span>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table font-mono text-xs">
            <thead>
              <tr>
                <th>Batch Name</th>
                <th>Source Type</th>
                <th>Ingestion Date</th>
                <th>Documents</th>
                <th>Events</th>
                <th>Confidence Distribution</th>
                <th>Status</th>
                <th className="text-right">Inspection</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => {
                const isSelected = selectedBatch?.id === batch.id;
                const highCount = batch.confidenceDistribution.structuredHigh + batch.confidenceDistribution.ocrHigh;
                const medCount = batch.confidenceDistribution.ocrMedium;
                const lowCount = batch.confidenceDistribution.ocrLow;

                return (
                  <tr
                    key={batch.id}
                    onClick={() => setSelectedBatch(batch)}
                    className={`cursor-pointer ${isSelected ? 'gov-row-selected' : ''}`}
                  >
                    <td className="font-bold text-foreground">
                      <div className="flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-[#1d70b8] dark:text-[#60a5fa]" />
                        <span>{batch.batchName}</span>
                      </div>
                    </td>
                    <td>
                      <span className="gov-tag gov-tag-grey">{batch.sourceType.replace('_', ' ')}</span>
                    </td>
                    <td className="text-muted-foreground">{batch.ingestionDate}</td>
                    <td className="font-bold text-foreground">{batch.totalDocuments}</td>
                    <td className="font-bold text-[#b25900] dark:text-[#fbbf24]">{batch.extractedEventsCount}</td>
                    <td>
                      <div className="flex items-center gap-1 text-[10px]">
                        <span className="gov-tag gov-tag-green">{highCount} High</span>
                        <span className="gov-tag gov-tag-amber">{medCount} Med</span>
                        <span className="gov-tag gov-tag-red">{lowCount} Low</span>
                      </div>
                    </td>
                    <td>
                      <span className="gov-tag gov-tag-green">{batch.status.toUpperCase()}</span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBatch(batch);
                          setIsInspectorOpen(true);
                        }}
                        className="px-2 py-0.5 bg-secondary hover:bg-[#1d70b8] hover:text-white border border-border text-[11px] font-mono transition-colors cursor-pointer"
                      >
                        <Eye className="w-3 h-3 inline mr-1" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Batch Inspector Preview */}
        {selectedBatch && (
          <div className="p-3 bg-secondary/30 border border-border space-y-3 mt-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="font-mono text-xs">
                <strong className="text-foreground">{selectedBatch.batchName}</strong> · Ingested {selectedBatch.ingestionDate} · {selectedBatch.extractedEventsCount} calibrated events
              </div>

              <div className="flex items-center gap-1 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-2 py-0.5 border cursor-pointer ${
                    activeTab === 'preview' ? 'bg-[#1d70b8] text-white border-[#1d70b8]' : 'bg-card text-muted-foreground border-border'
                  }`}
                >
                  OCR Text vs Schema
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('schema')}
                  className={`px-2 py-0.5 border cursor-pointer ${
                    activeTab === 'schema' ? 'bg-[#1d70b8] text-white border-[#1d70b8]' : 'bg-card text-muted-foreground border-border'
                  }`}
                >
                  Engine Telemetry
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('queue')}
                  className={`px-2 py-0.5 border cursor-pointer ${
                    activeTab === 'queue' ? 'bg-[#1d70b8] text-white border-[#1d70b8]' : 'bg-card text-muted-foreground border-border'
                  }`}
                >
                  Audit Queue ({selectedBatch.confidenceDistribution.manualReview || 12})
                </button>
              </div>
            </div>

            {activeTab === 'preview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-card border border-border space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase font-bold">
                    <span>Raw Typewritten OCR Output (300 DPI)</span>
                    <span className="gov-tag gov-tag-amber">WCR-GLK-07-p19</span>
                  </div>
                  <p className="text-foreground leading-relaxed text-[11px] bg-secondary/50 p-2 border border-border">
                    &quot;...drilling 12-1/4 inch hole at 2280m MD in Upper Tipam Sandstone. Severe lost circulation occurred with pit drop of 18 m3. Pumped 45 bbls medium-nut-plug LCM pill (25 ppb). Capped ECD at 10.4 ppg. Total lost time was 34 hours...&quot;
                  </p>
                </div>

                <div className="p-3 bg-card border border-border space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase font-bold">
                    <span>Normalized Canonical JSON Record</span>
                    <span className="gov-tag gov-tag-green">VALIDATED</span>
                  </div>
                  <pre className="text-[10px] text-foreground bg-secondary/50 p-2 border border-border overflow-x-auto">
{`{
  "well_id": "OIL-GLK-07",
  "formation": "Upper Tipam Sandstone",
  "depth_md": 2280.0,
  "incident_event": "SEVERE_LOST_CIRCULATION",
  "mud_loss_bbl": 420,
  "mitigation_applied": "45 bbl 25 ppb medium nut-plug LCM pill",
  "ecd_cap_ppg": 10.4,
  "npt_hours": 34.0,
  "confidence_tier": "OCR-HIGH"
}`}
                  </pre>
                </div>
              </div>
            )}

            {activeTab === 'schema' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-card border border-border space-y-0.5">
                  <div className="text-[9px] text-muted-foreground uppercase font-bold">OCR ENGINE</div>
                  <div className="font-bold text-foreground">Tesseract 5.3 + LayoutLMv3</div>
                  <div className="text-[10px] text-[#00703c]">Accuracy: 95.8%</div>
                </div>
                <div className="p-2.5 bg-card border border-border space-y-0.5">
                  <div className="text-[9px] text-muted-foreground uppercase font-bold">PRE-PROCESSING</div>
                  <div className="font-bold text-foreground">Gaussian Deskew + Denoise</div>
                  <div className="text-[10px] text-muted-foreground">300 DPI Grayscale TIFF</div>
                </div>
                <div className="p-2.5 bg-card border border-border space-y-0.5">
                  <div className="text-[9px] text-muted-foreground uppercase font-bold">DOMAIN VOCABULARY</div>
                  <div className="font-bold text-foreground">Assam Stratigraphic Lexicon</div>
                  <div className="text-[10px] text-[#b25900]">4,200 Geological Terms</div>
                </div>
              </div>
            )}

            {activeTab === 'queue' && (
              <div className="p-3 bg-card border border-border space-y-2 text-xs font-mono">
                <div className="font-bold text-foreground text-xs">Flagged Low-Confidence Records Awaiting Sign-off</div>
                <div className="space-y-1.5 divide-y divide-border">
                  <div className="pt-1.5 flex justify-between items-center">
                    <div>
                      <strong className="text-foreground">OIL-GLK-02 (1988 DDR #42)</strong>
                      <p className="text-[11px] text-muted-foreground font-sans">Faded carbon-copy text: &quot;lost 240 bbls at 2,190m&quot;. Confidence: 68%.</p>
                    </div>
                    <button
                      onClick={() => setIsInspectorOpen(true)}
                      className="gov-button text-[10px] py-1 px-2"
                    >
                      Audit Scan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Evidence Inspector Drawer */}
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
