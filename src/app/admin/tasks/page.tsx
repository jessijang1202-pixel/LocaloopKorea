"use client";

// Patent no.1 admin — life-task guide (T1~T11) content editor.
//
// Lists the tasks from the code task graph, shows which have a DB override in
// task_guides, and lets an admin edit the effective guide (override if present,
// else code default). Saved guides take priority over the app's code defaults
// (see src/lib/engine/guide-overrides.ts). Mirrors /admin/locality structure.

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ALL_TASKS,
  TASK_GUIDES,
  requiredPredecessors,
  type TaskGuide,
  type TaskId,
} from "@/lib/engine";
import type { TaskNode } from "@/lib/engine";
import {
  fetchTaskGuideOverrides,
  saveTaskGuide,
  deleteTaskGuide,
  seedTaskGuidesFromCode,
  type TaskGuideRow,
} from "@/lib/admin/task-guides-db";
import type { Bi } from "@/types/content";
import { CARD_SOFT } from "@/components/admin/adminStyles";

const MUTED = "#8A8478";
const ACCENT = "#FF5636";

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function errMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

// Map a stored override row into a TaskGuide shape.
function rowToGuide(row: TaskGuideRow): TaskGuide {
  return {
    taskId: row.task_id,
    what: row.what,
    steps: row.steps,
    prepare: row.prepare,
    cautions: row.cautions,
  };
}

const TH: React.CSSProperties = {
  padding: "13px 16px", textAlign: "left", fontSize: 12.5,
  fontWeight: 600, color: MUTED, whiteSpace: "nowrap",
};
const TH_NUM: React.CSSProperties = { ...TH, textAlign: "center" };
const TD: React.CSSProperties = {
  padding: "13px 16px", fontSize: 14, color: "#16151A", verticalAlign: "middle",
};
const TD_NUM: React.CSSProperties = {
  ...TD, fontSize: 12.5, textAlign: "center", color: "#6C665B",
};
const INPUT_BASE: React.CSSProperties = {
  boxSizing: "border-box", padding: "9px 12px", borderRadius: 10,
  border: "1px solid #E5DED4", fontSize: 13.5, outline: "none",
  background: "#fff", color: "#16151A",
};

function StatusChip({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <span style={{
      fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 999,
      background: bg, color, whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

// Coral rounded-square badge holding the T-id (e.g. T1).
function TaskBadge({ id }: { id: TaskId }) {
  return (
    <span style={{
      width: 26, height: 26, borderRadius: 7, flexShrink: 0,
      background: ACCENT, color: "#fff",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: 11.5, fontWeight: 800,
    }}>
      {id}
    </span>
  );
}

export default function TaskGuidesPage() {
  const [overrides, setOverrides] = useState<Map<TaskId, TaskGuideRow>>(new Map());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<TaskId | null>(null);

  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<number | null>(null);
  const [seedError, setSeedError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const rows = await fetchTaskGuideOverrides();
      setOverrides(new Map(rows.map((r) => [r.task_id, r])));
    } catch (e) {
      setLoadError(errMessage(e));
      setOverrides(new Map());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const selected = useMemo(
    () => ALL_TASKS.find((t) => t.id === selectedId) ?? null,
    [selectedId]
  );

  const runSeed = async () => {
    setSeeding(true);
    setSeedError(null);
    setSeedResult(null);
    try {
      const count = await seedTaskGuidesFromCode();
      setSeedResult(count);
      await reload();
    } catch (e) {
      setSeedError(errMessage(e));
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ fontSize: 13, color: MUTED, maxWidth: 620, lineHeight: 1.6 }}>
          생활 태스크 그래프(T1~T11)의 과제별 행동 가이드를 편집합니다. 저장한
          가이드는 앱의 기본 콘텐츠보다 우선 적용됩니다.
          {(seedResult !== null || seedError) && (
            <div style={{ marginTop: 8 }}>
              {seedError ? (
                <span style={{ color: ACCENT, fontSize: 12.5 }}>{seedError}</span>
              ) : seedResult !== null ? (
                <span style={{ color: MUTED, fontSize: 12.5 }}>
                  {seedResult}개 과제 가이드를 불러왔습니다
                </span>
              ) : null}
            </div>
          )}
        </div>
        <button
          onClick={() => void runSeed()}
          disabled={seeding}
          style={{
            padding: "10px 18px", borderRadius: 12, background: ACCENT, color: "#fff",
            border: "none", cursor: seeding ? "default" : "pointer",
            fontSize: 14, fontWeight: 600, opacity: seeding ? 0.7 : 1, flexShrink: 0,
          }}
        >
          {seeding ? "불러오는 중..." : "기본 콘텐츠 불러오기"}
        </button>
      </div>

      {/* Table */}
      <div style={{ ...CARD_SOFT, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "48px 20px", textAlign: "center", color: MUTED, fontSize: 14 }}>
            불러오는 중...
          </div>
        ) : loadError ? (
          <div style={{ padding: "36px 24px", color: ACCENT, fontSize: 13.5 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>{loadError}</div>
            <div style={{ color: MUTED, fontSize: 12.5 }}>
              마이그레이션 20260712_admin_manage.sql 적용 여부를 확인하세요.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #F0EBDE", background: "#FAFAF8" }}>
                  <th style={TH}>과제</th>
                  <th style={TH}>요약</th>
                  <th style={TH}>선행 과제</th>
                  <th style={TH_NUM}>절차 단계 수</th>
                  <th style={TH}>상태</th>
                  <th style={TH}>수정일</th>
                </tr>
              </thead>
              <tbody>
                {ALL_TASKS.map((task, i) => {
                  const override = overrides.get(task.id) ?? null;
                  const guide = override ? rowToGuide(override) : TASK_GUIDES[task.id];
                  const preds = requiredPredecessors(task.id);
                  const active = task.id === selectedId;
                  return (
                    <tr
                      key={task.id}
                      className="admin-row"
                      onClick={() => setSelectedId(active ? null : task.id)}
                      style={{
                        borderTop: i === 0 ? "none" : "1px solid #F5F0EA",
                        cursor: "pointer",
                        background: active ? "#FBF4F1" : undefined,
                      }}
                    >
                      <td style={TD}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <TaskBadge id={task.id} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 500 }}>{task.name.ko}</div>
                            <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{task.name.en}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ ...TD, fontSize: 13, color: "#6C665B", maxWidth: 320 }}>
                        {truncate(task.summary.ko, 42)}
                      </td>
                      <td style={{ ...TD, fontSize: 13, color: "#6C665B" }}>
                        {preds.length > 0 ? preds.join(", ") : "—"}
                      </td>
                      <td style={TD_NUM}>{guide.steps.length}</td>
                      <td style={TD}>
                        {override ? (
                          <StatusChip label="DB 편집됨" bg="#FFF3DC" color="#a06b00" />
                        ) : (
                          <StatusChip label="기본" bg="#F2EDE4" color={MUTED} />
                        )}
                      </td>
                      <td style={{ ...TD, fontSize: 13, color: "#B3AC9F" }}>
                        {formatDate(override?.updated_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail editor */}
      {selected && (
        <GuideEditor
          key={selected.id}
          task={selected}
          override={overrides.get(selected.id) ?? null}
          onClose={() => setSelectedId(null)}
          onChanged={reload}
        />
      )}
    </div>
  );
}

// ── Bi[] <-> textarea (one item per line) helpers ──────────────────────────────

// A guide's ko/en item lists are edited as two aligned textareas. Convert a
// Bi[] to newline-joined text for each language.
function biListToText(list: Bi[], lang: "ko" | "en"): string {
  return list.map((b) => b[lang]).join("\n");
}

// Pair ko/en lines by index; pad the shorter side with "". Empty pairs (both
// blank — e.g. trailing newlines) are dropped so they never persist.
function textToBiList(koText: string, enText: string): Bi[] {
  const ko = koText.split("\n");
  const en = enText.split("\n");
  const len = Math.max(ko.length, en.length);
  const out: Bi[] = [];
  for (let i = 0; i < len; i++) {
    const k = (ko[i] ?? "").trim();
    const e = (en[i] ?? "").trim();
    if (k === "" && e === "") continue;
    out.push({ ko: k, en: e });
  }
  return out;
}

function GuideEditor({
  task,
  override,
  onClose,
  onChanged,
}: {
  task: TaskNode;
  override: TaskGuideRow | null;
  onClose: () => void;
  onChanged: () => Promise<void>;
}) {
  // Effective guide: DB override if present, else code default.
  const base: TaskGuide = override ? rowToGuide(override) : TASK_GUIDES[task.id];

  const [whatKo, setWhatKo] = useState(base.what.ko);
  const [whatEn, setWhatEn] = useState(base.what.en);
  const [stepsKo, setStepsKo] = useState(biListToText(base.steps, "ko"));
  const [stepsEn, setStepsEn] = useState(biListToText(base.steps, "en"));
  const [prepareKo, setPrepareKo] = useState(biListToText(base.prepare, "ko"));
  const [prepareEn, setPrepareEn] = useState(biListToText(base.prepare, "en"));
  const [cautionsKo, setCautionsKo] = useState(biListToText(base.cautions, "ko"));
  const [cautionsEn, setCautionsEn] = useState(biListToText(base.cautions, "en"));

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [restoring, setRestoring] = useState(false);
  const [confirmRestore, setConfirmRestore] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await saveTaskGuide(task.id, {
        what: { ko: whatKo.trim(), en: whatEn.trim() },
        steps: textToBiList(stepsKo, stepsEn),
        prepare: textToBiList(prepareKo, prepareEn),
        cautions: textToBiList(cautionsKo, cautionsEn),
      });
      await onChanged();
    } catch (e) {
      setSaveError(errMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async () => {
    if (!confirmRestore) {
      setConfirmRestore(true);
      setTimeout(() => setConfirmRestore(false), 3000);
      return;
    }
    setRestoring(true);
    setSaveError(null);
    try {
      await deleteTaskGuide(task.id);
      await onChanged();
      onClose();
    } catch (e) {
      setSaveError(errMessage(e));
    } finally {
      setRestoring(false);
      setConfirmRestore(false);
    }
  };

  const textField = (
    label: string,
    value: string,
    set: (v: string) => void,
    rows: number
  ) => (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 12.5, color: "#6C665B", fontWeight: 500 }}>{label}</span>
      <textarea
        value={value}
        onChange={(e) => set(e.target.value)}
        rows={rows}
        style={{ ...INPUT_BASE, resize: "vertical", lineHeight: 1.6, fontFamily: "inherit" }}
      />
    </label>
  );

  const fieldGroup = (
    title: string,
    hint: string | null,
    koNode: React.ReactNode,
    enNode: React.ReactNode
  ) => (
    <div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14.5, color: "#16151A", marginBottom: hint ? 4 : 12 }}>
        {title}
      </div>
      {hint && (
        <div style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>{hint}</div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {koNode}
        {enNode}
      </div>
    </div>
  );

  const LINE_HINT = "한 줄에 한 단계씩, 한국어와 영어 줄 수를 맞춰 주세요";

  return (
    <div style={{
      ...CARD_SOFT, borderTop: `3px solid ${ACCENT}`,
      padding: "22px 24px 26px", display: "flex", flexDirection: "column", gap: 22,
    }}>
      {/* Title row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <TaskBadge id={task.id} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#16151A" }}>{task.name.ko}</div>
          <div style={{ fontSize: 12.5, color: MUTED, marginTop: 2 }}>{task.name.en}</div>
        </div>
        <button
          onClick={onClose}
          aria-label="닫기"
          style={{
            width: 32, height: 32, borderRadius: 9, background: "#F2EDE4",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#6C665B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {saveError && (
        <div style={{ color: ACCENT, fontSize: 12.5, marginTop: -10 }}>
          <div>{saveError}</div>
          <div style={{ color: MUTED, fontSize: 12 }}>
            마이그레이션 20260712_admin_manage.sql 적용 여부를 확인하세요.
          </div>
        </div>
      )}

      {fieldGroup(
        "설명",
        null,
        textField("설명 (한국어)", whatKo, setWhatKo, 4),
        textField("설명 (영어)", whatEn, setWhatEn, 4)
      )}

      {fieldGroup(
        "절차",
        LINE_HINT,
        textField("절차 (한국어)", stepsKo, setStepsKo, 6),
        textField("절차 (영어)", stepsEn, setStepsEn, 6)
      )}

      {fieldGroup(
        "준비물",
        LINE_HINT,
        textField("준비물 (한국어)", prepareKo, setPrepareKo, 4),
        textField("준비물 (영어)", prepareEn, setPrepareEn, 4)
      )}

      {fieldGroup(
        "유의사항",
        LINE_HINT,
        textField("유의사항 (한국어)", cautionsKo, setCautionsKo, 5),
        textField("유의사항 (영어)", cautionsEn, setCautionsEn, 5)
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <button
          onClick={() => void handleSave()}
          disabled={saving}
          style={{
            padding: "9px 16px", borderRadius: 10, background: ACCENT, color: "#fff",
            border: "none", fontSize: 13.5, fontWeight: 600,
            cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "저장 중..." : "저장"}
        </button>
        {override && (
          <button
            onClick={() => void handleRestore()}
            disabled={restoring}
            style={{
              padding: "9px 16px", borderRadius: 10, background: "#fff",
              color: confirmRestore ? ACCENT : "#6C665B",
              border: `1px solid ${confirmRestore ? ACCENT : "#E5DED4"}`,
              fontSize: 13.5, fontWeight: 600,
              cursor: restoring ? "default" : "pointer", opacity: restoring ? 0.7 : 1,
            }}
          >
            {restoring
              ? "복원 중..."
              : confirmRestore
                ? "정말 복원할까요? 다시 클릭"
                : "기본값으로 복원"}
          </button>
        )}
        <span style={{ fontSize: 12, color: MUTED }}>
          저장한 가이드는 앱의 기본 콘텐츠보다 우선 적용됩니다.
        </span>
      </div>
    </div>
  );
}
