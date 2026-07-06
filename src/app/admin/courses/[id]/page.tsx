"use client";

import { useParams, useRouter } from "next/navigation";

const CARD: React.CSSProperties = { background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", padding: 28 };

export default function CourseEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#6C665B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#16151A", margin: 0 }}>
          {id === "new" ? "새 코스 추가" : "코스 편집"}
        </h2>
      </div>
      <div style={CARD}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[["코스명 (한국어)", "text"], ["코스명 (영어)", "text"], ["지역", "text"]].map(([label, type]) => (
            <div key={label}>
              <label style={{ fontSize: 13, color: "#8A8478", fontWeight: 600, display: "block", marginBottom: 6 }}>{label}</label>
              <input type={type} style={{ width: "100%", boxSizing: "border-box", padding: "10px 14px", borderRadius: 12, border: "1px solid #E5DED4", fontSize: 14, outline: "none" }} />
            </div>
          ))}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button onClick={() => router.back()} style={{ flex: 1, padding: "11px", borderRadius: 12, border: "1px solid #E5DED4", background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#6C665B" }}>
              취소
            </button>
            <button style={{ flex: 1, padding: "11px", borderRadius: 12, background: "#FF5636", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
