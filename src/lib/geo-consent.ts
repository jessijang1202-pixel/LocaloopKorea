"use client";

// Shared geolocation-consent state (module 100-ish, patent-3 course engine's
// origin input, now used by 3 map surfaces: /map browse, task-filtered map,
// and the food "go eat now" flow). A single localStorage flag so the custom
// in-app consent modal only ever shows once across the whole app — after
// that, requestLocation() just calls the native browser API directly (the
// browser itself remembers whether permission was actually granted; we only
// need to remember whether we've shown OUR explanatory modal once).

import { useEffect, useState } from "react";

const CONSENT_KEY = "ll_location_consent_asked";

export function hasAskedLocationConsent(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(CONSENT_KEY) === "1";
}

export function markLocationConsentAsked(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENT_KEY, "1");
}

export interface UserCoords {
  lat: number;
  lng: number;
}

// Best-effort browser geolocation — same 5s-timeout-then-null pattern
// RecommendedCourses.tsx already used for its own one-off call.
export function requestLocation(): Promise<UserCoords | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 5000 }
    );
  });
}

export interface LocationConsentState {
  coords: UserCoords | null;
  resolved: boolean; // true once we have an answer (coords or confirmed null)
  showModal: boolean;
  allow: () => void;
  skip: () => void;
}

// Drives LocationConsent.tsx: shows the modal only the first time anywhere
// in the app, then silently resolves coordinates (or null) on every
// subsequent mount.
export function useLocationWithConsent(): LocationConsentState {
  const [coords, setCoords] = useState<UserCoords | null>(null);
  const [resolved, setResolved] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (hasAskedLocationConsent()) {
      void requestLocation().then((c) => {
        setCoords(c);
        setResolved(true);
      });
    } else {
      setShowModal(true);
    }
  }, []);

  function allow() {
    markLocationConsentAsked();
    setShowModal(false);
    void requestLocation().then((c) => {
      setCoords(c);
      setResolved(true);
    });
  }

  function skip() {
    markLocationConsentAsked();
    setShowModal(false);
    setResolved(true);
  }

  return { coords, resolved, showModal, allow, skip };
}
