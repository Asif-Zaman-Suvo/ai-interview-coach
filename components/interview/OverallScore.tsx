import { Card } from "@/components/ui/card";

interface OverallScoreProps {
  score: number;
}

export function OverallScore({ score }: OverallScoreProps) {
  const getScoreLabel = (score: number): string => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    if (score >= 70) return "Satisfactory";
    if (score >= 60) return "Needs Improvement";
    return "Keep Practicing";
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600 dark:text-green-500";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-500";
    return "text-red-600 dark:text-red-500";
  };

  return (
    <Card className="border border-border shadow-none">
      <div className="p-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
        <div className={`text-5xl font-bold ${getScoreColor(score)} mb-2`}>
          {score}
        </div>
        <p className="text-lg font-semibold text-foreground">
          {getScoreLabel(score)}
        </p>
        <p className="text-sm text-muted-foreground mt-2">out of 100</p>
      </div>
    </Card>
  );
}
