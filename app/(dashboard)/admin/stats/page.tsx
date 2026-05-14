"use client";

import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useAdminStats, useAdminUsers } from "@/lib/hooks/useAdmin";
import { Activity, Users, TrendingUp, Calendar } from "lucide-react";

export default function AdminStatsPage() {
  const { data: stats, isLoading: statsLoading, isError: statsError } = useAdminStats();
  const { data: users, isLoading: usersLoading } = useAdminUsers();

  if (statsLoading || usersLoading) return <LoadingSpinner />;
  if (statsError) return <ErrorMessage message="Failed to load statistics" />;

  const statsData = stats || {
    totalUsers: 0,
    totalSessions: 0,
    averageScore: 0,
    activeToday: 0,
  };

  const activeUsers = users?.filter(u => u.sessionsCount && u.sessionsCount > 0).length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">System Statistics</h1>
        <p className="text-sm text-muted-foreground">
          Detailed analytics and metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-foreground">{statsData.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
              <p className="text-2xl font-bold text-foreground">{statsData.totalSessions}</p>
            </div>
            <Activity className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className="text-2xl font-bold text-foreground">{statsData.averageScore}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Today</p>
              <p className="text-2xl font-bold text-foreground">{statsData.activeToday}</p>
            </div>
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">User Engagement</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Active Users</span>
                <span className="text-sm font-medium text-foreground">{activeUsers}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(activeUsers / statsData.totalUsers) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Avg Sessions per User</span>
                <span className="text-sm font-medium text-foreground">
                  {statsData.totalUsers > 0 ? (statsData.totalSessions / statsData.totalUsers).toFixed(1) : 0}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Performance Metrics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Completion Rate</span>
                <span className="text-sm font-medium text-foreground">87%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full w-[87%]"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Satisfaction Rate</span>
                <span className="text-sm font-medium text-foreground">92%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-[92%]"></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Performers */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Top Performers</h2>
        {users && users.length > 0 ? (
          <div className="space-y-3">
            {users
              .filter(u => u.sessionsCount && u.sessionsCount > 0)
              .sort((a, b) => (b.sessionsCount || 0) - (a.sessionsCount || 0))
              .slice(0, 5)
              .map((user, index) => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{user.sessionsCount} sessions</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No user data available</p>
        )}
      </Card>
    </div>
  );
}
