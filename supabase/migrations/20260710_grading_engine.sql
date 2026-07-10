-- ============================================================
-- Foreigner-Friendliness Grading Engine (patent no.2) — schema
--
-- HOW TO APPLY:
--   Supabase dashboard > SQL Editor > paste this whole file > Run.
--   Statements are ordered so nothing dangles mid-run; safe to run once.
--
-- TODO(auth): the RLS policies added at the bottom are PERMISSIVE
--   (USING (true) WITH CHECK (true)) because the app currently runs with
--   BYPASS_AUTH=true and only the anon key. Tighten every policy marked
--   TODO(auth) once real login + roles are enforced.
-- ============================================================

-- ── a) grading_sources (patent module 100 — collected web text storage) ──────
CREATE TABLE IF NOT EXISTS grading_sources (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id     uuid NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  source_type  text NOT NULL DEFAULT 'manual'
                 CHECK (source_type IN (
                   'manual','naver_map','kakao_map','google_map',
                   'blog','instagram','x','review','other')),
  url          text,
  content      text NOT NULL,
  collected_at timestamptz NOT NULL DEFAULT now(),
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS grading_sources_place_idx ON grading_sources (place_id);

-- ── b) place_grade_details (module 400/500 — grading output detail) ──────────
-- Sub-scores (ls/ar/pd/lf) and the letter grade stay on `places`, which the
-- live app already reads. This table holds the extra grading engine output.
CREATE TABLE IF NOT EXISTS place_grade_details (
  place_id        uuid PRIMARY KEY REFERENCES places(id) ON DELETE CASCADE,
  fs              numeric NOT NULL,
  place_type      text NOT NULL DEFAULT 'default',
  weights         jsonb NOT NULL,
  evidence        jsonb NOT NULL DEFAULT '[]',
  risk_flags      jsonb NOT NULL DEFAULT '[]',
  manual_override boolean NOT NULL DEFAULT false,
  computed_at     timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ── c) Patent-faithful, weighted grade function ──────────────────────────────
-- Weights are duplicated from src/lib/grading/grade.ts (WEIGHTS_BY_TYPE).
-- KEEP IN SYNC with that file. Category → weight profile mapping mirrors
-- mapCategoryToGradingType() in src/lib/grading/db.ts:
--   'restaurant','bar','cafe' -> restaurant profile
--   'health'                  -> public profile
--   'activity'                -> culture profile
--   'accommodation'           -> accommodation profile
--   else                      -> default profile
-- Grade bands: S>=90, A>=75, B>=55, C>=35, else D.
CREATE OR REPLACE FUNCTION compute_place_grade(
  ls integer, ar integer, pd integer, lf integer, category text
) RETURNS text LANGUAGE plpgsql AS $$
DECLARE
  w_ls numeric; w_ar numeric; w_pd numeric; w_lf numeric;
  fs numeric;
BEGIN
  CASE category
    WHEN 'restaurant', 'bar', 'cafe' THEN
      w_ls := 0.3;  w_ar := 0.25; w_pd := 0.2;  w_lf := 0.25;
    WHEN 'health' THEN
      w_ls := 0.25; w_ar := 0.4;  w_pd := 0.2;  w_lf := 0.15;
    WHEN 'activity' THEN
      w_ls := 0.3;  w_ar := 0.3;  w_pd := 0.25; w_lf := 0.15;
    WHEN 'accommodation' THEN
      w_ls := 0.3;  w_ar := 0.3;  w_pd := 0.25; w_lf := 0.15;
    ELSE
      w_ls := 0.3;  w_ar := 0.3;  w_pd := 0.2;  w_lf := 0.2;
  END CASE;

  fs := w_ls * ls + w_ar * ar + w_pd * pd + w_lf * lf;

  IF    fs >= 90 THEN RETURN 'S';
  ELSIF fs >= 75 THEN RETURN 'A';
  ELSIF fs >= 55 THEN RETURN 'B';
  ELSIF fs >= 35 THEN RETURN 'C';
  ELSE  RETURN 'D';
  END IF;
END;
$$;

-- Replace the trigger fn to call the 5-arg version with NEW.category.
-- grade_override precedence is unchanged.
CREATE OR REPLACE FUNCTION places_grade_trigger() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.grade_override IS NOT NULL AND NEW.grade_override != '' THEN
    NEW.grade := NEW.grade_override;
  ELSE
    NEW.grade := compute_place_grade(
      NEW.ls_score, NEW.ar_score, NEW.pd_score, NEW.lf_score, NEW.category
    );
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- Drop the old 4-arg version now that the trigger no longer references it.
DROP FUNCTION IF EXISTS compute_place_grade(integer, integer, integer, integer);

-- Backfill grades using the new weighted function (leave overridden rows alone).
UPDATE places
SET grade = compute_place_grade(ls_score, ar_score, pd_score, lf_score, category)
WHERE grade_override IS NULL OR grade_override = '';

-- ── d) RLS ───────────────────────────────────────────────────────────────────
ALTER TABLE grading_sources     ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_grade_details ENABLE ROW LEVEL SECURITY;

-- TODO(auth): permissive — anyone with the anon key can read/write these.
CREATE POLICY "temp_open_grading_sources"     ON grading_sources
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "temp_open_place_grade_details" ON place_grade_details
  FOR ALL USING (true) WITH CHECK (true);

-- TODO(auth): the engine writes ls/ar/pd/lf + grade_override on places, but
-- places only has a SELECT-only public_read policy. Open UPDATE for now.
CREATE POLICY "temp_open_places_write" ON places
  FOR UPDATE USING (true) WITH CHECK (true);

-- TODO(auth): the recompute route wraps each batch in a data_jobs row.
-- data_jobs currently has only an admin-role policy; open it for now.
CREATE POLICY "temp_open_data_jobs" ON data_jobs
  FOR ALL USING (true) WITH CHECK (true);
