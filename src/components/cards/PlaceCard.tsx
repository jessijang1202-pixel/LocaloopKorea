import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import type { Place } from "@/types";

interface PlaceCardProps {
  place: Place;
  compact?: boolean;
}

export function PlaceCard({ place, compact = false }: PlaceCardProps) {
  return (
    <Link href={`/places/${place.slug}`} className="block flex-shrink-0">
      <div className={`bg-[var(--card)] rounded-2xl overflow-hidden border border-[var(--border)] ${compact ? "w-44" : "w-56"}`}>
        <div className={`relative ${compact ? "h-28" : "h-36"} bg-[var(--muted)]`}>
          {place.image_url && (
            <Image
              src={place.image_url}
              alt={place.name_en}
              fill
              className="object-cover"
              sizes="224px"
            />
          )}
          <div className="absolute top-2 left-2">
            <Badge variant="primary" size="sm">{place.category}</Badge>
          </div>
        </div>
        <div className="p-3">
          <p className="font-semibold text-sm text-[var(--foreground)] line-clamp-1">{place.name_en}</p>
          <p className="text-xs text-[var(--muted-foreground)] line-clamp-1 mt-0.5">{place.name_ko}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {place.english_support && (
              <Badge size="sm">🇬🇧 English</Badge>
            )}
            {place.solo_friendly && (
              <Badge size="sm">👤 Solo OK</Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
