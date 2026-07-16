"use client";

// Presentational consent modal — pairs with useLocationWithConsent() in
// src/lib/geo-consent.ts. Visual pattern matches the map page's WelcomePopup
// / /intro's IntentPopup (scrim + rounded card, dark-mode aware), but no
// blur — same "don't obscure the map behind it" fix applied to /intro.

export function LocationConsent({
  isDark,
  isKo,
  onAllow,
  onSkip,
}: {
  isDark: boolean;
  isKo: boolean;
  onAllow: () => void;
  onSkip: () => void;
}) {
  const cardBg = isDark ? "#1D1A22" : "#ffffff";
  const cardBorder = isDark ? "1px solid #2C2833" : "none";
  const scrimBg = isDark ? "rgba(0,0,0,0.38)" : "rgba(10,8,6,0.32)";
  const eyebrow = isDark ? "#FF8A6D" : "#E2431F";
  const headline = isDark ? "#F4F0E8" : "#16151A";
  const bodyText = isDark ? "#C9C4D6" : "#3A3630";
  const btnBg = isDark ? "#FF6A4D" : "#FF5636";
  const skipColor = isDark ? "#8B8598" : "#6C665B";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: scrimBg,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 20px",
    }}>
      <div style={{
        background: cardBg, border: cardBorder, borderRadius: 26,
        width: "100%", maxWidth: 332,
        boxShadow: isDark ? "0 24px 60px rgba(0,0,0,0.6)" : "0 16px 48px rgba(22,21,26,0.22)",
        padding: "28px 24px 24px", textAlign: "center",
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%", margin: "0 auto 16px",
          background: isDark ? "rgba(255,86,54,0.16)" : "#FFF0EC",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={btnBg} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: eyebrow, letterSpacing: "0.2em", marginBottom: 10 }}>
          {isKo ? "위치 정보 사용" : "USE YOUR LOCATION"}
        </div>
        <h2 style={{ fontSize: 19, fontWeight: 800, color: headline, letterSpacing: "-0.3px", lineHeight: 1.35, marginBottom: 10 }}>
          {isKo ? "내 주변부터 보여드릴까요?" : "Show what's near you?"}
        </h2>
        <p style={{ fontSize: 13, color: bodyText, lineHeight: 1.6, marginBottom: 22 }}>
          {isKo
            ? "위치를 켜면 지금 계신 곳 기준으로 가까운 장소부터 등급과 함께 보여드려요."
            : "Turning on location shows the closest places first — each with its foreigner-friendly grade."}
        </p>
        <button
          onClick={onAllow}
          style={{
            width: "100%", height: 50, borderRadius: 14,
            background: btnBg, border: "none", cursor: "pointer",
            fontSize: 15, fontWeight: 700, color: "#fff",
            boxShadow: "0 4px 16px rgba(255,86,54,0.35)",
            marginBottom: 10,
          }}
        >
          {isKo ? "위치 허용하기" : "Allow Location"}
        </button>
        <button
          onClick={onSkip}
          style={{
            width: "100%", height: 40, borderRadius: 12,
            background: "transparent", border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 600, color: skipColor,
          }}
        >
          {isKo ? "나중에 할게요" : "Not now"}
        </button>
      </div>
    </div>
  );
}
