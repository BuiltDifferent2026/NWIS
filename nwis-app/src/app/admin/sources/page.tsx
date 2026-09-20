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
      <div className="gov-panel space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="gov-tag gov-tag-grey">ARCHIVE REPOSITORY</span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
                Source Document &amp; Evidence Register
              </h1>
              <span className="gov-tag gov-tag-green">
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
              className="border border-border bg-card text-foreground px-2.5 py-1 text-xs font-mono rounded-xs focus:outline-2 focus:outline-[#1d70b8] cursor-pointer"
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
                    <span className={`gov-tag ${
                      doc.ingestionConfidence === 'STRUCTURED-HIGH' || doc.ingestionConfidence === 'OCR-HIGH'
                        ? 'gov-tag-green'
                        : doc.ingestionConfidence === 'OCR-MEDIUM'
                        ? 'gov-tag-amber'
                        : 'gov-tag-red'
                    }`}>
                      {doc.ingestionConfidence}
                    </span>
                  </td>
                  <td className="font-bold text-foreground">{doc.extractedEventsCount}</td>
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
