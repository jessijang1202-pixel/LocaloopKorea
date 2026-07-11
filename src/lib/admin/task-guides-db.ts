// Admin task-guide management — browser-side DB access (patent no.1).
//
// Mirrors src/lib/admin/places-db.ts: uses the anon Supabase browser client and
// throws a clear Error when Supabase is not configured, so callers can surface
// a useful message instead of hitting a null client.
//
// Reads/writes the task_guides table added by
// supabase/migrations/20260712_admin_manage.sql. Each row overrides the
// code-default guide in src/content/task-guides.ts for the matching task_id.

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { TASK_GUIDES } from "@/content/task-guides";
import type { Bi } from "@/types/content";
import type { TaskId } from "@/lib/engine/types";

function requireConfigured() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
}

// ── Types ────────────────────────────────────────────────────────────────────

// Mirrors the task_guides table (jsonb columns typed to their code shapes).
export interface TaskGuideRow {
  task_id: TaskId;
  what: Bi;
  steps: Bi[];
  prepare: Bi[];
  cautions: Bi[];
  updated_at: string;
}

// The editable payload for a single guide (everything except task_id/updated_at).
export interface TaskGuidePayload {
  what: Bi;
  steps: Bi[];
  prepare: Bi[];
  cautions: Bi[];
}

// ── Reads ────────────────────────────────────────────────────────────────────

// All override rows currently stored in the DB (task_id ascending).
export async function fetchTaskGuideOverrides(): Promise<TaskGuideRow[]> {
  requireConfigured();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("task_guides")
    .select("*")
    .order("task_id");
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as TaskGuideRow[];
}

// ── Writes ───────────────────────────────────────────────────────────────────

// Upsert one guide override, stamping updated_at. Falls under the row's task_id.
export async function saveTaskGuide(
  taskId: TaskId,
  guide: TaskGuidePayload
): Promise<void> {
  requireConfigured();
  const supabase = createClient();
  const now = new Date().toISOString();
  const { error } = await supabase.from("task_guides").upsert(
    {
      task_id: taskId,
      what: guide.what,
      steps: guide.steps,
      prepare: guide.prepare,
      cautions: guide.cautions,
      updated_at: now,
    },
    { onConflict: "task_id" }
  );
  if (error) throw new Error(error.message);
}

// Remove an override so the app falls back to the code default for this task.
export async function deleteTaskGuide(taskId: TaskId): Promise<void> {
  requireConfigured();
  const supabase = createClient();
  const { error } = await supabase
    .from("task_guides")
    .delete()
    .eq("task_id", taskId);
  if (error) throw new Error(error.message);
}

// Upsert ALL code-default guides into the table (admin "기본 콘텐츠 불러오기").
// Returns the number of guides written.
export async function seedTaskGuidesFromCode(): Promise<number> {
  requireConfigured();
  const supabase = createClient();
  const now = new Date().toISOString();
  const rows = Object.values(TASK_GUIDES).map((g) => ({
    task_id: g.taskId,
    what: g.what,
    steps: g.steps,
    prepare: g.prepare,
    cautions: g.cautions,
    updated_at: now,
  }));
  const { error } = await supabase
    .from("task_guides")
    .upsert(rows, { onConflict: "task_id" });
  if (error) throw new Error(error.message);
  return rows.length;
}
