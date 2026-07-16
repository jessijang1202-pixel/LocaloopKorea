"use client";

// Mobile navigation trigger — replaces the old fixed bottom tab bar. Mounted
// top-right wherever a page needs it (PageHeader for standard pages, inline
// in /map's floating chrome since /map hides PageHeader). Desktop never
// renders this: every mount point lives inside an already mobile-only
// container (PageHeader is display:none on desktop via .ll-page-header, and
// /map's floating UI is wrapped in .ll-mobile-only), so no extra media query
// is needed here.

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/lang";
import { SIDEBAR_TABS, TabIcon } from "./AppNav";

// `triggerStyle` lets a caller match its own floating chrome (e.g. /map's
// translucent pill buttons) instead of the default opaque PageHeader look.
export function HamburgerMenu({ triggerStyle }: { triggerStyle?: React.CSSProperties }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isKo = useLang();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={isKo ? "메뉴 열기" : "Open menu"}
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          height: 30, width: 30, borderRadius: 8, flexShrink: 0,
          background: "var(--content-bg)", border: "1.5px solid var(--border)",
          cursor: "pointer", color: "var(--foreground-muted)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          ...triggerStyle,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9998,
            background: "rgba(10,8,6,0.55)", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute", top: 0, right: 0, bottom: 0, width: "min(78vw, 300px)",
              background: "var(--card)", boxShadow: "-8px 0 32px rgba(0,0,0,0.28)",
              display: "flex", flexDirection: "column",
              paddingTop: "env(safe-area-inset-top)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 16px 8px" }}>
              <span style={{ fontSize: 15, fontWeight: 900, color: "var(--foreground)" }}>Localoop</span>
              <button
                onClick={() => setOpen(false)}
                aria-label={isKo ? "메뉴 닫기" : "Close menu"}
                style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "var(--content-bg)", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "var(--foreground-muted)",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", padding: "8px 10px", gap: 2 }}>
              {SIDEBAR_TABS.map((tab) => {
                const active = isActive(tab.href);
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    onClick={() => setOpen(false)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "0 12px", height: 46, borderRadius: 10, textDecoration: "none",
                      background: active ? "rgba(255,86,54,0.10)" : "transparent",
                      color: active ? "var(--grade-s)" : "var(--foreground)",
                    }}
                  >
                    <TabIcon name={tab.icon} size={20} />
                    <span style={{ fontSize: 14, fontWeight: active ? 700 : 500 }}>
                      {isKo ? tab.labelKo : tab.labelEn}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
