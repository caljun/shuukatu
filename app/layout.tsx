import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CompaniesProvider } from "@/context/CompaniesContext";
import AppShell from "@/components/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "就活管理",
  description: "企業管理アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} h-full`}>
      <body className="h-full">
        <CompaniesProvider>
          <AppShell>{children}</AppShell>
        </CompaniesProvider>
      </body>
    </html>
  );
}
