import Link from "next/link";

// ── Nav ──────────────────────────────────────────────────────

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-14 md:h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <span className="text-lg md:text-xl font-black text-[var(--foreground)] tracking-tight">
            Localoop<span className="text-[var(--primary)]">.</span>
          </span>
          <span className="text-[10px] md:text-xs font-semibold text-[var(--muted-foreground)] border border-[var(--border)] rounded-full px-2 py-0.5">
            Korea
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--muted-foreground)]">
          <a href="#features" className="hover:text-[var(--foreground)] transition-colors">Features</a>
          <a href="#areas" className="hover:text-[var(--foreground)] transition-colors">Areas</a>
          <a href="#how" className="hover:text-[var(--foreground)] transition-colors">How it works</a>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <Link href="/login" className="hidden md:inline text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            Log in
          </Link>
          <Link href="/login" className="md:hidden text-sm font-medium text-[var(--muted-foreground)]">
            Log in
          </Link>
          <Link href="/signup"
            className="inline-flex items-center gap-1 bg-[var(--primary)] text-white text-xs md:text-sm font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full hover:opacity-90 transition-opacity">
            Get started →
          </Link>
        </div>
      </div>
    </header>
  );
}

// ── Hero ─────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-dvh flex items-center pt-14 md:pt-16 overflow-hidden">
      {/* Decorative circles — desktop only */}
      <div className="hidden lg:block absolute right-0 top-0 w-[750px] h-[750px] rounded-full bg-amber-100 -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="hidden lg:block absolute right-[8%] top-[12%] w-[500px] h-[500px] rounded-full bg-orange-200/70 pointer-events-none" />
      <div className="hidden lg:block absolute right-[22%] bottom-[5%] w-[240px] h-[240px] rounded-full bg-[var(--primary)]/15 pointer-events-none" />
      {/* Mobile decoration */}
      <div className="lg:hidden absolute right-0 top-20 w-[280px] h-[280px] rounded-full bg-amber-100/80 translate-x-1/3 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 w-full py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          {/* Left — text */}
          <div>
            <span className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-[var(--primary)] text-[10px] md:text-xs font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full mb-6 md:mb-8">
              🇰🇷 for foreigners &amp; locals in Korea
            </span>

            <h1 className="text-[2.6rem] sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-[var(--foreground)] mb-5 md:mb-6">
              <span className="block font-light text-[var(--muted-foreground)]">서울의 일상을</span>
              <span className="block text-[var(--primary)]">제대로.</span>
              <span className="block">Dig deeper.</span>
            </h1>

            <p className="text-base md:text-lg text-[var(--muted-foreground)] leading-relaxed max-w-[440px] mb-8 md:mb-10">
              Find foreigner-friendly places, navigate local food, connect with people — and make Korea feel like home.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8 md:mb-12">
              <Link href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-[var(--primary)] text-white font-bold text-sm md:text-base px-8 py-4 rounded-full hover:opacity-90 transition-opacity">
                지금 시작하기 →
              </Link>
              <a href="#features"
                className="inline-flex items-center justify-center gap-2 border-2 border-[var(--border)] text-[var(--foreground)] font-semibold text-sm md:text-base px-8 py-4 rounded-full hover:border-[var(--primary)] transition-colors">
                더 알아보기
              </a>
            </div>

            <div className="flex items-center gap-4 text-xs md:text-sm text-[var(--muted-foreground)]">
              <div className="flex -space-x-2">
                {["🇺🇸","🇬🇧","🇯🇵","🇩🇪","🇨🇳"].map((f, i) => (
                  <span key={i} className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-[var(--background)] bg-[var(--muted)] flex items-center justify-center text-sm shadow-sm">
                    {f}
                  </span>
                ))}
              </div>
              <span>1,200+ expats and locals joined</span>
            </div>
          </div>

          {/* Right — floating cards (desktop only) */}
          <div className="relative hidden lg:block h-[520px]">
            {/* Main feature card */}
            <div className="absolute top-8 left-12 bg-white rounded-3xl shadow-xl p-5 w-[240px] border border-gray-100">
              <div className="w-full h-28 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-4xl mb-4">
                ☕
              </div>
              <p className="font-bold text-sm text-gray-900">Fritz Coffee Company</p>
              <p className="text-xs text-gray-500 mt-0.5">📍 Seongsu · Café</p>
              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">English menu</span>
                <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium">Card OK</span>
              </div>
            </div>
            {/* Food card */}
            <div className="absolute top-[200px] right-4 bg-[var(--primary)] text-white rounded-3xl shadow-xl p-5 w-[200px]">
              <div className="text-3xl mb-3">🍜</div>
              <p className="font-bold text-sm">Tteokbokki 101</p>
              <p className="text-[11px] opacity-80 mt-1 leading-relaxed">Spice level guide for beginners</p>
              <div className="mt-3 flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className={`text-base ${i <= 3 ? "" : "opacity-30"}`}>🌶</span>
                ))}
              </div>
            </div>
            {/* Meetup badge */}
            <div className="absolute bottom-20 left-8 bg-white rounded-2xl shadow-lg px-4 py-3 border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-lg">🤝</div>
              <div>
                <p className="text-xs font-bold text-gray-900">Korean Language Exchange</p>
                <p className="text-[10px] text-gray-500">Sat · Hongdae · 12 joined</p>
              </div>
            </div>
            {/* Area tag */}
            <div className="absolute top-16 right-2 bg-amber-400 text-amber-900 rounded-2xl shadow-md px-4 py-3">
              <p className="text-xs font-black">성수동</p>
              <p className="text-[10px] font-semibold">Seongsu</p>
            </div>
            {/* Small stat */}
            <div className="absolute bottom-10 right-10 bg-white rounded-2xl shadow-lg p-4 text-center border border-gray-100">
              <p className="text-2xl font-black text-[var(--primary)]">200+</p>
              <p className="text-[10px] text-gray-500 mt-0.5">curated places</p>
            </div>
          </div>

          {/* Mobile mini-cards — shown only on mobile */}
          <div className="grid grid-cols-3 gap-3 lg:hidden">
            {[
              { emoji: "☕", name: "Fritz Coffee", area: "Seongsu", tag: "English menu", bg: "bg-amber-50" },
              { emoji: "🍜", name: "Tteokbokki 101", area: "Food guide", tag: "Beginner", bg: "bg-orange-50" },
              { emoji: "🤝", name: "Lang Exchange", area: "Hongdae", tag: "12 going", bg: "bg-purple-50" },
            ].map((c) => (
              <div key={c.name} className={`${c.bg} rounded-2xl p-3 border border-[var(--border)]`}>
                <div className="text-2xl mb-2">{c.emoji}</div>
                <p className="text-[11px] font-bold text-[var(--foreground)] leading-tight">{c.name}</p>
                <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{c.area}</p>
                <span className="inline-block mt-1.5 text-[9px] font-semibold bg-white/80 text-[var(--primary)] border border-orange-100 rounded-full px-1.5 py-0.5">
                  {c.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Stats ─────────────────────────────────────────────────────

function Stats() {
  const stats = [
    { number: "200+", label: "Foreigner-friendly places" },
    { number: "50+",  label: "Life guides" },
    { number: "6",    label: "Seoul areas" },
    { number: "Free", label: "Always" },
  ];
  return (
    <section className="bg-[var(--muted)] border-y border-[var(--border)] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <p className="text-center text-[10px] md:text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-widest mb-8 md:mb-10">
          Since 2024 — curated for real life in Korea
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl md:text-5xl font-black text-[var(--foreground)]">{s.number}</p>
              <p className="text-xs md:text-sm text-[var(--muted-foreground)] mt-2 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────

function Features() {
  const features = [
    {
      icon: "📍", title: "Places", tagline: "로컬 스팟 발견",
      description: "Foreigner-friendly cafés, restaurants, markets, and neighborhoods — curated and tagged so you can navigate Korea confidently.",
      color: "from-orange-50 to-amber-50", accent: "bg-orange-100", href: "/places",
    },
    {
      icon: "🍜", title: "Food", tagline: "음식 메뉴 탐색",
      description: "Korean dishes with spice guides, ordering tips, and menu translations so you can order confidently every time.",
      color: "from-red-50 to-orange-50", accent: "bg-red-100", href: "/food",
    },
    {
      icon: "📖", title: "Guides", tagline: "생활 가이드",
      description: "Bank accounts, public transit, healthcare — practical guides written for people figuring Korea out for the first time.",
      color: "from-blue-50 to-indigo-50", accent: "bg-blue-100", href: "/guides",
    },
    {
      icon: "🤝", title: "Meetups", tagline: "사람들과 연결",
      description: "Join local events, language exchanges, and community gatherings. Meet people who get what it's like to live in Korea.",
      color: "from-purple-50 to-pink-50", accent: "bg-purple-100", href: "/meetups",
    },
  ];

  return (
    <section id="features" className="py-16 md:py-28 max-w-7xl mx-auto px-5 md:px-8">
      <div className="text-center mb-10 md:mb-16">
        <p className="text-[10px] md:text-xs font-semibold text-[var(--primary)] uppercase tracking-widest mb-3 md:mb-4">What we offer</p>
        <h2 className="text-3xl md:text-5xl font-black text-[var(--foreground)] tracking-tight leading-tight">
          로컬을 경험하는
          <span className="text-[var(--primary)]"> 4가지 방법</span>
        </h2>
        <p className="text-base md:text-lg text-[var(--muted-foreground)] mt-3 md:mt-4 max-w-[500px] mx-auto">
          Everything you need to stop being a tourist and start living like a local.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {features.map((f) => (
          <Link key={f.title} href={f.href}
            className={`group relative rounded-2xl md:rounded-3xl bg-gradient-to-br ${f.color} p-5 md:p-7 border border-[var(--border)] hover:shadow-lg transition-all hover:-translate-y-1`}>
            <div className={`w-10 h-10 md:w-12 md:h-12 ${f.accent} rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl mb-4 md:mb-5`}>
              {f.icon}
            </div>
            <p className="text-[9px] md:text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-1.5 md:mb-2">{f.tagline}</p>
            <h3 className="text-lg md:text-xl font-black text-[var(--foreground)] mb-2 md:mb-3">{f.title}</h3>
            <p className="text-xs md:text-sm text-[var(--muted-foreground)] leading-relaxed">{f.description}</p>
            <p className="mt-4 md:mt-5 text-xs md:text-sm font-semibold text-[var(--primary)]">
              Explore {f.title} →
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── Areas ──────────────────────────────────────────────────────

function Areas() {
  const areas = [
    { name: "Seongsu",  ko: "성수동", desc: "Seoul's Brooklyn — indie cafés, studios, and curated shops.",    emoji: "🏭", tag: "trending" },
    { name: "Hongdae",  ko: "홍대",   desc: "Street food, live music, and the best late-night spots.",         emoji: "🎵", tag: "nightlife" },
    { name: "Itaewon",  ko: "이태원", desc: "International eats, English-friendly, globally connected.",       emoji: "🌍", tag: "expat hub" },
    { name: "Yeonnam",  ko: "연남동", desc: "Quiet alleys, brunch spots, and a relaxed local vibe.",           emoji: "🌿", tag: "brunch" },
    { name: "Gangnam",  ko: "강남",   desc: "Polished, modern, and easy to navigate for newcomers.",           emoji: "🏙️", tag: "modern" },
    { name: "Bukchon",  ko: "북촌",   desc: "Traditional hanok village with the best cultural spots.",         emoji: "🏯", tag: "culture" },
  ];

  return (
    <section id="areas" className="py-16 md:py-28 bg-[var(--foreground)] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-10 md:mb-16">
          <div>
            <p className="text-[10px] md:text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3 md:mb-4">Areas</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              당신의 동네를
              <br />
              <span className="text-[var(--primary)]">찾아보세요</span>
            </h2>
          </div>
          <p className="text-base text-white/60 md:max-w-[340px]">
            Curated guides for every major neighborhood in Seoul — find the one that fits your style.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {areas.map((area) => (
            <div key={area.name}
              className="group rounded-2xl md:rounded-3xl border border-white/10 p-5 md:p-7 hover:border-[var(--primary)] hover:bg-white/5 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4 md:mb-5">
                <span className="text-3xl md:text-4xl">{area.emoji}</span>
                <span className="text-[9px] md:text-[10px] font-bold text-white/40 uppercase tracking-widest border border-white/20 rounded-full px-2.5 md:px-3 py-0.5 md:py-1">
                  {area.tag}
                </span>
              </div>
              <p className="text-[10px] md:text-xs font-semibold text-white/40 mb-1">{area.ko}</p>
              <h3 className="text-xl md:text-2xl font-black mb-1.5 md:mb-2">{area.name}</h3>
              <p className="text-xs md:text-sm text-white/60 leading-relaxed">{area.desc}</p>
              <p className="mt-4 md:mt-5 text-xs md:text-sm font-semibold text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                Explore {area.name} →
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How it works ──────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    { number: "01", title: "Sign up — it's free",    desc: "Create your account and tell us your region and interests. Takes under a minute." },
    { number: "02", title: "Explore your area",       desc: "Browse curated places, food guides, and local events filtered for where you live." },
    { number: "03", title: "Connect with locals",     desc: "Join meetups, ask questions in the community, and find people who know Korea inside out." },
  ];

  return (
    <section id="how" className="py-16 md:py-28 max-w-7xl mx-auto px-5 md:px-8">
      <div className="grid lg:grid-cols-2 gap-10 md:gap-20 items-center">
        <div>
          <p className="text-[10px] md:text-xs font-semibold text-[var(--primary)] uppercase tracking-widest mb-3 md:mb-4">How it works</p>
          <h2 className="text-3xl md:text-5xl font-black text-[var(--foreground)] tracking-tight leading-tight mb-4 md:mb-6">
            3분이면
            <br />
            <span className="text-[var(--primary)]">시작할 수 있어요</span>
          </h2>
          <p className="text-base md:text-lg text-[var(--muted-foreground)] leading-relaxed">
            No complicated setup. Sign up, pick your area, and start exploring Seoul the way you want to.
          </p>
        </div>

        <div className="space-y-4 md:space-y-6">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-4 md:gap-6 items-start">
              <div className="shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center">
                <span className="text-xs md:text-sm font-black text-[var(--primary)]">{step.number}</span>
              </div>
              <div className="pt-1 md:pt-2">
                <h3 className="text-base md:text-lg font-bold text-[var(--foreground)] mb-1">{step.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────

function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-[var(--primary)] py-20 md:py-28">
      <div className="absolute left-0 top-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] rounded-full bg-white/10 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-[350px] md:w-[500px] h-[350px] md:h-[500px] rounded-full bg-white/10 translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-8 text-center text-white">
        <p className="text-[10px] md:text-xs font-semibold text-orange-200 uppercase tracking-widest mb-5 md:mb-6">
          Join Localoop Korea
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-5 md:mb-6 leading-tight">
          서울에서의 생활,
          <br />
          지금 시작하세요.
        </h2>
        <p className="text-base md:text-xl text-orange-100 mb-8 md:mb-10 max-w-[440px] mx-auto leading-relaxed">
          Everything you need to feel at home in Korea — in one place, completely free.
        </p>
        <Link href="/signup"
          className="inline-flex items-center gap-2 bg-white text-[var(--primary)] font-black text-base md:text-lg px-8 md:px-10 py-4 md:py-5 rounded-full hover:opacity-90 transition-opacity shadow-lg">
          무료로 시작하기 →
        </Link>
        <p className="mt-5 text-sm text-orange-200">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold underline underline-offset-2 hover:text-white transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[var(--muted)] border-t border-[var(--border)] py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div className="flex items-center gap-2">
          <span className="text-base md:text-lg font-black text-[var(--foreground)]">
            Localoop<span className="text-[var(--primary)]">.</span>
          </span>
          <span className="text-[10px] text-[var(--muted-foreground)] border border-[var(--border)] rounded-full px-2 py-0.5">
            Korea
          </span>
        </div>
        <p className="text-xs md:text-sm text-[var(--muted-foreground)]">
          Region-based living navigation for foreigners and Koreans in Korea.
        </p>
        <p className="text-xs text-[var(--muted-foreground)]">© 2024 Localoop Korea.</p>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-dvh">
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <Areas />
      <HowItWorks />
      <CTABanner />
      <Footer />
    </div>
  );
}
