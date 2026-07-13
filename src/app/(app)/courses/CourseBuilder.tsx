"use client";

// Patent no.3 module 500 — user-facing course builder.
// Composes a half-day / full-day local-experience course from the engine in
// src/lib/course, using the patent-1 navigator profile for personalization.

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/lang";
import { useNavigatorProfile } from "@/lib/engine";
import {
  filterCandidates,
  composeCourse,
  THEMES,
  FALLBACK_THEME,
  filterForTheme,
  composeThemedCourse,
  centroidOf,
  type AdventureStyle,
  type CourseDuration,
  type CourseProfile,
  type ComposedCourse,
  type CandidatePlace,
  type CourseTheme,
} from "@/lib/course";
import {
  fetchCandidatePlacesWithFallback,
  fetchRegionOptions,
  type RegionOption,
} from "@/lib/course/db";
import { ITAEWON } from "@/content/map";
import { CourseResultView } from "./CourseResultView";

const BUDGETS = [10000, 30000, 50000, 100000];
const INTEREST_CHIPS: { key: string; ko: string; en: string }[] = [
  { key: "food",    ko: "음식", en: "Food" },
  { key: "cafe",    ko: "카페", en: "Cafe" },
  { key: "culture", ko: "문화", en: "Culture" },
  { key: "explore", ko: "탐색", en: "Explore" },
];

const LEVEL_LABEL: Record<string, { ko: string; en: string }> = {
  beginner:     { ko: "입문", en: "Beginner" },
  basic:        { ko: "기초", en: "Basic" },
  intermediate: { ko: "중급", en: "Intermediate" },
  advanced:     { ko: "고급", en: "Advanced" },
};

function Pill({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      flexShrink: 0, fontSize: 12, fontWeight: active ? 700 : 500,
      padding: "6px 14px", borderRadius: 999,
      background: active ? "var(--grade-s)" : "var(--card)",
      color: active ? "#fff" : "var(--foreground-muted)",
      border: active ? "1px solid var(--grade-s)" : "1px solid var(--border)",
      cursor: "pointer",
    }}>
      {label}
    </button>
  );
}

function ControlRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--foreground-muted)", marginBottom: 6, letterSpacing: "0.02em" }}>
        {label}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{children}</div>
    </div>
  );
}

export function CourseBuilder() {
  const isKo = useLang();
  const [profile, actions] = useNavigatorProfile();
  const [mounted, setMounted] = useState(false);

  const [duration, setDuration] = useState<CourseDuration>("half");
  const [adventure, setAdventure] = useState<AdventureStyle | null>(null);
  const [budget, setBudget] = useState<number | null>(null);
  const [interests, setInterests] = useState<string[]>([]);

  // Area + theme controls
  const [regionOptions, setRegionOptions] = useState<RegionOption[]>([]);
  const [regionId, setRegionId] = useState<string | null>(null);
  const [themeId, setThemeId] = useState<string | null>(null); // null = 자유 구성

  const [generating, setGenerating] = useState(false);
  const [course, setCourse] = useState<ComposedCourse | null>(null);
  const [attempted, setAttempted] = useState(false);
  const [usedProfile, setUsedProfile] = useState<CourseProfile | null>(null);
  // True when custom mode found nothing and the relaxed fallback kicked in.
  const [relaxed, setRelaxed] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Load region options once; default to the region named 이태원 if present.
  useEffect(() => {
    let alive = true;
    fetchRegionOptions().then((opts) => {
      if (!alive) return;
      setRegionOptions(opts);
      const itaewon = opts.find(
        (o) => o.name_ko === "이태원" || o.name_en === "Itaewon",
      );
      setRegionId((cur) => cur ?? (itaewon ?? opts[0])?.id ?? null);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!mounted) return null;

  const selectedTheme: CourseTheme | null =
    themeId != null ? (THEMES.find((t) => t.id === themeId) ?? null) : null;

  const effAdventure = adventure ?? profile.adventure ?? "safe";
  const effBudget = budget ?? profile.budgetPerPerson ?? 30000;
  const level = profile.koreanLevel;
  const levelLabel = level
    ? (isKo ? LEVEL_LABEL[level].ko : LEVEL_LABEL[level].en)
    : (isKo ? "기초 (기본값)" : "Basic (default)");

  const pickAdventure = (v: AdventureStyle) => { setAdventure(v); actions.save({ adventure: v }); };
  const pickBudget = (v: number) => { setBudget(v); actions.save({ budgetPerPerson: v }); };
  const toggleInterest = (k: string) =>
    setInterests((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]));

  const runGenerate = async (scrollToResult: boolean) => {
    setGenerating(true);
    try {
      const { places } = await fetchCandidatePlacesWithFallback();

      // Candidates within the selected region (region is always concrete here).
      const regionCandidates: CandidatePlace[] = places.filter(
        (p) => regionId == null || p.regionId === regionId,
      );
      // Origin = centroid of the region's candidates (fallback: Itaewon).
      const origin = centroidOf(regionCandidates) ?? ITAEWON;

      const themedCandidates = () =>
        filterForTheme(places, {
          regionId,
          budgetPerPerson: effBudget,
          languageLevel: level ?? "basic",
        });
      const synthProfile = (theme: CourseTheme): CourseProfile => ({
        languageLevel: level ?? "basic",
        adventure: "safe",
        budgetPerPerson: effBudget,
        radiusKm: 5,
        interests: [theme.id],
        duration: theme.slots.length <= 3 ? "half" : "full",
        origin,
      });

      if (selectedTheme) {
        // Themed path: looser quality gate + themed greedy composition.
        const composed = composeThemedCourse(themedCandidates(), selectedTheme, {
          budgetPerPerson: effBudget,
          origin,
        });
        setCourse(composed);
        setUsedProfile(synthProfile(selectedTheme));
        setRelaxed(false);
      } else {
        // 자유 구성 (custom): existing patent filter/compose, now region-scoped.
        const cp: CourseProfile = {
          languageLevel: level ?? "basic",
          adventure: effAdventure,
          budgetPerPerson: effBudget,
          radiusKm: profile.radiusKm ?? 10,
          interests,
          duration,
          origin,
        };
        const candidates = filterCandidates(regionCandidates, cp);
        const strict = composeCourse(candidates, cp);
        if (strict) {
          setCourse(strict);
          setUsedProfile(cp);
          setRelaxed(false);
        } else {
          // The patent gate (grade A + LI 70 + LS floor) is often too strict
          // for auto-collected regions — retry with the relaxed fallback mix
          // so first-time users always see a course, with a note.
          const fallback = composeThemedCourse(themedCandidates(), FALLBACK_THEME, {
            budgetPerPerson: effBudget,
            origin,
          });
          setCourse(fallback);
          setUsedProfile(fallback ? synthProfile(FALLBACK_THEME) : cp);
          setRelaxed(Boolean(fallback));
        }
      }

      setAttempted(true);
      if (scrollToResult) {
        // Result renders below the panel — on mobile it can be off-screen,
        // which reads as "nothing happened". Scroll after paint.
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      }
    } finally {
      setGenerating(false);
    }
  };

  const generate = () => runGenerate(true);

  return (
    <div style={{ margin: "12px 16px 0" }}>
      {/* Builder panel */}
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 18 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)" }}>
          {isKo ? "다른 추천코스 찾기" : "Find other courses"}
        </div>
        <div style={{ fontSize: 12, color: "var(--foreground-muted)", marginTop: 3, marginBottom: 14 }}>
          {isKo
            ? "지역과 조건을 골라 나만의 코스를 만들어 보세요"
            : "Pick an area and conditions to build your own course"}
        </div>

        <ControlRow label={isKo ? "지역" : "Area"}>
          <select
            value={regionId ?? ""}
            onChange={(e) => setRegionId(e.target.value || null)}
            style={{
              padding: "8px 12px", borderRadius: 10, fontSize: 13,
              background: "var(--content-bg)", border: "1px solid var(--border)",
              color: "var(--foreground)", outline: "none", minWidth: 180,
            }}
          >
            {regionOptions.length === 0 && (
              <option value="">{isKo ? "이태원" : "Itaewon"}</option>
            )}
            {regionOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {(isKo ? o.name_ko : o.name_en) + ` (${o.placeCount})`}
              </option>
            ))}
          </select>
        </ControlRow>

        <ControlRow label={isKo ? "테마" : "Theme"}>
          <Pill
            active={themeId === null}
            label={isKo ? "자유 구성" : "Custom"}
            onClick={() => setThemeId(null)}
          />
          {THEMES.map((t) => (
            <Pill
              key={t.id}
              active={themeId === t.id}
              label={isKo ? t.name.ko : t.name.en}
              onClick={() => setThemeId(t.id)}
            />
          ))}
        </ControlRow>

        {selectedTheme && (
          <div style={{ fontSize: 12, color: "var(--foreground-muted)", marginTop: -4, marginBottom: 12 }}>
            {isKo ? selectedTheme.tagline.ko : selectedTheme.tagline.en}
          </div>
        )}

        {!selectedTheme && (
          <>
            <ControlRow label={isKo ? "시간" : "Duration"}>
              <Pill active={duration === "half"} label={isKo ? "반나절" : "Half-day"} onClick={() => setDuration("half")} />
              <Pill active={duration === "full"} label={isKo ? "하루" : "Full day"} onClick={() => setDuration("full")} />
            </ControlRow>

            <ControlRow label={isKo ? "성향" : "Style"}>
              <Pill active={effAdventure === "safe"} label={isKo ? "안전 우선" : "Safe first"} onClick={() => pickAdventure("safe")} />
              <Pill active={effAdventure === "bold"} label={isKo ? "도전 선호" : "Bold local"} onClick={() => pickAdventure("bold")} />
            </ControlRow>
          </>
        )}

        <ControlRow label={isKo ? "1인 예산" : "Budget per person"}>
          {BUDGETS.map((b) => (
            <Pill key={b} active={effBudget === b}
              label={isKo ? `${b / 10000}만원` : `${(b / 1000).toLocaleString()}k`}
              onClick={() => pickBudget(b)} />
          ))}
        </ControlRow>

        {!selectedTheme && (
          <ControlRow label={isKo ? "관심 (선택 없음 = 전체)" : "Interests (none = all)"}>
            {INTEREST_CHIPS.map((c) => (
              <Pill key={c.key} active={interests.includes(c.key)}
                label={isKo ? c.ko : c.en} onClick={() => toggleInterest(c.key)} />
            ))}
          </ControlRow>
        )}

        <div style={{ fontSize: 12, color: "var(--foreground-muted)", marginBottom: 14 }}>
          {isKo ? "언어 수준: " : "Language level: "}{levelLabel}
        </div>

        <button onClick={generate} disabled={generating} style={{
          width: "100%", padding: "11px", borderRadius: 12, border: "none",
          background: "var(--grade-s)", color: "#fff", fontSize: 14, fontWeight: 700,
          cursor: generating ? "default" : "pointer", opacity: generating ? 0.7 : 1,
        }}>
          {generating ? (isKo ? "조합 중..." : "Composing...") : (isKo ? "코스 생성" : "Generate Course")}
        </button>
      </div>

      {/* Result */}
      <div ref={resultRef}>
      {attempted && !course && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 18, marginTop: 12, fontSize: 13, color: "var(--foreground-muted)", textAlign: "center" }}>
          {isKo
            ? "이 지역에서 조건에 맞는 코스를 만들 수 없습니다. 예산을 올리거나 다른 지역·테마를 골라 보세요."
            : "No course fits these conditions in this area. Try a higher budget or another area or theme."}
        </div>
      )}

      {course && usedProfile && (
        <div style={{ marginTop: 12 }}>
          <CourseResultView
            course={course}
            profile={usedProfile}
            isKo={isKo}
            note={
              relaxed
                ? isKo
                  ? "설정 조건이 엄격해 이 지역의 평가 좋은 곳들로 기본 코스를 구성했어요"
                  : "Strict settings had no match - composed from this area's best-rated spots instead"
                : null
            }
          />
          <button onClick={generate} disabled={generating} style={{
            marginTop: 12, padding: "8px 16px", borderRadius: 10,
            background: "var(--card)", border: "1px solid var(--border)",
            color: "var(--foreground-muted)", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
          }}>
            {isKo ? "다시 조합" : "Regenerate"}
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
