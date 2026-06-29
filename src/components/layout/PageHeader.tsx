"use client";

import Link from "next/link";
import { TopActions } from "@/components/LangToggle";

export function PageHeader() {
  return (
    <div
      className="ll-page-header"
      style={{
        background: "#0B1E2D",
        height: 50,
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        gap: 8,
        flexShrink: 0,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* 나 아이콘 — 맨 왼쪽 */}
      <Link
        href="/profile"
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #15b6c1 0%, #0aa8b2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
          flexShrink: 0,
          boxShadow: "0 0 0 2px rgba(21,182,193,0.35), 0 2px 8px rgba(21,182,193,0.3)",
        }}
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>👤</span>
      </Link>

      {/* 로고 — 2줄, 중앙 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
        <span style={{ fontSize: 16, fontWeight: 900, color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>Localoop</span>
        <span style={{ fontSize: 10, fontWeight: 800, color: "#15b6c1", letterSpacing: "0.08em", lineHeight: 1.1 }}>KOREA</span>
      </div>

      {/* 오른쪽: 액션 + 가이드 아이콘 */}
      <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
        <TopActions />
        <Link
          href="/guide"
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "rgba(21,182,193,0.15)",
            border: "1px solid rgba(21,182,193,0.38)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          📖
        </Link>
      </div>
    </div>
  );
}
