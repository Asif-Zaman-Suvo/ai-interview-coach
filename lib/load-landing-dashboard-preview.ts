import { restApiRoot } from '@/lib/backend-origin';
import type { LandingDashboardPreview } from '@/lib/types';

const empty: LandingDashboardPreview = {
  totals: { totalSessions: 0, avgScore: 0, bestRole: null },
  recent: [],
};

export async function loadLandingDashboardPreview(): Promise<LandingDashboardPreview> {
  const base = restApiRoot(process.env.NEXT_PUBLIC_API_URL);
  try {
    const res = await fetch(
      `${base}/marketing/dashboard-preview?recentLimit=3`,
      { next: { revalidate: 30 } },
    );
    if (!res.ok) return empty;
    const data = (await res.json()) as Partial<LandingDashboardPreview>;
    if (!data.totals || !Array.isArray(data.recent)) return empty;
    return {
      totals: {
        totalSessions: Number(data.totals.totalSessions) || 0,
        avgScore: Number(data.totals.avgScore) || 0,
        bestRole:
          typeof data.totals.bestRole === 'string' && data.totals.bestRole.trim()
            ? data.totals.bestRole.trim()
            : null,
      },
      recent: data.recent.map((r) => ({
        role: String(r.role ?? ''),
        score: Number(r.score) || 0,
        duration: Number(r.duration) || 0,
        date: String(r.date ?? ''),
      })),
    };
  } catch {
    return empty;
  }
}
