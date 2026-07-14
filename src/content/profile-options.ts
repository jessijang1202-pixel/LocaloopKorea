// Shared option lists for the onboarding flow (onboarding/page.tsx) and the
// profile editor (profile/me/page.tsx).
//
// Lists whose data is byte-identical between the two pages are exported ONCE
// here and imported by both. The onboarding page previously inlined these as
// `isKo ? [...ko] : [...en]`; the profile page kept separate *_KO / *_EN
// constants. Both compositions are preserved at the call sites — this module
// only holds the underlying ko/en arrays.
//
// PURPOSES is the one list that genuinely DIVERGES between the two surfaces and
// is therefore exported as two separate, clearly-named variants. See the note
// above the PURPOSES exports. Never merge them.

export interface OptionWithDesc {
  label: string;
  desc: string;
}

export interface PurposeProfileOption {
  value: string;
  label: string;
  desc: string;
}

export interface InterestOption {
  slug: string;
  ko: string;
  en: string;
}

// ─── Shared (byte-identical between both pages) ─────────────────────────────

export const LANGUAGES_KO = ["영어", "일본어", "중국어", "베트남어", "태국어", "프랑스어", "독일어", "기타"];
export const LANGUAGES_EN = ["English", "Japanese", "Chinese", "Vietnamese", "Thai", "French", "German", "Other"];

export const GENDERS_KO = ["남성", "여성", "논바이너리", "무응답"];
export const GENDERS_EN = ["Male", "Female", "Non-binary", "Prefer not to say"];

export const DURATIONS_KO = ["1개월 미만", "1~3개월", "3~6개월", "6개월~1년", "1년 이상", "미정"];
export const DURATIONS_EN = ["< 1 month", "1–3 months", "3–6 months", "6–12 months", "1+ year", "Not sure"];

// "How long since you arrived" — distinct from DURATIONS above (which asks how
// long the user PLANS to stay). Parallel-indexed with ARRIVED_DAYS, which feeds
// UserProfile.stayDays (src/lib/engine/types.ts) so the task engine can tell
// early-stay users from long-timers instead of always assuming day 0.
export const ARRIVED_KO = ["1주 미만", "1주~1개월", "1~3개월", "3~6개월", "6개월~1년", "1년 이상"];
export const ARRIVED_EN = ["< 1 week", "1–4 weeks", "1–3 months", "3–6 months", "6–12 months", "1+ year"];
export const ARRIVED_DAYS = [3, 21, 60, 120, 270, 400];

export const REGIONS_KO = ["홍대", "이태원", "강남", "북촌 / 인사동", "성수", "해운대 (부산)", "전주 한옥마을", "기타"];
export const REGIONS_EN = ["Hongdae", "Itaewon", "Gangnam", "Bukchon / Insadong", "Seongsu", "Haeundae (Busan)", "Jeonju Hanok", "Other"];

export const REGION_SLUGS = ["hongdae", "itaewon", "gangnam", "bukchon", "seongsu", "haeundae", "jeonju-hanok", "other"];

export const LIVING_KO = ["고시원", "원룸 / 오피스텔", "쉐어하우스", "에어비앤비", "친구 / 가족 집", "기타"];
export const LIVING_EN = ["Goshiwon", "Studio / Officetel", "Share house", "Airbnb", "Friend / Family", "Other"];

export const KOREAN_LEVELS_KO: OptionWithDesc[] = [
  { label: "전혀 못해요", desc: "한국어를 전혀 모르거나 거의 몰라요" },
  { label: "초급", desc: "기본 인사 정도만 해요" },
  { label: "생활 한국어", desc: "편의점, 카페 등에서 소통 가능" },
  { label: "일상 대화", desc: "간단한 대화는 어렵지 않아요" },
  { label: "유창해요", desc: "한국어로 자유롭게 대화해요" },
];
export const KOREAN_LEVELS_EN: OptionWithDesc[] = [
  { label: "None", desc: "I don't know any Korean yet" },
  { label: "Beginner", desc: "Just basic greetings" },
  { label: "Daily use", desc: "Can manage convenience stores, cafés" },
  { label: "Conversational", desc: "Comfortable in everyday conversations" },
  { label: "Fluent", desc: "Speak Korean freely" },
];

// Interests carry the same {slug, ko, en} data on both pages; onboarding
// composed the label inline as `isKo ? ko : en`, profile stored ko/en fields.
export const INTERESTS: InterestOption[] = [
  { slug: "food",         ko: "🍜 음식",      en: "🍜 Food" },
  { slug: "language",     ko: "💬 언어 교환",  en: "💬 Language Exchange" },
  { slug: "kculture",     ko: "🎭 한국 문화",  en: "🎭 K-Culture" },
  { slug: "hiking",       ko: "🏔️ 등산",      en: "🏔️ Hiking" },
  { slug: "music",        ko: "🎵 음악",      en: "🎵 Music" },
  { slug: "art",          ko: "🎨 예술",      en: "🎨 Art" },
  { slug: "sport",        ko: "⚽ 스포츠",    en: "⚽ Sports" },
  { slug: "coffee",       ko: "☕ 카페",      en: "☕ Coffee & Cafés" },
  { slug: "nightlife",    ko: "🌙 야경 / 바", en: "🌙 Nightlife" },
  { slug: "cooking",      ko: "👨‍🍳 요리",     en: "👨‍🍳 Cooking" },
  { slug: "photography",  ko: "📷 사진",      en: "📷 Photography" },
  { slug: "travel",       ko: "✈️ 국내 여행", en: "✈️ Travel in Korea" },
];

// ─── PURPOSES — INTENTIONALLY DIVERGENT, DO NOT MERGE ───────────────────────
//
// Onboarding (PURPOSES_ONBOARDING_*): the label string ITSELF is stored as the
// selected value, and each label is prefixed with an emoji. Shape {label,desc}.
//
// Profile/me (PURPOSES_PROFILE_*): a stable slug (`value`) is stored and the
// labels are plain (no emoji). Shape {value,label,desc}.
//
// These are different vocabularies AND different shapes. They must stay
// separate — merging would change what each surface stores and renders.

export const PURPOSES_ONBOARDING_KO: OptionWithDesc[] = [
  { label: "💼 직장 / 비즈니스", desc: "취업, 원격근무, 비즈니스" },
  { label: "📚 학업", desc: "어학원, 대학교, 교환학생" },
  { label: "✈️ 여행", desc: "단기 방문, 관광" },
  { label: "💬 언어 학습", desc: "한국어 공부가 주목적" },
  { label: "🎭 문화 체험", desc: "K-culture, 음식, 생활" },
  { label: "🔎 기타", desc: "" },
];
export const PURPOSES_ONBOARDING_EN: OptionWithDesc[] = [
  { label: "💼 Work / Business", desc: "Employment, remote work, business" },
  { label: "📚 Study", desc: "Language school, university, exchange" },
  { label: "✈️ Travel", desc: "Short-term visit, tourism" },
  { label: "💬 Language learning", desc: "Learning Korean is the main goal" },
  { label: "🎭 Cultural experience", desc: "K-culture, food, lifestyle" },
  { label: "🔎 Other", desc: "" },
];

export const PURPOSES_PROFILE_KO: PurposeProfileOption[] = [
  { value: "work",     label: "직장 / 비즈니스", desc: "취업, 원격근무, 비즈니스" },
  { value: "study",    label: "학업",             desc: "어학원, 대학교, 교환학생" },
  { value: "travel",   label: "여행",             desc: "단기 방문, 관광" },
  { value: "language", label: "언어 학습",        desc: "한국어 공부가 주목적" },
  { value: "culture",  label: "문화 체험",        desc: "K-culture, 음식, 생활" },
  { value: "other",    label: "기타",             desc: "" },
];
export const PURPOSES_PROFILE_EN: PurposeProfileOption[] = [
  { value: "work",     label: "Work / Business",      desc: "Employment, remote work, business" },
  { value: "study",    label: "Study",                desc: "Language school, university, exchange" },
  { value: "travel",   label: "Travel",               desc: "Short-term visit, tourism" },
  { value: "language", label: "Language learning",    desc: "Learning Korean is the main goal" },
  { value: "culture",  label: "Cultural experience",  desc: "K-culture, food, lifestyle" },
  { value: "other",    label: "Other",                desc: "" },
];
