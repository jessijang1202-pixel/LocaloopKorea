import { cn } from "@/lib/utils";

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
  gap?: "sm" | "md";
  paddingX?: boolean;
}

export function HorizontalScroll({
  children,
  className,
  gap = "md",
  paddingX = true,
}: HorizontalScrollProps) {
  return (
    <div
      className={cn(
        "flex scroll-x",
        gap === "sm" && "gap-2",
        gap === "md" && "gap-3",
        paddingX && "px-4",
        className
      )}
    >
      {children}
    </div>
  );
}
