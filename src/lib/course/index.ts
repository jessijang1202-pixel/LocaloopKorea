// Local Consumption Data-based Personalized Local Experience Course
// Recommendation (patent no.3) — public API surface.
//
// Import from "@/lib/course" rather than reaching into individual modules.

// Types (modules 100~400 vocabulary)
export type {
  AdventureStyle,
  CourseDuration,
  LanguageLevel,
  LocalityInputs,
  CandidatePlace,
  CourseProfile,
  CourseStop,
  ComposedCourse,
  CourseFeedback,
} from "./types";

// Geo helper
export { haversineKm } from "./geo";
export type { LatLng } from "./geo";

// Module 100 — locality index + dynamic feedback correction
export {
  LI_W_REVIEW,
  LI_W_FOREIGN,
  LI_W_SEARCH,
  LI_W_KEYWORD,
  LI_LOCAL_SPOT_MIN,
  LI_FEEDBACK_STEP,
  computeLI,
  adjustLIWithFeedback,
} from "./locality";

// Module 300 — candidate filtering
export {
  SAFE_LI_MIN,
  BOLD_LI_MIN,
  BOLD_FOREIGN_RATIO_MAX,
  LS_MIN_LOW_LANG,
  LS_MIN_HIGH_LANG,
  SAFE_MIN_GRADE,
  isMealCategory,
  needsSubtitleCheck,
  filterCandidates,
} from "./filter";

// Module 400 — course composition
export {
  HALF_MIN_STOPS,
  HALF_MAX_STOPS,
  FULL_MIN_STOPS,
  FULL_MAX_STOPS,
  MAX_SAME_CATEGORY,
  TIE_DISTANCE_KM,
  WALK_MIN_PER_KM,
  composeCourse,
} from "./compose";

// Themed courses — alternate composition path over the collected-places dataset
export {
  THEMES,
  THEME_MIN_STOPS,
  themeById,
  centroidOf,
  filterForTheme,
  composeThemedCourse,
} from "./themes";
export type { CourseTheme, ThemeSlot } from "./themes";
