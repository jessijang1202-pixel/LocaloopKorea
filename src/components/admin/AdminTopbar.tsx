"use client";

import { useState } from "react";
import { Menu, Bell, LogOut, User, ChevronDown } from "lucide-react";

interface Props {
  title: string;
  adminName?: string;
  onMenuToggle: () => void;
}

export function AdminTopbar({ title, adminName = "관리자", onMenuToggle }: Props) {
  const [dropOpen, setDropOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 flex-shrink-0 relative z-30">
      {/* Hamburger (mobile) */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
      >
        <Menu size={20} />
      </button>

      {/* Title */}
      <h1 className="font-bold text-gray-900 text-base flex-1 truncate">{title}</h1>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(v => !v); setDropOpen(false); }}
            className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FF5636]" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-10 w-72 bg-white rounded-xl border border-gray-200 shadow-xl z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <span className="font-semibold text-sm text-gray-800">알림</span>
              </div>
              <div className="py-2">
                <div className="px-4 py-2.5 hover:bg-gray-50">
                  <p className="text-xs font-medium text-gray-800">데이터 수집 완료</p>
                  <p className="text-xs text-gray-400 mt-0.5">이태원 · 장소 12개 업데이트 · 방금 전</p>
                </div>
                <div className="px-4 py-2.5 hover:bg-gray-50">
                  <p className="text-xs font-medium text-gray-800">신규 사용자 가입</p>
                  <p className="text-xs text-gray-400 mt-0.5">오늘 신규 가입 8명 · 1시간 전</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin profile dropdown */}
        <div className="relative">
          <button
            onClick={() => { setDropOpen(v => !v); setNotifOpen(false); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[#FF5636] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{adminName[0]}</span>
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{adminName}</span>
            <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
          </button>

          {dropOpen && (
            <div className="absolute right-0 top-10 w-44 bg-white rounded-xl border border-gray-200 shadow-xl z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-800">{adminName}</p>
                <p className="text-xs text-gray-400">admin</p>
              </div>
              <div className="py-1">
                <a href="/admin/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <User size={14} /> 프로필 설정
                </a>
                <form action="/auth/signout" method="post">
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                    <LogOut size={14} /> 로그아웃
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click-outside to close dropdowns */}
      {(dropOpen || notifOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setDropOpen(false); setNotifOpen(false); }} />
      )}
    </header>
  );
}
