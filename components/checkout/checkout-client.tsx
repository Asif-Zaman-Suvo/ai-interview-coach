"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  Banknote,
  Check,
  CreditCard,
  Loader2,
  Smartphone,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useDummyPurchase } from "@/lib/hooks/useBilling";
import { useSessionQuota } from "@/lib/hooks/useDashboard";
import { cn } from "@/lib/utils";
import type { PaidPackId, PricingTierDef } from "@/lib/pricing-packs";
import {
  PLAN_LABEL,
  PLAN_SESSION_CAP,
  type SessionQuota,
} from "@/lib/types";

type PaymentMethod = "bkash" | "nagad" | "card";

const METHODS: {
  id: PaymentMethod;
  label: string;
  sub: string;
  icon: LucideIcon;
  accent: string;
  accentBg: string;
}[] = [
  {
    id: "bkash",
    label: "bKash",
    sub: "Send money",
    icon: Smartphone,
    accent: "#E2136E",
    accentBg: "bg-[#E2136E]/12 dark:bg-[#E2136E]/20",
  },
  {
    id: "nagad",
    label: "Nagad",
    sub: "Send money",
    icon: Banknote,
    accent: "#F7931E",
    accentBg: "bg-[#F7931E]/12 dark:bg-[#F7931E]/20",
  },
  {
    id: "card",
    label: "Bank card",
    sub: "Visa / Mastercard",
    icon: CreditCard,
    accent: "hsl(var(--primary))",
    accentBg: "bg-primary/10",
  },
];

/** Merchant wallet number (bKash & Nagad) */
const MERCHANT_WALLET_NUMBER = "01521331328";

function formatInvoiceRef(packId: PaidPackId): string {
  return packId === "pack_10" ? "IC-A10" : "IC-A30";
}

function checkoutPlanNotice(
  quota: SessionQuota,
  packId: PaidPackId,
  tierHeadline: string,
): string {
  if (quota.adminUnlimited) {
    return `Administrator accounts have unlimited interviews (${quota.sessionsUsed} completed). Packs are for learner accounts.`;
  }
  const curCap = PLAN_SESSION_CAP[quota.plan];
  const targetCap = PLAN_SESSION_CAP[packId];
  if (targetCap < curCap) {
    return `Your account already has a higher session limit (${quota.sessionLimit} total). This pack would reduce capacity.`;
  }
  if (quota.plan === packId) {
    return `This page matches your active pack (${tierHeadline}).`;
  }
  return `After payment you’ll be on ${tierHeadline} (${targetCap} interviews total on your account).`;
}

function PaymentDetailsInner({
  method,
  tier,
  paidId,
}: {
  method: PaymentMethod;
  tier: PricingTierDef;
  paidId: PaidPackId;
}) {
  const amount = `৳${tier.amountBdt.toLocaleString("en-BD")}`;
  const invoice = formatInvoiceRef(paidId);

  if (method === "bkash") {
    return (
      <Card className="border-border bg-card p-5 shadow-none">
        <div className="flex items-start gap-3 border-l-4 border-[#E2136E] pl-4">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Pay with bKash
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Send exactly{" "}
              <span className="font-medium text-foreground">{amount}</span> to our
              merchant number. Use invoice{" "}
              <span className="font-mono text-xs text-foreground">{invoice}</span>{" "}
              in the reference field if the app asks for it.
            </p>
          </div>
        </div>
        <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Open the bKash app → Send Money.</li>
          <li>
            Enter merchant number{" "}
            <span className="font-mono text-foreground">
              {MERCHANT_WALLET_NUMBER}
            </span>
            .
          </li>
          <li>
            Amount: <span className="font-medium text-foreground">{amount}</span>.
          </li>
          <li>Complete the payment and keep your transaction ID.</li>
        </ol>
        <div className="mt-5 space-y-2">
          <Label htmlFor="bkash-trx">bKash transaction ID (optional)</Label>
          <Input
            id="bkash-trx"
            placeholder="e.g. 8N7A3CQ2TR"
            autoComplete="off"
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Adding this helps us match your payment faster. You can also send it
            later from support email.
          </p>
        </div>
      </Card>
    );
  }

  if (method === "nagad") {
    return (
      <Card className="border-border bg-card p-5 shadow-none">
        <div className="flex items-start gap-3 border-l-4 border-[#F7931E] pl-4">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Pay with Nagad
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Send exactly{" "}
              <span className="font-medium text-foreground">{amount}</span> from
              your Nagad wallet. Reference / invoice:{" "}
              <span className="font-mono text-xs text-foreground">{invoice}</span>.
            </p>
          </div>
        </div>
        <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Open the Nagad app → Send Money.</li>
          <li>
            Enter merchant number{" "}
            <span className="font-mono text-foreground">
              {MERCHANT_WALLET_NUMBER}
            </span>
            .
          </li>
          <li>
            Amount: <span className="font-medium text-foreground">{amount}</span>.
          </li>
          <li>Confirm and save your transaction ID.</li>
        </ol>
        <div className="mt-5 space-y-2">
          <Label htmlFor="nagad-trx">Nagad transaction ID (optional)</Label>
          <Input
            id="nagad-trx"
            placeholder="e.g. 61234567890123"
            autoComplete="off"
            className="font-mono text-sm"
          />
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card p-5 shadow-none">
      <p className="text-sm font-semibold text-foreground">Bank card</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Pay {amount} securely with your Visa or Mastercard. Card processing is
        shown below for your details — connect your PSP when ready.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="card-number">Card number</Label>
          <Input
            id="card-number"
            placeholder="4242 4242 4242 4242"
            inputMode="numeric"
            autoComplete="cc-number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="card-exp">Expiry</Label>
          <Input id="card-exp" placeholder="MM / YY" autoComplete="cc-exp" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="card-cvc">CVC</Label>
          <Input id="card-cvc" placeholder="123" autoComplete="cc-csc" />
        </div>
        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="card-name">Name on card</Label>
          <Input
            id="card-name"
            placeholder="As on card"
            autoComplete="cc-name"
          />
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        This form is UI-only until a gateway is wired. Do not enter real card
        data in production without HTTPS and PCI-compliant handling.
      </p>
    </Card>
  );
}

export function CheckoutClient({
  packId,
  tier,
}: {
  packId: PaidPackId;
  tier: PricingTierDef;
}) {
  const reduceMotion = useReducedMotion();
  const [method, setMethod] = useState<PaymentMethod>("bkash");
  const [mounted, setMounted] = useState(false);
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const { mutate: dummyPurchase, isPending: dummyPending } = useDummyPurchase();
  const authed = Boolean(session?.user);
  const quotaEnabled = mounted && authed;
  const { data: quota, isPending: quotaPending } = useSessionQuota(quotaEnabled);

  useEffect(() => {
    setMounted(true);
  }, []);

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div className="mx-auto max-w-xl px-4 py-10 md:py-14">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.38, ease: [0.22, 1, 0.36, 1] }
        }
      >
        <Link
          href="/#pricing"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "-ml-2 mb-6 gap-1 text-muted-foreground hover:text-foreground",
          )}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to pricing
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Complete payment
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You&apos;re checking out{" "}
          <span className="font-medium text-foreground">{tier.headline}</span>{" "}
          ({tier.price} · {tier.priceNote}).
        </p>

        {mounted && authed ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.28, delay: 0.04, ease: [0.22, 1, 0.36, 1] }
            }
            className="mt-4 rounded-lg border border-border bg-muted/30 px-4 py-3 text-xs leading-relaxed text-muted-foreground"
          >
            {quotaPending || !quota ? (
              <span
                className="inline-block h-10 w-full max-w-md animate-pulse rounded-md bg-muted"
                aria-hidden
              />
            ) : quota.adminUnlimited ? (
              <>
                <span className="font-semibold text-foreground">
                  Account type:{" "}
                </span>
                <span className="text-foreground">Administrator</span>
                <span className="tabular-nums text-muted-foreground">
                  {" "}
                  · unlimited interviews
                  {quota.sessionsUsed > 0 ? (
                    <>
                      {" "}
                      · {quota.sessionsUsed} completed
                    </>
                  ) : null}
                  .
                </span>
                <span className="mt-1.5 block">
                  {checkoutPlanNotice(quota, packId, tier.headline)}{" "}
                  <Link
                    href="/admin/settings"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    View in Settings
                  </Link>
                </span>
              </>
            ) : (
              <>
                <span className="font-semibold text-foreground">
                  Active plan:{" "}
                </span>
                <span className="text-foreground">
                  {PLAN_LABEL[quota.plan]}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {" "}
                  · {quota.sessionsUsed}/{quota.sessionLimit} interviews used.
                </span>
                <span className="mt-1.5 block">
                  {checkoutPlanNotice(quota, packId, tier.headline)}{" "}
                  <Link
                    href="/settings#plan"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    View in Settings
                  </Link>
                </span>
              </>
            )}
          </motion.div>
        ) : null}

        <Card className="mt-8 border-border bg-muted/30 p-5 shadow-none">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Order summary
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {tier.headline}
              </p>
              <p className="text-sm text-muted-foreground">{tier.priceNote}</p>
            </div>
            <p className="text-2xl font-semibold tabular-nums text-foreground">
              {tier.price}
            </p>
          </div>
          <ul className="mt-4 space-y-2 border-t border-border pt-4">
            {tier.features.slice(0, 4).map((f) => (
              <li
                key={f}
                className="flex gap-2 text-sm text-muted-foreground"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-green-600 dark:text-green-400" />
                <span>{f}</span>
              </li>
            ))}
            {tier.features.length > 4 ? (
              <li className="pl-6 text-xs text-muted-foreground">
                + {tier.features.length - 4} more included
              </li>
            ) : null}
          </ul>
        </Card>

        <h2 className="mt-10 text-sm font-semibold text-foreground">
          Payment method
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Choose how you&apos;d like to pay. Same price in BDT for every option.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {METHODS.map((m) => {
            const Icon = m.icon;
            const selected = method === m.id;
            return (
              <motion.button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className={cn(
                  "flex flex-col items-start rounded-lg border p-4 text-left transition-colors",
                  selected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/25"
                    : "border-border bg-card hover:bg-muted/40",
                )}
                aria-pressed={selected}
              >
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-md",
                    m.accentBg,
                  )}
                  style={{ color: m.accent }}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="mt-3 text-sm font-semibold text-foreground">
                  {m.label}
                </span>
                <span className="text-xs text-muted-foreground">{m.sub}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="relative mt-8 min-h-[12rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={method}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={transition}
            >
              <PaymentDetailsInner
                method={method}
                tier={tier}
                paidId={packId}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.32, delay: 0.06, ease: [0.22, 1, 0.36, 1] }
          }
          className="mt-10"
        >
          <Card className="border border-dashed border-primary/40 bg-primary/5 p-5 shadow-none dark:bg-primary/10">
            <p className="text-sm font-semibold text-foreground">
              Sandbox payment (testing)
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              After you&apos;ve used all{" "}
              <span className="font-medium text-foreground">3 free</span>{" "}
              interviews, simulate a successful payment here to unlock this pack
              on your account — no real bKash/Nagad/card charge.
            </p>
            {sessionPending ? (
              <p className="mt-4 text-xs text-muted-foreground">
                Checking session…
              </p>
            ) : authed ? (
              <>
                <p className="mt-3 text-xs text-muted-foreground">
                  Signed in as{" "}
                  <span className="font-medium text-foreground">
                    {session?.user?.email ?? ""}
                  </span>
                </p>
                <Button
                  type="button"
                  className="mt-4 inline-flex items-center gap-2"
                  disabled={dummyPending}
                  onClick={() => dummyPurchase(packId)}
                >
                  {dummyPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                      Applying pack…
                    </>
                  ) : (
                    "Complete dummy payment"
                  )}
                </Button>
              </>
            ) : (
              <p className="mt-4 text-xs text-muted-foreground">
                <Link
                  href="/login"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>{" "}
                first, then open this checkout again to run the sandbox payment.
              </p>
            )}
          </Card>
        </motion.div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {!authed ? (
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "inline-flex justify-center sm:min-w-[12rem]",
              )}
            >
              Continue to create account
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "inline-flex justify-center sm:min-w-[12rem]",
              )}
            >
              Back to dashboard
            </Link>
          )}
          <p className="text-xs text-muted-foreground sm:max-w-[14rem] sm:text-right">
            {authed
              ? "Wallet/card fields above are for real flows; sandbox applies the pack instantly for QA."
              : "After signup we&apos;ll match wallet payments using your transaction ID when provided."}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
