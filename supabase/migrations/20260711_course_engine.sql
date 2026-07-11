-- ============================================================
-- Local-Experience Course Recommendation Engine (patent no.3) — schema
--
-- HOW TO APPLY:
--   Supabase dashboard > SQL Editor > paste this whole file > Run.
--   Apply AFTER 20240102_admin_tables.sql (provides `places`, `data_jobs`)
--   and 20260710_grading_engine.sql (provides places.grade / ls_score and the
--   permissive data_jobs policy this engine's recompute route reuses).
--   Statements are ordered so nothing dangles mid-run; safe to run once.
--
-- TODO(auth): the RLS policies at the bottom are PERMISSIVE
--   (USING (true) WITH CHECK (true)) because the app currently runs with
--   BYPASS_AUTH=true and only the anon key. Tighten every policy marked
--   TODO(auth) once real login + roles are enforced.
-- ============================================================

-- ── a) place_local_metrics (patent module 100 — locality index storage) ──────
-- One row per place. Holds the four LI input factors (v1: admin-entered ratios +
-- a keyword score derived from grading_sources), the fused locality index `li`,
-- and the course-composition attributes (price / stay / subtitles / time slot).
CREATE TABLE IF NOT EXISTS place_local_metrics (
  place_id              uuid PRIMARY KEY REFERENCES places(id) ON DELETE CASCADE,
  korean_review_ratio   numeric NOT NULL DEFAULT 0.5 CHECK (korean_review_ratio BETWEEN 0 AND 1),
  foreign_visitor_ratio numeric NOT NULL DEFAULT 0.5 CHECK (foreign_visitor_ratio BETWEEN 0 AND 1),
  korean_search_ratio   numeric NOT NULL DEFAULT 0.5 CHECK (korean_search_ratio BETWEEN 0 AND 1),
  local_keyword_score   numeric NOT NULL DEFAULT 0 CHECK (local_keyword_score BETWEEN 0 AND 100),
  li                    numeric NOT NULL DEFAULT 0,
  price_estimate        integer NOT NULL DEFAULT 10000,
  stay_minutes          integer NOT NULL DEFAULT 60,
  english_subtitles     boolean NOT NULL DEFAULT false,
  time_slot             text CHECK (time_slot IN ('meal','screening') OR time_slot IS NULL),
  manual_override       boolean NOT NULL DEFAULT false,
  computed_at           timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- ── b) course_feedback (patent module 500 / claim 5 — post-course feedback) ───
-- `course` and `profile` are jsonb snapshots taken at submission time so the
-- record stays meaningful even after place data drifts. `applied` records
-- whether the dynamic LI correction (adjustLIWithFeedback) was written back.
CREATE TABLE IF NOT EXISTS course_feedback (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course      jsonb NOT NULL,          -- ComposedCourse snapshot (stop ids, totals)
  profile     jsonb NOT NULL,          -- CourseProfile used
  rating      integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  local_feel  integer NOT NULL CHECK (local_feel BETWEEN 1 AND 5),
  comment     text,
  applied     boolean NOT NULL DEFAULT false,   -- whether LI correction was applied
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS course_feedback_created_idx ON course_feedback (created_at);

-- ── c) RLS ───────────────────────────────────────────────────────────────────
ALTER TABLE place_local_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_feedback     ENABLE ROW LEVEL SECURITY;

-- TODO(auth): permissive — anyone with the anon key can read/write these.
CREATE POLICY "temp_open_place_local_metrics" ON place_local_metrics
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "temp_open_course_feedback" ON course_feedback
  FOR ALL USING (true) WITH CHECK (true);

-- NOTE: the locality recompute route wraps each batch in a data_jobs row. The
-- permissive data_jobs policy from 20260710_grading_engine.sql already covers
-- that, so no additional data_jobs policy is added here.
