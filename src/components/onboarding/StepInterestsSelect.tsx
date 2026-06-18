import type { Interest } from "@/types";

interface StepInterestsSelectProps {
  interests: Interest[];
  value: string[];
  onChange: (ids: string[]) => void;
  onBack: () => void;
}

export function StepInterestsSelect({ interests, value, onChange, onBack }: StepInterestsSelectProps) {
  function toggle(id: string) {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  }

  const canContinue = value.length >= 3;

  return (
    <div className="flex-1 flex flex-col px-6 pt-6">
      <button onClick={onBack} className="text-[var(--muted-foreground)] text-sm mb-6 self-start">
        ← Back
      </button>
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-1">What are you into?</h2>
      <p className="text-sm text-[var(--muted-foreground)] mb-6">
        Pick at least 3 interests · {value.length} selected
      </p>

      <div className="flex flex-wrap gap-2 overflow-y-auto flex-1">
        {interests.map((interest) => {
          const selected = value.includes(interest.id);
          return (
            <button
              key={interest.id}
              onClick={() => toggle(interest.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border-2 transition-all text-sm font-medium active:scale-95 ${
                selected
                  ? "border-[var(--primary)] bg-orange-50 text-[var(--primary)]"
                  : "border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              <span>{interest.icon}</span>
              <span>{interest.name_en}</span>
            </button>
          );
        })}
      </div>

      <div className="pt-6 pb-4">
        <button
          onClick={() => canContinue && onChange(value)}
          disabled={!canContinue}
          className="w-full h-12 rounded-2xl bg-[var(--primary)] text-white font-semibold text-base disabled:opacity-40 transition-opacity"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
