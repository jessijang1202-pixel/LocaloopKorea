"use client";

// 리얼 로컬 푸드 — dedicated food page (was a tab under Real Local, now its
// own route). 2-col mobile grid: photo, name, main ingredients, cooking
// method, and a spice-level indicator per card. Tap through to /courses/food/
// [slug] for the full writeup and a "지금 먹으러 가기" link into nearby graded
// restaurants.

import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/lang";
import { HIDDEN_KOREAN_FOODS } from "@/content/hidden-korean-food";

function SpiceIndicator({ level, isKo }: { level: number; isKo: boolean }) {
  if (level === 0) {
    return <span style={{ fontSize: 10, color: "var(--foreground-muted)" }}>{isKo ? "안 매움" : "Not spicy"}</span>;
  }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3].map((i) => (
        <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i <= level ? "#FF5636" : "var(--border)"} stroke="none">
          <path d="M13.5 2.1C13.5 2.1 16 5.5 16 8.5c0 1.8-1.2 3-2 3.5 1-1 1.2-3.5-.5-5.5C14 8 13 10 11 10c1.5-1.8 1-5-1-6.5C9 5 8 7.5 8 9.5c0 3 2 5.5 4 6.5 2-1 4-3.5 4-6.5 0-3.5-2.5-7.4-2.5-7.4z" />
        </svg>
      ))}
    </span>
  );
}

export default function RealLocalFoodPage() {
  const isKo = useLang();

  return (
    <div style={{ background: "var(--background)", minHeight: "100%", paddingBottom: 24 }}>
      <div style={{ padding: "16px 16px 6px" }}>
        <Link href="/courses" style={{ display: "inline-flex", alignItems: "center", gap: 5, textDecoration: "none", color: "var(--foreground-muted)", fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          {isKo ? "리얼로컬로 돌아가기" : "Back to Real Local"}
        </Link>
        <div style={{ fontSize: 20, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
          {isKo ? "리얼 로컬 푸드" : "Real Local Food"}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--foreground-muted)", marginTop: 3 }}>
          {isKo ? "외국인은 잘 모르는 진짜 로컬 메뉴들" : "The real local dishes most foreigners never hear about"}
        </div>
      </div>

      <div style={{ padding: "12px 16px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {HIDDEN_KOREAN_FOODS.map((item) => (
          <Link
            key={item.slug}
            href={`/courses/food/${item.slug}`}
            style={{
              display: "flex", flexDirection: "column",
              background: "var(--card)", borderRadius: 16, overflow: "hidden",
              border: "1px solid var(--border)", textDecoration: "none",
            }}
          >
            <div style={{ position: "relative", width: "100%", height: 110, background: "var(--content-bg)" }}>
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.name_ko} fill sizes="200px" style={{ objectFit: "cover" }} />
              ) : (
                <div style={{
                  width: "100%", height: "100%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "linear-gradient(135deg, #FF8A5B 0%, #FF5636 100%)",
                  color: "#fff", fontSize: 26, fontWeight: 800,
                }}>
                  {item.name_ko.charAt(0)}
                </div>
              )}
            </div>
            <div style={{ padding: "10px 11px 12px", display: "flex", flexDirection: "column", gap: 5 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {item.name_ko}
              </div>
              <div style={{ fontSize: 10.5, color: "var(--foreground-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {isKo ? item.mainIngredients.ko : item.mainIngredients.en}
              </div>
              <div style={{ fontSize: 10.5, color: "var(--foreground-muted)" }}>
                {isKo ? item.cookingMethod.ko : item.cookingMethod.en}
              </div>
              <SpiceIndicator level={item.spiceLevel} isKo={isKo} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
