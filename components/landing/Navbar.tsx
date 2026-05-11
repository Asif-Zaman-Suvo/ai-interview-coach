"use client";

import { useState } from "react";
import Link from "next/link";
import { Mic, Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/layout/ThemeToggle";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 md:h-16 md:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-foreground transition-opacity hover:opacity-90"
        >
          <span className="flex size-8 items-center justify-center rounded-md border border-border bg-card">
            <Mic className="size-4 text-foreground" aria-hidden />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Interview Coach
          </span>
        </Link>

        <nav
          className="hidden items-center justify-center gap-8 md:flex"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            Get started free
          </Link>
          <div className="ml-2 max-w-[11rem] shrink-0 border-l border-border pl-3">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu className="size-4 shrink-0" />
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent
              side="right"
              className="w-[min(100%,20rem)] border-border bg-popover p-0 shadow-none"
              showCloseButton
            >
              <SheetHeader className="border-b border-border p-4 text-left">
                <SheetTitle className="text-base">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-2" aria-label="Mobile primary">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-md px-3 py-2.5 text-sm text-foreground hover:bg-muted"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="my-2 border-t border-border" />
                <Link
                  href="/login"
                  className="rounded-md px-3 py-2.5 text-sm text-foreground hover:bg-muted"
                  onClick={() => setOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ variant: "default", size: "sm" }),
                    "mx-1 mt-1 justify-center"
                  )}
                  onClick={() => setOpen(false)}
                >
                  Get started free
                </Link>
                <div className="mt-4 border-t border-border px-1 pt-3">
                  <ThemeToggle />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
