import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Trash2, X } from "lucide-react";
import type { AdminUser } from "@/lib/types";
import { PLAN_LABEL } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";

function normalizeEmail(email: string | null | undefined): string {
  return (email ?? "").trim().toLowerCase();
}

function committedRole(u: AdminUser): "user" | "admin" {
  return u.role === "admin" ? "admin" : "user";
}

function AdminUserPlanCell({ user }: { user: AdminUser }) {
  if (user.role === "admin") {
    return (
      <div className="max-w-[14rem] text-sm">
        <span className="text-muted-foreground tabular-nums">—</span>
        <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
          Administrators don&apos;t have a billing plan.
        </p>
      </div>
    );
  }
  const p =
    user.plan === "pack_10" || user.plan === "pack_30" ? user.plan : "free";
  return (
    <span className="text-sm font-medium text-foreground">{PLAN_LABEL[p]}</span>
  );
}

function RoleSelectWithConfirm({
  user,
  soleAdminCannotDemote,
  roleUpdatePending,
  onRoleChange,
}: {
  user: AdminUser;
  soleAdminCannotDemote: boolean;
  roleUpdatePending?: boolean;
  onRoleChange: (userId: string, role: "user" | "admin") => void;
}) {
  const committed = committedRole(user);
  const [pending, setPending] = useState<"user" | "admin" | null>(null);
  const displayed = pending ?? committed;

  useEffect(() => {
    if (pending !== null && pending === committed) {
      setPending(null);
    }
  }, [committed, pending]);

  const dirty = pending !== null;
  const disabled = !!roleUpdatePending;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={displayed}
          disabled={disabled}
          onValueChange={(v) => {
            const next = v as "user" | "admin";
            if (next === committed) setPending(null);
            else setPending(next);
          }}
        >
          <SelectTrigger
            className="w-[min(100%,11rem)]"
            aria-label={`Role for ${user.email}`}
            size="sm"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user" disabled={soleAdminCannotDemote}>
              User
            </SelectItem>
            <SelectItem value="admin">Administrator</SelectItem>
          </SelectContent>
        </Select>
        {dirty && (
          <>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="shrink-0 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={disabled}
              aria-label={`Cancel role change for ${user.email}`}
              onClick={() => setPending(null)}
            >
              <X className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              className="shrink-0 bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              disabled={disabled || pending === null}
              aria-label={`Confirm role ${pending ?? ""} for ${user.email}`}
              onClick={() => {
                if (pending === null || pending === committed) return;
                onRoleChange(user.id, pending);
              }}
            >
              <Check className="size-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

interface UsersTableProps {
  users?: AdminUser[];
  isLoading?: boolean;
  isError?: boolean;
  /** Signed-in admin email (Better Auth); used to avoid locking out the last admin accidentally */
  viewerEmail?: string | null;
  /** While a role PUT is in flight */
  roleUpdatePending?: boolean;
  onRoleChange?: (userId: string, newRole: "user" | "admin") => void;
  onDelete?: (userId: string) => void;
}

export function UsersTable({
  users,
  isLoading,
  isError,
  viewerEmail,
  roleUpdatePending,
  onRoleChange,
  onDelete,
}: UsersTableProps) {
  const adminCount = useMemo(
    () => users?.filter((u) => u.role === "admin").length ?? 0,
    [users],
  );

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message="Failed to load users" />;

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No users found
      </div>
    );
  }

  const viewer = normalizeEmail(viewerEmail);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-4 text-sm font-medium text-foreground">
              Name
            </th>
            <th className="text-left p-4 text-sm font-medium text-foreground">
              Email
            </th>
            <th className="text-left p-4 text-sm font-medium text-foreground">
              Role
            </th>
            <th className="text-left p-4 text-sm font-medium text-foreground">
              Plan{" "}
              <span className="font-normal text-muted-foreground">(view only)</span>
            </th>
            <th className="text-left p-4 text-sm font-medium text-foreground">
              Sessions
            </th>
            <th className="text-left p-4 text-sm font-medium text-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isRowViewer =
              viewer.length > 0 && normalizeEmail(user.email) === viewer;
            const soleAdminCannotDemote = Boolean(
              isRowViewer && user.role === "admin" && adminCount <= 1,
            );

            return (
              <tr
                key={user.id}
                className="border-b border-border hover:bg-muted/50"
              >
                <td className="p-4 text-sm text-foreground">
                  <span className="inline-flex flex-wrap items-center gap-2">
                    {user.name}
                    {isRowViewer ? (
                      <Badge variant="secondary" className="font-normal">
                        You
                      </Badge>
                    ) : null}
                  </span>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
                <td className="p-4">
                  {onRoleChange ? (
                    <RoleSelectWithConfirm
                      user={user}
                      soleAdminCannotDemote={soleAdminCannotDemote}
                      roleUpdatePending={roleUpdatePending}
                      onRoleChange={onRoleChange}
                    />
                  ) : (
                    <span className="text-sm capitalize text-foreground">
                      {user.role}
                    </span>
                  )}
                  {soleAdminCannotDemote && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Promote another admin before demoting yourself.
                    </p>
                  )}
                </td>
                <td className="p-4 align-top">
                  <AdminUserPlanCell user={user} />
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {user.sessionsCount ?? 0}
                </td>
                <td className="p-4">
                  {onDelete && !isRowViewer ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(user.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                      aria-label={`Delete ${user.email}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
