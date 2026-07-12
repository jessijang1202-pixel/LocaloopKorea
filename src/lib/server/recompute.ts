// Shared per-place recompute helpers (patent no.2 grading + no.3 locality).
//
// Extracted from the two recompute routes so the collection route can reuse the
// EXACT same per-place logic for newly collected places. Behavior is identical
// to the original inline loop bodies:
//   - grading:  load grading_sources → gradePlace() → write sub-scores on
//               `places` (DB trigger sets the letter grade) + upsert
//               place_grade_details.
//   - locality: read stored ratio factors (or column defaults), derive the
//               local_keyword_score from the collected text, fuse with
//               computeLI(), upsert place_local_metrics.
//
// Each helper throws on any DB error (mirroring the original try/catch loop
// bodies) and returns "updated" | "skipped" so callers can tally results.

import type { createClient } from "@/lib/supabase/server";
import { gradePlace, extractKeywords } from "@/lib/grading";
import { mapCategoryToGradingType } from "@/lib/grading/db";
import { computeLI } from "@/lib/course";

export type SupabaseServer = Awaited<ReturnType<typeof createClient>>;

export type RecomputeOutcome = "updated" | "skipped";

// ── Grading (patent no.2) ────────────────────────────────────────────────────

// Recompute one place's grade from its collected grading_sources. Skips places
// with no source text, or with a manual_override (unless force). Writes the four
// sub-scores on `places` (the places_grade_trigger recomputes the letter grade)
// and upserts the place_grade_details row.
export async function recomputeGradingForPlace(
  supabase: SupabaseServer,
  placeId: string,
  category: string | null,
  force: boolean
): Promise<RecomputeOutcome> {
  // Load collected source text (module 100).
  const { data: sourcesData, error: sourcesErr } = await supabase
    .from("grading_sources")
    .select("content")
    .eq("place_id", placeId);
  if (sourcesErr) throw new Error(sourcesErr.message);

  const contents = (sourcesData ?? [])
    .map((s) => (s as { content: string | null }).content ?? "")
    .filter((c) => c.trim().length > 0);

  if (contents.length === 0) {
    return "skipped";
  }

  // Respect a manual override unless force is set.
  const { data: detailRow, error: detailErr } = await supabase
    .from("place_grade_details")
    .select("manual_override")
    .eq("place_id", placeId)
    .maybeSingle();
  if (detailErr) throw new Error(detailErr.message);

  if (
    !force &&
    (detailRow as { manual_override: boolean } | null)?.manual_override
  ) {
    return "skipped";
  }

  const placeType = mapCategoryToGradingType(category ?? "");
  const graded = gradePlace(contents, placeType);
  const { subScores } = graded;

  // Write sub-scores; the places_grade_trigger recomputes the letter grade.
  const { error: updErr } = await supabase
    .from("places")
    .update({
      ls_score: Math.round(subScores.LS),
      ar_score: Math.round(subScores.AR),
      pd_score: Math.round(subScores.PD),
      lf_score: Math.round(subScores.LF),
    })
    .eq("id", placeId);
  if (updErr) throw new Error(updErr.message);

  const { error: upsertErr } = await supabase
    .from("place_grade_details")
    .upsert(
      {
        place_id: placeId,
        fs: graded.fs,
        place_type: placeType,
        weights: graded.weights,
        evidence: graded.evidence,
        risk_flags: graded.riskFlags,
        manual_override: false,
        computed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "place_id" }
    );
  if (upsertErr) throw new Error(upsertErr.message);

  return "updated";
}

// ── Locality (patent no.3, module 100) ───────────────────────────────────────

interface MetricsRow {
  korean_review_ratio: number;
  foreign_visitor_ratio: number;
  korean_search_ratio: number;
  manual_override: boolean;
}

// Defaults mirror the place_local_metrics column DEFAULTs so a place with no
// row still recomputes.
const RATIO_DEFAULTS = {
  korean_review_ratio: 0.5,
  foreign_visitor_ratio: 0.5,
  korean_search_ratio: 0.5,
} as const;

// local_keyword_score interpretation (documented, patent leaves it to policy):
// each distinct LF-category positive keyword rule that fired contributes a base
// amount, and every additional occurrence adds a smaller amount; capped at 100.
const LF_DISTINCT_RULE_POINTS = 25;
const LF_OCCURRENCE_POINTS = 5;
const LOCAL_KEYWORD_SCORE_MAX = 100;

// Derive the module-100 local-keyword signal from collected web text using the
// patent-2 keyword dictionary, counting only positive LF ("local-experience
// fit") hits — those are the ones that mark a place as genuinely local.
export function deriveLocalKeywordScore(contents: string[]): number {
  const hits = extractKeywords(contents);
  const lfPositive = hits.filter(
    (h) => h.category === "LF" && h.polarity === "positive"
  );
  const distinctRules = lfPositive.length; // one hit per fired rule
  const totalOccurrences = lfPositive.reduce((sum, h) => sum + h.count, 0);
  return Math.min(
    LOCAL_KEYWORD_SCORE_MAX,
    distinctRules * LF_DISTINCT_RULE_POINTS +
      totalOccurrences * LF_OCCURRENCE_POINTS
  );
}

// Recompute one place's locality index. Keeps the three admin-entered ratio
// factors (or column defaults), derives the local_keyword_score from collected
// text, fuses with computeLI(), and upserts place_local_metrics. Skips a place
// with manual_override unless force is set.
export async function recomputeLocalityForPlace(
  supabase: SupabaseServer,
  placeId: string,
  force: boolean
): Promise<RecomputeOutcome> {
  // Respect a manual override unless force is set.
  const { data: metricRow, error: metricErr } = await supabase
    .from("place_local_metrics")
    .select(
      "korean_review_ratio,foreign_visitor_ratio,korean_search_ratio,manual_override"
    )
    .eq("place_id", placeId)
    .maybeSingle();
  if (metricErr) throw new Error(metricErr.message);

  const metrics = (metricRow as MetricsRow | null) ?? null;
  if (!force && metrics?.manual_override) {
    return "skipped";
  }

  // Load collected source text (patent-2 module 100 storage).
  const { data: sourcesData, error: sourcesErr } = await supabase
    .from("grading_sources")
    .select("content")
    .eq("place_id", placeId);
  if (sourcesErr) throw new Error(sourcesErr.message);

  const contents = (sourcesData ?? [])
    .map((s) => (s as { content: string | null }).content ?? "")
    .filter((c) => c.trim().length > 0);

  const localKeywordScore = deriveLocalKeywordScore(contents);

  // Keep the three admin-entered ratio factors (v1 inputs) from the stored row,
  // or the column defaults when no row exists yet.
  const li = computeLI({
    koreanReviewRatio:
      metrics?.korean_review_ratio ?? RATIO_DEFAULTS.korean_review_ratio,
    foreignVisitorRatio:
      metrics?.foreign_visitor_ratio ?? RATIO_DEFAULTS.foreign_visitor_ratio,
    koreanSearchRatio:
      metrics?.korean_search_ratio ?? RATIO_DEFAULTS.korean_search_ratio,
    localKeywordScore,
  });

  const now = new Date().toISOString();
  const { error: upsertErr } = await supabase
    .from("place_local_metrics")
    .upsert(
      {
        place_id: placeId,
        local_keyword_score: localKeywordScore,
        li,
        computed_at: now,
        updated_at: now,
      },
      { onConflict: "place_id" }
    );
  if (upsertErr) throw new Error(upsertErr.message);

  return "updated";
}
