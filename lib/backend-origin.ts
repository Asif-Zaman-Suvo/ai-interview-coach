/**
 * Normalizes NEXT_PUBLIC_API_URL to the Nest host origin without a trailing slash.
 * If the env already ends with /api (common hosting pattern), strips it once so callers
 * can append either /api/… (REST) or /auth/… (unprefixed auth routes — see Nest main.ts).
 */

export function backendOrigin(raw?: string): string {
  let base = (raw ?? '').trim().replace(/\/+$/, '');
  if (!base) return 'http://localhost:3333';
  while (base.endsWith('/api')) {
    base = base.slice(0, -4).replace(/\/+$/, '');
  }
  return base;
}

export function restApiRoot(raw?: string): string {
  return `${backendOrigin(raw)}/api`;
}

/**
 * Origin for Next.js server-side fetches (RSC / route handlers).
 * In Docker, browser uses NEXT_PUBLIC_API_URL=http://localhost, but the frontend
 * container cannot reach the host's localhost — use INTERNAL_API_URL instead
 * (e.g. http://backend:3333).
 */
export function serverBackendOrigin(): string {
  const internal = process.env.INTERNAL_API_URL?.trim();
  if (internal) return backendOrigin(internal);
  return backendOrigin(process.env.NEXT_PUBLIC_API_URL);
}

export function serverRestApiRoot(): string {
  return `${serverBackendOrigin()}/api`;
}
