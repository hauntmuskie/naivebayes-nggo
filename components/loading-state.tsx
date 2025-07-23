import { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  variant?: "default" | "minimal" | "fullpage";
  className?: string;
}

export function LoadingState({
  title = "Memuat...",
  description,
  icon,
  variant = "default",
  className,
}: LoadingStateProps) {
  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center justify-center py-8", className)}>
        <div className="flex items-center gap-2 text-muted-foreground">
          <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm">{title}</span>
        </div>
      </div>
    );
  }

  if (variant === "fullpage") {
    return (
      <div
        className={cn("flex items-center justify-center h-[50vh]", className)}
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            {icon || (
              <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
            )}
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium">{title}</p>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="py-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            {icon || (
              <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
