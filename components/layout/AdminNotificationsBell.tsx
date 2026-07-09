"use client";

import { Bell, ArrowRight, Radio, ShoppingBag, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  useAdminNotifications,
  useMarkAllAdminNotificationsRead,
  useAdminPurchaseNotificationStream,
} from "@/lib/hooks/useAdmin";
import { PLAN_TITLE, type UserPlan } from "@/lib/types";
import { cn } from "@/lib/utils";

function planChip(plan: string): string {
  if (plan === "free" || plan === "pack_10" || plan === "pack_30") {
    return PLAN_TITLE[plan as UserPlan];
  }
  return plan;
}

function shortRelative(iso: string): string {
  const sec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (sec < 45) return "Just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function AdminNotificationsBell() {
  const { streamLive } = useAdminPurchaseNotificationStream(true);
  const { data, isPending } = useAdminNotifications();
  const markAllRead = useMarkAllAdminNotificationsRead();

  const unread = data?.unreadCount ?? 0;
  const items = data?.items ?? [];

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open && unread > 0) {
          void markAllRead.mutateAsync();
        }
      }}
    >
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="relative size-8 shrink-0 text-muted-foreground hover:text-foreground"
            aria-label={
              unread > 0
                ? `Notifications, ${unread} unread`
                : "Notifications"
            }
          >
            <Bell className="size-4" />
            {unread > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 flex min-w-[1.125rem] h-[18px] items-center justify-center px-1 rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-[10px] font-semibold leading-none text-white shadow-md tabular-nums ring-2 ring-background">
                {unread > 99 ? "99+" : unread}
              </span>
            ) : null}
          </Button>
        }
      />
      <DropdownMenuContent
        align="end"
        className={cn(
          "w-[min(23rem,calc(100vw-2rem))] max-h-[min(26rem,72vh)] p-0 flex flex-col overflow-hidden",
          "rounded-xl border-border/80 bg-popover/95 shadow-xl shadow-black/20",
          "dark:shadow-black/40 dark:ring-1 dark:ring-white/10",
        )}
      >
        <div className="relative shrink-0 overflow-hidden px-4 pt-4 pb-3 border-b border-border/60 bg-gradient-to-b from-muted/40 to-transparent">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
                  Notifications
                </h2>
                <span className="inline-flex items-center rounded-full border border-border/80 bg-background/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Signups & purchases
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-snug">
                Alerts when learners join (Free) or upgrade a pack.
              </p>
            </div>
            <div
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-medium tabular-nums",
                streamLive
                  ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "border-border bg-muted/50 text-muted-foreground",
              )}
              title={
                streamLive
                  ? "Connected — new events appear instantly."
                  : "Reconnecting live stream…"
              }
            >
              <Radio
                className={cn(
                  "size-3.5 shrink-0",
                  streamLive ? "text-emerald-600 dark:text-emerald-400" : "",
                )}
                aria-hidden
              />
              <span className="uppercase tracking-wide">
                {streamLive ? "Live" : "Sync"}
              </span>
              <span
                className={cn(
                  "size-1.5 rounded-full shrink-0",
                  streamLive
                    ? "animate-pulse bg-emerald-500 shadow-[0_0_8px_theme(colors.emerald.400)]"
                    : "bg-muted-foreground/40",
                )}
              />
            </div>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 min-h-0 px-3 py-3">
          {isPending ? (
            <div className="flex flex-col items-center justify-center gap-3 px-4 py-12">
              <div className="size-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Loading alerts…</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center px-4 py-12 text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50 ring-1 ring-border/80">
                <Bell className="size-7 text-muted-foreground/70" />
              </div>
              <p className="text-sm font-medium text-foreground">
                No alerts yet
              </p>
              <p className="mt-1 max-w-[14rem] text-xs leading-relaxed text-muted-foreground">
                New signups and pack purchases show up here.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {items.map((n) => {
                const isSignup = n.kind === "user_signup";
                return (
                  <li
                    key={n.id}
                    className={cn(
                      "group relative overflow-hidden rounded-xl border px-3.5 py-3 transition-shadow",
                      !n.read
                        ? isSignup
                          ? "border-sky-500/25 bg-gradient-to-br from-sky-500/[0.07] via-card to-card shadow-sm ring-1 ring-sky-500/15"
                          : "border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.07] via-card to-card shadow-sm ring-1 ring-emerald-500/15"
                        : "border-border/70 bg-card/60 hover:bg-muted/30 hover:shadow-sm",
                    )}
                  >
                    {!n.read ? (
                      <div
                        className={cn(
                          "pointer-events-none absolute left-0 top-0 bottom-0 w-[3px]",
                          isSignup
                            ? "bg-gradient-to-b from-sky-400 to-blue-600"
                            : "bg-gradient-to-b from-emerald-400 to-teal-600",
                        )}
                        aria-hidden
                      />
                    ) : null}
                    <div className="relative flex gap-3 pl-0.5">
                      <div
                        className={cn(
                          "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl shadow-inner",
                          !n.read
                            ? isSignup
                              ? "bg-gradient-to-br from-sky-500/20 to-blue-600/15 text-sky-700 dark:text-sky-400"
                              : "bg-gradient-to-br from-emerald-500/20 to-teal-600/15 text-emerald-700 dark:text-emerald-400"
                            : "bg-muted/80 text-muted-foreground",
                        )}
                      >
                        {isSignup ? (
                          <UserPlus className="size-[18px]" strokeWidth={1.75} />
                        ) : (
                          <ShoppingBag
                            className="size-[18px]"
                            strokeWidth={1.75}
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 space-y-2">
                        <div>
                          <p className="text-sm font-semibold leading-tight text-foreground">
                            {isSignup
                              ? n.purchaserName?.trim() || "New user"
                              : n.purchaserName?.trim() || "New purchase"}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {n.purchaserEmail}
                          </p>
                        </div>
                        {isSignup ? (
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                            <span className="inline-flex rounded-md bg-sky-500/12 px-2 py-1 font-semibold text-sky-800 ring-1 ring-sky-500/25 dark:text-sky-300">
                              Joined · {planChip(n.newPlan || "free")}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                            <span className="inline-flex max-w-full truncate rounded-md bg-muted/90 px-2 py-1 font-medium text-foreground ring-1 ring-border/60">
                              {planChip(n.previousPlan)}
                            </span>
                            <ArrowRight
                              className="size-3.5 shrink-0 text-muted-foreground"
                              aria-hidden
                            />
                            <span className="inline-flex max-w-full truncate rounded-md bg-primary/12 px-2 py-1 font-semibold text-primary ring-1 ring-primary/25">
                              {planChip(n.newPlan)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between gap-2 pt-0.5">
                          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/90">
                            {shortRelative(n.createdAt)}
                          </span>
                          {!n.read ? (
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                                isSignup
                                  ? "bg-sky-500/15 text-sky-700 dark:text-sky-400"
                                  : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
                              )}
                            >
                              New
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
