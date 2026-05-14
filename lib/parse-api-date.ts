/** Parse API date payloads (ISO strings + Mongo-ish extended JSON wrappers). */

import type {
  Difficulty,
  InterviewStatus,
  SessionSummary,
} from './types';

export function parseApiDate(raw: unknown): Date | undefined {
  if (raw === undefined || raw === null) return undefined;
  if (raw instanceof Date)
    return Number.isFinite(raw.getTime()) ? raw : undefined;
  if (typeof raw === 'string' || typeof raw === 'number') {
    const d = new Date(raw);
    return Number.isFinite(d.getTime()) ? d : undefined;
  }
  if (typeof raw === 'object') {
    const o = raw as Record<string, unknown>;
    if ('$date' in o) return parseApiDate(o.$date);
    if ('$numberLong' in o) {
      const d = new Date(Number(o.$numberLong as string));
      return Number.isFinite(d.getTime()) ? d : undefined;
    }
  }
  return undefined;
}

export function formatLocaleDateParts(raw: unknown): {
  dateLine: string;
  timeLine: string;
} | null {
  const d = parseApiDate(raw);
  if (!d) return null;
  return {
    dateLine: d.toLocaleDateString(),
    timeLine: d.toLocaleTimeString(),
  };
}

/** Coerce loosely typed REST rows into `SessionSummary`. */
export function normalizeSessionSummaryRow(row: unknown): SessionSummary {
  const o =
    typeof row === 'object' && row !== null ? (row as Record<string, unknown>) : {};
  const id = String(o.id ?? '');
  const dateRaw = o.date ?? o.createdAt ?? o.startedAt;

  let date: Date | string;
  const parsed = parseApiDate(dateRaw);
  if (parsed) {
    date = parsed.toISOString();
  } else if (typeof dateRaw === 'string') {
    date = dateRaw;
  } else {
    date = '';
  }

  const rawRole =
    typeof o.role === 'string'
      ? o.role
      : typeof o.roleName === 'string'
        ? o.roleName
        : '';
  const role = rawRole.trim() || 'Unknown';

  const dur = o.duration;
  const duration =
    typeof dur === 'number' && Number.isFinite(dur)
      ? Math.max(0, Math.floor(dur))
      : 0;

  const sc = o.score;
  const score =
    typeof sc === 'number' && Number.isFinite(sc) ? sc : 0;

  let status: InterviewStatus | undefined;
  const st = o.status;
  if (st === 'completed' || st === 'in_progress' || st === 'pending') {
    status = st as InterviewStatus;
  }

  let difficulty: Difficulty | undefined;
  const di = o.difficulty;
  if (di === 'Easy' || di === 'Medium' || di === 'Hard') {
    difficulty = di;
  }

  return {
    id,
    role,
    date,
    score,
    duration,
    status,
    difficulty,
  };
}
