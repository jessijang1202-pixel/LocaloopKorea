"use client";

import { TopActions } from "@/components/LangToggle";

export function PageHeader() {
  return (
    <div
      className="ll-page-header"
      style={{
        background: "#15b6c1",
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 3px)",
        paddingBottom: 10,
        flexShrink: 0,
      }}
    >
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "6px 14px",
      }}>
        <span style={{ fontSize: 13, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
          Localoop<span style={{ opacity: 0.7 }}>Korea</span>
        </span>
        <TopActions />
      </div>
    </div>
  );
}
