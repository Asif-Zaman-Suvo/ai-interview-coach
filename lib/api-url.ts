import { backendOrigin, restApiRoot } from '@/lib/backend-origin';

function endpointPath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Builds the full HTTP URL for a Nest REST or legacy unprefixed auth route.
 */
export function apiUrl(endpoint: string): string {
  const path = endpointPath(endpoint);
  if (path === '/auth/me' || path === '/auth/register') {
    return `${backendOrigin(process.env.NEXT_PUBLIC_API_URL)}${path}`;
  }
  return `${restApiRoot(process.env.NEXT_PUBLIC_API_URL)}${path}`;
}
