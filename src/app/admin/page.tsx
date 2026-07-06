"use client";

import { useState } from "react";
import { MapPin, Users, BookOpen, RefreshCw, Activity } from "lucide-react";

const STATS = { totalPlaces: 247, totalUsers: 1832, totalCourses: 34, updatedToday: 18 };

const GRADE_DIST = { S: 42, A: 88, B: 71, C: 34, D: 12 };
const GRADE_COLORS: Record<string, string> = {
  S: "#FF5636", A: "#12BFB6", B: "#FFC93C", C: "#7B4DFF", D: "#9A9488",
};
const GRADE_TEXT: Record<string, string> = {
  S: "#fff", A: "#fff", B: "#3a2c00", C: "#fff", D: "#fff",
};

const SIGNUPS_30 = [45,62,38,71,55,90,48,66,42,78,53,85,39,70,47,82,56,93,44,68,51,87,41,74,49,83,57,96,43,72]
  .map((count, i) => ({ day: i + 1, count }));

const TOP_REGIONS = [
  { region: "이태원", count: 58 },
  { region: "홍대",   count: 47 },
  { region: "강남",   count: 39 },
  { region: "명동",   count: 31 },
  { region: "신촌",   count: 22 },
];

const ACTIVITY_LOG = [
  { id: "1",  time: "3분 전",   region: "이태원", action: "데이터 수집",    type: "collect" },
  { id: "2",  time: "14분 전",  region: "홍대",   action: "등급 수정",      type: "edit"    },
  { id: "3",  time: "1시간 전", region: "강남",   action: "신규 장소 추가", type: "add"     },
  { id: "4",  time: "2시간 전", region: "명동",   action: "데이터 수집",    type: "collect" },
  { id: "5",  time: "3시간 전", region: "이태원", action: "장소 삭제",      type: "delete"  },
  { id: "6",  time: "5시간 전", region: "신촌",   action: "등급 수정",      type: "edit"    },
  { id: "7",  time: "어제",     region: "홍대",   action: "신규 장소 추가", type: "add"     },
  { id: "8",  time: "어제",     region: "이태원", action: "데이터 수집",    type: "collect" },
  { id: "9",  time: "2일 전",   region: "강남",   action: "등급 수정",      type: "edit"    },
  { id: "10", time: "2일 전",   region: "명동",   action: "신규 장소 추가", type: "add"     },
];

const ACTION_STYLE: Record<string, { label: string; color: string }> = {
  collect: { label: "수집", color: "#234BFF" },
  edit:    { label: "수정", color: "#a06b00" },
  add:     { label: "추가", color: "#12A05A" },
  delete:  { label: "삭제", color: "#FF5636" },
};

const CARD = "bg-white rounded-[18px] shadow-[0_6px_20px_-16px_rgba(0,0,0,0.25)]";

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: number; sub?: string; color: string;
}) {
  return (
    <div className={`${CARD} p-6`}>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center flex-shrink-0"
             style={{ background: `${color}20` }}>
          <Icon size={19} style={{ color }} />
        </div>
        <p className="text-[13.5px] text-[#8A8478] font-medium leading-tight">{label}</p>
      </div>
      <p className="font-bold text-[48px] leading-none tracking-[-1px] text-[#16151A]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {value.toLocaleString()}
      </p>
      {sub && <p className="text-xs text-[#B3AC9F] mt-2.5">{sub}</p>}
    </div>
  );
}

function GradeDistCard() {
  const total = Object.values(GRADE_DIST).reduce((a, b) => a + b, 0);
  return (
    <div className={`${CARD} p-7`}>
      <h3 className="font-bold text-[15px] text-[#16151A] mb-5">등급 분포</h3>
      <div className="flex justify-between gap-2">
        {Object.entries(GRADE_DIST).map(([grade, count]) => (
          <div key={grade} className="flex-1 text-center">
            <div className="font-bold text-[22px] text-[#16151A] tracking-[-0.5px]">{count}</div>
            <div className="h-[4px] rounded-[2px] my-2.5" style={{ background: GRADE_COLORS[grade] }} />
            <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-sm font-bold mx-auto"
                 style={{ background: GRADE_COLORS[grade], color: GRADE_TEXT[grade] }}>
              {grade}
            </div>
            <div className="text-[11px] text-[#9A9488] mt-2">{Math.round(count / total * 100)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SignupChart() {
  const max = Math.max(...SIGNUPS_30.map(d => d.count));
  const W = 520, H = 140;
  const pts = SIGNUPS_30.map((d, i) => {
    const x = (i / (SIGNUPS_30.length - 1)) * W;
    const y = H - (d.count / max) * (H - 8);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const line = pts.join(" ");
  const area = `0,${H} ${line} ${W},${H}`;

  return (
    <div className={`${CARD} p-7 flex flex-col`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-[15px] text-[#16151A]">신규 가입 (30일)</h3>
        <span className="text-xs text-[#9A9488]">총 {SIGNUPS_30.reduce((a, d) => a + d.count, 0).toLocaleString()}명</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 130 }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF5636" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#FF5636" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#sg)" stroke="none" />
        <polyline points={line} fill="none" stroke="#FF5636" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="flex justify-between text-[11px] text-[#B3AC9F] mt-1">
        <span>30일 전</span><span>오늘</span>
      </div>
    </div>
  );
}

function RegionsCard() {
  const max = TOP_REGIONS[0].count;
  return (
    <div className={`${CARD} p-7`}>
      <h3 className="font-bold text-[15px] text-[#16151A] mb-5">지역별 장소 수 (Top 5)</h3>
      <div className="flex flex-col gap-3">
        {TOP_REGIONS.map((r) => (
          <div key={r.region} className="flex items-center gap-2.5">
            <span className="text-[12.5px] text-[#6C665B] w-11 text-right flex-shrink-0">{r.region}</span>
            <div className="flex-1 h-4 rounded-full overflow-hidden bg-[#F3EFE6]">
              <div className="h-full rounded-full bg-[#FF5636] transition-all"
                   style={{ width: `${(r.count / max) * 100}%` }} />
            </div>
            <span className="text-[12.5px] font-bold text-[#16151A] w-6 flex-shrink-0">{r.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [refreshing, setRefreshing] = useState(false);

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }

  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col gap-7">

      {/* Date + Refresh */}
      <div className="flex items-center justify-between">
        <p className="text-[13.5px] text-[#8A8478]">2026년 7월 6일 기준</p>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#6C665B] hover:text-[#16151A] transition-colors"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          새로고침
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={MapPin}    label="총 장소 수"           value={STATS.totalPlaces}  color="#FF5636" />
        <StatCard icon={Users}     label="총 사용자 수"          value={STATS.totalUsers}   color="#12BFB6" />
        <StatCard icon={BookOpen}  label="로컬 코스 수"          value={STATS.totalCourses} color="#7B4DFF" />
        <StatCard icon={RefreshCw} label="오늘 업데이트된 장소"  value={STATS.updatedToday} color="#FFC93C"
          sub={`전체의 ${Math.round(STATS.updatedToday / STATS.totalPlaces * 100)}%`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <GradeDistCard />
        <SignupChart />
        <RegionsCard />
      </div>

      {/* Activity log */}
      <div className={CARD}>
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#F0EBDE]">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-[#8A8478]" />
            <h3 className="font-bold text-[15px] text-[#16151A]">최근 활동 로그</h3>
          </div>
          <span className="text-xs text-[#9A9488]">최근 10건</span>
        </div>
        <div>
          {ACTIVITY_LOG.map((log) => {
            const s = ACTION_STYLE[log.type] ?? { label: log.type, color: "#9A9488" };
            return (
              <div key={log.id}
                className="flex items-center gap-4 px-7 py-[14px] border-t border-[#F0EBDE] first:border-t-0 hover:bg-[#FAF8F4] transition-colors">
                <span className="w-[44px] text-xs font-bold flex-shrink-0" style={{ color: s.color }}>{s.label}</span>
                <span className="flex-1 text-[13.5px] text-[#16151A]">{log.action}</span>
                <span className="w-[70px] text-[12.5px] text-[#6C665B]">{log.region}</span>
                <span className="w-[70px] text-right text-xs text-[#B3AC9F] flex-shrink-0">{log.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
