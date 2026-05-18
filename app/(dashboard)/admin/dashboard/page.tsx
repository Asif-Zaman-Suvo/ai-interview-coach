"use client";

import { Card } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/StatsCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useAdminStats } from "@/lib/hooks/useAdmin";

export default function AdminDashboardPage() {
  const { data: stats, isLoading, isError } = useAdminStats();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message="Failed to load admin statistics" />;

  const statsData = stats || {
    totalUsers: 0,
    totalSessions: 0,
    averageScore: 0,
    activeToday: 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          System-wide statistics and management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Total Users"
          value={statsData.totalUsers.toString()}
          trend="+12% from last month"
          trendUp
        />
        <StatsCard
          label="Total Sessions"
          value={statsData.totalSessions.toString()}
          trend="+8% from last month"
          trendUp
        />
        <StatsCard
          label="Average Score"
          value={`${statsData.averageScore}%`}
          trend="+3% from last month"
          trendUp
        />
        <StatsCard
          label="Active Today"
          value={statsData.activeToday.toString()}
          trend="Current activity"
        />
      </div>

      {/* Additional Admin Content */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <a
              href="/admin/roles"
              className="block px-4 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="text-sm font-medium text-foreground">Job roles</div>
              <div className="text-xs text-muted-foreground">Create roles for question grouping</div>
            </a>
            <a
              href="/admin/users"
              className="block px-4 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="text-sm font-medium text-foreground">Manage Users</div>
              <div className="text-xs text-muted-foreground">View and manage user accounts</div>
            </a>
            <a
              href="/admin/interviews"
              className="block px-4 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="text-sm font-medium text-foreground">Interview history</div>
              <div className="text-xs text-muted-foreground">
                Browse and delete interviews for any account
              </div>
            </a>
            <a
              href="/admin/questions"
              className="block px-4 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="text-sm font-medium text-foreground">Question Bank</div>
              <div className="text-xs text-muted-foreground">Manage interview questions</div>
            </a>
            <a
              href="/admin/stats"
              className="block px-4 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="text-sm font-medium text-foreground">System Stats</div>
              <div className="text-xs text-muted-foreground">View detailed analytics</div>
            </a>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">System Health</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">API Status</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Operational</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full w-full"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Database</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Connected</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full w-full"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Auth Service</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Active</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full w-full"></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
