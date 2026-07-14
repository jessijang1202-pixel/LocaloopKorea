// Server-side web data collectors (patent no.2 module 100 — web data collection).
//
// Two external sources, both called with the built-in fetch (no new deps):
//   - Kakao Local REST API  — place discovery by keyword (requires
//     KAKAO_REST_API_KEY, a server-only key; the NEXT_PUBLIC_KAKAO_MAP_KEY JS
//     key does NOT work for the REST API).
//   - Naver Search API      — blog review text for a place (optional; requires
//     NAVER_CLIENT_ID / NAVER_CLIENT_SECRET). Degrades to [] when unset.
//
// Every function degrades gracefully when its keys are missing.

// ── Hashing ──────────────────────────────────────────────────────────────────

// FNV-1a 32-bit hash. Deterministic across runs, used to derive a STABLE slug
// for regions whose name has no latin characters (slugify() returns "" there,
// which previously fell back to a per-call `region-${Date.now()}` slug and minted
// a fresh region row on every collect). Returned as an unsigned 32-bit integer.
export function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// ── Kakao Local ──────────────────────────────────────────────────────────────

export interface KakaoPlace {
  id: string;
  place_name: string;
  category_name: string; // breadcrumb, e.g. "음식점 > 한식 > 육류,고기"
  category_group_code: string; // e.g. "FD6", "CE7", or "" for none
  phone: string;
  road_address_name: string;
  address_name: string;
  x: string; // longitude
  y: string; // latitude
  place_url: string;
}

interface KakaoResponse {
  documents?: KakaoPlace[];
}

export function isKakaoConfigured(): boolean {
  return Boolean(process.env.KAKAO_REST_API_KEY);
}

// Keyword search against the Kakao Local REST API. Throws with a descriptive
// message on failure so the collect route can surface the cause to the admin
// (a silent [] here previously made failures look like empty regions).
export async function kakaoLocalSearch(
  query: string,
  categoryGroupCode: string | null,
  size: number
): Promise<KakaoPlace[]> {
  const key = process.env.KAKAO_REST_API_KEY?.trim();
  if (!key) return [];

  const params = new URLSearchParams({
    query,
    size: String(Math.max(1, Math.min(15, size))), // Kakao caps size at 15
  });
  if (categoryGroupCode) params.set("category_group_code", categoryGroupCode);

  const url = `https://dapi.kakao.com/v2/local/search/keyword.json?${params.toString()}`;

  const res = await fetch(url, {
    headers: { Authorization: `KakaoAK ${key}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Kakao Local API ${res.status}: ${detail.slice(0, 200) || res.statusText}`
    );
  }
  const json = (await res.json()) as KakaoResponse;
  return json.documents ?? [];
}

// ── Naver Search (blog) ──────────────────────────────────────────────────────

export interface NaverBlogItem {
  title: string;
  link: string;
  description: string;
}

interface NaverResponse {
  items?: { title?: string; link?: string; description?: string }[];
}

export function isNaverConfigured(): boolean {
  return Boolean(
    process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET
  );
}

// Strip HTML tags (<b>…</b> highlights the Naver API injects) and decode the
// common HTML entities so downstream keyword matching sees clean text.
function stripHtml(input: string): string {
  return input
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

// Blog search against the Naver Search API. Returns [] silently when the keys
// are missing or the request fails.
export async function naverBlogSearch(
  query: string,
  display = 5
): Promise<NaverBlogItem[]> {
  const id = process.env.NAVER_CLIENT_ID;
  const secret = process.env.NAVER_CLIENT_SECRET;
  if (!id || !secret) return [];

  const params = new URLSearchParams({
    query,
    display: String(Math.max(1, Math.min(20, display))),
  });
  const url = `https://openapi.naver.com/v1/search/blog.json?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-Naver-Client-Id": id,
        "X-Naver-Client-Secret": secret,
      },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = (await res.json()) as NaverResponse;
    return (json.items ?? []).map((it) => ({
      title: stripHtml(it.title ?? ""),
      link: it.link ?? "",
      description: stripHtml(it.description ?? ""),
    }));
  } catch {
    return [];
  }
}

// ── Reddit search (patent no.2 — foreign-language / English review source) ────

export interface RedditPost {
  title: string;
  snippet: string;
  permalink: string;
  subreddit: string;
}

interface RedditResponse {
  data?: {
    children?: {
      data?: {
        title?: string;
        selftext?: string;
        permalink?: string;
        subreddit?: string;
      };
    }[];
  };
}

const REDDIT_UA = "LocaloopKorea/1.0 (foreigner-friendliness research)";

export function isRedditConfigured(): boolean {
  return Boolean(
    process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET
  );
}

// Application-only OAuth token (client_credentials), cached in-module until
// shortly before expiry. Reddit blocks anonymous .json access from server IPs
// (403), so the official OAuth API is mandatory. Free tier: 100 requests/min.
let redditToken: { value: string; expiresAt: number } | null = null;

async function getRedditToken(): Promise<string> {
  const id = process.env.REDDIT_CLIENT_ID?.trim();
  const secret = process.env.REDDIT_CLIENT_SECRET?.trim();
  if (!id || !secret) {
    throw new Error(
      "REDDIT_CLIENT_ID/REDDIT_CLIENT_SECRET가 설정되지 않았습니다."
    );
  }
  if (redditToken && Date.now() < redditToken.expiresAt) {
    return redditToken.value;
  }

  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": REDDIT_UA,
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Reddit token ${res.status}: ${detail.slice(0, 200) || res.statusText}`
    );
  }
  const json = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  if (!json.access_token) throw new Error("Reddit token: no access_token");
  redditToken = {
    value: json.access_token,
    // refresh 60s before actual expiry
    expiresAt: Date.now() + ((json.expires_in ?? 3600) - 60) * 1000,
  };
  return redditToken.value;
}

// Search Reddit for English-language mentions of a place via the official
// OAuth API. Throws with the status on failure so the route can surface
// 401/403/429; returns [] when the payload has no usable results.
export async function redditSearch(
  query: string,
  limit = 6
): Promise<RedditPost[]> {
  const token = await getRedditToken();
  const url = `https://oauth.reddit.com/search?q=${encodeURIComponent(
    query
  )}&limit=${limit}&sort=relevance&t=all&type=link`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": REDDIT_UA,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Reddit search ${res.status}: ${detail.slice(0, 200) || res.statusText}`
    );
  }

  const json = (await res.json()) as RedditResponse;
  const children = json.data?.children ?? [];
  return children
    .map((c) => c.data)
    .filter((d): d is NonNullable<typeof d> => Boolean(d))
    .map((d) => ({
      title: (d.title ?? "").trim(),
      snippet: (d.selftext ?? "").slice(0, 400).trim(),
      permalink: d.permalink ? `https://www.reddit.com${d.permalink}` : "",
      subreddit: d.subreddit ?? "",
    }));
}

// True when the name is DOMINANTLY latin — a real English name worth searching
// Reddit for. Requires a 3+ letter latin run AND latin letters making up at
// least 40% of the non-space characters, so initials-only names like
// "CNP차앤박피부과" or "IBK기업은행365" are excluded.
export function hasLatinName(name: string): boolean {
  if (!/[A-Za-z]{3,}/.test(name)) return false;
  const compact = name.replace(/\s+/g, "");
  if (compact.length === 0) return false;
  const latin = (compact.match(/[A-Za-z]/g) ?? []).length;
  return latin / compact.length >= 0.4;
}

// ── Category mapping ─────────────────────────────────────────────────────────

export type AppCategory =
  | "restaurant"
  | "cafe"
  | "bar"
  | "activity"
  | "experience"
  | "accommodation"
  | "health"
  | "beauty"
  | "market";

// Bars share the FD6 food group in Kakao, so they are detected from the
// category breadcrumb text rather than a distinct group code.
const BAR_RE = /호프|맥주|바|펍|술집|포차|와인|칵테일/;

// Beauty shops have no Kakao group code — detected from the breadcrumb. Checked
// BEFORE the bar regex because breadcrumbs like "미용 > 바버샵" would otherwise
// false-match BAR_RE's "바".
const BEAUTY_RE = /미용|네일|뷰티|헤어|피부관리|왁싱|바버/;

// Hands-on experience venues (cooking classes, pottery/ceramics studios, craft
// workshops) have no dedicated Kakao group code either and would otherwise
// fall through to the generic-restaurant default. Worse, their category
// BREADCRUMB is often a generic "음식점 > 카페" or "학원" that carries none of
// these keywords at all — Kakao tends to classify a cooking-class studio like
// a restaurant/cafe rather than as its own type. The business NAME is the
// reliable signal instead (e.g. "박쌤쿠킹클래스", "이연공방"), so this is
// checked against both the breadcrumb and the place name.
const EXPERIENCE_RE = /공방|클래스|원데이|쿠킹|플라워|캘리그라피|도자기|베이킹|가죽공예|목공/;

// Map a Kakao place to one of our app categories.
//
// Precedence:
//   1. Bar keywords in the category breadcrumb (호프/맥주/술집/…) → bar. This
//      wins over FD6 so a pub does not land in `restaurant`.
//   2. Kakao category_group_code — the reliable signal when present:
//        FD6 → restaurant, CE7 → cafe, CT1 → activity, AT4 → activity,
//        AD5 → accommodation.
//   3. No group code (generic keyword search): read the first breadcrumb
//        segment — 음식점 → restaurant, 카페 → cafe, 관광/문화/여행 → activity,
//        숙박 → accommodation.
//   4. Fallback → restaurant (the most common Kakao place type).
export function kakaoGroupToCategory(place: {
  place_name?: string;
  category_name: string;
  category_group_code: string;
}): AppCategory {
  const placeName = place.place_name ?? "";
  const name = place.category_name ?? "";
  const code = place.category_group_code ?? "";

  // 1) breadcrumb + name detections without a dedicated group code. Beauty and
  //    experience run before bar (see their notes above).
  if (BEAUTY_RE.test(name)) return "beauty";
  if (EXPERIENCE_RE.test(name) || EXPERIENCE_RE.test(placeName)) return "experience";
  if (BAR_RE.test(name)) return "bar";

  // 2) trust the group code when Kakao provides one.
  switch (code) {
    case "FD6":
      return "restaurant";
    case "CE7":
      return "cafe";
    case "CT1":
    case "AT4":
      return "activity";
    case "AD5":
      return "accommodation";
    case "HP8": // 병원
    case "PM9": // 약국
      return "health";
    case "MT1": // 대형마트
      return "market";
  }

  // 3) generic keyword search — classify by the leading breadcrumb segment.
  const head = name.split(">")[0]?.trim() ?? "";
  if (head.includes("음식점")) return "restaurant";
  if (head.includes("카페")) return "cafe";
  if (head.includes("의료") || name.includes("병원") || name.includes("약국")) {
    return "health";
  }
  if (name.includes("마트") || name.includes("시장")) return "market";
  if (
    head.includes("관광") ||
    head.includes("명소") ||
    head.includes("문화") ||
    head.includes("예술") ||
    head.includes("여행")
  ) {
    return "activity";
  }
  if (head.includes("숙박")) return "accommodation";

  // 4) fallback.
  return "restaurant";
}

// Per-category Kakao search configuration used by the collect route. Some app
// categories map to MULTIPLE Kakao searches (e.g. health = 병원 HP8 + 약국 PM9),
// so each entry is a list; the route runs every search and pools the results
// under the app category. The activity group uses AT4 (관광명소); CT1 (문화시설)
// results that surface through generic breadcrumbs are still mapped to
// `activity` by kakaoGroupToCategory.
export const CATEGORY_SEARCH: Record<
  AppCategory,
  { suffix: string; groupCode: string | null }[]
> = {
  restaurant: [{ suffix: "음식점", groupCode: "FD6" }],
  cafe: [{ suffix: "카페", groupCode: "CE7" }],
  bar: [{ suffix: "주점", groupCode: null }],
  activity: [{ suffix: "가볼만한곳", groupCode: "AT4" }],
  // Own category with its own search budget — bundling these under `activity`
  // would starve them, since 가볼만한곳 (AT4) alone usually fills the
  // per-category result limit before these keyword searches ever run.
  experience: [
    { suffix: "쿠킹클래스", groupCode: null },
    { suffix: "도자기공방", groupCode: null },
    { suffix: "원데이클래스", groupCode: null },
  ],
  accommodation: [{ suffix: "숙소", groupCode: "AD5" }],
  health: [
    { suffix: "병원", groupCode: "HP8" },
    { suffix: "약국", groupCode: "PM9" },
  ],
  beauty: [
    { suffix: "미용실", groupCode: null },
    { suffix: "네일샵", groupCode: null },
  ],
  market: [
    { suffix: "마트", groupCode: "MT1" },
    { suffix: "시장", groupCode: null },
  ],
};
