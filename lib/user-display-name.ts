/** Prefer Better Auth `name`, then email local-part, then fallback. */
export function userDisplayName(
  user:
    | { name?: string | null; email?: string | null }
    | undefined
    | null,
): string {
  const n = user?.name?.trim();
  if (n) return n;
  const em = user?.email?.trim();
  if (em) {
    const local = em.split("@")[0]?.trim();
    if (local) return local;
    return em;
  }
  return "Account";
}
