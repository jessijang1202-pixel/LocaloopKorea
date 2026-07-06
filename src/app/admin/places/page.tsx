"use client";

import { useState } from "react";

const CARD: React.CSSProperties = { background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" };

const GRADE_COLORS: Record<string, string> = { S: "#FF5636", A: "#12BFB6", B: "#FFC93C", C: "#7B4DFF", D: "#9A9488" };
const GRADE_TEXT: Record<string, string> = { S: "#fff", A: "#fff", B: "#3a2c00", C: "#fff", D: "#fff" };

type Place = { id: string; name: string; region: string; grade: string; status: string; updated: string };

const MOCK: Place[] = Array.from({ length: 20 }, (_, i) => ({
  id: `p${i + 1}`,
  name: ["라이너스 BBQ", "더 나인 카페", "이태원 클럽", "홍대 포차", "강남 스시"][i % 5],
  region: ["이태원", "홍대", "강남", "명동", "신촌"][i % 5],
  grade: ["S", "A", "B", "C", "D"][i % 5],
  status: i % 6 === 0 ? "비활성" : "활성",
  updated: `${i + 1}일 전`,
}));

export default function PlacesPage() {
  const [search, setSearch] = useState("");
  const filtered = MOCK.filter(p => p.name.includes(search) || p.region.includes(search));

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#9A9488" strokeWidth={2}
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="장소명, 지역으로 검색"
            style={{
              width: "100%", boxSizing: "border-box",
              padding: "10px 12px 10px 38px", borderRadius: 12,
              border: "1px solid #E5DED4", fontSize: 14, outline: "none",
              background: "#fff",
            }} />
        </div>
        <button style={{
          padding: "10px 20px", borderRadius: 12, background: "#FF5636",
          color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
        }}>
          + 장소 추가
        </button>
      </div>

      <div style={{ ...CARD, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #F0EBDE", background: "#FAFAF8" }}>
              {["장소명", "지역", "등급", "상태", "업데이트", ""].map(h => (
                <th key={h} style={{ padding: "13px 20px", textAlign: "left", fontSize: 12.5, fontWeight: 600, color: "#8A8478" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} style={{ borderTop: i === 0 ? "none" : "1px solid #F5F0EA" }}>
                <td style={{ padding: "13px 20px", fontSize: 14, fontWeight: 500, color: "#16151A" }}>{p.name}</td>
                <td style={{ padding: "13px 20px", fontSize: 13.5, color: "#6C665B" }}>{p.region}</td>
                <td style={{ padding: "13px 20px" }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 28, height: 28, borderRadius: "50%",
                    background: GRADE_COLORS[p.grade], color: GRADE_TEXT[p.grade],
                    fontSize: 12, fontWeight: 700,
                  }}>{p.grade}</span>
                </td>
                <td style={{ padding: "13px 20px" }}>
                  <span style={{
                    fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 999,
                    background: p.status === "활성" ? "#E6FAF4" : "#F5F0EA",
                    color: p.status === "활성" ? "#0D7A4E" : "#9A9488",
                  }}>{p.status}</span>
                </td>
                <td style={{ padding: "13px 20px", fontSize: 13, color: "#B3AC9F" }}>{p.updated}</td>
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
