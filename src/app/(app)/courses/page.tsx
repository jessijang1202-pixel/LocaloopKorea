"use client";

// Real Local page (formerly "Courses") — the patent-3 course builder composes
// recommendations from the live collected-places dataset. The former static
// curated course list (5 mock sample cards with stock imagery) was removed
// once real data landed: sample content below live content read as broken.
// The static detail pages under /courses/[slug] remain URL-reachable via
// src/content/courses.ts.
//
// Single scroll: monthly picks -> big Real Local Food CTA (now its own page
// at /courses/food, not a tab) -> location-based feed -> finder.

import Link from "next/link";
import { useLang } from "@/lib/lang";
import { MonthlyPicks } from "./MonthlyPicks";
import { RecommendedCourses } from "./RecommendedCourses";
import { CourseBuilder } from "./CourseBuilder";

export default function CoursesPage() {
  const isKo = useLang();

  return (
    <div style={{ background: "var(--background)", minHeight: "100%", paddingBottom: 20 }}>
      <div style={{ padding: "16px 16px 6px" }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
          {isKo ? "리얼로컬" : "Real Local"}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--foreground-muted)", marginTop: 3 }}>
          {isKo ? "진짜 로컬을 경험하고 싶다면, 여기부터 가보세요." : "Want the real local experience? Start here."}
        </div>
      </div>

      <MonthlyPicks />

      {/* Big CTA into the dedicated Real Local Food page */}
      <Link
        href="/courses/food"
        style={{
          display: "flex", alignItems: "center", gap: 14,
          margin: "4px 16px 20px", padding: "18px 18px",
          borderRadius: 18,
          background: "linear-gradient(135deg, #FF5636 0%, #c43e2a 100%)",
          boxShadow: "0 6px 20px rgba(255,86,54,0.35)",
          textDecoration: "none",
        }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 14, flexShrink: 0,
          background: "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16l-1.5 8a5.5 5.5 0 01-11 0L6 4z" />
            <path d="M8 21h8M12 17v4" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>
            {isKo ? "리얼 로컬 푸드" : "Real Local Food"}
          </div>
          <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.85)", marginTop: 3 }}>
            {isKo ? "외국인은 잘 모르는 진짜 로컬 메뉴 24가지" : "24 real local dishes most foreigners never hear about"}
          </div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </Link>

      <RecommendedCourses />
      <CourseBuilder />
    </div>
  );
}
