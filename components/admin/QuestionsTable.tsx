"use client";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Plus, Pencil } from "lucide-react";
import { QuestionBankItem } from "@/lib/types";
import { useState } from "react";
import { useRoles } from "@/lib/hooks/useInterview";

interface QuestionsTableProps {
  questions?: QuestionBankItem[];
  isLoading?: boolean;
  isError?: boolean;
  onAdd?: (question: {
    roleId: string;
    text: string;
    idealAnswer: string;
    type: "technical" | "behavioral";
    difficulty: "Easy" | "Medium" | "Hard";
  }) => void;
  onDelete?: (questionId: string) => void;
  onUpdate?: (
    questionId: string,
    body: {
      text?: string;
      idealAnswer?: string;
      type?: "technical" | "behavioral";
      difficulty?: "Easy" | "Medium" | "Hard";
    },
  ) => void;
}

export function QuestionsTable({
  questions,
  isLoading,
  isError,
  onAdd,
  onDelete,
  onUpdate,
}: QuestionsTableProps) {
  const { data: roles, isLoading: rolesLoading, isError: rolesError } =
    useRoles();
  const [isAdding, setIsAdding] = useState(false);
  const [newQuestion, setNewQuestion] = useState<{
    text: string;
    type: "technical" | "behavioral";
    difficulty: "Easy" | "Medium" | "Hard";
    roleId: string;
    idealAnswer: string;
  }>({
    text: "",
    type: "technical",
    difficulty: "Medium",
    roleId: "",
    idealAnswer: "",
  });

  const [editing, setEditing] = useState<QuestionBankItem | null>(null);
  const [draft, setDraft] = useState({
    text: "",
    idealAnswer: "",
    type: "technical" as "technical" | "behavioral",
    difficulty: "Medium" as "Easy" | "Medium" | "Hard",
  });

  if (isLoading || rolesLoading) return <LoadingSpinner />;
  if (isError || rolesError)
    return <ErrorMessage message="Failed to load data" />;
  if (!roles?.length) {
    return (
      <p className="text-sm text-muted-foreground py-6">
        Create at least one job role under <strong>Job roles</strong> before adding
        bank questions.
      </p>
    );
  }

  const handleSubmitAdd = () => {
    const rid =
      newQuestion.roleId || (roles?.[0] ? String(roles[0].id) : "");
    if (newQuestion.text.trim() && newQuestion.idealAnswer.trim() && rid) {
      onAdd?.({
        roleId: rid,
        text: newQuestion.text.trim(),
        idealAnswer: newQuestion.idealAnswer.trim(),
        type: newQuestion.type,
        difficulty: newQuestion.difficulty,
      });
      setNewQuestion({
        text: "",
        type: "technical",
        difficulty: "Medium",
        roleId: String(roles[0].id),
        idealAnswer: "",
      });
      setIsAdding(false);
    }
  };

  const openEdit = (q: QuestionBankItem) => {
    setEditing(q);
    setDraft({
      text: q.text,
      idealAnswer: q.idealAnswer,
      type: q.type,
      difficulty: q.difficulty,
    });
  };

  const saveEdit = () => {
    if (!editing) return;
    onUpdate?.(editing.id, {
      text: draft.text,
      idealAnswer: draft.idealAnswer,
      type: draft.type,
      difficulty: draft.difficulty,
    });
    setEditing(null);
  };

  const roleOpts = roles.map((r) => (
    <option key={r.id} value={String(r.id)}>
      {r.name}
    </option>
  ));

  return (
    <div className="space-y-4">
      {isAdding && (
        <div className="p-4 border border-border rounded-lg bg-muted/50 space-y-3">
          <h3 className="text-sm font-medium text-foreground">Add bank question</h3>
          <input
            type="text"
            placeholder="Question text"
            value={newQuestion.text}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, text: e.target.value })
            }
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          />
          <textarea
            placeholder="Ideal / model answer (required)"
            value={newQuestion.idealAnswer}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, idealAnswer: e.target.value })
            }
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground min-h-[80px]"
          />
          <div className="flex flex-wrap gap-2">
            <select
              value={newQuestion.roleId || String(roles[0].id)}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, roleId: e.target.value })
              }
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              {roleOpts}
            </select>
            <select
              value={newQuestion.type}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  type: e.target.value as "technical" | "behavioral",
                })
              }
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="technical">Technical</option>
              <option value="behavioral">Behavioral</option>
            </select>
            <select
              value={newQuestion.difficulty}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  difficulty: e.target.value as typeof newQuestion.difficulty,
                })
              }
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button size="sm" type="button" onClick={handleSubmitAdd}>
              Add Question
            </Button>
            <Button
              size="sm"
              type="button"
              variant="ghost"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {!isAdding && onAdd && (
        <Button
          size="sm"
          type="button"
          onClick={() => {
            setIsAdding(true);
            const firstId = roles[0]?.id;
            setNewQuestion((prev) =>
              prev.roleId
                ? prev
                : { ...prev, roleId: String(firstId ?? "") },
            );
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Question
        </Button>
      )}

      {!questions || questions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No bank questions yet. Add questions for each role and difficulty so
          interviews can start.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-foreground">
                  Question
                </th>
                <th className="text-left p-4 text-sm font-medium text-foreground">
                  Category
                </th>
                <th className="text-left p-4 text-sm font-medium text-foreground">
                  Difficulty
                </th>
                <th className="text-left p-4 text-sm font-medium text-foreground">
                  Role
                </th>
                <th className="text-right p-4 text-sm font-medium text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr
                  key={question.id}
                  className="border-b border-border hover:bg-muted/50"
                >
                  <td className="p-4 text-sm text-foreground max-w-md">
                    {question.text}
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary">{question.type}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary">{question.difficulty}</Badge>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {question.role}
                  </td>
                  <td className="p-4 text-right space-x-1">
                    {onUpdate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        className="h-8 w-8 p-0"
                        onClick={() => openEdit(question)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
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

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit question & ideal answer</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <textarea
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground min-h-[72px] text-sm"
              value={draft.text}
              onChange={(e) => setDraft({ ...draft, text: e.target.value })}
            />
            <textarea
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground min-h-[120px] text-sm"
              placeholder="Ideal answer"
              value={draft.idealAnswer}
              onChange={(e) =>
                setDraft({ ...draft, idealAnswer: e.target.value })
              }
            />
            <div className="flex gap-2">
              <select
                value={draft.type}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    type: e.target.value as typeof draft.type,
                  })
                }
                className="px-3 py-2 border border-border rounded-md bg-background text-sm"
              >
                <option value="technical">Technical</option>
                <option value="behavioral">Behavioral</option>
              </select>
              <select
                value={draft.difficulty}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    difficulty: e.target.value as typeof draft.difficulty,
                  })
                }
                className="px-3 py-2 border border-border rounded-md bg-background text-sm"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" type="button" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={saveEdit}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
