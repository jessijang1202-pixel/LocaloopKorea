// Runtime guide overrides (patent no.1) — client-safe merge layer.
//
// The user app renders code-default TASK_GUIDES synchronously; this helper
// overlays any admin-edited rows from the task_guides table on top. It is
// strictly best-effort: on ANY error (Supabase not configured, table missing,
// network failure, malformed row) it silently returns the code defaults so the
// /tasks guides never break.

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { TASK_GUIDES, type TaskGuide } from "@/content/task-guides";
import type { Bi } from "@/types/content";
import type { TaskId } from "./types";

// A DB row is trusted only when its jsonb columns match the expected shapes.
function asBi(v: unknown): Bi | null {
  if (v && typeof v === "object" && "ko" in v && "en" in v) {
    const b = v as Record<string, unknown>;
    if (typeof b.ko === "string" && typeof b.en === "string") {
      return { ko: b.ko, en: b.en };
    }
  }
  return null;
}

function asBiList(v: unknown): Bi[] | null {
  if (!Array.isArray(v)) return null;
  const out: Bi[] = [];
  for (const item of v) {
    const bi = asBi(item);
    if (!bi) return null;
    out.push(bi);
  }
  return out;
}

// Load TASK_GUIDES with DB overrides overlaid. Never throws.
export async function fetchGuidesWithOverrides(): Promise<
  Record<TaskId, TaskGuide>
> {
  // Start from a shallow copy of the code defaults.
  const merged: Record<TaskId, TaskGuide> = { ...TASK_GUIDES };

  try {
    if (!isSupabaseConfigured()) return merged;
    const supabase = createClient();
    const { data, error } = await supabase.from("task_guides").select("*");
    if (error || !data) return merged;

    for (const raw of data as unknown[]) {
      const row = raw as Record<string, unknown>;
      const taskId = row.task_id as TaskId;
      if (!(taskId in merged)) continue;

      const what = asBi(row.what);
      const steps = asBiList(row.steps);
      const prepare = asBiList(row.prepare);
      const cautions = asBiList(row.cautions);
      // Only overlay fields that parsed cleanly; fall back to the default field.
      const base = merged[taskId];
      merged[taskId] = {
        taskId,
        what: what ?? base.what,
        steps: steps ?? base.steps,
        prepare: prepare ?? base.prepare,
        cautions: cautions ?? base.cautions,
      };
    }
    return merged;
  } catch {
    return merged;
  }
}
