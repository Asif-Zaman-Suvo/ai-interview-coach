"use client";

import { Card } from "@/components/ui/card";
import { QuestionsTable } from "@/components/admin/QuestionsTable";
import {
  useAdminQuestions,
  useAddQuestion,
  useDeleteQuestion,
  useUpdateQuestion,
} from "@/lib/hooks/useAdmin";

export default function AdminQuestionsPage() {
  const { data: questions, isLoading, isError } = useAdminQuestions();
  const { mutate: addQuestion } = useAddQuestion();
  const { mutate: deleteQuestion } = useDeleteQuestion();
  const { mutate: updateQuestion } = useUpdateQuestion();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Question bank</h1>
        <p className="text-sm text-muted-foreground">
          Add technical or behavioral prompts with ideal answers — interviews draw from
          this pool by role and difficulty.
        </p>
      </div>

      <Card className="p-6">
        <QuestionsTable
          questions={questions}
          isLoading={isLoading}
          isError={isError}
          onAdd={(q) =>
            void addQuestion(q, {
              onError: console.error,
            })
          }
          onDelete={(id) =>
            void deleteQuestion(id, {
              onError: console.error,
            })
          }
          onUpdate={(id, body) =>
            void updateQuestion(
              { id, body },
              { onError: console.error },
            )
          }
        />
      </Card>
    </div>
  );
}
