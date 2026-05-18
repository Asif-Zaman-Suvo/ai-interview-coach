"use client";

import ThemeToggle from "./ThemeToggle";
import { useProfileDisplay } from "@/lib/hooks/useProfileDisplay";

export default function Header() {
  const { displayName } = useProfileDisplay();

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
