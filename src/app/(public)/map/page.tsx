"use client";

import { useState } from "react";
import { useLang } from "@/lib/lang";
import dynamic from "next/dynamic";
import { SEED_PLACES } from "@/data/seed";
import type { Place } from "@/types";

const KakaoMap = dynamic(
  () => import("@/components/map/KakaoMap").then((m) => m.KakaoMap),
  { ssr: false, loading: () => <div style={{ width: "100%", height: "100%", background: "#E8F4F8" }} /> }
);

const ITAEWON = { lat: 37.534, lng: 126.9946 };

const CAT_CODES: Record<string, string> = {
  cafe: "CF", restaurant: "RS", bar: "BR", market: "MK",
  shopping: "SH", activity: "AC", health: "HL", transport: "TR",
};

function getRating(p: Place): "S" | "A" | "B" | "C" {
  if (p.english_support && p.card_payment && p.solo_friendly) return "S";
  if (p.english_support && p.card_payment) return "A";
  if (p.card_payment) return "B";
  return "C";
}

const RATING_STYLE: Record<string, { bg: string; color: string }> = {
  S: { bg: "#D6F5F5", color: "#0B7A82" },
  A: { bg: "#E8F4FF", color: "#1565C0" },
  B: { bg: "#FFF9C4", color: "#A56000" },
  C: { bg: "#F5F5F5", color: "#666" },
};

const T = {
  ko: {
    searchPh: "장소, 동네 검색...",
    chips: ["전체", "S등급", "A등급", "음식점", "카페", "시장"],
    english: "영어 OK", card: "카드 OK", solo: "혼자 OK",
    noResults: "해당하는 장소가 없어요",
    detailTitle: "장소 정보",
    address: "주소",
    startRoute: "길 찾기",
    save: "저장",
  },
  en: {
    searchPh: "Search places, neighborhoods...",
    chips: ["All", "S-rated", "A-rated", "Restaurant", "Café", "Market"],
    english: "English OK", card: "Card OK", solo: "Solo OK",
    noResults: "No places found",
    detailTitle: "Place Info",
    address: "Address",
    startRoute: "Get Directions",
    save: "Save",
  },
};

type ChipKey = "all" | "S" | "A" | "restaurant" | "cafe" | "market";
const CHIP_KEYS: ChipKey[] = ["all", "S", "A", "restaurant", "cafe", "market"];

function PlaceCard({
  place, isSelected, isKo, t, onClick,
}: {
  place: Place; isSelected: boolean; isKo: boolean;
  t: typeof T.ko; onClick: () => void;
}) {
  const rating = getRating(place);
  const { bg, color } = RATING_STYLE[rating];
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 12px", marginBottom: 8,
        background: isSelected ? "var(--card-selected)" : "var(--card)",
        borderRadius: 14,
        border: isSelected ? "1.5px solid #15b6c1" : "1px solid var(--border)",
        cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 12, background: isSelected ? "#D6F5F5" : "var(--icon-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, fontWeight: 800, color: isSelected ? "#0B7A82" : "var(--muted-foreground)" }}>
        {CAT_CODES[place.category] ?? "PL"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>
            {isKo ? place.name_ko : place.name_en}
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 6, background: bg, color }}>{rating}</span>
        </div>
        <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 4 }}>
          {isKo ? (place.address_ko ?? place.name_ko) : (place.address ?? place.name_en)}
        </p>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {place.english_support && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#D6F5F5", color: "#0B7A82", fontWeight: 600 }}>{t.english}</span>}
          {place.card_payment && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#E8F4FF", color: "#1565C0", fontWeight: 600 }}>{t.card}</span>}
          {place.solo_friendly && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#F0FFF0", color: "#2E7D32", fontWeight: 600 }}>{t.solo}</span>}
        </div>
      </div>
      <span style={{ color: "#15b6c1", fontSize: 16, flexShrink: 0 }}>›</span>
    </div>
  );
}

export default function MapPage() {
  const isKo = useLang();
  const [selectedPlace, setSelectedPlace] = useState<Place>(SEED_PLACES[0]);
  const [chip, setChip] = useState<ChipKey>("all");

  const t = isKo ? T.ko : T.en;

  const filtered = SEED_PLACES.filter((p) => {
    if (chip === "all") return true;
    if (chip === "S") return getRating(p) === "S";
    if (chip === "A") return getRating(p) === "A";
    if (chip === "restaurant") return p.category === "restaurant";
    if (chip === "cafe") return p.category === "cafe";
    if (chip === "market") return p.category === "market";
    return true;
  });

  const pins = SEED_PLACES.filter((p) => p.lat && p.lng).map((p) => ({
    id: p.id, lat: p.lat!, lng: p.lng!, title: p.name_en, rating: getRating(p),
  }));

  const selectedRating = getRating(selectedPlace);
  const { bg: selBg, color: selColor } = RATING_STYLE[selectedRating];

  const searchAndChips = (
    <>
      <div className="ll-split-panel-sticky">
        <div style={{ padding: "10px 14px 8px" }}>
          <div style={{ background: "var(--content-bg)", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>검색</span>
            <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>{t.searchPh}</span>
          </div>
        </div>
        <div className="scroll-x" style={{ padding: "0 14px 10px", display: "flex", gap: 8 }}>
          {CHIP_KEYS.map((key, i) => {
            const active = chip === key;
            return (
              <button key={key} onClick={() => setChip(key)} style={{ flexShrink: 0, padding: "5px 14px", borderRadius: 20, border: active ? "none" : "1px solid var(--border)", background: active ? "#15b6c1" : "var(--content-bg)", color: active ? "#fff" : "var(--muted-foreground)", fontSize: 12, fontWeight: active ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap" }}>
                {t.chips[i]}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <div className="ll-fullpage" style={{ display: "flex", flexDirection: "column" }}>

      {/* ── Mobile layout ── */}
      <div className="ll-mobile-only" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", padding: "8px 14px", flexShrink: 0 }}>
          <div style={{ background: "var(--content-bg)", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>검색</span>
            <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>{t.searchPh}</span>
          </div>
        </div>
        <div className="scroll-x" style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", padding: "10px 16px", display: "flex", gap: 8, flexShrink: 0 }}>
          {CHIP_KEYS.map((key, i) => {
            const active = chip === key;
            return (
              <button key={key} onClick={() => setChip(key)} style={{ flexShrink: 0, padding: "5px 14px", borderRadius: 20, border: active ? "none" : "1px solid var(--border)", background: active ? "#15b6c1" : "var(--content-bg)", color: active ? "#fff" : "var(--muted-foreground)", fontSize: 12, fontWeight: active ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap" }}>
                {t.chips[i]}
              </button>
            );
          })}
        </div>
        <div style={{ height: 190, flexShrink: 0, position: "relative" }}>
          <KakaoMap key={`mob-${isKo ? "ko" : "en"}`} lang={isKo ? "ko" : "en"} pins={pins} center={ITAEWON} zoom={5} onPinClick={(id) => { const p = SEED_PLACES.find((x) => x.id === id); if (p) setSelectedPlace(p); }} />
        </div>
        <div style={{ flex: 1, overflowY: "auto", background: "var(--content-bg)", padding: "8px 14px 0" }}>
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: "var(--muted-foreground)", fontSize: 13 }}>{t.noResults}</div>}
          {filtered.map((place) => (
            <PlaceCard key={place.id} place={place} isSelected={place.id === selectedPlace?.id} isKo={isKo} t={t} onClick={() => setSelectedPlace(place)} />
          ))}
          <div style={{ height: 12 }} />
        </div>
      </div>

      {/* ── PC split layout ── */}
      <div className="ll-pc-only ll-split">
        {/* Left panel: search + filters + place list */}
        <div className="ll-split-panel">
          {searchAndChips}
          <div style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "8px 14px 0", background: "var(--content-bg)" }}>
            {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: "var(--muted-foreground)", fontSize: 13 }}>{t.noResults}</div>}
            {filtered.map((place) => (
              <PlaceCard key={place.id} place={place} isSelected={place.id === selectedPlace?.id} isKo={isKo} t={t} onClick={() => setSelectedPlace(place)} />
            ))}
            <div style={{ height: 12 }} />
          </div>
        </div>

        {/* Right main: full map + selected place overlay */}
        <div className="ll-split-main">
          <KakaoMap key={`pc-${isKo ? "ko" : "en"}`} lang={isKo ? "ko" : "en"} pins={pins} center={ITAEWON} zoom={5} onPinClick={(id) => { const p = SEED_PLACES.find((x) => x.id === id); if (p) setSelectedPlace(p); }} />
          {/* Selected place card overlay */}
          {selectedPlace && (
            <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", width: "min(420px, calc(100% - 48px))", background: "var(--card)", borderRadius: 20, border: "1px solid var(--border)", boxShadow: "0 8px 40px rgba(0,0,0,0.18)", padding: "16px 18px", zIndex: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "#D6F5F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, fontWeight: 800, color: "#0B7A82" }}>
                  {CAT_CODES[selectedPlace.category] ?? "PL"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: "var(--foreground)" }}>{isKo ? selectedPlace.name_ko : selectedPlace.name_en}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 6, background: selBg, color: selColor }}>{selectedRating}</span>
                  </div>
                  <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>
                    {isKo ? (selectedPlace.address_ko ?? selectedPlace.name_ko) : (selectedPlace.address ?? selectedPlace.name_en)}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button style={{ padding: "7px 14px", borderRadius: 20, border: "1px solid var(--border)", background: "var(--content-bg)", color: "var(--muted-foreground)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    {t.save}
                  </button>
                  <button style={{ padding: "7px 14px", borderRadius: 20, border: "none", background: "#15b6c1", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    {t.startRoute}
                  </button>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                {selectedPlace.english_support && <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: "#D6F5F5", color: "#0B7A82", fontWeight: 600 }}>{t.english}</span>}
                {selectedPlace.card_payment && <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: "#E8F4FF", color: "#1565C0", fontWeight: 600 }}>{t.card}</span>}
                {selectedPlace.solo_friendly && <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: "#F0FFF0", color: "#2E7D32", fontWeight: 600 }}>{t.solo}</span>}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
