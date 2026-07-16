"use client";

import { useState, useEffect, useLayoutEffect } from "react";

// keep in sync with the "ll_lang" literal in the inline script in src/app/layout.tsx
export const LANG_KEY = "ll_lang";
export const LANG_EVENT = "ll_lang_change";
// keep in sync with the migration literal in the inline script in src/app/layout.tsx
export const DEFAULT_MIGRATION_KEY = "ll_default_migrated_v1";

// useLayoutEffect fires synchronously before browser paint (client only).
// Falls back to useEffect on the server to avoid SSR warnings.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// One-time reset for browsers that stored "ko"/"dark" back when the app
// OS-detected language and defaulted to dark mode — without this, those
// stale values silently win forever over the new light+English default,
// which reads as "the default isn't working" even though a fresh visitor
// gets it correctly. Runs once per browser; later manual toggles are
// untouched.
function migrateStaleDefaults() {
  if (localStorage.getItem(DEFAULT_MIGRATION_KEY)) return;
  localStorage.removeItem(LANG_KEY);
  localStorage.removeItem("ll-theme");
  localStorage.setItem(DEFAULT_MIGRATION_KEY, "1");
}

export function getLang(): "ko" | "en" {
  if (typeof window === "undefined") return "en";
  migrateStaleDefaults();
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === "ko" || saved === "en") return saved;
  // No saved preference → English by default (product decision, not OS-detected)
  return "en";
}

export function setLang(lang: "ko" | "en") {
  localStorage.setItem(LANG_KEY, lang);
  window.dispatchEvent(new Event(LANG_EVENT));
}

export function useLang(): boolean {
  const [isKo, setIsKo] = useState(false);
  useIsomorphicLayoutEffect(() => {
    // Runs before first paint on client → no English flash for Korean OS users
    setIsKo(getLang() === "ko");
    const update = () => setIsKo(getLang() === "ko");
    window.addEventListener(LANG_EVENT, update);
    return () => window.removeEventListener(LANG_EVENT, update);
  }, []);
  return isKo;
}
