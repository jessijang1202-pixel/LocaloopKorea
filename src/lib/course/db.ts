// Course engine — browser-side DB access (patent no.3).
//
// Uses the anon Supabase browser client, mirroring src/lib/grading/db.ts:
// every function throws a clear Error when Supabase is not configured so
// callers can surface a useful message instead of hitting a null client.
//
// The public-facing course builder should prefer fetchCandidatePlacesWithFallback
// so the feature keeps working (on seed demo data) before the 20260711 migration
// is applied to the live database.

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { fetchAllRows } from "@/lib/supabase/fetch-all";
import { computeLI, adjustLIWithFeedback } from "@/lib/course";
import type {
  CandidatePlace,
  ComposedCourse,
  CourseProfile,
} from "@/lib/course";
import type { GradeLetter } from "@/lib/grading";
import type {
  CourseFeedbackCourseSnapshot,
  CourseFeedbackRow,
  PlaceLocalMetricsRow,
} from "@/types/course";
import { SEED_PLACES, SEED_REGIONS } from "@/data/seed";

function requireConfigured() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
}

// ── Column lists / shared defaults ───────────────────────────────────────────

// places columns needed to build a CandidatePlace (grade/ls come from patent-2).
const PLACE_COLUMNS =
  "id,slug,name_ko,name_en,category,region_id,lat,lng,image_url,ls_score,grade";

interface PlaceCandidateColumns {
  id: string;
  slug: string;
  name_ko: string;
  name_en: string | null;
  category: string;
  region_id: string | null;
  lat: number | null;
  lng: number | null;
  image_url: string | null;
  ls_score: number | null;
  grade: string | null;
}

// Mirrors the column DEFAULTs in place_local_metrics: a place with no metrics
// row is treated as if it had these values. li defaults to 0, which the module
// 300 filter (SAFE_LI_MIN / BOLD_LI_MIN) rejects — so an un-scored place is
// effectively filtered out of composed courses until locality recompute runs.
const METRIC_DEFAULTS = {
  korean_review_ratio: 0.5,
  foreign_visitor_ratio: 0.5,
  korean_search_ratio: 0.5,
  local_keyword_score: 0,
  li: 0,
  price_estimate: 10000,
  stay_minutes: 60,
  english_subtitles: false,
  time_slot: null as "meal" | "screening" | null,
} as const;

// The four LI input factors — patch touching any of them triggers a recompute.
const INPUT_FACTOR_KEYS = [
  "korean_review_ratio",
  "foreign_visitor_ratio",
  "korean_search_ratio",
  "local_keyword_score",
] as const;

// Infer a time slot for places whose slot was never set: dining venues occupy a
// meal slot so course composition can space them apart (claim 7). Documented
// inference — anything else stays unconstrained (null).
function inferTimeSlot(
  category: string,
  stored: "meal" | "screening" | null
): "meal" | "screening" | null {
  if (stored) return stored;
  if (category === "restaurant" || category === "bar") return "meal";
  return null;
}

function toCandidate(
  place: PlaceCandidateColumns,
  metrics: Pick<
    PlaceLocalMetricsRow,
    | "li"
    | "foreign_visitor_ratio"
    | "price_estimate"
    | "stay_minutes"
    | "english_subtitles"
    | "time_slot"
  >
): CandidatePlace {
  return {
    id: place.id,
    slug: place.slug,
    name: { ko: place.name_ko, en: place.name_en ?? place.name_ko },
    category: place.category,
    regionId: place.region_id ?? null,
    lat: place.lat,
    lng: place.lng,
    imageUrl: place.image_url ?? null,
    li: metrics.li,
    ls: place.ls_score ?? 0,
    grade: (place.grade as GradeLetter | null) ?? null,
    foreignVisitorRatio: metrics.foreign_visitor_ratio,
    priceEstimate: metrics.price_estimate,
    stayMinutes: metrics.stay_minutes,
    englishSubtitles: metrics.english_subtitles,
    timeSlot: inferTimeSlot(place.category, metrics.time_slot),
  };
}

// ── Candidate places (module 200 input) ──────────────────────────────────────

// Two queries (places + place_local_metrics) merged client-side on place_id,
// mirroring fetchPlacesWithGrades(). Places without a metrics row fall back to
// METRIC_DEFAULTS (li 0 → filtered out downstream; see METRIC_DEFAULTS note).
export async function fetchCandidatePlaces(): Promise<CandidatePlace[]> {
  requireConfigured();
  const supabase = createClient();

  const [places, metrics] = await Promise.all([
    fetchAllRows<PlaceCandidateColumns>((from, to) =>
      supabase.from("places").select(PLACE_COLUMNS).order("name_ko").range(from, to)
    ),
    fetchAllRows<PlaceLocalMetricsRow>((from, to) =>
      supabase.from("place_local_metrics").select("*").order("place_id").range(from, to)
    ),
  ]);

  const byPlace = new Map<string, PlaceLocalMetricsRow>();
  for (const m of metrics) byPlace.set(m.place_id, m);

  return places.map((p) => toCandidate(p, byPlace.get(p.id) ?? METRIC_DEFAULTS));
}

// ── Metrics read/write (module 100 storage) ──────────────────────────────────

// All metrics rows at once — used by the admin locality page to merge with the
// places list client-side (same two-query pattern as fetchCandidatePlaces).
export async function fetchAllMetrics(): Promise<PlaceLocalMetricsRow[]> {
  requireConfigured();
  const supabase = createClient();
  return fetchAllRows<PlaceLocalMetricsRow>((from, to) =>
    supabase.from("place_local_metrics").select("*").order("place_id").range(from, to)
  );
}

export async function fetchMetrics(
  placeId: string
): Promise<PlaceLocalMetricsRow | null> {
  requireConfigured();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("place_local_metrics")
    .select("*")
    .eq("place_id", placeId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as PlaceLocalMetricsRow | null) ?? null;
}

// Fields an admin can edit directly. `li` is derived, `manual_override` is
// forced true here, and the timestamps are managed by this function.
export type PlaceMetricsPatch = Partial<
  Pick<
    PlaceLocalMetricsRow,
    | "korean_review_ratio"
    | "foreign_visitor_ratio"
    | "korean_search_ratio"
    | "local_keyword_score"
    | "price_estimate"
    | "stay_minutes"
    | "english_subtitles"
    | "time_slot"
  >
>;

// Admin manual edit: upsert the patch with manual_override=true. When the patch
// touches any of the four LI input factors we recompute `li` app-side via
// computeLI, fetch-merge-then-compute so a partial edit still uses the stored
// values for the untouched factors.
export async function saveMetrics(
  placeId: string,
  patch: PlaceMetricsPatch
): Promise<void> {
  requireConfigured();
  const supabase = createClient();

  const touchesInputs = INPUT_FACTOR_KEYS.some((k) => k in patch);

  let li: number | undefined;
  if (touchesInputs) {
    const { data: existing, error } = await supabase
      .from("place_local_metrics")
      .select(
        "korean_review_ratio,foreign_visitor_ratio,korean_search_ratio,local_keyword_score"
      )
      .eq("place_id", placeId)
      .maybeSingle();
    if (error) throw new Error(error.message);

    const stored = (existing ?? {}) as Partial<PlaceLocalMetricsRow>;
    const merged = {
      korean_review_ratio:
        patch.korean_review_ratio ??
        stored.korean_review_ratio ??
        METRIC_DEFAULTS.korean_review_ratio,
      foreign_visitor_ratio:
        patch.foreign_visitor_ratio ??
        stored.foreign_visitor_ratio ??
        METRIC_DEFAULTS.foreign_visitor_ratio,
      korean_search_ratio:
        patch.korean_search_ratio ??
        stored.korean_search_ratio ??
        METRIC_DEFAULTS.korean_search_ratio,
      local_keyword_score:
        patch.local_keyword_score ??
        stored.local_keyword_score ??
        METRIC_DEFAULTS.local_keyword_score,
    };
    li = computeLI({
      koreanReviewRatio: merged.korean_review_ratio,
      foreignVisitorRatio: merged.foreign_visitor_ratio,
      koreanSearchRatio: merged.korean_search_ratio,
      localKeywordScore: merged.local_keyword_score,
    });
  }

  const now = new Date().toISOString();
  const { error } = await supabase.from("place_local_metrics").upsert(
    {
      place_id: placeId,
      ...patch,
      ...(li !== undefined ? { li } : {}),
      manual_override: true,
      updated_at: now,
    },
    { onConflict: "place_id" }
  );
  if (error) throw new Error(error.message);
}

// ── Feedback + dynamic LI correction (claim 5) ───────────────────────────────

export interface CourseFeedbackResult {
  saved: boolean; // feedback row inserted
  corrected: boolean; // per-stop LI correction written back
}

// Insert a course_feedback row (minimal course snapshot + profile) and then, per
// claim 5, immediately nudge each stop's stored LI toward the observed local
// feel. The correction is best-effort: a failure there must not surface to the
// UI, so we still report { saved: true, corrected: false }.
export async function submitCourseFeedback(
  course: ComposedCourse,
  profile: CourseProfile,
  rating: number,
  localFeel: number,
  comment?: string
): Promise<CourseFeedbackResult> {
  requireConfigured();
  const supabase = createClient();

  const snapshot: CourseFeedbackCourseSnapshot = {
    stops: course.stops.map((s) => ({
      placeId: s.place.id,
      name: s.place.name,
      order: s.order,
    })),
    totalBudget: course.totalBudget,
    totalMinutes: course.totalMinutes,
    totalDistanceKm: course.totalDistanceKm,
  };

  const { data: inserted, error: insertErr } = await supabase
    .from("course_feedback")
    .insert({
      course: snapshot,
      profile,
      rating,
      local_feel: localFeel,
      comment: comment ?? null,
      applied: false,
    })
    .select("id")
    .single();
  if (insertErr) throw new Error(insertErr.message);

  const feedbackId = (inserted as { id: string } | null)?.id ?? null;

  try {
    const feedback = { rating, localFeel };
    const now = new Date().toISOString();

    for (const stop of course.stops) {
      const { data: metricRow, error: metricErr } = await supabase
        .from("place_local_metrics")
        .select("li")
        .eq("place_id", stop.place.id)
        .maybeSingle();
      if (metricErr) throw new Error(metricErr.message);

      const currentLi =
        (metricRow as { li: number } | null)?.li ?? stop.place.li;
      const nextLi = adjustLIWithFeedback(currentLi, feedback);

      const { error: updErr } = await supabase
        .from("place_local_metrics")
        .upsert(
          { place_id: stop.place.id, li: nextLi, updated_at: now },
          { onConflict: "place_id" }
        );
      if (updErr) throw new Error(updErr.message);
    }

    if (feedbackId) {
      await supabase
        .from("course_feedback")
        .update({ applied: true })
        .eq("id", feedbackId);
    }

    return { saved: true, corrected: true };
  } catch {
    // Feedback is recorded; the LI write-back failed. Do not throw to the UI.
    return { saved: true, corrected: false };
  }
}

// ── Feedback admin read/delete (module 500 review) ───────────────────────────

// Most-recent course_feedback rows for the admin locality review list.
export async function fetchCourseFeedback(
  limit = 50
): Promise<CourseFeedbackRow[]> {
  requireConfigured();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("course_feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as CourseFeedbackRow[];
}

export async function deleteCourseFeedback(id: string): Promise<void> {
  requireConfigured();
  const supabase = createClient();
  const { error } = await supabase
    .from("course_feedback")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}

// ── Seed fallback (feature works before the migration is applied) ─────────────

// Deterministic FNV-ish hash of a place id — used to spread demo LI / foreign
// ratios without Math.random (must be stable across renders/builds).
function hashId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Category-driven demo defaults, documented as DEMO DATA.
function seedPriceEstimate(category: string): number {
  switch (category) {
    case "restaurant":
      return 15000;
    case "cafe":
      return 7000;
    case "bar":
      return 20000;
    case "activity":
      // Kept below 8000 so the default demo profile (30000 KRW, half-day:
      // meal 15000 + cafe 7000 + activity 8000 = 30000) composes successfully.
      return 8000;
    default:
      return 10000;
  }
}

function seedStayMinutes(category: string): number {
  switch (category) {
    case "restaurant":
      return 60;
    case "cafe":
      return 45;
    case "activity":
      return 90;
    default:
      return 60;
  }
}

// Map SEED_PLACES to CandidatePlace with deterministic DEMO DATA. Values are
// derived from the seed flags (english_support / card_payment / solo_friendly)
// and a stable id hash — NEVER Math.random — so the demo is reproducible.
function seedCandidates(): CandidatePlace[] {
  return SEED_PLACES.map((p) => {
    const h = hashId(p.id);
    const category = p.category;

    // DEMO DATA: li 72-92 spread by id hash; ls by english support; grade by the
    // three friendliness flags; foreign ratio 0.05-0.30 by id hash.
    const li = 72 + (h % 21); // 72..92
    const ls = p.english_support ? 85 : 55;
    const grade: GradeLetter =
      p.english_support && p.card_payment && p.solo_friendly
        ? "S"
        : p.english_support
          ? "A"
          : "B";
    const foreignVisitorRatio =
      Math.round((0.05 + (h % 26) / 100) * 100) / 100; // 0.05..0.30

    return {
      id: p.id,
      slug: p.slug,
      name: { ko: p.name_ko, en: p.name_en },
      category,
      regionId: p.region_id ?? null,
      lat: p.lat,
      lng: p.lng,
      imageUrl: p.image_url ?? null,
      li,
      ls,
      grade,
      foreignVisitorRatio,
      priceEstimate: seedPriceEstimate(category),
      stayMinutes: seedStayMinutes(category),
      englishSubtitles: category === "activity",
      timeSlot:
        category === "restaurant" || category === "bar" ? "meal" : null,
    };
  });
}

// Try the live DB; on error (e.g. Supabase not configured / migration not yet
// applied) or an empty result, fall back to the seed demo dataset. Lets the
// user-facing course builder work end-to-end before infra is provisioned.
export async function fetchCandidatePlacesWithFallback(): Promise<{
  places: CandidatePlace[];
  source: "db" | "seed";
}> {
  try {
    const places = await fetchCandidatePlaces();
    if (places.length === 0) return { places: seedCandidates(), source: "seed" };
    return { places, source: "db" };
  } catch {
    return { places: seedCandidates(), source: "seed" };
  }
}

// ── Region options (themed course area picker) ───────────────────────────────

export interface RegionOption {
  id: string;
  name_ko: string;
  name_en: string;
  placeCount: number;
}

// SEED_REGIONS mapped with place counts from SEED_PLACES — used both as the
// error fallback for fetchRegionOptions and (implicitly) to keep the picker
// working before the collected-places dataset is live.
function seedRegionOptions(): RegionOption[] {
  const counts = new Map<string, number>();
  for (const p of SEED_PLACES) {
    if (p.region_id == null) continue;
    counts.set(p.region_id, (counts.get(p.region_id) ?? 0) + 1);
  }
  return SEED_REGIONS.map((r) => ({
    id: r.id,
    name_ko: r.name_ko,
    name_en: r.name_en,
    placeCount: counts.get(r.id) ?? 0,
  }))
    .filter((r) => r.placeCount > 0)
    .sort((a, b) => b.placeCount - a.placeCount);
}

// Regions joined with a client-side places count (two queries), sorted by
// placeCount desc, excluding regions with 0 places. On error (or empty) fall
// back to the seed regions so the area picker always has options.
export async function fetchRegionOptions(): Promise<RegionOption[]> {
  try {
    requireConfigured();
    const supabase = createClient();

    const [regions, places] = await Promise.all([
      fetchAllRows<{ id: string; name_ko: string; name_en: string | null }>(
        (from, to) =>
          supabase.from("regions").select("id,name_ko,name_en").order("id").range(from, to)
      ),
      fetchAllRows<{ region_id: string | null }>((from, to) =>
        supabase.from("places").select("region_id").order("id").range(from, to)
      ),
    ]);

    const counts = new Map<string, number>();
    for (const p of places) {
      if (p.region_id == null) continue;
      counts.set(p.region_id, (counts.get(p.region_id) ?? 0) + 1);
    }

    const options = regions
      .map((r) => ({
        id: r.id,
        name_ko: r.name_ko,
        name_en: r.name_en ?? r.name_ko,
        placeCount: counts.get(r.id) ?? 0,
      }))
      .filter((r) => r.placeCount > 0)
      .sort((a, b) => b.placeCount - a.placeCount);

    if (options.length === 0) return seedRegionOptions();
    return options;
  } catch {
    return seedRegionOptions();
  }
}
