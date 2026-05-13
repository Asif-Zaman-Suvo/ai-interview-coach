import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import ThemeToggle from "@/components/layout/ThemeToggle";
import DashboardAuthGate from "@/components/auth/DashboardAuthGate";

export default function DashboardShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthGate>
      <div className="flex min-h-dvh overflow-hidden bg-background">
        <aside className="hidden md:flex md:w-52 md:flex-col md:shrink-0 md:border-r md:border-border bg-card md:sticky md:top-0 md:h-dvh md:overflow-y-auto">
          <Sidebar />
        </aside>

        <div className="flex min-h-dvh flex-1 min-w-0 flex-col overflow-y-auto">
          <header className="md:hidden flex h-12 shrink-0 items-center justify-between border-b border-border bg-card px-4 sticky top-0 z-10">
            <span className="text-sm font-semibold">Interview Coach</span>
            <ThemeToggle />
          </header>

          <main className="flex-1 p-6 pb-24 md:p-8 md:pb-8">{children}</main>
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
