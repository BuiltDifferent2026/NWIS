'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingDown, 
  Layers, 
  Compass, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  Activity, 
  Sparkles, 
  Download, 
  Filter, 
  Search,
  ExternalLink,
  ChevronRight,
  Info,
  Scale
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { 
  REAL_DATA_PREDICTION_GAPS, 
  FIELD_PREDICTION_GAP_SUMMARIES, 
  FormationPredictionGap 
} from '@/data/prediction-gap';
import { MitigationPlaybookCard } from '@/components/playbook/MitigationPlaybookCard';

export default function PredictionGapPage() {
  const [selectedField, setSelectedField] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredGaps = REAL_DATA_PREDICTION_GAPS.filter((gap) => {
    if (selectedField !== 'all' && !gap.field.toLowerCase().includes(selectedField.toLowerCase())) {
      return false;
    }
    if (selectedTier !== 'all' && gap.seismicConfidence !== selectedTier) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        gap.formationName.toLowerCase().includes(q) ||
        gap.wellName.toLowerCase().includes(q) ||
        gap.field.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const meanDelta = Math.round(
    (filteredGaps.reduce((acc, g) => acc + Math.abs(g.deltaMeters), 0) / (filteredGaps.length || 1)) * 10
  ) / 10;

  const maxDelta = Math.max(...filteredGaps.map((g) => Math.abs(g.deltaMeters)), 0);

  return (
    <div className="space-y-6 max-w-[1520px] mx-auto pb-12 animate-in fade-in duration-150 text-[#252B33]">
      
      {/* ─── Breadcrumb ─── */}
      <Breadcrumb
        items={[
          { label: 'Institutional Memory', href: '/decay-index' },
          { label: 'Geological Prediction Gap Index' }
        ]}
      />

      {/* ─── Strategic Header ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-[#E2E5E8]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-8 h-8 rounded-none bg-[#D9F2EE] text-[#26A69A] flex items-center justify-center border border-[#3FC3B6]">
              <TrendingDown className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#252B33] font-mono">
              Geological Prediction Gap Index (GTO vs Actual)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] max-w-4xl leading-relaxed font-sans">
            Directly computed delta between prognosed pre-drill target depth (GTO) and actual confirmed drill-cutting sample &amp; wireline log tops across the Naga Thrust Belt. Turns qualitative seismic uncertainty into an engineering-quantified metric.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/operations"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-none border border-[#E2E5E8] bg-white text-xs font-mono font-bold text-[#252B33] hover:border-[#3FC3B6] hover:text-[#26A69A] transition-colors shadow-2xs"
          >
            <Activity className="w-3.5 h-3.5 text-[#34435A]" />
            <span>Active Well: OIL-GLK-14</span>
          </Link>
        </div>
      </div>

      {/* ─── Strategic Proof Banner (Oil India Red Accent) ─── */}
      <div className="p-4 sm:p-5 rounded-none border-l-4 border-l-[#ED1C24] border-y border-r border-[#E2E5E8] bg-[#F5F7F8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[#ED1C24] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-xs font-mono font-extrabold text-[#ED1C24] uppercase tracking-wider">
              Asymmetric Advantage · Proof Over Assertion
            </div>
            <p className="text-xs text-[#252B33] leading-relaxed font-sans max-w-4xl">
              Seismic imaging in the Naga Thrust Belt exhibits severe velocity pull-downs due to imbricate fault stacking, making pre-drill depth models weakest exactly where geological risk is highest. NWIS turns this literature assertion into a <strong>directly computed, real-data-backed metric</strong> using confirmed Prognosed(GTO) vs Actual(W.log) records from genuine OIL India archives.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Top KPI Strip ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-none border border-[#E2E5E8] bg-white shadow-2xs space-y-1">
          <span className="text-[10px] font-mono text-[#6B7280] uppercase font-bold block">Mean Absolute Gap</span>
          <div className="text-2xl font-black font-mono text-[#ED1C24]">
            ±{meanDelta} <span className="text-xs font-normal text-[#6B7280]">meters</span>
          </div>
          <span className="text-[10px] text-[#6B7280] font-mono block">Depth error vs GTO plan</span>
        </div>

        <div className="p-4 rounded-none border border-[#E2E5E8] bg-white shadow-2xs space-y-1">
          <span className="text-[10px] font-mono text-[#6B7280] uppercase font-bold block">Max Structural Drift</span>
          <div className="text-2xl font-black font-mono text-[#ED1C24]">
            +{maxDelta} <span className="text-xs font-normal text-[#6B7280]">m</span>
          </div>
          <span className="text-[10px] text-[#ED1C24] font-mono block">Barail Group Transition</span>
        </div>

        <div className="p-4 rounded-none border border-[#E2E5E8] bg-white shadow-2xs space-y-1">
          <span className="text-[10px] font-mono text-[#6B7280] uppercase font-bold block">Velocity Pull-Down Risk</span>
          <div className="text-2xl font-black font-mono text-[#34435A]">
            HIGH
          </div>
          <span className="text-[10px] text-[#F2B84B] font-mono font-bold block">Naga Imbricate Wedge</span>
        </div>

        <div className="p-4 rounded-none border border-[#E2E5E8] bg-white shadow-2xs space-y-1">
          <span className="text-[10px] font-mono text-[#6B7280] uppercase font-bold block">Real Records Verified</span>
          <div className="text-2xl font-black font-mono text-[#26A69A]">
            2 Wells
          </div>
          <span className="text-[10px] text-[#26A69A] font-mono font-bold block">+ Fleet Analog Benchmark</span>
        </div>

      </div>

      {/* ─── Field Aggregations Summary Strip ─── */}
      <div className="rounded-none border border-[#E2E5E8] bg-white p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E2E5E8]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#34435A]" />
            <h3 className="text-sm font-extrabold font-mono uppercase text-[#252B33]">
              Basin Field-Level Prediction Gap Summaries
            </h3>
          </div>
          <span className="text-xs font-mono text-[#6B7280]">
            Regional Naga Thrust Overlap
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          {FIELD_PREDICTION_GAP_SUMMARIES.map((f) => (
            <div 
              key={f.field}
              className="p-3.5 rounded-none border border-[#E2E5E8] bg-[#F5F7F8] space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#252B33] text-sm">{f.field}</span>
                <span className={`px-2 py-0.5 rounded-none text-[9px] font-bold ${
                  f.nagaTectonicRisk === 'CRITICAL'
                    ? 'bg-[#FDF2F2] text-[#ED1C24] border border-[#E05252]'
                    : f.nagaTectonicRisk === 'HIGH'
                    ? 'bg-[#FEF9EE] text-[#C68A1B] border border-[#F2B84B]'
                    : 'bg-[#D9F2EE] text-[#26A69A] border border-[#3FC3B6]'
                }`}>
                  {f.nagaTectonicRisk}
                </span>
              </div>

              <div className="space-y-1 pt-1 border-t border-[#E2E5E8]">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Mean Gap:</span>
                  <span className="font-extrabold text-[#ED1C24]">+{f.meanDeltaMeters}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Max Drift:</span>
                  <span className="font-extrabold text-[#252B33]">+{f.maxDriftMeters}m</span>
                </div>
                <div className="text-[10px] text-[#6B7280] truncate pt-1">
                  Vulnerable: <strong className="text-[#252B33]">{f.worstFormation}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Detailed GTO vs Actual Formation Table ─── */}
      <div className="rounded-none border border-[#E2E5E8] bg-white p-5 shadow-2xs space-y-4">
        
        {/* Table Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E5E8]">
          <div>
            <h3 className="text-base font-extrabold font-mono text-[#252B33]">
              Formation Top Depth Delta Register
            </h3>
            <p className="text-xs text-[#6B7280] font-sans">
              Prognosed (GTO) vs. Actual (Drill Cutting Sample) vs. Actual (Wireline Electric Log)
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
            {/* Field Filter */}
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="bg-white border border-[#E2E5E8] rounded-none px-2.5 py-1.5 font-bold text-[#252B33] focus:outline-hidden focus:border-[#3FC3B6]"
            >
              <option value="all">All Fields</option>
              <option value="Geleki">Geleki Field</option>
              <option value="Digboi">Digboi Field</option>
              <option value="Rudrasagar">Rudrasagar Field</option>
              <option value="Lakwa">Lakwa Field</option>
            </select>

            {/* Seismic Confidence Filter */}
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="bg-white border border-[#E2E5E8] rounded-none px-2.5 py-1.5 font-bold text-[#252B33] focus:outline-hidden focus:border-[#3FC3B6]"
            >
              <option value="all">All Seismic Confidence</option>
              <option value="LOW">Low Confidence</option>
              <option value="VERY_LOW">Very Low Confidence</option>
              <option value="MEDIUM">Medium Confidence</option>
              <option value="HIGH">High Confidence</option>
            </select>
          </div>
        </div>

        {/* Table Element */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-[#E2E5E8] text-[10px] text-[#6B7280] uppercase tracking-wider text-left bg-[#F5F7F8]">
                <th className="py-2.5 px-3">Well &amp; Field</th>
                <th className="py-2.5 px-3">Formation Horizon</th>
                <th className="py-2.5 px-3 text-right">Prognosed (GTO)</th>
                <th className="py-2.5 px-3 text-right">Actual (Sample)</th>
                <th className="py-2.5 px-3 text-right">Actual (W.Log)</th>
                <th className="py-2.5 px-3 text-right">Delta (Δm)</th>
                <th className="py-2.5 px-3 text-center">Seismic Conf.</th>
                <th className="py-2.5 px-3">Velocity Pull-Down Cause</th>
                <th className="py-2.5 px-3">Operational Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E5E8]">
              {filteredGaps.map((gap) => (
                <tr 
                  key={gap.id}
                  className="hover:bg-[#F5F7F8] transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#252B33] flex items-center gap-1.5">
                      {gap.isRealDataCalibrated && (
                        <span className="w-2 h-2 rounded-none bg-[#3FAE68] shrink-0" title="Genuine OIL India Record" />
                      )}
                      <span>{gap.wellName.split(' ')[0]}</span>
                    </div>
                    <div className="text-[10px] text-[#6B7280]">{gap.field}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-extrabold text-[#252B33]">
                      {gap.formationName}
                    </span>
                    <span className="text-[9px] text-[#6B7280] block">
                      {gap.sourceDocument}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right text-[#6B7280] font-bold">
                    {gap.prognosedDepthGTO.toFixed(1)}m
                  </td>

                  <td className="py-3 px-3 text-right text-[#6B7280]">
                    {gap.actualDepthSample.toFixed(1)}m
                  </td>

                  <td className="py-3 px-3 text-right font-extrabold text-[#252B33]">
                    {gap.actualDepthWLog.toFixed(1)}m
                  </td>

                  <td className="py-3 px-3 text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-none font-extrabold ${
                      gap.deltaMeters >= 50
                        ? 'bg-[#FDF2F2] text-[#ED1C24] border border-[#E05252]'
                        : gap.deltaMeters >= 30
                        ? 'bg-[#FEF9EE] text-[#C68A1B] border border-[#F2B84B]'
                        : 'bg-[#D9F2EE] text-[#26A69A] border border-[#3FC3B6]'
                    }`}>
                      +{gap.deltaMeters.toFixed(1)}m
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className={`px-1.5 py-0.5 rounded-none text-[9px] font-bold ${
                      gap.seismicConfidence === 'VERY_LOW' || gap.seismicConfidence === 'LOW'
                        ? 'bg-[#FDF2F2] text-[#ED1C24] border border-[#E05252]'
                        : gap.seismicConfidence === 'MEDIUM'
                        ? 'bg-[#FEF9EE] text-[#C68A1B] border border-[#F2B84B]'
                        : 'bg-[#D9F2EE] text-[#26A69A] border border-[#3FC3B6]'
                    }`}>
                      {gap.seismicConfidence}
                    </span>
                  </td>

                  <td className="py-3 px-3 max-w-[200px] text-[#6B7280] text-[11px] font-sans truncate" title={gap.velocityPullDownCause}>
                    {gap.velocityPullDownCause}
                  </td>

                  <td className="py-3 px-3 max-w-[240px] text-[#252B33] text-[11px] font-sans">
                    {gap.operationalImpact}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* ─── Integrated Feature 2: Sequential Mitigation Playbook ─── */}
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-extrabold font-mono text-[#252B33] uppercase tracking-wide">
            Connected Engineering Response · Sequential Mitigation Playbook
          </h2>
        </div>
        <p className="text-xs text-[#6B7280] font-sans">
          When the Geological Prediction Gap Index reveals that a formation is displaced, the rig executes this ordered Action → Parameter → Outcome protocol extracted from genuine OIL records.
        </p>

        <MitigationPlaybookCard />
      </section>

    </div>
  );
}
