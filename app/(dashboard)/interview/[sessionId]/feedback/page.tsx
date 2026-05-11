"use client";

import { Button } from "@/components/ui/button";
import { OverallScore } from "@/components/interview/OverallScore";
import { CompetencyRadar } from "@/components/interview/CompetencyRadar";
import { AnswerFeedback } from "@/components/interview/AnswerFeedback";
import { TrendingUp, TrendingDown, Download } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { mockInterviewSession, mockCompetencyScores, mockQuestionFeedback } from "@/lib/mock-data";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function FeedbackPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const overallScore = mockInterviewSession.overallScore || 78;

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Interview Feedback
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Session ID: {sessionId}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
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

      {/* Overall Score and Competency */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <OverallScore score={overallScore} />
        </div>
        <div className="md:col-span-2">
          <CompetencyRadar data={mockCompetencyScores} />
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border border-border rounded-lg p-4 bg-card shadow-none">
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="size-4 text-green-600 dark:text-green-500" />
            Key Strengths
          </h3>
          <ul className="space-y-2">
            <li className="text-sm text-foreground flex items-start gap-2">
              <span className="text-green-600 dark:text-green-500 mt-0.5">•</span>
              Strong technical knowledge demonstrated
            </li>
            <li className="text-sm text-foreground flex items-start gap-2">
              <span className="text-green-600 dark:text-green-500 mt-0.5">•</span>
              Clear communication style
            </li>
            <li className="text-sm text-foreground flex items-start gap-2">
              <span className="text-green-600 dark:text-green-500 mt-0.5">•</span>
              Good problem-solving approach
            </li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card shadow-none">
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <TrendingDown className="size-4 text-amber-600 dark:text-amber-500" />
            Focus Areas
          </h3>
          <ul className="space-y-2">
            <li className="text-sm text-foreground flex items-start gap-2">
              <span className="text-amber-600 dark:text-amber-500 mt-0.5">•</span>
              Deepen system design knowledge
            </li>
            <li className="text-sm text-foreground flex items-start gap-2">
              <span className="text-amber-600 dark:text-amber-500 mt-0.5">•</span>
              Practice articulating trade-offs
            </li>
            <li className="text-sm text-foreground flex items-start gap-2">
              <span className="text-amber-600 dark:text-amber-500 mt-0.5">•</span>
              Add more specific examples
            </li>
          </ul>
        </div>
      </div>

      {/* Question by Question Feedback */}
      <AnswerFeedback feedback={mockQuestionFeedback} />
    </div>
  );
}
