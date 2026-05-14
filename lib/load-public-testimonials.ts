import { restApiRoot } from '@/lib/backend-origin';
import type { PublicTestimonial } from '@/lib/types';

export async function loadPublicTestimonials(): Promise<PublicTestimonial[]> {
  const base = restApiRoot(process.env.NEXT_PUBLIC_API_URL);
  try {
    const res = await fetch(`${base}/testimonials/public?limit=12`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { items?: PublicTestimonial[] };
    return Array.isArray(data.items) ? data.items : [];
  } catch {
    return [];
  }
}
