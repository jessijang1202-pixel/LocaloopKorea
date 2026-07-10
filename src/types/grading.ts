// Row types for the grading engine DB tables (patent no.2).
// Mirror supabase/migrations/20260710_grading_engine.sql.

import type {
  EvidenceItem,
  GradingPlaceType,
  ScoreCategory,
} from "@/lib/grading";

// grading_sources — collected web text (module 100 storage).
export type GradingSourceType =
  | "manual"
  | "naver_map"
  | "kakao_map"
  | "google_map"
  | "blog"
  | "instagram"
  | "x"
  | "review"
  | "other";

export interface GradingSourceRow {
  id: string;
  place_id: string;
  source_type: GradingSourceType;
  url: string | null;
  content: string;
  collected_at: string;
  created_at: string;
}

// place_grade_details — module 400/500 output detail. jsonb columns reuse the
// engine's own types so the payloads stay in sync with gradePlace().
export interface PlaceGradeDetailsRow {
  place_id: string;
  fs: number;
  place_type: GradingPlaceType;
  weights: Record<ScoreCategory, number>;
  evidence: EvidenceItem[];
  risk_flags: ScoreCategory[];
  manual_override: boolean;
  computed_at: string;
  updated_at: string;
}
