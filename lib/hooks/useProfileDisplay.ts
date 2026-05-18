"use client";

import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";
import type { AppUserSettings } from "@/lib/types";
import {
  profileInitials,
  userDisplayName,
} from "@/lib/user-display-name";

/**
 * Display name shown in sidebar / nav: prefers `/settings` profile (`app-settings`)
 * so UI updates immediately after save; falls back to Better Auth session while loading.
 */
export function useProfileDisplay() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const { data: settings } = useQuery({
    queryKey: ["app-settings"],
    queryFn: () => api.get<AppUserSettings>("/settings"),
    enabled: !!user,
  });

  const mergedRawName =
    settings === undefined
      ? user?.name?.trim() ?? ""
      : settings.name.trim() !== ""
        ? settings.name.trim()
        : user?.name?.trim() ?? "";

  const email = user?.email ?? settings?.email ?? null;

  const displayName = userDisplayName({
    name: mergedRawName || undefined,
    email,
  });

  const initials = profileInitials(
    mergedRawName || user?.name || null,
    email,
  );

  return {
    email,
    displayName,
    initials,
    signedIn: !!user,
  };
}
