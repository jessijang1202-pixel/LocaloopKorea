"use server";

import { createClient } from "@/lib/supabase/server";
import type { OnboardingData } from "@/types/onboarding";

export async function saveOnboarding(data: OnboardingData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("profiles").upsert({
    id: user.id,
    display_name: data.displayName || null,
    nationality: data.nationality || null,
    main_language: data.mainLanguage || null,
    gender: data.gender || null,
    purpose: data.purpose || null,
    stay_duration: data.stayDuration || null,
    region: data.region || null,
    living: data.living || null,
    korean_level: data.koreanLevel || null,
    interests: data.interests,
    make_friends: data.makeFriends,
    language_exchange: data.languageExchange,
    join_meetups: data.joinMeetups,
    nearby_alerts: data.nearbyAlerts,
    marketing: data.marketing,
    onboarding_done: true,
    updated_at: new Date().toISOString(),
  });
}
