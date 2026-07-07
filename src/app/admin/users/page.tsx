"use client";

import { useState } from "react";
import { CARD_SOFT } from "@/components/admin/adminStyles";

const CARD: React.CSSProperties = CARD_SOFT;

const MOCK = Array.from({ length: 25 }, (_, i) => ({
  id: `u${i + 1}`,
  name: ["Alex Johnson", "Yuki Tanaka", "Maria Santos", "James Brown", "Emma Wilson"][i % 5],
  email: `user${i + 1}@example.com`,
  nationality: ["미국", "일본", "브라질", "영국", "호주"][i % 5],
  joined: `${i + 1}일 전`,
  suspended: i % 8 === 0,
}));

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const filtered = MOCK.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search));

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#9A9488" strokeWidth={2}
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="이름, 이메일로 검색"
            style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px 10px 38px", borderRadius: 12, border: "1px solid #E5DED4", fontSize: 14, outline: "none", background: "#fff" }} />
        </div>
      </div>

      <div style={{ ...CARD, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #F0EBDE", background: "#FAFAF8" }}>
              {["이름", "이메일", "국적", "가입일", "상태", ""].map(h => (
                <th key={h} style={{ padding: "13px 20px", textAlign: "left", fontSize: 12.5, fontWeight: 600, color: "#8A8478" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} style={{ borderTop: i === 0 ? "none" : "1px solid #F5F0EA" }}>
                <td style={{ padding: "13px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#FF5636", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{u.name[0]}</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "#16151A" }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: "13px 20px", fontSize: 13, color: "#6C665B" }}>{u.email}</td>
                <td style={{ padding: "13px 20px" }}>
                  <span style={{ fontSize: 12, background: "#F2EDE4", color: "#6C665B", padding: "3px 10px", borderRadius: 8 }}>{u.nationality}</span>
                </td>
                <td style={{ padding: "13px 20px", fontSize: 13, color: "#B3AC9F" }}>{u.joined}</td>
                <td style={{ padding: "13px 20px" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: u.suspended ? "#FFF0EC" : "#E6FAF4", color: u.suspended ? "#FF5636" : "#0D7A4E" }}>
                    {u.suspended ? "정지" : "활성"}
                  </span>
                </td>
                <td style={{ padding: "13px 20px", textAlign: "right" }}>
                  <button style={{ fontSize: 13, color: "#FF5636", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>상세보기</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
