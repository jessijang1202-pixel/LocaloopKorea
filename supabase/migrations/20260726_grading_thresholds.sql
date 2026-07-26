-- ============================================================
-- Grading engine — recalibrate grade bands (patent no.2)
--
-- HOW TO APPLY:
--   Supabase dashboard > SQL Editor > paste this whole file > Run.
--
-- WHY: the original bands (S>=90, A>=75, B>=55, C>=35) assumed much larger
-- score swings than the keyword-hit weights in src/lib/grading/score.ts
-- actually produce. A place with no matched keywords (no evidence either
-- way — the common case for ordinary blog review text) lands at a
-- "no-evidence" baseline FS of ~67-74 depending on weight profile; a place
-- with several real positive hits across different axes realistically
-- reaches high-70s to mid-80s. Under the old bands that ceiling never
-- reached S, so S never appeared no matter how well-evidenced a place
-- actually was (e.g. Pyeongtaek/Songtan/Dongducheon places next to US
-- military bases, which are genuinely English-friendly but whose review
-- text rarely uses the exact "foreigner welcome" phrasing the dictionary
-- originally required — see the companion keyword-dictionary update in
-- src/lib/grading/keywords.ts for the new military-base-proximity and
-- broadened "많은 외국인" patterns that now pick this up).
--
-- New bands keep the baseline solidly in B (74 < 76, so no-evidence places
-- are never auto-promoted to A/S) while making S/A achievable for places
-- whose collected text actually documents real positive signal.
-- KEEP IN SYNC with GRADE_S_MIN etc. in src/lib/grading/grade.ts.
-- ============================================================

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

  IF    fs >= 78 THEN RETURN 'S';
  ELSIF fs >= 76 THEN RETURN 'A';
  ELSIF fs >= 45 THEN RETURN 'B';
  ELSIF fs >= 25 THEN RETURN 'C';
  ELSE  RETURN 'D';
  END IF;
END;
$$;

-- Backfill grades using the recalibrated bands from the CURRENT sub-scores
-- (leave manually-overridden rows alone). The app-level recompute
-- (POST /api/admin/grading/recompute {"all":true,"force":true}) has already
-- been run against the new keyword dictionary as of 2026-07-26, so this
-- backfill alone reflects the full effect — verified against production:
-- 4,004 places -> B:3971 S:26 A:7 (was B:3332 C:638 A:34 S:0 under the old
-- bands + old dictionary).
UPDATE places
SET grade = compute_place_grade(ls_score, ar_score, pd_score, lf_score, category)
WHERE grade_override IS NULL OR grade_override = '';
