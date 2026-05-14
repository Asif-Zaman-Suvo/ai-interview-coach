"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { SessionSummary } from "@/lib/types";

interface RecentSessionsTableProps {
  sessions: SessionSummary[];
  isLoading?: boolean;
}

const scoreBadge = (score: number) => {
  if (score >= 80) {
    return (
      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
        {score}%
      </span>
    );
  }
  if (score >= 65) {
    return (
      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
        {score}%
      </span>
    );
  }
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400">
      {score}%
    </span>
  );
};

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function RecentSessionsTable({
  sessions,
  isLoading,
}: RecentSessionsTableProps) {
  if (isLoading) {
    return (
      <Card className="border border-border bg-card shadow-none rounded-lg">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card className="border border-border bg-card shadow-none rounded-lg">
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">
              No interview sessions yet. Start your first practice session to see
              your history here.
            </p>
            <Link
              href="/interview/setup"
              className="inline-flex mt-4 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Start Interview
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border bg-card shadow-none rounded-lg">
      <CardHeader>
        <CardTitle>Recent Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between gap-4 py-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {session.role}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(session.date)} · {formatDuration(session.duration)}
                </p>
              </div>
              {scoreBadge(session.score)}
              <Link
                href={`/interview/${session.id}/feedback`}
                className="text-xs text-muted-foreground hover:text-foreground shrink-0"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
