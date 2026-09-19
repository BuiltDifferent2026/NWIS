'use client';

import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../../../components/layout/Breadcrumb';
import { SourceDocument } from '../../../lib/data/types';
import { getSourceDocuments } from '../../../lib/data/service';

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
    <div className="space-y-4 max-w-[1440px] mx-auto pb-12 font-sans">
      <Breadcrumb
        items={[
          { label: 'Governance & Institutional Memory', href: '/' },
          { label: 'Source Document Register' }
        ]}
      />

      {/* ─── Header ─── */}
      <div className="bg-gradient-to-r from-card via-card to-card border-2 border-[#138808]/40 shadow-sm p-4 rounded-sm space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff9933] via-white dark:via-slate-200 to-[#138808]" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="px-2 py-0.5 bg-blue-500/15 border border-blue-500/40 text-blue-700 dark:text-blue-400 font-mono font-bold text-xs rounded-xs">
                ARCHIVE REPOSITORY
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-sans">
                Source Document &amp; Evidence Register
              </h1>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-xs rounded-xs">
                VERIFIABLE ARCHIVE
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-sans mt-1">
              Catalogue of historical Daily Drilling Reports (DDRs) and Well Completion Reports (WCRs) powering the lookahead model.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-muted-foreground font-bold">Field:</span>
            <select
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
              className="border border-border bg-card text-foreground px-2.5 py-1 text-xs font-mono rounded-xs focus:outline-2 focus:outline-[#ff9933] cursor-pointer"
            >
              <option value="all">All Fields</option>
              <option value="geleki">Geleki Field</option>
              <option value="digboi">Digboi Field</option>
              <option value="kharsang">Kharsang Field</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="gov-panel space-y-2">
        <div className="overflow-x-auto">
          <table className="gov-table font-mono text-xs">
            <thead>
              <tr>
                <th>Document Identifier</th>
                <th>Type</th>
                <th>Subject Well</th>
                <th>Field</th>
                <th>Date Range</th>
                <th>Pages</th>
                <th>Confidence</th>
                <th>Events</th>
                <th>Archive Reference</th>
              </tr>
            </thead>
            <tbody>
              {filteredSources.map((doc) => (
                <tr key={doc.id}>
                  <td className="font-bold text-foreground">{doc.documentName}</td>
                  <td>
                    <span className="px-2 py-0.5 bg-secondary text-foreground border border-border font-bold rounded-xs text-[10px]">
                      {doc.documentType}
                    </span>
                  </td>
                  <td className="font-bold text-foreground">{doc.wellName}</td>
                  <td className="text-foreground">{doc.field}</td>
                  <td className="text-muted-foreground">{doc.dateRange}</td>
                  <td className="text-foreground font-bold">{doc.pageCount} pp</td>
                  <td>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-xs ${
                      doc.ingestionConfidence === 'STRUCTURED-HIGH' || doc.ingestionConfidence === 'OCR-HIGH'
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                        : doc.ingestionConfidence === 'OCR-MEDIUM'
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                    }`}>
                      {doc.ingestionConfidence}
                    </span>
                  </td>
                  <td className="font-bold text-amber-700 dark:text-amber-400">{doc.extractedEventsCount}</td>
                  <td className="text-muted-foreground font-medium">{doc.archiveReference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
