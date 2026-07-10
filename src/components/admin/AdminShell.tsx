"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PinIcon, BookIcon, UsersIcon } from "@/components/icons";

const NAV = [
  {
    href: "/admin", label: "대시보드", exact: true,
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: "/admin/places", label: "장소 관리",
    icon: <PinIcon size={18} />,
  },
  {
    href: "/admin/grading", label: "등급 엔진",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" />
      </svg>
    ),
  },
  {
    href: "/admin/courses", label: "로컬 코스",
    icon: <BookIcon size={18} />,
  },
  {
    href: "/admin/users", label: "사용자",
    icon: <UsersIcon size={18} />,
  },
  {
    href: "/admin/content", label: "콘텐츠",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    href: "/admin/analytics", label: "분석",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    ),
  },
  {
    href: "/admin/settings", label: "설정",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
];

const PAGE_TITLES: Record<string, string> = {
  "/admin": "대시보드",
  "/admin/places": "장소 관리",
  "/admin/grading": "등급 엔진",
  "/admin/courses": "로컬 코스",
  "/admin/users": "사용자 관리",
  "/admin/content": "콘텐츠 관리",
  "/admin/analytics": "분석",
  "/admin/settings": "설정",
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const title =
    PAGE_TITLES[pathname] ??
    Object.entries(PAGE_TITLES).find(([k]) => k !== "/admin" && pathname.startsWith(k))?.[1] ??
    "관리자";

  return (
    <>
      <style>{`
        .admin-nav-item { transition: background 0.15s, color 0.15s; }
        .admin-nav-item:hover { background: rgba(255,255,255,0.08) !important; color: #fff !important; }
        .admin-nav-item:hover svg { color: #fff !important; }
        .admin-topbar-btn:hover { background: #EAE4D8 !important; }
        .admin-pill:hover { background: #EAE4D8 !important; }
        .admin-row:hover { background: #FAF8F4; }
        @media (max-width: 1023px) { .admin-sidebar { display: none !important; } }
      `}</style>

      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#F3EFE6" }}>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div onClick={() => setMobileOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.45)" }} />
        )}

        {/* Sidebar */}
        <aside className="admin-sidebar" style={{
          width: 248, flexShrink: 0, background: "#16151A",
          borderTop: "3px solid #FF5636", display: "flex", flexDirection: "column",
          zIndex: 50, overflowY: "auto",
        }}>
          {/* Logo */}
          <div style={{ padding: "22px 20px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11, background: "#FF5636",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 18, lineHeight: 1 }}>L</span>
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, lineHeight: "1.2" }}>Localoop</div>
              <div style={{ color: "#FF6A4D", fontWeight: 700, fontSize: 10, letterSpacing: "2px" }}>ADMIN</div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "4px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}
                  className={active ? undefined : "admin-nav-item"}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "11px 14px", borderRadius: 12, textDecoration: "none",
                    background: active ? "#FF5636" : "transparent",
                    color: active ? "#fff" : "#9A94A2",
                    fontSize: 14, fontWeight: 500,
                  }}>
                  <span style={{ flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {active && (
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom */}
          <div style={{ padding: "16px 20px 22px", borderTop: "1px solid #26242C" }}>
            <div style={{ fontSize: 11, color: "#6E687A" }}>admin.localoop.kr</div>
            <div style={{ fontSize: 11, color: "#4E4858", marginTop: 2 }}>v2.4.0</div>
          </div>
        </aside>

        {/* Right side */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          {/* Topbar */}
          <header style={{
            height: 68, background: "#fff", borderBottom: "1px solid #E9E3D6",
            display: "flex", alignItems: "center", padding: "0 32px", gap: 16,
            flexShrink: 0, zIndex: 30,
          }}>
            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(v => !v)}
              className="admin-topbar-btn"
              style={{
                display: "none", padding: "6px", borderRadius: 8, border: "none",
                cursor: "pointer", background: "transparent", color: "#6C665B",
              }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <h1 style={{
              flex: 1, margin: 0, fontWeight: 700, fontSize: 21,
              color: "#16151A", letterSpacing: "-0.4px", fontFamily: "'Space Grotesk', sans-serif",
            }}>
              {title}
            </h1>

            {/* Bell */}
            <button className="admin-topbar-btn" style={{
              width: 38, height: 38, borderRadius: 11, background: "#F2EDE4",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#6C665B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span style={{
                position: "absolute", top: 9, right: 9,
                width: 7, height: 7, borderRadius: "50%",
                background: "#FF5636", border: "1.5px solid #fff",
              }} />
            </button>

            {/* Admin pill */}
            <button className="admin-pill" style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 12px 6px 8px", borderRadius: 999,
              background: "#F2EDE4", border: "none", cursor: "pointer",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", background: "#7B4DFF",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>관</span>
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "#16151A" }}>관리자</span>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#9A9488" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </header>

          {/* Page content */}
          <main style={{ flex: 1, overflowY: "auto", padding: "28px 32px 48px" }}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
