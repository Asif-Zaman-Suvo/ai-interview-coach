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

export function getTierByPackId(id: string): PricingTierDef | undefined {
  return PRICING_TIERS.find((t) => t.id === id);
}

export type PaidPackId = Exclude<PricingPackId, "free">;

export function isPaidPackId(id: string): id is PaidPackId {
  return id === "pack_10" || id === "pack_30";
}
