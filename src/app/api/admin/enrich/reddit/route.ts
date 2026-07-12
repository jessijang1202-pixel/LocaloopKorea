// Reddit English-review enrichment route
// (patent no.2 — foreign-language review source; patent no.3 fig.2 — foreign
//  visitor ratio estimated from review language mix).
//
// POST { placeId?, all?, limit? }
//   - placeId  -> enrich just that place (if it has a latin name_en)
//   - all      -> enrich every place with a latin name_en, ordered by name_ko
//   - limit    -> max places to process (default 30, capped at 100; Reddit's
//                 unauthenticated rate limit is tight, so we stay conservative)
//
// Per place:
//   1. Search Reddit for `"${name_en}" korea`.
//   2. Keep only posts whose title+snippet actually mention the place (matched on
//      the longest word of name_en) — cuts the noise Reddit relevance returns.
//   3. Refresh the place's reddit-sourced grading_sources: delete existing
//      reddit-url rows, then insert up to 3 fresh ones. NOTE: the grading_sources
//      CHECK constraint has no 'reddit' value, so these rows use source_type
//      'review' and are distinguished from Naver reviews by their reddit.com url.
//   4. Estimate the foreign visitor ratio from the review-language mix
//      (redditCount vs non-reddit blog/review count) and store it on
//      place_local_metrics when that row exists and is not manually overridden.
//   5. Recompute grading + locality for the place.
//   6. Wait 1.5s before the next place (Reddit politeness).
//
// The batch is wrapped in a data_jobs row (category 'reddit').

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import {
  redditSearch,
  hasLatinName,
  isRedditConfigured,
} from "@/lib/server/collect";
import {
  recomputeGradingForPlace,
  recomputeLocalityForPlace,
} from "@/lib/server/recompute";

export const dynamic = "force-dynamic";

interface EnrichBody {
  placeId?: string;
  all?: boolean;
  limit?: number;
}

interface EnrichResult {
  total: number;
  enriched: number;
  sourcesAdded: number;
  ratioUpdated: number;
  skippedNoLatin: number;
  errors: string[];
}

interface PlaceRow {
  id: string;
  name_ko: string;
  name_en: string | null;
  category: string | null;
  region_id: string | null;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function clamp(lo: number, hi: number, v: number): number {
  return Math.max(lo, Math.min(hi, v));
}

// The token used to confirm a Reddit post is really about this place: the
// longest latin word in name_en (prefer length > 3, else the longest available).
function matchToken(nameEn: string): string | null {
  const tokens = nameEn.match(/[A-Za-z]+/g) ?? [];
  if (tokens.length === 0) return null;
  const byLength = [...tokens].sort((a, b) => b.length - a.length);
  const longEnough = byLength.find((t) => t.length > 3);
  return (longEnough ?? byLength[0]).toLowerCase();
}

export async function POST(request: Request): Promise<Response> {
  // Reddit blocks anonymous server-side access (403) — the official OAuth API
  // requires a free app registration. Surface precise setup guidance.
  if (!isRedditConfigured()) {
    return Response.json(
      {
        error:
          "REDDIT_CLIENT_ID/REDDIT_CLIENT_SECRET가 설정되지 않았습니다. reddit.com/prefs/apps에서 script 타입 앱을 만들어 키를 .env.local과 Vercel 환경변수에 추가하세요.",
      },
      { status: 501 }
    );
  }

  if (!isSupabaseConfigured()) {
    return Response.json(
      { error: "Supabase is not configured." },
      { status: 503 }
    );
  }

  let body: EnrichBody = {};
  try {
    body = (await request.json()) as EnrichBody;
  } catch {
    body = {};
  }

  const rawLimit = Number(body.limit);
  const limit = Number.isFinite(rawLimit)
    ? Math.max(1, Math.min(100, Math.round(rawLimit)))
    : 30;

  const supabase = await createClient();

  const result: EnrichResult = {
    total: 0,
    enriched: 0,
    sourcesAdded: 0,
    ratioUpdated: 0,
    skippedNoLatin: 0,
    errors: [],
  };

  // Open a data_jobs row for the batch.
  let jobId: string | null = null;
  const { data: jobData } = await supabase
    .from("data_jobs")
    .insert({
      category: "reddit",
      status: "running",
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  jobId = (jobData as { id: string } | null)?.id ?? null;

  try {
    // Resolve target places. Fetch id/name/category/region and filter latin
    // names in JS (the DB has no latin-name predicate).
    let query = supabase
      .from("places")
      .select("id,name_ko,name_en,category,region_id")
      .order("name_ko");
    if (body.placeId) query = query.eq("id", body.placeId);

    const { data: placesData, error: placesErr } = await query;
    if (placesErr) throw new Error(placesErr.message);
    const allPlaces = (placesData ?? []) as PlaceRow[];

    const withLatin = allPlaces.filter((p) => hasLatinName(p.name_en ?? ""));
    result.skippedNoLatin = allPlaces.length - withLatin.length;

    const targets = withLatin.slice(0, limit);
    result.total = targets.length;

    for (let i = 0; i < targets.length; i++) {
      const place = targets[i];
      const nameEn = place.name_en ?? "";

      try {
        const posts = await redditSearch(`"${nameEn}" korea`, 5);

        // Keep only posts that actually mention the place.
        const token = matchToken(nameEn);
        const relevant = token
          ? posts.filter((p) =>
              `${p.title} ${p.snippet}`.toLowerCase().includes(token)
            )
          : posts;

        // Idempotent refresh: drop the place's existing reddit-url sources first.
        const { error: delErr } = await supabase
          .from("grading_sources")
          .delete()
          .eq("place_id", place.id)
          .like("url", "%reddit.com%");
        if (delErr) throw new Error(`reddit source cleanup: ${delErr.message}`);

        const toInsert = relevant.slice(0, 3).map((p) => ({
          place_id: place.id,
          // grading_sources CHECK has no 'reddit' — use 'review', tagged by url.
          source_type: "review",
          url: p.permalink || null,
          content: `${p.title}. ${p.snippet}`.trim().slice(0, 600),
          collected_at: new Date().toISOString(),
        }));

        let redditCount = 0;
        if (toInsert.length > 0) {
          const { error: insErr } = await supabase
            .from("grading_sources")
            .insert(toInsert);
          if (insErr) throw new Error(`reddit source insert: ${insErr.message}`);
          redditCount = toInsert.length;
          result.sourcesAdded += redditCount;
          result.enriched++;
        }

        // Foreign visitor ratio estimation (patent fig.2 review-language basis):
        // treat reddit (English) mentions as foreigner signal and non-reddit
        // blog/review (Korean) sources as local signal. estimated ratio =
        // redditCount / (redditCount + naverCount). Only written when a metrics
        // row already exists and is not manually overridden.
        const { data: srcRows, error: srcErr } = await supabase
          .from("grading_sources")
          .select("source_type,url")
          .eq("place_id", place.id);
        if (srcErr) throw new Error(`source count: ${srcErr.message}`);

        const naverCount = (srcRows ?? []).filter((s) => {
          const type = (s as { source_type: string }).source_type;
          const url = (s as { url: string | null }).url ?? "";
          return (
            (type === "blog" || type === "review") &&
            !url.includes("reddit.com")
          );
        }).length;

        const { data: metricRow, error: metricErr } = await supabase
          .from("place_local_metrics")
          .select("manual_override")
          .eq("place_id", place.id)
          .maybeSingle();
        if (metricErr) throw new Error(`metrics lookup: ${metricErr.message}`);

        if (
          metricRow &&
          !(metricRow as { manual_override: boolean }).manual_override
        ) {
          const estimated = clamp(
            0.05,
            0.9,
            redditCount / (redditCount + naverCount || 1)
          );
          const { error: ratioErr } = await supabase
            .from("place_local_metrics")
            .update({
              foreign_visitor_ratio: estimated,
              updated_at: new Date().toISOString(),
            })
            .eq("place_id", place.id);
          if (ratioErr) throw new Error(`ratio update: ${ratioErr.message}`);
          result.ratioUpdated++;
        }

        // Fold the fresh sources / ratio into the grade + locality index.
        await recomputeGradingForPlace(supabase, place.id, place.category, false);
        await recomputeLocalityForPlace(supabase, place.id, false);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        result.errors.push(`${place.name_ko}: ${message}`);
      }

      // Reddit politeness: pause between places (skip after the last).
      if (i < targets.length - 1) await sleep(1500);
    }

    if (jobId) {
      await supabase
        .from("data_jobs")
        .update({
          status: "done",
          completed_at: new Date().toISOString(),
          result_total: result.total,
          result_added: result.sourcesAdded,
          result_updated: result.ratioUpdated,
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
