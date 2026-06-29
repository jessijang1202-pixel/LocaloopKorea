"use client";

import { useState } from "react";
import { useLang } from "@/lib/lang";
import { useTheme } from "@/lib/theme";

const STAGES = {
  en: ["Arrival", "Early Life", "Settlement", "Community", "Long-term"],
  ko: ["도착", "초기 생활", "정착", "커뮤니티", "장기 거주"],
};
const CURRENT_STAGE = 1;

const TASKS = [
  {
    id: "t1", icon: "🚌",
    en: { name: "Get a transit card", desc: "T-money card · Available at convenience stores & airports", detail: "Pick up a T-money card at any GS25, CU, or 7-Eleven convenience store, or at the airport information desk. Load it with ₩10,000 to start. You can use it on all subway lines, buses, and even some taxis in Seoul.", steps: ["Go to any convenience store", "Ask for a T-money card (티머니 주세요)", "Load ₩10,000 minimum", "Tap to ride buses and subway"] },
    ko: { name: "교통카드 구매", desc: "T-money 카드, 편의점이나 역에서 구매 가능해요", detail: "GS25, CU, 세븐일레븐 등 편의점이나 공항 안내 데스크에서 T-money 카드를 구매하세요. 서울 지하철, 버스, 일부 택시에서 사용할 수 있어요.", steps: ["편의점 방문", "'티머니 주세요' 요청", "최소 1만원 충전", "지하철·버스 탑승 시 태그"] },
    done: true, urgent: false,
  },
  {
    id: "t2", icon: "📱",
    en: { name: "Get a prepaid SIM", desc: "Available at airport or convenience stores nationwide", detail: "Buy a prepaid SIM (선불 유심) at the airport arrival hall from KT, SKT, or LG U+ booths. You can also get one at any convenience store or at a phone shop (핸드폰 가게). Bring your passport.", steps: ["Find a carrier booth at the airport (KT/SKT/LGU+)", "Show your passport", "Choose a data plan", "Insert SIM and activate"] },
    ko: { name: "선불 유심 가입", desc: "공항 또는 편의점에서 구매 가능", detail: "공항 입국장에서 KT, SKT, LG U+ 부스를 찾거나 편의점에서 선불 유심을 구매하세요. 여권이 필요합니다.", steps: ["공항 통신사 부스 방문", "여권 제시", "데이터 요금제 선택", "유심 삽입 및 개통"] },
    done: true, urgent: false,
  },
  {
    id: "t3", icon: "🪪",
    en: { name: "Apply for Alien Registration", desc: "Visit immigration office within 90 days of arrival", detail: "The Alien Registration Card (ARC / 외국인등록증) is essential for opening a bank account, signing contracts, and more. Visit the nearest immigration office (출입국관리사무소) within 90 days of arrival.", steps: ["Download the HiKorea app or visit hikorea.go.kr", "Make an appointment online", "Bring passport + visa + 1 photo (3.5×4.5cm)", "Pay ₩30,000 fee at the office"] },
    ko: { name: "외국인 등록증 신청", desc: "입국 후 90일 이내 출입국사무소 방문 필수", detail: "외국인등록증(ARC)은 은행 계좌 개설, 계약 등에 필수입니다. 입국 후 90일 이내에 가까운 출입국관리사무소를 방문하세요.", steps: ["하이코리아(hikorea.go.kr) 예약", "여권 + 비자 + 사진 1장(3.5×4.5) 준비", "사무소 방문", "수수료 3만원 납부"] },
    done: false, urgent: true, deadline: "D-23",
  },
  {
    id: "t4", icon: "🏦",
    en: { name: "Open a bank account", desc: "Shinhan / Hana bank — both support English", detail: "Shinhan Bank (신한은행) and KEB Hana Bank (하나은행) have the most foreigner-friendly English service. Bring your ARC card, passport, and USIM. The process usually takes 30–45 minutes.", steps: ["Get your ARC card first (required)", "Visit a Shinhan or Hana branch", "Bring: ARC + passport + SIM card", "Ask for English service (영어 직원 있나요?)"] },
    ko: { name: "은행 계좌 개설", desc: "신한·하나 은행, 영어 지원 가능", detail: "신한은행 또는 KEB하나은행은 외국인 영어 서비스가 가장 잘 되어 있어요. ARC카드 발급 후 여권, 유심 카드를 챙겨서 방문하세요.", steps: ["외국인등록증 먼저 발급 필요", "신한 또는 하나은행 지점 방문", "ARC + 여권 + 유심 카드 지참", "'영어 직원 있나요?' 요청"] },
    done: false, next: true,
  },
  {
    id: "t5", icon: "🏥",
    en: { name: "Enroll in health insurance", desc: "Required for stays of 6+ months", detail: "If you plan to stay more than 6 months, you must enroll in the National Health Insurance (NHI). You can do this at any NHIS (국민건강보험공단) office or online at nhis.or.kr.", steps: ["Confirm your ARC card is ready", "Visit nhis.or.kr or nearest NHIS office", "Fill in enrollment form", "Monthly premium calculated by your income"] },
    ko: { name: "건강보험 가입", desc: "6개월 이상 체류 시 의무 가입", detail: "6개월 이상 거주 시 국민건강보험(NHI) 가입이 의무입니다. 국민건강보험공단 지사를 방문하거나 nhis.or.kr에서 온라인 신청 가능합니다.", steps: ["외국인등록증 발급 완료 확인", "nhis.or.kr 또는 공단 지사 방문", "가입 신청서 작성", "소득에 따른 월 보험료 산정"] },
    done: false, next: true,
  },
];

const T = {
  ko: { currentStage: "현재 단계", done: "완료", next: "다음", urgent: "긴급", doneCount: (n: number) => `${n}개 완료`, remaining: (n: number) => `${n}개 남음`, steps: "진행 단계", howTo: "어떻게 하나요?", complete: "완료 표시", undo: "취소", searchPh: "과제 검색...", noResults: "해당하는 과제가 없어요" },
  en: { currentStage: "Current Stage", done: "Done", next: "Up Next", urgent: "Urgent", doneCount: (n: number) => `${n} done`, remaining: (n: number) => `${n} remaining`, steps: "Steps", howTo: "How to do it", complete: "Mark Complete", undo: "Undo", searchPh: "Search tasks...", noResults: "No tasks found" },
};

export default function TasksPage() {
  const isKo = useLang();
  const isDark = useTheme() === "dark";
  const [checked, setChecked] = useState<Record<string, boolean>>({ t1: true, t2: true });
  const [selectedId, setSelectedId] = useState("t3");
  const [search, setSearch] = useState("");

  const t = isKo ? T.ko : T.en;
  const stages = isKo ? STAGES.ko : STAGES.en;
  const doneCount = Object.values(checked).filter(Boolean).length;
  const total = TASKS.length;
  const selectedTask = TASKS.find((task) => task.id === selectedId) ?? TASKS[2];

  const filteredTasks = TASKS.filter((task) => {
    if (!search) return true;
    const info = isKo ? task.ko : task.en;
    const q = search.toLowerCase();
    return info.name.toLowerCase().includes(q) || info.desc.toLowerCase().includes(q);
  });

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const stageBar = (
    <div style={{ background: isDark ? "#0B1E2D" : "var(--card)", paddingTop: 12, paddingBottom: 16, paddingInline: 16, flexShrink: 0, borderBottom: isDark ? "none" : "1px solid var(--border)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: isDark ? "#8BB8C0" : "var(--muted-foreground)" }}>
          {t.currentStage}: <span style={{ color: "#15b6c1", fontWeight: 700 }}>{stages[CURRENT_STAGE]}</span>
        </span>
        <span style={{ fontSize: 11, color: isDark ? "#8BB8C0" : "var(--muted-foreground)" }}>
          {t.doneCount(doneCount)} / {t.remaining(total - doneCount)}
        </span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {stages.map((stage, i) => {
          const isDone = i < CURRENT_STAGE;
          const isCurrent = i === CURRENT_STAGE;
          return (
            <div key={stage} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ height: 4, borderRadius: 4, width: "100%", background: isDone ? "#15b6c1" : isCurrent ? "rgba(21,182,193,0.4)" : isDark ? "rgba(255,255,255,0.1)" : "var(--border)" }} />
              <span style={{ fontSize: 9, color: isDone ? "#15b6c1" : isCurrent ? "#15b6c1" : isDark ? "rgba(255,255,255,0.3)" : "var(--muted-foreground)", fontWeight: isCurrent ? 700 : 400, textAlign: "center", lineHeight: 1.2 }}>
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const searchBar = (
    <div style={{ padding: "8px 12px 6px", background: "var(--card)", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
      <div style={{ background: "var(--content-bg)", borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>🔍</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.searchPh}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 12, color: "var(--foreground)" }}
        />
        {search && (
          <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "var(--muted-foreground)", cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1 }}>✕</button>
        )}
      </div>
    </div>
  );

  const taskList = (scrollable = false) => (
    <div style={scrollable ? { flex: 1, overflowY: "auto", minHeight: 0, background: "var(--content-bg)", padding: "10px 12px 0" } : { background: "var(--content-bg)", padding: "10px 14px 0" }}>
      {filteredTasks.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--muted-foreground)", fontSize: 13 }}>{t.noResults}</div>
      )}
      {filteredTasks.map((task) => {
        const isChecked = checked[task.id] ?? task.done;
        const info = isKo ? task.ko : task.en;
        const isSelected = task.id === selectedId;
        return (
          <div
            key={task.id}
            onClick={() => setSelectedId(task.id)}
            style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px", marginBottom: 7, background: isSelected ? "var(--card-selected)" : "var(--card)", borderRadius: 12, border: isSelected ? "1.5px solid #15b6c1" : task.urgent ? "1.5px solid #FFCDD2" : "1px solid var(--border)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", opacity: isChecked ? 0.7 : 1, cursor: "pointer" }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); toggle(task.id); }}
              style={{ width: 22, height: 22, borderRadius: 7, border: "none", background: isChecked ? "#15b6c1" : "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, marginTop: 1, fontSize: 11, color: "#fff" }}
            >
              {isChecked ? "✓" : ""}
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)", textDecoration: isChecked ? "line-through" : "none" }}>{info.name}</span>
                {task.urgent && !isChecked && <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 4, background: "#FFEBEE", color: "#C62828", fontWeight: 700, flexShrink: 0 }}>{(task as { deadline?: string }).deadline} · {t.urgent}</span>}
                {isChecked && <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 4, background: "#E8F5E9", color: "#2E7D32", fontWeight: 700, flexShrink: 0 }}>{t.done}</span>}
                {(task as { next?: boolean }).next && !isChecked && <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 4, background: "#E8F4FF", color: "#1565C0", fontWeight: 700, flexShrink: 0 }}>{t.next}</span>}
              </div>
              <p style={{ fontSize: 10, color: "var(--muted-foreground)", lineHeight: 1.4 }}>{info.desc}</p>
            </div>
          </div>
        );
      })}
      <div style={{ height: 12 }} />
    </div>
  );

  const taskDetail = () => {
    const info = isKo ? selectedTask.ko : selectedTask.en;
    const isChecked = checked[selectedTask.id] ?? selectedTask.done;
    return (
      <div style={{ height: "100%", overflowY: "auto", padding: "32px 40px 40px", background: "var(--content-bg)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: isChecked ? "#E8F5E9" : selectedTask.urgent ? "#FFEBEE" : "#E8F4FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, flexShrink: 0 }}>
            {selectedTask.icon}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              {selectedTask.urgent && !isChecked && <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 6, background: "#FFEBEE", color: "#C62828", fontWeight: 700 }}>{(selectedTask as { deadline?: string }).deadline} · {t.urgent}</span>}
              {isChecked && <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 6, background: "#E8F5E9", color: "#2E7D32", fontWeight: 700 }}>{t.done}</span>}
              {(selectedTask as { next?: boolean }).next && !isChecked && <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 6, background: "#E8F4FF", color: "#1565C0", fontWeight: 700 }}>{t.next}</span>}
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "var(--foreground)", lineHeight: 1.2, marginBottom: 4 }}>{info.name}</h2>
            <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>{info.desc}</p>
          </div>
        </div>
        <div style={{ background: "var(--card)", borderRadius: 16, padding: "18px 20px", border: "1px solid var(--border)", marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#15b6c1", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.howTo}</div>
          <p style={{ fontSize: 13, color: "var(--foreground)", lineHeight: 1.7 }}>{info.detail}</p>
        </div>
        <div style={{ background: "var(--card)", borderRadius: 16, padding: "18px 20px", border: "1px solid var(--border)", marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#15b6c1", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.steps}</div>
          {info.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: i < info.steps.length - 1 ? 12 : 0 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#15b6c1", color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
              <p style={{ fontSize: 13, color: "var(--foreground)", lineHeight: 1.5, paddingTop: 2 }}>{step}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => toggle(selectedTask.id)}
          style={{ width: "100%", padding: "14px 0", borderRadius: 14, border: isChecked ? "2px solid #15b6c1" : "none", background: isChecked ? "transparent" : "#15b6c1", color: isChecked ? "#15b6c1" : "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer" }}
        >
          {isChecked ? `↩ ${t.undo}` : `✓ ${t.complete}`}
        </button>
      </div>
    );
  };

  return (
    <>
      {/* ── Mobile layout ── */}
      <div className="ll-mobile-only" style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
        {stageBar}
        {searchBar}
        {taskList()}
      </div>

      {/* ── PC split layout ── */}
      <div className="ll-pc-only ll-split">
        <div className="ll-split-panel">
          {stageBar}
          {searchBar}
          {taskList(true)}
        </div>
        <div className="ll-split-main">
          {taskDetail()}
        </div>
      </div>
    </>
  );
}
