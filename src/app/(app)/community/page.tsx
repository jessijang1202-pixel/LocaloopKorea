"use client";

import { useState } from "react";
import { useLang } from "@/lib/lang";

const CAT_CHIPS = {
  ko: ["전체", "질문", "팁", "모임", "이태원"],
  en: ["All", "Q&A", "Tips", "Meetup", "Itaewon"],
};

const CAT_COLOR: Record<string, { bg: string; fg: string }> = {
  "질문": { bg: "var(--badge-card-bg)", fg: "var(--badge-card-fg)" },
  "Q&A":  { bg: "var(--badge-card-bg)", fg: "var(--badge-card-fg)" },
  "팁":   { bg: "var(--badge-en-bg)",   fg: "var(--badge-en-fg)" },
  "Tips": { bg: "var(--badge-en-bg)",   fg: "var(--badge-en-fg)" },
  "모임": { bg: "var(--badge-res-bg)",  fg: "var(--badge-res-fg)" },
  "Meetup":{ bg: "var(--badge-res-bg)", fg: "var(--badge-res-fg)" },
};

const POSTS = [
  {
    id: "p1",
    avatar: { initial: "S", color: "#FF5636" },
    name: "Sarah",
    nat: "US",
    timestamp: { ko: "12분 전", en: "12m ago" },
    cat: { ko: "질문", en: "Q&A" },
    title: { ko: "이태원에서 영어 되는 치과 있나요?", en: "English-speaking dentist near Itaewon?" },
    body: { ko: "갑자기 치통이 생겼는데 영어 가능한 치과를 못 찾겠어요...", en: "Sudden toothache — can't find an English-friendly dentist nearby..." },
    likes: 8, comments: 12, resolved: true, attendance: null,
  },
  {
    id: "p2",
    avatar: { initial: "민", color: "#12BFB6" },
    name: "민준",
    nat: "KR",
    timestamp: { ko: "1시간 전", en: "1h ago" },
    cat: { ko: "팁", en: "Tips" },
    title: { ko: "신한 쏠 앱으로 외국인도 계좌 개설 가능!", en: "Foreigners can now open Shinhan account via SOL app!" },
    body: { ko: "ARC 없이도 여권만으로 가능해요. 영어 지원됩니다.", en: "Works with passport only, no ARC required. English UI supported." },
    likes: 34, comments: 7, resolved: false, attendance: null,
  },
  {
    id: "p3",
    avatar: { initial: "Y", color: "#7B4DFF" },
    name: "Yuki",
    nat: "JP",
    timestamp: { ko: "3시간 전", en: "3h ago" },
    cat: { ko: "모임", en: "Meetup" },
    title: { ko: "이태원 언어 교환 같이 가요!", en: "Language Exchange Meetup — join us!" },
    body: { ko: "매주 화요일 오후 2시 이태원 카페에서 만나요.", en: "Every Tuesday 2pm at a café in Itaewon." },
    likes: 15, comments: 23, resolved: false, attendance: { current: 6, max: 10 },
  },
  {
    id: "p4",
    avatar: { initial: "A", color: "#FFC93C" },
    name: "Alex",
    nat: "GB",
    timestamp: { ko: "어제", en: "Yesterday" },
    cat: { ko: "팁", en: "Tips" },
    title: { ko: "지하철 앱 추천 — 카카오맵 vs 네이버지도", en: "Best subway app — KakaoMap vs Naver Maps" },
    body: { ko: "둘 다 써봤는데 영어 사용자에겐 카카오가 더 편해요.", en: "Tested both — KakaoMap is better for English speakers." },
    likes: 21, comments: 5, resolved: false, attendance: null,
  },
  {
    id: "p5",
    avatar: { initial: "L", color: "#12A05A" },
    name: "Léa",
    nat: "FR",
    timestamp: { ko: "2일 전", en: "2d ago" },
    cat: { ko: "질문", en: "Q&A" },
    title: { ko: "외국인등록증 나오는데 얼마나 걸리나요?", en: "How long does the ARC take to arrive?" },
    body: { ko: "3주째 기다리고 있는데 보통 어느 정도 걸리나요?", en: "Been waiting 3 weeks — what's a typical timeline?" },
    likes: 4, comments: 9, resolved: true, attendance: null,
  },
];

export default function CommunityPage() {
  const isKo = useLang();
  const [activeChip, setActiveChip] = useState(0);
  const chips = isKo ? CAT_CHIPS.ko : CAT_CHIPS.en;

  const filtered = activeChip === 0
    ? POSTS
    : POSTS.filter((p) => {
        const cat = isKo ? p.cat.ko : p.cat.en;
        return cat === chips[activeChip];
      });

  return (
    <div style={{ background: "var(--background)", minHeight: "100%", position: "relative", paddingBottom: 20 }}>

      {/* ── Category chips ────────────────────── */}
      <div style={{ padding: "12px 16px 8px", display: "flex", gap: 7, overflowX: "auto" }}>
        {chips.map((chip, i) => {
          const active = activeChip === i;
          return (
            <button key={chip} onClick={() => setActiveChip(i)} style={{
              flexShrink: 0, fontSize: 12, fontWeight: active ? 700 : 500,
              padding: "6px 15px", borderRadius: 999,
              background: active ? "var(--grade-s)" : "var(--card)",
              color: active ? "#fff" : "var(--foreground-muted)",
              border: active ? "none" : "1px solid var(--border)",
              cursor: "pointer",
            }}>
              {chip}
            </button>
          );
        })}
      </div>

      {/* ── Post feed ─────────────────────────── */}
      <div style={{ padding: "4px 16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((post) => {
          const cat = isKo ? post.cat.ko : post.cat.en;
          const catColor = CAT_COLOR[cat] ?? { bg: "var(--nat-bg)", fg: "var(--nat-fg)" };
          return (
            <div key={post.id} style={{
              background: "var(--card)",
              borderRadius: 16, border: "1px solid var(--border)",
              padding: "14px 14px 12px",
              cursor: "pointer",
            }}>
              {/* Header row */}
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  background: post.avatar.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 800, color: "#fff",
                }}>
                  {post.avatar.initial}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>{post.name}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 999, background: "var(--nat-bg)", color: "var(--nat-fg)" }}>
                      {post.nat}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--foreground-muted)" }}>
                      {isKo ? post.timestamp.ko : post.timestamp.en}
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: catColor.bg, color: catColor.fg, flexShrink: 0 }}>
                  {cat}
                </span>
              </div>

              {/* Title */}
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", marginBottom: 5, lineHeight: 1.35 }}>
                {isKo ? post.title.ko : post.title.en}
              </div>

              {/* Body preview */}
              <div style={{ fontSize: 12, color: "var(--foreground-muted)", lineHeight: 1.5, marginBottom: 11, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                {isKo ? post.body.ko : post.body.en}
              </div>

              {/* Footer */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l8.84 8.84 8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  <span style={{ fontSize: 12, color: "var(--foreground-muted)" }}>{post.likes}</span>
                </button>
                <button style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <span style={{ fontSize: 12, color: "var(--foreground-muted)" }}>{post.comments}</span>
                </button>

                {/* Resolved / attendance indicators */}
                {post.resolved && (
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "var(--badge-en-bg)", color: "var(--badge-en-fg)", marginLeft: "auto" }}>
                    {isKo ? "해결됨" : "Resolved"}
                  </span>
                )}
                {post.attendance && !post.resolved && (
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "var(--badge-res-bg)", color: "var(--badge-res-fg)", marginLeft: "auto" }}>
                    {post.attendance.current}/{post.attendance.max} {isKo ? "참여" : "joined"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Floating action button ─────────────── */}
      <button style={{
        position: "fixed",
        bottom: "calc(76px + 20px)",
        right: 20,
        width: 56, height: 56, borderRadius: "50%",
        background: "var(--grade-s)", border: "none",
        cursor: "pointer", zIndex: 30,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 20px -4px rgba(255,86,54,0.55)",
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
      </button>
    </div>
  );
}
