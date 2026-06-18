import Image from "next/image";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Badge } from "@/components/ui/Badge";
import { SpiceIndicator } from "@/components/ui/SpiceIndicator";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { HorizontalScroll } from "@/components/sections/HorizontalScroll";
import { SEED_MENUS, SEED_RESTAURANTS } from "@/data/seed";

export default function FoodPage() {
  return (
    <PageWrapper>
      <TopBar title="Food & Menus" />
      <p className="px-4 pt-1 pb-4 text-sm text-[var(--muted-foreground)]">
        Discover what to eat in Korea
      </p>

      {/* Featured menus */}
      <div className="mb-6">
        <SectionHeader title="Must-try dishes" />
        <HorizontalScroll paddingX>
          {SEED_MENUS.map((menu) => (
            <Link key={menu.id} href={`/food/${menu.slug}`} className="block flex-shrink-0 w-52">
              <div className="bg-[var(--card)] rounded-2xl overflow-hidden border border-[var(--border)]">
                <div className="relative h-36 bg-[var(--muted)]">
                  {menu.image_url && (
                    <Image src={menu.image_url} alt={menu.name_en} fill className="object-cover" sizes="208px" />
                  )}
                  {menu.vegetarian && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="success" size="sm">🌱 Veg</Badge>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-bold text-sm text-[var(--foreground)] line-clamp-1">{menu.name_en}</p>
                  <p className="text-xs text-[var(--muted-foreground)] line-clamp-1">{menu.name_ko}</p>
                  <div className="flex items-center justify-between mt-2">
                    <SpiceIndicator level={menu.spice_level} />
                    {menu.price_range && (
                      <span className="text-xs text-[var(--muted-foreground)]">{menu.price_range}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </HorizontalScroll>
      </div>

      {/* Restaurants */}
      <div className="mb-4">
        <SectionHeader title="Recommended restaurants" />
        <div className="flex flex-col gap-3 px-4">
          {SEED_RESTAURANTS.map((r) => (
            <div key={r.id} className="bg-[var(--card)] rounded-2xl overflow-hidden border border-[var(--border)] flex">
              <div className="relative w-24 h-24 flex-shrink-0 bg-[var(--muted)]">
                {r.image_url && (
                  <Image src={r.image_url} alt={r.name_en} fill className="object-cover" sizes="96px" />
                )}
              </div>
              <div className="p-3 flex-1 min-w-0">
                <p className="font-semibold text-sm text-[var(--foreground)] line-clamp-1">{r.name_en}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{r.name_ko}</p>
                {r.category && <Badge size="sm" className="mt-1">{r.category.replace("_", " ")}</Badge>}
                {r.description_en && (
                  <p className="text-xs text-[var(--muted-foreground)] mt-1.5 line-clamp-2 leading-relaxed">
                    {r.description_en}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
