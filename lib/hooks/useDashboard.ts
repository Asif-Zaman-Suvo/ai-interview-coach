import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { DashboardStats, SessionSummary, ScoreDataPoint } from '@/lib/types';

export const useStats = () =>
  useQuery({
    queryKey: ['stats'],
    queryFn: () => api.get<DashboardStats>('/sessions/me/stats'),
  });

export const useRecentSessions = () =>
  useQuery({
    queryKey: ['recent-sessions'],
    queryFn: () => api.get<SessionSummary[]>('/sessions/recent'),
  });

export const useScoreTrend = () =>
  useQuery({
    queryKey: ['score-trend'],
    queryFn: () => api.get<ScoreDataPoint[]>('/sessions/score-trend'),
  });
