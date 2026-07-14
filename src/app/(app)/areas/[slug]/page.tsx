"use client";

// Full place list for one region. Resolves the region by slug from the live
// dataset (silent seed fallback), lists every place in that region sorted by
// foreigner grade then Korean name, and paginates 20 at a time.

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLang } from "@/lib/lang";
import { fetchLivePlaces, type LiveRegion } from "@/lib/places-live";
import { SEED_PLACES, SEED_REGIONS } from "@/data/seed";
import type { Place } from "@/types";
import { getRating } from "@/lib/grades";
import { CAT_LABEL } from "@/content/places";
import { PlaceGridCard } from "@/components/places/PlaceGridCard";

const PAGE_SIZE = 20;

// Grade order for sorting: S, A, B, C, D, then anything else last.
const GRADE_RANK: Record<string, number> = { S: 0, A: 1, B: 2, C: 3, D: 4 };

function sortByGradeThenName(a: Place, b: Place): number {
  const ra = GRADE_RANK[getRating(a)] ?? 5;
  const rb = GRADE_RANK[getRating(b)] ?? 5;
  if (ra !== rb) return ra - rb;
  return a.name_ko.localeCompare(b.name_ko, "ko");
}

export default function AreaDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const isKo = useLang();

  const [places, setPlaces] = useState<Place[]>(SEED_PLACES);
  const [regions, setRegions] = useState<LiveRegion[]>(SEED_REGIONS);
  const [loading, setLoading] = useState(true);
  const [shown, setShown] = useState(PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;
    void fetchLivePlaces().then(({ places: p, regions: r, source }) => {
      if (cancelled) return;
      if (source === "db") {
        setPlaces(p);
        setRegions(r);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const region = useMemo(
    () => regions.find((r) => r.slug === slug) ?? null,
    [regions, slug]
  );

  const regionPlaces = useMemo(() => {
    if (!region) return [];
    return places
      .filter((p) => p.region_id === region.id)
      .sort(sortByGradeThenName);
  }, [places, region]);

  function catMeta(p: Place): string {
    const label = CAT_LABEL[p.category];
    return label ? (isKo ? label.ko : label.en) : p.category;
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60dvh", color: "var(--foreground-muted)", fontSize: 15 }}>
        {isKo ? "불러오는 중..." : "Loading..."}
      </div>
    );
  }

  if (!region) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60dvh", color: "var(--foreground-muted)", fontSize: 15 }}>
        {isKo ? "지역을 찾을 수 없어요" : "Area not found"}
      </div>
    );
  }

  const count = regionPlaces.length;
  const visible = regionPlaces.slice(0, shown);
  const remaining = count - shown;

  return (
    <div style={{ background: "var(--background)", minHeight: "100%", paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ padding: "14px 16px 6px", display: "flex", alignItems: "flex-start", gap: 12 }}>
        <button
          onClick={() => router.back()}
          aria-label={isKo ? "뒤로" : "Back"}
          style={{
            width: 36, height: 36, borderRadius: 999, flexShrink: 0,
            background: "var(--content-bg)", border: "1px solid var(--border)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--foreground)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <div style={{ minWidth: 0, paddingTop: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            {region.name_ko}
          </div>
          <div style={{ fontSize: 12, color: "var(--foreground-muted)", marginTop: 2 }}>
            {region.name_en} · {isKo ? `${count}곳` : `${count} places`}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: "10px 16px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {visible.map((p) => (
            <PlaceGridCard key={p.id} place={p} isKo={isKo} metaLine={catMeta(p)} />
          ))}
        </div>

        {remaining > 0 && (
          <button
            onClick={() => setShown((n) => n + PAGE_SIZE)}
            style={{ width: "100%", marginTop: 12, padding: "11px 0", borderRadius: 12, background: "var(--content-bg)", border: "1px solid var(--border)", color: "var(--foreground-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            {isKo ? `더보기 (${remaining})` : `View more (${remaining})`}
          </button>
        )}
      </div>
    </div>
  );
}
