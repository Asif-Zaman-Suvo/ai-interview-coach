import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { refreshAuthSession } from '@/lib/auth-client';
import type { AppUserSettings } from '@/lib/types';

export function useAppSettings() {
  return useQuery({
    queryKey: ['app-settings'],
    queryFn: () => api.get<AppUserSettings>('/settings'),
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (body: Partial<AppUserSettings>) =>
      api.patch<AppUserSettings>('/settings', body),
    onSuccess: async () => {
      toast.success('Saved');
      await qc.invalidateQueries({ queryKey: ['app-settings'] });
      await qc.invalidateQueries({ queryKey: ['auth-user'] });
      await refreshAuthSession();
      router.refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: (password: string) =>
      api.post<{ ok: true }>('/settings/account/delete', { password }),
    onError: (e: Error) => toast.error(e.message),
  });
}
