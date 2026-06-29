"use client";

import { useState } from "react";
import { useLang } from "@/lib/lang";

const FILTERS = {
  en: ["AI Pick", "Half-Day", "Full Day", "Food", "Culture", "Nature"],
  ko: ["AI 추천", "반나절", "하루", "음식 중심", "문화", "자연"],
};

const COURSES = [
  {
    id: "c1", category: "food",
    badge: { en: "AI Match", ko: "AI 맞춤" }, badgeColor: { bg: "#D6F5F5", color: "#0B7A82" },
    name: { en: "Itaewon Local Food Half-Day", ko: "이태원 로컬 맛집 반나절 코스" },
    meta: { en: "3 spots · ~3 hrs · Budget ₩30,000", ko: "3곳 · 약 3시간 · 예산 3만원" },
    stops: { en: ["Burger Bar S", "Hidden Café A", "Night Market"], ko: ["버거집 S", "숨겨진 카페 A", "야시장"] },
    stopDesc: { en: ["Famous smash burger — English menu, card OK", "Specialty coffee, quiet work space", "Open-air food stalls, cash preferred"], ko: ["유명 스매시버거 - 영어 메뉴, 카드 OK", "스페셜티 커피, 조용한 작업 공간", "야외 포장마차, 현금 선호"] },
    score: 92, filter: "Half-Day",
    desc: { en: "A curated half-day route through Itaewon's best local dining spots — hand-picked for English-friendly service and authentic flavors.", ko: "영어 서비스와 정통 맛을 모두 갖춘 이태원 로컬 다이닝 반나절 코스입니다." },
    gradient: "linear-gradient(135deg, #D6F5F5, #E8F4FF)",
  },
  {
    id: "c2", category: "culture",
    badge: { en: "Cultural", ko: "문화" }, badgeColor: { bg: "#E8F4FF", color: "#1565C0" },
    name: { en: "Hannam Gallery & Café Tour", ko: "한남동 갤러리 & 카페 투어" },
    meta: { en: "4 spots · ~4 hrs · Budget ₩20,000", ko: "4곳 · 약 4시간 · 예산 2만원" },
    stops: { en: ["Gallery B", "Bookshop Café", "Design Shop", "Vegan Rest."], ko: ["갤러리 B", "북카페", "디자인 숍", "비건 레스토랑"] },
    stopDesc: { en: ["Contemporary art gallery, free entry", "Books + coffee, perfect afternoon spot", "Korean design goods, great souvenirs", "Plant-based Korean fusion cuisine"], ko: ["현대 미술 갤러리, 무료 입장", "책 + 커피, 완벽한 오후 장소", "한국 디자인 굿즈, 기념품으로 최적", "비건 한국 퓨전 요리"] },
    score: 88, filter: "Culture",
    desc: { en: "Explore Hannam-dong's vibrant art and café scene — from independent galleries to design boutiques.", ko: "한남동의 생동감 넘치는 예술·카페 씬을 탐험하세요." },
    gradient: "linear-gradient(135deg, #E8F4FF, #EDE7F6)",
  },
  {
    id: "c3", category: "nightlife",
    badge: { en: "Nightlife", ko: "나이트" }, badgeColor: { bg: "#EDE7F6", color: "#4527A0" },
    name: { en: "Itaewon Night Local Tour", ko: "이태원 나이트 로컬 투어" },
    meta: { en: "3 spots · ~4 hrs · Budget ₩50,000", ko: "3곳 · 약 4시간 · 예산 5만원" },
    stops: { en: ["Club S", "Rooftop Bar A", "Food Truck"], ko: ["클럽 S", "루프탑 바 A", "포장마차"] },
    stopDesc: { en: ["Underground club, international DJs on weekends", "360° Seoul skyline views, craft cocktails", "Late-night tteokbokki and street snacks"], ko: ["언더그라운드 클럽, 주말 국제 DJ", "서울 스카이라인 전망, 크래프트 칵테일", "야간 떡볶이와 길거리 간식"] },
    score: 85, filter: "Full Day",
    desc: { en: "Experience Itaewon's legendary nightlife scene with a curated route through the best clubs, bars, and late-night bites.", ko: "이태원의 전설적인 나이트라이프를 클럽, 바, 야식 코스로 경험하세요." },
    gradient: "linear-gradient(135deg, #EDE7F6, #0B1E2D)",
  },
  {
    id: "c4", category: "nature",
    badge: { en: "Nature", ko: "자연" }, badgeColor: { bg: "#E8F5E9", color: "#2E7D32" },
    name: { en: "Namsan Mountain Morning Walk", ko: "남산 아침 산책 코스" },
    meta: { en: "2 spots · ~2 hrs · Budget ₩5,000", ko: "2곳 · 약 2시간 · 예산 5천원" },
    stops: { en: ["Namsan Tower", "Traditional Tea House"], ko: ["남산 타워", "전통 찻집"] },
    stopDesc: { en: ["Iconic Seoul tower, best views in the morning", "Quiet traditional tea ceremony experience"], ko: ["서울 랜드마크, 아침에 가장 좋은 전망", "조용한 전통 다도 체험"] },
    score: 90, filter: "Nature",
    desc: { en: "Start your morning with a peaceful walk up Namsan, ending with a traditional tea ceremony and panoramic city views.", ko: "남산을 걸으며 아침을 시작하고 전통 다도와 도시 전경으로 마무리합니다." },
    gradient: "linear-gradient(135deg, #E8F5E9, #F0FFF0)",
  },
];

const T = {
  ko: { localScore: "로컬 점수", stops: "경유지", start: "코스 시작", noResults: "해당 코스가 없어요", about: "코스 소개", route: "이동 경로", searchPh: "코스 검색..." },
  en: { localScore: "Local Score", stops: "Stops", start: "Start Course", noResults: "No courses found", about: "About this course", route: "Route", searchPh: "Search courses..." },
};

export default function CoursesPage() {
  const isKo = useLang();
  const [activeFilter, setActiveFilter] = useState(0);
  const [selectedId, setSelectedId] = useState("c1");
  const [search, setSearch] = useState("");

  const t = isKo ? T.ko : T.en;
  const filters = isKo ? FILTERS.ko : FILTERS.en;

  const byFilter = activeFilter === 0
    ? COURSES
    : COURSES.filter((c) => {
        const fEn = FILTERS.en[activeFilter];
        if (fEn === "AI Pick") return c.badge.en === "AI Match";
        if (fEn === "Half-Day") return c.filter === "Half-Day";
        if (fEn === "Full Day") return c.filter === "Full Day";
        if (fEn === "Food") return c.category === "food";
        if (fEn === "Culture") return c.filter === "Culture";
        if (fEn === "Nature") return c.filter === "Nature";
        return true;
      });

  const filtered = byFilter.filter((c) => {
    if (!search) return true;
    const name = isKo ? c.name.ko : c.name.en;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const selectedCourse = COURSES.find((c) => c.id === selectedId) ?? COURSES[0];

  const searchInput = (
    <div style={{ background: "var(--content-bg)", borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 7 }}>
      <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>검색</span>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t.searchPh}
        style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 12, color: "var(--foreground)" }}
      />
      {search && (
        <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "var(--muted-foreground)", cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1 }}>✕</button>
      )}
    </div>
  );

  const chipRow = (
    <div className="scroll-x" style={{ padding: "0 12px 10px", display: "flex", gap: 8, alignItems: "center" }}>
      {filters.map((label, i) => {
        const active = activeFilter === i;
        return (
          <button key={label} onClick={() => setActiveFilter(i)} style={{ flexShrink: 0, padding: "5px 14px", borderRadius: 20, border: active ? "none" : "1px solid var(--border)", background: active ? "#15b6c1" : "var(--content-bg)", color: active ? "#fff" : "var(--muted-foreground)", fontSize: 12, fontWeight: active ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap" }}>
            {label}
          </button>
        );
      })}
      <button onClick={() => setActiveFilter(0)} style={{ flexShrink: 0, padding: "5px 10px", borderRadius: 20, border: "1px solid var(--border)", background: "var(--content-bg)", color: "var(--muted-foreground)", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{isKo ? "초기화" : "Reset"}</button>
    </div>
  );

  const courseCard = (course: typeof COURSES[0], compact = false) => {
    const name = isKo ? course.name.ko : course.name.en;
    const meta = isKo ? course.meta.ko : course.meta.en;
    const stops = isKo ? course.stops.ko : course.stops.en;
    const badge = isKo ? course.badge.ko : course.badge.en;
    const isSelected = course.id === selectedId;
    if (compact) {
      return (
        <div key={course.id} onClick={() => setSelectedId(course.id)} style={{ background: isSelected ? "var(--card-selected)" : "var(--card)", borderRadius: 14, border: isSelected ? "1.5px solid #15b6c1" : "1px solid var(--border)", marginBottom: 10, overflow: "hidden", boxShadow: "0 1px 5px rgba(0,0,0,0.05)", cursor: "pointer" }}>
          <div style={{ height: 56, background: course.gradient }} />
          <div style={{ padding: "10px 12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 5, background: course.badgeColor.bg, color: course.badgeColor.color }}>{badge}</span>
              <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 5, background: "#FFF9C4", color: "#A56000" }}>{t.localScore} {course.score}</span>
            </div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)", marginBottom: 2 }}>{name}</p>
            <p style={{ fontSize: 10, color: "var(--muted-foreground)" }}>{meta}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 6, flexWrap: "wrap" }}>
              {stops.map((stop, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <span style={{ fontSize: 9, color: "var(--foreground)", fontWeight: 600, background: "var(--content-bg)", padding: "1px 5px", borderRadius: 3 }}>{stop}</span>
                  {i < stops.length - 1 && <span style={{ fontSize: 8, color: "#9BB5B8" }}>→</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div key={course.id} style={{ background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)", marginBottom: 12, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <div style={{ height: 80, background: course.gradient }} />
        <div style={{ padding: "12px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: course.badgeColor.bg, color: course.badgeColor.color }}>{badge}</span>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: "#FFF9C4", color: "#A56000" }}>{t.localScore} {course.score}</span>
          </div>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", marginBottom: 3 }}>{name}</p>
          <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 8 }}>{meta}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, color: "var(--muted-foreground)", fontWeight: 600 }}>{t.stops}:</span>
            {stops.map((stop, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <span style={{ fontSize: 10, color: "var(--foreground)", fontWeight: 600, background: "var(--content-bg)", padding: "2px 6px", borderRadius: 4 }}>{stop}</span>
                {i < stops.length - 1 && <span style={{ fontSize: 9, color: "#9BB5B8" }}>→</span>}
              </span>
            ))}
          </div>
          <button style={{ width: "100%", height: 36, borderRadius: 10, border: "none", background: "linear-gradient(135deg, #15b6c1, #0B8A91)", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{t.start}</button>
        </div>
      </div>
    );
  };

  const courseDetail = () => {
    const name = isKo ? selectedCourse.name.ko : selectedCourse.name.en;
    const meta = isKo ? selectedCourse.meta.ko : selectedCourse.meta.en;
    const stops = isKo ? selectedCourse.stops.ko : selectedCourse.stops.en;
    const stopDesc = isKo ? selectedCourse.stopDesc.ko : selectedCourse.stopDesc.en;
    const badge = isKo ? selectedCourse.badge.ko : selectedCourse.badge.en;
    const desc = isKo ? selectedCourse.desc.ko : selectedCourse.desc.en;
    const metaParts = meta.split(" · ");
    return (
      <div style={{ height: "100%", overflowY: "auto", background: "var(--content-bg)" }}>
        <div style={{ height: 160, background: selectedCourse.gradient, position: "relative" }}>
          <div style={{ position: "absolute", bottom: 16, left: 24, display: "flex", gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: selectedCourse.badgeColor.bg, color: selectedCourse.badgeColor.color }}>{badge}</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: "#FFF9C4", color: "#A56000" }}>{t.localScore} {selectedCourse.score}</span>
          </div>
        </div>
        <div style={{ padding: "24px 32px 40px" }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "var(--foreground)", marginBottom: 6 }}>{name}</h2>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            {metaParts.map((m, i) => (
              <span key={i} style={{ fontSize: 12, color: "var(--muted-foreground)", background: "var(--card)", border: "1px solid var(--border)", padding: "4px 10px", borderRadius: 20 }}>{m}</span>
            ))}
          </div>
          <div style={{ background: "var(--card)", borderRadius: 14, padding: "16px 18px", border: "1px solid var(--border)", marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#15b6c1", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.about}</div>
            <p style={{ fontSize: 13, color: "var(--foreground)", lineHeight: 1.7 }}>{desc}</p>
          </div>
          <div style={{ background: "var(--card)", borderRadius: 14, padding: "16px 18px", border: "1px solid var(--border)", marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#15b6c1", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.route}</div>
            {stops.map((stop, i) => (
              <div key={i}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#15b6c1", color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                    {i < stops.length - 1 && <div style={{ width: 2, height: 28, background: "var(--border)", margin: "2px 0" }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)", marginBottom: 2 }}>{stop}</p>
                    <p style={{ fontSize: 11, color: "var(--muted-foreground)", lineHeight: 1.4, marginBottom: i < stops.length - 1 ? 14 : 0 }}>{stopDesc[i]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button style={{ width: "100%", padding: "15px 0", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #15b6c1, #0B8A91)", color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 20px rgba(21,182,193,0.35)" }}>
            🏃 {t.start}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ── Mobile layout ── */}
      <div className="ll-mobile-only" style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
        <div style={{ padding: "8px 14px 6px", background: "var(--card)", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          {searchInput}
        </div>
        <div className="scroll-x" style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", padding: "8px 14px", display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
          {filters.map((label, i) => {
            const active = activeFilter === i;
            return <button key={label} onClick={() => setActiveFilter(i)} style={{ flexShrink: 0, padding: "5px 14px", borderRadius: 20, border: active ? "none" : "1px solid var(--border)", background: active ? "#15b6c1" : "var(--content-bg)", color: active ? "#fff" : "var(--muted-foreground)", fontSize: 12, fontWeight: active ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap" }}>{label}</button>;
          })}
          <button onClick={() => setActiveFilter(0)} style={{ flexShrink: 0, padding: "5px 10px", borderRadius: 20, border: "1px solid var(--border)", background: "var(--content-bg)", color: "var(--muted-foreground)", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{isKo ? "초기화" : "Reset"}</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", background: "var(--content-bg)", padding: "12px 14px 0" }}>
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: "var(--muted-foreground)", fontSize: 13 }}>{t.noResults}</div>}
          {filtered.map((course) => courseCard(course))}
          <div style={{ height: 16 }} />
        </div>
      </div>

      {/* ── PC split layout ── */}
      <div className="ll-pc-only ll-split">
        <div className="ll-split-panel">
          <div className="ll-split-panel-sticky">
            <div style={{ padding: "10px 12px 6px" }}>{searchInput}</div>
            {chipRow}
          </div>
          <div style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "8px 12px 0", background: "var(--content-bg)" }}>
            {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: "var(--muted-foreground)", fontSize: 13 }}>{t.noResults}</div>}
            {filtered.map((course) => courseCard(course, true))}
            <div style={{ height: 12 }} />
          </div>
        </div>
        <div className="ll-split-main">
          {courseDetail()}
        </div>
      </div>
    </>
  );
}
