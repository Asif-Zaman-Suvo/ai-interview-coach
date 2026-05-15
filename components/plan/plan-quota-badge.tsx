"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useSessionQuota } from "@/lib/hooks/useDashboard";
import { PLAN_LABEL, PLAN_TITLE } from "@/lib/types";

type Variant = "compact" | "block";

export function PlanQuotaBadge({
  variant = "compact",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: session } = authClient.useSession();
  const enabled = mounted && !!session?.user;
  const { data: quota, isPending } = useSessionQuota(enabled);

  if (!enabled) return null;

  if (isPending || !quota) {
    return (
      <div
        className={cn(
          variant === "compact"
            ? "h-7 w-28 shrink-0 animate-pulse rounded-full bg-muted"
            : "h-[4.25rem] animate-pulse rounded-md bg-muted",
          className,
        )}
        aria-hidden
      />
    );
  }

  if (quota.adminUnlimited) {
    const title = `Administrator — unlimited practice interviews (${quota.sessionsUsed} completed)`;
    if (variant === "block") {
      return (
        <Link
          href="/settings#plan"
          className={cn(
            "block rounded-md border border-border bg-muted/30 px-3 py-2 text-xs transition-colors hover:bg-muted/50",
            className,
          )}
          title={title}
        >
          <p className="font-semibold text-foreground">Administrator</p>
          <p className="mt-0.5 text-muted-foreground">
            Unlimited interviews
            {quota.sessionsUsed > 0 ? (
              <span className="tabular-nums">
                {" "}
                · {quota.sessionsUsed} completed
              </span>
            ) : null}
          </p>
          <span className="mt-1 inline-block text-[11px] font-medium text-primary">
            Details →
          </span>
        </Link>
      );
    }
    return (
      <Link
        href="/settings#plan"
        className={cn(
          "inline-flex max-w-[12rem] shrink-0 items-center truncate rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-primary/15",
          className,
        )}
        title={title}
      >
        <span className="truncate">Admin</span>
        <span className="mx-1 shrink-0 text-muted-foreground">·</span>
        <span className="shrink-0">Unlimited</span>
      </Link>
    );
  }

  const title = `${PLAN_LABEL[quota.plan]} — ${quota.sessionsUsed} of ${quota.sessionLimit} interviews used`;

  if (variant === "block") {
    return (
      <Link
        href="/settings#plan"
        className={cn(
          "block rounded-md border border-border bg-muted/30 px-3 py-2 text-xs transition-colors hover:bg-muted/50",
          className,
        )}
        title={title}
      >
        <p className="font-semibold text-foreground">{PLAN_LABEL[quota.plan]}</p>
        <p className="mt-0.5 tabular-nums text-muted-foreground">
          {quota.sessionsUsed} / {quota.sessionLimit} interviews used
        </p>
        <span className="mt-1 inline-block text-[11px] font-medium text-primary">
          Plan details →
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/settings#plan"
      className={cn(
        "inline-flex max-w-[11rem] shrink-0 items-center truncate rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium tabular-nums text-foreground transition-colors hover:bg-muted/70",
        className,
      )}
      title={title}
    >
      <span className="truncate">{PLAN_TITLE[quota.plan]}</span>
      <span className="mx-1 shrink-0 text-muted-foreground">·</span>
      <span className="shrink-0 tabular-nums text-muted-foreground">
        {quota.sessionsUsed}/{quota.sessionLimit}
      </span>
    </Link>
  );
}
