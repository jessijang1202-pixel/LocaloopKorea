// Foreign-resident hub collection — Seoul + Gyeonggi neighborhoods with the
// highest foreign-resident populations, collected with the FULL category set
// (including the task-driven telecom/bank/government/realestate categories the
// task-filtered map needs), unlike collect-batch.mjs's default 4 categories.
//
// Usage:
//   1. Ensure KAKAO_REST_API_KEY (+ optional NAVER_CLIENT_ID/SECRET) are in .env.local
//   2. npx next build && npx next start -p 3470   (or pass a base URL)
//   3. node scripts/collect-foreign-hubs.mjs [baseUrl]
//
// Idempotent: places use stable k-{kakaoId} slugs, so reruns update instead of
// duplicating. A short delay between regions keeps API usage polite.

const BASE = process.argv[2] || "http://localhost:3470";

// Curated by actual foreign-resident concentration. Pass a round name as the
// second arg to pick a batch (default: round1).
//   round1 서울 — 대림동/가리봉동(중국·조선족), 광희동(중앙아시아·러시아·몽골),
//          혜화동(필리핀), 동부이촌동(일본), 서래마을(프랑스), 창신동(네팔·인도)
//   round1 경기 — 안산 원곡동(국내 최대 다문화특구), 시흥 정왕동, 평택 송탄(미군기지),
//          동두천(미군기지), 화성 발안(다문화), 오산(오산기지)
//   round2 경기·인천 — 평택 안정리(캠프 험프리스), 수원역/인계동, 일산 라페스타,
//          고양 화정, 분당 정자동, 판교(IT 주재원), 부천역(중국동포), 의정부(미군),
//          파주 금촌(공단), 포천(공단), 인천 차이나타운/부평/송도(국제도시)/
//          연수동 함박마을(고려인)
const ROUNDS = {
  round1: [
    "대림동", "가리봉동", "광희동", "혜화동", "동부이촌동", "서래마을", "창신동",
    "안산 원곡동", "시흥 정왕동", "평택 송탄", "동두천", "화성 발안", "오산",
  ],
  round2: [
    "평택 안정리", "수원역", "수원 인계동", "일산 라페스타", "고양 화정",
    "분당 정자동", "판교", "부천역", "의정부", "파주 금촌", "포천",
    "인천 차이나타운", "부평", "송도", "인천 연수동",
  ],
  // round3 전국 대도시 — 부산 초량(차이나타운·텍사스거리), 김해 동상동(경남 최대
  // 외국인 거점), 대구 대현동(이슬람거리), 광주 월곡동(고려인마을), 천안(공단),
  // 나머지는 각 도시의 외국인 관광·상업 중심지.
  round3: [
    "부산 해운대", "부산 서면", "부산 초량", "김해 동상동",
    "대구 동성로", "대구 대현동", "대전 둔산동", "대전 유성",
    "광주 월곡동", "광주 충장로", "천안역", "울산 성남동", "창원 상남동",
    "전주 한옥마을", "제주시", "서귀포",
  ],
};
const REGIONS = ROUNDS[process.argv[3]] ?? ROUNDS.round1;

// Everything except accommodation — includes the 4 task-driven categories.
const CATEGORIES = [
  "restaurant", "cafe", "bar", "activity", "experience",
  "health", "beauty", "market",
  "telecom", "bank", "government", "realestate",
];
const LIMIT = 5;
const DELAY_MS = 1500;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const totals = { found: 0, added: 0, updated: 0, sources: 0, graded: 0, failures: 0 };

console.log(`Foreign-hub collect against ${BASE} — ${REGIONS.length} regions, ${CATEGORIES.length} categories`);
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
      `${region.padEnd(12)} 발견 ${String(json.found).padStart(3)} · 추가 ${String(json.added).padStart(3)} · 리뷰 ${String(json.sourcesCollected).padStart(3)} · 등급 ${String(json.graded).padStart(3)} · ${secs}s` +
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
