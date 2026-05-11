import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Difficulty } from "@/lib/types";

interface DifficultySelectionProps {
  selectedDifficulty: Difficulty | null;
  onSelect: (difficulty: Difficulty) => void;
}

const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];

const difficultyInfo: Record<
  Difficulty,
  { label: string; description: string; color: string }
> = {
  Easy: {
    label: "Easy",
    description: "Foundation questions to build confidence",
    color: "text-green-600 dark:text-green-500",
  },
  Medium: {
    label: "Medium",
    description: "Standard interview-level questions",
    color: "text-yellow-600 dark:text-yellow-500",
  },
  Hard: {
    label: "Hard",
    description: "Advanced questions for senior roles",
    color: "text-red-600 dark:text-red-500",
  },
};

export function DifficultySelection({
  selectedDifficulty,
  onSelect,
}: DifficultySelectionProps) {
  return (
    <div>
      <h2 className="text-base font-semibold text-foreground mb-4">
        Select difficulty level
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {difficulties.map((difficulty) => {
          const info = difficultyInfo[difficulty];
          const isSelected = selectedDifficulty === difficulty;

          return (
            <Card
              key={difficulty}
              className={cn(
                "border cursor-pointer transition-all hover:border-primary/50 shadow-none",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border"
              )}
              onClick={() => onSelect(difficulty)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(difficulty);
                }
              }}
              tabIndex={0}
              role="button"
              aria-pressed={isSelected}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3
                    className={cn(
                      "text-sm font-semibold",
                      isSelected ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {info.label}
                  </h3>
                  {isSelected && (
                    <svg
                      className="size-5 text-primary shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {info.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
