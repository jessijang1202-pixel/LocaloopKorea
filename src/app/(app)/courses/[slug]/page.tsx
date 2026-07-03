"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/lib/lang";

type Stop = {
  name: { ko: string; en: string };
  type: { ko: string; en: string };
  duration: { ko: string; en: string };
  tip: { ko: string; en: string };
  placeSlug?: string;
};

type CourseDetail = {
  slug: string;
  name: { ko: string; en: string };
  tagline: { ko: string; en: string };
  meta: { ko: string; en: string };
  duration: { ko: string; en: string };
  difficulty: { ko: string; en: string };
  badge: { ko: string; en: string };
  color: string;
  accent: string;
  englishOk: boolean;
  stops: Stop[];
};

const COURSE_DATA: Record<string, CourseDetail> = {
  "itaewon-food": {
    slug: "itaewon-food",
    name: { ko: "이태원 로컬 맛집 반나절 코스", en: "Itaewon Local Food Half-Day" },
    tagline: { ko: "현지인만 아는 이태원 숨은 맛집 3곳", en: "3 hidden gems only locals know in Itaewon" },
    meta: { ko: "3곳 · 약 3시간", en: "3 stops · ~3 hrs" },
    duration: { ko: "3시간", en: "3 hours" },
    difficulty: { ko: "쉬움", en: "Easy" },
    badge: { ko: "오늘의 코스", en: "Today's Pick" },
    color: "#F5D6D6", accent: "#C0350F",
    englishOk: true,
    stops: [
      { name: { ko: "앤트러사이트 홍대", en: "Anthracite Hongdae" }, type: { ko: "카페", en: "Café" }, duration: { ko: "40분", en: "40 min" }, tip: { ko: "공장을 개조한 감성 카페. 에스프레소 추천!", en: "Factory-converted café. Try the espresso!" }, placeSlug: "anthracite-hongdae" },
      { name: { ko: "광장시장", en: "Gwangjang Market" }, type: { ko: "시장", en: "Market" }, duration: { ko: "60분", en: "60 min" }, tip: { ko: "빈대떡과 마약 김밥을 꼭 드세요", en: "Don't miss the bindaetteok and mayak kimbap" }, placeSlug: "gwangjang-market" },
      { name: { ko: "더 현대 서울", en: "The Hyundai Seoul" }, type: { ko: "쇼핑", en: "Shopping" }, duration: { ko: "60분", en: "60 min" }, tip: { ko: "지하 식품관 꼭 들러보세요", en: "The B1 food hall is a must-visit" }, placeSlug: "the-hyundai-seoul" },
    ],
  },
  "hannam-gallery": {
    slug: "hannam-gallery",
    name: { ko: "한남동 갤러리 & 카페 투어", en: "Hannam Gallery & Café Tour" },
    tagline: { ko: "예술과 커피를 함께 즐기는 한남동 오후", en: "An artsy afternoon in Hannam-dong" },
    meta: { ko: "4곳 · 약 4시간", en: "4 stops · ~4 hrs" },
    duration: { ko: "4시간", en: "4 hours" },
    difficulty: { ko: "쉬움", en: "Easy" },
    badge: { ko: "문화", en: "Culture" },
    color: "#DDE4FF", accent: "#234BFF",
    englishOk: true,
    stops: [
      { name: { ko: "성수연방", en: "Seongsu Yeonbang" }, type: { ko: "복합공간", en: "Cultural Space" }, duration: { ko: "60분", en: "60 min" }, tip: { ko: "다양한 편집숍과 갤러리가 모여있어요", en: "A curated mix of boutiques and galleries" }, placeSlug: "seongsu-yeonbang" },
      { name: { ko: "갤러리 산책", en: "Gallery Walk" }, type: { ko: "갤러리", en: "Gallery" }, duration: { ko: "60분", en: "60 min" }, tip: { ko: "한남동 골목의 소규모 갤러리들을 둘러보세요", en: "Explore the small galleries in Hannam alleys" } },
      { name: { ko: "카페 브런치", en: "Café Brunch" }, type: { ko: "카페", en: "Café" }, duration: { ko: "60분", en: "60 min" }, tip: { ko: "한남동에는 감각적인 카페가 많아요", en: "Hannam has some of Seoul's most stylish cafés" } },
      { name: { ko: "이태원 쇼핑", en: "Itaewon Shopping" }, type: { ko: "쇼핑", en: "Shopping" }, duration: { ko: "60분", en: "60 min" }, tip: { ko: "개성 넘치는 빈티지숍들이 많아요", en: "Lots of unique vintage and independent shops" } },
    ],
  },
  "itaewon-night": {
    slug: "itaewon-night",
    name: { ko: "이태원 나이트 로컬 투어", en: "Itaewon Night Local Tour" },
    tagline: { ko: "이태원의 밤을 제대로 즐기는 법", en: "How to experience Itaewon after dark" },
    meta: { ko: "3곳 · 약 4시간", en: "3 stops · ~4 hrs" },
    duration: { ko: "4시간", en: "4 hours" },
    difficulty: { ko: "보통", en: "Moderate" },
    badge: { ko: "나이트", en: "Nightlife" },
    color: "#2D1F4A", accent: "#8A63FF",
    englishOk: false,
    stops: [
      { name: { ko: "이태원 한식당", en: "Korean Dinner in Itaewon" }, type: { ko: "식당", en: "Restaurant" }, duration: { ko: "90분", en: "90 min" }, tip: { ko: "삼겹살과 소주로 저녁을 시작하세요", en: "Start the evening with samgyeopsal and soju" } },
      { name: { ko: "루프탑 바", en: "Rooftop Bar" }, type: { ko: "바", en: "Bar" }, duration: { ko: "60분", en: "60 min" }, tip: { ko: "서울 야경이 보이는 루프탑을 선택하세요", en: "Pick a rooftop with Seoul skyline views" } },
      { name: { ko: "이태원 클럽 거리", en: "Itaewon Club Street" }, type: { ko: "나이트라이프", en: "Nightlife" }, duration: { ko: "90분+", en: "90 min+" }, tip: { ko: "다양한 국적의 사람들과 자유롭게 어울릴 수 있어요", en: "A truly international crowd — very welcoming" } },
    ],
  },
  "namsan-morning": {
    slug: "namsan-morning",
    name: { ko: "남산 아침 산책 코스", en: "Namsan Morning Walk" },
    tagline: { ko: "서울 전경을 보며 시작하는 하루", en: "Start your day with Seoul's best view" },
    meta: { ko: "2곳 · 약 2시간", en: "2 stops · ~2 hrs" },
    duration: { ko: "2시간", en: "2 hours" },
    difficulty: { ko: "쉬움", en: "Easy" },
    badge: { ko: "자연", en: "Nature" },
    color: "#D6F0D6", accent: "#12A05A",
    englishOk: true,
    stops: [
      { name: { ko: "남산 서울타워", en: "N Seoul Tower" }, type: { ko: "명소", en: "Landmark" }, duration: { ko: "60분", en: "60 min" }, tip: { ko: "아침 일찍 가면 사람이 적어요. 자물쇠 다리도 보세요", en: "Go early to avoid crowds. See the love lock bridge" } },
      { name: { ko: "남산 산책로", en: "Namsan Trail" }, type: { ko: "자연", en: "Nature" }, duration: { ko: "60분", en: "60 min" }, tip: { ko: "케이블카 대신 걸어 올라가면 더 좋아요", en: "Walking up beats the cable car for the experience" } },
    ],
  },
  "seongsu-craft": {
    slug: "seongsu-craft",
    name: { ko: "성수 공방 & 로스터리 투어", en: "Seongsu Craft & Roastery Tour" },
    tagline: { ko: "힙한 성수동의 커피와 공방 탐방", en: "Explore Seongsu's craft workshops and coffee" },
    meta: { ko: "4곳 · 약 3시간", en: "4 stops · ~3 hrs" },
    duration: { ko: "3시간", en: "3 hours" },
    difficulty: { ko: "쉬움", en: "Easy" },
    badge: { ko: "AI 추천", en: "AI Pick" },
    color: "#FFF0D6", accent: "#B87000",
    englishOk: true,
    stops: [
      { name: { ko: "성수연방", en: "Seongsu Yeonbang" }, type: { ko: "복합공간", en: "Cultural Space" }, duration: { ko: "45분", en: "45 min" }, tip: { ko: "성수동 힙스터 문화의 중심지", en: "The heart of Seongsu's hipster culture" }, placeSlug: "seongsu-yeonbang" },
      { name: { ko: "로스터리 카페", en: "Specialty Roastery" }, type: { ko: "카페", en: "Café" }, duration: { ko: "45분", en: "45 min" }, tip: { ko: "스페셜티 커피 한 잔은 필수", en: "A specialty coffee is non-negotiable here" } },
      { name: { ko: "가죽 공방", en: "Leather Workshop" }, type: { ko: "공방", en: "Workshop" }, duration: { ko: "45분", en: "45 min" }, tip: { ko: "간단한 체험 프로그램을 운영하는 공방들이 많아요", en: "Many workshops offer short hands-on sessions" } },
      { name: { ko: "성수 편집숍", en: "Seongsu Boutiques" }, type: { ko: "쇼핑", en: "Shopping" }, duration: { ko: "45분", en: "45 min" }, tip: { ko: "개성 있는 국내 디자이너 브랜드를 발견해보세요", en: "Discover unique Korean indie designer brands" } },
    ],
  },
};

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const isKo = useLang();

  const course = COURSE_DATA[slug];

  if (!course) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, padding: 24 }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>코스를 찾을 수 없어요</p>
        <Link href="/courses" style={{ color: "var(--grade-s)", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>← {isKo ? "코스 목록" : "All Courses"}</Link>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", background: "var(--content-bg)" }}>
      {/* Hero */}
      <div style={{ position: "relative", height: 220, background: course.color, flexShrink: 0 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)" }} />

        {/* Back button */}
        <button
          onClick={() => router.back()}
          style={{ position: "absolute", top: 16, left: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.3)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", fontSize: 18, zIndex: 10 }}
        >
          ‹
        </button>

        {/* Badge */}
        <div style={{ position: "absolute", top: 16, right: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999, background: "var(--grade-b)", color: "var(--grade-b-text)" }}>
            {isKo ? course.badge.ko : course.badge.en}
          </span>
        </div>

        {/* Bottom info */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 20px 18px" }}>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.25, marginBottom: 6 }}>
            {isKo ? course.name.ko : course.name.en}
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.4 }}>
            {isKo ? course.tagline.ko : course.tagline.en}
          </p>
        </div>
      </div>

      {/* Meta row */}
      <div style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", padding: "14px 20px", display: "flex", gap: 20, flexShrink: 0 }}>
        {[
          { icon: "📍", label: isKo ? course.meta.ko : course.meta.en },
          { icon: "⏱", label: isKo ? course.duration.ko : course.duration.en },
          { icon: "📊", label: isKo ? course.difficulty.ko : course.difficulty.en },
        ].map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 14 }}>{m.icon}</span>
            <span style={{ fontSize: 12, color: "var(--foreground-muted)", fontWeight: 500 }}>{m.label}</span>
          </div>
        ))}
        {course.englishOk && (
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "var(--badge-en-bg)", color: "var(--badge-en-fg)", marginLeft: "auto", alignSelf: "center" }}>영어 OK</span>
        )}
      </div>

      {/* Stops */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 80px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground-sub)", letterSpacing: "0.04em", marginBottom: 14 }}>
          {isKo ? "코스 경로" : "Course Stops"}
        </div>

        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div style={{ position: "absolute", left: 17, top: 18, bottom: 18, width: 2, background: "var(--border)", zIndex: 0 }} />

          {course.stops.map((stop, i) => (
            <div key={i} style={{ display: "flex", gap: 14, marginBottom: 16, position: "relative", zIndex: 1 }}>
              {/* Step number */}
              <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: course.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 800, boxShadow: `0 0 0 3px var(--content-bg)` }}>
                {i + 1}
              </div>

              {/* Card */}
              <div style={{ flex: 1, background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)", padding: "12px 14px", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 5 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", marginBottom: 2 }}>
                      {isKo ? stop.name.ko : stop.name.en}
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "var(--foreground-muted)" }}>{isKo ? stop.type.ko : stop.type.en}</span>
                      <span style={{ fontSize: 10, color: "var(--foreground-sub)" }}>·</span>
                      <span style={{ fontSize: 11, color: "var(--foreground-muted)" }}>{isKo ? stop.duration.ko : stop.duration.en}</span>
                    </div>
                  </div>
                  {stop.placeSlug && (
                    <Link href={`/places/${stop.placeSlug}`} style={{ flexShrink: 0, padding: "5px 10px", borderRadius: 8, background: "var(--content-bg)", border: "1px solid var(--border)", fontSize: 11, fontWeight: 600, color: "var(--grade-s)", textDecoration: "none", whiteSpace: "nowrap" }}>
                      {isKo ? "상세보기 →" : "Details →"}
                    </Link>
                  )}
                </div>
                <p style={{ fontSize: 12, color: "var(--foreground-muted)", lineHeight: 1.5, paddingTop: 6, borderTop: "1px solid var(--border)" }}>
                  💡 {isKo ? stop.tip.ko : stop.tip.en}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA bar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--card)", borderTop: "1px solid var(--border)", padding: "12px 16px", paddingBottom: "calc(12px + env(safe-area-inset-bottom))", display: "flex", gap: 10, zIndex: 40 }}>
        <Link href="/map" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, height: 48, borderRadius: 14, background: "var(--content-bg)", border: "1px solid var(--border)", fontSize: 14, fontWeight: 600, color: "var(--foreground)", textDecoration: "none" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
          {isKo ? "지도에서 보기" : "View on Map"}
        </Link>
        <button style={{ flex: 2, height: 48, borderRadius: 14, background: "var(--grade-s)", border: "none", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(255,86,54,0.3)" }}>
          {isKo ? "코스 시작하기 →" : "Start Course →"}
        </button>
      </div>
    </div>
  );
}
