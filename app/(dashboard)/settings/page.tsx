"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
}: {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div className="min-w-0 space-y-0.5">
        <Label htmlFor={id} className="cursor-pointer text-sm font-medium">
          {title}
        </Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="shrink-0"
      />
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [displayName, setDisplayName] = useState("Asif Zaman");
  const [email, setEmail] = useState("asif.zaman@example.com");
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");

  const [defaultRole, setDefaultRole] = useState<JobRole | "">("");
  const [defaultDifficulty, setDefaultDifficulty] = useState<Difficulty | "">(
    ""
  );

  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(false);
  const [productTips, setProductTips] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSaveProfile = () => {
    setSaveState("saved");
    window.setTimeout(() => setSaveState("idle"), 2000);
  };

  const themeValue = (theme ?? "system") as "light" | "dark" | "system";

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Account, preferences, and privacy controls
        </p>
      </div>

      {/* Profile */}
      <Card className="border border-border shadow-none">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Visible in the app sidebar until you wire up real auth.
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/30">
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Changes are local to this session (no backend yet).
            </p>
            <Button type="button" size="sm" onClick={handleSaveProfile}>
              {saveState === "saved" ? "Saved" : "Save changes"}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <TestimonialFeedbackCard />

      {/* Appearance */}
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
                onValueChange={(v) =>
                  setTheme(v as "light" | "dark" | "system")
                }
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

      {/* Interview defaults */}
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
              value={defaultRole || "__none__"}
              onValueChange={(v) =>
                setDefaultRole(v === "__none__" ? "" : (v as JobRole))
              }
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
              value={defaultDifficulty || "__none__"}
              onValueChange={(v) =>
                setDefaultDifficulty(
                  v === "__none__" ? "" : (v as Difficulty)
                )
              }
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

      {/* Notifications */}
      <Card className="border border-border shadow-none">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Email preferences for when outbound messaging exists.
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border px-0">
          <div className="px-4">
            <SettingsSwitchRow
              id="weekly-digest"
              title="Weekly progress digest"
              description="Summary of sessions, scores, and streaks."
              checked={weeklyDigest}
              onCheckedChange={setWeeklyDigest}
            />
          </div>
          <div className="px-4">
            <SettingsSwitchRow
              id="session-reminders"
              title="Practice reminders"
              description="Nudge when you have not practiced in a few days."
              checked={sessionReminders}
              onCheckedChange={setSessionReminders}
            />
          </div>
          <div className="px-4">
            <SettingsSwitchRow
              id="product-tips"
              title="Product tips"
              description="Occasional ideas to get more from Interview Coach."
              checked={productTips}
              onCheckedChange={setProductTips}
            />
          </div>
        </CardContent>
      </Card>

      {/* Legal / support */}
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

      {/* Danger zone */}
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
            <Link
              href="/login"
              className={buttonVariants({
                variant: "outline",
                size: "sm",
              })}
            >
              Sign out
            </Link>
          </div>
          <Separator />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Delete account
              </p>
              <p className="text-sm text-muted-foreground">
                Remove profile and practice history after confirmation.
              </p>
            </div>
            <Dialog>
              <DialogTrigger render={<Button variant="destructive" size="sm" />}>
                Delete account
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete account?</DialogTitle>
                  <DialogDescription>
                    This is a UI placeholder. wiring a real API will permanently
                    delete sessions, feedback, and billing data where applicable.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <DialogClose render={<Button variant="outline" />}>
                    Cancel
                  </DialogClose>
                  <Button
                    variant="destructive"
                    type="button"
                    onClick={() => {
                      /* placeholder */
                    }}
                  >
                    Delete permanently
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
