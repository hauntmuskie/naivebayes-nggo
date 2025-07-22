import { ReactNode } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import styles from "./report-layout.module.css";
import { Separator } from "@/components/ui/separator";
import { ReportWrapper } from "./report-wrapper";

import GapuraAngkasaLogo from "@/public/gapura-angkasa.jpeg";

interface ReportLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function ReportLayout({ children, title, subtitle }: ReportLayoutProps) {
  const currentDate = format(new Date(), "dd MMMM yyyy", { locale: id });

  return (
    <ReportWrapper>
      <div className={`min-h-screen bg-white p-10 ${styles.printRoot}`}>
        {/* Header Section */}
      <header className={`pb-6 mb-8 ${styles.printMarginBottom6}`}>
        <div className="grid grid-cols-[1fr_2fr_1fr] gap-4 items-center">
          {/* Left: Company Logo */}
          <div className="flex justify-start items-start">
            <Image
              src={GapuraAngkasaLogo}
              alt="Gapura Angkasa Logo"
              width={160}
              height={160}
              className="w-40 h-40 object-contain"
            />
          </div>

          {/* Center: Company Info */}
          <div className="text-center px-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 w-full">
              PT. GAPURA ANGKASA
            </h1>
            <div className="text-sm text-gray-700 space-y-1">
              <p>BLOK. B, Gedung Gapura Angkasa</p>
              <p>Jl. Merpati 3 Jl. Kota Baru Bandar Kemayoran No.12 Kav.7</p>
              <p>Daerah Khusus Ibukota Jakarta 10610</p>
              <p className="text-blue-600 underline">https://gapura.id/</p>
            </div>
          </div>

          {/* Right: Empty space */}
          <div className="flex justify-end"></div>
        </div>

        {/* Separator below logo and company info */}
        <div className="mt-6">
          <Separator className="bg-gray-300" />
        </div>

        {/* Report Title */}
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          {subtitle && (
            <p className="text-lg text-gray-600 font-medium">{subtitle}</p>
          )}
          <div className="mt-4 w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>
      </header>

      {/* Content Section */}
      <main className={`max-w-full mx-auto px-0 ${styles.printPaddingX0}`}>
        {children}
      </main>

      {/* Footer Section */}
      <footer
        className={`mt-12 pt-8 border-t-2 border-gray-300 ${styles.printMarginTop8}`}
      >
        <div className="grid grid-cols-[1fr_1fr] gap-8 items-end">
          {/* Left: Report Info */}
          <div className="text-sm text-gray-600">
            <p className="font-medium">
              Laporan Sistem Klasifikasi Naive Bayes
            </p>
            <p>Analisis Kepuasan Penumpang</p>
            {/* <p className="text-xs text-gray-500 mt-1">
              Generated: {currentDate} {currentTime} WIB
            </p> */}
          </div>

          {/* Right: Signature Area */}
          <div className="text-right min-h-[180px] flex flex-col justify-between">
            <div>
              <p className="text-base text-gray-700 mb-3">
                Jakarta, {currentDate}
              </p>
              <p className="text-base text-gray-700 mb-12">Mengetahui,</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="w-48 border-b-2 border-gray-400 mb-2"></div>
              <p className="text-base text-gray-700 font-medium">
                Kepala Divisi IT
              </p>
              <p className="text-sm text-gray-500">PT. Gapura Angkasa</p>
            </div>
          </div>
        </div>

        {/* Company Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          {/* <p className="text-xs text-gray-500">
            Dokumen ini adalah laporan resmi PT. Gapura Angkasa untuk sistem
            klasifikasi kepuasan penumpang
          </p> */}
          <p className="text-xs text-gray-400 mt-1">
            Hanya untuk Penggunaan Internal
          </p>
        </div>
      </footer>
    </div>
    </ReportWrapper>
  );
}
