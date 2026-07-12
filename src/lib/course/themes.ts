// Themed local-experience courses — an alternate composition path built on the
// patent no.3 course engine (src/lib/course), tuned for the ~1,400 collected
// places rather than the strict patent filter.
//
// The 자유 구성 (custom) path in CourseBuilder keeps using filterCandidates +
// composeCourse (patent filter: LI>=70 + grade A). Collected places are mostly
// grade B with modest LI, so themes apply their OWN, looser quality gate here
// (filterForTheme) and their own greedy composition (composeThemedCourse). None
// of the patent modules 300/400 behavior is changed.
//
// A theme is a fixed ordered list of slots; each slot accepts one or more place
// categories and carries its own bilingual label. Candidates for a slot are
// ranked by the theme's sortBy metric (grade / li / ls), with proximity to the
// previous stop as the tie-break, so a themed course still reads as a coherent
// nearby route.

import { haversineKm } from "./geo";
import type {
  CandidatePlace,
  ComposedCourse,
  CourseStop,
  LanguageLevel,
} from "./types";
import type { Bi } from "@/types/content";

// ─── Theme vocabulary ────────────────────────────────────────────────────────

export interface ThemeSlot {
  groups: string[]; // acceptable places.category values for this slot
  label: Bi; // bilingual slot label (becomes CourseStop.slotLabel)
}

export interface CourseTheme {
  id: string;
  name: Bi; // chip / heading name
  tagline: Bi; // one-liner shown under the chip and result
  slots: ThemeSlot[];
  sortBy: "grade" | "li" | "ls"; // candidate preference within a slot
}

// ─── Tunables ────────────────────────────────────────────────────────────────

// Themed courses never trim below this many stops; pruning stops here (claim 4
// spirit). Reused from the half-day floor in compose.ts.
export const THEME_MIN_STOPS = 3;

// Two candidates whose distance to the previous stop differ by <= this are
// treated as equidistant (proximity tie-break), matching compose.ts.
const THEME_TIE_DISTANCE_KM = 0.5;

// Walking-time estimate: minutes per kilometer of leg (same as compose.ts).
const THEME_WALK_MIN_PER_KM = 15;

// Language sort-bonus threshold: below this ls, low-language users get a lower
// preference (a bonus, NOT a hard gate — see filterForTheme).
const LANG_BONUS_LS = 50;

// Grade band ranking, mirroring the patent-2 letters. Themes admit S/A/B only.
const THEME_GRADE_RANK: Record<string, number> = { S: 4, A: 3, B: 2, C: 1, D: 0 };
function gradeRank(grade: string | null): number {
  return grade == null ? -1 : (THEME_GRADE_RANK[grade] ?? -1);
}
const THEME_MIN_GRADE_RANK = THEME_GRADE_RANK["B"]; // 2 — exclude C, D, ungraded

// ─── Fallback theme ──────────────────────────────────────────────────────────
// Used by the course builder when the strict patent filter (custom mode) yields
// no composable course for the selected region: a neutral cafe-meal-experience
// mix under the relaxed themed gate, so first-time users always see a result.
// Not listed in THEMES (no chip) — it is an automatic relaxation, not a choice.

export const FALLBACK_THEME: CourseTheme = {
  id: "best-mix",
  name: { ko: "베스트 믹스", en: "Best Mix" },
  tagline: {
    ko: "이 지역에서 평가가 좋은 곳들로 구성한 기본 코스",
    en: "A default course from the best-rated spots in this area.",
  },
  sortBy: "grade",
  slots: [
    { groups: ["cafe"], label: { ko: "카페", en: "Cafe" } },
    { groups: ["restaurant"], label: { ko: "식사", en: "Meal" } },
    {
      groups: ["activity", "market", "shopping", "bar"],
      label: { ko: "체험·구경", en: "Experience" },
    },
  ],
};

// ─── The 8 themes (Korean-first, English mirror) ─────────────────────────────

export const THEMES: CourseTheme[] = [
  {
    id: "date",
    name: { ko: "데이트 코스", en: "Date Course" },
    tagline: {
      ko: "분위기 좋은 곳만 골라 담은 저녁 데이트",
      en: "A curated evening date.",
    },
    sortBy: "grade",
    slots: [
      { groups: ["cafe"], label: { ko: "카페", en: "Cafe" } },
      { groups: ["restaurant"], label: { ko: "저녁 식사", en: "Dinner" } },
      { groups: ["bar", "activity"], label: { ko: "야경·한잔", en: "Night cap" } },
    ],
  },
  {
    id: "beauty-day",
    name: { ko: "친구와 뷰티 데이", en: "Beauty Day" },
    tagline: {
      ko: "친구와 함께하는 뷰티·쇼핑 하루",
      en: "A beauty and shopping day with friends.",
    },
    sortBy: "grade",
    slots: [
      { groups: ["beauty"], label: { ko: "헤어·네일", en: "Hair & nails" } },
      { groups: ["cafe"], label: { ko: "브런치", en: "Brunch" } },
      { groups: ["shopping", "market"], label: { ko: "쇼핑", en: "Shopping" } },
      { groups: ["restaurant"], label: { ko: "마무리 식사", en: "Dinner" } },
    ],
  },
  {
    id: "medical-tour",
    name: { ko: "메디컬 케어 투어", en: "Medical Care Tour" },
    tagline: {
      ko: "진료부터 회복까지 언어 걱정 없는 동선",
      en: "Clinic to recovery, with language support.",
    },
    // language support matters most at hospitals — sort by ls.
    sortBy: "ls",
    slots: [
      { groups: ["health"], label: { ko: "진료", en: "Clinic" } },
      { groups: ["health"], label: { ko: "약국·처방", en: "Pharmacy" } },
      { groups: ["cafe"], label: { ko: "회복 휴식", en: "Recovery break" } },
      { groups: ["restaurant"], label: { ko: "가벼운 식사", en: "Light meal" } },
    ],
  },
  {
    id: "local-food-double",
    name: { ko: "로컬 음식 2끼", en: "Local Food Double" },
    tagline: {
      ko: "점심과 저녁, 로컬 음식으로 두 끼",
      en: "Two local meals, lunch and dinner.",
    },
    sortBy: "li",
    slots: [
      { groups: ["restaurant"], label: { ko: "로컬 점심", en: "Local lunch" } },
      { groups: ["market"], label: { ko: "시장 구경", en: "Market stroll" } },
      { groups: ["cafe"], label: { ko: "입가심", en: "Coffee" } },
      { groups: ["restaurant"], label: { ko: "로컬 저녁", en: "Local dinner" } },
    ],
  },
  {
    id: "market-crawl",
    name: { ko: "시장 골목 탐방", en: "Market Crawl" },
    tagline: {
      ko: "시장 골목을 누비는 미식 산책",
      en: "A foodie stroll through market alleys.",
    },
    sortBy: "li",
    slots: [
      { groups: ["market"], label: { ko: "시장", en: "Market" } },
      { groups: ["restaurant"], label: { ko: "노포 한 끼", en: "Old-school eats" } },
      { groups: ["cafe"], label: { ko: "쉬어가기", en: "Break" } },
    ],
  },
  {
    id: "night-out",
    name: { ko: "나이트 아웃", en: "Night Out" },
    tagline: {
      ko: "저녁부터 2차까지 이어지는 밤",
      en: "Dinner and drinks into the night.",
    },
    sortBy: "grade",
    slots: [
      { groups: ["restaurant"], label: { ko: "저녁", en: "Dinner" } },
      { groups: ["bar"], label: { ko: "1차", en: "First round" } },
      { groups: ["bar"], label: { ko: "2차", en: "Second round" } },
    ],
  },
  {
    id: "culture-walk",
    name: { ko: "문화 산책", en: "Culture Walk" },
    tagline: {
      ko: "전시와 명소를 잇는 문화 산책",
      en: "A cultural walk of exhibits and landmarks.",
    },
    sortBy: "grade",
    slots: [
      { groups: ["activity"], label: { ko: "전시·문화", en: "Culture" } },
      { groups: ["cafe"], label: { ko: "사색", en: "Coffee" } },
      { groups: ["activity"], label: { ko: "명소 산책", en: "Landmark walk" } },
      { groups: ["restaurant"], label: { ko: "저녁", en: "Dinner" } },
    ],
  },
  {
    id: "self-care",
    name: { ko: "셀프케어 데이", en: "Self-care Day" },
    tagline: {
      ko: "나를 위한 여유로운 셀프케어 하루",
      en: "An easy day of self-care.",
    },
    sortBy: "grade",
    slots: [
      { groups: ["beauty"], label: { ko: "케어", en: "Care" } },
      { groups: ["cafe"], label: { ko: "휴식", en: "Rest" } },
      { groups: ["activity"], label: { ko: "가벼운 산책", en: "Easy stroll" } },
    ],
  },
];

export function themeById(id: string): CourseTheme | undefined {
  return THEMES.find((t) => t.id === id);
}

// ─── Origin helper ───────────────────────────────────────────────────────────

// Geographic centroid of the (region's) candidate places — the composition
// origin. Null when no candidate has coordinates.
export function centroidOf(
  places: CandidatePlace[],
): { lat: number; lng: number } | null {
  const pts = places.filter((p) => p.lat != null && p.lng != null);
  if (pts.length === 0) return null;
  const lat = pts.reduce((s, p) => s + (p.lat as number), 0) / pts.length;
  const lng = pts.reduce((s, p) => s + (p.lng as number), 0) / pts.length;
  return { lat, lng };
}

// ─── Theme quality gate (looser than the patent filter) ──────────────────────

// Keep only places usable in a themed course:
//   • region match when a region is selected (null = all regions)
//   • grade S/A/B only (exclude C, D, ungraded)
//   • per-place price within budget
//   • has coordinates (needed for routing)
// Deliberately NO LI hard gate — collected places carry modest LI.
//
// Language: for beginner/basic users we do NOT hard-gate on ls; instead we apply
// a stable sort-bonus so places with stronger on-site support (ls >= 50) are
// preferred. This matters most at hospitals (the medical theme already sorts by
// ls), but the bonus rides along as the lowest-priority tie-break for every
// theme (composeThemedCourse keeps input order as its final tie-break).
export function filterForTheme(
  places: CandidatePlace[],
  opts: {
    regionId: string | null;
    budgetPerPerson: number;
    languageLevel: LanguageLevel;
  },
): CandidatePlace[] {
  const survivors = places.filter((p) => {
    if (opts.regionId != null && p.regionId !== opts.regionId) return false;
    if (gradeRank(p.grade) < THEME_MIN_GRADE_RANK) return false;
    if (p.priceEstimate > opts.budgetPerPerson) return false;
    if (p.lat == null || p.lng == null) return false;
    return true;
  });

  const lowLang =
    opts.languageLevel === "beginner" || opts.languageLevel === "basic";
  if (!lowLang) return survivors;

  // Stable partition: strong-support places first, order otherwise preserved.
  const strong = survivors.filter((p) => p.ls >= LANG_BONUS_LS);
  const weak = survivors.filter((p) => p.ls < LANG_BONUS_LS);
  return [...strong, ...weak];
}

// ─── Themed composition (greedy, budget-reconciled) ──────────────────────────

function metricValue(p: CandidatePlace, sortBy: CourseTheme["sortBy"]): number {
  if (sortBy === "grade") return gradeRank(p.grade);
  if (sortBy === "li") return p.li;
  return p.ls;
}

interface ThemedStop {
  slot: ThemeSlot;
  place: CandidatePlace;
}

// Compose a themed course. For each slot, among unused candidates whose category
// is in the slot's groups, pick by:
//   (a) the theme's sortBy metric, descending;
//   (b) proximity to the previous stop (origin for stop 0) as the tie-break;
//   (c) input order (carries the language sort-bonus) as the final tie-break.
// When origin is null, stop 0 is simply the highest-metric candidate and every
// later stop routes nearest-neighbor from the one before it.
//
// Budget reconciliation follows compose.ts in spirit (claim 4): swap the most
// expensive stop for a cheaper same-slot candidate; if still over budget, prune
// the most expensive stop down to THEME_MIN_STOPS; null if it still cannot fit.
export function composeThemedCourse(
  candidates: CandidatePlace[],
  theme: CourseTheme,
  opts: {
    budgetPerPerson: number;
    origin: { lat: number; lng: number } | null;
  },
): ComposedCourse | null {
  const indexed = candidates.map((p, i) => ({ p, i }));

  const chosen: ThemedStop[] = [];
  const usedIds = new Set<string>();
  let position: { lat: number; lng: number } | null = opts.origin
    ? { ...opts.origin }
    : null;

  for (const slot of theme.slots) {
    const pool = indexed.filter(
      ({ p }) => !usedIds.has(p.id) && slot.groups.includes(p.category),
    );
    if (pool.length === 0) continue;

    const here = position;
    pool.sort((a, b) => {
      const mv = metricValue(b.p, theme.sortBy) - metricValue(a.p, theme.sortBy);
      if (mv !== 0) return mv;
      if (here) {
        const da = haversineKm(here, {
          lat: a.p.lat as number,
          lng: a.p.lng as number,
        });
        const db = haversineKm(here, {
          lat: b.p.lat as number,
          lng: b.p.lng as number,
        });
        if (Math.abs(da - db) > THEME_TIE_DISTANCE_KM) return da - db;
      }
      return a.i - b.i;
    });

    const pick = pool[0].p;
    chosen.push({ slot, place: pick });
    usedIds.add(pick.id);
    position = { lat: pick.lat as number, lng: pick.lng as number };
  }

  if (chosen.length < THEME_MIN_STOPS) return null;

  // ── Budget reconciliation (claim 4 spirit) ──────────────────────────────────
  const budget = opts.budgetPerPerson;
  const swappedForBudget: string[] = [];
  const sumPrice = (arr: ThemedStop[]) =>
    arr.reduce((acc, s) => acc + s.place.priceEstimate, 0);

  // (a) Swap: replace the most expensive stop with the cheapest unused, same-slot
  //     candidate that is strictly cheaper. Scan stops most-expensive first.
  let guard = candidates.length + theme.slots.length;
  while (sumPrice(chosen) > budget && guard-- > 0) {
    const order = chosen
      .map((s, i) => ({ s, i }))
      .sort((a, b) => b.s.place.priceEstimate - a.s.place.priceEstimate);

    let swapped = false;
    for (const { s, i } of order) {
      const replacement = candidates
        .filter(
          (c) =>
            !usedIds.has(c.id) &&
            s.slot.groups.includes(c.category) &&
            c.lat != null &&
            c.lng != null &&
            c.priceEstimate < s.place.priceEstimate,
        )
        .sort(
          (a, b) =>
            a.priceEstimate - b.priceEstimate || a.slug.localeCompare(b.slug),
        )[0];
      if (replacement) {
        usedIds.delete(s.place.id);
        usedIds.add(replacement.id);
        swappedForBudget.push(s.place.name.en);
        chosen[i] = { slot: s.slot, place: replacement };
        swapped = true;
        break;
      }
    }
    if (!swapped) break;
  }

  // (b) Prune: drop the most expensive stop until within budget or at the floor.
  while (sumPrice(chosen) > budget && chosen.length > THEME_MIN_STOPS) {
    let dropIdx = 0;
    for (let i = 1; i < chosen.length; i++) {
      if (chosen[i].place.priceEstimate > chosen[dropIdx].place.priceEstimate) {
        dropIdx = i;
      }
    }
    usedIds.delete(chosen[dropIdx].place.id);
    chosen.splice(dropIdx, 1);
  }

  if (sumPrice(chosen) > budget) return null;
  if (chosen.length < THEME_MIN_STOPS) return null;

  // ── Build stops + totals (same shape as ComposedCourse) ─────────────────────
  const stops: CourseStop[] = [];
  let prev: { lat: number; lng: number } = opts.origin
    ? { ...opts.origin }
    : { lat: chosen[0].place.lat as number, lng: chosen[0].place.lng as number };
  let totalDistanceKm = 0;
  let totalStay = 0;

  chosen.forEach((s, idx) => {
    const here = { lat: s.place.lat as number, lng: s.place.lng as number };
    const legKm = Math.round(haversineKm(prev, here) * 10) / 10;
    totalDistanceKm += legKm;
    totalStay += s.place.stayMinutes;
    stops.push({ place: s.place, order: idx, slotLabel: s.slot.label, legKm });
    prev = here;
  });

  totalDistanceKm = Math.round(totalDistanceKm * 10) / 10;
  const walkMinutes = Math.round(totalDistanceKm * THEME_WALK_MIN_PER_KM);

  return {
    stops,
    totalBudget: sumPrice(chosen),
    totalMinutes: totalStay + walkMinutes,
    totalDistanceKm,
    swappedForBudget,
  };
}
