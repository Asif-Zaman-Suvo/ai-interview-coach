"use client";

import { Card } from "@/components/ui/card";
import { UsersTable } from "@/components/admin/UsersTable";
import { useAdminUsers, useChangeRole, useDeleteUser } from "@/lib/hooks/useAdmin";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";

export default function AdminUsersPage() {
  const { data: users, isLoading, isError } = useAdminUsers();
  const { mutate: changeRole, isPending: rolePending } = useChangeRole();
  const { mutate: deleteUser } = useDeleteUser();
  const { data: authSession } = authClient.useSession();
  const { data: authMe } = useQuery({
    queryKey: ["auth-user"],
    queryFn: () =>
      api.get<{ user?: { email?: string } }>("/auth/me"),
    staleTime: 60_000,
    enabled: !!authSession?.user,
  });

  /** Prefer `/auth/me` so viewer matches server session + normalized login email */
  const viewerEmail =
    (typeof authMe?.user?.email === "string" && authMe.user.email.trim()
      ? authMe.user.email
      : authSession?.user?.email?.trim()) || null;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleRoleChange = (
    userId: string,
    newRole: "user" | "admin",
  ) => {
    changeRole({ id: userId, role: newRole });
  };

  const handleDeleteClick = (userId: string) => {
    setSelectedUserId(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedUserId) {
      deleteUser(selectedUserId, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedUserId(null);
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          User Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage roles and remove accounts. Learner billing plans are shown for
          visibility only — admins don&apos;t have a plan; plans can&apos;t be
          edited here (users upgrade via checkout).
        </p>
      </div>

      <Card className="p-6">
        <UsersTable
          users={users}
          isLoading={isLoading}
          isError={isError}
          viewerEmail={viewerEmail}
          roleUpdatePending={rolePending}
          onRoleChange={handleRoleChange}
          onDelete={handleDeleteClick}
        />
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete user
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
