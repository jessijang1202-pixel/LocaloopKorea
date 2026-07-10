"use client";

// "지금 할 일" / "Do This Now" — priority recommendation section.
//
// Renders the top unlocked life-tasks from the recommendation engine
// (src/lib/engine) using the same Gen-2 inline-style / CSS-variable / isKo
// visual language as the rest of /tasks. Mounted after the client hydrates
// (useNavigatorProfile loads its profile from localStorage in an effect), so
// this component guards its own render with a `mounted` flag to avoid any
// hydration mismatch — mirroring how useLang defers to the client.

import { useState, useEffect } from "react";
import { useLang } from "@/lib/lang";
import {
  computePriorities,
  computeAllScored,
  useNavigatorProfile,
  TASK_GUIDES,
  TASK_NODES,
} from "@/lib/engine";
import type { Bi } from "@/types/content";
import type { TaskId } from "@/lib/engine";

// Reason code → bilingual chip label (codes come from the engine).
const REASON_LABEL: Record<string, Bi> = {
  "early-stay": { ko: "체류 초기 필수", en: "Essential early on" },
  "language-simple": { ko: "간단한 절차", en: "Simple steps" },
  "interest-match": { ko: "관심사 일치", en: "Matches your interests" },
};

export function PriorityNow() {
  const isKo = useLang();
  const [profile, { complete, uncomplete }] = useNavigatorProfile();
  const [openId, setOpenId] = useState<TaskId | null>(null);

  // Defer render until mounted so SSR / first client render (default profile)
  // never disagrees with the localStorage-hydrated profile.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const bi = (b: Bi) => (isKo ? b.ko : b.en);

  const top = computePriorities(profile, 3);
  const locked = computeAllScored(profile).filter((s) => !s.unlocked);
  const doneCount = profile.completedTasks.length;

  // Small uppercase sub-label used inside the expanded guide.
  const subLabel = (text: string) => (
    <div style={{ fontSize: 11, fontWeight: 800, color: "var(--foreground-muted)", letterSpacing: "0.08em", marginBottom: 8 }}>
      {text}
    </div>
  );

  return (
    <div style={{ padding: "16px 16px 0" }}>
      {/* Section heading */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
          {isKo ? "지금 할 일" : "Do This Now"}
        </div>
        <div style={{ fontSize: 12, color: "var(--foreground-muted)", marginTop: 2 }}>
          {isKo ? "내 상황에 맞춘 우선 과제" : "Priority tasks for your situation"}
        </div>
      </div>

      {/* Top-3 cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {top.length === 0 && (
          <div style={{ background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)", padding: "16px 14px", fontSize: 13, color: "var(--foreground-muted)", textAlign: "center" }}>
            {isKo ? "지금 추천할 과제가 없어요. 잘 하고 계세요!" : "No priority tasks right now. You're all caught up!"}
          </div>
        )}

        {top.map((s, i) => {
          const task = s.task;
          const open = openId === task.id;
          const guide = TASK_GUIDES[task.id];
          return (
            <div key={task.id} style={{
              background: "var(--card)",
              borderRadius: 16,
              border: open ? "1.5px solid var(--grade-s)" : "1px solid var(--border)",
              boxShadow: open ? "0 2px 12px -4px rgba(255,86,54,0.25)" : "0 1px 4px rgba(0,0,0,0.04)",
              overflow: "hidden",
            }}>
              {/* Card header — click to expand */}
              <button
                onClick={() => setOpenId(open ? null : task.id)}
                style={{
                  width: "100%", textAlign: "left", background: "transparent", border: "none", cursor: "pointer",
                  padding: "13px 14px", display: "flex", alignItems: "flex-start", gap: 12,
                }}
              >
                {/* Rank */}
                <span style={{
                  width: 26, height: 26, borderRadius: 8, flexShrink: 0, marginTop: 1,
                  background: "var(--grade-s)", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 800,
                }}>
                  {i + 1}
                </span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)" }}>
                    {bi(task.name)}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--foreground-muted)", marginTop: 2, lineHeight: 1.5 }}>
                    {bi(task.summary)}
                  </div>

                  {/* Reason chips */}
                  {s.reasons.some((r) => REASON_LABEL[r]) && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
                      {s.reasons.filter((r) => REASON_LABEL[r]).map((r) => (
                        <span key={r} style={{
                          fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999,
                          background: "var(--nat-bg)", color: "var(--nat-fg)",
                        }}>
                          {bi(REASON_LABEL[r])}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Chevron */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 6, transform: open ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              {/* Expanded guide */}
              {open && guide && (
                <div style={{ padding: "0 14px 14px" }}>
                  {/* What */}
                  <p style={{ fontSize: 12, color: "var(--foreground)", lineHeight: 1.65, margin: "0 0 14px" }}>
                    {bi(guide.what)}
                  </p>

                  {/* Steps (numbered) */}
                  {subLabel(isKo ? "진행 방법" : "STEPS")}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                    {guide.steps.map((step, si) => (
                      <div key={si} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{
                          width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                          background: "var(--content-bg)", color: "var(--grade-s)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 800,
                        }}>
                          {si + 1}
                        </span>
                        <span style={{ fontSize: 12, color: "var(--foreground)", lineHeight: 1.6 }}>{bi(step)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Prepare */}
                  {guide.prepare.length > 0 && (
                    <>
                      {subLabel(isKo ? "준비물" : "PREPARE")}
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                        {guide.prepare.map((p, pi) => (
                          <div key={pi} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                            <span style={{ color: "var(--grade-s)", fontSize: 12, lineHeight: 1.6, flexShrink: 0 }}>·</span>
                            <span style={{ fontSize: 12, color: "var(--foreground)", lineHeight: 1.6 }}>{bi(p)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Cautions */}
                  {guide.cautions.length > 0 && (
                    <>
                      {subLabel(isKo ? "유의사항" : "CAUTIONS")}
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                        {guide.cautions.map((cn, ci) => (
                          <div key={ci} style={{ fontSize: 11, color: "var(--foreground-muted)", background: "var(--content-bg)", borderRadius: 8, padding: "8px 10px", lineHeight: 1.6, borderLeft: "3px solid var(--grade-s)" }}>
                            {bi(cn)}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Complete button */}
                  <button
                    onClick={() => { complete(task.id); setOpenId(null); }}
                    style={{
                      width: "100%", height: 44, borderRadius: 12, border: "none",
                      background: "var(--grade-a)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                    }}
                  >
                    {isKo ? "완료로 표시" : "Mark as done"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Locked tasks — muted collapsed row */}
      {locked.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "var(--foreground-muted)", letterSpacing: "0.08em", marginBottom: 8 }}>
            {isKo ? "잠긴 과제" : "Locked"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {locked.map((s) => (
              <div key={s.task.id} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "var(--content-bg)", borderRadius: 10, border: "1px solid var(--border)",
                padding: "9px 12px",
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground-muted)", flexShrink: 0 }}>
                  {bi(s.task.name)}
                </span>
                {s.blockedBy.length > 0 && (
                  <span style={{ fontSize: 10, color: "var(--foreground-muted)", opacity: 0.85, marginLeft: "auto", textAlign: "right" }}>
                    {(isKo ? "필요: " : "Needs: ") + s.blockedBy.map((id: TaskId) => bi(TASK_NODES[id].name)).join(", ")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed count + reset */}
      {doneCount > 0 && (
        <div style={{ marginTop: 12, textAlign: "center" }}>
          <button
            onClick={() => profile.completedTasks.forEach((id) => uncomplete(id))}
            style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 11, color: "var(--foreground-muted)" }}
          >
            {isKo
              ? `완료한 과제 ${doneCount}개 · 초기화`
              : `${doneCount} done · reset`}
          </button>
        </div>
      )}
    </div>
  );
}
