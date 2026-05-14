import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Role } from "@/lib/types";
import {
  BarChart3,
  Briefcase,
  Code2,
  Layers,
  LineChart,
  Palette,
  Rocket,
  type LucideIcon,
  Smartphone,
  UserCog,
} from "lucide-react";

const LUCIDE_ICONS: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  palette: Palette,
  "paint-brush": Palette,
  code: Code2,
  coding: Code2,
  smartphone: Smartphone,
  mobile: Smartphone,
  rocket: Rocket,
  chart: BarChart3,
  stats: LineChart,
  layers: Layers,
  users: UserCog,
};

function RoleIconGlyph({ icon, className }: { icon?: string; className?: string }) {
  const raw = (icon ?? "").trim();
  if (!raw) {
    return <Briefcase className={cn("size-6 text-primary shrink-0", className)} aria-hidden />;
  }
  const key = raw.toLowerCase();
  const Cmp = LUCIDE_ICONS[key];
  if (Cmp) {
    return <Cmp className={cn("size-6 text-primary shrink-0", className)} aria-hidden />;
  }
  // Emoji / short label from seeds (e.g. 🎨) or fallback
  if (/\p{Extended_Pictographic}/u.test(raw) || raw.length <= 4) {
    return (
      <span className={cn("text-2xl leading-none shrink-0", className)} aria-hidden>
        {raw}
      </span>
    );
  }
  return <Briefcase className={cn("size-6 text-primary shrink-0", className)} aria-hidden />;
}

interface RoleSelectionProps {
  roles?: Role[];
  selectedRole: Role | null;
  onSelect: (role: Role) => void;
  isLoading?: boolean;
}

export function RoleSelection({
  roles = [],
  selectedRole,
  onSelect,
  isLoading,
}: RoleSelectionProps) {
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
    <div className="w-full min-w-0">
      <h2 className="text-base font-semibold text-foreground mb-4">
        Select your target role
      </h2>
      <div
        className={cn(
          "grid w-full min-w-0 gap-4",
          roles.length === 1
            ? "grid-cols-1"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {roles.map((role) => {
          const isSelected = selectedRole?.id === role.id;

          return (
            <Card
              key={role.id}
              className={cn(
                "h-full min-w-0 w-full cursor-pointer border shadow-none transition-all hover:border-primary/50",
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border",
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
              <div className="p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4 min-w-0">
                  <RoleIconGlyph icon={role.icon} className="sm:mt-0.5" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <h3
                      className={cn(
                        "text-base font-medium leading-snug text-pretty text-foreground",
                        isSelected && "text-foreground",
                      )}
                    >
                      {role.name}
                    </h3>
                    {role.description ? (
                      <p className="text-sm leading-relaxed text-pretty text-muted-foreground break-words">
                        {role.description}
                      </p>
                    ) : null}
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
