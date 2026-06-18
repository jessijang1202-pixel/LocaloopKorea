import Link from "next/link";

// ── Design tokens (matches updated CSS vars) ─────────────────
const C = {
  primary: "#06B6D4",
  dark: "#0891B2",
  light: "#e0f9fc",
  bg: "#ffffff",
  gray: "#f8fbfc",
  border: "#e2f4f7",
  text: "#0f172a",
  muted: "#64748b",
};

// ── Wave SVG dividers ─────────────────────────────────────────
function WaveDown({ fill = C.primary }: { fill?: string }) {
  return (
    <div className="w-full overflow-hidden leading-[0] -mb-px">
      <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[40px] md:h-[60px]">
        <path fill={fill} d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
      </svg>
    </div>
  );
}
function WaveUp({ fill = "#ffffff" }: { fill?: string }) {
  return (
    <div className="w-full overflow-hidden leading-[0] -mt-px">
      <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[40px] md:h-[60px]">
        <path fill={fill} d="M0,30 C360,0 1080,60 1440,30 L1440,0 L0,0 Z" />
      </svg>
    </div>
  );
}

// ── Nav ──────────────────────────────────────────────────────
function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm shadow-cyan-100">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 md:h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-sm md:text-base" style={{ background: C.primary }}>
            🗺️
          </div>
          <span className="text-base md:text-lg font-black tracking-tight" style={{ color: C.text }}>
            Localoop<span style={{ color: C.primary }}>Korea</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold" style={{ color: C.muted }}>
          <a href="#features" className="hover:text-cyan-600 transition-colors">Features</a>
          <a href="#areas" className="hover:text-cyan-600 transition-colors">Areas</a>
          <a href="#how" className="hover:text-cyan-600 transition-colors">How it works</a>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login" className="text-xs md:text-sm font-semibold px-3 md:px-4 py-2 rounded-full border-2 transition-colors hover:border-cyan-400"
            style={{ borderColor: C.border, color: C.muted }}>
            Log in
          </Link>
          <Link href="/signup"
            className="text-xs md:text-sm font-bold px-4 md:px-5 py-2 rounded-full text-white transition-opacity hover:opacity-85"
            style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}>
            시작하기 →
          </Link>
        </div>
      </div>
    </header>
  );
}

// ── Hero ─────────────────────────────────────────────────────
function Hero() {
  const cards = [
    { emoji: "☕", name: "Fritz Coffee", area: "성수동", tag: "English menu", bg: "#FFF7ED", border: "#FED7AA" },
    { emoji: "🍜", name: "Tteokbokki 101", area: "Food guide", tag: "Beginner friendly", bg: "#F0FDFA", border: "#99F6E4" },
    { emoji: "🤝", name: "Language Exchange", area: "Hongdae 홍대", tag: "12 going", bg: "#F5F3FF", border: "#DDD6FE" },
  ];

  return (
    <section className="relative pt-14 md:pt-16 overflow-hidden" style={{ background: "linear-gradient(180deg, #f0fdfe 0%, #ffffff 100%)" }}>
      {/* Decorative blobs */}
      <div className="absolute top-10 right-0 w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${C.primary}, transparent)`, transform: "translate(30%, -20%)" }} />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${C.dark}, transparent)`, transform: "translate(-30%, 30%)" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 pt-10 md:pt-16 pb-4 md:pb-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold mb-6 md:mb-8"
              style={{ background: C.light, color: C.dark }}>
              🇰🇷 &nbsp;외국인을 위한 서울 가이드
            </div>

            <h1 className="font-black leading-[1.1] tracking-tight mb-4 md:mb-6"
              style={{ color: C.text, fontSize: "clamp(2.2rem, 5vw, 3.75rem)" }}>
              서울의 <span style={{ color: C.primary }}>진짜 로컬</span>을<br />
              경험하세요
            </h1>

            <p className="text-base md:text-lg leading-relaxed mb-6 md:mb-8" style={{ color: C.muted }}>
              외국인 친화적인 장소, 음식 가이드, 생활 정보, 밋업—<br className="hidden md:block" />
              서울 생활이 편해지는 모든 것이 한 곳에.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8 md:mb-10">
              <Link href="/signup"
                className="inline-flex items-center justify-center gap-2 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-lg shadow-cyan-200 transition-all hover:shadow-xl hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}>
                무료로 시작하기 🚀
              </Link>
              <a href="#features"
                className="inline-flex items-center justify-center gap-2 font-semibold text-base px-8 py-4 rounded-2xl border-2 transition-colors hover:border-cyan-400"
                style={{ borderColor: C.border, color: C.muted }}>
                더 알아보기
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 text-xs md:text-sm" style={{ color: C.muted }}>
              <div className="flex -space-x-2">
                {["🇺🇸","🇬🇧","🇯🇵","🇩🇪","🇨🇳","🇫🇷"].map((f, i) => (
                  <span key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-sm shadow-sm"
                    style={{ background: C.light }}>
                    {f}
                  </span>
                ))}
              </div>
              <span><strong style={{ color: C.text }}>1,200+</strong> expats &amp; locals joined</span>
            </div>
          </div>

          {/* Right — cards */}
          <div className="flex flex-col gap-3 lg:gap-4">
            {cards.map((c) => (
              <div key={c.name}
                className="flex items-center gap-4 rounded-2xl p-4 border-2 shadow-sm"
                style={{ background: c.bg, borderColor: c.border }}>
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-2xl md:text-3xl shrink-0 bg-white shadow-sm">
                  {c.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm md:text-base truncate" style={{ color: C.text }}>{c.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: C.muted }}>📍 {c.area}</p>
                </div>
                <span className="shrink-0 text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full border"
                  style={{ background: "white", borderColor: C.border, color: C.primary }}>
                  {c.tag}
                </span>
              </div>
            ))}
            {/* Mini stat */}
            <div className="grid grid-cols-3 gap-2 mt-1">
              {[
                { n: "200+", l: "Places" },
                { n: "50+", l: "Guides" },
                { n: "6", l: "Areas" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl py-3 text-center border-2"
                  style={{ background: C.light, borderColor: C.border }}>
                  <p className="text-lg md:text-xl font-black" style={{ color: C.primary }}>{s.n}</p>
                  <p className="text-[10px] md:text-xs font-semibold" style={{ color: C.muted }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <WaveDown fill={C.primary} />
    </section>
  );
}

// ── Steps ─────────────────────────────────────────────────────
function Steps() {
  const steps = [
    { num: "01", emoji: "📝", title: "가입하기",       desc: "이름과 관심 지역을 입력하면 끝. 1분도 안 걸려요." },
    { num: "02", emoji: "📍", title: "지역 탐색",      desc: "내 근처 외국인 친화 장소와 로컬 맛집을 확인해요." },
    { num: "03", emoji: "🍜", title: "음식 주문 도전", desc: "초보자 맞춤 메뉴 가이드로 자신 있게 주문하세요." },
    { num: "04", emoji: "🤝", title: "커뮤니티 참여",  desc: "밋업 참여하고 같은 관심사를 가진 사람들을 만나요." },
  ];

  return (
    <section id="how" style={{ background: C.primary }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-14 md:py-20">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs font-bold text-cyan-200 uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
            서울 탐험 순서
          </h2>
          <p className="mt-3 text-sm md:text-base text-cyan-100">딱 4단계면 서울 로컬처럼 생활할 수 있어요</p>
        </div>

        {/* Desktop: horizontal flow / Mobile: vertical list */}
        <div className="hidden md:flex items-start justify-center gap-0">
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-start" style={{ flex: 1 }}>
              <div className="flex flex-col items-center flex-1">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl shadow-lg mb-4">
                  {step.emoji}
                </div>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black mb-3"
                  style={{ background: C.dark, color: "white" }}>
                  {step.num}
                </div>
                <div className="text-center px-2">
                  <p className="font-black text-white text-sm mb-1">{step.title}</p>
                  <p className="text-cyan-100 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="mt-8 text-cyan-300 text-xl font-bold px-1 shrink-0">→</div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile vertical */}
        <div className="md:hidden space-y-4">
          {steps.map((step) => (
            <div key={step.num} className="flex items-start gap-4 bg-white/10 rounded-2xl p-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-xl shrink-0 shadow">
                {step.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white" style={{ background: C.dark }}>
                    {step.num}
                  </span>
                  <p className="font-black text-white text-sm">{step.title}</p>
                </div>
                <p className="text-cyan-100 text-xs leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <WaveUp fill="#ffffff" />
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
      bg: "#FFF7ED", border: "#FED7AA", accent: "#F97316",
    },
    {
      emoji: "🍜", title: "Food", ko: "음식 가이드",
      desc: "매운맛 단계, 주문 팁, 메뉴 설명으로 자신 있게 도전하세요.",
      tags: ["초보자 추천", "매운맛 주의", "채식 표시"],
      bg: "#F0FDFA", border: "#99F6E4", accent: "#14B8A6",
    },
    {
      emoji: "📖", title: "Guides", ko: "생활 가이드",
      desc: "은행 계좌 개설부터 대중교통까지—한국 정착에 필요한 모든 정보.",
      tags: ["교통카드", "병원 이용", "주거 계약"],
      bg: "#EFF6FF", border: "#BFDBFE", accent: "#3B82F6",
    },
    {
      emoji: "🤝", title: "Meetups", ko: "밋업 & 커뮤니티",
      desc: "언어 교환, 동네 모임, 커뮤니티 이벤트로 사람들과 연결되세요.",
      tags: ["언어 교환", "동네 모임", "무료 이벤트"],
      bg: "#F5F3FF", border: "#DDD6FE", accent: "#8B5CF6",
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.primary }}>What we offer</p>
          <h2 className="text-2xl md:text-4xl font-black leading-tight" style={{ color: C.text }}>
            로컬을 경험하는 <span style={{ color: C.primary }}>4가지 방법</span>
          </h2>
          <p className="mt-3 text-sm md:text-base" style={{ color: C.muted }}>
            관광객이 아닌 로컬처럼 서울을 즐기는 데 필요한 모든 것
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {features.map((f) => (
            <Link key={f.title} href={`/${f.title.toLowerCase()}`}
              className="group rounded-2xl md:rounded-3xl p-5 md:p-6 border-2 transition-all hover:-translate-y-1 hover:shadow-lg"
              style={{ background: f.bg, borderColor: f.border }}>
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm mb-4 border"
                style={{ borderColor: f.border }}>
                {f.emoji}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: f.accent }}>{f.ko}</p>
              <h3 className="text-lg font-black mb-2" style={{ color: C.text }}>{f.title}</h3>
              <p className="text-xs leading-relaxed mb-4" style={{ color: C.muted }}>{f.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {f.tags.map((t) => (
                  <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border"
                    style={{ borderColor: f.border, color: f.accent }}>
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Areas ──────────────────────────────────────────────────────
function Areas() {
  const areas = [
    { name: "Seongsu",  ko: "성수동", desc: "서울의 Brooklyn — 인디 카페, 스튜디오, 감성 맛집", emoji: "🏭", color: "#FFF7ED", border: "#FED7AA" },
    { name: "Hongdae",  ko: "홍대",   desc: "길거리 음식, 라이브 공연, 늦은 밤까지 활기찬 핫플", emoji: "🎵", color: "#F0FDFA", border: "#99F6E4" },
    { name: "Itaewon",  ko: "이태원", desc: "영어 가능한 글로벌 식당과 외국인 친화 쇼핑가",      emoji: "🌍", color: "#EFF6FF", border: "#BFDBFE" },
    { name: "Yeonnam",  ko: "연남동", desc: "골목 카페, 브런치 맛집, 여유로운 동네 분위기",        emoji: "🌿", color: "#F0FDF4", border: "#BBF7D0" },
    { name: "Gangnam",  ko: "강남",   desc: "깔끔하고 모던한, 처음 오는 사람도 쉽게 찾는 명소",  emoji: "🏙️", color: "#F5F3FF", border: "#DDD6FE" },
    { name: "Bukchon",  ko: "북촌",   desc: "한옥 마을과 전통 문화 체험 — 서울의 역사를 느껴요",  emoji: "🏯", color: "#FFF1F2", border: "#FECDD3" },
  ];

  return (
    <section id="areas" style={{ background: C.muted + "20" }} className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.primary }}>Seoul Areas</p>
          <h2 className="text-2xl md:text-4xl font-black leading-tight" style={{ color: C.text }}>
            당신의 동네를 <span style={{ color: C.primary }}>찾아보세요</span>
          </h2>
          <p className="mt-3 text-sm md:text-base" style={{ color: C.muted }}>
            서울 주요 동네별 큐레이션 가이드
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {areas.map((area) => (
            <div key={area.name}
              className="group rounded-2xl border-2 p-4 md:p-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md"
              style={{ background: area.color, borderColor: area.border }}>
              <div className="text-3xl md:text-4xl mb-3">{area.emoji}</div>
              <p className="text-[10px] md:text-xs font-bold mb-0.5" style={{ color: C.muted }}>{area.ko}</p>
              <h3 className="text-base md:text-lg font-black mb-1 md:mb-2" style={{ color: C.text }}>{area.name}</h3>
              <p className="text-[11px] md:text-xs leading-relaxed hidden md:block" style={{ color: C.muted }}>{area.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Tips ──────────────────────────────────────────────────────
function Tips() {
  const tips = [
    { emoji: "✅", text: "영어 메뉴 있는 곳만 필터링 가능해요" },
    { emoji: "✅", text: "카드 결제 여부를 미리 확인할 수 있어요" },
    { emoji: "✅", text: "매운맛 단계를 미리 체크하고 주문하세요" },
    { emoji: "✅", text: "혼자 가도 어색하지 않은 솔로 친화 공간 표시" },
    { emoji: "⚠️", text: "일부 가게는 현금만 받으니 미리 확인" },
    { emoji: "⚠️", text: "예약 필수인 맛집은 사전에 준비 필요" },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.primary }}>Tips</p>
            <h2 className="text-2xl md:text-4xl font-black leading-tight mb-4" style={{ color: C.text }}>
              처음 와도 <span style={{ color: C.primary }}>걱정 없어요</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed mb-6" style={{ color: C.muted }}>
              Localoop Korea는 외국인이 한국에서 실제로 겪는 불편함을 해결하기 위해 만들어졌어요.
              각 장소와 음식마다 실용적인 정보가 태그로 정리되어 있어요.
            </p>
            <Link href="/signup"
              className="inline-flex items-center gap-2 text-white font-bold text-sm md:text-base px-7 py-3.5 rounded-2xl shadow-md transition-all hover:opacity-85"
              style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})` }}>
              지금 바로 탐색하기 →
            </Link>
          </div>

          <div className="rounded-3xl p-6 md:p-8 border-2" style={{ background: C.light, borderColor: C.border }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: C.primary }}>
                💡
              </div>
              <div>
                <p className="font-black text-sm md:text-base" style={{ color: C.text }}>Localoop 이용 팁</p>
                <p className="text-xs" style={{ color: C.muted }}>알아두면 좋은 것들</p>
              </div>
            </div>
            <div className="space-y-3">
              {tips.map((tip) => (
                <div key={tip.text} className="flex items-start gap-3 bg-white rounded-xl p-3 border" style={{ borderColor: C.border }}>
                  <span className="text-base shrink-0">{tip.emoji}</span>
                  <p className="text-xs md:text-sm" style={{ color: C.text }}>{tip.text}</p>
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
    <section className="relative overflow-hidden py-20 md:py-28"
      style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.dark} 100%)` }}>
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 rounded-full bg-white/10 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-48 h-48 md:w-72 md:h-72 rounded-full bg-white/10 translate-x-1/3 translate-y-1/3 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-5 md:px-8 text-center text-white">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl mx-auto mb-6">
          🗺️
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
          서울 생활,<br />지금 시작하세요
        </h2>
        <p className="text-sm md:text-lg text-cyan-100 mb-8 max-w-[400px] mx-auto leading-relaxed">
          가입 무료 · 광고 없음 · 외국인을 위해 직접 큐레이션한 콘텐츠
        </p>
        <Link href="/signup"
          className="inline-flex items-center gap-2 bg-white font-black text-base md:text-lg px-8 md:px-10 py-4 md:py-5 rounded-2xl shadow-xl transition-all hover:scale-105"
          style={{ color: C.dark }}>
          무료로 시작하기 🚀
        </Link>
        <p className="mt-5 text-xs md:text-sm text-cyan-200">
          이미 계정이 있나요?{" "}
          <Link href="/login" className="font-bold underline underline-offset-2 hover:text-white transition-colors">
            로그인
          </Link>
        </p>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-8 md:py-10 border-t" style={{ background: C.text, borderColor: "#1e293b" }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: C.primary }}>
            🗺️
          </div>
          <span className="font-black text-white">Localoop<span style={{ color: C.primary }}>Korea</span></span>
        </div>
        <p className="text-xs text-slate-400">
          Region-based living navigation for foreigners and Koreans in Korea.
        </p>
        <p className="text-xs text-slate-500">© 2024 Localoop Korea</p>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-dvh" style={{ background: C.bg }}>
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
