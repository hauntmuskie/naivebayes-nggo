import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercentage(
  value: number | undefined | null,
  defaultValue: string = "0.0"
): string {
  if (value === undefined || value === null || isNaN(value)) {
    return defaultValue;
  }
  return (value * 100).toFixed(1);
}

export function hasActualClasses(
  results: Array<{ actualClass?: string | null }>
) {
  return results.some(
    (r) => r.actualClass !== undefined && r.actualClass !== null
  );
}

export function formatConfidence(confidence: number): string {
  return `${(confidence * 100).toFixed(2)}%`;
}
