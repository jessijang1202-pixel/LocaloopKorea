"use client";

// Live place data for the user-facing map/detail pages.
//
// DB-first with silent code-seed fallback (same best-effort pattern as
// src/lib/engine/guide-overrides.ts): before the migrations/seed are applied
// the pages render exactly as before from SEED_PLACES; once the DB has rows,
// admin edits flow straight into the app.

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { SEED_PLACES, SEED_REGIONS } from "@/data/seed";
import type { Place, Region } from "@/types";
import { ITAEWON, TRAVEL_INFO, HOT_PLACE_IDS } from "@/content/map";
import { haversineKm } from "@/lib/course/geo";

export type LiveRegion = Pick<
  Region,
  "id" | "name_ko" | "name_en" | "slug" | "city"
>;

export interface LivePlacesResult {
  places: Place[];
  regions: LiveRegion[];
  source: "db" | "seed";
}

const PLACE_COLUMNS =
  "id,name_ko,name_en,slug,description_ko,description_en,category,region_id,address,lat,lng,image_url,english_support,card_payment,solo_friendly,reservation_difficulty,created_at";

// Supabase numeric columns can arrive as strings — coerce coordinates.
function coercePlace(row: Record<string, unknown>): Place {
  return {
    ...(row as unknown as Place),
    lat: row.lat === null || row.lat === undefined ? null : Number(row.lat),
    lng: row.lng === null || row.lng === undefined ? null : Number(row.lng),
    created_at: (row.created_at as string) ?? "",
  };
}

function seedResult(): LivePlacesResult {
  return { places: SEED_PLACES, regions: SEED_REGIONS, source: "seed" };
}

export async function fetchLivePlaces(): Promise<LivePlacesResult> {
  if (!isSupabaseConfigured()) return seedResult();
  try {
    const supabase = createClient();
    const [placesRes, regionsRes] = await Promise.all([
      supabase.from("places").select(PLACE_COLUMNS).order("name_ko"),
      supabase.from("regions").select("id,name_ko,name_en,slug,city"),
    ]);
    if (placesRes.error || regionsRes.error) return seedResult();

    const places = (placesRes.data ?? []).map((r) =>
      coercePlace(r as Record<string, unknown>)
    );
    if (places.length === 0) return seedResult();

    return {
      places,
      regions: (regionsRes.data ?? []) as LiveRegion[],
      source: "db",
    };
  } catch {
    return seedResult();
  }
}

// ── Travel info from Itaewon ──────────────────────────────────────────────────
// Curated TRAVEL_INFO entries (seed ids p1..p12) win; anything else is computed
// from coordinates: walk under 2km (12 min/km), subway under 25km (10 min base
// + 3 min/km), otherwise a generic by-car label.

export function travelFromItaewon(place: {
  id: string;
  lat: number | null;
  lng: number | null;
}): { ko: string; en: string; dist: string } | null {
  const curated = TRAVEL_INFO[place.id];
  if (curated) return curated;
  if (place.lat === null || place.lng === null) return null;

  const km = haversineKm(ITAEWON, { lat: place.lat, lng: place.lng });
  const dist = km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`;

  if (km <= 2) {
    const min = Math.max(1, Math.round(km * 12));
    return { ko: `도보 ${min}분`, en: `Walk ${min} min`, dist };
  }
  if (km <= 25) {
    const min = Math.round(10 + km * 3);
    return { ko: `지하철 ${min}분`, en: `Subway ${min} min`, dist };
  }
  return { ko: "차량 이동", en: "By car", dist };
}

// ── ITAEWON PICK selection ────────────────────────────────────────────────────
// Seed data keeps the curated HOT_PLACE_IDS; DB data picks the nearest places
// within 2km of Itaewon station, capped at 8.

const HOT_RADIUS_KM = 2;
const HOT_CAP = 8;

export function hotPlaceIds(places: Place[], source: "db" | "seed"): string[] {
  if (source === "seed") return HOT_PLACE_IDS;
  return places
    .filter((p) => p.lat !== null && p.lng !== null)
    .map((p) => ({
      id: p.id,
      km: haversineKm(ITAEWON, { lat: p.lat!, lng: p.lng! }),
    }))
    .filter((x) => x.km <= HOT_RADIUS_KM)
    .sort((a, b) => a.km - b.km)
    .slice(0, HOT_CAP)
    .map((x) => x.id);
}
