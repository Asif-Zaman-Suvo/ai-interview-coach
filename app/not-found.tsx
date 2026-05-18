import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Page not found — Interview Coach",
  robots: { index: false, follow: false },
};

/** Shown for any URL with no matching App Router segment (dynamic 404). */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-background antialiased">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <p className="font-mono text-xs font-medium tabular-nums text-muted-foreground">
          404
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Page not found
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          This route doesn&apos;t exist. Check the URL or go back home.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "default", size: "sm" }), "no-underline")}
          >
            Home
          </Link>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "no-underline")}
          >
            Sign in
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
