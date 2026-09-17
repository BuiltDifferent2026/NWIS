'use client';

import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../../../components/layout/Breadcrumb';
import { IngestionBatch } from '../../../lib/data/types';
import { getIngestionBatches } from '../../../lib/data/service';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Database, FileCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AdminIngestionPage() {
  const [batches, setBatches] = useState<IngestionBatch[]>([]);

  useEffect(() => {
    async function loadBatches() {
      const data = await getIngestionBatches();
      setBatches(data);
    }
    loadBatches();
  }, []);

  const totalDocs = batches.reduce((acc, b) => acc + b.totalDocuments, 0);
  const totalEvents = batches.reduce((acc, b) => acc + b.extractedEventsCount, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Breadcrumb
        items={[
          { label: 'Administration' },
          { label: 'Ingestion Pipeline Status' }
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-mono font-semibold mb-1">
            <Database className="w-3.5 h-3.5 text-emerald-700" />
            <span>ARCHIVAL EXTRACTION PIPELINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
            Ingestion Pipeline Status & OCR Pedigree
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5 font-medium">
            Verifiable pedigree of digitized Daily Drilling Reports (DDRs), Well Completion Reports (WCRs), and mud logs from Oil India Limited archives.
          </p>
        </div>

        <Badge variant="outline" className="text-xs font-mono bg-neutral-100 text-neutral-800 border-neutral-300 py-1.5 px-3 self-start sm:self-auto">
          OCR AUDIT READY
        </Badge>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs space-y-2">
          <span className="text-neutral-500 uppercase text-[10px] font-mono font-bold block">Total Archival Documents</span>
          <div className="text-2xl font-extrabold font-mono text-neutral-950">{totalDocs} Scanned & Vectorized</div>
          <span className="text-neutral-500 text-xs font-mono block">Assam Basin archives (1970–2020)</span>
        </Card>

        <Card className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs space-y-2">
          <span className="text-neutral-500 uppercase text-[10px] font-mono font-bold block">Structured Incidents Extracted</span>
          <div className="text-2xl font-extrabold font-mono text-amber-700">{totalEvents} Events Extracted</div>
          <span className="text-neutral-500 text-xs font-mono block">Losses, kicks, stuck pipe, torque spikes</span>
        </Card>

        <Card className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs space-y-2">
          <span className="text-neutral-500 uppercase text-[10px] font-mono font-bold block">Ingestion Pipeline Health</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-700">100% Operational</div>
          <span className="text-neutral-500 text-xs font-mono block">Layout-aware OCR & table extraction</span>
        </Card>
      </div>

      {/* Batches Table with Confidence Distribution Stacked Bar */}
      <Card className="rounded-2xl border border-neutral-200 bg-white shadow-xs overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div>
            <h2 className="text-sm font-extrabold text-neutral-950">
              Ingested Document Batches
            </h2>
            <p className="text-xs text-neutral-500">
              Provenance and extraction confidence distribution per batch.
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-mono bg-white text-neutral-700">
            {batches.length} Batches Processed
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-200 bg-neutral-50 text-xs font-mono uppercase">
                <TableHead className="font-bold text-neutral-700">Batch Identifier</TableHead>
                <TableHead className="font-bold text-neutral-700">Extraction Source</TableHead>
                <TableHead className="font-bold text-neutral-700">Date Ingested</TableHead>
                <TableHead className="font-bold text-neutral-700">Documents</TableHead>
                <TableHead className="font-bold text-neutral-700">Events</TableHead>
                <TableHead className="font-bold text-neutral-700 min-w-[240px]">Confidence Distribution</TableHead>
                <TableHead className="font-bold text-neutral-700 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => {
                const total =
                  batch.confidenceDistribution.structuredHigh +
                  batch.confidenceDistribution.ocrHigh +
                  batch.confidenceDistribution.ocrMedium +
                  batch.confidenceDistribution.ocrLow +
                  batch.confidenceDistribution.manualReview;

                const pctStructured = Math.round((batch.confidenceDistribution.structuredHigh / total) * 100);
                const pctOcrHigh = Math.round((batch.confidenceDistribution.ocrHigh / total) * 100);
                const pctOcrMed = Math.round((batch.confidenceDistribution.ocrMedium / total) * 100);
                const pctOcrLow = Math.round((batch.confidenceDistribution.ocrLow / total) * 100);
                const pctManual = Math.round((batch.confidenceDistribution.manualReview / total) * 100);

                return (
                  <TableRow key={batch.id} className="border-neutral-100 hover:bg-neutral-50/70 transition-colors">
                    <TableCell>
                      <div className="font-extrabold text-neutral-950 text-xs">{batch.batchName}</div>
                      <div className="text-[11px] font-mono text-neutral-500">{batch.id}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs uppercase text-neutral-700">
                      {batch.sourceType.replace('_', ' ')}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-neutral-600">{batch.ingestionDate}</TableCell>
                    <TableCell className="font-mono text-xs font-bold text-neutral-900">{batch.totalDocuments}</TableCell>
                    <TableCell className="font-mono text-xs font-extrabold text-amber-700">{batch.extractedEventsCount}</TableCell>
                    <TableCell>
                      {/* Simple Accessible Stacked Bar for Confidence Distribution */}
                      <div className="space-y-1">
                        <div className="h-3 w-full bg-neutral-200 rounded-full overflow-hidden flex">
                          <div
                            style={{ width: `${pctStructured}%` }}
                            className="h-full bg-emerald-600"
                            title={`Structured High: ${pctStructured}%`}
                          />
                          <div
                            style={{ width: `${pctOcrHigh}%` }}
                            className="h-full bg-amber-500"
                            title={`OCR High: ${pctOcrHigh}%`}
                          />
                          <div
                            style={{ width: `${pctOcrMed}%` }}
                            className="h-full bg-orange-400"
                            title={`OCR Medium: ${pctOcrMed}%`}
                          />
                          <div
                            style={{ width: `${pctOcrLow}%` }}
                            className="h-full bg-rose-500"
                            title={`OCR Low: ${pctOcrLow}%`}
                          />
                          <div
                            style={{ width: `${pctManual}%` }}
                            className="h-full bg-neutral-400"
                            title={`Manual Review: ${pctManual}%`}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                          <span className="text-emerald-700 font-bold">{pctStructured}% High</span>
                          <span className="text-amber-700 font-bold">{pctOcrHigh}% OCR-H</span>
                          <span className="text-neutral-500">{pctOcrMed}% Med</span>
                          <span className="text-rose-700">{pctOcrLow + pctManual}% Low</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 font-mono text-[10px] font-bold">
                        {batch.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
