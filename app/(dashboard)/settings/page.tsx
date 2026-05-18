"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  useAppSettings,
  useUpdateSettings,
  useDeleteAccount,
} from "@/lib/hooks/useAppSettings";
import { useSessionQuota } from "@/lib/hooks/useDashboard";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { PLAN_LABEL } from "@/lib/types";
import { quotaUpgradeHref } from "@/lib/pricing-packs";
import { cn } from "@/lib/utils";
import { SettingsSharedSections } from "@/components/settings/SettingsSharedSections";
import { fetchAuthMe } from "@/lib/auth-me";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { data: me, isPending: mePending } = useQuery({
    queryKey: ["auth-user"],
    queryFn: fetchAuthMe,
    enabled: !!session?.user,
    retry: false,
  });

  const { data, isLoading, isError, refetch } = useAppSettings();
  const { data: quota } = useSessionQuota();
  const { mutate: patch, isPending: patchPending } = useUpdateSettings();
  const { mutateAsync: deleteAccount, isPending: deletePending } =
    useDeleteAccount();

  const [displayName, setDisplayName] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  const isAdmin = me?.user?.role === "admin";

  useEffect(() => {
    if (isAdmin) {
      router.replace("/admin/settings");
    }
  }, [isAdmin, router]);

  useEffect(() => {
    if (data?.name != null) setDisplayName(data.name);
  }, [data?.name]);

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  async function handleDeleteAccount() {
    if (!deletePassword.trim()) {
      toast.error("Enter your password");
      return;
    }
    try {
      await deleteAccount(deletePassword);
      toast.success("Account deleted");
      setDeletePassword("");
      await authClient.signOut();
      router.push("/login");
      router.refresh();
    } catch {
      /* toast from hook */
    }
  }

  if (session?.user && mePending) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <ErrorMessage message="Could not load settings" />
        <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Account, preferences, and privacy controls
        </p>
      </div>

      <Card id="plan" className="border border-border shadow-none">
        <CardHeader>
          <CardTitle>Plan</CardTitle>
          <CardDescription>
            Free: 3 interviews · ৳300 pack: 10 · ৳2,000 pack: 30. Limits are
            total sessions on your account until you move to a larger pack.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-foreground">
            Current plan:{" "}
            <span className="font-medium">{PLAN_LABEL[data.plan]}</span>
          </p>
          {quota ? (
            <p className="text-muted-foreground">
              Sessions used: {quota.sessionsUsed} of {quota.sessionLimit}
            </p>
          ) : null}
          {quota && !quota.canStartNewSession ? (
            <p className="pt-1">
              <Link
                href={quotaUpgradeHref(quota?.plan ?? data.plan)}
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "no-underline",
                )}
              >
                {data.plan === "pack_30"
                  ? "View packs & billing"
                  : "Get a larger pack"}
              </Link>
            </p>
          ) : null}
        </CardContent>
      </Card>

      <SettingsSharedSections
        data={data}
        displayName={displayName}
        setDisplayName={setDisplayName}
        patch={patch}
        patchPending={patchPending}
        deletePassword={deletePassword}
        setDeletePassword={setDeletePassword}
        deletePending={deletePending}
        handleSignOut={handleSignOut}
        handleDeleteAccount={handleDeleteAccount}
      />
    </div>
  );
}
