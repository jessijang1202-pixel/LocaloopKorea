"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLang, setLang } from "@/lib/lang";
import { useTheme } from "@/lib/theme";
import dynamic from "next/dynamic";
import { SEED_PLACES, SEED_REGIONS } from "@/data/seed";
import type { Place } from "@/types";
import { getRating, okTags, GRADE_BG, GRADE_TEXT } from "@/lib/grades";
import Link from "next/link";
import { PlaceGridCard } from "@/components/places/PlaceGridCard";
import { HamburgerMenu } from "@/components/layout/HamburgerMenu";
import { CAT_LABEL } from "@/content/places";
import { ITAEWON, CHIPS, HOT_PLACE_IDS, type FilterKey } from "@/content/map";
import {
  fetchLivePlaces,
  travelFromItaewon,
  hotPlaceIds,
  type LiveRegion,
} from "@/lib/places-live";

// Single muted meta line for the grid cards. ITAEWON PICK cards show the
// travel line; other-region cards prepend the city.
function hotMetaLine(place: Place, isKo: boolean): string | null {
  const t = travelFromItaewon(place);
  return t ? `${isKo ? t.ko : t.en} · ${t.dist}` : null;
}

function otherMetaLine(place: Place, isKo: boolean, regions: LiveRegion[]): string | null {
  const city = regions.find((r) => r.id === place.region_id)?.city ?? "";
  const t = travelFromItaewon(place);
  const parts: string[] = [];
  if (city) parts.push(city);
  if (t) parts.push(`${isKo ? t.ko : t.en} · ${t.dist}`);
  return parts.length ? parts.join(" · ") : null;
}

// Shared OK-tag pill row for PlaceCardPC and the PC selected-place card —
// replaces the old duplicate bilingual name line.
function TagRow({ place, isKo, fontSize }: { place: Place; isKo: boolean; fontSize: number }) {
  const tags = okTags(place);
  const catLabel = CAT_LABEL[place.category];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
      {tags.length > 0 ? (
        tags.map((tag) => (
          <span key={tag.en} style={{ fontSize, fontWeight: 700, padding: "2px 6px", borderRadius: 999, background: "var(--badge-en-bg)", color: "var(--badge-en-fg)", whiteSpace: "nowrap" }}>
            {isKo ? tag.ko : tag.en}
          </span>
        ))
      ) : catLabel ? (
        <span style={{ fontSize: fontSize + 1.5, color: "var(--foreground-muted)" }}>{isKo ? catLabel.ko : catLabel.en}</span>
      ) : null}
    </div>
  );
}

const KakaoMap = dynamic(
  () => import("@/components/map/KakaoMap").then((m) => m.KakaoMap),
  { ssr: false, loading: () => <div style={{ width: "100%", height: "100%", background: "var(--map-bg)" }} /> }
);

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
        <TagRow place={place} isKo={isKo} fontSize={9.5} />
      </div>
    </div>
  );
}

function WelcomePopup({ isDark, isKo, onClose }: { isDark: boolean; isKo: boolean; onClose: () => void }) {
  const cardBg      = isDark ? "#1D1A22" : "#ffffff";
  const cardBorder  = isDark ? "1px solid #2C2833" : "none";
  const scrimBg     = isDark ? "rgba(0,0,0,0.68)" : "rgba(10,8,6,0.60)";
  const eyebrow     = isDark ? "#FF8A6D" : "#E2431F";
  const headline    = isDark ? "#F4F0E8" : "#16151A";
  const bodyText    = isDark ? "#C9C4D6" : "#3A3630";
  const closeBg     = isDark ? "#2A2733" : "#F3EEE4";
  const closeColor  = isDark ? "#8B8598" : "#6C665B";
  const btnBg       = isDark ? "#FF6A4D" : "#FF5636";

  const rows = [
    {
      chipBg: isDark ? "#3A1A14" : "#FFF0EC",
      iconColor: isDark ? "#FF8A6D" : "#E2431F",
      text: isKo
        ? "들어가기 전에, 그 장소가 외국인을 환영하는지 먼저 알 수 있어요."
        : "Know if a place actually welcomes you — before you walk in.",
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L4 6v6c0 4.6 3.5 8.9 8 9.9 4.5-1 8-5.3 8-9.9V6l-8-4z" fill="currentColor" opacity="0.25"/>
          <path d="M12 2L4 6v6c0 4.6 3.5 8.9 8 9.9 4.5-1 8-5.3 8-9.9V6l-8-4z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      chipBg: isDark ? "#0C3B38" : "#D6F5F2",
      iconColor: isDark ? "#7FF0E6" : "#0A8C84",
      text: isKo
        ? "지금 내 상황에 맞게 설계된 단계별 가이드를 받아보세요."
        : "Get a step-by-step guide built for where you are right now.",
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="7" cy="17" r="2.2" fill="currentColor" stroke="none"/>
          <circle cx="17" cy="7" r="2.2" fill="currentColor" stroke="none"/>
          <path d="M17 9.2C17 13.2 14 14.8 12 14.8S7 15.8 7 17"/>
        </svg>
      ),
    },
    {
      chipBg: isDark ? "#3A2E0C" : "#FFF3CC",
      iconColor: isDark ? "#FFD98A" : "#9A6000",
      text: isKo
        ? "관광객이 아닌, 현지인들이 진짜 가는 장소를 찾아보세요."
        : "Find spots locals love, not the ones tourists are sent to.",
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.5 2.1C13.5 2.1 16 5.5 16 8.5c0 1.8-1.2 3-2 3.5 1-1 1.2-3.5-.5-5.5C14 8 13 10 11 10c1.5-1.8 1-5-1-6.5C9 5 8 7.5 8 9.5c0 3 2 5.5 4 6.5 2-1 4-3.5 4-6.5 0-3.5-2.5-7.4-2.5-7.4z" opacity="0.9"/>
          <path d="M9 17c0 1.7 1.3 3 3 3s3-1.3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      chipBg: isDark ? "#2A1F52" : "#EEE4FF",
      iconColor: isDark ? "#C3A8FF" : "#7B4DFF",
      text: isKo
        ? "진짜 한국을 보여줄 준비가 된 사람들을 만나보세요."
        : "Meet people who are ready to show you the real Korea.",
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <circle cx="9" cy="7" r="3"/>
          <path d="M3 21v-2a5 5 0 015-5h4a5 5 0 015 5v2"/>
          <circle cx="17.5" cy="7" r="2.2"/>
          <path d="M21 21v-1.5a4 4 0 00-3.5-3.97"/>
        </svg>
      ),
    },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: scrimBg,
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: cardBg,
          border: cardBorder,
          borderRadius: 26,
          width: "100%",
          maxWidth: 332,
          boxShadow: isDark
            ? "0 24px 60px rgba(0,0,0,0.6)"
            : "0 16px 48px rgba(22,21,26,0.22)",
          padding: "28px 24px 24px",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 20, right: 20,
            width: 30, height: 30, borderRadius: "50%",
            background: closeBg, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: closeColor,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        {/* Eyebrow */}
        <div style={{ fontSize: 11, fontWeight: 700, color: eyebrow, letterSpacing: "0.22em", marginBottom: 10 }}>
          DIG INTO LOCAL KOREA
        </div>

        {/* Headline */}
        <h2 style={{ fontSize: 25, fontWeight: 700, color: headline, letterSpacing: "-0.5px", lineHeight: 1.25, marginBottom: 20 }}>
          {isKo ? <>한국 생활,<br />여기서 시작하세요.</> : <>Your Korea life<br />starts here.</>}
        </h2>

        {/* Value-prop rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 22 }}>
          {rows.map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                background: row.chipBg,
                color: row.iconColor,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {row.icon}
              </div>
              <p style={{ fontSize: 13, color: bodyText, lineHeight: 1.55, margin: 0, paddingTop: 3 }}>
                {row.text}
              </p>
            </div>
          ))}
        </div>

        {/* CTA button */}
        <button
          onClick={onClose}
          style={{
            width: "100%", height: 50, borderRadius: 14,
            background: btnBg, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: "0 4px 16px rgba(255,86,54,0.32)",
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{isKo ? "둘러보기 시작" : "Start Exploring"}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function MapPage() {
  const isKo = useLang();
  const theme = useTheme();
  // DB-first place data with silent seed fallback: initial render is always
  // the code seed (no flash), then live rows swap in when available.
  const [livePlaces, setLivePlaces] = useState<Place[]>(SEED_PLACES);
  const [liveRegions, setLiveRegions] = useState<LiveRegion[]>(SEED_REGIONS);
  const [liveSource, setLiveSource] = useState<"db" | "seed">("seed");
  const [selected, setSelected] = useState<Place>(
    SEED_PLACES.find((p) => p.id === HOT_PLACE_IDS[0]) ?? SEED_PLACES[0]
  );
  const [chip, setChip] = useState<FilterKey>("all");
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const dragStartY = useRef<number | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("ll_welcome_shown")) {
      setShowPopup(true);
    }
    let cancelled = false;
    void fetchLivePlaces().then(({ places, regions, source }) => {
      if (cancelled || source !== "db") return;
      setLivePlaces(places);
      setLiveRegions(regions);
      setLiveSource(source);
      const hot = hotPlaceIds(places, source);
      const first = places.find((p) => p.id === hot[0]) ?? places[0];
      if (first) setSelected(first);
    });
    return () => { cancelled = true; };
  }, []);

  function closePopup() {
    localStorage.setItem("ll_welcome_shown", "1");
    setShowPopup(false);
  }

  const hotIds = hotPlaceIds(livePlaces, liveSource);
  const hotPlaces = livePlaces.filter((p) => hotIds.includes(p.id));

  const filtered = livePlaces.filter((p) => {
    if (hotIds.includes(p.id)) return false; // shown in PICK strip above
    if (chip === "all") return true;
    if (chip === "english") return p.english_support;
    if (chip === "S") return getRating(p) === "S";
    if (chip === "restaurant") return p.category === "restaurant";
    if (chip === "cafe") return p.category === "cafe";
    return true;
  });

  // Fixed 10-item previews; "view more" now navigates to the area pages.
  const hotVisible = hotPlaces.slice(0, 10);
  const otherVisible = filtered.slice(0, 10);
  const itaewonRegionSlug =
    liveRegions.find((r) => r.name_ko === "이태원")?.slug ?? "itaewon";

  const pins = livePlaces.filter((p) => p.lat && p.lng).map((p) => ({
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
          onPinClick={(id) => { const p = livePlaces.find((x) => x.id === id); if (p) setSelected(p); }}
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
            <HamburgerMenu triggerStyle={{ width: 36, height: 36, borderRadius: 999, background: chipBg, border: "none", color: chipFg, boxShadow: "0 2px 8px rgba(0,0,0,0.14)" }} />
          </div>
        </div>

        {/* Row 1.5: Tagline caption */}
        <div style={{ pointerEvents: "none" }}>
          <span style={{
            display: "inline-block", background: chipBg, color: chipFg,
            borderRadius: 999, padding: "6px 12px", fontSize: 11.5, fontWeight: 600,
            boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
          }}>
            {isKo ? "들어가기 전에, 외국인 환영 여부부터 확인하세요." : "Check if a place welcomes foreigners — before you walk in."}
          </span>
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
              {hotVisible.map((p) => <PlaceGridCard key={p.id} place={p} isKo={isKo} metaLine={hotMetaLine(p, isKo)} />)}
            </div>
            <Link href={`/areas/${itaewonRegionSlug}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", marginTop: 10, padding: "10px 0", borderRadius: 12, background: "var(--content-bg)", border: "1px solid var(--border)", color: "var(--foreground-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "none" }}>
              {isKo ? "이태원 전체 보기" : "View all Itaewon"}
            </Link>
          </div>

          {/* 다른 지역 추천 — 2×3 grid, medium badge + city label */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: "var(--foreground-muted)", marginBottom: 10 }}>
              {isKo ? "다른 지역 추천" : "OTHER REGIONS"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {otherVisible.map((p) => <PlaceGridCard key={p.id} place={p} isKo={isKo} metaLine={otherMetaLine(p, isKo, liveRegions)} />)}
            </div>
            <Link href="/areas" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", marginTop: 10, padding: "10px 0", borderRadius: 12, background: "var(--content-bg)", border: "1px solid var(--border)", color: "var(--foreground-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "none" }}>
              {isKo ? "지역별 전체 보기" : "Browse all areas"}
            </Link>
          </div>

          {/* Safe-area spacer */}
          <div style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
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
          <div style={{ padding: "10px 14px 0", fontSize: 12, fontWeight: 600, color: "var(--foreground-muted)" }}>
            {isKo ? "들어가기 전에, 외국인 환영 여부부터 확인하세요." : "Check if a place welcomes foreigners — before you walk in."}
          </div>
          <div style={{ padding: "6px 14px 8px" }}>
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
              {hotVisible.map((p) => <PlaceGridCard key={p.id} place={p} isKo={isKo} metaLine={hotMetaLine(p, isKo)} />)}
            </div>
            <Link href={`/areas/${itaewonRegionSlug}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", marginTop: 8, padding: "9px 0", borderRadius: 12, background: "var(--content-bg)", border: "1px solid var(--border)", color: "var(--foreground-muted)", fontSize: 12.5, fontWeight: 600, cursor: "pointer", textDecoration: "none" }}>
              {isKo ? "이태원 전체 보기" : "View all Itaewon"}
            </Link>
          </div>

          {/* 다른 지역 추천 */}
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: "var(--foreground-muted)", marginBottom: 8 }}>
            {isKo ? "다른 지역 추천" : "OTHER REGIONS"}
          </div>
          {otherVisible.map((place) => (
            <PlaceCardPC key={place.id} place={place} isSelected={selected?.id === place.id} isKo={isKo} onClick={() => setSelected(place)} />
          ))}
          <Link href="/areas" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", marginTop: 4, marginBottom: 8, padding: "9px 0", borderRadius: 12, background: "var(--content-bg)", border: "1px solid var(--border)", color: "var(--foreground-muted)", fontSize: 12.5, fontWeight: 600, cursor: "pointer", textDecoration: "none" }}>
            {isKo ? "지역별 전체 보기" : "Browse all areas"}
          </Link>
        </div>
      </div>

      {/* Right: map */}
      <div className="ll-split-main">
        <KakaoMap
          lang={isKo ? "ko" : "en"}
          pins={pins}
          center={ITAEWON}
          zoom={5}
          onPinClick={(id) => { const p = livePlaces.find((x) => x.id === id); if (p) setSelected(p); }}
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
                <TagRow place={selected} isKo={isKo} fontSize={9.5} />
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
      {showPopup && <WelcomePopup isDark={isDark} isKo={isKo} onClose={closePopup} />}
    </>
  );
}
