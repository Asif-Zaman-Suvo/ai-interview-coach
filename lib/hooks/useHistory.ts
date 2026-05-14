import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PaginatedSessions, Session } from '@/lib/types';
import { normalizeSessionSummaryRow } from '@/lib/parse-api-date';

function normalizePaginatedSessions(
  raw: unknown,
  page: number,
  limit: number,
): PaginatedSessions {
  if (Array.isArray(raw)) {
    const sessions = raw.map(normalizeSessionSummaryRow);
    const total = sessions.length;
    return {
      sessions,
      total,
      page: 1,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit) || 1),
    };
  }

  const obj =
    typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : null;
  if (!obj) {
    return { sessions: [], total: 0, page, limit, totalPages: 1 };
  }

  if (Array.isArray(obj.sessions)) {
    const paginated = raw as PaginatedSessions;
    return {
      ...paginated,
      sessions: obj.sessions.map((s: unknown) => normalizeSessionSummaryRow(s)),
    };
  }

  if (Array.isArray(obj.items)) {
    const items = obj.items.map((s: unknown) => normalizeSessionSummaryRow(s));
    const total = typeof obj.total === 'number' ? obj.total : items.length;
    const totalPages =
      typeof obj.totalPages === 'number' && obj.totalPages > 0
        ? obj.totalPages
        : Math.max(1, Math.ceil(total / limit) || 1);
    return {
      sessions: items,
      total,
      page: typeof obj.page === 'number' ? obj.page : page,
      limit: typeof obj.limit === 'number' ? obj.limit : limit,
      totalPages,
    };
  }

  return { sessions: [], total: 0, page, limit, totalPages: 1 };
}

export const useSessions = (page: number, limit = 10) =>
  useQuery({
    queryKey: ['sessions', page, limit],
    queryFn: async () => {
      const raw = await api.get<unknown>(`/sessions?page=${page}&limit=${limit}`);
      return normalizePaginatedSessions(raw, page, limit);
    },
  });

export const useSessionById = (id: string) =>
  useQuery({
    queryKey: ['session', id],
    queryFn: () => api.get<Session>(`/sessions/${id}`),
    enabled: !!id,
  });

/** DELETE /sessions/:id — wipes answers + legacy question copies + session doc. */
export const useDeleteInterviewSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) =>
      api.delete<{ message?: string }>(`/sessions/${sessionId}`),
    onSuccess: (_data, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['recent-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['score-trend'] });
    },
  });
};
