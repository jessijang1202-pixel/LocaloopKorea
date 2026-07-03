import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import Link from "next/link";

const TYPE_LABELS: Record<string, { ko: string; en: string; icon: string }> = {
  place:      { ko: "장소",    en: "Places",     icon: "📍" },
  guide:      { ko: "가이드",  en: "Guides",     icon: "📖" },
  meetup:     { ko: "모임",    en: "Meetups",    icon: "🤝" },
  restaurant: { ko: "음식점",  en: "Restaurants",icon: "🍽️" },
  menu:       { ko: "메뉴",    en: "Food & Menus",icon: "🍜" },
};

export default async function SavedPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div style={{ background: "var(--content-bg)", minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", gap: 12 }}>
        <div style={{ fontSize: 40, lineHeight: 1 }}>🔌</div>
        <p style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)", textAlign: "center" }}>Connect Supabase to use Saved</p>
        <p style={{ fontSize: 13, color: "var(--foreground-muted)", textAlign: "center" }}>Bookmarks are stored in your Supabase account</p>
      </div>
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

  return (
    <div style={{ background: "var(--content-bg)", minHeight: "100%", padding: "20px 16px 40px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--grade-s)", letterSpacing: "0.08em", marginBottom: 4 }}>
          LOCALOOP KOREA
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--foreground)", letterSpacing: "-0.03em" }}>
          저장된 항목 · Saved
        </h1>
      </div>

      {(saved ?? []).length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", gap: 12, textAlign: "center" }}>
          <div style={{ fontSize: 48, lineHeight: 1 }}>🔖</div>
          <p style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>저장된 항목이 없어요</p>
          <p style={{ fontSize: 13, color: "var(--foreground-muted)", lineHeight: 1.6 }}>
            장소, 가이드, 맛집, 모임을<br />저장해 보세요
          </p>
          <Link
            href="/map"
            style={{
              marginTop: 8, padding: "10px 24px", borderRadius: 999,
              background: "var(--grade-s)", color: "#fff",
              fontSize: 13, fontWeight: 700, textDecoration: "none",
              boxShadow: "0 4px 16px rgba(255,86,54,0.3)",
            }}
          >
            탐색하기 · Explore
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {Object.entries(grouped).map(([type, items]) => {
            const info = TYPE_LABELS[type] ?? { ko: type, en: type, icon: "📌" };
            return (
              <div key={type}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <span style={{ fontSize: 16 }}>{info.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)" }}>
                    {info.ko} · {info.en}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--foreground-muted)", fontWeight: 500 }}>({items!.length})</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {items!.map((item) => (
                    <div
                      key={item!.id}
                      style={{
                        background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)",
                        padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 600, color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{type}</p>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>
                          {item!.item_id.slice(0, 8)}…
                        </p>
                      </div>
                      <span style={{ color: "var(--grade-s)", fontSize: 18, lineHeight: 1 }}>›</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
