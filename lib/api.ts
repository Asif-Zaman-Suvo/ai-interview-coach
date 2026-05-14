import { apiUrl } from '@/lib/api-url';

function nestErrorMessage(text: string): string | null {
  try {
    const parsed = JSON.parse(text) as { message?: unknown };
    if (typeof parsed.message === 'string') return parsed.message;
    if (Array.isArray(parsed.message)) {
      return parsed.message
        .filter((m): m is string => typeof m === 'string')
        .join('\n');
    }
  } catch {
    return null;
  }
  return null;
}

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

  post: async <T>(endpoint: string, body: unknown): Promise<T> => {
    const res = await fetch(apiUrl(endpoint), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (!res.ok) {
      const fromBody = text ? nestErrorMessage(text) : null;
      throw new Error(fromBody ?? res.statusText ?? 'Request failed');
    }
    return text ? (JSON.parse(text) as T) : ({} as T);
  },

  patch: async <T>(endpoint: string, body: unknown): Promise<T> => {
    const res = await fetch(apiUrl(endpoint), {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (!res.ok) {
      const fromBody = text ? nestErrorMessage(text) : null;
      throw new Error(fromBody ?? res.statusText ?? 'Request failed');
    }
    return text ? (JSON.parse(text) as T) : ({} as T);
  },

  put: async <T>(endpoint: string, body: unknown): Promise<T> => {
    const res = await fetch(apiUrl(endpoint), {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (!res.ok) {
      const fromBody = text ? nestErrorMessage(text) : null;
      throw new Error(fromBody ?? res.statusText ?? 'Request failed');
    }
    return text ? (JSON.parse(text) as T) : ({} as T);
  },

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
