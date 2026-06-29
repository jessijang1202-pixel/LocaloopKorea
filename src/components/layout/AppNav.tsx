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
      {/* PC: left sidebar (hidden on mobile via CSS) */}
      <aside className="ll-sidebar">
        {/* Logo */}
        <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
            Localoop<span style={{ color: "#15b6c1" }}>Korea</span>
          </span>
        </div>

        {/* Nav tabs */}
        <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          {TABS.map((tab) => {
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 10, textDecoration: "none",
                  background: active ? "rgba(21,182,193,0.18)" : "transparent",
                  color: active ? "#fff" : "rgba(255,255,255,0.52)",
                  fontSize: 13, fontWeight: active ? 700 : 400,
                  borderLeft: active ? "3px solid #15b6c1" : "3px solid transparent",
                }}
              >
                <span style={{ fontSize: 17, width: 22, textAlign: "center", flexShrink: 0 }}>{tab.icon}</span>
                <span>{isKo ? tab.labelKo : tab.labelEn}</span>
              </Link>
            );
          })}
        </nav>

        {/* Guide link */}
        <div style={{ padding: "0 10px 8px" }}>
          <Link
            href="/guide"
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 10, textDecoration: "none",
              background: isActive("/guide") ? "rgba(21,182,193,0.18)" : "transparent",
              color: isActive("/guide") ? "#fff" : "rgba(255,255,255,0.52)",
              fontSize: 13, fontWeight: isActive("/guide") ? 700 : 400,
              borderLeft: isActive("/guide") ? "3px solid #15b6c1" : "3px solid transparent",
            }}
          >
            <span style={{ fontSize: 17, width: 22, textAlign: "center", flexShrink: 0 }}>📖</span>
            <span>{isKo ? "가이드" : "Guide"}</span>
          </Link>
        </div>

        {/* Bottom: theme + lang */}
        <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark/light mode"
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 12px", borderRadius: 10, border: "none",
              background: "rgba(255,255,255,0.07)", cursor: "pointer",
              color: "rgba(255,255,255,0.7)", fontSize: 13,
            }}
          >
            <span style={{ fontSize: 16 }}>{theme === "dark" ? "☀️" : "🌙"}</span>
            <span>{theme === "dark" ? (isKo ? "라이트 모드" : "Light mode") : (isKo ? "다크 모드" : "Dark mode")}</span>
          </button>
          <button
            onClick={() => setLang(isKo ? "en" : "ko")}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 12px", borderRadius: 10, border: "none",
              background: "rgba(21,182,193,0.12)", cursor: "pointer",
              color: "rgba(255,255,255,0.7)", fontSize: 13,
            }}
          >
            <span style={{ fontSize: 16 }}>🌐</span>
            <span>{isKo ? "English" : "한국어"}</span>
          </button>
        </div>
      </aside>

      {/* Mobile: bottom tab bar (all 6 tabs including chat) */}
      <nav className="ll-bottomnav">
        {TABS.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                padding: "6px 2px",
                textDecoration: "none",
                color: active ? "#15b6c1" : "#9BB5B8",
              }}
            >
              <span style={{ fontSize: 19, lineHeight: 1 }}>{tab.icon}</span>
              <span style={{ fontSize: 8, fontWeight: active ? 700 : 400 }}>
                {isKo ? tab.labelKo : tab.labelEn}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
