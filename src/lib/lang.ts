"use client";

import { useState, useEffect } from "react";

export const LANG_KEY = "ll_lang";
export const LANG_EVENT = "ll_lang_change";

export function getLang(): "ko" | "en" {
  if (typeof window === "undefined") return "en";
  const s = localStorage.getItem(LANG_KEY);
  if (s === "ko" || s === "en") return s;
  return navigator.language.startsWith("ko") ? "ko" : "en";
}

export function setLang(lang: "ko" | "en") {
  localStorage.setItem(LANG_KEY, lang);
  window.dispatchEvent(new Event(LANG_EVENT));
}

export function useLang(): boolean {
  const [isKo, setIsKo] = useState(false);
  useEffect(() => {
    const update = () => setIsKo(getLang() === "ko");
    update();
    window.addEventListener(LANG_EVENT, update);
    return () => window.removeEventListener(LANG_EVENT, update);
  }, []);
  return isKo;
}
