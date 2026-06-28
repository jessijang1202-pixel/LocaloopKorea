"use client";

import { usePathname } from "next/navigation";
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

/**
 * Fixed lang toggle — mobile only (top-left), hidden on PC via CSS.
 * Hides itself on /intro page because intro has its own inline toggle.
 */
export function LangToggle() {
  const isKo = useLang();
  const pathname = usePathname();
  // These pages render lang toggle inline next to their own action button
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
