import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AmanDes — Pelindung Digital Koperasi Desa",
  description: "Platform Pengawasan Otomatis, Transparansi, & Kepatuhan Keuangan Koperasi Desa (KDMP)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${outfit.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fdfbf7] dark:bg-[#121210] text-[#1c1a16] dark:text-[#f4f1ea]">
        {children}
      </body>
    </html>
  );
}
