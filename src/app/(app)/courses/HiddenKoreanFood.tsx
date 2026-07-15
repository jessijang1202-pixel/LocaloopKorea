"use client";

// "한국인만 아는 한국음식" — a short, hand-curated corner between the course
// feeds. Not location-driven or data-sourced: just a few real Korean dishes
// that rarely make it onto a foreigner's radar.

import { useLang } from "@/lib/lang";
import { HIDDEN_KOREAN_FOODS } from "@/content/hidden-korean-food";

export function HiddenKoreanFood() {
  const isKo = useLang();

  return (
    <div style={{ margin: "20px 16px 0" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>
          {isKo ? "한국인만 아는 한국음식" : "Korean Foods Only Locals Know"}
        </div>
        <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>
          {isKo ? "외국인은 잘 모르는 진짜 로컬 메뉴들" : "The real local dishes most foreigners never hear about"}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {HIDDEN_KOREAN_FOODS.map((item) => (
          <div key={item.name_ko} style={{
            background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)",
            padding: "13px 14px",
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14.5, fontWeight: 700, color: "var(--foreground)" }}>
                {item.name_ko}
              </span>
              <span style={{ fontSize: 11.5, color: "var(--foreground-muted)" }}>
                {item.name_en}
              </span>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--foreground-muted)", lineHeight: 1.6, margin: 0 }}>
              {isKo ? item.desc.ko : item.desc.en}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
