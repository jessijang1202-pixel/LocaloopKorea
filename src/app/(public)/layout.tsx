import { AppNav } from "@/components/layout/AppNav";
import { PageHeader } from "@/components/layout/PageHeader";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-container">
      <AppNav />
      <PageHeader />
      <div className="ll-content">{children}</div>
    </div>
  );
}
