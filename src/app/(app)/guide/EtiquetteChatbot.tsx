"use client";

// Etiquette FAQ chatbot — a floating helper mounted inside the guide page's
// Culture & Etiquette tab. Fully local and deterministic: it matches the user's
// question against ETIQUETTE_FAQS (src/content/etiquette-faq.ts) with matchFaq —
// no network, no LLM.
//
// Uses the same Gen-2 inline-style / CSS-variable / isKo visual language as the
// rest of the app, and mirrors ChatPanel's bubble + input-row styling (bot
// bubbles left, user bubbles right on coral). Guards its render with a `mounted`
// flag (like PriorityNow) to avoid any hydration mismatch and to read matchMedia.

import { useState, useEffect, useRef } from "react";
import { useLang } from "@/lib/lang";
import {
  ETIQUETTE_FAQS,
  SUGGESTED_FAQ_IDS,
  matchFaq,
  getFaq,
  type EtiquetteFaq,
} from "@/content/etiquette-faq";

type ChatMsg = {
  id: string;
  role: "bot" | "user";
  text: string;
  chipIds?: string[]; // FAQ ids rendered as tappable follow-up chips
};

let msgSeq = 0;
function nextId(): string {
  msgSeq += 1;
  return `m${msgSeq}`;
}

function pickRandomIds(count: number, exclude: string[] = []): string[] {
  const pool = ETIQUETTE_FAQS.map((f) => f.id).filter((id) => !exclude.includes(id));
  // Fisher–Yates on a shallow copy, take `count`.
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

export function EtiquetteChatbot() {
  const isKo = useLang();

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setIsMobile(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const [open, setOpen] = useState(false);
  const [showLabel, setShowLabel] = useState(true);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = (f: EtiquetteFaq) => (isKo ? f.question.ko : f.question.en);

  // Auto-scroll the message list to the bottom on new messages.
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function greeting(): ChatMsg {
    return {
      id: nextId(),
      role: "bot",
      text: isKo
        ? "안녕하세요, 한국 생활 에티켓에 대해 무엇이든 물어보세요."
        : "Hi, ask me anything about Korean etiquette.",
      chipIds: SUGGESTED_FAQ_IDS,
    };
  }

  function openSheet() {
    setShowLabel(false);
    setOpen(true);
    // Seed the greeting once, the first time the sheet is opened.
    setMessages((prev) => (prev.length === 0 ? [greeting()] : prev));
    // Focus the input shortly after the panel mounts.
    setTimeout(() => inputRef.current?.focus(), 60);
  }

  function respondWithFaq(faq: EtiquetteFaq, alternates: EtiquetteFaq[]) {
    const relatedIds = (faq.related && faq.related.length > 0
      ? faq.related
      : alternates.map((a) => a.id)
    ).slice(0, 3);
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: "bot",
        text: isKo ? faq.answer.ko : faq.answer.en,
        chipIds: relatedIds,
      },
    ]);
  }

  function respondFallback() {
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: "bot",
        text: isKo
          ? "아직 준비되지 않은 질문이에요. 아래 주제는 어때요?"
          : "I do not have that one yet - try these:",
        chipIds: pickRandomIds(4),
      },
    ]);
  }

  // Ask a specific FAQ by id (from a follow-up / suggestion chip).
  function askById(id: string) {
    const faq = getFaq(id);
    if (!faq) return;
    setMessages((prev) => [...prev, { id: nextId(), role: "user", text: q(faq) }]);
    respondWithFaq(faq, []);
  }

  // Submit free-text from the input.
  function submitText(raw: string) {
    const text = raw.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: nextId(), role: "user", text }]);
    setInput("");
    const { best, alternates } = matchFaq(text);
    if (best) respondWithFaq(best, alternates);
    else respondFallback();
  }

  if (!mounted) return null;

  const coral = "var(--grade-s)";

  // ── Floating button (icon + optional label pill) ──────────────────────────
  const launcher = !open && (
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: isMobile
          ? "calc(env(safe-area-inset-bottom, 0px) + 92px)"
          : 24,
        zIndex: 1200,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {showLabel && (
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color: "var(--foreground)",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 999,
            padding: "6px 11px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
            whiteSpace: "nowrap",
          }}
        >
          {isKo ? "챗봇에게 물어보기" : "Ask the chatbot"}
        </span>
      )}
      <button
        onClick={openSheet}
        aria-label={isKo ? "에티켓 도우미 열기" : "Open etiquette helper"}
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: coral,
          border: "none",
          cursor: "pointer",
          boxShadow: "0 6px 18px rgba(255,86,54,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </button>
    </div>
  );

  // ── Chat sheet ────────────────────────────────────────────────────────────
  const sheetStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: "70dvh",
        borderRadius: "20px 20px 0 0",
        borderBottom: "none",
      }
    : {
        position: "fixed",
        right: 24,
        bottom: 24,
        width: 380,
        maxHeight: 560,
        height: "560px",
        borderRadius: 20,
      };

  const sheet = open && (
    <>
      {/* Backdrop — click to dismiss */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: isMobile ? "rgba(0,0,0,0.35)" : "transparent",
          zIndex: 1200,
        }}
      />
      <div
        style={{
          ...sheetStyle,
          zIndex: 1300,
          background: "var(--card)",
          border: "1px solid var(--border)",
          boxShadow: "0 -4px 30px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "13px 16px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: coral,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--foreground)" }}>
              {isKo ? "에티켓 도우미" : "Etiquette Helper"}
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label={isKo ? "닫기" : "Close"}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "var(--content-bg)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "var(--foreground)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Message list */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
            padding: "14px 14px",
            background: "var(--content-bg)",
          }}
        >
          {messages.map((m) => {
            const isMe = m.role === "user";
            return (
              <div key={m.id} style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: isMe ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "82%",
                      padding: "9px 12px",
                      borderRadius: isMe ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
                      background: isMe ? coral : "var(--card)",
                      color: isMe ? "#fff" : "var(--foreground)",
                      border: isMe ? "none" : "1px solid var(--border)",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                      fontSize: 13.5,
                      lineHeight: 1.55,
                    }}
                  >
                    {m.text}
                  </div>
                </div>

                {/* Follow-up / suggestion chips (bot only) */}
                {!isMe && m.chipIds && m.chipIds.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                    {m.chipIds.map((id) => {
                      const faq = getFaq(id);
                      if (!faq) return null;
                      return (
                        <button
                          key={id}
                          onClick={() => askById(id)}
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "7px 11px",
                            borderRadius: 999,
                            background: "var(--card)",
                            border: `1px solid ${coral}`,
                            color: coral,
                            cursor: "pointer",
                            textAlign: "left",
                            lineHeight: 1.35,
                          }}
                        >
                          {q(faq)}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Footer input row */}
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "10px 14px",
            borderTop: "1px solid var(--border)",
            background: "var(--card)",
            flexShrink: 0,
            paddingBottom: isMobile
              ? "calc(10px + env(safe-area-inset-bottom, 0px))"
              : 10,
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submitText(input);
              }
            }}
            placeholder={isKo ? "궁금한 점을 입력하세요" : "Type your question"}
            style={{
              flex: 1,
              height: 40,
              padding: "0 14px",
              borderRadius: 20,
              border: "1.5px solid var(--border)",
              background: "var(--content-bg)",
              fontSize: 13,
              color: "var(--foreground)",
              outline: "none",
            }}
          />
          <button
            onClick={() => submitText(input)}
            aria-label={isKo ? "보내기" : "Send"}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: coral,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {launcher}
      {sheet}
    </>
  );
}
