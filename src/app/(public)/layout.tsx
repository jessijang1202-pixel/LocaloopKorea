"use client";

import { usePathname } from "next/navigation";
import { AppNav } from "@/components/layout/AppNav";
import { PageHeader } from "@/components/layout/PageHeader";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMapPage = pathname === "/map";

  return (
    <div className="app-container">
      <AppNav />
      {!isMapPage && <PageHeader />}
      <div className={isMapPage ? "ll-content-map" : "ll-content"}>{children}</div>
    </div>
  );
}
