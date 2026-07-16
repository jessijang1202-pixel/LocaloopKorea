"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLang, setLang } from "@/lib/lang";
import { useTheme } from "@/lib/theme";
import dynamic from "next/dynamic";
import { SEED_PLACES, SEED_REGIONS } from "@/data/seed";
import type { Place } from "@/types";
import { getRating, okTags, GRADE_BG, GRADE_TEXT } from "@/lib/grades";
import Link from "next/link";
import { PlaceGridCard } from "@/components/places/PlaceGridCard";
import { HamburgerMenu } from "@/components/layout/HamburgerMenu";
import { LocationConsent } from "@/components/map/LocationConsent";
import { useLocationWithConsent } from "@/lib/geo-consent";
import { CAT_LABEL } from "@/content/places";
import { ITAEWON, INCHEON_AIRPORT, CHIPS, MORE_CHIPS, HOT_PLACE_IDS, type FilterKey } from "@/content/map";
import { TASK_MAP_CATEGORIES } from "@/content/task-map-categories";
import { TASK_NODES, type TaskId } from "@/lib/engine";
import { haversineKm } from "@/lib/course/geo";
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

// Task-filtered map — reached via "맵으로 이동" on a task card
// (/map?task=<id>). Filters livePlaces down to the categories that task
// actually needs (TASK_MAP_CATEGORIES), sorted by distance from the
// resolved location (Incheon Airport fallback — replaces Itaewon as the
// origin specifically for this flow; the browse mode below keeps its own
// Itaewon anchor unchanged). Same card/grade UI as the rest of /map.
function TaskFilteredView({
  taskId,
  isKo,
  isDark,
  livePlaces,
}: {
  taskId: TaskId;
  isKo: boolean;
  isDark: boolean;
  livePlaces: Place[];
}) {
  const { coords, showModal, allow, skip } = useLocationWithConsent();
  const origin = coords ?? INCHEON_AIRPORT;
  const categories = TASK_MAP_CATEGORIES[taskId];
  const taskNode = TASK_NODES[taskId];
  const taskName = taskNode ? (isKo ? taskNode.name.ko : taskNode.name.en) : "";

  const matches = livePlaces
    .filter((p) => categories?.includes(p.category) && p.lat != null && p.lng != null)
    .map((p) => ({ place: p, km: haversineKm(origin, { lat: p.lat as number, lng: p.lng as number }) }))
    .sort((a, b) => a.km - b.km);

  return (
    <div style={{ minHeight: "100dvh", background: "var(--background)" }}>
      <div style={{ padding: "16px 16px 14px", borderBottom: "1px solid var(--border)" }}>
        <Link href="/tasks" style={{ display: "inline-flex", alignItems: "center", gap: 5, textDecoration: "none", color: "var(--foreground-muted)", fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          {isKo ? "태스크로 돌아가기" : "Back to Tasks"}
        </Link>
        <div style={{ fontSize: 19, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
          {isKo ? `${taskName}에 필요한 장소` : `Places for ${taskName}`}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--foreground-muted)", marginTop: 4 }}>
          {isKo
            ? `${matches.length}곳 · ${coords ? "가까운 순" : "인천공항 기준"}`
            : `${matches.length} places · ${coords ? "nearest first" : "from Incheon Airport"}`}
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {matches.length === 0 ? (
          <div style={{ background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)", padding: "20px 16px", fontSize: 13, color: "var(--foreground-muted)", textAlign: "center" }}>
            {isKo ? "아직 이 지역에 수집된 장소가 없어요." : "No collected places here yet."}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {matches.map(({ place, km }) => (
              <PlaceGridCard key={place.id} place={place} isKo={isKo} metaLine={`${km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`}`} />
            ))}
          </div>
        )}
      </div>

      {showModal && <LocationConsent isDark={isDark} isKo={isKo} onAllow={allow} onSkip={skip} />}
    </div>
  );
}

// 지도위의 찾기 — small search modal: location / category / grade / name.
// Native <select>/<input> kept minimal (no custom dropdown component exists
// in this codebase yet); styled to match the card/scrim pattern used
// everywhere else on this page.
function SearchModal({
  isDark, isKo, regions,
  name, region, grade, category,
  onApply, onClose,
}: {
  isDark: boolean;
  isKo: boolean;
  regions: LiveRegion[];
  name: string;
  region: string | null;
  grade: string | null;
  category: FilterKey;
  onApply: (v: { name: string; region: string | null; grade: string | null; category: FilterKey }) => void;
  onClose: () => void;
}) {
  const [localName, setLocalName] = useState(name);
  const [localRegion, setLocalRegion] = useState(region);
  const [localGrade, setLocalGrade] = useState(grade);
  const [localCategory, setLocalCategory] = useState<FilterKey>(category);

  const cardBg = isDark ? "#1D1A22" : "#ffffff";
  const scrimBg = isDark ? "rgba(0,0,0,0.5)" : "rgba(10,8,6,0.42)";
  const fieldBg = isDark ? "#252129" : "var(--content-bg)";
  const textColor = isDark ? "#F4F0E8" : "#16151A";
  const labelColor = "var(--foreground-muted)";
  const allCategoryOptions = [...CHIPS, ...MORE_CHIPS].filter((c) => c.key !== "all" && c.key !== "english" && c.key !== "S");

  const selectStyle: React.CSSProperties = {
    width: "100%", height: 44, borderRadius: 12, border: "1px solid var(--border)",
    background: fieldBg, color: textColor, fontSize: 14, padding: "0 12px",
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9999, background: scrimBg, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 20px" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: cardBg, borderRadius: 24, width: "100%", maxWidth: 360, padding: "24px 22px", boxShadow: "0 20px 56px rgba(0,0,0,0.3)" }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: textColor, marginBottom: 18 }}>
          {isKo ? "장소 검색" : "Search Places"}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: labelColor, marginBottom: 5 }}>{isKo ? "지역" : "Area"}</div>
            <select value={localRegion ?? ""} onChange={(e) => setLocalRegion(e.target.value || null)} style={selectStyle}>
              <option value="">{isKo ? "전체 지역" : "All areas"}</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>{isKo ? r.name_ko : r.name_en}</option>
              ))}
            </select>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: labelColor, marginBottom: 5 }}>{isKo ? "카테고리" : "Category"}</div>
            <select value={localCategory} onChange={(e) => setLocalCategory(e.target.value as FilterKey)} style={selectStyle}>
              <option value="all">{isKo ? "전체 카테고리" : "All categories"}</option>
              {allCategoryOptions.map((c) => (
                <option key={c.key} value={c.key}>{isKo ? c.ko : c.en}</option>
              ))}
            </select>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: labelColor, marginBottom: 5 }}>{isKo ? "그레이드" : "Grade"}</div>
            <select value={localGrade ?? ""} onChange={(e) => setLocalGrade(e.target.value || null)} style={selectStyle}>
              <option value="">{isKo ? "전체 등급" : "All grades"}</option>
              {["S", "A", "B", "C"].map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: labelColor, marginBottom: 5 }}>{isKo ? "상호명" : "Shop name"}</div>
            <input
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder={isKo ? "이름으로 검색…" : "Search by name…"}
              style={selectStyle}
            />
          </div>
        </div>

        <button
          onClick={() => onApply({ name: localName, region: localRegion, grade: localGrade, category: localCategory })}
          style={{
            width: "100%", height: 48, borderRadius: 14, border: "none", cursor: "pointer",
            background: "var(--grade-s)", color: "#fff", fontSize: 15, fontWeight: 700,
          }}
        >
          {isKo ? "검색" : "Search"}
        </button>
      </div>
    </div>
  );
}

function MapPageInner() {
  const isKo = useLang();
  const theme = useTheme();
  const searchParams = useSearchParams();
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
  const [showMoreCats, setShowMoreCats] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [nameQuery, setNameQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [gradeFilter, setGradeFilter] = useState<string | null>(null);
  const dragStartY = useRef<number | null>(null);

  // 지도에서 찾기 (browse mode) location consent — same shared flag/hook as
  // the task-filtered view, so granting once anywhere never re-prompts.
  const { coords, showModal: showConsent, allow: allowLocation, skip: skipLocation } = useLocationWithConsent();

  useEffect(() => {
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

  const isDark = theme === "dark";

  // 맵으로 이동 (task-filtered mode) — bail out to the dedicated view before
  // building any of the browse-mode layout below. TASK_MAP_CATEGORIES lookup
  // doubles as validation: an unknown/no-mapping task id just falls through
  // to the normal browse map instead of an empty filtered screen.
  const taskParam = searchParams.get("task") as TaskId | null;
  const taskCategories = taskParam ? TASK_MAP_CATEGORIES[taskParam] : null;
  if (taskParam && taskCategories) {
    return <TaskFilteredView taskId={taskParam} isKo={isKo} isDark={isDark} livePlaces={livePlaces} />;
  }

  const hotIds = hotPlaceIds(livePlaces, liveSource);
  const hotPlaces = livePlaces.filter((p) => hotIds.includes(p.id));

  // Category chips (CHIPS ∪ MORE_CHIPS) match p.category directly by key —
  // only "all"/"english"/"S" need special handling.
  const CATEGORY_CHIP_KEYS = new Set([...CHIPS, ...MORE_CHIPS].map((c) => c.key));
  let filtered = livePlaces.filter((p) => {
    if (hotIds.includes(p.id)) return false; // shown in PICK strip above
    if (nameQuery && !p.name_ko.includes(nameQuery) && !p.name_en.toLowerCase().includes(nameQuery.toLowerCase())) return false;
    if (regionFilter && p.region_id !== regionFilter) return false;
    if (gradeFilter && getRating(p) !== gradeFilter) return false;
    if (chip === "all") return true;
    if (chip === "english") return p.english_support;
    if (chip === "S") return getRating(p) === "S";
    if (CATEGORY_CHIP_KEYS.has(chip)) return p.category === chip;
    return true;
  });

  // Once location is granted, "다른 지역 추천" sorts by actual distance from
  // the user instead of arbitrary DB order — "위치기반으로 모든 데이터가 다
  // 뜨도록" per the 지도에서 찾기 spec. Falls back to the existing order
  // (Itaewon-relative, via travelFromItaewon in otherMetaLine) when no coords.
  if (coords) {
    filtered = [...filtered].sort((a, b) => {
      if (a.lat == null || a.lng == null) return 1;
      if (b.lat == null || b.lng == null) return -1;
      const da = haversineKm(coords, { lat: a.lat, lng: a.lng });
      const db = haversineKm(coords, { lat: b.lat, lng: b.lng });
      return da - db;
    });
  }

  // Fixed 10-item previews; "view more" now navigates to the area pages.
  const hotVisible = hotPlaces.slice(0, 10);
  const otherVisible = filtered.slice(0, 10);
  const itaewonRegionSlug =
    liveRegions.find((r) => r.name_ko === "이태원")?.slug ?? "itaewon";

  const pins = livePlaces.filter((p) => p.lat && p.lng).map((p) => ({
    id: p.id, lat: p.lat!, lng: p.lng!, title: p.name_en, rating: getRating(p),
  }));

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

        {/* Row 2: Search — opens the 지도위의 찾기 modal (location/category/grade/name) */}
        <div style={{ pointerEvents: "auto" }}>
          <button
            onClick={() => setShowSearchModal(true)}
            style={{ width: "100%", background: chipBg, border: "none", cursor: "pointer", borderRadius: 16, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 12px rgba(0,0,0,0.12)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <span style={{ fontSize: 14, color: "var(--foreground-muted)" }}>{isKo ? "장소, 동네 검색…" : "Search places…"}</span>
          </button>
        </div>

        {/* Row 3: Filter chips + 더보기 */}
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
                {isKo ? c.ko : c.en}
              </button>
            );
          })}
          <button
            onClick={() => setShowMoreCats((v) => !v)}
            style={{
              flexShrink: 0, padding: "7px 13px", borderRadius: 999,
              background: showMoreCats ? "var(--grade-s)" : chipBg,
              color: showMoreCats ? "#fff" : chipFg,
              border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 500, boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {isKo ? "더보기" : "More"}
          </button>
        </div>

        {/* Row 3.5: More category chips */}
        {showMoreCats && (
          <div style={{ display: "flex", gap: 7, overflowX: "auto", scrollbarWidth: "none", pointerEvents: "auto", paddingRight: 4 }}>
            {MORE_CHIPS.map((c) => {
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
                  }}
                >
                  {isKo ? c.ko : c.en}
                </button>
              );
            })}
          </div>
        )}

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
            <button
              onClick={() => setShowSearchModal(true)}
              style={{ width: "100%", background: "var(--content-bg)", border: "none", cursor: "pointer", borderRadius: 12, padding: "9px 14px", display: "flex", alignItems: "center", gap: 8 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <span style={{ fontSize: 13, color: "var(--foreground-muted)" }}>{isKo ? "장소, 동네 검색…" : "Search places…"}</span>
            </button>
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
            <button onClick={() => setShowMoreCats((v) => !v)} style={{ flexShrink: 0, padding: "5px 12px", borderRadius: 999, border: showMoreCats ? "none" : "1px solid var(--border)", background: showMoreCats ? "var(--grade-s)" : "var(--content-bg)", color: showMoreCats ? "#fff" : "var(--foreground-muted)", fontSize: 12, fontWeight: 400, cursor: "pointer" }}>
              {isKo ? "더보기" : "More"}
            </button>
          </div>
          {showMoreCats && (
            <div style={{ display: "flex", gap: 7, padding: "0 14px 10px", overflowX: "auto", scrollbarWidth: "none" }}>
              {MORE_CHIPS.map((c) => {
                const active = chip === c.key;
                return (
                  <button key={c.key} onClick={() => setChip(c.key)} style={{ flexShrink: 0, padding: "5px 12px", borderRadius: 999, border: active ? "none" : "1px solid var(--border)", background: active ? "var(--grade-s)" : "var(--content-bg)", color: active ? "#fff" : "var(--foreground-muted)", fontSize: 12, fontWeight: active ? 700 : 400, cursor: "pointer" }}>
                    {isKo ? c.ko : c.en}
                  </button>
                );
              })}
            </div>
          )}
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
      {showConsent && <LocationConsent isDark={isDark} isKo={isKo} onAllow={allowLocation} onSkip={skipLocation} />}
      {showSearchModal && (
        <SearchModal
          isDark={isDark}
          isKo={isKo}
          regions={liveRegions}
          name={nameQuery}
          region={regionFilter}
          grade={gradeFilter}
          category={chip}
          onClose={() => setShowSearchModal(false)}
          onApply={(v) => {
            setNameQuery(v.name);
            setRegionFilter(v.region);
            setGradeFilter(v.grade);
            setChip(v.category);
            setShowSearchModal(false);
          }}
        />
      )}
    </>
  );
}

// useSearchParams requires a Suspense boundary in the App Router.
export default function MapPage() {
  return (
    <Suspense>
      <MapPageInner />
    </Suspense>
  );
}
