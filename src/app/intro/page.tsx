"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useLang } from "@/lib/lang";
import { LangToggleInline } from "@/components/LangToggle";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Highlight = "place" | "task" | "course" | "people" | "culture";

// ─── Mobile slides ─────────────────────────────────────────────────────────────
type MobSlide = { icon: string; img: string; tag: string; lines: string[]; hi: number; desc: string; bg: string; ac: string; chatPreview?: boolean; culturePreview?: boolean };
const MOB_KO: MobSlide[] = [
  { icon: "🗺️", img: "/onboarding_welcome.png", tag: "Localoop Korea", lines: ["어서와!", "한국에 온걸 환영해"], hi: 1, desc: "언어 장벽, 낯선 동네, 새로운 일상.\n이제 AI가 당신의 한국 생활을\n단계별로 안내해드려요.", bg: "#0B1E2D", ac: "#15b6c1" },
  { icon: "📍", img: "/onboarding_places.png", tag: "기능 01", lines: ["내 주변", "외국인 친화 장소 찾기"], hi: 1, desc: "S~C 외국인 친화도 등급을 지도에서 바로 확인.\n영어 메뉴, 카드 결제 여부도 한눈에!", bg: "#0a2233", ac: "#15b6c1" },
  { icon: "📋", img: "/onboarding_tasks.png", tag: "기능 02", lines: ["지금 뭘 해야 하는지", "AI가 알려줘"], hi: 1, desc: "도착 첫날부터 장기 정착까지.\n체류 단계에 맞게 \"지금 해야 할 일\"을\n자동으로 안내해드려요.", bg: "#0B1E2D", ac: "#ffd600" },
  { icon: "🏃", img: "/onboarding_courses.png", tag: "기능 03", lines: ["현지인만 아는", "로컬 코스 추천"], hi: 1, desc: "관광지 말고 진짜 한국.\n내 언어 수준·취향에 맞는 반나절 로컬 코스를\nAI가 자동으로 짜드려요.", bg: "#0a2233", ac: "#15b6c1" },
  { icon: "🤝", img: "/onboarding_connect.png", tag: "기능 04", lines: ["외국인·한국인", "진짜 친구 만들기"], hi: 1, desc: "언어 교환, 취미 모임, 동네 파티.\n실시간 번역 채팅으로\n언어 장벽 없이 자연스럽게 연결돼요.", bg: "#0B1E2D", ac: "#ffd600" },
  { icon: "💬", img: "/onboarding_chat.png", tag: "기능 05", lines: ["실시간 번역 채팅으로", "언어 장벽 없애기"], hi: 1, desc: "한국어를 몰라도 괜찮아요.\n메시지를 보내면 AI가 즉시 번역해\n상대방에게 전달해드려요.\n자연스러운 대화, 진짜 연결.", bg: "#08151E", ac: "#15b6c1" },
  { icon: "🤝", img: "/onboarding_culture.png", tag: "기능 06", lines: ["한국 문화 & 에티켓", "미리 알면 더 편해요"], hi: 0, desc: "식당, 교통, 일상 속 한국 문화 예절.\n모르면 당황할 수 있는 순간을\n에티켓 가이드로 미리 준비하세요.", bg: "#0a1f30", ac: "#15b6c1", culturePreview: true },
];
const MOB_EN: MobSlide[] = [
  { icon: "🗺️", img: "/onboarding_welcome.png", tag: "Localoop Korea", lines: ["Welcome to Korea!", "Your new life starts here"], hi: 0, desc: "New city. New language. New life.\nLet AI guide your Korea journey\nstep by step.", bg: "#0B1E2D", ac: "#15b6c1" },
  { icon: "📍", img: "/onboarding_places.png", tag: "Feature 01", lines: ["Find foreigner-friendly", "places near you"], hi: 1, desc: "See S~C friendliness ratings directly on the map.\nEnglish menu, card payment — all at a glance.", bg: "#0a2233", ac: "#15b6c1" },
  { icon: "📋", img: "/onboarding_tasks.png", tag: "Feature 02", lines: ["AI tells you exactly", "what to do right now"], hi: 1, desc: "From day one to long-term settlement.\nBased on your visa stage, we automatically\nguide you through your next steps.", bg: "#0B1E2D", ac: "#ffd600" },
  { icon: "🏃", img: "/onboarding_courses.png", tag: "Feature 03", lines: ["Local courses only", "insiders know about"], hi: 1, desc: "Skip the tourist traps.\nAI builds a half-day local course matched\nto your language level and interests.", bg: "#0a2233", ac: "#15b6c1" },
  { icon: "🤝", img: "/onboarding_connect.png", tag: "Feature 04", lines: ["Make real friends —", "locals & expats alike"], hi: 1, desc: "Language exchange, hobby meetups, hangouts.\nReal-time chat translation breaks every barrier.", bg: "#0B1E2D", ac: "#ffd600" },
  { icon: "💬", img: "/onboarding_chat.png", tag: "Feature 05", lines: ["Real-time translation chat —", "no language barrier"], hi: 1, desc: "Don't know Korean? No problem.\nSend a message and AI instantly translates it\nfor the other person.\nNatural conversations, real connections.", bg: "#08151E", ac: "#15b6c1" },
  { icon: "🤝", img: "/onboarding_culture.png", tag: "Feature 06", lines: ["Korean Culture &", "Etiquette Guide"], hi: 0, desc: "Dining, transit, and everyday social customs.\nKnow what's polite before your\nfirst awkward moment in Korea.", bg: "#0a1f30", ac: "#15b6c1", culturePreview: true },
];

// ─── PC slides ─────────────────────────────────────────────────────────────────
type PCSlide = { icon: string; img: string; tag: string; title: string[]; hi: number; desc: string; highlight: Highlight; cta?: string; next?: string; login?: string; };

const PC_KO: PCSlide[] = [
  { icon: "🗺️", img: "/onboarding_welcome.png", tag: "Localoop Korea", title: ["Real Korea", "starts here"], hi: 0, desc: "언어 장벽, 낯선 동네, 새로운 일상.\nAI가 당신의 체류 목적과 언어 수준을 읽고\n지금 가장 필요한 것을 자동으로 안내합니다.\n\n오른쪽 지도에서 이태원 주변\n외국인 친화 장소를 미리 확인해보세요.", highlight: "place", cta: "시작하기", login: "이미 계정이 있어요" },
  { icon: "📍", img: "/onboarding_places.png", tag: "기능 01", title: ["외국인 친화 장소를", "S~C 등급으로 확인"], hi: 1, desc: "지도 위 모든 장소에 외국인 친화도 등급이 표시됩니다.\n\nS = 영어 응대, 카드 결제 OK, 외국인 환영\nC = 이용 어려울 수 있음\n\nAI가 웹 데이터를 자동 분석해 매일 업데이트합니다.", highlight: "place", next: "다음" },
  { icon: "📋", img: "/onboarding_tasks.png", tag: "기능 02 · 03", title: ["지금 해야 할 일을", "AI가 알려줘"], hi: 1, desc: "도착 첫날부터 장기 정착까지.\n외국인 등록증 신청, 은행 계좌 개설, 건강보험 가입 등\n체류 단계에 맞는 과제를 자동으로 안내합니다.\n\n오른쪽에서 진행 중인 과제 목록을 확인해보세요.", highlight: "task", next: "다음" },
  { icon: "🏃", img: "/onboarding_courses.png", tag: "기능 04", title: ["현지인만 아는", "로컬 코스 추천"], hi: 1, desc: "관광지 말고 진짜 한국.\n한국인 방문 데이터를 분석해 외국인이 편하게\n이용할 수 있는 로컬 맛집·카페·문화 장소를\n코스로 자동 조합합니다.\n\n오른쪽에서 AI 추천 코스를 미리보세요.", highlight: "course", next: "다음" },
  { icon: "🤝", img: "/onboarding_connect.png", tag: "기능 04 · 05", title: ["외국인·한국인", "진짜 연결"], hi: 1, desc: "언어 교환, 취미 모임, 동네 파방.\n관심사와 거주 지역 기반으로 교류 상대를 자동 추천합니다.\n\n오른쪽에서 주변 연결 추천을 확인해보세요.", highlight: "people", next: "다음" },
  { icon: "💬", img: "/onboarding_chat.png", tag: "기능 05", title: ["실시간 번역 채팅으로", "언어 장벽 없는 소통"], hi: 1, desc: "한국어를 몰라도 괜찮아요.\n메시지를 보내면 AI가 즉시 번역해 상대방에게 전달해드립니다.\n실시간 번역 채팅으로 자연스럽게 대화해보세요.", highlight: "people", next: "다음" },
  { icon: "🤝", img: "/onboarding_culture.png", tag: "기능 06", title: ["한국 문화 & 에티켓", "미리 알면 더 편해요"], hi: 0, desc: "절, 식사 예절, 대중교통 매너, 일상 속 사회 문화까지.\n모르면 당황할 수 있는 순간들을\n에티켓 가이드로 미리 준비하고\n한국 생활을 더 즐겁게 시작하세요.", highlight: "culture", cta: "무료로 시작하기", login: "이미 계정이 있어요" },
];
const PC_EN: PCSlide[] = [
  { icon: "🗺️", img: "/onboarding_welcome.png", tag: "Localoop Korea", title: ["Real Korea", "starts here"], hi: 0, desc: "New city. New language. New life.\nAI reads your stay purpose and language level\nto guide you through what you need most.\n\nPreview foreigner-friendly spots near Itaewon\non the map to your right.", highlight: "place", cta: "Get started", login: "I already have an account" },
  { icon: "📍", img: "/onboarding_places.png", tag: "Feature 01", title: ["Find foreigner-friendly", "places — S~C rated"], hi: 1, desc: "Every place on the map shows a friendliness rating.\n\nS = English OK, card payment, foreigner-welcome\nC = May be difficult to use\n\nAI auto-analyzes web data and updates daily.", highlight: "place", next: "Next" },
  { icon: "📋", img: "/onboarding_tasks.png", tag: "Feature 02 · 03", title: ["AI tells you exactly", "what to do right now"], hi: 1, desc: "From day one to long-term settlement.\nForeigner registration, bank account setup,\nhealth insurance — all guided automatically\nbased on your visa stage.\n\nPreview your task list on the right.", highlight: "task", next: "Next" },
  { icon: "🏃", img: "/onboarding_courses.png", tag: "Feature 04", title: ["Local courses only", "insiders know about"], hi: 1, desc: "Skip the tourist traps.\nAI analyzes where locals actually go and auto-builds\nhalf-day courses with foreigner-friendly spots.\n\nPreview an AI course on the right.", highlight: "course", next: "Next" },
  { icon: "🤝", img: "/onboarding_connect.png", tag: "Features 04 · 05", title: ["Connect with locals", "and expats alike"], hi: 1, desc: "Language exchange, hobby meetups, neighborhood hangouts.\nAI auto-matches you based on interests and location.", highlight: "people", next: "Next" },
  { icon: "💬", img: "/onboarding_chat.png", tag: "Feature 05", title: ["Real-time translation chat —", "no language barrier"], hi: 1, desc: "Don't know Korean? No problem.\nSend a message and AI instantly translates it for the other person.\nNatural conversations, real connections.", highlight: "people", next: "Next" },
  { icon: "🤝", img: "/onboarding_culture.png", tag: "Feature 06", title: ["Korean Culture &", "Etiquette Guide"], hi: 0, desc: "Bowing, dining manners, transit etiquette,\nand everyday social customs — explained simply.\nPrep with our guide so every interaction\nin Korea feels natural.", highlight: "culture", cta: "Start for free", login: "I already have an account" },
];

// ─── Map preview (right panel) ─────────────────────────────────────────────────

function MapPreview({ highlight, isKo }: { highlight: Highlight; isKo: boolean }) {
  const pins = [
    { top: "15%", left: "13%", label: isKo ? "S · 버거바" : "S · Burger Bar", active: true, yellow: false },
    { top: "19%", left: "42%", label: isKo ? "A · 이태원카페" : "A · Itaewon Café", active: false, yellow: false },
    { top: "22%", left: "64%", label: isKo ? "A · 루프탑바" : "A · Rooftop Bar", active: false, yellow: false },
    { top: "41%", left: "21%", label: isKo ? "언어교환 12명" : "Lang Exchange 12", active: false, yellow: true },
    { top: "33%", left: "50%", label: isKo ? "취미모임 6명" : "Hobby Meetup 6", active: false, yellow: true },
    { top: "57%", left: "54%", label: isKo ? "B · 한식당" : "B · Korean Rest.", active: false, yellow: false },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, background: "#E8F4F8", overflow: "hidden" }}>
      {/* Grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(21,182,193,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(21,182,193,0.1) 1px,transparent 1px)", backgroundSize: "30px 30px" }} />
      {/* Roads horizontal */}
      <div style={{ position: "absolute", top: "31%", left: 0, right: 0, height: 9, background: "rgba(255,255,255,0.85)" }} />
      <div style={{ position: "absolute", top: "53%", left: 0, right: 0, height: 7, background: "rgba(255,255,255,0.85)" }} />
      <div style={{ position: "absolute", top: "71%", left: 0, right: 0, height: 5, background: "rgba(255,255,255,0.75)" }} />
      {/* Roads vertical */}
      <div style={{ position: "absolute", left: "19%", top: 0, bottom: 0, width: 9, background: "rgba(255,255,255,0.85)" }} />
      <div style={{ position: "absolute", left: "44%", top: 0, bottom: 0, width: 7, background: "rgba(255,255,255,0.85)" }} />
      <div style={{ position: "absolute", left: "67%", top: 0, bottom: 0, width: 5, background: "rgba(255,255,255,0.75)" }} />
      {/* Labels */}
      <div style={{ position: "absolute", top: "13%", left: "28%", background: "rgba(255,255,255,0.92)", borderRadius: 4, padding: "2px 7px", fontSize: 10, fontWeight: 600, color: "#0B7A82" }}>{isKo ? "이태원 (Itaewon)" : "Itaewon"}</div>
      <div style={{ position: "absolute", top: "56%", left: "50%", background: "rgba(255,255,255,0.92)", borderRadius: 4, padding: "2px 7px", fontSize: 10, fontWeight: 600, color: "#0B7A82" }}>{isKo ? "한남 (Hannam)" : "Hannam"}</div>
      {/* User dot */}
      <div style={{ position: "absolute", top: "38%", left: "39%", width: 14, height: 14, borderRadius: "50%", background: "#15b6c1", border: "3px solid #fff", boxShadow: "0 0 0 4px rgba(21,182,193,0.25)" }} />
      {/* Pins */}
      {pins.map((p, i) => (
        <div key={i} style={{ position: "absolute", top: p.top, left: p.left, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ background: p.active ? "#15b6c1" : p.yellow ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.95)", color: p.active ? "#fff" : "#0B1E2D", border: p.yellow ? "1.5px solid #ffd600" : p.active ? "none" : "1.5px solid #15b6c1", fontSize: 9, fontWeight: 600, padding: "3px 7px", borderRadius: 5, whiteSpace: "nowrap" }}>{p.label}</div>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: p.yellow ? "#ffd600" : "#15b6c1", marginTop: 2 }} />
        </div>
      ))}
      {/* Welcome banner */}
      <div style={{ position: "absolute", top: 12, left: 12, right: 12, background: "#0B1E2D", borderRadius: 9, padding: "9px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#ffd600" }}>Real Korea starts here</div>
          <div style={{ fontSize: 10, color: "#8BB8C0", marginTop: 1 }}>{isKo ? "이태원 주변 외국인 친화 장소" : "Foreigner-friendly spots near Itaewon"}</div>
        </div>
        <span style={{ fontSize: 16 }}>📍</span>
      </div>
      {/* Search bar */}
      <div style={{ position: "absolute", top: 64, left: 12, right: 12, background: "#fff", borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 7, border: "1px solid #E0E8EA" }}>
        <span style={{ fontSize: 11, color: "#aaa" }}>🔍</span>
        <span style={{ fontSize: 11, color: "#aaa" }}>{isKo ? "이태원 주변 장소 검색..." : "Search places near Itaewon..."}</span>
      </div>

      {/* ── Highlight: place card ── */}
      {highlight === "place" && (
        <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, background: "#fff", borderRadius: 10, border: "1px solid #E0E8EA", padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <div style={{ width: 38, height: 38, borderRadius: 9, background: "#D4F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🍔</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#1A2B2C" }}>{isKo ? "이태원 버거바" : "Itaewon Burger Bar"}</div>
            <div style={{ fontSize: 10, color: "#4A6467", marginTop: 1 }}>{isKo ? "이태원 · 도보 2분" : "Itaewon · 2 min walk"}</div>
            <div style={{ fontSize: 9, background: "#D4F4F6", color: "#0B7A82", fontWeight: 600, padding: "1px 6px", borderRadius: 4, display: "inline-block", marginTop: 3 }}>S {isKo ? "· 영어 응대 가능" : "· English OK"}</div>
          </div>
          <button style={{ padding: "5px 10px", borderRadius: 6, background: "#15b6c1", color: "#fff", fontSize: 10, fontWeight: 600, border: "none", cursor: "pointer", flexShrink: 0 }}>{isKo ? "자세히" : "View"}</button>
        </div>
      )}

      {/* ── Highlight: task ── */}
      {highlight === "task" && (
        <div style={{ position: "absolute", top: 115, left: 12, background: "#fff", borderRadius: 9, border: "1px solid #E0E8EA", padding: "10px 12px", width: 200, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#1A2B2C", marginBottom: 7 }}>{isKo ? "지금 해야 할 일" : "What to do now"}</div>
          {[
            { done: true, text: isKo ? "교통카드 구매" : "Get transit card" },
            { done: true, text: isKo ? "유심 개통" : "Set up SIM card" },
            { done: false, urgent: true, text: isKo ? "외국인 등록증 신청 D-23" : "Foreigner registration D-23" },
            { done: false, urgent: false, text: isKo ? "은행 계좌 개설" : "Open bank account" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5, ...(item.urgent ? { border: "1px solid #15b6c1", borderRadius: 6, padding: "3px 6px" } : {}) }}>
              <div style={{ width: 15, height: 15, borderRadius: "50%", flexShrink: 0, background: item.done ? "#15b6c1" : "transparent", border: item.done ? "none" : `1.5px solid ${item.urgent ? "#15b6c1" : "#C0CDD0"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {item.done && <span style={{ fontSize: 8, color: "#fff", fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ fontSize: 10, color: item.done ? "#9BB5B8" : item.urgent ? "#0B7A82" : "#4A6467", textDecoration: item.done ? "line-through" : "none", fontWeight: item.urgent ? 600 : 400 }}>{item.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Highlight: course ── */}
      {highlight === "course" && (
        <div style={{ position: "absolute", top: 115, left: 12, background: "#fff", borderRadius: 9, border: "1px solid #E0E8EA", padding: "10px 12px", width: 215, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 9, fontWeight: 700, background: "#15b6c1", color: "#fff", padding: "2px 7px", borderRadius: 4, display: "inline-block", marginBottom: 6 }}>{isKo ? "AI 맞춤 코스" : "AI Course"}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#1A2B2C", marginBottom: 6 }}>{isKo ? "이태원 로컬 반나절 코스" : "Itaewon Local Half-Day"}</div>
          <div style={{ display: "flex", gap: 3, alignItems: "center", flexWrap: "wrap" }}>
            {(isKo ? ["버거바 S", "루프탑카페", "일요시장"] : ["Burger Bar S", "Rooftop Café", "Sunday Market"]).map((stop, i, arr) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: "#F5F9FA", color: "#4A6467", border: "0.5px solid #E0E8EA" }}>{stop}</span>
                {i < arr.length - 1 && <span style={{ fontSize: 9, color: "#C0CDD0" }}>→</span>}
              </span>
            ))}
          </div>
          <div style={{ fontSize: 9, color: "#9BB5B8", marginTop: 6 }}>{isKo ? "3시간 · 약 3만원 · 로컬성 92점" : "3 hrs · ~₩30,000 · Local score 92"}</div>
        </div>
      )}

      {/* ── Highlight: culture ── */}
      {highlight === "culture" && (
        <div style={{ position: "absolute", top: 115, left: 12, background: "#0B1E2D", borderRadius: 9, border: "1px solid rgba(21,182,193,0.25)", padding: "10px 12px", width: 210, boxShadow: "0 2px 12px rgba(0,0,0,0.18)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#15b6c1", marginBottom: 8 }}>🤝 {isKo ? "문화 & 에티켓 가이드" : "Culture & Etiquette"}</div>
          {[
            { ok: true, ko: "두 손으로 주고받기", en: "Use both hands when giving/receiving" },
            { ok: false, ko: "밥에 젓가락 꽂기 금지", en: "Never stick chopsticks in rice" },
            { ok: true, ko: "어른 먼저 드신 후 식사 시작", en: "Wait for elders to eat first" },
            { ok: false, ko: "지하철에서 음식 섭취 자제", en: "Don't eat on the subway" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: item.ok ? "#15b6c1" : "#FF6B6B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff", fontWeight: 800, flexShrink: 0 }}>
                {item.ok ? "✓" : "✕"}
              </div>
              <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.3 }}>{isKo ? item.ko : item.en}</span>
            </div>
          ))}
          <div style={{ marginTop: 8, padding: "5px 8px", background: "rgba(21,182,193,0.15)", borderRadius: 5, fontSize: 9, color: "#15b6c1", fontWeight: 600 }}>
            → {isKo ? "에티켓 가이드 전체 보기" : "View full etiquette guide"}
          </div>
        </div>
      )}

      {/* ── Highlight: people ── */}
      {highlight === "people" && (
        <div style={{ position: "absolute", top: 115, right: 12, background: "#fff", borderRadius: 9, border: "1px solid #E0E8EA", padding: "10px 12px", width: 175, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#1A2B2C", marginBottom: 8 }}>{isKo ? "주변 추천 연결" : "Nearby connections"}</div>
          {[
            { av: "S", avBg: "#D4F4F6", avC: "#0B7A82", name: "Sarah (미국)", sub: isKo ? "언어교환 · 이태원" : "Lang exchange · Itaewon" },
            { av: "민", avBg: "#FFF9CC", avC: "#7A6800", name: isKo ? "김민준 (한국)" : "Minjun K. (Korean)", sub: isKo ? "영어교환 · 한남" : "English exchange · Hannam" },
          ].map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: i === 0 ? 7 : 0 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: p.avBg, color: p.avC, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{p.av}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#1A2B2C" }}>{p.name}</div>
                <div style={{ fontSize: 9, color: "#4A6467" }}>{p.sub}</div>
              </div>
              <button style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: "#F5F9FA", color: "#15b6c1", border: "0.5px solid #15b6c1", cursor: "pointer", flexShrink: 0 }}>{isKo ? "연결" : "Connect"}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PC Done panel ─────────────────────────────────────────────────────────────

function PcDonePanel({ isKo, onGo }: { isKo: boolean; onGo: () => void }) {
  const stats = isKo
    ? [{ icon: "📍", text: "주변 S등급 장소 12곳" }, { icon: "📋", text: "지금 해야 할 과제 5개" }, { icon: "🏃", text: "AI 추천 로컬 코스 3개" }]
    : [{ icon: "📍", text: "12 S-rated places nearby" }, { icon: "📋", text: "5 tasks to complete now" }, { icon: "🏃", text: "3 AI-recommended courses" }];
  return (
    <div style={{ flex: 1, padding: "28px 22px 22px", display: "flex", flexDirection: "column" }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#D4F4F6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, fontSize: 22, color: "#15b6c1", fontWeight: 700 }}>✓</div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1A2B2C", marginBottom: 6, letterSpacing: "-0.01em" }}>{isKo ? "준비 완료!" : "You're all set!"}</h2>
      <p style={{ fontSize: 12, color: "#4A6467", marginBottom: 20, lineHeight: 1.6 }}>{isKo ? "이태원에서 Real Korea를 시작해보세요.\nAI가 맞춤 설정을 완료했어요." : "Start exploring Real Korea in Itaewon.\nAI has everything ready for you."}</p>
      {stats.map(({ icon, text }) => (
        <div key={text} style={{ background: "#F5F9FA", borderRadius: 8, border: "1px solid #E0E8EA", padding: "9px 12px", marginBottom: 7, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16 }}>{icon}</span>
          <span style={{ fontSize: 12, color: "#4A6467" }}>{text}</span>
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <button onClick={onGo} style={{ width: "100%", padding: 13, borderRadius: 10, background: "#ffd600", color: "#0B1E2D", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", marginTop: 18 }}>
        {isKo ? "지도 탐색 시작하기" : "Start exploring the map"}
      </button>
    </div>
  );
}

// ─── PC Slide panel ────────────────────────────────────────────────────────────

function PcSlidePanel({ s, idx, total, fading, onDot, onNext, onLogin, onSkip, isKo }: {
  s: PCSlide; idx: number; total: number; fading: boolean;
  onDot: (i: number) => void; onNext: () => void; onLogin: () => void; onSkip: () => void; isKo: boolean;
}) {
  const isLast = idx === total - 1;
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 22px 20px" }}>
      <div style={{ flex: 1, opacity: fading ? 0 : 1, transform: fading ? "translateY(8px)" : "translateY(0)", transition: "opacity 0.15s, transform 0.15s" }}>
        <div style={{ height: 120, width: "100%", position: "relative", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #E0E8EA" }}>
          <img
            src={s.img}
            alt={s.tag}
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", color: "#0B7A82", background: "#D4F4F6", padding: "3px 10px", borderRadius: 12, display: "inline-block", marginBottom: 12 }}>{s.tag}</div>
        <h2 style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.35, marginBottom: 12, letterSpacing: "-0.02em" }}>
          {s.title.map((line, i) => (
            <span key={i} style={{ display: "block", color: i === s.hi ? "#15b6c1" : "#1A2B2C" }}>{line}</span>
          ))}
        </h2>
        <p style={{ fontSize: 12, color: "#4A6467", lineHeight: 1.75, whiteSpace: "pre-line" }}>{s.desc}</p>
      </div>
      {/* Dots */}
      <div style={{ display: "flex", gap: 5, marginBottom: 14, justifyContent: "center" }}>
        {Array.from({ length: total }, (_, i) => (
          <button key={i} onClick={() => onDot(i)} style={{ height: 6, width: i === idx ? 20 : 6, borderRadius: 3, background: i === idx ? "#15b6c1" : "#E0E8EA", border: "none", cursor: "pointer", padding: 0, transition: "all 0.3s" }} />
        ))}
      </div>
      {/* CTA */}
      {s.cta && (
        <button onClick={onNext} style={{ width: "100%", padding: 11, borderRadius: 10, background: isLast ? "#ffd600" : "#15b6c1", color: isLast ? "#0B1E2D" : "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", marginBottom: 7 }}>
          {s.cta}
        </button>
      )}
      {s.next && (
        <button onClick={onNext} style={{ width: "100%", padding: 11, borderRadius: 10, background: "#15b6c1", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", marginBottom: 7 }}>
          {s.next}
        </button>
      )}
      {s.login && (
        <button onClick={onLogin} style={{ width: "100%", padding: 9, borderRadius: 10, background: "#F5F9FA", color: "#1A2B2C", fontSize: 12, border: "1px solid #E0E8EA", cursor: "pointer", marginBottom: 6 }}>
          {s.login}
        </button>
      )}
      {!isLast && (
        <button onClick={onSkip} style={{ width: "100%", padding: 8, borderRadius: 10, background: "transparent", color: "#B0C4C8", fontSize: 12, border: "none", cursor: "pointer" }}>
          {isKo ? "건너뛰기" : "Skip"}
        </button>
      )}
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function IntroPage() {
  const isKo = useLang();
  const [slide, setSlide] = useState(0);
  const [ready, setReady] = useState(false);
  const [isPC, setIsPC] = useState(false);
  const [pcDone, setPcDone] = useState(false);
  const [fading, setFading] = useState(false);
  // PWA install
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> } | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const router = useRouter();
  const touchX = useRef<number | null>(null);
  const touchY = useRef<number | null>(null);
  const mouseX = useRef<number | null>(null);

  useEffect(() => {
    const checkPC = () => setIsPC(window.innerWidth >= 900);
    window.addEventListener("resize", checkPC);

    setTimeout(() => {
      setIsPC(window.innerWidth >= 900);
      if (window.matchMedia("(display-mode: standalone)").matches) setIsInstalled(true);
      const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;
      setIsIOS(!!ios);
    }, 0);

    const onPrompt = (e: Event) => { e.preventDefault(); setDeferredPrompt(e as typeof deferredPrompt); };
    window.addEventListener("beforeinstallprompt", onPrompt);

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) { router.replace("/map"); return; }
      setReady(true);
    });
    return () => {
      window.removeEventListener("resize", checkPC);
      window.removeEventListener("beforeinstallprompt", onPrompt);
    };
  }, [router]);

  async function handleInstall() {
    if (isIOS) { setShowIOSHint(true); return; }
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
  }

  const showInstallBtn = !isInstalled && !isPC && (!!deferredPrompt || isIOS);

  function goTo(idx: number) {
    if (fading || idx === slide) return;
    setFading(true);
    setTimeout(() => { setSlide(idx); setFading(false); }, 160);
  }

  const pcSlides = isKo ? PC_KO : PC_EN;
  const mobSlides = isKo ? MOB_KO : MOB_EN;

  function handleNext() {
    if (isPC) {
      if (slide < pcSlides.length - 1) goTo(slide + 1);
      else setPcDone(true);
    } else {
      if (slide < mobSlides.length - 1) goTo(slide + 1);
      else router.push("/map");
    }
  }

  if (!ready) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0B1E2D" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid rgba(21,182,193,0.25)", borderTopColor: "#15b6c1", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // ── PC Layout ──────────────────────────────────────────────────────────────────
  if (isPC) {
    const s = pcSlides[slide];
    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "#fff", userSelect: "none" }}>
        {/* Header */}
        <div style={{ height: 50, background: "#0B1E2D", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#15b6c1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff" }}>L</div>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Localoop<span style={{ color: "#15b6c1" }}>Korea</span></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LangToggleInline />
            <Link href="/login" style={{ display: "inline-flex", alignItems: "center", padding: "5px 12px", borderRadius: 20, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.28)", color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>
              {isKo ? "로그인" : "Login"}
            </Link>
          </div>
        </div>
        {/* Body */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Left */}
          <div style={{ width: 300, flexShrink: 0, borderRight: "1px solid #E0E8EA", display: "flex", flexDirection: "column", background: "#fff" }}>
            {pcDone
              ? <PcDonePanel isKo={isKo} onGo={() => router.push("/map")} />
              : <PcSlidePanel s={s} idx={slide} total={pcSlides.length} fading={fading} onDot={goTo} onNext={handleNext} onLogin={() => router.push("/login")} onSkip={() => router.push("/map")} isKo={isKo} />
            }
          </div>
          {/* Right: map */}
          <div style={{ flex: 1, position: "relative" }}>
            <MapPreview highlight={pcDone ? "place" : s.highlight} isKo={isKo} />
          </div>
        </div>
      </div>
    );
  }

  // ── Mobile Layout ──────────────────────────────────────────────────────────────
  const ms = mobSlides[slide];
  const isLast = slide === mobSlides.length - 1;

  return (
    <div
      style={{ minHeight: "100dvh", display: "flex", alignItems: "stretch", justifyContent: "center", background: ms.bg, transition: "background 0.4s", cursor: "grab", userSelect: "none" }}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; touchY.current = e.touches[0].clientY; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        const dy = e.changedTouches[0].clientY - (touchY.current ?? 0);
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
          if (dx < 0 && !isLast) goTo(slide + 1);
          if (dx > 0 && slide > 0) goTo(slide - 1);
        }
        touchX.current = null;
      }}
      onMouseDown={(e) => { mouseX.current = e.clientX; }}
      onMouseUp={(e) => {
        if (mouseX.current === null) return;
        const dx = e.clientX - mouseX.current;
        if (Math.abs(dx) > 60) {
          if (dx < 0 && !isLast) goTo(slide + 1);
          if (dx > 0 && slide > 0) goTo(slide - 1);
        }
        mouseX.current = null;
      }}
    >
      <div style={{ width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", position: "relative" }}>

        {/* Install button — top center */}
        {showInstallBtn && (
          <button
            onClick={handleInstall}
            style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", zIndex: 20, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, color: "#fff", fontSize: 12, fontWeight: 500, padding: "6px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}
          >
            <span style={{ fontSize: 14 }}>📲</span>
            {isKo ? "바탕화면에 저장" : "Add to Home Screen"}
          </button>
        )}

        {/* Top bar: logo left, [lang toggle + skip] right */}
        <div style={{ position: "absolute", top: showInstallBtn ? 52 : 36, left: 16, right: 16, display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>Localoop<span style={{ color: ms.ac }}>Korea</span></span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <LangToggleInline />
            <Link href="/login" style={{ display: "inline-flex", alignItems: "center", padding: "5px 10px", borderRadius: 20, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.28)", color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>
              {isKo ? "로그인" : "Login"}
            </Link>
          </div>
        </div>

        {/* Slide content */}
        <div key={slide} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: `${showInstallBtn ? 88 : 72}px 40px 0`, textAlign: "center", opacity: fading ? 0 : 1, transform: fading ? "translateY(12px)" : "translateY(0)", transition: "opacity 0.16s, transform 0.16s" }}>
          <div style={{
            width: 280, height: 200,
            position: "relative", marginBottom: 28,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "#fff", borderRadius: 20, padding: 10,
            boxShadow: "0 10px 30px rgba(0,0,0,0.35)", overflow: "hidden",
          }}>
            {ms.culturePreview ? (
              /* Inline culture etiquette mockup */
              <div style={{ width: "100%", height: "100%", borderRadius: 12, background: "#0B1E2D", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <div style={{ background: "#15b6c1", padding: "8px 12px", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 14 }}>🤝</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>{isKo ? "문화 & 에티켓 가이드" : "Culture & Etiquette Guide"}</span>
                </div>
                <div style={{ flex: 1, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6, overflowY: "auto" }}>
                  {[
                    { ok: true, ko: "두 손으로 물건을 주고받으면 예의 바르게 보여요", en: "Use both hands when giving or receiving things" },
                    { ok: false, ko: "밥그릇에 젓가락을 꽂으면 절대 안 돼요", en: "Never stick chopsticks upright in rice" },
                    { ok: true, ko: "어른이 수저를 들기를 기다렸다가 식사 시작해요", en: "Wait for elders to pick up chopsticks first" },
                    { ok: false, ko: "지하철 안에서 음식을 먹으면 시선이 집중돼요", en: "Don't eat on the subway — it draws stares" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7, background: "rgba(255,255,255,0.06)", borderRadius: 7, padding: "7px 9px" }}>
                      <div style={{ width: 16, height: 16, borderRadius: "50%", background: item.ok ? "#15b6c1" : "#FF6B6B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 800, flexShrink: 0, marginTop: 1 }}>
                        {item.ok ? "✓" : "✕"}
                      </div>
                      <span style={{ fontSize: 9, color: "rgba(255,255,255,0.82)", lineHeight: 1.5 }}>{isKo ? item.ko : item.en}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : ms.chatPreview ? (
              /* Inline chat mockup for the translation chat slide */
              <div style={{ width: "100%", height: "100%", borderRadius: 12, background: "#F5F9FA", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <div style={{ background: "#0B1E2D", padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#15b6c1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>민</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>민준</div>
                    <div style={{ fontSize: 9, color: "#15b6c1" }}>🟢 {isKo ? "온라인" : "Online"}</div>
                  </div>
                  <span style={{ fontSize: 9, background: "rgba(21,182,193,0.2)", color: "#15b6c1", padding: "2px 7px", borderRadius: 10, fontWeight: 600 }}>AI 번역 ON</span>
                </div>
                <div style={{ flex: 1, padding: "8px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ alignSelf: "flex-start", maxWidth: "80%" }}>
                    <div style={{ background: "#fff", border: "1px solid #E0E8EA", borderRadius: "4px 12px 12px 12px", padding: "6px 9px" }}>
                      <div style={{ fontSize: 10, color: "#1A2B2C" }}>안녕하세요! 이태원 카페 추천해주실 수 있나요?</div>
                    </div>
                    <div style={{ background: "rgba(21,182,193,0.08)", border: "1px solid rgba(21,182,193,0.2)", borderRadius: 6, padding: "3px 8px", marginTop: 3 }}>
                      <div style={{ fontSize: 9, color: "#0B7A82" }}>🔄 Can you recommend a café in Itaewon?</div>
                    </div>
                  </div>
                  <div style={{ alignSelf: "flex-end", maxWidth: "80%" }}>
                    <div style={{ background: "#15b6c1", borderRadius: "12px 4px 12px 12px", padding: "6px 9px" }}>
                      <div style={{ fontSize: 10, color: "#fff" }}>Of course! Anthracite is amazing ☕</div>
                    </div>
                    <div style={{ background: "rgba(21,182,193,0.08)", border: "1px solid rgba(21,182,193,0.2)", borderRadius: 6, padding: "3px 8px", marginTop: 3 }}>
                      <div style={{ fontSize: 9, color: "#0B7A82" }}>🔄 물론이죠! Anthracite 정말 좋아요 ☕</div>
                    </div>
                  </div>
                </div>
                <div style={{ padding: "6px 8px", borderTop: "1px solid #E0E8EA", display: "flex", gap: 5, background: "#fff" }}>
                  <div style={{ flex: 1, background: "#F5F9FA", borderRadius: 14, padding: "5px 10px", fontSize: 9, color: "#9BB5B8" }}>{isKo ? "메시지 입력..." : "Type a message..."}</div>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#15b6c1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff" }}>➤</div>
                </div>
              </div>
            ) : (
              <img src={ms.img} alt={ms.tag} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }} />
            )}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: ms.ac === "#ffd600" ? "#0B1E2D" : "#0B7A82", background: ms.ac === "#ffd600" ? "#ffd600" : "#D4F4F6", padding: "4px 14px", borderRadius: 20, marginBottom: 20 }}>{ms.tag}</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.3, marginBottom: 18, letterSpacing: "-0.02em" }}>
            {ms.lines.map((line, i) => (
              <span key={i} style={{ display: "block", color: i === ms.hi ? ms.ac : "#fff" }}>{line}</span>
            ))}
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, whiteSpace: "pre-line", maxWidth: 320 }}>{ms.desc}</p>
        </div>
        {/* Footer */}
        <div style={{ padding: "32px 28px", paddingBottom: "calc(32px + env(safe-area-inset-bottom))", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 24 }}>
            {mobSlides.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} style={{ height: 6, width: i === slide ? 24 : 6, borderRadius: 3, background: i === slide ? ms.ac : "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.3s" }} />
            ))}
          </div>
          <button onClick={handleNext} style={{ width: "100%", padding: 17, borderRadius: 16, background: isLast ? "#ffd600" : ms.ac, color: isLast ? "#0B1E2D" : "#fff", fontSize: 16, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
            {isLast ? (isKo ? "지금 시작하기 →" : "Get started →") : (isKo ? "다음" : "Next")}
          </button>
          {!isLast && (
            <button onClick={() => router.push("/map")} style={{ width: "100%", padding: 13, marginTop: 10, borderRadius: 14, background: "transparent", color: "rgba(255,255,255,0.45)", fontSize: 14, fontWeight: 500, border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" }}>
              {isKo ? "건너뛰기" : "Skip"}
            </button>
          )}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>{isKo ? "이미 계정이 있으신가요? " : "Already have an account? "}</span>
            <button onClick={() => router.push("/login")} style={{ fontSize: 13, fontWeight: 600, color: ms.ac, background: "none", border: "none", cursor: "pointer", padding: 0 }}>{isKo ? "로그인" : "Log in"}</button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* iOS hint bottom sheet */}
      {showIOSHint && (
        <div
          onClick={() => setShowIOSHint(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#1A2B2C", borderRadius: "20px 20px 0 0", padding: "24px 24px calc(32px + env(safe-area-inset-bottom))" }}
          >
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)", margin: "0 auto 18px" }} />
            <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 10 }}>
              {isKo ? "홈 화면에 추가하는 방법" : "How to add to Home Screen"}
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, whiteSpace: "pre-line" }}>
              {isKo
                ? "1. Safari 하단의 공유 버튼 ↑ 을 탭하세요\n2. 스크롤 후 \"홈 화면에 추가\"를 탭하세요\n3. 오른쪽 상단 \"추가\"를 탭하면 완료!"
                : "1. Tap the Share button ↑ at the bottom of Safari\n2. Scroll down and tap \"Add to Home Screen\"\n3. Tap \"Add\" in the top right — done!"}
            </p>
            <button
              onClick={() => setShowIOSHint(false)}
              style={{ marginTop: 20, width: "100%", padding: 13, borderRadius: 12, background: "#15b6c1", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}
            >
              {isKo ? "확인" : "Got it"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
