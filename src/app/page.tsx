import Link from "next/link";

const P = "#06B6D4";   // primary teal
const PD = "#0891B2";  // primary dark
const PL = "#e0f9fc";  // primary light
const TX = "#0f172a";  // text dark
const MU = "#64748b";  // muted

// ── Wave dividers ─────────────────────────────────────────────
function WaveDown() {
  return (
    <div className="lp-wave">
      <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" height="56">
        <path fill={P} d="M0,28 C480,56 960,0 1440,28 L1440,56 L0,56 Z" />
      </svg>
    </div>
  );
}
function WaveUp() {
  return (
    <div className="lp-wave">
      <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" height="56">
        <path fill="#ffffff" d="M0,28 C480,0 960,56 1440,28 L1440,0 L0,0 Z" />
      </svg>
    </div>
  );
}

// ── Nav ──────────────────────────────────────────────────────
function Nav() {
  return (
    <header className="lp-nav">
      <div className="lp-nav-inner">
        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <span style={{
            width: 34, height: 34, borderRadius: 10,
            background: `linear-gradient(135deg, ${P}, ${PD})`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>🗺️</span>
          <span style={{ fontSize: 17, fontWeight: 900, color: TX, letterSpacing: "-0.02em" }}>
            Localoop<span style={{ color: P }}>Korea</span>
          </span>
        </a>

        {/* Desktop nav links */}
        <nav style={{ display: "flex", gap: 32 }} className="lp-nav-links">
          {[["#features","기능"], ["#areas","지역"], ["#how","이용 방법"]].map(([href, label]) => (
            <a key={href} href={href} className="lp-nav-link">{label}</a>
          ))}
        </nav>

        {/* CTA buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/login" style={{
            fontSize: 13, fontWeight: 600, color: MU,
            padding: "8px 16px", borderRadius: 999,
            border: `2px solid #e2f4f7`, textDecoration: "none",
          }}>Log in</Link>
          <Link href="/signup" style={{
            fontSize: 13, fontWeight: 700, color: "#fff",
            padding: "9px 20px", borderRadius: 999,
            background: `linear-gradient(135deg, ${P}, ${PD})`,
            textDecoration: "none",
          }}>시작하기 →</Link>
        </div>
      </div>

      {/* Hide nav links on mobile via CSS */}
    </header>
  );
}

// ── Hero ─────────────────────────────────────────────────────
function Hero() {
  const heroCards = [
    { emoji: "☕", name: "Fritz Coffee Company", area: "성수동 Seongsu", tag: "영어 메뉴 OK",  bg: "#FFF7ED", border: "#FED7AA", tagColor: "#EA580C" },
    { emoji: "🍜", name: "Tteokbokki 101 가이드",  area: "음식 가이드",   tag: "초보자 추천",    bg: "#F0FDFA", border: "#99F6E4", tagColor: "#0D9488" },
    { emoji: "🤝", name: "Korean Language Exchange", area: "홍대 Hongdae", tag: "12명 참가중",  bg: "#F5F3FF", border: "#DDD6FE", tagColor: "#7C3AED" },
  ];

  return (
    <section className="lp-hero">
      {/* Decorative blobs */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 480, height: 480, borderRadius: "50%",
        background: `radial-gradient(circle, ${P}30, transparent 70%)`,
        transform: "translate(30%, -20%)", pointerEvents: "none",
      }} />

      <div className="lp-section" style={{ paddingTop: 32, paddingBottom: 16 }}>
        <div className="lp-container">
          <div className="lp-grid-2">

            {/* ── Left: Text ── */}
            <div>
              <div className="lp-badge" style={{ background: PL, color: PD }}>
                🇰🇷&nbsp; 외국인을 위한 서울 생활 가이드
              </div>

              <h1 className="lp-title" style={{ color: TX }}>
                서울의 <span style={{ color: P }}>진짜 로컬</span>을<br />
                경험하세요
              </h1>

              <p className="lp-subtitle" style={{ color: MU }}>
                외국인 친화 장소, 음식 가이드, 생활 정보, 밋업—<br />
                서울 생활이 편해지는 모든 것이 한 곳에.
              </p>

              <div className="lp-btn-row">
                <Link href="/signup" className="lp-btn-primary"
                  style={{ background: `linear-gradient(135deg, ${P}, ${PD})` }}>
                  무료로 시작하기 🚀
                </Link>
                <a href="#features" className="lp-btn-outline">더 알아보기</a>
              </div>

              {/* Social proof */}
              <div className="lp-avatars">
                <div className="lp-avatar-stack">
                  {["🇺🇸","🇬🇧","🇯🇵","🇩🇪","🇨🇳","🇫🇷"].map((f, i) => (
                    <span key={i}>{f}</span>
                  ))}
                </div>
                <span style={{ fontSize: 13, color: MU }}>
                  <strong style={{ color: TX }}>1,200+</strong> expats &amp; locals joined
                </span>
              </div>
            </div>

            {/* ── Right: Cards ── */}
            <div>
              {heroCards.map((c) => (
                <div key={c.name} className="lp-hero-card"
                  style={{ background: c.bg, borderColor: c.border }}>
                  <div className="lp-hero-card-icon">{c.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: TX, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.name}
                    </p>
                    <p style={{ fontSize: 12, color: MU }}>📍 {c.area}</p>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999,
                    background: "white", border: `1px solid ${c.border}`, color: c.tagColor,
                    flexShrink: 0, whiteSpace: "nowrap",
                  }}>
                    {c.tag}
                  </span>
                </div>
              ))}

              {/* Mini stats */}
              <div className="lp-stat-grid">
                {[["200+","Places"],["50+","Guides"],["6","Areas"]].map(([n, l]) => (
                  <div key={l} className="lp-stat-box">
                    <p style={{ fontSize: 22, fontWeight: 900, color: P, marginBottom: 2 }}>{n}</p>
                    <p style={{ fontSize: 11, fontWeight: 600, color: MU }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <WaveDown />
    </section>
  );
}

// ── Steps ─────────────────────────────────────────────────────
function Steps() {
  const steps = [
    { num: "01", emoji: "📝", title: "가입하기",       desc: "이름과 관심 지역 입력 후 시작. 1분도 안 걸려요." },
    { num: "02", emoji: "📍", title: "지역 탐색",      desc: "내 근처 외국인 친화 장소와 로컬 맛집을 확인하세요." },
    { num: "03", emoji: "🍜", title: "음식 도전",      desc: "초보자 맞춤 메뉴 가이드로 자신 있게 주문하세요." },
    { num: "04", emoji: "🤝", title: "커뮤니티 참여",  desc: "밋업 참여하고 같은 관심사의 사람들을 만나요." },
  ];

  return (
    <section id="how" style={{ background: P }}>
      <div className="lp-section">
        <div className="lp-container">
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: PL, display: "block", marginBottom: 12 }}>
              How it works
            </span>
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, color: "#ffffff", marginBottom: 10, lineHeight: 1.15 }}>
              서울 탐험 순서
            </h2>
            <p style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)", color: PL, lineHeight: 1.6 }}>
              딱 4단계면 서울 로컬처럼 생활할 수 있어요
            </p>
          </div>

          {/* Desktop: horizontal */}
          <div className="lp-steps-desktop">
            {steps.map((step, i) => (
              <div key={step.num} style={{ display: "flex", alignItems: "flex-start" }}>
                <div className="lp-step-desktop">
                  <div className="lp-step-desktop-icon">{step.emoji}</div>
                  <span style={{
                    display: "inline-block", background: PD, color: "white",
                    borderRadius: 999, padding: "3px 12px", fontSize: 11, fontWeight: 800,
                    marginBottom: 12,
                  }}>{step.num}</span>
                  <p style={{ fontWeight: 800, color: "white", fontSize: 15, marginBottom: 6 }}>{step.title}</p>
                  <p style={{ color: PL, fontSize: 13, lineHeight: 1.5 }}>{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="lp-step-arrow">→</div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile: vertical */}
          <div className="lp-steps-mobile">
            {steps.map((step) => (
              <div key={step.num} className="lp-step-card">
                <div className="lp-step-icon">{step.emoji}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{
                      background: PD, color: "white",
                      borderRadius: 999, padding: "2px 10px", fontSize: 10, fontWeight: 800,
                    }}>{step.num}</span>
                    <p style={{ fontWeight: 800, color: "white", fontSize: 14 }}>{step.title}</p>
                  </div>
                  <p style={{ color: PL, fontSize: 12, lineHeight: 1.5 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <WaveUp />
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────
function Features() {
  const features = [
    {
      emoji: "📍", title: "Places", ko: "로컬 스팟",
      desc: "외국인 친화 태그가 달린 카페, 식당, 마켓을 지역별로 탐색하세요.",
      tags: ["영어 메뉴", "카드 결제", "혼밥 OK"],
      bg: "#FFF7ED", border: "#FED7AA", accent: "#EA580C", href: "/places",
    },
    {
      emoji: "🍜", title: "Food", ko: "음식 가이드",
      desc: "매운맛 단계, 주문 팁, 메뉴 설명으로 자신 있게 도전하세요.",
      tags: ["초보자 추천", "매운맛 표시", "채식 표시"],
      bg: "#F0FDFA", border: "#99F6E4", accent: "#0D9488", href: "/food",
    },
    {
      emoji: "📖", title: "Guides", ko: "생활 가이드",
      desc: "은행 개설부터 대중교통까지—한국 정착에 필요한 모든 정보.",
      tags: ["교통카드", "병원 이용", "주거 계약"],
      bg: "#EFF6FF", border: "#BFDBFE", accent: "#2563EB", href: "/guides",
    },
    {
      emoji: "🤝", title: "Meetups", ko: "밋업 & 커뮤니티",
      desc: "언어 교환, 동네 모임, 커뮤니티 이벤트로 사람들과 연결되세요.",
      tags: ["언어 교환", "동네 모임", "무료 이벤트"],
      bg: "#F5F3FF", border: "#DDD6FE", accent: "#7C3AED", href: "/meetups",
    },
  ];

  return (
    <section id="features" style={{ background: "#ffffff", paddingTop: 0 }}>
      <div className="lp-section">
        <div className="lp-container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="lp-section-label" style={{ color: P }}>What we offer</span>
            <h2 className="lp-section-title" style={{ color: TX }}>
              로컬을 경험하는 <span style={{ color: P }}>4가지 방법</span>
            </h2>
            <p style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)", color: MU, lineHeight: 1.6 }}>
              관광객이 아닌 로컬처럼 서울을 즐기는 데 필요한 모든 것
            </p>
          </div>

          <div className="lp-grid-4">
            {features.map((f) => (
              <Link key={f.title} href={f.href} className="lp-card"
                style={{ background: f.bg, borderColor: f.border, textDecoration: "none", display: "block" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: "white", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, border: `1px solid ${f.border}`,
                  marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                  {f.emoji}
                </div>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: f.accent, marginBottom: 6 }}>
                  {f.ko}
                </p>
                <p style={{ fontSize: 18, fontWeight: 900, color: TX, marginBottom: 10 }}>{f.title}</p>
                <p style={{ fontSize: 13, color: MU, lineHeight: 1.6, marginBottom: 16 }}>{f.desc}</p>
                <div>
                  {f.tags.map((t) => (
                    <span key={t} className="lp-feature-tag" style={{ borderColor: f.border, color: f.accent }}>{t}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Areas ──────────────────────────────────────────────────────
function Areas() {
  const areas = [
    { name: "Seongsu",  ko: "성수동", desc: "서울의 Brooklyn — 인디 카페, 스튜디오, 감성 맛집", emoji: "🏭", bg: "#FFF7ED", border: "#FED7AA" },
    { name: "Hongdae",  ko: "홍대",   desc: "길거리 음식, 라이브 공연, 늦은 밤까지 활기찬 핫플", emoji: "🎵", bg: "#F0FDFA", border: "#99F6E4" },
    { name: "Itaewon",  ko: "이태원", desc: "영어 가능한 글로벌 식당과 외국인 친화 쇼핑가",      emoji: "🌍", bg: "#EFF6FF", border: "#BFDBFE" },
    { name: "Yeonnam",  ko: "연남동", desc: "골목 카페, 브런치 맛집, 여유로운 동네 분위기",        emoji: "🌿", bg: "#F0FDF4", border: "#BBF7D0" },
    { name: "Gangnam",  ko: "강남",   desc: "깔끔하고 모던한, 처음 오는 사람도 쉽게 찾는 명소",  emoji: "🏙️", bg: "#F5F3FF", border: "#DDD6FE" },
    { name: "Bukchon",  ko: "북촌",   desc: "한옥 마을과 전통 문화 체험 — 서울의 역사를 느껴요",  emoji: "🏯", bg: "#FFF1F2", border: "#FECDD3" },
  ];

  return (
    <section id="areas" style={{ background: "#f8fbfc" }}>
      <div className="lp-section">
        <div className="lp-container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="lp-section-label" style={{ color: P }}>Seoul Areas</span>
            <h2 className="lp-section-title" style={{ color: TX }}>
              당신의 동네를 <span style={{ color: P }}>찾아보세요</span>
            </h2>
            <p style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)", color: MU, lineHeight: 1.6 }}>
              서울 주요 동네별 큐레이션 가이드
            </p>
          </div>

          <div className="lp-area-grid">
            {areas.map((area) => (
              <div key={area.name} className="lp-card"
                style={{ background: area.bg, borderColor: area.border, cursor: "pointer" }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{area.emoji}</div>
                <p style={{ fontSize: 11, fontWeight: 700, color: MU, marginBottom: 4 }}>{area.ko}</p>
                <p style={{ fontSize: 17, fontWeight: 900, color: TX, marginBottom: 6 }}>{area.name}</p>
                <p style={{ fontSize: 12, color: MU, lineHeight: 1.55 }}>{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Tips ──────────────────────────────────────────────────────
function Tips() {
  const tips = [
    { emoji: "✅", text: "영어 메뉴 있는 곳만 필터링해서 탐색할 수 있어요" },
    { emoji: "✅", text: "카드 결제 가능 여부를 미리 확인할 수 있어요" },
    { emoji: "✅", text: "매운맛 단계를 미리 체크하고 주문하세요" },
    { emoji: "✅", text: "혼밥·혼카페 친화 공간을 따로 표시해 두었어요" },
    { emoji: "⚠️", text: "일부 가게는 현금만 받으니 미리 확인하세요" },
    { emoji: "⚠️", text: "예약 필수 맛집은 방문 전 사전 예약이 필요해요" },
  ];

  return (
    <section style={{ background: "#ffffff" }}>
      <div className="lp-section">
        <div className="lp-container">
          <div className="lp-grid-2">
            <div>
              <span className="lp-section-label" style={{ color: P }}>Tips</span>
              <h2 className="lp-section-title" style={{ color: TX }}>
                처음 와도 <span style={{ color: P }}>걱정 없어요</span>
              </h2>
              <p style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)", color: MU, lineHeight: 1.65, marginBottom: 32 }}>
                Localoop Korea는 외국인이 한국에서 실제로 겪는 불편함을 해결하기 위해 만들어졌어요.
                각 장소와 음식마다 실용적인 정보가 태그로 정리되어 있어요.
              </p>
              <Link href="/signup" className="lp-btn-primary"
                style={{ background: `linear-gradient(135deg, ${P}, ${PD})`, display: "inline-flex" }}>
                지금 바로 탐색하기 →
              </Link>
            </div>

            <div style={{
              background: PL, borderRadius: 24,
              padding: "32px", border: `2px solid #bae6fd`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: P, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                }}>💡</div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 15, color: TX, marginBottom: 2 }}>Localoop 이용 팁</p>
                  <p style={{ fontSize: 12, color: MU }}>알아두면 좋은 것들</p>
                </div>
              </div>
              {tips.map((tip) => (
                <div key={tip.text} className="lp-tip-item">
                  <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{tip.emoji}</span>
                  <span style={{ color: TX, lineHeight: 1.5 }}>{tip.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section style={{ background: `linear-gradient(135deg, ${P} 0%, ${PD} 100%)`, position: "relative", overflow: "hidden" }}>
      {/* Circles */}
      <div style={{ position:"absolute", top:0, left:0, width:320, height:320, borderRadius:"50%", background:"rgba(255,255,255,0.08)", transform:"translate(-40%, -40%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:0, right:0, width:400, height:400, borderRadius:"50%", background:"rgba(255,255,255,0.07)", transform:"translate(35%, 35%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", top:"50%", right:"15%", width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }} />

      <div className="lp-section" style={{ position:"relative", zIndex:1, textAlign:"center" }}>
        <div className="lp-container">
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, margin: "0 auto 24px",
            }}>🗺️</div>

            <h2 style={{
              fontWeight: 900, color: "#ffffff",
              fontSize: "clamp(1.8rem, 5vw, 3rem)",
              lineHeight: 1.1, marginBottom: 16, letterSpacing: "-0.02em",
            }}>
              서울 생활,<br />지금 시작하세요
            </h2>

            <p style={{ fontSize: "clamp(0.9rem, 2vw, 1.1rem)", color: PL, lineHeight: 1.65, marginBottom: 36, maxWidth: 400, margin: "0 auto 36px" }}>
              가입 무료 · 광고 없음 · 외국인을 위해 직접 큐레이션한 콘텐츠
            </p>

            <Link href="/signup" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "white", color: PD,
              fontWeight: 800, fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
              padding: "18px 40px", borderRadius: 16,
              textDecoration: "none",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              transition: "transform 0.15s",
            }}>
              무료로 시작하기 🚀
            </Link>

            <p style={{ marginTop: 20, fontSize: 13, color: PL }}>
              이미 계정이 있나요?{" "}
              <Link href="/login" style={{ color: "white", fontWeight: 700, textDecoration: "underline" }}>
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: TX, borderTop: "1px solid #1e293b" }}>
      <div className="lp-section" style={{ paddingTop: 36, paddingBottom: 36 }}>
        <div className="lp-container">
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                width: 30, height: 30, borderRadius: 8,
                background: P, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
              }}>🗺️</span>
              <span style={{ fontWeight: 900, color: "white", fontSize: 16 }}>
                Localoop<span style={{ color: P }}>Korea</span>
              </span>
            </div>
            <p style={{ fontSize: 12, color: "#64748b", textAlign: "center" }}>
              Region-based living navigation for foreigners and Koreans in Korea.
            </p>
            <p style={{ fontSize: 12, color: "#475569" }}>© 2024 Localoop Korea</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{ background: "#ffffff", minHeight: "100dvh" }}>
      <Nav />
      <Hero />
      <Steps />
      <Features />
      <Areas />
      <Tips />
      <CTABanner />
      <Footer />
    </div>
  );
}
