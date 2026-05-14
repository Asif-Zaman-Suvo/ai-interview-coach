import type { SessionSummary } from '@/lib/types';

export function sessionsPerWeekFromSummaries(
  sessions: Pick<SessionSummary, 'date'>[],
): { week: string; sessions: number }[] {
  const map = new Map<number, number>();
  for (const s of sessions) {
    const d = new Date(s.date);
    if (Number.isNaN(d.getTime())) continue;
    const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    const ts = monday.getTime();
    map.set(ts, (map.get(ts) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a - b)
    .map(([ts, cnt]) => ({
      week: new Date(ts).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      sessions: cnt,
    }));
}

export function roleBreakdownFromSummaries(
  sessions: Pick<SessionSummary, 'role' | 'score' | 'status'>[],
): { role: string; count: number; avgScore: number }[] {
  const rows = sessions.filter(
    (s) => s.status === 'completed' || (s.score !== undefined && s.score > 0),
  );
  const acc = new Map<string, { total: number; count: number }>();
  for (const s of rows) {
    if (!s.role) continue;
    const cur = acc.get(s.role) ?? { total: 0, count: 0 };
    cur.total += s.score ?? 0;
    cur.count += 1;
    acc.set(s.role, cur);
  }
  return [...acc.entries()]
    .map(([role, { total, count }]) => ({
      role,
      count,
      avgScore: count ? Math.round(total / count) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}
