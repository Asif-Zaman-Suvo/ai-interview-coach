import { serverRestApiRoot } from '@/lib/backend-origin';
import type { PublicTestimonial } from '@/lib/types';

export async function loadPublicTestimonials(): Promise<PublicTestimonial[]> {
  const base = serverRestApiRoot();
  try {
    const res = await fetch(`${base}/testimonials/public?limit=12`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { items?: PublicTestimonial[] };
    return Array.isArray(data.items) ? data.items : [];
  } catch {
    return [];
  }
}
