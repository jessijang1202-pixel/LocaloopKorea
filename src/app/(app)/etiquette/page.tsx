"use client";

import { useState } from "react";
import { useLang } from "@/lib/lang";
import { useTheme } from "@/lib/theme";

function Section({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 22 }}>{emoji}</span>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.02em" }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Card({ children, accent = false, isDark = false }: { children: React.ReactNode; accent?: boolean; isDark?: boolean }) {
  return (
    <div style={{
      background: accent
        ? isDark
          ? "linear-gradient(135deg, #0B1E2D 0%, #0a3044 100%)"
          : "linear-gradient(135deg, #E0F5F6 0%, #C8EDF0 100%)"
        : "var(--card)",
      borderRadius: 16, padding: "16px",
      border: accent ? "none" : "1px solid var(--border)",
      boxShadow: accent ? "0 4px 20px rgba(11,30,45,0.08)" : "0 1px 5px rgba(0,0,0,0.04)",
      marginBottom: 12,
    }}>
      {children}
    </div>
  );
}

function Callout({ color, children }: { color: "teal" | "yellow" | "red" | "blue"; children: React.ReactNode }) {
  const map = {
    teal:   { bg: "#E8F9F9", border: "#C0EDEF", text: "#1A5C60" },
    yellow: { bg: "#FFFDE7", border: "#FFE082", text: "#7A5000" },
    red:    { bg: "#FFF0F0", border: "#FFCDD2", text: "#7A1A1A" },
    blue:   { bg: "#E8F4FF", border: "#90CAF9", text: "#1A3A6E" },
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
        background: ok ? "#E8F9F9" : "#FFF0F0",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12,
      }}>
        {ok ? "✓" : "✕"}
      </div>
      <p style={{ fontSize: 12, color: "var(--foreground)", lineHeight: 1.6 }}>{text}</p>
    </div>
  );
}

const CATEGORIES = [
  { id: "all", ko: "전체", en: "All" },
  { id: "greeting", ko: "인사", en: "Greetings" },
  { id: "dining", ko: "식사", en: "Dining" },
  { id: "transport", ko: "교통", en: "Transport" },
  { id: "social", ko: "사회", en: "Social" },
  { id: "taboo", ko: "금기", en: "Taboos" },
];

export default function EtiquettePage() {
  const isKo = useLang();
  const isDark = useTheme() === "dark";
  const [activeTab, setActiveTab] = useState("all");

  function show(cat: string) {
    return activeTab === "all" || activeTab === cat;
  }

  return (
    <div className="ll-fullpage" style={{ display: "flex", flexDirection: "column", background: "var(--content-bg)" }}>
      {/* Hero */}
      <div style={{ background: isDark ? "linear-gradient(135deg, #0B1E2D 0%, #0a3550 100%)" : "linear-gradient(135deg, #E0F5F6 0%, #C4EBF0 100%)", paddingTop: 16, paddingBottom: 24, paddingInline: 20, flexShrink: 0, borderBottom: isDark ? "none" : "1px solid var(--border)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#15b6c1", letterSpacing: "0.08em", marginBottom: 6 }}>
          LOCALOOP KOREA
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: isDark ? "#fff" : "var(--foreground)", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 8 }}>
          {isKo ? "문화 & 에티켓 가이드" : "Culture & Etiquette Guide"}
        </h1>
        <p style={{ fontSize: 13, color: isDark ? "rgba(255,255,255,0.65)" : "var(--muted-foreground)", lineHeight: 1.6 }}>
          {isKo
            ? "한국에서 실수 없이 생활하는 법 — 현지 문화를 이해하면 한국 생활이 훨씬 즐거워집니다"
            : "How to live in Korea without awkward mistakes — understanding local culture makes everything smoother"}
        </p>

        {/* Category chips */}
        <div style={{ display: "flex", gap: 6, marginTop: 16, overflowX: "auto", paddingBottom: 2 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              style={{
                padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, flexShrink: 0,
                background: activeTab === cat.id ? "#15b6c1" : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)",
                color: activeTab === cat.id ? "#fff" : isDark ? "rgba(255,255,255,0.7)" : "var(--muted-foreground)",
                border: "none", cursor: "pointer",
              }}
            >
              {isKo ? cat.ko : cat.en}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "20px 16px 32px" }}>

        {/* GREETINGS */}
        {show("greeting") && (
          <Section emoji="🙇" title={isKo ? "인사 & 기본 예절" : "Greetings & Basic Manners"}>
            <Card accent isDark={isDark}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#15b6c1", marginBottom: 6 }}>
                {isKo ? "인사의 나라 — 고개 숙임(절)이 핵심" : "The Bowing Nation — the bow is everything"}
              </div>
              <p style={{ fontSize: 13, color: isDark ? "rgba(255,255,255,0.85)" : "var(--foreground)", lineHeight: 1.65 }}>
                {isKo
                  ? "한국에서는 처음 만나는 사람에게 가볍게 고개를 숙여 인사합니다. 각도가 클수록 더 큰 존경을 나타냅니다. 15° 가벼운 인사, 30° 일반적 인사, 45° 깊은 감사나 사죄."
                  : "In Korea, you bow your head slightly when greeting someone for the first time. The deeper the bow, the more respect it conveys. 15° light acknowledgment, 30° standard greeting, 45° deep gratitude or apology."}
              </p>
            </Card>

            <Card>
              {[
                {
                  ok: true,
                  ko: "어른(나이 많은 분)을 만나면 먼저 인사하세요",
                  en: "Greet elders (older people) first — always",
                },
                {
                  ok: true,
                  ko: "두 손으로 물건을 받거나 드릴 때 예의 바르게 보입니다",
                  en: "Use both hands when giving or receiving things — shows respect",
                },
                {
                  ok: true,
                  ko: "'안녕하세요' 한마디만으로도 큰 호감을 얻습니다",
                  en: "Saying '안녕하세요' (Annyeonghaseyo) earns you instant goodwill",
                },
                {
                  ok: false,
                  ko: "악수할 때 한 손만 내밀면 무례하게 보일 수 있어요",
                  en: "Don't offer just one hand for a handshake — it looks rude",
                },
                {
                  ok: false,
                  ko: "어른 앞에서 먼저 자리에 앉거나 음식을 먹으면 실례입니다",
                  en: "Don't sit down or start eating before elders do",
                },
              ].map((r, i) => (
                <RuleItem key={i} ok={r.ok} text={isKo ? r.ko : r.en} />
              ))}
            </Card>

            <Callout color="teal">
              💡 {isKo
                ? "'감사합니다 (Gamsahamnida)'와 '죄송합니다 (Joesonghamnida)'만 알아도 웬만한 상황을 넘길 수 있습니다."
                : "'Gamsahamnida' (thank you) and 'Joesonghamnida' (I'm sorry) — learn these two and you'll handle most situations fine."}
            </Callout>
          </Section>
        )}

        {/* DINING */}
        {show("dining") && (
          <Section emoji="🍽️" title={isKo ? "식당 & 식사 문화" : "Restaurant & Dining Culture"}>
            <Card>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--foreground)", marginBottom: 10 }}>
                {isKo ? "한국 식당의 규칙" : "Korean Restaurant Rules"}
              </div>
              {[
                { ok: true, ko: "반찬은 무한 리필! 직원에게 '더 주세요' 또는 손짓으로 요청하세요", en: "Side dishes (banchan) are free refills — ask for more anytime" },
                { ok: true, ko: "식사 전 어른이 수저를 들기를 기다렸다가 함께 시작하세요", en: "Wait for the eldest to pick up chopsticks before you start eating" },
                { ok: true, ko: "음식값은 보통 한 사람이 전부 내는 '더치페이' 대신 한 명이 내는 문화", en: "One person often pays the whole bill — it rotates naturally between friends" },
                { ok: false, ko: "식사 중 수저를 밥그릇에 꽂아 두면 제사(장례) 연상으로 금기", en: "Never stick chopsticks upright in rice — it resembles funeral rites" },
                { ok: false, ko: "어른보다 먼저 술잔을 마시는 건 실례입니다. 고개를 돌려서 마시세요", en: "Don't drink before elders — turn your head away when taking a sip" },
                { ok: false, ko: "남의 밥그릇에서 음식을 직접 집어먹거나 덜어주는 것은 피하세요", en: "Don't take food directly from someone else's bowl" },
              ].map((r, i) => (
                <RuleItem key={i} ok={r.ok} text={isKo ? r.ko : r.en} />
              ))}
            </Card>

            <Callout color="yellow">
              🍺 {isKo
                ? "술자리 문화: 자신의 잔을 직접 채우지 않고 옆 사람이 채워줍니다. 마시기 싫을 땐 잔을 손으로 가볍게 덮으면 됩니다."
                : "Drinking culture: you don't pour for yourself — neighbors fill each other's glasses. To decline, lightly cover your glass with your hand."}
            </Callout>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { emoji: "🥢", ko: "젓가락 먼저", en: "Chopsticks first", desc: isKo ? "국물은 숟가락, 반찬은 젓가락" : "Spoon for soup, chopsticks for side dishes" },
                { emoji: "🔕", ko: "조용히 먹기", en: "Eat quietly", desc: isKo ? "쩝쩝 소리는 실례" : "Slurping food is considered rude" },
                { emoji: "📵", ko: "전화는 잠깐", en: "Brief phone use", desc: isKo ? "식사 중 통화는 양해를 구하고" : "Excuse yourself before taking calls" },
                { emoji: "🎁", ko: "더치페이", en: "Taking turns", desc: isKo ? "번갈아 내는 것이 자연스러워요" : "Rotating who pays is the norm" },
              ].map((item) => (
                <div key={item.en} style={{ background: "var(--card)", borderRadius: 12, padding: "12px 10px", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{item.emoji}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)", marginBottom: 2 }}>{isKo ? item.ko : item.en}</div>
                  <div style={{ fontSize: 10, color: "var(--muted-foreground)", lineHeight: 1.4 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* TRANSPORT */}
        {show("transport") && (
          <Section emoji="🚇" title={isKo ? "대중교통 에티켓" : "Public Transport Etiquette"}>
            <Card>
              {[
                { ok: true, ko: "노약자석(분홍/파란 시트)은 비어 있어도 어른·임산부를 위해 비워두세요", en: "Priority seats (pink/blue) should stay empty even if available" },
                { ok: true, ko: "지하철 안에서는 작게 말하거나 이어폰을 끼세요", en: "Speak quietly or use earphones on the subway" },
                { ok: true, ko: "타기 전에 내리는 사람이 다 내릴 때까지 기다리세요", en: "Wait for passengers to exit before boarding" },
                { ok: true, ko: "버스·지하철에서 통화는 가능하지만 최대한 작은 목소리로", en: "Phone calls are okay but keep your voice very low" },
                { ok: false, ko: "지하철 안에서 음식을 먹으면 눈총을 받아요", en: "Don't eat on the subway — it's frowned upon" },
                { ok: false, ko: "에스컬레이터에서 왼쪽은 서있는 줄, 오른쪽은 걷는 줄 (서울 기준)", en: "On escalators: stand on the right, walk on the left (Seoul rule)" },
              ].map((r, i) => (
                <RuleItem key={i} ok={r.ok} text={isKo ? r.ko : r.en} />
              ))}
            </Card>

            <Callout color="blue">
              🚌 {isKo
                ? "버스 정류장에서 버스가 오면 손을 들어 신호를 보내야 합니다. 아무 신호도 없으면 버스가 그냥 지나칠 수 있어요!"
                : "At bus stops, you MUST wave your hand to signal the bus. If you don't signal, it may drive past without stopping!"}
            </Callout>
          </Section>
        )}

        {/* SOCIAL */}
        {show("social") && (
          <Section emoji="👥" title={isKo ? "사회생활 & 인간관계" : "Social Life & Relationships"}>
            <Card accent isDark={isDark}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#15b6c1", marginBottom: 6 }}>
                {isKo ? "나이와 직급이 중요한 나라" : "Age and rank matter a lot here"}
              </div>
              <p style={{ fontSize: 13, color: isDark ? "rgba(255,255,255,0.85)" : "var(--foreground)", lineHeight: 1.65 }}>
                {isKo
                  ? "한국은 나이와 직급에 따라 언어(존댓말/반말)와 행동이 달라지는 문화입니다. 처음 만나는 사람에게는 항상 존댓말을 사용하고, 친해진 후 상대방이 반말을 제안하면 편하게 받아들이면 됩니다."
                  : "In Korea, language and behavior shift based on age and rank. Always use formal speech (존댓말) with strangers. If someone you've gotten close to suggests switching to casual speech (반말), that's a sign they see you as a friend."}
              </p>
            </Card>

            <Card>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--foreground)", marginBottom: 10 }}>
                {isKo ? "자주 받는 질문 — 무례한 게 아니에요!" : "Common Questions — Not Rude in Korean Culture!"}
              </div>
              {[
                { q: isKo ? "몇 살이에요?" : "How old are you?", a: isKo ? "한국은 나이로 호칭이 달라져서 나이를 묻는 것이 자연스럽습니다" : "Age determines speech levels and titles in Korea — it's perfectly normal to ask" },
                { q: isKo ? "밥 먹었어요?" : "Have you eaten?", a: isKo ? "안부 인사예요. '네' 또는 '아직요' 정도로 답하면 됩니다" : "This is a casual greeting like 'How are you?' — just say yes or not yet" },
                { q: isKo ? "결혼은 했어요?" : "Are you married?", a: isKo ? "관심의 표현이에요. 불편하면 가볍게 웃으며 넘기면 됩니다" : "An expression of interest in you. Just smile and deflect if uncomfortable" },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#15b6c1", marginBottom: 3 }}>Q: {item.q}</div>
                  <div style={{ fontSize: 11, color: "var(--muted-foreground)", lineHeight: 1.5 }}>→ {item.a}</div>
                </div>
              ))}
            </Card>

            <Callout color="teal">
              🎁 {isKo
                ? "선물 문화: 선물을 받으면 바로 열어보지 않는 것이 예의입니다. 나중에 혼자 열어보는 경우가 많아요."
                : "Gift culture: don't open a gift immediately when received — it's polite to open it later when alone."}
            </Callout>
          </Section>
        )}

        {/* TABOOS */}
        {show("taboo") && (
          <Section emoji="🚫" title={isKo ? "절대 피해야 할 것들" : "Things to Absolutely Avoid"}>
            <Callout color="red">
              ⚠️ {isKo
                ? "아래 행동들은 한국에서 심각한 실례 또는 금기로 여겨집니다. 문화적 충격을 피하려면 꼭 기억하세요!"
                : "The following are considered seriously rude or taboo in Korea. Keep these in mind to avoid culture shock!"}
            </Callout>

            <Card>
              {[
                { ok: false, ko: "빨간색 잉크로 이름을 쓰면 안 됩니다 — 죽음과 연관된 색으로 여깁니다", en: "Never write someone's name in red ink — it's associated with death" },
                { ok: false, ko: "숫자 '4'가 들어간 선물(예: 4개 묶음)은 불길하게 여깁니다", en: "Avoid gifts in sets of 4 — the number 4 sounds like 'death' in Korean" },
                { ok: false, ko: "집 안에서 신발을 신고 들어가면 안 됩니다. 반드시 벗으세요", en: "Never wear shoes inside a Korean home — always remove them at the door" },
                { ok: false, ko: "발로 문을 열거나 물건을 밀어도 실례입니다", en: "Don't open doors or push things with your feet — considered very disrespectful" },
                { ok: false, ko: "큰 소리로 코를 풀면 시선이 집중됩니다. 화장실에서 하세요", en: "Blowing your nose loudly in public attracts stares — do it in the restroom" },
                { ok: false, ko: "웃어른 앞에서 술을 마실 때 얼굴을 돌리지 않으면 실례입니다", en: "Drinking in front of elders without turning your face away is rude" },
              ].map((r, i) => (
                <RuleItem key={i} ok={r.ok} text={isKo ? r.ko : r.en} />
              ))}
            </Card>

            <Callout color="yellow">
              💡 {isKo
                ? "실수해도 괜찮아요! 대부분의 한국인은 외국인의 문화 차이를 이해하고 너그럽게 받아들입니다. 진심 어린 '죄송합니다'면 충분합니다."
                : "It's okay to make mistakes! Most Koreans are understanding of cultural differences. A sincere '죄송합니다 (Joesonghamnida)' goes a long way."}
            </Callout>
          </Section>
        )}

        {/* Quick Reference Card */}
        <div style={{ background: isDark ? "linear-gradient(135deg, #0B1E2D 0%, #0a3550 100%)" : "linear-gradient(135deg, #E0F5F6 0%, #C4EBF0 100%)", borderRadius: 18, padding: "20px 16px", textAlign: "center", marginBottom: 8, border: isDark ? "none" : "1px solid var(--border)" }}>
          <div style={{ fontSize: 20, marginBottom: 8 }}>🤝</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: isDark ? "#fff" : "var(--foreground)", marginBottom: 6 }}>
            {isKo ? "핵심 표현 빠른 참고" : "Key Phrases Quick Reference"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
            {[
              { ko: "안녕하세요", rom: "Annyeonghaseyo", en: "Hello" },
              { ko: "감사합니다", rom: "Gamsahamnida", en: "Thank you" },
              { ko: "죄송합니다", rom: "Joesonghamnida", en: "I'm sorry" },
              { ko: "괜찮아요", rom: "Gwaenchanayo", en: "It's okay" },
              { ko: "잘 먹겠습니다", rom: "Jal meokgesseumnida", en: "I will eat well" },
              { ko: "잘 먹었습니다", rom: "Jal meogeosseumnida", en: "I ate well" },
            ].map((p) => (
              <div key={p.ko} style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)", borderRadius: 12, padding: "10px 8px" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: isDark ? "#fff" : "var(--foreground)", marginBottom: 2 }}>{p.ko}</div>
                <div style={{ fontSize: 9, color: "#15b6c1", fontWeight: 600, marginBottom: 3 }}>{p.rom}</div>
                <div style={{ fontSize: 10, color: isDark ? "rgba(255,255,255,0.5)" : "var(--muted-foreground)" }}>{p.en}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
