"use client";

import { useState, useEffect, Suspense } from "react";
import { useLang, getLang } from "@/lib/lang";
import { createClient } from "@/lib/supabase/client";
import { saveOnboarding } from "./actions";
import { AppNav } from "@/components/layout/AppNav";
import { saveProfile } from "@/lib/engine";
import type { UserProfile } from "@/lib/engine";
import type { OnboardingData } from "@/types/onboarding";
import { toggleArr } from "@/lib/form-utils";
import {
  LANGUAGES_KO, LANGUAGES_EN,
  GENDERS_KO, GENDERS_EN,
  DURATIONS_KO, DURATIONS_EN,
  ARRIVED_KO, ARRIVED_EN, ARRIVED_DAYS,
  REGIONS_KO, REGIONS_EN,
  REGION_SLUGS,
  LIVING_KO, LIVING_EN,
  KOREAN_LEVELS_KO, KOREAN_LEVELS_EN,
  INTERESTS,
  PURPOSES_ONBOARDING_KO, PURPOSES_ONBOARDING_EN,
} from "@/content/profile-options";

const INIT: OnboardingData = {
  isKorean: false,
  displayName: "",
  nationality: "",
  mainLanguage: "English",
  gender: "",
  purpose: "",
  stayDuration: "",
  arrivedDuration: "",
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

type StepId = "nickname" | "background" | "purpose" | "stay" | "arrived" | "region" | "koreanlevel" | "interests" | "connect";

const EN_STEPS: StepId[] = ["nickname", "background", "purpose", "stay", "arrived", "region", "koreanlevel", "interests", "connect"];
const KO_STEPS: StepId[] = ["nickname", "region", "interests", "connect"];

// Map onboarding's 5-level Korean scale (label string, ko or en) to the engine's
// 4-level scale. Collapse the top two (Conversational/일상 대화, Fluent/유창해요)
// into "advanced", per the mapping notes in src/lib/engine/types.ts.
function mapKoreanLevel(label: string): UserProfile["koreanLevel"] {
  const enIdx = KOREAN_LEVELS_EN.findIndex((k) => k.label === label);
  const koIdx = KOREAN_LEVELS_KO.findIndex((k) => k.label === label);
  const i = enIdx !== -1 ? enIdx : koIdx;
  const scale = ["beginner", "basic", "intermediate", "advanced", "advanced"] as const;
  return i === -1 ? null : scale[i];
}

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
      // Persist a normalized profile for the recommendation engine. This is
      // client-only (localStorage) so it must run here, before the server action.
      const arrivedIdx = (isKo ? ARRIVED_KO : ARRIVED_EN).indexOf(data.arrivedDuration);
      saveProfile({
        koreanLevel: mapKoreanLevel(data.koreanLevel),
        interests: data.interests,           // already INTERESTS slugs
        purpose: data.purpose || null,
        region: data.region || null,         // already a REGION_SLUGS slug
        language: data.mainLanguage || null,
        // "arrived" step is EN_STEPS-only (KO_STEPS is the Korean-local shortcut
        // flow, which never asks this) — arrivedIdx stays -1 there, same as
        // the unanswered case, and falls back to a fresh-arrival assumption.
        stayDays: arrivedIdx !== -1 ? ARRIVED_DAYS[arrivedIdx] : 0,
      });
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
        arrived: { title: "한국에 오신 지 얼마나 되셨나요?", sub: "체류 초기인지 알려주시면 더 맞는 태스크를 보여드려요" },
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
        arrived: { title: "How long have you been in Korea?", sub: "This helps us show tasks that actually match where you're at" },
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

  const LANGUAGES = isKo ? LANGUAGES_KO : LANGUAGES_EN;

  const GENDERS = isKo ? GENDERS_KO : GENDERS_EN;

  const PURPOSES = isKo ? PURPOSES_ONBOARDING_KO : PURPOSES_ONBOARDING_EN;

  const DURATIONS = isKo ? DURATIONS_KO : DURATIONS_EN;

  const ARRIVED = isKo ? ARRIVED_KO : ARRIVED_EN;

  const REGIONS = isKo ? REGIONS_KO : REGIONS_EN;

  const LIVING = isKo ? LIVING_KO : LIVING_EN;

  const KOREAN_LEVELS = isKo ? KOREAN_LEVELS_KO : KOREAN_LEVELS_EN;

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

      case "arrived":
        return (
          <div>
            <h2 style={sTitle}>{st.title}</h2>
            <p style={sSub}>{st.sub}</p>
            <div style={sChipWrap}>
              {ARRIVED.map((a) => (
                <Chip key={a} label={a} on={data.arrivedDuration === a} onClick={() => set("arrivedDuration", a)} />
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
              {INTERESTS.map(({ slug, ko, en }) => (
                <Chip key={slug} label={isKo ? ko : en} on={data.interests.includes(slug)} onClick={() => set("interests", toggleArr(data.interests, slug))} />
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
