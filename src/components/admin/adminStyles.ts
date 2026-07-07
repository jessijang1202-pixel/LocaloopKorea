import type { CSSProperties } from "react";

// Shared admin card surface styles. Two shadow variants exist across the
// admin pages — keep the values here in sync with every consumer.

// Light, ambient shadow — used by most admin list/detail pages.
export const CARD_SOFT: CSSProperties = {
  background: "#fff",
  borderRadius: 18,
  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
};

// Deeper, tighter shadow — used by the admin dashboard.
export const CARD_DEEP: CSSProperties = {
  background: "#fff",
  borderRadius: 18,
  boxShadow: "0 6px 20px -16px rgba(0,0,0,0.25)",
};
