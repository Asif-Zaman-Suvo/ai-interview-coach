import Link from "next/link";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PricingTier = {
  id: string;
  price: string;
  priceNote: string;
  headline: string;
  featured: boolean;
  badge?: string;
  cta: string;
  ctaVariant: "outline" | "default";
  href: string;
  features: readonly string[];
};

const tiers: PricingTier[] = [
  {
    id: "free",
    price: "৳0",
    priceNote: "Free forever",
    headline: "3 interviews",
    featured: false,
    cta: "Get started free",
    ctaVariant: "outline",
    href: "/register",
    features: [
      "3 practice interviews (lifetime)",
      "Transcript & basic feedback — essential tools only",
    ],
  },
  {
    id: "pack_10",
    price: "৳300",
    priceNote: "one-time pack",
    headline: "10 interviews",
    featured: true,
    badge: "Popular",
    cta: "Choose this pack",
    ctaVariant: "default",
    href: "/register",
    features: [
      "10 practice interviews",
      "All job roles & difficulty levels",
      "Resume-based, tailored questions",
      "Detailed AI feedback, scores & progress tracking",
    ],
  },
  {
    id: "pack_30",
    price: "৳2,000",
    priceNote: "one-time pack",
    headline: "30 interviews",
    featured: false,
    cta: "Choose this pack",
    ctaVariant: "default",
    href: "/register",
    features: [
      "30 practice interviews",
      "Everything in the ৳300 pack, expanded limits",
      "Richer AI feedback & session summaries",
      "Competency-style insights & weaker-area hints",
      "Longer history, streaks & performance trends",
      "Resume + role depth for senior-style rounds",
      "Priority help when you’re stuck",
    ],
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Simple, honest pricing
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm text-muted-foreground">
          Prices in Bangladesh Taka (BDT). Pay once per pack — no subscription.
        </p>

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:mt-14 md:grid-cols-3">
          {tiers.map((tier) => {
            const featured = tier.featured;
            return (
              <div
                key={tier.id}
                className={cn(
                  "flex flex-col rounded-lg bg-card p-6 shadow-none",
                  featured
                    ? "border-2 border-primary ring-1 ring-primary/20"
                    : "border border-border",
                )}
              >
                {featured && tier.badge ? (
                  <span className="w-fit rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {tier.badge}
                  </span>
                ) : null}
                <p
                  className={cn(
                    "text-3xl font-semibold text-foreground",
                    featured && "mt-3",
                    !featured && !tier.badge && "mt-0",
                  )}
                >
                  {tier.price}
                </p>
                <p className="text-sm text-muted-foreground">{tier.priceNote}</p>
                <p className="mt-3 text-base font-medium text-foreground">
                  {tier.headline}
                </p>
                <div className="my-6 border-t border-border" />
                <ul className="flex flex-1 flex-col gap-3">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-green-600 dark:text-green-400"
                        aria-hidden
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className={cn(
                    buttonVariants({
                      variant: tier.ctaVariant,
                      size: "default",
                    }),
                    "mt-8 w-full",
                  )}
                >
                  {tier.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
