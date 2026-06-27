"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const SLIDES_KO = [
  {
    icon: "🗺️",
    tag: "Localoop Korea",
    titleLines: ["어서와!", "한국에 온걸 환영해"],
    highlightLine: 1,
    desc: "언어 장벽, 낯선 동네, 새로운 일상.\n이제 AI가 당신의 한국 생활을\n단계별로 안내해드려요.",
  },
  {
    icon: "📍",
    tag: "기능 01",
    titleLines: ["내 주변", "외국인 친화 장소 찾기"],
    highlightLine: 1,
    desc: "지도에서 바로 확인하는\nS~D 외국인 친화도 등급.\n영어 메뉴, 카드 결제 가능 여부도\n한눈에 볼 수 있어요.",
  },
  {
    icon: "📋",
    tag: "기능 02",
    titleLines: ["지금 뭘 해야 하는지", "AI가 알려줘"],
    highlightLine: 1,
    desc: "도착 첫날부터 장기 정착까지.\n체류 단계에 맞게\n\"지금 해야 할 일\"을\n자동으로 안내해드려요.",
  },
  {
    icon: "🏃",
    tag: "기능 03",
    titleLines: ["현지인만 아는", "로컬 코스 추천"],
    highlightLine: 1,
    desc: "관광지 말고 진짜 한국.\n내 언어 수준·취향·취미에 맞는\n반나절 로컬 코스를\nAI가 자동으로 짜드려요.",
  },
  {
    icon: "🤝",
    tag: "기능 04 · 05 · 06",
    titleLines: ["외국인·한국인", "진짜 친구 만들기"],
    highlightLine: 1,
    desc: "언어 교환, 취미 모임, 동네 파방.\n실시간 번역 채팅으로\n언어 장벽 없이\n자연스럽게 연결돼요.",
  },
];

const SLIDES_EN = [
  {
    icon: "🗺️",
    tag: "Localoop Korea",
    titleLines: ["Welcome to Korea!", "Your new life starts here"],
    highlightLine: 0,
    desc: "New city. New language. New life.\nLet AI guide your Korea journey\nstep by step.",
  },
  {
    icon: "📍",
    tag: "Feature 01",
    titleLines: ["Find foreigner-friendly", "places near you"],
    highlightLine: 1,
    desc: "See S~D friendliness ratings\ndirectly on the map.\nEnglish menu, card payment —\nall at a glance.",
  },
  {
    icon: "📋",
    tag: "Feature 02",
    titleLines: ["AI tells you exactly", "what to do right now"],
    highlightLine: 1,
    desc: "From day one to long-term settlement.\nBased on your visa stage,\nwe automatically guide you\nthrough your next steps.",
  },
  {
    icon: "🏃",
    tag: "Feature 03",
    titleLines: ["Local courses only", "insiders know about"],
    highlightLine: 1,
    desc: "Skip the tourist traps.\nAI builds a half-day local course\nmatched to your language level,\nhobbies, and interests.",
  },
  {
    icon: "🤝",
    tag: "Features 04 · 05 · 06",
    titleLines: ["Make real friends —", "locals & expats alike"],
    highlightLine: 1,
    desc: "Language exchange, hobby meetups,\nneighborhood hangouts.\nReal-time chat translation\nbreaks every barrier.",
  },
];

export default function IntroPage() {
  const [slide, setSlide] = useState(0);
  const [ready, setReady] = useState(false);
  const [isKorean, setIsKorean] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const lang = navigator.language || "";
    setIsKorean(lang.startsWith("ko"));

    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/map");
        return;
      }
      setReady(true);
    });
  }, [router]);

  function finish() {
    localStorage.setItem("hasSeenIntro", "1");
    router.push("/");
  }

  function next() {
    if (slide < SLIDES.length - 1) setSlide((s) => s + 1);
    else finish();
  }

  const SLIDES = isKorean ? SLIDES_KO : SLIDES_EN;
  const s = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;

  if (!ready) return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid #E0E8EA", borderTopColor: "#1EC8C8", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <main style={{
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column",
      background: "#fff",
      maxWidth: 430,
      margin: "0 auto",
      userSelect: "none",
    }}>
      <div style={{ height: 52, flexShrink: 0 }} />

      {/* Slide body */}
      <div
        key={slide}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 36px",
          textAlign: "center",
          animation: "fadeUp 0.35s ease",
        }}
      >
        <div style={{ fontSize: 68, lineHeight: 1, marginBottom: 24 }}>{s.icon}</div>

        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
          color: "#0B7A82", background: "#D4F4F6",
          padding: "4px 14px", borderRadius: 20, marginBottom: 18,
        }}>
          {s.tag}
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.35, marginBottom: 16 }}>
          {s.titleLines.map((line, i) => (
            <span key={i} style={{
              display: "block",
              color: i === s.highlightLine ? "#1EC8C8" : "#1A2B2C",
            }}>
              {line}
            </span>
          ))}
        </h1>

        <p style={{ fontSize: 14, color: "#4A6467", lineHeight: 1.75, whiteSpace: "pre-line" }}>
          {s.desc}
        </p>
      </div>

      {/* Footer */}
      <div style={{ padding: "0 24px 40px", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 22 }}>
          {SLIDES.map((_, i) => (
            <div
              key={i}
              onClick={() => setSlide(i)}
              style={{
                height: 6, borderRadius: 3,
                width: i === slide ? 22 : 6,
                background: i === slide ? "#1EC8C8" : "#E0E8EA",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        {isLast ? (
          <button
            onClick={finish}
            style={{
              width: "100%", padding: "16px", borderRadius: 16,
              background: "#FFD600", color: "#1A2B2C",
              fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer",
            }}
          >
            {isKorean ? "지금 시작하기" : "Get started"}
          </button>
        ) : (
          <>
            <button
              onClick={next}
              style={{
                width: "100%", padding: "16px", borderRadius: 16,
                background: "#1EC8C8", color: "#fff",
                fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer",
                marginBottom: 14,
              }}
            >
              {isKorean ? "다음" : "Next"}
            </button>
            <div
              onClick={finish}
              style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", cursor: "pointer", padding: "4px" }}
            >
              {isKorean ? "건너뛰기" : "Skip"}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
