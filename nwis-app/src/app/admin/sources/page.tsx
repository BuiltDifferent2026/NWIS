'use client';

import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../../../components/layout/Breadcrumb';
import { SourceDocument } from '../../../lib/data/types';
import { getSourceDocuments } from '../../../lib/data/service';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { FileText, Archive, Filter } from 'lucide-react';

export default function AdminSourcesPage() {
  const [sources, setSources] = useState<SourceDocument[]>([]);
  const [filterField, setFilterField] = useState<string>('all');

  useEffect(() => {
    async function loadSources() {
      const docs = await getSourceDocuments();
      setSources(docs);
    }
    loadSources();
  }, []);

  const filteredSources = sources.filter((doc) => {
    if (filterField !== 'all' && doc.field.toLowerCase() !== filterField.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Breadcrumb
        items={[
          { label: 'Administration' },
          { label: 'Source Document Register' }
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-mono font-semibold mb-1">
            <Archive className="w-3.5 h-3.5 text-amber-700" />
            <span>ARCHIVAL PROVENANCE AUDIT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
            Source Document & Evidence Register
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5 font-medium">
            Register of physical paper archives, Daily Drilling Reports (DDRs), and Well Completion Reports (WCRs) with archive box references and extracted event counts.
          </p>
        </div>

        <Badge variant="outline" className="text-xs font-mono bg-neutral-100 text-neutral-800 border-neutral-300 py-1.5 px-3 self-start sm:self-auto">
          VERIFIABLE PEDIGREE
        </Badge>
      </div>

      {/* Semantic Documents Table Card */}
      <Card className="rounded-2xl border border-neutral-200 bg-white shadow-xs overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/50">
          <div>
            <h2 className="text-sm font-extrabold text-neutral-950">
              Assam Basin Historical Document Index
            </h2>
            <p className="text-xs text-neutral-500">
              Showing {filteredSources.length} of {sources.length} indexed records.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-neutral-500">Filter by Field:</span>
            <select
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
              className="border border-neutral-200 bg-white rounded-lg px-2.5 py-1 text-xs font-bold text-neutral-800 focus:outline-hidden"
            >
              <option value="all">All Fields</option>
              <option value="geleki">Geleki Field</option>
              <option value="digboi">Digboi Field</option>
              <option value="kharsang">Kharsang Field</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-200 bg-neutral-50 text-xs font-mono uppercase">
                <TableHead className="font-bold text-neutral-700">Document Identifier</TableHead>
                <TableHead className="font-bold text-neutral-700">Type</TableHead>
                <TableHead className="font-bold text-neutral-700">Subject Well</TableHead>
                <TableHead className="font-bold text-neutral-700">Field</TableHead>
                <TableHead className="font-bold text-neutral-700">Date Range</TableHead>
                <TableHead className="font-bold text-neutral-700">Pages</TableHead>
                <TableHead className="font-bold text-neutral-700">Confidence</TableHead>
                <TableHead className="font-bold text-neutral-700">Events</TableHead>
                <TableHead className="font-bold text-neutral-700">Archive Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSources.map((doc) => (
                <TableRow key={doc.id} className="border-neutral-100 hover:bg-neutral-50/70 transition-colors">
                  <TableCell className="font-extrabold font-mono text-neutral-950 text-xs">
                    {doc.documentName}
                  </TableCell>
                  <TableCell className="text-xs text-neutral-700">{doc.documentType}</TableCell>
                  <TableCell className="font-mono text-xs font-semibold text-neutral-900">{doc.wellName}</TableCell>
                  <TableCell className="text-xs text-neutral-600">{doc.field}</TableCell>
                  <TableCell className="font-mono text-xs text-neutral-600">{doc.dateRange}</TableCell>
                  <TableCell className="font-mono text-xs text-neutral-600">{doc.pageCount} pp</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`font-mono text-[10px] font-bold ${
                        doc.ingestionConfidence === 'STRUCTURED-HIGH'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {doc.ingestionConfidence}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs font-extrabold text-amber-700">
                    {doc.extractedEventsCount}
                  </TableCell>
                  <TableCell className="font-mono text-[11px] text-neutral-500">
                    {doc.archiveReference}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
