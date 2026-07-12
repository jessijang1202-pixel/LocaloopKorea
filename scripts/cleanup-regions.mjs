// ============================================================
// Region de-duplication cleanup.
//
// The collect route used to slugify Korean region names — which returns "" —
// and fall back to a per-call `region-${Date.now()}` slug, minting a NEW region
// row on every collect. This left ~89 timestamp-slug duplicates of the same
// neighborhoods (104 rows total). The route is now fixed (look up by name_ko,
// stable fnv1a slug); this script consolidates the rows already in the DB.
//
// Run:  node scripts/cleanup-regions.mjs
//
// Fully idempotent (a second run finds nothing to merge):
//   1. Group all regions by trimmed name_ko.
//   2. For each name with >1 rows, choose the canonical row:
//        - prefer a row whose slug does NOT start with "region-" (the seed /
//          latin-slug / fnv1a row), else the oldest by created_at.
//      Reassign places from the duplicate rows to the canonical row, then delete
//      the duplicate region rows.
//   3. Delete leftover orphan rows: zero places AND slug starting with "region-".
// ============================================================

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// ── env ──────────────────────────────────────────────────────────────────────
const ENV_PATH = new URL("../.env.local", import.meta.url);

function loadEnv(path) {
  let raw;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    console.error(`ERROR: could not read .env.local at ${path.pathname}`);
    process.exit(1);
  }
  const out = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    out[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return out;
}

const env = loadEnv(ENV_PATH);
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "ERROR: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY missing from .env.local",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

function fail(stage, error) {
  console.error(`\nERROR at [${stage}]: ${error?.message ?? error}`);
  process.exit(1);
}

// Count how many places currently reference each region id.
async function fetchPlaceCounts() {
  const { data, error } = await supabase.from("places").select("region_id");
  if (error) fail("places.select", error);
  const counts = new Map();
  for (const row of data ?? []) {
    if (!row.region_id) continue;
    counts.set(row.region_id, (counts.get(row.region_id) ?? 0) + 1);
  }
  return counts;
}

async function main() {
  console.log("Region cleanup — target:", SUPABASE_URL);
  console.log("=".repeat(60));

  // 1) Load all regions.
  const { data: regions, error: regErr } = await supabase
    .from("regions")
    .select("id, name_ko, slug, created_at");
  if (regErr) fail("regions.select", regErr);

  const initialCount = regions.length;
  console.log(`regions: ${initialCount} rows loaded`);

  const placeCounts = await fetchPlaceCounts();

  // 2) Group by trimmed name_ko.
  const groups = new Map();
  for (const r of regions) {
    const key = (r.name_ko ?? "").trim();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  }

  let mergedGroups = 0;
  let reassignedPlaces = 0;
  let deletedDupes = 0;

  for (const [name, group] of groups) {
    if (group.length <= 1) continue;

    // Canonical: prefer a non-"region-" slug (seed / latin / fnv1a), then oldest.
    const sorted = [...group].sort((a, b) => {
      const aSeed = !String(a.slug).startsWith("region-");
      const bSeed = !String(b.slug).startsWith("region-");
      if (aSeed !== bSeed) return aSeed ? -1 : 1;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
    const canonical = sorted[0];
    const dupes = sorted.slice(1);
    const dupeIds = dupes.map((d) => d.id);

    // Places moved = sum of places referencing the duplicate rows.
    const movedForName = dupeIds.reduce(
      (sum, id) => sum + (placeCounts.get(id) ?? 0),
      0,
    );

    // Reassign places off the duplicate rows onto the canonical row.
    const { error: updErr } = await supabase
      .from("places")
      .update({ region_id: canonical.id })
      .in("region_id", dupeIds);
    if (updErr) fail(`places.reassign(${name})`, updErr);

    // Delete the now-unreferenced duplicate region rows.
    const { error: delErr } = await supabase
      .from("regions")
      .delete()
      .in("id", dupeIds);
    if (delErr) fail(`regions.delete(${name})`, delErr);

    mergedGroups++;
    reassignedPlaces += movedForName;
    deletedDupes += dupeIds.length;
    console.log(
      `  merge "${name}": kept ${canonical.slug}, removed ${dupeIds.length} dup(s), moved ${movedForName} place(s)`,
    );
  }

  // 3) Delete orphan timestamp rows: zero places AND slug starting with "region-".
  //    Recompute counts from the DB so reassigned places are reflected.
  const freshCounts = await fetchPlaceCounts();
  const { data: remaining, error: remErr } = await supabase
    .from("regions")
    .select("id, name_ko, slug");
  if (remErr) fail("regions.reselect", remErr);

  const orphanIds = remaining
    .filter(
      (r) =>
        String(r.slug).startsWith("region-") &&
        (freshCounts.get(r.id) ?? 0) === 0,
    )
    .map((r) => r.id);

  if (orphanIds.length > 0) {
    const { error: orphanErr } = await supabase
      .from("regions")
      .delete()
      .in("id", orphanIds);
    if (orphanErr) fail("regions.delete-orphans", orphanErr);
  }
  console.log(`orphans: deleted ${orphanIds.length} empty "region-" row(s)`);

  // Final totals.
  const { count: finalCount, error: cntErr } = await supabase
    .from("regions")
    .select("id", { count: "exact", head: true });
  if (cntErr) fail("regions.count", cntErr);

  console.log("=".repeat(60));
  console.log("DONE.");
  console.log(`  merged name groups:   ${mergedGroups}`);
  console.log(`  duplicate rows removed: ${deletedDupes}`);
  console.log(`  places reassigned:    ${reassignedPlaces}`);
  console.log(`  orphan rows removed:  ${orphanIds.length}`);
  console.log(`  regions: ${initialCount} -> ${finalCount ?? "?"}`);
}

main().catch((e) => fail("uncaught", e));
