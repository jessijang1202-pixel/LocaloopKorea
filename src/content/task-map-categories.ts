// Maps each life-task to the place categories relevant to completing it —
// drives the Tasks page's "맵으로 이동" button and the task-filtered map view
// it links to (/map?task=<id>). Not every task has a sensible physical-place
// mapping: T1 (교통 준비) is a T-money card bought at any convenience store,
// not a distinct category we collect; T7 (분리수거), T10 (모임 참여), and T11
// (언어교환) are behaviors/communities, not places. Those get `null` and the
// "맵으로 이동" button hides for them rather than linking to an empty filter.

import type { TaskId } from "@/lib/engine";

export const TASK_MAP_CATEGORIES: Record<TaskId, string[] | null> = {
  T1: null,
  T2: ["telecom"], // 유심 개통
  T3: ["health", "activity"], // 공공시설 — library/gym best-effort
  T4: ["activity"], // 영화·공연 관람
  T5: ["activity", "experience"], // 전시·문화행사 참여
  T6: ["restaurant"], // 식당·대중교통 매너
  T7: null,
  T8: ["restaurant"], // 로컬 음식 체험
  T9: ["activity", "experience"], // 지역 탐색
  T10: null,
  T11: null,
  T12: ["government"], // 외국인 등록증
  T13: ["government"], // 비자 상태 관리
  T14: ["bank"], // 은행 계좌 개설
  T15: ["realestate"], // 집 렌트·계약
  T16: ["government"], // 국민건강보험 가입
  T17: ["health"], // 병원·약국 이용
};
