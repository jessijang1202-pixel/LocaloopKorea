"use client";

// Shared 2-column grid place card. Extracted verbatim from the map page's
// PlaceCard2 so the map, /areas, and /areas/[slug] all render places
// identically. The caller computes whatever single meta line it wants
// (travel time, city, category label…) and passes it via `metaLine`.

import Link from "next/link";
import Image from "next/image";
import type { Place } from "@/types";
import { getRating, GRADE_BG, GRADE_TEXT } from "@/lib/grades";

export function PlaceGridCard({
  place,
  isKo,
  metaLine,
}: {
  place: Place;
  isKo: boolean;
  metaLine?: string | null;
}) {
  const rating = getRating(place);

  return (
    <Link
      href={`/places/${place.slug}`}
      style={{
        background: "var(--content-bg)", borderRadius: 14,
        textDecoration: "none", display: "flex", flexDirection: "column",
        border: "1px solid var(--border)", overflow: "hidden",
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: "relative", width: "100%", height: 80, background: "var(--muted)", flexShrink: 0 }}>
        {place.image_url && (
          <Image src={place.image_url} alt={isKo ? place.name_ko : place.name_en} fill sizes="200px" style={{ objectFit: "cover" }} />
        )}
      </div>
      {/* Info */}
      <div style={{ padding: "9px 10px", display: "flex", flexDirection: "column", gap: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
            background: GRADE_BG[rating],
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: GRADE_TEXT[rating], lineHeight: 1 }}>{rating}</span>
            <span style={{ fontSize: 6, fontWeight: 700, letterSpacing: "0.05em", opacity: 0.85, color: GRADE_TEXT[rating] }}>GRADE</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {isKo ? place.name_ko : place.name_en}
            </div>
            <div style={{ fontSize: 10, color: "var(--foreground-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {isKo ? place.name_en : place.name_ko}
            </div>
          </div>
        </div>
        {metaLine && (
          <div style={{ fontSize: 10, fontWeight: 500, color: "var(--foreground-muted)", letterSpacing: "0.02em" }}>
            {metaLine}
          </div>
        )}
      </div>
    </Link>
  );
}
