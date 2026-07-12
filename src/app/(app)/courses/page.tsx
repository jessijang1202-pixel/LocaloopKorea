"use client";

// Courses page — the patent-3 course builder composes recommendations from the
// live collected-places dataset. The former static curated course list (5 mock
// sample cards with stock imagery) was removed once real data landed: sample
// content below live content read as broken. The static detail pages under
// /courses/[slug] remain URL-reachable via src/content/courses.ts.

import { CourseBuilder } from "./CourseBuilder";

export default function CoursesPage() {
  return (
    <div style={{ background: "var(--background)", minHeight: "100%", paddingBottom: 20 }}>
      <CourseBuilder />
    </div>
  );
}
