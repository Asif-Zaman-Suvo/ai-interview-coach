"use client";

import StatsCard from "@/components/dashboard/StatsCard";
import RecentSessionsTable from "@/components/dashboard/RecentSessionsTable";
import { ScoreTrendChart } from "@/components/dashboard/ScoreTrendChart";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { mockSessionSummaries, mockScoreData } from "@/lib/mock-data";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your interview preparation progress
          </p>
        </div>
        <Link
          href="/interview/setup"
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          Start new interview
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard label="Total sessions" value="12" />
        <StatsCard
          label="Average score"
          value="78%"
          trend="+5% this week"
          trendUp
        />
        <StatsCard
          label="Best role"
          value="Frontend Dev"
          trend="91% avg score"
        />
        <StatsCard
          label="Current streak"
          value="4 days"
          trend="+2 days"
          trendUp
        />
      </div>

      {/* Charts + Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ScoreTrendChart data={mockScoreData} isLoading={isLoading} />
        <RecentSessionsTable
          sessions={mockSessionSummaries}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
