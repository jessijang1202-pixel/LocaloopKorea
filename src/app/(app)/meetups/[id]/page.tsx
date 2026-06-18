import { notFound } from "next/navigation";
import Image from "next/image";
import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SEED_MEETUPS, SEED_REGIONS } from "@/data/seed";
import { formatDateTime } from "@/lib/utils";
import { JoinMeetupButton } from "./JoinMeetupButton";

interface MeetupDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MeetupDetailPage({ params }: MeetupDetailPageProps) {
  const { id } = await params;
  const meetup = SEED_MEETUPS.find((m) => m.id === id);

  if (!meetup) notFound();

  const region = SEED_REGIONS.find((r) => r.id === meetup.region_id);
  const isFull = meetup.status === "full" || meetup.current_count >= meetup.max_participants;
  const spotsLeft = meetup.max_participants - meetup.current_count;

  return (
    <PageWrapper>
      <TopBar showBack backHref="/meetups" transparent />

      {/* Hero */}
      <div className="relative h-64 bg-[var(--muted)]">
        {meetup.image_url && (
          <Image src={meetup.image_url} alt={meetup.title} fill className="object-cover" sizes="430px" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <Badge variant={isFull ? "danger" : "success"} size="md" className="mb-2">
            {isFull ? "Full" : `${spotsLeft} spots left`}
          </Badge>
          <h1 className="text-white font-bold text-xl leading-tight">{meetup.title}</h1>
        </div>
      </div>

      {/* Details */}
      <div className="px-4 py-4 flex flex-col gap-4">
        {/* Time and location */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">📅</span>
            <div>
              <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">When</p>
              <p className="text-sm font-semibold text-[var(--foreground)] mt-0.5">{formatDateTime(meetup.scheduled_at)}</p>
            </div>
          </div>
          {meetup.location_name && (
            <div className="flex items-start gap-3">
              <span className="text-xl mt-0.5">📍</span>
              <div>
                <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">Where</p>
                <p className="text-sm font-semibold text-[var(--foreground)] mt-0.5">{meetup.location_name}</p>
                {region && <p className="text-xs text-[var(--muted-foreground)]">{region.name_en}</p>}
              </div>
            </div>
          )}
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">👥</span>
            <div>
              <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">Participants</p>
              <p className="text-sm font-semibold text-[var(--foreground)] mt-0.5">
                {meetup.current_count} / {meetup.max_participants} going
              </p>
            </div>
          </div>
        </div>

        {/* Languages */}
        {meetup.language_tags.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[var(--muted-foreground)] mb-2">Languages</p>
            <div className="flex gap-1.5 flex-wrap">
              {meetup.language_tags.map((lang) => (
                <Badge key={lang} size="md">💬 {lang}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {meetup.tags.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[var(--muted-foreground)] mb-2">Tags</p>
            <div className="flex gap-1.5 flex-wrap">
              {meetup.tags.map((tag) => (
                <Badge key={tag} size="md">{tag}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {meetup.description && (
          <div>
            <p className="text-xs font-semibold text-[var(--muted-foreground)] mb-2">About this meetup</p>
            <p className="text-sm text-[var(--foreground)] leading-relaxed">{meetup.description}</p>
          </div>
        )}

        {/* Join button */}
        <JoinMeetupButton meetupId={meetup.id} isFull={isFull} />
      </div>
    </PageWrapper>
  );
}
