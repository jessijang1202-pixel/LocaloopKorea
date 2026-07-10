// Web-data-based Foreigner-Friendliness Auto Grading (patent no.2) — public API.
//
// Import from "@/lib/grading" rather than reaching into individual modules.

// Types (modules 200~400 vocabulary)
export type {
  GradeLetter,
  GradingPlaceType,
  ScoreCategory,
  Polarity,
  KeywordRule,
  KeywordHit,
  SubScores,
  EvidenceItem,
  GradingResult,
} from "./types";

// Module 200 — keyword dictionary + extraction
export { KEYWORD_RULES } from "./keywords";
export { extractKeywords, riskFlags } from "./extract";

// Module 300 — sub-scores
export { computeSubScores } from "./score";

// Module 400 — weighting + grading
export {
  WEIGHTS_BY_TYPE,
  WEIGHTS_DEFAULT,
  WEIGHTS_RESTAURANT,
  WEIGHTS_CAFE,
  WEIGHTS_PUBLIC,
  WEIGHTS_CULTURE,
  WEIGHTS_ACCOMMODATION,
  computeFS,
  gradeFromFS,
  gradePlace,
} from "./grade";
