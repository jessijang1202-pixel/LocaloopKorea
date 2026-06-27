"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { SEED_PLACES } from "@/data/seed";
import type { Place } from "@/types";

const KakaoMap = dynamic(
  () => import("@/components/map/KakaoMap").then((m) => m.KakaoMap),
  { ssr: false, loading: () => <div style={{ width: "100%", height: "100%", background: "#E8F4F8" }} /> }
);

const ITAEWON = { lat: 37.534, lng: 126.9946 };
const P = "#1EC8C8";
const DARK = "#0B1E2D";
const GOLD = "#FFD600";

const PINS = SEED_PLACES.filter((p) => p.lat && p.lng).map((p) => ({
  id: p.id, lat: p.lat!, lng: p.lng!, title: p.name_en, rating: p.english_support ? "A" : "B",
}));

type T = typeof KO;

const KO = {
  loginBtn: "로그인 / 가입",
  search: "이태원 주변 검색...",
  searchPc: "이태원 주변 장소 검색...",
  filter: "필터",
  welcomeTitle: "Real Korea starts here",
  welcomeSub: "이태원 주변 외국인 친화 장소를 찾아보세요",
  legendTitle: "친화도 등급",
  legendS: "S / A — 외국인 OK",
  legendB: "B / C — 부분 가능",
  legendMeet: "모임",
  badgeEn: "S등급 · 영어 가능",
  badgeKo: "B등급 · 한국어",
  tabs: ["지도", "과제", "코스", "커뮤니티", "나"],
  navItems: ["장소", "생활 과제", "로컬 코스", "커뮤니티"],
  loginLink: "로그인",
  signupLink: "무료로 시작하기",
  sidebarSub: "이태원 주변 탐색 중",
  sidebarTag: "Real Korea starts here.",
  sidebarDesc: "AI가 당신의 한국 생활을 안내해요 —\n장소, 과제, 로컬 코스,\n그리고 진짜 연결.",
  featuresLabel: "기능",
  features: [
    { icon: "📍", name: "장소", desc: "S~D 친화도 등급", active: true },
    { icon: "📋", name: "생활 과제", desc: "지금 해야 할 일" },
    { icon: "🏃", name: "로컬 코스", desc: "AI 맞춤 추천" },
    { icon: "👥", name: "커뮤니티", desc: "모임 · 사람들" },
    { icon: "💬", name: "라이브 채팅", desc: "실시간 번역" },
  ],
  ctaMain: "무료로 시작하기",
  ctaSub: "30초 · 광고 없음 · 무료",
  popupBtn: "가입하고 자세히 보기",
  modalTitle: "이태원 탐험 시작하기",
  modalDesc: "가입하고 S~D 등급, 생활 과제 가이드,\n로컬 코스, 커뮤니티를 이용하세요 — 모두 무료.",
  ctaSignup: "무료로 시작하기",
  ctaLogin: "이미 계정이 있어요",
  modalFooter: "30초 가입 · 광고 없음 · 무료",
};

const EN = {
  loginBtn: "Log in / Sign up",
  search: "Search near Itaewon...",
  searchPc: "Search places near Itaewon...",
  filter: "Filter",
  welcomeTitle: "Real Korea starts here",
  welcomeSub: "Find foreigner-friendly spots near Itaewon",
  legendTitle: "Friendliness rating",
  legendS: "S / A — fully accessible",
  legendB: "B / C — partially",
  legendMeet: "Meetup",
  badgeEn: "S rating · English available",
  badgeKo: "B rating · Korean only",
  tabs: ["Map", "Tasks", "Courses", "Community", "Me"],
  navItems: ["Places", "Life Tasks", "Local Courses", "Community"],
  loginLink: "Log in",
  signupLink: "Get started free",
  sidebarSub: "Exploring near Itaewon",
  sidebarTag: "Real Korea starts here.",
  sidebarDesc: "AI guides your life in Korea —\nplaces, tasks, local courses,\nand real connections.",
  featuresLabel: "Features",
  features: [
    { icon: "📍", name: "Places", desc: "S~D friendliness rating", active: true },
    { icon: "📋", name: "Life Tasks", desc: "What to do right now" },
    { icon: "🏃", name: "Local Courses", desc: "AI-matched for you" },
    { icon: "👥", name: "Community", desc: "Meetup · People" },
    { icon: "💬", name: "Live Chat", desc: "Real-time translation" },
  ],
  ctaMain: "Get started free",
  ctaSub: "30 sec · No ads · Free",
  popupBtn: "Sign up to see details",
  modalTitle: "Start exploring Itaewon",
  modalDesc: "Sign up to access S~D ratings,\nlife task guides, local courses,\nand community — all free.",
  ctaSignup: "Get started free",
  ctaLogin: "Already have an account",
  modalFooter: "30 sec sign-up · No ads · Free",
};

export function AppPreview() {
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [isKo, setIsKo] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place>(SEED_PLACES[0]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    setIsKo(navigator.language.startsWith("ko"));
    return () => window.removeEventListener("resize", check);
  }, []);

  const t = isKo ? KO : EN;
  const openModal = () => setShowModal(true);

  function handlePinClick(id: string) {
    const p = SEED_PLACES.find((x) => x.id === id);
    if (p) setSelectedPlace(p);
    openModal();
  }

  return (
    <>
      {isMobile
        ? <MobileLayout selected={selectedPlace} onModal={openModal} onPin={handlePinClick} t={t} />
        : <PCLayout selected={selectedPlace} onModal={openModal} onPin={handlePinClick} t={t} />}

      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(11,30,45,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "0 20px" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", width: "min(340px, 100%)", position: "relative" }}>
            <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#94a3b8", lineHeight: 1 }}>×</button>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#D4F4F6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 22 }}>📍</div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1A2B2C", textAlign: "center", marginBottom: 6 }}>{t.modalTitle}</h2>
            <p style={{ fontSize: 13, color: "#4A6467", textAlign: "center", lineHeight: 1.65, marginBottom: 20, whiteSpace: "pre-line" }}>{t.modalDesc}</p>
            <Link href="/login" style={{ display: "block", padding: "13px", borderRadius: 12, background: P, color: "#fff", fontWeight: 700, fontSize: 14, textAlign: "center", textDecoration: "none", marginBottom: 8 }}>
              {t.ctaSignup}
            </Link>
            <Link href="/login" style={{ display: "block", padding: "13px", borderRadius: 12, background: "#F0FAFA", color: "#1A2B2C", fontWeight: 600, fontSize: 14, textAlign: "center", textDecoration: "none", border: "1px solid #E0E8EA" }}>
              {t.ctaLogin}
            </Link>
            <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginTop: 12 }}>{t.modalFooter}</p>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Mobile ─────────────────────────────────────────── */
function MobileLayout({ selected, onModal, onPin, t }: { selected: Place; onModal: () => void; onPin: (id: string) => void; t: T }) {
  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", background: "#fff" }}>
      <div style={{ background: P, padding: "44px 16px 12px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Localoop Korea</span>
          <button onClick={onModal} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 8, background: GOLD, color: DARK, fontWeight: 600, border: "none", cursor: "pointer" }}>
            {t.loginBtn}
          </button>
        </div>
        <div onClick={onModal} style={{ background: "#fff", borderRadius: 10, padding: "9px 14px", fontSize: 13, color: "#aaa", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          🔍 {t.search}
        </div>
      </div>

      <div style={{ background: DARK, padding: "8px 16px", flexShrink: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: GOLD }}>{t.welcomeTitle}</p>
        <p style={{ fontSize: 11, color: "#8BB8C0", marginTop: 2 }}>{t.welcomeSub}</p>
      </div>

      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        <KakaoMap pins={PINS} center={ITAEWON} zoom={5} onPinClick={onPin} />
        <div style={{ position: "absolute", bottom: 8, left: 10, background: "#fff", borderRadius: 10, padding: "8px 10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", fontSize: 10, zIndex: 5 }}>
          <p style={{ fontWeight: 700, color: "#1A2B2C", marginBottom: 4 }}>{t.legendTitle}</p>
          {[[P, t.legendS], ["#4A6467", t.legendB]].map(([c, l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: c, flexShrink: 0 }} />
              <span style={{ color: "#4A6467" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "8px 12px 6px", background: "#fff" }}>
        <div onClick={onModal} style={{ background: "#fff", borderRadius: 14, border: "1px solid #E0E8EA", padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 2px 10px rgba(0,0,0,0.07)", cursor: "pointer" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#D4F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📍</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1A2B2C" }}>{selected.name_en}</p>
            <p style={{ fontSize: 11, color: "#4A6467", marginTop: 1 }}>{selected.address ?? selected.name_ko}</p>
            <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 6, background: "#D4F4F6", color: "#17A0A0", fontWeight: 600, marginTop: 3, display: "inline-block" }}>
              {selected.english_support ? t.badgeEn : t.badgeKo}
            </span>
          </div>
          <span style={{ fontSize: 18, color: P }}>›</span>
        </div>
      </div>

      <div style={{ display: "flex", borderTop: "1px solid #E0E8EA", background: "#fff", paddingBottom: "env(safe-area-inset-bottom)", flexShrink: 0 }}>
        {(["🗺️", "📋", "🏃", "👥", "👤"] as const).map((icon, i) => (
          <div key={i} onClick={onModal} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0 6px", cursor: "pointer" }}>
            <span style={{ fontSize: 20, color: i === 0 ? P : "#94a3b8" }}>{icon}</span>
            <span style={{ fontSize: 9, color: i === 0 ? P : "#94a3b8", fontWeight: i === 0 ? 600 : 400, marginTop: 2 }}>{t.tabs[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── PC ──────────────────────────────────────────────── */
function PCLayout({ selected, onModal, onPin, t }: { selected: Place; onModal: () => void; onPin: (id: string) => void; t: T }) {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ background: DARK, padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: P, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>L</div>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Localoop Korea</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {t.navItems.map((n) => (
            <span key={n} onClick={onModal} style={{ fontSize: 13, color: "#8BB8C0", cursor: "pointer" }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#8BB8C0")}
            >{n}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/login" style={{ fontSize: 13, padding: "6px 16px", borderRadius: 7, border: "1px solid #4A6467", color: "#fff", textDecoration: "none" }}>{t.loginLink}</Link>
          <Link href="/login" style={{ fontSize: 13, padding: "6px 16px", borderRadius: 7, background: GOLD, color: DARK, fontWeight: 600, textDecoration: "none" }}>{t.signupLink}</Link>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <div style={{ width: 240, flexShrink: 0, borderRight: "1px solid #E0E8EA", padding: "20px 16px", overflowY: "auto", background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: P, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>L</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1A2B2C" }}>Localoop Korea</p>
              <p style={{ fontSize: 11, color: "#4A6467" }}>{t.sidebarSub}</p>
            </div>
          </div>
          <p style={{ fontSize: 12, color: "#4A6467", lineHeight: 1.75, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #E0E8EA", whiteSpace: "pre-line" }}>
            <strong style={{ color: P }}>{t.sidebarTag}</strong>{"\n"}{t.sidebarDesc}
          </p>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{t.featuresLabel}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 16 }}>
            {t.features.map(({ icon, name, desc, active }) => (
              <div key={name} onClick={onModal}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, cursor: "pointer", background: active ? "#D4F4F6" : "transparent" }}
                onMouseOver={(e) => { if (!active) e.currentTarget.style.background = "#F5FAFA"; }}
                onMouseOut={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ width: 30, height: 30, borderRadius: 8, background: active ? P : "#D4F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{icon}</div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#1A2B2C" }}>{name}</p>
                  <p style={{ fontSize: 10, color: "#4A6467" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div onClick={onModal} style={{ background: P, borderRadius: 10, padding: "12px", textAlign: "center", cursor: "pointer" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{t.ctaMain}</p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>{t.ctaSub}</p>
          </div>
        </div>

        <div style={{ flex: 1, position: "relative" }}>
          <div style={{ position: "absolute", top: 12, left: 12, right: 12, zIndex: 10, display: "flex", gap: 8 }}>
            <div onClick={onModal} style={{ flex: 1, background: "#fff", borderRadius: 10, padding: "9px 14px", fontSize: 13, color: "#aaa", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "0.5px solid #E0E8EA" }}>
              🔍 {t.searchPc}
            </div>
            <div onClick={onModal} style={{ background: "#fff", borderRadius: 10, padding: "9px 14px", fontSize: 13, color: "#4A6467", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "0.5px solid #E0E8EA", whiteSpace: "nowrap" }}>
              ⚙️ {t.filter}
            </div>
          </div>

          <KakaoMap pins={PINS} center={ITAEWON} zoom={4} onPinClick={onPin} />

          <div style={{ position: "absolute", bottom: 12, left: 12, background: "#fff", borderRadius: 10, padding: "10px 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", fontSize: 11 }}>
            <p style={{ fontWeight: 700, color: "#1A2B2C", marginBottom: 6 }}>{t.legendTitle}</p>
            {[[P, t.legendS], ["#4A6467", t.legendB], [GOLD, t.legendMeet]].map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: c, flexShrink: 0 }} />
                <span style={{ color: "#4A6467" }}>{l}</span>
              </div>
            ))}
          </div>

          <div onClick={onModal} style={{ position: "absolute", bottom: 12, right: 12, width: 210, background: "#fff", borderRadius: 12, padding: "12px", cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.12)" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#D4F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>📍</div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#1A2B2C" }}>{selected.name_en}</p>
                <p style={{ fontSize: 10, color: "#4A6467" }}>{selected.address ?? selected.name_ko}</p>
              </div>
            </div>
            <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 6, background: "#D4F4F6", color: "#17A0A0", fontWeight: 600 }}>
              {selected.english_support ? t.badgeEn : t.badgeKo}
            </span>
            <button style={{ width: "100%", marginTop: 8, padding: "7px", borderRadius: 7, background: P, color: "#fff", fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer" }}>
              {t.popupBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
