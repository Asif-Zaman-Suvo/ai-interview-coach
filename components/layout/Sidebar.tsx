"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import {
  LayoutDashboard,
  Plus,
  Clock,
  BarChart2,
  FileText,
  Settings,
  Mic,
  LogOut,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { PlanQuotaBadge } from "@/components/plan/plan-quota-badge";
import { useProfileDisplay } from "@/lib/hooks/useProfileDisplay";
import { useSessionQuota } from "@/lib/hooks/useDashboard";

const navBase = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/interview/setup", label: "New interview", icon: Plus },
  { href: "/history", label: "History", icon: Clock },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { displayName, initials, email, signedIn } = useProfileDisplay();
  const { data: quota } = useSessionQuota(signedIn);
  const settingsHref = quota?.adminUnlimited ? "/admin/settings" : "/settings";

  const navItems = useMemo(
    () =>
      navBase.map((item) =>
        item.label === "Settings" ? { ...item, href: settingsHref } : item,
      ),
    [settingsHref],
  );

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex flex-col h-full">
      <Link
        href="/"
        className="flex shrink-0 items-center gap-2 px-4 h-12 border-b border-border outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
          <Mic className="size-3 text-primary-foreground" aria-hidden />
        </div>
        <span className="text-sm font-semibold text-foreground">
          Interview Coach
        </span>
      </Link>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            label === "Settings"
              ? pathname === "/settings" || pathname === "/admin/settings"
              : pathname === href ||
                (pathname?.startsWith(href + "/") ?? false);
          return (
            <Link key={`${label}-${href}`} href={href}>
              <span
                className={cn(
                  "flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                  active
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="space-y-2 border-t border-border px-2 py-3 shrink-0">
        <PlanQuotaBadge variant="block" className="mx-1" />
        <ThemeToggle />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-muted">
          <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-[10px] font-semibold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {displayName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {email ?? "Signed in"}
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 px-3 text-muted-foreground"
          onClick={() => void handleSignOut()}
        >
          <LogOut className="size-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
