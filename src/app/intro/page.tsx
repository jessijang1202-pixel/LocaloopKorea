"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// ─── Slide data ───────────────────────────────────────────────────────────────

const SLIDES_KO = [
  {
    icon: "🗺️",
    tag: "Localoop Korea",
    titleLines: ["어서와!", "한국에 온걸 환영해"],
    hi: 1,
    desc: "언어 장벽, 낯선 동네, 새로운 일상.\n이제 AI가 당신의 한국 생활을\n단계별로 안내해드려요.",
    bg: "#0B1E2D",
    accent: "#15b6c1",
  },
  {
    icon: "📍",
    tag: "기능 01",
    titleLines: ["내 주변", "외국인 친화 장소 찾기"],
    hi: 1,
    desc: "지도에서 바로 확인하는 S~C 외국인 친화도 등급.\n영어 메뉴, 카드 결제 여부도 한눈에 볼 수 있어요.",
    bg: "#0a2233",
    accent: "#15b6c1",
  },
  {
    icon: "📋",
    tag: "기능 02",
    titleLines: ["지금 뭘 해야 하는지", "AI가 알려줘"],
    hi: 1,
    desc: "도착 첫날부터 장기 정착까지.\n체류 단계에 맞게 \"지금 해야 할 일\"을\n자동으로 안내해드려요.",
    bg: "#0B1E2D",
    accent: "#ffd600",
  },
  {
    icon: "🏃",
    tag: "기능 03",
    titleLines: ["현지인만 아는", "로컬 코스 추천"],
    hi: 1,
    desc: "관광지 말고 진짜 한국.\n내 언어 수준·취향에 맞는 반나절 로컬 코스를\nAI가 자동으로 짜드려요.",
    bg: "#0a2233",
    accent: "#15b6c1",
  },
  {
    icon: "🤝",
    tag: "기능 04 · 05 · 06",
    titleLines: ["외국인·한국인", "진짜 친구 만들기"],
    hi: 1,
    desc: "언어 교환, 취미 모임, 동네 파티.\n실시간 번역 채팅으로\n언어 장벽 없이 자연스럽게 연결돼요.",
    bg: "#0B1E2D",
    accent: "#ffd600",
  },
];

const SLIDES_EN = [
  {
    icon: "🗺️",
    tag: "Localoop Korea",
    titleLines: ["Welcome to Korea!", "Your new life starts here"],
    hi: 0,
    desc: "New city. New language. New life.\nLet AI guide your Korea journey\nstep by step.",
    bg: "#0B1E2D",
    accent: "#15b6c1",
  },
  {
    icon: "📍",
    tag: "Feature 01",
    titleLines: ["Find foreigner-friendly", "places near you"],
    hi: 1,
    desc: "See S~C friendliness ratings directly on the map.\nEnglish menu, card payment — all at a glance.",
    bg: "#0a2233",
    accent: "#15b6c1",
  },
  {
    icon: "📋",
    tag: "Feature 02",
    titleLines: ["AI tells you exactly", "what to do right now"],
    hi: 1,
    desc: "From day one to long-term settlement.\nBased on your visa stage, we automatically guide\nyou through your next steps.",
    bg: "#0B1E2D",
    accent: "#ffd600",
  },
  {
    icon: "🏃",
    tag: "Feature 03",
    titleLines: ["Local courses only", "insiders know about"],
    hi: 1,
    desc: "Skip the tourist traps.\nAI builds a half-day local course matched\nto your language level, hobbies, and interests.",
    bg: "#0a2233",
    accent: "#15b6c1",
  },
  {
    icon: "🤝",
    tag: "Features 04 · 05 · 06",
    titleLines: ["Make real friends —", "locals & expats alike"],
    hi: 1,
    desc: "Language exchange, hobby meetups, neighborhood hangouts.\nReal-time chat translation breaks every barrier.",
    bg: "#0B1E2D",
    accent: "#ffd600",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function IntroPage() {
  const [slide, setSlide] = useState(0);
  const [ready, setReady] = useState(false);
  const [isKo, setIsKo] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const router = useRouter();

  // Touch / mouse drag state
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const ko = navigator.language.startsWith("ko");
    setIsKo(ko);

    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/map");
        return;
      }
      setReady(true);
    });
  }, [router]);

  const SLIDES = isKo ? SLIDES_KO : SLIDES_EN;
  const s = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;

  function goTo(idx: number) {
    if (transitioning || idx === slide) return;
    setTransitioning(true);
    setTimeout(() => {
      setSlide(idx);
      setTransitioning(false);
    }, 180);
  }

  function finish() {
    router.push("/map");
  }

  function handleNext() {
    if (isLast) finish();
    else goTo(slide + 1);
  }

  // ── Swipe handlers ──────────────────────────────────────────────────────────

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0 && !isLast) goTo(slide + 1);
      if (dx > 0 && slide > 0) goTo(slide - 1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  }

  // ── Mouse drag (PC) ─────────────────────────────────────────────────────────

  const mouseStartX = useRef<number | null>(null);

  function onMouseDown(e: React.MouseEvent) {
    mouseStartX.current = e.clientX;
  }

  function onMouseUp(e: React.MouseEvent) {
    if (mouseStartX.current === null) return;
    const dx = e.clientX - mouseStartX.current;
    if (Math.abs(dx) > 60) {
      if (dx < 0 && !isLast) goTo(slide + 1);
      if (dx > 0 && slide > 0) goTo(slide - 1);
    }
    mouseStartX.current = null;
  }

  if (!ready) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0B1E2D" }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          border: "3px solid rgba(21,182,193,0.3)", borderTopColor: "#15b6c1",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
        background: s.bg,
        transition: "background 0.4s ease",
        cursor: "grab",
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {/* Centered card — full on mobile, constrained on PC */}
      <div style={{
        width: "100%",
        maxWidth: 520,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Skip button */}
        {!isLast && (
          <button
            onClick={finish}
            style={{
              position: "absolute", top: 52, right: 24,
              background: "rgba(255,255,255,0.1)",
              border: "none", borderRadius: 20,
              color: "rgba(255,255,255,0.55)", fontSize: 13,
              padding: "6px 14px", cursor: "pointer", zIndex: 10,
              fontWeight: 500,
            }}
          >
            {isKo ? "건너뛰기" : "Skip"}
          </button>
        )}

        {/* Logo top-left */}
        <div style={{ position: "absolute", top: 52, left: 24, zIndex: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>
            Localoop<span style={{ color: s.accent }}>Korea</span>
          </span>
        </div>

        {/* Slide body */}
        <div
          key={slide}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 40px 0",
            textAlign: "center",
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? "translateY(12px)" : "translateY(0)",
            transition: "opacity 0.18s ease, transform 0.18s ease",
          }}
        >
          {/* Icon */}
          <div style={{
            fontSize: 76,
            lineHeight: 1,
            marginBottom: 28,
            filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.3))",
          }}>
            {s.icon}
          </div>

          {/* Tag badge */}
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            color: s.accent === "#ffd600" ? "#0B1E2D" : "#0B7A82",
            background: s.accent === "#ffd600" ? "#ffd600" : "#D4F4F6",
            padding: "4px 14px", borderRadius: 20, marginBottom: 20,
          }}>
            {s.tag}
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.3, marginBottom: 18, letterSpacing: "-0.02em" }}>
            {s.titleLines.map((line, i) => (
              <span key={i} style={{
                display: "block",
                color: i === s.hi ? s.accent : "#fff",
              }}>
                {line}
              </span>
            ))}
          </h1>

          {/* Description */}
          <p style={{
            fontSize: 15, color: "rgba(255,255,255,0.6)",
            lineHeight: 1.75, whiteSpace: "pre-line",
            maxWidth: 340,
          }}>
            {s.desc}
          </p>
        </div>

        {/* Footer */}
        <div style={{ padding: "32px 28px", paddingBottom: "calc(32px + env(safe-area-inset-bottom))", flexShrink: 0 }}>
          {/* Progress dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 24 }}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  height: 6, borderRadius: 3,
                  width: i === slide ? 24 : 6,
                  background: i === slide ? s.accent : "rgba(255,255,255,0.2)",
                  transition: "all 0.3s ease",
                  border: "none", cursor: "pointer", padding: 0,
                }}
              />
            ))}
          </div>

          {/* CTA button */}
          <button
            onClick={handleNext}
            style={{
              width: "100%", padding: "17px", borderRadius: 16,
              background: isLast ? "#ffd600" : s.accent,
              color: isLast ? "#0B1E2D" : "#fff",
              fontSize: 16, fontWeight: 700, border: "none", cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              transition: "transform 0.1s, opacity 0.1s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {isLast
              ? (isKo ? "지금 시작하기 →" : "Get started →")
              : (isKo ? "다음" : "Next")}
          </button>

          {/* Login link */}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
              {isKo ? "이미 계정이 있으신가요? " : "Already have an account? "}
            </span>
            <button
              onClick={() => router.push("/login")}
              style={{
                fontSize: 13, fontWeight: 600, color: s.accent,
                background: "none", border: "none", cursor: "pointer", padding: 0,
              }}
            >
              {isKo ? "로그인" : "Log in"}
            </button>
          </div>
        </div>
      </div>

      {/* PC: decorative left panel */}
      <style>{`
        @media (min-width: 900px) {
          .intro-side { display: flex !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}
