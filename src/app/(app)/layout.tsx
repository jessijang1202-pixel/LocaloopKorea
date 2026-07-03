"use client";

import { usePathname } from "next/navigation";
import { AppNav } from "@/components/layout/AppNav";
import { PageHeader } from "@/components/layout/PageHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Full-bleed pages have their own hero/back-button — hide the shared PageHeader on mobile.
  // On PC, PageHeader is always hidden via .ll-page-header CSS, so this only matters for mobile.
  const isFullbleed = pathname.startsWith("/places/") || pathname.startsWith("/food/");

  return (
    <div className="app-container">
      <AppNav />
      {!isFullbleed && <PageHeader />}
      {/* Always use ll-content so the sidebar offset (margin-left: 168px) is applied on PC */}
      <div className="ll-content">{children}</div>
    </div>
  );
}
