"use client";

import StatsCard from "@/components/dashboard/StatsCard";
import RecentSessionsTable from "@/components/dashboard/RecentSessionsTable";
import { ScoreTrendChart } from "@/components/dashboard/ScoreTrendChart";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Button, buttonVariants } from "@/components/ui/button";
import { useStats, useRecentSessions, useScoreTrend, useSessionQuota } from "@/lib/hooks/useDashboard";
import { PLAN_LABEL } from "@/lib/types";
import { quotaUpgradeHref } from "@/lib/pricing-packs";
import Link from "next/link";

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading, isError: statsError } = useStats();
  const { data: recentSessions, isLoading: sessionsLoading, isError: sessionsError } = useRecentSessions();
  const { data: scoreTrend, isLoading: trendLoading, isError: trendError } = useScoreTrend();
  const { data: quota } = useSessionQuota();

  const atLimit = Boolean(
    quota && !quota.adminUnlimited && !quota.canStartNewSession,
  );

  if (statsLoading || sessionsLoading || trendLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (statsError || sessionsError || trendError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <ErrorMessage message="Failed to load dashboard data" />
      </div>
    );
  }

  const dashboardStats = stats || {
    totalSessions: 0,
    averageScore: 0,
    bestRole: null,
    currentStreak: 0,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your interview preparation progress
          </p>
          {quota ? (
            quota.adminUnlimited ? (
              <p className="mt-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  Administrator
                </span>
                {" — unlimited interviews"}
                <span className="tabular-nums">
                  {" "}
                  · {quota.sessionsUsed} completed
                </span>
                {" · "}
                <Link
                  href="/admin/settings"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Admin settings
                </Link>
              </p>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">
                Active plan:{" "}
                <span className="font-medium text-foreground">
                  {PLAN_LABEL[quota.plan]}
                </span>
                <span className="tabular-nums">
                  {" "}
                  · {quota.sessionsUsed}/{quota.sessionLimit} interviews used
                </span>
                {" · "}
                <Link
                  href="/settings#plan"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Manage plan
                </Link>
              </p>
            )
          ) : null}
        </div>
        {atLimit ? (
          <Button size="sm" disabled title="Purchase a pack with more interviews to continue">
            Start new interview
          </Button>
        ) : (
          <Link
            href="/interview/setup"
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            Start new interview
          </Link>
        )}
      </div>

      {atLimit && quota ? (
        <div
          className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-foreground"
          role="status"
        >
          <p className="font-medium">Interview limit reached</p>
          <p className="mt-1 text-muted-foreground">
            You&apos;ve used all {quota.sessionLimit} interviews in your current pack.{" "}
            <Link
              href={quotaUpgradeHref(quota.plan)}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {quota.plan === "pack_30" ? "View packs" : "Get a larger pack"}
            </Link>{" "}
            to continue.
          </p>
        </div>
      ) : null}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard label="Total sessions" value={dashboardStats.totalSessions.toString()} />
        <StatsCard
          label="Average score"
          value={`${dashboardStats.averageScore}%`}
          trend="Personal best"
          trendUp
        />
        <StatsCard
          label="Best role"
          value={dashboardStats.bestRole || "N/A"}
          trend="Top performance"
        />
        <StatsCard
          label="Current streak"
          value={`${dashboardStats.currentStreak} days`}
          trend="Keep it up!"
          trendUp={dashboardStats.currentStreak > 0}
        />
      </div>

      {/* Charts + Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ScoreTrendChart data={scoreTrend || []} isLoading={false} />
        <RecentSessionsTable
          sessions={recentSessions || []}
          isLoading={false}
        />
      </div>
    </div>
  );
}
