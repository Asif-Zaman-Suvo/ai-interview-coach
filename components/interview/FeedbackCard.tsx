import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";

interface FeedbackCardProps {
  feedback?: string;
  score?: number;
  strengths?: string[];
  improvements?: string[];
}

export function FeedbackCard({ feedback, score, strengths, improvements }: FeedbackCardProps) {
  if (!feedback) return null;

  return (
    <Card className="p-6 bg-background border-border">
      <div className="space-y-4">
        {/* Score */}
        {score !== undefined && (
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Your Score</h3>
            <div className="text-3xl font-bold text-primary">{score}/100</div>
          </div>
        )}

        {/* Feedback */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">Feedback</h4>
          <p className="text-sm text-muted-foreground">{feedback}</p>
        </div>

        {/* Strengths */}
        {strengths && strengths.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Strengths
            </h4>
            <ul className="space-y-1">
              {strengths.map((strength, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvements */}
        {improvements && improvements.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              Areas to Improve
            </h4>
            <ul className="space-y-1">
              {improvements.map((improvement, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
