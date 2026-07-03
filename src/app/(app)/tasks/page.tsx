"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/lang";
import { useTheme } from "@/lib/theme";

const STAGE_NAMES = {
  ko: ["도착", "초기 생활", "정착", "커뮤니티", "장기 거주"],
  en: ["Arrival", "Early Life", "Settlement", "Community", "Long-term"],
};
const STAGE_SLUGS = ["arrival", "early-life", "settlement", "community", "long-term"];
const CURRENT_STAGE = 1; // 0-indexed

const TASKS = [
  {
    id: "t1", icon: "🚌",
    ko: { name: "교통카드 구매", desc: "T-money 카드, 편의점이나 역에서 구매 가능해요" },
    en: { name: "Get a transit card", desc: "T-money card · Convenience stores & airports" },
    done: true, urgent: false,
  },
  {
    id: "t2", icon: "📱",
    ko: { name: "선불 유심 가입", desc: "공항 또는 편의점에서 구매 가능" },
    en: { name: "Get a prepaid SIM", desc: "Airport or convenience stores nationwide" },
    done: true, urgent: false,
  },
  {
    id: "t3", icon: "🪪",
    ko: { name: "외국인 등록증 신청", desc: "입국 후 90일 이내 출입국사무소 방문 필수" },
    en: { name: "Apply for Alien Registration", desc: "Visit immigration office within 90 days" },
    done: false, urgent: true, deadline: "D-23",
  },
  {
    id: "t4", icon: "🏦",
    ko: { name: "은행 계좌 개설", desc: "신한·하나 은행, 영어 지원 가능" },
    en: { name: "Open a bank account", desc: "Shinhan / Hana bank — both support English" },
    done: false, next: true,
  },
  {
    id: "t5", icon: "🏥",
    ko: { name: "건강보험 가입", desc: "6개월 이상 체류 시 의무 가입" },
    en: { name: "Enroll in health insurance", desc: "Required for stays of 6+ months" },
    done: false, next: true,
  },
];

export default function TasksPage() {
  const isKo = useLang();
  const isDark = useTheme() === "dark";
  const [checked, setChecked] = useState<Record<string, boolean>>({ t1: true, t2: true });
  const [activeStage, setActiveStage] = useState(CURRENT_STAGE);

  const stages = isKo ? STAGE_NAMES.ko : STAGE_NAMES.en;
  const doneCount = Object.values(checked).filter(Boolean).length;

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  // Stage hero
  const stageHero = (
    <div style={{
      margin: "16px 16px 0",
      borderRadius: 22,
      background: "linear-gradient(160deg, #1A0E14 0%, #120A0F 100%)",
      padding: "20px 22px 18px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* BG decoration */}
      <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
      <div style={{ position: "absolute", bottom: -20, right: 30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, position: "relative" }}>
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", color: "rgba(255,255,255,0.75)", background: "rgba(255,255,255,0.15)", padding: "3px 10px", borderRadius: 999 }}>
          STAGE {String(CURRENT_STAGE + 1).padStart(2, "0")}
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>{stages[CURRENT_STAGE]}</span>
      </div>

      <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: "-1px", marginBottom: 14 }}>
        {doneCount}<span style={{ fontSize: 18, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>/{TASKS.length} 완료</span>
      </div>

      {/* 5-segment progress bar */}
      <div style={{ display: "flex", gap: 5, marginBottom: 14 }}>
        {TASKS.map((t, i) => {
          const isChecked = checked[t.id] ?? t.done;
          return (
            <div key={t.id} style={{ flex: 1, height: 5, borderRadius: 99, background: isChecked ? "#fff" : "rgba(255,255,255,0.22)" }} />
          );
        })}
      </div>

      {/* Footer: next urgent task */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
          {isKo ? "다음: 외국인 등록증 신청" : "Next: Alien Registration"}
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, background: "var(--grade-b)", color: "var(--grade-b-text)", padding: "3px 9px", borderRadius: 999 }}>D-23</span>
      </div>
    </div>
  );

  // Stage chips — navigate to sub-pages
  const stageChips = (
    <div style={{ display: "flex", gap: 6, padding: "14px 16px 4px", overflowX: "auto", scrollbarWidth: "none" }}>
      {stages.map((s, i) => {
        const active = i === activeStage;
        return (
          <Link key={s} href={`/tasks/${STAGE_SLUGS[i]}`} style={{ textDecoration: "none", flexShrink: 0 }}>
            <span style={{
              display: "inline-block", fontSize: 12, fontWeight: active ? 700 : 500,
              padding: "6px 14px", borderRadius: 999,
              background: active ? "var(--grade-s)" : "var(--card)",
              color: active ? "#fff" : "var(--foreground-muted)",
              border: active ? "none" : "1px solid var(--border)",
            }}>
              {s}
            </span>
          </Link>
        );
      })}
    </div>
  );

  // Task list
  const taskList = (
    <div style={{ padding: "10px 16px 0", display: "flex", flexDirection: "column", gap: 9 }}>
      {TASKS.map((task) => {
        const isChecked = checked[task.id] ?? task.done;
        const info = isKo ? task.ko : task.en;
        const isUrgent = task.urgent && !isChecked;
        const isNext = (task as { next?: boolean }).next && !isChecked;

        return (
          <div key={task.id} style={{
            background: "var(--card)",
            borderRadius: 16,
            border: isUrgent ? "1.5px solid var(--grade-s)" : "1px solid var(--border)",
            padding: "13px 14px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: isUrgent ? "0 2px 12px -4px rgba(255,86,54,0.25)" : "0 1px 4px rgba(0,0,0,0.04)",
          }}>
            {/* Status square */}
            <button
              onClick={() => toggle(task.id)}
              style={{
                width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                background: isChecked ? "var(--grade-a)" : isUrgent ? "transparent" : "transparent",
                border: isChecked ? "none" : isUrgent ? "2px solid var(--grade-s)" : "2px solid var(--border)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {isChecked && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              )}
            </button>

            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{
                fontSize: 14, fontWeight: 700,
                color: isChecked ? "var(--foreground-muted)" : "var(--foreground)",
                textDecoration: isChecked ? "line-through" : "none",
              }}>
                {info.name}
              </span>
              <div style={{ fontSize: 11, color: "var(--foreground-muted)", marginTop: 2 }}>{info.desc}</div>
            </div>

            {/* Status pill */}
            {isChecked && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: "var(--badge-en-bg)", color: "var(--badge-en-fg)", flexShrink: 0 }}>완료</span>
            )}
            {isUrgent && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: "var(--grade-s)", color: "#fff", flexShrink: 0 }}>
                {(task as { deadline?: string }).deadline}
              </span>
            )}
            {isNext && (
              <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 999, background: "var(--nat-bg)", color: "var(--nat-fg)", flexShrink: 0 }}>다음</span>
            )}
          </div>
        );
      })}
      <div style={{ height: 16 }} />
    </div>
  );

  return (
    <div style={{ background: "var(--background)", minHeight: "100%" }}>
      {stageHero}
      {stageChips}
      {taskList}
    </div>
  );
}
