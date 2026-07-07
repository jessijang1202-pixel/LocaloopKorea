"use client";

import { useState, useEffect, useRef } from "react";
import { useLang } from "@/lib/lang";
import { getConversations, MESSAGES_BY_CV, T_STANDALONE, T_COMMUNITY, type Message } from "@/content/chat";

// Shared chat UI for the standalone chat page and the community chat tab.
// The `variant` prop switches every known difference between the two originals:
//
//   variant          "standalone" (/chat)          "community" (/community?tab=chat)
//   ─────────────────────────────────────────────────────────────────────────────
//   cv1 avatar color  #FFD600                        #FFC93C
//   clear-search ✕    shown                          hidden
//   muted CSS var     --muted-foreground             --foreground-muted
//   T dictionary      T_STANDALONE (has send/back)   T_COMMUNITY (no send/back)
//
// Every other rendered attribute is identical between the two variants.

export default function ChatPanel({ variant }: { variant: "standalone" | "community" }) {
  const isKo = useLang();

  const isStandalone = variant === "standalone";
  const cv1Color = isStandalone ? "#FFD600" : "#FFC93C";
  const mutedVar = isStandalone ? "var(--muted-foreground)" : "var(--foreground-muted)";
  const showClearButton = isStandalone;
  const T = isStandalone ? T_STANDALONE : T_COMMUNITY;

  const CONVERSATIONS = getConversations(cv1Color);

  const [activeCv, setActiveCv] = useState("cv1");
  const [messages, setMessages] = useState<Record<string, Message[]>>(MESSAGES_BY_CV);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const bottomRef = useRef<HTMLDivElement>(null);
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

  const filteredConversations = CONVERSATIONS.filter((cv) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const lastMsg = isKo ? cv.lastMsg.ko : cv.lastMsg.en;
    return cv.name.toLowerCase().includes(q) || lastMsg.toLowerCase().includes(q);
  });

  const searchInput = (
    <div style={{ background: "var(--content-bg)", borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 7 }}>
      <span style={{ fontSize: 13 }}>🔍</span>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t.searchPh}
        style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 12, color: "var(--foreground)" }}
      />
      {showClearButton && search && (
        <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: mutedVar, cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1 }}>✕</button>
      )}
    </div>
  );

  const cvList = (onSelect?: (id: string) => void) => (
    <>
      {filteredConversations.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 14px", color: mutedVar, fontSize: 13 }}>{t.noResults}</div>
      )}
      {filteredConversations.map((cv) => {
        const isActive = cv.id === activeCv;
        const lastMsg = isKo ? cv.lastMsg.ko : cv.lastMsg.en;
        return (
          <div
            key={cv.id}
            onClick={() => { setActiveCv(cv.id); onSelect?.(cv.id); }}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderBottom: "1px solid var(--border)", background: isActive ? "var(--card-selected)" : "transparent", cursor: "pointer", borderLeft: isActive ? "3px solid var(--grade-s)" : "3px solid transparent" }}
          >
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: cv.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#fff", flexShrink: 0, position: "relative" }}>
              {cv.initial}
              <span style={{ position: "absolute", bottom: 0, right: 0, fontSize: 12, lineHeight: 1 }}>{cv.flag}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>{cv.name}</span>
                <span style={{ fontSize: 10, color: mutedVar }}>{cv.time}</span>
              </div>
              <p style={{ fontSize: 11, color: mutedVar, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lastMsg}</p>
            </div>
          </div>
        );
      })}
      <div style={{ padding: "12px 14px" }}>
        <div style={{ textAlign: "center", padding: "16px 0", background: "var(--icon-bg)", borderRadius: 12, border: "1px dashed var(--border)" }}>
          <div style={{ fontSize: 11, color: mutedVar }}>🔄 {isKo ? "AI 번역 ON" : "AI Translation ON"}</div>
        </div>
      </div>
    </>
  );

  const conversationList = (
    <div className="ll-split-panel">
      <div className="ll-split-panel-sticky" style={{ padding: "12px 14px 10px" }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "var(--foreground)", marginBottom: 10 }}>{t.chats}</div>
        {searchInput}
      </div>
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {cvList()}
      </div>
    </div>
  );

  const chatWindow = (showHeader = false, onBack?: () => void) => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {showHeader && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "var(--card)", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--content-bg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, fontSize: 18, color: "var(--foreground)", lineHeight: 1 }}
            >
              ‹
            </button>
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
                <p style={{ fontSize: 10, color: isMe ? "var(--foreground-muted)" : mutedVar, lineHeight: 1.4 }}>🔄 {msg.translation}</p>
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
      {/* ── Mobile: Conversation list ── */}
      <div className="ll-mobile-only" style={{ display: mobileView === "list" ? "flex" : "none", flexDirection: "column", height: "calc(100dvh - 56px - 50px)" }}>
        <div style={{ padding: "12px 14px 10px", background: "var(--card)", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "var(--foreground)", marginBottom: 10 }}>{t.chats}</div>
          {searchInput}
        </div>
        <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
          {cvList((id) => { setActiveCv(id); setMobileView("chat"); })}
        </div>
      </div>

      {/* ── Mobile: Chat window ── */}
      <div className="ll-mobile-only" style={{ display: mobileView === "chat" ? "flex" : "none", flexDirection: "column", height: "calc(100dvh - 56px - 50px)" }}>
        {chatWindow(true, () => setMobileView("list"))}
      </div>

      {/* ── PC split layout ── */}
      <div className="ll-pc-only ll-split">
        {conversationList}
        <div className="ll-split-main">
          {chatWindow(true)}
        </div>
      </div>
    </>
  );
}
