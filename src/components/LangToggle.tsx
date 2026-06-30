"use client";

import { usePathname } from "next/navigation";
import { useLang, setLang } from "@/lib/lang";
import { useTheme, toggleTheme } from "@/lib/theme";

type BeforeInstallPromptEvent = Event & {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const baseStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "5px 12px",
  borderRadius: 20,
  background: "rgba(11,30,45,0.82)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  border: "1.5px solid rgba(21,182,193,0.55)",
  color: "#fff",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.04em",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
  userSelect: "none",
  lineHeight: 1,
  whiteSpace: "nowrap",
};

export function LangToggle() {
  const isKo = useLang();
  const pathname = usePathname();
  if (pathname === "/intro" || pathname.startsWith("/profile")) return null;
  return (
    <button
      onClick={() => setLang(isKo ? "en" : "ko")}
      aria-label="Switch language"
      className="lang-btn-fixed"
      style={baseStyle}
    >
      {isKo ? "EN" : "한국어"}
    </button>
  );
}

/** Inline lang toggle — subtle, blends into header. */
export function LangToggleInline() {
  const isKo = useLang();
  return (
    <button
      onClick={() => setLang(isKo ? "en" : "ko")}
      aria-label="Switch language"
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        height: 30, padding: "0 10px", borderRadius: 8, fontSize: 11,
        fontWeight: 500, cursor: "pointer", lineHeight: 1, whiteSpace: "nowrap",
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.22)",
        color: "rgba(255,255,255,0.6)",
        userSelect: "none",
      }}
    >
      {isKo ? "EN" : "한국어"}
    </button>
  );
}

/** Combined [Lang][Theme][Login][Install] row for app page headers (mobile). */
export function TopActions() {
  const isKo = useLang();
  const theme = useTheme();

  const handleInstall = async () => {
    const w = window as Window & { deferredPrompt?: BeforeInstallPromptEvent };
    if (w.deferredPrompt) {
      await w.deferredPrompt.prompt();
      await w.deferredPrompt.userChoice;
      w.deferredPrompt = undefined;
    } else {
      alert(
        isKo
          ? "iPhone: 공유 버튼 → '홈 화면에 추가'\nAndroid: 이미 설치되었거나 설치를 지원하지 않는 브라우저입니다"
          : "iPhone: Share → 'Add to Home Screen'\nAndroid: Already installed or not supported by this browser"
      );
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <LangToggleInline />
      <button
        onClick={toggleTheme}
        aria-label="Toggle dark/light mode"
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          height: 30, width: 30, borderRadius: 8, lineHeight: 1,
          background: "transparent", border: "1px solid rgba(255,255,255,0.22)",
          cursor: "pointer", color: "#ffffff", flexShrink: 0,
        }}
      >
        {theme === "dark" ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="5"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        )}
      </button>
    </div>
  );
}
