"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang";

function RatingBadge({ r }: { r: "S" | "A" | "B" | "C" }) {
  const map = {
    S: { bg: "#D6F5F5", color: "#0B7A82" },
    A: { bg: "#E8F4FF", color: "#1565C0" },
    B: { bg: "#FFF9C4", color: "#A56000" },
    C: { bg: "#F5F5F5", color: "#666" },
  };
  return (
    <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 6, background: map[r].bg, color: map[r].color }}>
      {r}
    </span>
  );
}

function Tag({ label, color }: { label: string; color: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    teal:   { bg: "#D6F5F5", text: "#0B7A82" },
    blue:   { bg: "#E8F4FF", text: "#1565C0" },
    green:  { bg: "#F0FFF0", text: "#2E7D32" },
    yellow: { bg: "#FFFDE7", text: "#A56000" },
  };
  const c = colors[color] ?? colors.teal;
  return (
    <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: c.bg, color: c.text }}>
      {label}
    </span>
  );
}

function MockPlaceCard({ name, addr, rating, tags, selected = false }: {
  name: string; addr: string; rating: "S" | "A" | "B" | "C";
  tags: { label: string; color: string }[]; selected?: boolean;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 12px", borderRadius: 14, marginBottom: 6,
      background: selected ? "var(--card-selected)" : "var(--card)",
      border: selected ? "1.5px solid var(--grade-s)" : "1px solid var(--border)",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--icon-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "var(--muted-foreground)", flexShrink: 0 }}>
        {rating}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)" }}>{name}</span>
          <RatingBadge r={rating} />
        </div>
        <p style={{ fontSize: 10, color: "var(--muted-foreground)", marginBottom: 3 }}>{addr}</p>
        <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          {tags.map((t, i) => <Tag key={i} {...t} />)}
        </div>
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.02em", marginBottom: 12 }}>{title}</h2>
      {children}
    </div>
  );
}

function Card({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div style={{
      background: accent ? "linear-gradient(160deg, var(--grade-dark) 0%, #2A1510 100%)" : "var(--card)",
      borderRadius: 16, padding: "16px",
      border: accent ? "none" : "1px solid var(--border)",
      boxShadow: accent ? "0 4px 20px rgba(11,30,45,0.15)" : "0 1px 5px rgba(0,0,0,0.04)",
      marginBottom: 12,
    }}>
      {children}
    </div>
  );
}

function Callout({ color, children }: { color: "teal" | "yellow" | "blue"; children: React.ReactNode }) {
  const map = {
    teal:   { bg: "#E8F9F9", border: "#C0EDEF", text: "#1A5C60" },
    yellow: { bg: "#FFFDE7", border: "#FFE082", text: "#7A5000" },
    blue:   { bg: "#E8F4FF", border: "#90CAF9", text: "#1A3A6E" },
  };
  const c = map[color];
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 10, color: c.text, fontSize: 12, lineHeight: 1.6 }}>
      {children}
    </div>
  );
}

export default function GuidePage() {
  const isKo = useLang();

  return (
    <div className="ll-fullpage" style={{ display: "flex", flexDirection: "column", background: "var(--content-bg)" }}>
      {/* Hero header */}
      <div style={{ background: "linear-gradient(160deg, var(--grade-dark) 0%, #2A1510 100%)", paddingTop: 12, paddingBottom: 24, paddingInline: 20, flexShrink: 0 }}>
        <Link href="/map" style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", textDecoration: "none", display: "block", marginBottom: 10 }}>
          ← {isKo ? "지도로 돌아가기" : "Back to Map"}
        </Link>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--grade-s)", letterSpacing: "0.08em", marginBottom: 6 }}>
          LOCALOOP KOREA
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 8 }}>
          {isKo ? "사용 가이드" : "User Guide"}
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
          {isKo
            ? "Localoop Korea를 200% 활용하는 방법을 알아보세요"
            : "Learn how to get the most out of Localoop Korea"}
        </p>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 80px" }}>

        {/* SECTION 1 */}
        <Section title={isKo ? "가장 먼저 — '나를 알려줘'를 채우세요" : "Start Here — Fill in 'About Me'"}>
          <Card accent>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--grade-s)", marginBottom: 6 }}>
              {isKo ? "앱의 모든 추천이 여기서 시작됩니다" : "All recommendations start here"}
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.65 }}>
              {isKo
                ? "'나를 알려줘'는 단순한 프로필이 아닙니다. 비자 종류, 한국어 수준, 관심사, 거주 기간을 입력하는 순간 AI가 장소 목록, 할 일 과제, 추천 코스, 모임 추천을 완전히 다르게 구성합니다."
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
            {isKo
              ? "'나를 알려줘'를 비워두면 AI는 '모든 외국인의 평균'으로 추천합니다. 당신만을 위한 피드를 원한다면 지금 바로 채워주세요."
              : "Leaving 'About Me' empty means the AI treats you as an average of all expats. For a feed tailored just to you, fill it in now."}
          </Callout>

          <Link href="/profile/me" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "12px 0", borderRadius: 12, background: "var(--grade-s)",
            color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none",
          }}>
            {isKo ? "나를 알려줘 채우러 가기" : "Go Fill in About Me"}
          </Link>
        </Section>

        {/* SECTION 2 */}
        <Section title={isKo ? "8가지 카테고리" : "8 Categories"}>
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: 12 }}>
            {isKo
              ? "Localoop Korea의 모든 장소는 외국인 시각에서 재분류된 8개 카테고리로 나뉩니다. 단순한 분류가 아니라 외국인이 실제로 필요로 하는 상황별 구분입니다."
              : "Every place in Localoop Korea falls into one of 8 categories, re-classified from a foreigner's perspective — not just type of place, but what you actually need in each situation."}
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

        {/* SECTION 3 */}
        <Section title={isKo ? "Localoop의 3가지 엔진" : "Localoop's 3 Engines"}>
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: 14 }}>
            {isKo
              ? "단순한 리뷰 앱이 아닙니다. 3개의 AI 엔진이 실시간으로 당신의 한국 생활을 분석하고 최적의 경험을 설계합니다."
              : "This isn't just a review app. Three AI engines analyze your Korea life in real time and design the optimal experience for you."}
          </p>

          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#E8F9F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#0B7A82" }}>S/A</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--foreground)" }}>{isKo ? "엔진 1: 친화성 평가 엔진" : "Engine 1: Friendliness Rating Engine"}</div>
                <div style={{ fontSize: 10, color: "var(--grade-s)", fontWeight: 600 }}>S / A / B / C 등급 시스템</div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.6 }}>
              {isKo
                ? "Localoop 데이터팀이 직접 방문·검증한 데이터와 실제 외국인 사용자 피드백을 결합해 외국인 친화 지수를 4단계로 평가합니다. 구글 지도에는 없는 외국인 전용 필터입니다."
                : "Localoop's data team combines on-site verification data with real expat user feedback to rate foreigner-friendliness in 4 tiers. A foreigner-only filter you won't find on Google Maps."}
            </p>
          </Card>

          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#E8F4FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#1565C0" }}>AI</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--foreground)" }}>{isKo ? "엔진 2: AI 코스 생성 엔진" : "Engine 2: AI Course Builder"}</div>
                <div style={{ fontSize: 10, color: "#1565C0", fontWeight: 600 }}>{isKo ? "실제 현지인 동선 기반" : "Based on real local routes"}</div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.6 }}>
              {isKo
                ? "관광지가 아닌 현지인이 실제로 가는 동선을 분석합니다. 언어 수준·이동 거리·시간대·날씨·계절을 반영해 외국인이 혼자서도 소화할 수 있는 반나절/하루 코스를 자동 설계합니다."
                : "We analyze the routes locals actually take — not tourist traps. Factoring in your language level, travel distance, time of day, weather and season, the engine auto-designs half-day and full-day courses a foreigner can handle solo."}
            </p>
          </Card>

          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F0FFF0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#2E7D32" }}>M</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--foreground)" }}>{isKo ? "엔진 3: 커뮤니티 매칭 엔진" : "Engine 3: Community Matching Engine"}</div>
                <div style={{ fontSize: 10, color: "#2E7D32", fontWeight: 600 }}>{isKo ? "관심사 × 위치 × 언어 기반" : "Interest × Location × Language"}</div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.6 }}>
              {isKo
                ? "한국인↔외국인 언어교환, 취미 모임, 동네 이웃 연결을 AI가 자동 매칭합니다. '나를 알려줘'에 입력한 관심사와 거주 지역을 기반으로 가장 잘 맞을 사람을 먼저 보여줍니다."
                : "AI auto-matches Korean↔foreigner language exchanges, hobby meetups, and neighborhood connections. Based on interests and location from 'About Me', it surfaces the people you're most likely to click with."}
            </p>
          </Card>
        </Section>

        {/* SECTION 4 */}
        <Section title={isKo ? "지도 — S/A/B/C 등급 완전 정복" : "Map — S/A/B/C Rating System"}>
          <Card>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)", marginBottom: 10 }}>
              {isKo ? "등급 기준표" : "Rating Criteria"}
            </div>
            {[
              { r: "S" as const, label: isKo ? "외국인 100% 환영" : "100% Foreigner-Friendly", criteria: isKo ? "영어 OK + 카드 OK + 혼자 OK" : "English OK + Card OK + Solo OK", color: "#0B7A82" },
              { r: "A" as const, label: isKo ? "편하게 이용 가능" : "Comfortable to Use", criteria: isKo ? "영어 OK + 카드 OK" : "English OK + Card OK", color: "#1565C0" },
              { r: "B" as const, label: isKo ? "기본 소통 가능" : "Basic Access OK", criteria: isKo ? "카드 결제만 가능" : "Card payment only", color: "#A56000" },
              { r: "C" as const, label: isKo ? "현지 경험 도전" : "Full Local Challenge", criteria: isKo ? "현금만 · 한국어만" : "Cash only · Korean only", color: "#666" },
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
            {[
              { code: "EN", ko: "영어 OK", en: "English OK", desc: isKo ? "메뉴·직원이 영어 가능" : "Menu & staff in English", color: "#D6F5F5", text: "#0B7A82" },
              { code: "CC", ko: "카드 OK", en: "Card OK", desc: isKo ? "신용카드 결제 가능" : "Credit card accepted", color: "#E8F4FF", text: "#1565C0" },
              { code: "1", ko: "혼자 OK", en: "Solo OK", desc: isKo ? "1인 방문 편안함" : "Comfortable solo visit", color: "#F0FFF0", text: "#2E7D32" },
            ].map((item) => (
              <div key={item.en} style={{ background: item.color, borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: item.text, marginBottom: 4 }}>{item.code}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: item.text, marginBottom: 3 }}>{isKo ? item.ko : item.en}</div>
                <div style={{ fontSize: 9, color: "#1A2B2C", lineHeight: 1.4 }}>{item.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "var(--content-bg)", borderRadius: 14, padding: "12px", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted-foreground)", marginBottom: 8, letterSpacing: "0.06em" }}>
              {isKo ? "▶ 예시 화면" : "▶ EXAMPLE SCREEN"}
            </div>
            <MockPlaceCard name={isKo ? "앤트러사이트 홍대" : "Anthracite Hongdae"} addr={isKo ? "서울 마포구 토정로5길 13" : "13 Tojeong-ro 5-gil, Mapo-gu, Seoul"} rating="S" selected tags={[{ label: isKo ? "영어 OK" : "English OK", color: "teal" }, { label: isKo ? "카드 OK" : "Card OK", color: "blue" }, { label: isKo ? "혼자 OK" : "Solo OK", color: "green" }]} />
            <MockPlaceCard name={isKo ? "광장시장" : "Gwangjang Market"} addr={isKo ? "서울 종로구 창경궁로 88" : "88 Changgyeonggung-ro, Jongno-gu"} rating="C" tags={[{ label: isKo ? "현금 필요" : "Cash Only", color: "yellow" }]} />
            <MockPlaceCard name={isKo ? "더 현대 서울" : "The Hyundai Seoul"} addr={isKo ? "서울 영등포구 여의대로 108" : "108 Yeoui-daero, Yeongdeungpo-gu"} rating="A" tags={[{ label: isKo ? "영어 OK" : "English OK", color: "teal" }, { label: isKo ? "카드 OK" : "Card OK", color: "blue" }]} />
          </div>

          <Callout color="yellow">
            {isKo
              ? "C등급은 나쁜 곳이 아닙니다. 광장시장처럼 현지인만 가는 보석 같은 장소가 많습니다. 한국어를 조금 배운 뒤 도전해보세요!"
              : "C-rating doesn't mean bad — places like Gwangjang Market are hidden gems loved by locals. Try them once you've picked up some Korean!"}
          </Callout>
        </Section>

        {/* SECTION 5 */}
        <Section title={isKo ? "Tasks — 한국 생활 단계별 로드맵" : "Tasks — Step-by-Step Korea Roadmap"}>
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: 12 }}>
            {isKo
              ? "한국에 막 도착한 날부터 장기 거주자가 될 때까지, AI가 당신의 비자 단계에 맞는 다음 할 일을 자동으로 제시합니다."
              : "From the day you arrive to becoming a long-term resident, the AI automatically presents what to do next based on your visa stage."}
          </p>

          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--foreground)", marginBottom: 10 }}>
              {isKo ? "5단계 정착 로드맵" : "5-Stage Settlement Roadmap"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 14, overflowX: "auto" }}>
              {[
                { ko: "도착", en: "Arrival", active: true },
                { ko: "초기생활", en: "Early Life", active: false },
                { ko: "정착", en: "Settlement", active: false },
                { ko: "커뮤니티", en: "Community", active: false },
                { ko: "장기거주", en: "Long-term", active: false },
              ].map((stage, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ padding: "5px 8px", borderRadius: 8, background: stage.active ? "var(--grade-s)" : "var(--icon-bg)", color: stage.active ? "#fff" : "var(--muted-foreground)", fontSize: 9, fontWeight: 700 }}>
                    {i + 1}. {isKo ? stage.ko : stage.en}
                  </div>
                  {i < 4 && <div style={{ width: 10, height: 1, background: "var(--border)" }} />}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted-foreground)", marginBottom: 6, letterSpacing: "0.06em" }}>
              {isKo ? "▶ 도착 단계 예시 과제" : "▶ ARRIVAL STAGE EXAMPLE TASKS"}
            </div>
            <MockTaskRow stage={isKo ? "도착" : "Arrival"} title={isKo ? "통신사 USIM 개통하기" : "Get a USIM card"} done={true} />
            <MockTaskRow stage={isKo ? "도착" : "Arrival"} title={isKo ? "교통카드(T-money) 발급" : "Get T-money transit card"} done={true} />
            <MockTaskRow stage={isKo ? "도착" : "Arrival"} title={isKo ? "외국인등록증 신청 (90일 이내)" : "Apply for Alien Registration Card"} done={false} />
            <MockTaskRow stage={isKo ? "초기생활" : "Early Life"} title={isKo ? "은행계좌 개설 (하나/신한 추천)" : "Open a bank account (KEB Hana / Shinhan)"} done={false} />
          </Card>

          <Callout color="blue">
            {isKo
              ? "비자 종류별로 과제 순서가 달라집니다. D-2(학생)는 장학금 신청이, E-7(전문직)는 사대보험 등록이 우선 과제로 올라옵니다."
              : "Task order changes by visa type. D-2 (student) gets scholarship applications first; E-7 (professional) gets 4-major-insurance registration."}
          </Callout>

          <div style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.65, marginBottom: 4 }}>
            {isKo ? "✔ 과제를 완료하면 다음 단계의 과제가 자동으로 열립니다" : "✔ Completing a task unlocks the next set automatically"}
          </div>
          <div style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.65, marginBottom: 4 }}>
            {isKo ? "✔ 각 과제에는 어디서 어떻게 해야 하는지 상세 가이드 링크가 붙어 있습니다" : "✔ Each task has a detailed guide on where to go and what to bring"}
          </div>
          <div style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.65 }}>
            {isKo ? "✔ 완료율에 따라 레벨(Lv.1~5)이 올라가고 커뮤니티 뱃지가 부여됩니다" : "✔ Completion rate raises your level (Lv.1–5) and earns community badges"}
          </div>
        </Section>

        {/* SECTION 6 */}
        <Section title={isKo ? "Courses — AI 현지 코스 추천" : "Courses — AI Local Course Picks"}>
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: 12 }}>
            {isKo
              ? "구글에서 검색하면 나오는 관광 코스가 아닙니다. 현지인이 실제로 다니는 동선을 AI가 분석해 외국인도 혼자 소화할 수 있는 형태로 최적화합니다."
              : "These aren't the tourist courses you'd find on Google. The AI analyzes routes locals actually take and optimizes them into solo-friendly experiences for expats."}
          </p>

          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--foreground)", marginBottom: 10 }}>
              {isKo ? "코스 필터 종류" : "Course Filter Types"}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {[
                { ko: "AI 추천", en: "AI Pick", active: true },
                { ko: "반나절", en: "Half-Day" },
                { ko: "하루", en: "Full Day" },
                { ko: "음식 중심", en: "Food" },
                { ko: "문화", en: "Culture" },
                { ko: "자연", en: "Nature" },
              ].map((f, i) => (
                <span key={i} style={{ padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: f.active ? "var(--grade-s)" : "var(--icon-bg)", color: f.active ? "#fff" : "var(--muted-foreground)", border: f.active ? "none" : "1px solid var(--border)" }}>
                  {isKo ? f.ko : f.en}
                </span>
              ))}
            </div>
          </Card>

          <div style={{ background: "var(--content-bg)", borderRadius: 14, padding: "12px", border: "1px solid var(--border)", marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted-foreground)", marginBottom: 8, letterSpacing: "0.06em" }}>
              {isKo ? "▶ 예시 코스 카드" : "▶ EXAMPLE COURSE CARDS"}
            </div>
            {[
              { tag: "CF", title: isKo ? "성수 인더스트리얼 반나절" : "Seongsu Industrial Half-Day", tags: [isKo ? "반나절" : "Half-Day", isKo ? "카페" : "Café", isKo ? "S등급 위주" : "S-rated"], places: isKo ? "성수연방 → 어니언 성수 → 대림창고 갤러리" : "Seongsu Yeonbang → Onion → Daelim Warehouse", time: isKo ? "약 3시간" : "~3 hours" },
              { tag: "AC", title: isKo ? "종로 고궁 문화 하루 코스" : "Jongno Palace Culture Full Day", tags: [isKo ? "하루" : "Full Day", isKo ? "문화" : "Culture", isKo ? "역사" : "History"], places: isKo ? "경복궁 → 북촌한옥마을 → 인사동 → 광장시장" : "Gyeongbokgung → Bukchon → Insadong → Gwangjang", time: isKo ? "약 6시간" : "~6 hours" },
            ].map((course, i) => (
              <div key={i} style={{ background: "var(--card)", borderRadius: 12, padding: "12px", marginBottom: 8, border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#E8F9F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#0B7A82" }}>{course.tag}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)" }}>{course.title}</div>
                    <div style={{ fontSize: 10, color: "var(--muted-foreground)" }}>{course.time}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
                  {course.tags.map((tag, ti) => (
                    <span key={ti} style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: "#E8F9F9", color: "#0B7A82" }}>{tag}</span>
                  ))}
                </div>
                <div style={{ fontSize: 10, color: "var(--muted-foreground)", lineHeight: 1.5 }}>{course.places}</div>
              </div>
            ))}
          </div>

          <Callout color="teal">
            {isKo
              ? "코스 내 장소는 모두 S/A등급 위주로 구성됩니다. 처음 한국 생활을 시작했다면 'AI 추천' 필터로 시작해보세요."
              : "Places within courses are prioritized S/A-rated. Just starting out? Use the 'AI Pick' filter — courses matching your Korean level appear first."}
          </Callout>
        </Section>

        {/* SECTION 7 */}
        <Section title={isKo ? "Community — 모임 & 매칭" : "Community — Meetups & Matching"}>
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: 12 }}>
            {isKo
              ? "한국에서 진짜 인연을 만드는 공간입니다. 언어교환 파트너, 취미 모임, 동네 이웃을 AI가 연결해드립니다."
              : "The space to make real connections in Korea. The AI connects you to language exchange partners, hobby groups, and neighborhood friends."}
          </p>

          <Card>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)", marginBottom: 10 }}>
              {isKo ? "모임 만들기 — 4단계" : "Creating a Meetup — 4 Steps"}
            </div>
            {[
              { n: 1, ko: "커뮤니티 탭 → '+ 새 모임 만들기' 버튼 클릭", en: "Community tab → Tap '+ New Meetup'" },
              { n: 2, ko: "모임 이름·날짜·장소·최대 인원 설정", en: "Set name, date, location, max participants" },
              { n: 3, ko: "한국어/영어 수준 조건 지정 (선택)", en: "Optionally set Korean/English level requirements" },
              { n: 4, ko: "등록 완료 → 근처 사용자에게 자동 알림 발송", en: "Done → Auto-notification sent to nearby users" },
            ].map((step) => (
              <div key={step.n} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--grade-s)", color: "#fff", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  {step.n}
                </div>
                <p style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.5 }}>{isKo ? step.ko : step.en}</p>
              </div>
            ))}
          </Card>

          <Card>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)", marginBottom: 10 }}>
              {isKo ? "매칭 시스템 작동 원리" : "How the Matching System Works"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center", marginBottom: 10 }}>
              <div style={{ background: "#E8F4FF", borderRadius: 12, padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#1565C0", marginBottom: 4 }}>KR</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1565C0" }}>{isKo ? "한국인" : "Korean"}</div>
                <div style={{ fontSize: 9, color: "#4A6467", marginTop: 3 }}>{isKo ? "영어 배우고 싶음" : "Wants to learn English"}</div>
              </div>
              <div style={{ textAlign: "center", fontSize: 20, color: "var(--grade-s)", fontWeight: 900 }}>⇄</div>
              <div style={{ background: "#E8F9F9", borderRadius: 12, padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#0B7A82", marginBottom: 4 }}>EN</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#0B7A82" }}>{isKo ? "외국인" : "Foreigner"}</div>
                <div style={{ fontSize: 9, color: "#4A6467", marginTop: 3 }}>{isKo ? "한국어 배우고 싶음" : "Wants to learn Korean"}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.65 }}>
              {isKo
                ? "AI가 관심사·언어 수준·위치·시간대를 분석해 매칭 점수를 계산합니다. 단순한 언어교환을 넘어 요리, 등산, 보드게임 등 공통 취미로 연결되는 경우 매칭 점수가 가장 높게 나타납니다."
                : "The AI calculates a match score using interests, language level, location, and availability. Matches through shared hobbies — cooking, hiking, board games — score higher than language exchange alone."}
            </div>
          </Card>

          <Card>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)", marginBottom: 8 }}>
              {isKo ? "'피플' 탭 — 개인 매칭" : "'People' Tab — 1:1 Matching"}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.65, marginBottom: 8 }}>
              {isKo
                ? "'피플' 탭에서는 현재 내 위치 근처의 사용자를 볼 수 있습니다. '나를 알려줘'에 입력한 관심사와 겹치는 사람이 먼저 보입니다."
                : "The 'People' tab shows users near your current location. People whose interests overlap with your 'About Me' appear first."}
            </div>
            <Callout color="yellow">
              {isKo
                ? "매칭 정확도를 높이려면 '나를 알려줘'에 취미·관심사를 최소 3개 이상 입력하세요."
                : "To improve match accuracy, add at least 3 hobbies/interests in 'About Me'."}
            </Callout>
          </Card>
        </Section>

        {/* Bottom CTA */}
        <div style={{ background: "linear-gradient(160deg, var(--grade-dark) 0%, #2A1510 100%)", borderRadius: 18, padding: "20px 16px", textAlign: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 6 }}>
            {isKo ? "지금 바로 시작하세요" : "Start Right Now"}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 16 }}>
            {isKo
              ? "가장 먼저 '나를 알려줘'를 채우면 Localoop이 당신만의 한국 생활 가이드가 됩니다"
              : "Fill in 'About Me' first and Localoop becomes your personal Korea life guide"}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/profile/me" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "11px 0", borderRadius: 12, background: "var(--grade-s)", color: "#fff", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
              {isKo ? "나를 알려줘" : "About Me"}
            </Link>
            <Link href="/map" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "11px 0", borderRadius: 12, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
              {isKo ? "지도 보기" : "Explore Map"}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
