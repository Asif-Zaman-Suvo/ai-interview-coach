"use client";

import { authClient } from "@/lib/auth-client";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const displayName = user?.name ?? user?.email ?? "User";

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold text-foreground">
          Welcome back, {displayName}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
