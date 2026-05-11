import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Check } from "lucide-react";
import { JobRole, Difficulty } from "@/lib/types";

interface InterviewSummaryProps {
  role: JobRole;
  difficulty: Difficulty;
  resumeFile: File | null;
}

export function InterviewSummary({
  role,
  difficulty,
  resumeFile,
}: InterviewSummaryProps) {
  return (
    <div>
      <h2 className="text-base font-semibold text-foreground mb-4">
        Ready to start your interview
      </h2>

      <Card className="border border-border shadow-none">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <span className="text-sm text-muted-foreground">Role</span>
            <span className="text-sm font-medium text-foreground">{role}</span>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-border">
            <span className="text-sm text-muted-foreground">Difficulty</span>
            <Badge variant="secondary">{difficulty}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Resume</span>
            {resumeFile ? (
              <div className="flex items-center gap-2">
                <Check className="size-4 text-green-600 dark:text-green-500" />
                <span className="text-sm text-foreground">{resumeFile.name}</span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">Not uploaded</span>
            )}
          </div>
        </div>
      </Card>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
        <p className="text-sm text-foreground">
          <strong>What to expect:</strong> You'll answer 5 questions tailored
          to your role and difficulty level. Take your time, and speak clearly
          into your microphone.
        </p>
      </div>
    </div>
  );
}
