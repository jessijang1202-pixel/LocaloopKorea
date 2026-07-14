// Foreigner Life Task Graph — module 200 (도 2).
//
// The adaptation tasks and the directed dependency graph between them.
//
// ── expanded from the patent's original 8 ───────────────────────────────────
// The patent's 도 2 table describes 8 broad stages. Three of them each bundled
// two genuinely separate activities (문화생활 = movies AND exhibitions; 생활
// 예절 = dining/transit manners AND recycling; 사회적 연결 = meetups AND
// language exchange), which made the top-3 "Do This Now" recommendation feel
// generic: at day zero only 3 tasks were ever unlocked (T1/T3/T5 old-numbering),
// so the top-3 slot showed literally every unlocked task regardless of score —
// no profile input could change which tasks appeared, only their order within
// an already-fixed set of exactly 3. Splitting those three bundles into their
// natural sub-activities (now T1-T11) grows the day-zero unlocked pool to 5
// (T1/T2/T3/T6/T7), so scoring actually has more than 3 candidates to choose
// from and profile answers (Korean level, interests, arrival duration) change
// which tasks surface, not just their order.
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
// The patent's 도 2 arrow column (T1→T2 선행, T2‖T3 병렬, T3→T4 종속,
// [T1,T5]→T6 복합 선행, [T4,T6]→T7 복합 선행) is preserved in spirit across the
// split nodes: each new sub-task inherits its parent stage's position in the
// 교통 → 통신 → 공공시설 → 문화 → 예절 → 로컬 음식 → 지역 탐색 → 사회적 연결
// progression. T10/T11 (사회적 연결의 두 갈래) have no incoming edge in the
// patent's arrow column either — same conservative interpretation as before:
// social connection is the final stage, gated on neighborhood exploration.

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
      ko: "도서관·PC방·체육시설 등 공공·생활 시설 회원가입과 이용",
      en: "Sign up for and use public facilities like libraries, PC rooms, and gyms",
    },
    essential: false,
    simple: true,
    interestTags: [],
  },
  T4: {
    id: "T4",
    slug: "movies-shows",
    name: { ko: "영화·공연 관람", en: "Movies & Shows" },
    summary: {
      ko: "영화 예매, 영어 자막 상영관 찾아 관람하기",
      en: "Book movie tickets and find English-subtitle screenings",
    },
    essential: false,
    simple: false,
    interestTags: ["kculture", "music"],
  },
  T5: {
    id: "T5",
    slug: "exhibitions-events",
    name: { ko: "전시·문화행사 참여", en: "Exhibitions & Cultural Events" },
    summary: {
      ko: "전시·공연 예매, 외국인 대상 문화 행사 찾기",
      en: "Book exhibitions and performances, and find foreigner-friendly cultural events",
    },
    essential: false,
    simple: false,
    interestTags: ["kculture", "art"],
  },
  T6: {
    id: "T6",
    slug: "dining-transit-manners",
    name: { ko: "식당·대중교통 매너", en: "Dining & Transit Manners" },
    summary: {
      ko: "식당 예절과 지하철·버스 매너 익히기",
      en: "Learn restaurant etiquette and subway/bus manners",
    },
    essential: false,
    simple: true,
    interestTags: ["kculture"],
  },
  T7: {
    id: "T7",
    slug: "recycling-waste",
    name: { ko: "분리수거·생활 쓰레기", en: "Recycling & Waste" },
    summary: {
      ko: "분리수거 방법과 종량제 봉투 사용법 익히기",
      en: "Learn how to sort recycling and use volume-rate trash bags",
    },
    essential: false,
    simple: true,
    interestTags: ["kculture"],
  },
  T8: {
    id: "T8",
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
  T9: {
    id: "T9",
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
  T10: {
    id: "T10",
    slug: "meetups-communities",
    name: { ko: "모임·커뮤니티 참여", en: "Meetups & Communities" },
    summary: {
      ko: "취미·지역 모임을 찾아 참여하기",
      en: "Find and join hobby and neighborhood meetups",
    },
    essential: false,
    simple: false,
    interestTags: ["nightlife", "sport"],
  },
  T11: {
    id: "T11",
    slug: "language-exchange",
    name: { ko: "언어교환 파트너 찾기", en: "Find a Language Exchange Partner" },
    summary: {
      ko: "언어교환 앱·모임으로 한국어 파트너 찾기",
      en: "Use language-exchange apps and meetups to find a Korean partner",
    },
    essential: false,
    simple: false,
    interestTags: ["language"],
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
  TASK_NODES.T9,
  TASK_NODES.T10,
  TASK_NODES.T11,
];

// Directed dependency graph (도 2, expanded — see interpretation note at top).
export const TASK_EDGES: TaskEdge[] = [
  { from: "T1", to: "T2", type: "requires" }, // 선행 관계
  { from: "T2", to: "T3", type: "parallel" }, // 병렬 — 독립 수행 가능
  { from: "T3", to: "T4", type: "requires" }, // 종속 — 공공시설 이용 후 문화생활
  { from: "T3", to: "T5", type: "requires" }, // 종속 — 공공시설 이용 후 문화생활
  { from: ["T1", "T6"], to: "T8", type: "requires" }, // 복합 선행 — 교통·식당 매너 이해 후 로컬 음식
  { from: ["T4", "T5", "T8"], to: "T9", type: "requires" }, // 복합 선행 — 문화+로컬 음식 경험 후 지역 탐색
  { from: "T9", to: "T10", type: "requires" }, // 해석: 사회적 연결은 최종 단계 (문서 상단 주석 참조)
  { from: "T9", to: "T11", type: "requires" }, // 해석: 사회적 연결은 최종 단계 (문서 상단 주석 참조)
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
