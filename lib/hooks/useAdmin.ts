import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { AdminStats, AdminUser, QuestionBankItem } from '@/lib/types';

export const useAdminUsers = () =>
  useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get<AdminUser[]>('/admin/users'),
  });

export const useAdminStats = () =>
  useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get<AdminStats>('/admin/stats'),
  });

export const useAdminQuestions = () =>
  useQuery({
    queryKey: ['admin-questions'],
    queryFn: () => api.get<QuestionBankItem[]>('/admin/questions/bank'),
  });

export const useChangeRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      role,
    }: {
      id: string;
      role: 'user' | 'admin';
    }) => api.put(`/admin/users/${id}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    },
    onError: (error: unknown) => {
      const msg =
        error instanceof Error ? error.message : 'Failed to update role';
      toast.error(msg);
    },
  });
};

export const useChangeUserPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      plan,
    }: {
      id: string;
      plan: 'free' | 'pack_10' | 'pack_30';
    }) => api.put(`/admin/users/${id}/plan`, { plan }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      void queryClient.invalidateQueries({ queryKey: ['session-quota'] });
      void queryClient.invalidateQueries({ queryKey: ['app-settings'] });
    },
    onError: (error: unknown) => {
      const msg =
        error instanceof Error ? error.message : 'Failed to update plan';
      toast.error(msg);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: unknown) => {
      const msg =
        error instanceof Error ? error.message : 'Failed to delete user';
      toast.error(msg);
    },
  });
};

export const useAddQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: {
      roleId: string;
      text: string;
      idealAnswer: string;
      type: 'technical' | 'behavioral';
      difficulty: 'Easy' | 'Medium' | 'Hard';
    }) => api.post('/admin/questions', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-questions'] });
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: {
        text?: string;
        idealAnswer?: string;
        type?: 'technical' | 'behavioral';
        difficulty?: 'Easy' | 'Medium' | 'Hard';
      };
    }) => api.put(`/admin/questions/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-questions'] });
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/admin/questions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-questions'] });
    },
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { name: string; icon: string; description: string }) =>
      api.post('/admin/roles', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: { name?: string; icon?: string; description?: string };
    }) => api.put(`/admin/roles/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/admin/roles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};
