import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import type { PublicTestimonial } from '@/lib/types';

type MeResponse = { testimonial: PublicTestimonial | null };

export function useTestimonialFeedback() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['testimonial-me'],
    queryFn: () => api.get<MeResponse>('/testimonials/me'),
  });

  const mutation = useMutation({
    mutationFn: (body: {
      rating: number;
      quote: string;
      authorName: string;
      authorRole: string;
    }) => api.post<PublicTestimonial>('/testimonials', body),
    onSuccess: () => {
      toast.success('Thanks! Your feedback may appear on the landing page.');
      void queryClient.invalidateQueries({ queryKey: ['testimonial-me'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return {
    ...query,
    submit: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
  };
}
