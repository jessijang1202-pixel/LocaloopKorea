import type { Region } from "@/types";

interface StepRegionSelectProps {
  regions: Region[];
  value: string | null;
  onChange: (regionId: string) => void;
  onBack: () => void;
}

export function StepRegionSelect({ regions, value, onChange, onBack }: StepRegionSelectProps) {
  return (
    <div className="flex-1 flex flex-col px-6 pt-6">
      <button onClick={onBack} className="text-[var(--muted-foreground)] text-sm mb-6 self-start">
        ← Back
      </button>
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Where are you based?</h2>
      <p className="text-sm text-[var(--muted-foreground)] mb-6">
        We&apos;ll show you places and people near you
      </p>

      <div className="flex flex-col gap-2 overflow-y-auto">
        {regions.map((region) => (
          <button
            key={region.id}
            onClick={() => onChange(region.id)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all active:scale-[0.98] ${
              value === region.id
                ? "border-[var(--primary)] bg-orange-50"
                : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-[var(--foreground)]">{region.name_en}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{region.name_ko} · {region.city}</p>
              </div>
              {value === region.id && <span className="text-[var(--primary)]">✓</span>}
            </div>
            {region.description_en && (
              <p className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-1">
                {region.description_en}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
