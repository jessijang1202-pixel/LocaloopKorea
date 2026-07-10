// Foreigner Life Task Graph — core vocabulary (patent modules 100~500).
//
// This module defines the canonical types for the recommendation engine.
// It is intentionally decoupled from the onboarding form vocabulary: the
// onboarding flow (src/app/onboarding) stores free-form label strings and a
// 5-level Korean scale, whereas the engine works with a normalized profile.
// A future adapter layer maps OnboardingData -> UserProfile; see notes on the
// individual fields below and in user-state.ts.

import type { Bi } from "@/types/content";

// ─── Patent module vocabulary ───────────────────────────────────────────────

export type TaskId = "T1" | "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "T8";

// 선행(→) = requires, 병렬(‖) = parallel (independent, no ordering constraint)
export type EdgeType = "requires" | "parallel";

export interface TaskNode {
  id: TaskId;
  slug: string;
  name: Bi;
  summary: Bi;
  // essential: 생활 필수성 — 교통/통신 등 체류 초기에 반드시 필요한 과제
  essential: boolean;
  // simple: 절차 간단 여부 — 언어 수준이 낮은 사용자에게 우선 추천하기 좋은 과제
  simple: boolean;
  // interestTags: onboarding INTERESTS 슬러그와 교집합으로 관심 일치 가산
  interestTags: string[];
}

export interface TaskEdge {
  // from as array = 복합 선행 (예: [T1, T5] → T6) — 모든 from 완료 시 잠금 해제
  from: TaskId | TaskId[];
  to: TaskId;
  type: EdgeType;
}

export interface UserProfile {
  region: string | null; // 현재 위치 (REGION_SLUGS: hongdae/itaewon/... — 점수 미사용, 표시용)
  purpose: string | null; // 체류 목적 (work/study/travel/language/culture/other — 점수 미사용, 표시용)
  language: string | null; // 주 사용 언어
  // 한국어 수준 — engine 정규화 값. onboarding 5단계 라벨은 adapter에서 매핑:
  //   None/전혀 못해요 -> beginner, Beginner/초급 -> basic,
  //   Daily use/생활 한국어 -> intermediate,
  //   Conversational/일상 대화, Fluent/유창해요 -> advanced
  koreanLevel: "beginner" | "basic" | "intermediate" | "advanced" | null;
  interests: string[]; // 관심 활동 슬러그 (INTERESTS slug 목록)
  stayDays: number | null; // 입국 후 경과일 (체류 초기 판단; null = 미상, 초기로 간주)
  completedTasks: TaskId[]; // 기 해결 과제
}

export interface ScoredTask {
  task: TaskNode;
  score: number;
  unlocked: boolean; // 선행 과제 충족 여부 (false면 Top-N에서 제외)
  blockedBy: TaskId[]; // 아직 미완료인 선행 과제들
  reasons: string[]; // 가산 이유 코드 (예: "early-stay") — UI가 번역
}
