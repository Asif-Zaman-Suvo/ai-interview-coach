"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/interview/QuestionCard";
import { MicButton } from "@/components/interview/MicButton";
import { TranscriptArea } from "@/components/interview/TranscriptArea";
import { SessionInfo } from "@/components/interview/SessionInfo";
import { mockQuestions } from "@/lib/mock-data";
import { ChevronLeft } from "lucide-react";

export default function LiveInterviewPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [hasAnswer, setHasAnswer] = useState(false);

  const currentQuestion = mockQuestions[currentQuestionIndex];

  const handleToggleRecording = () => {
    setIsRecording((prev) => !prev);
    // Mock transcript generation
    if (!isRecording) {
      setTimeout(() => {
        setTranscript(
          "This is a sample answer that demonstrates my understanding of the topic. I believe the key aspects to consider are..."
        );
        setHasAnswer(true);
      }, 1500);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTranscript("");
      setHasAnswer(false);
      setIsRecording(false);
    } else {
      router.push(`/interview/${sessionId}/feedback`);
    }
  };

  const handleEnd = () => {
    router.push(`/interview/${sessionId}/feedback`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ChevronLeft className="size-4" />
          Exit
        </Button>
        <h1 className="text-xl font-semibold text-foreground">
          Interview Session
        </h1>
        <Button variant="outline" size="sm" onClick={handleEnd}>
          End Session
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Question Card */}
        <div className="lg:col-span-1">
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={mockQuestions.length}
          />
        </div>

        {/* Center Column - Mic and Transcript */}
        <div className="lg:col-span-1 flex flex-col items-center gap-6">
          <MicButton
            isRecording={isRecording}
            onToggle={handleToggleRecording}
          />
          <TranscriptArea
            transcript={transcript}
            isListening={isRecording}
          />
          <div className="w-full">
            <Button
              className="w-full"
              onClick={handleNextQuestion}
              disabled={!hasAnswer}
            >
              {currentQuestionIndex < mockQuestions.length - 1
                ? "Next Question"
                : "Finish Interview"}
            </Button>
          </div>
        </div>

        {/* Right Column - Session Info */}
        <div className="lg:col-span-1">
          <SessionInfo
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={mockQuestions.length}
            answeredQuestions={answeredQuestions}
          />
        </div>
      </div>

      {/* Live region for screen readers */}
      <div aria-live="polite" className="sr-only">
        {isRecording && "Recording in progress"}
        {hasAnswer && "Answer received"}
      </div>
    </div>
  );
}
