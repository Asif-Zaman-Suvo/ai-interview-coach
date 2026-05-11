import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}

export default function StatsCard({
  label,
  value,
  trend,
  trendUp,
}: StatsCardProps) {
  return (
    <Card className="border border-border bg-card shadow-none rounded-lg">
      <CardContent className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
          {label}
        </p>
        <p className="text-2xl font-semibold text-foreground leading-none">
          {value}
        </p>
        {trend && (
          <p
            className={cn(
              "text-xs mt-2",
              trendUp
                ? "text-green-600 dark:text-green-400"
                : "text-muted-foreground"
            )}
          >
            {trendUp ? "↑" : ""} {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
