"use client";

import { Button } from "@/components/ui/button";
import { OverallScore } from "@/components/interview/OverallScore";
import { CompetencyRadar } from "@/components/interview/CompetencyRadar";
import { AnswerFeedback } from "@/components/interview/AnswerFeedback";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { TrendingDown, TrendingUp, Download } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSessionById } from "@/lib/hooks/useHistory";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CompetencyScore, Session } from "@/lib/types";

function buildCompetencies(session: Session): CompetencyScore[] {
  const fb = session.feedback ?? [];
  const base = Math.min(100, Math.max(0, session.score));
  if (!fb.length) {
    return [
      { name: "Technical", score: base },
      { name: "Behavioral", score: base },
      { name: "Communication", score: base },
    ];
  }

  const tech: number[] = [];
  const beh: number[] = [];
  for (const row of fb) {
    const q = session.questions.find((qq) => qq.id === row.questionId);
    const cat = q?.category ?? "Technical";
    if (cat === "Behavioral") beh.push(row.score);
    else tech.push(row.score);
  }

  const avg = (nums: number[]) =>
    nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : base;

  return [
    { name: "Technical", score: avg(tech) },
    { name: "Behavioral", score: avg(beh) },
    {
      name: "Communication",
      score: Math.round((avg(tech) + avg(beh)) / 2 || base),
    },
  ];
}

export default function FeedbackPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const { data: session, isLoading, isError } = useSessionById(sessionId);

  if (isLoading) {
    return (
      <div className="flex min-h-[40dvh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !session) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <ErrorMessage message="Failed to load interview feedback" />
      </div>
    );
  }

  const strengths = [...new Set(session.feedback?.flatMap((f) => f.strengths) ?? [])].slice(
    0,
    8,
  );
  const improvements = [...new Set(session.feedback?.flatMap((f) => f.improvements) ?? [])].slice(
    0,
    8,
  );

  const overallScore = Math.min(
    100,
    Math.max(0, session.score || 0),
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Interview Feedback
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {session.role} • {session.difficulty}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" disabled>
            <Download className="size-4" />
            Download Report
          </Button>
          <Link
            href="/interview/setup"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Practice Again
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <OverallScore score={overallScore} />
        </div>
        <div className="md:col-span-2">
          <CompetencyRadar data={buildCompetencies(session)} />
        </div>
      </div>

      {(session.summary || (session.topImprovements?.length ?? 0) > 0) && (
        <div className="rounded-lg border border-border bg-card p-4 shadow-none">
          {session.summary && (
            <>
              <h2 className="text-sm font-medium text-foreground mb-2">Summary</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {session.summary}
              </p>
            </>
          )}
          {(session.topImprovements?.length ?? 0) > 0 && (
            <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-1">
              {session.topImprovements!.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-4 bg-card shadow-none">
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="size-4 text-green-600 dark:text-green-500" />
            Key Strengths
          </h3>
          {strengths.length ? (
            <ul className="space-y-2">
              {strengths.map((s, i) => (
                <li
                  key={i}
                  className="text-sm text-foreground flex items-start gap-2"
                >
                  <span className="text-green-600 dark:text-green-500 mt-0.5">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Strengths appear after you complete answers for this session.
            </p>
          )}
        </div>

        <div className="rounded-lg border border-border p-4 bg-card shadow-none">
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <TrendingDown className="size-4 text-amber-600 dark:text-amber-500" />
            Focus Areas
          </h3>
          {improvements.length ? (
            <ul className="space-y-2">
              {improvements.map((s, i) => (
                <li
                  key={i}
                  className="text-sm text-foreground flex items-start gap-2"
                >
                  <span className="text-amber-600 dark:text-amber-500 mt-0.5">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Improvement ideas appear once feedback is recorded.
            </p>
          )}
        </div>
      </div>

      {session.feedback && session.feedback.length > 0 ? (
        <AnswerFeedback feedback={session.feedback} />
      ) : (
        <p className="text-sm text-muted-foreground">
          No question-level feedback loaded for this session yet.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href={`/interview/result/${session.id}`}>
          <Button variant="outline">Overall results</Button>
        </Link>
        <Link href="/history">
          <Button variant="ghost">History</Button>
        </Link>
      </div>
    </div>
  );
}
