"use client";

import { useState } from "react";

/* ── data ── */
const STATS = [
  { label: "총 장소 수",          value: 247,   color: "#FF5636", iconBg: "#FFF0EC", icon: "pin" },
  { label: "총 사용자 수",         value: 1832,  color: "#12BFB6", iconBg: "#E6FAF9", icon: "users" },
  { label: "로컬 코스 수",         value: 34,    color: "#7B4DFF", iconBg: "#EEE6FF", icon: "book" },
  { label: "오늘 업데이트된 장소",  value: 18,    color: "#F59E0B", iconBg: "#FEF3C7", icon: "refresh", sub: "전체의 7%" },
];

const GRADE_DIST: [string, number, string, string][] = [
  ["S", 42, "#FF5636", "#fff"],
  ["A", 88, "#12BFB6", "#fff"],
  ["B", 71, "#FFC93C", "#3a2c00"],
  ["C", 34, "#7B4DFF", "#fff"],
  ["D", 12, "#9A9488", "#fff"],
];

const SIGNUPS = [45,62,38,71,55,90,48,66,42,78,53,85,39,70,47,82,56,93,44,68,51,87,41,74,49,83,57,96,43,72];

const REGIONS = [
  { name: "이태원", count: 58 },
  { name: "홍대",   count: 47 },
  { name: "강남",   count: 39 },
  { name: "명동",   count: 31 },
  { name: "신촌",   count: 22 },
];

const LOGS = [
  { id: 1, type: "collect", action: "데이터 수집",    region: "이태원", time: "3분 전" },
  { id: 2, type: "edit",    action: "등급 수정",      region: "홍대",   time: "14분 전" },
  { id: 3, type: "add",     action: "신규 장소 추가", region: "강남",   time: "1시간 전" },
  { id: 4, type: "collect", action: "데이터 수집",    region: "명동",   time: "2시간 전" },
  { id: 5, type: "delete",  action: "장소 삭제",      region: "이태원", time: "3시간 전" },
  { id: 6, type: "edit",    action: "등급 수정",      region: "신촌",   time: "5시간 전" },
  { id: 7, type: "add",     action: "신규 장소 추가", region: "홍대",   time: "어제" },
  { id: 8, type: "collect", action: "데이터 수집",    region: "이태원", time: "어제" },
  { id: 9, type: "edit",    action: "등급 수정",      region: "강남",   time: "2일 전" },
  { id: 10, type: "add",   action: "신규 장소 추가", region: "명동",   time: "2일 전" },
];

const LOG_STYLE: Record<string, { label: string; color: string }> = {
  collect: { label: "수집", color: "#234BFF" },
  edit:    { label: "수정", color: "#a06b00" },
  add:     { label: "추가", color: "#12A05A" },
  delete:  { label: "삭제", color: "#FF5636" },
};

/* ── helpers ── */
const CARD: React.CSSProperties = {
  background: "#fff",
  borderRadius: 18,
  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
};

function Icon({ name, color }: { name: string; color: string }) {
  const s = { width: 20, height: 20 };
  if (name === "pin") return (
    <svg {...s} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
    </svg>
  );
  if (name === "users") return (
    <svg {...s} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  );
  if (name === "book") return (
    <svg {...s} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
    </svg>
  );
  return (
    <svg {...s} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
    </svg>
  );
}

/* ── chart ── */
function SignupChart() {
  const max = Math.max(...SIGNUPS);
  const W = 520, H = 130;
  const pts = SIGNUPS.map((v, i) => {
    const x = (i / (SIGNUPS.length - 1)) * W;
    const y = H - (v / max) * (H - 8);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const line = pts.join(" ");
  const area = `0,${H} ${line} ${W},${H}`;
  const total = SIGNUPS.reduce((a, b) => a + b, 0);
  return (
    <div style={{ ...CARD, padding: 24, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: "#16151A" }}>신규 가입 (30일)</span>
        <span style={{ fontSize: 12, color: "#9A9488" }}>총 {total.toLocaleString()}명</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 120 }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF5636" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="#FF5636" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#sg)"/>
        <polyline points={line} fill="none" stroke="#FF5636" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#B3AC9F", marginTop: 4 }}>
        <span>30일 전</span><span>오늘</span>
      </div>
    </div>
  );
}

/* ── page ── */
export default function AdminDashboard() {
  const [spinning, setSpinning] = useState(false);
  const total = GRADE_DIST.reduce((a, g) => a + g[1], 0);
  const maxRegion = REGIONS[0].count;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13.5, color: "#8A8478" }}>2026년 7월 6일 기준</span>
        <button onClick={() => { setSpinning(true); setTimeout(() => setSpinning(false), 900); }}
          style={{
            display: "flex", alignItems: "center", gap: 6, fontSize: 13.5,
            fontWeight: 600, color: "#6C665B", background: "none", border: "none",
            cursor: "pointer", padding: 0,
          }}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            strokeLinecap="round" strokeLinejoin="round"
            style={{ animation: spinning ? "spin 0.9s linear infinite" : "none" }}>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
          </svg>
          새로고침
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
        {STATS.map((s) => (
          <div key={s.label} style={{ ...CARD, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 11,
                background: s.iconBg,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Icon name={s.icon} color={s.color} />
              </div>
              <span style={{ fontSize: 13.5, color: "#8A8478", fontWeight: 500, lineHeight: 1.3 }}>{s.label}</span>
            </div>
            <div style={{
              fontSize: 44, fontWeight: 800, color: "#16151A", lineHeight: 1,
              letterSpacing: "-1.5px", fontFamily: "'Space Grotesk', sans-serif",
            }}>
              {s.value.toLocaleString()}
            </div>
            {s.sub && <div style={{ fontSize: 12, color: "#B3AC9F", marginTop: 8 }}>{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 20 }}>

        {/* Grade distribution */}
        <div style={{ ...CARD, padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#16151A", marginBottom: 20 }}>등급 분포</div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            {GRADE_DIST.map(([grade, count, color, textColor]) => (
              <div key={grade} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 20, color: "#16151A", letterSpacing: "-0.5px" }}>{count}</div>
                <div style={{ height: 4, borderRadius: 2, margin: "10px 0", background: color }} />
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", margin: "0 auto",
                  background: color, color: textColor,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700,
                }}>
                  {grade}
                </div>
                <div style={{ fontSize: 11, color: "#9A9488", marginTop: 8 }}>
                  {Math.round(count / total * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Signup chart */}
        <SignupChart />

        {/* Regions */}
        <div style={{ ...CARD, padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#16151A", marginBottom: 20 }}>지역별 장소 수 (Top 5)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {REGIONS.map((r) => (
              <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12.5, color: "#6C665B", width: 36, textAlign: "right", flexShrink: 0 }}>{r.name}</span>
                <div style={{ flex: 1, height: 8, borderRadius: 999, background: "#F2EDE4", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 999, background: "#FF5636",
                    width: `${(r.count / maxRegion) * 100}%`,
                  }} />
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: "#16151A", width: 24, flexShrink: 0 }}>{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity log */}
      <div style={CARD}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 28px", borderBottom: "1px solid #F0EBDE",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#8A8478" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#16151A" }}>최근 활동 로그</span>
          </div>
          <span style={{ fontSize: 12, color: "#9A9488" }}>최근 10건</span>
        </div>
        <div>
          {LOGS.map((log, i) => {
            const s = LOG_STYLE[log.type] ?? { label: log.type, color: "#9A9488" };
            return (
              <div key={log.id} className="admin-row" style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "14px 28px",
                borderTop: i === 0 ? "none" : "1px solid #F0EBDE",
                transition: "background 0.12s",
              }}>
                <span style={{ width: 36, fontSize: 12.5, fontWeight: 700, color: s.color, flexShrink: 0 }}>{s.label}</span>
                <span style={{ flex: 1, fontSize: 13.5, color: "#16151A" }}>{log.action}</span>
                <span style={{ fontSize: 12.5, color: "#6C665B", width: 60 }}>{log.region}</span>
                <span style={{ fontSize: 12, color: "#B3AC9F", width: 72, textAlign: "right", flexShrink: 0 }}>{log.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
