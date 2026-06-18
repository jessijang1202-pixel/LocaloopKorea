import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { GUIDE_CATEGORIES } from "@/lib/constants";
import type { Guide } from "@/types";

interface GuideCardProps {
  guide: Guide;
  variant?: "horizontal" | "card";
}

const difficultyVariant = {
  beginner: "success" as const,
  intermediate: "warning" as const,
  advanced: "danger" as const,
};

export function GuideCard({ guide, variant = "card" }: GuideCardProps) {
  const category = GUIDE_CATEGORIES.find((c) => c.value === guide.category);

  if (variant === "horizontal") {
    return (
      <Link href={`/guides/${guide.slug}`} className="flex gap-3 p-4 border-b border-[var(--border)] last:border-0 active:bg-[var(--muted)] transition-colors">
        <div className="text-2xl flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--muted)]">
          {category?.icon ?? "📖"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--foreground)] line-clamp-1">{guide.title_en}</p>
          <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 mt-0.5">{guide.title_ko}</p>
          <div className="flex gap-1 mt-1.5">
            {guide.difficulty && (
              <Badge variant={difficultyVariant[guide.difficulty]} size="sm">
                {guide.difficulty}
              </Badge>
            )}
            {category && <Badge size="sm">{category.label_en}</Badge>}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/guides/${guide.slug}`} className="block flex-shrink-0 w-52">
      <div className="bg-[var(--card)] rounded-2xl overflow-hidden border border-[var(--border)]">
        <div className="relative h-32 bg-[var(--muted)]">
          {guide.image_url && (
            <Image src={guide.image_url} alt={guide.title_en} fill className="object-cover" sizes="208px" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3">
            <span className="text-xl">{category?.icon ?? "📖"}</span>
          </div>
        </div>
        <div className="p-3">
          <p className="font-semibold text-sm text-[var(--foreground)] line-clamp-2 leading-snug">{guide.title_en}</p>
          <div className="flex gap-1 mt-2">
            {guide.difficulty && (
              <Badge variant={difficultyVariant[guide.difficulty]} size="sm">
                {guide.difficulty}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
