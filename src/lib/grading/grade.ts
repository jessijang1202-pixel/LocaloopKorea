// Module 400 — weight the sub-scores by place type and assign a grade.
//
//   FS = w1*LS + w2*AR + w3*PD + w4*LF        (0~100)
//   grade bands: S >= 90, A >= 75, B >= 55, C >= 35, else D
//
// Weight profiles follow patent claim 3 / fig.2. Each set is a named export and
// must sum to 1.0 (asserted at module load). Order of keys is fixed to
// LS/AR/PD/LF for readability.

import { extractKeywords, riskFlags } from "./extract";
import { computeSubScores } from "./score";
import type {
  EvidenceItem,
  GradeLetter,
  GradingPlaceType,
  GradingResult,
  KeywordHit,
  ScoreCategory,
  SubScores,
} from "./types";

// ─── Weight profiles (patent claim 3, 실시예) ────────────────────────────────

// fig.2 기본 가중치 30/30/20/20 — used when place type is unknown.
export const WEIGHTS_DEFAULT: Record<ScoreCategory, number> = {
  LS: 0.3,
  AR: 0.3,
  PD: 0.2,
  LF: 0.2,
};

// 음식점: 언어 지원(LS)과 로컬 경험(LF)의 비중을 높인다 (실시예1).
export const WEIGHTS_RESTAURANT: Record<ScoreCategory, number> = {
  LS: 0.3,
  AR: 0.25,
  PD: 0.2,
  LF: 0.25,
};

// 카페: 다이닝 성격이 유사하여 음식점 프로필을 공유한다.
export const WEIGHTS_CAFE: Record<ScoreCategory, number> = WEIGHTS_RESTAURANT;

// 공공시설/체육시설: 출입 제한(AR) 비중을 크게 높인다 (실시예2 gym).
export const WEIGHTS_PUBLIC: Record<ScoreCategory, number> = {
  LS: 0.25,
  AR: 0.4,
  PD: 0.2,
  LF: 0.15,
};

// 문화시설: 균형 가중치, 로컬 비중은 다소 낮춤.
export const WEIGHTS_CULTURE: Record<ScoreCategory, number> = {
  LS: 0.3,
  AR: 0.3,
  PD: 0.25,
  LF: 0.15,
};

// 숙박: 언어 지원과 출입/절차의 신뢰가 중요.
export const WEIGHTS_ACCOMMODATION: Record<ScoreCategory, number> = {
  LS: 0.3,
  AR: 0.3,
  PD: 0.25,
  LF: 0.15,
};

// NOTE: weight profiles are mirrored in supabase/migrations/20260710_grading_engine.sql (compute_place_grade) — keep in sync.
export const WEIGHTS_BY_TYPE: Record<
  GradingPlaceType,
  Record<ScoreCategory, number>
> = {
  restaurant: WEIGHTS_RESTAURANT,
  cafe: WEIGHTS_CAFE,
  public: WEIGHTS_PUBLIC,
  culture: WEIGHTS_CULTURE,
  accommodation: WEIGHTS_ACCOMMODATION,
  default: WEIGHTS_DEFAULT,
};

// Defensive invariant: every profile must sum to 1.0.
for (const [type, w] of Object.entries(WEIGHTS_BY_TYPE)) {
  const sum = w.LS + w.AR + w.PD + w.LF;
  if (Math.abs(sum - 1) > 1e-9) {
    throw new Error(`Grading weights for "${type}" must sum to 1, got ${sum}`);
  }
}

// ─── Grade bands ─────────────────────────────────────────────────────────────
const GRADE_S_MIN = 90;
const GRADE_A_MIN = 75;
const GRADE_B_MIN = 55;
const GRADE_C_MIN = 35;

export function gradeFromFS(fs: number): GradeLetter {
  if (fs >= GRADE_S_MIN) return "S";
  if (fs >= GRADE_A_MIN) return "A";
  if (fs >= GRADE_B_MIN) return "B";
  if (fs >= GRADE_C_MIN) return "C";
  return "D";
}

export function computeFS(sub: SubScores, type: GradingPlaceType): number {
  const w = WEIGHTS_BY_TYPE[type];
  const fs = w.LS * sub.LS + w.AR * sub.AR + w.PD * sub.PD + w.LF * sub.LF;
  return Math.round(fs * 10) / 10; // 1 decimal
}

// Evidence: cautions (negatives) first, then positives, each ordered by count
// desc, then by axis for a stable output. Lets the UI lead with warnings.
function buildEvidence(hits: KeywordHit[]): EvidenceItem[] {
  const axisOrder: ScoreCategory[] = ["AR", "PD", "LS", "LF"];
  return hits
    .map((h) => ({
      category: h.category,
      polarity: h.polarity,
      label: h.label,
      count: h.count,
    }))
    .sort((a, b) => {
      if (a.polarity !== b.polarity) return a.polarity === "negative" ? -1 : 1;
      if (b.count !== a.count) return b.count - a.count;
      return axisOrder.indexOf(a.category) - axisOrder.indexOf(b.category);
    });
}

// Top-level convenience: extract -> score -> weight -> grade -> evidence.
export function gradePlace(
  texts: string[],
  type: GradingPlaceType,
): GradingResult {
  const hits = extractKeywords(texts);
  const subScores = computeSubScores(hits);
  const weights = WEIGHTS_BY_TYPE[type];
  const fs = computeFS(subScores, type);
  const grade = gradeFromFS(fs);

  return {
    subScores,
    weights,
    fs,
    grade,
    riskFlags: riskFlags(hits),
    evidence: buildEvidence(hits),
  };
}
