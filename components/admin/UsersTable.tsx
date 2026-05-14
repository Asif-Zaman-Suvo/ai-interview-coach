import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Shield } from "lucide-react";
import { AdminUser } from "@/lib/types";

interface UsersTableProps {
  users?: AdminUser[];
  isLoading?: boolean;
  isError?: boolean;
  onRoleChange?: (userId: string, newRole: string) => void;
  onDelete?: (userId: string) => void;
}

export function UsersTable({
  users,
  isLoading,
  isError,
  onRoleChange,
  onDelete,
}: UsersTableProps) {
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message="Failed to load users" />;

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No users found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-4 text-sm font-medium text-foreground">Name</th>
            <th className="text-left p-4 text-sm font-medium text-foreground">Email</th>
            <th className="text-left p-4 text-sm font-medium text-foreground">Role</th>
            <th className="text-left p-4 text-sm font-medium text-foreground">Sessions</th>
            <th className="text-left p-4 text-sm font-medium text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-border hover:bg-muted/50">
              <td className="p-4 text-sm text-foreground">{user.name}</td>
              <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
              <td className="p-4">
                <Badge variant={user.role === 'admin' ? 'secondary' : 'default'}>
                  {user.role}
                </Badge>
              </td>
              <td className="p-4 text-sm text-muted-foreground">
                {user.sessionsCount ?? 0}
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {user.role !== 'admin' && onRoleChange && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRoleChange(user.id, 'admin')}
                      className="h-8 w-8 p-0"
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(user.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
