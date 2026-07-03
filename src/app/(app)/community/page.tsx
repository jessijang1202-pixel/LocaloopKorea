"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLang } from "@/lib/lang";

// ── Types ──────────────────────────────────────────────────────────────────────

type Message = { id: string; from: "me" | "other"; text: string; translation: string };

// ── Community feed data ────────────────────────────────────────────────────────

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
  { id: "p1", avatar: { initial: "S", color: "#FF5636" }, name: "Sarah", nat: "US", timestamp: { ko: "12분 전", en: "12m ago" }, cat: { ko: "질문", en: "Q&A" }, title: { ko: "이태원에서 영어 되는 치과 있나요?", en: "English-speaking dentist near Itaewon?" }, body: { ko: "갑자기 치통이 생겼는데 영어 가능한 치과를 못 찾겠어요...", en: "Sudden toothache — can't find an English-friendly dentist nearby..." }, likes: 8, comments: 12, resolved: true, attendance: null },
  { id: "p2", avatar: { initial: "민", color: "#12BFB6" }, name: "민준", nat: "KR", timestamp: { ko: "1시간 전", en: "1h ago" }, cat: { ko: "팁", en: "Tips" }, title: { ko: "신한 쏠 앱으로 외국인도 계좌 개설 가능!", en: "Foreigners can now open Shinhan account via SOL app!" }, body: { ko: "ARC 없이도 여권만으로 가능해요. 영어 지원됩니다.", en: "Works with passport only, no ARC required. English UI supported." }, likes: 34, comments: 7, resolved: false, attendance: null },
  { id: "p3", avatar: { initial: "Y", color: "#7B4DFF" }, name: "Yuki", nat: "JP", timestamp: { ko: "3시간 전", en: "3h ago" }, cat: { ko: "모임", en: "Meetup" }, title: { ko: "이태원 언어 교환 같이 가요!", en: "Language Exchange Meetup — join us!" }, body: { ko: "매주 화요일 오후 2시 이태원 카페에서 만나요.", en: "Every Tuesday 2pm at a café in Itaewon." }, likes: 15, comments: 23, resolved: false, attendance: { current: 6, max: 10 } },
  { id: "p4", avatar: { initial: "A", color: "#FFC93C" }, name: "Alex", nat: "GB", timestamp: { ko: "어제", en: "Yesterday" }, cat: { ko: "팁", en: "Tips" }, title: { ko: "지하철 앱 추천 — 카카오맵 vs 네이버지도", en: "Best subway app — KakaoMap vs Naver Maps" }, body: { ko: "둘 다 써봤는데 영어 사용자에겐 카카오가 더 편해요.", en: "Tested both — KakaoMap is better for English speakers." }, likes: 21, comments: 5, resolved: false, attendance: null },
  { id: "p5", avatar: { initial: "L", color: "#12A05A" }, name: "Léa", nat: "FR", timestamp: { ko: "2일 전", en: "2d ago" }, cat: { ko: "질문", en: "Q&A" }, title: { ko: "외국인등록증 나오는데 얼마나 걸리나요?", en: "How long does the ARC take to arrive?" }, body: { ko: "3주째 기다리고 있는데 보통 어느 정도 걸리나요?", en: "Been waiting 3 weeks — what's a typical timeline?" }, likes: 4, comments: 9, resolved: true, attendance: null },
];

// ── Chat data ──────────────────────────────────────────────────────────────────

const CONVERSATIONS = [
  { id: "cv1", name: "민준", flag: "🇰🇷", color: "#FFC93C", initial: "민", lastMsg: { ko: "안녕하세요! 이태원에서 좋은 카페 추천해 주실 수 있나요?", en: "Hello! Can you recommend a good café in Itaewon?" }, time: "2m" },
  { id: "cv2", name: "Sarah", flag: "🇺🇸", color: "var(--grade-s)", initial: "S", lastMsg: { ko: "보드게임 모임 같이 가실 분?", en: "Anyone want to join the board game meetup?" }, time: "14m" },
  { id: "cv3", name: "Yuki", flag: "🇯🇵", color: "#FF7043", initial: "Y", lastMsg: { ko: "북촌 카페 같이 가요!", en: "Let's visit a Bukchon café together!" }, time: "1h" },
];

const MESSAGES_BY_CV: Record<string, Message[]> = {
  cv1: [
    { id: "1", from: "other", text: "안녕하세요! 이태원에서 좋은 카페 추천해 주실 수 있나요?", translation: "Hello! Can you recommend a good café in Itaewon?" },
    { id: "2", from: "me", text: "Of course! Anthracite is great — it's a converted factory with amazing coffee.", translation: "물론이죠! Anthracite가 정말 좋아요. 공장을 개조한 곳인데 커피가 훌륭해요." },
    { id: "3", from: "other", text: "감사합니다! 주소가 어떻게 되나요?", translation: "Thank you! What is the address?" },
  ],
  cv2: [
    { id: "1", from: "other", text: "보드게임 모임 같이 가실 분?", translation: "Anyone want to join the board game meetup?" },
    { id: "2", from: "me", text: "Yes! What time does it start?", translation: "네! 몇 시에 시작하나요?" },
    { id: "3", from: "other", text: "금요일 오후 7시에요 :)", translation: "Friday at 7pm :)" },
  ],
  cv3: [
    { id: "1", from: "other", text: "북촌 카페 같이 가요!", translation: "Let's visit a Bukchon café together!" },
    { id: "2", from: "me", text: "Sure! Saturday morning works for me.", translation: "좋아요! 토요일 아침이 좋아요." },
  ],
};

// ── Feed tab ───────────────────────────────────────────────────────────────────

function FeedTab({ isKo }: { isKo: boolean }) {
  const [activeChip, setActiveChip] = useState(0);
  const chips = isKo ? CAT_CHIPS.ko : CAT_CHIPS.en;

  const filtered = activeChip === 0
    ? POSTS
    : POSTS.filter((p) => (isKo ? p.cat.ko : p.cat.en) === chips[activeChip]);

  return (
    <div style={{ background: "var(--background)", minHeight: "100%", position: "relative", paddingBottom: 20 }}>
      {/* Category chips */}
      <div style={{ padding: "12px 16px 8px", display: "flex", gap: 7, overflowX: "auto", scrollbarWidth: "none" }}>
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

      {/* Post feed */}
      <div style={{ padding: "4px 16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((post) => {
          const cat = isKo ? post.cat.ko : post.cat.en;
          const catColor = CAT_COLOR[cat] ?? { bg: "var(--nat-bg)", fg: "var(--nat-fg)" };
          return (
            <div key={post.id} style={{ background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)", padding: "14px 14px 12px", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: post.avatar.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff" }}>
                  {post.avatar.initial}
                </div>
                <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>{post.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 999, background: "var(--nat-bg)", color: "var(--nat-fg)" }}>{post.nat}</span>
                  <span style={{ fontSize: 11, color: "var(--foreground-muted)" }}>{isKo ? post.timestamp.ko : post.timestamp.en}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: catColor.bg, color: catColor.fg, flexShrink: 0 }}>{cat}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", marginBottom: 5, lineHeight: 1.35 }}>
                {isKo ? post.title.ko : post.title.en}
              </div>
              <div style={{ fontSize: 12, color: "var(--foreground-muted)", lineHeight: 1.5, marginBottom: 11, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                {isKo ? post.body.ko : post.body.en}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l8.84 8.84 8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  <span style={{ fontSize: 12, color: "var(--foreground-muted)" }}>{post.likes}</span>
                </button>
                <button style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <span style={{ fontSize: 12, color: "var(--foreground-muted)" }}>{post.comments}</span>
                </button>
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

      {/* FAB */}
      <button style={{ position: "fixed", bottom: "calc(76px + 20px)", right: 20, width: 56, height: 56, borderRadius: "50%", background: "var(--grade-s)", border: "none", cursor: "pointer", zIndex: 30, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px -4px rgba(255,86,54,0.55)" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
      </button>
    </div>
  );
}

// ── Chat tab ───────────────────────────────────────────────────────────────────

function ChatTab({ isKo }: { isKo: boolean }) {
  const [activeCv, setActiveCv] = useState("cv1");
  const [messages, setMessages] = useState<Record<string, Message[]>>(MESSAGES_BY_CV);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const bottomRef = useRef<HTMLDivElement>(null);

  const T = {
    ko: { notice: "실시간 번역 중 · 한국어 ↔ 영어", inputPh: "메시지를 입력하세요...", chats: "채팅 목록", searchPh: "대화 검색...", noResults: "검색 결과가 없어요" },
    en: { notice: "Live translation · Korean ↔ English", inputPh: "Type a message...", chats: "Chats", searchPh: "Search conversations...", noResults: "No conversations found" },
  };
  const t = isKo ? T.ko : T.en;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeCv]);

  function sendMessage() {
    const text = input.trim();
    if (!text) return;
    const newMsg: Message = { id: Date.now().toString(), from: "me", text, translation: isKo ? `[Auto-translation: ${text}]` : `[${text}의 자동 번역]` };
    setMessages((prev) => ({ ...prev, [activeCv]: [...(prev[activeCv] ?? []), newMsg] }));
    setInput("");
  }

  const activeMessages = messages[activeCv] ?? [];
  const activePerson = CONVERSATIONS.find((c) => c.id === activeCv) ?? CONVERSATIONS[0];

  const filteredCvs = CONVERSATIONS.filter((cv) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const lastMsg = isKo ? cv.lastMsg.ko : cv.lastMsg.en;
    return cv.name.toLowerCase().includes(q) || lastMsg.toLowerCase().includes(q);
  });

  const cvList = (onSelect?: (id: string) => void) => (
    <>
      {filteredCvs.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 14px", color: "var(--foreground-muted)", fontSize: 13 }}>{t.noResults}</div>
      )}
      {filteredCvs.map((cv) => {
        const isActive = cv.id === activeCv;
        const lastMsg = isKo ? cv.lastMsg.ko : cv.lastMsg.en;
        return (
          <div key={cv.id} onClick={() => { setActiveCv(cv.id); onSelect?.(cv.id); }}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderBottom: "1px solid var(--border)", background: isActive ? "var(--card-selected)" : "transparent", cursor: "pointer", borderLeft: isActive ? "3px solid var(--grade-s)" : "3px solid transparent" }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: cv.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#fff", flexShrink: 0, position: "relative" }}>
              {cv.initial}
              <span style={{ position: "absolute", bottom: 0, right: 0, fontSize: 12, lineHeight: 1 }}>{cv.flag}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>{cv.name}</span>
                <span style={{ fontSize: 10, color: "var(--foreground-muted)" }}>{cv.time}</span>
              </div>
              <p style={{ fontSize: 11, color: "var(--foreground-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lastMsg}</p>
            </div>
          </div>
        );
      })}
      <div style={{ padding: "12px 14px" }}>
        <div style={{ textAlign: "center", padding: "16px 0", background: "var(--icon-bg)", borderRadius: 12, border: "1px dashed var(--border)" }}>
          <div style={{ fontSize: 11, color: "var(--foreground-muted)" }}>🔄 {isKo ? "AI 번역 ON" : "AI Translation ON"}</div>
        </div>
      </div>
    </>
  );

  const chatWindow = (showHeader = false, onBack?: () => void) => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {showHeader && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "var(--card)", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          {onBack && (
            <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--content-bg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, fontSize: 18, color: "var(--foreground)", lineHeight: 1 }}>‹</button>
          )}
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: activePerson.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "#fff" }}>{activePerson.initial}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--foreground)" }}>{activePerson.name} {activePerson.flag}</div>
            <div style={{ fontSize: 10, color: "var(--grade-s)", fontWeight: 600 }}>🔄 {isKo ? "AI 번역 ON" : "AI Translation ON"}</div>
          </div>
        </div>
      )}
      <div style={{ background: "rgba(255,86,54,0.06)", borderBottom: "1px solid rgba(255,86,54,0.18)", padding: "7px 16px", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <span style={{ fontSize: 13 }}>🔄</span>
        <span style={{ fontSize: 11, color: "var(--grade-s)", fontWeight: 600 }}>{t.notice}</span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "12px 16px", background: "var(--content-bg)" }}>
        {activeMessages.map((msg) => {
          const isMe = msg.from === "me";
          return (
            <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start", marginBottom: 16 }}>
              <div style={{ maxWidth: "75%", padding: "10px 12px", borderRadius: isMe ? "16px 4px 16px 16px" : "4px 16px 16px 16px", background: isMe ? "var(--grade-s)" : "var(--card)", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: isMe ? "none" : "1px solid var(--border)" }}>
                <p style={{ fontSize: 13, color: isMe ? "#fff" : "var(--foreground)", lineHeight: 1.5 }}>{msg.text}</p>
              </div>
              <div style={{ maxWidth: "75%", marginTop: 4, padding: "6px 10px", borderRadius: 8, background: isMe ? "rgba(255,86,54,0.08)" : "rgba(0,0,0,0.03)", border: isMe ? "1px solid rgba(255,86,54,0.2)" : "1px solid var(--border)" }}>
                <p style={{ fontSize: 10, color: "var(--foreground-muted)", lineHeight: 1.4 }}>🔄 {msg.translation}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div style={{ background: "var(--card)", borderTop: "1px solid var(--border)", padding: "10px 16px", display: "flex", gap: 8, flexShrink: 0, paddingBottom: "calc(10px + env(safe-area-inset-bottom))" }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder={t.inputPh} style={{ flex: 1, height: 40, padding: "0 14px", borderRadius: 20, border: "1.5px solid var(--border)", background: "var(--content-bg)", fontSize: 13, color: "var(--foreground)", outline: "none" }} />
        <button onClick={sendMessage} style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--grade-s)", border: "none", color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>➤</button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile: list */}
      <div className="ll-mobile-only" style={{ display: mobileView === "list" ? "flex" : "none", flexDirection: "column", height: "calc(100dvh - 56px - 50px)" }}>
        <div style={{ padding: "12px 14px 10px", background: "var(--card)", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "var(--foreground)", marginBottom: 10 }}>{t.chats}</div>
          <div style={{ background: "var(--content-bg)", borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 13 }}>🔍</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchPh} style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 12, color: "var(--foreground)" }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
          {cvList((id) => { setActiveCv(id); setMobileView("chat"); })}
        </div>
      </div>

      {/* Mobile: chat window */}
      <div className="ll-mobile-only" style={{ display: mobileView === "chat" ? "flex" : "none", flexDirection: "column", height: "calc(100dvh - 56px - 50px)" }}>
        {chatWindow(true, () => setMobileView("list"))}
      </div>

      {/* PC split */}
      <div className="ll-pc-only ll-split">
        <div className="ll-split-panel">
          <div className="ll-split-panel-sticky" style={{ padding: "12px 14px 10px" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--foreground)", marginBottom: 10 }}>{t.chats}</div>
            <div style={{ background: "var(--content-bg)", borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 13 }}>🔍</span>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchPh} style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 12, color: "var(--foreground)" }} />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>{cvList()}</div>
        </div>
        <div className="ll-split-main">{chatWindow(true)}</div>
      </div>
    </>
  );
}

// ── Page with tab switcher ─────────────────────────────────────────────────────

function CommunityInner() {
  const isKo = useLang();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tab, setTab] = useState<"feed" | "chat">(
    searchParams.get("tab") === "chat" ? "chat" : "feed"
  );

  function switchTab(t: "feed" | "chat") {
    setTab(t);
    router.replace(t === "chat" ? "/community?tab=chat" : "/community", { scroll: false });
  }

  const TABS = [
    { id: "feed" as const, ko: "피드", en: "Feed", icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    )},
    { id: "chat" as const, ko: "채팅", en: "Chat", icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    )},
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Tab switcher */}
      <div style={{ display: "flex", background: "var(--card)", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => switchTab(t.id)}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              height: 44, background: "none", border: "none", cursor: "pointer",
              borderBottom: tab === t.id ? "2.5px solid var(--grade-s)" : "2.5px solid transparent",
              color: tab === t.id ? "var(--grade-s)" : "var(--foreground-muted)",
              fontWeight: tab === t.id ? 700 : 500,
              fontSize: 13,
              transition: "color 0.15s",
            }}
          >
            {t.icon}
            {isKo ? t.ko : t.en}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {tab === "feed" ? <FeedTab isKo={isKo} /> : <ChatTab isKo={isKo} />}
      </div>
    </div>
  );
}

export default function CommunityPage() {
  return (
    <Suspense>
      <CommunityInner />
    </Suspense>
  );
}
