import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://localoop.kr"),
  title: "Localoop Korea — Dig into local Korea",
  description: "한국 생활의 시작, Localoop Korea. 이태원부터 시작하는 외국인 친화 장소 추천과 로컬 커뮤니티.",
  openGraph: {
    title: "Localoop Korea — Dig into local Korea",
    description: "한국 생활의 시작, Localoop Korea. 이태원부터 시작하는 외국인 친화 장소 추천과 로컬 커뮤니티.",
    url: "https://localoop.kr",
    siteName: "Localoop Korea",
    images: [
      {
        url: "/seoul_landscape.png",
        width: 1200,
        height: 630,
        alt: "Localoop Korea — Seoul Landscape",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Localoop Korea — Dig into local Korea",
    description: "한국 생활의 시작, Localoop Korea. 이태원부터 시작하는 외국인 친화 장소 추천과 로컬 커뮤니티.",
    images: ["/seoul_landscape.png"],
  },
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
        {/* Theme init (default light) + install prompt capture — must run before React mounts */}
        {/* The "ll-theme", "ll_lang", and "ll_default_migrated_v1" literals below must stay in sync
            with THEME_KEY/DEFAULT_MIGRATION_KEY in src/lib/theme.ts and LANG_KEY/DEFAULT_MIGRATION_KEY in src/lib/lang.ts.
            The migration reset clears any pre-existing "ko"/"dark" values from before this app defaulted
            to light+English, so the new default actually takes effect instead of being silently
            overridden forever by a stale stored preference. */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){if(!localStorage.getItem("ll_default_migrated_v1")){localStorage.removeItem("ll-theme");localStorage.removeItem("ll_lang");localStorage.setItem("ll_default_migrated_v1","1");}var t=localStorage.getItem("ll-theme")||"light";document.documentElement.setAttribute("data-theme",t);var l=localStorage.getItem("ll_lang")||"en";document.documentElement.setAttribute("data-lang",l);})();window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.deferredPrompt=e;});` }} />
        {children}
      </body>
    </html>
  );
}
