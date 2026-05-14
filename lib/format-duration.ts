/** Elapsed seconds (e.g. session duration from API GET /sessions/:id). */
export function formatElapsedSeconds(seconds: unknown): string {
  const s =
    typeof seconds === 'number' && Number.isFinite(seconds)
      ? Math.max(0, Math.floor(seconds))
      : 0;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r}s`;
}

/** Whole minutes bucket (sessions list/recent APIs use seconds; prefer `formatElapsedSeconds`). */
export function formatElapsedMinutes(minutesUnknown: unknown): string {
  const minutes =
    typeof minutesUnknown === 'number' && Number.isFinite(minutesUnknown)
      ? Math.max(0, Math.floor(minutesUnknown))
      : 0;
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
