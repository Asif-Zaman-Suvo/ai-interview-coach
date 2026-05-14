import { apiUrl } from '@/lib/api-url';

/**
 * API client wrapper for NestJS backend (global REST prefix `/api`)
 * Handles authentication via Better Auth cookies (credentials: 'include')
 */

export const api = {
  get: <T>(endpoint: string): Promise<T> =>
    fetch(apiUrl(endpoint), {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    }),

  post: <T>(endpoint: string, body: unknown): Promise<T> =>
    fetch(apiUrl(endpoint), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    }),

  patch: <T>(endpoint: string, body: unknown): Promise<T> =>
    fetch(apiUrl(endpoint), {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    }),

  put: <T>(endpoint: string, body: unknown): Promise<T> =>
    fetch(apiUrl(endpoint), {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    }),

  delete: <T>(endpoint: string): Promise<T> =>
    fetch(apiUrl(endpoint), {
      method: 'DELETE',
      credentials: 'include',
    }).then(async (res) => {
      if (!res.ok) throw new Error(res.statusText);
      const text = await res.text();
      return (text ? (JSON.parse(text) as T) : ({} as T));
    }),
};
