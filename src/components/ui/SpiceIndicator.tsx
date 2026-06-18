import { spiceLevelLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface SpiceIndicatorProps {
  level: number | null;
  showLabel?: boolean;
  className?: string;
}

export function SpiceIndicator({ level, showLabel = true, className }: SpiceIndicatorProps) {
  if (level === null) return null;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full",
              i < level ? "bg-red-500" : "bg-[var(--border)]"
            )}
          />
        ))}
      </div>
      {showLabel && (
        <span className="text-xs text-[var(--muted-foreground)]">{spiceLevelLabel(level)}</span>
      )}
    </div>
  );
}
