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
import {
  recomputeLocalityForPlace,
  type SupabaseServer,
} from "@/lib/server/recompute";

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

interface PlaceRow {
  id: string;
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
      const outcome = await recomputeLocalityForPlace(
        supabase,
        place.id,
        force
      );
      if (outcome === "updated") result.updated++;
      else result.skipped++;
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
