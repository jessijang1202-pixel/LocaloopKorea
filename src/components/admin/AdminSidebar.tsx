"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, MapPin, BookOpen, Users, FileText,
  BarChart2, Settings, X, ChevronRight,
} from "lucide-react";

const NAV = [
  { href: "/admin",          label: "대시보드",    icon: LayoutDashboard, exact: true },
  { href: "/admin/places",   label: "장소 관리",   icon: MapPin },
  { href: "/admin/courses",  label: "로컬 코스",   icon: BookOpen },
  { href: "/admin/users",    label: "사용자",      icon: Users },
  { href: "/admin/content",  label: "콘텐츠",      icon: FileText },
  { href: "/admin/analytics",label: "분석",        icon: BarChart2 },
  { href: "/admin/settings", label: "설정",        icon: Settings },
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
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed top-0 left-0 z-50 h-full w-60 flex flex-col",
          "bg-[#16151A] transition-transform duration-300",
          "lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Logo row */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FF5636] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-sm">L</span>
            </div>
            <div className="leading-tight">
              <div className="text-white font-bold text-sm">Localoop</div>
              <div className="text-[#FF8C72] font-bold text-[9px] tracking-widest">ADMIN</div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-0.5 overflow-y-auto">
          {NAV.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={[
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                  active
                    ? "bg-[#FF5636]/15 text-[#FF8C72] border-l-[3px] border-[#FF5636]"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5 border-l-[3px] border-transparent",
                ].join(" ")}
              >
                <Icon size={17} className="flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight size={13} className="opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-5 border-t border-white/8 pt-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white/60 hover:bg-white/5 transition-colors"
          >
            <ChevronRight size={13} className="rotate-180" />
            <span>사용자 앱으로 이동</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
