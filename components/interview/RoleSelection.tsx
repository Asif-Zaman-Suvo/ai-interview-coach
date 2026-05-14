import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Role } from "@/lib/types";

interface RoleSelectionProps {
  roles?: Role[];
  selectedRole: Role | null;
  onSelect: (role: Role) => void;
  isLoading?: boolean;
}

export function RoleSelection({ roles = [], selectedRole, onSelect, isLoading }: RoleSelectionProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No roles available. Please check back later.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-base font-semibold text-foreground mb-4">
        Select your target role
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => {
          const isSelected = selectedRole?.id === role.id;

          return (
            <Card
              key={role.id}
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
                <div className="flex items-start gap-3">
                  <span className="text-2xl" aria-hidden="true">
                    {role.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span
                      className={cn(
                        "text-sm font-medium block",
                        isSelected ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {role.name}
                    </span>
                    {role.description && (
                      <span className="text-xs text-muted-foreground block mt-1">
                        {role.description}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
