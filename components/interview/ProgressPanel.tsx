import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";

interface ProgressPanelProps {
  sessionTime: number;
  currentQuestion: number;
  totalQuestions: number;
  answeredCount: number;
}

export function ProgressPanel({
  sessionTime,
  currentQuestion,
  totalQuestions,
  answeredCount,
}: ProgressPanelProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <Card className="p-4 bg-background border-border">
      <div className="space-y-4">
        {/* Timer */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Session Time</span>
          <span className="text-lg font-bold text-primary ml-auto">
            {formatTime(sessionTime)}
          </span>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">
              {currentQuestion + 1} of {totalQuestions}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Answered Count */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Answered</span>
          <span className="text-sm text-muted-foreground">
            {answeredCount} / {totalQuestions}
          </span>
        </div>
      </div>
    </Card>
  );
}
