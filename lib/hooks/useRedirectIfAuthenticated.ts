"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";

/** When already signed in, send users to the right dashboard */
export function useRedirectIfAuthenticated() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const { data: me, isPending: mePending } = useQuery({
    queryKey: ["auth-user"],
    queryFn: () => api.get<{ user?: { role?: string } }>("/auth/me"),
    enabled: !!session?.user,
    retry: false,
  });

  useEffect(() => {
    if (sessionPending) return;
    if (!session?.user) return;
    if (mePending) return;
    const role = me?.user?.role;
    if (!role) return;
    router.replace(role === "admin" ? "/admin/dashboard" : "/dashboard");
  }, [sessionPending, session?.user, mePending, me?.user?.role, router]);
}
