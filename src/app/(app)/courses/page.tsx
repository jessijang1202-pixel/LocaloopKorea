"use client";

// Real Local page (formerly "Courses") — the patent-3 course builder composes
// recommendations from the live collected-places dataset. The former static
// curated course list (5 mock sample cards with stock imagery) was removed
// once real data landed: sample content below live content read as broken.
// The static detail pages under /courses/[slug] remain URL-reachable via
// src/content/courses.ts.
//
// Two tabs: 리얼 로컬 코스 (monthly picks + location-based feed + finder) and
// 리얼 로컬 음식 (hand-curated "hidden Korean food" corner with photos).

import { useState } from "react";
import { useLang } from "@/lib/lang";
import { MonthlyPicks } from "./MonthlyPicks";
import { RecommendedCourses } from "./RecommendedCourses";
import { HiddenKoreanFood } from "./HiddenKoreanFood";
import { CourseBuilder } from "./CourseBuilder";

type Tab = "course" | "food";

export default function CoursesPage() {
  const isKo = useLang();
  const [tab, setTab] = useState<Tab>("course");

  const TABS: { id: Tab; ko: string; en: string }[] = [
    { id: "course", ko: "리얼 로컬 코스", en: "Real Local Course" },
    { id: "food", ko: "리얼 로컬 음식", en: "Real Local Food" },
  ];

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

      {/* Tab switcher */}
      <div style={{ display: "flex", background: "var(--card)", borderBottom: "1px solid var(--border)", marginTop: 10 }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, height: 44, background: "none", border: "none", cursor: "pointer",
              borderBottom: tab === t.id ? "2.5px solid var(--grade-s)" : "2.5px solid transparent",
              color: tab === t.id ? "var(--grade-s)" : "var(--foreground-muted)",
              fontWeight: tab === t.id ? 700 : 500,
              fontSize: 13.5,
              transition: "color 0.15s",
            }}
          >
            {isKo ? t.ko : t.en}
          </button>
        ))}
      </div>

      {tab === "course" ? (
        <>
          <div style={{ height: 16 }} />
          <MonthlyPicks />
          <RecommendedCourses />
          <CourseBuilder />
        </>
      ) : (
        <HiddenKoreanFood />
      )}
    </div>
  );
}
