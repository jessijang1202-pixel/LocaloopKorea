"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/lang";

type Tab = { href: string; icon: string; labelKo: string; labelEn: string };

const TABS: Tab[] = [
  { href: "/map",       icon: "🗺️",  labelKo: "지도",    labelEn: "Map" },
  { href: "/tasks",     icon: "✅",   labelKo: "과제",    labelEn: "Tasks" },
  { href: "/courses",   icon: "🏃",   labelKo: "코스",    labelEn: "Courses" },
  { href: "/community", icon: "👥",   labelKo: "커뮤니티", labelEn: "Community" },
  { href: "/profile",   icon: "👤",   labelKo: "나",      labelEn: "Me" },
];

export function AppNav() {
  const pathname = usePathname();
  const isKo = useLang();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* PC sidebar */}
      <aside className="ll-sidebar">
        <div style={{ padding: "22px 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
            Localoop<span style={{ color: "#15b6c1" }}>Korea</span>
          </div>
          <div style={{ fontSize: 10, color: "#8BB8C0", marginTop: 2 }}>Real Korea starts here</div>
        </div>

        <nav style={{ flex: 1, paddingTop: 8 }}>
          {TABS.map((tab) => {
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 20px",
                  textDecoration: "none",
                  color: active ? "#fff" : "rgba(255,255,255,0.45)",
                  background: active ? "rgba(21,182,193,0.15)" : "transparent",
                  borderLeft: active ? "3px solid #15b6c1" : "3px solid transparent",
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                }}
              >
                <span style={{ fontSize: 17 }}>{tab.icon}</span>
                <span>{isKo ? tab.labelKo : tab.labelEn}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
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
