import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/utils";
import type { Meetup } from "@/types";

interface MeetupCardProps {
  meetup: Meetup;
  variant?: "card" | "list";
}

export function MeetupCard({ meetup, variant = "card" }: MeetupCardProps) {
  const isFull = meetup.status === "full" || meetup.current_count >= meetup.max_participants;

  if (variant === "list") {
    return (
      <Link href={`/meetups/${meetup.id}`} className="flex gap-3 p-4 border-b border-[var(--border)] last:border-0 active:bg-[var(--muted)] transition-colors">
        <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-[var(--muted)]">
          {meetup.image_url && (
            <Image src={meetup.image_url} alt={meetup.title} fill className="object-cover" sizes="64px" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--foreground)] line-clamp-1">{meetup.title}</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{formatDateTime(meetup.scheduled_at)}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-[var(--muted-foreground)]">
              {meetup.current_count}/{meetup.max_participants} going
            </span>
            <Badge variant={isFull ? "danger" : "success"} size="sm">
              {isFull ? "Full" : "Open"}
            </Badge>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/meetups/${meetup.id}`} className="block flex-shrink-0 w-64">
      <div className="bg-[var(--card)] rounded-2xl overflow-hidden border border-[var(--border)]">
        <div className="relative h-36 bg-[var(--muted)]">
          {meetup.image_url && (
            <Image src={meetup.image_url} alt={meetup.title} fill className="object-cover" sizes="256px" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute top-2 right-2">
            <Badge variant={isFull ? "danger" : "success"} size="sm">
              {isFull ? "Full" : "Open"}
            </Badge>
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white font-semibold text-sm line-clamp-2 leading-snug">{meetup.title}</p>
          </div>
        </div>
        <div className="p-3">
          <p className="text-xs text-[var(--muted-foreground)]">{formatDateTime(meetup.scheduled_at)}</p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-1 flex-wrap">
              {meetup.language_tags.slice(0, 2).map((lang) => (
                <Badge key={lang} size="sm">{lang}</Badge>
              ))}
            </div>
            <span className="text-xs text-[var(--muted-foreground)]">
              {meetup.current_count}/{meetup.max_participants}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
