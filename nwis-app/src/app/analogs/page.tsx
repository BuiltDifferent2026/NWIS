'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  GitCompare, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  ArrowRight, 
  Compass, 
  ShieldCheck,
  HardHat,
  ChevronRight
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AnalogCase {
  id: string;
  targetFormation: string;
  targetField: string;
  targetDepth: string;
  targetLithology: string;
  analogFormation: string;
  analogBasin: string;
  analogDistanceKm: string;
  matchScore: number;
  subsurfaceRationale: string;
  vectors: {
    label: string;
    targetValue: string;
    analogValue: string;
    matchPercent: number;
  }[];
  transferableLesson: {
    provenMudWeight: string;
    effectiveMitigation: string;
    hydraulicsRule: string;
    verifiedOutcome: string;
  };
  provenanceCitations: {
    docRef: string;
    well: string;
    year: string;
  }[];
}

const ANALOG_CASES: Record<string, AnalogCase> = {
  'tipam-sandstone': {
    id: 'tipam-sandstone',
    targetFormation: 'Tipam Sandstone (Upper Member)',
    targetField: 'Geleki Field (Assam)',
    targetDepth: '2,180m – 2,350m MD',
    targetLithology: 'Coarse braided sandstone with micro-fractures',
    analogFormation: 'Hugin Sandstone (Volve Field Analog)',
    analogBasin: 'North Sea (Volve Sector) / Digboi Reservoir',
    analogDistanceKm: '7,420 km (Geographic) • 0.94 Similarity',
    matchScore: 94,
    subsurfaceRationale: 'Despite being thousands of kilometers apart, both formations share near-identical depletion-induced fracture propagation when equivalent circulating density (ECD) exceeds 10.6 ppg.',
    vectors: [
      { label: 'Matrix Permeability', targetValue: '220–480 mD', analogValue: '250–510 mD', matchPercent: 96 },
      { label: 'Effective Porosity', targetValue: '21–25%', analogValue: '22–26%', matchPercent: 98 },
      { label: 'Pore Pressure Gradient', targetValue: '0.44 psi/ft (Depleted)', analogValue: '0.45 psi/ft (Depleted)', matchPercent: 97 },
      { label: 'Loss Mechanism', targetValue: 'Stress-dilation micro-fractures', analogValue: 'Stress-dilation micro-fractures', matchPercent: 95 },
      { label: 'Shale Reactivity (Cation Ex.)', targetValue: 'Low (12 meq/100g)', analogValue: 'Low (10 meq/100g)', matchPercent: 92 }
    ],
    transferableLesson: {
      provenMudWeight: '9.8 – 10.2 ppg (Cap ECD at 10.4 ppg)',
      effectiveMitigation: 'Pre-treat active system with 35 ppb multi-modal fiber blend (coarse CaCO3 + resilient graphitic carbon). Avoid pumping unweighted water flushes.',
      hydraulicsRule: 'Limit annular velocity to <60 m/min in 8.5" hole to keep surge pressures below 0.35 ppg.',
      verifiedOutcome: '100% circulation retained across 4 offset analog wells that deployed pre-emptive LCM pills.'
    },
    provenanceCitations: [
      { docRef: 'WCR-GLK-03-1988/p42', well: 'Geleki-03', year: '1988' },
      { docRef: 'SPE-194218-MS', well: 'Volve Field Study (Open Equinor Benchmark)', year: '2018' },
      { docRef: 'DDR-GLK-11-2012/p104', well: 'Geleki-11', year: '2012' }
    ]
  },
  'barail-transition': {
    id: 'barail-transition',
    targetFormation: 'Barail Group (Transition Zone)',
    targetField: 'Geleki & Lakwa (Assam)',
    targetDepth: '2,920m – 3,110m MD',
    targetLithology: 'Alternating coal seams, carbonaceous shales & tight sands',
    analogFormation: 'Kopili Marine Shale Overpressure Regime',
    analogBasin: 'Rudrasagar Field (Assam Basin Deep)',
    analogDistanceKm: '18 km (Regional) • 0.89 Similarity',
    matchScore: 89,
    subsurfaceRationale: 'Both horizons exhibit an aggressive pore pressure transition where gradient ramps from normal (10.2 ppg) to severe overpressure (13.1 ppg) within an 80m vertical drilling window.',
    vectors: [
      { label: 'Pore Pressure Ramp Rate', targetValue: '+2.9 ppg / 80m vertical', analogValue: '+3.1 ppg / 75m vertical', matchPercent: 94 },
      { label: 'Gas Influx Severity', targetValue: '25–40 bbl/hr gas-cut mud', analogValue: '30–50 bbl/hr kick volume', matchPercent: 91 },
      { label: 'In-situ Tectonic Stress', targetValue: 'Moderate compressive', analogValue: 'High compressive', matchPercent: 88 },
      { label: 'Fracture Gradient Margin', targetValue: 'Narrow (0.8 ppg window)', analogValue: 'Narrow (0.6 ppg window)', matchPercent: 93 },
      { label: 'Sonic Transit Time (DT)', targetValue: '98–115 μs/ft', analogValue: '102–118 μs/ft', matchPercent: 95 }
    ],
    transferableLesson: {
      provenMudWeight: '12.6 – 13.0 ppg before penetrating boundary',
      effectiveMitigation: 'Elevate active pit density to 12.6 ppg at 2,900m MD (30m ahead of seismic marker). Stage high-density kill mud (14.2 ppg) in reserve pit.',
      hydraulicsRule: 'Perform slow pump rate (SPR) checks every 50m. Flow check for 10 minutes upon 5m/hr ROP increase.',
      verifiedOutcome: 'Zero kicks recorded in Geleki-12 after applying pre-emptive mud weighting protocol.'
    },
    provenanceCitations: [
      { docRef: 'WCR-GLK-04-1991/p78', well: 'Geleki-04', year: '1991' },
      { docRef: 'WCR-RDS-04-1985/p91', well: 'Rudrasagar-04', year: '1985' },
      { docRef: 'DDR-GLK-12-2015/p89', well: 'Geleki-12', year: '2015' }
    ]
  },
  'girujan-clay': {
    id: 'girujan-clay',
    targetFormation: 'Girujan Clay (Regional Seal)',
    targetField: 'Digboi Field (Assam)',
    targetDepth: '1,350m – 1,620m MD',
    targetLithology: 'Highly reactive smectite-illite swelling mudstone',
    analogFormation: 'Kharsang Sub-Thrust Tectonic Shale',
    analogBasin: 'Kharsang Field (Arunachal Foothills)',
    analogDistanceKm: '32 km (Regional) • 0.85 Similarity',
    matchScore: 85,
    subsurfaceRationale: 'Severe borehole instability driven by clay hydration swelling combined with tectonic anisotropic stress, causing mechanical pack-off during wiper trips.',
    vectors: [
      { label: 'Smectite Fraction', targetValue: '38–44%', analogValue: '35–40%', matchPercent: 92 },
      { label: 'Dispersion Tendency', targetValue: 'High (>60% in water)', analogValue: 'High (>55% in water)', matchPercent: 90 },
      { label: 'Hole Enlargement Ratio', targetValue: '1.45x (Caliper Log)', analogValue: '1.52x (Caliper Log)', matchPercent: 88 },
      { label: 'Time-Dependent Closure', targetValue: '1.2 mm/hr after 24h', analogValue: '1.4 mm/hr after 24h', matchPercent: 93 },
      { label: 'Pore Fluid Salinity', targetValue: 'Low (freshwater seal)', analogValue: 'Low (freshwater seal)', matchPercent: 96 }
    ],
    transferableLesson: {
      provenMudWeight: '10.4 – 10.8 ppg with chemical inhibition',
      effectiveMitigation: 'Maintain 8–10% KCl with 1.5 ppb PHPA polymer. Limit static string exposure time to under 3 minutes during connections.',
      hydraulicsRule: 'Conduct short wiper trips every 100m. Ream all connections through tight intervals.',
      verifiedOutcome: 'Tripping drag reduced by 72% in Digboi-10 after deploying potassium polymer system.'
    },
    provenanceCitations: [
      { docRef: 'WCR-DGB-02-1975/p28', well: 'Digboi-02', year: '1975' },
      { docRef: 'WCR-KHS-02-1986/p54', well: 'Kharsang-02', year: '1986' },
      { docRef: 'DDR-DGB-10-2008/p64', well: 'Digboi-10', year: '2008' }
    ]
  }
};

export default function AnalogsPage() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('tipam-sandstone');
  const currentCase = ANALOG_CASES[selectedCaseId];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* ─── Breadcrumb ─── */}
      <Breadcrumb
        items={[
          { label: 'Intelligence', href: '/dashboard' },
          { label: 'Cross-Formation Analog Engine' }
        ]}
      />

      {/* ─── Header Strip ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-mono">
            Cross-Formation Analog Engine
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Petrophysical similarity and stratigraphic twin matching across the Assam-Arakan Basin.
          </p>
        </div>

        <Badge variant="outline" className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700 py-1.5 px-3">
          SIMILARITY ≠ DISTANCE
        </Badge>
      </div>

      {/* ─── Formation Selector Tabs (Clean & Uncluttered) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Object.values(ANALOG_CASES).map((item) => {
          const isSelected = item.id === selectedCaseId;
            return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedCaseId(item.id)}
              className={`p-4 rounded-none border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#34435A] text-white border-l-4 border-l-[#ED1C24] border-y border-r border-[#3FC3B6] shadow-xs'
                  : 'bg-white text-[#252B33] border-[#E2E5E8] hover:border-[#34435A] hover:bg-[#F5F7F8] shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-mono uppercase font-bold ${isSelected ? 'text-[#3FC3B6]' : 'text-[#6B7280]'}`}>
                  {item.targetField}
                </span>
                <span className={`text-[11px] font-mono font-extrabold ${isSelected ? 'text-[#3FAE68]' : 'text-[#3FAE68]'}`}>
                  {item.matchScore}% Match
                </span>
              </div>
              <div className="font-extrabold text-sm tracking-tight truncate">
                {item.targetFormation}
              </div>
              <div className={`text-xs mt-1 truncate ${isSelected ? 'text-[#D9F2EE]' : 'text-[#6B7280]'}`}>
                Matched: {item.analogFormation}
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── Main Analog Comparison Card ─── */}
      <Card className="rounded-none border border-[#E2E5E8] bg-white p-6 shadow-2xs space-y-6">
        
        {/* Top Comparison Summary */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-none bg-[#F5F7F8] border border-[#E2E5E8]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#6B7280] dark:text-neutral-400 mb-1">
              <span>Target Formation Horizon:</span>
              <strong className="text-[#252B33] dark:text-white">{currentCase.targetDepth}</strong>
            </div>
            <div className="text-lg font-extrabold text-[#252B33] dark:text-white">
              {currentCase.targetFormation}
            </div>
            <p className="text-xs text-[#6B7280] dark:text-neutral-400 mt-1">
              {currentCase.targetLithology}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[11px] font-mono text-[#6B7280] dark:text-neutral-400 uppercase">Geological Analog</div>
              <div className="text-sm font-extrabold text-[#252B33] dark:text-white">{currentCase.analogFormation}</div>
              <div className="text-[11px] font-mono text-[#6B7280] dark:text-neutral-400">{currentCase.analogDistanceKm}</div>
            </div>
            <div className="w-14 h-14 rounded-none bg-[#34435A] text-white border-2 border-[#3FC3B6] flex flex-col items-center justify-center font-mono shadow-xs">
              <span className="text-base font-extrabold leading-none text-[#3FC3B6]">{currentCase.matchScore}%</span>
              <span className="text-[9px] uppercase font-bold tracking-tighter">Similarity</span>
            </div>
          </div>
        </div>

        {/* Subsurface Rationale */}
        <div className="text-xs sm:text-sm text-[#252B33] dark:text-neutral-300 leading-relaxed font-sans bg-[#D9F2EE]/40 p-4 rounded-none border border-[#3FC3B6]">
          <strong className="text-[#26A69A] block mb-0.5 font-bold">Subsurface Twinning Rationale:</strong>
          {currentCase.subsurfaceRationale}
        </div>

        {/* ─── 5-Vector Petrophysical Match Matrix ─── */}
        <div className="space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#6B7280] dark:text-neutral-400">
            Petrophysical Parameter Alignment Matrix (5 Vectors)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentCase.vectors.map((vec) => (
              <div key={vec.label} className="p-3.5 rounded-none border border-[#E2E5E8] bg-white space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-[#252B33] dark:text-white">{vec.label}</span>
                  <Badge variant="outline" className="text-[10px] font-mono bg-[#D9F2EE] text-[#26A69A] border-[#3FC3B6] font-bold rounded-none">
                    {vec.matchPercent}%
                  </Badge>
                </div>

                <div className="space-y-1 text-xs font-mono pt-1 border-t border-[#E2E5E8]">
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Target:</span>
                    <span className="text-[#252B33] dark:text-neutral-200 font-semibold">{vec.targetValue}</span>
                  </div>
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Analog:</span>
                    <span className="text-[#252B33] dark:text-neutral-200 font-semibold">{vec.analogValue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Transferable Operational Playbook ─── */}
        <div className="p-5 rounded-none border border-[#3FAE68] bg-[#F5F7F8] text-[#252B33] space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3FAE68]" />
              <h3 className="font-extrabold text-sm text-[#252B33] dark:text-white">
                Transferable Engineering Playbook
              </h3>
            </div>
            <Badge className="bg-[#D9F2EE] text-[#26A69A] border border-[#3FC3B6] text-[10px] font-mono font-bold rounded-none">
              PRE-CLEARED GUIDANCE
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-[#6B7280] uppercase text-[10px] font-mono font-bold block">Recommended Mud Weight</span>
              <strong className="text-[#26A69A] text-sm font-mono block">
                {currentCase.transferableLesson.provenMudWeight}
              </strong>
            </div>

            <div className="space-y-1">
              <span className="text-[#6B7280] uppercase text-[10px] font-mono font-bold block">Proven Mitigation Strategy</span>
              <p className="text-[#252B33] dark:text-neutral-300 font-sans leading-relaxed">
                {currentCase.transferableLesson.effectiveMitigation}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[#6B7280] uppercase text-[10px] font-mono font-bold block">Hydraulics & Tripping Rules</span>
              <p className="text-[#252B33] dark:text-neutral-300 font-sans leading-relaxed">
                {currentCase.transferableLesson.hydraulicsRule}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[#6B7280] uppercase text-[10px] font-mono font-bold block">Verified Historical Outcome</span>
              <p className="text-[#252B33] dark:text-neutral-300 font-sans leading-relaxed">
                {currentCase.transferableLesson.verifiedOutcome}
              </p>
            </div>
          </div>
        </div>

        {/* Citations & Evidence Trail */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#6B7280] border-t border-[#E2E5E8]">
          <div className="flex items-center gap-2 flex-wrap">
            <BookOpen className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>Verified Source Files:</span>
            {currentCase.provenanceCitations.map((c, i) => (
              <span key={i} className="px-2 py-0.5 rounded-none bg-[#F5F7F8] border border-[#E2E5E8] text-[#252B33] dark:text-neutral-200 font-bold">
                {c.docRef} ({c.year})
              </span>
            ))}
          </div>
          <span className="text-[#6B7280] text-[11px]">
            Powered by Assam Basin Geospatial & Petrophysical Vector Engine
          </span>
        </div>

      </Card>

    </div>
  );
}
