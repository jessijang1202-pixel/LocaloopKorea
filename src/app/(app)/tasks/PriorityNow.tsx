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
import Link from "next/link";
import { useLang } from "@/lib/lang";
import {
  computePriorities,
  computeAllScored,
  useNavigatorProfile,
  TASK_GUIDES,
  TASK_NODES,
} from "@/lib/engine";
import { fetchGuidesWithOverrides } from "@/lib/engine/guide-overrides";
import { TASK_MAP_CATEGORIES } from "@/content/task-map-categories";
import type { Bi } from "@/types/content";
import type { TaskId, ScoredTask } from "@/lib/engine";

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

  // Ranked, unlocked-and-unresolved list. Interest/language bonuses only
  // reorder it — nothing unlocked is EXCLUDED, but only the top 10 render as
  // active interactive cards; the rest fold into the locked section below
  // (still real, just not competing for attention at the top of the screen).
  const active = computePriorities(profile);
  const visible = active.slice(0, 10);
  const overflow = active.slice(10);
  const dependencyLocked = computeAllScored(profile).filter((s) => !s.unlocked);
  // Overflow (rank > 10) first — those are closer to becoming visible than
  // true dependency-locked tasks, which still need a prerequisite finished.
  const locked = [...overflow, ...dependencyLocked];
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

  // Single card renderer shared by both visible slices (1-7 and 8-10) so the
  // quick-link row can be inserted between them without duplicating markup.
  const renderCard = (s: ScoredTask, i: number) => {
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
                    <div key={ci} style={{ fontSize: 11, color: "var(--foreground-muted)", background: "var(--content-bg)", borderRadius: 8, padding: "8px 10px", lineHeight: 1.6 }}>
                      {bi(cn)}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* 맵으로 이동 — only for tasks with a real place category
                behind them (T7 분리수거, T10/T11 모임/언어교환 etc. are
                behaviors, not places, so the button just hides). */}
            {TASK_MAP_CATEGORIES[task.id] !== null && (
              <Link
                href={`/map?task=${task.id}`}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  width: "100%", height: 46, borderRadius: 12, textDecoration: "none",
                  background: "var(--grade-s)", color: "#fff", fontSize: 14, fontWeight: 700,
                  marginBottom: 10,
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                {isKo ? "맵으로 이동" : "Go to Map"}
              </Link>
            )}

            {/* Skip / Done — checkbox-style, both act immediately */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => { skip(task.id); setOpenId(null); }}
                role="checkbox"
                aria-checked={false}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  height: 44, borderRadius: 12,
                  border: "1px solid var(--border)", background: "var(--content-bg)",
                  color: "var(--foreground-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >
                <span style={{ width: 16, height: 16, borderRadius: 4, border: "1.5px solid var(--foreground-muted)", flexShrink: 0 }} />
                {isKo ? "건너뛰기" : "Skip"}
              </button>
              <button
                onClick={() => { complete(task.id); setOpenId(null); }}
                role="checkbox"
                aria-checked={false}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  height: 44, borderRadius: 12, border: "1px solid var(--grade-a)",
                  background: "var(--grade-a)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
                }}
              >
                <span style={{
                  width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                  border: "1.5px solid #fff", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                {isKo ? "완료" : "Done"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Quick links — map browse / real local / guide. Rendered after card 7,
  // not at the very bottom of the list.
  const quickLinks = (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 9, marginBottom: 9 }}>
      {[
        {
          href: "/map",
          label: { ko: "지도에서 시작하기", en: "Start on Map" },
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--grade-s)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
          ),
        },
        {
          href: "/courses",
          label: { ko: "리얼 로컬 체험", en: "Real Local" },
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--grade-s)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 21h8M12 17v4M5 4h14l-1.5 8a5.5 5.5 0 01-11 0L5 4zM3 4h3M21 4h-3" />
            </svg>
          ),
        },
        {
          href: "/guide",
          label: { ko: "유저 가이드", en: "User Guide" },
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--grade-s)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 8C8 10 5.9 16.17 3.82 19.82" />
              <path d="M21 3A17 17 0 003.82 19.82" />
              <path d="M3.82 19.82L4 21" />
            </svg>
          ),
        },
      ].map((box) => (
        <Link
          key={box.href}
          href={box.href}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "16px 8px", borderRadius: 14, textDecoration: "none",
            background: "var(--card)", border: "1px solid var(--border)",
          }}
        >
          {box.icon}
          <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--foreground)", textAlign: "center" }}>
            {isKo ? box.label.ko : box.label.en}
          </span>
        </Link>
      ))}
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

      {/* Active cards — top 10 by rank; the rest fold into "잠긴 과제" below.
          The quick-link row sits after card 3, so it lands near the bottom
          of a phone screen right after landing on the page. */}
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {visible.length === 0 && (
          <div style={{ background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)", padding: "16px 14px", fontSize: 13, color: "var(--foreground-muted)", textAlign: "center" }}>
            {isKo ? "지금 추천할 과제가 없어요. 잘 하고 계세요!" : "No priority tasks right now. You're all caught up!"}
          </div>
        )}

        {visible.slice(0, 3).map(renderCard)}
      </div>

      {visible.length > 3 && quickLinks}

      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {visible.slice(3).map((s, i) => renderCard(s, i + 3))}
      </div>

      {visible.length <= 3 && quickLinks}

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
