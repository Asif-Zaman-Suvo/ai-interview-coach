import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  Role,
  InterviewSetup,
  SessionStartResponse,
  AnswerSubmission,
  AnswerFeedback,
  Session,
} from '@/lib/types';

export const useRoles = () =>
  useQuery({
    queryKey: ['roles'],
    queryFn: () => api.get<Role[]>('/roles'),
  });

export const useStartSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: InterviewSetup) =>
      api.post<SessionStartResponse>('/sessions/start', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recent-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useSubmitAnswer = (sessionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: AnswerSubmission) =>
      api.post<AnswerFeedback>(`/sessions/${sessionId}/answer`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useCompleteSession = (sessionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post<{ finalScore: number; summary: string; topImprovements: string[] }>(`/sessions/${sessionId}/complete`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['recent-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['score-trend'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useSessionDetail = (id: string) =>
  useQuery({
    queryKey: ['session', id],
    queryFn: () => api.get<Session>(`/sessions/${id}`),
    enabled: !!id,
  });
