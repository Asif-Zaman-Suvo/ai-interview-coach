"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useSessions } from "@/lib/hooks/useHistory";
import { formatElapsedSeconds } from "@/lib/format-duration";
import { formatLocaleDateParts } from "@/lib/parse-api-date";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteInterviewSession } from "@/lib/hooks/useHistory";
import { toast } from "sonner";
import type { SessionSummary } from "@/lib/types";

export default function HistoryPage() {
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<SessionSummary | null>(
    null,
  );
  const { data: sessionsData, isLoading, isError } = useSessions(page);
  const deleteMutation = useDeleteInterviewSession();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message="Failed to load interview history" />;

  const sessions = sessionsData?.sessions || [];
  const totalPages = sessionsData?.totalPages || 1;

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    deleteMutation.mutate(id, {
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
        <h1 className="text-2xl font-semibold text-foreground">Interview History</h1>
        <p className="text-sm text-muted-foreground">
          View your past interview sessions and results
        </p>
      </div>

      <Card className="p-6">
        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No interviews yet</p>
            <Link href="/interview/setup">
              <Button>Start Your First Interview</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Table header */}
            <div className="grid grid-cols-5 gap-4 text-sm font-medium text-muted-foreground pb-2 border-b border-border">
              <div>Role</div>
              <div>Date</div>
              <div>Duration</div>
              <div>Score</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Table rows */}
            {sessions.map((session) => {
              const dp = formatLocaleDateParts(session.date);
              return (
              <div
                key={session.id}
                className="grid grid-cols-5 gap-4 items-center py-3 border-b border-border last:border-0"
              >
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {session.role || 'Unknown'}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-foreground">
                    {dp?.dateLine ?? '—'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {dp?.timeLine ?? ''}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-foreground">
                    {formatElapsedSeconds(session.duration)}
                  </div>
                </div>

                <div>
                  <div
                    className={`text-sm font-semibold ${
                      session.score >= 80
                        ? "text-green-600 dark:text-green-400"
                        : session.score >= 60
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {session.score}/100
                  </div>
                </div>

                <div className="text-right flex items-center justify-end gap-2">
                  <Link href={`/history/${session.id}`}>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      <Dialog
        open={!!pendingDelete}
        onOpenChange={(open: boolean) => !open && setPendingDelete(null)}
      >
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Delete interview?</DialogTitle>
            <DialogDescription>
              This removes the session &ldquo;
              {pendingDelete?.role ?? "session"}&rdquo; and all answers from
              your history. You cannot undo this.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton={false} className="border-0 bg-transparent p-0 sm:justify-end">
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
    </div>
  );
}
