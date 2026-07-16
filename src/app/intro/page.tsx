"use client";

// New home/landing screen (root "/" redirects here). Full-bleed map centered
// on Incheon Airport — where a newly-arrived foreigner actually lands —
// with a single intent popup that funnels straight into /tasks. No
// AppNav/PageHeader here (this route sits outside the (app)/(public) route
// groups on purpose, so it can be this minimal).

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useLang } from "@/lib/lang";
import { useTheme } from "@/lib/theme";
import { INCHEON_AIRPORT } from "@/content/map";

const KakaoMap = dynamic(
  () => import("@/components/map/KakaoMap").then((m) => m.KakaoMap),
  { ssr: false, loading: () => <div style={{ width: "100%", height: "100%", background: "var(--map-bg)" }} /> }
);

function IntentPopup({ isDark, isKo, onStart }: { isDark: boolean; isKo: boolean; onStart: () => void }) {
  const cardBg = isDark ? "#1D1A22" : "#ffffff";
  const cardBorder = isDark ? "1px solid #2C2833" : "none";
  const scrimBg = isDark ? "rgba(0,0,0,0.68)" : "rgba(10,8,6,0.60)";
  const eyebrow = isDark ? "#FF8A6D" : "#E2431F";
  const headline = isDark ? "#F4F0E8" : "#16151A";
  const bodyText = isDark ? "#C9C4D6" : "#3A3630";
  const btnBg = isDark ? "#FF6A4D" : "#FF5636";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: scrimBg, backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 20px",
    }}>
      <div style={{
        background: cardBg, border: cardBorder, borderRadius: 26,
        width: "100%", maxWidth: 332,
        boxShadow: isDark ? "0 24px 60px rgba(0,0,0,0.6)" : "0 16px 48px rgba(22,21,26,0.22)",
        padding: "32px 24px 24px", textAlign: "center",
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: eyebrow, letterSpacing: "0.22em", marginBottom: 14 }}>
          WELCOME TO KOREA
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: headline, letterSpacing: "-0.5px", lineHeight: 1.3, marginBottom: 12 }}>
          {isKo ? "당신은 무엇을 원하십니까?" : "What do you want to do?"}
        </h1>
        <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.6, marginBottom: 26 }}>
          {isKo
            ? "지금 당신의 한국 생활에 필요한 것들을 하나씩 알려드릴게요."
            : "Let's figure out exactly what you need right now — one step at a time."}
        </p>
        <button
          onClick={onStart}
          style={{
            width: "100%", height: 52, borderRadius: 14,
            background: btnBg, border: "none", cursor: "pointer",
            fontSize: 16, fontWeight: 700, color: "#fff",
            boxShadow: "0 4px 16px rgba(255,86,54,0.35)",
          }}
        >
          {isKo ? "시작하기" : "Get Started"}
        </button>
      </div>
    </div>
  );
}

export default function IntroPage() {
  const router = useRouter();
  const isKo = useLang();
  const isDark = useTheme() === "dark";

  return (
    <div style={{ position: "relative", width: "100%", height: "100dvh", overflow: "hidden" }}>
      <KakaoMap lang={isKo ? "ko" : "en"} pins={[]} center={INCHEON_AIRPORT} zoom={7} />
      <IntentPopup isDark={isDark} isKo={isKo} onStart={() => router.push("/tasks")} />
    </div>
  );
}
