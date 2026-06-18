"use server";

import { createClient } from "@/lib/supabase/server";

export async function createMeetupAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "You must be logged in." };

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const region_id = formData.get("region_id") as string;
  const location_name = (formData.get("location_name") as string)?.trim() || null;
  const scheduled_at = formData.get("scheduled_at") as string;
  const max_participants = parseInt(formData.get("max_participants") as string) || 10;
  const langStr = (formData.get("language_tags") as string) || "";
  const language_tags = langStr.split(",").map((s) => s.trim()).filter(Boolean);

  if (!title || !region_id || !scheduled_at) {
    return { error: "Title, region, and date are required." };
  }

  const { error } = await supabase.from("meetups").insert({
    title,
    description,
    host_id: user.id,
    region_id,
    location_name,
    scheduled_at: new Date(scheduled_at).toISOString(),
    max_participants,
    language_tags,
    status: "open",
  });

  if (error) return { error: error.message };
  return { error: null };
}
