-- Run this in Supabase Dashboard → SQL Editor
-- Adds onboarding_meta JSONB column to profiles table

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS onboarding_meta jsonb;

COMMENT ON COLUMN profiles.onboarding_meta IS
  'Extended onboarding data: purpose, arrival_date, stay_duration, living, korean_level, budget, activity_style, has_pet, dietary, transportation, connections.';
