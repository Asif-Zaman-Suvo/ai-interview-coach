"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { fetchAuthMe } from "@/lib/auth-me";
import { Skeleton } from "@/components/ui/skeleton";

export type DashboardGateVariant = "user" | "admin";

export default function DashboardAuthGate({
  children,
  variant = "user",
}: {
  children: React.ReactNode;
  variant?: DashboardGateVariant;
}) {
  const router = useRouter();
  const pathname = usePathname() ?? "";

  const { data: session, isPending: sessionPending } =
    authClient.useSession();

  const { data: me, isPending: mePending } = useQuery({
    queryKey: ["auth-user"],
    queryFn: fetchAuthMe,
    enabled: !!session?.user,
    retry: false,
  });

  const role = me?.user?.role as "user" | "admin" | undefined;
  const pending = sessionPending || (!!session?.user && mePending);

  useEffect(() => {
    if (pending) return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    if (!role) return;

    if (variant === "admin" && role !== "admin") {
      router.replace("/dashboard");
      return;
    }

    if (variant === "user" && role === "admin" && pathname === "/dashboard") {
      router.replace("/admin/dashboard");
    }
  }, [pending, session, role, variant, pathname, router]);

  if (pending || (!sessionPending && !!session?.user && mePending)) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background p-8">
        <div className="w-full max-w-sm space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!session?.user) return null;

  if (variant === "admin" && role && role !== "admin") return null;

  return <>{children}</>;
}
