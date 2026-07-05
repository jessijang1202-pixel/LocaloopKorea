"use client";

import { useState, useEffect } from "react";
import { MapPin, Users, BookOpen, RefreshCw, TrendingUp, Activity } from "lucide-react";

/* ── Mock data (replace with real Supabase queries) ─────────── */
const STATS = {
  totalPlaces:  247,
  totalUsers:   1832,
  totalCourses: 34,
  updatedToday: 18,
};

const GRADE_DIST = { S: 42, A: 88, B: 71, C: 34, D: 12 };
const GRADE_COLORS: Record<string, string> = {
  S: "#FF5636", A: "#12BFB6", B: "#7B4DFF", C: "#FFC93C", D: "#9A9488",
};

const SIGNUPS_30 = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  count: Math.floor(Math.random() * 80) + 10,
}));

const TOP_REGIONS = [
  { region: "이태원",  count: 58 },
  { region: "홍대",    count: 47 },
  { region: "강남",    count: 39 },
  { region: "명동",    count: 31 },
  { region: "신촌",    count: 22 },
];

const ACTIVITY_LOG = [
  { id: "1", time: "3분 전",   region: "이태원",  action: "데이터 수집",   type: "collect" },
  { id: "2", time: "14분 전",  region: "홍대",    action: "등급 수정",     type: "edit" },
  { id: "3", time: "1시간 전", region: "강남",    action: "신규 장소 추가", type: "add" },
  { id: "4", time: "2시간 전", region: "명동",    action: "데이터 수집",   type: "collect" },
  { id: "5", time: "3시간 전", region: "이태원",  action: "장소 삭제",     type: "delete" },
  { id: "6", time: "5시간 전", region: "신촌",    action: "등급 수정",     type: "edit" },
  { id: "7", time: "어제",     region: "홍대",    action: "신규 장소 추가", type: "add" },
  { id: "8", time: "어제",     region: "이태원",  action: "데이터 수집",   type: "collect" },
  { id: "9", time: "2일 전",   region: "강남",    action: "등급 수정",     type: "edit" },
  { id:"10", time: "2일 전",   region: "명동",    action: "신규 장소 추가", type: "add" },
];

/* ── Sub-components ─────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: number; sub?: string; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}
           style={{ background: `${color}18` }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function GradeBarChart() {
  const total = Object.values(GRADE_DIST).reduce((a, b) => a + b, 0);
  const maxVal = Math.max(...Object.values(GRADE_DIST));

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <h3 className="font-semibold text-gray-800 text-sm mb-4">등급 분포</h3>
      <div className="flex items-end gap-3 h-32">
        {Object.entries(GRADE_DIST).map(([grade, count]) => {
          const pct = (count / maxVal) * 100;
          return (
            <div key={grade} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500 font-medium">{count}</span>
              <div className="w-full rounded-t-lg transition-all" style={{
                height: `${pct}%`, minHeight: 4,
                background: GRADE_COLORS[grade],
                opacity: 0.85,
              }} />
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                   style={{ background: GRADE_COLORS[grade] }}>
                {grade}
              </div>
              <span className="text-[10px] text-gray-400">{Math.round(count/total*100)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SignupLineChart() {
  const max = Math.max(...SIGNUPS_30.map(d => d.count));
  const w = 320, h = 80;
  const pts = SIGNUPS_30.map((d, i) => {
    const x = (i / (SIGNUPS_30.length - 1)) * w;
    const y = h - (d.count / max) * h;
    return `${x},${y}`;
  }).join(" ");

  const areaPath = `M0,${h} L${pts.split(" ").map(p => p).join(" L")} L${w},${h} Z`;

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 text-sm">신규 가입 (30일)</h3>
        <span className="text-xs text-gray-400">총 {SIGNUPS_30.reduce((a,d)=>a+d.count,0).toLocaleString()}명</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20 overflow-visible">
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#FF5636" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="#FF5636" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#grad)" />
        <polyline points={pts} fill="none" stroke="#FF5636" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        <span>30일 전</span><span>오늘</span>
      </div>
    </div>
  );
}

function RegionsChart() {
  const max = TOP_REGIONS[0].count;
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <h3 className="font-semibold text-gray-800 text-sm mb-4">지역별 장소 수 (Top 5)</h3>
      <div className="flex flex-col gap-3">
        {TOP_REGIONS.map((r) => (
          <div key={r.region} className="flex items-center gap-3">
            <span className="text-xs text-gray-600 w-12 text-right flex-shrink-0">{r.region}</span>
            <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(r.count / max) * 100}%`, background: "#FF5636" }}
              />
            </div>
            <span className="text-xs font-semibold text-gray-700 w-6 flex-shrink-0">{r.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityTypeChip({ type }: { type: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    collect: { label: "수집",   cls: "bg-blue-50 text-blue-600" },
    edit:    { label: "수정",   cls: "bg-amber-50 text-amber-600" },
    add:     { label: "추가",   cls: "bg-green-50 text-green-600" },
    delete:  { label: "삭제",   cls: "bg-red-50 text-red-600" },
  };
  const { label, cls } = map[type] ?? { label: type, cls: "bg-gray-100 text-gray-600" };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
  );
}

/* ── Page ────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const [refreshing, setRefreshing] = useState(false);

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }

  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col gap-6">

      {/* Header — date + refresh only (title shown in topbar) */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">2025년 7월 5일 기준</p>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          새로고침
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={MapPin}    label="총 장소 수"           value={STATS.totalPlaces}  color="#FF5636" />
        <StatCard icon={Users}     label="총 사용자 수"          value={STATS.totalUsers}   color="#12BFB6" />
        <StatCard icon={BookOpen}  label="로컬 코스 수"          value={STATS.totalCourses} color="#7B4DFF" />
        <StatCard icon={RefreshCw} label="오늘 업데이트된 장소" value={STATS.updatedToday} color="#FFC93C"
          sub={`전체의 ${Math.round(STATS.updatedToday/STATS.totalPlaces*100)}%`}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GradeBarChart />
        <SignupLineChart />
        <RegionsChart />
      </div>

      {/* Activity log */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
          <Activity size={16} className="text-gray-400" />
          <h3 className="font-semibold text-gray-800 text-sm">최근 활동 로그</h3>
          <span className="ml-auto text-xs text-gray-400">최근 10건</span>
        </div>
        <div className="divide-y divide-gray-50">
          {ACTIVITY_LOG.map((log) => (
            <div key={log.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/50 transition-colors">
              <ActivityTypeChip type={log.type} />
              <span className="text-sm text-gray-700 font-medium">{log.action}</span>
              <span className="text-sm text-gray-400">{log.region}</span>
              <span className="ml-auto text-xs text-gray-400 flex-shrink-0">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
