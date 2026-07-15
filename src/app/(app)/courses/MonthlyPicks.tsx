"use client";

// "이달의 강력추천" — a region-independent, editorially curated highlight row
// above the location-based course feed. Two of the three picks (trending
// cafe / trending restaurant) are real collected places, selected from the
// grade-A+ pool with a deterministic month-seeded pick so "this month's"
// pick actually rotates monthly without relying on Math.random() (never
// reproducible — see project convention elsewhere, e.g. src/lib/course
// hue helpers). The convenience-store combo has no place to point at, so it
// is hand-authored.

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/lang";
import {
  fetchCandidatePlacesWithFallback,
  fetchRegionOptions,
  type RegionOption,
} from "@/lib/course/db";
import type { CandidatePlace } from "@/lib/course";

const GRADE_RANK: Record<string, number> = { S: 4, A: 3, B: 2, C: 1, D: 0 };

// FNV-1a — deterministic, so the same month always picks the same place.
function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function pickForMonth(pool: CandidatePlace[], seedSuffix: string): CandidatePlace | null {
  if (pool.length === 0) return null;
  const monthKey = new Date().toISOString().slice(0, 7); // "2026-07"
  const idx = fnv1a(monthKey + seedSuffix) % pool.length;
  return pool[idx];
}

const COMBO = {
  ko: {
    title: "불닭볶음면 + 슬라이스 치즈",
    desc: "매운 불닭볶음면에 치즈 한 장을 올리면 매운맛이 확 줄어들어요. 편의점 한 번으로 재료가 다 모이는, 한국 청춘들의 국룰 조합.",
  },
  en: {
    title: "Fire Noodles + Sliced Cheese",
    desc: "Melt a slice of cheese into spicy fire noodles to tame the heat — a beloved combo you can put together entirely from one convenience-store run.",
  },
};

function themeHue(seed: string): number {
  return fnv1a(seed) % 360;
}

function PickCard({
  badge,
  place,
  regionLabel,
  isKo,
}: {
  badge: string;
  place: CandidatePlace;
  regionLabel: string;
  isKo: boolean;
}) {
  const name = isKo ? place.name.ko : place.name.en;
  const hue = themeHue(place.id);
  return (
    <Link
      href={`/places/${place.slug}`}
      style={{
        flexShrink: 0, width: 168, display: "flex", flexDirection: "column",
        background: "var(--card)", borderRadius: 16, overflow: "hidden",
        border: "1px solid var(--border)", textDecoration: "none",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: 100, background: "var(--content-bg)" }}>
        {place.imageUrl ? (
          <Image src={place.imageUrl} alt={name} fill sizes="168px" style={{ objectFit: "cover" }} />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: `linear-gradient(135deg, hsl(${hue} 55% 46%), hsl(${(hue + 40) % 360} 58% 38%))`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 26, fontWeight: 800,
          }}>
            {name.trim().charAt(0) || "?"}
          </div>
        )}
        <span style={{
          position: "absolute", top: 8, left: 8,
          fontSize: 9.5, fontWeight: 800, padding: "3px 8px", borderRadius: 999,
          background: "rgba(255,86,54,0.92)", color: "#fff", letterSpacing: "0.02em",
        }}>
          {badge}
        </span>
      </div>
      <div style={{ padding: "9px 11px 11px", display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {name}
        </div>
        <div style={{ fontSize: 10.5, color: "var(--foreground-muted)" }}>
          {regionLabel}
        </div>
      </div>
    </Link>
  );
}

export function MonthlyPicks() {
  const isKo = useLang();
  const [cafe, setCafe] = useState<CandidatePlace | null>(null);
  const [restaurant, setRestaurant] = useState<CandidatePlace | null>(null);
  const [regions, setRegions] = useState<RegionOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [{ places }, regionOptions] = await Promise.all([
        fetchCandidatePlacesWithFallback(),
        fetchRegionOptions(),
      ]);
      if (!alive) return;

      const pool = (category: string) => {
        const graded = places.filter(
          (p) => p.category === category && (GRADE_RANK[p.grade ?? ""] ?? -1) >= GRADE_RANK.A
        );
        return graded.length > 0 ? graded : places.filter((p) => p.category === category);
      };

      setCafe(pickForMonth(pool("cafe"), "cafe"));
      setRestaurant(pickForMonth(pool("restaurant"), "restaurant"));
      setRegions(regionOptions);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const regionLabel = (regionId: string | null) => {
    const r = regions.find((x) => x.id === regionId);
    if (!r) return "";
    return isKo ? r.name_ko : r.name_en;
  };

  if (!loading && !cafe && !restaurant) return null;

  return (
    <div style={{ margin: "0 0 20px" }}>
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 2, marginBottom: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>
          {isKo ? "이달의 강력추천" : "This Month's Top Picks"}
        </div>
        <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>
          {isKo ? "지역 상관없이, 지금 한국에서 유행하는 것들" : "No matter where you are — what's trending in Korea right now"}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 16px 4px", scrollbarWidth: "none" }}>
        {/* Convenience-store combo — editorial, not a place */}
        <div style={{
          flexShrink: 0, width: 168, display: "flex", flexDirection: "column",
          background: "var(--card)", borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)",
        }}>
          <div style={{
            position: "relative", width: "100%", height: 100,
            background: "linear-gradient(135deg, #FF8A5B 0%, #FF5636 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              position: "absolute", top: 8, left: 8,
              fontSize: 9.5, fontWeight: 800, padding: "3px 8px", borderRadius: 999,
              background: "rgba(255,255,255,0.24)", color: "#fff", letterSpacing: "0.02em",
            }}>
              {isKo ? "편의점 조합" : "Store Combo"}
            </span>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16l-1.5 8a5.5 5.5 0 01-11 0L6 4z" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </div>
          <div style={{ padding: "9px 11px 11px", display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>
              {isKo ? COMBO.ko.title : COMBO.en.title}
            </div>
            <div style={{ fontSize: 10.5, color: "var(--foreground-muted)", lineHeight: 1.5 }}>
              {isKo ? COMBO.ko.desc : COMBO.en.desc}
            </div>
          </div>
        </div>

        {loading ? (
          [0, 1].map((i) => (
            <div key={i} className="skeleton" style={{ flexShrink: 0, width: 168, height: 165, borderRadius: 16 }} />
          ))
        ) : (
          <>
            {cafe && (
              <PickCard
                badge={isKo ? "인기급상승 카페" : "Trending Cafe"}
                place={cafe}
                regionLabel={regionLabel(cafe.regionId)}
                isKo={isKo}
              />
            )}
            {restaurant && (
              <PickCard
                badge={isKo ? "인기급상승 식당" : "Trending Restaurant"}
                place={restaurant}
                regionLabel={regionLabel(restaurant.regionId)}
                isKo={isKo}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
