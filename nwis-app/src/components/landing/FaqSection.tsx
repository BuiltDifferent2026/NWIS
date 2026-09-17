'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How is NWIS different from eRTMAC? Doesn’t eRTMAC already monitor drilling wells?',
      a: 'eRTMAC is a real-time telemetry system—it monitors what is happening on the rig right now (ROP, hook load, mud weight). NWIS is the institutional memory layer—it knows what happened nearby across 130+ years of drilling history. NWIS defines a narrow read-only contract with eRTMAC (reading current depth/formation) and queries its offset-well archive to generate proactive lookahead advisories. NWIS never controls or configures rig hardware.'
    },
    {
      q: 'How does the system handle degraded or noisy OCR in 50-year-old scanned reports?',
      a: 'Every record ingested through our hybrid pipeline carries an explicit confidence tag: STRUCTURED-HIGH, OCR-HIGH, OCR-MEDIUM, OCR-LOW, or MANUAL-REVIEW. Low-confidence OCR extractions can inform the presence of a hazard corridor, but our correlation engine is mathematically blocked from allowing a low-confidence record to single-handedly fire a high-severity advisory.'
    },
    {
      q: 'Why use explainable risk corridors instead of training a deep neural network?',
      a: 'In safety-critical drilling engineering, false confidence is far worse than no prediction. Real field datasets contain only dozens of documented incidents per formation—insufficient for reliable deep learning. Explainable risk corridors (showing incident frequency, mitigation success rate, and clean passes) provide complete auditability for DGMS and OISD safety-case reviews.'
    },
    {
      q: 'Can NWIS operate on-premise without external cloud dependencies?',
      a: 'Yes. As a Maharatna PSU, Oil India has stringent data sovereignty policies. NWIS is architected for air-gapped on-premise deployment within OIL’s private corporate network, utilizing self-hosted vector stores and local extraction models with zero outbound data leakage.'
    },
    {
      q: 'What is the "Well Replay Simulator" and why was it built?',
      a: 'The Well Replay Simulator is a falsifiable evaluation tool. Instead of asking judges to take proactive alerting on faith, it allows anyone to replay a real historical well (such as OIL-GLK-07) and watch NWIS fire an evidence-backed advisory 75 meters before the recorded mud loss incident depth was penetrated.'
    }
  ];

  return (
    <section id="faq" className="py-20 bg-white dark:bg-[#090b0f] border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-mono font-semibold border border-neutral-200 dark:border-neutral-700">
            <HelpCircle className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
            <span>TECHNICAL & REGULATORY VALIDATION</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Frequently Asked Technical Questions
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
            Direct architectural answers to key questions raised by Oil India engineers and SIH evaluators.
          </p>
        </div>

        {/* Accordion */}
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-[#12151c] overflow-hidden shadow-xs">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="bg-white dark:bg-[#12151c]">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors"
                >
                  <span className="text-sm font-bold text-neutral-950 dark:text-white">
                    {faq.q}
                  </span>
                  <ChevronDown 
                    className={`w-4 h-4 text-neutral-500 dark:text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
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
