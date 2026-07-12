// Web data collection route (patent no.2 module 100 — real implementation).
//
// POST { region, categories?, limitPerCategory? }
//   - region            required — a Korean neighborhood name, e.g. "압구정".
//   - categories        subset of restaurant|cafe|bar|activity|accommodation.
//                       Default: everything except accommodation.
//   - limitPerCategory  1..10, default 5.
//
// Flow:
//   1. Upsert a regions row for `region` (onConflict slug).
//   2. For each requested category, keyword-search the Kakao Local REST API and
//      dedupe results across categories by Kakao place id.
//   3. Upsert the discovered places (stable slug `k-${kakaoId}` for idempotency).
//   4. If Naver keys exist, pull blog review text per newly added place into
//      grading_sources. Skipped silently when the keys are missing.
//   5. Run the shared per-place grading + locality recompute on affected places.
//   6. Wrap the batch in a data_jobs row (category 'collect').
//
// Degrades gracefully: 501 when the Kakao REST key is missing, and the Naver
// step is optional.

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { slugify } from "@/lib/admin/places-db";
import {
  kakaoLocalSearch,
  naverBlogSearch,
  kakaoGroupToCategory,
  isKakaoConfigured,
  isNaverConfigured,
  CATEGORY_SEARCH,
  type KakaoPlace,
  type AppCategory,
} from "@/lib/server/collect";
import {
  recomputeGradingForPlace,
  recomputeLocalityForPlace,
} from "@/lib/server/recompute";

export const dynamic = "force-dynamic";

const ALL_CATEGORIES: AppCategory[] = [
  "restaurant",
  "cafe",
  "bar",
  "activity",
  "accommodation",
  "health",
  "beauty",
  "market",
];
const DEFAULT_CATEGORIES: AppCategory[] = [
  "restaurant",
  "cafe",
  "bar",
  "activity",
  "health",
  "beauty",
  "market",
];

interface CollectBody {
  region?: string;
  categories?: string[];
  limitPerCategory?: number;
}

interface CollectResult {
  found: number;
  added: number;
  updated: number;
  sourcesCollected: number;
  graded: number;
  errors: string[];
  naverEnabled: boolean;
}

export async function POST(request: Request): Promise<Response> {
  // Kakao REST key is mandatory — surface a precise setup message when absent.
  if (!isKakaoConfigured()) {
    return Response.json(
      {
        error:
          "KAKAO_REST_API_KEY가 설정되지 않았습니다. 카카오 개발자 콘솔에서 REST API 키를 발급받아 .env.local과 Vercel 환경변수에 추가하세요.",
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

  let body: CollectBody = {};
  try {
    body = (await request.json()) as CollectBody;
  } catch {
    body = {};
  }

  const region = (body.region ?? "").trim();
  if (!region) {
    return Response.json({ error: "region이 필요합니다." }, { status: 400 });
  }

  // Validate + default the category list.
  const requested = Array.isArray(body.categories) ? body.categories : null;
  const categories: AppCategory[] = requested
    ? (requested.filter((c) =>
        ALL_CATEGORIES.includes(c as AppCategory)
      ) as AppCategory[])
    : DEFAULT_CATEGORIES;
  const finalCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const rawLimit = Number(body.limitPerCategory);
  const limit = Number.isFinite(rawLimit)
    ? Math.max(1, Math.min(10, Math.round(rawLimit)))
    : 5;

  const naverEnabled = isNaverConfigured();
  const result: CollectResult = {
    found: 0,
    added: 0,
    updated: 0,
    sourcesCollected: 0,
    graded: 0,
    errors: [],
    naverEnabled,
  };

  const supabase = await createClient();

  // Open a data_jobs row for the batch.
  let jobId: string | null = null;
  const { data: jobData } = await supabase
    .from("data_jobs")
    .insert({
      category: "collect",
      region,
      status: "running",
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  jobId = (jobData as { id: string } | null)?.id ?? null;

  try {
    // 1) Upsert the region.
    const regionSlug = slugify(region) || `region-${Date.now()}`;
    const { data: regionRow, error: regionErr } = await supabase
      .from("regions")
      .upsert(
        { name_ko: region, name_en: region, slug: regionSlug },
        { onConflict: "slug" }
      )
      .select("id")
      .single();
    if (regionErr) throw new Error(`region: ${regionErr.message}`);
    const regionId = (regionRow as { id: string }).id;

    // 2) Kakao search per category, deduped across categories by Kakao id.
    const seen = new Set<string>();
    const collected: KakaoPlace[] = [];
    for (const category of finalCategories) {
      // A category may map to several Kakao searches (e.g. health = 병원 + 약국);
      // the per-category limit applies to the pooled results.
      let taken = 0;
      for (const cfg of CATEGORY_SEARCH[category]) {
        if (taken >= limit) break;
        let places: KakaoPlace[] = [];
        try {
          places = await kakaoLocalSearch(
            `${region} ${cfg.suffix}`,
            cfg.groupCode,
            limit
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          result.errors.push(`${category}(${cfg.suffix}): ${message}`);
          continue;
        }
        for (const p of places) {
          if (taken >= limit) break;
          if (seen.has(p.id)) continue;
          seen.add(p.id);
          collected.push(p);
          taken++;
        }
      }
    }
    result.found = collected.length;

    // 3) Which of the collected places already exist (by our stable slug)?
    const slugFor = (k: KakaoPlace) => `k-${k.id}`;
    const slugs = collected.map(slugFor);
    const existingBySlug = new Set<string>();
    if (slugs.length > 0) {
      const { data: existRows, error: existErr } = await supabase
        .from("places")
        .select("slug")
        .in("slug", slugs);
      if (existErr) throw new Error(`existing lookup: ${existErr.message}`);
      for (const r of (existRows ?? []) as { slug: string }[]) {
        existingBySlug.add(r.slug);
      }
    }

    // Upsert each place; remember its id + whether it was newly added.
    const affected: { id: string; isNew: boolean; kakao: KakaoPlace }[] = [];
    for (const k of collected) {
      const slug = slugFor(k);
      const isNew = !existingBySlug.has(slug);
      const category = kakaoGroupToCategory(k);
      const lat = Number(k.y);
      const lng = Number(k.x);
      const row = {
        name_ko: k.place_name,
        name_en: k.place_name, // admin localizes later
        slug,
        category,
        region_id: regionId,
        address: k.road_address_name || k.address_name || null,
        lat: Number.isFinite(lat) ? lat : null,
        lng: Number.isFinite(lng) ? lng : null,
        phone: k.phone || null,
        english_support: false,
        card_payment: true,
        solo_friendly: true,
        description_ko: k.category_name || null,
        image_url: null,
      };
      const { data: upRow, error: upErr } = await supabase
        .from("places")
        .upsert(row, { onConflict: "slug" })
        .select("id")
        .single();
      if (upErr) {
        result.errors.push(`${k.place_name}: ${upErr.message}`);
        continue;
      }
      const id = (upRow as { id: string }).id;
      if (isNew) result.added++;
      else result.updated++;
      affected.push({ id, isNew, kakao: k });
    }

    // 4) Naver blog review text for newly added places (optional).
    if (naverEnabled) {
      for (const a of affected) {
        if (!a.isNew) continue;
        try {
          const items = await naverBlogSearch(
            `${region} ${a.kakao.place_name}`,
            3
          );
          if (items.length === 0) continue;
          const rows = items.map((it) => ({
            place_id: a.id,
            source_type: "blog",
            url: it.link || null,
            content: `${it.title} ${it.description}`.trim(),
          }));
          const { error: srcErr } = await supabase
            .from("grading_sources")
            .insert(rows);
          if (srcErr) {
            result.errors.push(`${a.kakao.place_name} sources: ${srcErr.message}`);
            continue;
          }
          result.sourcesCollected += rows.length;
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          result.errors.push(`${a.kakao.place_name} naver: ${message}`);
        }
      }
    }

    // 5) Per-place grading + locality recompute on affected places.
    for (const a of affected) {
      try {
        const category = kakaoGroupToCategory(a.kakao);
        const outcome = await recomputeGradingForPlace(
          supabase,
          a.id,
          category,
          false
        );
        if (outcome === "updated") result.graded++;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        result.errors.push(`${a.kakao.place_name} grade: ${message}`);
      }
      try {
        await recomputeLocalityForPlace(supabase, a.id, false);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        result.errors.push(`${a.kakao.place_name} locality: ${message}`);
      }
    }

    // 6) Close the data_jobs row.
    if (jobId) {
      await supabase
        .from("data_jobs")
        .update({
          status: "done",
          completed_at: new Date().toISOString(),
          result_total: result.found,
          result_added: result.added,
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
