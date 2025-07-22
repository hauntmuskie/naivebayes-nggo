"use client";

import { ReactNode, useRef } from "react";
import { PrintHandler } from "@/components/print-handler";
import { PrintButton } from "@/components/print-button";
import { useSearchParams } from "next/navigation";

interface ReportWrapperProps {
  children: ReactNode;
}

export function ReportWrapper({ children }: ReportWrapperProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const isPrintMode = searchParams.get("print") === "true";

  return (
    <>
      {!isPrintMode && (
        <div className="no-print fixed top-4 right-4 z-50">
          <PrintButton
            targetRef={contentRef}
            buttonText="Print Laporan"
            variant="default"
            className="shadow-lg"
          />
        </div>
      )}
      <PrintHandler>
        <div ref={contentRef} className="print-content">
          {children}
        </div>
      </PrintHandler>
    </>
  );
}
