import { Card } from "@/components/ui/card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface RoleBreakdownData {
  role: string;
  count: number;
  avgScore: number;
}

interface RoleBreakdownProps {
  data: RoleBreakdownData[];
}

export function RoleBreakdown({ data }: RoleBreakdownProps) {
  if (data.length === 0) {
    return (
      <Card className="border border-border shadow-none">
        <CardHeader>
          <CardTitle>Role Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Complete at least one session to see performance by role.
          </p>
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <Card className="border border-border shadow-none">
      <CardHeader>
        <CardTitle>Role Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.role} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{item.role}</span>
                <span className="text-muted-foreground">
                  {item.count} session{item.count !== 1 ? "s" : ""} · avg {item.avgScore}%
                </span>
              </div>
              <Progress
                value={(item.count / maxCount) * 100}
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
