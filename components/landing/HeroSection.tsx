import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LandingDashboardPreview } from "@/lib/types";

function formatRelativeSessionDay(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatCompactDurationSeconds(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0m";
  return `${Math.floor(seconds / 60)}m`;
}

function scoreBadgeClass(score: number): string {
  if (score >= 80) {
    return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  }
  if (score >= 65) {
    return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
  }
  return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400";
}

export function HeroSection({
  dashboardPreview,
}: {
  dashboardPreview: LandingDashboardPreview;
}) {
  const { totals, recent } = dashboardPreview;
  const avgDisplay =
    totals.totalSessions > 0 ? `${totals.avgScore}%` : "—";
  const bestDisplay = totals.bestRole?.trim() || "—";

  return (
    <section className="border-b border-border py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            AI-powered interview preparation
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
            Practice interviews.
            <br />
            Get hired faster.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            AI-powered mock interviews with real-time feedback, speech
            recognition, and personalized coaching — completely free.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "w-full min-w-[12rem] sm:w-auto"
              )}
            >
              Start practicing free
            </Link>
            <a
              href="#how-it-works"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "w-full min-w-[12rem] sm:w-auto"
              )}
            >
              See how it works
            </a>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            ✓ No credit card &nbsp;&nbsp; ✓ Free forever &nbsp;&nbsp; ✓ 5 min
            setup
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-4xl md:mt-20">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-none">
            <div className="flex h-9 items-center gap-1.5 border-b border-border bg-muted/60 px-3">
              <span className="size-2.5 rounded-full bg-border" aria-hidden />
              <span className="size-2.5 rounded-full bg-border" aria-hidden />
              <span className="size-2.5 rounded-full bg-border" aria-hidden />
              <span className="ml-2 flex-1 truncate rounded bg-background/80 px-2 py-0.5 text-[10px] text-muted-foreground">
                app.interviewcoach.dev/dashboard
              </span>
            </div>
            <div className="p-4 md:p-5">
              <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="rounded-lg border border-border bg-background p-3 shadow-none">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Total sessions
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {totals.totalSessions}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-background p-3 shadow-none">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Avg score
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {avgDisplay}
                  </p>
                </div>
                <div className="col-span-2 hidden rounded-lg border border-border bg-background p-3 shadow-none md:block">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Best role
                  </p>
                  <p className="mt-1 truncate text-lg font-semibold text-foreground">
                    {bestDisplay}
                  </p>
                </div>
                <div className="col-span-2 rounded-lg border border-border bg-background p-3 shadow-none md:hidden">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Best role
                  </p>
                  <p className="mt-1 truncate text-lg font-semibold text-foreground">
                    {bestDisplay}
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-background shadow-none">
                <div className="border-b border-border px-3 py-2 text-xs font-medium text-foreground">
                  Recent sessions
                </div>
                <ul className="divide-y divide-border text-sm">
                  {recent.length === 0 ? (
                    <li className="px-3 py-6 text-center text-xs text-muted-foreground">
                      Completed practice sessions from the community appear
                      here.
                    </li>
                  ) : (
                    recent.map((session, i) => (
                      <li
                        key={`${session.date}-${session.role}-${i}`}
                        className="flex items-center justify-between gap-2 px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {session.role}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatRelativeSessionDay(session.date)} ·{" "}
                            {formatCompactDurationSeconds(session.duration)}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 rounded px-2 py-0.5 text-xs font-semibold",
                            scoreBadgeClass(session.score)
                          )}
                        >
                          {session.score}%
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
