"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { createClient } from "@/lib/supabase/client";
import { SEED_REGIONS } from "@/data/seed";
import { LANGUAGES } from "@/lib/constants";

export default function EditProfilePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    display_name: "",
    bio: "",
    nationality: "",
    region_id: "",
    language_goal: "",
    languages: [] as string[],
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .select("display_name, bio, nationality, region_id, language_goal, languages")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setForm({
              display_name: data.display_name ?? "",
              bio: data.bio ?? "",
              nationality: data.nationality ?? "",
              region_id: data.region_id ?? "",
              language_goal: data.language_goal ?? "",
              languages: data.languages ?? [],
            });
          }
        });
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        display_name: form.display_name,
        bio: form.bio || null,
        nationality: form.nationality || null,
        region_id: form.region_id || null,
        language_goal: form.language_goal || null,
        languages: form.languages,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      router.push("/profile");
    }
    setSaving(false);
  }

  const inputClass = "h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-base outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--muted-foreground)] w-full";

  return (
    <PageWrapper>
      <TopBar title="Edit Profile" showBack backHref="/profile" />

      <div className="flex flex-col gap-5 px-4 pt-4 pb-8">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">Display name</label>
          <input
            type="text"
            value={form.display_name}
            onChange={(e) => setForm({ ...form, display_name: e.target.value })}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3}
            maxLength={200}
            className="px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-base outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--muted-foreground)] resize-none leading-relaxed"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">Nationality</label>
          <input
            type="text"
            value={form.nationality}
            onChange={(e) => setForm({ ...form, nationality: e.target.value })}
            placeholder="e.g. American"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">Region</label>
          <select
            value={form.region_id}
            onChange={(e) => setForm({ ...form, region_id: e.target.value })}
            className={inputClass}
          >
            <option value="">Select region</option>
            {SEED_REGIONS.map((r) => (
              <option key={r.id} value={r.id}>{r.name_en} — {r.city}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">Language goal</label>
          <input
            type="text"
            value={form.language_goal}
            onChange={(e) => setForm({ ...form, language_goal: e.target.value })}
            placeholder="e.g. Learning Korean for daily conversations"
            className={inputClass}
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>
        )}

        <button
          onClick={handleSave}
          disabled={saving || !form.display_name.trim()}
          className="h-12 rounded-2xl bg-[var(--primary)] text-white font-semibold text-base disabled:opacity-60 transition-opacity hover:opacity-90"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </PageWrapper>
  );
}
