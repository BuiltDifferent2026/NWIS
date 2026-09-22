'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  Activity, 
  ChevronRight, 
  ArrowRight, 
  Download, 
  Sparkles, 
  Check, 
  SlidersHorizontal,
  Gauge,
  Droplets,
  Zap,
  RotateCcw
} from 'lucide-react';
import { SEQUENTIAL_MITIGATION_PLAYBOOKS, SequentialPlaybook, PlaybookStep } from '@/data/playbooks';

interface MitigationPlaybookCardProps {
  initialPlaybookId?: string;
  isCompact?: boolean;
}

export const MitigationPlaybookCard: React.FC<MitigationPlaybookCardProps> = ({
  initialPlaybookId = 'playbook-glk-mudloss-1',
  isCompact = false
}) => {
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<string>(initialPlaybookId);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [copiedStatus, setCopiedStatus] = useState<boolean>(false);

  const playbook = SEQUENTIAL_MITIGATION_PLAYBOOKS.find((p) => p.id === selectedPlaybookId) || SEQUENTIAL_MITIGATION_PLAYBOOKS[0];
  const activeStep = playbook.steps[activeStepIndex] || playbook.steps[0];

  const toggleStepCompleted = (stepNumber: number) => {
    setCompletedSteps((prev) => 
      prev.includes(stepNumber) 
        ? prev.filter((s) => s !== stepNumber) 
        : [...prev, stepNumber]
    );
  };

  const handleCopyPlaybook = () => {
    const text = [
      `=== ${playbook.title.toUpperCase()} ===`,
      `Source: ${playbook.incidentContext.sourceDocument} (${playbook.incidentContext.wellSource})`,
      `Formation: ${playbook.incidentContext.formation} @ ${playbook.incidentContext.depthMD}`,
      `Loss Rate: ${playbook.incidentContext.peakLossRate} | Volume: ${playbook.incidentContext.cumulativeLossVolume}`,
      `NPT Averted: ${playbook.totalNPTAverted}`,
      ``,
      `--- SEQUENTIAL MITIGATION EXECUTION (ACTION → PARAMETER → OUTCOME) ---`,
      ...playbook.steps.map((s) => 
        `Step ${s.stepNumber} [${s.stageName}]:\n` +
        `  ACTION: ${s.action}\n` +
        `  PARAMETERS: ${s.parameters.map((p) => `${p.label}=${p.value}${p.unit ? ' ' + p.unit : ''}`).join(', ')}\n` +
        `  OBSERVED OUTCOME: ${s.observedOutcome}\n` +
        `  EVIDENCE EXCERPT: "${s.rawNarrativeExcerpt}"\n`
      )
    ].join('\n');

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedStatus(true);
      setTimeout(() => setCopiedStatus(false), 2000);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0e121a] shadow-xs overflow-hidden transition-colors">
      
      {/* ─── Header: Strategic Value & Real Data Provenance ─── */}
      <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h3 className="text-base sm:text-lg font-extrabold font-mono text-neutral-950 dark:text-white tracking-tight">
                Sequential Mitigation Playbook Extraction
              </h3>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                REAL OIL INDIA RECORD
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                ACTION → PARAMETER → OUTCOME
              </span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-sans">
              Directly extracted from OIL India WCR dedicated Mud Loss tables and shift narrative. Structures raw textual procedures into an ordered operational execution pipeline.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyPlaybook}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 hover:border-amber-500 transition-colors cursor-pointer shadow-2xs"
            >
              {copiedStatus ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Playbook Copied</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Copy Rig Procedure</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Playbook Selector Tabs ── */}
        <div className="flex items-center gap-2 pt-3 flex-wrap">
          {SEQUENTIAL_MITIGATION_PLAYBOOKS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setSelectedPlaybookId(p.id);
                setActiveStepIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all ${
                selectedPlaybookId === p.id
                  ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-xs'
                  : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              {p.eventType === 'MUD_LOSS' ? 'Flagship: Upper Tipam Mud Loss (899 bbls)' : 'Barail Overpressure Kick (12.8 ppg)'}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Context KPIs Strip (Real Data Proof) ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-neutral-200 dark:border-neutral-800 divide-x divide-neutral-200 dark:divide-neutral-800 text-xs font-mono">
        <div className="p-3.5 space-y-0.5">
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-bold">Cumulative Loss</span>
          <span className="text-base font-extrabold text-amber-600 dark:text-amber-400">{playbook.incidentContext.cumulativeLossVolume}</span>
          <span className="text-[10px] text-neutral-500 block truncate">Peak Rate: {playbook.incidentContext.peakLossRate}</span>
        </div>
        <div className="p-3.5 space-y-0.5">
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-bold">Loss Interval</span>
          <span className="text-base font-extrabold text-neutral-900 dark:text-white">{playbook.incidentContext.depthMD.split(' ')[0]}</span>
          <span className="text-[10px] text-neutral-500 block truncate">{playbook.incidentContext.formation.split('(')[0]}</span>
        </div>
        <div className="p-3.5 space-y-0.5">
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-bold">Verified Impact</span>
          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{playbook.totalNPTAverted}</span>
          <span className="text-[10px] text-neutral-500 block truncate">{playbook.costImpactEstimate}</span>
        </div>
        <div className="p-3.5 space-y-0.5">
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-bold">Extraction Source</span>
          <span className="text-xs font-bold text-neutral-900 dark:text-white truncate block">OIL India WCR Log</span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">100% Structured Schema</span>
        </div>
      </div>

      {/* ─── Sequential Pipeline Steps (Interactive Action → Parameter → Outcome) ─── */}
      <div className="p-4 sm:p-5 space-y-4">
        
        {/* Step Progress Tracker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {playbook.steps.map((step, idx) => {
            const isSelected = activeStepIndex === idx;
            const isCompleted = completedSteps.includes(step.stepNumber);

            return (
              <button
                key={step.stepNumber}
                type="button"
                onClick={() => setActiveStepIndex(idx)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 shadow-xs'
                    : isCompleted
                    ? 'border-emerald-300 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                  <span className={isSelected ? 'text-amber-700 dark:text-amber-400' : 'text-neutral-500'}>
                    STAGE 0{step.stepNumber}
                  </span>
                  {isCompleted ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> DONE
                    </span>
                  ) : (
                    <span className="text-neutral-400">READY</span>
                  )}
                </div>
                <div className="font-bold text-xs font-mono text-neutral-900 dark:text-white truncate">
                  {step.stageName}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Active Step Detailed Execution Card (Action → Parameter → Outcome) ── */}
        <div className="p-4 sm:p-5 rounded-2xl border border-amber-500/30 bg-amber-50/20 dark:bg-amber-950/10 space-y-4">
          
          {/* Header of Active Step */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Step {activeStep.stepNumber} of {playbook.steps.length} · {activeStep.stageName}
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-neutral-950 dark:text-white font-mono mt-0.5">
                {activeStep.action}
              </h4>
            </div>

            <button
              type="button"
              onClick={() => toggleStepCompleted(activeStep.stepNumber)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto ${
                completedSteps.includes(activeStep.stepNumber)
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-emerald-500'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{completedSteps.includes(activeStep.stepNumber) ? 'Completed on Rig' : 'Mark Step Complete'}</span>
            </button>
          </div>

          {/* ── 1. Structured Parameters Grid ── */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
              Extracted Engineering Parameters
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              {activeStep.parameters.map((param) => (
                <div 
                  key={param.label}
                  className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1 shadow-2xs"
                >
                  <span className="text-[10px] text-neutral-500 block truncate">{param.label}</span>
                  <div className="text-base font-extrabold text-neutral-950 dark:text-white">
                    {param.value}
                  </div>
                  {param.unit && (
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 block truncate font-sans">
                      {param.unit}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── 2. Expected vs Observed Outcome ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 block">
                Engineering Target (Expected Outcome)
              </span>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                {activeStep.expectedOutcome}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 dark:text-emerald-400 block flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                OIL India Verified Actual Outcome
              </span>
              <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans font-medium">
                {activeStep.observedOutcome}
              </p>
            </div>
          </div>

          {/* ── 3. Raw Evidence Excerpt from Genuine Record ── */}
          <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 text-xs font-mono space-y-1">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-bold">
              Raw WCR/DDR Narrative Excerpt (Evidence Provenance)
            </span>
            <div className="text-neutral-800 dark:text-neutral-300 italic pl-2 border-l-2 border-amber-500">
              &quot;{activeStep.rawNarrativeExcerpt}&quot;
            </div>
          </div>

          {/* Step Navigation Controls */}
          <div className="flex items-center justify-between pt-1 text-xs font-mono">
            <button
              type="button"
              disabled={activeStepIndex === 0}
              suppressHydrationWarning
              onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
              className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 disabled:opacity-40 cursor-pointer font-bold"
            >
              ← Previous Stage
            </button>

            <span className="text-neutral-500 font-bold">
              {activeStepIndex + 1} of {playbook.steps.length}
            </span>

            <button
              type="button"
              disabled={activeStepIndex === playbook.steps.length - 1}
              suppressHydrationWarning
              onClick={() => setActiveStepIndex(Math.min(playbook.steps.length - 1, activeStepIndex + 1))}
              className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 disabled:opacity-40 cursor-pointer font-bold"
            >
              Next Stage →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
