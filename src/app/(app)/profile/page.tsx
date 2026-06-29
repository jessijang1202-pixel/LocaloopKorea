"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { useLang } from "@/lib/lang";
import { PageHeader } from "@/components/layout/PageHeader";

const T = {
  ko: {
    title: "마이페이지",
    places: "방문 장소",
    courses: "완료 코스",
    connections: "연결",
    tasksDone: "과제 완료",
    level: "로컬 내기",
    levelSub: "다음 레벨까지 3개 더 방문",
    activity: "활동",
    visited: "방문한 장소",
    completed: "완료한 코스",
    joined: "참여한 모임",
    settings: "설정",
    editProfile: "프로필 편집",
    aboutMe: "나를 알려주세요",
    language: "언어 설정",
    notifications: "알림 설정",
    logout: "로그아웃",
    loading: "불러오는 중...",
    guest: "게스트",
    foreigner: "외국인 거주자",
    korean: "한국 현지인",
  },
  en: {
    title: "My Page",
    places: "Places",
    courses: "Courses",
    connections: "Connections",
    tasksDone: "Tasks Done",
    level: "Local Newbie",
    levelSub: "3 more places to next level",
    activity: "Activity",
    visited: "Places Visited",
    completed: "Courses Completed",
    joined: "Meetups Joined",
    settings: "Settings",
    editProfile: "Edit Profile",
    aboutMe: "About Me",
    language: "Language",
    notifications: "Notifications",
    logout: "Log out",
    loading: "Loading...",
    guest: "Guest",
    foreigner: "Foreigner",
    korean: "Korean Local",
  },
};

const STATS = [
  { key: "places", value: 12 },
  { key: "courses", value: 3 },
  { key: "connections", value: 8 },
  { key: "tasksDone", value: 5 },
] as const;

const ACTIVITY_ROWS = [
  { icon: "📍", key: "visited", count: 12 },
  { icon: "🏃", key: "completed", count: 3 },
  { icon: "👥", key: "joined", count: 2 },
] as const;

const SETTING_ROWS = [
  { icon: "✏️", key: "editProfile", href: "/profile/edit" },
  { icon: "🙋", key: "aboutMe", href: "/profile/me" },
  { icon: "🌐", key: "language", href: "#" },
  { icon: "🔔", key: "notifications", href: "#" },
] as const;

type ProfileData = {
  display_name: string | null;
  user_type: string | null;
  nationality: string | null;
  avatar_url: string | null;
};

export default function ProfilePage() {
  const isKo = useLang();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      supabase
        .from("profiles")
        .select("display_name, user_type, nationality, avatar_url")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          setProfile(data);
          setLoading(false);
        });
    });
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const t = isKo ? T.ko : T.en;

  const displayName = profile?.display_name ?? t.guest;
  const initial = displayName.charAt(0).toUpperCase();
  const userTypeLabel = profile?.user_type === "foreigner" ? t.foreigner
    : profile?.user_type === "korean" ? t.korean
    : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      {/* Header */}
      <PageHeader />

      {/* Profile info section */}
      <div style={{ background: "#0B1E2D", paddingBottom: 20, flexShrink: 0 }}>
        {/* Avatar + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px 16px" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "#FFD600",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 800, color: "#1A2B2C",
            border: "2px solid rgba(255,255,255,0.2)",
          }}>
            {loading ? "…" : initial}
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 3 }}>
              {loading ? t.loading : displayName}
            </p>
            {userTypeLabel && (
              <span style={{
                fontSize: 10, fontWeight: 700,
                padding: "2px 8px", borderRadius: 20,
                background: "rgba(21,182,193,0.2)", color: "#15b6c1",
              }}>
                {userTypeLabel}
              </span>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", padding: "0 12px" }}>
          {STATS.map(({ key, value }) => (
            <div key={key} style={{ flex: 1, textAlign: "center", padding: "8px 4px" }}>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", marginTop: 3, lineHeight: 1.2 }}>
                {t[key]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Level progress */}
      <div style={{ background: "var(--card)", padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)" }}>
            ⭐ {t.level} Lv.2
          </span>
          <span style={{ fontSize: 10, color: "var(--muted-foreground)" }}>45%</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: "var(--border)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: "45%", borderRadius: 3, background: "linear-gradient(90deg, #15b6c1, #0B8A91)" }} />
        </div>
        <p style={{ fontSize: 10, color: "var(--muted-foreground)", marginTop: 5 }}>{t.levelSub}</p>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", background: "var(--content-bg)" }}>
        {/* Activity section */}
        <div style={{ background: "var(--card)", margin: "10px 14px", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden" }}>
          <div style={{ padding: "12px 14px 6px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {t.activity}
            </p>
          </div>
          {ACTIVITY_ROWS.map(({ icon, key, count }, i) => (
            <div key={key} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 14px",
              borderTop: i === 0 ? "none" : "1px solid var(--border)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <span style={{ fontSize: 13, color: "var(--foreground)" }}>{t[key]}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#15b6c1" }}>{count}</span>
            </div>
          ))}
        </div>

        {/* Settings section */}
        <div style={{ background: "var(--card)", margin: "0 14px 10px", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden" }}>
          <div style={{ padding: "12px 14px 6px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {t.settings}
            </p>
          </div>
          {SETTING_ROWS.map(({ icon, key, href }, i) => (
            <Link key={key} href={href} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 14px",
              borderTop: i === 0 ? "none" : "1px solid var(--border)",
              textDecoration: "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <span style={{ fontSize: 13, color: "var(--foreground)" }}>{t[key]}</span>
              </div>
              <span style={{ color: "var(--muted-foreground)", fontSize: 16 }}>›</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              width: "100%", padding: "12px 14px",
              borderTop: "1px solid var(--border)",
              background: "none", border: "none", cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 18 }}>🚪</span>
            <span style={{ fontSize: 13, color: "#EF4444", fontWeight: 600 }}>
              {loggingOut ? "…" : t.logout}
            </span>
          </button>
        </div>
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}
