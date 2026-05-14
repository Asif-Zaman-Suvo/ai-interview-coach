"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Role } from "@/lib/types";
import { useRoles } from "@/lib/hooks/useInterview";
import {
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "@/lib/hooks/useAdmin";
import { Pencil, Plus, Trash2 } from "lucide-react";

export default function AdminRolesPage() {
  const { data: roles, isLoading, isError } = useRoles();
  const { mutate: createRole } = useCreateRole();
  const { mutate: updateRole } = useUpdateRole();
  const { mutate: deleteRole } = useDeleteRole();

  const [adding, setAdding] = useState(false);
  const [draftNew, setDraftNew] = useState({
    name: "",
    icon: "briefcase",
    description: "",
  });
  const [editing, setEditing] = useState<Role | null>(null);
  const [editDraft, setEditDraft] = useState({
    name: "",
    icon: "",
    description: "",
  });

  const startEdit = (r: Role) => {
    setEditing(r);
    setEditDraft({ name: r.name, icon: r.icon, description: r.description });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Job roles</h1>
          <p className="text-sm text-muted-foreground">
            Roles group question bank entries and interview setup options.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          className="gap-2"
          onClick={() => setAdding(true)}
        >
          <Plus className="size-4" />
          New role
        </Button>
      </div>

      <Card className="p-6">
        {isLoading && <LoadingSpinner />}
        {isError && (
          <ErrorMessage message="Failed to load roles" />
        )}
        {!isLoading &&
          !isError &&
          (!roles?.length ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No roles yet. Create one to attach questions.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="p-3 text-xs font-semibold uppercase text-muted-foreground">
                      Name
                    </th>
                    <th className="p-3 text-xs font-semibold uppercase text-muted-foreground">
                      Icon slug
                    </th>
                    <th className="p-3 text-xs font-semibold uppercase text-muted-foreground">
                      Description
                    </th>
                    <th className="p-3 text-right text-xs font-semibold uppercase text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((r) => (
                    <tr key={r.id} className="border-b border-border">
                      <td className="p-3 text-sm font-medium">{r.name}</td>
                      <td className="p-3 text-sm text-muted-foreground font-mono text-xs">
                        {r.icon}
                      </td>
                      <td className="p-3 text-sm text-muted-foreground max-w-md">
                        {r.description}
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => startEdit(r)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive"
                          onClick={() =>
                            void deleteRole(String(r.id), {
                              onError: console.error,
                            })
                          }
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
      </Card>

      <Dialog open={adding} onOpenChange={() => setAdding(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New job role</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Name
              </label>
              <Input
                value={draftNew.name}
                onChange={(e) =>
                  setDraftNew({ ...draftNew, name: e.target.value })
                }
                placeholder="e.g. Data Analyst"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Icon (Lucide slug)
              </label>
              <Input
                value={draftNew.icon}
                onChange={(e) =>
                  setDraftNew({ ...draftNew, icon: e.target.value })
                }
                placeholder="chart-column"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Description
              </label>
              <textarea
                className="mt-1 w-full min-h-[72px] rounded-md border border-border bg-background px-3 py-2 text-sm"
                value={draftNew.description}
                onChange={(e) =>
                  setDraftNew({ ...draftNew, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" type="button" onClick={() => setAdding(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() =>
                createRole(
                  {
                    name: draftNew.name.trim(),
                    icon: draftNew.icon.trim() || "briefcase",
                    description:
                      draftNew.description.trim() || "Interview practice role",
                  },
                  {
                    onSuccess: () => {
                      setDraftNew({
                        name: "",
                        icon: "briefcase",
                        description: "",
                      });
                      setAdding(false);
                    },
                    onError: console.error,
                  },
                )
              }
              disabled={
                !draftNew.name.trim() || !draftNew.description.trim()
              }
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit role</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input
              value={editDraft.name}
              onChange={(e) =>
                setEditDraft({ ...editDraft, name: e.target.value })
              }
              placeholder="Name"
            />
            <Input
              value={editDraft.icon}
              onChange={(e) =>
                setEditDraft({ ...editDraft, icon: e.target.value })
              }
              placeholder="Icon slug"
            />
            <textarea
              className="w-full min-h-[72px] rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={editDraft.description}
              onChange={(e) =>
                setEditDraft({ ...editDraft, description: e.target.value })
              }
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" type="button" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() =>
                editing &&
                updateRole(
                  {
                    id: String(editing.id),
                    body: {
                      name: editDraft.name.trim(),
                      icon: editDraft.icon.trim(),
                      description: editDraft.description.trim(),
                    },
                  },
                  {
                    onSuccess: () => setEditing(null),
                    onError: console.error,
                  },
                )
              }
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
