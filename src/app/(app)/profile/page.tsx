"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { useLang } from "@/lib/lang";

const T = {
  ko: { title: "마이페이지", places: "방문 장소", courses: "완료 코스", connections: "연결", tasksDone: "과제 완료", level: "로컬 내기", levelSub: "다음 레벨까지 3개 더 방문", activity: "활동", visited: "방문한 장소", completed: "완료한 코스", joined: "참여한 모임", settings: "설정", editProfile: "프로필 편집", aboutMe: "나를 알려주세요", language: "언어 설정", notifications: "알림 설정", logout: "로그아웃", loading: "불러오는 중...", guest: "게스트", foreigner: "외국인 거주자", korean: "한국 현지인" },
  en: { title: "My Page", places: "Places", courses: "Courses", connections: "Connections", tasksDone: "Tasks Done", level: "Local Newbie", levelSub: "3 more places to next level", activity: "Activity", visited: "Places Visited", completed: "Courses Completed", joined: "Meetups Joined", settings: "Settings", editProfile: "Edit Profile", aboutMe: "About Me", language: "Language", notifications: "Notifications", logout: "Log out", loading: "Loading...", guest: "Guest", foreigner: "Foreigner", korean: "Korean Local" },
};

const STATS = [{ key: "places", value: 12 }, { key: "courses", value: 3 }, { key: "connections", value: 8 }, { key: "tasksDone", value: 5 }] as const;
const ACTIVITY_ROWS = [{ key: "visited", count: 12 }, { key: "completed", count: 3 }, { key: "joined", count: 2 }] as const;
const SETTING_ROWS = [{ key: "editProfile", href: "/profile/edit" }, { key: "aboutMe", href: "/profile/me" }, { key: "language", href: "#" }, { key: "notifications", href: "#" }] as const;

type ProfileData = { display_name: string | null; user_type: string | null; nationality: string | null; avatar_url: string | null };

export default function ProfilePage() {
  const isKo = useLang();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeSection, setActiveSection] = useState<"activity" | "settings">("activity");

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      supabase.from("profiles").select("display_name, user_type, nationality, avatar_url").eq("id", user.id).single().then(({ data }) => { setProfile(data); setLoading(false); });
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
  const userTypeLabel = profile?.user_type === "foreigner" ? t.foreigner : profile?.user_type === "korean" ? t.korean : "";

  const profilePanel = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Avatar section */}
      <div style={{ background: "linear-gradient(160deg, #2A1208 0%, #1E0D06 100%)", padding: "24px 20px 20px", flexShrink: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--grade-s)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "#fff", border: "2px solid rgba(255,255,255,0.2)", marginBottom: 10 }}>
            {loading ? "…" : initial}
          </div>
          <p style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{loading ? t.loading : displayName}</p>
          {userTypeLabel && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "rgba(255,86,54,0.18)", color: "var(--grade-s)" }}>{userTypeLabel}</span>}
        </div>
        {/* Stats */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
          {STATS.map(({ key, value }) => (
            <div key={key} style={{ flex: 1, textAlign: "center", padding: "10px 4px", borderRight: "1px solid rgba(255,255,255,0.07)" }}>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: 8, color: "rgba(255,255,255,0.45)", marginTop: 3, lineHeight: 1.2 }}>{t[key]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Level */}
      <div style={{ background: "var(--card)", padding: "12px 16px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--foreground)" }}>{t.level} Lv.2</span>
          <span style={{ fontSize: 10, color: "var(--muted-foreground)" }}>45%</span>
        </div>
        <div style={{ height: 5, borderRadius: 3, background: "var(--border)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: "45%", borderRadius: 3, background: "linear-gradient(90deg, var(--grade-s), #c43e2a)" }} />
        </div>
        <p style={{ fontSize: 9, color: "var(--muted-foreground)", marginTop: 4 }}>{t.levelSub}</p>
      </div>

      {/* Section nav (PC only) */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        {(["activity", "settings"] as const).map((sec) => (
          <button key={sec} onClick={() => setActiveSection(sec)} style={{ flex: 1, padding: "10px 0", background: "none", border: "none", borderBottom: activeSection === sec ? "2px solid var(--grade-s)" : "2px solid transparent", color: activeSection === sec ? "var(--grade-s)" : "var(--muted-foreground)", fontWeight: activeSection === sec ? 700 : 400, fontSize: 12, cursor: "pointer" }}>
            {sec === "activity" ? t.activity : t.settings}
          </button>
        ))}
      </div>

      {/* Logout */}
      <div style={{ marginTop: "auto", padding: "12px 14px", borderTop: "1px solid var(--border)" }}>
        <button onClick={handleLogout} disabled={loggingOut} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", borderRadius: 10, background: "none", border: "1px solid var(--border)", cursor: "pointer" }}>
          <span style={{ fontSize: 13, color: "#EF4444", fontWeight: 600 }}>{loggingOut ? "…" : t.logout}</span>
        </button>
      </div>
    </div>
  );

  const activityAndSettings = (scrollable = false) => (
    <div style={scrollable ? { height: "100%", overflowY: "auto", background: "var(--content-bg)" } : { flex: 1, overflowY: "auto", background: "var(--content-bg)" }}>
      {/* Activity */}
      <div style={{ background: "var(--card)", margin: "16px 20px 12px", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ padding: "12px 16px 6px" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.activity}</p>
        </div>
        {ACTIVITY_ROWS.map(({ key, count }, i) => (
          <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: i === 0 ? "none" : "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, color: "var(--foreground)" }}>{t[key]}</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--grade-s)" }}>{count}</span>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div style={{ background: "var(--card)", margin: "0 20px 20px", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ padding: "12px 16px 6px" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.settings}</p>
        </div>
        {SETTING_ROWS.map(({ key, href }, i) => (
          <Link key={key} href={href} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: i === 0 ? "none" : "1px solid var(--border)", textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, color: "var(--foreground)" }}>{t[key]}</span>
            </div>
            <span style={{ color: "var(--muted-foreground)", fontSize: 16 }}>›</span>
          </Link>
        ))}
        <button onClick={handleLogout} disabled={loggingOut} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "12px 16px", borderTop: "1px solid var(--border)", background: "none", border: "none", cursor: "pointer" }}>
          <span style={{ fontSize: 13, color: "#EF4444", fontWeight: 600 }}>{loggingOut ? "…" : t.logout}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile layout ── */}
      <div className="ll-mobile-only" style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
        <div style={{ background: "linear-gradient(160deg, #2A1208 0%, #1E0D06 100%)", paddingBottom: 20, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px 16px" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--grade-s)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "#fff", border: "2px solid rgba(255,255,255,0.2)" }}>
              {loading ? "…" : initial}
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 3 }}>{loading ? t.loading : displayName}</p>
              {userTypeLabel && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "rgba(255,86,54,0.18)", color: "var(--grade-s)" }}>{userTypeLabel}</span>}
            </div>
          </div>
          <div style={{ display: "flex", padding: "0 12px" }}>
            {STATS.map(({ key, value }) => (
              <div key={key} style={{ flex: 1, textAlign: "center", padding: "8px 4px" }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>{t[key]}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "var(--card)", padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)" }}>{t.level} Lv.2</span>
            <span style={{ fontSize: 10, color: "var(--muted-foreground)" }}>45%</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: "var(--border)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: "45%", borderRadius: 3, background: "linear-gradient(90deg, var(--grade-s), #c43e2a)" }} />
          </div>
          <p style={{ fontSize: 10, color: "var(--muted-foreground)", marginTop: 5 }}>{t.levelSub}</p>
        </div>
        {activityAndSettings()}
      </div>

      {/* ── PC split layout ── */}
      <div className="ll-pc-only ll-split">
        <div className="ll-split-panel">
          {profilePanel}
        </div>
        <div className="ll-split-main">
          {activityAndSettings(true)}
        </div>
      </div>
    </>
  );
}
