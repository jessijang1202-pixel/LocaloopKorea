"use client";

import { useLang, setLang } from "@/lib/lang";

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

/** Fixed (bottom-left mobile, hidden on PC via CSS) */
export function LangToggle() {
  const isKo = useLang();
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

/** Inline — use inside flex rows (sidebar, page headers) */
export function LangToggleInline({ dark }: { dark?: boolean }) {
  const isKo = useLang();
  return (
    <button
      onClick={() => setLang(isKo ? "en" : "ko")}
      aria-label="Switch language"
      style={{
        ...baseStyle,
        background: dark ? "rgba(255,255,255,0.12)" : "rgba(11,30,45,0.70)",
        border: dark ? "1.5px solid rgba(255,255,255,0.25)" : "1.5px solid rgba(21,182,193,0.55)",
      }}
    >
      {isKo ? "EN" : "한국어"}
    </button>
  );
}
