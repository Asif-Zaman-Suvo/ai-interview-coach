import Link from "next/link";
import { cn } from "@/lib/utils";

export function CtaBanner() {
  return (
    <section className="border-t border-border bg-primary py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 text-center md:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-primary-foreground md:text-3xl">
          Ready to land your dream job?
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-primary-foreground/80">
          Join thousands of developers already practicing with Interview Coach.
        </p>
        <Link
          href="/register"
          className={cn(
            "mt-6 inline-flex items-center justify-center rounded-md bg-white px-6 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          )}
        >
          Start for free today
        </Link>
      </div>
    </section>
  );
}
