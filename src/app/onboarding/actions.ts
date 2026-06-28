"use server";

import { createClient } from "@/lib/supabase/server";
import type { OnboardingData } from "./page";

const LANG_CODE: Record<string, string> = {
  English: "en",
  Japanese: "ja",
  Chinese: "zh",
  Vietnamese: "vi",
  Thai: "th",
  French: "fr",
  German: "de",
  Other: "other",
};

export async function saveOnboarding(data: OnboardingData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // Resolve region slug → UUID
  let regionId: string | null = null;
  if (data.region) {
    const { data: row } = await supabase
      .from("regions")
      .select("id")
      .eq("slug", data.region)
      .maybeSingle();
    regionId = row?.id ?? null;
  }

  const langCode = LANG_CODE[data.mainLanguage] ?? data.mainLanguage.toLowerCase();

  await supabase
    .from("profiles")
    .update({
      display_name:
        data.displayName.trim() || user.email?.split("@")[0] || "User",
      nationality: data.nationality || null,
      languages: langCode ? [langCode] : [],
      user_type: data.isKorean ? "korean" : "foreigner",
      region_id: regionId,
      onboarding_done: true,
      // onboarding_meta requires the migration below to be run first
      onboarding_meta: {
        gender: data.gender || null,
        purpose: data.purpose || null,
        arrival_date: data.arrivalDate || null,
        stay_duration: data.stayDuration || null,
        living: data.living || null,
        korean_level: data.koreanLevel || null,
        budget: data.budget || null,
        activity_style: data.activityStyle || null,
        has_pet: data.hasPet || null,
        dietary: data.dietaryRestrictions,
        transportation: data.transportation,
        connections: {
          make_friends: data.makeFriends,
          language_exchange: data.languageExchange,
          join_meetups: data.joinMeetups,
          nearby_alerts: data.nearbyAlerts,
          marketing: data.marketing,
        },
      },
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  // Save interest tags
  if (data.interests.length > 0) {
    const { data: rows } = await supabase
      .from("interests")
      .select("id")
      .in("slug", data.interests);

    if (rows?.length) {
      await supabase.from("user_interests").delete().eq("user_id", user.id);
      await supabase
        .from("user_interests")
        .insert(rows.map((r) => ({ user_id: user.id, interest_id: r.id })));
    }
  }
}
