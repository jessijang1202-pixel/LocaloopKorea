"use client";

import { useState, useMemo } from "react";
import { Search, Plus, ToggleLeft, ToggleRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { AdminCourse } from "@/types/admin";

const THEMES = ["음식 탐방", "카페 투어", "역사 문화", "쇼핑", "야경", "자연", "로컬 마켓"];
const LEVEL_KO: Record<string, string> = { beginner: "초급", intermediate: "중급", advanced: "고급" };
const LEVEL_COLORS: Record<string, string> = { beginner: "bg-green-100 text-green-700", intermediate: "bg-amber-100 text-amber-700", advanced: "bg-red-100 text-red-700" };

const MOCK_COURSES: AdminCourse[] = Array.from({ length: 22 }, (_, i) => ({
  id: `c${i + 1}`,
  name_ko: ["이태원 로컬 먹방", "홍대 카페 투어", "강남 쇼핑 루트", "명동 한국 문화", "성수 힙스터 코스"][i % 5],
  name_en: ["Itaewon Local Food", "Hongdae Café Tour", "Gangnam Shopping", "Myeongdong Culture", "Seongsu Hipster"][i % 5],
  description_ko: "이 코스는 외국인이 진짜 로컬처럼 즐길 수 있는 최고의 루트입니다.",
  description_en: "The best route for foreigners to experience Korea like a true local.",
  region: ["이태원", "홍대", "강남", "명동", "성수"][i % 5],
  theme: THEMES[i % THEMES.length],
  language_level: (["beginner", "intermediate", "advanced"] as const)[i % 3],
  budget_min: 20000 + i * 5000,
  budget_max: 50000 + i * 5000,
  duration_minutes: 120 + i * 30,
  image_url: null,
  status: i % 4 === 0 ? "inactive" : "active",
  place_count: 3 + (i % 5),
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  updated_at: new Date(Date.now() - i * 3600000).toISOString(),
}));

export default function CoursesPage() {
  const [courses, setCourses] = useState<AdminCourse[]>(MOCK_COURSES);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("전체");
  const [filterLevel, setFilterLevel] = useState("전체");
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  const filtered = useMemo(() => {
    let list = courses;
    if (search) list = list.filter(c => c.name_ko.includes(search));
    if (filterStatus !== "전체") list = list.filter(c => (filterStatus === "활성" ? c.status === "active" : c.status === "inactive"));
    if (filterLevel !== "전체") list = list.filter(c => c.language_level === filterLevel);
    return list;
  }, [courses, search, filterStatus, filterLevel]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function toggleStatus(id: string) {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c));
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-52">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="코스명으로 검색"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF5636]/60" />
        </div>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none">
          {["전체", "활성", "비활성"].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filterLevel} onChange={e => { setFilterLevel(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none">
          <option value="전체">전체 수준</option>
          {Object.entries(LEVEL_KO).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <Link href="/admin/courses/new"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#FF5636] text-white text-sm font-semibold hover:bg-[#e04523] ml-auto">
          <Plus size={14} /> 코스 추가
        </Link>
      </div>

      <p className="text-xs text-gray-400 mb-3">총 {filtered.length}개 코스</p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs">코스명</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs hidden sm:table-cell">테마</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs hidden md:table-cell">수준</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs hidden md:table-cell">예산</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs hidden lg:table-cell">장소 수</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs">상태</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map(course => (
                <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{course.name_ko}</div>
                    <div className="text-xs text-gray-400">{course.region}</div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-lg">{course.theme}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {course.language_level && (
                      <span className={`text-xs px-2 py-1 rounded-lg font-medium ${LEVEL_COLORS[course.language_level]}`}>
                        {LEVEL_KO[course.language_level]}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-600">
                    ₩{(course.budget_min ?? 0).toLocaleString()} ~ ₩{(course.budget_max ?? 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-600">{course.place_count}개 장소</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(course.id)} className="flex items-center gap-1 text-xs font-medium">
                      {course.status === "active"
                        ? <><ToggleRight size={18} className="text-green-500" /><span className="text-green-600 hidden sm:block">활성</span></>
                        : <><ToggleLeft size={18} className="text-gray-300" /><span className="text-gray-400 hidden sm:block">비활성</span></>
                      }
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/courses/${course.id}`}
                      className="inline-flex items-center gap-1 text-xs text-[#FF5636] font-medium hover:underline">
                      편집 <ChevronRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">{page}/{totalPages} 페이지</span>
            <div className="flex gap-1">
              <button disabled={page === 1} onClick={() => setPage(v => v - 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs disabled:opacity-30 hover:bg-gray-50">이전</button>
              <button disabled={page === totalPages} onClick={() => setPage(v => v + 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs disabled:opacity-30 hover:bg-gray-50">다음</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
