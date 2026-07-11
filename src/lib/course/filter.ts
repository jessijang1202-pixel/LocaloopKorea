// Module 300 — candidate filtering (patent fig.2 filtering table + claims 2, 3).
//
// Given a candidate pool and a user's course profile, keep only the places that
// satisfy, in order:
//   1. locality threshold by adventure disposition   (claim 2)
//   2. language-support lower bound by language level
//   3. subtitle availability for screening-type culture (claim 3)
//   4. within the requested radius
//   5. interest match (meals always eligible as anchors)
//   6. per-place budget sanity
//
// Each step is documented with the clause it implements. Filtering is a pure,
// order-preserving pass — it never reorders the pool.

import { haversineKm } from "./geo";
import { LI_LOCAL_SPOT_MIN } from "./locality";
import type { CandidatePlace, CourseProfile, LanguageLevel } from "./types";

// ─── Threshold constants ────────────────────────────────────────────────────

// 안전 우선형: local-spot floor, same as the module-100 baseline.
export const SAFE_LI_MIN = LI_LOCAL_SPOT_MIN; // 70
// 도전 선호형: pushes deeper-local, only very high-LI spots qualify.
export const BOLD_LI_MIN = 85;
// 도전 선호형 additionally caps how touristed a place may be.
export const BOLD_FOREIGN_RATIO_MAX = 0.1;

// Language-support floors. Low-language users need strong on-site support;
// higher-language users tolerate leaner support.
export const LS_MIN_LOW_LANG = 80; // beginner / basic
export const LS_MIN_HIGH_LANG = 50; // intermediate / advanced

// 안전 우선형 minimum friendliness grade — grade A band or better.
export const SAFE_MIN_GRADE = "A" as const;

// Categories treated as "meal anchors" — a course needs meals regardless of the
// user's declared interests, so these are never dropped by the interest filter.
const MEAL_CATEGORIES = new Set(["restaurant"]);

export function isMealCategory(category: string): boolean {
  return MEAL_CATEGORIES.has(category);
}

// Interest → category groups. Interest slugs are higher-level than raw place
// categories, so an onboarding interest like "food" or "culture" expands to the
// set of categories it covers. An interest also matches a category by exact
// name (so passing raw category slugs as interests keeps working). Interpretation:
// the patent leaves the interest taxonomy to platform policy; this map documents
// a sensible default.
const INTEREST_CATEGORY_GROUPS: Record<string, string[]> = {
  food: ["restaurant", "cafe", "bar", "market"],
  culture: ["culture", "cinema", "performance", "activity"],
};

function matchesInterest(category: string, interests: string[]): boolean {
  for (const token of interests) {
    if (token === category) return true;
    if (INTEREST_CATEGORY_GROUPS[token]?.includes(category)) return true;
  }
  return false;
}

// Grade rank helper: S(4) > A(3) > B(2) > C(1) > D(0); null → -1 (unqualified).
const GRADE_RANK: Record<string, number> = { S: 4, A: 3, B: 2, C: 1, D: 0 };
function gradeRank(grade: string | null): number {
  return grade == null ? -1 : (GRADE_RANK[grade] ?? -1);
}
const SAFE_MIN_GRADE_RANK = GRADE_RANK[SAFE_MIN_GRADE]; // 3 (A)

function isLowLanguage(level: LanguageLevel): boolean {
  return level === "beginner" || level === "basic";
}

// Screening-type culture that must be intelligible without Korean:
// dedicated cinema/performance venues, plus generic "culture" places whose
// timeSlot marks them as a screening event (claim 3, 실시예). Interpretation:
// only screening experiences get the subtitle gate — museums/exhibitions do not.
export function needsSubtitleCheck(place: CandidatePlace): boolean {
  if (place.category === "cinema" || place.category === "performance") return true;
  if (place.category === "culture" && place.timeSlot === "screening") return true;
  return false;
}

export function filterCandidates(
  places: CandidatePlace[],
  profile: CourseProfile,
): CandidatePlace[] {
  const lowLang = isLowLanguage(profile.languageLevel);
  const lsFloor = lowLang ? LS_MIN_LOW_LANG : LS_MIN_HIGH_LANG;
  const hasInterests = profile.interests.length > 0;

  return places.filter((p) => {
    // Step 1 — locality threshold by adventure (claim 2).
    if (profile.adventure === "safe") {
      // 안전 우선형: local-spot floor AND grade A/S (ungraded excluded).
      if (p.li < SAFE_LI_MIN) return false;
      if (gradeRank(p.grade) < SAFE_MIN_GRADE_RANK) return false;
    } else {
      // 도전 선호형: deeper-local floor AND low foreign-visitor share.
      if (p.li < BOLD_LI_MIN) return false;
      if (p.foreignVisitorRatio > BOLD_FOREIGN_RATIO_MAX) return false;
    }

    // Step 2 — language-support lower bound by language level.
    if (p.ls < lsFloor) return false;

    // Step 3 — subtitle availability for screening-type culture (claim 3).
    // Low-language users require English subtitles; higher-language users keep
    // the place regardless (they can follow Korean-only screenings).
    if (needsSubtitleCheck(p) && lowLang && !p.englishSubtitles) return false;

    // Step 4 — radius: haversine from origin; null coords are excluded.
    if (p.lat == null || p.lng == null) return false;
    const dist = haversineKm(profile.origin, { lat: p.lat, lng: p.lng });
    if (dist > profile.radiusKm) return false;

    // Step 5 — interests: when the user selected interests, keep matching
    // categories OR any meal place (courses need meals regardless of interest).
    if (
      hasInterests &&
      !matchesInterest(p.category, profile.interests) &&
      !isMealCategory(p.category)
    ) {
      return false;
    }

    // Step 6 — per-place budget sanity: one stop cannot exceed the whole budget.
    if (p.priceEstimate > profile.budgetPerPerson) return false;

    return true;
  });
}
