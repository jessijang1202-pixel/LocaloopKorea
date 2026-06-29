"use client";

import { useState, useEffect, useRef } from "react";
import { useLang } from "@/lib/lang";
import { PageHeader } from "@/components/layout/PageHeader";

type Message = {
  id: string;
  from: "me" | "other";
  text: string;
  translation: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    from: "other",
    text: "안녕하세요! 이태원에서 좋은 카페 추천해 주실 수 있나요?",
    translation: "Hello! Can you recommend a good café in Itaewon?",
  },
  {
    id: "2",
    from: "me",
    text: "Of course! Anthracite is great — it's a converted factory with amazing coffee.",
    translation: "물론이죠! Anthracite가 정말 좋아요. 공장을 개조한 곳인데 커피가 훌륭해요.",
  },
  {
    id: "3",
    from: "other",
    text: "감사합니다! 주소가 어떻게 되나요?",
    translation: "Thank you! What is the address?",
  },
];

const T = {
  ko: {
    title: "번역 채팅",
    notice: "실시간 번역 중 · 한국어 ↔ 영어",
    inputPh: "메시지를 입력하세요...",
    send: "전송",
    translated: "번역",
  },
  en: {
    title: "Translation Chat",
    notice: "Live translation · Korean ↔ English",
    inputPh: "Type a message...",
    send: "Send",
    translated: "Translated",
  },
};

export default function ChatPage() {
  const isKo = useLang();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const t = isKo ? T.ko : T.en;

  function sendMessage() {
    const text = input.trim();
    if (!text) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      from: "me",
      text,
      translation: isKo
        ? `[Auto-translation of: ${text}]`
        : `[${text}의 자동 번역]`,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  }

  return (
    <div className="ll-fullpage" style={{ display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <PageHeader />

      {/* Translation notice */}
      <div style={{
        background: "#E8F9F9",
        borderBottom: "1px solid #C8EDEF",
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 14 }}>🔄</span>
        <span style={{ fontSize: 11, color: "#0B7A82", fontWeight: 600 }}>{t.notice}</span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", background: "var(--content-bg)" }}>
        {messages.map((msg) => {
          const isMe = msg.from === "me";
          return (
            <div key={msg.id} style={{
              display: "flex",
              flexDirection: "column",
              alignItems: isMe ? "flex-end" : "flex-start",
              marginBottom: 16,
            }}>
              <div style={{
                maxWidth: "75%",
                padding: "10px 12px",
                borderRadius: isMe ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                background: isMe ? "#15b6c1" : "var(--card)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                border: isMe ? "none" : "1px solid var(--border)",
              }}>
                <p style={{ fontSize: 13, color: isMe ? "#fff" : "var(--foreground)", lineHeight: 1.5 }}>
                  {msg.text}
                </p>
              </div>
              {/* Translation bubble */}
              <div style={{
                maxWidth: "75%",
                marginTop: 4,
                padding: "6px 10px",
                borderRadius: 8,
                background: isMe ? "rgba(21,182,193,0.1)" : "rgba(0,0,0,0.03)",
                border: isMe ? "1px solid rgba(21,182,193,0.2)" : "1px solid var(--border)",
              }}>
                <p style={{ fontSize: 10, color: isMe ? "#0B7A82" : "var(--muted-foreground)", lineHeight: 1.4 }}>
                  🔄 {msg.translation}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        background: "var(--card)",
        borderTop: "1px solid var(--border)",
        padding: "10px 16px",
        display: "flex",
        gap: 8,
        flexShrink: 0,
        paddingBottom: "calc(10px + env(safe-area-inset-bottom))",
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder={t.inputPh}
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
          onClick={sendMessage}
          style={{
            width: 40, height: 40,
            borderRadius: "50%",
            background: "#15b6c1",
            border: "none",
            color: "#fff",
            fontSize: 16,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
