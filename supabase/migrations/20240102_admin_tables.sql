-- ============================================================
-- Admin panel schema — run in Supabase SQL Editor
-- ============================================================

-- 1. Add role column to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user'
  CHECK (role IN ('user', 'admin', 'moderator'));

-- 2. Extend places table with grade score columns
ALTER TABLE places
  ADD COLUMN IF NOT EXISTS ls_score   integer NOT NULL DEFAULT 50 CHECK (ls_score BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS ar_score   integer NOT NULL DEFAULT 50 CHECK (ar_score BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS pd_score   integer NOT NULL DEFAULT 50 CHECK (pd_score BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS lf_score   integer NOT NULL DEFAULT 50 CHECK (lf_score BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS grade      text,
  ADD COLUMN IF NOT EXISTS grade_override text,
  ADD COLUMN IF NOT EXISTS grade_override_reason text,
  ADD COLUMN IF NOT EXISTS languages  text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS phone      text,
  ADD COLUMN IF NOT EXISTS hours      text,
  ADD COLUMN IF NOT EXISTS memo       text;

-- 3. Function to compute grade from scores
CREATE OR REPLACE FUNCTION compute_place_grade(
  ls integer, ar integer, pd integer, lf integer
) RETURNS text LANGUAGE plpgsql AS $$
DECLARE avg_score numeric;
BEGIN
  avg_score := (ls + ar + pd + lf)::numeric / 4;
  IF avg_score >= 90 THEN RETURN 'S';
  ELSIF avg_score >= 75 THEN RETURN 'A';
  ELSIF avg_score >= 60 THEN RETURN 'B';
  ELSIF avg_score >= 45 THEN RETURN 'C';
  ELSE RETURN 'D';
  END IF;
END;
$$;

-- 4. Trigger: auto-update grade when scores change
CREATE OR REPLACE FUNCTION places_grade_trigger() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.grade_override IS NOT NULL AND NEW.grade_override != '' THEN
    NEW.grade := NEW.grade_override;
  ELSE
    NEW.grade := compute_place_grade(NEW.ls_score, NEW.ar_score, NEW.pd_score, NEW.lf_score);
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS places_grade_update ON places;
CREATE TRIGGER places_grade_update
  BEFORE INSERT OR UPDATE OF ls_score, ar_score, pd_score, lf_score, grade_override
  ON places FOR EACH ROW EXECUTE FUNCTION places_grade_trigger();

-- 5. Backfill grade for existing rows
UPDATE places
SET grade = compute_place_grade(ls_score, ar_score, pd_score, lf_score)
WHERE grade IS NULL;

-- ── New tables ──────────────────────────────────────────────

-- 6. courses
CREATE TABLE IF NOT EXISTS courses (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ko          text NOT NULL,
  name_en          text,
  description_ko   text,
  description_en   text,
  region           text,
  theme            text,
  language_level   text CHECK (language_level IN ('beginner','intermediate','advanced')),
  budget_min       integer,
  budget_max       integer,
  duration_minutes integer,
  image_url        text,
  status           text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- 7. course_places (ordered many-to-many)
CREATE TABLE IF NOT EXISTS course_places (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id  uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  place_id   uuid NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  UNIQUE (course_id, place_id)
);

-- 8. life_tasks
CREATE TABLE IF NOT EXISTS life_tasks (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ko           text NOT NULL,
  name_en           text,
  description_ko    text,
  description_en    text,
  category          text,
  stay_stage        text CHECK (stay_stage IN ('arrival','early','stable','long_term')),
  prerequisite_ids  uuid[],
  related_place_ids uuid[],
  status            text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- 9. guide_articles
CREATE TABLE IF NOT EXISTS guide_articles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ko    text NOT NULL,
  title_en    text,
  content_ko  text,
  content_en  text,
  category    text CHECK (category IN ('transport','medical','admin','culture','life')),
  language    text NOT NULL DEFAULT 'ko' CHECK (language IN ('ko','en','ja','zh','vi')),
  status      text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 10. data_jobs (background collection jobs)
CREATE TABLE IF NOT EXISTS data_jobs (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region         text,
  category       text,
  status         text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','running','done','failed')),
  started_at     timestamptz,
  completed_at   timestamptz,
  result_total   integer,
  result_updated integer,
  result_added   integer,
  error_message  text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- 11. admin_logs
CREATE TABLE IF NOT EXISTS admin_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action      text NOT NULL,
  target_type text,
  target_id   text,
  detail      jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS places_grade_idx   ON places (grade);
CREATE INDEX IF NOT EXISTS places_region_idx  ON places (region_id);
CREATE INDEX IF NOT EXISTS admin_logs_admin   ON admin_logs (admin_id);
CREATE INDEX IF NOT EXISTS admin_logs_created ON admin_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS data_jobs_status   ON data_jobs (status);

-- ── RLS policies ────────────────────────────────────────────
ALTER TABLE courses       ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_tasks    ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_jobs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs    ENABLE ROW LEVEL SECURITY;

-- Public read for published content
CREATE POLICY "Public read courses"    ON courses       FOR SELECT USING (status = 'active');
CREATE POLICY "Public read tasks"      ON life_tasks    FOR SELECT USING (status = 'active');
CREATE POLICY "Public read articles"   ON guide_articles FOR SELECT USING (status = 'published');
CREATE POLICY "Public read cp"         ON course_places FOR SELECT USING (true);

-- Admin full access (check role in profiles)
CREATE POLICY "Admin all courses"    ON courses       USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin all cp"         ON course_places USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin all tasks"      ON life_tasks    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin all articles"   ON guide_articles USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin all jobs"       ON data_jobs     USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin all logs"       ON admin_logs    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
