"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/lang";
import dynamic from "next/dynamic";
import { SEED_PLACES } from "@/data/seed";
import type { Place } from "@/types";

const KakaoMap = dynamic(
  () => import("@/components/map/KakaoMap").then((m) => m.KakaoMap),
  { ssr: false, loading: () => <div style={{ width: "100%", height: "100%", background: "#E8F4F8" }} /> }
);

const ITAEWON = { lat: 37.534, lng: 126.9946 };

const CAT_ICONS: Record<string, string> = {
  cafe: "☕", restaurant: "🍽️", bar: "🍺", market: "🛍️",
  shopping: "🛒", activity: "🏃", health: "🏥", transport: "🚌",
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
    title: "장소 탐색",
    searchPh: "장소, 동네 검색...",
    chips: ["전체", "S등급", "A등급", "음식점", "카페", "시장"],
    english: "영어 OK",
    card: "카드 OK",
    solo: "혼자 OK",
  },
  en: {
    title: "Place Discovery",
    searchPh: "Search places, neighborhoods...",
    chips: ["All", "S-rated", "A-rated", "Restaurant", "Café", "Market"],
    english: "English OK",
    card: "Card OK",
    solo: "Solo OK",
  },
};

type ChipKey = "all" | "S" | "A" | "restaurant" | "cafe" | "market";
const CHIP_KEYS: ChipKey[] = ["all", "S", "A", "restaurant", "cafe", "market"];

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

  return (
    <div className="ll-fullpage" style={{ display: "flex", flexDirection: "column" }}>
      {/* Search bar + Guide button */}
      <div style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", padding: "8px 14px", display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
        <div style={{ flex: 1, background: "var(--content-bg)", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
          <span>🔍</span>
          <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>{t.searchPh}</span>
        </div>
        <Link href="/guide" style={{ display: "inline-flex", alignItems: "center", padding: "5px 12px", borderRadius: 20, background: "#0B1E2D", border: "1.5px solid rgba(21,182,193,0.55)", color: "#fff", fontSize: 11, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", letterSpacing: "0.04em" }}>
          {isKo ? "가이드" : "Guide"}
        </Link>
      </div>

      {/* Filter chips */}
      <div className="scroll-x" style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", padding: "10px 16px", display: "flex", gap: 8, flexShrink: 0 }}>
        {CHIP_KEYS.map((key, i) => {
          const active = chip === key;
          return (
            <button
              key={key}
              onClick={() => setChip(key)}
              style={{
                flexShrink: 0, padding: "5px 14px", borderRadius: 20,
                border: active ? "none" : "1px solid var(--border)",
                background: active ? "#15b6c1" : "var(--content-bg)",
                color: active ? "#fff" : "var(--muted-foreground)",
                fontSize: 12, fontWeight: active ? 700 : 400,
                cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              {t.chips[i]}
            </button>
          );
        })}
      </div>

      {/* Map */}
      <div style={{ height: 190, flexShrink: 0, position: "relative" }}>
        <KakaoMap
          key={isKo ? "ko" : "en"}
          lang={isKo ? "ko" : "en"}
          pins={pins}
          center={ITAEWON}
          zoom={5}
          onPinClick={(id) => {
            const p = SEED_PLACES.find((x) => x.id === id);
            if (p) setSelectedPlace(p);
          }}
        />
      </div>

      {/* Place list */}
      <div style={{ flex: 1, overflowY: "auto", background: "var(--content-bg)", padding: "8px 14px 0" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--muted-foreground)", fontSize: 13 }}>
            {isKo ? "해당하는 장소가 없어요" : "No places found"}
          </div>
        )}
        {filtered.map((place) => {
          const rating = getRating(place);
          const { bg, color } = RATING_STYLE[rating];
          const isSelected = place.id === selectedPlace?.id;
          return (
            <div
              key={place.id}
              onClick={() => setSelectedPlace(place)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px", marginBottom: 8,
                background: isSelected ? "var(--card-selected)" : "var(--card)",
                borderRadius: 14,
                border: isSelected ? "1.5px solid #15b6c1" : "1px solid var(--border)",
                cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: isSelected ? "#D6F5F5" : "var(--icon-bg)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, flexShrink: 0,
              }}>
                {CAT_ICONS[place.category] ?? "📍"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>
                    {isKo ? place.name_ko : place.name_en}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 6, background: bg, color }}>
                    {rating}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 4 }}>
                  {isKo ? (place.address_ko ?? place.name_ko) : (place.address ?? place.name_en)}
                </p>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {place.english_support && (
                    <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#D6F5F5", color: "#0B7A82", fontWeight: 600 }}>
                      {t.english}
                    </span>
                  )}
                  {place.card_payment && (
                    <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#E8F4FF", color: "#1565C0", fontWeight: 600 }}>
                      {t.card}
                    </span>
                  )}
                  {place.solo_friendly && (
                    <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#F0FFF0", color: "#2E7D32", fontWeight: 600 }}>
                      {t.solo}
                    </span>
                  )}
                </div>
              </div>
              <span style={{ color: "#15b6c1", fontSize: 16, flexShrink: 0 }}>›</span>
            </div>
          );
        })}
        <div style={{ height: 12 }} />
      </div>
    </div>
  );
}
