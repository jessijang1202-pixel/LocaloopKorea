// LEGACY (Phase-1) route — not linked from AppNav; kept for URL compatibility
import { notFound } from "next/navigation";
import Image from "next/image";
import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SEED_GUIDES } from "@/data/seed";
import { GUIDE_CATEGORIES } from "@/lib/constants";

interface GuideDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function GuideDetailPage({ params }: GuideDetailPageProps) {
  const { slug } = await params;
  const guide = SEED_GUIDES.find((g) => g.slug === slug);

  if (!guide) notFound();

  const category = GUIDE_CATEGORIES.find((c) => c.value === guide.category);

  const difficultyVariant = {
    beginner: "success" as const,
    intermediate: "warning" as const,
    advanced: "danger" as const,
  };

  return (
    <PageWrapper>
      <TopBar showBack backHref="/guides" transparent />

      {/* Hero image */}
      <div className="relative h-52 bg-[var(--muted)]">
        {guide.image_url && (
          <Image src={guide.image_url} alt={guide.title_en} fill className="object-cover" sizes="430px" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white/70 text-xs mb-1">{category?.icon} {category?.label_en}</p>
          <h1 className="text-white font-bold text-xl leading-tight">{guide.title_en}</h1>
        </div>
      </div>

      {/* Badges */}
      <div className="flex gap-2 px-4 py-4 scroll-x">
        {guide.difficulty && (
          <Badge variant={difficultyVariant[guide.difficulty]} size="md">
            {guide.difficulty}
          </Badge>
        )}
        {guide.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} size="md">{tag}</Badge>
        ))}
      </div>

      {/* English body */}
      {guide.body_en && (
        <div className="px-4 mb-6">
          <h2 className="text-sm font-bold text-[var(--foreground)] mb-3">Guide</h2>
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4">
            <p className="text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-line">
              {guide.body_en}
            </p>
          </div>
        </div>
      )}

      {/* Korean body */}
      {guide.body_ko && (
        <div className="px-4 mb-6">
          <h2 className="text-sm font-bold text-[var(--foreground)] mb-3">한국어</h2>
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4">
            <p className="text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-line">
              {guide.body_ko}
            </p>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
