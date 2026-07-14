"use client";

// Browse-by-area index. Loads the live dataset once, groups regions by city
// (Seoul first, then Gyeonggi, then a trailing "Other" bucket for legacy seed
// cities), and shows the first 10 grade-sorted places per region with a link
// through to the region's full list.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/lang";
import { fetchLivePlaces, type LiveRegion } from "@/lib/places-live";
import { SEED_PLACES, SEED_REGIONS } from "@/data/seed";
import type { Place } from "@/types";
import { getRating } from "@/lib/grades";
import { CAT_LABEL } from "@/content/places";
import { PlaceGridCard } from "@/components/places/PlaceGridCard";

const PREVIEW_SIZE = 10;

const GRADE_RANK: Record<string, number> = { S: 0, A: 1, B: 2, C: 3, D: 4 };

function sortByGradeThenName(a: Place, b: Place): number {
  const ra = GRADE_RANK[getRating(a)] ?? 5;
  const rb = GRADE_RANK[getRating(b)] ?? 5;
  if (ra !== rb) return ra - rb;
  return a.name_ko.localeCompare(b.name_ko, "ko");
}

interface RegionEntry {
  region: LiveRegion;
  places: Place[];
}

interface CityGroup {
  key: string;
  ko: string;
  en: string;
  regions: RegionEntry[];
}

export default function AreasPage() {
  const isKo = useLang();

  const [places, setPlaces] = useState<Place[]>(SEED_PLACES);
  const [regions, setRegions] = useState<LiveRegion[]>(SEED_REGIONS);
  const [loading, setLoading] = useState(true);

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

  const groups = useMemo<CityGroup[]>(() => {
    // Build each region's grade-sorted place list; skip empty regions.
    const entries: RegionEntry[] = regions
      .map((region) => ({
        region,
        places: places
          .filter((p) => p.region_id === region.id)
          .sort(sortByGradeThenName),
      }))
      .filter((e) => e.places.length > 0);

    const seoul: RegionEntry[] = [];
    const gyeonggi: RegionEntry[] = [];
    const other: RegionEntry[] = [];
    for (const e of entries) {
      if (e.region.city === "서울") seoul.push(e);
      else if (e.region.city === "경기") gyeonggi.push(e);
      else other.push(e);
    }

    const byCountDesc = (a: RegionEntry, b: RegionEntry) => b.places.length - a.places.length;
    seoul.sort(byCountDesc);
    gyeonggi.sort(byCountDesc);
    other.sort(byCountDesc);

    const result: CityGroup[] = [];
    if (seoul.length) result.push({ key: "seoul", ko: "서울", en: "SEOUL", regions: seoul });
    if (gyeonggi.length) result.push({ key: "gyeonggi", ko: "경기", en: "GYEONGGI", regions: gyeonggi });
    if (other.length) result.push({ key: "other", ko: "기타", en: "Other", regions: other });
    return result;
  }, [places, regions]);

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

  return (
    <div style={{ background: "var(--background)", minHeight: "100%", paddingBottom: 40 }}>
      {/* Page header */}
      <div style={{ padding: "16px 16px 6px" }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
          {isKo ? "지역별 장소" : "Browse by Area"}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--foreground-muted)", marginTop: 3 }}>
          {isKo ? "서울과 경기 주요 지역의 수집 장소" : "Collected places across Seoul and Gyeonggi"}
        </div>
      </div>

      {groups.map((group) => (
        <div key={group.key} style={{ padding: "0 16px", marginTop: 18 }}>
          {/* City group header */}
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", color: "var(--foreground-sub)", marginBottom: 10 }}>
            {isKo ? group.ko : group.en}
          </div>

          {group.regions.map(({ region, places: rPlaces }) => {
            const count = rPlaces.length;
            const preview = rPlaces.slice(0, PREVIEW_SIZE);
            const extra = count - PREVIEW_SIZE;
            return (
              <div key={region.id} style={{ marginBottom: 22 }}>
                {/* Region header row */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 9 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)" }}>
                    {isKo ? region.name_ko : region.name_en}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--foreground-muted)" }}>
                    {isKo ? `${count}곳` : `${count} places`}
                  </span>
                  <div style={{ flex: 1 }} />
                  <Link
                    href={`/areas/${region.slug}`}
                    style={{ fontSize: 12, fontWeight: 700, color: "var(--grade-s)", textDecoration: "none", flexShrink: 0 }}
                  >
                    {isKo ? "전체 보기" : "View all"}
                  </Link>
                </div>

                {/* Preview grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {preview.map((p) => (
                    <PlaceGridCard key={p.id} place={p} isKo={isKo} metaLine={catMeta(p)} />
                  ))}
                </div>

                {extra > 0 && (
                  <Link
                    href={`/areas/${region.slug}`}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: "100%", marginTop: 8, padding: "10px 0", borderRadius: 12,
                      background: "var(--content-bg)", border: "1px solid var(--border)",
                      color: "var(--foreground-muted)", fontSize: 12.5, fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    {isKo ? `+${extra} 더보기` : `+${extra} more`}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
