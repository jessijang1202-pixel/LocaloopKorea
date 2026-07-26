// Fill missing place photos with category-appropriate stock imagery.
//
// Collected places arrive without photos (Kakao Local has no image field), so
// cards rendered gray. This assigns a deterministic Unsplash image per place
// (pool per category, picked by an id hash) wherever image_url is NULL.
// Idempotent: only touches rows with no image; admin-set photos are never
// overwritten. All pool URLs verified to return HTTP 200.
//
// Usage: node scripts/fill-images.mjs

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const get = (k) => env.match(new RegExp(`${k}=(.+)`))?.[1]?.trim();
const supabase = createClient(
  get("NEXT_PUBLIC_SUPABASE_URL"),
  get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
);

const U = (id) => `https://images.unsplash.com/photo-${id}?w=800&q=80`;

const POOLS = {
  restaurant: [
    U("1504674900247-0877df9cc836"),
    U("1544025162-d76694265947"),
    U("1547592166-23ac45744acd"),
    U("1555396273-367ea4eb4db5"),
    U("1555992336-fb0d29498b13"),
    U("1414235077428-338989a2e8c0"),
    U("1552566626-52f8b828add9"),
    U("1466978913421-dad2ebd01d17"),
    U("1467003909585-2f8a72700288"),
    U("1553621042-f6e147245754"),
    U("1571066811602-716837d681de"),
  ],
  cafe: [
    U("1447933601403-0c6688de566e"),
    U("1554118811-1e0d58224f24"),
    U("1509042239860-f550ce710b93"),
    U("1521017432531-fbd92d768814"),
    U("1445116572660-236099ec97a0"),
    U("1544148103-0773bf10d330"),
  ],
  bar: [
    U("1514933651103-005eec06c04b"),
    U("1470337458703-46ad1756a187"),
    U("1524594152303-9fd13543fe6e"),
    U("1516975080664-ed2fc6a32937"),
  ],
  market: [
    U("1533900298318-6b8da08a523e"),
    U("1518998053901-5348d3961a04"),
    U("1567521464027-f127ff144326"),
    U("1595475207225-428b62bda831"),
  ],
  activity: [
    U("1529156069898-49953e39b3ac"),
    U("1531058020387-3be344556be6"),
    U("1519671482749-fd09be7ccebf"),
    U("1540555700478-4be289fbecef"),
  ],
  health: [
    U("1586773860418-d37222d8fce3"),
    U("1519494026892-80bbd2d6fd0d"),
    U("1576091160399-112ba8d25d1d"),
    U("1583604310111-9cd137d6ffe5"),
  ],
  beauty: [
    U("1560066984-138dadb4c035"),
    U("1522337660859-02fbefca4702"),
    U("1571019613454-1cb2f99b2d8b"),
  ],
  accommodation: [U("1441986300917-64674bd600d8"), U("1540555700478-4be289fbecef")],
  shopping: [U("1441986300917-64674bd600d8"), U("1567521464027-f127ff144326")],
  // Task-driven categories (added for the task-filtered map) previously had no
  // pool and silently fell back to DEFAULT_POOL (activity/tourism photos),
  // which read as visibly wrong on a bank or government-office card.
  bank: [
    U("1601597111158-2fceff292cdc"),
    U("1553729459-efe14ef6055d"),
    U("1554224155-6726b3ff858f"),
    U("1541354329998-f4d9a9f9297f"),
    U("1560472355-536de3962603"),
  ],
  government: [
    U("1497366216548-37526070297c"),
    U("1517502884422-41eaead166d4"),
    U("1571624436279-b272aff752b5"),
  ],
  realestate: [
    U("1560518883-ce09059eeffa"),
    U("1522708323590-d24dbb6b0267"),
    U("1521791055366-0d553872125f"),
    U("1521791136064-7986c2920216"),
  ],
  telecom: [
    U("1592286927505-1def25115558"),
    U("1556742111-a301076d9d18"),
    U("1587560699334-cc4ff634909a"),
    U("1550009158-9ebf69173e03"),
  ],
  experience: [
    U("1478860409698-8707f313ee8b"),
    U("1543269865-cbf427effbad"),
    U("1590650046871-92c887180603"),
    U("1568992688065-536aad8a12f6"),
  ],
};
const DEFAULT_POOL = POOLS.activity;

function hashId(id) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Paged fetch (Supabase caps selects at 1,000 rows).
const all = [];
for (let from = 0; ; from += 1000) {
  const { data, error } = await supabase
    .from("places")
    .select("id,category,image_url")
    .order("id")
    .range(from, from + 999);
  if (error) { console.error(error.message); process.exit(1); }
  all.push(...data);
  if (data.length < 1000) break;
}

const missing = all.filter((p) => !p.image_url);
console.log(`places: ${all.length}, missing image: ${missing.length}`);

let updated = 0, failed = 0;
const BATCH = 20;
for (let i = 0; i < missing.length; i += BATCH) {
  const chunk = missing.slice(i, i + BATCH);
  await Promise.all(
    chunk.map(async (p) => {
      const pool = POOLS[p.category] ?? DEFAULT_POOL;
      const url = pool[hashId(p.id) % pool.length];
      const { error } = await supabase
        .from("places")
        .update({ image_url: url })
        .eq("id", p.id);
      if (error) failed++;
      else updated++;
    })
  );
  if ((i / BATCH) % 10 === 0) console.log(`  ...${Math.min(i + BATCH, missing.length)}/${missing.length}`);
}

console.log(`DONE. updated ${updated}, failed ${failed}`);
