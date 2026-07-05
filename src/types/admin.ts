export type AdminRole = "user" | "admin" | "moderator";
export type PlaceGrade = "S" | "A" | "B" | "C" | "D";
export type CourseStatus = "active" | "inactive";
export type JobStatus = "pending" | "running" | "done" | "failed";
export type ArticleStatus = "draft" | "published";
export type StayStage = "arrival" | "early" | "stable" | "long_term";

export interface AdminPlace {
  id: string;
  name_ko: string;
  name_en: string | null;
  slug: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  category: string;
  region_id: string | null;
  ls_score: number;
  ar_score: number;
  pd_score: number;
  lf_score: number;
  grade: PlaceGrade | null;
  grade_override: PlaceGrade | null;
  grade_override_reason: string | null;
  languages: string[];
  phone: string | null;
  hours: string | null;
  memo: string | null;
  updated_at: string;
  created_at: string;
}

export interface AdminCourse {
  id: string;
  name_ko: string;
  name_en: string | null;
  description_ko: string | null;
  description_en: string | null;
  region: string | null;
  theme: string | null;
  language_level: "beginner" | "intermediate" | "advanced" | null;
  budget_min: number | null;
  budget_max: number | null;
  duration_minutes: number | null;
  image_url: string | null;
  status: CourseStatus;
  place_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CoursePlace {
  id: string;
  course_id: string;
  place_id: string;
  sort_order: number;
  place?: AdminPlace;
}

export interface AdminUser {
  id: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  nationality: string | null;
  user_type: string;
  role: AdminRole;
  onboarding_done: boolean;
  created_at: string;
  last_sign_in_at: string | null;
  is_suspended?: boolean;
}

export interface LifeTask {
  id: string;
  name_ko: string;
  name_en: string | null;
  description_ko: string | null;
  description_en: string | null;
  category: string | null;
  stay_stage: StayStage | null;
  prerequisite_ids: string[];
  related_place_ids: string[];
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface GuideArticle {
  id: string;
  title_ko: string;
  title_en: string | null;
  content_ko: string | null;
  content_en: string | null;
  category: "transport" | "medical" | "admin" | "culture" | "life" | null;
  language: "ko" | "en" | "ja" | "zh" | "vi";
  status: ArticleStatus;
  created_at: string;
  updated_at: string;
}

export interface DataJob {
  id: string;
  region: string | null;
  category: string | null;
  status: JobStatus;
  started_at: string | null;
  completed_at: string | null;
  result_total: number | null;
  result_updated: number | null;
  result_added: number | null;
  error_message: string | null;
  created_at: string;
}

export interface AdminLog {
  id: string;
  admin_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  detail: Record<string, unknown> | null;
  created_at: string;
  admin?: { display_name: string };
}

export interface DashboardStats {
  totalPlaces: number;
  totalUsers: number;
  totalCourses: number;
  updatedToday: number;
  gradeDistribution: Record<PlaceGrade, number>;
  signupsLast30: { date: string; count: number }[];
  topRegions: { region: string; count: number }[];
}

export interface GradeWeights {
  ls: number;
  ar: number;
  pd: number;
  lf: number;
}
