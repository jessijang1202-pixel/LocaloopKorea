import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { Profile } from "@/types";

interface UserCardProps {
  profile: Profile;
  showConnect?: boolean;
}

export function UserCard({ profile, showConnect = false }: UserCardProps) {
  return (
    <Link href={`/community/${profile.id}`} className="flex items-center gap-3 p-4 border-b border-[var(--border)] last:border-0 active:bg-[var(--muted)] transition-colors">
      <Avatar name={profile.display_name} src={profile.avatar_url} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--foreground)] line-clamp-1">{profile.display_name}</p>
        <p className="text-xs text-[var(--muted-foreground)] line-clamp-1 mt-0.5">
          {profile.region?.name_en ?? ""}
          {profile.nationality ? ` · ${profile.nationality}` : ""}
        </p>
        <div className="flex gap-1 mt-1.5 flex-wrap">
          <Badge variant={profile.user_type === "foreigner" ? "primary" : "success"} size="sm">
            {profile.user_type === "foreigner" ? "Foreigner" : "Korean"}
          </Badge>
          {profile.interests?.slice(0, 2).map((i) => (
            <Badge key={i.id} size="sm">{i.icon} {i.name_en}</Badge>
          ))}
        </div>
      </div>
      {showConnect && (
        <button className="flex-shrink-0 px-3 py-1.5 rounded-xl border border-[var(--primary)] text-[var(--primary)] text-xs font-semibold">
          Connect
        </button>
      )}
    </Link>
  );
}
