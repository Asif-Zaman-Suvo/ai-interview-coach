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
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
  const { data: users, isLoading, isError } = useAdminUsers();
  const { mutate: changeRole } = useChangeRole();
  const { mutate: deleteUser } = useDeleteUser();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleRoleChange = (userId: string, newRole: string) => {
    changeRole(
      { id: userId, role: newRole },
      {
        onSuccess: () => {
          console.log('Role changed successfully');
        },
        onError: (error) => {
          console.error('Failed to change role:', error);
        },
      }
    );
  };

  const handleDeleteClick = (userId: string) => {
    setSelectedUserId(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedUserId) {
      deleteUser(selectedUserId, {
        onSuccess: () => {
          console.log('User deleted successfully');
          setDeleteDialogOpen(false);
          setSelectedUserId(null);
        },
        onError: (error) => {
          console.error('Failed to delete user:', error);
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">User Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage user accounts and permissions
        </p>
      </div>

      <Card className="p-6">
        <UsersTable
          users={users}
          isLoading={isLoading}
          isError={isError}
          onRoleChange={handleRoleChange}
          onDelete={handleDeleteClick}
        />
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
