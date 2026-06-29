"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang, setLang } from "@/lib/lang";
import { useTheme, toggleTheme } from "@/lib/theme";

type Tab = { href: string; icon: string; labelKo: string; labelEn: string };

const TABS: Tab[] = [
  { href: "/map",       icon: "🗺️",  labelKo: "지도",    labelEn: "Map" },
  { href: "/tasks",     icon: "✅",   labelKo: "과제",    labelEn: "Tasks" },
  { href: "/courses",   icon: "🏃",   labelKo: "코스",    labelEn: "Courses" },
  { href: "/community", icon: "👥",   labelKo: "커뮤니티", labelEn: "Community" },
  { href: "/chat",      icon: "💬",   labelKo: "채팅",    labelEn: "Chat" },
  { href: "/profile",   icon: "👤",   labelKo: "나",      labelEn: "Me" },
];

export function AppNav() {
  const pathname = usePathname();
  const isKo = useLang();
  const theme = useTheme();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* PC: icon-only sidebar */}
      <aside className="ll-sidebar">
        {/* Logo */}
        <div style={{ padding: "14px 0 12px", display: "flex", justifyContent: "center", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#15b6c1", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>L</span>
          </div>
        </div>

        {/* Nav tabs */}
        <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
          {TABS.map((tab) => {
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                title={isKo ? tab.labelKo : tab.labelEn}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  height: 46, borderRadius: 10, textDecoration: "none",
                  background: active ? "rgba(21,182,193,0.18)" : "transparent",
                  borderLeft: active ? "3px solid #15b6c1" : "3px solid transparent",
                }}
              >
                <span style={{ fontSize: 20 }}>{tab.icon}</span>
              </Link>
            );
          })}
        </nav>

        {/* Guide link */}
        <div style={{ padding: "0 8px 6px" }}>
          <Link
            href="/guide"
            title={isKo ? "가이드" : "Guide"}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: 46, borderRadius: 10, textDecoration: "none",
              background: isActive("/guide") ? "rgba(21,182,193,0.18)" : "transparent",
              borderLeft: isActive("/guide") ? "3px solid #15b6c1" : "3px solid transparent",
            }}
          >
            <span style={{ fontSize: 20 }}>📖</span>
          </Link>
        </div>

        {/* Bottom: theme + lang */}
        <div style={{ padding: "8px 8px 14px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? (isKo ? "라이트 모드" : "Light") : (isKo ? "다크 모드" : "Dark")}
            style={{ width: 46, height: 36, borderRadius: 10, border: "none", background: "rgba(255,255,255,0.07)", cursor: "pointer", fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button
            onClick={() => setLang(isKo ? "en" : "ko")}
            title={isKo ? "English" : "한국어"}
            style={{ width: 46, height: 36, borderRadius: 10, border: "none", background: "rgba(21,182,193,0.12)", cursor: "pointer", fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {isKo ? "EN" : "KO"}
          </button>
        </div>
      </aside>

      {/* Mobile: bottom tab bar */}
      <nav className="ll-bottomnav">
        {TABS.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, padding: "6px 2px", textDecoration: "none", color: active ? "#15b6c1" : "#9BB5B8" }}
            >
              <span style={{ fontSize: 19, lineHeight: 1 }}>{tab.icon}</span>
              <span style={{ fontSize: 8, fontWeight: active ? 700 : 400 }}>{isKo ? tab.labelKo : tab.labelEn}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
