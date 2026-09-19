'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingDown, 
  AlertTriangle, 
  FileText, 
  Database, 
  Download, 
  ArrowRight, 
  Clock, 
  Layers, 
  ShieldAlert,
  ChevronRight,
  Filter,
  CheckCircle2,
  Calendar,
  Search,
  ExternalLink,
  X
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { MEMORY_DECAY_INDEX, MemoryDecayIndex } from '@/data/live-state';

interface FieldDossier {
  discoveryYear: number;
  totalLegacyWells: number;
  primaryArchiveLocation: string;
  storageCondition: string;
  paperDegradationState: 'CRITICAL_BRITTLE' | 'SEVERE_OXIDATION' | 'MODERATE' | 'CONTROLLED';
  atRiskFormations: string[];
  keyLegacyOffsetWells: string[];
  recommendedAction: string;
  estimatedDigitizationHours: number;
}

const FIELD_DOSSIERS: Record<string, FieldDossier> = {
  Digboi: {
    discoveryYear: 1889,
    totalLegacyWells: 1120,
    primaryArchiveLocation: 'Digboi Heritage Geological Repository (Record Room B-4)',
    storageCondition: 'High humidity storage, non-climate controlled; significant page yellowing & ink bleeding on 1920–1960 records.',
    paperDegradationState: 'CRITICAL_BRITTLE',
    atRiskFormations: ['Upper Tipam Sandstone', 'Digboi Sandstone', 'Girujan Clay'],
    keyLegacyOffsetWells: ['OIL-DGB-004', 'OIL-DGB-019', 'OIL-DGB-088', 'OIL-DGB-104'],
    recommendedAction: 'Immediate high-resolution planetary scanning & multi-column OCR for 851 fragile mud log sheets.',
    estimatedDigitizationHours: 640
  },
  Kharsang: {
    discoveryYear: 1976,
    totalLegacyWells: 82,
    primaryArchiveLocation: 'Arunachal Sub-Basin Exploration Office Archival Locker',
    storageCondition: 'Thermal fax paper fading on 1980s daily drilling reports; thrust fault correlation notes in hand-drawn binders.',
    paperDegradationState: 'SEVERE_OXIDATION',
    atRiskFormations: ['Girujan Claystone', 'Tipam Sandstone', 'Surma Group'],
    keyLegacyOffsetWells: ['KH-07', 'KH-12', 'KH-23'],
    recommendedAction: 'Extract tectonic thrust-fault shear and wellbore collapse learnings before physical logs are illegible.',
    estimatedDigitizationHours: 180
  },
  Geleki: {
    discoveryYear: 1968,
    totalLegacyWells: 148,
    primaryArchiveLocation: 'Nazira Central Technical Records Complex (Vault 2)',
    storageCondition: '300 DPI legacy black-and-white TIFF scans from 2002; unindexed metadata and missing casing seat tables.',
    paperDegradationState: 'MODERATE',
    atRiskFormations: ['Tipam Sandstone', 'Barail Main Sand', 'Kopili Shale'],
    keyLegacyOffsetWells: ['OIL-GLK-02', 'OIL-GLK-07', 'OIL-GLK-14 (Offset)', 'OIL-GLK-38'],
    recommendedAction: 'Entity vectorization of Barail high-pressure kick mitigation reports to safeguard current infill program.',
    estimatedDigitizationHours: 240
  },
  Rudrasagar: {
    discoveryYear: 1960,
    totalLegacyWells: 96,
    primaryArchiveLocation: 'Sibsagar Basin Records Cell',
    storageCondition: 'Typed cyclostyled reports with uneven carbon density; handwritten annotations in margins on formation fluid samples.',
    paperDegradationState: 'SEVERE_OXIDATION',
    atRiskFormations: ['Barail Coal-Shale', 'Kopili Formation', 'Sylhet Limestone'],
    keyLegacyOffsetWells: ['RDS-03', 'RDS-18', 'RDS-42'],
    recommendedAction: 'Harmonize inconsistent regional naming of Eocene Kopili abnormal pressure zones into standard OIL stratigraphy.',
    estimatedDigitizationHours: 190
  },
  Lakwa: {
    discoveryYear: 1964,
    totalLegacyWells: 190,
    primaryArchiveLocation: 'Lakwa Field Engineering Office Archives',
    storageCondition: 'Partial PDF scans available; bit record tables and hydraulic optimization sheets detached from primary WCRs.',
    paperDegradationState: 'MODERATE',
    atRiskFormations: ['Tipam Sandstone (Pebble Beds)', 'Bokabil Formation', 'Girujan Clay'],
    keyLegacyOffsetWells: ['LAK-09', 'LAK-31', 'LAK-77'],
    recommendedAction: 'Schema harmonization and OCR extraction of pebble bed lost circulation events.',
    estimatedDigitizationHours: 210
  }
};

export default function DecayIndexPage() {
  const [selectedField, setSelectedField] = useState<string>('Digboi');
  const [selectedDossierField, setSelectedDossierField] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const fieldsData = MEMORY_DECAY_INDEX;

  const filteredFields = fieldsData.filter((item) => {
    if (filterSeverity === 'critical' && item.decayRiskScore < 80) return false;
    if (filterSeverity === 'severe' && (item.decayRiskScore < 60 || item.decayRiskScore >= 80)) return false;
    if (filterSeverity === 'moderate' && item.decayRiskScore >= 60) return false;
    return true;
  });

  const totalPhysicalWCRs = fieldsData.reduce((acc, f) => acc + Math.round(f.totalLegacyWells * (f.paperOnlyPercentage / 100)), 0);
  const totalScannedPDFs = fieldsData.reduce((acc, f) => acc + Math.round(f.totalLegacyWells * (f.scannedUnstructuredPercentage / 100)), 0);
  const totalStructuredWCRs = fieldsData.reduce((acc, f) => acc + Math.round(f.totalLegacyWells * (f.digitizedPercentage / 100)), 0);

  const activeDossier = selectedDossierField ? FIELD_DOSSIERS[selectedDossierField] : null;

  return (
    <div className="space-y-4 max-w-[1440px] mx-auto pb-12 font-sans">
      
      <Breadcrumb
        items={[
          { label: 'Governance & Institutional Memory', href: '/' },
          { label: 'Institutional Memory Decay Index' }
        ]}
      />

      {/* ─── Header ─── */}
      <div className="bg-gradient-to-r from-card via-card to-card border-2 border-[#138808]/40 shadow-sm p-4 rounded-sm space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff9933] via-white dark:via-slate-200 to-[#138808]" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="px-2 py-0.5 bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-400 font-mono font-bold text-xs rounded-xs">
                ARCHIVAL PRESERVATION
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-sans">
                Institutional Memory Decay Index
              </h1>
              <span className="px-2 py-0.5 bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-400 font-bold text-xs rounded-xs">
                130+ YR REPOSITORY AUDIT
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-sans mt-1">
              Quantifies physical archive fragility and retirement-driven knowledge loss across Assam-Arakan fields to prioritize OCR digitization.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-400 font-bold rounded-xs">
              🏛 Digboi · Geleki · Rudrasagar · Kharsang · Lakwa
            </span>
          </div>
        </div>

        {/* Top Summary Metrics in 4 Rich Gradient Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 font-mono">
          <div className="p-3 bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/30 rounded-xs space-y-0.5">
            <div className="text-[10px] text-blue-700 dark:text-blue-300 uppercase font-bold">LEGACY WELLS AUDITED</div>
            <div className="text-2xl font-black text-foreground">1,636</div>
            <div className="text-[10px] text-muted-foreground font-sans">5 Major Assam Fields</div>
          </div>

          <div className="p-3 bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-500/30 rounded-xs space-y-0.5">
            <div className="text-[10px] text-rose-700 dark:text-rose-300 uppercase font-bold">PAPER ONLY (HIGH RISK)</div>
            <div className="text-2xl font-black text-rose-700 dark:text-rose-400">{totalPhysicalWCRs}</div>
            <div className="text-[10px] text-rose-600 dark:text-rose-400 font-sans font-medium">Zero digital backup</div>
          </div>

          <div className="p-3 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 rounded-xs space-y-0.5">
            <div className="text-[10px] text-amber-700 dark:text-amber-300 uppercase font-bold">UNINDEXED SCANS</div>
            <div className="text-2xl font-black text-amber-700 dark:text-amber-400">{totalScannedPDFs}</div>
            <div className="text-[10px] text-amber-700 dark:text-amber-400 font-sans font-medium">Needs OCR vectorization</div>
          </div>

          <div className="p-3 bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/30 rounded-xs space-y-0.5">
            <div className="text-[10px] text-emerald-700 dark:text-emerald-300 uppercase font-bold">FULLY DIGITIZED</div>
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{totalStructuredWCRs}</div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-sans font-medium">Indexed in NWIS graph</div>
          </div>
        </div>
      </div>

      {/* Main Operational Table */}
      <div className="gov-panel space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
          <div>
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide font-mono">
              Basin-Wide Institutional Knowledge Decay Register
            </h2>
            <p className="text-xs text-muted-foreground font-sans">
              Select a field row to inspect field-level archival vulnerabilities and mitigation roadmaps.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-muted-foreground font-bold">Filter Severity:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="border border-border bg-card text-foreground px-2.5 py-1 text-xs font-mono rounded-xs focus:outline-2 focus:outline-[#ff9933] cursor-pointer"
            >
              <option value="all">All Fields (5)</option>
              <option value="critical">Critical Decay (&ge;80)</option>
              <option value="severe">Severe Decay (60–79)</option>
              <option value="moderate">Moderate Decay (&lt;60)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table font-mono text-xs">
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Disc. Year</th>
                <th>Decay Score</th>
                <th>Paper Only</th>
                <th>Unindexed Scans</th>
                <th>Structured in DB</th>
                <th>Key Vulnerability</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFields.map((field) => {
                const isSelected = selectedField === field.field;
                const dossier = FIELD_DOSSIERS[field.field];
                return (
                  <tr
                    key={field.field}
                    onClick={() => setSelectedField(field.field)}
                    className={`cursor-pointer ${isSelected ? 'gov-row-selected' : ''}`}
                  >
                    <td className="font-bold text-foreground">
                      <div className="font-sans text-sm font-bold">{field.field} Field</div>
                      <div className="text-[10px] text-muted-foreground font-mono">Assam-Arakan Basin</div>
                    </td>

                    <td className="text-foreground">{dossier?.discoveryYear || '1960'}</td>

                    <td>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${
                          field.decayRiskScore >= 80 ? 'text-rose-600 dark:text-rose-400' :
                          field.decayRiskScore >= 65 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {field.decayRiskScore} / 100
                        </span>
                        <div className="w-14 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              field.decayRiskScore >= 80 ? 'bg-rose-600' :
                              field.decayRiskScore >= 65 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${field.decayRiskScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="text-rose-600 dark:text-rose-400 font-bold">
                      {field.paperOnlyPercentage}% ({Math.round(field.totalLegacyWells * (field.paperOnlyPercentage / 100))})
                    </td>

                    <td className="text-amber-600 dark:text-amber-400 font-bold">
                      {field.scannedUnstructuredPercentage}%
                    </td>

                    <td className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {field.digitizedPercentage}%
                    </td>

                    <td className="font-sans text-xs text-foreground max-w-xs truncate" title={field.keyVulnerability}>
                      {field.keyVulnerability}
                    </td>

                    <td className="text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDossierField(field.field);
                        }}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 rounded-xs text-[11px] font-mono font-bold transition-colors cursor-pointer shadow-xs"
                      >
                        Inspect Dossier
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Field Dossier Modal with Rich Colorful Badges */}
      {selectedDossierField && activeDossier && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-card border-2 border-border rounded-sm max-w-xl w-full p-5 space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-amber-700 dark:text-amber-400">Field Archival Dossier</span>
                <h3 className="font-bold text-lg text-foreground font-sans">
                  {selectedDossierField} Field Knowledge Decay Assessment
                </h3>
              </div>
              <button
                onClick={() => setSelectedDossierField(null)}
                className="p-1 hover:bg-secondary text-muted-foreground rounded-xs cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div className="p-3 bg-secondary/70 border border-border rounded-xs font-mono text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Primary Storage:</span>
                  <span className="text-foreground font-bold truncate max-w-xs">{activeDossier.primaryArchiveLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Physical State:</span>
                  <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-700 dark:text-rose-400 font-bold rounded-xs">{activeDossier.paperDegradationState}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Digitization Effort:</span>
                  <span className="text-foreground font-bold">{activeDossier.estimatedDigitizationHours} operator hours</span>
                </div>
              </div>

              <div className="p-3 bg-blue-500/10 border-l-4 border-l-blue-600 border border-blue-500/20 rounded-xs space-y-1">
                <div className="font-bold font-mono text-[10px] uppercase text-blue-700 dark:text-blue-300">Storage Condition Notes</div>
                <p className="text-foreground leading-relaxed">{activeDossier.storageCondition}</p>
              </div>

              <div className="p-3 bg-amber-500/10 border-l-4 border-l-amber-500 border border-amber-500/20 rounded-xs space-y-1">
                <div className="font-bold font-mono text-[10px] uppercase text-amber-700 dark:text-amber-400">At-Risk Formations</div>
                <p className="text-foreground font-mono">{activeDossier.atRiskFormations.join(' · ')}</p>
              </div>

              <div className="p-3 bg-emerald-500/10 border-l-4 border-l-emerald-600 border border-emerald-500/20 rounded-xs space-y-1">
                <div className="font-bold font-mono text-[10px] uppercase text-emerald-700 dark:text-emerald-300">Recommended Digitization Protocol</div>
                <p className="text-foreground leading-relaxed font-semibold">{activeDossier.recommendedAction}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Link
                href="/admin/ingestion"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xs shadow-xs transition-colors"
              >
                Launch Ingestion Batch →
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
