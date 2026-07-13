"use client";

// Shared course result view (patent no.3 module 500). Extracted verbatim in
// style from CourseBuilder so both the builder and the recommended feed render
// an identical timeline + feedback block. The Regenerate button stays in the
// builder (this component is result-only).
//
// Feedback state is self-contained and keyed by course identity: whenever the
// `course` prop changes (a different set of stops), the rating/comment inputs
// reset via the useEffect below.

import { useEffect, useState } from "react";
import { submitCourseFeedback } from "@/lib/course/db";
import type { ComposedCourse, CourseProfile } from "@/lib/course";

function courseKey(course: ComposedCourse): string {
  return course.stops.map((s) => s.place.id).join("|");
}

export function CourseResultView({
  course,
  profile,
  isKo,
  note,
}: {
  course: ComposedCourse;
  profile: CourseProfile;
  isKo: boolean;
  note?: string | null;
}) {
  // Feedback state (claim 5) — self-contained, reset on course change.
  const [rating, setRating] = useState(0);
  const [localFeel, setLocalFeel] = useState(0);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [feedbackDone, setFeedbackDone] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  const key = courseKey(course);
  useEffect(() => {
    setRating(0);
    setLocalFeel(0);
    setComment("");
    setSending(false);
    setFeedbackDone(false);
    setFeedbackError("");
  }, [key]);

  const hours = Math.floor(course.totalMinutes / 60);
  const mins = course.totalMinutes % 60;

  const sendFeedback = async () => {
    if (rating === 0 || localFeel === 0) return;
    setSending(true);
    setFeedbackError("");
    try {
      await submitCourseFeedback(course, profile, rating, localFeel, comment || undefined);
      setFeedbackDone(true);
    } catch (e) {
      setFeedbackError(e instanceof Error ? e.message : String(e));
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 18 }}>
      {/* Summary */}
      <div style={{ marginBottom: 4 }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--foreground)" }}>
          {isKo
            ? `${course.stops.length}곳 · 총 ₩${course.totalBudget.toLocaleString()} · ${hours}시간 ${mins}분 · ${course.totalDistanceKm}km`
            : `${course.stops.length} stops · ₩${course.totalBudget.toLocaleString()} · ${hours}h ${mins}m · ${course.totalDistanceKm}km`}
        </span>
      </div>
      {note && (
        <div style={{ fontSize: 11.5, color: "var(--foreground-muted)", marginBottom: 6 }}>
          {note}
        </div>
      )}
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
  );
}
