import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?:
    | ReactNode
    | {
        src: string;
        alt: string;
        width?: number;
        height?: number;
      };
  action?: {
    label: string;
    href: string;
    variant?: "default" | "outline" | "secondary";
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={`border border-border/40 ${className}`}>
      <CardContent className="py-12 text-center">
        <div className="space-y-6">
          {icon && (
            <div className="flex justify-center text-muted-foreground opacity-50">
              <div className="h-12 w-12">
                {typeof icon === "object" && "src" in icon ? (
                  <Image
                    src={icon.src}
                    alt={icon.alt}
                    width={icon.width || 48}
                    height={icon.height || 48}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  icon
                )}
              </div>
            </div>
          )}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{title}</h3>
            {description && (
              <p className="text-muted-foreground max-w-md mx-auto">
                {description}
              </p>
            )}
          </div>
          {action && (
            <Link
              href={action.href}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${
                action.variant === "outline"
                  ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                  : action.variant === "secondary"
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {action.label}
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
