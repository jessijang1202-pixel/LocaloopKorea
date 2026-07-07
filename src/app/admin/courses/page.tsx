"use client";

import { CARD_SOFT } from "@/components/admin/adminStyles";

const CARD: React.CSSProperties = CARD_SOFT;

const MOCK = [
  { id: "c1", name: "이태원 로컬 먹방", region: "이태원", theme: "음식 탐방", places: 3, status: "활성" },
  { id: "c2", name: "홍대 카페 투어",   region: "홍대",   theme: "카페 투어", places: 5, status: "활성" },
  { id: "c3", name: "강남 역사 산책",   region: "강남",   theme: "역사 문화", places: 4, status: "비활성" },
  { id: "c4", name: "명동 쇼핑 코스",   region: "명동",   theme: "쇼핑",      places: 6, status: "활성" },
  { id: "c5", name: "신촌 야경 투어",   region: "신촌",   theme: "야경",      places: 4, status: "활성" },
];

export default function CoursesPage() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button style={{ padding: "10px 20px", borderRadius: 12, background: "#FF5636", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
          + 코스 추가
        </button>
      </div>
      <div style={{ ...CARD, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #F0EBDE", background: "#FAFAF8" }}>
              {["코스명", "지역", "테마", "포함 장소", "상태", ""].map(h => (
                <th key={h} style={{ padding: "13px 20px", textAlign: "left", fontSize: 12.5, fontWeight: 600, color: "#8A8478" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK.map((c, i) => (
              <tr key={c.id} style={{ borderTop: i === 0 ? "none" : "1px solid #F5F0EA" }}>
                <td style={{ padding: "13px 20px", fontSize: 14, fontWeight: 500, color: "#16151A" }}>{c.name}</td>
                <td style={{ padding: "13px 20px", fontSize: 13.5, color: "#6C665B" }}>{c.region}</td>
                <td style={{ padding: "13px 20px", fontSize: 13.5, color: "#6C665B" }}>{c.theme}</td>
                <td style={{ padding: "13px 20px", fontSize: 13.5, color: "#16151A", fontWeight: 600 }}>{c.places}개</td>
                <td style={{ padding: "13px 20px" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: c.status === "활성" ? "#E6FAF4" : "#F5F0EA", color: c.status === "활성" ? "#0D7A4E" : "#9A9488" }}>{c.status}</span>
                </td>
                <td style={{ padding: "13px 20px", textAlign: "right" }}>
                  <button style={{ fontSize: 13, color: "#FF5636", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>편집</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
