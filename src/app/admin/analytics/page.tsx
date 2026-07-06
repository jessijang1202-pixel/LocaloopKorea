"use client";

const CARD: React.CSSProperties = { background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", padding: 24 };

const STATS = [
  { label: "이번 달 신규 가입", value: "248명", change: "+12%" },
  { label: "월간 활성 사용자", value: "1,204명", change: "+8%" },
  { label: "평균 세션 시간", value: "6분 32초", change: "+3%" },
  { label: "장소 조회 수", value: "18,470회", change: "+22%" },
];

export default function AnalyticsPage() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
        {STATS.map(s => (
          <div key={s.label} style={CARD}>
            <div style={{ fontSize: 13, color: "#8A8478", marginBottom: 10 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#16151A", letterSpacing: "-0.5px", fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#12A05A", marginTop: 6, fontWeight: 600 }}>{s.change}</div>
          </div>
        ))}
      </div>
      <div style={CARD}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#16151A", marginBottom: 16 }}>지역별 인기 장소</div>
        <div style={{ color: "#B3AC9F", fontSize: 14, textAlign: "center", padding: "40px 0" }}>데이터를 불러오는 중입니다.</div>
      </div>
    </div>
  );
}
