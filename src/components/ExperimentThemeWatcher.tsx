"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const EXP_KEY = "ll-exp-theme";
const EXP_VALUE = "experiment";

function Watcher() {
  const params = useSearchParams();

  useEffect(() => {
    const requested = params.get("theme");

    if (requested === EXP_VALUE) {
      document.documentElement.setAttribute("data-exp-theme", EXP_VALUE);
      sessionStorage.setItem(EXP_KEY, EXP_VALUE);
    } else if (requested !== null) {
      // ?theme=default or any other value → clear experiment
      document.documentElement.removeAttribute("data-exp-theme");
      sessionStorage.removeItem(EXP_KEY);
    } else {
      // No theme param — restore from sessionStorage so theme
      // persists across client-side navigation
      const saved = sessionStorage.getItem(EXP_KEY);
      if (saved === EXP_VALUE) {
        document.documentElement.setAttribute("data-exp-theme", EXP_VALUE);
      }
    }
  }, [params]);

  return null;
}

export function ExperimentThemeWatcher() {
  return (
    <Suspense>
      <Watcher />
    </Suspense>
  );
}
