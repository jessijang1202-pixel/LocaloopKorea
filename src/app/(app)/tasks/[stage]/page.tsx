"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/lib/lang";
import { useState } from "react";
import { STAGES } from "@/content/tasks";

const STAGE_ORDER = ["arrival", "early-life", "settlement", "community", "long-term"];
const STAGE_LABEL_KO = ["도착", "초기 생활", "정착", "커뮤니티", "장기 거주"];
const STAGE_LABEL_EN = ["Arrival", "Early Life", "Settlement", "Community", "Long-term"];

export default function StageDetailPage() {
  const { stage } = useParams<{ stage: string }>();
  const router = useRouter();
  const isKo = useLang();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const detail = STAGES[stage];

  if (!detail) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, padding: 24 }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>{isKo ? "페이지를 찾을 수 없어요" : "Page not found"}</p>
        <Link href="/tasks" style={{ color: "var(--grade-s)", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>← {isKo ? "태스크 목록" : "All Tasks"}</Link>
      </div>
    );
  }

  const tasks = detail.tasks;
  const doneCount = tasks.filter(t => checked[t.id] ?? false).length;
  const stageIdx = STAGE_ORDER.indexOf(stage);
  const nextUrgent = tasks.find(t => (t.urgent || t.deadline) && !(checked[t.id] ?? false));
  const nextTask = tasks.find(t => !(checked[t.id] ?? false));

  function toggle(id: string) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div style={{ background: "var(--background)", minHeight: "100%" }}>

      {/* ── Hero card — same style as tasks/page.tsx ── */}
      <div style={{
        margin: "16px 16px 0",
        borderRadius: 22,
        background: "linear-gradient(160deg, #1A0E14 0%, #120A0F 100%)",
        padding: "18px 20px 18px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* BG decorations */}
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ position: "absolute", bottom: -20, right: 30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

        {/* Top row: back + stage badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, position: "relative" }}>
          <button
            onClick={() => router.back()}
            style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", color: "rgba(255,255,255,0.75)", background: "rgba(255,255,255,0.15)", padding: "3px 10px", borderRadius: 999 }}>
            STAGE {String(detail.stageNum).padStart(2, "0")}
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>
            {isKo ? detail.ko.name : detail.en.name}
          </span>
        </div>

        {/* Big counter */}
        <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: "-1px", marginBottom: 14, position: "relative" }}>
          {doneCount}<span style={{ fontSize: 18, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>/{tasks.length} {isKo ? "완료" : "done"}</span>
        </div>

        {/* Segmented progress bar — one per task */}
        <div style={{ display: "flex", gap: 5, marginBottom: 14, position: "relative" }}>
          {tasks.map((t) => (
            <div key={t.id} style={{ flex: 1, height: 5, borderRadius: 99, background: (checked[t.id] ?? false) ? "#fff" : "rgba(255,255,255,0.22)" }} />
          ))}
        </div>

        {/* Footer: next task hint */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
            {doneCount === tasks.length
              ? (isKo ? "모든 과제 완료!" : "All tasks complete!")
              : isKo
                ? `다음: ${(nextUrgent ?? nextTask)?.ko.name ?? ""}`
                : `Next: ${(nextUrgent ?? nextTask)?.en.name ?? ""}`
            }
          </span>
          {nextUrgent?.deadline && doneCount < tasks.length && (
            <span style={{ fontSize: 11, fontWeight: 700, background: "var(--grade-b)", color: "var(--grade-b-text)", padding: "3px 9px", borderRadius: 999 }}>
              {nextUrgent.deadline}
            </span>
          )}
        </div>
      </div>

      {/* Stage nav chips */}
      <div style={{ display: "flex", gap: 6, padding: "14px 16px 4px", overflowX: "auto", scrollbarWidth: "none" }}>
        {STAGE_ORDER.map((s, i) => {
          const active = s === stage;
          return (
            <Link key={s} href={`/tasks/${s}`} style={{ textDecoration: "none", flexShrink: 0 }}>
              <span style={{
                display: "inline-block", fontSize: 12, fontWeight: active ? 700 : 500,
                padding: "6px 14px", borderRadius: 999,
                background: active ? "var(--grade-s)" : "var(--card)",
                color: active ? "#fff" : "var(--foreground-muted)",
                border: active ? "none" : "1px solid var(--border)",
              }}>
                {isKo ? STAGE_LABEL_KO[i] : STAGE_LABEL_EN[i]}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Task list */}
      <div style={{ padding: "10px 16px 0", display: "flex", flexDirection: "column", gap: 9 }}>
        {tasks.map((task) => {
          const done = checked[task.id] ?? false;
          const info = isKo ? task.ko : task.en;
          const isUrgent = !!task.urgent && !done;

          return (
            <div key={task.id} style={{
              background: "var(--card)",
              borderRadius: 16,
              border: isUrgent ? "1.5px solid var(--grade-s)" : "1px solid var(--border)",
              padding: "13px 14px",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              boxShadow: isUrgent ? "0 2px 12px -4px rgba(255,86,54,0.25)" : "0 1px 4px rgba(0,0,0,0.04)",
            }}>
              {/* Checkbox */}
              <button
                onClick={() => toggle(task.id)}
                style={{
                  width: 26, height: 26, borderRadius: 8, flexShrink: 0, marginTop: 1,
                  background: done ? "var(--grade-a)" : "transparent",
                  border: done ? "none" : isUrgent ? "2px solid var(--grade-s)" : "2px solid var(--border)",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {done && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>}
              </button>

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Name + pills row */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 3 }}>
                  <span style={{
                    fontSize: 14, fontWeight: 700,
                    color: done ? "var(--foreground-muted)" : "var(--foreground)",
                    textDecoration: done ? "line-through" : "none",
                  }}>
                    {info.name}
                  </span>
                  {done && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "var(--badge-en-bg)", color: "var(--badge-en-fg)" }}>
                      {isKo ? "완료" : "Done"}
                    </span>
                  )}
                  {isUrgent && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "var(--grade-s)", color: "#fff" }}>
                      {task.deadline ?? (isKo ? "긴급" : "Urgent")}
                    </span>
                  )}
                </div>

                {/* Desc */}
                <div style={{ fontSize: 11, color: "var(--foreground-muted)", marginBottom: done ? 0 : 7 }}>
                  {info.desc}
                </div>

                {/* Tip — always visible */}
                {!done && (
                  <div style={{ fontSize: 11, color: "var(--foreground-muted)", background: "var(--content-bg)", borderRadius: 8, padding: "7px 10px", lineHeight: 1.6 }}>
                    {info.tip}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips section */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "var(--foreground-muted)", letterSpacing: "0.08em", marginBottom: 10 }}>
          {isKo ? "알아두면 좋은 것들" : "GOOD TO KNOW"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {detail.tips.map((tip, i) => (
            <div key={i} style={{ background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)", padding: "12px 14px" }}>
              <p style={{ fontSize: 12, color: "var(--foreground)", lineHeight: 1.6, margin: 0 }}>
                {isKo ? tip.ko : tip.en}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      {detail.links.length > 0 && (
        <div style={{ padding: "16px 16px 0" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "var(--foreground-muted)", letterSpacing: "0.08em", marginBottom: 10 }}>
            {isKo ? "관련 페이지" : "RELATED"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {detail.links.map((link) => (
              <Link key={link.href} href={link.href} style={{ textDecoration: "none" }}>
                <div style={{ background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)", padding: "13px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", flex: 1 }}>
                    {isKo ? link.ko : link.en}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--grade-s)" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Prev / Next stage nav */}
      <div style={{ display: "flex", gap: 10, padding: "20px 16px 32px" }}>
        {stageIdx > 0 && (
          <Link href={`/tasks/${STAGE_ORDER[stageIdx - 1]}`} style={{ flex: 1, textDecoration: "none" }}>
            <div style={{ background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
              <div>
                <div style={{ fontSize: 10, color: "var(--foreground-muted)", marginBottom: 1 }}>{isKo ? "이전 단계" : "Previous"}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>
                  {isKo ? STAGE_LABEL_KO[stageIdx - 1] : STAGE_LABEL_EN[stageIdx - 1]}
                </div>
              </div>
            </div>
          </Link>
        )}
        {stageIdx < STAGE_ORDER.length - 1 && (
          <Link href={`/tasks/${STAGE_ORDER[stageIdx + 1]}`} style={{ flex: 1, textDecoration: "none" }}>
            <div style={{ background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: "var(--foreground-muted)", marginBottom: 1 }}>{isKo ? "다음 단계" : "Next"}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>
                  {isKo ? STAGE_LABEL_KO[stageIdx + 1] : STAGE_LABEL_EN[stageIdx + 1]}
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--grade-s)" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          </Link>
        )}
      </div>

    </div>
  );
}
