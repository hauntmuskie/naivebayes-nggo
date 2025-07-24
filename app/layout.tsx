import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Pengklasifikasi Naive Bayes",
  description: "Klasifikasi yang powerful menggunakan model Naive Bayes",
  keywords: ["machine learning", "klasifikasi", "naive bayes", "dasbor"],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${poppins.variable} antialiased min-h-screen font-sans bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="flex-1 flex flex-col min-w-0">
              <main className="flex-1 w-full p-3">
                <div className="min-h-full">{children}</div>
              </main>
            </div>
          </div>
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
