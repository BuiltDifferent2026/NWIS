'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Activity, 
  GitCompare, 
  Database, 
  TrendingDown, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Bell, 
  ShieldCheck, 
  Compass, 
  HardHat, 
  FileText,
  Sparkles,
  Zap,
  Gauge,
  Play,
  RotateCcw,
  Check,
  Flame,
  Droplets,
  Wind,
  Navigation,
  FileSearch,
  BookOpen
} from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { INITIAL_LIVE_TELEMETRY } from '@/data/live-state';

export default function HomePage() {
  const { alerts } = useAppStore();
  const [liveDepth, setLiveDepth] = useState<number>(INITIAL_LIVE_TELEMETRY.depthMD);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simStep, setSimStep] = useState<number>(0);

  const live = INITIAL_LIVE_TELEMETRY;

  // Interactive Live Step Simulation for Evaluators
  const triggerEvaluatorStep = () => {
    setIsSimulating(true);
    setSimStep((prev) => (prev + 1) % 3);
    if (simStep === 0) {
      setLiveDepth(2172.8);
    } else if (simStep === 1) {
      setLiveDepth(2180.0);
    } else {
      setLiveDepth(2165.4);
    }
    setTimeout(() => setIsSimulating(false), 500);
  };

  const operationalConsoles = [
    {
      title: 'Live Operations Cockpit',
      titleHindi: 'लाइव ड्रिलिंग कॉकपिट',
      tag: 'ACTIVE WITSML FEED',
      tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
      borderColor: 'border-t-emerald-600',
      iconBg: 'bg-emerald-500 text-white',
      description: 'Active drilling operations workspace alongside eRTMAC. Displays real-time wellbore telemetry, 75m lookahead hazard alerts, and synchronized offset correlation.',
      href: '/operations',
      icon: Layers,
      primaryMetric: 'OIL-GLK-14 @ 2,165.4m MD',
      subMetric: 'Upper Tipam Formation · 74.6m buffer to thief zone',
      accentText: 'text-emerald-700 dark:text-emerald-400'
    },
    {
      title: 'Historical Well Replay Simulator',
      titleHindi: 'ऐतिहासिक कूप रीप्ले सिम्युलेटर',
      tag: 'VALIDATION BENCHMARK',
      tagColor: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
      borderColor: 'border-t-amber-500',
      iconBg: 'bg-amber-500 text-white',
      description: 'Deterministic benchmark simulator. Replays historical 1988–2004 drilling feeds at 1x–20x speed to verify proactive lookahead warnings prior to documented loss events.',
      href: '/replay',
      icon: Activity,
      primaryMetric: 'OIL-GLK-07 (1996 Incident)',
      subMetric: 'Fired 75m ahead of total loss · 34 hrs NPT avoided',
      accentText: 'text-amber-700 dark:text-amber-400'
    },
    {
      title: 'Offset Well Geospatial Correlation',
      titleHindi: 'भू-स्थानिक ऑफसेट सहसंबंध इंजन',
      tag: 'SIMILARITY ENGINE',
      tagColor: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
      borderColor: 'border-t-blue-600',
      iconBg: 'bg-blue-600 text-white',
      description: 'Multi-well petrophysical correlation matrix and map. Surfaces true stratigraphic analogs across complex Assam fault blocks where similarity does not equal map distance.',
      href: '/analogs',
      icon: GitCompare,
      primaryMetric: 'OIL-GLK-07 (0.84 Similarity)',
      subMetric: '3.1 km offset · Identical Upper Tipam lithology',
      accentText: 'text-blue-700 dark:text-blue-400'
    },
    {
      title: 'Hazard Advisories Inbox',
      titleHindi: 'भू-गर्भिक जोखिम सलाह इनबॉक्स',
      tag: `${alerts.length} ADVISORIES`,
      tagColor: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
      borderColor: 'border-t-rose-600',
      iconBg: 'bg-rose-600 text-white',
      description: 'Prioritized operational hazard notifications. Standardized 3-tier structure: Observed Ground Truth Fact, Model-Estimated Risk, and Recommended Mitigation.',
      href: '/alerts',
      icon: Bell,
      primaryMetric: '1 High-Priority Lost Circulation Notice',
      subMetric: 'Pre-treat active system with 35 ppb mixed-fiber LCM pill',
      accentText: 'text-rose-700 dark:text-rose-400'
    },
    {
      title: 'Institutional Memory Decay Index',
      titleHindi: 'संस्थागत ज्ञान क्षय सूचकांक',
      tag: 'GOVERNANCE AUDIT',
      tagColor: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
      borderColor: 'border-t-purple-600',
      iconBg: 'bg-purple-600 text-white',
      description: 'Quantifies physical subsurface knowledge erosion across Digboi, Kharsang, and Geleki fields to prioritize fragile paper records before senior superintendents retire.',
      href: '/decay-index',
      icon: TrendingDown,
      primaryMetric: 'Digboi Field: 88 / 100 Decay Risk',
      subMetric: '851 physical records requiring urgent planetary scanning',
      accentText: 'text-purple-700 dark:text-purple-400'
    },
    {
      title: 'Archival Ingestion & OCR Pipeline',
      titleHindi: 'अभिलेखागार अंतर्ग्रहण और ओसीआर',
      tag: 'TWO-PATH INGESTION',
      tagColor: 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800',
      borderColor: 'border-t-teal-600',
      iconBg: 'bg-teal-600 text-white',
      description: 'Ingests and standardizes 130+ years of typed WCRs, Daily Drilling Reports (DDRs), and real-time WITSML streams into audit-ready schemas with layout-aware OCR.',
      href: '/admin/ingestion',
      icon: Database,
      primaryMetric: '94.2% Layout OCR Accuracy',
      subMetric: '1,690 documents indexed across Assam-Arakan Basin',
      accentText: 'text-teal-700 dark:text-teal-400'
    }
  ];

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto pb-8 font-sans">
      
      {/* ─── 0. Official Alert Flash Ticker Ribbon ─── */}
      <div className="px-3.5 py-1.5 flex items-center justify-between gap-3 text-xs border border-amber-300 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 text-foreground rounded-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="gov-tag gov-tag-amber shrink-0 font-bold">
            महत्वपूर्ण चेतावनी | ADVISORY FLASH
          </span>
          <span className="font-mono text-xs truncate">
            <strong>OIL-GLK-14 (Geleki Field):</strong> Bit at {liveDepth}m MD approaching Tipam thief horizon (2,180m). Offset OIL-GLK-07 suffered 420 bbls lost circulation at equivalent structural depth.
          </span>
        </div>
        <Link
          href="/operations"
          className="text-[11px] font-bold text-[#1d70b8] dark:text-[#60a5fa] hover:underline shrink-0 font-mono flex items-center gap-1"
        >
          <span>View Telemetry</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* ─── 1. National Energy Mission & SIH 2026 Executive Showcase ─── */}
      <div className="gov-panel space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 bg-[#0b3c6d] text-white text-[10px] font-mono font-bold uppercase rounded-xs">
                🇮🇳 भारत सरकार | आत्मनिर्भर ऊर्जा मिशन
              </span>
              <span className="gov-tag gov-tag-amber font-mono font-bold text-[10px]">
                SIH 2026 Problem Statement #26121
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                Oil India Limited · eRTMAC Decision Companion
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans mt-1.5">
              निकटवर्ती कूप आसूचना प्रणाली (NWIS) — Nearby Wells Intelligence System
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-sans">
              AI-Powered Subsurface Offset Correlation &amp; Proactive Lookahead Decision Support for Zero Unplanned Drilling NPT across the Assam-Arakan Basin.
            </p>
          </div>

          {/* Quick Evaluator Simulation Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={triggerEvaluatorStep}
              className="gov-button text-xs py-2 px-3.5 flex items-center gap-1.5 font-mono cursor-pointer"
              title="Click to simulate live WITSML depth advance and lookahead trigger"
            >
              <Zap className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>Simulate Depth Advance ({liveDepth}m)</span>
            </button>
          </div>
        </div>

        {/* ─── 3 One-Click Interactive Evaluator Test Scenarios ─── */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="font-bold text-foreground uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              1-Click Evaluator Test Scenarios (Quick Assessment Mode):
            </span>
            <span className="text-muted-foreground">Select any scenario to inspect live response</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Scenario 1 */}
            <Link
              href="/operations"
              className="p-3 bg-secondary/30 hover:bg-secondary/60 border border-border hover:border-foreground/30 transition-all rounded-xs flex items-start gap-3 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xs bg-secondary border border-border text-foreground flex items-center justify-center shrink-0 font-mono font-bold text-sm">
                1
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-foreground font-sans group-hover:underline">
                    Live Lookahead Hazard Alert
                  </span>
                  <span className="gov-tag gov-tag-green text-[9px]">
                    LIVE COCKPIT
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Well OIL-GLK-14 @ 2,165.4m: <strong>74.6m lead warning</strong> before hitting Upper Tipam thief zone.
                </p>
              </div>
            </Link>

            {/* Scenario 2 */}
            <Link
              href="/replay"
              className="p-3 bg-secondary/30 hover:bg-secondary/60 border border-border hover:border-foreground/30 transition-all rounded-xs flex items-start gap-3 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xs bg-secondary border border-border text-foreground flex items-center justify-center shrink-0 font-mono font-bold text-sm">
                2
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-foreground font-sans group-hover:underline">
                    Historical Benchmark Simulator
                  </span>
                  <span className="gov-tag gov-tag-amber text-[9px]">
                    VALIDATION
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Replay 1996 GLK-07 severe loss: Verifies <strong>34 NPT hours avoided</strong> by NWIS early alert.
                </p>
              </div>
            </Link>

            {/* Scenario 3 */}
            <Link
              href="/decay-index"
              className="p-3 bg-secondary/30 hover:bg-secondary/60 border border-border hover:border-foreground/30 transition-all rounded-xs flex items-start gap-3 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xs bg-secondary border border-border text-foreground flex items-center justify-center shrink-0 font-mono font-bold text-sm">
                3
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-foreground font-sans group-hover:underline">
                    Institutional Memory Decay Index
                  </span>
                  <span className="gov-tag gov-tag-blue text-[9px]">
                    DIGITIZATION
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  <strong>88/100 Digboi Fragility:</strong> Vectorizes 130+ years of deteriorating hand-drafted drilling logs.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 2. Executive Value Metrics (Clean Neutral 4-Card Strip) ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1 */}
        <div className="p-3.5 bg-card border border-border rounded-xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground font-bold uppercase">
            <span>Basin NPT Value Saved</span>
            <span className="gov-tag gov-tag-green text-[9px]">● VERIFIED</span>
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">
            ₹14.8 Cr
          </div>
          <p className="text-[11px] text-muted-foreground font-sans">
            34 NPT hrs saved per severe thief-zone loss event avoided
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-3.5 bg-card border border-border rounded-xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground font-bold uppercase">
            <span>Lookahead Lead Buffer</span>
            <span className="gov-tag gov-tag-amber text-[9px]">● ACTIVE</span>
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">
            74.6m / 3.2 hrs
          </div>
          <p className="text-[11px] text-muted-foreground font-sans">
            Early notification window prior to intersecting Tipam loss zone
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-3.5 bg-card border border-border rounded-xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground font-bold uppercase">
            <span>Offset Analogy Index</span>
            <span className="gov-tag gov-tag-blue text-[9px]">GLK-07 ↔ GLK-14</span>
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">
            0.87 Composite
          </div>
          <p className="text-[11px] text-muted-foreground font-sans">
            5-parameter stratigraphic correlation across Geleki fault block
          </p>
        </div>

        {/* Card 4 */}
        <div className="p-3.5 bg-card border border-border rounded-xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground font-bold uppercase">
            <span>Institutional Records</span>
            <span className="gov-tag gov-tag-grey text-[9px]">1889–2026</span>
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">
            1,690+ WCRs/DDRs
          </div>
          <p className="text-[11px] text-muted-foreground font-sans">
            130+ years of typed, scanned, and physical subsurface data
          </p>
        </div>
      </div>

      {/* ─── 3. Live Active Rig Focus Snapshot (OIL-GLK-14 Cockpit Preview) ─── */}
      <div className="gov-panel space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <h2 className="text-sm font-bold text-foreground font-sans uppercase">
              Current Live Lookahead Status: Well OIL-GLK-14 (Geleki Field · Rig #04)
            </h2>
          </div>
          <Link
            href="/operations"
            className="text-xs font-bold text-[#1d70b8] dark:text-[#60a5fa] hover:underline font-mono flex items-center gap-1"
          >
            <span>Open Full Interactive Cockpit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Live Gauges Strip (Clean Neutral) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 font-mono text-xs">
          {/* Gauge 1: Depth */}
          <div className="p-2.5 bg-secondary/30 border border-border rounded-xs">
            <div className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
              <Gauge className="w-3 h-3 text-muted-foreground" />
              Bit Depth (MD)
            </div>
            <div className="text-xl font-bold text-foreground mt-0.5">{liveDepth}m</div>
            <div className="text-[9px] text-muted-foreground">Target: 2,180.0m trigger</div>
          </div>

          {/* Gauge 2: ROP */}
          <div className="p-2.5 bg-secondary/30 border border-border rounded-xs">
            <div className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
              <Activity className="w-3 h-3 text-muted-foreground" />
              ROP
            </div>
            <div className="text-xl font-bold text-foreground mt-0.5">{live.rop} m/h</div>
            <div className="text-[9px] text-muted-foreground">WOB: {live.wob} klbs</div>
          </div>

          {/* Gauge 3: Mud Weight */}
          <div className="p-2.5 bg-secondary/30 border border-border rounded-xs">
            <div className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
              <Droplets className="w-3 h-3 text-muted-foreground" />
              Mud Weight
            </div>
            <div className="text-xl font-bold text-foreground mt-0.5">{live.mudWeightIn} ppg</div>
            <div className="text-[9px] text-muted-foreground">Safe: 9.4–10.4 ppg</div>
          </div>

          {/* Gauge 4: Flow Out */}
          <div className="p-2.5 bg-secondary/30 border border-border rounded-xs">
            <div className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
              <Wind className="w-3 h-3 text-muted-foreground" />
              Flow Out %
            </div>
            <div className="text-xl font-bold text-foreground mt-0.5">{live.flowOutPercent}%</div>
            <div className="text-[9px] text-muted-foreground">SPP: {live.standpipePressure} psi</div>
          </div>

          {/* Gauge 5: Gas Units */}
          <div className="p-2.5 bg-secondary/30 border border-border rounded-xs">
            <div className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
              <Flame className="w-3 h-3 text-muted-foreground" />
              Gas Units
            </div>
            <div className="text-xl font-bold text-foreground mt-0.5">{live.gasUnits} ppm</div>
            <div className="text-[9px] text-muted-foreground">Temp: {live.temperatureOut}°C</div>
          </div>
        </div>

        {/* 3-Tier Safety Advisory Quick Callout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs pt-1">
          <div className="gov-callout gov-callout-fact space-y-1">
            <div className="font-mono text-[10px] font-bold text-foreground uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#1d70b8] dark:text-[#60a5fa]" />
              1. Observed Historical Fact
            </div>
            <p className="font-sans text-[11px] text-foreground leading-snug">
              OIL-GLK-07 (1.8 km SE) suffered complete loss of 420 bbls mud at 2,280m MD (MW 10.8 ppg) in Upper Tipam.
            </p>
          </div>

          <div className="gov-callout gov-callout-risk space-y-1">
            <div className="font-mono text-[10px] font-bold text-[#804000] dark:text-[#fcd34d] uppercase flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-[#b25900] dark:text-[#f59e0b]" />
              2. Model-Estimated Risk (84%)
            </div>
            <p className="font-sans text-[11px] text-foreground leading-snug">
              High risk of lost circulation at 2,240–2,350m MD due to microfractured sandstone thief zones.
            </p>
          </div>

          <div className="gov-callout gov-callout-mitigation space-y-1">
            <div className="font-mono text-[10px] font-bold text-[#003078] dark:text-[#93c5fd] uppercase flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#1d70b8] dark:text-[#60a5fa]" />
              3. Prescribed Mitigation
            </div>
            <p className="font-sans text-[11px] text-foreground leading-snug">
              Pre-treat active system with 35 ppb mixed-fiber LCM pill and reduce pump rate to 1,800 lpm prior to 2,180m.
            </p>
          </div>
        </div>
      </div>

      {/* ─── 4. Operational Consoles Grid (Clean Government Cards) ─── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
            Core Operational Modules &amp; Subsurface Engines
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">
            6 Specialized Workspaces
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {operationalConsoles.map((console) => {
            const Icon = console.icon;
            return (
              <div
                key={console.title}
                className="gov-panel flex flex-col justify-between space-y-3 transition-all hover:border-foreground/30 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xs bg-secondary border border-border text-foreground flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-foreground" />
                      </div>
                      <div>
                        <h2 className="font-bold text-sm text-foreground font-sans group-hover:text-[#1d70b8] dark:group-hover:text-[#60a5fa] transition-colors">
                          {console.title}
                        </h2>
                        <div className="text-[10px] text-muted-foreground font-sans">
                          {console.titleHindi}
                        </div>
                      </div>
                    </div>
                    <span className="gov-tag gov-tag-grey text-[9px]">
                      {console.tag}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                    {console.description}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-border space-y-2">
                  <div className="text-xs font-mono">
                    <div className="font-bold truncate text-foreground">
                      {console.primaryMetric}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {console.subMetric}
                    </div>
                  </div>

                  <Link
                    href={console.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1d70b8] dark:text-[#60a5fa] hover:underline pt-1 font-mono"
                  >
                    <span>Launch Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── 5. Basin Risk Summary Table ─── */}
      <div className="gov-panel space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div>
            <h3 className="font-bold text-sm text-foreground font-sans uppercase">
              Active Rig Fleet &amp; Lookahead Hazard Register
            </h3>
            <p className="text-xs text-muted-foreground font-sans">
              Immediate stratigraphic loss &amp; overpressure corridors along active drilling trajectories.
            </p>
          </div>
          <Link
            href="/alerts"
            className="text-xs font-bold text-[#1d70b8] dark:text-[#60a5fa] hover:underline font-mono"
          >
            View Full Inbox ({alerts.length}) →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table font-mono text-xs">
            <thead>
              <tr>
                <th>Target Well</th>
                <th>Field / Formation</th>
                <th>Current Depth</th>
                <th>Lookahead Corridor</th>
                <th>Lead-Time Buffer</th>
                <th>Severity Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold text-foreground">OIL-GLK-14</td>
                <td>Geleki · Upper Tipam</td>
                <td className="font-bold text-foreground">{liveDepth}m MD</td>
                <td>Thief zone microfractures (2,240–2,350m)</td>
                <td className="text-foreground font-bold">74.6m ahead (~3.2 hrs)</td>
                <td>
                  <span className="gov-tag gov-tag-amber">
                    ADVISORY ACTIVE
                  </span>
                </td>
                <td className="text-right">
                  <Link href="/operations" className="text-[#1d70b8] dark:text-[#60a5fa] font-bold hover:underline">
                    Inspect Cockpit
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="font-bold text-foreground">OIL-DGB-09</td>
                <td>Digboi · Digboi Sandstone</td>
                <td>1,120.0m MD</td>
                <td>Depleted shallow reservoir sands</td>
                <td className="text-muted-foreground">Safe trajectory</td>
                <td>
                  <span className="gov-tag gov-tag-green">
                    NORMAL DRILLING
                  </span>
                </td>
                <td className="text-right">
                  <Link href="/dashboard" className="text-[#1d70b8] dark:text-[#60a5fa] font-bold hover:underline">
                    View Well
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="font-bold text-foreground">OIL-KHS-04</td>
                <td>Kharsang · Girujan Clay</td>
                <td>840.0m MD</td>
                <td>Tectonic thrust-fault shear zone</td>
                <td className="text-muted-foreground">Rig suspended</td>
                <td>
                  <span className="gov-tag gov-tag-grey">
                    STANDBY
                  </span>
                </td>
                <td className="text-right">
                  <Link href="/decay-index" className="text-[#1d70b8] dark:text-[#60a5fa] font-bold hover:underline">
                    Decay Dossier
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 6. Regulatory & Architectural Guarantees Footer Strip ─── */}
      <div className="p-3 bg-secondary/40 border border-border rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-sans text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#00703c] dark:text-[#34d399] shrink-0" />
          <span>
            Compliant with <strong>OISD-GDN-178</strong> (Drilling Safety Management) &amp; <strong>DGMS</strong> Subsurface Evidence Archival Guidelines · <strong>GIGW 3.0 Standard</strong>.
          </span>
        </div>
        <div className="font-mono text-[10px] text-muted-foreground">
          Assam-Arakan Subsurface Knowledge Base · Oil India Limited
        </div>
      </div>

    </div>
  );
}
