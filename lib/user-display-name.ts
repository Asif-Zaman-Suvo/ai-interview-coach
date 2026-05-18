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

/** Avatar / sidebar initials — matches prior Sidebar behavior. */
export function profileInitials(
  name?: string | null,
  email?: string | null,
): string {
  const n = (name ?? "").trim();
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2)
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return n.slice(0, 2).toUpperCase();
  }
  const e = (email ?? "").trim();
  if (e) return e.slice(0, 2).toUpperCase();
  return "?";
}
