"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchPlacesWithGrades,
  fetchSources,
  addSource,
  deleteSource,
  updateSource,
  saveManualScores,
  setGradeOverride,
  recomputeGrade,
  recomputeAll,
  type PlaceWithGrade,
  type RecomputeResult,
} from "@/lib/grading/db";
import type {
  GradingSourceRow,
  GradingSourceType,
} from "@/types/grading";
import type { ScoreCategory } from "@/lib/grading";
import { ADMIN_GRADE_COLORS, ADMIN_GRADE_TEXT } from "@/lib/grades";
import { CARD_SOFT } from "@/components/admin/adminStyles";

const GRADES: ("S" | "A" | "B" | "C" | "D")[] = ["S", "A", "B", "C", "D"];

const CATEGORY_LABELS: Record<string, string> = {
  restaurant: "음식점",
  bar: "바",
  cafe: "카페",
  health: "헬스/체육",
  activity: "액티비티",
  accommodation: "숙박",
};

const RISK_LABELS: Record<ScoreCategory, string> = {
  LS: "언어 지원",
  AR: "출입 제한",
  PD: "절차 난이도",
  LF: "로컬 적합도",
};

const SUBSCORE_FIELDS: { key: ScoreCategory; label: string }[] = [
  { key: "LS", label: "LS 언어 지원" },
  { key: "AR", label: "AR 출입 제한" },
  { key: "PD", label: "PD 절차 난이도" },
  { key: "LF", label: "LF 로컬 적합도" },
];

const SOURCE_TYPE_OPTIONS: { value: GradingSourceType; label: string }[] = [
  { value: "manual", label: "수동 입력" },
  { value: "naver_map", label: "네이버 지도" },
  { value: "kakao_map", label: "카카오맵" },
  { value: "google_map", label: "구글 지도" },
  { value: "blog", label: "블로그" },
  { value: "instagram", label: "인스타그램" },
  { value: "x", label: "X (트위터)" },
  { value: "review", label: "리뷰" },
  { value: "other", label: "기타" },
];

const SOURCE_TYPE_LABELS: Record<GradingSourceType, string> = Object.fromEntries(
  SOURCE_TYPE_OPTIONS.map((o) => [o.value, o.label])
) as Record<GradingSourceType, string>;

const MUTED = "#8A8478";
const ACCENT = "#FF5636";
const POSITIVE = "#12A05A";

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function errMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

function GradeBadge({ grade }: { grade: string | null }) {
  if (!grade) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 30,
          height: 30,
          borderRadius: 9,
          background: "#F0EBDE",
          color: "#B3AC9F",
          fontSize: 14,
          fontWeight: 700,
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        —
      </span>
    );
  }
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 30,
        height: 30,
        borderRadius: 9,
        background: ADMIN_GRADE_COLORS[grade] ?? "#9A9488",
        color: ADMIN_GRADE_TEXT[grade] ?? "#fff",
        fontSize: 14,
        fontWeight: 700,
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {grade}
    </span>
  );
}

const TH: React.CSSProperties = {
  padding: "13px 16px",
  textAlign: "left",
  fontSize: 12.5,
  fontWeight: 600,
  color: MUTED,
  whiteSpace: "nowrap",
};

const TH_NUM: React.CSSProperties = { ...TH, textAlign: "center" };

const TD: React.CSSProperties = {
  padding: "13px 16px",
  fontSize: 14,
  color: "#16151A",
  verticalAlign: "middle",
};

const TD_NUM: React.CSSProperties = {
  ...TD,
  fontSize: 12.5,
  textAlign: "center",
  color: "#6C665B",
};

const INPUT_BASE: React.CSSProperties = {
  boxSizing: "border-box",
  padding: "9px 12px",
  borderRadius: 10,
  border: "1px solid #E5DED4",
  fontSize: 13.5,
  outline: "none",
  background: "#fff",
  color: "#16151A",
};

export default function GradingPage() {
  const [places, setPlaces] = useState<PlaceWithGrade[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [recomputing, setRecomputing] = useState<"all" | "force" | null>(null);
  const [recomputeResult, setRecomputeResult] = useState<RecomputeResult | null>(
    null
  );
  const [recomputeError, setRecomputeError] = useState<string | null>(null);

  const selected = useMemo(
    () => places?.find((p) => p.id === selectedId) ?? null,
    [places, selectedId]
  );

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const rows = await fetchPlacesWithGrades();
      setPlaces(rows);
    } catch (e) {
      setLoadError(errMessage(e));
      setPlaces(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const runRecompute = async (mode: "all" | "force") => {
    setRecomputing(mode);
    setRecomputeError(null);
    setRecomputeResult(null);
    try {
      const res = await recomputeAll(mode === "force");
      setRecomputeResult(res);
      await reload();
    } catch (e) {
      setRecomputeError(errMessage(e));
    } finally {
      setRecomputing(null);
    }
  };

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontSize: 13, color: MUTED, maxWidth: 560, lineHeight: 1.6 }}>
          웹 데이터 키워드 분석으로 외국인 친화도 등급을 자동 산출합니다. 매일
          03:00 자동 갱신됩니다.
          {(recomputeResult || recomputeError) && (
            <div style={{ marginTop: 8 }}>
              {recomputeError ? (
                <span style={{ color: ACCENT, fontSize: 12.5 }}>
                  {recomputeError}
                </span>
              ) : recomputeResult ? (
                <span style={{ color: MUTED, fontSize: 12.5 }}>
                  총 {recomputeResult.total}곳 중 {recomputeResult.updated}곳 갱신,{" "}
                  {recomputeResult.skipped}곳 건너뜀
                  {recomputeResult.errors.length > 0
                    ? `, ${recomputeResult.errors.length}건 오류`
                    : ""}
                </span>
              ) : null}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => void runRecompute("force")}
            disabled={recomputing !== null}
            title="수동 조정 포함 덮어쓰기"
            style={{
              padding: "9px 14px",
              borderRadius: 12,
              background: "#fff",
              color: "#6C665B",
              border: "1px solid #E5DED4",
              cursor: recomputing !== null ? "default" : "pointer",
              fontSize: 13,
              fontWeight: 600,
              opacity: recomputing !== null ? 0.6 : 1,
            }}
          >
            {recomputing === "force" ? "계산 중..." : "강제 재계산"}
          </button>
          <button
            onClick={() => void runRecompute("all")}
            disabled={recomputing !== null}
            style={{
              padding: "10px 18px",
              borderRadius: 12,
              background: ACCENT,
              color: "#fff",
              border: "none",
              cursor: recomputing !== null ? "default" : "pointer",
              fontSize: 14,
              fontWeight: 600,
              opacity: recomputing !== null ? 0.7 : 1,
            }}
          >
            {recomputing === "all" ? "계산 중..." : "전체 재계산"}
          </button>
        </div>
      </div>

      {/* Places table */}
      <div style={{ ...CARD_SOFT, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "48px 20px", textAlign: "center", color: MUTED, fontSize: 14 }}>
            불러오는 중...
          </div>
        ) : loadError ? (
          <div style={{ padding: "36px 24px", color: ACCENT, fontSize: 13.5 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>{loadError}</div>
            <div style={{ color: MUTED, fontSize: 12.5 }}>
              Supabase 마이그레이션(20260710_grading_engine.sql)이 적용되었는지
              확인하세요.
            </div>
          </div>
        ) : !places || places.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center", color: MUTED, fontSize: 14 }}>
            장소 데이터가 없습니다.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #F0EBDE", background: "#FAFAF8" }}>
                  <th style={TH}>장소</th>
                  <th style={TH}>카테고리</th>
                  <th style={TH_NUM}>등급</th>
                  <th style={TH_NUM}>LS</th>
                  <th style={TH_NUM}>AR</th>
                  <th style={TH_NUM}>PD</th>
                  <th style={TH_NUM}>LF</th>
                  <th style={TH_NUM}>FS</th>
                  <th style={TH}>상태</th>
                  <th style={TH}>계산일</th>
                </tr>
              </thead>
              <tbody>
                {places.map((p, i) => {
                  const effGrade = p.grade_override ?? p.grade;
                  const isManual =
                    !!p.grade_override || (p.details?.manual_override ?? false);
                  const active = p.id === selectedId;
                  return (
                    <tr
                      key={p.id}
                      className="admin-row"
                      onClick={() => setSelectedId(active ? null : p.id)}
                      style={{
                        borderTop: i === 0 ? "none" : "1px solid #F5F0EA",
                        cursor: "pointer",
                        background: active ? "#FBF4F1" : undefined,
                      }}
                    >
                      <td style={TD}>
                        <div style={{ fontWeight: 500 }}>{p.name_ko}</div>
                        {p.name_en && (
                          <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
                            {p.name_en}
                          </div>
                        )}
                      </td>
                      <td style={{ ...TD, fontSize: 13.5, color: "#6C665B" }}>
                        {CATEGORY_LABELS[p.category] ?? p.category}
                      </td>
                      <td style={{ ...TD, textAlign: "center" }}>
                        <GradeBadge grade={effGrade} />
                      </td>
                      <td style={TD_NUM}>{p.ls_score}</td>
                      <td style={TD_NUM}>{p.ar_score}</td>
                      <td style={TD_NUM}>{p.pd_score}</td>
                      <td style={TD_NUM}>{p.lf_score}</td>
                      <td style={{ ...TD_NUM, fontWeight: 700, color: "#16151A", fontSize: 13.5 }}>
                        {p.details ? p.details.fs.toFixed(1) : "—"}
                      </td>
                      <td style={TD}>
                        {!p.details ? (
                          <StatusChip
                            label="미계산"
                            bg="#F5F3EF"
                            color="#B3AC9F"
                          />
                        ) : isManual ? (
                          <StatusChip label="수동 조정" bg="#FFF3DC" color="#a06b00" />
                        ) : (
                          <StatusChip label="자동" bg="#F2EDE4" color={MUTED} />
                        )}
                      </td>
                      <td style={{ ...TD, fontSize: 13, color: "#B3AC9F" }}>
                        {formatDate(p.details?.computed_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <DetailPanel
          key={selected.id}
          place={selected}
          onClose={() => setSelectedId(null)}
          onChanged={reload}
        />
      )}
    </div>
  );
}

function StatusChip({
  label,
  bg,
  color,
}: {
  label: string;
  bg: string;
  color: string;
}) {
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: 999,
        background: bg,
        color,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: 14.5,
        color: "#16151A",
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}

function DetailPanel({
  place,
  onClose,
  onChanged,
}: {
  place: PlaceWithGrade;
  onClose: () => void;
  onChanged: () => Promise<void>;
}) {
  const details = place.details;
  const effGrade = place.grade_override ?? place.grade;

  // Sub-score editor state
  const [ls, setLs] = useState(String(place.ls_score));
  const [ar, setAr] = useState(String(place.ar_score));
  const [pd, setPd] = useState(String(place.pd_score));
  const [lf, setLf] = useState(String(place.lf_score));
  const subValues: Record<ScoreCategory, string> = { LS: ls, AR: ar, PD: pd, LF: lf };
  const subSetters: Record<ScoreCategory, (v: string) => void> = {
    LS: setLs,
    AR: setAr,
    PD: setPd,
    LF: setLf,
  };

  const [savingScores, setSavingScores] = useState(false);
  const [overrideBusy, setOverrideBusy] = useState(false);
  const [recomputeBusy, setRecomputeBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Sources
  const [sources, setSources] = useState<GradingSourceRow[] | null>(null);
  const [sourcesLoading, setSourcesLoading] = useState(true);
  const [sourcesError, setSourcesError] = useState<string | null>(null);

  const [newType, setNewType] = useState<GradingSourceType>("manual");
  const [newUrl, setNewUrl] = useState("");
  const [newContent, setNewContent] = useState("");
  const [addingSource, setAddingSource] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [editContent, setEditContent] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const loadSources = useCallback(async () => {
    setSourcesLoading(true);
    setSourcesError(null);
    try {
      const rows = await fetchSources(place.id);
      setSources(rows);
    } catch (e) {
      setSourcesError(errMessage(e));
      setSources(null);
    } finally {
      setSourcesLoading(false);
    }
  }, [place.id]);

  useEffect(() => {
    void loadSources();
  }, [loadSources]);

  const clamp = (v: string) => Math.max(0, Math.min(100, Math.round(Number(v) || 0)));

  const handleSaveScores = async () => {
    setSavingScores(true);
    setActionError(null);
    try {
      await saveManualScores(place.id, {
        LS: clamp(ls),
        AR: clamp(ar),
        PD: clamp(pd),
        LF: clamp(lf),
      });
      await onChanged();
    } catch (e) {
      setActionError(errMessage(e));
    } finally {
      setSavingScores(false);
    }
  };

  const handleOverride = async (grade: string | null) => {
    setOverrideBusy(true);
    setActionError(null);
    try {
      await setGradeOverride(
        place.id,
        grade,
        grade ? "관리자 수동 설정" : undefined
      );
      await onChanged();
    } catch (e) {
      setActionError(errMessage(e));
    } finally {
      setOverrideBusy(false);
    }
  };

  const handleRecompute = async () => {
    setRecomputeBusy(true);
    setActionError(null);
    try {
      await recomputeGrade(place.id);
      await onChanged();
      await loadSources();
    } catch (e) {
      setActionError(errMessage(e));
    } finally {
      setRecomputeBusy(false);
    }
  };

  const handleAddSource = async () => {
    if (!newContent.trim()) {
      setSourcesError("소스 내용을 입력하세요.");
      return;
    }
    setAddingSource(true);
    setSourcesError(null);
    try {
      await addSource(place.id, newType, newContent.trim(), newUrl.trim() || undefined);
      setNewContent("");
      setNewUrl("");
      setNewType("manual");
      await loadSources();
    } catch (e) {
      setSourcesError(errMessage(e));
    } finally {
      setAddingSource(false);
    }
  };

  const startEditSource = (s: GradingSourceRow) => {
    setEditingId(s.id);
    setEditUrl(s.url ?? "");
    setEditContent(s.content);
    setSourcesError(null);
  };

  const cancelEditSource = () => {
    setEditingId(null);
    setEditUrl("");
    setEditContent("");
  };

  const handleSaveEditSource = async (id: string) => {
    if (!editContent.trim()) {
      setSourcesError("소스 내용을 입력하세요.");
      return;
    }
    setSavingEdit(true);
    setSourcesError(null);
    try {
      await updateSource(id, {
        url: editUrl.trim() || null,
        content: editContent.trim(),
      });
      cancelEditSource();
      await loadSources();
    } catch (e) {
      setSourcesError(errMessage(e));
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteSource = async (id: string) => {
    setDeletingId(id);
    setSourcesError(null);
    try {
      await deleteSource(id);
      await loadSources();
    } catch (e) {
      setSourcesError(errMessage(e));
    } finally {
      setDeletingId(null);
    }
  };

  const anyBusy = savingScores || overrideBusy || recomputeBusy;

  return (
    <div
      style={{
        ...CARD_SOFT,
        borderTop: `3px solid ${ACCENT}`,
        padding: "22px 24px 26px",
        display: "flex",
        flexDirection: "column",
        gap: 26,
      }}
    >
      {/* Title row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <GradeBadge grade={effGrade} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#16151A" }}>
            {place.name_ko}
          </div>
          {place.name_en && (
            <div style={{ fontSize: 12.5, color: MUTED, marginTop: 2 }}>
              {place.name_en}
            </div>
          )}
        </div>
        <button
          onClick={handleRecompute}
          disabled={anyBusy}
          style={{
            padding: "8px 14px",
            borderRadius: 10,
            background: "#fff",
            border: "1px solid #E5DED4",
            color: "#6C665B",
            fontSize: 13,
            fontWeight: 600,
            cursor: anyBusy ? "default" : "pointer",
            opacity: anyBusy ? 0.6 : 1,
          }}
        >
          {recomputeBusy ? "계산 중..." : "이 장소 재계산"}
        </button>
        <button
          onClick={onClose}
          aria-label="닫기"
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: "#F2EDE4",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#6C665B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {actionError && (
        <div style={{ color: ACCENT, fontSize: 12.5, marginTop: -12 }}>{actionError}</div>
      )}

      {/* Sub-scores editor */}
      <div>
        <SectionTitle>세부 점수 조정</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
          }}
        >
          {SUBSCORE_FIELDS.map((f) => (
            <label key={f.key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 12.5, color: "#6C665B", fontWeight: 500 }}>
                {f.label}
              </span>
              <input
                type="number"
                min={0}
                max={100}
                value={subValues[f.key]}
                onChange={(e) => subSetters[f.key](e.target.value)}
                style={INPUT_BASE}
              />
            </label>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
          <button
            onClick={handleSaveScores}
            disabled={anyBusy}
            style={{
              padding: "9px 16px",
              borderRadius: 10,
              background: ACCENT,
              color: "#fff",
              border: "none",
              fontSize: 13.5,
              fontWeight: 600,
              cursor: anyBusy ? "default" : "pointer",
              opacity: anyBusy ? 0.7 : 1,
            }}
          >
            {savingScores ? "저장 중..." : "점수 저장"}
          </button>
          <span style={{ fontSize: 12, color: MUTED }}>
            저장 시 수동 조정으로 표시되어 자동 재계산에서 제외됩니다.
          </span>
        </div>
      </div>

      {/* Grade override */}
      <div>
        <SectionTitle>등급 수동 지정</SectionTitle>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {GRADES.map((g) => {
            const active = place.grade_override === g;
            return (
              <button
                key={g}
                onClick={() => handleOverride(g)}
                disabled={overrideBusy}
                style={{
                  width: 44,
                  height: 40,
                  borderRadius: 10,
                  border: active ? `2px solid ${ACCENT}` : "1px solid #E5DED4",
                  background: active
                    ? ADMIN_GRADE_COLORS[g] ?? "#9A9488"
                    : "#fff",
                  color: active ? ADMIN_GRADE_TEXT[g] ?? "#fff" : "#6C665B",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: overrideBusy ? "default" : "pointer",
                  opacity: overrideBusy ? 0.6 : 1,
                }}
              >
                {g}
              </button>
            );
          })}
          <button
            onClick={() => handleOverride(null)}
            disabled={overrideBusy || !place.grade_override}
            style={{
              padding: "0 14px",
              height: 40,
              borderRadius: 10,
              border: "1px solid #E5DED4",
              background: "#fff",
              color: "#6C665B",
              fontSize: 13,
              fontWeight: 600,
              cursor:
                overrideBusy || !place.grade_override ? "default" : "pointer",
              opacity: overrideBusy || !place.grade_override ? 0.5 : 1,
            }}
          >
            해제
          </button>
        </div>
      </div>

      {/* Evidence & risk */}
      <div>
        <SectionTitle>근거 및 위험 요소</SectionTitle>
        {details ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {details.risk_flags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {details.risk_flags.map((cat) => (
                  <span
                    key={cat}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "4px 11px",
                      borderRadius: 999,
                      background: "#FDECE8",
                      color: ACCENT,
                    }}
                  >
                    {cat} {RISK_LABELS[cat]}
                  </span>
                ))}
              </div>
            )}
            {details.evidence.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {details.evidence.map((ev, idx) => (
                  <div
                    key={`${ev.category}-${ev.polarity}-${idx}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "7px 2px",
                      borderTop: idx === 0 ? "none" : "1px solid #F5F0EA",
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background:
                          ev.polarity === "negative" ? ACCENT : POSITIVE,
                      }}
                    />
                    <span style={{ flex: 1, fontSize: 13.5, color: "#16151A" }}>
                      {ev.label.ko}
                    </span>
                    <span style={{ fontSize: 12.5, color: MUTED }}>x{ev.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: MUTED }}>
                근거 키워드 없음 — 소스를 추가하고 재계산하세요.
              </div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: 13, color: MUTED }}>
            근거 키워드 없음 — 소스를 추가하고 재계산하세요.
          </div>
        )}
      </div>

      {/* Sources */}
      <div>
        <SectionTitle>수집 소스</SectionTitle>
        {sourcesError && (
          <div style={{ color: ACCENT, fontSize: 12.5, marginBottom: 10 }}>
            {sourcesError}
          </div>
        )}
        {sourcesLoading ? (
          <div style={{ fontSize: 13, color: MUTED }}>소스 불러오는 중...</div>
        ) : sources && sources.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
            {sources.map((s) => {
              const editing = editingId === s.id;
              return (
              <div
                key={s.id}
                style={{
                  border: "1px solid #F0EBDE",
                  borderRadius: 12,
                  padding: "12px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 600,
                      padding: "3px 9px",
                      borderRadius: 999,
                      background: "#F2EDE4",
                      color: "#6C665B",
                    }}
                  >
                    {SOURCE_TYPE_LABELS[s.source_type] ?? s.source_type}
                  </span>
                  <span style={{ fontSize: 12, color: "#B3AC9F", flex: 1 }}>
                    {formatDate(s.collected_at)}
                  </span>
                  {!editing && (
                    <button
                      onClick={() => startEditSource(s)}
                      disabled={editingId !== null || deletingId === s.id}
                      style={{
                        fontSize: 12.5,
                        color: "#6C665B",
                        fontWeight: 600,
                        background: "none",
                        border: "none",
                        cursor:
                          editingId !== null || deletingId === s.id
                            ? "default"
                            : "pointer",
                        opacity:
                          editingId !== null || deletingId === s.id ? 0.5 : 1,
                      }}
                    >
                      수정
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteSource(s.id)}
                    disabled={deletingId === s.id || editing}
                    style={{
                      fontSize: 12.5,
                      color: ACCENT,
                      fontWeight: 600,
                      background: "none",
                      border: "none",
                      cursor:
                        deletingId === s.id || editing ? "default" : "pointer",
                      opacity: deletingId === s.id || editing ? 0.5 : 1,
                    }}
                  >
                    {deletingId === s.id ? "삭제 중..." : "삭제"}
                  </button>
                </div>
                {editing ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <input
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      placeholder="URL (선택)"
                      style={{ ...INPUT_BASE, width: "100%" }}
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      style={{
                        ...INPUT_BASE,
                        resize: "vertical",
                        fontFamily: "inherit",
                        lineHeight: 1.5,
                      }}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => handleSaveEditSource(s.id)}
                        disabled={savingEdit}
                        style={{
                          padding: "7px 14px",
                          borderRadius: 9,
                          background: ACCENT,
                          color: "#fff",
                          border: "none",
                          fontSize: 12.5,
                          fontWeight: 600,
                          cursor: savingEdit ? "default" : "pointer",
                          opacity: savingEdit ? 0.7 : 1,
                        }}
                      >
                        {savingEdit ? "저장 중..." : "저장"}
                      </button>
                      <button
                        onClick={cancelEditSource}
                        disabled={savingEdit}
                        style={{
                          padding: "7px 14px",
                          borderRadius: 9,
                          background: "#fff",
                          color: "#6C665B",
                          border: "1px solid #E5DED4",
                          fontSize: 12.5,
                          fontWeight: 600,
                          cursor: savingEdit ? "default" : "pointer",
                          opacity: savingEdit ? 0.6 : 1,
                        }}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {s.url && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "#7B4DFF",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {s.url}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: 13,
                        color: "#4E4A42",
                        lineHeight: 1.5,
                        maxHeight: 42,
                        overflow: "hidden",
                      }}
                    >
                      {s.content}
                    </div>
                  </>
                )}
              </div>
              );
            })}
          </div>
        ) : (
          <div style={{ fontSize: 13, color: MUTED, marginBottom: 18 }}>
            수집된 소스가 없습니다.
          </div>
        )}

        {/* Add source form */}
        <div
          style={{
            border: "1px solid #F0EBDE",
            borderRadius: 12,
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            background: "#FAFAF8",
          }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as GradingSourceType)}
              style={{ ...INPUT_BASE, minWidth: 140 }}
            >
              {SOURCE_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="URL (선택)"
              style={{ ...INPUT_BASE, flex: 1, minWidth: 200 }}
            />
          </div>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="수집한 리뷰·게시물·공지 텍스트를 붙여넣으세요"
            rows={3}
            style={{ ...INPUT_BASE, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }}
          />
          <div>
            <button
              onClick={handleAddSource}
              disabled={addingSource}
              style={{
                padding: "9px 16px",
                borderRadius: 10,
                background: "#16151A",
                color: "#fff",
                border: "none",
                fontSize: 13.5,
                fontWeight: 600,
                cursor: addingSource ? "default" : "pointer",
                opacity: addingSource ? 0.7 : 1,
              }}
            >
              {addingSource ? "추가 중..." : "소스 추가"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
