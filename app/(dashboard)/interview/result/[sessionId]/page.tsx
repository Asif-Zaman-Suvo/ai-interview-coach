"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Badge } from "@/components/ui/badge";
import { useSessionById } from "@/lib/hooks/useHistory";
import { CheckCircle, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function InterviewResultPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const { data: session, isLoading, isError } = useSessionById(sessionId);

  if (isLoading) return <LoadingSpinner />;
  if (isError || !session) return <ErrorMessage message="Failed to load interview results" />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            Interview Completed
          </span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Interview Results</h1>
        <p className="text-muted-foreground">
          {session.role} • {session.difficulty} •{" "}
          {new Date(session.startedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Overall Score */}
      <Card className="p-8 text-center">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
            <div className="text-6xl font-bold text-foreground">{session.score}</div>
            <p className="text-sm text-muted-foreground mt-2">out of 100</p>
          </div>

          {/* Score indicator */}
          <div className="max-w-md mx-auto">
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  session.score >= 80
                    ? "bg-green-500"
                    : session.score >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${session.score}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {session.score >= 80
                ? "Excellent performance!"
                : session.score >= 60
                ? "Good effort!"
                : "Keep practicing!"}
            </p>
          </div>
        </div>
      </Card>

      {/* Session Summary */}
      {session.feedback && session.feedback.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Session Summary</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {session.feedback
                  .flatMap(f => f.strengths)
                  .slice(0, 5)
                  .map((strength, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                Areas to Improve
              </h3>
              <ul className="space-y-2">
                {session.feedback
                  .flatMap(f => f.improvements)
                  .slice(0, 5)
                  .map((improvement, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-yellow-500 mt-0.5">•</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Question Breakdown */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Question Breakdown</h2>
        <div className="space-y-4">
          {session.questions.map((question, index) => {
            const answerFeedback = session.feedback?.find(f => f.questionId === question.id);
            const answer = session.answers?.find(a => a.questionId === question.id);

            return (
              <div key={question.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Question {index + 1}
                      </span>
                      <Badge variant="secondary">{question.category}</Badge>
                      <Badge variant="secondary">{question.difficulty}</Badge>
                    </div>
                    <p className="text-sm text-foreground">{question.text}</p>
                  </div>
                  {answerFeedback && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">
                        {answerFeedback.score}
                      </div>
                    </div>
                  )}
                </div>

                {answer && (
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-1">Your Answer:</p>
                    <p className="text-sm text-foreground bg-muted p-3 rounded">
                      {answer.transcript}
                    </p>
                  </div>
                )}

                {answerFeedback && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Feedback:</p>
                    <p className="text-sm text-foreground">{answerFeedback.feedback}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Session Stats */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Session Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="text-lg font-semibold text-foreground">
              {Math.floor(session.duration / 60)}m {session.duration % 60}s
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Questions</p>
            <p className="text-lg font-semibold text-foreground">{session.questions.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Difficulty</p>
            <p className="text-lg font-semibold text-foreground">{session.difficulty}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="text-lg font-semibold text-foreground capitalize">{session.status}</p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        <Link href="/interview/setup">
          <Button size="lg">Start New Interview</Button>
        </Link>
        <Link href="/history">
          <Button size="lg" variant="outline">
            View History
          </Button>
        </Link>
      </div>
    </div>
  );
}
