import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { TopBar } from "@/components/layout/TopBar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";

export default async function SavedPage() {
  if (!isSupabaseConfigured()) {
    return (
      <PageWrapper>
        <TopBar title="Saved" showBack backHref="/profile" />
        <EmptyState icon="🔌" title="Connect Supabase to use Saved" description="Bookmarks are stored in your Supabase account" />
      </PageWrapper>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: saved } = await supabase
    .from("saved_items")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const grouped = (saved ?? []).reduce<Record<string, typeof saved>>((acc, item) => {
    const type = item!.item_type;
    if (!acc[type]) acc[type] = [];
    acc[type]!.push(item);
    return acc;
  }, {});

  const typeLabels: Record<string, string> = {
    place: "Places",
    guide: "Guides",
    meetup: "Meetups",
    restaurant: "Restaurants",
    menu: "Food & Menus",
  };

  const typeIcons: Record<string, string> = {
    place: "📍",
    guide: "📖",
    meetup: "🤝",
    restaurant: "🍽️",
    menu: "🍜",
  };

  return (
    <PageWrapper>
      <TopBar title="Saved" showBack backHref="/profile" />

      {(saved ?? []).length === 0 ? (
        <EmptyState
          icon="🔖"
          title="Nothing saved yet"
          description="Save places, guides, food, and meetups you want to come back to"
          action={
            <Link href="/home" className="text-sm text-[var(--primary)] font-semibold">
              Explore now
            </Link>
          }
        />
      ) : (
        <div className="px-4 pt-4 flex flex-col gap-6 pb-8">
          {Object.entries(grouped).map(([type, items]) => (
            <div key={type}>
              <p className="text-sm font-bold text-[var(--foreground)] mb-3">
                {typeIcons[type]} {typeLabels[type]} ({items!.length})
              </p>
              <div className="flex flex-col gap-2">
                {items!.map((item) => (
                  <div
                    key={item!.id}
                    className="bg-[var(--card)] rounded-xl border border-[var(--border)] px-4 py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide">{type}</p>
                      <p className="text-sm font-medium text-[var(--foreground)] mt-0.5">
                        {item!.item_id.slice(0, 8)}…
                      </p>
                    </div>
                    <span className="text-[var(--muted-foreground)] text-sm">→</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
