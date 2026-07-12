// Grading engine recompute route (patent no.2).
//
// POST body: { placeId?, all?, force? }
//   - placeId  -> recompute just that place
//   - all      -> recompute every place
//   - force    -> overwrite rows whose details.manual_override is set
// GET behaves as { all: true } so a Vercel cron (which sends GET) can drive it.
//
// Per place: load grading_sources → grade with gradePlace() → write sub-scores
// on places (the DB trigger sets the letter grade) and upsert place_grade_details.
// The whole batch is wrapped in a data_jobs row (category 'grading').

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import {
  recomputeGradingForPlace,
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
  category: string | null;
}

async function recompute(
  supabase: SupabaseServer,
  body: RecomputeBody
): Promise<RecomputeResult> {
  const force = body.force === true;

  // Which places to process.
  let placesQuery = supabase.from("places").select("id,category");
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
      const outcome = await recomputeGradingForPlace(
        supabase,
        place.id,
        place.category,
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
      category: "grading",
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
