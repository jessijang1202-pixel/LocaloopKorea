import Image from "next/image";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  xs: { container: "w-6 h-6", text: "text-[9px]" },
  sm: { container: "w-8 h-8", text: "text-xs" },
  md: { container: "w-10 h-10", text: "text-sm" },
  lg: { container: "w-14 h-14", text: "text-base" },
  xl: { container: "w-20 h-20", text: "text-xl" },
};

const bgColors = [
  "bg-orange-200 text-orange-800",
  "bg-blue-200 text-blue-800",
  "bg-green-200 text-green-800",
  "bg-purple-200 text-purple-800",
  "bg-yellow-200 text-yellow-800",
  "bg-pink-200 text-pink-800",
];

function getColor(name: string) {
  const idx = name.charCodeAt(0) % bgColors.length;
  return bgColors[idx];
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const { container, text } = sizeMap[size];

  if (src) {
    return (
      <div className={cn("relative rounded-full overflow-hidden flex-shrink-0", container, className)}>
        <Image src={src} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex-shrink-0 flex items-center justify-center font-semibold",
        container,
        text,
        getColor(name),
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
