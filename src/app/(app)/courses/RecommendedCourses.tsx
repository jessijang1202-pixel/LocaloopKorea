"use client";

// Location-based recommended course feed (patent no.3 module 500). On mount it
// loads the collected-places dataset, tries browser geolocation to pick a home
// region (nearest region centroid; silent 이태원 fallback), then composes up to
// 10 ready-made themed course cards — home region first, nearest regions next.
// Clicking a card expands its full timeline (CourseResultView) below the grid.

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/lang";
import { useNavigatorProfile } from "@/lib/engine";
import {
  THEMES,
  FALLBACK_THEME,
  filterForTheme,
  composeThemedCourse,
  centroidOf,
  haversineKm,
  type ComposedCourse,
  type CourseProfile,
  type CourseTheme,
  type LanguageLevel,
} from "@/lib/course";
import {
  fetchCandidatePlacesWithFallback,
  fetchRegionOptions,
  type RegionOption,
} from "@/lib/course/db";
import { ITAEWON } from "@/content/map";
import { CourseResultView } from "./CourseResultView";

const FEED_SIZE = 10;
const FEED_BUDGET = 50000;

interface FeedCard {
  course: ComposedCourse;
  theme: CourseTheme;
  region: RegionOption; // bilingual name derived at render
  profile: CourseProfile;
}

// Deterministic hue from a theme id — the no-image gradient cover.
function themeHue(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % 360;
}

function CardButton({
  card,
  isKo,
  active,
  onClick,
}: {
  card: FeedCard;
  isKo: boolean;
  active: boolean;
  onClick: () => void;
}) {
  const cover = card.course.stops.find((s) => s.place.imageUrl)?.place.imageUrl ?? null;
  const themeName = isKo ? card.theme.name.ko : card.theme.name.en;
  const regionName = isKo ? card.region.name_ko : card.region.name_en;
  const initial = themeName.trim().charAt(0) || "?";
  const hue = themeHue(card.theme.id);
  const stops = card.course.stops.length;
  const total = card.course.totalBudget;
  const h = Math.floor(card.course.totalMinutes / 60);
  const m = card.course.totalMinutes % 60;

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", flexDirection: "column", textAlign: "left", padding: 0,
        background: "var(--card)", overflow: "hidden", borderRadius: 14, cursor: "pointer",
        border: active ? "1.5px solid var(--grade-s)" : "1px solid var(--border)",
      }}
    >
      {/* Cover */}
      <div style={{ position: "relative", width: "100%", height: 96, flexShrink: 0, background: "var(--content-bg)" }}>
        {cover ? (
          <Image src={cover} alt={themeName} fill sizes="220px" style={{ objectFit: "cover" }} />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: `linear-gradient(135deg, hsl(${hue} 55% 46%), hsl(${(hue + 40) % 360} 58% 38%))`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 30, fontWeight: 800,
          }}>
            {initial}
          </div>
        )}
      </div>
      {/* Info */}
      <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {themeName}
        </div>
        <div style={{ fontSize: 11, color: "var(--foreground-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {regionName}
        </div>
        <div style={{ fontSize: 11.5, color: "var(--foreground-muted)" }}>
          {isKo
            ? `${stops}곳 · ₩${total.toLocaleString()} · ${h}시간 ${m}분`
            : `${stops} stops · ₩${total.toLocaleString()} · ${h}h ${m}m`}
        </div>
      </div>
    </button>
  );
}

export function RecommendedCourses() {
  const isKo = useLang();
  const [profile] = useNavigatorProfile();

  // Latest korean level without forcing a feed rebuild — the composition reads
  // it after the async fetch resolves (profile hydrates from localStorage).
  const levelRef = useRef<LanguageLevel>("basic");
  levelRef.current = profile.koreanLevel ?? "basic";

  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<FeedCard[]>([]);
  const [home, setHome] = useState<RegionOption | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const expandedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [{ places }, regions] = await Promise.all([
          fetchCandidatePlacesWithFallback(),
          fetchRegionOptions(),
        ]);
        if (!alive) return;
        if (places.length === 0 || regions.length === 0) {
          setLoading(false);
          return;
        }

        // Best-effort browser geolocation — 3s timeout, silent on failure/denial.
        const coords = await new Promise<{ lat: number; lng: number } | null>((resolve) => {
          if (typeof navigator === "undefined" || !navigator.geolocation) {
            resolve(null);
            return;
          }
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => resolve(null),
            { timeout: 3000 },
          );
        });
        if (!alive) return;

        // Centroid per region (null when a region has no located candidates).
        const centroids = new Map<string, { lat: number; lng: number } | null>();
        for (const r of regions) {
          centroids.set(r.id, centroidOf(places.filter((p) => p.regionId === r.id)));
        }

        // Home region: nearest centroid to user coords, else 이태원, else first.
        let homeRegion: RegionOption;
        if (coords) {
          homeRegion = regions.reduce((best, r) => {
            const cr = centroids.get(r.id);
            const cb = centroids.get(best.id);
            const dr = cr ? haversineKm(coords, cr) : Infinity;
            const db = cb ? haversineKm(coords, cb) : Infinity;
            return dr < db ? r : best;
          }, regions[0]);
        } else {
          homeRegion =
            regions.find((r) => r.name_ko === "이태원" || r.name_en === "Itaewon") ?? regions[0];
        }

        // Region order: home first; then nearest others by home centroid when we
        // have coords, otherwise the original option order.
        const homeCentroid = centroids.get(homeRegion.id) ?? null;
        const others = regions.filter((r) => r.id !== homeRegion.id);
        if (coords && homeCentroid) {
          others.sort((a, b) => {
            const ca = centroids.get(a.id);
            const cb = centroids.get(b.id);
            const da = ca ? haversineKm(homeCentroid, ca) : Infinity;
            const db = cb ? haversineKm(homeCentroid, cb) : Infinity;
            return da - db;
          });
        }
        const ordered = [homeRegion, ...others];

        // Compose up to FEED_SIZE cards across regions × themes (fallback last).
        const level = levelRef.current;
        const themeList = [...THEMES, FALLBACK_THEME];
        const built: FeedCard[] = [];
        for (const region of ordered) {
          if (built.length >= FEED_SIZE) break;
          const origin = centroids.get(region.id) ?? ITAEWON;
          const filtered = filterForTheme(places, {
            regionId: region.id,
            budgetPerPerson: FEED_BUDGET,
            languageLevel: level,
          });
          for (const theme of themeList) {
            if (built.length >= FEED_SIZE) break;
            const course = composeThemedCourse(filtered, theme, {
              budgetPerPerson: FEED_BUDGET,
              origin,
            });
            if (!course) continue;
            built.push({
              course,
              theme,
              region,
              profile: {
                languageLevel: level,
                adventure: "safe",
                budgetPerPerson: FEED_BUDGET,
                radiusKm: 5,
                interests: [theme.id],
                duration: theme.slots.length <= 3 ? "half" : "full",
                origin,
              },
            });
          }
        }

        if (!alive) return;
        setCards(built);
        setHome(homeRegion);
        setLoading(false);
      } catch {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
    // Build once on mount; language toggling is handled purely at render time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Smooth-scroll the expanded panel into view after it renders.
  useEffect(() => {
    if (selected === null) return;
    const t = setTimeout(() => {
      expandedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => clearTimeout(t);
  }, [selected]);

  if (loading) {
    return (
      <div style={{ margin: "12px 16px 0" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 14px", marginBottom: 12,
          borderRadius: 14, background: "var(--content-bg)",
        }}>
          <div style={{
            width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
            border: "2.5px solid var(--border)", borderTopColor: "var(--grade-s)",
            animation: "ll-courses-spin 0.8s linear infinite",
          }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>
            {isKo ? "당신의 위치에서 코스를 찾고 있어요…" : "Finding courses near your location…"}
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton" style={{ height: 150, borderRadius: 14 }} />
          ))}
        </div>
        <style>{`@keyframes ll-courses-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (cards.length === 0) return null;

  const homeLabel = home ? (isKo ? home.name_ko : home.name_en) : "";
  const active = selected !== null ? cards[selected] : null;

  return (
    <div style={{ margin: "12px 16px 0" }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>
          {isKo ? "내 주변 추천 코스" : "Courses near you"}
        </div>
        {homeLabel && (
          <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>
            {isKo ? `${homeLabel} 기준` : `Based on ${homeLabel}`}
          </div>
        )}
      </div>

      {/* Card grid, rendered row by row so the expanded panel can slot in
          directly under the clicked card instead of at the bottom of the
          whole grid. */}
      {Array.from({ length: Math.ceil(cards.length / 2) }).map((_, row) => {
        const rowCards = cards.slice(row * 2, row * 2 + 2);
        const rowHasActive = selected !== null && Math.floor(selected / 2) === row;
        return (
          <div key={row} style={{ marginBottom: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {rowCards.map((card, ci) => {
                const i = row * 2 + ci;
                return (
                  <CardButton
                    key={`${card.region.id}-${card.theme.id}`}
                    card={card}
                    isKo={isKo}
                    active={selected === i}
                    onClick={() => setSelected(selected === i ? null : i)}
                  />
                );
              })}
            </div>

            {rowHasActive && active && (
              <div ref={expandedRef} style={{ marginTop: 10 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--foreground)" }}>
                      {isKo ? active.theme.name.ko : active.theme.name.en}
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--foreground-muted)" }}>
                      {isKo ? active.region.name_ko : active.region.name_en}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    aria-label={isKo ? "닫기" : "Close"}
                    style={{
                      flexShrink: 0, width: 30, height: 30, borderRadius: "50%",
                      background: "var(--content-bg)", border: "1px solid var(--border)",
                      color: "var(--foreground-muted)", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <CourseResultView
                  course={active.course}
                  profile={active.profile}
                  isKo={isKo}
                  note={isKo ? active.theme.tagline.ko : active.theme.tagline.en}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
