import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { JobRole } from "@/lib/types";

interface RoleSelectionProps {
  selectedRole: JobRole | null;
  onSelect: (role: JobRole) => void;
}

const roles: JobRole[] = [
  "Frontend Developer",
  "Backend Developer",
  "Product Manager",
  "Data Scientist",
  "DevOps Engineer",
];

const roleIcons: Record<JobRole, string> = {
  "Frontend Developer": "⚛️",
  "Backend Developer": "🔧",
  "Product Manager": "📋",
  "Data Scientist": "📊",
  "DevOps Engineer": "🚀",
};

export function RoleSelection({ selectedRole, onSelect }: RoleSelectionProps) {
  return (
    <div>
      <h2 className="text-base font-semibold text-foreground mb-4">
        Select your target role
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => {
          const isSelected = selectedRole === role;

          return (
            <Card
              key={role}
              className={cn(
                "border cursor-pointer transition-all hover:border-primary/50 shadow-none",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border"
              )}
              onClick={() => onSelect(role)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(role);
                }
              }}
              tabIndex={0}
              role="button"
              aria-pressed={isSelected}
            >
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">
                    {roleIcons[role]}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isSelected ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {role}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
