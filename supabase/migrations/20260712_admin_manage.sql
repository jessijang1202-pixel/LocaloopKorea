-- ============================================================
-- Admin place management + task guides — schema
--
-- HOW TO APPLY:
--   Supabase dashboard > SQL Editor > paste this whole file > Run.
--   Apply this AFTER the three earlier migrations:
--     001_add_onboarding_meta.sql
--     20240102_admin_tables.sql
--     20260710_grading_engine.sql
--   Statements are ordered so nothing dangles mid-run; safe to run once.
--
-- TODO(auth): the RLS policies added below are PERMISSIVE
--   (USING (true) WITH CHECK (true)) because the app currently runs with
--   BYPASS_AUTH=true and only the anon key. Tighten every policy marked
--   TODO(auth) once real login + roles are enforced.
-- ============================================================

-- ── a) places write policies (INSERT + DELETE) ───────────────────────────────
-- places already has public_read (SELECT) + temp_open_places_write (UPDATE from
-- the grading migration). Admin create/delete need INSERT + DELETE too.
-- TODO(auth): permissive — anyone with the anon key can insert/delete places.
CREATE POLICY "temp_open_places_insert" ON places FOR INSERT WITH CHECK (true);
CREATE POLICY "temp_open_places_delete" ON places FOR DELETE USING (true);

-- ── b) places.updated_at ─────────────────────────────────────────────────────
-- INVESTIGATION: schema.sql defines places WITHOUT an updated_at column, yet
-- places_grade_trigger() (added in 20240102_admin_tables.sql and rewritten in
-- 20260710_grading_engine.sql) sets `NEW.updated_at := now()` on every INSERT
-- and score/override UPDATE. Without this column that trigger raises
-- "record 'new' has no field 'updated_at'" and blocks all place writes.
-- Add it so INSERT/UPDATE succeed.
ALTER TABLE places ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- ── c) task_guides (patent no.1 admin management — guide content per task) ────
-- Included here so a single migration covers everything; the admin UI that
-- edits these rows is built in a later task.
CREATE TABLE IF NOT EXISTS task_guides (
  task_id    text PRIMARY KEY CHECK (task_id IN ('T1','T2','T3','T4','T5','T6','T7','T8')),
  what       jsonb NOT NULL,               -- {ko,en}
  steps      jsonb NOT NULL DEFAULT '[]',  -- [{ko,en}]
  prepare    jsonb NOT NULL DEFAULT '[]',
  cautions   jsonb NOT NULL DEFAULT '[]',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE task_guides ENABLE ROW LEVEL SECURITY;

-- TODO(auth): permissive — anyone with the anon key can read/write task guides.
CREATE POLICY "temp_open_task_guides" ON task_guides
  FOR ALL USING (true) WITH CHECK (true);

-- ── d) Table grants ───────────────────────────────────────────────────────────
-- Tables created via the SQL editor may lack grants for the API roles, which
-- surfaces as "permission denied for table ..." even when permissive RLS
-- policies exist. Supabase's standard model: grants are blanket, RLS is the
-- gate — with RLS enabled on every table, access is still controlled per-table
-- by the policies above.
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;
