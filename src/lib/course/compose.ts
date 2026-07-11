// Module 400 — course composition (S600~S900, claims 4 & 7).
//
// Given an already-filtered candidate pool and the user's course profile, build
// an ordered half-day / full-day course:
//
//   S600  slot template selection (by duration)
//   S700  greedy nearest-neighbor stop selection with type diversity
//   S800  budget reconciliation (claim 4): swap, then trim optional slots
//   S900  totals (budget / time / distance)
//
// Time-constrained placement (claim 7) is encoded in the slot template: meal
// places only occupy meal slots, and screening-type places only fit the
// afternoon culture slot (they never match the explore group — see below).
//
// Fully deterministic: stable sorts, explicit tie-breaks, no randomness.

import { haversineKm, type LatLng } from "./geo";
import type {
  CandidatePlace,
  ComposedCourse,
  CourseProfile,
  CourseStop,
} from "./types";

// ─── Count targets by duration (documented interpretation of 실시예) ─────────
export const HALF_MIN_STOPS = 3;
export const HALF_MAX_STOPS = 4;
export const FULL_MIN_STOPS = 5;
export const FULL_MAX_STOPS = 7;

// Type diversity: at most this many places of the same category per course.
export const MAX_SAME_CATEGORY = 2;

// Two candidates whose distances differ by <= this are treated as equidistant,
// and the higher-LI one wins (nearest-neighbor tie-break).
export const TIE_DISTANCE_KM = 0.5;

// Walking-time estimate: minutes spent walking per kilometer of leg.
export const WALK_MIN_PER_KM = 15;

// ─── Category group matchers (slot ↔ candidate) ─────────────────────────────

function isMeal(p: CandidatePlace): boolean {
  return p.category === "restaurant";
}
function isCafe(p: CandidatePlace): boolean {
  return p.category === "cafe";
}
const CULTURE_CATEGORIES = new Set([
  "activity",
  "culture",
  "cinema",
  "performance",
]);
function isCulture(p: CandidatePlace): boolean {
  return CULTURE_CATEGORIES.has(p.category);
}
// Explore = experiential, non-dining, non-screening. Excluding screening keeps
// time-constrained screenings out of the (morning/pre-dinner) explore slots so
// they can only land in the afternoon culture slot (claim 7).
function isExplore(p: CandidatePlace): boolean {
  return !isMeal(p) && !isCafe(p) && p.timeSlot !== "screening";
}

interface Slot {
  match: (p: CandidatePlace) => boolean;
  label: { ko: string; en: string };
  optional: boolean; // trimmable down to the duration's minimum count
}

// Half-day: meal → cafe → culture(screening ok), optional local stroll.
const HALF_TEMPLATE: Slot[] = [
  { match: isMeal, label: { ko: "점심 - 로컬 맛집", en: "Lunch - Local eats" }, optional: false },
  { match: isCafe, label: { ko: "카페 - 동네 카페", en: "Cafe - Neighborhood cafe" }, optional: false },
  { match: isCulture, label: { ko: "오후 - 문화/체험", en: "Afternoon - Culture/experience" }, optional: false },
  { match: isExplore, label: { ko: "탐방 - 로컬 산책", en: "Explore - Local stroll" }, optional: true },
];

// Full-day: brunch cafe → explore → lunch → afternoon culture/screening →
// dessert cafe → optional stroll → optional dinner (trimmed to 5-7).
const FULL_TEMPLATE: Slot[] = [
  { match: isCafe, label: { ko: "오전 - 브런치 카페", en: "Morning - Brunch cafe" }, optional: false },
  { match: isExplore, label: { ko: "오전 - 로컬 탐방", en: "Morning - Local exploring" }, optional: false },
  { match: isMeal, label: { ko: "점심 - 로컬 맛집", en: "Lunch - Local eats" }, optional: false },
  { match: isCulture, label: { ko: "오후 - 문화/상영", en: "Afternoon - Culture/screening" }, optional: false },
  { match: isCafe, label: { ko: "오후 - 디저트 카페", en: "Afternoon - Dessert cafe" }, optional: false },
  { match: isExplore, label: { ko: "저녁 전 - 로컬 산책", en: "Pre-dinner - Local stroll" }, optional: true },
  { match: isMeal, label: { ko: "저녁 - 로컬 맛집", en: "Dinner - Local eats" }, optional: true },
];

// A stop under construction: which slot it fills + the chosen place.
interface WorkingStop {
  slot: Slot;
  place: CandidatePlace;
}

function coords(p: CandidatePlace): LatLng {
  // Filtering already excluded null coordinates; assert non-null for routing.
  return { lat: p.lat as number, lng: p.lng as number };
}

// Nearest-neighbor pick with tie-break: among `pool`, the candidate nearest to
// `from`; within TIE_DISTANCE_KM treat as equidistant and prefer higher LI, then
// lower slug for a fully deterministic result.
function pickNearest(
  from: LatLng,
  pool: CandidatePlace[],
): CandidatePlace | null {
  let best: CandidatePlace | null = null;
  let bestDist = Infinity;
  for (const cand of pool) {
    const d = haversineKm(from, coords(cand));
    if (best === null) {
      best = cand;
      bestDist = d;
      continue;
    }
    if (Math.abs(d - bestDist) <= TIE_DISTANCE_KM) {
      // Tie on distance → higher LI, then lower slug.
      if (cand.li > best.li || (cand.li === best.li && cand.slug < best.slug)) {
        best = cand;
        bestDist = d;
      }
    } else if (d < bestDist) {
      best = cand;
      bestDist = d;
    }
  }
  return best;
}

function categoryCounts(stops: WorkingStop[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const s of stops) {
    counts.set(s.place.category, (counts.get(s.place.category) ?? 0) + 1);
  }
  return counts;
}

// Candidates eligible for `slot`: match the slot group, unused, and not
// exceeding the per-category diversity cap given the already-chosen stops.
function eligibleForSlot(
  slot: Slot,
  pool: CandidatePlace[],
  usedIds: Set<string>,
  counts: Map<string, number>,
): CandidatePlace[] {
  return pool.filter(
    (p) =>
      !usedIds.has(p.id) &&
      slot.match(p) &&
      (counts.get(p.category) ?? 0) < MAX_SAME_CATEGORY,
  );
}

export function composeCourse(
  candidates: CandidatePlace[],
  profile: CourseProfile,
): ComposedCourse | null {
  const template = profile.duration === "half" ? HALF_TEMPLATE : FULL_TEMPLATE;
  const minStops = profile.duration === "half" ? HALF_MIN_STOPS : FULL_MIN_STOPS;

  // Not enough raw material to reach the minimum course length.
  if (candidates.length < minStops) return null;

  // ── S700 — greedy nearest-neighbor fill, slot by slot from the origin ──────
  const chosen: WorkingStop[] = [];
  const usedIds = new Set<string>();
  let position: LatLng = { ...profile.origin };

  for (const slot of template) {
    const counts = categoryCounts(chosen);
    const pool = eligibleForSlot(slot, candidates, usedIds, counts);
    const pick = pickNearest(position, pool);
    if (pick === null) continue; // slot unfillable → skip (optional or not)
    chosen.push({ slot, place: pick });
    usedIds.add(pick.id);
    position = coords(pick);
  }

  if (chosen.length < minStops) return null;

  // ── S800 — budget reconciliation (claim 4) ────────────────────────────────
  const swappedForBudget: string[] = [];
  const budget = profile.budgetPerPerson;
  const sumPrice = (stops: WorkingStop[]) =>
    stops.reduce((acc, s) => acc + s.place.priceEstimate, 0);

  // (a) Swap: while over budget, replace the most expensive stop with the
  //     cheapest unused, slot-valid, diversity-safe candidate that is cheaper.
  //     Scan stops most-expensive first; take the first beneficial swap.
  let guard = candidates.length + template.length; // bound iterations
  while (sumPrice(chosen) > budget && guard-- > 0) {
    const order = chosen
      .map((s, i) => ({ s, i }))
      .sort((a, b) => b.s.place.priceEstimate - a.s.place.priceEstimate);

    let swapped = false;
    for (const { s, i } of order) {
      // Diversity counts excluding the stop we are replacing.
      const counts = categoryCounts(chosen.filter((_, j) => j !== i));
      const replacement = eligibleForSlot(s.slot, candidates, usedIds, counts)
        .filter((c) => c.priceEstimate < s.place.priceEstimate)
        .sort(
          (a, b) => a.priceEstimate - b.priceEstimate || a.slug.localeCompare(b.slug),
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

  // (b) Trim: if still over budget, drop the most expensive OPTIONAL stop until
  //     within budget or at the minimum count.
  while (sumPrice(chosen) > budget && chosen.length > minStops) {
    const optional = chosen
      .map((s, i) => ({ s, i }))
      .filter((x) => x.s.slot.optional)
      .sort((a, b) => b.s.place.priceEstimate - a.s.place.priceEstimate);
    if (optional.length === 0) break;
    const drop = optional[0].i;
    usedIds.delete(chosen[drop].place.id);
    chosen.splice(drop, 1);
  }

  // Budget cannot be met even at the minimum course length → no course.
  if (sumPrice(chosen) > budget) return null;
  if (chosen.length < minStops) return null;

  // ── S900 — build stops + totals ───────────────────────────────────────────
  const stops: CourseStop[] = [];
  let prev: LatLng = { ...profile.origin };
  let totalDistanceKm = 0;
  let totalStay = 0;

  chosen.forEach((ws, idx) => {
    const here = coords(ws.place);
    const legKm = Math.round(haversineKm(prev, here) * 10) / 10;
    totalDistanceKm += legKm;
    totalStay += ws.place.stayMinutes;
    stops.push({ place: ws.place, order: idx, slotLabel: ws.slot.label, legKm });
    prev = here;
  });

  totalDistanceKm = Math.round(totalDistanceKm * 10) / 10;
  const walkMinutes = Math.round(totalDistanceKm * WALK_MIN_PER_KM);

  return {
    stops,
    totalBudget: sumPrice(chosen),
    totalMinutes: totalStay + walkMinutes,
    totalDistanceKm,
    swappedForBudget,
  };
}
