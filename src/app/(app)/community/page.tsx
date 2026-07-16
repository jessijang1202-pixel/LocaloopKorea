"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLang } from "@/lib/lang";
import ChatPanel from "@/components/chat/ChatPanel";
import { CAT_CHIPS, CAT_COLOR, POSTS } from "@/content/community";

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
      <button style={{ position: "fixed", bottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)", right: 20, width: 56, height: 56, borderRadius: "50%", background: "var(--grade-s)", border: "none", cursor: "pointer", zIndex: 30, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px -4px rgba(255,86,54,0.55)" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
      </button>
    </div>
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
      {/* Page header */}
      <div style={{ padding: "16px 16px 6px", flexShrink: 0 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
          {isKo ? "커뮤니티" : "Community"}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--foreground-muted)", marginTop: 3 }}>
          {isKo ? "같은 고민을 하는 외국인과 한국인을 여기서 만나보세요." : "Meet foreigners and locals figuring out the same things you are."}
        </div>
      </div>

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
        {tab === "feed" ? <FeedTab isKo={isKo} /> : <ChatPanel variant="community" />}
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
