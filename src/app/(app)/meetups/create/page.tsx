"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SEED_REGIONS } from "@/data/seed";
import { createMeetupAction } from "./actions";

export default function CreateMeetupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createMeetupAction(formData);

    if (result?.error) {
      setError(result.error);
      setSaving(false);
    } else {
      router.push("/meetups");
    }
  }

  const inputClass = "h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-base outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--muted-foreground)] w-full";

  return (
    <PageWrapper>
      <TopBar title="Create Meetup" showBack backHref="/meetups" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-4 pt-4 pb-8">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">Title *</label>
          <input name="title" type="text" required placeholder="e.g. Language exchange in Hongdae" className={inputClass} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">Description</label>
          <textarea
            name="description"
            rows={4}
            placeholder="Tell people what to expect..."
            className="px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-base outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--muted-foreground)] resize-none leading-relaxed"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">Region *</label>
          <select name="region_id" required className={inputClass}>
            <option value="">Select a region</option>
            {SEED_REGIONS.map((r) => (
              <option key={r.id} value={r.id}>{r.name_en} ({r.city})</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">Location / venue name</label>
          <input name="location_name" type="text" placeholder="e.g. Thursday Party Hongdae" className={inputClass} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">Date & time *</label>
          <input name="scheduled_at" type="datetime-local" required className={inputClass} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">Max participants</label>
          <input name="max_participants" type="number" min={2} max={100} defaultValue={10} className={inputClass} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">Language tags</label>
          <input name="language_tags" type="text" placeholder="e.g. Korean, English" className={inputClass} />
          <p className="text-xs text-[var(--muted-foreground)]">Comma-separated</p>
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="h-12 rounded-2xl bg-[var(--primary)] text-white font-semibold text-base disabled:opacity-60 transition-opacity hover:opacity-90"
        >
          {saving ? "Creating…" : "Create meetup"}
        </button>
      </form>
    </PageWrapper>
  );
}
