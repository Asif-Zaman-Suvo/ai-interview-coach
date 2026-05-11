"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Plus,
  Clock,
  BarChart2,
  FileText,
  Settings,
  Mic,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/interview/setup", label: "New interview", icon: Plus },
  { href: "/history", label: "History", icon: Clock },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-12 border-b border-border shrink-0">
        <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
          <Mic className="size-3 text-primary-foreground" />
        </div>
        <span className="text-sm font-semibold text-foreground">
          Interview Coach
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
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
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
      <div className="px-2 py-3 border-t border-border space-y-1 shrink-0">
        <ThemeToggle />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-muted cursor-pointer">
          <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-semibold">
            AZ
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              Asif Zaman
            </p>
            <p className="text-xs text-muted-foreground">Free plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
