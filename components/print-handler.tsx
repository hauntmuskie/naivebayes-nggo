"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";

interface PrintHandlerProps {
  children: React.ReactNode;
}

export function PrintHandler({ children }: PrintHandlerProps) {
  const searchParams = useSearchParams();
  const isPrintMode = searchParams.get("print") === "true";
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Laporan Naive Bayes",
    onAfterPrint: () => {
      // Optional: Close the tab after printing
      // window.close();
    },
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
      }
    `,
  });

  useEffect(() => {
    if (isPrintMode && componentRef.current) {
      // Small delay to ensure the page has fully loaded
      const timer = setTimeout(() => {
        handlePrint();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isPrintMode, handlePrint]);

  return <div ref={componentRef}>{children}</div>;
}
