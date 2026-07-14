// Foreigner Life Task Graph — module 300 (S300 ~ S500).
//
// Turns a UserProfile into a ranked list of recommended tasks:
//   S300  getUnresolvedTasks  — filter out already-completed tasks
//   S400  scoreTask           — weighted score + unlock/blocked evaluation
//   S500  computePriorities   — score all, sort, take Top-N (unlocked only)

import { ALL_TASKS, requiredPredecessors } from "./task-graph";
import type { ScoredTask, TaskNode, UserProfile } from "./types";

// ─── Scoring weights (patent S400) ──────────────────────────────────────────

// Every unresolved task starts here.
const BASE_SCORE = 50;

// 체류 초기(≤ EARLY_STAY_MAX_DAYS, 또는 stayDays 미상)에 생활 필수 과제 가산.
const EARLY_STAY_MAX_DAYS = 14;
const EARLY_ESSENTIAL_BONUS = 30;

// 낮은 한국어 수준(beginner/basic) 사용자에게 절차 간단 과제 가산.
const LANGUAGE_SIMPLE_BONUS = 15;

// 관심 일치: interestTags ∩ interests, 매치당 가산 + 상한.
const INTEREST_MATCH_BONUS = 20;
const INTEREST_MATCH_CAP = 40;

// ─── Reason codes (UI translates these) ─────────────────────────────────────

export const REASON = {
  earlyStay: "early-stay",
  languageSimple: "language-simple",
  interestMatch: "interest-match",
  blocked: "blocked",
} as const;

// ─── Helpers ────────────────────────────────────────────────────────────────

// 체류 초기 판단: 경과일 미상(null)은 갓 입국한 것으로 간주하여 초기로 처리.
function isEarlyStay(profile: UserProfile): boolean {
  return profile.stayDays === null || profile.stayDays <= EARLY_STAY_MAX_DAYS;
}

function isLowKoreanLevel(profile: UserProfile): boolean {
  return profile.koreanLevel === "beginner" || profile.koreanLevel === "basic";
}

// ─── S300 ───────────────────────────────────────────────────────────────────

export function getUnresolvedTasks(profile: UserProfile): TaskNode[] {
  return ALL_TASKS.filter(
    (task) => !profile.completedTasks.includes(task.id) && !profile.skippedTasks.includes(task.id)
  );
}

// ─── S400 ───────────────────────────────────────────────────────────────────

export function scoreTask(task: TaskNode, profile: UserProfile): ScoredTask {
  const reasons: string[] = [];
  let score = BASE_SCORE;

  // 1) 체류 초기 + 생활 필수성
  if (isEarlyStay(profile) && task.essential) {
    score += EARLY_ESSENTIAL_BONUS;
    reasons.push(REASON.earlyStay);
  }

  // 2) 낮은 한국어 수준 + 절차 간단
  if (isLowKoreanLevel(profile) && task.simple) {
    score += LANGUAGE_SIMPLE_BONUS;
    reasons.push(REASON.languageSimple);
  }

  // 4) 관심 일치 (매치당 +20, 상한 +40)
  const matches = task.interestTags.filter((tag) => profile.interests.includes(tag));
  if (matches.length > 0) {
    score += Math.min(matches.length * INTEREST_MATCH_BONUS, INTEREST_MATCH_CAP);
    reasons.push(REASON.interestMatch);
  }

  // 3) 선행 관계 — 미완료 선행이 하나라도 있으면 잠금. 점수는 0으로 눌러
  //    Top-N에서 제외하되, UI 표시용으로 객체 자체는 반환한다.
  const blockedBy = requiredPredecessors(task.id).filter(
    (pred) => !profile.completedTasks.includes(pred),
  );
  const unlocked = blockedBy.length === 0;
  if (!unlocked) {
    score = 0;
    reasons.push(REASON.blocked);
  }

  return { task, score, unlocked, blockedBy, reasons };
}

// ─── S500 ───────────────────────────────────────────────────────────────────

// Score every unresolved task, sort by score desc with a deterministic
// tie-break (T-id ascending), and return only unlocked tasks — optionally
// capped to the top `topN`.
export function computePriorities(profile: UserProfile, topN?: number): ScoredTask[] {
  const scored = getUnresolvedTasks(profile).map((task) => scoreTask(task, profile));

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.task.id.localeCompare(b.task.id); // T1 < T2 < ... < T8
  });

  const unlocked = scored.filter((s) => s.unlocked);
  return typeof topN === "number" ? unlocked.slice(0, topN) : unlocked;
}

// Full scored list including blocked tasks (unlocked === false), for UI that
// wants to show "coming up / locked" items alongside the recommendations.
export function computeAllScored(profile: UserProfile): ScoredTask[] {
  const scored = getUnresolvedTasks(profile).map((task) => scoreTask(task, profile));
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.task.id.localeCompare(b.task.id);
  });
  return scored;
}
