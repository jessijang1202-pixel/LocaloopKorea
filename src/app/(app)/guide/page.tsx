"use client";

import { useState } from "react";
import { useLang } from "@/lib/lang";
import { useTheme } from "@/lib/theme";
import Link from "next/link";

// ── Shared helpers ──────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.02em", marginBottom: 12 }}>{title}</h2>
      {children}
    </div>
  );
}

function Card({ children, accent = false, dark = false }: { children: React.ReactNode; accent?: boolean; dark?: boolean }) {
  return (
    <div style={{
      background: accent
        ? dark
          ? "linear-gradient(160deg, var(--grade-dark) 0%, #2A1510 100%)"
          : "linear-gradient(135deg, rgba(255,86,54,0.08) 0%, rgba(255,86,54,0.04) 100%)"
        : "var(--card)",
      borderRadius: 16, padding: "16px",
      border: accent ? (dark ? "none" : "1px solid rgba(255,86,54,0.25)") : "1px solid var(--border)",
      boxShadow: accent && dark ? "0 4px 20px rgba(11,30,45,0.15)" : "0 1px 5px rgba(0,0,0,0.04)",
      marginBottom: 12,
    }}>
      {children}
    </div>
  );
}

function Callout({ color, children }: { color: "coral" | "yellow" | "red" | "blue" | "teal"; children: React.ReactNode }) {
  const map = {
    coral:  { bg: "rgba(255,86,54,0.06)", border: "rgba(255,86,54,0.2)",  text: "var(--grade-s)" },
    yellow: { bg: "#FFFDE7",              border: "#FFE082",               text: "#7A5000" },
    red:    { bg: "#FFF0F0",              border: "#FFCDD2",               text: "#7A1A1A" },
    blue:   { bg: "#E8F4FF",              border: "#90CAF9",               text: "#1A3A6E" },
    teal:   { bg: "#E8F9F9",              border: "#C0EDEF",               text: "#1A5C60" },
  };
  const c = map[color];
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 10, color: c.text, fontSize: 12, lineHeight: 1.65 }}>
      {children}
    </div>
  );
}

function RuleItem({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{
        width: 22, height: 22, borderRadius: "50%", flexShrink: 0, marginTop: 1,
        background: ok ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, color: ok ? "#16a34a" : "#dc2626", fontWeight: 700,
      }}>
        {ok ? "✓" : "✕"}
      </div>
      <p style={{ fontSize: 12, color: "var(--foreground)", lineHeight: 1.6 }}>{text}</p>
    </div>
  );
}

function RatingBadge({ r }: { r: "S" | "A" | "B" | "C" }) {
  const map = { S: { bg: "#D6F5F5", color: "#0B7A82" }, A: { bg: "#E8F4FF", color: "#1565C0" }, B: { bg: "#FFF9C4", color: "#A56000" }, C: { bg: "#F5F5F5", color: "#666" } };
  return <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 6, background: map[r].bg, color: map[r].color }}>{r}</span>;
}

function Tag({ label, color }: { label: string; color: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    teal: { bg: "#D6F5F5", text: "#0B7A82" }, blue: { bg: "#E8F4FF", text: "#1565C0" },
    green: { bg: "#F0FFF0", text: "#2E7D32" }, yellow: { bg: "#FFFDE7", text: "#A56000" },
  };
  const c = colors[color] ?? colors.teal;
  return <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: c.bg, color: c.text }}>{label}</span>;
}

function MockPlaceCard({ name, addr, rating, tags, selected = false }: { name: string; addr: string; rating: "S" | "A" | "B" | "C"; tags: { label: string; color: string }[]; selected?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 14, marginBottom: 6, background: selected ? "var(--card-selected)" : "var(--card)", border: selected ? "1.5px solid var(--grade-s)" : "1px solid var(--border)" }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--icon-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "var(--muted-foreground)", flexShrink: 0 }}>{rating}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)" }}>{name}</span>
          <RatingBadge r={rating} />
        </div>
        <p style={{ fontSize: 10, color: "var(--muted-foreground)", marginBottom: 3 }}>{addr}</p>
        <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>{tags.map((t, i) => <Tag key={i} {...t} />)}</div>
      </div>
    </div>
  );
}

function MockTaskRow({ stage, title, done }: { stage: string; title: string; done: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, background: "var(--card)", border: "1px solid var(--border)", marginBottom: 5 }}>
      <div style={{ width: 22, height: 22, borderRadius: "50%", background: done ? "var(--grade-s)" : "var(--icon-bg)", border: done ? "none" : "1.5px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {done && <span style={{ color: "#fff", fontSize: 11, fontWeight: 800 }}>✓</span>}
      </div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--foreground)" }}>{title}</p>
        <p style={{ fontSize: 9, color: "var(--grade-s)", fontWeight: 600 }}>{stage}</p>
      </div>
    </div>
  );
}

// ── 유저 가이드 탭 ──────────────────────────────────────────────────
function UserGuideTab({ isKo }: { isKo: boolean }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "20px 16px 80px" }}>

      <Section title={isKo ? "가장 먼저 — '나를 알려줘'를 채우세요" : "Start Here — Fill in 'About Me'"}>
        <Card accent dark>
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--grade-s)", marginBottom: 6 }}>{isKo ? "앱의 모든 추천이 여기서 시작됩니다" : "All recommendations start here"}</div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.65 }}>
            {isKo ? "'나를 알려줘'는 단순한 프로필이 아닙니다. 비자 종류, 한국어 수준, 관심사, 거주 기간을 입력하는 순간 AI가 장소 목록, 할 일 과제, 추천 코스, 모임 추천을 완전히 다르게 구성합니다."
              : "'About Me' is not just a profile. The moment you fill in your visa type, Korean level, interests, and length of stay — the AI completely reconfigs place rankings, tasks, courses, and community suggestions specifically for you."}
          </p>
        </Card>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, background: "var(--card)", borderRadius: 14, overflow: "hidden", border: "1px solid var(--border)" }}>
            <thead>
              <tr style={{ background: "var(--content-bg)" }}>
                <th style={{ padding: "9px 10px", textAlign: "left", color: "var(--muted-foreground)", fontWeight: 700, borderBottom: "1px solid var(--border)" }}>{isKo ? "내 설정" : "My Settings"}</th>
                <th style={{ padding: "9px 10px", textAlign: "left", color: "var(--muted-foreground)", fontWeight: 700, borderBottom: "1px solid var(--border)" }}>{isKo ? "AI가 바꾸는 것" : "What AI Changes"}</th>
              </tr>
            </thead>
            <tbody>
              {[
                { setting: isKo ? "비자 D-2 · 한국어 초급" : "Visa D-2 · Korean: Beginner", result: isKo ? "대학가 영어OK 카페, 학생 언어교환 모임 우선" : "Campus cafés with English menus, student language exchange groups first" },
                { setting: isKo ? "비자 E-7 · 한국어 중급" : "Visa E-7 · Korean: Intermediate", result: isKo ? "업무지구 맛집, 직장인 외국인 네트워킹 이벤트" : "Business district restaurants, expat professional networking events" },
                { setting: isKo ? "관심사: 요리" : "Interest: Cooking", result: isKo ? "로컬 식재료 시장, 쿠킹클래스 코스, 음식 모임" : "Local ingredient markets, cooking class courses, food meetups" },
                { setting: isKo ? "거주기간: 1주 미만" : "Stay: < 1 week", result: isKo ? "생존 필수 과제 최우선 (USIM, 교통카드, 은행)" : "Survival tasks first: USIM, T-money card, bank account" },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "9px 10px", fontWeight: 600, color: "var(--foreground)" }}>{row.setting}</td>
                  <td style={{ padding: "9px 10px", color: "var(--muted-foreground)", lineHeight: 1.5 }}>{row.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout color="teal">
          {isKo ? "'나를 알려줘'를 비워두면 AI는 '모든 외국인의 평균'으로 추천합니다. 당신만을 위한 피드를 원한다면 지금 바로 채워주세요."
            : "Leaving 'About Me' empty means the AI treats you as an average of all expats. For a feed tailored just to you, fill it in now."}
        </Callout>
        <Link href="/profile/me" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 0", borderRadius: 12, background: "var(--grade-s)", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
          {isKo ? "나를 알려줘 채우러 가기" : "Go Fill in About Me"}
        </Link>
      </Section>

      <Section title={isKo ? "8가지 카테고리" : "8 Categories"}>
        <p style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: 12 }}>
          {isKo ? "Localoop Korea의 모든 장소는 외국인 시각에서 재분류된 8개 카테고리로 나뉩니다."
            : "Every place in Localoop Korea falls into one of 8 categories, re-classified from a foreigner's perspective."}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { code: "CF", ko: "카페", en: "Café", desc: isKo ? "스페셜티·작업 가능·공부" : "Specialty, work-friendly, study" },
            { code: "RS", ko: "식당", en: "Restaurant", desc: isKo ? "한식부터 외국인 메뉴까지" : "Korean food to foreigner-friendly menus" },
            { code: "BR", ko: "바", en: "Bar", desc: isKo ? "혼술·라이브·루프탑" : "Solo drinking, live music, rooftops" },
            { code: "MK", ko: "시장", en: "Market", desc: isKo ? "재래시장·야시장·먹거리" : "Traditional, night markets, street food" },
            { code: "SH", ko: "쇼핑", en: "Shopping", desc: isKo ? "백화점·복합몰·편집숍" : "Dept stores, malls, concept stores" },
            { code: "AC", ko: "활동", en: "Activity", desc: isKo ? "체험·관광·운동·문화" : "Experiences, sightseeing, sports" },
            { code: "HL", ko: "건강", en: "Health", desc: isKo ? "병원·약국·클리닉·헬스장" : "Hospitals, clinics, pharmacies, gyms" },
            { code: "TR", ko: "교통", en: "Transport", desc: isKo ? "지하철·버스·KTX·공항" : "Subway, bus, KTX, airport access" },
          ].map((cat) => (
            <div key={cat.en} style={{ background: "var(--card)", borderRadius: 12, padding: "12px 10px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--grade-s)", marginBottom: 4 }}>{cat.code}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)", marginBottom: 2 }}>{isKo ? cat.ko : cat.en}</div>
              <div style={{ fontSize: 10, color: "var(--muted-foreground)", lineHeight: 1.4 }}>{cat.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={isKo ? "Localoop의 4가지 엔진" : "Localoop's 4 Engines"}>
        <p style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: 14 }}>
          {isKo ? "단순한 리뷰 앱이 아닙니다. 4개의 AI 엔진이 실시간으로 당신의 한국 생활을 분석하고 최적의 경험을 설계합니다."
            : "This isn't just a review app. Four AI engines analyze your Korea life in real time and design the optimal experience for you."}
        </p>
        {[
          {
            badge: "S/A", badgeBg: "#E8F9F9", badgeText: "#0B7A82",
            title: isKo ? "엔진 1: 친화성 평가 엔진" : "Engine 1: Friendliness Rating Engine",
            sub: "S / A / B / C 등급 시스템", subColor: "var(--grade-s)",
            body: isKo
              ? "Localoop 데이터팀이 직접 방문·검증한 데이터와 실제 외국인 사용자 피드백을 결합해 외국인 친화 지수를 4단계로 평가합니다."
              : "Localoop's data team combines on-site verification with real expat feedback to rate foreigner-friendliness in 4 tiers.",
          },
          {
            badge: "AI", badgeBg: "#E8F4FF", badgeText: "#1565C0",
            title: isKo ? "엔진 2: AI 코스 생성 엔진" : "Engine 2: AI Course Builder",
            sub: isKo ? "실제 현지인 동선 기반" : "Based on real local routes", subColor: "#1565C0",
            body: isKo
              ? "관광지가 아닌 현지인이 실제로 가는 동선을 분석합니다. 언어 수준·이동 거리·시간대를 반영해 외국인이 혼자서도 소화할 수 있는 코스를 자동 설계합니다."
              : "We analyze the routes locals actually take. Factoring in language level, distance, and time of day, the engine auto-designs courses a foreigner can handle solo.",
          },
          {
            badge: "TSK", badgeBg: "#FFF0E8", badgeText: "#B85C00",
            title: isKo ? "엔진 3: 개인 맞춤형 태스크 엔진" : "Engine 3: Personalized Task Engine",
            sub: isKo ? "비자 × 언어 × 거주기간 기반" : "Visa × Language × Length of Stay", subColor: "#B85C00",
            body: isKo
              ? "'나를 알려줘'에 입력한 비자 종류·한국어 수준·거주 기간을 분석해 지금 당신에게 가장 필요한 과제를 우선순위에 맞게 자동 배열합니다. D-2 학생이라면 장학금·언어교환이, E-7 직장인이라면 사대보험·세금 신고가 먼저 표시됩니다."
              : "By analyzing your visa type, Korean level, and length of stay from 'About Me', the engine automatically arranges your most urgent tasks in the right order. D-2 students see scholarship and language exchange first; E-7 workers see insurance registration and tax filing.",
          },
          {
            badge: "M", badgeBg: "#F0FFF0", badgeText: "#2E7D32",
            title: isKo ? "엔진 4: 커뮤니티 매칭 엔진" : "Engine 4: Community Matching Engine",
            sub: isKo ? "관심사 × 위치 × 언어 기반" : "Interest × Location × Language", subColor: "#2E7D32",
            body: isKo
              ? "한국인↔외국인 언어교환, 취미 모임, 동네 이웃 연결을 AI가 자동 매칭합니다."
              : "AI auto-matches Korean↔foreigner language exchanges, hobby meetups, and neighborhood connections.",
          },
        ].map((e) => (
          <Card key={e.badge}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: e.badgeBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: e.badgeText }}>{e.badge}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--foreground)" }}>{e.title}</div>
                <div style={{ fontSize: 10, color: e.subColor, fontWeight: 600 }}>{e.sub}</div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.6 }}>{e.body}</p>
          </Card>
        ))}
      </Section>

      <Section title={isKo ? "지도 — S/A/B/C 등급 완전 정복" : "Map — S/A/B/C Rating System"}>
        <Card>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)", marginBottom: 10 }}>{isKo ? "등급 기준표" : "Rating Criteria"}</div>
          {[
            { r: "S" as const, label: isKo ? "외국인 100% 환영" : "100% Foreigner-Friendly", criteria: isKo ? "영어 OK + 카드 OK + 혼자 OK" : "English OK + Card OK + Solo OK", color: "#0B7A82" },
            { r: "A" as const, label: isKo ? "편하게 이용 가능" : "Comfortable to Use",      criteria: isKo ? "영어 OK + 카드 OK" : "English OK + Card OK",                color: "#1565C0" },
            { r: "B" as const, label: isKo ? "기본 소통 가능" : "Basic Access OK",           criteria: isKo ? "카드 결제만 가능" : "Card payment only",                  color: "#A56000" },
            { r: "C" as const, label: isKo ? "현지 경험 도전" : "Full Local Challenge",      criteria: isKo ? "현금만 · 한국어만" : "Cash only · Korean only",           color: "#666" },
          ].map((item) => (
            <div key={item.r} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <RatingBadge r={item.r} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: item.color }}>{item.label}</div>
                <div style={{ fontSize: 10, color: "var(--muted-foreground)" }}>{item.criteria}</div>
              </div>
            </div>
          ))}
        </Card>
        <div style={{ background: "var(--content-bg)", borderRadius: 14, padding: "12px", border: "1px solid var(--border)", marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted-foreground)", marginBottom: 8, letterSpacing: "0.06em" }}>{isKo ? "▶ 예시 화면" : "▶ EXAMPLE SCREEN"}</div>
          <MockPlaceCard name={isKo ? "앤트러사이트 홍대" : "Anthracite Hongdae"} addr={isKo ? "서울 마포구 토정로5길 13" : "13 Tojeong-ro 5-gil, Mapo-gu"} rating="S" selected tags={[{ label: isKo ? "영어 OK" : "English OK", color: "teal" }, { label: isKo ? "카드 OK" : "Card OK", color: "blue" }, { label: isKo ? "혼자 OK" : "Solo OK", color: "green" }]} />
          <MockPlaceCard name={isKo ? "광장시장" : "Gwangjang Market"} addr={isKo ? "서울 종로구 창경궁로 88" : "88 Changgyeonggung-ro, Jongno-gu"} rating="C" tags={[{ label: isKo ? "현금 필요" : "Cash Only", color: "yellow" }]} />
        </div>
        <Callout color="yellow">
          {isKo ? "C등급은 나쁜 곳이 아닙니다. 광장시장처럼 현지인만 가는 보석 같은 장소가 많습니다. 한국어를 조금 배운 뒤 도전해보세요!"
            : "C-rating doesn't mean bad — places like Gwangjang Market are hidden gems loved by locals. Try them after picking up some Korean!"}
        </Callout>
      </Section>

      <Section title={isKo ? "Tasks — 한국 생활 단계별 로드맵" : "Tasks — Step-by-Step Korea Roadmap"}>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--foreground)", marginBottom: 10 }}>{isKo ? "5단계 정착 로드맵" : "5-Stage Settlement Roadmap"}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 14, overflowX: "auto" }}>
            {[{ ko: "도착", en: "Arrival", active: true }, { ko: "초기생활", en: "Early Life" }, { ko: "정착", en: "Settlement" }, { ko: "커뮤니티", en: "Community" }, { ko: "장기거주", en: "Long-term" }].map((stage, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                <div style={{ padding: "5px 8px", borderRadius: 8, background: stage.active ? "var(--grade-s)" : "var(--icon-bg)", color: stage.active ? "#fff" : "var(--muted-foreground)", fontSize: 9, fontWeight: 700 }}>
                  {i + 1}. {isKo ? stage.ko : stage.en}
                </div>
                {i < 4 && <div style={{ width: 10, height: 1, background: "var(--border)" }} />}
              </div>
            ))}
          </div>
          <MockTaskRow stage={isKo ? "도착" : "Arrival"} title={isKo ? "통신사 USIM 개통하기" : "Get a USIM card"} done={true} />
          <MockTaskRow stage={isKo ? "도착" : "Arrival"} title={isKo ? "교통카드(T-money) 발급" : "Get T-money transit card"} done={true} />
          <MockTaskRow stage={isKo ? "도착" : "Arrival"} title={isKo ? "외국인등록증 신청 (90일 이내)" : "Apply for Alien Registration Card"} done={false} />
          <MockTaskRow stage={isKo ? "초기생활" : "Early Life"} title={isKo ? "은행계좌 개설 (하나/신한 추천)" : "Open a bank account (KEB Hana / Shinhan)"} done={false} />
        </Card>
        <Callout color="blue">
          {isKo ? "비자 종류별로 과제 순서가 달라집니다. D-2(학생)는 장학금 신청이, E-7(전문직)는 사대보험 등록이 우선입니다."
            : "Task order changes by visa type. D-2 (student) gets scholarship applications first; E-7 (professional) gets insurance registration."}
        </Callout>
      </Section>

      <Section title={isKo ? "Community — 모임 & 매칭" : "Community — Meetups & Matching"}>
        <Card>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ background: "#E8F4FF", borderRadius: 12, padding: "10px", textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#1565C0", marginBottom: 4 }}>KR</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#1565C0" }}>{isKo ? "한국인" : "Korean"}</div>
              <div style={{ fontSize: 9, color: "#4A6467", marginTop: 3 }}>{isKo ? "영어 배우고 싶음" : "Wants to learn English"}</div>
            </div>
            <div style={{ textAlign: "center", fontSize: 20, color: "var(--grade-s)", fontWeight: 900 }}>⇄</div>
            <div style={{ background: "#E8F9F9", borderRadius: 12, padding: "10px", textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#0B7A82", marginBottom: 4 }}>EN</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#0B7A82" }}>{isKo ? "외국인" : "Foreigner"}</div>
              <div style={{ fontSize: 9, color: "#4A6467", marginTop: 3 }}>{isKo ? "한국어 배우고 싶음" : "Wants to learn Korean"}</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.65, marginTop: 10 }}>
            {isKo ? "AI가 관심사·언어 수준·위치를 분석해 가장 잘 맞을 사람을 먼저 보여줍니다." : "AI calculates match scores using interests, language level, and location to surface your best matches first."}
          </div>
        </Card>
        <Callout color="teal">
          {isKo ? "매칭 정확도를 높이려면 '나를 알려줘'에 취미·관심사를 최소 3개 이상 입력하세요." : "To improve match accuracy, add at least 3 hobbies/interests in 'About Me'."}
        </Callout>
      </Section>

      <div style={{ background: "linear-gradient(160deg, var(--grade-dark) 0%, #2A1510 100%)", borderRadius: 18, padding: "20px 16px", textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{isKo ? "지금 바로 시작하세요" : "Start Right Now"}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 16 }}>
          {isKo ? "가장 먼저 '나를 알려줘'를 채우면 Localoop이 당신만의 한국 생활 가이드가 됩니다" : "Fill in 'About Me' first and Localoop becomes your personal Korea life guide"}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/profile/me" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "11px 0", borderRadius: 12, background: "var(--grade-s)", color: "#fff", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>{isKo ? "나를 알려줘" : "About Me"}</Link>
          <Link href="/map" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "11px 0", borderRadius: 12, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>{isKo ? "지도 보기" : "Explore Map"}</Link>
        </div>
      </div>
    </div>
  );
}

// ── 문화 & 에티켓 탭 ────────────────────────────────────────────────
const ETIQUETTE_CATEGORIES = [
  { id: "all", ko: "전체", en: "All" },
  { id: "greeting", ko: "인사", en: "Greetings" },
  { id: "dining", ko: "식사", en: "Dining" },
  { id: "transport", ko: "교통", en: "Transport" },
  { id: "social", ko: "사회", en: "Social" },
  { id: "taboo", ko: "금기", en: "Taboos" },
];

function EtiquetteTab({ isKo, isDark }: { isKo: boolean; isDark: boolean }) {
  const [activeFilter, setActiveFilter] = useState("all");
  function show(cat: string) { return activeFilter === "all" || activeFilter === cat; }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      {/* Category chips */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none" }}>
          {ETIQUETTE_CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => setActiveFilter(cat.id)} style={{
              padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, flexShrink: 0,
              background: activeFilter === cat.id ? "var(--grade-s)" : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)",
              color: activeFilter === cat.id ? "#fff" : "var(--foreground-muted)",
              border: "none", cursor: "pointer",
            }}>
              {isKo ? cat.ko : cat.en}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "20px 16px 80px" }}>

        {show("greeting") && (
          <Section title={isKo ? "인사 & 기본 예절" : "Greetings & Basic Manners"}>
            <Card accent dark={isDark}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "var(--grade-s)", marginBottom: 6 }}>{isKo ? "인사의 나라 — 고개 숙임(절)이 핵심" : "The Bowing Nation — the bow is everything"}</div>
              <p style={{ fontSize: 13, color: "var(--foreground)", lineHeight: 1.65 }}>
                {isKo ? "한국에서는 처음 만나는 사람에게 가볍게 고개를 숙여 인사합니다. 15° 가벼운 인사, 30° 일반적 인사, 45° 깊은 감사나 사죄."
                  : "In Korea, you bow your head slightly when greeting someone new. 15° light acknowledgment, 30° standard greeting, 45° deep gratitude or apology."}
              </p>
            </Card>
            <Card>
              {[
                { ok: true,  ko: "어른(나이 많은 분)을 만나면 먼저 인사하세요",             en: "Greet elders (older people) first — always" },
                { ok: true,  ko: "두 손으로 물건을 받거나 드릴 때 예의 바르게 보입니다",    en: "Use both hands when giving or receiving things" },
                { ok: true,  ko: "'안녕하세요' 한마디만으로도 큰 호감을 얻습니다",           en: "Saying '안녕하세요' earns you instant goodwill" },
                { ok: false, ko: "악수할 때 한 손만 내밀면 무례하게 보일 수 있어요",        en: "Don't offer just one hand for a handshake" },
                { ok: false, ko: "어른 앞에서 먼저 자리에 앉거나 음식을 먹으면 실례입니다", en: "Don't sit down or start eating before elders do" },
              ].map((r, i) => <RuleItem key={i} ok={r.ok} text={isKo ? r.ko : r.en} />)}
            </Card>
            <Callout color="coral">
              {isKo ? "'감사합니다'와 '죄송합니다'만 알아도 웬만한 상황을 넘길 수 있습니다." : "'Gamsahamnida' (thank you) and 'Joesonghamnida' (I'm sorry) — learn these two and you'll handle most situations."}
            </Callout>
          </Section>
        )}

        {show("dining") && (
          <Section title={isKo ? "식당 & 식사 문화" : "Restaurant & Dining Culture"}>
            <Card>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--foreground)", marginBottom: 10 }}>{isKo ? "한국 식당의 규칙" : "Korean Restaurant Rules"}</div>
              {[
                { ok: true,  ko: "반찬은 무한 리필! 직원에게 '더 주세요'로 요청하세요",   en: "Side dishes (banchan) are free refills — ask for more anytime" },
                { ok: true,  ko: "식사 전 어른이 수저를 들기를 기다렸다가 함께 시작하세요", en: "Wait for the eldest to pick up chopsticks before you start eating" },
                { ok: true,  ko: "음식값은 보통 한 명이 전부 내는 문화",                   en: "One person often pays the whole bill — it rotates naturally" },
                { ok: false, ko: "수저를 밥그릇에 꽂아 두면 제사(장례) 연상으로 금기",     en: "Never stick chopsticks upright in rice — it resembles funeral rites" },
                { ok: false, ko: "어른보다 먼저 술잔을 마시는 건 실례입니다",               en: "Don't drink before elders — turn your head away when sipping" },
              ].map((r, i) => <RuleItem key={i} ok={r.ok} text={isKo ? r.ko : r.en} />)}
            </Card>
            <Callout color="yellow">
              {isKo ? "술자리 문화: 자신의 잔을 직접 채우지 않고 옆 사람이 채워줍니다. 마시기 싫을 땐 잔을 손으로 가볍게 덮으면 됩니다."
                : "Drinking culture: you don't pour for yourself — neighbors fill each other's glasses. To decline, lightly cover your glass with your hand."}
            </Callout>
          </Section>
        )}

        {show("transport") && (
          <Section title={isKo ? "대중교통 에티켓" : "Public Transport Etiquette"}>
            <Card>
              {[
                { ok: true,  ko: "노약자석은 비어 있어도 어른·임산부를 위해 비워두세요",   en: "Priority seats should stay empty even if available" },
                { ok: true,  ko: "지하철 안에서는 작게 말하거나 이어폰을 끼세요",           en: "Speak quietly or use earphones on the subway" },
                { ok: true,  ko: "타기 전에 내리는 사람이 다 내릴 때까지 기다리세요",       en: "Wait for passengers to exit before boarding" },
                { ok: false, ko: "지하철 안에서 음식을 먹으면 눈총을 받아요",               en: "Don't eat on the subway — it's frowned upon" },
                { ok: false, ko: "에스컬레이터에서 왼쪽은 서있는 줄, 오른쪽은 걷는 줄",   en: "Escalators: stand on the right, walk on the left (Seoul rule)" },
              ].map((r, i) => <RuleItem key={i} ok={r.ok} text={isKo ? r.ko : r.en} />)}
            </Card>
            <Callout color="blue">
              {isKo ? "버스 정류장에서 버스가 오면 손을 들어 신호를 보내야 합니다. 신호 없으면 버스가 그냥 지나칩니다!"
                : "At bus stops, you MUST wave your hand to signal the bus. If you don't, it may drive past!"}
            </Callout>
          </Section>
        )}

        {show("social") && (
          <Section title={isKo ? "사회생활 & 인간관계" : "Social Life & Relationships"}>
            <Card accent dark={isDark}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "var(--grade-s)", marginBottom: 6 }}>{isKo ? "나이와 직급이 중요한 나라" : "Age and rank matter a lot here"}</div>
              <p style={{ fontSize: 13, color: "var(--foreground)", lineHeight: 1.65 }}>
                {isKo ? "한국은 나이와 직급에 따라 언어(존댓말/반말)와 행동이 달라지는 문화입니다. 처음 만나는 사람에게는 항상 존댓말을 사용하세요."
                  : "In Korea, language and behavior shift based on age and rank. Always use formal speech (존댓말) with strangers."}
              </p>
            </Card>
            <Card>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--foreground)", marginBottom: 10 }}>{isKo ? "자주 받는 질문 — 무례한 게 아니에요!" : "Common Questions — Not Rude in Korean Culture!"}</div>
              {[
                { q: isKo ? "몇 살이에요?" : "How old are you?", a: isKo ? "한국은 나이로 호칭이 달라져서 나이를 묻는 것이 자연스럽습니다" : "Age determines speech levels — it's perfectly normal to ask" },
                { q: isKo ? "밥 먹었어요?" : "Have you eaten?", a: isKo ? "안부 인사예요. '네' 또는 '아직요' 정도로 답하면 됩니다" : "A casual greeting like 'How are you?' — just say yes or not yet" },
                { q: isKo ? "결혼은 했어요?" : "Are you married?", a: isKo ? "관심의 표현이에요. 불편하면 가볍게 웃으며 넘기면 됩니다" : "An expression of interest. Just smile and deflect if uncomfortable" },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--grade-s)", marginBottom: 3 }}>Q: {item.q}</div>
                  <div style={{ fontSize: 11, color: "var(--foreground-muted)", lineHeight: 1.5 }}>→ {item.a}</div>
                </div>
              ))}
            </Card>
          </Section>
        )}

        {show("taboo") && (
          <Section title={isKo ? "절대 피해야 할 것들" : "Things to Absolutely Avoid"}>
            <Callout color="red">
              {isKo ? "아래 행동들은 한국에서 심각한 실례 또는 금기로 여겨집니다. 꼭 기억하세요!" : "The following are considered seriously rude or taboo in Korea. Keep these in mind!"}
            </Callout>
            <Card>
              {[
                { ko: "빨간색 잉크로 이름을 쓰면 안 됩니다 — 죽음과 연관된 색으로 여깁니다",   en: "Never write someone's name in red ink — it's associated with death" },
                { ko: "숫자 '4'가 들어간 선물(예: 4개 묶음)은 불길하게 여깁니다",             en: "Avoid gifts in sets of 4 — the number 4 sounds like 'death' in Korean" },
                { ko: "집 안에서 신발을 신고 들어가면 안 됩니다. 반드시 벗으세요",             en: "Never wear shoes inside a Korean home — always remove them at the door" },
                { ko: "발로 문을 열거나 물건을 밀면 실례입니다",                              en: "Don't open doors or push things with your feet" },
                { ko: "큰 소리로 코를 풀면 시선이 집중됩니다. 화장실에서 하세요",              en: "Blowing your nose loudly in public attracts stares — do it in the restroom" },
              ].map((r, i) => <RuleItem key={i} ok={false} text={isKo ? r.ko : r.en} />)}
            </Card>
            <Callout color="yellow">
              {isKo ? "실수해도 괜찮아요! 대부분의 한국인은 외국인의 문화 차이를 이해합니다. 진심 어린 '죄송합니다'면 충분합니다."
                : "It's okay to make mistakes! Most Koreans understand cultural differences. A sincere '죄송합니다' goes a long way."}
            </Callout>
          </Section>
        )}

        {/* Quick Reference */}
        <div style={{ background: "var(--card)", borderRadius: 18, padding: "20px 16px", textAlign: "center", marginBottom: 8, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "var(--foreground)", marginBottom: 14 }}>{isKo ? "핵심 표현 빠른 참고" : "Key Phrases Quick Reference"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { ko: "안녕하세요", rom: "Annyeonghaseyo", en: "Hello" },
              { ko: "감사합니다", rom: "Gamsahamnida",   en: "Thank you" },
              { ko: "죄송합니다", rom: "Joesonghamnida", en: "I'm sorry" },
              { ko: "괜찮아요",   rom: "Gwaenchanayo",   en: "It's okay" },
              { ko: "잘 먹겠습니다", rom: "Jal meokgesseumnida", en: "I will eat well" },
              { ko: "잘 먹었습니다", rom: "Jal meogeosseumnida", en: "I ate well" },
            ].map((p) => (
              <div key={p.ko} style={{ background: "var(--content-bg)", borderRadius: 12, padding: "10px 8px", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--foreground)", marginBottom: 2 }}>{p.ko}</div>
                <div style={{ fontSize: 9, color: "var(--grade-s)", fontWeight: 600, marginBottom: 3 }}>{p.rom}</div>
                <div style={{ fontSize: 10, color: "var(--muted-foreground)" }}>{p.en}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 메인 페이지 ──────────────────────────────────────────────────────
export default function GuidePage() {
  const isKo = useLang();
  const isDark = useTheme() === "dark";
  const [tab, setTab] = useState<"user" | "etiquette">("user");

  return (
    <div className="ll-fullpage" style={{ display: "flex", flexDirection: "column", background: "var(--content-bg)" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(160deg, var(--grade-dark, #1a1230) 0%, #2A1510 100%)",
        paddingTop: 16, paddingBottom: 18, paddingInline: 20, flexShrink: 0,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--grade-s)", letterSpacing: "0.08em", marginBottom: 6 }}>LOCALOOP KOREA</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
          {isKo ? "가이드" : "Guide"}
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5, marginTop: 6 }}>
          {isKo ? "사용 방법과 한국 문화를 한번에" : "How to use Localoop + Korean culture tips"}
        </p>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", background: "var(--card)", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        {([
          { key: "user",      ko: "유저 가이드",  en: "User Guide" },
          { key: "etiquette", ko: "문화 & 에티켓", en: "Culture & Etiquette" },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1, padding: "12px 8px", border: "none", cursor: "pointer",
              background: "transparent",
              borderBottom: tab === t.key ? "2px solid var(--grade-s)" : "2px solid transparent",
              color: tab === t.key ? "var(--grade-s)" : "var(--foreground-muted)",
              fontSize: 13, fontWeight: tab === t.key ? 700 : 500,
            }}
          >
            {isKo ? t.ko : t.en}
          </button>
        ))}
      </div>

      {tab === "user"
        ? <UserGuideTab isKo={isKo} />
        : <EtiquetteTab isKo={isKo} isDark={isDark} />
      }
    </div>
  );
}
