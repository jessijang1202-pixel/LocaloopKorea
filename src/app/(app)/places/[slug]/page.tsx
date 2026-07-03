"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { SEED_PLACES, SEED_REGIONS } from "@/data/seed";
import type { Place } from "@/types";
import dynamic from "next/dynamic";
import { useLang } from "@/lib/lang";

const KakaoMap = dynamic(
  () => import("@/components/map/KakaoMap").then((m) => m.KakaoMap),
  { ssr: false, loading: () => <div style={{ width: "100%", height: "100%", background: "var(--map-bg)" }} /> }
);

function getRating(p: Place): "S" | "A" | "B" | "C" {
  if (p.english_support && p.card_payment && p.solo_friendly) return "S";
  if (p.english_support && p.card_payment) return "A";
  if (p.card_payment) return "B";
  return "C";
}

const GRADE_COLOR: Record<string, string> = {
  S: "var(--grade-s)", A: "var(--grade-a)", B: "var(--grade-b)", C: "var(--grade-c)",
};

const GRADE_TEXT: Record<string, string> = {
  S: "#fff", A: "#fff", B: "#fff", C: "var(--grade-c-text)",
};

const CAT_LABEL: Record<string, { ko: string; en: string }> = {
  cafe:       { ko: "카페",    en: "Café" },
  restaurant: { ko: "음식점",  en: "Restaurant" },
  bar:        { ko: "바",      en: "Bar" },
  market:     { ko: "시장",    en: "Market" },
  shopping:   { ko: "쇼핑",   en: "Shopping" },
  activity:   { ko: "액티비티", en: "Activity" },
  health:     { ko: "헬스",   en: "Health" },
  transport:  { ko: "교통",   en: "Transport" },
};

const WHY_TAGS: Record<string, { ko: string; en: string }[]> = {
  S: [
    { ko: "영어 완전 대응",   en: "Full English Support" },
    { ko: "외국인 리뷰 84+", en: "84+ Foreign Reviews" },
    { ko: "지하철 5분",      en: "5 min from Subway" },
    { ko: "카드 OK",         en: "Card Payment OK" },
    { ko: "혼자 방문 OK",    en: "Solo-Friendly" },
    { ko: "예약 쉬움",       en: "Easy Reservation" },
  ],
  A: [
    { ko: "영어 어느 정도 가능", en: "Some English Available" },
    { ko: "카드 결제 OK",       en: "Card Payment OK" },
    { ko: "외국인 리뷰 있음",   en: "Has Foreign Reviews" },
  ],
  B: [
    { ko: "카드 결제 OK",   en: "Card Payment OK" },
    { ko: "픽토그램 메뉴",  en: "Pictogram Menu" },
    { ko: "구글맵 정보 있음", en: "Google Maps Verified" },
  ],
  C: [
    { ko: "현금 선호",     en: "Cash Preferred" },
    { ko: "한국어 필요",   en: "Korean Required" },
    { ko: "기본 방문 가능", en: "Basic Visit OK" },
  ],
};

const ROW_SVGS: Record<string, React.ReactNode> = {
  globe: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
    </svg>
  ),
  card: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="1" y="4" width="22" height="16" rx="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
};

function getFriendlyRows(p: Place, isKo: boolean) {
  return [
    {
      iconId: "globe", bg: "var(--badge-en-bg)", fg: "var(--badge-en-fg)",
      label: isKo ? "영어 대응" : "English Support",
      caption: isKo ? "English Support" : "영어 대응",
      ok: p.english_support,
    },
    {
      iconId: "card", bg: "var(--badge-card-bg)", fg: "var(--badge-card-fg)",
      label: isKo ? "카드 결제" : "Card Payment",
      caption: isKo ? "Card Payment" : "카드 결제",
      ok: p.card_payment,
    },
    {
      iconId: "user", bg: "var(--badge-solo-bg)", fg: "var(--badge-solo-fg)",
      label: isKo ? "혼자 방문" : "Solo Friendly",
      caption: isKo ? "Solo Friendly" : "혼자 방문",
      ok: p.solo_friendly,
    },
    {
      iconId: "calendar", bg: "var(--badge-res-bg)", fg: "var(--badge-res-fg)",
      label: isKo ? "예약 용이" : "Easy Reservation",
      caption: isKo ? "Easy Reservation" : "예약 용이",
      ok: p.reservation_difficulty === "easy",
    },
  ];
}

export default function PlaceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const isKo = useLang();

  const place = SEED_PLACES.find((p) => p.slug === slug);
  if (!place) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60dvh", color: "var(--foreground-muted)", fontSize: 15 }}>
        {isKo ? "장소를 찾을 수 없어요" : "Place not found"}
      </div>
    );
  }

  const region = SEED_REGIONS.find((r) => r.id === place.region_id);
  const rating = getRating(place);
  const gradeColor = GRADE_COLOR[rating];
  const gradeText = GRADE_TEXT[rating];
  const friendlyRows = getFriendlyRows(place, isKo);
  const okCount = friendlyRows.filter(r => r.ok).length;
  const summaryLabel = okCount >= 3
    ? (isKo ? "최상" : "Excellent")
    : okCount >= 2
      ? (isKo ? "우수" : "Good")
      : (isKo ? "보통" : "Okay");

  const catLabel = CAT_LABEL[place.category];
  const catText = catLabel ? (isKo ? catLabel.ko : catLabel.en) : place.category;

  const mapPins = place.lat && place.lng
    ? [{ id: place.id, lat: place.lat, lng: place.lng, title: isKo ? (place.name_ko ?? place.name_en) : place.name_en, rating }]
    : [];

  function handleDirections() {
    const p = place;
    if (!p || !p.lat || !p.lng) return;
    const name = encodeURIComponent(p.name_en);
    const appUrl = `kakaomap://route?ep=${p.lat},${p.lng}&by=FOOT`;
    const webUrl = `https://map.kakao.com/link/to/${name},${p.lat},${p.lng}`;
    window.location.href = appUrl;
    setTimeout(() => { window.open(webUrl, "_blank"); }, 600);
  }

  return (
    <div style={{ background: "var(--background)", minHeight: "100dvh", paddingBottom: 80 }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <div style={{ position: "relative", height: 264, background: "var(--muted)" }}>
        {place.image_url && (
          <Image src={place.image_url} alt={place.name_en} fill sizes="430px" priority style={{ objectFit: "cover" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)" }} />

        {/* Top actions */}
        <div style={{ position: "absolute", top: "calc(env(safe-area-inset-top, 0px) + 12px)", left: 14, right: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={() => router.back()}
            style={{ width: 36, height: 36, borderRadius: 999, background: "rgba(0,0,0,0.35)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ width: 36, height: 36, borderRadius: 999, background: "rgba(0,0,0,0.35)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
            </button>
            <button style={{ width: 36, height: 36, borderRadius: 999, background: "rgba(0,0,0,0.35)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>
        </div>

        {/* Bottom overlay: grade + name */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 18px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, background: gradeColor, borderRadius: 8, padding: "4px 10px" }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: gradeText, lineHeight: 1 }}>{rating}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: gradeText, opacity: 0.8, letterSpacing: "0.06em" }}>GRADE</span>
            </div>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>
              {catText} · {isKo ? region?.name_ko : region?.name_en}
            </span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 3, letterSpacing: "-0.5px" }}>
            {isKo ? place.name_ko : place.name_en}
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
            {isKo ? place.name_en : place.name_ko}
          </p>
        </div>
      </div>

      {/* ── Stats row ────────────────────────────────────── */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
        {[
          { label: isKo ? "도보 8분" : "8 min walk", sub: "650m" },
          { label: "★ 4.7", sub: isKo ? "리뷰 124개" : "124 reviews" },
          { label: isKo ? "영업중" : "Open Now", sub: "~ 22:00", green: true },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, padding: "14px 0", textAlign: "center",
            borderRight: i < 2 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: s.green ? gradeColor : "var(--foreground)", marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: "var(--foreground-muted)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "0 18px", display: "flex", flexDirection: "column", gap: 14, paddingTop: 18 }}>

        {/* ── 외국인 친화도 card ──────────────────────────── */}
        <div style={{ background: "var(--card)", borderRadius: 18, border: "1px solid var(--border)", overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)" }}>
              {isKo ? "외국인 친화도" : "Foreigner Rating"}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "var(--badge-en-bg)", color: "var(--badge-en-fg)" }}>
              {summaryLabel}
            </span>
          </div>
          {friendlyRows.map((row, i) => (
            <div key={i} style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: i < friendlyRows.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: row.bg, display: "flex", alignItems: "center", justifyContent: "center", color: row.fg }}>
                {ROW_SVGS[row.iconId]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>{row.label}</div>
                <div style={{ fontSize: 11, color: "var(--foreground-muted)" }}>{row.caption}</div>
              </div>
              <div style={{ width: 22, height: 22, borderRadius: 999, background: row.ok ? gradeColor : "var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {row.ok
                  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                  : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                }
              </div>
            </div>
          ))}
        </div>

        {/* ── 왜 이 등급인가요? ──────────────────────────── */}
        <div style={{ background: "var(--why-bg)", border: "1px solid var(--why-border)", borderRadius: 16, padding: "14px 16px" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "var(--why-text)", marginBottom: 10 }}>
            {isKo ? `왜 ${rating}등급인가요?` : `Why ${rating} Grade?`}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {(WHY_TAGS[rating] ?? []).map((tag) => (
              <span key={tag.en} style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 999, background: "var(--card)", color: "var(--why-text)", border: "1px solid var(--why-border)" }}>
                {isKo ? tag.ko : tag.en}
              </span>
            ))}
          </div>
        </div>

        {/* ── 설명 ───────────────────────────────────────── */}
        {(place.description_en || place.description_ko) && (
          <div style={{ background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)", padding: "14px 16px" }}>
            <p style={{ fontSize: 14, color: "var(--foreground)", lineHeight: 1.65 }}>
              {isKo ? place.description_ko : place.description_en}
            </p>
          </div>
        )}

        {/* ── 미니 지도 ──────────────────────────────────── */}
        {place.lat && place.lng && (
          <div style={{ background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden" }}>
            <div style={{ height: 156 }}>
              <KakaoMap
                lang={isKo ? "ko" : "en"}
                pins={mapPins}
                center={{ lat: place.lat, lng: place.lng }}
                zoom={3}
                onPinClick={() => {}}
              />
            </div>
            <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", marginBottom: 2 }}>{isKo ? place.address_ko : place.address}</div>
                <div style={{ fontSize: 11, color: "var(--foreground-muted)" }}>{isKo ? place.address : place.address_ko}</div>
              </div>
              <button onClick={handleDirections} style={{ fontSize: 12, fontWeight: 700, color: "var(--grade-a)", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
                {isKo ? "길찾기 →" : "Directions →"}
              </button>
            </div>
          </div>
        )}

        <div style={{ height: 4 }} />
      </div>

      {/* ── Fixed CTA bar ────────────────────────────────── */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: "var(--card)", borderTop: "1px solid var(--border)",
        padding: "12px 18px", paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
        display: "flex", gap: 10, zIndex: 40,
      }}>
        <button style={{
          width: 52, height: 50, borderRadius: 14, flexShrink: 0,
          background: "var(--content-bg)", border: "1.5px solid var(--border)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2" strokeLinecap="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
          </svg>
        </button>
        <button onClick={handleDirections} style={{
          flex: 1, height: 50, borderRadius: 14,
          background: "var(--grade-s)", color: "#fff",
          border: "none", cursor: "pointer",
          fontSize: 15, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
          </svg>
          {isKo ? "길찾기 시작" : "Get Directions"}
        </button>
      </div>
    </div>
  );
}
