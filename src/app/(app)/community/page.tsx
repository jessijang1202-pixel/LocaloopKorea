import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { TopBar } from "@/components/layout/TopBar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";
import type { Profile } from "@/types";

export default async function CommunityPage() {
  if (!isSupabaseConfigured()) {
    return (
      <PageWrapper>
        <TopBar title="Community" />
        <EmptyState
          icon="🔌"
          title="Connect Supabase to see community"
          description="Real user profiles appear here once you connect your Supabase project"
        />
      </PageWrapper>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profiles } = await supabase
    .from("profiles")
    .select(`
      id, display_name, avatar_url, bio, user_type, nationality, languages,
      region:regions(id, name_en, name_ko),
      interests:user_interests(interest:interests(id, name_en, icon))
    `)
    .neq("id", user!.id)
    .eq("onboarding_done", true)
    .limit(30);

  const typedProfiles = (profiles ?? []).map((p) => ({
    ...p,
    region: (p.region as unknown as { id: string; name_en: string; name_ko: string }) ?? null,
    interests: ((p.interests as unknown as { interest: { id: string; name_en: string; icon: string } | null }[]) ?? [])
      .map((i) => i.interest)
      .filter(Boolean) as { id: string; name_en: string; icon: string }[],
  })) as unknown as Profile[];

  return (
    <PageWrapper>
      <TopBar title="Community" />

      <p className="px-4 pt-1 pb-4 text-sm text-[var(--muted-foreground)]">
        Find people near you
      </p>

      {typedProfiles.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No one here yet"
          description="Be the first to connect! Invite friends to join Localoop."
        />
      ) : (
        <div className="mx-4 rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--card)]">
          {typedProfiles.map((profile) => (
            <Link
              key={profile.id}
              href={`/community/${profile.id}`}
              className="flex items-center gap-3 p-4 border-b border-[var(--border)] last:border-0 active:bg-[var(--muted)] transition-colors"
            >
              <Avatar name={profile.display_name} src={profile.avatar_url} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--foreground)] line-clamp-1">
                  {profile.display_name}
                </p>
                <p className="text-xs text-[var(--muted-foreground)] line-clamp-1 mt-0.5">
                  {profile.region?.name_en ?? ""}
                  {profile.nationality ? ` · ${profile.nationality}` : ""}
                </p>
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  <Badge
                    variant={profile.user_type === "foreigner" ? "primary" : "success"}
                    size="sm"
                  >
                    {profile.user_type === "foreigner" ? "Foreigner" : "Korean"}
                  </Badge>
                  {profile.interests?.slice(0, 2).map((i) => (
                    <Badge key={i.id} size="sm">
                      {i.icon} {i.name_en}
                    </Badge>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
