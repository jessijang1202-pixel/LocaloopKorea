"use client";

import { TopActions } from "@/components/LangToggle";

interface PageHeaderProps {
  /** Extra element placed to the right of TopActions (e.g. a Guide link or reset button) */
  right?: React.ReactNode;
  /** Optional sub-content rendered inside the teal header below the logo row */
  children?: React.ReactNode;
}

export function PageHeader({ right, children }: PageHeaderProps) {
  return (
    <div
      className="ll-page-header"
      style={{
        background: "#15b6c1",
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 3px)",
        paddingBottom: children ? 10 : 10,
        flexShrink: 0,
      }}
    >
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "6px 14px",
        marginBottom: children ? 8 : 0,
      }}>
        <span style={{ fontSize: 13, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
          Localoop<span style={{ opacity: 0.7 }}>Korea</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <TopActions />
          {right}
        </div>
      </div>
      {children}
    </div>
  );
}
