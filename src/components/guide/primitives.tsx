// Shared presentational primitives for the /etiquette page and the /guide page
// (both its User Guide tab and Culture & Etiquette tab).
//
// The two pages produced VISUALLY DIFFERENT versions of Section and Card, so
// those two take a `variant` prop ("etiquette" | "guide") that reproduces each
// page's exact CSS values:
//   - Section: outer margin, heading font-size and margin differ.
//   - Card (accent + dark only): the two pages use different accent gradients,
//     borders, and box-shadows for the dark accent treatment; the light accent
//     and non-accent styles are identical.
// The prop name for the dark flag is standardized to `dark` (the /etiquette page
// originally called it `isDark` — prop names are not observable, the rendered
// CSS is).
//
// Callout and RuleItem were byte-identical between the pages and take no variant.
// Callout supports the full color set (the "teal" color is only used by /guide).

import React from "react";

export type PrimitiveVariant = "etiquette" | "guide";

export function Section({ title, children, variant = "guide" }: { title: string; children: React.ReactNode; variant?: PrimitiveVariant }) {
  const isEtq = variant === "etiquette";
  return (
    <div style={{ marginBottom: isEtq ? 28 : 24 }}>
      <h2 style={{ fontSize: isEtq ? 17 : 16, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.02em", marginBottom: isEtq ? 14 : 12 }}>{title}</h2>
      {children}
    </div>
  );
}

export function Card({ children, accent = false, dark = false, variant = "guide" }: { children: React.ReactNode; accent?: boolean; dark?: boolean; variant?: PrimitiveVariant }) {
  const isEtq = variant === "etiquette";
  return (
    <div style={{
      background: accent
        ? dark
          ? isEtq
            ? "linear-gradient(135deg, rgba(255,86,54,0.14) 0%, rgba(255,86,54,0.07) 100%)"
            : "linear-gradient(160deg, var(--grade-dark) 0%, #2A1510 100%)"
          : "linear-gradient(135deg, rgba(255,86,54,0.08) 0%, rgba(255,86,54,0.04) 100%)"
        : "var(--card)",
      borderRadius: 16, padding: "16px",
      border: accent
        ? isEtq
          ? "1px solid rgba(255,86,54,0.25)"
          : (dark ? "none" : "1px solid rgba(255,86,54,0.25)")
        : "1px solid var(--border)",
      boxShadow: (!isEtq && accent && dark) ? "0 4px 20px rgba(11,30,45,0.15)" : "0 1px 5px rgba(0,0,0,0.04)",
      marginBottom: 12,
    }}>
      {children}
    </div>
  );
}

export function Callout({ color, children }: { color: "coral" | "yellow" | "red" | "blue" | "teal"; children: React.ReactNode }) {
  const map = {
    coral:  { bg: "rgba(255,86,54,0.06)", border: "rgba(255,86,54,0.2)", text: "var(--grade-s)" },
    yellow: { bg: "#FFFDE7", border: "#FFE082", text: "#7A5000" },
    red:    { bg: "#FFF0F0", border: "#FFCDD2", text: "#7A1A1A" },
    blue:   { bg: "#E8F4FF", border: "#90CAF9", text: "#1A3A6E" },
    teal:   { bg: "#E8F9F9", border: "#C0EDEF", text: "#1A5C60" },
  };
  const c = map[color];
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 10, color: c.text, fontSize: 12, lineHeight: 1.65 }}>
      {children}
    </div>
  );
}

export function RuleItem({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{
        width: 22, height: 22, borderRadius: "50%", flexShrink: 0, marginTop: 1,
        background: ok ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, color: ok ? "#16a34a" : "#dc2626", fontWeight: 700,
      }}>
        {ok ? "✓" : "✕"}
      </div>
      <p style={{ fontSize: 12, color: "var(--foreground)", lineHeight: 1.6 }}>{text}</p>
    </div>
  );
}
