"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/lib/lang";
import { useTheme } from "@/lib/theme";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

const MEETUPS = [
  { id: "m1", emoji: "💬", name: { en: "Korean–English Language Exchange", ko: "한국어·영어 언어 교환" }, time: { en: "Tue 2pm · Itaewon Café", ko: "화요일 오후 2시 · 이태원 카페" }, joined: 12, max: 15, tag: { en: "Language", ko: "언어" }, tagColor: { bg: "#E8F4FF", color: "#1565C0" }, desc: { en: "Casual language exchange between Korean locals and foreigners. All levels welcome. We switch between Korean and English every 20 minutes.", ko: "한국인과 외국인의 캐주얼한 언어 교환 모임이에요. 레벨 무관 누구나 환영합니다. 20분마다 한국어/영어를 번갈아가며 대화합니다." }, location: { en: "Café ONION, Itaewon", ko: "이태원 카페 ONION" } },
  { id: "m2", emoji: "🍔", name: { en: "Itaewon Local Food Hangout", ko: "이태원 로컬 맛집 탐방" }, time: { en: "Sun 5pm · Itaewon Station", ko: "일요일 오후 5시 · 이태원역" }, joined: 8, max: 12, tag: { en: "Food", ko: "음식" }, tagColor: { bg: "#FFF9C4", color: "#A56000" }, desc: { en: "Explore Itaewon's best hidden restaurants together. We'll visit 2-3 spots and share food. Great way to discover local favorites with new friends.", ko: "이태원의 숨은 맛집을 함께 탐방해요. 2-3곳을 방문하며 음식을 나눠 먹어요. 새로운 친구와 로컬 맛집을 발견하기 좋은 기회예요." }, location: { en: "Itaewon Station Exit 4", ko: "이태원역 4번 출구" } },
  { id: "m3", emoji: "🎮", name: { en: "Board Game Night", ko: "보드게임 나이트" }, time: { en: "Fri 7pm · Hongdae", ko: "금요일 오후 7시 · 홍대" }, joined: 6, max: 10, tag: { en: "Fun", ko: "취미" }, tagColor: { bg: "#EDE7F6", color: "#4527A0" }, desc: { en: "Weekly board game night for expats and locals. No experience needed! We have over 50 games. Games explained in both Korean and English.", ko: "외국인과 한국인이 함께하는 주간 보드게임 나이트. 경험 불필요! 50가지 이상의 게임이 있어요. 한국어·영어로 설명해드립니다." }, location: { en: "Bored Games Café, Hongdae", ko: "홍대 보드게임 카페" } },
  { id: "m4", emoji: "📸", name: { en: "Street Photography Walk", ko: "거리 사진 산책" }, time: { en: "Sat 10am · Bukchon", ko: "토요일 오전 10시 · 북촌" }, joined: 5, max: 8, tag: { en: "Art", ko: "예술" }, tagColor: { bg: "#E8F5E9", color: "#2E7D32" }, desc: { en: "Morning walk through Bukchon Hanok Village with photography enthusiasts. All camera types welcome — DSLR, mirrorless, or smartphone.", ko: "사진 애호가들과 함께하는 북촌 한옥마을 아침 산책. DSLR, 미러리스, 스마트폰 모두 환영합니다." }, location: { en: "Bukchon Hanok Village", ko: "북촌 한옥마을" } },
];

const STATIC_PEOPLE = [
  { id: "sp1", initial: "S", color: "#15b6c1", name: "Sarah", flag: "🇺🇸", region: { en: "Itaewon", ko: "이태원" }, level: { en: "Beginner Korean", ko: "초급 한국어" }, tags: { en: ["Food", "Culture", "Language"], ko: ["음식", "문화", "언어"] }, bio: { en: "Moved to Seoul 3 months ago for work. Love exploring local food markets and learning Korean.", ko: "3달 전 직장 때문에 서울에 왔어요. 로컬 시장 탐방과 한국어 배우는 것을 좋아해요." } },
  { id: "sp2", initial: "민", color: "#FFD600", name: "민준", flag: "🇰🇷", region: { en: "Hannam", ko: "한남" }, level: { en: "Fluent English", ko: "영어 능통" }, tags: { en: ["Travel", "English Exchange"], ko: ["여행", "영어 교환"] }, bio: { en: "Korean local looking for English exchange partners. I can help you navigate Seoul in return!", ko: "영어 교환 파트너를 찾는 한국인이에요. 서울 생활 정착에 도움을 드릴게요!" } },
  { id: "sp3", initial: "Y", color: "#FF7043", name: "Yuki", flag: "🇯🇵", region: { en: "Gangnam", ko: "강남" }, level: { en: "Daily Korean", ko: "생활 한국어" }, tags: { en: ["K-pop", "Cafés"], ko: ["케이팝", "카페"] }, bio: { en: "Living in Seoul for 1 year. Big K-pop fan and always looking for new café recommendations!", ko: "서울 거주 1년차. 케이팝 덕후이고 새로운 카페 추천을 항상 찾고 있어요!" } },
];

const T = {
  ko: { meetup: "모임", people: "사람", join: "참여", joined: "참여 중", connect: "연결", spots: (n: number) => `${n}자리 남음`, newMeetup: "새 모임 만들기", peopleSub: "내 주변 로컬루퍼", loading: "불러오는 중...", participants: "참여자", location: "장소", about: "소개", searchPh: "검색...", noResults: "검색 결과가 없어요" },
  en: { meetup: "Meetup", people: "People", join: "Join", joined: "Joined", connect: "Connect", spots: (n: number) => `${n} spots left`, newMeetup: "Create a meetup", peopleSub: "Local loopers near you", loading: "Loading...", participants: "Participants", location: "Location", about: "About", searchPh: "Search...", noResults: "No results found" },
};

type SupabaseProfile = { id: string; display_name: string | null; user_type: string | null; region: { name_en: string; name_ko: string } | null; interests: { interest: { name_en: string; icon: string } | null }[] };

export default function CommunityPage() {
  const isKo = useLang();
  const isDark = useTheme() === "dark";
  const [tab, setTab] = useState<"meetup" | "people">("meetup");
  const [joined, setJoined] = useState<Record<string, boolean>>({});
  const [profiles, setProfiles] = useState<SupabaseProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [selectedMeetupId, setSelectedMeetupId] = useState("m1");
  const [selectedPersonId, setSelectedPersonId] = useState("sp1");
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (tab !== "people" || !isSupabaseConfigured()) return;
    setLoadingProfiles(true);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoadingProfiles(false); return; }
      supabase.from("profiles").select(`id, display_name, user_type, region:regions(name_en, name_ko), interests:user_interests(interest:interests(name_en, icon))`).neq("id", user.id).eq("onboarding_done", true).limit(20)
        .then(({ data }) => { setProfiles((data ?? []) as unknown as SupabaseProfile[]); setLoadingProfiles(false); });
    });
  }, [tab]);

  const t = isKo ? T.ko : T.en;
  const selectedMeetup = MEETUPS.find((m) => m.id === selectedMeetupId) ?? MEETUPS[0];
  const selectedPerson = STATIC_PEOPLE.find((p) => p.id === selectedPersonId) ?? STATIC_PEOPLE[0];

  function switchTab(newTab: "meetup" | "people") {
    setTab(newTab);
    setSearch("");
  }

  const filteredMeetups = MEETUPS.filter((m) => {
    if (!search) return true;
    const name = isKo ? m.name.ko : m.name.en;
    const tag = isKo ? m.tag.ko : m.tag.en;
    const q = search.toLowerCase();
    return name.toLowerCase().includes(q) || tag.toLowerCase().includes(q);
  });

  const filteredPeople = STATIC_PEOPLE.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const region = isKo ? p.region.ko : p.region.en;
    const tags = isKo ? p.tags.ko : p.tags.en;
    return p.name.toLowerCase().includes(q) || region.toLowerCase().includes(q) || tags.some((tg) => tg.toLowerCase().includes(q));
  });

  const searchBar = (
    <div style={{ background: "var(--content-bg)", borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 7 }}>
      <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>🔍</span>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t.searchPh}
        style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 12, color: "var(--foreground)" }}
      />
      {search && (
        <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "var(--muted-foreground)", cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1 }}>✕</button>
      )}
    </div>
  );

  const tabBar = (
    <div style={{ background: isDark ? "#0B1E2D" : "var(--card)", display: "flex", flexShrink: 0, borderBottom: isDark ? "none" : "1px solid var(--border)" }}>
      {(["meetup", "people"] as const).map((key) => (
        <button key={key} onClick={() => switchTab(key)} style={{ flex: 1, padding: "11px 0", background: "none", border: "none", borderBottom: tab === key ? "2px solid #15b6c1" : "2px solid transparent", color: tab === key ? "#15b6c1" : isDark ? "rgba(255,255,255,0.35)" : "var(--muted-foreground)", fontWeight: tab === key ? 700 : 400, fontSize: 13, cursor: "pointer" }}>
          {key === "meetup" ? t.meetup : t.people}
        </button>
      ))}
    </div>
  );

  const meetupList = (compact = false) => (
    <div style={compact ? { flex: 1, overflowY: "auto", minHeight: 0, background: "var(--content-bg)", padding: "10px 12px 0" } : { flex: 1, overflowY: "auto", background: "var(--content-bg)", padding: "12px 14px 0" }}>
      <button style={{ width: "100%", marginBottom: 10, padding: "11px 0", background: "#15b6c1", border: "none", borderRadius: 12, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
        + {t.newMeetup}
      </button>
      {filteredMeetups.length === 0 && <div style={{ textAlign: "center", padding: "30px 0", color: "var(--muted-foreground)", fontSize: 13 }}>{t.noResults}</div>}
      {filteredMeetups.map((m) => {
        const isJoined = joined[m.id];
        const spotsLeft = m.max - m.joined;
        const isSelected = m.id === selectedMeetupId;
        return (
          <div key={m.id} onClick={() => setSelectedMeetupId(m.id)} style={{ background: isSelected ? "var(--card-selected)" : "var(--card)", borderRadius: compact ? 12 : 16, border: isSelected ? "1.5px solid #15b6c1" : "1px solid var(--border)", padding: compact ? "12px" : "14px", marginBottom: 9, boxShadow: "0 1px 5px rgba(0,0,0,0.04)", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: compact ? 38 : 44, height: compact ? 38 : 44, borderRadius: 12, background: "var(--icon-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "var(--muted-foreground)", flexShrink: 0 }}>{(isKo ? m.tag.ko : m.tag.en).slice(0, 2)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2, flexWrap: "wrap" }}>
                  <span style={{ fontSize: compact ? 12 : 13, fontWeight: 700, color: "var(--foreground)" }}>{isKo ? m.name.ko : m.name.en}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: m.tagColor.bg, color: m.tagColor.color, flexShrink: 0 }}>{isKo ? m.tag.ko : m.tag.en}</span>
                </div>
                <p style={{ fontSize: 10, color: "var(--muted-foreground)", marginBottom: 7 }}>{isKo ? m.time.ko : m.time.en}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, color: "var(--muted-foreground)" }}>{m.joined}/{m.max} · {t.spots(spotsLeft)}</span>
                  <button onClick={(e) => { e.stopPropagation(); setJoined((prev) => ({ ...prev, [m.id]: !isJoined })); }} style={{ padding: "4px 12px", borderRadius: 20, border: isJoined ? "1.5px solid #15b6c1" : "none", background: isJoined ? "transparent" : "#15b6c1", color: isJoined ? "#15b6c1" : "#fff", fontWeight: 700, fontSize: 10, cursor: "pointer" }}>
                    {isJoined ? t.joined : t.join}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div style={{ height: 12 }} />
    </div>
  );

  const peopleList = (compact = false) => (
    <div style={compact ? { flex: 1, overflowY: "auto", minHeight: 0, background: "var(--content-bg)", padding: "10px 12px 0" } : { flex: 1, overflowY: "auto", background: "var(--content-bg)", padding: "12px 14px 0" }}>
      <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 10 }}>{t.peopleSub}</p>
      {filteredPeople.length === 0 && <div style={{ textAlign: "center", padding: "30px 0", color: "var(--muted-foreground)", fontSize: 13 }}>{t.noResults}</div>}
      {filteredPeople.map((person) => {
        const isSelected = person.id === selectedPersonId;
        return (
          <div key={person.id} onClick={() => setSelectedPersonId(person.id)} style={{ background: isSelected ? "var(--card-selected)" : "var(--card)", borderRadius: 12, border: isSelected ? "1.5px solid #15b6c1" : "1px solid var(--border)", padding: "12px", marginBottom: 9, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: person.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{person.initial}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)" }}>{person.name}</span>
              </div>
              <p style={{ fontSize: 10, color: "var(--muted-foreground)", marginBottom: 4 }}>{isKo ? person.region.ko : person.region.en} · {isKo ? person.level.ko : person.level.en}</p>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {(isKo ? person.tags.ko : person.tags.en).map((tag) => (
                  <span key={tag} style={{ fontSize: 8, fontWeight: 600, padding: "1px 5px", borderRadius: 4, background: "var(--icon-bg)", color: "var(--muted-foreground)" }}>{tag}</span>
                ))}
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setConnected((prev) => ({ ...prev, [person.id]: !prev[person.id] })); }} style={{ flexShrink: 0, padding: "5px 12px", borderRadius: 20, border: connected[person.id] ? "1.5px solid #15b6c1" : "none", background: connected[person.id] ? "transparent" : "#15b6c1", color: connected[person.id] ? "#15b6c1" : "#fff", fontWeight: 700, fontSize: 10, cursor: "pointer" }}>
              {connected[person.id] ? "✓" : t.connect}
            </button>
          </div>
        );
      })}
      {loadingProfiles && <p style={{ textAlign: "center", fontSize: 12, color: "#9BB5B8", padding: "12px 0" }}>{t.loading}</p>}
      {!loadingProfiles && profiles.map((p) => {
        const initial = (p.display_name ?? "?").charAt(0).toUpperCase();
        const isForeigner = p.user_type === "foreigner";
        const region = p.region;
        const interests = p.interests.map((i) => i.interest).filter(Boolean) as { name_en: string; icon: string }[];
        return (
          <div key={p.id} style={{ background: "var(--card)", borderRadius: 12, border: "1px solid var(--border)", padding: "12px", marginBottom: 9, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: isForeigner ? "#15b6c1" : "#FFD600", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{initial}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)" }}>{p.display_name ?? "?"}</span>
              </div>
              <p style={{ fontSize: 10, color: "var(--muted-foreground)", marginBottom: 4 }}>{isKo ? (region?.name_ko ?? "") : (region?.name_en ?? "")} · {isKo ? (isForeigner ? "외국인" : "한국인") : (isForeigner ? "Foreigner" : "Korean")}</p>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {interests.slice(0, 3).map((i) => <span key={i.name_en} style={{ fontSize: 8, fontWeight: 600, padding: "1px 5px", borderRadius: 4, background: "var(--icon-bg)", color: "var(--muted-foreground)" }}>{i.name_en}</span>)}
              </div>
            </div>
            <button style={{ flexShrink: 0, padding: "5px 12px", borderRadius: 20, border: "none", background: "#15b6c1", color: "#fff", fontWeight: 700, fontSize: 10, cursor: "pointer" }}>{t.connect}</button>
          </div>
        );
      })}
      <div style={{ height: 12 }} />
    </div>
  );

  const meetupDetail = () => {
    const isJoined = joined[selectedMeetup.id];
    const spotsLeft = selectedMeetup.max - selectedMeetup.joined;
    return (
      <div style={{ height: "100%", overflowY: "auto", background: "var(--content-bg)", padding: "32px 40px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "var(--icon-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "var(--muted-foreground)", flexShrink: 0 }}>{(isKo ? selectedMeetup.tag.ko : selectedMeetup.tag.en).slice(0, 2)}</div>
          <div>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 5, background: selectedMeetup.tagColor.bg, color: selectedMeetup.tagColor.color, display: "inline-block", marginBottom: 6 }}>{isKo ? selectedMeetup.tag.ko : selectedMeetup.tag.en}</span>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "var(--foreground)", lineHeight: 1.2 }}>{isKo ? selectedMeetup.name.ko : selectedMeetup.name.en}</h2>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          <div style={{ background: "var(--card)", borderRadius: 12, padding: "14px", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 10, color: "var(--muted-foreground)", marginBottom: 4 }}>{isKo ? "일정" : "When"}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>{isKo ? selectedMeetup.time.ko : selectedMeetup.time.en}</div>
          </div>
          <div style={{ background: "var(--card)", borderRadius: 12, padding: "14px", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 10, color: "var(--muted-foreground)", marginBottom: 4 }}>{t.location}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>{isKo ? selectedMeetup.location.ko : selectedMeetup.location.en}</div>
          </div>
        </div>
        <div style={{ background: "var(--card)", borderRadius: 14, padding: "16px 18px", border: "1px solid var(--border)", marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#15b6c1", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.about}</div>
          <p style={{ fontSize: 13, color: "var(--foreground)", lineHeight: 1.7 }}>{isKo ? selectedMeetup.desc.ko : selectedMeetup.desc.en}</p>
        </div>
        <div style={{ background: "var(--card)", borderRadius: 14, padding: "14px 18px", border: "1px solid var(--border)", marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#15b6c1", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.participants} ({selectedMeetup.joined}/{selectedMeetup.max})</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Array.from({ length: selectedMeetup.joined }).map((_, i) => (
              <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: ["#15b6c1", "#FFD600", "#FF7043", "#4527A0", "#2E7D32"][i % 5], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", fontWeight: 700 }}>
                {["S", "민", "Y", "J", "L", "K", "M", "A", "T", "R", "N", "P"][i % 12]}
              </div>
            ))}
            {spotsLeft > 0 && <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px dashed var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "var(--muted-foreground)" }}>+{spotsLeft}</div>}
          </div>
        </div>
        <button onClick={() => setJoined((prev) => ({ ...prev, [selectedMeetup.id]: !isJoined }))} style={{ width: "100%", padding: "14px 0", borderRadius: 14, border: isJoined ? "2px solid #15b6c1" : "none", background: isJoined ? "transparent" : "#15b6c1", color: isJoined ? "#15b6c1" : "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
          {isJoined ? `✓ ${t.joined}` : `+ ${t.join}`}
        </button>
      </div>
    );
  };

  const personDetail = () => {
    const person = selectedPerson;
    const isConn = connected[person.id];
    return (
      <div style={{ height: "100%", overflowY: "auto", background: "var(--content-bg)", padding: "32px 40px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: person.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{person.initial}</div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: "var(--foreground)" }}>{person.name}</span>
              <span style={{ fontSize: 20 }}>{person.flag}</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>{isKo ? person.region.ko : person.region.en} · {isKo ? person.level.ko : person.level.en}</p>
          </div>
        </div>
        <div style={{ background: "var(--card)", borderRadius: 14, padding: "16px 18px", border: "1px solid var(--border)", marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#15b6c1", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.about}</div>
          <p style={{ fontSize: 13, color: "var(--foreground)", lineHeight: 1.7 }}>{isKo ? person.bio.ko : person.bio.en}</p>
        </div>
        <div style={{ background: "var(--card)", borderRadius: 14, padding: "16px 18px", border: "1px solid var(--border)", marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#15b6c1", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>{isKo ? "관심사" : "Interests"}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(isKo ? person.tags.ko : person.tags.en).map((tag) => (
              <span key={tag} style={{ fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 20, background: "var(--icon-bg)", color: "var(--foreground)", border: "1px solid var(--border)" }}>{tag}</span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setConnected((prev) => ({ ...prev, [person.id]: !isConn }))} style={{ flex: 1, padding: "13px 0", borderRadius: 14, border: isConn ? "2px solid #15b6c1" : "none", background: isConn ? "transparent" : "#15b6c1", color: isConn ? "#15b6c1" : "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
            {isConn ? `✓ ${isKo ? "연결됨" : "Connected"}` : `🤝 ${t.connect}`}
          </button>
          <button style={{ flex: 1, padding: "13px 0", borderRadius: 14, border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            💬 {isKo ? "채팅" : "Chat"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ── Mobile layout ── */}
      <div className="ll-mobile-only" style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
        {tabBar}
        <div style={{ padding: "8px 14px 6px", background: "var(--card)", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          {searchBar}
        </div>
        <div style={{ flex: 1, overflowY: "auto", background: "var(--content-bg)", padding: "12px 14px 0" }}>
          {tab === "meetup" && (
            <>
              <button style={{ width: "100%", marginBottom: 12, padding: "12px 0", background: "#15b6c1", border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>+ {t.newMeetup}</button>
              {filteredMeetups.length === 0 && <div style={{ textAlign: "center", padding: "30px 0", color: "var(--muted-foreground)", fontSize: 13 }}>{t.noResults}</div>}
              {filteredMeetups.map((m) => {
                const isJoined = joined[m.id];
                const spotsLeft = m.max - m.joined;
                return (
                  <div key={m.id} style={{ background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)", padding: "14px", marginBottom: 10, boxShadow: "0 1px 5px rgba(0,0,0,0.04)" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--icon-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{m.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>{isKo ? m.name.ko : m.name.en}</span>
                          <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: m.tagColor.bg, color: m.tagColor.color }}>{isKo ? m.tag.ko : m.tag.en}</span>
                        </div>
                        <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 8 }}>{isKo ? m.time.ko : m.time.en}</p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{m.joined}/{m.max} · {t.spots(spotsLeft)}</span>
                          <button onClick={() => setJoined((prev) => ({ ...prev, [m.id]: !isJoined }))} style={{ padding: "5px 16px", borderRadius: 20, border: isJoined ? "1.5px solid #15b6c1" : "none", background: isJoined ? "transparent" : "#15b6c1", color: isJoined ? "#15b6c1" : "#fff", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
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
              <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 10 }}>{t.peopleSub}</p>
              {filteredPeople.length === 0 && <div style={{ textAlign: "center", padding: "30px 0", color: "var(--muted-foreground)", fontSize: 13 }}>{t.noResults}</div>}
              {filteredPeople.map((person) => (
                <PersonCard key={person.id} initial={person.initial} color={person.color} name={person.name} flag={person.flag} region={isKo ? person.region.ko : person.region.en} level={isKo ? person.level.ko : person.level.en} tags={isKo ? person.tags.ko : person.tags.en} connectLabel={t.connect} />
              ))}
              {loadingProfiles && <p style={{ textAlign: "center", fontSize: 12, color: "#9BB5B8", padding: "12px 0" }}>{t.loading}</p>}
            </>
          )}
          <div style={{ height: 16 }} />
        </div>
      </div>

      {/* ── PC split layout ── */}
      <div className="ll-pc-only ll-split">
        <div className="ll-split-panel">
          <div className="ll-split-panel-sticky" style={{ padding: 0 }}>
            {tabBar}
            <div style={{ padding: "8px 12px 6px" }}>{searchBar}</div>
          </div>
          {tab === "meetup" ? meetupList(true) : peopleList(true)}
        </div>
        <div className="ll-split-main">
          {tab === "meetup" ? meetupDetail() : personDetail()}
        </div>
      </div>
    </>
  );
}

function PersonCard({ initial, color, name, flag, region, level, tags, connectLabel }: { initial: string; color: string; name: string; flag: string; region: string; level: string; tags: string[]; connectLabel: string }) {
  const [connected, setConnected] = useState(false);
  return (
    <div style={{ background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)", padding: "14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 5px rgba(0,0,0,0.04)" }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{initial}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>{name}</span>
          <span>{flag}</span>
        </div>
        <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 5 }}>{region} · {level}</p>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {tags.map((tag) => <span key={tag} style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "var(--icon-bg)", color: "var(--muted-foreground)" }}>{tag}</span>)}
        </div>
      </div>
      <button onClick={() => setConnected((v) => !v)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 20, border: connected ? "1.5px solid #15b6c1" : "none", background: connected ? "transparent" : "#15b6c1", color: connected ? "#15b6c1" : "#fff", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
        {connected ? "✓" : connectLabel}
      </button>
    </div>
  );
}
