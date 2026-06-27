"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/map",       label: "지도",      icon: "🗺️" },
  { href: "/places",   label: "Places",    icon: "📍" },
  { href: "/guides",   label: "Guides",    icon: "📋" },
  { href: "/meetups",  label: "Meetups",   icon: "🤝" },
  { href: "/home",     label: "홈",         icon: "🏠" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[var(--card)]/95 backdrop-blur-md border-t border-[var(--border)]">
      <div
        className="flex items-center justify-around px-1"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all min-w-[52px]",
                isActive
                  ? "text-[var(--primary)]"
                  : "text-[var(--muted-foreground)]"
              )}
            >
              <span className={cn("text-xl leading-none", isActive && "scale-110 transition-transform")}>
                {item.icon}
              </span>
              <span className={cn("text-[10px] font-medium", isActive && "font-semibold")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
