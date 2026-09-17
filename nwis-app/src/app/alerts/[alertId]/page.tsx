'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '../../../components/layout/Breadcrumb';
import { StatusTag } from '../../../components/common/StatusTag';
import { FactEstimateRecommendation } from '../../../components/common/FactEstimateRecommendation';
import { OffsetWellRow } from '../../../components/common/OffsetWellRow';
import { useAppStore } from '../../../store/app-store';
import { FeedbackEntry } from '../../../lib/data/types';

interface AlertDetailPageProps {
  params: Promise<{ alertId: string }>;
}

export default function AlertDetailPage({ params }: AlertDetailPageProps) {
  const { alertId } = use(params);
  const { alerts, feedbackHistory, acknowledgeAlert, rejectAlert, applyMitigation, currentRole } = useAppStore();

  const alert = alerts.find((a) => a.id === alertId);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  if (!alert) {
    return (
      <div className="p-8 font-mono">
        <h2 className="text-lg font-bold text-[#ca3535]">Advisory Not Found: {alertId}</h2>
        <Link href="/alerts" className="text-xs font-bold text-[#1d70b8] hover:underline mt-2 inline-block">
          ← Return to Alert Inbox
        </Link>
      </div>
    );
  }

  const alertFeedback = feedbackHistory.filter((f) => f.alertId === alertId);

  const handleAction = (action: 'acknowledge' | 'reject' | 'mitigation_applied' | 'incorrect_formation' | 'incorrect_depth') => {
    if (action === 'acknowledge') acknowledgeAlert(alertId, feedbackNote);
    if (action === 'reject') rejectAlert(alertId, feedbackNote);
    if (action === 'mitigation_applied') applyMitigation(alertId, feedbackNote);
    if (action === 'incorrect_formation' || action === 'incorrect_depth') {
      rejectAlert(alertId, `Flagged by engineer: ${action.replace('_', ' ')}. ${feedbackNote}`);
    }

    setActionSuccessMsg(`Feedback recorded: ${action.replace('_', ' ').toUpperCase()}`);
    setFeedbackNote('');
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Breadcrumb
        items={[
          { label: 'Alert Inbox', href: '/alerts' },
          { label: alert.id }
        ]}
      />

      {/* Header Banner */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <h1 className="text-2xl font-extrabold font-mono text-neutral-950 dark:text-white">
                {alert.id}
              </h1>
              <StatusTag label={`${alert.riskLevel.toUpperCase()} RISK`} />
              <StatusTag label={alert.status.replace('_', ' ').toUpperCase()} />
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-sans">
              Subject Well: <strong className="text-neutral-950 dark:text-white font-mono">{alert.wellId.toUpperCase()}</strong> • Trigger Depth: <strong className="text-neutral-950 dark:text-white font-mono">{alert.currentDepth}m MD</strong> • Generated: <span className="font-mono">{alert.firedAt}</span>
            </p>
          </div>

          <div className="text-xs font-mono text-neutral-600 dark:text-neutral-400 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/60 px-3.5 py-2">
            <div>Corridor ID: <strong className="text-neutral-950 dark:text-white">{alert.corridorId}</strong></div>
            <div>Companion Source: <strong className="text-neutral-950 dark:text-white">eRTMAC Bridge Feed</strong></div>
          </div>
        </div>
      </div>

      {/* ─── The Fact / Estimate / Recommendation 3-Block Core Component ─── */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs">
        <div className="pb-3 mb-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-sm font-extrabold text-neutral-950 dark:text-white uppercase tracking-wide">
            Subsurface Risk Evaluation Breakdown
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Strict separation of observed facts from historical WCRs, model hazard estimates, and operational mitigations.
          </p>
        </div>

        <FactEstimateRecommendation
          fact={alert.fact}
          estimate={alert.estimate}
          recommendation={alert.recommendation}
          disconfirmingEvidence={alert.disconfirmingEvidence}
          riskLevel={alert.riskLevel}
        />
      </div>

      {/* ─── Engineer Operational Feedback Controls ─── */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs">
        <div className="pb-3 mb-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-sm font-extrabold text-neutral-950 dark:text-white uppercase tracking-wide">
            Engineer Operational Feedback & Status Update
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Rig-site engineers and operations managers review, verify, or record actions taken in response to this advisory.
          </p>
        </div>

        {actionSuccessMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold font-mono">
            ✓ {actionSuccessMsg}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="feedback-note" className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase mb-1.5 font-mono">
              Operational Note / Verification Justification:
            </label>
            <input
              id="feedback-note"
              type="text"
              placeholder="e.g. Pre-treated active mud pit with 35 ppb coarse nut-plug LCM; ECD verified at 10.2 ppg."
              value={feedbackNote}
              onChange={(e) => setFeedbackNote(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-2.5 text-xs text-neutral-950 dark:text-white placeholder:text-neutral-400 focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => handleAction('acknowledge')}
              className="rounded-xl px-4 py-2 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs font-bold font-mono transition-colors cursor-pointer shadow-2xs"
            >
              Acknowledge Advisory
            </button>
            <button
              type="button"
              onClick={() => handleAction('mitigation_applied')}
              className="rounded-xl px-4 py-2 border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-xs font-bold font-mono transition-colors cursor-pointer shadow-2xs"
            >
              Confirm Mitigation Applied
            </button>
            <button
              type="button"
              onClick={() => handleAction('reject')}
              className="rounded-xl px-4 py-2 border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 text-xs font-bold font-mono transition-colors cursor-pointer shadow-2xs"
            >
              Reject Advisory
            </button>
            <button
              type="button"
              onClick={() => handleAction('incorrect_formation')}
              className="rounded-xl px-3 py-2 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-xs font-bold font-mono transition-colors cursor-pointer"
            >
              Flag Incorrect Formation
            </button>
            <button
              type="button"
              onClick={() => handleAction('incorrect_depth')}
              className="rounded-xl px-3 py-2 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-xs font-bold font-mono transition-colors cursor-pointer"
            >
              Flag Incorrect Depth Horizon
            </button>
          </div>
        </div>

        {/* Existing Feedback History */}
        {alertFeedback.length > 0 && (
          <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <span className="text-xs font-extrabold text-neutral-900 dark:text-white uppercase block mb-2.5 font-mono">
              Feedback & Action Audit Trail ({alertFeedback.length})
            </span>
            <div className="space-y-2">
              {alertFeedback.map((fb, idx) => (
                <div key={idx} className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 p-3 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400 flex-wrap gap-1">
                    <span className="font-extrabold text-neutral-950 dark:text-white uppercase">
                      Action: {fb.engineerAction.replace('_', ' ')}
                    </span>
                    <span className="text-[11px]">{fb.timestamp} • Role: {fb.userRole}</span>
                  </div>
                  {fb.note && <p className="text-neutral-800 dark:text-neutral-200 font-sans text-xs">{fb.note}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── Matched Offset Wells Register ─── */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] p-5 shadow-xs">
        <div className="pb-3 mb-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-sm font-extrabold text-neutral-950 dark:text-white uppercase tracking-wide">
            Matched Offset Wells Evidence Base ({alert.matchedOffsetWells.length})
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Historical wells correlating with current operation by formation sequence and depth interval.
          </p>
        </div>

        <div className="space-y-3">
          {alert.matchedOffsetWells.map((offset) => (
            <OffsetWellRow key={offset.well.id} offset={offset} />
          ))}
        </div>
      </div>
    </div>
  );
}
