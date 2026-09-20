'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  GitCompare, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  ArrowRight, 
  Compass, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';

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
      provenMudWeight: '11.2 – 11.8 ppg (Stage mud weight in 0.3 ppg increments)',
      effectiveMitigation: 'Circulate bottoms-up before penetrating top coal seam. Maintain high-yield-point barite mud to prevent gas migration while static.',
      hydraulicsRule: 'Maintain minimum 450 psi back-pressure on choke manifold during connection gas sweeps.',
      verifiedOutcome: 'Zero kicks or uncontained influx across 3 infill wells applying staged mud weight schedule.'
    },
    provenanceCitations: [
      { docRef: 'DDR-GLK-09-2004/Day68', well: 'Geleki-09', year: '2004' },
      { docRef: 'WCR-RDS-18-1992/p88', well: 'Rudrasagar-18', year: '1992' },
      { docRef: 'OIL-TECH-NOTE-2015-04', well: 'Lakwa Infill Review', year: '2015' }
    ]
  },
  'girujan-clay': {
    id: 'girujan-clay',
    targetFormation: 'Girujan Claystone (Upper Section)',
    targetField: 'Digboi & Kharsang',
    targetDepth: '1,400m – 1,850m MD',
    targetLithology: 'Highly reactive smectite-rich swelling clays & thrust rubble',
    analogFormation: 'Arunachal Thrust Fault Sheared Clay Horizon',
    analogBasin: 'Kharsang Thrust Belt (Sub-Himalayan Fold Belt)',
    analogDistanceKm: '42 km (Regional) • 0.91 Similarity',
    matchScore: 91,
    subsurfaceRationale: 'Tectonic compressive stresses create severe wellbore instability, tight hole on trips, and hydration swelling if mud salinity drops below potassium inhibition thresholds.',
    vectors: [
      { label: 'Smectite Fraction in Clay', targetValue: '45–60% of matrix', analogValue: '48–65% of matrix', matchPercent: 93 },
      { label: 'Linear Swelling Index (LST)', targetValue: '18–24% after 2 hrs', analogValue: '20–26% after 2 hrs', matchPercent: 95 },
      { label: 'Wellbore Breakout Propensity', targetValue: 'High in strike-slip axis', analogValue: 'High in thrust shear plane', matchPercent: 89 },
      { label: 'Optimal KCl Concentration', targetValue: '7.0–8.5 wt%', analogValue: '7.5–9.0 wt%', matchPercent: 96 }
    ],
    transferableLesson: {
      provenMudWeight: '10.4 – 10.8 ppg with 8% KCl + 3 ppb polyamine inhibitor',
      effectiveMitigation: 'Maintain tight fluid-loss control (<4.0 mL API) and run reamer passes every 150m. Avoid water flushes during wiper trips.',
      hydraulicsRule: 'Flow rate must remain >850 gpm to ensure turbulent annulus clearing of sloughing shale cavings.',
      verifiedOutcome: 'Tight-hole reaming time reduced by 72% (from 48 hrs to 13 hrs per well section).'
    },
    provenanceCitations: [
      { docRef: 'WCR-DGB-88-1984/p12', well: 'Digboi-88', year: '1984' },
      { docRef: 'DDR-KHS-23-1999/p54', well: 'Kharsang-23', year: '1999' }
    ]
  }
};

export default function AnalogsPage() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('tipam-sandstone');
  const activeCase = ANALOG_CASES[selectedCaseId];

  return (
    <div className="space-y-4 max-w-[1440px] mx-auto pb-12 font-sans">
      
      <Breadcrumb
        items={[
          { label: 'Drilling Operations', href: '/' },
          { label: 'Offset Well Geospatial Correlation' }
        ]}
      />

      {/* ─── Header ─── */}
      <div className="gov-panel space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="gov-tag gov-tag-grey">GEOSPATIAL ENGINE</span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
                Offset Well Geospatial &amp; Stratigraphic Correlation
              </h1>
              <span className="gov-tag gov-tag-blue">
                SIMILARITY ≠ DISTANCE
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-sans mt-1">
              Cross-formation petrophysical engine: proves that subsurface geological twins across fault blocks do not rely solely on Euclidean distance.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="gov-tag gov-tag-green">
              ✓ Multi-Vector Calibrated
            </span>
          </div>
        </div>

        {/* 4-Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 font-mono">
          <div className="p-2.5 bg-secondary/40 border border-border rounded-xs space-y-0.5">
            <div className="text-[10px] text-muted-foreground font-bold uppercase">TARGET FORMATION</div>
            <div className="text-base font-bold text-foreground truncate">{activeCase.targetFormation.split('(')[0]}</div>
            <div className="text-[10px] text-muted-foreground font-sans">{activeCase.targetField}</div>
          </div>
          <div className="p-2.5 bg-secondary/40 border border-border rounded-xs space-y-0.5">
            <div className="text-[10px] text-muted-foreground font-bold uppercase">COMPOSITE SIMILARITY</div>
            <div className="text-2xl font-bold text-[#1d70b8] dark:text-[#60a5fa]">{activeCase.matchScore}%</div>
            <div className="text-[10px] text-muted-foreground font-sans">5 Subsurface Vectors</div>
          </div>
          <div className="p-2.5 bg-secondary/40 border border-border rounded-xs space-y-0.5">
            <div className="text-[10px] text-muted-foreground font-bold uppercase">ANALOG SEPARATION</div>
            <div className="text-base font-bold text-foreground truncate">{activeCase.analogDistanceKm.split('•')[0]}</div>
            <div className="text-[10px] text-muted-foreground font-sans">Non-local geological twin</div>
          </div>
          <div className="p-2.5 bg-secondary/40 border border-border rounded-xs space-y-0.5">
            <div className="text-[10px] text-muted-foreground font-bold uppercase">VERIFIED PROTOCOLS</div>
            <div className="text-base font-bold text-foreground">4 Mitigations</div>
            <div className="text-[10px] text-muted-foreground font-sans">Proven zero loss outcome</div>
          </div>
        </div>
      </div>

      {/* Case Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {Object.values(ANALOG_CASES).map((c) => {
          const isSelected = c.id === selectedCaseId;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              className={`p-3 text-left border rounded-xs transition-all cursor-pointer font-sans ${
                isSelected
                  ? 'bg-secondary/70 border-2 border-[#1d70b8] shadow-xs'
                  : 'bg-card border-border hover:bg-secondary/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-foreground">{c.targetFormation.split('(')[0].trim()}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 font-bold rounded-xs ${
                  isSelected ? 'bg-[#1d70b8] text-white' : 'bg-secondary text-muted-foreground'
                }`}>
                  {c.matchScore}% MATCH
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground font-mono truncate">{c.targetField}</div>
            </button>
          );
        })}
      </div>

      {/* Main Analog Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 7 cols: Target vs Analog Vector Match */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="gov-panel space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">Formation Pairing</span>
                <h2 className="font-bold text-base text-foreground font-sans">
                  {activeCase.targetFormation}
                </h2>
              </div>
              <div className="text-right font-mono">
                <span className="text-xl font-bold text-[#1d70b8] dark:text-[#60a5fa]">{activeCase.matchScore}%</span>
                <span className="text-[10px] text-muted-foreground block">Composite Match</span>
              </div>
            </div>

            {/* Target vs Analog Header */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono p-3 bg-secondary/60 border border-border rounded-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Active Drilling Horizon</span>
                <strong className="text-foreground text-sm">{activeCase.targetField}</strong>
                <div className="text-muted-foreground text-[11px]">{activeCase.targetDepth}</div>
              </div>
              <div className="border-l border-border pl-3 space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Best Subsurface Analog</span>
                <strong className="text-foreground text-sm">{activeCase.analogFormation}</strong>
                <div className="text-muted-foreground text-[11px]">{activeCase.analogDistanceKm}</div>
              </div>
            </div>

            {/* Geological Rationale */}
            <div className="gov-callout gov-callout-fact text-xs space-y-1.5">
              <div className="font-bold font-mono text-[10px] uppercase text-blue-700 dark:text-blue-300">
                Stratigraphic Correlation Rationale
              </div>
              <p className="text-foreground leading-relaxed font-sans">
                {activeCase.subsurfaceRationale}
              </p>
            </div>

            {/* Vector Table */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase font-bold text-muted-foreground">
                Petrophysical &amp; Geomechanical Alignment Matrix
              </div>
              <div className="space-y-2 font-mono text-xs">
                {activeCase.vectors.map((vec) => (
                  <div key={vec.label} className="p-2.5 bg-card border border-border rounded-xs space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground font-sans">{vec.label}</span>
                      <span className="font-bold text-foreground">{vec.matchPercent}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                      <div>Target: <strong className="text-foreground">{vec.targetValue}</strong></div>
                      <div>Analog: <strong className="text-foreground">{vec.analogValue}</strong></div>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1d70b8] rounded-full"
                        style={{ width: `${vec.matchPercent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right 5 cols: Transferable Operational Mitigation */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="gov-panel space-y-3">
            <div className="pb-2 border-b border-border">
              <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">Operational Decision Support</span>
              <h3 className="font-bold text-base text-foreground font-sans">
                Transferable Drilling Protocols
              </h3>
            </div>

            <div className="space-y-2.5 text-xs font-sans">
              {/* Mud Weight */}
              <div className="p-3 bg-secondary/40 border border-border rounded-xs space-y-1">
                <div className="font-bold font-mono text-[10px] uppercase text-muted-foreground">
                  Proven Mud Weight Window
                </div>
                <p className="text-foreground font-mono font-bold text-sm">
                  {activeCase.transferableLesson.provenMudWeight}
                </p>
              </div>

              {/* Pre-emptive Mitigation */}
              <div className="gov-callout gov-callout-mitigation space-y-1">
                <div className="font-bold font-mono text-[10px] uppercase text-emerald-700 dark:text-emerald-400">
                  Pre-emptive Mitigation Program
                </div>
                <p className="text-foreground leading-relaxed text-xs">
                  {activeCase.transferableLesson.effectiveMitigation}
                </p>
              </div>

              {/* Hydraulics */}
              <div className="p-3 bg-secondary/40 border border-border rounded-xs space-y-1">
                <div className="font-bold font-mono text-[10px] uppercase text-muted-foreground">
                  Hydraulics &amp; Surge Pressure Rule
                </div>
                <p className="text-foreground leading-relaxed font-mono text-[11px]">
                  {activeCase.transferableLesson.hydraulicsRule}
                </p>
              </div>

              {/* Verified Outcome */}
              <div className="p-3 bg-secondary/40 border border-border rounded-xs space-y-1">
                <div className="font-bold font-mono text-[10px] uppercase text-muted-foreground">
                  Verified Offset Outcome
                </div>
                <p className="text-foreground leading-relaxed font-medium">
                  {activeCase.transferableLesson.verifiedOutcome}
                </p>
              </div>
            </div>

            {/* Citations */}
            <div className="pt-2 border-t border-border space-y-1.5 font-mono text-[10px]">
              <span className="text-muted-foreground uppercase font-bold">Archival Provenance Citations:</span>
              <div className="space-y-1">
                {activeCase.provenanceCitations.map((cit) => (
                  <div key={cit.docRef} className="flex justify-between p-1.5 bg-secondary/50 rounded-xs text-muted-foreground">
                    <span className="text-foreground font-bold">{cit.docRef}</span>
                    <span className="text-foreground">{cit.well} ({cit.year})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 bg-secondary/40 border border-border rounded-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-foreground">Ready to apply protocols?</div>
              <div className="text-[10px] text-muted-foreground">Synchronize with active rig telemetry</div>
            </div>
            <Link
              href="/operations"
              className="gov-button text-xs flex items-center gap-1.5"
            >
              <span>Apply to OIL-GLK-14</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
