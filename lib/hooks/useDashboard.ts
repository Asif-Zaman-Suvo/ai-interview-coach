import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { DashboardStats, ScoreDataPoint, SessionQuota } from '@/lib/types';
import { normalizeSessionSummaryRow } from '@/lib/parse-api-date';

export const useStats = () =>
  useQuery({
    queryKey: ['stats'],
    queryFn: () => api.get<DashboardStats>('/sessions/me/stats'),
  });

export const useRecentSessions = () =>
  useQuery({
    queryKey: ['recent-sessions'],
    queryFn: async () => {
      const rows = await api.get<unknown[]>('/sessions/recent');
      return Array.isArray(rows)
        ? rows.map((r) => normalizeSessionSummaryRow(r))
        : [];
    },
  });

export const useScoreTrend = () =>
  useQuery({
    queryKey: ['score-trend'],
    queryFn: () => api.get<ScoreDataPoint[]>('/sessions/score-trend'),
  });

export const useSessionQuota = (enabled = true) =>
  useQuery({
    queryKey: ['session-quota'],
    queryFn: () => api.get<SessionQuota>('/sessions/quota'),
    enabled,
  });
