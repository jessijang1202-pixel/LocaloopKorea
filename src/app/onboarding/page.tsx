"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { saveOnboarding } from "./actions";

// ─── types ────────────────────────────────────────────────────────────────────

export type OnboardingData = {
  isKorean: boolean;
  // EN-only
  displayName: string;
  nationality: string;
  mainLanguage: string;
  gender: string;
  purpose: string;
  arrivalDate: string;
  stayDuration: string;
  region: string;
  living: string;
  koreanLevel: string;
  // shared
  interests: string[];
  budget: string;
  activityStyle: string;
  hasPet: string;
  dietaryRestrictions: string[];
  transportation: string[];
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
  arrivalDate: "",
  stayDuration: "",
  region: "",
  living: "",
  koreanLevel: "",
  interests: [],
  budget: "",
  activityStyle: "",
  hasPet: "",
  dietaryRestrictions: [],
  transportation: [],
  makeFriends: true,
  languageExchange: true,
  joinMeetups: false,
  nearbyAlerts: true,
  marketing: false,
};

function toggleArr<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

// ─── design tokens ────────────────────────────────────────────────────────────

const C = {
  teal: "#15b6c1",
  tealLight: "#d4f4f6",
  tealDark: "#0b7a82",
  yellow: "#ffd600",
  text: "#1a2b2c",
  sub: "#4a6467",
  border: "#e0e8ea",
  bg: "#f8fcfc",
};

// ─── UI atoms ─────────────────────────────────────────────────────────────────

function Chip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "7px 14px",
        borderRadius: 20,
        border: `1px solid ${on ? C.teal : C.border}`,
        background: on ? C.tealLight : "#fff",
        color: on ? C.tealDark : C.sub,
        fontWeight: on ? 600 : 400,
        fontSize: 13,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

function SelectCard({
  label, desc, on, onClick,
}: {
  label: string; desc?: string; on: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "11px 14px",
        borderRadius: 12,
        border: `1px solid ${on ? C.teal : C.border}`,
        background: on ? C.tealLight : "#fff",
        cursor: "pointer",
        marginBottom: 8,
        transition: "all 0.15s",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 500, color: on ? C.tealDark : C.text }}>{label}</div>
      {desc && <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>{desc}</div>}
    </button>
  );
}

function GridCard({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "10px 8px",
        borderRadius: 10,
        border: `1px solid ${on ? C.teal : C.border}`,
        background: on ? C.tealLight : "#fff",
        color: on ? C.tealDark : C.text,
        fontWeight: on ? 600 : 400,
        fontSize: 12,
        cursor: "pointer",
        textAlign: "center",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

function ToggleSwitch({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="switch"
      aria-checked={on}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: on ? C.teal : "#c8d5d7",
        border: "none",
        cursor: "pointer",
        position: "relative",
        flexShrink: 0,
        transition: "background 0.2s",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: on ? 23 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
          display: "block",
        }}
      />
    </button>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 8 }}>
      {children}
    </div>
  );
}

const INP: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: `1px solid ${C.border}`,
  background: C.bg,
  fontSize: 14,
  color: C.text,
  outline: "none",
  marginBottom: 16,
};

// ─── step components ──────────────────────────────────────────────────────────

function StepBasicInfo({ data, set }: { data: OnboardingData; set: (p: Partial<OnboardingData>) => void }) {
  const nationalities = [
    "United States", "Japan", "China", "Vietnam", "Thailand",
    "France", "Germany", "Australia", "Canada", "United Kingdom",
    "India", "Philippines", "Indonesia", "Malaysia", "Other",
  ];
  const languages = ["English", "Japanese", "Chinese", "Vietnamese", "Thai", "French", "German", "Other"];
  const genders = ["Male", "Female", "Non-binary", "Prefer not to say"];

  return (
    <div>
      <Label>Nickname</Label>
      <input
        style={INP}
        type="text"
        placeholder="e.g. Alex, Mia, Yuki"
        value={data.displayName}
        onChange={(e) => set({ displayName: e.target.value })}
      />

      <Label>Nationality</Label>
      <select style={INP} value={data.nationality} onChange={(e) => set({ nationality: e.target.value })}>
        <option value="">Select your country</option>
        {nationalities.map((n) => <option key={n}>{n}</option>)}
      </select>

      <Label>Primary Language</Label>
      <select style={INP} value={data.mainLanguage} onChange={(e) => set({ mainLanguage: e.target.value })}>
        {languages.map((l) => <option key={l}>{l}</option>)}
      </select>

      <Label>Gender (optional)</Label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {genders.map((g) => (
          <GridCard key={g} label={g} on={data.gender === g} onClick={() => set({ gender: data.gender === g ? "" : g })} />
        ))}
      </div>
    </div>
  );
}

function StepPurpose({ data, set }: { data: OnboardingData; set: (p: Partial<OnboardingData>) => void }) {
  const purposes = [
    { icon: "✈️", label: "Tourism / Short visit" },
    { icon: "📚", label: "Study" },
    { icon: "💼", label: "Work / Career" },
    { icon: "💍", label: "Marriage / Family" },
    { icon: "🏠", label: "Long-term residence" },
    { icon: "✨", label: "Other" },
  ];
  return (
    <div>
      {purposes.map(({ icon, label }) => (
        <SelectCard
          key={label}
          label={`${icon}  ${label}`}
          on={data.purpose === label}
          onClick={() => set({ purpose: data.purpose === label ? "" : label })}
        />
      ))}
    </div>
  );
}

function StepStay({ data, set }: { data: OnboardingData; set: (p: Partial<OnboardingData>) => void }) {
  const durations = ["Under 1 week", "Under 1 month", "Under 3 months", "Under 6 months", "Under 1 year", "1 year+"];
  const regions = [
    { label: "Hongdae (Seoul)", slug: "hongdae" },
    { label: "Itaewon (Seoul)", slug: "itaewon" },
    { label: "Gangnam (Seoul)", slug: "gangnam" },
    { label: "Bukchon (Seoul)", slug: "bukchon" },
    { label: "Seongsu (Seoul)", slug: "seongsu" },
    { label: "Haeundae (Busan)", slug: "haeundae" },
    { label: "Jeonju", slug: "jeonju-hanok" },
  ];
  const livings = ["Alone", "With family", "Roommates", "Dormitory"];

  return (
    <div>
      <Label>Arrival Date</Label>
      <input style={INP} type="date" value={data.arrivalDate} onChange={(e) => set({ arrivalDate: e.target.value })} />

      <Label>Intended Stay</Label>
      <select style={INP} value={data.stayDuration} onChange={(e) => set({ stayDuration: e.target.value })}>
        <option value="">Select duration</option>
        {durations.map((d) => <option key={d}>{d}</option>)}
      </select>

      <Label>Current Neighborhood</Label>
      <select style={INP} value={data.region} onChange={(e) => set({ region: e.target.value })}>
        <option value="">Select area</option>
        {regions.map(({ label, slug }) => <option key={slug} value={slug}>{label}</option>)}
      </select>

      <Label>Living Situation</Label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {livings.map((l) => (
          <GridCard key={l} label={l} on={data.living === l} onClick={() => set({ living: data.living === l ? "" : l })} />
        ))}
      </div>
    </div>
  );
}

function StepKorean({ data, set }: { data: OnboardingData; set: (p: Partial<OnboardingData>) => void }) {
  const levels = [
    { label: "No Korean", desc: "I communicate in English only" },
    { label: "Basics only", desc: "Greetings, numbers, simple signs" },
    { label: "Daily conversations", desc: "I can handle simple chats" },
    { label: "Fluent", desc: "Near-native level" },
  ];
  return (
    <div>
      {levels.map(({ label, desc }) => (
        <SelectCard
          key={label}
          label={label}
          desc={desc}
          on={data.koreanLevel === label}
          onClick={() => set({ koreanLevel: data.koreanLevel === label ? "" : label })}
        />
      ))}
    </div>
  );
}

const INTERESTS_EN = [
  { slug: "food", label: "🍜  Food" },
  { slug: "coffee", label: "☕  Coffee & Cafes" },
  { slug: "culture", label: "🎭  K-Culture" },
  { slug: "hiking", label: "🏔️  Hiking" },
  { slug: "nightlife", label: "🌙  Nightlife" },
  { slug: "music", label: "🎵  Music" },
  { slug: "sport", label: "⚽  Sports" },
  { slug: "art", label: "🎨  Art" },
  { slug: "language", label: "💬  Language Exchange" },
  { slug: "cooking", label: "👨‍🍳  Cooking" },
  { slug: "photography", label: "📷  Photography" },
  { slug: "travel", label: "✈️  Travel" },
];

const INTERESTS_KO = [
  { slug: "food", label: "🍜  음식 & 카페" },
  { slug: "culture", label: "🎭  문화 & 역사" },
  { slug: "coffee", label: "☕  카페 & 디저트" },
  { slug: "hiking", label: "🏔️  자연 & 등산" },
  { slug: "nightlife", label: "🌙  나이트라이프" },
  { slug: "music", label: "🎵  K-팝 & 엔터" },
  { slug: "sport", label: "⚽  스포츠" },
  { slug: "art", label: "🎨  예술 & 전시" },
  { slug: "language", label: "💬  언어 교환" },
  { slug: "cooking", label: "👨‍🍳  요리" },
  { slug: "photography", label: "📷  사진" },
  { slug: "travel", label: "✈️  여행" },
];

function StepInterests({ data, set, isKo }: { data: OnboardingData; set: (p: Partial<OnboardingData>) => void; isKo: boolean }) {
  const interests = isKo ? INTERESTS_KO : INTERESTS_EN;
  const budgets = isKo
    ? ["💰  저예산", "💰💰  중간", "💰💰💰  여유롭게", "상관없어요"]
    : ["💰  Budget", "💰💰  Moderate", "💰💰💰  Splurge", "No preference"];
  const styles = isKo
    ? ["🏠  실내 선호", "🌿  실외 선호", "🤫  조용하게", "🎉  활발하게"]
    : ["🏠  Indoors", "🌿  Outdoors", "🤫  Quiet vibe", "🎉  High energy"];

  return (
    <div>
      <Label>{isKo ? "관심 카테고리" : "Categories"}</Label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {interests.map(({ slug, label }) => (
          <Chip key={slug} label={label} on={data.interests.includes(slug)} onClick={() => set({ interests: toggleArr(data.interests, slug) })} />
        ))}
      </div>

      <Label>{isKo ? "예산 수준" : "Budget Level"}</Label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
        {budgets.map((b) => (
          <GridCard key={b} label={b} on={data.budget === b} onClick={() => set({ budget: data.budget === b ? "" : b })} />
        ))}
      </div>

      <Label>{isKo ? "활동 성향" : "Activity Style"}</Label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {styles.map((s) => (
          <GridCard key={s} label={s} on={data.activityStyle === s} onClick={() => set({ activityStyle: data.activityStyle === s ? "" : s })} />
        ))}
      </div>
    </div>
  );
}

function StepLife({ data, set, isKo }: { data: OnboardingData; set: (p: Partial<OnboardingData>) => void; isKo: boolean }) {
  const dietary = isKo
    ? ["없음", "이슬람 (할랄)", "힌두교", "채식주의", "비건", "기타"]
    : ["None", "Halal", "Hindu", "Vegetarian", "Vegan", "Other"];
  const transports = isKo
    ? [{ slug: "transit", label: "🚌  대중교통" }, { slug: "car", label: "🚗  차량" }, { slug: "walk", label: "🚶  도보" }, { slug: "bike", label: "🚲  자전거" }]
    : [{ slug: "transit", label: "🚌  Public transit" }, { slug: "car", label: "🚗  Car" }, { slug: "walk", label: "🚶  Walking" }, { slug: "bike", label: "🚲  Bicycle" }];

  return (
    <div>
      <Label>{isKo ? "반려동물 동반 여부" : "Do you have a pet?"}</Label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
        <GridCard label={isKo ? "🐾  있어요" : "🐾  Yes, I do"} on={data.hasPet === "yes"} onClick={() => set({ hasPet: data.hasPet === "yes" ? "" : "yes" })} />
        <GridCard label={isKo ? "없어요" : "No pets"} on={data.hasPet === "no"} onClick={() => set({ hasPet: data.hasPet === "no" ? "" : "no" })} />
      </div>

      <Label>{isKo ? "종교 / 식이 제한 (선택)" : "Dietary / Religious (optional)"}</Label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {dietary.map((d) => (
          <Chip key={d} label={d} on={data.dietaryRestrictions.includes(d)} onClick={() => set({ dietaryRestrictions: toggleArr(data.dietaryRestrictions, d) })} />
        ))}
      </div>

      <Label>{isKo ? "선호 이동 수단" : "Preferred Transport"}</Label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {transports.map(({ slug, label }) => (
          <Chip key={slug} label={label} on={data.transportation.includes(slug)} onClick={() => set({ transportation: toggleArr(data.transportation, slug) })} />
        ))}
      </div>
    </div>
  );
}

type BoolKey = "makeFriends" | "languageExchange" | "joinMeetups" | "nearbyAlerts" | "marketing";

function StepConnections({ data, set, isKo }: { data: OnboardingData; set: (p: Partial<OnboardingData>) => void; isKo: boolean }) {
  const items: { key: BoolKey; label: string; desc: string }[] = isKo
    ? [
        { key: "makeFriends", label: "한국인 친구 만들기", desc: "관심사 기반 교류 사람 추천" },
        { key: "languageExchange", label: "언어 교환 관심", desc: "한국어 ↔ 내 언어 교환" },
        { key: "joinMeetups", label: "모임 참여 의향", desc: "지역 기반 Meetup 알림" },
        { key: "nearbyAlerts", label: "주변 장소 알림", desc: "S등급 신규 장소 업데이트" },
        { key: "marketing", label: "마케팅 알림", desc: "이벤트 및 혜택 정보" },
      ]
    : [
        { key: "makeFriends", label: "Make Korean friends", desc: "Interest-based friend suggestions" },
        { key: "languageExchange", label: "Language exchange", desc: "Korean ↔ your language swap" },
        { key: "joinMeetups", label: "Join meetups", desc: "Local event notifications" },
        { key: "nearbyAlerts", label: "Nearby place alerts", desc: "New S-rated places near you" },
        { key: "marketing", label: "Marketing notifications", desc: "Events & promotions" },
      ];

  return (
    <div>
      {items.map(({ key, label, desc }, i) => (
        <div
          key={key}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 0",
            borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : "none",
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{label}</div>
            <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>{desc}</div>
          </div>
          <ToggleSwitch
            on={data[key]}
            onChange={() => set({ [key]: !data[key] } as Partial<OnboardingData>)}
          />
        </div>
      ))}
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [isKo, setIsKo] = useState(false);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(INIT);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const ko = navigator.language.startsWith("ko");
    setIsKo(ko);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      const name = user?.user_metadata?.full_name || user?.user_metadata?.name || "";
      setData((d) => ({ ...d, isKorean: ko, displayName: name }));
      setReady(true);
    });
  }, []);

  function set(patch: Partial<OnboardingData>) {
    setData((d) => ({ ...d, ...patch }));
  }

  const totalSteps = isKo ? 3 : 7;
  const isDone = step >= totalSteps;

  async function finish() {
    setSaving(true);
    try {
      await saveOnboarding(data);
    } finally {
      router.push("/map");
    }
  }

  if (!ready) return null;

  // ── done screen ──────────────────────────────────────────────────────────────
  if (isDone) {
    const cards = isKo
      ? [
          { icon: "📍", text: "주변 <strong>S등급 장소 12곳</strong>이 있어요" },
          { icon: "📋", text: "<strong>할 일 과제 5개</strong>를 준비했어요" },
          { icon: "🗺️", text: "<strong>맞춤 로컬 코스</strong>가 기다려요" },
        ]
      : [
          { icon: "📍", text: "<strong>12 S-rated places</strong> near you" },
          { icon: "📋", text: "<strong>5 tasks</strong> ready for your checklist" },
          { icon: "🗺️", text: "<strong>Your local course</strong> is waiting" },
        ];

    return (
      <main
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f0fafa",
          padding: "24px 20px",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: C.tealLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            marginBottom: 20,
          }}
        >
          ✓
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 8, textAlign: "center" }}>
          {isKo ? "준비 완료!" : "You're all set!"}
        </h1>
        <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.65, maxWidth: 280, margin: "0 auto 28px", textAlign: "center" }}>
          {isKo
            ? "AI가 맞춤 설정을 완료했어요. 이제부터 Real Korea를 시작해보세요."
            : "Your profile is ready. Start exploring Real Korea with personalized recommendations."}
        </p>

        <div style={{ width: "100%", maxWidth: 420, marginBottom: 28 }}>
          {cards.map(({ icon, text }) => (
            <div
              key={icon}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "#fff",
                borderRadius: 12,
                padding: "12px 16px",
                marginBottom: 8,
                border: `1px solid ${C.border}`,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: C.tealLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {icon}
              </div>
              <div style={{ fontSize: 13, color: C.sub }} dangerouslySetInnerHTML={{ __html: text }} />
            </div>
          ))}
        </div>

        <button
          onClick={finish}
          disabled={saving}
          style={{
            width: "100%",
            maxWidth: 420,
            padding: "14px",
            borderRadius: 16,
            background: C.yellow,
            color: C.text,
            fontWeight: 700,
            fontSize: 16,
            border: "none",
            cursor: saving ? "default" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? (isKo ? "저장 중…" : "Saving…") : (isKo ? "지도로 이동하기" : "Go to Map")}
        </button>
      </main>
    );
  }

  // ── step labels ──────────────────────────────────────────────────────────────
  const enSteps = [
    { title: "About You", sub: "Let's personalize your experience" },
    { title: "Why Korea?", sub: "What brings you here?" },
    { title: "Your Stay", sub: "Tell us more for better recommendations" },
    { title: "Korean Level", sub: "We'll tailor places to your language skills" },
    { title: "Interests", sub: "Pick topics you love — select as many as you like" },
    { title: "Your Lifestyle", sub: "Better place recommendations with your preferences" },
    { title: "Stay Connected", sub: "You can change these anytime in Settings" },
  ];

  const koSteps = [
    { title: "관심사 & 성향", sub: "좋아하는 항목을 골라주세요. 여러 개 선택 가능해요." },
    { title: "생활 설정", sub: "더 정확한 장소 추천에 활용돼요." },
    { title: "연결 설정", sub: "언제든지 설정에서 변경할 수 있어요." },
  ];

  const stepInfo = (isKo ? koSteps : enSteps)[step];
  const progress = ((step + 1) / totalSteps) * 100;
  const isLast = step === totalSteps - 1;

  function renderContent() {
    if (isKo) {
      if (step === 0) return <StepInterests data={data} set={set} isKo />;
      if (step === 1) return <StepLife data={data} set={set} isKo />;
      if (step === 2) return <StepConnections data={data} set={set} isKo />;
    } else {
      if (step === 0) return <StepBasicInfo data={data} set={set} />;
      if (step === 1) return <StepPurpose data={data} set={set} />;
      if (step === 2) return <StepStay data={data} set={set} />;
      if (step === 3) return <StepKorean data={data} set={set} />;
      if (step === 4) return <StepInterests data={data} set={set} isKo={false} />;
      if (step === 5) return <StepLife data={data} set={set} isKo={false} />;
      if (step === 6) return <StepConnections data={data} set={set} isKo={false} />;
    }
    return null;
  }

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      {/* header */}
      <div style={{ background: C.teal, padding: "14px 18px 12px", flexShrink: 0 }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 10, fontWeight: 600, letterSpacing: "0.05em" }}>
          LOCALOOP KOREA
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.9)", fontSize: 13, cursor: "pointer", padding: 0 }}
            >
              ← {isKo ? "뒤로" : "Back"}
            </button>
          ) : <span />}
          <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>{step + 1} / {totalSteps}</span>
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.65)", fontSize: 12, cursor: "pointer", padding: 0 }}
          >
            {isKo ? "건너뛰기" : "Skip"}
          </button>
        </div>
        <div style={{ height: 3, background: "rgba(255,255,255,0.25)", borderRadius: 2, marginTop: 10 }}>
          <div style={{ height: "100%", background: C.yellow, borderRadius: 2, width: `${progress}%`, transition: "width 0.3s ease" }} />
        </div>
      </div>

      {/* body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "22px 20px 8px" }}>
        <h1 style={{ fontSize: 21, fontWeight: 700, color: C.text, marginBottom: 4 }}>{stepInfo?.title}</h1>
        <p style={{ fontSize: 13, color: C.sub, marginBottom: 22, lineHeight: 1.5 }}>{stepInfo?.sub}</p>
        {renderContent()}
      </div>

      {/* footer */}
      <div style={{ padding: "14px 20px 36px", flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => setStep((s) => s + 1)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 14,
            background: C.teal,
            color: "#fff",
            fontWeight: 600,
            fontSize: 15,
            border: "none",
            cursor: "pointer",
          }}
        >
          {isLast ? (isKo ? "완료" : "Finish") : (isKo ? "다음" : "Next")}
        </button>
      </div>
    </main>
  );
}
