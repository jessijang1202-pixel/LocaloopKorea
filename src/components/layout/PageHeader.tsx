"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang";
import { LangToggleInline, ThemeToggle } from "@/components/LangToggle";

export function PageHeader() {
  const isKo = useLang();
  return (
    <div
      className="ll-page-header"
      style={{
        background: "var(--card)",
        height: 50,
        display: "flex",
        alignItems: "center",
        padding: "0 10px",
        gap: 6,
        flexShrink: 0,
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* 로고 */}
      <Link href="/map" style={{ textDecoration: "none", display: "flex", flexDirection: "column", lineHeight: 1, marginRight: 4 }}>
        <span style={{ fontSize: 15, fontWeight: 900, color: "var(--foreground)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>Localoop</span>
        <span style={{ fontSize: 9, fontWeight: 800, color: "var(--grade-s)", letterSpacing: "0.08em", lineHeight: 1.1 }}>KOREA</span>
      </Link>

      {/* 스페이서 */}
      <div style={{ flex: 1 }} />

      {/* 오른쪽 액션 버튼들 */}
      <ThemeToggle />
      <LangToggleInline />

      {/* 로그인 버튼 */}
      <Link
        href="/login"
        style={{
          height: 30,
          borderRadius: 8,
          background: "var(--content-bg)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
          fontSize: 11,
          fontWeight: 700,
          color: "var(--foreground-muted)",
          padding: "0 9px",
          flexShrink: 0,
        }}
      >
        {isKo ? "로그인" : "Login"}
      </Link>

      {/* MY 버튼 */}
      <Link
        href="/profile"
        style={{
          height: 30,
          borderRadius: 8,
          background: "var(--grade-s)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
          fontSize: 11,
          fontWeight: 800,
          color: "#fff",
          padding: "0 10px",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(255,86,54,0.3)",
          letterSpacing: "0.05em",
        }}
      >
        MY
      </Link>
    </div>
  );
}
