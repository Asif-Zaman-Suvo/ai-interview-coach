import { createAuthClient } from 'better-auth/react';
import { backendOrigin } from '@/lib/backend-origin';

const baseURL = backendOrigin(process.env.NEXT_PUBLIC_API_URL);

if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_API_URL?.trim()) {
  console.error(
    'NEXT_PUBLIC_API_URL is not set — auth requests cannot reach the API.',
  );
}

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: 'include',
  },
});
