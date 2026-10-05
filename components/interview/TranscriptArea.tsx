import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Volume2 } from "lucide-react";
import { ANSWER_MAX_LENGTH } from "@/lib/interview-answer-draft";

interface TranscriptAreaProps {
  transcript: string;
  interimTranscript?: string;
  isListening: boolean;
  disabled?: boolean;
  onChange: (text: string) => void;
}
export function TranscriptArea({
  transcript,
  interimTranscript = "",
  isListening,
  disabled = false,
  onChange,
}: TranscriptAreaProps) {
  const overLimit = transcript.length > ANSWER_MAX_LENGTH;
  return (
    <Card className="border border-border shadow-none">
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Volume2 className="size-4 text-muted-foreground" />
          <label htmlFor="answer-transcript" className="text-sm font-medium">
            Your answer
          </label>
          <span className="ml-auto text-xs text-muted-foreground" role="status">
            {isListening ? "Listening…" : "Microphone stopped"}
          </span>
        </div>
        <Textarea
          id="answer-transcript"
          value={transcript}
          onChange={(event) => onChange(event.target.value)}
          readOnly={isListening || disabled}
          maxLength={ANSWER_MAX_LENGTH}
          aria-invalid={overLimit}
          aria-describedby="answer-help answer-count"
          placeholder="Type your answer here, or use the microphone."
          className="min-h-[160px] max-h-[320px] overflow-y-auto"
        />
        {isListening && interimTranscript && (
          <div
            className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground"
            aria-live="polite"
          >
            <p className="text-xs font-medium mb-1">
              Live speech (provisional)
            </p>
            <p>{interimTranscript}</p>
          </div>
        )}
        <p id="answer-help" className="text-xs text-muted-foreground">
          {isListening
            ? "Stop the microphone to review and edit your answer."
            : "Review and correct your answer before submitting. Recording again appends new speech."}
        </p>
        <p
          id="answer-count"
          className={
            overLimit
              ? "text-xs text-destructive"
              : "text-xs text-muted-foreground"
          }
        >
          {transcript.length.toLocaleString()}/
          {ANSWER_MAX_LENGTH.toLocaleString()} characters
          {overLimit && " — shorten your answer before submitting."}
        </p>
      </div>
    </Card>
  );
}
