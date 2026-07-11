// Admin place management — browser-side DB access.
//
// Mirrors src/lib/grading/db.ts: uses the anon Supabase browser client and
// throws a clear Error when Supabase is not configured, so callers can surface
// a useful message instead of hitting a null client.
//
// Writes here depend on the RLS policies + places.updated_at column added by
// supabase/migrations/20260712_admin_manage.sql.

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

function requireConfigured() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface AdminPlaceRow {
  id: string;
  name_ko: string;
  name_en: string;
  slug: string;
  description_ko: string | null;
  description_en: string | null;
  category: string;
  region_id: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  image_url: string | null;
  english_support: boolean;
  card_payment: boolean;
  solo_friendly: boolean;
  phone: string | null;
  hours: string | null;
  memo: string | null;
  grade: string | null;
  created_at: string;
}

export interface RegionOption {
  id: string;
  name_ko: string;
  name_en: string;
}

// Editable columns accepted by create/update. Slug is optional on create
// (auto-derived from name_en) and normally left untouched.
export interface PlaceInput {
  name_ko: string;
  name_en: string;
  slug?: string;
  description_ko?: string | null;
  description_en?: string | null;
  category: string;
  region_id?: string | null;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  image_url?: string | null;
  english_support?: boolean;
  card_payment?: boolean;
  solo_friendly?: boolean;
  phone?: string | null;
  hours?: string | null;
  memo?: string | null;
}

const PLACE_COLUMNS =
  "id,name_ko,name_en,slug,description_ko,description_en,category,region_id,address,lat,lng,image_url,english_support,card_payment,solo_friendly,phone,hours,memo,grade,created_at";

// slug: lowercase, spaces/other non-alphanumerics collapsed to a single dash,
// leading/trailing dashes stripped.
export function slugify(source: string): string {
  return source
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── Reads ────────────────────────────────────────────────────────────────────

export async function fetchAdminPlaces(): Promise<AdminPlaceRow[]> {
  requireConfigured();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("places")
    .select(PLACE_COLUMNS)
    .order("name_ko");
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as AdminPlaceRow[];
}

export async function fetchRegions(): Promise<RegionOption[]> {
  requireConfigured();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("regions")
    .select("id,name_ko,name_en")
    .order("name_ko");
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as RegionOption[];
}

// ── Writes ───────────────────────────────────────────────────────────────────

// Insert a place; returns the new row id. Slug is auto-derived from name_en
// when not explicitly provided.
export async function createPlace(input: PlaceInput): Promise<string> {
  requireConfigured();
  const supabase = createClient();

  const slug =
    input.slug && input.slug.trim() ? input.slug.trim() : slugify(input.name_en);

  const { data, error } = await supabase
    .from("places")
    .insert({ ...input, slug })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return (data as unknown as { id: string }).id;
}

export async function updatePlace(
  id: string,
  patch: Partial<PlaceInput>
): Promise<void> {
  requireConfigured();
  const supabase = createClient();
  const { error } = await supabase.from("places").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
}

// Hard delete. FK ON DELETE CASCADE removes the row's grading_sources,
// place_grade_details and place_local_metrics rows too.
export async function deletePlace(id: string): Promise<void> {
  requireConfigured();
  const supabase = createClient();
  const { error } = await supabase.from("places").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
