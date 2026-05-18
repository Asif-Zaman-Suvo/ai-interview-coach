"use client";

import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { fetchAuthMe } from "@/lib/auth-me";

export function useIsAdmin() {
  const { data: session } = authClient.useSession();
  const { data: me } = useQuery({
    queryKey: ["auth-user"],
    queryFn: fetchAuthMe,
    enabled: !!session?.user,
    retry: false,
  });
  return me?.user?.role === "admin";
}
