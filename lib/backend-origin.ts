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
