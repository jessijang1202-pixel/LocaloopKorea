"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, MapPin, BookOpen, Users, FileText,
  BarChart2, Settings, X, ChevronRight,
} from "lucide-react";

const NAV = [
  { href: "/admin",           label: "대시보드",  icon: LayoutDashboard, exact: true },
  { href: "/admin/places",    label: "장소 관리", icon: MapPin },
  { href: "/admin/courses",   label: "로컬 코스", icon: BookOpen },
  { href: "/admin/users",     label: "사용자",    icon: Users },
  { href: "/admin/content",   label: "콘텐츠",    icon: FileText },
  { href: "/admin/analytics", label: "분석",      icon: BarChart2 },
  { href: "/admin/settings",  label: "설정",      icon: Settings },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname();

  function isActive(item: typeof NAV[0]) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={[
          "fixed top-0 left-0 z-50 h-full w-[248px] flex flex-col",
          "bg-[#16151A] border-t-[3px] border-t-[#FF5636] transition-transform duration-300",
          "lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-[22px]">
          <div className="flex items-center gap-[11px]">
            <div className="w-[38px] h-[38px] rounded-[11px] bg-[#FF5636] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <div className="leading-tight">
              <div className="text-white font-bold text-[17px] tracking-[-0.3px]">Localoop</div>
              <div className="text-[#FF6A4D] font-bold text-[10px] tracking-[2px]">ADMIN</div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-2.5 px-3 flex flex-col gap-[2px] overflow-y-auto">
          {NAV.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={[
                  "flex items-center gap-3 px-[14px] py-[11px] rounded-[12px] text-sm font-medium transition-colors",
                  active
                    ? "bg-[#FF5636] text-white"
                    : "text-[#9A94A2] hover:text-white hover:bg-white/8",
                ].join(" ")}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight size={14} className="opacity-80" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-5 pb-[22px] pt-4 border-t border-[#26242C]">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-[#6E687A] hover:text-[#9A94A2] transition-colors mb-2"
          >
            <ChevronRight size={12} className="rotate-180" />
            사용자 앱으로 이동
          </Link>
          <div className="text-[11px] text-[#4E4858] mt-1">admin.localoop.kr</div>
        </div>
      </aside>
    </>
  );
}
