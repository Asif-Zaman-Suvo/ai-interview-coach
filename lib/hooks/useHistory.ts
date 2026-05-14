import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PaginatedSessions, Session } from '@/lib/types';

export const useSessions = (page: number, limit = 10) =>
  useQuery({
    queryKey: ['sessions', page, limit],
    queryFn: () =>
      api.get<PaginatedSessions>(`/sessions?page=${page}&limit=${limit}`),
  });

export const useSessionById = (id: string) =>
  useQuery({
    queryKey: ['session', id],
    queryFn: () => api.get<Session>(`/sessions/${id}`),
    enabled: !!id,
  });
