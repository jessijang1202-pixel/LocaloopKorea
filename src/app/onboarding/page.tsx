"use client";

import { useState, useEffect, Suspense } from "react";
import { useLang, getLang } from "@/lib/lang";
import { createClient } from "@/lib/supabase/client";
import { saveOnboarding } from "./actions";
import { AppNav } from "@/components/layout/AppNav";

// ─── Types ────────────────────────────────────────────────────────────────────

export type OnboardingData = {
  isKorean: boolean;
  displayName: string;
  nationality: string;
  mainLanguage: string;
  gender: string;
  purpose: string;
  stayDuration: string;
  region: string;
  living: string;
  koreanLevel: string;
  interests: string[];
  makeFriends: boolean;
  languageExchange: boolean;
  joinMeetups: boolean;
  nearbyAlerts: boolean;
  marketing: boolean;
};

const INIT: OnboardingData = {
  isKorean: false,
  displayName: "",
  nationality: "",
  mainLanguage: "English",
  gender: "",
  purpose: "",
  stayDuration: "",
  region: "",
  living: "",
  koreanLevel: "",
  interests: [],
  makeFriends: true,
  languageExchange: true,
  joinMeetups: false,
  nearbyAlerts: true,
  marketing: false,
};

function toggleArr<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const C = {
  teal: "#15b6c1",
  tealLight: "#d4f4f6",
  tealDark: "#0b7a82",
  yellow: "#ffd600",
  dark: "#0B1E2D",
  text: "#1a2b2c",
  sub: "#4a6467",
  border: "#e0e8ea",
};

// ─── Reusable atoms ───────────────────────────────────────────────────────────

function Chip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      padding: "8px 16px", borderRadius: 20,
      border: `1.5px solid ${on ? C.teal : C.border}`,
      background: on ? C.tealLight : "#fff",
      color: on ? C.tealDark : C.sub,
      fontWeight: on ? 700 : 400, fontSize: 13,
      cursor: "pointer", transition: "all 0.15s",
    }}>
      {label}
    </button>
  );
}

function SelectCard({ label, desc, on, onClick }: { label: string; desc?: string; on: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      width: "100%", textAlign: "left",
      padding: "13px 16px", borderRadius: 14,
      border: `1.5px solid ${on ? C.teal : C.border}`,
      background: on ? C.tealLight : "#fff",
      cursor: "pointer", marginBottom: 8, transition: "all 0.15s",
    }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: on ? C.tealDark : C.text }}>{label}</div>
      {desc && <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>{desc}</div>}
    </button>
  );
}

function SectionLabel({ label, style }: { label: string; style?: React.CSSProperties }) {
  return (
    <p style={{ fontSize: 12, fontWeight: 700, color: C.sub, marginBottom: 8, marginTop: 4, ...style }}>
      {label}
    </p>
  );
}

function Toggle({ on, onChange, label, desc }: { on: boolean; onChange: () => void; label: string; desc?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{label}</p>
        {desc && <p style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>{desc}</p>}
      </div>
      <button type="button" onClick={onChange} role="switch" aria-checked={on} style={{
        width: 44, height: 24, borderRadius: 12,
        background: on ? C.teal : "#c8d5d7",
        border: "none", cursor: "pointer",
        position: "relative", flexShrink: 0, transition: "background 0.2s",
      }}>
        <span style={{
          position: "absolute", top: 3, left: on ? 23 : 3,
          width: 18, height: 18, borderRadius: "50%",
          background: "#fff", transition: "left 0.2s", display: "block",
        }} />
      </button>
    </div>
  );
}

// ─── Step IDs ─────────────────────────────────────────────────────────────────

type StepId = "nickname" | "background" | "purpose" | "stay" | "region" | "koreanlevel" | "interests" | "connect";

const EN_STEPS: StepId[] = ["nickname", "background", "purpose", "stay", "region", "koreanlevel", "interests", "connect"];
const KO_STEPS: StepId[] = ["nickname", "region", "interests", "connect"];

// ─── Main inner component ─────────────────────────────────────────────────────

function OnboardingInner() {


  const isKo = useLang();
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<OnboardingData>(INIT);
  const [stepIdx, setStepIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const ko = getLang() === "ko";
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      const name = user?.user_metadata?.full_name || user?.user_metadata?.name || "";
      setData((d) => ({ ...d, isKorean: ko, displayName: name }));
      setReady(true);
    });
  }, []);

  const steps = isKo ? KO_STEPS : EN_STEPS;
  const totalSteps = steps.length;
  const currentStep = steps[stepIdx];
  const isLast = stepIdx === totalSteps - 1;

  function set<K extends keyof OnboardingData>(key: K, val: OnboardingData[K]) {
    setData((d) => ({ ...d, [key]: val }));
  }

  async function handleNext() {
    if (isLast) {
      setSaving(true);
      await saveOnboarding(data);
      setSaving(false);
      setDone(true);
    } else {
      setStepIdx((i) => i + 1);
    }
  }

  // ── Labels ──────────────────────────────────────────────────────────────────

  const T = {
    ko: {
      hero: "나를 알려주세요",
      heroSub: "내 정보를 입력하면 로컬루프가 더 잘 도와줄 수 있어요",
      back: "이전", next: "다음", finish: "시작하기", saving: "저장 중…",
      doneTitle: "준비 완료!", doneSub: "이제 이태원 로컬 생활을 시작해볼까요?", doneBtn: "지도로 이동하기",
      steps: {
        nickname: { title: "어떻게 불릴까요?", sub: "앱에 표시될 이름이에요", namePh: "이름 또는 닉네임" },
        background: { title: "나에 대해 알려주세요", sub: "국적, 언어, 성별을 선택해 주세요" },
        purpose: { title: "한국에 온 목적은요?", sub: "가장 잘 맞는 항목을 선택해 주세요" },
        stay: { title: "얼마나 계실 건가요?", sub: "체류 기간을 선택해 주세요" },
        region: { title: "주로 어디서 지내세요?", sub: "가장 가까운 지역을 선택해 주세요" },
        koreanlevel: { title: "한국어 실력은?", sub: "현재 수준을 선택해 주세요" },
        interests: { title: "어떤 걸 좋아하세요?", sub: "관심 있는 항목을 모두 선택해 주세요" },
        connect: { title: "어떻게 연결되고 싶으세요?", sub: "원하는 연결 방식을 설정해 주세요" },
      },
    },
    en: {
      hero: "Tell us about you",
      heroSub: "Help us personalize your Localoop Korea experience",
      back: "Back", next: "Next", finish: "Get started", saving: "Saving…",
      doneTitle: "You're all set!", doneSub: "Time to explore local Korea like a local.", doneBtn: "Go to Map",
      steps: {
        nickname: { title: "What should we call you?", sub: "This will be your display name in the app", namePh: "Your name or nickname" },
        background: { title: "Tell us about yourself", sub: "Select your nationality, language, and gender" },
        purpose: { title: "Why are you in Korea?", sub: "Pick the option that fits best" },
        stay: { title: "How long are you staying?", sub: "Select your expected stay duration" },
        region: { title: "Where are you based?", sub: "Pick the area closest to where you live" },
        koreanlevel: { title: "What's your Korean level?", sub: "Choose your current level" },
        interests: { title: "What are you into?", sub: "Select everything that interests you" },
        connect: { title: "How do you want to connect?", sub: "Customize how Localoop connects you with others" },
      },
    },
  };

  const t = isKo ? T.ko : T.en;

  // ── Options ──────────────────────────────────────────────────────────────────

  const NATIONALITIES = isKo
    ? ["미국", "일본", "중국", "영국", "캐나다", "호주", "프랑스", "독일", "베트남", "태국", "인도", "기타"]
    : ["USA", "Japan", "China", "UK", "Canada", "Australia", "France", "Germany", "Vietnam", "Thailand", "India", "Other"];

  const LANGUAGES = isKo
    ? ["영어", "일본어", "중국어", "베트남어", "태국어", "프랑스어", "독일어", "기타"]
    : ["English", "Japanese", "Chinese", "Vietnamese", "Thai", "French", "German", "Other"];

  const GENDERS = isKo
    ? ["남성", "여성", "논바이너리", "무응답"]
    : ["Male", "Female", "Non-binary", "Prefer not to say"];

  const PURPOSES = isKo
    ? [
        { label: "💼 직장 / 비즈니스", desc: "취업, 원격근무, 비즈니스" },
        { label: "📚 학업", desc: "어학원, 대학교, 교환학생" },
        { label: "✈️ 여행", desc: "단기 방문, 관광" },
        { label: "💬 언어 학습", desc: "한국어 공부가 주목적" },
        { label: "🎭 문화 체험", desc: "K-culture, 음식, 생활" },
        { label: "🔎 기타", desc: "" },
      ]
    : [
        { label: "💼 Work / Business", desc: "Employment, remote work, business" },
        { label: "📚 Study", desc: "Language school, university, exchange" },
        { label: "✈️ Travel", desc: "Short-term visit, tourism" },
        { label: "💬 Language learning", desc: "Learning Korean is the main goal" },
        { label: "🎭 Cultural experience", desc: "K-culture, food, lifestyle" },
        { label: "🔎 Other", desc: "" },
      ];

  const DURATIONS = isKo
    ? ["1개월 미만", "1~3개월", "3~6개월", "6개월~1년", "1년 이상", "미정"]
    : ["< 1 month", "1–3 months", "3–6 months", "6–12 months", "1+ year", "Not sure"];

  const REGIONS = isKo
    ? ["홍대", "이태원", "강남", "북촌 / 인사동", "성수", "해운대 (부산)", "전주 한옥마을", "기타"]
    : ["Hongdae", "Itaewon", "Gangnam", "Bukchon / Insadong", "Seongsu", "Haeundae (Busan)", "Jeonju Hanok", "Other"];

  const REGION_SLUGS = ["hongdae", "itaewon", "gangnam", "bukchon", "seongsu", "haeundae", "jeonju-hanok", "other"];

  const LIVING = isKo
    ? ["고시원", "원룸 / 오피스텔", "쉐어하우스", "에어비앤비", "친구 / 가족 집", "기타"]
    : ["Goshiwon", "Studio / Officetel", "Share house", "Airbnb", "Friend / Family", "Other"];

  const KOREAN_LEVELS = isKo
    ? [
        { label: "전혀 못해요", desc: "한국어를 전혀 모르거나 거의 몰라요" },
        { label: "초급", desc: "기본 인사 정도만 해요" },
        { label: "생활 한국어", desc: "편의점, 카페 등에서 소통 가능" },
        { label: "일상 대화", desc: "간단한 대화는 어렵지 않아요" },
        { label: "유창해요", desc: "한국어로 자유롭게 대화해요" },
      ]
    : [
        { label: "None", desc: "I don't know any Korean yet" },
        { label: "Beginner", desc: "Just basic greetings" },
        { label: "Daily use", desc: "Can manage convenience stores, cafés" },
        { label: "Conversational", desc: "Comfortable in everyday conversations" },
        { label: "Fluent", desc: "Speak Korean freely" },
      ];

  const INTERESTS = [
    { slug: "food", label: isKo ? "🍜 음식" : "🍜 Food" },
    { slug: "language", label: isKo ? "💬 언어 교환" : "💬 Language Exchange" },
    { slug: "kculture", label: isKo ? "🎭 한국 문화" : "🎭 K-Culture" },
    { slug: "hiking", label: isKo ? "🏔️ 등산" : "🏔️ Hiking" },
    { slug: "music", label: isKo ? "🎵 음악" : "🎵 Music" },
    { slug: "art", label: isKo ? "🎨 예술" : "🎨 Art" },
    { slug: "sport", label: isKo ? "⚽ 스포츠" : "⚽ Sports" },
    { slug: "coffee", label: isKo ? "☕ 카페" : "☕ Coffee & Cafés" },
    { slug: "nightlife", label: isKo ? "🌙 야경 / 바" : "🌙 Nightlife" },
    { slug: "cooking", label: isKo ? "👨‍🍳 요리" : "👨‍🍳 Cooking" },
    { slug: "photography", label: isKo ? "📷 사진" : "📷 Photography" },
    { slug: "travel", label: isKo ? "✈️ 국내 여행" : "✈️ Travel in Korea" },
  ];

  // ── Shared styles ─────────────────────────────────────────────────────────────

  const sTitle: React.CSSProperties = { fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 6, letterSpacing: "-0.02em", lineHeight: 1.25 };
  const sSub: React.CSSProperties = { fontSize: 14, color: C.sub, marginBottom: 20, lineHeight: 1.55 };
  const sChipWrap: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 };
  const sInput: React.CSSProperties = {
    width: "100%", padding: "13px 16px", borderRadius: 14,
    border: `1.5px solid ${C.border}`, background: "#fff",
    fontSize: 16, color: C.text, outline: "none", boxSizing: "border-box",
  };

  // ── Step renderer ─────────────────────────────────────────────────────────────

  function renderStep() {
    const st = t.steps[currentStep];

    switch (currentStep) {
      case "nickname":
        return (
          <div>
            <h2 style={sTitle}>{st.title}</h2>
            <p style={sSub}>{st.sub}</p>
            <input
              type="text"
              value={data.displayName}
              onChange={(e) => set("displayName", e.target.value)}
              placeholder={"namePh" in st ? st.namePh : ""}
              autoFocus
              style={sInput}
            />
          </div>
        );

      case "background":
        return (
          <div>
            <h2 style={sTitle}>{st.title}</h2>
            <p style={sSub}>{st.sub}</p>
            <SectionLabel label={isKo ? "국적" : "Nationality"} />
            <div style={sChipWrap}>
              {NATIONALITIES.map((n) => (
                <Chip key={n} label={n} on={data.nationality === n} onClick={() => set("nationality", n)} />
              ))}
            </div>
            <SectionLabel label={isKo ? "주요 언어" : "Primary language"} style={{ marginTop: 16 }} />
            <div style={sChipWrap}>
              {LANGUAGES.map((l) => (
                <Chip key={l} label={l} on={data.mainLanguage === l} onClick={() => set("mainLanguage", l)} />
              ))}
            </div>
            <SectionLabel label={isKo ? "성별" : "Gender"} style={{ marginTop: 16 }} />
            <div style={sChipWrap}>
              {GENDERS.map((g) => (
                <Chip key={g} label={g} on={data.gender === g} onClick={() => set("gender", g)} />
              ))}
            </div>
          </div>
        );

      case "purpose":
        return (
          <div>
            <h2 style={sTitle}>{st.title}</h2>
            <p style={sSub}>{st.sub}</p>
            {PURPOSES.map((p) => (
              <SelectCard key={p.label} label={p.label} desc={p.desc} on={data.purpose === p.label} onClick={() => set("purpose", p.label)} />
            ))}
          </div>
        );

      case "stay":
        return (
          <div>
            <h2 style={sTitle}>{st.title}</h2>
            <p style={sSub}>{st.sub}</p>
            <div style={sChipWrap}>
              {DURATIONS.map((d) => (
                <Chip key={d} label={d} on={data.stayDuration === d} onClick={() => set("stayDuration", d)} />
              ))}
            </div>
          </div>
        );

      case "region":
        return (
          <div>
            <h2 style={sTitle}>{st.title}</h2>
            <p style={sSub}>{st.sub}</p>
            <div style={sChipWrap}>
              {REGIONS.map((r, i) => (
                <Chip key={r} label={r} on={data.region === REGION_SLUGS[i]} onClick={() => set("region", REGION_SLUGS[i])} />
              ))}
            </div>
            <SectionLabel label={isKo ? "어디서 생활하고 계세요?" : "What's your living situation?"} style={{ marginTop: 20 }} />
            <div style={sChipWrap}>
              {LIVING.map((l) => (
                <Chip key={l} label={l} on={data.living === l} onClick={() => set("living", l)} />
              ))}
            </div>
          </div>
        );

      case "koreanlevel":
        return (
          <div>
            <h2 style={sTitle}>{st.title}</h2>
            <p style={sSub}>{st.sub}</p>
            {KOREAN_LEVELS.map((k) => (
              <SelectCard key={k.label} label={k.label} desc={k.desc} on={data.koreanLevel === k.label} onClick={() => set("koreanLevel", k.label)} />
            ))}
          </div>
        );

      case "interests":
        return (
          <div>
            <h2 style={sTitle}>{st.title}</h2>
            <p style={sSub}>{st.sub}</p>
            <div style={sChipWrap}>
              {INTERESTS.map(({ slug, label }) => (
                <Chip key={slug} label={label} on={data.interests.includes(slug)} onClick={() => set("interests", toggleArr(data.interests, slug))} />
              ))}
            </div>
          </div>
        );

      case "connect":
        return (
          <div>
            <h2 style={sTitle}>{st.title}</h2>
            <p style={sSub}>{st.sub}</p>
            <div style={{ marginTop: 8 }}>
              <Toggle
                on={data.makeFriends}
                onChange={() => set("makeFriends", !data.makeFriends)}
                label={isKo ? "새 친구 사귀기" : "Make new friends"}
                desc={isKo ? "주변 외국인·한국인과 연결해드려요" : "Connect with locals and expats nearby"}
              />
              <Toggle
                on={data.languageExchange}
                onChange={() => set("languageExchange", !data.languageExchange)}
                label={isKo ? "언어 교환" : "Language exchange"}
                desc={isKo ? "한국어↔외국어 파트너 매칭" : "Match with Korean ↔ foreign language partners"}
              />
              <Toggle
                on={data.joinMeetups}
                onChange={() => set("joinMeetups", !data.joinMeetups)}
                label={isKo ? "모임 참여 알림" : "Meetup notifications"}
                desc={isKo ? "내 관심사 기반 모임 추천" : "Get notified about relevant meetups"}
              />
              <Toggle
                on={data.nearbyAlerts}
                onChange={() => set("nearbyAlerts", !data.nearbyAlerts)}
                label={isKo ? "주변 알림" : "Nearby alerts"}
                desc={isKo ? "근처 새 장소·이벤트 알림" : "Alerts for new places and events near you"}
              />
              <Toggle
                on={data.marketing}
                onChange={() => set("marketing", !data.marketing)}
                label={isKo ? "마케팅 수신 동의 (선택)" : "Marketing emails (optional)"}
                desc={isKo ? "새 기능 소식 및 혜택 안내" : "News about features and offers"}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  // ── Done screen ───────────────────────────────────────────────────────────────

  if (done) {
    return (
      <div className="app-container">
        <AppNav />
        <div className="ll-content" style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: `linear-gradient(160deg, ${C.dark} 0%, #1a3a4a 100%)`,
          padding: 24,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: C.teal, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, marginBottom: 24,
            boxShadow: `0 0 0 12px rgba(21,182,193,0.2)`,
          }}>
            ✓
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 8, textAlign: "center" }}>
            {t.doneTitle}
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 40, textAlign: "center" }}>
            {t.doneSub}
          </p>
          <button
            onClick={() => { window.location.href = "/map"; }}
            style={{
              background: C.yellow, color: C.dark, border: "none", borderRadius: 16,
              padding: "16px 48px", fontSize: 16, fontWeight: 800, cursor: "pointer",
            }}
          >
            {t.doneBtn}
          </button>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: C.dark }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          border: `3px solid ${C.teal}`, borderTopColor: "transparent",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const progress = ((stepIdx + 1) / totalSteps) * 100;

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "#fff" }}>
      {/* Top bar */}
      <div style={{ background: C.dark, paddingTop: 48, paddingBottom: 20, paddingInline: 20, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>
            Localoop<span style={{ color: C.teal }}>Korea</span>
          </span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
            {stepIdx + 1} / {totalSteps}
          </span>
        </div>

        <h1 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 4 }}>
          {t.hero}
        </h1>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
          {t.heroSub}
        </p>

        {/* Progress bar */}
        <div style={{ marginTop: 16, height: 4, borderRadius: 4, background: "rgba(255,255,255,0.1)" }}>
          <div style={{ height: "100%", borderRadius: 4, background: C.teal, width: `${progress}%`, transition: "width 0.3s ease" }} />
        </div>

        {/* Step dots */}
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === stepIdx ? 20 : 6, height: 6, borderRadius: 3,
              background: i <= stepIdx ? C.teal : "rgba(255,255,255,0.15)",
              transition: "all 0.3s",
            }} />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 20px 0" }}>
        {renderStep()}
      </div>

      {/* Bottom buttons */}
      <div style={{
        padding: "16px 20px",
        paddingBottom: "calc(16px + env(safe-area-inset-bottom))",
        borderTop: `1px solid ${C.border}`,
        background: "#fff", display: "flex", gap: 10,
      }}>
        {stepIdx > 0 && (
          <button
            onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
            style={{
              flex: 0, padding: "0 20px", height: 50, borderRadius: 14,
              border: `1.5px solid ${C.border}`, background: "#fff", color: C.sub,
              fontWeight: 600, fontSize: 14, cursor: "pointer",
            }}
          >
            {t.back}
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={saving}
          style={{
            flex: 1, height: 50, borderRadius: 14, border: "none",
            background: `linear-gradient(135deg, ${C.teal}, ${C.tealDark})`,
            color: "#fff", fontWeight: 700, fontSize: 15,
            cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1,
            transition: "opacity 0.15s",
          }}
        >
          {saving ? t.saving : isLast ? t.finish : t.next}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense>
      <OnboardingInner />
    </Suspense>
  );
}
