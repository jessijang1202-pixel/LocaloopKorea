import { AppNav } from "@/components/layout/AppNav";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-container">
      <AppNav />
      <div className="ll-content">{children}</div>
    </div>
  );
}
