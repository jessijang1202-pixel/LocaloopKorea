"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/lib/lang";
import { TopActions } from "@/components/LangToggle";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

const MEETUPS = [
  {
    id: "m1",
    emoji: "💬",
    name: { en: "Korean–English Language Exchange", ko: "한국어·영어 언어 교환" },
    time: { en: "Tue 2pm · Itaewon Café", ko: "화요일 오후 2시 · 이태원 카페" },
    joined: 12,
    max: 15,
    tag: { en: "Language", ko: "언어" },
    tagColor: { bg: "#E8F4FF", color: "#1565C0" },
  },
  {
    id: "m2",
    emoji: "🍔",
    name: { en: "Itaewon Local Food Hangout", ko: "이태원 로컬 맛집 탐방" },
    time: { en: "Sun 5pm · Itaewon Station", ko: "일요일 오후 5시 · 이태원역" },
    joined: 8,
    max: 12,
    tag: { en: "Food", ko: "음식" },
    tagColor: { bg: "#FFF9C4", color: "#A56000" },
  },
  {
    id: "m3",
    emoji: "🎮",
    name: { en: "Board Game Night", ko: "보드게임 나이트" },
    time: { en: "Fri 7pm · Hongdae", ko: "금요일 오후 7시 · 홍대" },
    joined: 6,
    max: 10,
    tag: { en: "Fun", ko: "취미" },
    tagColor: { bg: "#EDE7F6", color: "#4527A0" },
  },
  {
    id: "m4",
    emoji: "📸",
    name: { en: "Street Photography Walk", ko: "거리 사진 산책" },
    time: { en: "Sat 10am · Bukchon", ko: "토요일 오전 10시 · 북촌" },
    joined: 5,
    max: 8,
    tag: { en: "Art", ko: "예술" },
    tagColor: { bg: "#E8F5E9", color: "#2E7D32" },
  },
];

const STATIC_PEOPLE = [
  {
    id: "sp1",
    initial: "S",
    color: "#15b6c1",
    name: "Sarah",
    flag: "🇺🇸",
    region: { en: "Itaewon", ko: "이태원" },
    level: { en: "Beginner Korean", ko: "초급 한국어" },
    tags: { en: ["Food", "Culture", "Language"], ko: ["음식", "문화", "언어"] },
  },
  {
    id: "sp2",
    initial: "민",
    color: "#FFD600",
    name: "민준",
    flag: "🇰🇷",
    region: { en: "Hannam", ko: "한남" },
    level: { en: "Fluent English", ko: "영어 능통" },
    tags: { en: ["Travel", "English Exchange"], ko: ["여행", "영어 교환"] },
  },
  {
    id: "sp3",
    initial: "Y",
    color: "#FF7043",
    name: "Yuki",
    flag: "🇯🇵",
    region: { en: "Gangnam", ko: "강남" },
    level: { en: "Daily Korean", ko: "생활 한국어" },
    tags: { en: ["K-pop", "Cafés"], ko: ["케이팝", "카페"] },
  },
];

const T = {
  ko: {
    title: "커뮤니티",
    meetup: "모임",
    people: "사람",
    join: "참여",
    joined: "참여 중",
    connect: "연결",
    spots: (n: number) => `${n}자리 남음`,
    newMeetup: "새 모임 만들기",
    peopleSub: "내 주변 로컬루퍼",
    noProfiles: "아직 아무도 없어요",
    loading: "불러오는 중...",
  },
  en: {
    title: "Community",
    meetup: "Meetup",
    people: "People",
    join: "Join",
    joined: "Joined",
    connect: "Connect",
    spots: (n: number) => `${n} spots left`,
    newMeetup: "Create a meetup",
    peopleSub: "Local loopers near you",
    noProfiles: "No one here yet",
    loading: "Loading...",
  },
};

type SupabaseProfile = {
  id: string;
  display_name: string | null;
  user_type: string | null;
  region: { name_en: string; name_ko: string } | null;
  interests: { interest: { name_en: string; icon: string } | null }[];
};

export default function CommunityPage() {
  const isKo = useLang();
  const [tab, setTab] = useState<"meetup" | "people">("meetup");
  const [joined, setJoined] = useState<Record<string, boolean>>({});
  const [profiles, setProfiles] = useState<SupabaseProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  useEffect(() => {
    if (tab !== "people" || !isSupabaseConfigured()) return;
    setLoadingProfiles(true);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoadingProfiles(false); return; }
      supabase
        .from("profiles")
        .select(`id, display_name, user_type,
          region:regions(name_en, name_ko),
          interests:user_interests(interest:interests(name_en, icon))`)
        .neq("id", user.id)
        .eq("onboarding_done", true)
        .limit(20)
        .then(({ data }) => {
          setProfiles((data ?? []) as unknown as SupabaseProfile[]);
          setLoadingProfiles(false);
        });
    });
  }, [tab]);

  const t = isKo ? T.ko : T.en;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      {/* Header */}
      <div style={{ background: "#0B1E2D", paddingTop: "calc(env(safe-area-inset-top, 0px) + 3px)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 14px 12px" }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
            Localoop<span style={{ color: "#15b6c1" }}>Korea</span>
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <TopActions />
            <button style={{
              background: "#15b6c1", border: "none", borderRadius: 20,
              padding: "5px 12px", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer",
            }}>
              + {t.newMeetup}
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", padding: "0 16px" }}>
          {(["meetup", "people"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                flex: 1, padding: "10px 0", background: "none", border: "none",
                borderBottom: tab === key ? "2px solid #15b6c1" : "2px solid transparent",
                color: tab === key ? "#15b6c1" : "rgba(255,255,255,0.35)",
                fontWeight: tab === key ? 700 : 400, fontSize: 13, cursor: "pointer",
              }}
            >
              {key === "meetup" ? t.meetup : t.people}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", background: "#F5F9FA", padding: "12px 14px 0" }}>
        {tab === "meetup" && (
          <>
            {MEETUPS.map((m) => {
              const isJoined = joined[m.id];
              const spotsLeft = m.max - m.joined;
              return (
                <div key={m.id} style={{
                  background: "#fff", borderRadius: 16, border: "1px solid #E0E8EA",
                  padding: "14px", marginBottom: 10, boxShadow: "0 1px 5px rgba(0,0,0,0.04)",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: "#F0FAFA",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22, flexShrink: 0,
                    }}>
                      {m.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#1A2B2C" }}>
                          {isKo ? m.name.ko : m.name.en}
                        </span>
                        <span style={{
                          fontSize: 9, fontWeight: 700,
                          padding: "2px 6px", borderRadius: 4,
                          background: m.tagColor.bg, color: m.tagColor.color, flexShrink: 0,
                        }}>
                          {isKo ? m.tag.ko : m.tag.en}
                        </span>
                      </div>
                      <p style={{ fontSize: 11, color: "#4A6467", marginBottom: 8 }}>
                        {isKo ? m.time.ko : m.time.en}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 11, color: "#9BB5B8" }}>
                          {m.joined}/{m.max} · {t.spots(spotsLeft)}
                        </span>
                        <button
                          onClick={() => setJoined((prev) => ({ ...prev, [m.id]: !isJoined }))}
                          style={{
                            padding: "5px 16px", borderRadius: 20,
                            border: isJoined ? "1.5px solid #15b6c1" : "none",
                            background: isJoined ? "#fff" : "#15b6c1",
                            color: isJoined ? "#15b6c1" : "#fff",
                            fontWeight: 700, fontSize: 11, cursor: "pointer",
                          }}
                        >
                          {isJoined ? t.joined : t.join}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {tab === "people" && (
          <>
            <p style={{ fontSize: 12, color: "#4A6467", marginBottom: 10 }}>{t.peopleSub}</p>
            {STATIC_PEOPLE.map((person) => (
              <PersonCard
                key={person.id}
                initial={person.initial}
                color={person.color}
                name={person.name}
                flag={person.flag}
                region={isKo ? person.region.ko : person.region.en}
                level={isKo ? person.level.ko : person.level.en}
                tags={isKo ? person.tags.ko : person.tags.en}
                connectLabel={t.connect}
              />
            ))}
            {loadingProfiles && (
              <p style={{ textAlign: "center", fontSize: 12, color: "#9BB5B8", padding: "12px 0" }}>
                {t.loading}
              </p>
            )}
            {!loadingProfiles && profiles.map((p) => {
              const region = p.region;
              const interests = p.interests
                .map((i) => i.interest).filter(Boolean) as { name_en: string; icon: string }[];
              const initial = (p.display_name ?? "?").charAt(0).toUpperCase();
              const isForeigner = p.user_type === "foreigner";
              return (
                <PersonCard
                  key={p.id}
                  initial={initial}
                  color={isForeigner ? "#15b6c1" : "#FFD600"}
                  name={p.display_name ?? "?"}
                  flag={isForeigner ? "🌏" : "🇰🇷"}
                  region={isKo ? (region?.name_ko ?? "") : (region?.name_en ?? "")}
                  level={isKo
                    ? (isForeigner ? "외국인 거주자" : "한국 현지인")
                    : (isForeigner ? "Foreigner" : "Korean Local")}
                  tags={interests.slice(0, 3).map((i) => `${i.icon} ${i.name_en}`)}
                  connectLabel={t.connect}
                />
              );
            })}
          </>
        )}
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}

function PersonCard({
  initial, color, name, flag, region, level, tags, connectLabel,
}: {
  initial: string; color: string; name: string; flag: string;
  region: string; level: string; tags: string[]; connectLabel: string;
}) {
  const [connected, setConnected] = useState(false);
  return (
    <div style={{
      background: "#fff", borderRadius: 16, border: "1px solid #E0E8EA",
      padding: "14px", marginBottom: 10,
      display: "flex", alignItems: "center", gap: 12,
      boxShadow: "0 1px 5px rgba(0,0,0,0.04)",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: "50%",
        background: color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, fontWeight: 800, color: "#fff", flexShrink: 0,
      }}>
        {initial}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1A2B2C" }}>{name}</span>
          <span>{flag}</span>
        </div>
        <p style={{ fontSize: 11, color: "#4A6467", marginBottom: 5 }}>
          {region} · {level}
        </p>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {tags.map((tag) => (
            <span key={tag} style={{
              fontSize: 9, fontWeight: 600,
              padding: "2px 6px", borderRadius: 4,
              background: "#F0FAFA", color: "#4A6467",
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <button
        onClick={() => setConnected((v) => !v)}
        style={{
          flexShrink: 0, padding: "6px 14px", borderRadius: 20,
          border: connected ? "1.5px solid #15b6c1" : "none",
          background: connected ? "#fff" : "#15b6c1",
          color: connected ? "#15b6c1" : "#fff",
          fontWeight: 700, fontSize: 11, cursor: "pointer",
        }}
      >
        {connected ? "✓" : connectLabel}
      </button>
    </div>
  );
}
