"use client";

import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface PrintButtonProps {
  targetRef: React.RefObject<HTMLElement | null>;
  buttonText?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function PrintButton({
  targetRef,
  buttonText = "Print",
  variant = "outline",
  size = "default",
  className = "",
}: PrintButtonProps) {
  const handlePrint = useReactToPrint({
    contentRef: targetRef,
    documentTitle: "Laporan Naive Bayes",
    pageStyle: `
      @page {
        size: A4;
        margin: 0.5in;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .no-print {
          display: none !important;
        }
        .print-content {
          padding: 0 !important;
          margin: 0 !important;
        }
      }
    `,
  });

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handlePrint}
      className={`flex items-center gap-2 ${className}`}
    >
      <Printer className="h-4 w-4" />
      {size !== "icon" && buttonText}
    </Button>
  );
}
