import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { BottomNav } from "@/components/layout/BottomNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // In demo mode (Supabase not configured), bypass auth check
  if (!isSupabaseConfigured()) {
    return (
      <div className="app-container">
        <div className="min-h-dvh">
          {children}
          <BottomNav />
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="app-container">
      <div className="min-h-dvh">
        {children}
        <BottomNav />
      </div>
    </div>
  );
}
