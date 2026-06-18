import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  href?: string;
  seeAllLabel?: string;
}

export function SectionHeader({ title, href, seeAllLabel = "See all" }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 mb-3">
      <h2 className="text-base font-bold text-[var(--foreground)]">{title}</h2>
      {href && (
        <Link
          href={href}
          className="text-xs font-medium text-[var(--primary)] flex items-center gap-0.5"
        >
          {seeAllLabel} →
        </Link>
      )}
    </div>
  );
}
