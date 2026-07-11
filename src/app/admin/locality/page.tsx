"use client";

// Patent no.3 module 100 admin — per-place local-consumption metrics editor and
// locality index (LI) recompute trigger. Mirrors /admin/grading structure.

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchPlacesWithGrades, type PlaceWithGrade } from "@/lib/grading/db";
import {
  fetchAllMetrics,
  saveMetrics,
  fetchCourseFeedback,
  deleteCourseFeedback,
  type PlaceMetricsPatch,
} from "@/lib/course/db";
import { computeLI } from "@/lib/course";
import type { CourseFeedbackRow, PlaceLocalMetricsRow } from "@/types/course";
import { CARD_SOFT } from "@/components/admin/adminStyles";

const MUTED = "#8A8478";
const ACCENT = "#FF5636";
const POSITIVE = "#12A05A";

const CATEGORY_LABELS: Record<string, string> = {
  restaurant: "음식점",
  bar: "바",
  cafe: "카페",
  health: "헬스/체육",
  activity: "액티비티",
  accommodation: "숙박",
  market: "시장",
  shopping: "쇼핑",
};

interface RecomputeSummary {
  total: number;
  updated: number;
  skipped: number;
  errors: string[];
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function errMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

function pct(v: number): string {
  return `${Math.round(v * 100)}%`;
}

function liColor(li: number): string {
  if (li >= 85) return ACCENT;
  if (li >= 70) return POSITIVE;
  return "#9A9488";
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

export default function LocalityPage() {
  const [places, setPlaces] = useState<PlaceWithGrade[] | null>(null);
  const [metrics, setMetrics] = useState<Map<string, PlaceLocalMetricsRow>>(new Map());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [recomputing, setRecomputing] = useState(false);
  const [recomputeResult, setRecomputeResult] = useState<RecomputeSummary | null>(null);
  const [recomputeError, setRecomputeError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [placeRows, metricRows] = await Promise.all([
        fetchPlacesWithGrades(),
        fetchAllMetrics(),
      ]);
      setPlaces(placeRows);
      setMetrics(new Map(metricRows.map((m) => [m.place_id, m])));
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

  const selected = useMemo(
    () => places?.find((p) => p.id === selectedId) ?? null,
    [places, selectedId]
  );

  const runRecompute = async () => {
    setRecomputing(true);
    setRecomputeError(null);
    setRecomputeResult(null);
    try {
      const res = await fetch("/api/admin/locality/recompute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      const json = (await res.json()) as RecomputeSummary & { error?: string };
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      setRecomputeResult(json);
      await reload();
    } catch (e) {
      setRecomputeError(errMessage(e));
    } finally {
      setRecomputing(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ fontSize: 13, color: MUTED, maxWidth: 560, lineHeight: 1.6 }}>
          한국인 소비 데이터 지표로 장소별 로컬성 지수(LI)를 산출합니다. 매일
          03:30 자동 갱신됩니다.
          {(recomputeResult || recomputeError) && (
            <div style={{ marginTop: 8 }}>
              {recomputeError ? (
                <span style={{ color: ACCENT, fontSize: 12.5 }}>{recomputeError}</span>
              ) : recomputeResult ? (
                <span style={{ color: MUTED, fontSize: 12.5 }}>
                  총 {recomputeResult.total}곳 중 {recomputeResult.updated}곳 갱신,{" "}
                  {recomputeResult.skipped}곳 건너뜀
                  {recomputeResult.errors.length > 0 ? `, ${recomputeResult.errors.length}건 오류` : ""}
                </span>
              ) : null}
            </div>
          )}
        </div>
        <button
          onClick={() => void runRecompute()}
          disabled={recomputing}
          style={{
            padding: "10px 18px", borderRadius: 12, background: ACCENT, color: "#fff",
            border: "none", cursor: recomputing ? "default" : "pointer",
            fontSize: 14, fontWeight: 600, opacity: recomputing ? 0.7 : 1, flexShrink: 0,
          }}
        >
          {recomputing ? "계산 중..." : "전체 재계산"}
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
              마이그레이션 20260711_course_engine.sql 적용 여부를 확인하세요.
            </div>
          </div>
        ) : !places || places.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center", color: MUTED, fontSize: 14 }}>
            장소 데이터가 없습니다.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 980 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #F0EBDE", background: "#FAFAF8" }}>
                  <th style={TH}>장소</th>
                  <th style={TH}>카테고리</th>
                  <th style={TH_NUM}>LI</th>
                  <th style={TH_NUM}>한국어 리뷰</th>
                  <th style={TH_NUM}>외국인 방문</th>
                  <th style={TH_NUM}>검색 비율</th>
                  <th style={TH_NUM}>키워드</th>
                  <th style={TH_NUM}>가격</th>
                  <th style={TH}>상태</th>
                  <th style={TH}>갱신일</th>
                </tr>
              </thead>
              <tbody>
                {places.map((p, i) => {
                  const m = metrics.get(p.id) ?? null;
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
                          <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{p.name_en}</div>
                        )}
                      </td>
                      <td style={{ ...TD, fontSize: 13.5, color: "#6C665B" }}>
                        {CATEGORY_LABELS[p.category] ?? p.category}
                      </td>
                      <td style={{ ...TD_NUM, fontWeight: 700, fontSize: 14, color: m ? liColor(m.li) : "#B3AC9F" }}>
                        {m ? m.li.toFixed(1) : "—"}
                      </td>
                      <td style={TD_NUM}>{m ? pct(m.korean_review_ratio) : "—"}</td>
                      <td style={TD_NUM}>{m ? pct(m.foreign_visitor_ratio) : "—"}</td>
                      <td style={TD_NUM}>{m ? pct(m.korean_search_ratio) : "—"}</td>
                      <td style={TD_NUM}>{m ? Math.round(m.local_keyword_score) : "—"}</td>
                      <td style={TD_NUM}>{m ? `₩${m.price_estimate.toLocaleString()}` : "—"}</td>
                      <td style={TD}>
                        {!m ? (
                          <StatusChip label="미계산" bg="#F5F3EF" color="#B3AC9F" />
                        ) : m.manual_override ? (
                          <StatusChip label="수동 조정" bg="#FFF3DC" color="#a06b00" />
                        ) : (
                          <StatusChip label="자동" bg="#F2EDE4" color={MUTED} />
                        )}
                      </td>
                      <td style={{ ...TD, fontSize: 13, color: "#B3AC9F" }}>
                        {formatDate(m?.updated_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Course feedback review */}
      <FeedbackSection />

      {/* Detail editor */}
      {selected && (
        <MetricsEditor
          key={selected.id}
          place={selected}
          metrics={metrics.get(selected.id) ?? null}
          onClose={() => setSelectedId(null)}
          onChanged={reload}
        />
      )}
    </div>
  );
}

function MetricsEditor({
  place,
  metrics,
  onClose,
  onChanged,
}: {
  place: PlaceWithGrade;
  metrics: PlaceLocalMetricsRow | null;
  onClose: () => void;
  onChanged: () => Promise<void>;
}) {
  const [reviewRatio, setReviewRatio] = useState(String(metrics?.korean_review_ratio ?? 0.5));
  const [foreignRatio, setForeignRatio] = useState(String(metrics?.foreign_visitor_ratio ?? 0.5));
  const [searchRatio, setSearchRatio] = useState(String(metrics?.korean_search_ratio ?? 0.5));
  const [keywordScore, setKeywordScore] = useState(String(metrics?.local_keyword_score ?? 0));
  const [price, setPrice] = useState(String(metrics?.price_estimate ?? 10000));
  const [stay, setStay] = useState(String(metrics?.stay_minutes ?? 60));
  const [subtitles, setSubtitles] = useState(metrics?.english_subtitles ?? false);
  const [timeSlot, setTimeSlot] = useState<string>(metrics?.time_slot ?? "");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const clamp01 = (v: string) => Math.max(0, Math.min(1, Number(v) || 0));
  const clamp100 = (v: string) => Math.max(0, Math.min(100, Number(v) || 0));

  const liPreview = computeLI({
    koreanReviewRatio: clamp01(reviewRatio),
    foreignVisitorRatio: clamp01(foreignRatio),
    koreanSearchRatio: clamp01(searchRatio),
    localKeywordScore: clamp100(keywordScore),
  });

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const patch: PlaceMetricsPatch = {
        korean_review_ratio: clamp01(reviewRatio),
        foreign_visitor_ratio: clamp01(foreignRatio),
        korean_search_ratio: clamp01(searchRatio),
        local_keyword_score: clamp100(keywordScore),
        price_estimate: Math.max(0, Math.round(Number(price) || 0)),
        stay_minutes: Math.max(0, Math.round(Number(stay) || 0)),
        english_subtitles: subtitles,
        time_slot: timeSlot === "meal" || timeSlot === "screening" ? timeSlot : null,
      };
      await saveMetrics(place.id, patch);
      await onChanged();
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  const ratioField = (
    label: string,
    value: string,
    set: (v: string) => void,
    max: number,
    step: number
  ) => (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 12.5, color: "#6C665B", fontWeight: 500 }}>{label}</span>
      <input
        type="number" min={0} max={max} step={step} value={value}
        onChange={(e) => set(e.target.value)}
        style={INPUT_BASE}
      />
    </label>
  );

  return (
    <div style={{
      ...CARD_SOFT, borderTop: `3px solid ${ACCENT}`,
      padding: "22px 24px 26px", display: "flex", flexDirection: "column", gap: 22,
    }}>
      {/* Title row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#16151A" }}>{place.name_ko}</div>
          {place.name_en && (
            <div style={{ fontSize: 12.5, color: MUTED, marginTop: 2 }}>{place.name_en}</div>
          )}
        </div>
        <div style={{
          fontSize: 14, fontWeight: 700, color: liColor(liPreview),
          padding: "6px 14px", borderRadius: 999, background: "#FAFAF8",
          border: "1px solid #F0EBDE",
        }}>
          LI 미리보기: {liPreview.toFixed(1)}
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
        <div style={{ color: ACCENT, fontSize: 12.5, marginTop: -10 }}>{saveError}</div>
      )}

      {/* LI input factors */}
      <div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14.5, color: "#16151A", marginBottom: 12 }}>
          LI 산출 지표
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {ratioField("한국어 리뷰 비율 (0-1)", reviewRatio, setReviewRatio, 1, 0.05)}
          {ratioField("외국인 방문 비율 (0-1)", foreignRatio, setForeignRatio, 1, 0.05)}
          {ratioField("한국인 검색 비율 (0-1)", searchRatio, setSearchRatio, 1, 0.05)}
          {ratioField("로컬 키워드 점수 (0-100)", keywordScore, setKeywordScore, 100, 1)}
        </div>
      </div>

      {/* Course composition fields */}
      <div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14.5, color: "#16151A", marginBottom: 12 }}>
          코스 조합 정보
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, alignItems: "end" }}>
          {ratioField("1인 가격 (원)", price, setPrice, 1000000, 1000)}
          {ratioField("체류 시간 (분)", stay, setStay, 600, 5)}
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12.5, color: "#6C665B", fontWeight: 500 }}>시간대 제약</span>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              style={INPUT_BASE}
            >
              <option value="">없음</option>
              <option value="meal">식사</option>
              <option value="screening">상영</option>
            </select>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 10, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={subtitles}
              onChange={(e) => setSubtitles(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: ACCENT }}
            />
            <span style={{ fontSize: 13, color: "#6C665B", fontWeight: 500 }}>영어 자막 제공</span>
          </label>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "9px 16px", borderRadius: 10, background: ACCENT, color: "#fff",
            border: "none", fontSize: 13.5, fontWeight: 600,
            cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "저장 중..." : "저장"}
        </button>
        <span style={{ fontSize: 12, color: MUTED }}>
          저장 시 수동 조정으로 표시되어 자동 재계산에서 제외됩니다.
        </span>
      </div>
    </div>
  );
}

function stopsSummary(course: CourseFeedbackRow["course"]): string {
  const names = [...(course.stops ?? [])]
    .sort((a, b) => a.order - b.order)
    .map((s) => s.name?.ko ?? "")
    .filter(Boolean);
  const joined = names.join(" → ");
  return joined.length > 60 ? `${joined.slice(0, 60)}…` : joined;
}

function FeedbackSection() {
  const [rows, setRows] = useState<CourseFeedbackRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCourseFeedback();
      setRows(data);
    } catch (e) {
      setError(errMessage(e));
      setRows(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDeleteClick = (id: string) => {
    if (confirmId !== id) {
      setConfirmId(id);
      window.setTimeout(() => {
        setConfirmId((cur) => (cur === id ? null : cur));
      }, 3000);
      return;
    }
    void (async () => {
      setDeletingId(id);
      setConfirmId(null);
      try {
        await deleteCourseFeedback(id);
        await load();
      } catch (e) {
        setError(errMessage(e));
      } finally {
        setDeletingId(null);
      }
    })();
  };

  return (
    <div style={{ ...CARD_SOFT, padding: "22px 24px 26px", display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Title row */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14.5, color: "#16151A" }}>
          사용자 코스 피드백
        </div>
        {rows && rows.length > 0 && (
          <span style={{ fontSize: 12.5, color: MUTED }}>{rows.length}건</span>
        )}
      </div>

      {loading ? (
        <div style={{ fontSize: 13, color: MUTED }}>불러오는 중...</div>
      ) : error ? (
        <div style={{ color: ACCENT, fontSize: 13 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>{error}</div>
          <div style={{ color: MUTED, fontSize: 12.5 }}>
            마이그레이션 20260711_course_engine.sql 적용 여부를 확인하세요.
          </div>
        </div>
      ) : !rows || rows.length === 0 ? (
        <div style={{ fontSize: 13.5, color: MUTED }}>아직 수집된 피드백이 없습니다.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rows.map((r) => {
            const confirming = confirmId === r.id;
            const deleting = deletingId === r.id;
            return (
              <div
                key={r.id}
                style={{
                  border: "1px solid #F0EBDE", borderRadius: 12, padding: "12px 14px",
                  display: "flex", flexDirection: "column", gap: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12.5, color: "#B3AC9F", flexShrink: 0 }}>
                    {formatDate(r.created_at)}
                  </span>
                  {r.applied ? (
                    <StatusChip label="반영됨" bg="rgba(18,160,90,0.12)" color={POSITIVE} />
                  ) : (
                    <StatusChip label="미반영" bg="#F2EDE4" color={MUTED} />
                  )}
                  <span style={{ flex: 1 }} />
                  <button
                    onClick={() => handleDeleteClick(r.id)}
                    disabled={deleting}
                    style={{
                      fontSize: 12.5, fontWeight: 600, background: "none", border: "none",
                      color: ACCENT, cursor: deleting ? "default" : "pointer",
                      opacity: deleting ? 0.5 : 1, whiteSpace: "nowrap", flexShrink: 0,
                    }}
                  >
                    {deleting ? "삭제 중..." : confirming ? "정말 삭제? 다시 클릭" : "삭제"}
                  </button>
                </div>
                <div style={{ fontSize: 13.5, color: "#16151A", lineHeight: 1.5 }}>
                  {stopsSummary(r.course) || "코스 정보 없음"}
                </div>
                <div style={{ fontSize: 12.5, color: "#6C665B" }}>
                  만족도 {r.rating}/5 · 로컬 체감 {r.local_feel}/5
                </div>
                {r.comment && (
                  <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>{r.comment}</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
