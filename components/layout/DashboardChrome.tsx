"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import AdminSidebar from "@/components/layout/AdminSidebar";
import BottomNav from "@/components/layout/BottomNav";
import ThemeToggle from "@/components/layout/ThemeToggle";
import DashboardAuthGate from "@/components/auth/DashboardAuthGate";
import { PlanQuotaBadge } from "@/components/plan/plan-quota-badge";

export default function DashboardChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <DashboardAuthGate variant="admin">
        <div className="flex min-h-dvh w-full bg-background">
          <aside className="hidden md:flex md:w-52 md:flex-col md:shrink-0 md:border-r md:border-border bg-card md:sticky md:top-0 md:h-dvh md:overflow-y-auto">
            <AdminSidebar />
          </aside>

          <div className="flex min-h-dvh min-w-0 flex-1 flex-col bg-background md:min-h-dvh">
            <header className="md:hidden flex h-12 shrink-0 items-center justify-between border-b border-border bg-card px-4 sticky top-0 z-10">
              <span className="text-sm font-semibold text-foreground">Admin</span>
              <ThemeToggle />
            </header>

            <main className="flex flex-1 flex-col min-h-0 min-w-0 overflow-y-auto bg-background p-6 pb-16 md:p-8 md:pb-8">
              {children}
            </main>
          </div>
        </div>
      </DashboardAuthGate>
    );
  }

  return (
    <DashboardAuthGate variant="user">
      <div className="flex min-h-dvh w-full bg-background">
        <aside className="hidden md:flex md:w-52 md:flex-col md:shrink-0 md:border-r md:border-border bg-card md:sticky md:top-0 md:h-dvh md:overflow-y-auto">
          <Sidebar />
        </aside>

        <div className="flex min-h-dvh min-w-0 flex-1 flex-col bg-background md:min-h-dvh">
          <header className="sticky top-0 z-10 flex min-h-12 shrink-0 flex-col gap-1.5 border-b border-border bg-card px-4 py-2 md:hidden">
            <div className="flex h-9 items-center justify-between gap-2">
              <span className="text-sm font-semibold text-foreground">
                Interview Coach
              </span>
              <ThemeToggle />
            </div>
            <PlanQuotaBadge variant="compact" className="max-w-full self-start" />
          </header>

          <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-background p-6 pb-24 md:p-8 md:pb-8">
            {children}
          </main>
        </div>

        <nav
          className="md:hidden fixed bottom-0 inset-x-0 border-t border-border bg-card z-20 pb-safe"
          aria-label="Mobile primary"
        >
          <BottomNav />
        </nav>
      </div>
    </DashboardAuthGate>
  );
}
