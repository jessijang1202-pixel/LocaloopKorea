"use client";

import { CARD_SOFT } from "@/components/admin/adminStyles";

const CARD: React.CSSProperties = { ...CARD_SOFT, padding: 24 };

export default function ContentPage() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={CARD}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#16151A", marginBottom: 16 }}>콘텐츠 관리</div>
        <div style={{ color: "#B3AC9F", fontSize: 14, textAlign: "center", padding: "40px 0" }}>콘텐츠 데이터를 불러오는 중입니다.</div>
      </div>
    </div>
  );
}
