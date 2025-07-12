import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  action?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({
  title,
  description,
  badge,
  action,
  children,
}: PageHeaderProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
              {title}
            </h1>
            {badge && (
              <Badge
                variant={badge.variant || "default"}
                className="text-xs sm:text-sm w-fit"
              >
                {badge.text}
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
              {description}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      {children && (
        <>
          <Separator />
          {children}
        </>
      )}
    </div>
  );
}
