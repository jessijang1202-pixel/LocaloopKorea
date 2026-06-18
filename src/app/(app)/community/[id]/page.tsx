import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { TopBar } from "@/components/layout/TopBar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ConnectButton } from "./ConnectButton";
import { formatDate } from "@/lib/utils";

interface UserProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return (
      <PageWrapper>
        <TopBar showBack backHref="/community" />
        <div className="flex flex-col items-center pt-10 px-6 text-center gap-3">
          <div className="text-4xl">🔌</div>
          <p className="text-sm text-[var(--muted-foreground)]">Connect Supabase to view user profiles.</p>
        </div>
      </PageWrapper>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      id, display_name, avatar_url, bio, user_type, nationality, languages, language_goal, created_at,
      region:regions(name_en, name_ko),
      interests:user_interests(interest:interests(id, name_en, name_ko, icon))
    `)
    .eq("id", id)
    .single();

  if (!profile) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const interests = ((profile.interests as unknown as { interest: { id: string; name_en: string; icon: string } | null }[]) ?? [])
    .map((i) => i.interest)
    .filter(Boolean) as { id: string; name_en: string; icon: string }[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const region = (profile.region as unknown as { name_en: string; name_ko: string }) ?? null;
  const isOwnProfile = user!.id === id;

  return (
    <PageWrapper>
      <TopBar showBack backHref="/community" />

      {/* Profile header */}
      <div className="flex flex-col items-center pt-6 pb-5 px-4">
        <Avatar name={profile.display_name} src={profile.avatar_url} size="xl" />
        <h1 className="text-xl font-bold text-[var(--foreground)] mt-3">{profile.display_name}</h1>
        {region && (
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            📍 {region.name_en}
          </p>
        )}

        <div className="flex gap-2 mt-3 flex-wrap justify-center">
          <Badge variant={profile.user_type === "foreigner" ? "primary" : "success"} size="md">
            {profile.user_type === "foreigner" ? "Foreigner" : "Korean"}
          </Badge>
          {profile.nationality && <Badge size="md">🌍 {profile.nationality}</Badge>}
        </div>

        {!isOwnProfile && (
          <div className="mt-4 w-full max-w-[200px]">
            <ConnectButton recipientId={id} />
          </div>
        )}
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="px-4 mb-5">
          <p className="text-sm text-[var(--foreground)] leading-relaxed text-center">{profile.bio}</p>
        </div>
      )}

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

      {/* Languages */}
      {profile.languages && profile.languages.length > 0 && (
        <div className="px-4 mb-5">
          <p className="text-xs font-semibold text-[var(--muted-foreground)] mb-2">Languages</p>
          <div className="flex flex-wrap gap-2">
            {profile.languages.map((lang: string) => (
              <Badge key={lang} size="md">💬 {lang}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Language goal */}
      {profile.language_goal && (
        <div className="mx-4 mb-5 p-4 rounded-xl bg-blue-50 border border-blue-200">
          <p className="text-xs font-bold text-blue-800 mb-1">Language goal</p>
          <p className="text-sm text-blue-700">{profile.language_goal}</p>
        </div>
      )}

      {/* Member since */}
      <p className="px-4 pb-4 text-xs text-[var(--muted-foreground)] text-center">
        Member since {formatDate(profile.created_at)}
      </p>
    </PageWrapper>
  );
}
