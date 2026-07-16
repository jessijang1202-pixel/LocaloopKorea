"use client";

// Tasks page — the patent-1 life-task navigator (PriorityNow) drives this page
// with live engine data. The former static stage roadmap (mock progress bars,
// pre-checked sample tasks) was removed once real data landed: sample content
// below live content read as broken. The stage detail pages under
// /tasks/[stage] remain URL-reachable.

import Link from "next/link";
import { useLang } from "@/lib/lang";
import { PriorityNow } from "./PriorityNow";

export default function TasksPage() {
  const isKo = useLang();

  return (
    <div style={{ background: "var(--background)", minHeight: "100%", paddingBottom: 24 }}>
      {/* Hero headline — /tasks is the de facto home screen now (landed from
          the /intro intent popup), so this gets the big impactful treatment
          instead of the small page-title pattern other pages use. */}
      <div style={{ padding: "22px 16px 10px" }}>
        <div style={{ fontSize: 23, fontWeight: 900, color: "var(--foreground)", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
          {isKo ? <>여기서부터,<br />진짜 한국 생활이 시작돼요.</> : <>This is where your<br />real life in Korea begins.</>}
        </div>
        <div style={{ fontSize: 13.5, color: "var(--foreground-muted)", marginTop: 8, lineHeight: 1.5 }}>
          {isKo ? "당신의 완벽한 한국 적응을, 하나씩 도와드릴게요." : "We'll help you settle in perfectly — one step at a time."}
        </div>
      </div>

      {/* Links to /onboarding — the only thing that actually writes the
          localStorage UserProfile this page's recommendations are scored
          against (src/lib/engine/user-state.ts). */}
      <Link
        href="/onboarding"
        style={{
          display: "flex", alignItems: "center", gap: 12,
          margin: "8px 16px 4px", padding: "13px 15px",
          borderRadius: 14,
          background: "linear-gradient(135deg, #FF5636 0%, #c43e2a 100%)",
          boxShadow: "0 4px 16px rgba(255,86,54,0.35)",
          textDecoration: "none",
        }}
      >
        <div style={{
          width: 38, height: 38, borderRadius: 11, flexShrink: 0,
          background: "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#fff" }}>
            {isKo ? "나를 알려주세요" : "Tell us about you"}
          </div>
          <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>
            {isKo ? "입력하면 나에게 맞는 태스크를 골라서 보여드려요" : "Fill this out and we'll pick tasks that actually fit you"}
          </div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </Link>

      <PriorityNow />
    </div>
  );
}
