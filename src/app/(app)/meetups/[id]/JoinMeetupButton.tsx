"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface JoinMeetupButtonProps {
  meetupId: string;
  isFull: boolean;
}

export function JoinMeetupButton({ meetupId, isFull }: JoinMeetupButtonProps) {
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  async function handleJoin() {
    setJoining(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("meetup_participants").insert({
      meetup_id: meetupId,
      user_id: user.id,
    });

    if (!error) setJoined(true);
    setJoining(false);
  }

  if (joined) {
    return (
      <div className="w-full h-12 rounded-2xl bg-green-100 border border-green-300 flex items-center justify-center text-green-700 font-semibold text-sm">
        ✓ You're going!
      </div>
    );
  }

  return (
    <button
      onClick={handleJoin}
      disabled={isFull || joining}
      className="w-full h-12 rounded-2xl bg-[var(--primary)] text-white font-semibold text-base disabled:opacity-50 transition-opacity hover:opacity-90 active:opacity-80"
    >
      {joining ? "Joining…" : isFull ? "Meetup is full" : "Join meetup"}
    </button>
  );
}
