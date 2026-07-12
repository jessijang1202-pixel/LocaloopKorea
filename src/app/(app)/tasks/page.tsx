"use client";

// Tasks page — the patent-1 life-task navigator (PriorityNow) drives this page
// with live engine data. The former static stage roadmap (mock progress bars,
// pre-checked sample tasks) was removed once real data landed: sample content
// below live content read as broken. The stage detail pages under
// /tasks/[stage] remain URL-reachable.

import { PriorityNow } from "./PriorityNow";

export default function TasksPage() {
  return (
    <div style={{ background: "var(--background)", minHeight: "100%", paddingBottom: 24 }}>
      <PriorityNow />
    </div>
  );
}
