interface StepTypeSelectProps {
  value: "foreigner" | "korean" | null;
  onChange: (value: "foreigner" | "korean") => void;
}

export function StepTypeSelect({ onChange }: StepTypeSelectProps) {
  return (
    <div className="flex-1 flex flex-col px-6 pt-6">
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">I am...</h2>
      <p className="text-sm text-[var(--muted-foreground)] mb-8">This helps us personalize your experience</p>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => onChange("foreigner")}
          className="w-full text-left p-5 rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] active:scale-[0.98] transition-all"
        >
          <div className="text-3xl mb-2">🌏</div>
          <p className="font-bold text-[var(--foreground)] text-base mb-1">A foreigner in Korea</p>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
            I want to discover local Korea, get practical help with daily life, and meet locals
          </p>
        </button>

        <button
          onClick={() => onChange("korean")}
          className="w-full text-left p-5 rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] active:scale-[0.98] transition-all"
        >
          <div className="text-3xl mb-2">🇰🇷</div>
          <p className="font-bold text-[var(--foreground)] text-base mb-1">Korean</p>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
            I want to meet foreigners, practice languages, and share my local knowledge
          </p>
        </button>
      </div>
    </div>
  );
}
