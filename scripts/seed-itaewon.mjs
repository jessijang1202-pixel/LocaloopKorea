// ============================================================
// Itaewon-centered seed — regions, places, grading_sources, place_local_metrics
//
// REQUIRES migration 20260712_admin_manage.sql (and the three before it:
//   001_add_onboarding_meta.sql, 20240102_admin_tables.sql,
//   20260710_grading_engine.sql, 20260711_course_engine.sql).
// 20260712 adds the places INSERT/DELETE policies + blanket table grants that
// let the anon key write these rows. Without it every write fails with
// "permission denied" / RLS violation. DO NOT run this until that migration
// has been applied in the Supabase SQL editor.
//
// Run:  node scripts/seed-itaewon.mjs
//
// Fully idempotent:
//   - regions   : upsert by slug
//   - places    : upsert by slug (onConflict "slug")
//   - grading_sources    : DELETE existing rows per seeded place, then INSERT fresh
//   - place_local_metrics: upsert by place_id
//
// NOTE: place_local_metrics.local_keyword_score and .li are left at 0 here.
// They are DERIVED by the recompute API (grading keyword score -> LI fusion);
// likewise places.ls/ar/pd/lf_score + grade are computed by the grading engine
// recompute route from the grading_sources seeded below. After running this
// script, trigger a full recompute from the admin panel (or its API).
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

const IMG = (id) => `https://images.unsplash.com/photo-${id}?w=800&q=80`;

// ── regions ──────────────────────────────────────────────────────────────────
// Upserted by slug; ids are left to the DB (existing rows keep their id, new
// rows get gen_random_uuid()) so we never rewrite a primary key that FKs point at.
const REGIONS = [
  { name_ko: "이태원", name_en: "Itaewon", slug: "itaewon", city: "서울",
    description_en: "Seoul's most international district — global food, bars, and a large expat community around Itaewon station.",
    description_ko: "글로벌 음식과 바, 외국인 커뮤니티가 모인 서울에서 가장 국제적인 지역." },
  { name_ko: "한남동", name_en: "Hannam", slug: "hannam", city: "서울",
    description_en: "Upscale village next to Itaewon — designer galleries, concept stores, and destination restaurants along Itaewon-ro.",
    description_ko: "이태원 옆 고급 동네 — 갤러리, 컨셉 스토어, 화제의 레스토랑이 모인 곳." },
  { name_ko: "경리단길", name_en: "Gyeongnidan-gil", slug: "gyeongnidan", city: "서울",
    description_en: "Hillside alley of craft breweries, indie cafes, and international kitchens — the original 'X-ridan-gil' street.",
    description_ko: "크래프트 브루어리, 인디 카페, 각국 음식점이 모인 비탈 골목 — 원조 'X리단길'." },
  { name_ko: "해방촌", name_en: "Haebangchon", slug: "haebangchon", city: "서울",
    description_en: "Gritty, local hillside neighborhood behind Namsan — tiny bars, artist studios, and the Sinheung traditional market.",
    description_ko: "남산 자락의 로컬 감성 언덕 동네 — 작은 바, 작업실, 신흥시장이 있는 곳." },
  { name_ko: "용산", name_en: "Yongsan", slug: "yongsan", city: "서울",
    description_en: "The wider district holding Itaewon — home to the National Museum of Korea, War Memorial, and Namsan.",
    description_ko: "이태원을 품은 넓은 자치구 — 국립중앙박물관, 전쟁기념관, 남산이 있는 곳." },
];

// ── places + sources + metrics ────────────────────────────────────────────────
// Each entry: place columns + region slug + grading_sources[] + place_local_metrics.
// Source texts deliberately carry patent-2 dictionary keywords so the recompute
// engine derives VARIED grades:
//   - foreigner-friendly (LS/AR/PD positives) -> A / S tier
//   - local-heavy + friction (LS/PD negatives, LF positives) -> B / C tier
const PLACES = [
  // ── Restaurants ────────────────────────────────────────────────────────────
  {
    name_ko: "바토스 어반 타코", name_en: "Vatos Urban Tacos", slug: "vatos-urban-tacos",
    category: "restaurant", region: "itaewon",
    address: "서울 용산구 이태원로15길 3", lat: 37.5340, lng: 126.9927,
    description_ko: "이태원을 대표하는 멕시칸-코리안 퓨전 타코 전문점. 코리안 갈비 타코와 김치 카르니타스 프라이로 유명하며 주말엔 대기가 길다.",
    description_en: "The Itaewon restaurant that put Korean-Mexican fusion tacos on the map. Famous for kimchi carnitas fries and galbi short-rib tacos; expect a weekend wait.",
    english_support: true, card_payment: true, solo_friendly: false,
    image_url: IMG("1565299624946-b28f40a0ae38"),
    sources: [
      { source_type: "review", content: "영어 메뉴 있음. 직원들 영어 응대 가능하고 외국인 손님이 정말 많아요. 카드 결제 가능." },
      { source_type: "blog", content: "Great spot for foreigners — English menu, friendly staff, and it's always packed with an international crowd. Cards accepted, walk-in welcome." },
      { source_type: "review", content: "외국인 환영 분위기. 주말엔 관광객 많음." },
    ],
    metrics: { korean_review_ratio: 0.42, foreign_visitor_ratio: 0.72, korean_search_ratio: 0.45,
      price_estimate: 24000, stay_minutes: 90, english_subtitles: false, time_slot: "meal" },
  },
  {
    name_ko: "케르반", name_en: "Kervan", slug: "kervan-itaewon",
    category: "restaurant", region: "itaewon",
    address: "서울 용산구 이태원로 176", lat: 37.5346, lng: 126.9948,
    description_ko: "이태원의 오래된 터키 음식점. 케밥과 라흐마준, 터키식 피데를 내며 할랄 식재료를 사용한다.",
    description_en: "A long-running Turkish kitchen in Itaewon serving kebabs, lahmacun, and pide with halal ingredients. A reliable neighborhood standby for decades.",
    english_support: true, card_payment: true, solo_friendly: true,
    image_url: IMG("1504674900247-0877df9cc836"),
    sources: [
      { source_type: "review", content: "English menu available and the staff speak English well. Foreigners welcome — very halal-friendly." },
      { source_type: "blog", content: "영어 메뉴 있고 영어 응대 가능해서 외국인들이 편하게 찾는 곳. 카드 결제 가능." },
    ],
    metrics: { korean_review_ratio: 0.5, foreign_visitor_ratio: 0.62, korean_search_ratio: 0.52,
      price_estimate: 20000, stay_minutes: 80, english_subtitles: false, time_slot: "meal" },
  },
  {
    name_ko: "페트라", name_en: "Petra", slug: "petra-itaewon",
    category: "restaurant", region: "itaewon",
    address: "서울 용산구 우사단로10길 33", lat: 37.5335, lng: 126.9955,
    description_ko: "요르단·중동 가정식을 내는 이태원의 아랍 음식점. 후무스, 팔라펠, 만사프 등을 맛볼 수 있고 채식 옵션이 많다.",
    description_en: "A Jordanian and Middle-Eastern home-cooking spot near Itaewon's Usadan-ro. Hummus, falafel, and mansaf, with plenty of vegetarian options.",
    english_support: true, card_payment: true, solo_friendly: true,
    image_url: IMG("1547592166-23ac45744acd"),
    sources: [
      { source_type: "review", content: "영어 메뉴 있음. 외국인 환영이고 사장님이 영어 응대 가능해요." },
      { source_type: "blog", content: "Authentic Middle Eastern food, English menu, foreigners welcome. Cards accepted." },
    ],
    metrics: { korean_review_ratio: 0.55, foreign_visitor_ratio: 0.58, korean_search_ratio: 0.55,
      price_estimate: 19000, stay_minutes: 80, english_subtitles: false, time_slot: "meal" },
  },
  {
    name_ko: "브라이 리퍼블릭", name_en: "Braai Republic", slug: "braai-republic",
    category: "restaurant", region: "itaewon",
    address: "서울 용산구 이태원로 197", lat: 37.5347, lng: 126.9958,
    description_ko: "남아공식 바비큐(브라이)를 선보이는 이태원 레스토랑. 부어보어스 소시지와 다양한 그릴 고기, 남아공 와인을 낸다.",
    description_en: "A South African braai (barbecue) house in Itaewon, serving boerewors sausage, mixed grills, and South African wines. A rare taste in Seoul.",
    english_support: true, card_payment: true, solo_friendly: false,
    image_url: IMG("1544025162-d76694265947"),
    sources: [
      { source_type: "review", content: "English menu available, staff speak English, foreigners welcome. A little slice of South Africa." },
      { source_type: "blog", content: "영어 메뉴 있고 영어 응대 가능. 외국인 환영 분위기라 편했어요. 카드 결제 됨." },
    ],
    metrics: { korean_review_ratio: 0.4, foreign_visitor_ratio: 0.7, korean_search_ratio: 0.44,
      price_estimate: 32000, stay_minutes: 100, english_subtitles: false, time_slot: "meal" },
  },
  {
    name_ko: "라이너스 바베큐", name_en: "Linus' BBQ", slug: "linus-bbq",
    category: "restaurant", region: "gyeongnidan",
    address: "서울 용산구 회나무로13가길 9", lat: 37.5375, lng: 126.9884,
    description_ko: "경리단길의 미국 남부식 바베큐 전문점. 참나무 훈연 풀드포크와 브리스킷, 콘브레드를 낸다.",
    description_en: "American Southern-style BBQ on Gyeongnidan-gil — oak-smoked pulled pork, brisket, and cornbread. A pioneer of Seoul's craft-BBQ scene.",
    english_support: true, card_payment: true, solo_friendly: false,
    image_url: IMG("1529193591184-b1d58069ecdd"),
    sources: [
      { source_type: "review", content: "영어 메뉴 있음. 외국인 손님 많고 영어 응대 가능. 카드 결제 가능하고 예약 없이 바로 이용 가능." },
      { source_type: "blog", content: "Legit Southern BBQ. English menu, foreigners welcome, walk-in friendly." },
      { source_type: "review", content: "English spoken, cards accepted." },
    ],
    metrics: { korean_review_ratio: 0.48, foreign_visitor_ratio: 0.6, korean_search_ratio: 0.5,
      price_estimate: 28000, stay_minutes: 100, english_subtitles: false, time_slot: "meal" },
  },
  {
    name_ko: "단풍나무집", name_en: "Maple Tree House", slug: "maple-tree-house",
    category: "restaurant", region: "itaewon",
    address: "서울 용산구 이태원로27가길 20", lat: 37.5343, lng: 126.9930,
    description_ko: "이태원의 인기 한식 숯불구이집. 양념 갈비와 삼겹살을 숯불에 구워 내며 외국인 방문객에게도 잘 알려져 있다.",
    description_en: "A popular Korean charcoal-grill house in Itaewon, known for marinated galbi and samgyeopsal. A go-to introduction to Korean BBQ for visitors.",
    english_support: true, card_payment: true, solo_friendly: false,
    image_url: IMG("1504674900247-0877df9cc836"),
    sources: [
      { source_type: "review", content: "영어 메뉴 있고 영어 응대 가능. 외국인 손님 많아요. 카드 결제 가능." },
      { source_type: "blog", content: "Good first Korean BBQ for visitors — English menu, foreigners welcome, staff help you grill." },
    ],
    metrics: { korean_review_ratio: 0.58, foreign_visitor_ratio: 0.52, korean_search_ratio: 0.57,
      price_estimate: 30000, stay_minutes: 100, english_subtitles: false, time_slot: "meal" },
  },
  {
    name_ko: "카사블랑카 샌드위치", name_en: "Casablanca Sandwicherie", slug: "casablanca-sandwicherie",
    category: "restaurant", region: "haebangchon",
    address: "서울 용산구 신흥로 34", lat: 37.5420, lng: 126.9860,
    description_ko: "해방촌의 작은 모로코 샌드위치 가게. 바게트 샌드위치 '박서(Bocadillo)'와 하리라 수프로 유명하며 자리가 몇 개 없어 포장이 많다.",
    description_en: "A tiny Moroccan sandwich shop in Haebangchon, famous for its baguette bocadillos and harira soup. Seats are few, so most orders are takeaway.",
    english_support: true, card_payment: true, solo_friendly: true,
    image_url: IMG("1509722747041-616f39b57569"),
    sources: [
      { source_type: "review", content: "사장님 영어 응대 가능하고 외국인 환영. 메뉴 간단해서 주문 쉬움." },
      { source_type: "blog", content: "Owner speaks English, foreigners welcome. English menu on the wall, cards accepted." },
    ],
    metrics: { korean_review_ratio: 0.5, foreign_visitor_ratio: 0.55, korean_search_ratio: 0.53,
      price_estimate: 12000, stay_minutes: 45, english_subtitles: false, time_slot: "meal" },
  },
  {
    name_ko: "바다식당", name_en: "Bada Sikdang", slug: "bada-sikdang",
    category: "restaurant", region: "itaewon",
    address: "서울 용산구 보광로59길 32", lat: 37.5320, lng: 126.9962,
    description_ko: "이태원 뒷골목의 오래된 존슨탕·부대찌개 노포. 미군 부대 문화에서 비롯된 존슨탕으로 유명한 현지인 단골집이다.",
    description_en: "An old Itaewon backstreet diner famous for 'Johnson tang' army stew, a dish born from the nearby U.S. base. A neighborhood regulars' spot, not a tourist stop.",
    english_support: false, card_payment: true, solo_friendly: true,
    image_url: IMG("1580651315530-69c8e0026377"),
    sources: [
      { source_type: "review", content: "현지인 맛집. 관광객 없음, 완전 로컬 분위기예요. 동네 단골이 많음." },
      { source_type: "blog", content: "영어 안 통함, 한국어만 됩니다. 메뉴판도 한글만. 현지인 추천 존슨탕." },
      { source_type: "review", content: "Real local spot, no tourists. Korean only, no English menu — but the stew is worth it." },
    ],
    metrics: { korean_review_ratio: 0.9, foreign_visitor_ratio: 0.15, korean_search_ratio: 0.88,
      price_estimate: 12000, stay_minutes: 60, english_subtitles: false, time_slot: "meal" },
  },

  // ── Cafes ──────────────────────────────────────────────────────────────────
  {
    name_ko: "올드페리도넛", name_en: "Old Ferry Donut", slug: "old-ferry-donut",
    category: "cafe", region: "hannam",
    address: "서울 용산구 대사관로5길 12", lat: 37.5352, lng: 127.0006,
    description_ko: "한남동의 인기 수제 도넛 카페. 브리오슈 반죽으로 만든 두툼한 도넛과 스페셜티 커피로 줄 서는 명소가 되었다.",
    description_en: "A cult brioche-doughnut cafe in Hannam, pairing thick handmade doughnuts with specialty coffee. Weekend lines are the norm.",
    english_support: true, card_payment: true, solo_friendly: true,
    image_url: IMG("1583623025817-d180a2221d0a"),
    sources: [
      { source_type: "review", content: "영어 메뉴 있고 카드 결제 가능. 외국인 손님도 많이 와요. 예약 없이 바로 이용 가능." },
      { source_type: "blog", content: "English menu, cards accepted, walk-in. Popular with both locals and foreigners in Hannam." },
    ],
    metrics: { korean_review_ratio: 0.62, foreign_visitor_ratio: 0.45, korean_search_ratio: 0.6,
      price_estimate: 11000, stay_minutes: 50, english_subtitles: false, time_slot: null },
  },
  {
    name_ko: "베이커스테이블", name_en: "The Baker's Table", slug: "the-bakers-table",
    category: "cafe", region: "gyeongnidan",
    address: "서울 용산구 회나무로13길 4", lat: 37.5372, lng: 126.9880,
    description_ko: "경리단길의 독일식 베이커리 카페. 독일인 마이스터가 굽는 프레첼과 사워도우 빵, 소시지 플레이트를 낸다.",
    description_en: "A German bakery-cafe on Gyeongnidan-gil where a German master baker turns out pretzels, sourdough, and sausage plates. A local expat favorite.",
    english_support: true, card_payment: true, solo_friendly: true,
    image_url: IMG("1509042239860-f550ce710b93"),
    sources: [
      { source_type: "review", content: "영어 응대 가능하고 외국인 환영. 영어 메뉴 있음. 카드 결제 됨." },
      { source_type: "blog", content: "German-run bakery, English spoken, foreigners welcome. Great pretzels." },
    ],
    metrics: { korean_review_ratio: 0.55, foreign_visitor_ratio: 0.5, korean_search_ratio: 0.55,
      price_estimate: 13000, stay_minutes: 60, english_subtitles: false, time_slot: null },
  },
  {
    name_ko: "패션5", name_en: "Passion 5", slug: "passion-5",
    category: "cafe", region: "hannam",
    address: "서울 용산구 독서당로 111", lat: 37.5361, lng: 127.0053,
    description_ko: "한남동의 대형 베이커리·디저트·카페 복합 공간. SPC가 운영하며 고급 페이스트리와 케이크, 초콜릿을 판매한다.",
    description_en: "A large bakery, patisserie, and cafe complex in Hannam run by SPC, offering high-end pastries, cakes, and chocolates. A flagship destination.",
    english_support: true, card_payment: true, solo_friendly: true,
    image_url: IMG("1486427944299-d1955d23e34d"),
    sources: [
      { source_type: "review", content: "영어 메뉴 있고 카드 결제 가능. 외국인도 편하게 이용. 바로 입장 가능." },
      { source_type: "blog", content: "English labels on everything, cards accepted, walk-in. Foreigners welcome." },
    ],
    metrics: { korean_review_ratio: 0.6, foreign_visitor_ratio: 0.4, korean_search_ratio: 0.62,
      price_estimate: 14000, stay_minutes: 60, english_subtitles: false, time_slot: null },
  },
  {
    name_ko: "앤트러사이트 한남", name_en: "Anthracite Hannam", slug: "anthracite-hannam",
    category: "cafe", region: "hannam",
    address: "서울 용산구 이태원로 240", lat: 37.5348, lng: 127.0068,
    description_ko: "한남동의 스페셜티 커피 로스터리 앤트러사이트 지점. 싱글 오리진 핸드드립과 미니멀한 콘크리트 인테리어로 유명하다.",
    description_en: "The Hannam branch of specialty roaster Anthracite, known for single-origin pour-overs and a minimalist concrete interior.",
    english_support: true, card_payment: true, solo_friendly: true,
    image_url: IMG("1554118811-1e0d58224f24"),
    sources: [
      { source_type: "review", content: "카드 결제 가능하고 바로 이용 가능. 영어 메뉴 있어서 외국인도 편함." },
      { source_type: "blog", content: "English menu, cards accepted, walk-in. Quiet spot, foreigners welcome." },
    ],
    metrics: { korean_review_ratio: 0.6, foreign_visitor_ratio: 0.42, korean_search_ratio: 0.6,
      price_estimate: 9000, stay_minutes: 60, english_subtitles: false, time_slot: null },
  },

  // ── Bars ─────────────────────────────────────────────────────────────────────
  {
    name_ko: "맥파이 브루잉", name_en: "Magpie Brewing", slug: "magpie-brewing",
    category: "bar", region: "gyeongnidan",
    address: "서울 용산구 녹사평대로40가길 5", lat: 37.5378, lng: 126.9876,
    description_ko: "경리단길에서 시작한 크래프트 맥주 브루펍. 페일 에일과 포터 등 자체 양조 맥주를 지하 바에서 즐길 수 있다.",
    description_en: "A craft brewpub that helped launch Gyeongnidan's beer scene, pouring its own pale ales and porters in a basement bar. A cornerstone of Seoul craft beer.",
    english_support: true, card_payment: true, solo_friendly: true,
    image_url: IMG("1518176258769-f227c798150e"),
    sources: [
      { source_type: "review", content: "영어 메뉴 있고 영어 응대 가능. 외국인 손님 많음. 카드 결제 되고 예약 없이 바로 이용 가능." },
      { source_type: "blog", content: "English menu, English spoken, foreigners welcome, walk-in. A craft beer institution." },
    ],
    metrics: { korean_review_ratio: 0.5, foreign_visitor_ratio: 0.6, korean_search_ratio: 0.5,
      price_estimate: 18000, stay_minutes: 120, english_subtitles: false, time_slot: "meal" },
  },
  {
    name_ko: "사우스사이드 팔러", name_en: "Southside Parlor", slug: "southside-parlor",
    category: "bar", region: "haebangchon",
    address: "서울 용산구 신흥로 25", lat: 37.5418, lng: 126.9855,
    description_ko: "해방촌의 텍사스식 칵테일 바. 미국인 바텐더들이 운영하며 시즈널 칵테일과 옥상 테라스로 유명하다.",
    description_en: "A Texan-run cocktail bar in Haebangchon, known for seasonal craft cocktails and a rooftop terrace. An expat-scene fixture.",
    english_support: true, card_payment: true, solo_friendly: true,
    image_url: IMG("1470337458703-46ad1756a187"),
    sources: [
      { source_type: "review", content: "영어 응대 가능, 외국인 환영. 영어 메뉴 있고 카드 결제 됨." },
      { source_type: "blog", content: "American bartenders, English spoken, foreigners welcome. Cards accepted." },
    ],
    metrics: { korean_review_ratio: 0.45, foreign_visitor_ratio: 0.68, korean_search_ratio: 0.46,
      price_estimate: 20000, stay_minutes: 120, english_subtitles: false, time_slot: "meal" },
  },
  {
    name_ko: "그랜드 올 오프리", name_en: "Grand Ole Opry", slug: "grand-ole-opry",
    category: "bar", region: "itaewon",
    address: "서울 용산구 이태원로27가길 40", lat: 37.5338, lng: 126.9935,
    description_ko: "이태원의 오래된 컨트리 음악 바. 수십 년째 컨트리 음악과 라인댄스로 알려진 노포이며 현금 결제 위주로 운영한다.",
    description_en: "A decades-old country-music bar in Itaewon, long known for line dancing and a cash-first, old-school way of doing business.",
    english_support: true, card_payment: false, solo_friendly: true,
    image_url: IMG("1514933651103-005eec06c04b"),
    sources: [
      { source_type: "review", content: "현금 결제만 가능하니 현금 챙겨가세요. 카드 결제 불가. 오래된 컨트리 바." },
      { source_type: "blog", content: "Cash only — bring cash, no cards. English spoken though, foreigners welcome. A legendary old country bar." },
    ],
    metrics: { korean_review_ratio: 0.55, foreign_visitor_ratio: 0.55, korean_search_ratio: 0.5,
      price_estimate: 15000, stay_minutes: 120, english_subtitles: false, time_slot: "meal" },
  },

  // ── Activity / culture ───────────────────────────────────────────────────────
  {
    name_ko: "서울중앙성원", name_en: "Seoul Central Mosque", slug: "seoul-central-mosque",
    category: "activity", region: "itaewon",
    address: "서울 용산구 우사단로10길 39", lat: 37.5343, lng: 126.9950,
    description_ko: "1976년 문을 연 한국 최초의 이슬람 사원. 이태원 언덕에 자리하며 주변에 할랄 식당과 무슬림 커뮤니티가 형성되어 있다.",
    description_en: "Korea's first mosque, opened in 1976 on an Itaewon hillside. The surrounding streets host halal restaurants and a Muslim community. Visitors are welcome outside prayer times.",
    english_support: true, card_payment: false, solo_friendly: true,
    image_url: IMG("1519817650390-64a93db51149"),
    sources: [
      { source_type: "manual", content: "외국인 환영. 영어 안내 있음, 예배 시간 외에는 누구나 바로 방문 가능. 무료 입장." },
      { source_type: "blog", content: "Foreigners welcome, English signage, walk-in outside prayer hours. Free to enter." },
    ],
    metrics: { korean_review_ratio: 0.4, foreign_visitor_ratio: 0.65, korean_search_ratio: 0.45,
      price_estimate: 0, stay_minutes: 40, english_subtitles: false, time_slot: null },
  },
  {
    name_ko: "전쟁기념관", name_en: "War Memorial of Korea", slug: "war-memorial-of-korea",
    category: "activity", region: "yongsan",
    address: "서울 용산구 이태원로 29", lat: 37.5369, lng: 126.9773,
    description_ko: "용산에 위치한 대규모 전쟁 역사 박물관. 한국전쟁을 중심으로 한 전시와 야외 무기 전시장이 있으며 입장은 무료다.",
    description_en: "A large military-history museum in Yongsan centered on the Korean War, with extensive indoor exhibits and an outdoor weapons park. Admission is free.",
    english_support: true, card_payment: true, solo_friendly: true,
    image_url: IMG("1526779259212-939e64788e3c"),
    sources: [
      { source_type: "manual", content: "영어 안내와 영어 오디오 가이드 제공. 외국인 환영, 바로 입장 가능. 무료 입장." },
      { source_type: "blog", content: "English audio guide and English signage, foreigners welcome, walk-in. Free admission." },
    ],
    metrics: { korean_review_ratio: 0.5, foreign_visitor_ratio: 0.6, korean_search_ratio: 0.5,
      price_estimate: 0, stay_minutes: 120, english_subtitles: true, time_slot: null },
  },
  {
    name_ko: "국립중앙박물관", name_en: "National Museum of Korea", slug: "national-museum-of-korea",
    category: "activity", region: "yongsan",
    address: "서울 용산구 서빙고로 137", lat: 37.5240, lng: 126.9803,
    description_ko: "용산 가족공원 옆에 자리한 한국 최대 박물관. 선사시대부터 근대까지의 유물을 소장하며 상설 전시는 무료다.",
    description_en: "Korea's largest museum, beside Yongsan Family Park, holding artifacts from prehistory to the modern era. Permanent exhibitions are free.",
    english_support: true, card_payment: true, solo_friendly: true,
    image_url: IMG("1518998053901-5348d3961a04"),
    sources: [
      { source_type: "manual", content: "영어 안내 완비, 영어 오디오 가이드 대여 가능. 외국인 환영, 바로 입장. 상설전 무료 입장." },
      { source_type: "blog", content: "Full English signage, English audio guide available, foreigners welcome, walk-in. Free for the permanent collection." },
    ],
    metrics: { korean_review_ratio: 0.55, foreign_visitor_ratio: 0.55, korean_search_ratio: 0.55,
      price_estimate: 3000, stay_minutes: 150, english_subtitles: true, time_slot: null },
  },
  {
    name_ko: "현대카드 뮤직라이브러리", name_en: "Hyundai Card Music Library", slug: "hyundai-card-music-library",
    category: "activity", region: "hannam",
    address: "서울 용산구 이태원로 246", lat: 37.5346, lng: 127.0072,
    description_ko: "한남동의 바이닐 음악 도서관. 희귀 LP와 음악 서적을 소장하며 현대카드 회원 또는 사전 예약자를 중심으로 입장이 운영된다.",
    description_en: "A vinyl-focused music library in Hannam holding rare LPs and music books. Entry is oriented around Hyundai Card members or advance booking.",
    english_support: true, card_payment: true, solo_friendly: true,
    image_url: IMG("1483412033650-1015ddeb83d1"),
    sources: [
      { source_type: "manual", content: "영어 안내 있음. 다만 현대카드 회원 위주로 운영되고 사전 예약 필요할 수 있음." },
      { source_type: "blog", content: "English signage, English spoken. Note: reservation may be required and it's oriented to Hyundai Card members." },
    ],
    metrics: { korean_review_ratio: 0.62, foreign_visitor_ratio: 0.4, korean_search_ratio: 0.62,
      price_estimate: 5000, stay_minutes: 90, english_subtitles: true, time_slot: null },
  },

  // ── Market / shopping ────────────────────────────────────────────────────────
  {
    name_ko: "이태원시장", name_en: "Itaewon Market", slug: "itaewon-market",
    category: "market", region: "itaewon",
    address: "서울 용산구 이태원로14길", lat: 37.5341, lng: 126.9950,
    description_ko: "이태원역 인근의 오래된 재래시장 골목. 수입 식료품, 원단·맞춤 양복점, 정육점이 모여 있으며 현지 상인들이 운영한다.",
    description_en: "An old traditional market lane near Itaewon station with imported groceries, fabric and tailor shops, and butchers run by longtime local merchants.",
    english_support: false, card_payment: true, solo_friendly: true,
    image_url: IMG("1555939594-58d7cb561ad1"),
    sources: [
      { source_type: "review", content: "현지인 맛집과 정육점이 모인 로컬 시장. 로컬 분위기 물씬. 상인분들 영어 안 통함, 한국어만." },
      { source_type: "blog", content: "Local market vibe, mostly Korean shoppers. Some stalls are cash only. English not really spoken." },
    ],
    metrics: { korean_review_ratio: 0.82, foreign_visitor_ratio: 0.25, korean_search_ratio: 0.8,
      price_estimate: 10000, stay_minutes: 60, english_subtitles: false, time_slot: null },
  },
  {
    name_ko: "해방촌 신흥시장", name_en: "HBC Sinheung Market", slug: "hbc-sinheung-market",
    category: "market", region: "haebangchon",
    address: "서울 용산구 신흥로 39", lat: 37.5426, lng: 126.9848,
    description_ko: "해방촌 언덕의 오래된 재래시장. 낡은 상가 사이에 젊은 창작자들의 작업실과 작은 식당이 들어섰지만 여전히 로컬 색이 강하다.",
    description_en: "An old covered market on the Haebangchon hill where young makers' studios and tiny eateries have moved into aging shopfronts, yet it stays strongly local.",
    english_support: false, card_payment: false, solo_friendly: true,
    image_url: IMG("1533900298318-6b8da08a523e"),
    sources: [
      { source_type: "review", content: "현지인 맛집, 관광객 없음, 완전 로컬 분위기. 대부분 현금 결제만 가능하고 카드 결제 불가한 곳도 많음." },
      { source_type: "blog", content: "영어 안 통함, 한국어만. 오래된 로컬 시장이라 현금 챙겨가야 함." },
      { source_type: "review", content: "Real local market, no tourists. Cash only at most stalls, English not spoken." },
    ],
    metrics: { korean_review_ratio: 0.85, foreign_visitor_ratio: 0.18, korean_search_ratio: 0.83,
      price_estimate: 9000, stay_minutes: 50, english_subtitles: false, time_slot: null },
  },
  {
    name_ko: "이태원 앤틱가구거리", name_en: "Itaewon Antique Furniture Street", slug: "itaewon-antique-furniture-street",
    category: "shopping", region: "itaewon",
    address: "서울 용산구 보광로 60", lat: 37.5318, lng: 126.9970,
    description_ko: "이태원 보광로를 따라 형성된 앤틱 가구·수입 가구 거리. 유럽·미국에서 들여온 빈티지 가구를 취급하는 오래된 상점들이 늘어서 있다.",
    description_en: "A street of antique and imported-furniture dealers along Itaewon's Bogwang-ro, lined with long-established shops selling vintage pieces from Europe and the U.S.",
    english_support: false, card_payment: true, solo_friendly: true,
    image_url: IMG("1449247709967-d4461a6a6103"),
    sources: [
      { source_type: "review", content: "현지인 단골 위주의 오래된 가구 거리. 로컬 분위기. 사장님들 영어 안 통함, 한국어만 되는 곳이 많음." },
      { source_type: "blog", content: "Old furniture dealers, mostly Korean-speaking. Local vibe, few tourists. English not spoken at most shops." },
    ],
    metrics: { korean_review_ratio: 0.8, foreign_visitor_ratio: 0.22, korean_search_ratio: 0.78,
      price_estimate: 30000, stay_minutes: 60, english_subtitles: false, time_slot: null },
  },
  {
    name_ko: "밀리미터밀리그람 한남", name_en: "MMMG Hannam", slug: "mmmg-hannam",
    category: "shopping", region: "hannam",
    address: "서울 용산구 이태원로 240", lat: 37.5349, lng: 127.0064,
    description_ko: "한남동의 디자인 문구·라이프스타일 편집숍 MMMG. 자체 제작 노트와 문구, 잡화, 카페를 함께 운영한다.",
    description_en: "A design stationery and lifestyle store in Hannam, MMMG sells its own notebooks and paper goods alongside a small cafe. A quiet browse for design lovers.",
    english_support: true, card_payment: true, solo_friendly: true,
    image_url: IMG("1441986300917-64674bd600d8"),
    sources: [
      { source_type: "review", content: "카드 결제 가능하고 바로 입장. 영어 되는 직원 있어서 외국인도 편함." },
      { source_type: "blog", content: "Cards accepted, walk-in, English spoken by staff. Foreigners welcome." },
    ],
    metrics: { korean_review_ratio: 0.6, foreign_visitor_ratio: 0.4, korean_search_ratio: 0.6,
      price_estimate: 20000, stay_minutes: 45, english_subtitles: false, time_slot: null },
  },

  // ── Accommodation ────────────────────────────────────────────────────────────
  {
    name_ko: "그랜드 하얏트 서울", name_en: "Grand Hyatt Seoul", slug: "grand-hyatt-seoul",
    category: "accommodation", region: "yongsan",
    address: "서울 용산구 소월로 322", lat: 37.5396, lng: 126.9967,
    description_ko: "남산 자락에 자리한 5성급 호텔. 이태원과 한남동을 내려다보는 전망과 야외 수영장, 겨울 아이스링크로 유명하다.",
    description_en: "A five-star hotel on the slopes of Namsan, known for views over Itaewon and Hannam, an outdoor pool, and a winter ice rink.",
    english_support: true, card_payment: true, solo_friendly: true,
    image_url: IMG("1566073771259-6a8506099945"),
    sources: [
      { source_type: "review", content: "영어 응대 완벽. 외국인 환영, 영어 메뉴와 다국어 안내 지원. 카드 결제 가능." },
      { source_type: "blog", content: "Staff speak fluent English, foreigners welcome, multilingual support, cards accepted." },
    ],
    metrics: { korean_review_ratio: 0.35, foreign_visitor_ratio: 0.78, korean_search_ratio: 0.4,
      price_estimate: 250000, stay_minutes: 90, english_subtitles: false, time_slot: null },
  },

  // ── Code-seed places (mirror src/data/seed.ts slugs/values so the DB matches
  //    what the map already shows) ───────────────────────────────────────────
  {
    name_ko: "리움미술관", name_en: "Leeum Museum of Art", slug: "leeum-museum",
    category: "activity", region: "hannam",
    address: "서울 용산구 이태원로55길 60-16", lat: 37.5358, lng: 126.9988,
    description_ko: "이태원 바로 옆 삼성 세계 수준의 사립 미술관. 쿨하스·하디드·보타가 설계한 세 건물에 고려청자부터 현대 미술까지 1만 5천여 점 소장.",
    description_en: "Samsung's world-class private art museum steps from Itaewon. Three landmark buildings by Koolhaas, Hadid, and Botta house 15,000+ works spanning Korean antiquities to global contemporary art.",
    english_support: true, card_payment: true, solo_friendly: true,
    image_url: IMG("1518998053901-5348d3961a04"),
    sources: [
      { source_type: "manual", content: "영어 안내와 영어 오디오 가이드 제공. 외국인 환영. 카드 결제 가능." },
      { source_type: "blog", content: "English audio guide, English signage, foreigners welcome. Cards accepted." },
    ],
    metrics: { korean_review_ratio: 0.55, foreign_visitor_ratio: 0.5, korean_search_ratio: 0.55,
      price_estimate: 20000, stay_minutes: 120, english_subtitles: true, time_slot: null },
  },
  {
    name_ko: "남산서울타워", name_en: "Namsan Seoul Tower", slug: "namsan-seoul-tower",
    category: "activity", region: "yongsan",
    address: "서울 용산구 남산공원길 105", lat: 37.5512, lng: 126.9882,
    description_ko: "이태원 위에 우뚝 선 서울의 상징. 케이블카나 등산로로 올라가는 전망대. 낮과 밤 모두 아름다우며 자정까지 운영.",
    description_en: "Seoul's most iconic landmark, towering above Itaewon. Take the cable car or hike up for panoramic city views. A must-see day and night — the observation deck is open until midnight.",
    english_support: true, card_payment: true, solo_friendly: true,
    image_url: IMG("1546874177-9e664107314e"),
    sources: [
      { source_type: "review", content: "영어 안내 있고 외국인 환영. 카드 결제 가능. 매표 후 바로 입장." },
      { source_type: "blog", content: "English signage, foreigners welcome, cards accepted, walk-in tickets." },
    ],
    metrics: { korean_review_ratio: 0.45, foreign_visitor_ratio: 0.65, korean_search_ratio: 0.48,
      price_estimate: 21000, stay_minutes: 90, english_subtitles: false, time_slot: null },
  },
  {
    name_ko: "이태원 세계음식거리", name_en: "Itaewon Food Street", slug: "itaewon-food-street",
    category: "restaurant", region: "itaewon",
    address: "서울 용산구 이태원로", lat: 37.5347, lng: 126.9942,
    description_ko: "이태원의 전설적인 세계 음식 거리. 멕시칸, 인도, 터키, 레바논 등 각국 음식점이 밀집한 한국 최고의 다문화 식도락 거리.",
    description_en: "Itaewon's legendary stretch of international cuisine. Mexican, Indian, Turkish, Lebanese — every country seems to have a restaurant here. Korea's most multicultural dining strip.",
    english_support: true, card_payment: true, solo_friendly: true,
    image_url: IMG("1555939594-58d7cb561ad1"),
    sources: [
      { source_type: "review", content: "영어 메뉴 있는 곳이 많고 외국인 환영. 영어 응대 가능. 관광객 많음." },
      { source_type: "blog", content: "Most restaurants have an English menu, foreigners welcome, English spoken. Touristy but fun." },
    ],
    metrics: { korean_review_ratio: 0.45, foreign_visitor_ratio: 0.68, korean_search_ratio: 0.48,
      price_estimate: 22000, stay_minutes: 90, english_subtitles: false, time_slot: "meal" },
  },
  {
    name_ko: "경리단길", name_en: "Gyeongnidan-gil", slug: "gyeongnidan-gil",
    category: "cafe", region: "gyeongnidan",
    address: "서울 용산구 이태원로54길", lat: 37.5353, lng: 126.9893,
    description_ko: "이태원의 가장 개성 넘치는 골목. 각국 음식점·인디 카페·빈티지 숍이 비탈 골목에 빼곡히 들어선, 서울 'X리단길' 트렌드를 시작한 원조.",
    description_en: "Itaewon's most eclectic street. International restaurants, indie cafes, and vintage boutiques packed into a hillside alley — the original 'Gyeongridan' that sparked a Seoul street-naming trend.",
    english_support: true, card_payment: true, solo_friendly: true,
    image_url: IMG("1736676942613-1787d05436e2"),
    sources: [
      { source_type: "review", content: "영어 메뉴 있는 카페 많고 외국인 손님도 많음. 카드 결제 가능." },
      { source_type: "blog", content: "Lots of cafes with English menus, foreigners welcome, cards accepted. Local-meets-international vibe." },
    ],
    metrics: { korean_review_ratio: 0.55, foreign_visitor_ratio: 0.5, korean_search_ratio: 0.55,
      price_estimate: 12000, stay_minutes: 60, english_subtitles: false, time_slot: null },
  },
  {
    name_ko: "해방촌", name_en: "Haebangchon", slug: "haebangchon",
    category: "cafe", region: "haebangchon",
    address: "서울 용산구 신흥로", lat: 37.5432, lng: 126.9812,
    description_ko: "이태원의 숨겨진 언덕 동네. 작은 바, 인디 음악 공간, 각국 카페가 골목 사이에 촘촘히 들어선 이태원의 로컬 감성 지역.",
    description_en: "Itaewon's hidden hillside neighborhood. Tiny bars, underground music venues, and international cafes tucked into winding alleys — the grittier, more local side of Yongsan.",
    english_support: true, card_payment: true, solo_friendly: true,
    image_url: IMG("1772224927586-daa4327820bb"),
    sources: [
      { source_type: "review", content: "로컬 분위기 강한 동네. 영어 응대 되는 카페도 있고 외국인도 많이 삼. 카드 결제 가능." },
      { source_type: "blog", content: "Local hillside vibe with a mix of English-speaking cafes and bars. Foreigners welcome, cards accepted." },
    ],
    metrics: { korean_review_ratio: 0.55, foreign_visitor_ratio: 0.52, korean_search_ratio: 0.55,
      price_estimate: 12000, stay_minutes: 60, english_subtitles: false, time_slot: null },
  },
  {
    name_ko: "한남동", name_en: "Hannamdong", slug: "hannamdong",
    category: "shopping", region: "hannam",
    address: "서울 용산구 한남대로", lat: 37.5343, lng: 127.0040,
    description_ko: "이태원역에서 도보 5분 거리의 서울 최고급 동네. 부티크 갤러리, 컨셉 스토어, 서울에서 가장 화제인 레스토랑이 가로수 길을 따라 줄지어 있음.",
    description_en: "Seoul's most affluent village, a five-minute walk from Itaewon station. Boutique galleries, concept stores, and the city's most talked-about restaurants line tree-shaded Itaewon-ro.",
    english_support: true, card_payment: true, solo_friendly: true,
    image_url: IMG("1555396273-367ea4eb4db5"),
    sources: [
      { source_type: "review", content: "고급 편집숍과 갤러리 많음. 영어 응대 되는 곳 많고 카드 결제 가능. 외국인도 편하게 다님." },
      { source_type: "blog", content: "Upscale galleries and concept stores, English spoken at many, cards accepted. Foreigners welcome." },
    ],
    metrics: { korean_review_ratio: 0.6, foreign_visitor_ratio: 0.45, korean_search_ratio: 0.6,
      price_estimate: 25000, stay_minutes: 60, english_subtitles: false, time_slot: null },
  },
];

// ── run ────────────────────────────────────────────────────────────────────────
function fail(stage, error) {
  console.error(`\nERROR at [${stage}]: ${error?.message ?? error}`);
  process.exit(1);
}

async function main() {
  console.log("Itaewon seed — target:", SUPABASE_URL);
  console.log("=".repeat(60));

  // 1) regions — upsert by slug (no id in payload; existing ids preserved)
  const { error: regErr } = await supabase
    .from("regions")
    .upsert(REGIONS, { onConflict: "slug" });
  if (regErr) fail("regions.upsert", regErr);

  const { data: regionRows, error: regSelErr } = await supabase
    .from("regions")
    .select("id, slug")
    .in("slug", REGIONS.map((r) => r.slug));
  if (regSelErr) fail("regions.select", regSelErr);

  const regionIdBySlug = Object.fromEntries(regionRows.map((r) => [r.slug, r.id]));
  console.log(`regions:  upserted ${REGIONS.length}, resolved ${regionRows.length} ids`);

  for (const p of PLACES) {
    if (!regionIdBySlug[p.region]) fail("region-map", `unknown region slug "${p.region}" for place "${p.slug}"`);
  }

  // 2) places — upsert by slug (no id; core columns only, scores default to 50)
  const placeRows = PLACES.map((p) => ({
    name_ko: p.name_ko,
    name_en: p.name_en,
    slug: p.slug,
    description_ko: p.description_ko,
    description_en: p.description_en,
    category: p.category,
    region_id: regionIdBySlug[p.region],
    address: p.address,
    lat: p.lat,
    lng: p.lng,
    image_url: p.image_url,
    english_support: p.english_support,
    card_payment: p.card_payment,
    solo_friendly: p.solo_friendly,
  }));

  const { error: placeErr } = await supabase
    .from("places")
    .upsert(placeRows, { onConflict: "slug" });
  if (placeErr) fail("places.upsert", placeErr);

  const { data: placeIdRows, error: placeSelErr } = await supabase
    .from("places")
    .select("id, slug")
    .in("slug", PLACES.map((p) => p.slug));
  if (placeSelErr) fail("places.select", placeSelErr);

  const placeIdBySlug = Object.fromEntries(placeIdRows.map((r) => [r.slug, r.id]));
  console.log(`places:   upserted ${PLACES.length}, resolved ${placeIdRows.length} ids`);

  if (placeIdRows.length !== PLACES.length) {
    fail("places.verify", `expected ${PLACES.length} place ids, got ${placeIdRows.length}`);
  }

  // 3) grading_sources — delete-then-insert per place (idempotent refresh)
  let sourceCount = 0;
  for (const p of PLACES) {
    const placeId = placeIdBySlug[p.slug];
    const { error: delErr } = await supabase
      .from("grading_sources")
      .delete()
      .eq("place_id", placeId);
    if (delErr) fail(`grading_sources.delete(${p.slug})`, delErr);

    const rows = p.sources.map((s) => ({
      place_id: placeId,
      source_type: s.source_type,
      url: s.url ?? null,
      content: s.content,
    }));
    const { error: insErr } = await supabase.from("grading_sources").insert(rows);
    if (insErr) fail(`grading_sources.insert(${p.slug})`, insErr);
    sourceCount += rows.length;
  }
  console.log(`sources:  refreshed ${sourceCount} grading_sources across ${PLACES.length} places`);

  // 4) place_local_metrics — upsert by place_id.
  //    local_keyword_score + li left at 0 (derived by the recompute API).
  const metricRows = PLACES.map((p) => ({
    place_id: placeIdBySlug[p.slug],
    korean_review_ratio: p.metrics.korean_review_ratio,
    foreign_visitor_ratio: p.metrics.foreign_visitor_ratio,
    korean_search_ratio: p.metrics.korean_search_ratio,
    local_keyword_score: 0,
    li: 0,
    price_estimate: p.metrics.price_estimate,
    stay_minutes: p.metrics.stay_minutes,
    english_subtitles: p.metrics.english_subtitles,
    time_slot: p.metrics.time_slot,
  }));
  const { error: metricErr } = await supabase
    .from("place_local_metrics")
    .upsert(metricRows, { onConflict: "place_id" });
  if (metricErr) fail("place_local_metrics.upsert", metricErr);
  console.log(`metrics:  upserted ${metricRows.length} place_local_metrics`);

  console.log("=".repeat(60));
  console.log("DONE.");
  console.log(`  regions: ${REGIONS.length}`);
  console.log(`  places:  ${PLACES.length}`);
  console.log(`  grading_sources: ${sourceCount}`);
  console.log(`  place_local_metrics: ${metricRows.length}`);
  console.log("\nNext: run a full grade + locality-index recompute from the admin");
  console.log("panel (or its API) so ls/ar/pd/lf, grade, local_keyword_score, and li are derived.");
}

main().catch((e) => fail("uncaught", e));
