"use client";

// "한국인만 아는 한국음식" — a hand-curated tab, not location-driven or
// data-sourced: a few real Korean dishes that rarely make it onto a
// foreigner's radar, each with a reference photo.

import Image from "next/image";
import { useLang } from "@/lib/lang";
import { HIDDEN_KOREAN_FOODS } from "@/content/hidden-korean-food";

export function HiddenKoreanFood() {
  const isKo = useLang();

  return (
    <div style={{ margin: "16px 16px 0" }}>
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
            display: "flex", gap: 12,
            background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)",
            padding: 10,
          }}>
            <div style={{ position: "relative", width: 76, height: 76, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "var(--content-bg)" }}>
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.name_ko} fill sizes="76px" style={{ objectFit: "cover" }} />
              ) : (
                <div style={{
                  width: "100%", height: "100%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "linear-gradient(135deg, #FF8A5B 0%, #FF5636 100%)",
                  color: "#fff", fontSize: 24, fontWeight: 800,
                }}>
                  {item.name_ko.charAt(0)}
                </div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                <span style={{ fontSize: 14.5, fontWeight: 700, color: "var(--foreground)" }}>
                  {item.name_ko}
                </span>
                <span style={{ fontSize: 11, color: "var(--foreground-muted)" }}>
                  {item.name_en}
                </span>
              </div>
              <p style={{ fontSize: 12, color: "var(--foreground-muted)", lineHeight: 1.55, margin: 0 }}>
                {isKo ? item.desc.ko : item.desc.en}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
