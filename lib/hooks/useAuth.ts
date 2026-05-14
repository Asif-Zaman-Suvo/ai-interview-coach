import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { User } from '@/lib/types';

export const useAuth = () =>
  useQuery({
    queryKey: ['auth-user'],
    queryFn: () => api.get<User>('/auth/me'),
    retry: false,
  });
