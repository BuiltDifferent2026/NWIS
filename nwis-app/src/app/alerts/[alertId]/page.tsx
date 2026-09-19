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
        <h2 className="text-lg font-bold text-[#d4351c]">Advisory Not Found: {alertId}</h2>
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
    <div className="space-y-4 max-w-[1440px] mx-auto pb-12 font-sans">
      <Breadcrumb
        items={[
          { label: 'Hazard Advisories Inbox', href: '/alerts' },
          { label: alert.id }
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-card via-card to-card border-2 border-amber-500/40 shadow-sm p-4 rounded-sm space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff9933] via-white dark:via-slate-200 to-[#138808]" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2.5 mb-1 flex-wrap">
              <span className="px-2 py-0.5 bg-rose-500/20 text-rose-700 dark:text-rose-400 font-mono font-bold text-xs rounded-xs">
                {alert.riskLevel.toUpperCase()} RISK
              </span>
              <h1 className="text-xl sm:text-2xl font-black font-mono text-foreground">
                {alert.id}
              </h1>
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-700 dark:text-blue-400 font-mono font-bold text-xs rounded-xs">
                {alert.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-sans">
              Subject Well: <strong className="text-foreground font-mono">{alert.wellId.toUpperCase()}</strong> · Trigger Depth: <strong className="text-amber-700 dark:text-amber-400 font-mono">{alert.currentDepth}m MD</strong> · Fired: <span className="font-mono">{alert.firedAt}</span>
            </p>
          </div>

          <div className="text-xs font-mono text-muted-foreground bg-secondary/80 p-2.5 border border-border rounded-xs">
            <div>Corridor: <strong className="text-foreground">{alert.corridorId}</strong></div>
            <div>Companion Feed: <strong className="text-emerald-700 dark:text-emerald-400">eRTMAC Live Feed Active</strong></div>
          </div>
        </div>
      </div>

      {/* ─── 3-Block Core Component ─── */}
      <div className="gov-panel space-y-3">
        <div className="pb-2 border-b border-border">
          <h2 className="text-xs font-mono uppercase font-bold text-muted-foreground">
            Subsurface Risk Evaluation Breakdown
          </h2>
          <p className="text-xs text-muted-foreground font-sans">
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

      {/* Supporting Offset Evidence Wells */}
      {alert.matchedOffsetWells && alert.matchedOffsetWells.length > 0 && (
        <div className="gov-panel space-y-3">
          <div className="pb-2 border-b border-border">
            <h3 className="text-xs font-mono uppercase font-bold text-muted-foreground">
              Supporting Offset Well Evidence ({alert.matchedOffsetWells.length} Offset Wells)
            </h3>
            <p className="text-xs text-muted-foreground font-sans">
              Correlated historical incidents that triggered this lookahead corridor.
            </p>
          </div>

          <div className="space-y-2">
            {alert.matchedOffsetWells.map((offset) => (
              <OffsetWellRow key={offset.well.id} offset={offset} />
            ))}
          </div>
        </div>
      )}

      {/* Operator Action & Audit Feedback Deck */}
      <div className="gov-panel space-y-3 bg-gradient-to-br from-card via-card to-secondary/30">
        <div className="pb-2 border-b border-border">
          <h3 className="font-bold text-sm text-foreground font-sans uppercase">
            Rig Engineer Decision &amp; Audit Log
          </h3>
          <p className="text-xs text-muted-foreground font-sans">
            Acknowledge, apply mitigation, or flag false-positive feedback into the institutional knowledge graph.
          </p>
        </div>

        {actionSuccessMsg && (
          <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold rounded-xs">
            ✓ {actionSuccessMsg}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-1 uppercase font-bold">
              Engineering Notes / Audit Log Entry:
            </label>
            <textarea
              value={feedbackNote}
              onChange={(e) => setFeedbackNote(e.target.value)}
              placeholder="e.g. Prepared 35 ppb LCM pill in suction pit; ECD capped at 10.3 ppg before entering Upper Tipam."
              className="w-full bg-card border border-border p-2.5 text-xs font-mono text-foreground rounded-xs h-20 focus:outline-2 focus:outline-[#ff9933]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleAction('acknowledge')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xs cursor-pointer shadow-xs transition-colors"
            >
              Acknowledge Advisory
            </button>

            <button
              onClick={() => handleAction('mitigation_applied')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xs cursor-pointer shadow-xs transition-colors"
            >
              Confirm Mitigation Applied
            </button>

            <button
              onClick={() => handleAction('reject')}
              className="px-4 py-2 bg-secondary hover:bg-border text-foreground font-bold text-xs border border-border rounded-xs cursor-pointer transition-colors"
            >
              Reject / Flag Outlier
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
