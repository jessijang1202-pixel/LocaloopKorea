// Module 100 — Locality Index (LI).
//
// The LI expresses how "genuinely local" a place is on a 0-100 scale, fused
// from four local-consumption signals (patent fig.2):
//
//   LI = 100*( w1*koreanReviewRatio
//            + w2*(1 - foreignVisitorRatio)
//            + w3*koreanSearchRatio )
//        + w4*localKeywordScore
//
// Every term is normalized to a 0-100 range *before* weighting so that, with
// weights summing to 1.0, the result is itself bounded to 0-100:
//   - koreanReviewRatio / koreanSearchRatio (0..1)  -> x100
//   - foreignVisitorRatio (0..1) inverted to (1-x)  -> x100  (fewer foreigners → more local)
//   - localKeywordScore (already 0..100)            -> used as-is
//
// The patent fixes the four contributing factors but leaves the exact weights
// to platform policy; the values below follow the fig.2 suggestion 30/30/20/20.

import type { CourseFeedback, LocalityInputs } from "./types";

// ─── Weight constants (patent fig.2 — platform-tunable) ─────────────────────
export const LI_W_REVIEW = 0.3; // 한국인 리뷰 비율
export const LI_W_FOREIGN = 0.3; // 외국인 방문 비율(역방향)
export const LI_W_SEARCH = 0.2; // 한국어 검색 비율
export const LI_W_KEYWORD = 0.2; // 로컬 키워드 빈도 점수

// Defensive invariant: weights must sum to 1.0 so LI stays within 0-100.
{
  const sum = LI_W_REVIEW + LI_W_FOREIGN + LI_W_SEARCH + LI_W_KEYWORD;
  if (Math.abs(sum - 1) > 1e-9) {
    throw new Error(`Locality weights must sum to 1, got ${sum}`);
  }
}

// 로컬 스팟 기준: patent defines LI >= 70 as the "local spot" threshold.
export const LI_LOCAL_SPOT_MIN = 70;

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

function clamp0to100(x: number): number {
  return Math.max(0, Math.min(100, x));
}

function round1(x: number): number {
  return Math.round(x * 10) / 10;
}

// Compute the locality index from raw signals. Returns 0-100, 1 decimal.
export function computeLI(inputs: LocalityInputs): number {
  const review = clamp01(inputs.koreanReviewRatio) * 100;
  const foreign = (1 - clamp01(inputs.foreignVisitorRatio)) * 100;
  const search = clamp01(inputs.koreanSearchRatio) * 100;
  const keyword = clamp0to100(inputs.localKeywordScore);

  const li =
    LI_W_REVIEW * review +
    LI_W_FOREIGN * foreign +
    LI_W_SEARCH * search +
    LI_W_KEYWORD * keyword;

  return round1(clamp0to100(li));
}

// ─── Claim 5 — dynamic LI correction from feedback ──────────────────────────
//
// After a user reports how local a course felt, nudge the stored LI toward the
// observed reality. The patent does not prescribe a formula, so we apply a
// conservative, bounded exponential-moving correction: localFeel is centered on
// 3 (neutral) and each point away from neutral moves LI by ±1.5, capped by the
// 0-100 clamp. This keeps a single noisy rating from swinging the index while
// still letting sustained feedback drift it over time.
export const LI_FEEDBACK_STEP = 1.5;

export function adjustLIWithFeedback(
  currentLI: number,
  feedback: CourseFeedback,
): number {
  const delta = (feedback.localFeel - 3) * LI_FEEDBACK_STEP;
  return round1(clamp0to100(currentLI + delta));
}
