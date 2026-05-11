import Link from "next/link";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const freeFeatures = [
  "3 interviews per day",
  "All job roles",
  "Real-time transcript",
  "Basic feedback report",
  "Progress tracking",
] as const;

const proFeatures = [
  "Unlimited interviews",
  "Resume-based questions",
  "Detailed AI feedback",
  "Competency radar chart",
  "PDF report export",
  "Priority support",
] as const;

export function PricingSection() {
  return (
    <section id="pricing" className="border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Simple, honest pricing
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm text-muted-foreground">
          Start free. No credit card required.
        </p>

        <div className="mx-auto mt-10 grid max-w-3xl gap-6 md:mt-14 md:grid-cols-2">
          <div className="flex flex-col rounded-lg border border-border bg-card p-6 shadow-none">
            <p className="text-3xl font-semibold text-foreground">$0</p>
            <p className="text-sm text-muted-foreground">forever free</p>
            <div className="my-6 border-t border-border" />
            <ul className="flex flex-1 flex-col gap-3">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-green-600 dark:text-green-400"
                    aria-hidden
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "mt-8 w-full"
              )}
            >
              Get started free
            </Link>
          </div>

          <div className="flex flex-col rounded-lg border-2 border-primary bg-card p-6 shadow-none">
            <span className="w-fit rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              Most popular
            </span>
            <p className="mt-3 text-3xl font-semibold text-foreground">$9</p>
            <p className="text-sm text-muted-foreground">per month</p>
            <div className="my-6 border-t border-border" />
            <ul className="flex flex-1 flex-col gap-3">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-green-600 dark:text-green-400"
                    aria-hidden
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "mt-8 w-full"
              )}
            >
              Start free trial
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
