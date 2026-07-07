import type { Place } from "@/types";

// Single source for grade / rating logic.
//
// NOTE ON DIVERGENCE: the color palettes below are intentionally kept separate.
// - GRADE_BG (map) and GRADE_COLOR (places) share identical CSS-var values but
//   are kept as separately named exports to preserve each call site's naming.
// - GRADE_TEXT is shared by the map + place-detail pages (CSS-var palette).
// - RATING_COLORS / RATING_TEXT (KakaoMap) use hex values and DIFFER from the
//   admin palette (e.g. B and C colors are swapped, and there is no D grade).
// - ADMIN_GRADE_COLORS / ADMIN_GRADE_TEXT (admin) use hex values, include a
//   D grade, and swap B/C relative to RATING_COLORS.
// Do not merge these — the differing values are load-bearing.

export function getRating(p: Place): "S" | "A" | "B" | "C" {
  if (p.english_support && p.card_payment && p.solo_friendly) return "S";
  if (p.english_support && p.card_payment) return "A";
  if (p.card_payment) return "B";
  return "C";
}

// map/page.tsx — CSS-var badge background
export const GRADE_BG: Record<string, string> = {
  S: "var(--grade-s)", A: "var(--grade-a)", B: "var(--grade-b)", C: "var(--grade-c)",
};

// places/[slug]/page.tsx — CSS-var grade color (identical values to GRADE_BG)
export const GRADE_COLOR: Record<string, string> = {
  S: "var(--grade-s)", A: "var(--grade-a)", B: "var(--grade-b)", C: "var(--grade-c)",
};

// Shared by map/page.tsx and places/[slug]/page.tsx — CSS-var text color
export const GRADE_TEXT: Record<string, string> = {
  S: "#fff", A: "#fff", B: "#fff", C: "var(--grade-c-text)",
};

// KakaoMap.tsx — hex pin colors
export const RATING_COLORS: Record<string, string> = {
  S: "#FF5636",
  A: "#12BFB6",
  B: "#7B4DFF",
  C: "#FFC93C",
};

export const RATING_TEXT: Record<string, string> = {
  S: "#fff",
  A: "#fff",
  B: "#fff",
  C: "#3a2c00",
};

// admin/places/page.tsx — hex grade colors (includes D grade; B/C swapped vs RATING_COLORS)
export const ADMIN_GRADE_COLORS: Record<string, string> = { S: "#FF5636", A: "#12BFB6", B: "#FFC93C", C: "#7B4DFF", D: "#9A9488" };
export const ADMIN_GRADE_TEXT: Record<string, string> = { S: "#fff", A: "#fff", B: "#3a2c00", C: "#fff", D: "#fff" };
