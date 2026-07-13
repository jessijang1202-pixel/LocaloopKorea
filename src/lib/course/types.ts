// Local Consumption Data-based Personalized Local Experience Course Recommendation
// — core vocabulary (patent no.3, modules 100~400).
//
// A third engine, distinct from src/lib/engine (patent no.1 task graph) and
// src/lib/grading (patent no.2 friendliness grading). This one composes a
// half-day / full-day *course* of genuinely local places (not tourist spots),
// matched to a foreigner's language level, adventure disposition, and budget.
//
//   Module 100  locality index (LI)                     (locality.ts)
//   Module 200  user profile inputs                     (this file + engine profile ext.)
//   Module 300  candidate filtering                     (filter.ts)
//   Module 400  course composition (S600~S900)          (compose.ts)
//
// Reuses patent-2 GradeLetter for the friendliness grade so filtering can lean
// on the already-computed grade band rather than recomputing sub-scores.

import type { GradeLetter } from "@/lib/grading";

// ─── User disposition (module 200) ──────────────────────────────────────────

// 안전 우선형 / 도전 선호형 — drives how aggressively we chase deep-local spots.
export type AdventureStyle = "safe" | "bold";

// 반나절(3-4곳) / 하루(5-7곳) — course length.
export type CourseDuration = "half" | "full";

// Reuse patent-1 Korean-level vocabulary so the two engines share one scale.
export type LanguageLevel =
  | "beginner"
  | "basic"
  | "intermediate"
  | "advanced";

// ─── Module 100 inputs (patent fig.2) ───────────────────────────────────────

// Raw local-consumption signals feeding the locality index. Each is documented
// with its monotonic direction on LI (see locality.ts computeLI).
export interface LocalityInputs {
  koreanReviewRatio: number; // 0..1  share of reviews by Koreans — higher → LI up
  foreignVisitorRatio: number; // 0..1  share of foreign visitors — lower → LI up
  koreanSearchRatio: number; // 0..1  share of Korean-language searches — higher → LI up
  localKeywordScore: number; // 0..100 local-keyword frequency signal — higher → LI up
}

// ─── Candidate place ────────────────────────────────────────────────────────

// A place already scored by the upstream pipeline (LI + patent-2 grade/LS).
export interface CandidatePlace {
  id: string;
  slug: string;
  name: { ko: string; en: string };
  category: string; // places.category vocabulary (restaurant/cafe/bar/activity/...)
  regionId: string | null; // places.region_id — themed courses gate on this
  lat: number | null;
  lng: number | null;
  imageUrl: string | null; // places.image_url — cover image for course cards
  li: number; // locality index 0-100 (module 100)
  ls: number; // language support score (patent-2 LS sub-score 0-100)
  grade: GradeLetter | null; // patent-2 friendliness grade (null = ungraded)
  foreignVisitorRatio: number; // 0..1
  priceEstimate: number; // KRW per person
  stayMinutes: number; // typical stay in minutes
  englishSubtitles: boolean; // cinema/performance subtitle availability (claim 3)
  timeSlot?: "meal" | "screening" | null; // time-constrained types (claim 7)
}

// ─── Composed-course request (module 200) ───────────────────────────────────

export interface CourseProfile {
  languageLevel: LanguageLevel;
  adventure: AdventureStyle;
  budgetPerPerson: number; // KRW
  radiusKm: number;
  interests: string[]; // category slugs of interest; [] = all
  duration: CourseDuration;
  origin: { lat: number; lng: number };
}

// ─── Composed-course output (module 400) ────────────────────────────────────

export interface CourseStop {
  place: CandidatePlace;
  order: number; // 0-based position in the course
  slotLabel: { ko: string; en: string };
  legKm: number; // walking distance from the previous stop (origin for stop 0)
}

export interface ComposedCourse {
  stops: CourseStop[];
  totalBudget: number; // KRW, sum of priceEstimate
  totalMinutes: number; // stay minutes + estimated walking time
  totalDistanceKm: number; // sum of legs, 1 decimal
  swappedForBudget: string[]; // en names of places swapped out for budget (claim 4)
}

// ─── Feedback (claim 5) ─────────────────────────────────────────────────────

// Post-course ratings, 1-5 each. localFeel drives the dynamic LI correction.
export interface CourseFeedback {
  rating: number; // overall satisfaction 1-5
  localFeel: number; // "felt genuinely local" 1-5
}
