"use server";

import { createClient } from "@/lib/supabase/server";

export async function signupAction(
  _prev: { error: string; success: boolean },
  formData: FormData
) {
  const displayName = (formData.get("displayName") as string)?.trim();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!displayName || !email || !password) {
    return { error: "All fields are required.", success: false };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters.", success: false };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
    },
  });

  if (error) {
    return { error: error.message, success: false };
  }

  return { error: "", success: true };
}
