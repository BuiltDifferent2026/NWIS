'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Check, 
  CheckCheck, 
  XCircle, 
  Flag, 
  FileText, 
  Layers, 
  History, 
  Radio, 
  Send 
} from 'lucide-react';
import { Breadcrumb } from '../../../components/layout/Breadcrumb';
import { StatusTag } from '../../../components/common/StatusTag';
import { FactEstimateRecommendation } from '../../../components/common/FactEstimateRecommendation';
import { OffsetWellRow } from '../../../components/common/OffsetWellRow';
import { useAppStore } from '../../../store/app-store';

interface AlertDetailPageProps {
  params: Promise<{ alertId: string }>;
}

export default function AlertDetailPage({ params }: AlertDetailPageProps) {
  const { alertId } = use(params);
  const { alerts, feedbackHistory, acknowledgeAlert, rejectAlert, applyMitigation } = useAppStore();

  const alert = alerts.find(
    (a) => a.id === alertId || a.id.toLowerCase() === alertId?.toLowerCase()
  );
  const [feedbackNote, setFeedbackNote] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  if (!alert) {
    return (
      <div className="p-8 font-mono max-w-4xl mx-auto space-y-4">
        <div className="rounded-none border-l-4 border-l-[#ED1C24] border border-[#E2E5E8] bg-white p-6 shadow-2xs">
          <div className="flex items-center gap-2 text-[#ED1C24] font-bold text-base mb-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h2>Advisory Record Not Found: {alertId}</h2>
          </div>
          <p className="text-xs text-[#6B7280] mb-4">
            The requested geological advisory could not be retrieved from active cache or archives.
          </p>
          <Link 
            href="/alerts" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#26A69A] hover:text-[#3FC3B6] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Alert Inbox
          </Link>
        </div>
      </div>
    );
  }

  const alertFeedback = feedbackHistory.filter((f) => f.alertId === alert.id);

  const handleAction = (action: 'acknowledge' | 'reject' | 'mitigation_applied' | 'incorrect_formation' | 'incorrect_depth') => {
    if (action === 'acknowledge') acknowledgeAlert(alert.id, feedbackNote);
    if (action === 'reject') rejectAlert(alert.id, feedbackNote);
    if (action === 'mitigation_applied') applyMitigation(alert.id, feedbackNote);
    if (action === 'incorrect_formation' || action === 'incorrect_depth') {
      rejectAlert(alert.id, `Flagged by engineer: ${action.replace('_', ' ')}. ${feedbackNote}`);
    }

    setActionSuccessMsg(`Feedback recorded: ${action.replace('_', ' ').toUpperCase()}`);
    setFeedbackNote('');
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  // Border indicator by risk severity
  const riskBorderColor = 
    alert.riskLevel === 'high' 
      ? 'border-l-[#ED1C24]' 
      : alert.riskLevel === 'moderate' 
      ? 'border-l-[#F2B84B]' 
      : 'border-l-[#3FAE68]';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <Breadcrumb
          items={[
            { label: 'Alert Inbox', href: '/alerts' },
            { label: alert.id }
          ]}
        />
        <Link
          href="/alerts"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#26A69A] hover:text-[#3FC3B6] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Register
        </Link>
      </div>

      {/* Header Banner */}
      <div className={`rounded-none border-l-4 ${riskBorderColor} border-y border-r border-[#E2E5E8] bg-white p-5 shadow-2xs transition-colors`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <span className="p-1.5 bg-[#F5F7F8] border border-[#E2E5E8] text-[#34435A]">
                <ShieldAlert className="w-4 h-4 text-[#ED1C24]" />
              </span>
              <h1 className="text-xl md:text-2xl font-extrabold font-mono text-[#252B33]">
                {alert.id}
              </h1>
              <StatusTag label={`${alert.riskLevel.toUpperCase()} RISK`} />
              <StatusTag label={alert.status.replace('_', ' ').toUpperCase()} />
            </div>
            <p className="text-xs text-[#6B7280] font-sans">
              Subject Well: <strong className="text-[#252B33] font-mono">{alert.wellId.toUpperCase()}</strong> • Trigger Depth: <strong className="text-[#252B33] font-mono">{alert.currentDepth}m MD</strong> • Generated: <span className="font-mono">{alert.firedAt}</span>
            </p>
          </div>

          <div className="text-xs font-mono text-[#6B7280] rounded-none border border-[#E2E5E8] bg-[#F5F7F8] px-3.5 py-2.5 shrink-0 space-y-1">
            <div className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[#3FC3B6]" />
              <span>Corridor ID: <strong className="text-[#252B33]">{alert.corridorId}</strong></span>
            </div>
            <div className="text-[11px] text-[#6B7280]">
              Companion Feed: <strong className="text-[#34435A]">eRTMAC Bridge Telemetry</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ─── The Fact / Estimate / Recommendation 3-Block Core Component ─── */}
      <div className="rounded-none border border-[#E2E5E8] bg-white p-5 shadow-2xs">
        <div className="pb-3 mb-4 border-b border-[#E2E5E8] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#34435A]" />
            <div>
              <h2 className="text-sm font-extrabold text-[#252B33] uppercase tracking-wide font-mono">
                Subsurface Risk Evaluation Breakdown
              </h2>
              <p className="text-xs text-[#6B7280]">
                Strict operational separation of observed facts from historical WCRs, model hazard estimates, and mitigations.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 bg-[#F5F7F8] border border-[#E2E5E8] text-[#34435A] font-bold">
            3-Tier Verification
          </span>
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
      <div className="rounded-none border border-[#E2E5E8] bg-white p-5 shadow-2xs">
        <div className="pb-3 mb-4 border-b border-[#E2E5E8] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#26A69A]" />
            <div>
              <h2 className="text-sm font-extrabold text-[#252B33] uppercase tracking-wide font-mono">
                Engineer Operational Feedback & Verification
              </h2>
              <p className="text-xs text-[#6B7280]">
                Rig-site engineers and operations managers review, verify, or record actions taken in response to this advisory.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-[#6B7280]">
            Audit Trail Active
          </span>
        </div>

        {actionSuccessMsg && (
          <div className="mb-4 p-3 rounded-none bg-[#D9F2EE] border border-[#3FC3B6] text-[#26A69A] text-xs font-bold font-mono flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-[#26A69A] shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="feedback-note" className="block text-xs font-bold text-[#252B33] uppercase mb-1.5 font-mono">
              Operational Note / Verification Justification:
            </label>
            <input
              id="feedback-note"
              type="text"
              placeholder="e.g. Pre-treated active mud pit with 35 ppb coarse nut-plug LCM; ECD verified at 10.2 ppg."
              value={feedbackNote}
              onChange={(e) => setFeedbackNote(e.target.value)}
              className="w-full rounded-none border border-[#E2E5E8] bg-[#F5F7F8] p-2.5 text-xs text-[#252B33] placeholder-[#6B7280] font-mono focus:outline-hidden focus:border-[#3FC3B6] focus:bg-white transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => handleAction('acknowledge')}
              className="rounded-none px-4 py-2 bg-[#ED1C24] hover:bg-[#C9141B] text-white text-xs font-bold font-mono transition-colors cursor-pointer shadow-2xs inline-flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" /> Acknowledge Advisory
            </button>
            <button
              type="button"
              onClick={() => handleAction('mitigation_applied')}
              className="rounded-none px-4 py-2 border border-[#3FC3B6] bg-[#3FC3B6] hover:bg-[#26A69A] text-[#222222] hover:text-white text-xs font-bold font-mono transition-colors cursor-pointer shadow-2xs inline-flex items-center gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Confirm Mitigation Applied
            </button>
            <button
              type="button"
              onClick={() => handleAction('reject')}
              className="rounded-none px-4 py-2 border border-[#E05252] bg-[#FDF2F2] text-[#ED1C24] hover:bg-[#FDE8E8] text-xs font-bold font-mono transition-colors cursor-pointer shadow-2xs inline-flex items-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" /> Reject Advisory
            </button>
            <button
              type="button"
              onClick={() => handleAction('incorrect_formation')}
              className="rounded-none px-3 py-2 border border-[#E2E5E8] bg-white text-[#252B33] hover:bg-[#F5F7F8] hover:border-[#34435A] text-xs font-bold font-mono transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Flag className="w-3 h-3 text-[#6B7280]" /> Flag Incorrect Formation
            </button>
            <button
              type="button"
              onClick={() => handleAction('incorrect_depth')}
              className="rounded-none px-3 py-2 border border-[#E2E5E8] bg-white text-[#252B33] hover:bg-[#F5F7F8] hover:border-[#34435A] text-xs font-bold font-mono transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Flag className="w-3 h-3 text-[#6B7280]" /> Flag Incorrect Depth Horizon
            </button>
          </div>
        </div>

        {/* Existing Feedback History */}
        {alertFeedback.length > 0 && (
          <div className="mt-5 pt-4 border-t border-[#E2E5E8]">
            <div className="flex items-center gap-1.5 mb-2.5">
              <History className="w-3.5 h-3.5 text-[#34435A]" />
              <span className="text-xs font-extrabold text-[#252B33] uppercase font-mono">
                Feedback & Action Audit Trail ({alertFeedback.length})
              </span>
            </div>
            <div className="space-y-2">
              {alertFeedback.map((fb, idx) => (
                <div key={idx} className="rounded-none border border-[#E2E5E8] bg-[#F5F7F8] p-3 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between text-[#6B7280] flex-wrap gap-1">
                    <span className="font-extrabold text-[#252B33] uppercase">
                      Action: {fb.engineerAction.replace('_', ' ')}
                    </span>
                    <span className="text-[11px]">{fb.timestamp} • Role: {fb.userRole}</span>
                  </div>
                  {fb.note && <p className="text-[#252B33] font-sans text-xs">{fb.note}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── Matched Offset Wells Register ─── */}
      <div className="rounded-none border border-[#E2E5E8] bg-white p-5 shadow-2xs">
        <div className="pb-3 mb-4 border-b border-[#E2E5E8] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#34435A]" />
            <div>
              <h2 className="text-sm font-extrabold text-[#252B33] uppercase tracking-wide font-mono">
                Matched Offset Wells Evidence Base ({alert.matchedOffsetWells.length})
              </h2>
              <p className="text-xs text-[#6B7280]">
                Historical wells correlating with current operation by formation sequence and depth interval.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 bg-[#D9F2EE] text-[#26A69A] border border-[#3FC3B6] font-bold">
            Assam-Arakan Basin Correlated
          </span>
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
