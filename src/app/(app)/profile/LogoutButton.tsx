"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full h-11 rounded-xl border border-[var(--border)] text-[var(--muted-foreground)] text-sm font-medium hover:bg-[var(--muted)] transition-colors"
    >
      Log out
    </button>
  );
}
