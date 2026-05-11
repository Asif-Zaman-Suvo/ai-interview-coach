import { Card } from "@/components/ui/card";
import { Clock, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

interface SessionInfoProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number;
}

export function SessionInfo({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
}: SessionInfoProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="border border-border shadow-none">
      <div className="p-4 space-y-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Clock className="size-4" />
            <span>Session Time</span>
          </div>
          <p className="text-xl font-semibold text-foreground">
            {formatTime(elapsed)}
          </p>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <CheckCircle2 className="size-4" />
            <span>Progress</span>
          </div>
          <p className="text-2xl font-semibold text-foreground mb-1">
            {currentQuestion}
            <span className="text-base text-muted-foreground font-normal">
              /{totalQuestions}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            {answeredQuestions} answered
          </p>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="space-y-2">
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full ${
                  i < currentQuestion
                    ? "bg-primary"
                    : i === currentQuestion - 1
                      ? "bg-primary/50"
                      : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
