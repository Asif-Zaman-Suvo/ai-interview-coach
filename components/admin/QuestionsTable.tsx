"use client";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from "lucide-react";
import { QuestionBankItem } from "@/lib/types";
import { useState } from "react";

interface QuestionsTableProps {
  questions?: QuestionBankItem[];
  isLoading?: boolean;
  isError?: boolean;
  onAdd?: (question: Omit<QuestionBankItem, 'id' | 'createdAt'>) => void;
  onDelete?: (questionId: string) => void;
}

export function QuestionsTable({
  questions,
  isLoading,
  isError,
  onAdd,
  onDelete,
}: QuestionsTableProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newQuestion, setNewQuestion] = useState<{
    text: string;
    type: 'technical' | 'behavioral';
    difficulty: 'Easy' | 'Medium' | 'Hard';
    role: string;
    idealAnswer: string;
  }>({
    text: '',
    type: 'technical',
    difficulty: 'Medium',
    role: 'Frontend Developer',
    idealAnswer: '',
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message="Failed to load questions" />;

  const handleSubmitAdd = () => {
    if (newQuestion.text.trim()) {
      onAdd?.(newQuestion);
      setNewQuestion({
        text: '',
        type: 'technical',
        difficulty: 'Medium',
        role: 'Frontend Developer',
        idealAnswer: '',
      } as typeof newQuestion);
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Question Form */}
      {isAdding && (
        <div className="p-4 border border-border rounded-lg bg-muted/50 space-y-3">
          <h3 className="text-sm font-medium text-foreground">Add New Question</h3>
          <input
            type="text"
            placeholder="Question text"
            value={newQuestion.text}
            onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          />
          <div className="flex gap-2">
            <select
              value={newQuestion.type}
              onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as 'technical' | 'behavioral' })}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="technical">Technical</option>
              <option value="behavioral">Behavioral</option>
            </select>
            <select
              value={newQuestion.difficulty}
              onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <select
              value={newQuestion.role}
              onChange={(e) => setNewQuestion({ ...newQuestion, role: e.target.value })}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
            </select>
          </div>
          <textarea
            placeholder="Ideal answer (optional)"
            value={newQuestion.idealAnswer}
            onChange={(e) => setNewQuestion({ ...newQuestion, idealAnswer: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground min-h-[60px]"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSubmitAdd}>
              Add Question
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Add Button */}
      {!isAdding && onAdd && (
        <Button size="sm" onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Question
        </Button>
      )}

      {/* Questions Table */}
      {!questions || questions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No questions found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-foreground">Question</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Type</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Difficulty</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Role</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question.id} className="border-b border-border hover:bg-muted/50">
                  <td className="p-4 text-sm text-foreground max-w-md">{question.text}</td>
                  <td className="p-4">
                    <Badge variant="secondary">
                      {question.type}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary">
                      {question.difficulty}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{question.role}</td>
                  <td className="p-4">
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(question.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
