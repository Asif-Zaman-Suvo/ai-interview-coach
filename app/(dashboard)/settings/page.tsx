"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Difficulty, JobRole } from "@/lib/types";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { TestimonialFeedbackCard } from "@/components/settings/TestimonialFeedbackCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  useAppSettings,
  useUpdateSettings,
  useDeleteAccount,
} from "@/lib/hooks/useAppSettings";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const ROLES: JobRole[] = [
  "Frontend Developer",
  "Backend Developer",
  "Product Manager",
  "Data Scientist",
  "DevOps Engineer",
];

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

function SettingsSwitchRow({
  id,
  title,
  description,
  checked,
  onCheckedChange,
  disabled,
}: {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="min-w-0 space-y-0.5 pr-4">
        <Label htmlFor={id} className="cursor-pointer text-sm font-medium">
          {title}
        </Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        className="shrink-0"
      />
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data, isLoading, isError, refetch } = useAppSettings();
  const { mutate: patch, isPending: patchPending } = useUpdateSettings();
  const { mutateAsync: deleteAccount, isPending: deletePending } =
    useDeleteAccount();

  const [displayName, setDisplayName] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (data?.name != null) setDisplayName(data.name);
  }, [data?.name]);

  const themeValue = (theme ?? "system") as "light" | "dark" | "system";

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
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Account, preferences, and privacy controls
        </p>
      </div>

      <Card className="border border-border shadow-none">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Your name appears in the sidebar and interview flows.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar size="lg">
              <AvatarFallback className="text-sm font-medium">
                {displayName
                  .split(/\s+/)
                  .filter(Boolean)
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Photo</p>
              <p className="text-sm text-muted-foreground">
                Avatar initials are derived from your display name.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="display-name">Display name</Label>
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                readOnly
                className="bg-muted/40"
                autoComplete="email"
              />
              <p className="text-xs text-muted-foreground">
                Email is tied to your login. Contact support to change it.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/30">
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Profile is stored with your account.
            </p>
            <Button
              type="button"
              size="sm"
              disabled={patchPending}
              onClick={() => patch({ name: displayName })}
            >
              {patchPending ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <TestimonialFeedbackCard />

      <Card className="border border-border shadow-none">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Theme applies across the dashboard and marketing pages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label id="theme-label">Color theme</Label>
            {!mounted ? (
              <div
                className="h-8 max-w-xs rounded-lg bg-muted"
                aria-hidden
              />
            ) : (
              <Select
                value={themeValue}
                onValueChange={(v) => {
                  if (v) setTheme(v as "light" | "dark" | "system");
                }}
              >
                <SelectTrigger
                  className="w-full max-w-xs"
                  aria-labelledby="theme-label"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border shadow-none">
        <CardHeader>
          <CardTitle>Interview defaults</CardTitle>
          <CardDescription>
            Pre-fill new interview setup when you pick a default.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label id="default-role-label">Default role</Label>
            <Select
              value={data.interviewDefaultRole || "__none__"}
              disabled={patchPending}
              onValueChange={(v) => {
                if (!v) return;
                patch({
                  interviewDefaultRole: v === "__none__" ? "" : v,
                });
              }}
            >
              <SelectTrigger
                className="w-full"
                aria-labelledby="default-role-label"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Ask each time</SelectItem>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label id="default-difficulty-label">Default difficulty</Label>
            <Select
              value={data.interviewDefaultDifficulty || "__none__"}
              disabled={patchPending}
              onValueChange={(v) => {
                if (!v) return;
                patch({
                  interviewDefaultDifficulty: v === "__none__" ? "" : v,
                });
              }}
            >
              <SelectTrigger
                className="w-full"
                aria-labelledby="default-difficulty-label"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Ask each time</SelectItem>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border shadow-none">
        <CardHeader className="pb-4">
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Email preferences for when outbound messaging exists.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <div className="divide-y divide-border border-t border-border">
            <div className="px-6">
              <SettingsSwitchRow
                id="weekly-digest"
                title="Weekly progress digest"
                description="Summary of sessions, scores, and streaks."
                checked={data.weeklyDigest}
                disabled={patchPending}
                onCheckedChange={(c) => patch({ weeklyDigest: c })}
              />
            </div>
            <div className="px-6">
              <SettingsSwitchRow
                id="session-reminders"
                title="Practice reminders"
                description="Nudge when you have not practiced in a few days."
                checked={data.sessionReminders}
                disabled={patchPending}
                onCheckedChange={(c) => patch({ sessionReminders: c })}
              />
            </div>
            <div className="px-6">
              <SettingsSwitchRow
                id="product-tips"
                title="Product tips"
                description="Occasional ideas to get more from Interview Coach."
                checked={data.productTips}
                disabled={patchPending}
                onCheckedChange={(c) => patch({ productTips: c })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border shadow-none">
        <CardHeader>
          <CardTitle>Legal &amp; support</CardTitle>
          <CardDescription>Policies and external resources.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          <Link
            href="/privacy"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "inline-flex h-9 w-full items-center gap-2 font-normal px-4"
            )}
          >
            Privacy policy
            <ExternalLink className="size-3.5 shrink-0 opacity-60" aria-hidden />
          </Link>
          <Link
            href="/terms"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "inline-flex h-9 w-full items-center gap-2 font-normal px-4"
            )}
          >
            Terms of service
            <ExternalLink className="size-3.5 shrink-0 opacity-60" aria-hidden />
          </Link>
        </CardContent>
      </Card>

      <Card className="border border-destructive/25 shadow-none ring-1 ring-destructive/15">
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>
            Irreversible actions for account and stored data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Sign out</p>
              <p className="text-sm text-muted-foreground">
                End this session on this device.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => void handleSignOut()}
            >
              Sign out
            </Button>
          </div>
          <Separator />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Delete account
              </p>
              <p className="text-sm text-muted-foreground">
                Remove profile, homepage testimonial, and all interview history.
              </p>
            </div>
            <Dialog>
              <DialogTrigger
                render={
                  <Button
                    size="sm"
                    className="shrink-0 border border-destructive/40 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  />
                }
              >
                Delete account
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete account?</DialogTitle>
                  <DialogDescription>
                    This permanently deletes your practice sessions, answers,
                    and profile. You will need to register again to use the app.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 py-2">
                  <Label htmlFor="delete-password">Confirm password</Label>
                  <Input
                    id="delete-password"
                    type="password"
                    autoComplete="current-password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                  />
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <DialogClose render={<Button variant="outline" />}>
                    Cancel
                  </DialogClose>
                  <Button
                    type="button"
                    disabled={deletePending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => void handleDeleteAccount()}
                  >
                    {deletePending ? "Deleting…" : "Delete permanently"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
