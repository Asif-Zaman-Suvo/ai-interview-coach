"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Badge } from "@/components/ui/badge";
import { formatElapsedSeconds } from "@/lib/format-duration";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, CheckCircle } from "lucide-react";
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
import { useDeleteInterviewSession, useSessionById } from "@/lib/hooks/useHistory";
import { useIsAdmin } from "@/lib/hooks/useAuthRole";
import { toast } from "sonner";

export default function HistoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteMutation = useDeleteInterviewSession();
  const isAdmin = useIsAdmin();
  const { data: session, isLoading, isError } = useSessionById(sessionId);

  if (isLoading) return <LoadingSpinner />;
  if (isError || !session) return <ErrorMessage message="Failed to load session details" />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/history">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Back to History
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-foreground">Session Details</h1>
        <p className="text-muted-foreground">
          {session.role} • {session.difficulty} •{" "}
          {new Date(session.startedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Session Overview */}
      <Card className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <p className="text-sm text-muted-foreground">Status</p>
            </div>
            <p className="text-lg font-semibold text-foreground capitalize">{session.status}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Duration</p>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {formatElapsedSeconds(session.duration)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Score</p>
            <p className="text-lg font-semibold text-foreground">{session.score}/100</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Questions</p>
            <p className="text-lg font-semibold text-foreground">{session.questions.length}</p>
          </div>
        </div>
      </Card>

      {/* Questions and Answers */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Questions & Answers</h2>
        <div className="space-y-6">
          {session.questions.map((question, index) => {
            const answer = session.answers?.find(a => a.questionId === question.id);
            const feedback = session.feedback?.find(f => f.questionId === question.id);

            return (
              <div key={question.id} className="border border-border rounded-lg p-4 space-y-3">
                {/* Question */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Question {index + 1}
                    </span>
                    <Badge variant="secondary">{question.category}</Badge>
                    <Badge variant="secondary">{question.difficulty}</Badge>
                    {feedback && (
                      <Badge
                        variant="secondary"
                        className={feedback.score >= 80 ? "bg-green-500/20 text-green-600 dark:text-green-400" : feedback.score >= 60 ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" : "bg-red-500/20 text-red-600 dark:text-red-400"}
                      >
                        {feedback.score}/100
                      </Badge>
                    )}
                  </div>
                  <p className="text-base text-foreground">{question.text}</p>
                </div>

                {/* Answer */}
                {answer && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Your Answer:</p>
                    <div className="bg-muted p-3 rounded">
                      <p className="text-sm text-foreground">{answer.transcript}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Duration: {formatElapsedSeconds(answer.audioDuration ?? 0)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {feedback && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Feedback:</p>
                    <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded">
                      <p className="text-sm text-foreground mb-2">{feedback.feedback}</p>
                      {feedback.strengths.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">
                            Strengths:
                          </p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {feedback.strengths.map((strength, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <span>•</span>
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {feedback.improvements.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400 mb-1">
                            Improvements:
                          </p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {feedback.improvements.map((improvement, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <span>•</span>
                                <span>{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <Link href="/interview/setup">
          <Button>New Interview</Button>
        </Link>
        <Link href={`/interview/result/${session.id}`}>
          <Button variant="outline">View Results</Button>
        </Link>
        {isAdmin ? (
          <Button
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
            disabled={deleteMutation.isPending}
          >
            Delete interview
          </Button>
        ) : null}
      </div>

      {isAdmin ? (
        <Dialog open={deleteOpen} onOpenChange={(o: boolean) => !o && setDeleteOpen(false)}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Delete this interview?</DialogTitle>
            <DialogDescription>
              Permanently remove this session and all stored answers. This cannot
              be undone.
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
              onClick={() => {
                deleteMutation.mutate(sessionId, {
                  onSuccess: () => {
                    setDeleteOpen(false);
                    toast.success("Interview deleted");
                    router.push("/history");
                  },
                  onError: () => {
                    toast.error("Could not delete this interview");
                  },
                });
              }}
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
