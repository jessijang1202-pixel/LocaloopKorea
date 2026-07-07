"use client";

import { CARD_SOFT } from "@/components/admin/adminStyles";

const CARD: React.CSSProperties = { ...CARD_SOFT, padding: 28 };

export default function SettingsPage() {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={CARD}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#16151A", marginBottom: 20 }}>관리자 정보</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[["이름", "관리자"], ["이메일", "admin@localoop.kr"], ["역할", "슈퍼 관리자"]].map(([label, value]) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, color: "#8A8478", fontWeight: 600 }}>{label}</label>
              <input defaultValue={value} style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid #E5DED4", fontSize: 14, outline: "none", background: "#FAFAF8" }} />
            </div>
          ))}
          <button style={{ marginTop: 8, padding: "11px 24px", borderRadius: 12, background: "#FF5636", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, alignSelf: "flex-start" }}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
