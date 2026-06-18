"use server";

import { createClient } from "@/lib/supabase/server";
import type { OnboardingData } from "./page";

export async function saveOnboarding(data: OnboardingData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("profiles")
    .update({
      user_type: data.userType ?? "foreigner",
      region_id: data.regionId,
      display_name: data.displayName || user.email?.split("@")[0] || "User",
      bio: data.bio || null,
      onboarding_done: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (data.interestIds.length > 0) {
    await supabase.from("user_interests").delete().eq("user_id", user.id);
    await supabase.from("user_interests").insert(
      data.interestIds.map((interest_id) => ({ user_id: user.id, interest_id }))
    );
  }
}
