"use client";

// Patent no.3 module 500 — user-facing course builder.
// Composes a half-day / full-day local-experience course from the engine in
// src/lib/course, using the patent-1 navigator profile for personalization.

import { useEffect, useState } from "react";
import { useLang } from "@/lib/lang";
import { useNavigatorProfile } from "@/lib/engine";
import {
  filterCandidates,
  composeCourse,
  type AdventureStyle,
  type CourseDuration,
  type CourseProfile,
  type ComposedCourse,
} from "@/lib/course";
import { fetchCandidatePlacesWithFallback, submitCourseFeedback } from "@/lib/course/db";
import { ITAEWON } from "@/content/map";

const BUDGETS = [10000, 30000, 50000, 100000];
const INTEREST_CHIPS: { key: string; ko: string; en: string }[] = [
  { key: "food",    ko: "음식", en: "Food" },
  { key: "cafe",    ko: "카페", en: "Cafe" },
  { key: "culture", ko: "문화", en: "Culture" },
  { key: "explore", ko: "탐색", en: "Explore" },
];

const LEVEL_LABEL: Record<string, { ko: string; en: string }> = {
  beginner:     { ko: "입문", en: "Beginner" },
  basic:        { ko: "기초", en: "Basic" },
  intermediate: { ko: "중급", en: "Intermediate" },
  advanced:     { ko: "고급", en: "Advanced" },
};

function Pill({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      flexShrink: 0, fontSize: 12, fontWeight: active ? 700 : 500,
      padding: "6px 14px", borderRadius: 999,
      background: active ? "var(--grade-s)" : "var(--card)",
      color: active ? "#fff" : "var(--foreground-muted)",
      border: active ? "1px solid var(--grade-s)" : "1px solid var(--border)",
      cursor: "pointer",
    }}>
      {label}
    </button>
  );
}

function ControlRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--foreground-muted)", marginBottom: 6, letterSpacing: "0.02em" }}>
        {label}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{children}</div>
    </div>
  );
}

export function CourseBuilder() {
  const isKo = useLang();
  const [profile, actions] = useNavigatorProfile();
  const [mounted, setMounted] = useState(false);

  const [duration, setDuration] = useState<CourseDuration>("half");
  const [adventure, setAdventure] = useState<AdventureStyle | null>(null);
  const [budget, setBudget] = useState<number | null>(null);
  const [interests, setInterests] = useState<string[]>([]);

  const [generating, setGenerating] = useState(false);
  const [course, setCourse] = useState<ComposedCourse | null>(null);
  const [attempted, setAttempted] = useState(false);
  const [dataSource, setDataSource] = useState<"db" | "seed" | null>(null);
  const [usedProfile, setUsedProfile] = useState<CourseProfile | null>(null);

  // Feedback state (claim 5)
  const [rating, setRating] = useState(0);
  const [localFeel, setLocalFeel] = useState(0);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [feedbackDone, setFeedbackDone] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const effAdventure = adventure ?? profile.adventure ?? "safe";
  const effBudget = budget ?? profile.budgetPerPerson ?? 30000;
  const level = profile.koreanLevel;
  const levelLabel = level
    ? (isKo ? LEVEL_LABEL[level].ko : LEVEL_LABEL[level].en)
    : (isKo ? "기초 (기본값)" : "Basic (default)");

  const pickAdventure = (v: AdventureStyle) => { setAdventure(v); actions.save({ adventure: v }); };
  const pickBudget = (v: number) => { setBudget(v); actions.save({ budgetPerPerson: v }); };
  const toggleInterest = (k: string) =>
    setInterests((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]));

  const generate = async () => {
    setGenerating(true);
    setFeedbackDone(false); setRating(0); setLocalFeel(0); setComment(""); setFeedbackError("");
    try {
      const { places, source } = await fetchCandidatePlacesWithFallback();
      const cp: CourseProfile = {
        languageLevel: level ?? "basic",
        adventure: effAdventure,
        budgetPerPerson: effBudget,
        radiusKm: profile.radiusKm ?? 10,
        interests,
        duration,
        origin: ITAEWON,
      };
      const candidates = filterCandidates(places, cp);
      setCourse(composeCourse(candidates, cp));
      setUsedProfile(cp);
      setDataSource(source);
      setAttempted(true);
    } finally {
      setGenerating(false);
    }
  };

  const sendFeedback = async () => {
    if (!course || !usedProfile || rating === 0 || localFeel === 0) return;
    setSending(true); setFeedbackError("");
    try {
      await submitCourseFeedback(course, usedProfile, rating, localFeel, comment || undefined);
      setFeedbackDone(true);
    } catch (e) {
      setFeedbackError(e instanceof Error ? e.message : String(e));
    } finally {
      setSending(false);
    }
  };

  const hours = course ? Math.floor(course.totalMinutes / 60) : 0;
  const mins = course ? course.totalMinutes % 60 : 0;

  return (
    <div style={{ margin: "12px 16px 0" }}>
      {/* Builder panel */}
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 18 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)" }}>
          {isKo ? "맞춤 로컬 코스 만들기" : "Build My Local Course"}
        </div>
        <div style={{ fontSize: 12, color: "var(--foreground-muted)", marginTop: 3, marginBottom: 14 }}>
          {isKo
            ? "언어 수준과 성향에 맞는 진짜 로컬 코스를 자동 조합합니다"
            : "Auto-compose a genuinely local course matched to your language level and style"}
        </div>

        <ControlRow label={isKo ? "시간" : "Duration"}>
          <Pill active={duration === "half"} label={isKo ? "반나절" : "Half-day"} onClick={() => setDuration("half")} />
          <Pill active={duration === "full"} label={isKo ? "하루" : "Full day"} onClick={() => setDuration("full")} />
        </ControlRow>

        <ControlRow label={isKo ? "성향" : "Style"}>
          <Pill active={effAdventure === "safe"} label={isKo ? "안전 우선" : "Safe first"} onClick={() => pickAdventure("safe")} />
          <Pill active={effAdventure === "bold"} label={isKo ? "도전 선호" : "Bold local"} onClick={() => pickAdventure("bold")} />
        </ControlRow>

        <ControlRow label={isKo ? "1인 예산" : "Budget per person"}>
          {BUDGETS.map((b) => (
            <Pill key={b} active={effBudget === b}
              label={isKo ? `${b / 10000}만원` : `${(b / 1000).toLocaleString()}k`}
              onClick={() => pickBudget(b)} />
          ))}
        </ControlRow>

        <ControlRow label={isKo ? "관심 (선택 없음 = 전체)" : "Interests (none = all)"}>
          {INTEREST_CHIPS.map((c) => (
            <Pill key={c.key} active={interests.includes(c.key)}
              label={isKo ? c.ko : c.en} onClick={() => toggleInterest(c.key)} />
          ))}
        </ControlRow>

        <div style={{ fontSize: 12, color: "var(--foreground-muted)", marginBottom: 14 }}>
          {isKo ? "언어 수준: " : "Language level: "}{levelLabel}
        </div>

        <button onClick={generate} disabled={generating} style={{
          width: "100%", padding: "11px", borderRadius: 12, border: "none",
          background: "var(--grade-s)", color: "#fff", fontSize: 14, fontWeight: 700,
          cursor: generating ? "default" : "pointer", opacity: generating ? 0.7 : 1,
        }}>
          {generating ? (isKo ? "조합 중..." : "Composing...") : (isKo ? "코스 생성" : "Generate Course")}
        </button>
      </div>

      {/* Result */}
      {attempted && !course && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 18, marginTop: 12, fontSize: 13, color: "var(--foreground-muted)", textAlign: "center" }}>
          {isKo
            ? "조건에 맞는 코스를 만들 수 없습니다. 예산이나 성향을 조정해 보세요."
            : "No course fits these conditions. Try adjusting budget or style."}
        </div>
      )}

      {course && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 18, marginTop: 12 }}>
          {/* Summary */}
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--foreground)" }}>
              {isKo
                ? `${course.stops.length}곳 · 총 ₩${course.totalBudget.toLocaleString()} · ${hours}시간 ${mins}분 · ${course.totalDistanceKm}km`
                : `${course.stops.length} stops · ₩${course.totalBudget.toLocaleString()} · ${hours}h ${mins}m · ${course.totalDistanceKm}km`}
            </span>
            {dataSource === "seed" && (
              <span style={{ fontSize: 10.5, color: "var(--foreground-sub)" }}>
                {isKo ? "데모 데이터 기준" : "Demo data"}
              </span>
            )}
          </div>
          {course.swappedForBudget.length > 0 && (
            <div style={{ fontSize: 11.5, color: "var(--foreground-muted)", marginBottom: 6 }}>
              {isKo
                ? `예산에 맞춰 ${course.swappedForBudget.length}곳 교체됨`
                : `${course.swappedForBudget.length} swapped for budget`}
            </div>
          )}

          {/* Timeline */}
          <div style={{ marginTop: 10 }}>
            {course.stops.map((stop, i) => (
              <div key={stop.place.id}>
                {i > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "2px 0 2px 12px" }}>
                    <div style={{ width: 2, height: 18, background: "var(--border)", marginLeft: 0 }} />
                    <span style={{ fontSize: 11, color: "var(--foreground-muted)" }}>
                      {isKo ? `도보 ${stop.legKm}km` : `Walk ${stop.legKm}km`}
                    </span>
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%", background: "var(--grade-s)",
                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12.5, fontWeight: 700, flexShrink: 0, marginTop: 2,
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--grade-s)" }}>
                      {isKo ? stop.slotLabel.ko : stop.slotLabel.en}
                    </div>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--foreground)" }}>
                      {isKo ? stop.place.name.ko : stop.place.name.en}
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--foreground-muted)" }}>
                      {isKo ? stop.place.name.en : stop.place.name.ko}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <span style={{
                      fontSize: 10.5, fontWeight: 700, padding: "3px 8px", borderRadius: 999,
                      background: "var(--content-bg)", border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}>
                      LI {Math.round(stop.place.li)}
                    </span>
                    <div style={{ fontSize: 12, color: "var(--foreground)", marginTop: 5, fontWeight: 600 }}>
                      ₩{stop.place.priceEstimate.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--foreground-muted)" }}>
                      {stop.place.stayMinutes}{isKo ? "분" : "min"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={generate} disabled={generating} style={{
            marginTop: 14, padding: "8px 16px", borderRadius: 10,
            background: "var(--card)", border: "1px solid var(--border)",
            color: "var(--foreground-muted)", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
          }}>
            {isKo ? "다시 조합" : "Regenerate"}
          </button>

          {/* Feedback (claim 5) */}
          <div style={{ borderTop: "1px solid var(--border)", marginTop: 16, paddingTop: 14 }}>
            {feedbackDone ? (
              <div style={{ fontSize: 12.5, color: "var(--foreground-muted)" }}>
                {isKo ? "반영되었습니다. 로컬 지수가 보정됩니다." : "Thanks - locality scores will be updated."}
              </div>
            ) : (
              <>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)", marginBottom: 10 }}>
                  {isKo ? "이 코스 어때요?" : "How is this course?"}
                </div>
                {[
                  { label: isKo ? "만족도" : "Rating", value: rating, set: setRating },
                  { label: isKo ? "로컬 체감" : "Local feel", value: localFeel, set: setLocalFeel },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "var(--foreground-muted)", width: 60 }}>{row.label}</span>
                    <div style={{ display: "flex", gap: 5 }}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} onClick={() => row.set(n)} style={{
                          width: 28, height: 28, borderRadius: 8, fontSize: 12, fontWeight: 700,
                          background: row.value >= n ? "var(--grade-s)" : "var(--card)",
                          color: row.value >= n ? "#fff" : "var(--foreground-muted)",
                          border: row.value >= n ? "1px solid var(--grade-s)" : "1px solid var(--border)",
                          cursor: "pointer",
                        }}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <input value={comment} onChange={(e) => setComment(e.target.value)}
                  placeholder={isKo ? "의견 (선택)" : "Comment (optional)"}
                  style={{
                    width: "100%", boxSizing: "border-box", padding: "9px 12px", borderRadius: 10,
                    background: "var(--content-bg)", border: "1px solid var(--border)",
                    color: "var(--foreground)", fontSize: 12.5, outline: "none", marginBottom: 10,
                  }} />
                <button onClick={sendFeedback} disabled={sending || rating === 0 || localFeel === 0} style={{
                  padding: "9px 18px", borderRadius: 10, border: "none",
                  background: rating > 0 && localFeel > 0 ? "var(--grade-s)" : "var(--border)",
                  color: rating > 0 && localFeel > 0 ? "#fff" : "var(--foreground-muted)",
                  fontSize: 12.5, fontWeight: 700,
                  cursor: rating > 0 && localFeel > 0 ? "pointer" : "default",
                  opacity: sending ? 0.7 : 1,
                }}>
                  {sending ? (isKo ? "전송 중..." : "Sending...") : (isKo ? "피드백 보내기" : "Send Feedback")}
                </button>
                {feedbackError && (
                  <div style={{ fontSize: 12, color: "#FF5636", marginTop: 8 }}>{feedbackError}</div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
