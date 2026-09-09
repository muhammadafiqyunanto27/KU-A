import type { Metadata } from "next";
import { Inter } from "next/font/google";
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

const themeInit = `
(function () {
  try {
    var t = localStorage.getItem("theme");
    var dark = t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (dark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{ __html: themeInit }}
        />
      </head>
      <body className="min-h-screen bg-background text-ink">{children}</body>
    </html>
  );
}