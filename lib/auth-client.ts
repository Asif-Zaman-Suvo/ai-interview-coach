import { createAuthClient } from 'better-auth/react';

const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';

if (typeof window !== 'undefined' && !baseURL) {
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
