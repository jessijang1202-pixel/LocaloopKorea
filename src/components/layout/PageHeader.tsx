"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang";
import { TopActions } from "@/components/LangToggle";

export function PageHeader() {
  const isKo = useLang();
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
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <TopActions />
          <Link
            href="/guide"
            style={{
              display: "inline-flex", alignItems: "center",
              padding: "5px 12px", borderRadius: 20,
              background: "rgba(11,30,45,0.82)",
              border: "1.5px solid rgba(21,182,193,0.55)",
              color: "#fff", fontSize: 11, fontWeight: 700,
              textDecoration: "none", whiteSpace: "nowrap",
              letterSpacing: "0.04em",
            }}
          >
            {isKo ? "가이드" : "Guide"}
          </Link>
        </div>
      </div>
    </div>
  );
}
