"use client";

import { Card } from "@/components/ui/card";
import { QuestionsTable } from "@/components/admin/QuestionsTable";
import { useAdminQuestions, useAddQuestion, useDeleteQuestion } from "@/lib/hooks/useAdmin";

export default function AdminQuestionsPage() {
  const { data: questions, isLoading, isError } = useAdminQuestions();
  const { mutate: addQuestion } = useAddQuestion();
  const { mutate: deleteQuestion } = useDeleteQuestion();

  const handleAddQuestion = (question: Omit<any, 'id' | 'createdAt'>) => {
    addQuestion(question, {
      onSuccess: () => {
        console.log('Question added successfully');
      },
      onError: (error) => {
        console.error('Failed to add question:', error);
      },
    });
  };

  const handleDeleteQuestion = (questionId: string) => {
    deleteQuestion(questionId, {
      onSuccess: () => {
        console.log('Question deleted successfully');
      },
      onError: (error) => {
        console.error('Failed to delete question:', error);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Question Bank</h1>
        <p className="text-sm text-muted-foreground">
          Manage interview questions and content
        </p>
      </div>

      <Card className="p-6">
        <QuestionsTable
          questions={questions}
          isLoading={isLoading}
          isError={isError}
          onAdd={handleAddQuestion}
          onDelete={handleDeleteQuestion}
        />
      </Card>
    </div>
  );
}
