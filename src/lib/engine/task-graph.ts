// Foreigner Life Task Graph — module 200 (도 2).
//
// The 8 adaptation tasks and the directed dependency graph between them.
//
// ── interestTags mapping ────────────────────────────────────────────────────
// The patent describes tasks with abstract interest categories
// (culture / food / explore / social). Those are mapped onto the CONCRETE
// interest slugs actually collected in onboarding (src/content/profile-options
// INTERESTS): food, language, kculture, hiking, music, art, sport, coffee,
// nightlife, cooking, photography, travel.
//   culture -> kculture, art, music
//   food    -> food, cooking
//   explore -> travel, photography, hiking, coffee
//   social  -> language, nightlife, sport
//
// ── edge interpretation ─────────────────────────────────────────────────────
// The patent's 도 2 table wording and its arrow column are slightly
// inconsistent (e.g. it says "T1 → T2" in the arrow column while the prose for
// that row talks about 지역 이동). Per the task spec we encode the ARROWS
// exactly as written and do not try to "fix" them from the prose:
//   T1 → T2        requires   (선행 관계)
//   T2 ‖ T3        parallel   (병렬 — 독립 수행 가능)
//   T3 → T4        requires   (종속 — 기본 시설 이용 후 문화생활 접근)
//   [T1, T5] → T6  requires   (복합 선행 — 교통·예절 이해 후 로컬 탐색)
//   [T4, T6] → T7  requires   (복합 선행 — 문화생활+로컬 탐색 후)
//
// T8 (사회적 연결) has NO incoming edge in the patent's arrow column — the
// patent leaves T8's precedent implicit. Following the adaptation flow the
// patent narrates (교통 → 공공시설 → 문화 → 로컬 → 모임·사람), 사회적 연결 is the
// final stage, so we add a conservative [T7] → T8 requires edge. This is an
// interpretation, not verbatim from the arrow column; it keeps T8 from being
// trivially unlocked at day zero while matching the narrated progression.

import type { TaskEdge, TaskId, TaskNode } from "./types";

export const TASK_NODES: Record<TaskId, TaskNode> = {
  T1: {
    id: "T1",
    slug: "transport-setup",
    name: { ko: "교통 준비", en: "Transport Setup" },
    summary: {
      ko: "티머니 카드 발급·충전, 대중교통 이용 방법 익히기",
      en: "Get and top up a T-money card, learn to use public transit",
    },
    essential: true,
    simple: true,
    interestTags: [],
  },
  T2: {
    id: "T2",
    slug: "connectivity-setup",
    name: { ko: "통신 준비", en: "Connectivity Setup" },
    summary: {
      ko: "유심 개통, Wi-Fi 설정으로 데이터·연락 수단 확보",
      en: "Activate a SIM and set up Wi-Fi so you stay connected",
    },
    essential: true,
    simple: true,
    interestTags: [],
  },
  T3: {
    id: "T3",
    slug: "public-facilities",
    name: { ko: "공공시설 이용", en: "Public Facilities" },
    summary: {
      ko: "도서관·PC방 등 공공·생활 시설 회원가입과 이용",
      en: "Sign up for and use public facilities like libraries and PC rooms",
    },
    essential: false,
    simple: true,
    interestTags: [],
  },
  T4: {
    id: "T4",
    slug: "cultural-life",
    name: { ko: "문화생활 접근", en: "Cultural Life" },
    summary: {
      ko: "영화 예매, 영어 자막 상영관 등 문화생활 즐기기",
      en: "Book films and find English-subtitle screenings and cultural venues",
    },
    essential: false,
    simple: false,
    interestTags: ["kculture", "art", "music"],
  },
  T5: {
    id: "T5",
    slug: "everyday-etiquette",
    name: { ko: "생활 예절 이해", en: "Everyday Etiquette" },
    summary: {
      ko: "식당·지하철 매너, 분리수거 등 생활 예절 익히기",
      en: "Learn dining and subway manners and how to sort recycling",
    },
    essential: false,
    simple: true,
    interestTags: ["kculture"],
  },
  T6: {
    id: "T6",
    slug: "local-food",
    name: { ko: "로컬 음식 체험", en: "Local Food" },
    summary: {
      ko: "로컬 음식점 찾기와 주문 방식 익히기",
      en: "Find local eateries and learn how to order",
    },
    essential: false,
    simple: false,
    interestTags: ["food", "cooking"],
  },
  T7: {
    id: "T7",
    slug: "neighborhood-exploration",
    name: { ko: "지역 탐색", en: "Neighborhood Exploration" },
    summary: {
      ko: "동네 명소와 숨은 장소 탐색하기",
      en: "Explore neighborhood highlights and hidden spots",
    },
    essential: false,
    simple: false,
    interestTags: ["travel", "photography", "hiking", "coffee"],
  },
  T8: {
    id: "T8",
    slug: "social-connection",
    name: { ko: "사회적 연결", en: "Social Connection" },
    summary: {
      ko: "지역 모임 참여, 한국인 친구 만들기",
      en: "Join local meetups and make Korean friends",
    },
    essential: false,
    simple: false,
    interestTags: ["language", "nightlife", "sport"],
  },
};

// Ordered list of all nodes (T-id ascending) — used for deterministic tie-break.
export const ALL_TASKS: TaskNode[] = [
  TASK_NODES.T1,
  TASK_NODES.T2,
  TASK_NODES.T3,
  TASK_NODES.T4,
  TASK_NODES.T5,
  TASK_NODES.T6,
  TASK_NODES.T7,
  TASK_NODES.T8,
];

// Directed dependency graph (도 2). See interpretation note at top of file.
export const TASK_EDGES: TaskEdge[] = [
  { from: "T1", to: "T2", type: "requires" }, // 선행 관계
  { from: "T2", to: "T3", type: "parallel" }, // 병렬 — 독립 수행 가능
  { from: "T3", to: "T4", type: "requires" }, // 종속
  { from: ["T1", "T5"], to: "T6", type: "requires" }, // 복합 선행
  { from: ["T4", "T6"], to: "T7", type: "requires" }, // 복합 선행
  { from: "T7", to: "T8", type: "requires" }, // 해석: 사회적 연결은 최종 단계 (문서 상단 주석 참조)
];

// Normalize an edge's `from` (single id or array) to an array.
export function edgeFrom(edge: TaskEdge): TaskId[] {
  return Array.isArray(edge.from) ? edge.from : [edge.from];
}

// The `requires` precedents for a task: union of all `requires` edges into it.
// `parallel` edges impose no ordering, so they are ignored here.
export function requiredPredecessors(id: TaskId): TaskId[] {
  const preds: TaskId[] = [];
  for (const edge of TASK_EDGES) {
    if (edge.to !== id || edge.type !== "requires") continue;
    for (const f of edgeFrom(edge)) {
      if (!preds.includes(f)) preds.push(f);
    }
  }
  return preds;
}
