// Foreigner-Friendliness Auto Grading — core vocabulary (patent no.2, modules 200~400).
//
// A separate engine from src/lib/engine (patent no.1). This one grades a *place*
// by how friendly it is to foreign visitors, using keywords mined from collected
// web text (reviews, blog posts, place descriptions).
//
//   Module 200  keyword extraction   -> KeywordHit[]   (extract.ts)
//   Module 300  sub-scores (LS/AR/PD/LF, 0~100)        (score.ts)
//   Module 400  weighting + grade band                 (grade.ts)

// ─── Grade bands (module 400) ───────────────────────────────────────────────
export type GradeLetter = "S" | "A" | "B" | "C" | "D";

// Place types drive the weighting profile (patent claim 3 / 실시예).
//   cafe -> shares the restaurant profile (dining venues: language + local-fit
//   matter most), documented in grade.ts.
export type GradingPlaceType =
  | "restaurant"
  | "cafe"
  | "public"
  | "culture"
  | "accommodation"
  | "default";

// The four sub-score axes (module 300):
//   LS 언어 지원        language support
//   AR 출입 제한 위험    access-restriction risk
//   PD 이용 절차 난이도  procedure difficulty
//   LF 로컬 경험 적합도  local-experience fit
export type ScoreCategory = "LS" | "AR" | "PD" | "LF";

export type Polarity = "positive" | "negative";

// ─── Module 200 dictionary ──────────────────────────────────────────────────

export interface KeywordRule {
  // string = case-insensitive substring match; RegExp = matched with global +
  // ignoreCase forced on. Prefer RegExp for spacing/variant tolerance.
  pattern: string | RegExp;
  category: ScoreCategory;
  polarity: Polarity;
  // Optional magnitude multiplier applied to the category's per-rule unit.
  // Defaults to 1. Used to let "hard" access restrictions (외국인 출입 불가 /
  // koreans only) crater the AR sub-score on a single hit.
  weight?: number;
  label: { ko: string; en: string };
}

export interface KeywordHit {
  category: ScoreCategory;
  polarity: Polarity;
  weight: number; // resolved rule.weight (?? 1)
  label: { ko: string; en: string };
  matched: string; // sample of the text that matched (for debugging/UI)
  count: number; // number of occurrences across the combined text
}

export interface SubScores {
  LS: number;
  AR: number;
  PD: number;
  LF: number;
}

export interface EvidenceItem {
  category: ScoreCategory;
  polarity: Polarity;
  label: { ko: string; en: string };
  count: number;
}

export interface GradingResult {
  subScores: SubScores;
  weights: Record<ScoreCategory, number>;
  fs: number; // final score 0~100, rounded to 1 decimal
  grade: GradeLetter;
  riskFlags: ScoreCategory[]; // categories with any negative hit (claim 2)
  // Sorted so cautions surface first: negatives first, then positives, each by
  // count desc — lets the UI show "현금 결제만 가능" style warnings up top.
  evidence: EvidenceItem[];
}
