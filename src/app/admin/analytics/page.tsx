"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";

const GRADE_COLORS: Record<string, string> = { S: "#FF5636", A: "#12BFB6", B: "#7B4DFF", C: "#FFC93C", D: "#9A9488" };

const MONTHS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

const GRADE_TREND = MONTHS.map((m, i) => ({
  month: m,
  S: 30 + i * 2 + Math.floor(Math.random() * 8),
  A: 70 + i + Math.floor(Math.random() * 10),
  B: 60 + Math.floor(Math.random() * 15),
  C: 25 + Math.floor(Math.random() * 10),
  D: 10 + Math.floor(Math.random() * 5),
}));

const USER_BY_NATION = [
  { nation: "미국",   counts: [120, 140, 135, 160, 175, 190] },
  { nation: "일본",   counts: [80,  90,  95,  100, 110, 125] },
  { nation: "중국",   counts: [60,  70,  75,  80,  90,  100] },
  { nation: "영국",   counts: [45,  50,  55,  60,  65,  70]  },
  { nation: "기타",   counts: [90,  100, 115, 130, 145, 160] },
];

const NAT_COLORS = ["#FF5636", "#12BFB6", "#7B4DFF", "#FFC93C", "#9A9488"];

const TOP_COURSES = [
  { name: "이태원 로컬 먹방", views: 1240, completions: 342 },
  { name: "홍대 카페 투어",   views: 980,  completions: 210 },
  { name: "강남 쇼핑 루트",   views: 870,  completions: 195 },
  { name: "명동 한국 문화",   views: 730,  completions: 168 },
  { name: "성수 힙스터 코스", views: 620,  completions: 142 },
];

const TOP_KEYWORDS = [
  { word: "이태원",       count: 842 },
  { word: "외국인 카드",  count: 631 },
  { word: "영어 메뉴",    count: 524 },
  { word: "혼자 식사",    count: 489 },
  { word: "카페",         count: 412 },
  { word: "지하철",       count: 387 },
  { word: "환전",         count: 341 },
  { word: "병원",         count: 298 },
];

const RECENT_MONTHS = MONTHS.slice(6, 12);

function GradeTrendChart() {
  const maxVal = Math.max(...GRADE_TREND.map(d => d.S + d.A + d.B + d.C + d.D));
  const chartH = 160;
  const chartW = 480;
  const barW = chartW / GRADE_TREND.length - 4;

  return (
    <div className="bg-white rounded-[18px] shadow-[0_6px_20px_-16px_rgba(0,0,0,0.25)] p-[22px]">
      <h3 className="font-semibold text-gray-800 text-sm mb-4">등급 트렌드 (월별)</h3>
      <div className="flex gap-3 mb-3 flex-wrap">
        {Object.entries(GRADE_COLORS).map(([g, c]) => (
          <div key={g} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: c }} />
            <span className="text-xs text-gray-500">{g}등급</span>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${chartW} ${chartH + 20}`} className="w-full overflow-visible">
        {GRADE_TREND.map((d, i) => {
          const grades: (keyof typeof GRADE_COLORS)[] = ["D","C","B","A","S"];
          let yOffset = chartH;
          const x = i * (chartW / GRADE_TREND.length) + 2;
          return (
            <g key={d.month}>
              {grades.map(g => {
                const h = (d[g as keyof typeof d] as number) / maxVal * chartH;
                yOffset -= h;
                return <rect key={g} x={x} y={yOffset} width={barW} height={h} fill={GRADE_COLORS[g]} opacity={0.85} rx={2} />;
              })}
              <text x={x + barW/2} y={chartH + 14} textAnchor="middle" fontSize={9} fill="#9A9488">{d.month}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function UserNationChart() {
  const months = RECENT_MONTHS;
  const maxTotal = Math.max(...months.map((_, mi) => USER_BY_NATION.reduce((s, n) => s + n.counts[mi], 0)));
  const chartH = 140, chartW = 480;

  return (
    <div className="bg-white rounded-[18px] shadow-[0_6px_20px_-16px_rgba(0,0,0,0.25)] p-[22px]">
      <h3 className="font-semibold text-gray-800 text-sm mb-4">국적별 사용자 증가 (최근 6개월)</h3>
      <div className="flex gap-3 mb-3 flex-wrap">
        {USER_BY_NATION.map((n, i) => (
          <div key={n.nation} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: NAT_COLORS[i] }} />
            <span className="text-xs text-gray-500">{n.nation}</span>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${chartW} ${chartH + 20}`} className="w-full overflow-visible">
        {months.map((m, mi) => {
          let yOffset = chartH;
          const x = mi * (chartW / months.length) + 4;
          const barW = chartW / months.length - 8;
          return (
            <g key={m}>
              {USER_BY_NATION.map((n, ni) => {
                const h = (n.counts[mi] / maxTotal) * chartH;
                yOffset -= h;
                return <rect key={n.nation} x={x} y={yOffset} width={barW} height={h} fill={NAT_COLORS[ni]} opacity={0.85} rx={2} />;
              })}
              <text x={x + barW/2} y={chartH + 14} textAnchor="middle" fontSize={9} fill="#9A9488">{m}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("6months");

  return (
    <div className="max-w-6xl mx-auto w-full">
      {/* Date range picker */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs text-gray-400">데이터 기준 기간</p>
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <select value={dateRange} onChange={e => setDateRange(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
            <option value="1month">최근 1개월</option>
            <option value="3months">최근 3개월</option>
            <option value="6months">최근 6개월</option>
            <option value="1year">최근 1년</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Grade trend */}
        <GradeTrendChart />

        {/* User by nation */}
        <UserNationChart />

        {/* Bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top courses */}
          <div className="bg-white rounded-[18px] shadow-[0_6px_20px_-16px_rgba(0,0,0,0.25)] p-[22px]">
            <h3 className="font-semibold text-gray-800 text-sm mb-4">인기 코스 Top 5</h3>
            <div className="flex flex-col gap-3">
              {TOP_COURSES.map((c, i) => (
                <div key={c.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                  <span className="flex-1 text-sm text-gray-800 font-medium truncate">{c.name}</span>
                  <span className="text-xs text-gray-500">{c.views.toLocaleString()} 뷰</span>
                  <span className="text-xs font-semibold text-[#FF5636]">{c.completions}완료</span>
                </div>
              ))}
            </div>
          </div>

          {/* Search keywords */}
          <div className="bg-white rounded-[18px] shadow-[0_6px_20px_-16px_rgba(0,0,0,0.25)] p-[22px]">
            <h3 className="font-semibold text-gray-800 text-sm mb-4">검색 키워드 빈도</h3>
            <div className="flex flex-col gap-2.5">
              {TOP_KEYWORDS.map((kw, i) => {
                const pct = (kw.count / TOP_KEYWORDS[0].count) * 100;
                return (
                  <div key={kw.word} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                    <span className="text-xs text-gray-700 w-20 flex-shrink-0">{kw.word}</span>
                    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#FF5636", opacity: 0.7 }} />
                    </div>
                    <span className="text-xs text-gray-500 w-10 text-right flex-shrink-0">{kw.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
