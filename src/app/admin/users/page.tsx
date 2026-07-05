"use client";

import { useState, useMemo } from "react";
import { Search, Download, ShieldCheck, ShieldOff, UserX, UserCheck, X } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/Toast";
import type { AdminUser } from "@/types/admin";

const NATIONALITIES = ["미국", "영국", "일본", "중국", "프랑스", "독일", "베트남", "태국", "호주", "캐나다"];
const PURPOSES = ["취업", "유학", "관광", "거주", "비즈니스"];

const MOCK_USERS: AdminUser[] = Array.from({ length: 35 }, (_, i) => ({
  id: `u${i + 1}`,
  display_name: ["Alex Johnson", "Yuki Tanaka", "Maria Santos", "James Brown", "Emma Wilson"][i % 5],
  email: `user${i + 1}@example.com`,
  avatar_url: null,
  nationality: NATIONALITIES[i % NATIONALITIES.length],
  user_type: i % 3 === 0 ? "korean" : "foreigner",
  role: i === 0 ? "admin" : "user",
  onboarding_done: i % 5 !== 0,
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  last_sign_in_at: new Date(Date.now() - i * 3600000).toISOString(),
  is_suspended: i % 8 === 0,
}));

function UserDetailModal({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const { toast } = useToast();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={18} /></button>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full bg-[#FF5636] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {user.display_name[0]}
          </div>
          <div>
            <p className="font-bold text-gray-900">{user.display_name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            ["국적", user.nationality ?? "-"],
            ["역할", user.role],
            ["유형", user.user_type === "foreigner" ? "외국인" : "한국인"],
            ["온보딩", user.onboarding_done ? "완료" : "미완료"],
            ["가입일", new Date(user.created_at).toLocaleDateString("ko-KR")],
            ["최근 로그인", user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString("ko-KR") : "-"],
          ].map(([label, val]) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
              <p className="text-sm font-semibold text-gray-800">{val}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => { toast(`${user.display_name} 계정을 ${user.is_suspended ? "복구" : "정지"}했습니다.`, user.is_suspended ? "success" : "error"); onClose(); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 ${user.is_suspended ? "bg-green-500 text-white hover:bg-green-600" : "bg-red-50 text-red-500 border border-red-200 hover:bg-red-100"}`}>
            {user.is_suspended ? <><UserCheck size={14} /> 정지 해제</> : <><UserX size={14} /> 계정 정지</>}
          </button>
          <button onClick={() => { toast(`${user.display_name}의 권한을 변경했습니다.`); onClose(); }}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200">
            {user.role === "admin" ? <><ShieldOff size={14} /> 관리자 해제</> : <><ShieldCheck size={14} /> 관리자 부여</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [users] = useState<AdminUser[]>(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [filterNat, setFilterNat] = useState("전체");
  const [filterStatus, setFilterStatus] = useState("전체");
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  const filtered = useMemo(() => {
    let list = users;
    if (search) list = list.filter(u => u.display_name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search));
    if (filterNat !== "전체") list = list.filter(u => u.nationality === filterNat);
    if (filterStatus === "활성") list = list.filter(u => !u.is_suspended);
    if (filterStatus === "정지") list = list.filter(u => u.is_suspended);
    return list;
  }, [users, search, filterNat, filterStatus]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  function exportCSV() {
    const rows = [
      ["이름", "이메일", "국적", "유형", "가입일", "상태"],
      ...filtered.map(u => [u.display_name, u.email, u.nationality ?? "", u.user_type, new Date(u.created_at).toLocaleDateString(), u.is_suspended ? "정지" : "활성"]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    a.download = `users_${Date.now()}.csv`;
    a.click();
  }

  return (
    <>
      {selected && <UserDetailModal user={selected} onClose={() => setSelected(null)} />}

      <div className="p-5 max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-52">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="이름, 이메일로 검색"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF5636]/60" />
          </div>
          <select value={filterNat} onChange={e => { setFilterNat(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none">
            <option>전체</option>
            {NATIONALITIES.map(n => <option key={n}>{n}</option>)}
          </select>
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none">
            {["전체", "활성", "정지"].map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 ml-auto">
            <Download size={14} /> CSV 내보내기
          </button>
        </div>

        <p className="text-xs text-gray-400 mb-3">총 {filtered.length}명</p>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">이름</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden sm:table-cell">이메일</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden md:table-cell">국적</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden lg:table-cell">가입일</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden lg:table-cell">최근 로그인</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">상태</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50 cursor-pointer" onClick={() => setSelected(user)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#FF5636]/15 flex items-center justify-center text-[#FF5636] text-xs font-bold flex-shrink-0">
                          {user.display_name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{user.display_name}</p>
                          {user.role === "admin" && <span className="text-[9px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded font-bold">ADMIN</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden sm:table-cell">{user.email}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{user.nationality ?? "-"}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 hidden lg:table-cell">
                      {new Date(user.created_at).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 hidden lg:table-cell">
                      {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString("ko-KR") : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${user.is_suspended ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"}`}>
                        {user.is_suspended ? "정지" : "활성"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs text-[#FF5636] font-medium">상세보기</span>
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
                <button disabled={page === 1} onClick={() => setPage(v => v - 1)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs disabled:opacity-30 hover:bg-gray-50">이전</button>
                <button disabled={page === totalPages} onClick={() => setPage(v => v + 1)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs disabled:opacity-30 hover:bg-gray-50">다음</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
