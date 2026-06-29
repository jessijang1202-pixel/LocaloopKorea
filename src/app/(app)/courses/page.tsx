"use client";

import { useState } from "react";
import { useLang } from "@/lib/lang";
import { PageHeader } from "@/components/layout/PageHeader";

const FILTERS = {
  en: ["AI Pick", "Half-Day", "Full Day", "Food", "Culture", "Nature"],
  ko: ["AI 추천", "반나절", "하루", "음식 중심", "문화", "자연"],
};

const COURSES = [
  {
    id: "c1",
    emoji: "🍔",
    badge: { en: "AI Match", ko: "AI 맞춤" },
    badgeColor: { bg: "#D6F5F5", color: "#0B7A82" },
    name: { en: "Itaewon Local Food Half-Day", ko: "이태원 로컬 맛집 반나절 코스" },
    meta: { en: "3 spots · ~3 hrs · Budget ₩30,000", ko: "3곳 · 약 3시간 · 예산 3만원" },
    stops: { en: ["Burger Bar S", "Hidden Café A", "Night Market"], ko: ["버거집 S", "숨겨진 카페 A", "야시장"] },
    score: 92,
    filter: "Half-Day",
  },
  {
    id: "c2",
    emoji: "🎨",
    badge: { en: "Cultural", ko: "문화" },
    badgeColor: { bg: "#E8F4FF", color: "#1565C0" },
    name: { en: "Hannam Gallery & Café Tour", ko: "한남동 갤러리 & 카페 투어" },
    meta: { en: "4 spots · ~4 hrs · Budget ₩20,000", ko: "4곳 · 약 4시간 · 예산 2만원" },
    stops: { en: ["Gallery B", "Bookshop Café", "Design Shop", "Vegan Rest."], ko: ["갤러리 B", "북카페", "디자인 숍", "비건 레스토랑"] },
    score: 88,
    filter: "Culture",
  },
  {
    id: "c3",
    emoji: "🌙",
    badge: { en: "Nightlife", ko: "나이트" },
    badgeColor: { bg: "#EDE7F6", color: "#4527A0" },
    name: { en: "Itaewon Night Local Tour", ko: "이태원 나이트 로컬 투어" },
    meta: { en: "3 spots · ~4 hrs · Budget ₩50,000", ko: "3곳 · 약 4시간 · 예산 5만원" },
    stops: { en: ["Club S", "Rooftop Bar A", "Food Truck"], ko: ["클럽 S", "루프탑 바 A", "포장마차"] },
    score: 85,
    filter: "Full Day",
  },
  {
    id: "c4",
    emoji: "🏔️",
    badge: { en: "Nature", ko: "자연" },
    badgeColor: { bg: "#E8F5E9", color: "#2E7D32" },
    name: { en: "Namsan Mountain Morning Walk", ko: "남산 아침 산책 코스" },
    meta: { en: "2 spots · ~2 hrs · Budget ₩5,000", ko: "2곳 · 약 2시간 · 예산 5천원" },
    stops: { en: ["Namsan Tower", "Traditional Tea House"], ko: ["남산 타워", "전통 찻집"] },
    score: 90,
    filter: "Nature",
  },
];

const T = {
  ko: {
    title: "로컬 코스",
    localScore: "로컬 점수",
    stops: "경유지",
    start: "코스 시작",
    noResults: "해당 코스가 없어요",
  },
  en: {
    title: "Local Courses",
    localScore: "Local Score",
    stops: "Stops",
    start: "Start Course",
    noResults: "No courses found",
  },
};

export default function CoursesPage() {
  const isKo = useLang();
  const [activeFilter, setActiveFilter] = useState(0);

  const t = isKo ? T.ko : T.en;
  const filters = isKo ? FILTERS.ko : FILTERS.en;

  const filtered = activeFilter === 0
    ? COURSES
    : COURSES.filter((c) => {
        const fEn = FILTERS.en[activeFilter];
        if (fEn === "AI Pick") return c.badge.en === "AI Match";
        if (fEn === "Half-Day") return c.filter === "Half-Day";
        if (fEn === "Full Day") return c.filter === "Full Day";
        if (fEn === "Food") return c.emoji === "🍔";
        if (fEn === "Culture") return c.filter === "Culture";
        if (fEn === "Nature") return c.filter === "Nature";
        return true;
      });

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      {/* Header */}
      <PageHeader
        right={
          <button
            onClick={() => setActiveFilter(0)}
            style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, padding: "5px 9px", color: "#fff", fontSize: 13, cursor: "pointer" }}
          >
            🔄
          </button>
        }
      />

      {/* Filter chips */}
      <div className="scroll-x" style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", padding: "10px 16px", display: "flex", gap: 8, flexShrink: 0 }}>
        {filters.map((label, i) => {
          const active = activeFilter === i;
          return (
            <button
              key={label}
              onClick={() => setActiveFilter(i)}
              style={{
                flexShrink: 0,
                padding: "5px 14px",
                borderRadius: 20,
                border: active ? "none" : "1px solid var(--border)",
                background: active ? "#15b6c1" : "var(--content-bg)",
                color: active ? "#fff" : "var(--muted-foreground)",
                fontSize: 12,
                fontWeight: active ? 700 : 400,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Course list */}
      <div style={{ flex: 1, overflowY: "auto", background: "var(--content-bg)", padding: "12px 14px 0" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--muted-foreground)", fontSize: 13 }}>
            {t.noResults}
          </div>
        )}
        {filtered.map((course) => {
          const name = isKo ? course.name.ko : course.name.en;
          const meta = isKo ? course.meta.ko : course.meta.en;
          const stops = isKo ? course.stops.ko : course.stops.en;
          const badge = isKo ? course.badge.ko : course.badge.en;
          return (
            <div
              key={course.id}
              style={{
                background: "var(--card)",
                borderRadius: 16,
                border: "1px solid var(--border)",
                marginBottom: 12,
                overflow: "hidden",
                boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
              }}
            >
              {/* Thumb */}
              <div style={{
                height: 80,
                background: `linear-gradient(135deg, ${course.badgeColor.bg}, #fff)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
              }}>
                {course.emoji}
              </div>

              {/* Body */}
              <div style={{ padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    padding: "2px 8px", borderRadius: 6,
                    background: course.badgeColor.bg, color: course.badgeColor.color,
                  }}>
                    {badge}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    padding: "2px 8px", borderRadius: 6,
                    background: "#FFF9C4", color: "#A56000",
                  }}>
                    {t.localScore} {course.score}
                  </span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", marginBottom: 3 }}>{name}</p>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 8 }}>{meta}</p>

                {/* Stops */}
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 10, color: "var(--muted-foreground)", fontWeight: 600 }}>{t.stops}:</span>
                  {stops.map((stop, i) => (
                    <span key={i} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <span style={{ fontSize: 10, color: "var(--foreground)", fontWeight: 600, background: "var(--content-bg)", padding: "2px 6px", borderRadius: 4 }}>
                        {stop}
                      </span>
                      {i < stops.length - 1 && <span style={{ fontSize: 9, color: "#9BB5B8" }}>→</span>}
                    </span>
                  ))}
                </div>

                <button style={{
                  width: "100%", height: 36, borderRadius: 10, border: "none",
                  background: "linear-gradient(135deg, #15b6c1, #0B8A91)",
                  color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
                }}>
                  {t.start}
                </button>
              </div>
            </div>
          );
        })}
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}
