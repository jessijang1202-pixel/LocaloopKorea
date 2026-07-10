// Grading engine — browser-side DB access (patent no.2).
//
// Uses the anon Supabase browser client. Every function throws a clear Error
// when Supabase is not configured, so callers can surface a useful message
// instead of hitting a null client.

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import {
  computeFS,
  WEIGHTS_BY_TYPE,
  type GradingPlaceType,
  type SubScores,
} from "@/lib/grading";
import type {
  GradingSourceRow,
  GradingSourceType,
  PlaceGradeDetailsRow,
} from "@/types/grading";

function requireConfigured() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
}

// Maps a places.category value to a grading weight profile. IDENTICAL to the
// CASE in supabase/migrations/20260710_grading_engine.sql (compute_place_grade):
//   'restaurant','bar' -> restaurant   (dining: language + local-fit matter)
//   'cafe'             -> cafe (== restaurant profile)
//   'health'           -> public       (access-restriction weighted heavily)
//   'activity'         -> culture
//   'accommodation'    -> accommodation
//   anything else      -> default
export function mapCategoryToGradingType(category: string): GradingPlaceType {
  switch (category) {
    case "restaurant":
    case "bar":
      return "restaurant";
    case "cafe":
      return "cafe";
    case "health":
      return "public";
    case "activity":
      return "culture";
    case "accommodation":
      return "accommodation";
    default:
      return "default";
  }
}

// ── Places + grade details ───────────────────────────────────────────────────

export interface PlaceGradeColumns {
  id: string;
  name_ko: string;
  name_en: string | null;
  slug: string;
  category: string;
  grade: string | null;
  grade_override: string | null;
  ls_score: number;
  ar_score: number;
  pd_score: number;
  lf_score: number;
}

export interface PlaceWithGrade extends PlaceGradeColumns {
  details: PlaceGradeDetailsRow | null;
}

const PLACE_COLUMNS =
  "id,name_ko,name_en,slug,category,grade,grade_override,ls_score,ar_score,pd_score,lf_score";

// Two queries (places + place_grade_details) merged client-side on place_id.
export async function fetchPlacesWithGrades(): Promise<PlaceWithGrade[]> {
  requireConfigured();
  const supabase = createClient();

  const [placesRes, detailsRes] = await Promise.all([
    supabase.from("places").select(PLACE_COLUMNS).order("name_ko"),
    supabase.from("place_grade_details").select("*"),
  ]);

  if (placesRes.error) throw new Error(placesRes.error.message);
  if (detailsRes.error) throw new Error(detailsRes.error.message);

  const places = (placesRes.data ?? []) as unknown as PlaceGradeColumns[];
  const details = (detailsRes.data ?? []) as unknown as PlaceGradeDetailsRow[];

  const byPlace = new Map<string, PlaceGradeDetailsRow>();
  for (const d of details) byPlace.set(d.place_id, d);

  return places.map((p) => ({ ...p, details: byPlace.get(p.id) ?? null }));
}

// ── Sources (module 100) ─────────────────────────────────────────────────────

export async function fetchSources(
  placeId: string
): Promise<GradingSourceRow[]> {
  requireConfigured();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("grading_sources")
    .select("*")
    .eq("place_id", placeId)
    .order("collected_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as GradingSourceRow[];
}

export async function addSource(
  placeId: string,
  sourceType: GradingSourceType,
  content: string,
  url?: string
): Promise<GradingSourceRow> {
  requireConfigured();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("grading_sources")
    .insert({
      place_id: placeId,
      source_type: sourceType,
      content,
      url: url ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as unknown as GradingSourceRow;
}

export async function updateSource(
  id: string,
  patch: Partial<
    Pick<GradingSourceRow, "source_type" | "content" | "url" | "collected_at">
  >
): Promise<GradingSourceRow> {
  requireConfigured();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("grading_sources")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as unknown as GradingSourceRow;
}

export async function deleteSource(id: string): Promise<void> {
  requireConfigured();
  const supabase = createClient();
  const { error } = await supabase.from("grading_sources").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ── Manual scoring / overrides ───────────────────────────────────────────────

// Write manually-entered sub-scores. The DB trigger recomputes places.grade
// from the ints. fs is computed app-side so the details row stays consistent.
export async function saveManualScores(
  placeId: string,
  scores: SubScores
): Promise<void> {
  requireConfigured();
  const supabase = createClient();

  const ls = Math.round(scores.LS);
  const ar = Math.round(scores.AR);
  const pd = Math.round(scores.PD);
  const lf = Math.round(scores.LF);

  const { data: placeRow, error: placeErr } = await supabase
    .from("places")
    .update({ ls_score: ls, ar_score: ar, pd_score: pd, lf_score: lf })
    .eq("id", placeId)
    .select("category")
    .single();
  if (placeErr) throw new Error(placeErr.message);

  const category = (placeRow as { category: string } | null)?.category ?? "";
  const placeType = mapCategoryToGradingType(category);
  const rounded: SubScores = { LS: ls, AR: ar, PD: pd, LF: lf };
  const fs = computeFS(rounded, placeType);

  const { error: detailsErr } = await supabase
    .from("place_grade_details")
    .upsert(
      {
        place_id: placeId,
        fs,
        place_type: placeType,
        weights: WEIGHTS_BY_TYPE[placeType],
        manual_override: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "place_id" }
    );
  if (detailsErr) throw new Error(detailsErr.message);
}

export async function setGradeOverride(
  placeId: string,
  grade: string | null,
  reason?: string
): Promise<void> {
  requireConfigured();
  const supabase = createClient();
  const { error } = await supabase
    .from("places")
    .update({
      grade_override: grade,
      grade_override_reason: grade ? reason ?? null : null,
    })
    .eq("id", placeId);
  if (error) throw new Error(error.message);
}

export async function clearManualOverride(placeId: string): Promise<void> {
  requireConfigured();
  const supabase = createClient();
  const { error } = await supabase
    .from("place_grade_details")
    .update({ manual_override: false, updated_at: new Date().toISOString() })
    .eq("place_id", placeId);
  if (error) throw new Error(error.message);
}

// ── Recompute (delegates to the server route) ────────────────────────────────

export interface RecomputeResult {
  total: number;
  updated: number;
  skipped: number;
  errors: string[];
}

async function postRecompute(
  body: Record<string, unknown>
): Promise<RecomputeResult> {
  const res = await fetch("/api/admin/grading/recompute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as RecomputeResult & { error?: string };
  if (!res.ok) {
    throw new Error(json.error ?? `Recompute failed (${res.status})`);
  }
  return json;
}

export async function recomputeGrade(placeId: string): Promise<RecomputeResult> {
  return postRecompute({ placeId });
}

export async function recomputeAll(force = false): Promise<RecomputeResult> {
  return postRecompute({ all: true, force });
}
