"use client";

// "지금 할 일" / "Do This Now" — priority recommendation section.
//
// Renders the full ranked, unlocked-and-unresolved task list from the
// recommendation engine (src/lib/engine) using the same Gen-2 inline-style /
// CSS-variable / isKo visual language as the rest of /tasks. No top-N cap:
// living abroad means doing a lot of things you didn't choose to be
// interested in, so every unlocked task stays visible until it's completed
// or explicitly skipped — interest/language bonuses only affect ORDER, never
// whether a task is shown at all. Completed and skipped tasks are kept
// (never deleted) in a history row at the top, struck through, so the list
// doubles as a visible record of how far the user has settled in.
//
// Mounted after the client hydrates (useNavigatorProfile loads its profile
// from localStorage in an effect), so this component guards its own render
// with a `mounted` flag to avoid any hydration mismatch — mirroring how
// useLang defers to the client.

import { useState, useEffect } from "react";
import { useLang } from "@/lib/lang";
import {
  computePriorities,
  computeAllScored,
  useNavigatorProfile,
  TASK_GUIDES,
  TASK_NODES,
} from "@/lib/engine";
import { fetchGuidesWithOverrides } from "@/lib/engine/guide-overrides";
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
  const [profile, { complete, uncomplete, skip, unskip }] = useNavigatorProfile();
  const [openId, setOpenId] = useState<TaskId | null>(null);

  // Guides render from the code defaults immediately, then upgrade to any
  // admin-edited overrides once loaded (best-effort; never throws).
  const [guides, setGuides] = useState(TASK_GUIDES);
  useEffect(() => {
    void fetchGuidesWithOverrides().then(setGuides);
  }, []);

  // Defer render until mounted so SSR / first client render (default profile)
  // never disagrees with the localStorage-hydrated profile.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const bi = (b: Bi) => (isKo ? b.ko : b.en);

  // No topN — the full unlocked-and-unresolved list, ranked. Interest/language
  // bonuses only reorder it; nothing unlocked ever disappears from view.
  const active = computePriorities(profile);
  const locked = computeAllScored(profile).filter((s) => !s.unlocked);
  const history: { id: TaskId; status: "done" | "skipped" }[] = [
    ...profile.completedTasks.map((id) => ({ id, status: "done" as const })),
    ...profile.skippedTasks.map((id) => ({ id, status: "skipped" as const })),
  ];

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
          {isKo ? "내 상황에 맞춘 전체 과제" : "Every task that applies to your situation"}
        </div>
      </div>

      {/* History — completed + skipped, never deleted, struck through */}
      {history.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "var(--foreground-muted)", letterSpacing: "0.08em", marginBottom: 8 }}>
            {isKo ? `완료 · 건너뜀 (${history.length})` : `DONE · SKIPPED (${history.length})`}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {history.map(({ id, status }) => (
              <div key={id} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "var(--content-bg)", borderRadius: 10, border: "1px solid var(--border)",
                padding: "9px 12px",
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999, flexShrink: 0,
                  background: status === "done" ? "var(--grade-a)" : "var(--muted)",
                  color: status === "done" ? "#fff" : "var(--foreground-muted)",
                }}>
                  {status === "done" ? (isKo ? "완료" : "Done") : (isKo ? "건너뜀" : "Skipped")}
                </span>
                <span style={{
                  fontSize: 12.5, fontWeight: 600, color: "var(--foreground-muted)",
                  textDecoration: "line-through", flex: 1, minWidth: 0,
                }}>
                  {bi(TASK_NODES[id].name)}
                </span>
                <button
                  onClick={() => (status === "done" ? uncomplete(id) : unskip(id))}
                  style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "var(--grade-s)", fontWeight: 600, padding: 0 }}
                >
                  {isKo ? "되돌리기" : "Undo"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active cards — full ranked unlocked list, no cap */}
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {active.length === 0 && (
          <div style={{ background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)", padding: "16px 14px", fontSize: 13, color: "var(--foreground-muted)", textAlign: "center" }}>
            {isKo ? "지금 추천할 과제가 없어요. 잘 하고 계세요!" : "No priority tasks right now. You're all caught up!"}
          </div>
        )}

        {active.map((s, i) => {
          const task = s.task;
          const open = openId === task.id;
          const guide = guides[task.id];
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

                  {/* Complete / Skip */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => { skip(task.id); setOpenId(null); }}
                      style={{
                        flexShrink: 0, height: 44, padding: "0 16px", borderRadius: 12,
                        border: "1px solid var(--border)", background: "var(--content-bg)",
                        color: "var(--foreground-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer",
                      }}
                    >
                      {isKo ? "건너뛰기" : "Skip"}
                    </button>
                    <button
                      onClick={() => { complete(task.id); setOpenId(null); }}
                      style={{
                        flex: 1, height: 44, borderRadius: 12, border: "none",
                        background: "var(--grade-a)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                      }}
                    >
                      {isKo ? "완료로 표시" : "Mark as done"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Locked tasks — muted collapsed row */}
      {locked.length > 0 && (
        <div style={{ marginTop: 14, marginBottom: 8 }}>
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
    </div>
  );
}
