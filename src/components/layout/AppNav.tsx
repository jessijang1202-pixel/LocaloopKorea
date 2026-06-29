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

/* Bottom nav shows 5 tabs (chat accessed via community) */
const BOTTOM_TABS = TABS.filter((t) => t.href !== "/chat");

export function AppNav() {
  const pathname = usePathname();
  const isKo = useLang();
  const theme = useTheme();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* PC: horizontal top nav bar (hidden on mobile via .ll-topnav CSS) */}
      <header className="ll-topnav">
        {/* Left: logo + nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: "#fff", marginRight: 16, whiteSpace: "nowrap", letterSpacing: "-0.02em" }}>
            Localoop<span style={{ color: "#15b6c1" }}>Korea</span>
          </span>
          {TABS.map((tab) => {
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 13px", borderRadius: 8, textDecoration: "none",
                  background: active ? "rgba(21,182,193,0.16)" : "transparent",
                  color: active ? "#fff" : "rgba(255,255,255,0.52)",
                  fontSize: 13, fontWeight: active ? 600 : 400,
                  borderBottom: active ? "2px solid #15b6c1" : "2px solid transparent",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ fontSize: 15 }}>{tab.icon}</span>
                <span>{isKo ? tab.labelKo : tab.labelEn}</span>
              </Link>
            );
          })}
        </div>

        {/* Right: theme toggle + lang + login */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark/light mode"
            style={{
              background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 16, lineHeight: 1,
            }}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button
            onClick={() => setLang(isKo ? "en" : "ko")}
            style={{
              background: "rgba(21,182,193,0.14)", border: "1.5px solid rgba(21,182,193,0.38)",
              borderRadius: 8, padding: "6px 13px", color: "#fff",
              fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            {isKo ? "EN" : "한국어"}
          </button>
          <Link
            href="/login"
            style={{
              background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.20)",
              borderRadius: 8, padding: "6px 13px", color: "rgba(255,255,255,0.78)",
              fontSize: 12, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap",
            }}
          >
            {isKo ? "로그인" : "Login"}
          </Link>
        </div>
      </header>

      {/* Mobile: bottom tab bar */}
      <nav className="ll-bottomnav">
        {BOTTOM_TABS.map((tab) => {
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
                padding: "6px 4px",
                textDecoration: "none",
                color: active ? "#15b6c1" : "#9BB5B8",
              }}
            >
              <span style={{ fontSize: 21, lineHeight: 1 }}>{tab.icon}</span>
              <span style={{ fontSize: 9, fontWeight: active ? 700 : 400 }}>
                {isKo ? tab.labelKo : tab.labelEn}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
