import { create } from 'zustand';
import { UserRole, Alert, FeedbackEntry } from '../lib/data/types';
import { MOCK_ALERTS, MOCK_FEEDBACK } from '../lib/data/fixtures';

interface AppState {
  // Role & IA Context
  currentRole: UserRole;
  setRole: (role: UserRole) => void;

  // Well Context
  activeWellId: string;
  setActiveWellId: (id: string) => void;

  // Alerts state
  alerts: Alert[];
  feedbackHistory: FeedbackEntry[];
  acknowledgeAlert: (alertId: string, note?: string) => void;
  rejectAlert: (alertId: string, note?: string) => void;
  applyMitigation: (alertId: string, note?: string) => void;

  // Live simulation & Replay
  simulatedDepthMD: number;
  setSimulatedDepthMD: (depth: number) => void;
  stepSimulatedDepth: (delta: number) => void;
  isReplayActive: boolean;
  setReplayActive: (active: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentRole: 'operations_manager',
  setRole: (role) => set({ currentRole: role }),

  activeWellId: 'well-glk-14',
  setActiveWellId: (id) => set({ activeWellId: id }),

  alerts: [...MOCK_ALERTS],
  feedbackHistory: [...MOCK_FEEDBACK],

  acknowledgeAlert: (alertId, note) => {
    set((state) => {
      const updated = state.alerts.map((a) =>
        a.id === alertId ? { ...a, status: 'acknowledged' as const } : a
      );
      const newFeedback: FeedbackEntry = {
        alertId,
        engineerAction: 'acknowledge',
        note: note || 'Acknowledged by operator.',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        userRole: state.currentRole
      };
      return {
        alerts: updated,
        feedbackHistory: [newFeedback, ...state.feedbackHistory]
      };
    });
  },

  rejectAlert: (alertId, note) => {
    set((state) => {
      const updated = state.alerts.map((a) =>
        a.id === alertId ? { ...a, status: 'rejected' as const } : a
      );
      const newFeedback: FeedbackEntry = {
        alertId,
        engineerAction: 'reject',
        note: note || 'Rejected as non-applicable to current casing design.',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        userRole: state.currentRole
      };
      return {
        alerts: updated,
        feedbackHistory: [newFeedback, ...state.feedbackHistory]
      };
    });
  },

  applyMitigation: (alertId, note) => {
    set((state) => {
      const updated = state.alerts.map((a) =>
        a.id === alertId ? { ...a, status: 'mitigation_applied' as const } : a
      );
      const newFeedback: FeedbackEntry = {
        alertId,
        engineerAction: 'mitigation_applied',
        note: note || 'Pre-treatment LCM pill mixed and staged in active pit.',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        userRole: state.currentRole
      };
      return {
        alerts: updated,
        feedbackHistory: [newFeedback, ...state.feedbackHistory]
      };
    });
  },

  simulatedDepthMD: 2165.0,
  setSimulatedDepthMD: (depth) => set({ simulatedDepthMD: depth }),
  stepSimulatedDepth: (delta) =>
    set((state) => ({ simulatedDepthMD: Math.max(0, state.simulatedDepthMD + delta) })),

  isReplayActive: false,
  setReplayActive: (active) => set({ isReplayActive: active })
}));
