import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { TopBar } from "@/components/layout/TopBar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { LogoutButton } from "./LogoutButton";

export default async function ProfilePage() {
  if (!isSupabaseConfigured()) {
    return (
      <PageWrapper>
        <TopBar title="My Profile" />
        <div className="flex flex-col items-center pt-10 px-6 text-center gap-3">
          <div className="text-4xl">🔌</div>
          <h2 className="font-bold text-base text-[var(--foreground)]">Connect Supabase to see your profile</h2>
          <p className="text-sm text-[var(--muted-foreground)] max-w-[260px] leading-relaxed">
            Add your Supabase URL and anon key to <code className="bg-[var(--muted)] px-1 rounded">.env.local</code> to enable auth and profiles.
          </p>
          <Link href="/home" className="mt-2 text-sm text-[var(--primary)] font-semibold">← Back to home</Link>
        </div>
      </PageWrapper>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      id, display_name, avatar_url, bio, user_type, nationality, languages, language_goal, created_at,
      region:regions(name_en),
      interests:user_interests(interest:interests(id, name_en, icon))
    `)
    .eq("id", user.id)
    .single();

  const interests = ((profile?.interests as unknown as { interest: { id: string; name_en: string; icon: string } | null }[]) ?? [])
    .map((i) => i.interest)
    .filter(Boolean) as { id: string; name_en: string; icon: string }[];

  const region = (profile?.region as unknown as { name_en: string }) ?? null;

  return (
    <PageWrapper>
      <TopBar
        title="My Profile"
        right={
          <Link href="/profile/edit" className="text-sm font-medium text-[var(--primary)]">
            Edit
          </Link>
        }
      />

      {/* Profile header */}
      <div className="flex flex-col items-center pt-6 pb-5 px-4">
        <Avatar name={profile?.display_name ?? "You"} src={profile?.avatar_url} size="xl" />
        <h1 className="text-xl font-bold text-[var(--foreground)] mt-3">
          {profile?.display_name ?? "Your Name"}
        </h1>
        {region && (
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">📍 {region.name_en}</p>
        )}
        <div className="flex gap-2 mt-3">
          {profile?.user_type && (
            <Badge variant={profile.user_type === "foreigner" ? "primary" : "success"} size="md">
              {profile.user_type === "foreigner" ? "Foreigner" : "Korean"}
            </Badge>
          )}
          {profile?.nationality && <Badge size="md">🌍 {profile.nationality}</Badge>}
        </div>
      </div>

      {profile?.bio && (
        <div className="px-4 mb-5">
          <p className="text-sm text-[var(--foreground)] leading-relaxed text-center">{profile.bio}</p>
        </div>
      )}

      {/* Quick links */}
      <div className="mx-4 mb-5 rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--card)]">
        {[
          { href: "/saved", icon: "🔖", label: "Saved items" },
          { href: "/meetups", icon: "🤝", label: "My meetups" },
          { href: "/community", icon: "👥", label: "Community" },
          { href: "/settings", icon: "⚙️", label: "Settings" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 p-4 border-b border-[var(--border)] last:border-0 active:bg-[var(--muted)] transition-colors"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm font-medium text-[var(--foreground)]">{item.label}</span>
            <span className="ml-auto text-[var(--muted-foreground)] text-sm">→</span>
          </Link>
        ))}
      </div>

      {/* Interests */}
      {interests.length > 0 && (
        <div className="px-4 mb-5">
          <p className="text-xs font-semibold text-[var(--muted-foreground)] mb-2">Interests</p>
          <div className="flex flex-wrap gap-2">
            {interests.map((i) => (
              <Badge key={i.id} size="md">{i.icon} {i.name_en}</Badge>
            ))}
          </div>
        </div>
      )}

      {profile?.created_at && (
        <p className="px-4 pb-2 text-xs text-[var(--muted-foreground)] text-center">
          Member since {formatDate(profile.created_at)}
        </p>
      )}

      {/* Logout */}
      <div className="px-4 pb-6 pt-2">
        <LogoutButton />
      </div>
    </PageWrapper>
  );
}
