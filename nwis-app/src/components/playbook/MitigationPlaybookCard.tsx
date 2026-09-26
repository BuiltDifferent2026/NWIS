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
    <div className="rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] shadow-xs overflow-hidden transition-colors">
      
      {/* ─── Header: Strategic Value & Real Data Provenance ─── */}
      <div className="p-4 sm:p-5 border-b border-[#E2E5E8] dark:border-[#364356] bg-[#D9F2EE]/30 dark:bg-[#1E2532]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3FC3B6] animate-pulse" />
              <h3 className="text-base sm:text-lg font-extrabold font-mono text-[#252B33] dark:text-white tracking-tight">
                Sequential Mitigation Playbook Extraction
              </h3>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyPlaybook}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] text-xs font-mono font-bold text-[#252B33] dark:text-white hover:border-[#3FC3B6] transition-colors cursor-pointer shadow-2xs"
            >
              {copiedStatus ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#3FAE68]" />
                  <span className="text-[#3FAE68]">Playbook Copied</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-[#26A69A] dark:text-[#3FC3B6]" />
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
              className={`px-3 py-1.5 rounded-none text-xs font-mono font-bold cursor-pointer transition-all ${
                selectedPlaybookId === p.id
                  ? 'bg-[#34435A] text-white shadow-xs'
                  : 'bg-[#F5F7F8] dark:bg-[#1E2532] text-[#6B7280] dark:text-[#94A3B8] hover:text-[#252B33] dark:hover:text-white border border-[#E2E5E8] dark:border-[#364356]'
              }`}
            >
              {p.eventType === 'MUD_LOSS' ? 'Flagship: Upper Tipam Mud Loss (899 bbls)' : 'Barail Overpressure Kick (12.8 ppg)'}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Context KPIs Strip (Real Data Proof) ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-[#E2E5E8] dark:border-[#364356] divide-x divide-[#E2E5E8] dark:divide-[#364356] text-xs font-mono">
        <div className="p-3.5 space-y-0.5">
          <span className="text-[10px] text-[#6B7280] uppercase tracking-wider block font-bold">Cumulative Loss</span>
          <span className="text-base font-extrabold text-[#ED1C24]">{playbook.incidentContext.cumulativeLossVolume}</span>
          <span className="text-[10px] text-[#6B7280] block truncate">Peak Rate: {playbook.incidentContext.peakLossRate}</span>
        </div>
        <div className="p-3.5 space-y-0.5">
          <span className="text-[10px] text-[#6B7280] uppercase tracking-wider block font-bold">Loss Interval</span>
          <span className="text-base font-extrabold text-[#252B33] dark:text-white">{playbook.incidentContext.depthMD.split(' ')[0]}</span>
          <span className="text-[10px] text-[#6B7280] block truncate">{playbook.incidentContext.formation.split('(')[0]}</span>
        </div>
        <div className="p-3.5 space-y-0.5">
          <span className="text-[10px] text-[#6B7280] uppercase tracking-wider block font-bold">Verified Impact</span>
          <span className="text-base font-extrabold text-[#3FAE68]">{playbook.totalNPTAverted}</span>
          <span className="text-[10px] text-[#6B7280] block truncate">{playbook.costImpactEstimate}</span>
        </div>
        <div className="p-3.5 space-y-0.5">
          <span className="text-[10px] text-[#6B7280] uppercase tracking-wider block font-bold">Extraction Source</span>
          <span className="text-xs font-bold text-[#252B33] dark:text-white truncate block">OIL India WCR Log</span>
          <span className="text-[10px] text-[#3FAE68] font-bold block">100% Structured Schema</span>
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
                className={`p-2.5 rounded-none border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#3FC3B6] bg-[#D9F2EE]/40 shadow-xs'
                    : isCompleted
                    ? 'border-[#3FAE68]/50 bg-[#3FAE68]/10'
                    : 'border-[#E2E5E8] bg-[#F5F7F8] dark:bg-neutral-900/40 hover:border-[#3FC3B6]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                  <span className={isSelected ? 'text-[#26A69A]' : 'text-[#6B7280]'}>
                    STAGE 0{step.stepNumber}
                  </span>
                  {isCompleted ? (
                    <span className="text-[#3FAE68] flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> DONE
                    </span>
                  ) : (
                    <span className="text-[#6B7280]">READY</span>
                  )}
                </div>
                <div className="font-bold text-xs font-mono text-[#252B33] dark:text-white truncate">
                  {step.stageName}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Active Step Detailed Execution Card ── */}
        <div className="p-4 sm:p-5 rounded-none border border-[#3FC3B6]/40 bg-[#D9F2EE]/20 dark:bg-[#1E2532] space-y-4">
          
          {/* Header of Active Step */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2E5E8] dark:border-[#364356]">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#26A69A] dark:text-[#3FC3B6]">
                Step {activeStep.stepNumber} of {playbook.steps.length} · {activeStep.stageName}
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-[#252B33] dark:text-white font-mono mt-0.5">
                {activeStep.action}
              </h4>
            </div>

            <button
              type="button"
              onClick={() => toggleStepCompleted(activeStep.stepNumber)}
              className={`px-3 py-1.5 rounded-none font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto ${
                completedSteps.includes(activeStep.stepNumber)
                  ? 'bg-[#3FAE68] text-white shadow-xs'
                  : 'bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] text-[#252B33] dark:text-white hover:border-[#3FAE68]'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{completedSteps.includes(activeStep.stepNumber) ? 'Completed on Rig' : 'Mark Step Complete'}</span>
            </button>
          </div>

          {/* ── 1. Structured Parameters Grid ── */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#94A3B8] flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#3FC3B6]" />
              Extracted Engineering Parameters
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              {activeStep.parameters.map((param) => (
                <div 
                  key={param.label}
                  className="p-3 rounded-none bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] space-y-1 shadow-2xs"
                >
                  <span className="text-[10px] text-[#6B7280] dark:text-[#94A3B8] block truncate">{param.label}</span>
                  <div className="text-base font-extrabold text-[#252B33] dark:text-white">
                    {param.value}
                  </div>
                  {param.unit && (
                    <span className="text-[10px] text-[#26A69A] dark:text-[#3FC3B6] block truncate font-sans">
                      {param.unit}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── 2. Expected vs Observed Outcome ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-none bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-[#6B7280] dark:text-[#94A3B8] block">
                Engineering Target (Expected Outcome)
              </span>
              <p className="text-[#252B33] dark:text-white leading-relaxed font-sans">
                {activeStep.expectedOutcome}
              </p>
            </div>

            <div className="p-3.5 rounded-none bg-[#3FAE68]/10 dark:bg-[#3FAE68]/15 border border-[#3FAE68]/30 space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-[#3FAE68] block flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#3FAE68]" />
                OIL India Verified Actual Outcome
              </span>
              <p className="text-[#252B33] dark:text-white leading-relaxed font-sans font-medium">
                {activeStep.observedOutcome}
              </p>
            </div>
          </div>

          {/* ── 3. Raw Evidence Excerpt from Genuine Record ── */}
          <div className="p-3 rounded-none bg-[#F5F7F8] dark:bg-[#191E26] border border-[#E2E5E8] dark:border-[#364356] text-xs font-mono space-y-1">
            <span className="text-[10px] text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider block font-bold">
              Raw WCR/DDR Narrative Excerpt (Evidence Provenance)
            </span>
            <div className="text-[#252B33] dark:text-white italic pl-2 border-l-2 border-[#3FC3B6]">
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
              className="px-3 py-1.5 rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] text-[#252B33] dark:text-white disabled:opacity-40 cursor-pointer font-bold"
            >
              ← Previous Stage
            </button>

            <span className="text-[#6B7280] dark:text-[#94A3B8] font-bold">
              {activeStepIndex + 1} of {playbook.steps.length}
            </span>

            <button
              type="button"
              disabled={activeStepIndex === playbook.steps.length - 1}
              suppressHydrationWarning
              onClick={() => setActiveStepIndex(Math.min(playbook.steps.length - 1, activeStepIndex + 1))}
              className="px-3 py-1.5 rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] text-[#252B33] dark:text-white disabled:opacity-40 cursor-pointer font-bold"
            >
              Next Stage →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
