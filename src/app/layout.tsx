import type { Metadata, Viewport } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
      </head>
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)] antialiased">
        {/* Theme init (default dark) + install prompt capture — must run before React mounts */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem("ll-theme")||"dark";document.documentElement.setAttribute("data-theme",t);})();window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.deferredPrompt=e;});` }} />
        {children}
      </body>
    </html>
  );
}
