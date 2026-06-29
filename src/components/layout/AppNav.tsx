"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang, setLang } from "@/lib/lang";
import { useTheme, toggleTheme } from "@/lib/theme";

type Tab = { href: string; icon: string; labelKo: string; labelEn: string };

const TABS: Tab[] = [
  { href: "/map",       icon: "🗺️",  labelKo: "지도",     labelEn: "Map" },
  { href: "/tasks",     icon: "✅",   labelKo: "과제",     labelEn: "Tasks" },
  { href: "/courses",   icon: "🏃",   labelKo: "코스",     labelEn: "Courses" },
  { href: "/community", icon: "👥",   labelKo: "커뮤니티",  labelEn: "Community" },
  { href: "/chat",      icon: "💬",   labelKo: "채팅",     labelEn: "Chat" },
  { href: "/profile",   icon: "👤",   labelKo: "나",       labelEn: "Me" },
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
      {/* PC: icon + label sidebar (168px) */}
      <aside className="ll-sidebar">
        {/* Logo */}
        <div style={{ padding: "16px 14px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "#15b6c1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>L</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Localoop</span>
        </div>

        {/* Nav tabs */}
        <nav style={{ flex: 1, padding: "10px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          {TABS.map((tab) => {
            const active = isActive(tab.href);
            const label = isKo ? tab.labelKo : tab.labelEn;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "0 10px", height: 44, borderRadius: 10, textDecoration: "none",
                  background: active ? "rgba(21,182,193,0.18)" : "transparent",
                  borderLeft: active ? "3px solid #15b6c1" : "3px solid transparent",
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{tab.icon}</span>
                <span style={{ fontSize: 13, fontWeight: active ? 700 : 400, color: active ? "#15b6c1" : "rgba(255,255,255,0.65)", whiteSpace: "nowrap" }}>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Guide link */}
        <div style={{ padding: "0 10px 6px" }}>
          <Link
            href="/guide"
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "0 10px", height: 44, borderRadius: 10, textDecoration: "none",
              background: isActive("/guide") ? "rgba(21,182,193,0.18)" : "transparent",
              borderLeft: isActive("/guide") ? "3px solid #15b6c1" : "3px solid transparent",
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>📖</span>
            <span style={{ fontSize: 13, fontWeight: isActive("/guide") ? 700 : 400, color: isActive("/guide") ? "#15b6c1" : "rgba(255,255,255,0.65)" }}>
              {isKo ? "가이드" : "Guide"}
            </span>
          </Link>
        </div>

        {/* Bottom: theme + lang */}
        <div style={{ padding: "8px 10px 16px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 6 }}>
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? (isKo ? "라이트 모드" : "Light") : (isKo ? "다크 모드" : "Dark")}
            style={{ flex: 1, height: 34, borderRadius: 9, border: "none", background: "rgba(255,255,255,0.08)", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button
            onClick={() => setLang(isKo ? "en" : "ko")}
            title={isKo ? "English" : "한국어"}
            style={{ flex: 1, height: 34, borderRadius: 9, border: "none", background: "rgba(21,182,193,0.14)", cursor: "pointer", fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}
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
