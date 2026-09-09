import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "react-image-crop/dist/ReactCrop.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "KU-A — Website Kelas",
    template: "%s · KU-A",
  },
  description:
    "Profil class KU-A — anggota, portofolio, dan laporan keuangan kas kelas.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-ink">
        <Script id="theme-init" src="/theme-init.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}