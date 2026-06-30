import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/styles/theme-experiment.css";
import { ExperimentThemeWatcher } from "@/components/ExperimentThemeWatcher";

export const metadata: Metadata = {
  title: "Localoop Korea — Dig into local Korea",
  description: "Region-based living navigation and community platform for foreigners and Koreans",
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
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)] antialiased">
        {/* Theme init (default dark) + install prompt capture — must run before React mounts */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem("ll-theme")||"dark";document.documentElement.setAttribute("data-theme",t);})();window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.deferredPrompt=e;});` }} />
        <ExperimentThemeWatcher />
        {children}
      </body>
    </html>
  );
}
