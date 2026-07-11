// Row types for the course recommendation engine DB tables (patent no.3).
// Mirror supabase/migrations/20260711_course_engine.sql.

import type { CourseProfile } from "@/lib/course";

// place_local_metrics — module 100 locality-index storage (one row per place).
export interface PlaceLocalMetricsRow {
  place_id: string;
  korean_review_ratio: number; // 0..1
  foreign_visitor_ratio: number; // 0..1
  korean_search_ratio: number; // 0..1
  local_keyword_score: number; // 0..100
  li: number; // fused locality index 0..100
  price_estimate: number; // KRW per person
  stay_minutes: number; // typical stay in minutes
  english_subtitles: boolean; // cinema/performance subtitle availability
  time_slot: "meal" | "screening" | null; // time-constrained slot (claim 7)
  manual_override: boolean; // admin manually edited — recompute skips unless forced
  computed_at: string;
  updated_at: string;
}

// course_feedback — module 500 / claim 5. `course` is a minimal snapshot of the
// composed course (stops + totals); `profile` is the CourseProfile that produced it.
export interface CourseFeedbackStopSnapshot {
  placeId: string;
  name: { ko: string; en: string };
  order: number;
}

export interface CourseFeedbackCourseSnapshot {
  stops: CourseFeedbackStopSnapshot[];
  totalBudget: number;
  totalMinutes: number;
  totalDistanceKm: number;
}

export interface CourseFeedbackRow {
  id: string;
  course: CourseFeedbackCourseSnapshot;
  profile: CourseProfile;
  rating: number; // 1..5
  local_feel: number; // 1..5
  comment: string | null;
  applied: boolean; // whether the LI correction was written back
  created_at: string;
}
