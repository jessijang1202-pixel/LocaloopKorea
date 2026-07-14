"use client";

// Tasks page — the patent-1 life-task navigator (PriorityNow) drives this page
// with live engine data. The former static stage roadmap (mock progress bars,
// pre-checked sample tasks) was removed once real data landed: sample content
// below live content read as broken. The stage detail pages under
// /tasks/[stage] remain URL-reachable.

import { useLang } from "@/lib/lang";
import { PriorityNow } from "./PriorityNow";

export default function TasksPage() {
  const isKo = useLang();

  return (
    <div style={{ background: "var(--background)", minHeight: "100%", paddingBottom: 24 }}>
      <div style={{ padding: "16px 16px 6px" }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
          {isKo ? "태스크" : "Tasks"}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--foreground-muted)", marginTop: 3 }}>
          {isKo ? "한국 도착 이후, 지금 당신이 해야 할 일들." : "Everything you need to do after landing in Korea."}
        </div>
      </div>
      <PriorityNow />
    </div>
  );
}
