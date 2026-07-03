"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/lib/lang";

const C = { teal: "var(--grade-s)", tealLight: "rgba(255,86,54,0.08)", tealDark: "#c43e2a", dark: "linear-gradient(160deg, #2A1208 0%, #1E0D06 100%)", text: "var(--foreground)", sub: "var(--foreground-muted)", border: "var(--border)" };

// ─── Option lists ──────────────────────────────────────────────────────────────

const LANGUAGES_KO = ["영어", "일본어", "중국어", "베트남어", "태국어", "프랑스어", "독일어", "기타"];
const LANGUAGES_EN = ["English", "Japanese", "Chinese", "Vietnamese", "Thai", "French", "German", "Other"];
const GENDERS_KO = ["남성", "여성", "논바이너리", "무응답"];
const GENDERS_EN = ["Male", "Female", "Non-binary", "Prefer not to say"];
const PURPOSES_KO = [
  { value: "work",     label: "직장 / 비즈니스", desc: "취업, 원격근무, 비즈니스" },
  { value: "study",    label: "학업",             desc: "어학원, 대학교, 교환학생" },
  { value: "travel",   label: "여행",             desc: "단기 방문, 관광" },
  { value: "language", label: "언어 학습",        desc: "한국어 공부가 주목적" },
  { value: "culture",  label: "문화 체험",        desc: "K-culture, 음식, 생활" },
  { value: "other",    label: "기타",             desc: "" },
];
const PURPOSES_EN = [
  { value: "work",     label: "Work / Business",      desc: "Employment, remote work, business" },
  { value: "study",    label: "Study",                desc: "Language school, university, exchange" },
  { value: "travel",   label: "Travel",               desc: "Short-term visit, tourism" },
  { value: "language", label: "Language learning",    desc: "Learning Korean is the main goal" },
  { value: "culture",  label: "Cultural experience",  desc: "K-culture, food, lifestyle" },
  { value: "other",    label: "Other",                desc: "" },
];
const DURATIONS_KO = ["1개월 미만", "1~3개월", "3~6개월", "6개월~1년", "1년 이상", "미정"];
const DURATIONS_EN = ["< 1 month", "1–3 months", "3–6 months", "6–12 months", "1+ year", "Not sure"];
const REGIONS_KO = ["홍대", "이태원", "강남", "북촌 / 인사동", "성수", "해운대 (부산)", "전주 한옥마을", "기타"];
const REGIONS_EN = ["Hongdae", "Itaewon", "Gangnam", "Bukchon / Insadong", "Seongsu", "Haeundae (Busan)", "Jeonju Hanok", "Other"];
const REGION_SLUGS = ["hongdae", "itaewon", "gangnam", "bukchon", "seongsu", "haeundae", "jeonju-hanok", "other"];
const LIVING_KO = ["고시원", "원룸 / 오피스텔", "쉐어하우스", "에어비앤비", "친구 / 가족 집", "기타"];
const LIVING_EN = ["Goshiwon", "Studio / Officetel", "Share house", "Airbnb", "Friend / Family", "Other"];
const KOREAN_KO = [
  { label: "전혀 못해요", desc: "한국어를 전혀 모르거나 거의 몰라요" },
  { label: "초급", desc: "기본 인사 정도만 해요" },
  { label: "생활 한국어", desc: "편의점, 카페 등에서 소통 가능" },
  { label: "일상 대화", desc: "간단한 대화는 어렵지 않아요" },
  { label: "유창해요", desc: "한국어로 자유롭게 대화해요" },
];
const KOREAN_EN = [
  { label: "None", desc: "I don't know any Korean yet" },
  { label: "Beginner", desc: "Just basic greetings" },
  { label: "Daily use", desc: "Can manage convenience stores, cafés" },
  { label: "Conversational", desc: "Comfortable in everyday conversations" },
  { label: "Fluent", desc: "Speak Korean freely" },
];
const INTERESTS_ALL = [
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

type FormState = {
  main_language: string;
  gender: string;
  purpose: string;
  stay_duration: string;
  region: string;
  living: string;
  korean_level: string;
  interests: string[];
  make_friends: boolean;
  language_exchange: boolean;
  join_meetups: boolean;
  nearby_alerts: boolean;
  marketing: boolean;
};

const INIT: FormState = {
  main_language: "", gender: "", purpose: "", stay_duration: "",
  region: "", living: "", korean_level: "", interests: [],
  make_friends: true, language_exchange: true, join_meetups: false,
  nearby_alerts: true, marketing: false,
};

function toggleArr(arr: string[], val: string) {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

// ─── Atoms ────────────────────────────────────────────────────────────────────

function Chip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{ padding: "8px 14px", borderRadius: 20, border: `1.5px solid ${on ? C.teal : C.border}`, background: on ? C.tealLight : "var(--card)", color: on ? C.teal : C.sub, fontWeight: on ? 700 : 400, fontSize: 13, cursor: "pointer" }}>
      {label}
    </button>
  );
}

function SelectCard({ label, desc, on, onClick }: { label: string; desc?: string; on: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{ width: "100%", textAlign: "left", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${on ? C.teal : C.border}`, background: on ? C.tealLight : "var(--content-bg)", cursor: "pointer", marginBottom: 7 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: on ? C.teal : C.text }}>{label}</div>
      {desc && <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>{desc}</div>}
    </button>
  );
}

function SectionLabel({ label }: { label: string }) {
  return <p style={{ fontSize: 11, fontWeight: 700, color: C.sub, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, marginTop: 4 }}>{label}</p>;
}

function FieldLabel({ label }: { label: string }) {
  return <p style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8 }}>{label}</p>;
}

function Toggle({ on, onChange, label, desc }: { on: boolean; onChange: () => void; label: string; desc?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{label}</p>
        {desc && <p style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>{desc}</p>}
      </div>
      <button type="button" onClick={onChange} style={{ width: 42, height: 22, borderRadius: 11, background: on ? C.teal : "#c8d5d7", border: "none", cursor: "pointer", position: "relative", flexShrink: 0 }}>
        <span style={{ position: "absolute", top: 2, left: on ? 22 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", display: "block", transition: "left 0.18s" }} />
      </button>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div style={{ background: "var(--card)", borderRadius: 16, border: `1px solid ${C.border}`, padding: "16px 16px 10px", marginBottom: 12 }}>{children}</div>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MePage() {
  const router = useRouter();
  const isKo = useLang();
  const [form, setForm] = useState<FormState>(INIT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .select("main_language, gender, purpose, stay_duration, region, living, korean_level, interests, make_friends, language_exchange, join_meetups, nearby_alerts, marketing")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setForm({
              main_language: data.main_language ?? "",
              gender: data.gender ?? "",
              purpose: data.purpose ?? "",
              stay_duration: data.stay_duration ?? "",
              region: data.region ?? "",
              living: data.living ?? "",
              korean_level: data.korean_level ?? "",
              interests: data.interests ?? [],
              make_friends: data.make_friends ?? true,
              language_exchange: data.language_exchange ?? true,
              join_meetups: data.join_meetups ?? false,
              nearby_alerts: data.nearby_alerts ?? true,
              marketing: data.marketing ?? false,
            });
          }
        });
    });
  }, []);

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error: err } = await supabase
      .from("profiles")
      .update({
        main_language: form.main_language || null,
        gender: form.gender || null,
        purpose: form.purpose || null,
        stay_duration: form.stay_duration || null,
        region: form.region || null,
        living: form.living || null,
        korean_level: form.korean_level || null,
        interests: form.interests,
        make_friends: form.make_friends,
        language_exchange: form.language_exchange,
        join_meetups: form.join_meetups,
        nearby_alerts: form.nearby_alerts,
        marketing: form.marketing,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setSaved(true);
    setTimeout(() => { setSaved(false); router.push("/profile"); }, 900);
  }

  const ko = isKo;
  const langs = ko ? LANGUAGES_KO : LANGUAGES_EN;
  const genders = ko ? GENDERS_KO : GENDERS_EN;
  const purposes = ko ? PURPOSES_KO : PURPOSES_EN;
  const durations = ko ? DURATIONS_KO : DURATIONS_EN;
  const koreanLevels = ko ? KOREAN_KO : KOREAN_EN;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      {/* Header */}
      <div style={{ background: C.dark as string, paddingTop: 44, paddingBottom: 16, flexShrink: 0 }}>
        <div style={{ padding: "0 16px" }}>
          <button onClick={() => router.push("/profile")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.55)", fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 10 }}>
            ← {ko ? "마이페이지" : "My Page"}
          </button>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 4 }}>
            {ko ? "나를 알려주세요" : "About Me"}
          </h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
            {ko ? "내 정보를 수정하면 더 잘 맞는 추천을 받을 수 있어요" : "Update your info for better recommendations"}
          </p>
        </div>
      </div>

      {/* Form */}
      <div style={{ flex: 1, overflowY: "auto", background: "var(--content-bg)", padding: "16px 14px 100px" }}>

        {/* Section: 나에 대해 */}
        <Card>
          <SectionLabel label={ko ? "나에 대해" : "About Me"} />

          <FieldLabel label={ko ? "주요 언어" : "Primary language"} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
            {langs.map((l) => (
              <Chip key={l} label={l} on={form.main_language === l} onClick={() => set("main_language", l)} />
            ))}
          </div>

          <FieldLabel label={ko ? "성별" : "Gender"} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {genders.map((g) => (
              <Chip key={g} label={g} on={form.gender === g} onClick={() => set("gender", g)} />
            ))}
          </div>
        </Card>

        {/* Section: 한국 생활 */}
        <Card>
          <SectionLabel label={ko ? "한국 생활" : "Korea Life"} />

          <FieldLabel label={ko ? "한국에 온 목적" : "Why are you in Korea?"} />
          {purposes.map((p) => (
            <SelectCard key={p.value} label={p.label} desc={p.desc} on={form.purpose === p.value} onClick={() => set("purpose", p.value)} />
          ))}

          <FieldLabel label={ko ? "체류 기간" : "Stay duration"} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
            {durations.map((d) => (
              <Chip key={d} label={d} on={form.stay_duration === d} onClick={() => set("stay_duration", d)} />
            ))}
          </div>

          <FieldLabel label={ko ? "거주 지역" : "Where are you based?"} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
            {(ko ? REGIONS_KO : REGIONS_EN).map((r, i) => (
              <Chip key={r} label={r} on={form.region === REGION_SLUGS[i]} onClick={() => set("region", REGION_SLUGS[i])} />
            ))}
          </div>

          <FieldLabel label={ko ? "거주 형태" : "Living situation"} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {(ko ? LIVING_KO : LIVING_EN).map((l) => (
              <Chip key={l} label={l} on={form.living === l} onClick={() => set("living", l)} />
            ))}
          </div>
        </Card>

        {/* Section: 한국어 실력 */}
        <Card>
          <SectionLabel label={ko ? "한국어 실력" : "Korean Level"} />
          {koreanLevels.map((k) => (
            <SelectCard key={k.label} label={k.label} desc={k.desc} on={form.korean_level === k.label} onClick={() => set("korean_level", k.label)} />
          ))}
        </Card>

        {/* Section: 관심사 */}
        <Card>
          <SectionLabel label={ko ? "관심사" : "Interests"} />
          <p style={{ fontSize: 12, color: C.sub, marginBottom: 12 }}>{ko ? "관심 있는 항목을 모두 선택해 주세요" : "Select everything that interests you"}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {INTERESTS_ALL.map(({ slug, ko: labelKo, en: labelEn }) => (
              <Chip
                key={slug}
                label={ko ? labelKo : labelEn}
                on={form.interests.includes(slug)}
                onClick={() => set("interests", toggleArr(form.interests, slug))}
              />
            ))}
          </div>
        </Card>

        {/* Section: 연결 설정 */}
        <Card>
          <SectionLabel label={ko ? "연결 설정" : "Connection Settings"} />
          <Toggle on={form.make_friends} onChange={() => set("make_friends", !form.make_friends)}
            label={ko ? "새 친구 사귀기" : "Make new friends"}
            desc={ko ? "주변 외국인·한국인과 연결해드려요" : "Connect with locals and expats nearby"} />
          <Toggle on={form.language_exchange} onChange={() => set("language_exchange", !form.language_exchange)}
            label={ko ? "언어 교환" : "Language exchange"}
            desc={ko ? "한국어↔외국어 파트너 매칭" : "Match with language exchange partners"} />
          <Toggle on={form.join_meetups} onChange={() => set("join_meetups", !form.join_meetups)}
            label={ko ? "모임 참여 알림" : "Meetup notifications"}
            desc={ko ? "내 관심사 기반 모임 추천" : "Get notified about relevant meetups"} />
          <Toggle on={form.nearby_alerts} onChange={() => set("nearby_alerts", !form.nearby_alerts)}
            label={ko ? "주변 알림" : "Nearby alerts"}
            desc={ko ? "근처 새 장소·이벤트 알림" : "Alerts for new places and events near you"} />
          <Toggle on={form.marketing} onChange={() => set("marketing", !form.marketing)}
            label={ko ? "마케팅 수신 동의 (선택)" : "Marketing emails (optional)"}
            desc={ko ? "새 기능 소식 및 혜택 안내" : "News about features and offers"} />
        </Card>

        {error && (
          <p style={{ fontSize: 13, color: "#ef4444", background: "#fff1f2", borderRadius: 12, padding: "12px 16px", marginBottom: 12 }}>{error}</p>
        )}
      </div>

      {/* Save button */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--card)", borderTop: `1px solid ${C.border}`, padding: "14px 16px", paddingBottom: "calc(14px + env(safe-area-inset-bottom))", zIndex: 50 }}>
        <button
          onClick={handleSave}
          disabled={saving || saved}
          style={{ width: "100%", height: 50, borderRadius: 14, background: saved ? "#1D9E75" : "var(--grade-s)", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: saving || saved ? "default" : "pointer", opacity: saving ? 0.7 : 1, transition: "background 0.2s", boxShadow: "0 4px 16px rgba(255,86,54,0.3)" }}
        >
          {saved ? (ko ? "✓ 저장됐어요!" : "✓ Saved!") : saving ? (ko ? "저장 중…" : "Saving…") : (ko ? "저장하기" : "Save changes")}
        </button>
      </div>
    </div>
  );
}
