"use client";

import { startTransition, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { cn } from "@/lib/utils";
import { SettingsSharedSections } from "@/components/settings/SettingsSharedSections";
import {
  BarChart3,
  Briefcase,
  ChevronRight,
  Database,
  Shield,
  Users,
} from "lucide-react";

const adminShortcuts = [
  { href: "/admin/dashboard", label: "Admin dashboard", icon: BarChart3 },
  { href: "/admin/roles", label: "Job roles", icon: Briefcase },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/questions", label: "Question bank", icon: Database },
  { href: "/admin/stats", label: "System stats", icon: Shield },
] as const;

export default function AdminSettingsPage() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useAppSettings();
  const { data: quota } = useSessionQuota();
  const { mutate: patch, isPending: patchPending } = useUpdateSettings();
  const { mutateAsync: deleteAccount, isPending: deletePending } =
    useDeleteAccount();

  const [displayName, setDisplayName] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  useEffect(() => {
    if (data?.name == null) return;
    startTransition(() => setDisplayName(data.name));
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
        <h1 className="text-2xl font-semibold text-foreground">
          Admin settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Administrator account, moderation shortcuts, and your personal
          preferences.
        </p>
      </div>

      <Card id="account" className="border border-border shadow-none">
        <CardHeader>
          <CardTitle>Administrator account</CardTitle>
          <CardDescription>
            No interview caps — practice sessions are unlimited for this role.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-foreground">
            <span className="font-medium">Administrator</span>
            <span className="text-muted-foreground">
              {" "}
              — unlimited interviews
            </span>
          </p>
          {quota ? (
            <p className="text-muted-foreground">
              Sessions completed:{" "}
              <span className="tabular-nums font-medium text-foreground">
                {quota.sessionsUsed}
              </span>
            </p>
          ) : (
            <p className="text-muted-foreground">Loading usage…</p>
          )}
        </CardContent>
      </Card>

      <Card className="border border-border shadow-none">
        <CardHeader>
          <CardTitle>Admin tools</CardTitle>
          <CardDescription>
            Jump to moderation and configuration in the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {adminShortcuts.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-auto justify-between gap-2 py-3 font-normal no-underline",
              )}
            >
              <span className="flex items-center gap-2">
                <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                {label}
              </span>
              <ChevronRight className="size-4 shrink-0 opacity-50" aria-hidden />
            </Link>
          ))}
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
