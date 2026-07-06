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
    <header className="h-[68px] bg-white border-b border-[#E9E3D6] flex items-center px-8 gap-4 flex-shrink-0 relative z-30">
      {/* Hamburger (mobile) */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-1.5 rounded-lg hover:bg-[#F3EFE6] text-[#6C665B]"
      >
        <Menu size={20} />
      </button>

      {/* Title */}
      <h1 className="font-bold text-[21px] tracking-[-0.4px] text-[#16151A] flex-1 truncate"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {title}
      </h1>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(v => !v); setDropOpen(false); }}
            className="relative w-[38px] h-[38px] rounded-[11px] bg-[#F3EFE6] flex items-center justify-center hover:bg-[#EAE4D8] transition-colors"
          >
            <Bell size={18} className="text-[#6C665B]" />
            <span className="absolute top-[9px] right-[9px] w-[7px] h-[7px] rounded-full bg-[#FF5636] border-[1.5px] border-white" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-11 w-72 bg-white rounded-[16px] border border-[#E9E3D6] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.18)] z-50">
              <div className="px-4 py-3 border-b border-[#F0EBDE]">
                <span className="font-semibold text-sm text-[#16151A]">알림</span>
              </div>
              <div className="py-2">
                <div className="px-4 py-2.5 hover:bg-[#FAF8F4] rounded-lg mx-1">
                  <p className="text-xs font-semibold text-[#16151A]">데이터 수집 완료</p>
                  <p className="text-xs text-[#9A9488] mt-0.5">이태원 · 장소 12개 업데이트 · 방금 전</p>
                </div>
                <div className="px-4 py-2.5 hover:bg-[#FAF8F4] rounded-lg mx-1">
                  <p className="text-xs font-semibold text-[#16151A]">신규 사용자 가입</p>
                  <p className="text-xs text-[#9A9488] mt-0.5">오늘 신규 가입 8명 · 1시간 전</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin profile dropdown */}
        <div className="relative">
          <button
            onClick={() => { setDropOpen(v => !v); setNotifOpen(false); }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#F3EFE6] hover:bg-[#EAE4D8] transition-colors"
          >
            <div className="w-[28px] h-[28px] rounded-full bg-[#7B4DFF] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{adminName[0]}</span>
            </div>
            <span className="text-[13.5px] font-semibold text-[#16151A]">{adminName}</span>
            <ChevronDown size={14} className="text-[#9A9488]" />
          </button>

          {dropOpen && (
            <div className="absolute right-0 top-11 w-44 bg-white rounded-[16px] border border-[#E9E3D6] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.18)] z-50">
              <div className="px-4 py-3 border-b border-[#F0EBDE]">
                <p className="text-xs font-semibold text-[#16151A]">{adminName}</p>
                <p className="text-xs text-[#9A9488]">admin</p>
              </div>
              <div className="py-1">
                <a href="/admin/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#16151A] hover:bg-[#FAF8F4]">
                  <User size={14} /> 프로필 설정
                </a>
                <form action="/auth/signout" method="post">
                  <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#FF5636] hover:bg-[#FFF0EC]">
                    <LogOut size={14} /> 로그아웃
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {(dropOpen || notifOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setDropOpen(false); setNotifOpen(false); }} />
      )}
    </header>
  );
}
