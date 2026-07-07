"use client";

import { useState, useEffect, useLayoutEffect } from "react";

// keep in sync with the "ll_lang" literal in the inline script in src/app/layout.tsx
export const LANG_KEY = "ll_lang";
export const LANG_EVENT = "ll_lang_change";

// useLayoutEffect fires synchronously before browser paint (client only).
// Falls back to useEffect on the server to avoid SSR warnings.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function getLang(): "ko" | "en" {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === "ko" || saved === "en") return saved;
  // No saved preference → follow OS / browser language
  return navigator.language.startsWith("ko") ? "ko" : "en";
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
