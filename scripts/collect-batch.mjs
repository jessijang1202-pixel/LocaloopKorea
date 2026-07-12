// Batch region collection — calls the local /api/admin/collect route
// sequentially for a curated list of Seoul + Gyeonggi areas.
//
// Usage:
//   1. Ensure KAKAO_REST_API_KEY (+ optional NAVER_CLIENT_ID/SECRET) are in .env.local
//   2. npx next build && npx next start -p 3470   (or pass a base URL)
//   3. node scripts/collect-batch.mjs [baseUrl] [categories]
//      e.g. node scripts/collect-batch.mjs http://localhost:3470 health,beauty,market
//
// Idempotent: places use stable k-{kakaoId} slugs, so reruns update instead of
// duplicating. A short delay between regions keeps API usage polite.

const BASE = process.argv[2] || "http://localhost:3470";

const REGIONS = [
  // ── 서울 (이태원권 — 시드와 병행) ──
  "이태원", "한남동", "경리단길", "해방촌", "용산",
  // ── 서울 ──
  "홍대", "연남동", "망원동", "합정", "상수동", "신촌", "이대",
  "강남역", "가로수길", "청담동", "삼성동", "역삼", "선릉",
  "잠실", "송리단길", "석촌호수",
  "익선동", "북촌", "서촌", "광화문", "을지로", "명동", "동대문",
  "대학로", "성북동", "건대입구", "왕십리", "여의도", "문래동", "목동",
  // ── 경기 ──
  "판교", "분당 정자동", "수원 행궁동", "수원역", "일산 호수공원",
  "안양 평촌", "부천", "광명", "의정부", "용인 보정동", "하남", "김포",
];

const CATEGORIES = process.argv[3]
  ? process.argv[3].split(",").map((s) => s.trim()).filter(Boolean)
  : ["restaurant", "cafe", "bar", "activity"];
const LIMIT = 5;
const DELAY_MS = 1500;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const totals = { found: 0, added: 0, updated: 0, sources: 0, graded: 0, failures: 0 };

console.log(`Batch collect against ${BASE} — ${REGIONS.length} regions, categories: ${CATEGORIES.join(",")}`);
console.log("=".repeat(64));

for (const region of REGIONS) {
  const started = Date.now();
  try {
    const res = await fetch(`${BASE}/api/admin/collect`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ region, categories: CATEGORIES, limitPerCategory: LIMIT }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
    totals.found += json.found;
    totals.added += json.added;
    totals.updated += json.updated;
    totals.sources += json.sourcesCollected;
    totals.graded += json.graded;
    const secs = ((Date.now() - started) / 1000).toFixed(0);
    console.log(
      `${region.padEnd(12)} 발견 ${String(json.found).padStart(2)} · 추가 ${String(json.added).padStart(2)} · 리뷰 ${String(json.sourcesCollected).padStart(3)} · 등급 ${String(json.graded).padStart(2)} · ${secs}s` +
        (json.errors.length ? ` · 오류 ${json.errors.length}` : "")
    );
    if (json.errors.length) {
      for (const e of json.errors.slice(0, 3)) console.log(`    ! ${e}`);
    }
  } catch (err) {
    totals.failures++;
    console.log(`${region.padEnd(12)} FAILED: ${err instanceof Error ? err.message : err}`);
  }
  await sleep(DELAY_MS);
}

console.log("=".repeat(64));
console.log(
  `DONE. 발견 ${totals.found} · 추가 ${totals.added} · 갱신 ${totals.updated} · 리뷰 ${totals.sources} · 등급 산출 ${totals.graded} · 지역 실패 ${totals.failures}`
);
