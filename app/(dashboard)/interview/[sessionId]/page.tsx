"use client";

import {
  useState,
  useEffect,
  useRef,
  useSyncExternalStore,
  useCallback,
} from "react";
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
import { ChevronLeft, MicOff } from "lucide-react";
import {
  useSessionDetail,
  useSubmitAnswer,
  useCompleteSession,
} from "@/lib/hooks/useInterview";
import { AnswerFeedback } from "@/lib/types";

import {
  emptyAnswerDraft,
  updateAnswerDraft,
  canSubmitAnswer,
} from "@/lib/interview-answer-draft";
import type { DraftAction } from "@/lib/interview-answer-draft";

const noopSubscribe = () => () => {};

type SpeechRecognitionResultEvent = {
  resultIndex: number;
  results: {
    length: number;
    [i: number]: { isFinal: boolean; 0: { transcript: string } };
  };
};

type SpeechRecognitionErrorLike = { error: string };

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function readWebSpeechSupported(): boolean {
  if (typeof window === "undefined") return false;
  const win = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return !!(win.SpeechRecognition ?? win.webkitSpeechRecognition);
}

function useWebSpeechSupported() {
  return useSyncExternalStore(
    noopSubscribe,
    readWebSpeechSupported,
    () => true,
  );
}

export default function LiveInterviewPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  // Query hooks
  const {
    data: session,
    isLoading: sessionLoading,
    isError: sessionError,
  } = useSessionDetail(sessionId);
  const { mutate: submitAnswer, isPending: submitting } =
    useSubmitAnswer(sessionId);
  const { mutate: completeSession, isPending: completing } =
    useCompleteSession(sessionId);

  // Local state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [draft, setDraft] = useState(emptyAnswerDraft);
  const draftRef = useRef(emptyAnswerDraft);
  const changeDraft = useCallback((action: DraftAction) => {
    draftRef.current = updateAnswerDraft(draftRef.current, action);
    setDraft(draftRef.current);
  }, []);
  const transcript = draft.text;
  const [sessionTime, setSessionTime] = useState(0);
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [micBlocked, setMicBlocked] = useState(false);
  const browserSupported = useWebSpeechSupported();

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const recordingStartVersionRef = useRef(0);

  /** Reflect OS/browser mic permission when the Permissions API exposes it (Chrome). */
  useEffect(() => {
    if (typeof window === "undefined" || !browserSupported) return;
    let permissionStatus: PermissionStatus | undefined;
    const sync = () => {
      if (permissionStatus) setMicBlocked(permissionStatus.state === "denied");
    };
    void navigator.permissions
      ?.query({ name: "microphone" as PermissionName })
      .then((status) => {
        permissionStatus = status;
        sync();
        permissionStatus.addEventListener("change", sync);
      })
      .catch(() => {});
    return () => {
      permissionStatus?.removeEventListener("change", sync);
    };
  }, [browserSupported]);

  // Every recording uses a new recognizer so stale events keep their old ID.
  useEffect(
    () => () => {
      recordingStartVersionRef.current += 1;
      const recognition = recognitionRef.current;
      recognitionRef.current = null;
      if (recognition) {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        try {
          recognition.stop();
        } catch {
          /* already stopped */
        }
      }
    },
    [],
  );

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const stopRecording = () => {
    // Freeze the draft before stopping so late results cannot overwrite edits.
    recordingStartVersionRef.current += 1;
    setIsRecording(false);
    changeDraft({ type: "stop" });
    try {
      recognitionRef.current?.stop();
    } catch {
      /* already stopped */
    }
  };

  // Handle recording toggle
  const handleToggleRecording = () => {
    if (!browserSupported || submitting || completing || feedback) return;
    if (isRecording) {
      stopRecording();
      return;
    }
    const win = window as Window & {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const Ctor = win.SpeechRecognition ?? win.webkitSpeechRecognition;
    if (!Ctor) return;

    const startVersion = ++recordingStartVersionRef.current;
    void (async () => {
      if (navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          stream.getTracks().forEach((t) => t.stop());
          setMicBlocked(false);
        } catch {
          setMicBlocked(true);
          return;
        }
      }

      if (startVersion !== recordingStartVersionRef.current) return;
      const recognition = new Ctor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      changeDraft({ type: "start" });
      const recordingId = draftRef.current.recordingId;
      recognition.onresult = (event) => {
        let final = "";
        let interim = "";
        // Results are cumulative within this recording; rebuild instead of
        // appending resultIndex deltas that can duplicate earlier words.
        for (let i = 0; i < event.results.length; i++) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) final += ` ${text}`;
          else interim += ` ${text}`;
        }
        changeDraft({ type: "speech", recordingId, final, interim });
      };
      const finish = () => {
        if (recognitionRef.current !== recognition) return;
        setIsRecording(false);
        changeDraft({ type: "stop", recordingId });
      };
      recognition.onend = finish;
      recognition.onerror = (event) => {
        if (recognitionRef.current !== recognition) return;
        if (
          ["not-allowed", "service-not-allowed", "audio-capture"].includes(
            event.error,
          )
        )
          setMicBlocked(true);
        finish();
      };
      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch {
        finish();
        return;
      }
      setIsRecording(true);
    })();
  };

  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (
      !session ||
      !canSubmitAnswer(draftRef.current) ||
      submitting ||
      completing ||
      feedback
    )
      return;
    stopRecording();

    const currentQuestion = session.questions[currentQuestionIndex];

    submitAnswer(
      {
        questionId: currentQuestion.id,
        transcript: draftRef.current.text,
      },
      {
        onSuccess: (data) => {
          setFeedback(data);
          setAnsweredCount((prev) => prev + 1);
        },
        onError: (error) => {
          console.error("Failed to submit answer:", error);
        },
      },
    );
  };

  // Handle next question
  const handleNextQuestion = () => {
    stopRecording();
    if (feedback?.nextQuestion) {
      // Move to next question
      setCurrentQuestionIndex((prev) => prev + 1);
      changeDraft({ type: "reset" });
      setFeedback(null);
    } else {
      // Complete session
      handleCompleteSession();
    }
  };

  // Handle session completion
  const handleCompleteSession = () => {
    stopRecording();
    completeSession(undefined, {
      onSuccess: () => {
        router.push(`/interview/result/${sessionId}`);
      },
      onError: (error) => {
        console.error("Failed to complete session:", error);
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
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="size-4" />
            Exit
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Live Interview
            </h1>
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
            <strong>Browser not supported:</strong> Voice recognition is
            unavailable in this browser. You can type your answer below, or use
            a browser that supports speech recognition.
          </p>
        </div>
      )}

      {browserSupported && micBlocked && (
        <div className="mx-4 mt-4 rounded-lg border border-rose-500/35 bg-rose-500/10 p-4 dark:bg-rose-950/40">
          <div className="flex gap-3">
            <MicOff
              className="size-5 shrink-0 text-rose-600 dark:text-rose-400"
              aria-hidden
            />
            <div className="space-y-2 text-sm text-rose-950 dark:text-rose-50">
              <p className="font-semibold text-rose-900 dark:text-rose-100">
                Microphone blocked for this site
              </p>
              <p className="text-rose-900/90 dark:text-rose-100/90 leading-relaxed">
                The crossed-out mic in your browser&apos;s address bar means
                this tab isn&apos;t allowed to use the microphone.
                Speech-to-text cannot run until you allow access. You can still
                type your answer below.
              </p>
              <ol className="list-decimal list-inside space-y-1 text-rose-900/85 dark:text-rose-100/85">
                <li>
                  Click the <strong>lock or tune icon</strong> left of the URL.
                </li>
                <li>
                  Set <strong>Microphone</strong> to <strong>Allow</strong> (not
                  Block).
                </li>
                <li>
                  <strong>Reload</strong> this page, then tap the mic again.
                </li>
              </ol>
            </div>
          </div>
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
              disabled={
                !browserSupported || submitting || completing || !!feedback
              }
              onToggle={handleToggleRecording}
            />

            <TranscriptArea
              transcript={transcript}
              interimTranscript={draft.interim}
              isListening={draft.listening}
              disabled={submitting || completing || !!feedback}
              onChange={(text) => changeDraft({ type: "edit", text })}
            />

            {feedback && (
              <FeedbackCard
                feedback={feedback.feedback}
                score={feedback.score}
                strengths={feedback.strengths}
                improvements={feedback.improvements}
              />
            )}

            {!feedback && (
              <Button
                onClick={handleSubmitAnswer}
                disabled={submitting || completing || !canSubmitAnswer(draft)}
                className="w-full"
              >
                {submitting ? "Submitting..." : "Submit Answer"}
              </Button>
            )}

            {feedback && (
              <Button
                onClick={handleNextQuestion}
                disabled={completing}
                className="w-full"
              >
                {feedback.nextQuestion ? "Next Question" : "Complete Session"}
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
