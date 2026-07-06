"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { ToastProvider } from "@/components/admin/Toast";

const PAGE_TITLES: Record<string, string> = {
  "/admin":            "대시보드",
  "/admin/places":     "장소 관리",
  "/admin/courses":    "로컬 코스",
  "/admin/users":      "사용자 관리",
  "/admin/content":    "콘텐츠 관리",
  "/admin/analytics":  "분석",
  "/admin/settings":   "설정",
};

function getTitle(pathname: string): string {
  if (pathname === "/admin") return "대시보드";
  const match = Object.keys(PAGE_TITLES).find(
    k => k !== "/admin" && pathname.startsWith(k)
  );
  return match ? PAGE_TITLES[match] : "관리자";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Login page gets no shell
  if (pathname === "/admin/login") {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-gray-50">{children}</div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-[#F3EFE6]">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminTopbar
            title={getTitle(pathname)}
            adminName="관리자"
            onMenuToggle={() => setSidebarOpen(v => !v)}
          />
          <main className="flex-1 overflow-y-auto px-10 py-8">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
