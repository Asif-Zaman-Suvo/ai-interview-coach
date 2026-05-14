"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/interview/QuestionCard";
import { MicButton } from "@/components/interview/MicButton";
import { TranscriptArea } from "@/components/interview/TranscriptArea";
import { FeedbackCard } from "@/components/interview/FeedbackCard";
import { ProgressPanel } from "@/components/interview/ProgressPanel";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { ChevronLeft } from "lucide-react";
import { useSessionDetail, useSubmitAnswer, useCompleteSession } from "@/lib/hooks/useInterview";
import { AnswerFeedback } from "@/lib/types";

export default function LiveInterviewPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  // Query hooks
  const { data: session, isLoading: sessionLoading, isError: sessionError } = useSessionDetail(sessionId);
  const { mutate: submitAnswer, isPending: submitting } = useSubmitAnswer(sessionId);
  const { mutate: completeSession, isPending: completing } = useCompleteSession(sessionId);

  // Local state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [sessionTime, setSessionTime] = useState(0);
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [browserSupported, setBrowserSupported] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setBrowserSupported(false);
        return;
      }

      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          }
        }

        if (final) {
          setTranscript((prev) => prev + final);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        if (isRecording) {
          // Restart if still supposed to be recording
          try {
            recognitionInstance.start();
          } catch (e) {
            // Already started or error
          }
        }
      };

      setRecognition(recognitionInstance);
      recognitionRef.current = recognitionInstance;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Already stopped
        }
      }
    };
  }, []);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle recording toggle
  const handleToggleRecording = () => {
    if (!recognition || !browserSupported) return;

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (!session || !transcript.trim()) return;

    const currentQuestion = session.questions[currentQuestionIndex];

    submitAnswer(
      {
        questionId: currentQuestion.id,
        transcript: transcript,
      },
      {
        onSuccess: (data) => {
          setFeedback(data);
          setAnsweredCount((prev) => prev + 1);
        },
        onError: (error) => {
          console.error('Failed to submit answer:', error);
        },
      }
    );
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (feedback?.nextQuestion) {
      // Move to next question
      setCurrentQuestionIndex((prev) => prev + 1);
      setTranscript("");
      setFeedback(null);
      setIsRecording(false);
    } else {
      // Complete session
      handleCompleteSession();
    }
  };

  // Handle session completion
  const handleCompleteSession = () => {
    completeSession(undefined, {
      onSuccess: () => {
        router.push(`/interview/result/${sessionId}`);
      },
      onError: (error) => {
        console.error('Failed to complete session:', error);
      },
    });
  };

  // Loading state
  if (sessionLoading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[50dvh]">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (sessionError || !session) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[50dvh]">
        <ErrorMessage message="Failed to load interview session" />
      </div>
    );
  }

  const currentQuestion = session.questions[currentQuestionIndex];

  return (
    <div className="flex flex-1 flex-col min-h-0 w-full">
      {/* Header */}
      <div className="shrink-0 border-b border-border py-4 -mx-6 px-6 md:-mx-8 md:px-8">
        <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ChevronLeft className="size-4" />
            Exit
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Live Interview</h1>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {session.questions.length}
            </p>
          </div>
        </div>
      </div>

      {/* Browser compatibility warning */}
      {!browserSupported && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 m-4 rounded-lg">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            <strong>Browser not supported:</strong> Voice recognition only works in Chrome-based browsers.
            Please switch to Chrome for the best experience.
          </p>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto min-h-0 py-6 px-0 -mx-6 md:-mx-8">
        <div className="max-w-6xl mx-auto w-full px-6 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Question card */}
          <div className="lg:col-span-1">
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={session.questions.length}
            />
          </div>

          {/* Center: Recording and feedback */}
          <div className="lg:col-span-1 space-y-4">
            <MicButton
              isRecording={isRecording}
              disabled={!browserSupported || !!feedback}
              onToggle={handleToggleRecording}
            />

            <TranscriptArea
              transcript={transcript}
              isListening={isRecording}
            />

            {feedback && (
              <FeedbackCard
                feedback={feedback.feedback}
                score={feedback.score}
                strengths={feedback.strengths}
                improvements={feedback.improvements}
              />
            )}

            {!feedback && transcript.trim() && (
              <Button
                onClick={handleSubmitAnswer}
                disabled={submitting}
                className="w-full"
              >
                {submitting ? 'Submitting...' : 'Submit Answer'}
              </Button>
            )}

            {feedback && (
              <Button
                onClick={handleNextQuestion}
                disabled={completing}
                className="w-full"
              >
                {feedback.nextQuestion ? 'Next Question' : 'Complete Session'}
              </Button>
            )}
          </div>

          {/* Right: Progress panel */}
          <div className="lg:col-span-1">
            <ProgressPanel
              sessionTime={sessionTime}
              currentQuestion={currentQuestionIndex}
              totalQuestions={session.questions.length}
              answeredCount={answeredCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
