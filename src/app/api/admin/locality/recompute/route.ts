// Locality index recompute route (patent no.3, module 100).
//
// POST body: { placeId?, all?, force? }
//   - placeId  -> recompute just that place
//   - all      -> recompute every place
//   - force    -> overwrite rows whose place_local_metrics.manual_override is set
// GET behaves as { all: true } so a Vercel cron (which sends GET) can drive it.
//
// Per place: derive local_keyword_score from the collected grading_sources text
// (patent-2 module 100) using the patent-2 LF-category keyword dictionary, keep
// the three admin-entered ratio factors from the stored metrics row (or their
// column defaults), fuse everything with computeLI(), and upsert the result.
// The whole batch is wrapped in a data_jobs row (category 'locality').

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { computeLI } from "@/lib/course";
import { extractKeywords } from "@/lib/grading";

export const dynamic = "force-dynamic";

interface RecomputeBody {
  placeId?: string;
  all?: boolean;
  force?: boolean;
}

interface RecomputeResult {
  total: number;
  updated: number;
  skipped: number;
  errors: string[];
}

type SupabaseServer = Awaited<ReturnType<typeof createClient>>;

interface PlaceRow {
  id: string;
}

// Stored metrics fields we read to recompute LI. Defaults mirror the
// place_local_metrics column DEFAULTs so a place with no row still recomputes.
interface MetricsRow {
  korean_review_ratio: number;
  foreign_visitor_ratio: number;
  korean_search_ratio: number;
  manual_override: boolean;
}

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
function deriveLocalKeywordScore(contents: string[]): number {
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

async function recompute(
  supabase: SupabaseServer,
  body: RecomputeBody
): Promise<RecomputeResult> {
  const force = body.force === true;

  // Which places to process.
  let placesQuery = supabase.from("places").select("id");
  if (body.placeId) placesQuery = placesQuery.eq("id", body.placeId);

  const { data: placesData, error: placesErr } = await placesQuery;
  if (placesErr) throw new Error(placesErr.message);
  const places = (placesData ?? []) as PlaceRow[];

  const result: RecomputeResult = {
    total: places.length,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  for (const place of places) {
    try {
      // Respect a manual override unless force is set.
      const { data: metricRow, error: metricErr } = await supabase
        .from("place_local_metrics")
        .select(
          "korean_review_ratio,foreign_visitor_ratio,korean_search_ratio,manual_override"
        )
        .eq("place_id", place.id)
        .maybeSingle();
      if (metricErr) throw new Error(metricErr.message);

      const metrics = (metricRow as MetricsRow | null) ?? null;
      if (!force && metrics?.manual_override) {
        result.skipped++;
        continue;
      }

      // Load collected source text (patent-2 module 100 storage).
      const { data: sourcesData, error: sourcesErr } = await supabase
        .from("grading_sources")
        .select("content")
        .eq("place_id", place.id);
      if (sourcesErr) throw new Error(sourcesErr.message);

      const contents = (sourcesData ?? [])
        .map((s) => (s as { content: string | null }).content ?? "")
        .filter((c) => c.trim().length > 0);

      const localKeywordScore = deriveLocalKeywordScore(contents);

      // Keep the three admin-entered ratio factors (v1 inputs) from the stored
      // row, or the column defaults when no row exists yet.
      const li = computeLI({
        koreanReviewRatio:
          metrics?.korean_review_ratio ?? RATIO_DEFAULTS.korean_review_ratio,
        foreignVisitorRatio:
          metrics?.foreign_visitor_ratio ??
          RATIO_DEFAULTS.foreign_visitor_ratio,
        koreanSearchRatio:
          metrics?.korean_search_ratio ?? RATIO_DEFAULTS.korean_search_ratio,
        localKeywordScore,
      });

      const now = new Date().toISOString();
      const { error: upsertErr } = await supabase
        .from("place_local_metrics")
        .upsert(
          {
            place_id: place.id,
            local_keyword_score: localKeywordScore,
            li,
            computed_at: now,
            updated_at: now,
          },
          { onConflict: "place_id" }
        );
      if (upsertErr) throw new Error(upsertErr.message);

      result.updated++;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      result.errors.push(`${place.id}: ${message}`);
    }
  }

  return result;
}

async function handle(body: RecomputeBody): Promise<Response> {
  if (!isSupabaseConfigured()) {
    return Response.json(
      { error: "Supabase is not configured." },
      { status: 503 }
    );
  }

  const supabase = await createClient();

  // Open a data_jobs row for the batch.
  let jobId: string | null = null;
  const { data: jobData } = await supabase
    .from("data_jobs")
    .insert({
      category: "locality",
      status: "running",
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  jobId = (jobData as { id: string } | null)?.id ?? null;

  try {
    const result = await recompute(supabase, body);

    if (jobId) {
      await supabase
        .from("data_jobs")
        .update({
          status: "done",
          completed_at: new Date().toISOString(),
          result_total: result.total,
          result_updated: result.updated,
        })
        .eq("id", jobId);
    }

    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (jobId) {
      await supabase
        .from("data_jobs")
        .update({
          status: "failed",
          completed_at: new Date().toISOString(),
          error_message: message,
        })
        .eq("id", jobId);
    }
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<Response> {
  let body: RecomputeBody = {};
  try {
    body = (await request.json()) as RecomputeBody;
  } catch {
    body = {};
  }
  return handle(body);
}

// Vercel cron issues a GET — treat it as a full recompute.
export async function GET(): Promise<Response> {
  return handle({ all: true });
}
