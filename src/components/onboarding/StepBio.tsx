"use client";

interface StepBioProps {
  value: { displayName: string; bio: string };
  onChange: (vals: { displayName: string; bio: string }) => void;
  onBack: () => void;
  onFinish: () => void;
  saving: boolean;
}

export function StepBio({ value, onChange, onBack, onFinish, saving }: StepBioProps) {
  return (
    <div className="flex-1 flex flex-col px-6 pt-6">
      <button onClick={onBack} className="text-[var(--muted-foreground)] text-sm mb-6 self-start">
        ← Back
      </button>
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-1">Introduce yourself</h2>
      <p className="text-sm text-[var(--muted-foreground)] mb-6">
        Help others know who you are
      </p>

      <div className="flex flex-col gap-5 flex-1">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">Display name *</label>
          <input
            type="text"
            value={value.displayName}
            onChange={(e) => onChange({ ...value, displayName: e.target.value })}
            placeholder="Your name or nickname"
            className="h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-base outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--muted-foreground)]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--foreground)]">
            Short bio <span className="text-[var(--muted-foreground)] font-normal">(optional)</span>
          </label>
          <textarea
            value={value.bio}
            onChange={(e) => onChange({ ...value, bio: e.target.value })}
            placeholder="Tell others a bit about yourself — where you're from, what you love about Korea..."
            rows={4}
            maxLength={200}
            className="px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-base outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--muted-foreground)] resize-none leading-relaxed"
          />
          <p className="text-xs text-[var(--muted-foreground)] text-right">{value.bio.length}/200</p>
        </div>
      </div>

      <div className="pt-4 pb-4 flex flex-col gap-3">
        <button
          onClick={onFinish}
          disabled={!value.displayName.trim() || saving}
          className="w-full h-12 rounded-2xl bg-[var(--primary)] text-white font-semibold text-base disabled:opacity-40 transition-opacity"
        >
          {saving ? "Saving…" : "Finish setup"}
        </button>
      </div>
    </div>
  );
}
