"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import {
  PRICING_TIERS,
  tierHrefForViewer,
} from "@/lib/pricing-packs";
import { authClient } from "@/lib/auth-client";
import { useSessionQuota } from "@/lib/hooks/useDashboard";
import { useIsClient } from "@/lib/use-is-client";

export function PricingSection() {
  const isClient = useIsClient();
  const { data: session } = authClient.useSession();
  const authed = isClient && Boolean(session?.user);
  const { data: quota, isPending: quotaPending } = useSessionQuota(authed);

  const hrefCtx = {
    authed,
    quota,
    quotaSettled: !authed || !quotaPending,
  };

  return (
    <section
      id="pricing"
      className="scroll-mt-24 border-t border-border py-20 md:scroll-mt-28 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <Reveal className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Simple, honest pricing
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Prices in Bangladesh Taka (BDT). Pay once per pack — no subscription.
          </p>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:mt-14 md:grid-cols-3">
          {PRICING_TIERS.map((tier, i) => {
            const featured = tier.featured;
            return (
              <Reveal key={tier.id} className="h-full" delay={i * 0.08}>
                <div
                  className={cn(
                    "flex h-full flex-col rounded-lg bg-card p-6 shadow-none transition-shadow duration-300 hover:shadow-md dark:hover:shadow-primary/10",
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
                    href={tierHrefForViewer(tier.id, hrefCtx)}
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
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
