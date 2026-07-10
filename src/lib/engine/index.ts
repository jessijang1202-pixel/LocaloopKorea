// Foreigner Life Task Graph — public API surface.
//
// Import from "@/lib/engine" rather than reaching into individual modules.

// Types (module 100~500 vocabulary)
export type {
  TaskId,
  EdgeType,
  TaskNode,
  TaskEdge,
  UserProfile,
  ScoredTask,
} from "./types";

// Module 200 — task graph
export {
  TASK_NODES,
  ALL_TASKS,
  TASK_EDGES,
  edgeFrom,
  requiredPredecessors,
} from "./task-graph";

// Module 300 — priority engine (S300~S500)
export {
  REASON,
  getUnresolvedTasks,
  scoreTask,
  computePriorities,
  computeAllScored,
} from "./priority";

// Module 100 — user state + React hook (S900)
export {
  NAVIGATOR_KEY,
  NAVIGATOR_EVENT,
  DEFAULT_PROFILE,
  getProfile,
  saveProfile,
  completeTask,
  uncompleteTask,
  useNavigatorProfile,
} from "./user-state";
export type { NavigatorActions } from "./user-state";

// Module 400 — task guide content
export { TASK_GUIDES } from "@/content/task-guides";
export type { TaskGuide } from "@/content/task-guides";
