"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { SEED_PLACES } from "@/data/seed";
import type { Place } from "@/types";

const KakaoMap = dynamic(
  () => import("@/components/map/KakaoMap").then((m) => m.KakaoMap),
  { ssr: false, loading: () => <div style={{ width: "100%", height: "100%", background: "#E8F4F8" }} /> }
);

const RATING_LABELS: Record<string, string> = { S: "S등급", A: "A등급", B: "B등급", C: "C등급", D: "D등급" };

const ITAEWON = { lat: 37.5340, lng: 126.9946 };

export default function MapPage() {
  const [selectedPlace, setSelectedPlace] = useState<Place>(SEED_PLACES[0]);

  const pins = SEED_PLACES.filter((p) => p.lat && p.lng).map((p) => ({
    id: p.id,
    lat: p.lat!,
    lng: p.lng!,
    title: p.name_en,
    rating: "A",
  }));

  function handlePinClick(id: string) {
    const place = SEED_PLACES.find((p) => p.id === id);
    if (place) setSelectedPlace(place);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", paddingBottom: "env(safe-area-inset-bottom)" }}>
      {/* ── Header ── */}
      <div style={{ background: "#1EC8C8", padding: "48px 20px 12px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Localoop Korea</span>
          <Link href="/profile" style={{
            width: 32, height: 32, borderRadius: "50%", background: "#FFD600",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#1A2B2C", textDecoration: "none",
          }}>나</Link>
        </div>
        <div style={{
          background: "#fff", borderRadius: 10, padding: "9px 14px",
          fontSize: 13, color: "#aaa", display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 14 }}>🔍</span>
          장소, 동네 검색...
        </div>
      </div>

      {/* ── Welcome bar ── */}
      <div style={{ background: "#0B1E2D", padding: "8px 20px", flexShrink: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#FFD600" }}>Real Korea starts here</p>
        <p style={{ fontSize: 10, color: "#8BB8C0", marginTop: 2 }}>
          외국인 친화 S~D 등급 장소를 지도에서 찾아보세요
        </p>
      </div>

      {/* ── Map ── */}
      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        <KakaoMap
          pins={pins}
          center={ITAEWON}
          zoom={5}
          onPinClick={handlePinClick}
        />

        {/* Legend */}
        <div style={{
          position: "absolute", bottom: 8, left: 10, zIndex: 10,
          background: "#fff", borderRadius: 10, padding: "8px 10px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.12)", fontSize: 10,
        }}>
          <p style={{ fontWeight: 700, color: "#1A2B2C", marginBottom: 4 }}>친화도 등급</p>
          {[["#1EC8C8", "S / A — 외국인 완전 OK"], ["#4A6467", "B / C — 부분 가능"]].map(([c, l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: c, flexShrink: 0 }} />
              <span style={{ color: "#4A6467" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Selected place card ── */}
      {selectedPlace && (
        <Link href={`/places/${selectedPlace.slug}`} style={{ textDecoration: "none" }}>
          <div style={{
            margin: "0 12px 8px",
            background: "#fff", borderRadius: 16,
            border: "1px solid #E0E8EA",
            padding: "10px 12px",
            display: "flex", alignItems: "center", gap: 10,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "#D6F5F5",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, flexShrink: 0,
            }}>📍</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#1A2B2C", marginBottom: 2 }}>
                {selectedPlace.name_en}
              </p>
              <p style={{ fontSize: 11, color: "#4A6467", marginBottom: 3 }}>
                {selectedPlace.address ?? selectedPlace.name_ko}
              </p>
              <span style={{
                fontSize: 10, padding: "2px 7px", borderRadius: 6,
                background: "#D6F5F5", color: "#17A0A0", fontWeight: 600,
              }}>
                A등급 · {selectedPlace.english_support ? "영어 가능" : "한국어"}
              </span>
            </div>
            <span style={{ fontSize: 18, color: "#1EC8C8" }}>›</span>
          </div>
        </Link>
      )}

      {/* ── Bottom padding for BottomNav ── */}
      <div style={{ height: 64, flexShrink: 0 }} />
    </div>
  );
}
