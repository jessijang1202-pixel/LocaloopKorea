"use client";

// ORPHAN route — same content now rendered inside /community (chat tab)

import ChatPanel from "@/components/chat/ChatPanel";

export default function ChatPage() {
  return <ChatPanel variant="standalone" />;
}
