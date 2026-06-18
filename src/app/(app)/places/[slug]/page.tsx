import { notFound } from "next/navigation";
import Image from "next/image";
import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SEED_PLACES, SEED_REGIONS } from "@/data/seed";
import { PLACE_CATEGORIES } from "@/lib/constants";

interface PlaceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const { slug } = await params;
  const place = SEED_PLACES.find((p) => p.slug === slug);

  if (!place) notFound();

  const region = SEED_REGIONS.find((r) => r.id === place.region_id);
  const category = PLACE_CATEGORIES.find((c) => c.value === place.category);

  const difficultyColor = {
    easy: "success",
    moderate: "warning",
    hard: "danger",
  } as const;

  return (
    <PageWrapper>
      <TopBar showBack backHref="/places" transparent />

      {/* Hero image */}
      <div className="relative h-64 bg-[var(--muted)]">
        {place.image_url && (
          <Image src={place.image_url} alt={place.name_en} fill className="object-cover" sizes="430px" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white/80 text-xs mb-1">{region?.name_en}</p>
          <h1 className="text-white font-bold text-2xl leading-tight">{place.name_en}</h1>
          <p className="text-white/70 text-sm">{place.name_ko}</p>
        </div>
      </div>

      {/* Feature badges */}
      <div className="flex gap-2 px-4 py-4 scroll-x">
        <Badge variant="primary" size="md">{category?.icon} {category?.label_en ?? place.category}</Badge>
        {place.english_support && <Badge variant="success" size="md">🇬🇧 English support</Badge>}
        {place.card_payment && <Badge size="md">💳 Card payment</Badge>}
        {place.solo_friendly && <Badge size="md">👤 Solo friendly</Badge>}
        {place.reservation_difficulty && (
          <Badge variant={difficultyColor[place.reservation_difficulty]} size="md">
            📅 Reservation: {place.reservation_difficulty}
          </Badge>
        )}
      </div>

      {/* Description */}
      {place.description_en && (
        <div className="px-4 mb-5">
          <h2 className="text-sm font-bold text-[var(--foreground)] mb-2">About</h2>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{place.description_en}</p>
        </div>
      )}

      {/* Address */}
      {place.address && (
        <div className="mx-4 mb-5 p-4 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
          <p className="text-xs font-semibold text-[var(--foreground)] mb-1">Address</p>
          <p className="text-sm text-[var(--muted-foreground)]">{place.address}</p>
        </div>
      )}

      {/* Korean description */}
      {place.description_ko && (
        <div className="px-4 mb-5">
          <h2 className="text-sm font-bold text-[var(--foreground)] mb-2">한국어 설명</h2>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{place.description_ko}</p>
        </div>
      )}
    </PageWrapper>
  );
}
