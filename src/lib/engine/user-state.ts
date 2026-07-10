"use client";

// Foreigner Life Task Graph — module 100 (user state).
//
// localStorage persistence for the navigator profile plus a React hook that
// keeps multiple mounted components in sync via a window CustomEvent — mirrors
// the pattern in src/lib/lang.ts (ll_lang / ll_lang_change).

import { useEffect, useState } from "react";
import type { TaskId, UserProfile } from "./types";

export const NAVIGATOR_KEY = "ll_navigator";
export const NAVIGATOR_EVENT = "ll_navigator_change";

// Safe defaults — used on SSR and when nothing is stored yet.
export const DEFAULT_PROFILE: UserProfile = {
  region: null,
  purpose: null,
  language: null,
  koreanLevel: null,
  interests: [],
  stayDays: null,
  completedTasks: [],
};

// ─── Read / write ─────────────────────────────────────────────────────────

export function getProfile(): UserProfile {
  if (typeof window === "undefined") return { ...DEFAULT_PROFILE };
  try {
    const raw = localStorage.getItem(NAVIGATOR_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    // Merge over defaults so a partial/older payload never yields undefined fields.
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      interests: Array.isArray(parsed.interests) ? parsed.interests : [],
      completedTasks: Array.isArray(parsed.completedTasks) ? parsed.completedTasks : [],
    };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

function write(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(NAVIGATOR_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event(NAVIGATOR_EVENT));
}

export function saveProfile(p: Partial<UserProfile>): void {
  write({ ...getProfile(), ...p });
}

// ─── S900 — task completion ─────────────────────────────────────────────────

export function completeTask(id: TaskId): void {
  const profile = getProfile();
  if (profile.completedTasks.includes(id)) return;
  write({ ...profile, completedTasks: [...profile.completedTasks, id] });
}

export function uncompleteTask(id: TaskId): void {
  const profile = getProfile();
  if (!profile.completedTasks.includes(id)) return;
  write({
    ...profile,
    completedTasks: profile.completedTasks.filter((t) => t !== id),
  });
}

// ─── React hook ───────────────────────────────────────────────────────────

export interface NavigatorActions {
  complete(id: TaskId): void;
  uncomplete(id: TaskId): void;
  save(p: Partial<UserProfile>): void;
}

export function useNavigatorProfile(): [UserProfile, NavigatorActions] {
  // Start from defaults so server and first client render agree; hydrate in effect.
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    setProfile(getProfile());
    const update = () => setProfile(getProfile());
    window.addEventListener(NAVIGATOR_EVENT, update);
    // Sync across browser tabs too.
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(NAVIGATOR_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const actions: NavigatorActions = {
    complete: completeTask,
    uncomplete: uncompleteTask,
    save: saveProfile,
  };

  return [profile, actions];
}
