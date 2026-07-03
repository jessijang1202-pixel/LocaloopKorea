"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang, setLang } from "@/lib/lang";
import { useTheme, toggleTheme } from "@/lib/theme";

type Tab = { href: string; icon: string; labelKo: string; labelEn: string };

const SIDEBAR_TABS: Tab[] = [
  { href: "/map",       icon: "map",       labelKo: "지도",     labelEn: "Map" },
  { href: "/tasks",     icon: "tasks",     labelKo: "태스크",   labelEn: "Tasks" },
  { href: "/courses",   icon: "courses",   labelKo: "코스",     labelEn: "Courses" },
  { href: "/community", icon: "community", labelKo: "커뮤니티",  labelEn: "Community" },
  { href: "/guide",     icon: "culture",   labelKo: "가이드",   labelEn: "Guide" },
  { href: "/profile",   icon: "profile",   labelKo: "나",       labelEn: "Me" },
];

// 5 tabs on mobile — chat embedded in community, profile via sidebar on PC
const BOTTOM_TABS: Tab[] = SIDEBAR_TABS.filter(t => t.href !== "/profile");

function TabIcon({ name, size = 22 }: { name: string; size?: number }) {
  const base = { width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "map") return (
    <svg viewBox="0 0 24 24" {...base}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
  if (name === "tasks") return (
    <svg viewBox="0 0 24 24" {...base}>
      <rect x="4" y="3" width="16" height="18" rx="2.5" />
      <path d="M8 9h8M8 13h5M8 17h3" />
      <path d="M9 3a3 3 0 006 0" />
    </svg>
  );
  if (name === "courses") return (
    <svg viewBox="0 0 24 24" {...base}>
      <path d="M8 21h8M12 17v4M5 4h14l-1.5 8a5.5 5.5 0 01-11 0L5 4zM3 4h3M21 4h-3" />
    </svg>
  );
  if (name === "community") return (
    <svg viewBox="0 0 24 24" {...base}>
      <circle cx="9" cy="7" r="3" />
      <path d="M3 21v-2a5 5 0 015-5h4a5 5 0 015 5v2" />
      <circle cx="17" cy="7" r="2.5" />
      <path d="M21 21v-2a4 4 0 00-3-3.85" />
    </svg>
  );
  if (name === "chat") return (
    <svg viewBox="0 0 24 24" {...base}>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      <circle cx="9" cy="11" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="11" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15" cy="11" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
  if (name === "culture") return (
    <svg viewBox="0 0 24 24" {...base}>
      <path d="M17 8C8 10 5.9 16.17 3.82 19.82" />
      <path d="M21 3A17 17 0 003.82 19.82" />
      <path d="M3.82 19.82L4 21" />
    </svg>
  );
  return null;
}

export function AppNav() {
  const pathname = usePathname();
  const isKo = useLang();
  const theme = useTheme();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* PC: sidebar — Seoul Pop design */}
      <aside className="ll-sidebar">
        {/* Logo */}
        <Link href="/map" style={{ textDecoration: "none", padding: "18px 14px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,86,54,0.12)", flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: "linear-gradient(135deg, #FF5636 0%, #c43e2a 100%)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            boxShadow: "0 0 0 3px rgba(255,86,54,0.25)",
          }}>
            <span style={{ fontSize: 15, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>L</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
            <span style={{ fontSize: 16, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>Localoop</span>
            <span style={{ fontSize: 10, fontWeight: 800, color: "#FF6A4D", letterSpacing: "0.08em" }}>KOREA</span>
          </div>
        </Link>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "10px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          {SIDEBAR_TABS.map((tab) => {
            const active = isActive(tab.href);
            const label = isKo ? tab.labelKo : tab.labelEn;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  display: "flex", alignItems: "center",
                  padding: "0 14px", height: 44, borderRadius: 10, textDecoration: "none",
                  background: active ? "rgba(255,86,54,0.16)" : "transparent",
                  borderLeft: active ? "3px solid #FF6A4D" : "3px solid transparent",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: active ? 700 : 400, color: active ? "#FF8C72" : "rgba(255,244,240,0.52)", whiteSpace: "nowrap" }}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div style={{ padding: "8px 10px 18px", borderTop: "1px solid rgba(255,86,54,0.10)", display: "flex", gap: 6 }}>
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? (isKo ? "라이트 모드" : "Light") : (isKo ? "다크 모드" : "Dark")}
            style={{ flex: 1, height: 34, borderRadius: 9, border: "1px solid rgba(255,86,54,0.18)", background: "rgba(255,255,255,0.06)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,244,240,0.8)" }}
          >
            {theme === "dark" ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="5"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
            )}
          </button>
          <button
            onClick={() => setLang(isKo ? "en" : "ko")}
            title={isKo ? "English" : "한국어"}
            style={{ flex: 1, height: 34, borderRadius: 9, border: "1px solid rgba(255,86,54,0.28)", background: "rgba(255,86,54,0.14)", cursor: "pointer", fontSize: 11, fontWeight: 800, color: "#FF8C72", display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: "0.04em" }}
          >
            {isKo ? "EN" : "KO"}
          </button>
        </div>
      </aside>

      {/* Mobile: bottom tab bar — white/dark bg, coral active */}
      <nav className="ll-bottomnav">
        {BOTTOM_TABS.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                flex: 1,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 4, padding: "8px 2px 2px", textDecoration: "none",
                color: active ? "var(--grade-s)" : "var(--foreground-muted)",
              }}
            >
              <TabIcon name={tab.icon} size={24} />
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, lineHeight: 1 }}>
                {isKo ? tab.labelKo : tab.labelEn}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
