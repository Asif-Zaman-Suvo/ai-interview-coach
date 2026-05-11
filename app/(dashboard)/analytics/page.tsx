"use client";

import { ScoreOverTimeChart } from "@/components/analytics/ScoreOverTimeChart";
import { SessionsPerWeekChart } from "@/components/analytics/SessionsPerWeekChart";
import { RoleBreakdown } from "@/components/analytics/RoleBreakdown";
import { Card } from "@/components/ui/card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockScoreData, sessionsPerWeekData, roleBreakdownData } from "@/lib/mock-data";

export default function AnalyticsPage() {
  const totalSessions = mockScoreData.length;
  const avgScore = Math.round(
    mockScoreData.reduce((sum, d) => sum + d.score, 0) / mockScoreData.length
  );
  const bestRole = roleBreakdownData.reduce((best, current) =>
    current.avgScore > best.avgScore ? current : best
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Progress</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your improvement over time
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-border shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">{totalSessions}</p>
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
              {bestRole.role}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ScoreOverTimeChart data={mockScoreData} />
        <SessionsPerWeekChart data={sessionsPerWeekData} />
      </div>

      {/* Role Breakdown */}
      <RoleBreakdown data={roleBreakdownData} />
    </div>
  );
}
