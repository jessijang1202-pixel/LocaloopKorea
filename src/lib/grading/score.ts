// Module 300 — turn keyword hits into four 0~100 sub-scores.
//
// Each axis has a documented BASE and per-rule deltas. "distinct rule" means a
// distinct dictionary entry that fired at least once (so repeating the same
// phrase does not stack, except via the LS density bonus). Deltas scale by the
// resolved rule weight (default 1), which lets AR "hard" restrictions crater the
// score on a single hit.
//
// Constants were tuned so the two patent 실시예 traces land on the intended
// grades (실시예1 → A, 실시예2 → D); see grade.ts trace notes. They deviate
// slightly from the first-draft magnitudes but keep the same structure.

import type { KeywordHit, ScoreCategory, SubScores } from "./types";

// ─── LS 언어 지원 ────────────────────────────────────────────────────────────
const LS_BASE = 50;
// +18 per distinct positive rule: a couple of clear signals (영어 메뉴 있음 +
// English menu) should lift LS well into the strong range on their own.
const LS_POS_PER_RULE = 18;
const LS_NEG_PER_RULE = 15;
// Density bonus: many corroborating positive mentions (>= 3 occurrences) add a
// small confidence bump.
const LS_DENSITY_MIN_OCCURRENCES = 3;
const LS_DENSITY_BONUS = 5;

// ─── AR 출입 제한 위험 ───────────────────────────────────────────────────────
// Starts high — absence of any restriction signal means the place is safe to
// enter. Negatives are heavy; a hard restriction (weight 2 -> -100) craters it.
const AR_BASE = 95;
const AR_NEG_UNIT = 50; // multiplied by rule weight
const AR_POS_PER_RULE = 5;

// ─── PD 이용 절차 난이도 ─────────────────────────────────────────────────────
// Higher score = easier. Procedure burdens (본인인증, 현금 결제만, 한국 핸드폰
// 필요, ...) lower it; frictionless signals raise it.
const PD_BASE = 80;
const PD_NEG_PER_RULE = 15;
const PD_POS_PER_RULE = 7;

// ─── LF 로컬 경험 적합도 ─────────────────────────────────────────────────────
const LF_BASE = 50;
const LF_POS_PER_RULE = 15;
const LF_NEG_PER_RULE = 10;

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

interface CategoryHits {
  positive: KeywordHit[];
  negative: KeywordHit[];
}

function partition(hits: KeywordHit[], category: ScoreCategory): CategoryHits {
  const inCat = hits.filter((h) => h.category === category);
  return {
    positive: inCat.filter((h) => h.polarity === "positive"),
    negative: inCat.filter((h) => h.polarity === "negative"),
  };
}

// Sum of resolved weights across distinct rules (each hit == one distinct rule).
function weightSum(hits: KeywordHit[]): number {
  return hits.reduce((acc, h) => acc + h.weight, 0);
}

// Total occurrence count across the given hits.
function occurrenceSum(hits: KeywordHit[]): number {
  return hits.reduce((acc, h) => acc + h.count, 0);
}

export function computeSubScores(hits: KeywordHit[]): SubScores {
  // LS
  const ls = partition(hits, "LS");
  let lsScore = LS_BASE;
  lsScore += ls.positive.length * LS_POS_PER_RULE;
  lsScore -= ls.negative.length * LS_NEG_PER_RULE;
  if (occurrenceSum(ls.positive) >= LS_DENSITY_MIN_OCCURRENCES) {
    lsScore += LS_DENSITY_BONUS;
  }

  // AR
  const ar = partition(hits, "AR");
  let arScore = AR_BASE;
  arScore -= weightSum(ar.negative) * AR_NEG_UNIT;
  arScore += ar.positive.length * AR_POS_PER_RULE;

  // PD
  const pd = partition(hits, "PD");
  let pdScore = PD_BASE;
  pdScore -= pd.negative.length * PD_NEG_PER_RULE;
  pdScore += pd.positive.length * PD_POS_PER_RULE;

  // LF
  const lf = partition(hits, "LF");
  let lfScore = LF_BASE;
  lfScore += lf.positive.length * LF_POS_PER_RULE;
  lfScore -= lf.negative.length * LF_NEG_PER_RULE;

  return {
    LS: clamp(lsScore),
    AR: clamp(arScore),
    PD: clamp(pdScore),
    LF: clamp(lfScore),
  };
}
