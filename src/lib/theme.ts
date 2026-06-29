"use client";
import { useState, useEffect } from "react";

type Theme = "dark" | "light";
const THEME_KEY = "ll-theme";
const DEFAULT: Theme = "dark";

export function getTheme(): Theme {
  if (typeof window === "undefined") return DEFAULT;
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
