"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang, setLang } from "@/lib/lang";

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

/** Inline lang toggle for embedding in flex rows (page headers, PC sidebar). */
export function LangToggleInline() {
  const isKo = useLang();
  return (
    <button
      onClick={() => setLang(isKo ? "en" : "ko")}
      aria-label="Switch language"
      style={baseStyle}
    >
      {isKo ? "EN" : "한국어"}
    </button>
  );
}

/** Combined [Lang][Login][Install] row for app page headers. */
export function TopActions() {
  const isKo = useLang();
  const promptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      promptRef.current = e as BeforeInstallPromptEvent;
      forceUpdate((n) => n + 1);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!promptRef.current) {
      alert(
        isKo
          ? "브라우저 메뉴에서 '홈 화면에 추가'를 선택하세요"
          : "Tap the browser menu → 'Add to Home Screen'"
      );
      return;
    }
    await promptRef.current.prompt();
    const { outcome } = await promptRef.current.userChoice;
    if (outcome === "accepted") promptRef.current = null;
    forceUpdate((n) => n + 1);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <LangToggleInline />
      <Link
        href="/login"
        style={{
          display: "inline-flex", alignItems: "center", padding: "5px 10px",
          borderRadius: 20, background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.28)", color: "#fff",
          fontSize: 11, fontWeight: 600, textDecoration: "none",
          whiteSpace: "nowrap", letterSpacing: "0.04em", lineHeight: 1,
        }}
      >
        {isKo ? "로그인" : "Login"}
      </Link>
      <button
        onClick={handleInstall}
        style={{
          display: "inline-flex", alignItems: "center", gap: 3, padding: "5px 9px",
          borderRadius: 20, background: "rgba(255,215,0,0.22)",
          border: "1px solid rgba(255,215,0,0.5)", color: "#fff",
          fontSize: 10, fontWeight: 700, cursor: "pointer",
          whiteSpace: "nowrap", letterSpacing: "0.03em", lineHeight: 1,
        }}
      >
        🏠 {isKo ? "저장" : "Save"}
      </button>
    </div>
  );
}
