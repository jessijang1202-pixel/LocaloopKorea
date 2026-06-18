"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SEED_PLACES, SEED_REGIONS } from "@/data/seed";
import { PLACE_CATEGORIES } from "@/lib/constants";

export default function PlacesPage() {
  const [category, setCategory] = useState("all");
  const [regionId, setRegionId] = useState("all");

  const filtered = SEED_PLACES.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (regionId !== "all" && p.region_id !== regionId) return false;
    return true;
  });

  return (
    <PageWrapper>
      <TopBar title="Places" />

      {/* Category filters */}
      <div className="flex gap-2 px-4 py-3 scroll-x">
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
        {PLACE_CATEGORIES.map((cat) => (
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

      {/* Region filter */}
      <div className="flex gap-2 px-4 pb-3 scroll-x">
        <button
          onClick={() => setRegionId("all")}
          className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            regionId === "all"
              ? "border-[var(--primary)] text-[var(--primary)] bg-orange-50"
              : "border-[var(--border)] text-[var(--muted-foreground)]"
          }`}
        >
          All regions
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

      {/* Results */}
      <div className="px-4">
        <p className="text-xs text-[var(--muted-foreground)] mb-3">{filtered.length} places found</p>

        {filtered.length === 0 ? (
          <EmptyState icon="📍" title="No places found" description="Try a different category or region" />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((place) => (
              <Link key={place.id} href={`/places/${place.slug}`} className="block">
                <div className="bg-[var(--card)] rounded-2xl overflow-hidden border border-[var(--border)] flex gap-0">
                  <div className="relative w-28 h-28 flex-shrink-0 bg-[var(--muted)]">
                    {place.image_url && (
                      <Image src={place.image_url} alt={place.name_en} fill className="object-cover" sizes="112px" />
                    )}
                  </div>
                  <div className="p-3 flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[var(--foreground)] line-clamp-1">{place.name_en}</p>
                    <p className="text-xs text-[var(--muted-foreground)] line-clamp-1">{place.name_ko}</p>
                    {place.address && (
                      <p className="text-xs text-[var(--muted-foreground)] line-clamp-1 mt-0.5">📍 {place.address}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge size="sm" variant="primary">{place.category}</Badge>
                      {place.english_support && <Badge size="sm">🇬🇧</Badge>}
                      {place.card_payment && <Badge size="sm">💳</Badge>}
                      {place.solo_friendly && <Badge size="sm">👤</Badge>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
