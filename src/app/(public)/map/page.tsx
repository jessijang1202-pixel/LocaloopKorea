"use client";

import { useState } from "react";
import { useLang } from "@/lib/lang";
import { useTheme } from "@/lib/theme";
import dynamic from "next/dynamic";
import { SEED_PLACES } from "@/data/seed";
import type { Place } from "@/types";
import Link from "next/link";

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

// Approximate walking times from Itaewon (mock)
const WALK_MIN: Record<string, number> = {
  p1: 8, p2: 25, p3: 20, p4: 14, p5: 3, p6: 5, p7: 12,
};

function PlaceRow({ place, isKo, onClick }: {
  place: Place; isKo: boolean; onClick: () => void;
}) {
  const rating = getRating(place);
  const walk = WALK_MIN[place.id] ?? 10;
  const dist = walk * 70;
  const GRADE_BG: Record<string, string> = {
    S: "var(--grade-s)", A: "var(--grade-a)", B: "var(--grade-b)", C: "var(--grade-c)",
  };

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", gap: 12, padding: "14px 0",
        borderBottom: "1px solid var(--border)",
        cursor: "pointer", alignItems: "flex-start",
      }}
    >
      {/* Grade badge */}
      <div style={{
        width: 46, height: 46, borderRadius: 13, flexShrink: 0,
        background: GRADE_BG[rating],
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        color: "#fff", userSelect: "none",
      }}>
        <span style={{ fontSize: 17, fontWeight: 800, lineHeight: 1 }}>{rating}</span>
        <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.05em", opacity: 0.85 }}>GRADE</span>
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
          <span>도보 {walk}분 · {dist}m</span>
          <span style={{ color: "var(--success)", fontWeight: 600 }}>· 지금 영업중</span>
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {place.english_support && (
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "var(--badge-en-bg)", color: "var(--badge-en-fg)", fontWeight: 600 }}>
              🌐 영어 OK
            </span>
          )}
          {place.card_payment && (
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "var(--badge-card-bg)", color: "var(--badge-card-fg)", fontWeight: 600 }}>
              💳 카드 OK
            </span>
          )}
          {place.solo_friendly && (
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "var(--badge-solo-bg)", color: "var(--badge-solo-fg)", fontWeight: 600 }}>
              👤 혼자 OK
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// PC left-panel place card (compact)
function PlaceCardPC({ place, isSelected, isKo, onClick }: {
  place: Place; isSelected: boolean; isKo: boolean; onClick: () => void;
}) {
  const rating = getRating(place);
  const GRADE_BG: Record<string, string> = {
    S: "var(--grade-s)", A: "var(--grade-a)", B: "var(--grade-b)", C: "var(--grade-c)",
  };
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
      <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: GRADE_BG[rating], display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        <span style={{ fontSize: 13, fontWeight: 800, lineHeight: 1 }}>{rating}</span>
        <span style={{ fontSize: 6, fontWeight: 700, opacity: 0.85 }}>GRADE</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)", marginBottom: 2 }}>{isKo ? place.name_ko : place.name_en}</div>
        <div style={{ fontSize: 11, color: "var(--foreground-muted)" }}>{isKo ? place.name_en : place.name_ko}</div>
      </div>
    </div>
  );
}

export default function MapPage() {
  const isKo = useLang();
  const theme = useTheme();
  const [selected, setSelected] = useState<Place>(SEED_PLACES[0]);
  const [chip, setChip] = useState<FilterKey>("all");
  const [sheetExpanded, setSheetExpanded] = useState(false);

  const filtered = SEED_PLACES.filter((p) => {
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
            <span style={{ fontSize: 14, fontWeight: 700 }}>이태원</span>
            <span style={{ fontSize: 12, color: pillMuted }}>Itaewon</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ width: 36, height: 36, borderRadius: 999, background: chipBg, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, color: chipFg, boxShadow: "0 2px 8px rgba(0,0,0,0.14)" }}>EN</button>
            <Link href="/profile" style={{ width: 36, height: 36, borderRadius: 999, background: "var(--grade-s)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff", textDecoration: "none", boxShadow: "0 2px 8px rgba(255,86,54,0.4)" }}>MY</Link>
          </div>
        </div>

        {/* Row 2: Search */}
        <div style={{ pointerEvents: "auto" }}>
          <div style={{ background: chipBg, borderRadius: 16, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 12px rgba(0,0,0,0.12)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <span style={{ fontSize: 14, color: "var(--foreground-muted)" }}>장소, 동네 검색…</span>
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
                {c.hasIcon && <span style={{ fontSize: 12 }}>🌐</span>}
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
            <span style={{ fontSize: 11, color: "#F4F0E8", fontWeight: 500 }}>로그인 전 · 이태원 기본</span>
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
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 80px)",
        }}
      >
        {/* Drag handle */}
        <div
          onClick={() => setSheetExpanded(v => !v)}
          style={{ padding: "10px 0 0", display: "flex", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}
        >
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border)" }} />
        </div>

        {/* Header */}
        <div style={{ padding: "10px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, borderBottom: "1px solid var(--border)" }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: "var(--foreground)" }}>
            이태원 근처&nbsp;
            <span style={{ color: "var(--foreground-muted)", fontWeight: 500 }}>148곳</span>
          </span>
          <button style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 13, color: "var(--foreground-muted)", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
            거리순
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
          </button>
        </div>

        {/* Place list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
          {filtered.map((place) => (
            <PlaceRow key={place.id} place={place} isKo={isKo} onClick={() => { setSelected(place); if (!sheetExpanded) setSheetExpanded(true); }} />
          ))}
          <div style={{ height: 16 }} />
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
              <span style={{ fontSize: 13, color: "var(--foreground-muted)" }}>장소, 동네 검색…</span>
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
              <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: { S: "var(--grade-s)", A: "var(--grade-a)", B: "var(--grade-b)", C: "var(--grade-c)" }[getRating(selected)], display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <span style={{ fontSize: 15, fontWeight: 800, lineHeight: 1 }}>{getRating(selected)}</span>
                <span style={{ fontSize: 6, fontWeight: 700 }}>GRADE</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", marginBottom: 2 }}>{isKo ? selected.name_ko : selected.name_en}</div>
                <div style={{ fontSize: 11, color: "var(--foreground-muted)" }}>{isKo ? selected.name_en : selected.name_ko}</div>
              </div>
              <Link href={`/places/${selected.slug}`} style={{ padding: "7px 14px", borderRadius: 999, border: "none", background: "var(--grade-s)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", textDecoration: "none" }}>
                상세보기
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
    </>
  );
}
