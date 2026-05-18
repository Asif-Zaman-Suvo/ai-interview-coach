"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdminInterviewSessions } from "@/lib/hooks/useAdmin";
import { useDeleteInterviewSession } from "@/lib/hooks/useHistory";
import { formatElapsedSeconds } from "@/lib/format-duration";
import { formatLocaleDateParts } from "@/lib/parse-api-date";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { AdminInterviewSessionRow } from "@/lib/types";

const LIST_LIMIT = 15;

export default function AdminInterviewHistoryPage() {
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] =
    useState<AdminInterviewSessionRow | null>(null);
  const { data: sessionsData, isLoading, isError } =
    useAdminInterviewSessions(page, LIST_LIMIT);
  const deleteMutation = useDeleteInterviewSession();

  if (isLoading) return <LoadingSpinner />;
  if (isError) {
    return <ErrorMessage message="Failed to load interview history" />;
  }

  const sessions = sessionsData?.sessions ?? [];
  const totalPages = sessionsData?.totalPages ?? 1;

  const confirmDelete = () => {
    if (!pendingDelete) return;
    deleteMutation.mutate(pendingDelete.id, {
      onSuccess: () => {
        setPendingDelete(null);
        toast.success("Interview deleted");
      },
      onError: () => {
        toast.error("Could not delete this interview");
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Interview history
        </h1>
        <p className="text-sm text-muted-foreground">
          All users&apos; interviews — newest first
        </p>
      </div>

      <Card className="p-6">
        {sessions.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No interviews in the database yet.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="-mx-2 overflow-x-auto px-2">
              <div className="min-w-[760px] space-y-4">
                <div className="grid grid-cols-6 gap-3 border-b border-border pb-2 text-sm font-medium text-muted-foreground">
                  <div>Role</div>
                  <div>User</div>
                  <div>Date</div>
                  <div>Duration</div>
                  <div>Score</div>
                  <div className="text-right">Actions</div>
                </div>

                {sessions.map((session) => {
                  const dp = formatLocaleDateParts(session.date);
                  const label =
                    session.participantName?.trim()
                      ? session.participantName
                      : session.participantEmail ?? "—";

                  return (
                    <div
                      key={session.id}
                      className="grid grid-cols-6 gap-3 items-start border-b border-border py-3 last:border-0"
                    >
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {session.role || "Unknown"}
                        </div>
                        {session.difficulty ? (
                          <div className="text-[11px] text-muted-foreground">
                            {session.difficulty}
                          </div>
                        ) : null}
                      </div>

                      <div className="min-w-0">
                        <div
                          className="truncate text-sm text-foreground"
                          title={
                            session.participantEmail ??
                            session.participantUserId
                          }
                        >
                          {label}
                        </div>
                        {session.participantEmail &&
                        session.participantName?.trim() ? (
                          <div className="truncate text-xs text-muted-foreground">
                            {session.participantEmail}
                          </div>
                        ) : null}
                      </div>

                      <div>
                        <div className="text-sm text-foreground">
                          {dp?.dateLine ?? "—"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {dp?.timeLine ?? ""}
                        </div>
                      </div>

                      <div className="text-sm tabular-nums text-foreground">
                        {formatElapsedSeconds(session.duration)}
                      </div>

                      <div>
                        <span
                          className={`text-sm font-semibold tabular-nums ${
                            session.score >= 80
                              ? "text-green-600 dark:text-green-400"
                              : session.score >= 60
                                ? "text-yellow-600 dark:text-yellow-400"
                                : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {session.score}/100
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-2 text-right">
                        <Link href={`/admin/interviews/${session.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setPendingDelete(session)}
                          disabled={
                            deleteMutation.isPending &&
                            pendingDelete?.id === session.id
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {totalPages > 1 ? (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="size-4" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </Card>

      {pendingDelete ? (
        <Dialog
          open={!!pendingDelete}
          onOpenChange={(open) => !open && setPendingDelete(null)}
        >
          <DialogContent showCloseButton>
            <DialogHeader>
              <DialogTitle>Delete interview?</DialogTitle>
              <DialogDescription>
                This permanently removes{" "}
                <span className="font-medium text-foreground">
                  {pendingDelete.role ?? "this session"}
                </span>
                {pendingDelete.participantEmail ? (
                  <>
                    {" "}
                    for{" "}
                    <span className="font-medium text-foreground">
                      {pendingDelete.participantEmail}
                    </span>
                  </>
                ) : null}{" "}
                and cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter
              showCloseButton={false}
              className="-mx-0 -mb-0 mt-4 flex flex-col-reverse gap-4 border-0 bg-transparent p-0 sm:flex-row sm:justify-end"
            >
              <DialogClose render={<Button variant="outline" size="sm" />}>
                Cancel
              </DialogClose>
              <Button
                variant="destructive"
                size="sm"
                disabled={deleteMutation.isPending}
                onClick={confirmDelete}
              >
                {deleteMutation.isPending ? "Deleting…" : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
