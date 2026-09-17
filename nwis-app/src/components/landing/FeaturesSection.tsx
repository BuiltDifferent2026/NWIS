'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle2, 
  FileCheck2,
  TrendingDown,
  Scale
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-mono font-semibold mb-3 border border-neutral-200">
            <span>CORE ARCHITECTURAL PILLARS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950">
            Engineered Specifically for Subsurface Geology, Not Generic Chatbots.
          </h2>
          <p className="text-neutral-600 mt-3 text-base leading-relaxed">
            Most hackathon teams build a simple map or a generic LLM wrapper. NWIS delivers three hard-engineered non-negotiables: geospatial + geological correlation, auditable evidence separation, and proactive depth-corridor alerting.
          </p>
        </div>

        {/* Feature 1: "Auditable from Start to Finish" (Matching Reference Image Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-8 sm:p-12 rounded-3xl border border-neutral-200 bg-neutral-50/50">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center border border-amber-200">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-neutral-950">
              Auditable from Start to Finish
            </h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              Every single advisory strictly separates <strong>observed historical facts</strong>, <strong>model-estimated risks</strong>, and <strong>recommended mitigations</strong>—with immutable line-level citations back to the scanned Well Completion Report or Daily Drilling Report.
            </p>
            <div className="space-y-2 pt-2 text-xs text-neutral-600 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero hallucinations — grounded in OIL physical archives</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Confidence-tagged extractions (STRUCTURED-HIGH to MANUAL-REVIEW)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Surfaces clean safe passes alongside incidents to prevent alert fatigue</span>
              </div>
            </div>
          </div>

          {/* Interactive Auditable Card Snippet (Mirroring reference image) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-neutral-300 bg-white p-6 shadow-sm space-y-4">
              
              {/* Document Citation Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  <span className="font-bold text-neutral-900">
                    Source Document Attribution
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200 font-bold">
                  WCR-GLK-07-1996 / Page 19 • OCR-HIGH
                </span>
              </div>

              {/* The 4-Block Separation */}
              <div className="space-y-3 text-xs">
                
                {/* 1. Fact */}
                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-800">
                  <span className="font-mono font-bold text-neutral-950 uppercase text-[10px] block mb-1">
                    1. Observed Historical Fact (WCR Ground Truth)
                  </span>
                  <p className="leading-relaxed">
                    5 of 8 offset wells in Geleki field encountering Upper Tipam sandstones suffered total lost circulation (12–35 m³/hr) between 2,180m and 2,350m MD. OIL-GLK-07 lost 34 NPT hours at 2,280m MD.
                  </p>
                </div>

                {/* 2. Estimate */}
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-amber-950">
                  <span className="font-mono font-bold text-amber-900 uppercase text-[10px] block mb-1">
                    2. Model-Estimated Risk Corridor
                  </span>
                  <p className="leading-relaxed">
                    Elevated micro-fracture loss probability (78%) starting within 15 meters if equivalent circulating density exceeds 10.4 ppg.
                  </p>
                </div>

                {/* 3. Recommendation */}
                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 text-blue-950">
                  <span className="font-mono font-bold text-blue-900 uppercase text-[10px] block mb-1">
                    3. Recommended Mitigation (Field-Proven)
                  </span>
                  <p className="leading-relaxed">
                    Pre-treat active system with 35 ppb mixed-fiber LCM pill prior to 2,150m MD. Restrict pump flow rate to cap ECD at 10.2 ppg.
                  </p>
                </div>

                {/* 4. Disconfirming Evidence */}
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-950">
                  <span className="font-mono font-bold text-emerald-900 uppercase text-[10px] block mb-1">
                    4. Disconfirming Evidence (Absence of Risk)
                  </span>
                  <p className="leading-relaxed">
                    3 offset wells (OIL-GLK-11, OIL-GLK-09) successfully traversed this identical horizon with zero fluid loss by strictly maintaining ECD below 10.2 ppg.
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Feature 2: Dual Grid (Similarity ≠ Distance & Institutional Memory Decay) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card A: Similarity ≠ Distance */}
          <div className="p-8 rounded-3xl border border-neutral-200 bg-white hover:border-neutral-300 transition-all space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-neutral-950">
              Similarity ≠ Distance
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              In thrust-belt geology, the closest well on a map is often completely misleading. NWIS calculates dual independent scores for every offset well: pure Haversine distance and composite stratigraphic similarity.
            </p>
            
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200">
                <span className="text-neutral-500">Offset Comparison:</span>
                <span className="font-bold text-neutral-900">OIL-GLK-07 vs OIL-GLK-02</span>
              </div>
              <div className="flex items-center justify-between text-emerald-700">
                <span>OIL-GLK-07 (15.2 km away)</span>
                <span className="font-bold">0.84 Stratigraphic Sim (Barail)</span>
              </div>
              <div className="flex items-center justify-between text-neutral-500">
                <span>OIL-GLK-02 (2.1 km away)</span>
                <span className="font-bold">0.42 Sim (Faulted Discontinuity)</span>
              </div>
            </div>

            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 hover:text-amber-700 transition-colors pt-2"
            >
              <span>Explore Workspace Table</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card B: Institutional Memory Decay Index */}
          <div id="decay-index" className="p-8 rounded-3xl border border-neutral-200 bg-white hover:border-neutral-300 transition-all space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-neutral-950">
              Institutional Memory Decay Index
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Every team claims &ldquo;knowledge is being lost.&rdquo; We actually compute it: a per-field quantification measuring paper-record percentages, average archive age, and retiring personnel knowledge erosion.
            </p>
            
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 font-mono text-xs space-y-2.5">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-bold text-neutral-900">Digboi Field (1889 heritage)</span>
                  <span className="text-rose-700 font-bold">88/100 Decay Risk</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
                  <div className="h-full bg-rose-600 rounded-full" style={{ width: '88%' }} />
                </div>
                <span className="text-[10px] text-neutral-500">58% paper-only • 851 records at risk</span>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-bold text-neutral-900">Geleki Field (Barail high-pressure)</span>
                  <span className="text-amber-700 font-bold">68/100 Decay Risk</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
                  <div className="h-full bg-amber-600 rounded-full" style={{ width: '68%' }} />
                </div>
                <span className="text-[10px] text-neutral-500">Critical 1980s kick post-mortems in scanned TIFFs</span>
              </div>
            </div>

            <div className="text-xs text-neutral-500 font-mono pt-1">
              Gives OIL management clear, ranked priorities for ongoing record digitization.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
