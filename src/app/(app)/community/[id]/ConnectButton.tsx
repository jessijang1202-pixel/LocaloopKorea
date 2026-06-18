"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ConnectButtonProps {
  recipientId: string;
}

export function ConnectButton({ recipientId }: ConnectButtonProps) {
  const [status, setStatus] = useState<"idle" | "pending" | "sent" | "error">("idle");

  async function handleConnect() {
    setStatus("pending");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("connections").insert({
      requester_id: user.id,
      recipient_id: recipientId,
      status: "pending",
    });

    setStatus(error ? "error" : "sent");
  }

  if (status === "sent") {
    return (
      <div className="w-full h-10 rounded-xl bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center text-sm text-[var(--muted-foreground)] font-medium">
        Request sent ✓
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={status === "pending"}
      className="w-full h-10 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm disabled:opacity-60 transition-opacity hover:opacity-90"
    >
      {status === "pending" ? "Sending…" : "Connect"}
    </button>
  );
}
