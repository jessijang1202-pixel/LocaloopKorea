"use client";

import { useState } from "react";
import { useLang } from "@/lib/lang";
import { TopActions } from "@/components/LangToggle";

const STAGES = {
  en: ["Arrival", "Early Life", "Settlement", "Community", "Long-term"],
  ko: ["도착", "초기 생활", "정착", "커뮤니티", "장기 거주"],
};
const CURRENT_STAGE = 1; // 0-indexed

const TASKS = [
  {
    id: "t1",
    en: { name: "Get a transit card", desc: "T-money card · Available at convenience stores & airports" },
    ko: { name: "교통카드 구매", desc: "T-money 카드, 편의점이나 역에서 구매 가능해요" },
    done: true,
  },
  {
    id: "t2",
    en: { name: "Get a prepaid SIM", desc: "Available at airport or convenience stores nationwide" },
    ko: { name: "선불 유심 가입", desc: "공항 또는 편의점에서 구매 가능" },
    done: true,
  },
  {
    id: "t3",
    en: { name: "Apply for Alien Registration", desc: "Visit immigration office within 90 days of arrival" },
    ko: { name: "외국인 등록증 신청", desc: "입국 후 90일 이내 출입국사무소 방문 필수" },
    done: false,
    urgent: true,
    deadline: "D-23",
  },
  {
    id: "t4",
    en: { name: "Open a bank account", desc: "Shinhan / Hana bank — both support English" },
    ko: { name: "은행 계좌 개설", desc: "신한·하나 은행, 영어 지원 가능" },
    done: false,
    next: true,
  },
  {
    id: "t5",
    en: { name: "Enroll in health insurance", desc: "Required for stays of 6+ months" },
    ko: { name: "건강보험 가입", desc: "6개월 이상 체류 시 의무 가입" },
    done: false,
    next: true,
  },
];

const T = {
  ko: {
    title: "생활 과제",
    currentStage: "현재 단계",
    inProgress: "진행 중",
    done: "완료",
    next: "다음 단계",
    urgent: "긴급",
    doneCount: (n: number) => `${n}개 완료`,
    remaining: (n: number) => `${n}개 남음`,
  },
  en: {
    title: "Life Tasks",
    currentStage: "Current Stage",
    inProgress: "In Progress",
    done: "Done",
    next: "Up Next",
    urgent: "Urgent",
    doneCount: (n: number) => `${n} done`,
    remaining: (n: number) => `${n} remaining`,
  },
};

export default function TasksPage() {
  const isKo = useLang();
  const [checked, setChecked] = useState<Record<string, boolean>>({
    t1: true, t2: true,
  });

  const t = isKo ? T.ko : T.en;
  const stages = isKo ? STAGES.ko : STAGES.en;
  const doneCount = Object.values(checked).filter(Boolean).length;
  const total = TASKS.length;

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      {/* Header */}
      <div style={{ background: "#0B1E2D", paddingTop: 44, paddingBottom: 16, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
          <span style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{t.title}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TopActions />
            <button style={{ background: "rgba(255,255,255,0.12)", border: "none", borderRadius: 8, padding: "6px 10px", color: "#fff", fontSize: 13, cursor: "pointer" }}>
              ℹ️
            </button>
          </div>
        </div>
      </div>

      {/* Stage progress */}
      <div style={{ background: "#0B1E2D", paddingBottom: 20, paddingInline: 16, flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: "#8BB8C0" }}>
            {t.currentStage}: <span style={{ color: "#FFD600", fontWeight: 700 }}>{stages[CURRENT_STAGE]}</span>
          </span>
          <span style={{ fontSize: 11, color: "#8BB8C0" }}>
            {t.doneCount(doneCount)} / {t.remaining(total - doneCount)}
          </span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {stages.map((stage, i) => {
            const isDone = i < CURRENT_STAGE;
            const isCurrent = i === CURRENT_STAGE;
            return (
              <div key={stage} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  height: 4, borderRadius: 4, width: "100%",
                  background: isDone ? "#15b6c1" : isCurrent ? "rgba(21,182,193,0.4)" : "rgba(255,255,255,0.1)",
                }} />
                <span style={{
                  fontSize: 9,
                  color: isDone ? "#15b6c1" : isCurrent ? "#FFD600" : "rgba(255,255,255,0.3)",
                  fontWeight: isCurrent ? 700 : 400,
                  textAlign: "center",
                  lineHeight: 1.2,
                }}>
                  {stage}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task list */}
      <div style={{ flex: 1, overflowY: "auto", background: "#F5F9FA", padding: "12px 14px 0" }}>
        {TASKS.map((task) => {
          const isChecked = checked[task.id] ?? task.done;
          const info = isKo ? task.ko : task.en;
          return (
            <div
              key={task.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "14px 14px",
                marginBottom: 8,
                background: "#fff",
                borderRadius: 14,
                border: task.urgent ? "1.5px solid #FFCDD2" : "1px solid #E0E8EA",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                opacity: isChecked ? 0.7 : 1,
              }}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggle(task.id)}
                style={{
                  width: 24, height: 24, borderRadius: 8, border: "none",
                  background: isChecked ? "#15b6c1" : "#E0E8EA",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0, marginTop: 1,
                  fontSize: 13, color: "#fff",
                }}
              >
                {isChecked ? "✓" : ""}
              </button>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
                  <span style={{
                    fontSize: 13, fontWeight: 700, color: "#1A2B2C",
                    textDecoration: isChecked ? "line-through" : "none",
                  }}>
                    {info.name}
                  </span>
                  {task.urgent && !isChecked && (
                    <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#FFEBEE", color: "#C62828", fontWeight: 700, flexShrink: 0 }}>
                      {task.deadline} · {t.urgent}
                    </span>
                  )}
                  {isChecked && (
                    <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#E8F5E9", color: "#2E7D32", fontWeight: 700, flexShrink: 0 }}>
                      {t.done}
                    </span>
                  )}
                  {task.next && !isChecked && (
                    <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#E8F4FF", color: "#1565C0", fontWeight: 700, flexShrink: 0 }}>
                      {t.next}
                    </span>
                  )}
                  {!task.done && !task.urgent && !task.next && !isChecked && (
                    <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#FFF9C4", color: "#A56000", fontWeight: 700, flexShrink: 0 }}>
                      {t.inProgress}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 11, color: "#4A6467", lineHeight: 1.5 }}>{info.desc}</p>
              </div>
            </div>
          );
        })}
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}
