import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/lib/types";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  return (
    <Card className="border border-border shadow-none">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Badge variant="secondary" className="text-xs">
            {question.category}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </span>
        </div>
        <h2 className="text-lg font-medium text-foreground leading-relaxed">
          {question.text}
        </h2>
        <div className="mt-4 pt-4 border-t border-border">
          <Badge
            variant="outline"
            className="text-xs"
          >
            {question.difficulty}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
