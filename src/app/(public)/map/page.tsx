"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLang, setLang } from "@/lib/lang";
import { useTheme } from "@/lib/theme";
import dynamic from "next/dynamic";
import { SEED_PLACES, SEED_REGIONS } from "@/data/seed";
import type { Place } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const KakaoMap = dynamic(
  () => import("@/components/map/KakaoMap").then((m) => m.KakaoMap),
  { ssr: false, loading: () => <div style={{ width: "100%", height: "100%", background: "var(--map-bg)" }} /> }
);

const ITAEWON = { lat: 37.534, lng: 126.9946 };

function getRating(p: Place): "S" | "A" | "B" | "C" {
  if (p.english_support && p.card_payment && p.solo_friendly) return "S";
  if (p.english_support && p.card_payment) return "A";
  if (p.card_payment) return "B";
  return "C";
}

type FilterKey = "all" | "english" | "S" | "restaurant" | "cafe";

const CHIPS: { key: FilterKey; ko: string; en: string; hasIcon?: boolean }[] = [
  { key: "all",        ko: "전체",    en: "All" },
  { key: "english",    ko: "영어 OK", en: "English OK", hasIcon: true },
  { key: "S",          ko: "S등급",   en: "S Grade" },
  { key: "restaurant", ko: "음식점",   en: "Food" },
  { key: "cafe",       ko: "카페",    en: "Café" },
];

// Real travel times & distances from Itaewon
const TRAVEL_INFO: Record<string, { ko: string; en: string; dist: string }> = {
  p1: { ko: "지하철 28분", en: "Subway 28 min", dist: "7.0km" },
  p2: { ko: "지하철 33분", en: "Subway 33 min", dist: "4.1km" },
  p3: { ko: "지하철 26분", en: "Subway 26 min", dist: "6.0km" },
  p4: { ko: "지하철 30분", en: "Subway 30 min", dist: "5.3km" },
  p5: { ko: "지하철 24분", en: "Subway 24 min", dist: "5.6km" },
  p6: { ko: "KTX 2시간 30분", en: "KTX 2h 30min", dist: "325km" },
  p7: { ko: "도보 12분", en: "Walk 12 min", dist: "850m" },
  p8: { ko: "도보 9분", en: "Walk 9 min", dist: "650m" },
  p9:  { ko: "도보 15분", en: "Walk 15 min",  dist: "1.1km" },
  p10: { ko: "도보 8분",  en: "Walk 8 min",   dist: "600m"  },
  p11: { ko: "도보 3분",  en: "Walk 3 min",   dist: "250m"  },
  p12: { ko: "버스 15분", en: "Bus 15 min",   dist: "2.2km" },
};

const HOT_PLACE_IDS = ["p7", "p8", "p9", "p10", "p11", "p12"];

const GRADE_BG: Record<string, string> = {
  S: "var(--grade-s)", A: "var(--grade-a)", B: "var(--grade-b)", C: "var(--grade-c)",
};
const GRADE_TEXT: Record<string, string> = {
  S: "#fff", A: "#fff", B: "#fff", C: "var(--grade-c-text)",
};

function PlaceRow({ place, isKo }: {
  place: Place; isKo: boolean;
}) {
  const rating = getRating(place);
  const travel = TRAVEL_INFO[place.id];
  const badgeBg = GRADE_BG[rating];
  const badgeFg = GRADE_TEXT[rating];

  return (
    <Link
      href={`/places/${place.slug}`}
      style={{
        display: "flex", gap: 12, padding: "14px 0",
        borderBottom: "1px solid var(--border)",
        cursor: "pointer", alignItems: "flex-start",
        textDecoration: "none",
      }}
    >
      {/* Grade badge */}
      <div style={{
        width: 46, height: 46, borderRadius: 13, flexShrink: 0,
        background: badgeBg,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        userSelect: "none",
      }}>
        <span style={{ fontSize: 17, fontWeight: 800, lineHeight: 1, color: badgeFg }}>{rating}</span>
        <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.05em", opacity: 0.85, color: badgeFg }}>GRADE</span>
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", marginBottom: 2 }}>
          {isKo ? place.name_ko : place.name_en}
        </div>
        <div style={{ fontSize: 12, color: "var(--foreground-muted)", marginBottom: 5 }}>
          {isKo ? place.name_en : place.name_ko}
        </div>
        <div style={{ fontSize: 11, color: "var(--foreground-sub)", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
          {travel && <span>{isKo ? travel.ko : travel.en} · {travel.dist}</span>}
          <span style={{ color: "var(--success)", fontWeight: 600 }}>{isKo ? "· 지금 영업중" : "· Open now"}</span>
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {place.english_support && (
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "var(--badge-en-bg)", color: "var(--badge-en-fg)", fontWeight: 600 }}>
              {isKo ? "영어 OK" : "English OK"}
            </span>
          )}
          {place.card_payment && (
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "var(--badge-card-bg)", color: "var(--badge-card-fg)", fontWeight: 600 }}>
              {isKo ? "카드 OK" : "Card OK"}
            </span>
          )}
          {place.solo_friendly && (
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "var(--badge-solo-bg)", color: "var(--badge-solo-fg)", fontWeight: 600 }}>
              {isKo ? "혼자 OK" : "Solo OK"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// PC left-panel place card (compact)
function PlaceCardPC({ place, isSelected, isKo, onClick }: {
  place: Place; isSelected: boolean; isKo: boolean; onClick: () => void;
}) {
  const rating = getRating(place);
  const badgeBg = GRADE_BG[rating];
  const badgeFg = GRADE_TEXT[rating];
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", gap: 10, padding: "10px 12px", marginBottom: 6,
        background: isSelected ? "var(--card-selected)" : "var(--card)",
        borderRadius: 14,
        border: isSelected ? `1.5px solid var(--grade-s)` : "1px solid var(--border)",
        cursor: "pointer",
      }}
    >
      <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: badgeBg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 800, lineHeight: 1, color: badgeFg }}>{rating}</span>
        <span style={{ fontSize: 6, fontWeight: 700, opacity: 0.85, color: badgeFg }}>GRADE</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)", marginBottom: 2 }}>{isKo ? place.name_ko : place.name_en}</div>
        <div style={{ fontSize: 11, color: "var(--foreground-muted)" }}>{isKo ? place.name_en : place.name_ko}</div>
      </div>
    </div>
  );
}

// 2-column grid card (identical style for both ITAEWON PICK and OTHER REGIONS)
function PlaceCard2({ place, isKo, hot = false }: { place: Place; isKo: boolean; hot?: boolean }) {
  const rating = getRating(place);
  const t = TRAVEL_INFO[place.id];
  const city = !hot ? (SEED_REGIONS.find((r) => r.id === place.region_id)?.city ?? "") : null;

  return (
    <Link
      href={`/places/${place.slug}`}
      style={{
        background: "var(--content-bg)", borderRadius: 14,
        textDecoration: "none", display: "flex", flexDirection: "column",
        border: "1px solid var(--border)", overflow: "hidden",
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: "relative", width: "100%", height: 80, background: "var(--muted)", flexShrink: 0 }}>
        {place.image_url && (
          <Image src={place.image_url} alt={isKo ? place.name_ko : place.name_en} fill sizes="200px" style={{ objectFit: "cover" }} />
        )}
      </div>
      {/* Info */}
      <div style={{ padding: "9px 10px", display: "flex", flexDirection: "column", gap: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
            background: GRADE_BG[rating],
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: GRADE_TEXT[rating], lineHeight: 1 }}>{rating}</span>
            <span style={{ fontSize: 6, fontWeight: 700, letterSpacing: "0.05em", opacity: 0.85, color: GRADE_TEXT[rating] }}>GRADE</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {isKo ? place.name_ko : place.name_en}
            </div>
            <div style={{ fontSize: 10, color: "var(--foreground-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {isKo ? place.name_en : place.name_ko}
            </div>
          </div>
        </div>
        {city && (
          <div style={{ fontSize: 10, fontWeight: 600, color: "var(--foreground-muted)", letterSpacing: "0.02em" }}>
            {city}
          </div>
        )}
        {t && (
          <div style={{ fontSize: 10, color: "var(--foreground-sub)", fontWeight: 500 }}>
            {isKo ? t.ko : t.en} · {t.dist}
          </div>
        )}
      </div>
    </Link>
  );
}

function WelcomePopup({ isKo, onClose }: { isKo: boolean; onClose: () => void }) {
  const router = useRouter();
  const [isPC, setIsPC] = useState(false);

  useEffect(() => {
    setIsPC(window.innerWidth >= 768);
  }, []);

  function handleGuide() {
    onClose();
    router.push("/guide");
  }

  const features = [
    { grade: "S/A/B/C", bg: "#FFE8E2", text: "#C0331A", title: isKo ? "외국인 친화 등급" : "Friendliness Rating", desc: isKo ? "영어 지원·카드 결제·혼자 OK 기준으로 장소를 4단계로 평가합니다." : "Places rated in 4 tiers by English, card payment, and solo-friendliness." },
    { grade: "TASK",    bg: "#E8F4FF", text: "#1565C0", title: isKo ? "한국 생활 단계별 Tasks" : "Step-by-Step Korea Tasks", desc: isKo ? "USIM·은행·외국인등록증 등 정착 필수 과제를 순서대로 안내합니다." : "Guided tasks for USIM, bank, ARC, and every step of settling in." },
    { grade: "COURSE",  bg: "#F0FFF0", text: "#2E7D32", title: isKo ? "진정한 로컬 코스 추천" : "Authentic Local Courses", desc: isKo ? "관광지가 아닌 현지인이 실제로 가는 동선으로 설계된 코스를 경험하세요." : "Courses built from routes locals actually take — not tourist trails." },
    { grade: "MATCH",   bg: "#FFF9C4", text: "#A56000", title: isKo ? "커뮤니티 AI 매칭" : "Community AI Matching", desc: isKo ? "관심사·언어·위치 기반으로 한국인·외국인 모임을 자동으로 연결합니다." : "Auto-match with Korean locals and expats by interest, language, and location." },
  ];

  const pad   = isPC ? "28px 26px 24px" : "22px 18px 20px";
  const mxW   = isPC ? 440 : 330;
  const titleSz = isPC ? 20 : 17;
  const badgeSz = isPC ? 40 : 34;
  const gap   = isPC ? 10 : 8;

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.52)", display: "flex", alignItems: "center", justifyContent: "center", padding: "28px 20px" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#ffffff", borderRadius: 22, width: "100%", maxWidth: mxW, maxHeight: "84dvh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.24)", padding: pad }}
      >
        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#FF5636 0%,#c43e2a 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(255,86,54,0.35)" }}>
            <span style={{ fontSize: 19, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>L</span>
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#FF5636", letterSpacing: "0.12em", marginBottom: 5 }}>LOCALOOP KOREA</div>
          <h2 style={{ fontSize: titleSz, fontWeight: 900, color: "#16151A", letterSpacing: "-0.03em", lineHeight: 1.25, marginBottom: 5 }}>
            {isKo ? "한국 생활의 새로운 시작" : "Your New Start in Korea"}
          </h2>
          <p style={{ fontSize: 12, color: "#6B6880", lineHeight: 1.6 }}>
            {isKo ? "Localoop Korea의 4가지 핵심 기능을 소개합니다." : "Discover the 4 core features of Localoop Korea."}
          </p>
        </div>

        {/* Feature list — always single column */}
        <div style={{ display: "flex", flexDirection: "column", gap: gap, marginBottom: 18 }}>
          {features.map((f) => (
            <div key={f.grade} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "11px 13px", borderRadius: 14, background: "#F7F6F9", border: "1px solid #EDECF2" }}>
              <div style={{ width: badgeSz, height: badgeSz, borderRadius: 10, flexShrink: 0, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: f.text, textAlign: "center", lineHeight: 1.25 }}>
                {f.grade}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#16151A", marginBottom: 3 }}>{f.title}</div>
                <div style={{ fontSize: 11, color: "#6B6880", lineHeight: 1.55 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleGuide} style={{ flex: 1, padding: "13px 0", borderRadius: 13, background: "#FF5636", color: "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(255,86,54,0.28)" }}>
            {isKo ? "유저 가이드 보기" : "View User Guide"}
          </button>
          <button onClick={onClose} style={{ padding: "13px 18px", borderRadius: 13, background: "#F0EFF5", color: "#6B6880", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
            {isKo ? "닫기" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MapPage() {
  const isKo = useLang();
  const theme = useTheme();
  const [selected, setSelected] = useState<Place>(
    SEED_PLACES.find((p) => p.id === HOT_PLACE_IDS[0]) ?? SEED_PLACES[0]
  );
  const [chip, setChip] = useState<FilterKey>("all");
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const dragStartY = useRef<number | null>(null);

  useEffect(() => {
    if (!sessionStorage.getItem("ll_welcome_shown")) {
      setShowPopup(true);
    }
  }, []);

  function closePopup() {
    sessionStorage.setItem("ll_welcome_shown", "1");
    setShowPopup(false);
  }

  const hotPlaces = SEED_PLACES.filter((p) => HOT_PLACE_IDS.includes(p.id));

  const filtered = SEED_PLACES.filter((p) => {
    if (HOT_PLACE_IDS.includes(p.id)) return false; // shown in PICK strip above
    if (chip === "all") return true;
    if (chip === "english") return p.english_support;
    if (chip === "S") return getRating(p) === "S";
    if (chip === "restaurant") return p.category === "restaurant";
    if (chip === "cafe") return p.category === "cafe";
    return true;
  });

  const pins = SEED_PLACES.filter((p) => p.lat && p.lng).map((p) => ({
    id: p.id, lat: p.lat!, lng: p.lng!, title: p.name_en, rating: getRating(p),
  }));

  const isDark = theme === "dark";
  const pillBg = isDark ? "#F4F0E8" : "#16151A";
  const pillFg = isDark ? "#16151A" : "#F4F0E8";
  const pillMuted = isDark ? "#8B8598" : "#9A9488";
  const chipBg = isDark ? "rgba(29,26,34,0.9)" : "rgba(255,255,255,0.94)";
  const chipFg = isDark ? "#F4F0E8" : "#16151A";

  // ── MOBILE layout (full-bleed map + sheet) ────────────────────
  const mobileView = (
    <div className="ll-mobile-only" style={{ display: "block", position: "relative", width: "100%", height: "100dvh", overflow: "hidden" }}>
      {/* Map */}
      <div style={{ position: "absolute", inset: 0 }}>
        <KakaoMap
          lang={isKo ? "ko" : "en"}
          pins={pins}
          center={ITAEWON}
          zoom={5}
          onPinClick={(id) => { const p = SEED_PLACES.find((x) => x.id === id); if (p) setSelected(p); }}
        />
      </div>

      {/* Floating UI */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 10px)",
        paddingLeft: 14, paddingRight: 14,
        zIndex: 10, display: "flex", flexDirection: "column", gap: 9,
        pointerEvents: "none",
      }}>
        {/* Row 1: Location pill + EN / MY */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", pointerEvents: "auto" }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            background: pillBg, color: pillFg,
            borderRadius: 999, padding: "8px 14px", border: "none", cursor: "pointer",
            boxShadow: "0 2px 12px rgba(0,0,0,0.22)",
          }}>
            <svg width="12" height="14" viewBox="0 0 24 28" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="var(--grade-s)" />
              <circle cx="12" cy="9" r="2.8" fill="white" />
            </svg>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{isKo ? "이태원" : "Itaewon"}</span>
            <span style={{ fontSize: 12, color: pillMuted }}>{isKo ? "Itaewon" : "이태원"}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setLang(isKo ? "en" : "ko")} style={{ width: 36, height: 36, borderRadius: 999, background: chipBg, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, color: chipFg, boxShadow: "0 2px 8px rgba(0,0,0,0.14)" }}>{isKo ? "EN" : "KO"}</button>
            <Link href="/profile" style={{ width: 36, height: 36, borderRadius: 999, background: "var(--grade-s)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff", textDecoration: "none", boxShadow: "0 2px 8px rgba(255,86,54,0.4)" }}>MY</Link>
          </div>
        </div>

        {/* Row 2: Search */}
        <div style={{ pointerEvents: "auto" }}>
          <div style={{ background: chipBg, borderRadius: 16, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 12px rgba(0,0,0,0.12)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <span style={{ fontSize: 14, color: "var(--foreground-muted)" }}>{isKo ? "장소, 동네 검색…" : "Search places…"}</span>
          </div>
        </div>

        {/* Row 3: Filter chips */}
        <div style={{ display: "flex", gap: 7, overflowX: "auto", scrollbarWidth: "none", pointerEvents: "auto", paddingRight: 4 }}>
          {CHIPS.map((c) => {
            const active = chip === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setChip(c.key)}
                style={{
                  flexShrink: 0, padding: "7px 13px", borderRadius: 999,
                  background: active ? "var(--grade-s)" : chipBg,
                  color: active ? "#fff" : chipFg,
                  border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: active ? 700 : 500,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  display: "flex", alignItems: "center", gap: 4,
                }}
              >
                {/* no icon */}
                {isKo ? c.ko : c.en}
              </button>
            );
          })}
        </div>

        {/* Row 4: Logged-out hint */}
        <div style={{ pointerEvents: "auto", alignSelf: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(22,21,26,0.72)", borderRadius: 999, padding: "5px 10px" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#F4F0E8" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 11, color: "#F4F0E8", fontWeight: 500 }}>{isKo ? "로그인 전 · 이태원 기본" : "Guest · Itaewon default"}</span>
          </div>
        </div>
      </div>

      {/* Bottom sheet */}
      <div
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "var(--card)",
          borderRadius: "26px 26px 0 0",
          height: sheetExpanded ? "70dvh" : "36%",
          transition: "height 0.3s cubic-bezier(0.32,0.72,0,1)",
          zIndex: 20, display: "flex", flexDirection: "column",
          boxShadow: "0 -4px 32px rgba(0,0,0,0.12)",
        }}
      >
        {/* Drag handle */}
        <div
          onClick={() => setSheetExpanded(v => !v)}
          onTouchStart={(e) => { dragStartY.current = e.touches[0].clientY; }}
          onTouchEnd={(e) => {
            if (dragStartY.current === null) return;
            const dy = e.changedTouches[0].clientY - dragStartY.current;
            dragStartY.current = null;
            if (dy < -30) setSheetExpanded(true);
            else if (dy > 30) setSheetExpanded(false);
          }}
          style={{ padding: "12px 0 6px", display: "flex", justifyContent: "center", flexShrink: 0, cursor: "pointer", touchAction: "none" }}
        >
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border)" }} />
        </div>

        {/* Header */}
        <div style={{ padding: "10px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, borderBottom: "1px solid var(--border)" }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: "var(--foreground)" }}>
            {isKo ? "이태원 근처" : "Near Itaewon"}&nbsp;
            <span style={{ color: "var(--foreground-muted)", fontWeight: 500 }}>{isKo ? "148곳" : "148 places"}</span>
          </span>
          <button style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 13, color: "var(--foreground-muted)", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
            {isKo ? "거리순" : "Nearest"}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
          </button>
        </div>

        {/* Scrollable content — both pick sections live here so sheet can collapse cleanly */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 16px" }}>
          {/* 이태원 PICK — 1열, big badge */}
          <div style={{ paddingTop: 14, marginBottom: 22 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: "var(--grade-s)", marginBottom: 10 }}>
              {isKo ? "이태원 PICK" : "ITAEWON PICK"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {hotPlaces.map((p) => <PlaceCard2 key={p.id} place={p} isKo={isKo} hot />)}
            </div>
            <button style={{ width: "100%", marginTop: 10, padding: "10px 0", borderRadius: 12, background: "var(--content-bg)", border: "1px solid var(--border)", color: "var(--foreground-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              {isKo ? "더보기" : "View more"}
            </button>
          </div>

          {/* 다른 지역 추천 — 2×3 grid, medium badge + city label */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: "var(--foreground-muted)", marginBottom: 10 }}>
              {isKo ? "다른 지역 추천" : "OTHER REGIONS"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {filtered.map((p) => <PlaceCard2 key={p.id} place={p} isKo={isKo} />)}
            </div>
            <button style={{ width: "100%", marginTop: 10, padding: "10px 0", borderRadius: 12, background: "var(--content-bg)", border: "1px solid var(--border)", color: "var(--foreground-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              {isKo ? "더보기" : "View more"}
            </button>
          </div>

          {/* Safe-area spacer for nav bar */}
          <div style={{ height: "calc(env(safe-area-inset-bottom, 0px) + 88px)" }} />
        </div>
      </div>
    </div>
  );

  // ── PC layout (split: list panel + map) ───────────────────────
  const pcView = (
    <div className="ll-pc-only ll-split">
      {/* Left: search + filters + list */}
      <div className="ll-split-panel">
        <div className="ll-split-panel-sticky">
          <div style={{ padding: "10px 14px 8px" }}>
            <div style={{ background: "var(--content-bg)", borderRadius: 12, padding: "9px 14px", display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <span style={{ fontSize: 13, color: "var(--foreground-muted)" }}>{isKo ? "장소, 동네 검색…" : "Search places…"}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 7, padding: "0 14px 10px", overflowX: "auto", scrollbarWidth: "none" }}>
            {CHIPS.map((c) => {
              const active = chip === c.key;
              return (
                <button key={c.key} onClick={() => setChip(c.key)} style={{ flexShrink: 0, padding: "5px 12px", borderRadius: 999, border: active ? "none" : "1px solid var(--border)", background: active ? "var(--grade-s)" : "var(--content-bg)", color: active ? "#fff" : "var(--foreground-muted)", fontSize: 12, fontWeight: active ? 700 : 400, cursor: "pointer" }}>
                  {isKo ? c.ko : c.en}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "8px 14px" }}>
          {/* 이태원 PICK — PC, big badge via PlaceCard2 hot */}
          <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: "var(--grade-s)", marginBottom: 8 }}>
              {isKo ? "이태원 PICK" : "ITAEWON PICK"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {hotPlaces.map((p) => <PlaceCard2 key={p.id} place={p} isKo={isKo} hot />)}
            </div>
          </div>

          {/* 다른 지역 추천 */}
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: "var(--foreground-muted)", marginBottom: 8 }}>
            {isKo ? "다른 지역 추천" : "OTHER REGIONS"}
          </div>
          {filtered.map((place) => (
            <PlaceCardPC key={place.id} place={place} isSelected={selected?.id === place.id} isKo={isKo} onClick={() => setSelected(place)} />
          ))}
        </div>
      </div>

      {/* Right: map */}
      <div className="ll-split-main">
        <KakaoMap
          lang={isKo ? "ko" : "en"}
          pins={pins}
          center={ITAEWON}
          zoom={5}
          onPinClick={(id) => { const p = SEED_PLACES.find((x) => x.id === id); if (p) setSelected(p); }}
        />
        {selected && (
          <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", width: "min(400px, calc(100% - 48px))", background: "var(--card)", borderRadius: 20, border: "1px solid var(--border)", boxShadow: "0 8px 40px rgba(0,0,0,0.18)", padding: "14px 16px", zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: GRADE_BG[getRating(selected)], display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 15, fontWeight: 800, lineHeight: 1, color: GRADE_TEXT[getRating(selected)] }}>{getRating(selected)}</span>
                <span style={{ fontSize: 6, fontWeight: 700, color: GRADE_TEXT[getRating(selected)], opacity: 0.85 }}>GRADE</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", marginBottom: 2 }}>{isKo ? selected.name_ko : selected.name_en}</div>
                <div style={{ fontSize: 11, color: "var(--foreground-muted)" }}>{isKo ? selected.name_en : selected.name_ko}</div>
              </div>
              <Link href={`/places/${selected.slug}`} style={{ padding: "7px 14px", borderRadius: 999, border: "none", background: "var(--grade-s)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", textDecoration: "none" }}>
                {isKo ? "상세보기" : "Details"}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {mobileView}
      {pcView}
      {showPopup && <WelcomePopup isKo={isKo} onClose={closePopup} />}
    </>
  );
}
