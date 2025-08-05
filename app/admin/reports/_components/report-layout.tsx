"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import GapuraAngkasaLogo from "@/public/gapura_angkasa.png";
import { PrintButton } from "./print-button";

interface ReportLayoutProps {
  title: string;
  children: React.ReactNode;
  documentTitle?: string;
  onBack?: () => void;
}

export function ReportLayout({
  title,
  children,
  documentTitle,
  onBack,
}: ReportLayoutProps) {
  const printRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full bg-white text-black">
      {/* Top Right Buttons */}
      <div className="fixed top-6 right-8 z-50 flex gap-2 items-center">
        {onBack && (
          <Button
            variant="default"
            onClick={onBack}
            className="px-4 text-white py-2 rounded-md shadow-lg transition-colors duration-200 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        )}
        <PrintButton
          contentRef={printRef}
          documentTitle={documentTitle || title}
        />
      </div>

      {/* Printable Content */}
      <div ref={printRef} className="w-full bg-white p-4">
        {/* Header */}
        <div className="w-full mt-5 mb-8 bg-white">
          <div className="relative flex items-center justify-between">
            <Image
              src={GapuraAngkasaLogo}
              alt="Gapura Angkasa Logo"
              width={200}
              height={200}
              quality={100}
              id="report-logo"
              className="object-cover"
            />
            <div
              id="report-header"
              className="absolute left-1/2 transform -translate-x-1/2 text-center ml-10"
            >
              <h1 className="text-2xl font-bold mb-2">PT. GAPURA ANGKASA</h1>
              <p className="text-sm text-gray-600 mb-1">
                BLOK. B, Gedung Gapura Angkasa, Jl. Merpati 3 Jl. Kota Baru
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Bandar Kemayoran No.12 Kav.7, Daerah Khusus Ibukota Jakarta
                10610
              </p>
              <p className="text-sm text-gray-600 mb-1">www.gapura.id</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-black my-6"></div>

        {/* Report Title */}
        <div className="w-full text-center mb-3">
          <h2 className="text-xl font-bold">{title}</h2>
        </div>

        {/* Report Content */}
        <div className="w-full">
          {children}

          <div className="mt-16 w-full flex justify-end">
            <div className="text-right mr-8">
              <p className="mb-2">
                Jakarta,{" "}
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="mb-20">Mengetahui,</p>
              <p className="inline-block min-w-[120px] pb-1">Tim Divisi IT</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
