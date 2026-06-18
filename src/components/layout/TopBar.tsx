import Link from "next/link";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  backHref?: string;
  right?: React.ReactNode;
  transparent?: boolean;
  className?: string;
}

export function TopBar({
  title,
  showBack = false,
  backHref,
  right,
  transparent = false,
  className,
}: TopBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex items-center justify-between h-14 px-4",
        !transparent && "bg-[var(--background)]/95 backdrop-blur-md border-b border-[var(--border)]",
        transparent && "absolute top-0 left-0 right-0",
        className
      )}
    >
      <div className="w-8">
        {showBack && (
          <Link
            href={backHref ?? ".."}
            className="text-[var(--foreground)] text-sm font-medium"
          >
            ←
          </Link>
        )}
      </div>
      {title && (
        <h1 className="text-base font-bold text-[var(--foreground)] absolute left-1/2 -translate-x-1/2">
          {title}
        </h1>
      )}
      <div className="w-8 flex justify-end">{right}</div>
    </header>
  );
}
