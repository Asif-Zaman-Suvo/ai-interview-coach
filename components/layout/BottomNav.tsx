"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useSessionQuota } from "@/lib/hooks/useDashboard";
import {
  LayoutDashboard,
  PlusCircle,
  BarChart3,
  Settings,
  FileText,
} from "lucide-react";

const navBase = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/interview/setup", label: "New", icon: PlusCircle },
  { href: "/analytics", label: "History", icon: BarChart3 },
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const { data: quota } = useSessionQuota(!!session?.user);
  const settingsHref = quota?.adminUnlimited ? "/admin/settings" : "/settings";

  const navItems = useMemo(
    () =>
      navBase.map((item) =>
        item.label === "Settings" ? { ...item, href: settingsHref } : item,
      ),
    [settingsHref],
  );

  return (
    <ul className="flex w-full items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.label === "Settings"
            ? pathname === "/settings" || pathname === "/admin/settings"
            : pathname === item.href ||
              (pathname?.startsWith(item.href + "/") ?? false);

        return (
          <li key={`${item.label}-${item.href}`}>
            <Link
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-3 text-xs transition-colors",
                isActive
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-5" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
