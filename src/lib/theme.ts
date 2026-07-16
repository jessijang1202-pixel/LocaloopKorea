"use client";
import { useState, useEffect } from "react";

type Theme = "dark" | "light";
// keep in sync with the "ll-theme" literal in the inline script in src/app/layout.tsx
const THEME_KEY = "ll-theme";
const DEFAULT: Theme = "light";
// keep in sync with DEFAULT_MIGRATION_KEY in src/lib/lang.ts and the inline
// script in src/app/layout.tsx
const DEFAULT_MIGRATION_KEY = "ll_default_migrated_v1";

// One-time reset for browsers holding a pre-migration "dark" value — see the
// matching function in src/lib/lang.ts for the full rationale. Idempotent, so
// calling it from both getLang() and getTheme() is safe regardless of order.
function migrateStaleDefaults() {
  if (localStorage.getItem(DEFAULT_MIGRATION_KEY)) return;
  localStorage.removeItem(THEME_KEY);
  localStorage.removeItem("ll_lang");
  localStorage.setItem(DEFAULT_MIGRATION_KEY, "1");
}

export function getTheme(): Theme {
  if (typeof window === "undefined") return DEFAULT;
  migrateStaleDefaults();
  return (localStorage.getItem(THEME_KEY) as Theme) || DEFAULT;
}

export function setTheme(theme: Theme) {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute("data-theme", theme);
  window.dispatchEvent(new CustomEvent("ll_theme_change", { detail: theme }));
}

export function toggleTheme() {
  setTheme(getTheme() === "dark" ? "light" : "dark");
}

export function useTheme(): Theme {
  const [theme, setThemeState] = useState<Theme>(DEFAULT);
  useEffect(() => {
    setThemeState(getTheme());
    const handler = (e: Event) => setThemeState((e as CustomEvent<Theme>).detail);
    window.addEventListener("ll_theme_change", handler);
    return () => window.removeEventListener("ll_theme_change", handler);
  }, []);
  return theme;
}
