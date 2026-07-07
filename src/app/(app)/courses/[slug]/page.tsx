"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/lib/lang";
import { COURSE_DATA } from "@/content/courses";

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const isKo = useLang();

  const course = COURSE_DATA[slug];

  if (!course) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, padding: 24 }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>{isKo ? "코스를 찾을 수 없어요" : "Course not found"}</p>
        <Link href="/courses" style={{ color: "var(--grade-s)", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>← {isKo ? "코스 목록" : "All Courses"}</Link>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", background: "var(--content-bg)" }}>
      {/* Hero */}
      <div style={{ position: "relative", height: 220, background: course.color, flexShrink: 0 }}>
        {course.image && (
          <img src={course.image} alt={course.name.ko} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)" }} />

        {/* Back button */}
        <button
          onClick={() => router.back()}
          style={{ position: "absolute", top: 16, left: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.3)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", fontSize: 18, zIndex: 10 }}
        >
          ‹
        </button>

        {/* Badge */}
        <div style={{ position: "absolute", top: 16, right: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999, background: "var(--grade-b)", color: "var(--grade-b-text)" }}>
            {isKo ? course.badge.ko : course.badge.en}
          </span>
        </div>

        {/* Bottom info */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 20px 18px" }}>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.25, marginBottom: 6 }}>
            {isKo ? course.name.ko : course.name.en}
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.4 }}>
            {isKo ? course.tagline.ko : course.tagline.en}
          </p>
        </div>
      </div>

      {/* Meta row */}
      <div style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", padding: "12px 20px", display: "flex", alignItems: "center", gap: 16, flexShrink: 0, flexWrap: "nowrap", overflowX: "auto", scrollbarWidth: "none" }}>
        {[
          {
            icon: (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="3"/><path d="M12 8v13M8 21h8"/>
              </svg>
            ),
            label: isKo ? course.meta.ko : course.meta.en,
          },
          {
            icon: (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
              </svg>
            ),
            label: isKo ? course.duration.ko : course.duration.en,
          },
          {
            icon: (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 20V10M12 20V4M6 20v-6"/>
              </svg>
            ),
            label: isKo ? course.difficulty.ko : course.difficulty.en,
          },
        ].map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0, color: "var(--foreground-muted)" }}>
            {m.icon}
            <span style={{ fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" }}>{m.label}</span>
          </div>
        ))}
        {course.englishOk && (
          <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: "var(--badge-en-bg)", color: "var(--badge-en-fg)", marginLeft: "auto", flexShrink: 0, whiteSpace: "nowrap" }}>{isKo ? "영어 OK" : "English OK"}</span>
        )}
      </div>

      {/* Stops */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 80px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground-sub)", letterSpacing: "0.04em", marginBottom: 14 }}>
          {isKo ? "코스 경로" : "Course Stops"}
        </div>

        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div style={{ position: "absolute", left: 17, top: 18, bottom: 18, width: 2, background: "var(--border)", zIndex: 0 }} />

          {course.stops.map((stop, i) => (
            <div key={i} style={{ display: "flex", gap: 14, marginBottom: 16, position: "relative", zIndex: 1 }}>
              {/* Step number */}
              <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: course.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 800, boxShadow: `0 0 0 3px var(--content-bg)` }}>
                {i + 1}
              </div>

              {/* Card */}
              <div style={{ flex: 1, background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)", padding: "12px 14px", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 5 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", marginBottom: 2 }}>
                      {isKo ? stop.name.ko : stop.name.en}
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "var(--foreground-muted)" }}>{isKo ? stop.type.ko : stop.type.en}</span>
                      <span style={{ fontSize: 10, color: "var(--foreground-sub)" }}>·</span>
                      <span style={{ fontSize: 11, color: "var(--foreground-muted)" }}>{isKo ? stop.duration.ko : stop.duration.en}</span>
                    </div>
                  </div>
                  {stop.placeSlug && (
                    <Link href={`/places/${stop.placeSlug}`} style={{ flexShrink: 0, padding: "5px 10px", borderRadius: 8, background: "var(--content-bg)", border: "1px solid var(--border)", fontSize: 11, fontWeight: 600, color: "var(--grade-s)", textDecoration: "none", whiteSpace: "nowrap" }}>
                      {isKo ? "상세보기 →" : "Details →"}
                    </Link>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 6, paddingTop: 6, borderTop: "1px solid var(--border)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-sub)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                    <circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>
                  </svg>
                  <p style={{ fontSize: 12, color: "var(--foreground-muted)", lineHeight: 1.5 }}>
                    {isKo ? stop.tip.ko : stop.tip.en}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA bar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--card)", borderTop: "1px solid var(--border)", padding: "12px 16px", paddingBottom: "calc(12px + env(safe-area-inset-bottom))", display: "flex", gap: 10, zIndex: 40 }}>
        <Link href="/map" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, height: 48, borderRadius: 14, background: "var(--content-bg)", border: "1px solid var(--border)", fontSize: 14, fontWeight: 600, color: "var(--foreground)", textDecoration: "none" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
          {isKo ? "지도에서 보기" : "View on Map"}
        </Link>
        <button style={{ flex: 2, height: 48, borderRadius: 14, background: "var(--grade-s)", border: "none", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(255,86,54,0.3)" }}>
          {isKo ? "코스 시작하기 →" : "Start Course →"}
        </button>
      </div>
    </div>
  );
}
