'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Cpu, Database, Activity } from 'lucide-react';

export const TechnicalFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How is NWIS different from eRTMAC? Doesn\'t eRTMAC already monitor drilling operations?',
      a: 'eRTMAC is a real-time telemetry system monitoring what is happening right now (ROP, hook load, mud weight, standpipe pressure). NWIS is the institutional memory layer—it knows what happened nearby across 130+ years of Assam drilling history. NWIS defines a strict read-only integration: it reads current depth/formation from eRTMAC and returns explainable lookahead advisories. NWIS never sends control commands back to rig equipment.'
    },
    {
      q: 'How does the system handle degraded or noisy OCR in 50-year-old scanned reports?',
      a: 'Ingestion is built as a hybrid routing layer where both clean database exports and scanned/typewritten WCRs converge into a common normalized schema. Every record receives a provenance tag (STRUCTURED-HIGH, OCR-HIGH, OCR-MEDIUM, OCR-LOW, MANUAL-REVIEW). Under system governance rules, low-confidence OCR records can inform corridor existence but cannot independently trigger a high-severity alert.'
    },
    {
      q: 'Why use explainable risk corridors instead of training a deep neural network?',
      a: 'In safety-critical upstream operations with dozens to hundreds of labeled incidents per field (not millions), deep neural networks overfit and create dangerous unexplainable black-boxes. NWIS uses calibrated composite similarity and SHAP-explainable gradient boosted trees. Every advisory clearly separates Observed Historical Fact, Model-Estimated Risk, and Suggested Mitigation.'
    },
    {
      q: 'Can NWIS operate on-premise without external cloud API dependencies?',
      a: 'Yes. As a Maharatna PSU, Oil India requires strict data sovereignty and air-gapped readiness. NWIS uses containerized local embedding models (sentence-transformers), local vector indexing, and relational storage running entirely within OIL\'s private corporate network with zero outbound data leakage.'
    },
    {
      q: 'What is the "Well Replay Simulator" and why was it built?',
      a: 'Instead of just claiming predictive intelligence, the Replay Simulator allows evaluators and engineers to pick a historical well whose outcome is already recorded (e.g. OIL-GLK-07 in 1996), hit play, and watch the system fire its proactive advisory at exactly 75 meters before the actual recorded loss horizon occurred.'
    },
    {
      q: 'What is the "Institutional Memory Decay Index"?',
      a: 'A quantified per-field metric (0–100) calculated from the percentage of pre-digital records, average record age, and retiring engineers without recorded handovers. It serves as an actionable prioritization tool for Oil India\'s ongoing digitization and OCR archiving campaigns.'
    }
  ];

  return (
    <section id="faq" className="py-16 px-4 sm:px-6 border-t border-neutral-200 dark:border-[#1e2536] bg-neutral-50/50 dark:bg-[#07090f] transition-colors">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
            TECHNICAL &amp; REGULATORY VALIDATION
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-mono">
            Frequently Asked Technical Questions
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
            Direct architectural answers to questions raised by Oil India engineers, PSU data auditors, and SIH evaluators.
          </p>
        </div>

        {/* ─── Accordion List ─── */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-neutral-200 dark:border-[#1e273b] bg-white dark:bg-[#0e121a] shadow-xs overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-[#121622] transition-colors"
                >
                  <span className="font-bold text-xs sm:text-sm text-neutral-950 dark:text-white font-mono">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-500' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed border-t border-neutral-100 dark:border-[#1a2233]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
