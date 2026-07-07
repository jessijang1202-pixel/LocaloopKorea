"use client";

// LEGACY (Phase-1) route — not linked from AppNav; kept for URL compatibility

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { GuideCard } from "@/components/cards/GuideCard";
import { SEED_GUIDES } from "@/data/seed";
import { GUIDE_CATEGORIES } from "@/lib/constants";

export default function GuidesPage() {
  const [category, setCategory] = useState("all");

  const filtered = category === "all"
    ? SEED_GUIDES
    : SEED_GUIDES.filter((g) => g.category === category);

  return (
    <PageWrapper>
      <TopBar title="Life Guides" />

      <p className="px-4 pt-1 pb-3 text-sm text-[var(--muted-foreground)]">
        Navigate life in Korea
      </p>

      {/* Category filters */}
      <div className="flex gap-2 px-4 pb-4 scroll-x">
        <button
          onClick={() => setCategory("all")}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            category === "all"
              ? "bg-[var(--primary)] text-white"
              : "bg-[var(--muted)] text-[var(--muted-foreground)]"
          }`}
        >
          All
        </button>
        {GUIDE_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`flex-shrink-0 flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === cat.value
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--muted)] text-[var(--muted-foreground)]"
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label_en}</span>
          </button>
        ))}
      </div>

      {/* Guide list */}
      <div className="mx-4 rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--card)]">
        {filtered.map((guide) => (
          <GuideCard key={guide.id} guide={guide} variant="horizontal" />
        ))}
      </div>
    </PageWrapper>
  );
}
