"use client";

// Courses page — the patent-3 course builder composes recommendations from the
// live collected-places dataset. The former static curated course list (5 mock
// sample cards with stock imagery) was removed once real data landed: sample
// content below live content read as broken. The static detail pages under
// /courses/[slug] remain URL-reachable via src/content/courses.ts.

import { useLang } from "@/lib/lang";
import { RecommendedCourses } from "./RecommendedCourses";
import { CourseBuilder } from "./CourseBuilder";

export default function CoursesPage() {
  const isKo = useLang();

  return (
    <div style={{ background: "var(--background)", minHeight: "100%", paddingBottom: 20 }}>
      <div style={{ padding: "16px 16px 6px" }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
          {isKo ? "코스" : "Courses"}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--foreground-muted)", marginTop: 3 }}>
          {isKo ? "진짜 로컬을 경험하고 싶다면, 여기부터 가보세요." : "Want the real local experience? Start here."}
        </div>
      </div>
      <RecommendedCourses />
      <CourseBuilder />
    </div>
  );
}
