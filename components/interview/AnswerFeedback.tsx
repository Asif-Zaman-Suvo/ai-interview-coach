import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { QuestionFeedback } from "@/lib/types";

interface AnswerFeedbackProps {
  feedback: QuestionFeedback[];
}

export function AnswerFeedback({ feedback }: AnswerFeedbackProps) {
  const getScoreVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <Card className="border border-border shadow-none">
      <div className="p-6">
        <h2 className="text-base font-semibold text-foreground mb-4">
          Question-by-Question Feedback
        </h2>
        <Accordion multiple className="space-y-4">
          {feedback.map((item, index) => (
            <AccordionItem
              key={item.questionId}
              value={`item-${index}`}
              className="border border-border rounded-lg px-4"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left flex-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    Q{index + 1}
                  </span>
                  <span className="text-sm text-foreground flex-1 line-clamp-1">
                    {item.question}
                  </span>
                  <Badge variant={getScoreVariant(item.score)} className="shrink-0">
                    {item.score}%
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-2 space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Your Answer:
                  </p>
                  <p className="text-sm text-foreground leading-relaxed bg-muted/50 p-3 rounded-md">
                    {item.transcript}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Feedback:
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {item.feedback}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium text-green-600 dark:text-green-500 mb-2 flex items-center gap-1">
                      <CheckCircle2 className="size-3" />
                      Strengths
                    </p>
                    <ul className="space-y-1">
                      {item.strengths.map((strength, i) => (
                        <li
                          key={i}
                          className="text-xs text-foreground flex items-start gap-2"
                        >
                          <span className="text-green-600 dark:text-green-500 mt-0.5">
                            •
                          </span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-amber-600 dark:text-amber-500 mb-2 flex items-center gap-1">
                      <AlertCircle className="size-3" />
                      Areas to Improve
                    </p>
                    <ul className="space-y-1">
                      {item.improvements.map((improvement, i) => (
                        <li
                          key={i}
                          className="text-xs text-foreground flex items-start gap-2"
                        >
                          <span className="text-amber-600 dark:text-amber-500 mt-0.5">
                            •
                          </span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Card>
  );
}
