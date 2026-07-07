"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/lang";
import { COURSES } from "@/content/courses";

const FILTER_CHIPS = {
  ko: ["전체", "반나절", "하루", "음식", "문화", "자연"],
  en: ["All", "Half-Day", "Full Day", "Food", "Culture", "Nature"],
};

export default function CoursesPage() {
  const isKo = useLang();
  const [activeFilter, setActiveFilter] = useState(0);

  const chips = isKo ? FILTER_CHIPS.ko : FILTER_CHIPS.en;
  const filterEn = FILTER_CHIPS.en[activeFilter];

  const filtered = activeFilter === 0
    ? COURSES
    : COURSES.filter((c) => c.filter === filterEn || (filterEn === "Food" && c.id === "c1"));

  const [featured, ...rest] = filtered;

  return (
    <div style={{ background: "var(--background)", minHeight: "100%", paddingBottom: 20 }}>

      {/* Filter chips */}
      <div style={{ padding: "12px 16px 8px", display: "flex", gap: 7, overflowX: "auto", scrollbarWidth: "none" }}>
        {chips.map((chip, i) => {
          const active = activeFilter === i;
          return (
            <button key={chip} onClick={() => setActiveFilter(i)} style={{
              flexShrink: 0, fontSize: 12, fontWeight: active ? 700 : 500,
              padding: "6px 15px", borderRadius: 999,
              background: active ? "var(--grade-s)" : "var(--card)",
              color: active ? "#fff" : "var(--foreground-muted)",
              border: active ? "none" : "1px solid var(--border)",
              cursor: "pointer",
            }}>
              {chip}
            </button>
          );
        })}
      </div>

      <div style={{ padding: "0 16px" }}>

        {/* Featured card */}
        {featured && (
          <Link href={`/courses/${featured.slug}`} style={{ textDecoration: "none", display: "block" }}>
            <div style={{ borderRadius: 22, overflow: "hidden", marginBottom: 20, position: "relative", height: 200, background: featured.color, boxShadow: "0 8px 28px -8px rgba(0,0,0,0.22)", cursor: "pointer" }}>
              {featured.image && (
                <img src={featured.image} alt={featured.name.ko} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
              )}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)" }} />
              <div style={{ position: "absolute", top: 14, left: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 11px", borderRadius: 999, background: "var(--grade-b)", color: "var(--grade-b-text)" }}>
                  {isKo ? featured.badge.ko : featured.badge.en}
                </span>
              </div>
              {!featured.image && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 10, letterSpacing: "0.15em", fontFamily: "monospace", color: "rgba(0,0,0,0.25)", fontWeight: 600 }}>PHOTO · 이태원</span>
                </div>
              )}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 16px 14px" }}>
                <div style={{ fontSize: 21, fontWeight: 800, color: "#fff", letterSpacing: "-0.4px", marginBottom: 7, lineHeight: 1.2 }}>
                  {isKo ? featured.name.ko : featured.name.en}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: 4 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)" stroke="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                    {isKo ? featured.meta.ko : featured.meta.en}
                  </span>
                  {featured.englishOk && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "var(--badge-en-bg)", color: "var(--badge-en-fg)" }}>영어 OK</span>
                  )}
                </div>
              </div>
              {/* Arrow indicator */}
              <div style={{ position: "absolute", bottom: 14, right: 14, width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            </div>
          </Link>
        )}

        {/* Section label */}
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground-sub)", marginBottom: 10, letterSpacing: "0.03em" }}>
          {isKo ? "모든 코스" : "All Courses"}
        </div>

        {/* Course list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(featured ? rest : filtered).map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`} style={{ textDecoration: "none", display: "block" }}>
              <div style={{ background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)", padding: "13px 14px", display: "flex", alignItems: "center", gap: 13, cursor: "pointer" }}>
                <div style={{ width: 60, height: 60, borderRadius: 13, flexShrink: 0, background: course.color, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
                  {course.image ? (
                    <img src={course.image} alt={course.name.ko} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: 9, letterSpacing: "0.1em", fontFamily: "monospace", color: "rgba(0,0,0,0.3)" }}>PHOTO</span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", marginBottom: 2 }}>
                    {isKo ? course.name.ko : course.name.en}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--foreground-muted)", marginBottom: 6 }}>
                    {isKo ? course.name.en : course.name.ko}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: "var(--foreground-muted)" }}>
                      {isKo ? course.meta.ko : course.meta.en}
                    </span>
                    {course.englishOk && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999, background: "var(--badge-en-bg)", color: "var(--badge-en-fg)" }}>영어 OK</span>
                    )}
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--grade-s)" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
