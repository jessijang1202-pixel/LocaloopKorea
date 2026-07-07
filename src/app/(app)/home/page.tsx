// LEGACY (Phase-1) route — not linked from AppNav; kept for URL compatibility
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { HorizontalScroll } from "@/components/sections/HorizontalScroll";
import { PlaceCard } from "@/components/cards/PlaceCard";
import { GuideCard } from "@/components/cards/GuideCard";
import { FoodCard } from "@/components/cards/FoodCard";
import { MeetupCard } from "@/components/cards/MeetupCard";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SEED_PLACES, SEED_GUIDES, SEED_MENUS, SEED_MEETUPS } from "@/data/seed";

export default async function HomePage() {
  let name = "there";
  let regionName = "Seoul";

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, user_type, region:regions(name_en)")
        .eq("id", user.id)
        .single();

      if (profile) {
        name = profile.display_name ?? "there";
        regionName = (profile.region as { name_en?: string } | null)?.name_en ?? "Seoul";
      }
    }
  }

  return (
    <PageWrapper>
      {/* Header */}
      <div className="px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--muted-foreground)] mb-0.5">
              📍 {regionName}
            </p>
            <h1 className="text-xl font-bold text-[var(--foreground)]">Hey, {name} 👋</h1>
          </div>
          <Link
            href="/profile"
            className="w-9 h-9 rounded-full bg-[var(--muted)] flex items-center justify-center text-base"
          >
            👤
          </Link>
        </div>

        {/* Search bar */}
        <Link
          href="/places"
          className="mt-4 flex items-center gap-3 h-11 px-4 rounded-xl bg-[var(--muted)] border border-[var(--border)]"
        >
          <span className="text-base">🔍</span>
          <span className="text-sm text-[var(--muted-foreground)]">Search places, guides, food…</span>
        </Link>
      </div>

      {/* Quick filters */}
      <div className="flex gap-2 px-4 mb-5 scroll-x">
        {[
          { label: "Places", href: "/places", icon: "📍" },
          { label: "Guides", href: "/guides", icon: "📖" },
          { label: "Food", href: "/food", icon: "🍜" },
          { label: "Meetups", href: "/meetups", icon: "🤝" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--muted)] border border-[var(--border)] text-sm font-medium text-[var(--foreground)]"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Places section */}
      <div className="mb-6">
        <SectionHeader title="Foreigner-friendly places" href="/places" />
        <HorizontalScroll paddingX>
          {SEED_PLACES.slice(0, 4).map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </HorizontalScroll>
      </div>

      {/* Guides section */}
      <div className="mb-6">
        <SectionHeader title="Life guides" href="/guides" />
        <div className="mx-4 rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--card)]">
          {SEED_GUIDES.slice(0, 3).map((guide) => (
            <GuideCard key={guide.id} guide={guide} variant="horizontal" />
          ))}
        </div>
      </div>

      {/* Food section */}
      <div className="mb-6">
        <SectionHeader title="Local food picks" href="/food" />
        <HorizontalScroll paddingX>
          {SEED_MENUS.map((menu) => (
            <FoodCard key={menu.id} menu={menu} />
          ))}
        </HorizontalScroll>
      </div>

      {/* Meetups section */}
      <div className="mb-6">
        <SectionHeader title="Upcoming meetups" href="/meetups" />
        <HorizontalScroll paddingX>
          {SEED_MEETUPS.filter((m) => m.status === "open").slice(0, 4).map((meetup) => (
            <MeetupCard key={meetup.id} meetup={meetup} />
          ))}
        </HorizontalScroll>
      </div>

      {/* Banner CTA */}
      <div className="mx-4 mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-5 text-white">
        <p className="text-xs font-medium opacity-80 mb-1">Community</p>
        <p className="font-bold text-base mb-1">Meet people in your area</p>
        <p className="text-sm opacity-80 mb-3 leading-relaxed">
          Connect with locals and foreigners who share your interests
        </p>
        <Link
          href="/community"
          className="inline-flex items-center gap-1 bg-white/20 px-4 py-1.5 rounded-full text-sm font-semibold"
        >
          Browse community →
        </Link>
      </div>
    </PageWrapper>
  );
}
