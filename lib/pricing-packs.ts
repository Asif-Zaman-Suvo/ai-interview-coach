import type { SessionQuota, UserPlan } from "@/lib/types";

export type PricingPackId = "free" | "pack_10" | "pack_30";

export type PricingTierDef = {
  id: PricingPackId;
  price: string;
  /** Numeric amount label for payment copy (BDT) */
  amountBdt: number;
  priceNote: string;
  headline: string;
  featured: boolean;
  badge?: string;
  cta: string;
  ctaVariant: "outline" | "default";
  features: readonly string[];
};

export const PRICING_TIERS: readonly PricingTierDef[] = [
  {
    id: "free",
    price: "৳0",
    amountBdt: 0,
    priceNote: "Free forever",
    headline: "3 interviews",
    featured: false,
    cta: "Get started free",
    ctaVariant: "outline",
    features: [
      "3 practice interviews (lifetime)",
      "Transcript & basic feedback — essential tools only",
    ],
  },
  {
    id: "pack_10",
    price: "৳300",
    amountBdt: 300,
    priceNote: "one-time pack",
    headline: "10 interviews",
    featured: true,
    badge: "Popular",
    cta: "Choose this pack",
    ctaVariant: "default",
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
    amountBdt: 2000,
    priceNote: "one-time pack",
    headline: "30 interviews",
    featured: false,
    cta: "Choose this pack",
    ctaVariant: "default",
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
] as const;

export function tierHref(id: PricingPackId): string {
  if (id === "free") return "/register";
  return `/checkout?pack=${id}`;
}

/** Where to send someone who hit their interview cap (next paid tier or pricing when already on largest pack). */
export function quotaUpgradeHref(currentPlan: UserPlan): string {
  if (currentPlan === "pack_30") return "/pricing";
  if (currentPlan === "pack_10") return "/checkout?pack=pack_30";
  return "/checkout?pack=pack_10";
}

/** Pricing-page CTA: avoid sending users to checkout for the same paid pack they're already capped on. */
export function tierHrefForViewer(
  tierId: PricingPackId,
  ctx: {
    authed: boolean;
    quota: SessionQuota | undefined;
    quotaSettled: boolean;
  },
): string {
  if (tierId === "free") return tierHref("free");
  const { authed, quota, quotaSettled } = ctx;
  if (!authed || !quotaSettled || !quota || quota.adminUnlimited) {
    return tierHref(tierId);
  }
  if (
    tierId === "pack_10" &&
    quota.plan === "pack_10" &&
    !quota.canStartNewSession
  ) {
    return "/checkout?pack=pack_30";
  }
  if (
    tierId === "pack_30" &&
    quota.plan === "pack_30" &&
    !quota.canStartNewSession
  ) {
    return quotaUpgradeHref("pack_30");
  }
  return tierHref(tierId);
}

export function getTierByPackId(id: string): PricingTierDef | undefined {
  return PRICING_TIERS.find((t) => t.id === id);
}

export type PaidPackId = Exclude<PricingPackId, "free">;

export function isPaidPackId(id: string): id is PaidPackId {
  return id === "pack_10" || id === "pack_30";
}
