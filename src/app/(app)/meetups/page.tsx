"use client";

import { useState } from "react";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { MeetupCard } from "@/components/cards/MeetupCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SEED_MEETUPS, SEED_REGIONS } from "@/data/seed";

type StatusFilter = "all" | "open" | "full";

export default function MeetupsPage() {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [regionId, setRegionId] = useState("all");

  const filtered = SEED_MEETUPS.filter((m) => {
    if (status !== "all" && m.status !== status) return false;
    if (regionId !== "all" && m.region_id !== regionId) return false;
    return true;
  });

  return (
    <PageWrapper>
      <TopBar
        title="Meetups"
        right={
          <Link href="/meetups/create" className="text-[var(--primary)] text-sm font-semibold">
            + New
          </Link>
        }
      />

      <p className="px-4 pt-1 pb-3 text-sm text-[var(--muted-foreground)]">
        Meet people, share experiences
      </p>

      {/* Status filter */}
      <div className="flex gap-2 px-4 pb-3">
        {(["all", "open", "full"] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              status === s
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--muted)] text-[var(--muted-foreground)]"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Region filter */}
      <div className="flex gap-2 px-4 pb-4 scroll-x">
        <button
          onClick={() => setRegionId("all")}
          className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            regionId === "all"
              ? "border-[var(--primary)] text-[var(--primary)] bg-orange-50"
              : "border-[var(--border)] text-[var(--muted-foreground)]"
          }`}
        >
          All areas
        </button>
        {SEED_REGIONS.map((r) => (
          <button
            key={r.id}
            onClick={() => setRegionId(r.id)}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              regionId === r.id
                ? "border-[var(--primary)] text-[var(--primary)] bg-orange-50"
                : "border-[var(--border)] text-[var(--muted-foreground)]"
            }`}
          >
            {r.name_en}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="🤝" title="No meetups found" description="Try a different filter or create one!" />
      ) : (
        <div className="mx-4 rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--card)]">
          {filtered.map((meetup) => (
            <MeetupCard key={meetup.id} meetup={meetup} variant="list" />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
