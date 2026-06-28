"use client";

import { useLang, setLang } from "@/lib/lang";

export function LangToggle() {
  const isKo = useLang();

  return (
    <button
      onClick={() => setLang(isKo ? "en" : "ko")}
      aria-label="Switch language"
      style={{
        position: "fixed",
        top: 10,
        right: 12,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 11px",
        borderRadius: 20,
        background: "rgba(11,30,45,0.80)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(21,182,193,0.4)",
        color: "#fff",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.03em",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        userSelect: "none",
      }}
    >
      <span style={{ fontSize: 13 }}>{isKo ? "🇺🇸" : "🇰🇷"}</span>
      <span>{isKo ? "EN" : "한국어"}</span>
    </button>
  );
}
