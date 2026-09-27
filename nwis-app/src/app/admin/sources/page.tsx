'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { SourceDocument } from '@/lib/data/types';
import { getSourceDocuments } from '@/lib/data/service';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { 
  FileText, 
  Archive, 
  Filter, 
  Search, 
  Eye, 
  ShieldCheck, 
  Database, 
  Layers, 
  ArrowRight,
  FolderOpen
} from 'lucide-react';
import { EvidenceInspectorDrawer } from '@/components/common/EvidenceInspectorDrawer';

export default function AdminSourcesPage() {
  const [sources, setSources] = useState<SourceDocument[]>([]);
  const [filterField, setFilterField] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<SourceDocument | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);

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
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = doc.documentName.toLowerCase().includes(q);
      const matchWell = doc.wellName.toLowerCase().includes(q);
      const matchRef = doc.archiveReference.toLowerCase().includes(q);
      const matchType = doc.documentType.toLowerCase().includes(q);
      if (!matchName && !matchWell && !matchRef && !matchType) return false;
    }
    return true;
  });

  const totalPages = sources.reduce((acc, d) => acc + d.pageCount, 0);
  const totalEvents = sources.reduce((acc, d) => acc + d.extractedEventsCount, 0);
  const uniqueWells = new Set(sources.map((d) => d.wellName)).size;

  const handleOpenInspector = (doc: SourceDocument) => {
    setSelectedDoc(doc);
    setIsInspectorOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-150 text-[#252B33] dark:text-white">
      <Breadcrumb
        items={[
          { label: 'Administration' },
          { label: 'Source Document Register' }
        ]}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#E2E5E8] dark:border-[#364356]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#252B33] dark:text-white font-mono">
              Source Document &amp; Evidence Register
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#94A3B8] mt-1 font-sans">
            Archival register of Daily Drilling Reports (DDRs) and Well Completion Reports (WCRs) with verifiable OCR lineage.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/admin/ingestion"
            className="px-3 py-1.5 rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#1E2532] hover:bg-[#F5F7F8] dark:hover:bg-[#34435A] text-[#252B33] dark:text-white text-xs font-mono font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5 text-[#3FC3B6]" />
            <span>Ingestion Pipeline</span>
            <ArrowRight className="w-3 h-3 text-[#6B7280] dark:text-[#94A3B8]" />
          </Link>

          <Badge variant="outline" className="text-xs font-mono font-bold bg-[#D9F2EE] dark:bg-[#3FC3B6]/20 text-[#26A69A] dark:text-[#3FC3B6] border border-[#3FC3B6] py-1.5 px-3 self-start sm:self-auto rounded-none">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5 inline" />
            VERIFIABLE PEDIGREE
          </Badge>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6B7280] dark:text-[#94A3B8] font-mono">
            <span>Indexed Documents</span>
            <FolderOpen className="w-3.5 h-3.5 text-[#3FC3B6]" />
          </div>
          <div className="mt-1 text-2xl font-black font-mono text-[#252B33] dark:text-white">
            {sources.length}
          </div>
          <span className="text-[11px] font-mono text-[#6B7280] dark:text-[#94A3B8]">
            {totalPages.toLocaleString()} scanned pages
          </span>
        </div>

        <div className="p-3.5 rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6B7280] dark:text-[#94A3B8] font-mono">
            <span>Historical Wells</span>
            <Database className="w-3.5 h-3.5 text-[#26A69A] dark:text-[#3FC3B6]" />
          </div>
          <div className="mt-1 text-2xl font-black font-mono text-[#252B33] dark:text-white">
            {uniqueWells}
          </div>
          <span className="text-[11px] font-mono text-[#6B7280] dark:text-[#94A3B8]">
            Assam &amp; Arunachal Basins
          </span>
        </div>

        <div className="p-3.5 rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6B7280] dark:text-[#94A3B8] font-mono">
            <span>Extracted Incidents</span>
            <Archive className="w-3.5 h-3.5 text-[#ED1C24]" />
          </div>
          <div className="mt-1 text-2xl font-black font-mono text-[#ED1C24]">
            {totalEvents}
          </div>
          <span className="text-[11px] font-mono text-[#6B7280] dark:text-[#94A3B8]">
            Loss / kick / stuck events
          </span>
        </div>

        <div className="p-3.5 rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#6B7280] dark:text-[#94A3B8] font-mono">
            <span>Pedigree Integrity</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#3FAE68]" />
          </div>
          <div className="mt-1 text-2xl font-black font-mono text-[#3FAE68]">
            100%
          </div>
          <span className="text-[11px] font-mono text-[#6B7280] dark:text-[#94A3B8]">
            Audit-grade traceability
          </span>
        </div>
      </div>

      {/* Semantic Documents Table Card */}
      <Card className="rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] shadow-2xs overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-4 border-b border-[#E2E5E8] dark:border-[#364356] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#F5F7F8] dark:bg-[#1E2532]">
          <div>
            <h2 className="text-sm font-extrabold text-[#252B33] dark:text-white font-mono flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#3FC3B6]" />
              Assam Basin Historical Document Index
            </h2>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
              Showing {filteredSources.length} of {sources.length} indexed records with verifiable bounding boxes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search doc, well, archive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-2.5 py-1 text-xs border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] text-[#252B33] dark:text-white rounded-none focus:outline-hidden focus:border-[#3FC3B6] w-48 sm:w-60 font-mono"
              />
            </div>

            {/* Field Filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3 h-3 text-[#6B7280] dark:text-[#94A3B8]" />
              <select
                value={filterField}
                onChange={(e) => setFilterField(e.target.value)}
                className="border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] rounded-none px-2.5 py-1 text-xs font-bold text-[#252B33] dark:text-white focus:outline-hidden focus:border-[#3FC3B6]"
              >
                <option value="all">All Fields</option>
                <option value="geleki">Geleki Field</option>
                <option value="digboi">Digboi Field</option>
                <option value="kharsang">Kharsang Field</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[#E2E5E8] dark:border-[#364356] bg-[#F5F7F8] dark:bg-[#1E2532] text-xs font-mono uppercase">
                <TableHead className="font-bold text-[#252B33] dark:text-white">Document Identifier</TableHead>
                <TableHead className="font-bold text-[#252B33] dark:text-white">Type</TableHead>
                <TableHead className="font-bold text-[#252B33] dark:text-white">Subject Well</TableHead>
                <TableHead className="font-bold text-[#252B33] dark:text-white">Field</TableHead>
                <TableHead className="font-bold text-[#252B33] dark:text-white">Date Range</TableHead>
                <TableHead className="font-bold text-[#252B33] dark:text-white">Pages</TableHead>
                <TableHead className="font-bold text-[#252B33] dark:text-white">Confidence</TableHead>
                <TableHead className="font-bold text-[#252B33] dark:text-white">Events</TableHead>
                <TableHead className="font-bold text-[#252B33] dark:text-white">Archive Reference</TableHead>
                <TableHead className="font-bold text-[#252B33] dark:text-white text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSources.length === 0 ? (
                <TableRow className="border-[#E2E5E8] dark:border-[#364356]">
                  <TableCell colSpan={10} className="text-center py-8 text-xs text-[#6B7280] dark:text-[#94A3B8] font-mono">
                    No matching source documents found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSources.map((doc) => (
                  <TableRow 
                    key={doc.id} 
                    className="border-[#E2E5E8] dark:border-[#364356] hover:bg-[#F5F7F8]/80 dark:hover:bg-[#1E2532]/80 transition-colors cursor-pointer group"
                    onClick={() => handleOpenInspector(doc)}
                  >
                    <TableCell className="font-extrabold font-mono text-[#252B33] dark:text-white text-xs">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#3FC3B6] shrink-0" />
                        <span className="group-hover:text-[#3FC3B6] transition-colors">{doc.documentName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-[#6B7280] dark:text-[#94A3B8] font-mono">{doc.documentType}</TableCell>
                    <TableCell className="font-mono text-xs font-semibold text-[#252B33] dark:text-white">{doc.wellName}</TableCell>
                    <TableCell className="text-xs text-[#6B7280] dark:text-[#94A3B8] font-mono">{doc.field}</TableCell>
                    <TableCell className="font-mono text-xs text-[#6B7280] dark:text-[#94A3B8]">{doc.dateRange}</TableCell>
                    <TableCell className="font-mono text-xs text-[#6B7280] dark:text-[#94A3B8]">{doc.pageCount} pp</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`font-mono text-[10px] font-bold rounded-none ${
                          doc.ingestionConfidence === 'STRUCTURED-HIGH'
                            ? 'bg-[#D9F2EE] dark:bg-[#3FC3B6]/20 text-[#26A69A] dark:text-[#3FC3B6] border-[#3FC3B6]'
                            : 'bg-[#FEF9EE] dark:bg-[#F2B84B]/15 text-[#C68A1B] dark:text-[#F2B84B] border-[#F2B84B]'
                        }`}
                      >
                        {doc.ingestionConfidence}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs font-extrabold text-[#ED1C24]">
                      {doc.extractedEventsCount}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-[11px] bg-[#F5F7F8] dark:bg-[#191E26] px-2 py-0.5 border border-[#E2E5E8] dark:border-[#364356] text-[#6B7280] dark:text-[#94A3B8]">
                        {doc.archiveReference}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenInspector(doc);
                        }}
                        className="px-2.5 py-1 text-[11px] font-mono font-bold border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#1E2532] hover:bg-[#F5F7F8] dark:hover:bg-[#34435A] text-[#252B33] dark:text-white hover:text-[#3FC3B6] dark:hover:text-[#3FC3B6] rounded-none transition-colors inline-flex items-center gap-1 shadow-2xs"
                      >
                        <Eye className="w-3 h-3 text-[#3FC3B6]" />
                        <span>Inspect</span>
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Evidence Inspector Drawer */}
      <EvidenceInspectorDrawer
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        wellName={selectedDoc?.wellName || 'OIL-GLK-07'}
        sourceRef={selectedDoc ? `${selectedDoc.documentName} · ${selectedDoc.archiveReference}` : undefined}
        confidence={selectedDoc?.ingestionConfidence}
      />
    </div>
  );
}
