import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { SpiceIndicator } from "@/components/ui/SpiceIndicator";
import type { Menu } from "@/types";

interface FoodCardProps {
  menu: Menu;
}

export function FoodCard({ menu }: FoodCardProps) {
  return (
    <Link href={`/food/${menu.slug}`} className="block flex-shrink-0 w-48">
      <div className="bg-[var(--card)] rounded-2xl overflow-hidden border border-[var(--border)]">
        <div className="relative h-32 bg-[var(--muted)]">
          {menu.image_url && (
            <Image src={menu.image_url} alt={menu.name_en} fill className="object-cover" sizes="192px" />
          )}
        </div>
        <div className="p-3">
          <p className="font-semibold text-sm text-[var(--foreground)] line-clamp-1">{menu.name_en}</p>
          <p className="text-xs text-[var(--muted-foreground)] line-clamp-1 mt-0.5">{menu.name_ko}</p>
          <div className="flex items-center justify-between mt-2">
            <SpiceIndicator level={menu.spice_level} showLabel={false} />
            {menu.vegetarian && <Badge variant="success" size="sm">Veg</Badge>}
          </div>
          {menu.price_range && (
            <p className="text-xs text-[var(--muted-foreground)] mt-1">{menu.price_range}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
