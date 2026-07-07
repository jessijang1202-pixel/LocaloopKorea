// LEGACY (Phase-1) route — not linked from AppNav; kept for URL compatibility
import { notFound } from "next/navigation";
import Image from "next/image";
import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { SpiceIndicator } from "@/components/ui/SpiceIndicator";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SEED_MENUS, SEED_RESTAURANTS } from "@/data/seed";

interface FoodDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function FoodDetailPage({ params }: FoodDetailPageProps) {
  const { slug } = await params;
  const menu = SEED_MENUS.find((m) => m.slug === slug);

  if (!menu) notFound();

  const restaurant = SEED_RESTAURANTS.find((r) => r.id === menu.restaurant_id);

  return (
    <PageWrapper>
      <TopBar showBack backHref="/food" transparent />

      {/* Hero */}
      <div className="relative h-64 bg-[var(--muted)]">
        {menu.image_url && (
          <Image src={menu.image_url} alt={menu.name_en} fill className="object-cover" sizes="430px" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-white font-bold text-2xl">{menu.name_en}</h1>
          <p className="text-white/70 text-base">{menu.name_ko}</p>
        </div>
      </div>

      {/* Quick info */}
      <div className="flex flex-wrap gap-2 px-4 py-4">
        <SpiceIndicator level={menu.spice_level} />
        {menu.vegetarian && <Badge variant="success" size="md">🌱 Vegetarian</Badge>}
        {menu.price_range && <Badge size="md">💰 {menu.price_range}</Badge>}
      </div>

      {/* Description */}
      {menu.description_en && (
        <div className="px-4 mb-5">
          <h2 className="text-sm font-bold text-[var(--foreground)] mb-2">About this dish</h2>
          <p className="text-sm text-[var(--foreground)] leading-relaxed">{menu.description_en}</p>
        </div>
      )}

      {menu.description_ko && (
        <div className="px-4 mb-5">
          <h2 className="text-sm font-bold text-[var(--foreground)] mb-2">설명</h2>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{menu.description_ko}</p>
        </div>
      )}

      {/* How to order */}
      {menu.how_to_order_en && (
        <div className="mx-4 mb-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
          <p className="text-xs font-bold text-blue-800 mb-1.5">🗣 How to order</p>
          <p className="text-sm text-blue-700 leading-relaxed">{menu.how_to_order_en}</p>
        </div>
      )}

      {/* Local tip */}
      {menu.local_tip_en && (
        <div className="mx-4 mb-4 p-4 rounded-xl bg-orange-50 border border-orange-200">
          <p className="text-xs font-bold text-orange-800 mb-1.5">💡 Local tip</p>
          <p className="text-sm text-orange-700 leading-relaxed">{menu.local_tip_en}</p>
        </div>
      )}

      {/* Restaurant */}
      {restaurant && (
        <div className="mx-4 mb-5 p-4 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
          <p className="text-xs font-semibold text-[var(--foreground)] mb-1">Found at</p>
          <p className="text-sm font-bold text-[var(--foreground)]">{restaurant.name_en}</p>
          <p className="text-xs text-[var(--muted-foreground)]">{restaurant.name_ko}</p>
          {restaurant.address && (
            <p className="text-xs text-[var(--muted-foreground)] mt-1">📍 {restaurant.address}</p>
          )}
        </div>
      )}
    </PageWrapper>
  );
}
