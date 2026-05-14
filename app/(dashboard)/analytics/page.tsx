"use client";

import { ScoreOverTimeChart } from "@/components/analytics/ScoreOverTimeChart";
import { SessionsPerWeekChart } from "@/components/analytics/SessionsPerWeekChart";
import { RoleBreakdown } from "@/components/analytics/RoleBreakdown";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useSessions } from "@/lib/hooks/useHistory";
import { useScoreTrend, useStats } from "@/lib/hooks/useDashboard";
import {
  roleBreakdownFromSummaries,
  sessionsPerWeekFromSummaries,
} from "@/lib/session-analytics";

export default function AnalyticsPage() {
  const limit = 200;
  const { data: paginated, isLoading: histLoading, isError: histError } =
    useSessions(1, limit);
  const { data: trend, isLoading: trendLoading } = useScoreTrend();
  const { data: stats, isLoading: statsLoading, isError: statsError } =
    useStats();

  const isLoading = histLoading || trendLoading || statsLoading;
  if (isLoading) {
    return (
      <div className="flex min-h-[40dvh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (histError || statsError) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <ErrorMessage message="Failed to load analytics" />
      </div>
    );
  }

  const sessions = paginated?.sessions ?? [];
  const totalSessions =
    stats?.totalSessions ??
    paginated?.total ??
    sessions.length;
  const avgScore = stats?.averageScore ?? 0;
  const bestRole =
    stats?.bestRole ??
    (sessions.length
      ? roleBreakdownFromSummaries(sessions)[0]?.role
      : undefined) ??
    "—";

  const perWeek =
    sessions.length > 0
      ? sessionsPerWeekFromSummaries(sessions)
      : [];

  const roleBreakdown = roleBreakdownFromSummaries(sessions);
  const trendData =
    trend && trend.length > 0
      ? trend
      : sessions
          .filter((s) => s.score > 0 && s.date)
          .map((s) => ({
            date: s.date,
            score: s.score,
            role: s.role,
          }));

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Progress</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your improvement over time
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-border shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {totalSessions}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">{avgScore}%</p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Best Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground truncate">
              {bestRole}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {trendData.length > 0 ? (
          <ScoreOverTimeChart data={trendData} />
        ) : (
          <Card className="border border-border shadow-none">
            <CardHeader>
              <CardTitle>Score Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Complete scored sessions to see your score trajectory.
              </p>
            </CardContent>
          </Card>
        )}

        {perWeek.length > 0 ? (
          <SessionsPerWeekChart data={perWeek} />
        ) : (
          <Card className="border border-border shadow-none">
            <CardHeader>
              <CardTitle>Sessions Per Week</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sessions grouped by calendar week appear here once you have
                history.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <RoleBreakdown data={roleBreakdown} />
    </div>
  );
}
