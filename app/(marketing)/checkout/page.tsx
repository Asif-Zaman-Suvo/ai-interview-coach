import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutClient } from "@/components/checkout/checkout-client";
import { getTierByPackId, isPaidPackId } from "@/lib/pricing-packs";

export const metadata: Metadata = {
  title: "Checkout — Interview Coach",
  description: "Complete your pack purchase with bKash, Nagad, or card.",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ pack?: string }>;
}) {
  const { pack } = await searchParams;

  if (!pack || pack === "free") {
    redirect("/register");
  }

  if (!isPaidPackId(pack)) {
    redirect("/");
  }

  const tier = getTierByPackId(pack);
  if (!tier) {
    redirect("/");
  }

  return <CheckoutClient packId={pack} tier={tier} />;
}
