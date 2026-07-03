"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang";
import { toggleTheme, useTheme } from "@/lib/theme";

const SECTIONS_KO = [
  {
    title: "계정",
    items: [
      { label: "프로필 편집", href: "/profile/edit" },
      { label: "저장된 항목", href: "/saved" },
    ],
  },
  {
    title: "앱 설정",
    items: [
      { label: "언어 설정", href: "/settings/language", value: "한국어" },
      { label: "알림 설정", href: "/settings/notifications", value: "켜짐" },
    ],
  },
  {
    title: "앱 정보",
    items: [
      { label: "서비스 이용약관", href: "/settings/terms" },
      { label: "개인정보 처리방침", href: "/settings/privacy" },
      { label: "앱 버전", value: "1.0.0 MVP" },
    ],
  },
];

const SECTIONS_EN = [
  {
    title: "Account",
    items: [
      { label: "Edit profile", href: "/profile/edit" },
      { label: "Saved items", href: "/saved" },
    ],
  },
  {
    title: "App",
    items: [
      { label: "Language", href: "/settings/language", value: "English" },
      { label: "Notifications", href: "/settings/notifications", value: "On" },
    ],
  },
  {
    title: "About",
    items: [
      { label: "Terms of service", href: "/settings/terms" },
      { label: "Privacy policy", href: "/settings/privacy" },
      { label: "App version", value: "1.0.0 MVP" },
    ],
  },
];

export default function SettingsPage() {
  const isKo = useLang();
  const theme = useTheme();
  const sections = isKo ? SECTIONS_KO : SECTIONS_EN;

  return (
    <div style={{ background: "var(--content-bg)", minHeight: "100%", padding: "20px 16px 40px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--grade-s)", letterSpacing: "0.08em", marginBottom: 4 }}>
          LOCALOOP KOREA
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--foreground)", letterSpacing: "-0.03em" }}>
          {isKo ? "설정" : "Settings"}
        </h1>
      </div>

      {/* Theme toggle */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={toggleTheme}
          style={{
            width: "100%", padding: "14px 16px", borderRadius: 14, border: "1px solid var(--border)",
            background: "var(--card)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>
            {isKo ? "다크 모드" : "Dark Mode"}
          </span>
          <div style={{
            width: 44, height: 26, borderRadius: 13, position: "relative",
            background: theme === "dark" ? "var(--grade-s)" : "var(--border)",
            transition: "background 0.2s",
          }}>
            <div style={{
              position: "absolute", top: 3, left: theme === "dark" ? 21 : 3,
              width: 20, height: 20, borderRadius: "50%", background: "#fff",
              transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            }} />
          </div>
        </button>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.title} style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, paddingLeft: 4 }}>
            {section.title}
          </p>
          <div style={{ borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden", background: "var(--card)" }}>
            {section.items.map((item, i) => {
              const content = (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderTop: i === 0 ? "none" : "1px solid var(--border)" }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "var(--foreground)" }}>{item.label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {"value" in item && item.value && (
                      <span style={{ fontSize: 12, color: "var(--foreground-muted)" }}>{item.value}</span>
                    )}
                    {"href" in item && item.href && (
                      <span style={{ color: "var(--foreground-muted)", fontSize: 16, lineHeight: 1 }}>›</span>
                    )}
                  </div>
                </div>
              );

              return "href" in item && item.href ? (
                <Link key={item.label} href={item.href} style={{ display: "block", textDecoration: "none" }}>
                  {content}
                </Link>
              ) : (
                <div key={item.label}>{content}</div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Version footer */}
      <div style={{ textAlign: "center", marginTop: 12 }}>
        <span style={{ fontSize: 11, color: "var(--foreground-sub)" }}>
          Localoop Korea · v1.0.0 MVP
        </span>
      </div>
    </div>
  );
}
