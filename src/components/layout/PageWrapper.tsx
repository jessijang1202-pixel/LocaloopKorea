import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  withBottomNav?: boolean;
  withTopBar?: boolean;
}

export function PageWrapper({
  children,
  className,
  withBottomNav = true,
}: PageWrapperProps) {
  return (
    <div
      className={cn(
        "min-h-dvh",
        withBottomNav && "pb-nav",
        className
      )}
    >
      {children}
    </div>
  );
}
