import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import type { UserPlan } from '@/lib/types';

type DummyPurchaseResponse = { ok: true; plan: UserPlan };

export function useDummyPurchase() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (plan: 'pack_10' | 'pack_30') =>
      api.post<DummyPurchaseResponse>('/billing/dummy-purchase', { plan }),
    onSuccess: (data) => {
      toast.success(`Sandbox payment OK — plan: ${data.plan}`);
      void qc.invalidateQueries({ queryKey: ['session-quota'] });
      void qc.invalidateQueries({ queryKey: ['app-settings'] });
      void qc.invalidateQueries({ queryKey: ['auth-user'] });
      router.refresh();
      router.push('/interview/setup');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
