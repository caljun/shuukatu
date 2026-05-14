import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CompaniesProvider } from "@/context/CompaniesContext";
import { EventsProvider } from "@/context/EventsContext";
import AppShell from "@/components/AppShell";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "就活管理",
  description: "企業管理アプリ",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "就活管理",
  },
  formatDetection: { telephone: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} h-full`}>
      <head>
        <meta name="theme-color" content="#4f46e5" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="h-full">
        <ServiceWorkerRegistration />
        <CompaniesProvider>
          <EventsProvider>
            <AppShell>{children}</AppShell>
          </EventsProvider>
        </CompaniesProvider>
      </body>
    </html>
  );
}
