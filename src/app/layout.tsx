import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LangToggle } from "@/components/LangToggle";

export const metadata: Metadata = {
  title: "Localoop Korea — Dig into local Korea",
  description: "Region-based living navigation and community platform for foreigners and Koreans",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Localoop Korea",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1EC8C8",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)] antialiased">
        <LangToggle />
        {children}
      </body>
    </html>
  );
}
