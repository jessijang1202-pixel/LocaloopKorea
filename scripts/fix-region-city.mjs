// Classify every region as 서울 or 경기 (regions.city) so the area browser can
// group them. Batch-collected regions were created with city NULL. Idempotent.
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const get = (k) => env.match(new RegExp(`${k}=(.+)`))?.[1]?.trim();
const supabase = createClient(get("NEXT_PUBLIC_SUPABASE_URL"), get("NEXT_PUBLIC_SUPABASE_ANON_KEY"));

// Gyeonggi region names (everything else in the dataset is Seoul).
const GYEONGGI = new Set([
  "판교", "분당 정자동", "수원 행궁동", "수원역", "일산 호수공원",
  "안양 평촌", "부천", "광명", "의정부", "용인 보정동", "하남", "김포",
]);
// Non-Seoul seed regions that are neither (keep their existing city).
const KEEP = new Set(["부산", "해운대"]);

const { data: regions, error } = await supabase.from("regions").select("id,name_ko,city");
if (error) { console.error(error.message); process.exit(1); }

let updated = 0;
for (const r of regions) {
  const name = (r.name_ko ?? "").trim();
  if (KEEP.has(name)) continue;
  const city = GYEONGGI.has(name) ? "경기" : "서울";
  if (r.city === city) continue;
  const { error: upErr } = await supabase.from("regions").update({ city }).eq("id", r.id);
  if (upErr) console.error(`${name}: ${upErr.message}`);
  else { updated++; console.log(`${name} -> ${city}`); }
}
console.log(`DONE. ${updated} regions updated of ${regions.length}`);
