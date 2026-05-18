"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import {
  Shield,
  Users,
  Database,
  BarChart3,
  Briefcase,
  LogOut,
  Settings,
  History,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useProfileDisplay } from "@/lib/hooks/useProfileDisplay";

const adminNavItems = [
  { href: "/admin/dashboard", label: "Admin Dashboard", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/roles", label: "Job roles", icon: Briefcase },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/interviews", label: "Interview history", icon: History },
  { href: "/admin/questions", label: "Question bank", icon: Database },
  { href: "/admin/stats", label: "System stats", icon: Shield },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    displayName: profileDisplayName,
    initials,
    email,
    signedIn,
  } = useProfileDisplay();
  const displayName = signedIn ? profileDisplayName : "Admin";

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
          <Shield className="size-3 text-primary-foreground" aria-hidden />
        </div>
        <span className="text-sm font-semibold text-foreground">
          Admin Panel
        </span>
      </Link>

      {/* Admin badge */}
      <div className="px-4 py-2 bg-blue-500/10 border-b border-border">
        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
          Administrator Access
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {adminNavItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (pathname?.startsWith(href + "/") ?? false);
          return (
            <Link key={href} href={href}>
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
      <div className="px-2 py-3 border-t border-border space-y-2 shrink-0">
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
