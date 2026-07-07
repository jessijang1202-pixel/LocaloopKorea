"use client";

import { useLang, setLang } from "@/lib/lang";
import { useTheme, toggleTheme } from "@/lib/theme";
import { SunIcon, MoonIcon } from "@/components/icons";

/** Inline lang toggle — uses CSS variables, works on any background */
export function LangToggleInline() {
  const isKo = useLang();
  return (
    <button
      onClick={() => setLang(isKo ? "en" : "ko")}
      aria-label="Switch language"
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        height: 30, padding: "0 10px", borderRadius: 8, fontSize: 11,
        fontWeight: 700, cursor: "pointer", lineHeight: 1, whiteSpace: "nowrap",
        background: "var(--content-bg)",
        border: "1.5px solid var(--border)",
        color: "var(--foreground-muted)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        userSelect: "none",
      }}
    >
      {isKo ? "EN" : "KO"}
    </button>
  );
}

/** Theme toggle button — uses CSS variables */
export function ThemeToggle() {
  const theme = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark/light mode"
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        height: 30, width: 30, borderRadius: 8, lineHeight: 1,
        background: "var(--content-bg)",
        border: "1.5px solid var(--border)",
        cursor: "pointer", color: "var(--foreground-muted)", flexShrink: 0,
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

