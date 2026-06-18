import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { PageWrapper } from "@/components/layout/PageWrapper";

const sections = [
  {
    title: "Account",
    items: [
      { label: "Edit profile", href: "/profile/edit", icon: "👤" },
      { label: "Saved items", href: "/saved", icon: "🔖" },
    ],
  },
  {
    title: "App",
    items: [
      { label: "Language", href: "/settings/language", icon: "🌐", value: "English" },
      { label: "Notifications", href: "/settings/notifications", icon: "🔔", value: "On" },
    ],
  },
  {
    title: "About",
    items: [
      { label: "Terms of service", href: "/settings/terms", icon: "📄" },
      { label: "Privacy policy", href: "/settings/privacy", icon: "🔒" },
      { label: "App version", icon: "📱", value: "1.0.0 MVP" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <PageWrapper>
      <TopBar title="Settings" showBack backHref="/profile" />

      <div className="flex flex-col gap-6 px-4 pt-4 pb-8">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-2 px-1">
              {section.title}
            </p>
            <div className="rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--card)]">
              {section.items.map((item) => {
                const content = (
                  <div className="flex items-center gap-3 p-4 border-b border-[var(--border)] last:border-0">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-medium text-[var(--foreground)] flex-1">{item.label}</span>
                    {"value" in item && item.value && (
                      <span className="text-xs text-[var(--muted-foreground)]">{item.value}</span>
                    )}
                    {"href" in item && item.href && (
                      <span className="text-[var(--muted-foreground)] text-sm">→</span>
                    )}
                  </div>
                );

                return "href" in item && item.href ? (
                  <Link key={item.label} href={item.href} className="block active:bg-[var(--muted)] transition-colors">
                    {content}
                  </Link>
                ) : (
                  <div key={item.label}>{content}</div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
