"use client";

// Real Local Food detail — full writeup + "지금 먹으러 가기" (go eat now), which
// reuses the task-filtered map (T8 로컬 음식 체험 already maps to category
// "restaurant" in task-map-categories.ts) rather than duplicating the
// LocationConsent + PlaceGridCard flow a third time. Honest framing: this
// shows nearby GRADED restaurants generally, not restaurants verified to
// serve this specific dish — no per-dish restaurant tagging exists in the
// collected dataset.

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useLang } from "@/lib/lang";
import { HIDDEN_KOREAN_FOODS } from "@/content/hidden-korean-food";

export default function FoodDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const isKo = useLang();
  const item = HIDDEN_KOREAN_FOODS.find((f) => f.slug === slug);
  if (!item) notFound();

  return (
    <div style={{ background: "var(--background)", minHeight: "100%", paddingBottom: 100 }}>
      <div style={{ position: "relative", width: "100%", height: 220, background: "var(--content-bg)" }}>
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name_ko} fill sizes="600px" style={{ objectFit: "cover" }} />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #FF8A5B 0%, #FF5636 100%)",
            color: "#fff", fontSize: 48, fontWeight: 800,
          }}>
            {item.name_ko.charAt(0)}
          </div>
        )}
        <Link
          href="/courses/food"
          aria-label={isKo ? "뒤로가기" : "Back"}
          style={{
            position: "absolute", top: 14, left: 14,
            width: 34, height: 34, borderRadius: "50%",
            background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center",
            textDecoration: "none",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </Link>
      </div>

      <div style={{ padding: "18px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.02em", margin: 0 }}>
            {item.name_ko}
          </h1>
          <span style={{ fontSize: 13, color: "var(--foreground-muted)" }}>{item.name_en}</span>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "12px 0 18px" }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, padding: "5px 11px", borderRadius: 999, background: "var(--badge-en-bg)", color: "var(--badge-en-fg)" }}>
            {isKo ? item.mainIngredients.ko : item.mainIngredients.en}
          </span>
          <span style={{ fontSize: 11.5, fontWeight: 700, padding: "5px 11px", borderRadius: 999, background: "var(--content-bg)", color: "var(--foreground-muted)", border: "1px solid var(--border)" }}>
            {isKo ? item.cookingMethod.ko : item.cookingMethod.en}
          </span>
          <span style={{ fontSize: 11.5, fontWeight: 700, padding: "5px 11px", borderRadius: 999, background: "var(--content-bg)", color: "var(--foreground-muted)", border: "1px solid var(--border)" }}>
            {item.spiceLevel === 0
              ? (isKo ? "안 매움" : "Not spicy")
              : `${isKo ? "매운맛 " : "Spice "}${item.spiceLevel}/3`}
          </span>
        </div>

        <p style={{ fontSize: 14.5, color: "var(--foreground)", lineHeight: 1.75, margin: 0 }}>
          {isKo ? item.desc.ko : item.desc.en}
        </p>
      </div>

      {/* 지금 먹으러 가기 */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "14px 16px", paddingBottom: "calc(14px + env(safe-area-inset-bottom))", background: "var(--card)", borderTop: "1px solid var(--border)", zIndex: 20 }}>
        <Link
          href="/map?task=T8"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            width: "100%", height: 50, borderRadius: 14, textDecoration: "none",
            background: "linear-gradient(135deg, #FF5636 0%, #c43e2a 100%)",
            boxShadow: "0 4px 16px rgba(255,86,54,0.35)",
            color: "#fff", fontSize: 15, fontWeight: 700,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          {isKo ? "지금 먹으러 가기" : "Go Eat Now"}
        </Link>
        <div style={{ fontSize: 10.5, color: "var(--foreground-muted)", textAlign: "center", marginTop: 6 }}>
          {isKo ? "내 주변 그레이드 매겨진 로컬 식당을 보여드려요" : "Shows nearby local restaurants, each with a foreigner-friendly grade"}
        </div>
      </div>
    </div>
  );
}
