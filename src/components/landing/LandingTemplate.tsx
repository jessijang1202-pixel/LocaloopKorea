import Link from "next/link";
import type { LandingData } from "./content";

const P  = "#06B6D4";
const PD = "#0891B2";
const PL = "#e0f9fc";
const TX = "#0f172a";
const MU = "#64748b";

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
function Nav({ d }: { d: LandingData }) {
  return (
    <header className="lp-nav">
      <div className="lp-nav-inner">
        <a href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <span style={{
            width:34, height:34, borderRadius:10, fontSize:16,
            background:`linear-gradient(135deg,${P},${PD})`,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>🗺️</span>
          <span style={{ fontSize:17, fontWeight:900, color:TX, letterSpacing:"-0.02em" }}>
            Localoop<span style={{ color:P }}>Korea</span>
          </span>
        </a>

        <nav className="lp-nav-links">
          {d.nav.links.map(({ href, label }) => (
            <a key={href} href={href} className="lp-nav-link">{label}</a>
          ))}
        </nav>

        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {/* Language toggle */}
          <a href={d.altLangPath} className="lp-nav-lang">
            {d.altLang}
          </a>
          <Link href="/login" className="lp-nav-login">
            {d.nav.login}
          </Link>
          <Link href="/signup" className="lp-nav-cta"
            style={{ background:`linear-gradient(135deg,${P},${PD})` }}>
            {d.nav.cta}
          </Link>
        </div>
      </div>
    </header>
  );
}

// ── Seoul Map Panel ───────────────────────────────────────────
const MAP_PIN_COLORS: Record<string,string> = {
  place:  "#C2410C",
  food:   "#0F766E",
  guide:  "#1D4ED8",
  meetup: "#6D28D9",
};
type PinDef = { cat:string; size:number; left:number; top:number; delay:number };
const MAP_PINS: PinDef[] = [
  // food: 63 icons (3×), size 12
  { cat:"food", size:12, left:12, top:22, delay:0.00 },
  { cat:"food", size:12, left:26, top:18, delay:0.12 },
  { cat:"food", size:12, left:40, top:24, delay:0.24 },
  { cat:"food", size:12, left:56, top:16, delay:0.36 },
  { cat:"food", size:12, left:72, top:20, delay:0.48 },
  { cat:"food", size:12, left:16, top:38, delay:0.60 },
  { cat:"food", size:12, left:30, top:42, delay:0.72 },
  { cat:"food", size:12, left:44, top:36, delay:0.84 },
  { cat:"food", size:12, left:58, top:40, delay:0.96 },
  { cat:"food", size:12, left:70, top:34, delay:1.08 },
  { cat:"food", size:12, left:84, top:38, delay:1.20 },
  { cat:"food", size:12, left:14, top:58, delay:1.32 },
  { cat:"food", size:12, left:28, top:54, delay:1.44 },
  { cat:"food", size:12, left:42, top:60, delay:1.56 },
  { cat:"food", size:12, left:56, top:56, delay:1.68 },
  { cat:"food", size:12, left:68, top:62, delay:1.80 },
  { cat:"food", size:12, left:82, top:56, delay:1.92 },
  { cat:"food", size:12, left:20, top:74, delay:2.04 },
  { cat:"food", size:12, left:36, top:70, delay:2.16 },
  { cat:"food", size:12, left:52, top:76, delay:2.28 },
  { cat:"food", size:12, left:66, top:72, delay:2.40 },
  { cat:"food", size:12, left:8,  top:12, delay:2.52 },
  { cat:"food", size:12, left:18, top:14, delay:2.58 },
  { cat:"food", size:12, left:32, top:12, delay:2.64 },
  { cat:"food", size:12, left:48, top:14, delay:2.70 },
  { cat:"food", size:12, left:62, top:12, delay:2.76 },
  { cat:"food", size:12, left:76, top:10, delay:2.82 },
  { cat:"food", size:12, left:88, top:14, delay:2.88 },
  { cat:"food", size:12, left:6,  top:20, delay:2.94 },
  { cat:"food", size:12, left:34, top:20, delay:3.00 },
  { cat:"food", size:12, left:50, top:18, delay:3.06 },
  { cat:"food", size:12, left:64, top:22, delay:3.12 },
  { cat:"food", size:12, left:80, top:24, delay:3.18 },
  { cat:"food", size:12, left:10, top:30, delay:3.24 },
  { cat:"food", size:12, left:22, top:34, delay:3.30 },
  { cat:"food", size:12, left:50, top:30, delay:3.36 },
  { cat:"food", size:12, left:62, top:34, delay:3.42 },
  { cat:"food", size:12, left:78, top:30, delay:3.48 },
  { cat:"food", size:12, left:86, top:32, delay:3.54 },
  { cat:"food", size:12, left:8,  top:44, delay:3.60 },
  { cat:"food", size:12, left:22, top:46, delay:3.66 },
  { cat:"food", size:12, left:36, top:40, delay:3.72 },
  { cat:"food", size:12, left:64, top:44, delay:3.78 },
  { cat:"food", size:12, left:76, top:42, delay:3.84 },
  { cat:"food", size:12, left:88, top:46, delay:3.90 },
  { cat:"food", size:12, left:18, top:52, delay:3.96 },
  { cat:"food", size:12, left:32, top:50, delay:4.02 },
  { cat:"food", size:12, left:46, top:52, delay:4.08 },
  { cat:"food", size:12, left:74, top:52, delay:4.14 },
  { cat:"food", size:12, left:88, top:52, delay:4.20 },
  { cat:"food", size:12, left:8,  top:62, delay:4.26 },
  { cat:"food", size:12, left:38, top:64, delay:4.32 },
  { cat:"food", size:12, left:62, top:60, delay:4.38 },
  { cat:"food", size:12, left:76, top:66, delay:4.44 },
  { cat:"food", size:12, left:86, top:62, delay:4.50 },
  { cat:"food", size:12, left:10, top:70, delay:4.56 },
  { cat:"food", size:12, left:24, top:76, delay:4.62 },
  { cat:"food", size:12, left:44, top:72, delay:4.68 },
  { cat:"food", size:12, left:58, top:76, delay:4.74 },
  { cat:"food", size:12, left:72, top:78, delay:4.80 },
  { cat:"food", size:12, left:86, top:74, delay:4.86 },
  { cat:"food", size:12, left:16, top:82, delay:4.92 },
  { cat:"food", size:12, left:78, top:84, delay:4.98 },
  // place: 30 icons (2×), size 16
  { cat:"place", size:16, left:20, top:28, delay:0.06 },
  { cat:"place", size:16, left:36, top:32, delay:0.23 },
  { cat:"place", size:16, left:52, top:26, delay:0.40 },
  { cat:"place", size:16, left:68, top:28, delay:0.57 },
  { cat:"place", size:16, left:10, top:46, delay:0.74 },
  { cat:"place", size:16, left:26, top:50, delay:0.91 },
  { cat:"place", size:16, left:48, top:48, delay:1.08 },
  { cat:"place", size:16, left:74, top:46, delay:1.25 },
  { cat:"place", size:16, left:22, top:64, delay:1.42 },
  { cat:"place", size:16, left:38, top:66, delay:1.59 },
  { cat:"place", size:16, left:54, top:68, delay:1.76 },
  { cat:"place", size:16, left:78, top:64, delay:1.93 },
  { cat:"place", size:16, left:32, top:80, delay:2.10 },
  { cat:"place", size:16, left:48, top:82, delay:2.27 },
  { cat:"place", size:16, left:64, top:78, delay:2.44 },
  { cat:"place", size:16, left:8,  top:24, delay:2.61 },
  { cat:"place", size:16, left:44, top:22, delay:2.78 },
  { cat:"place", size:16, left:60, top:30, delay:2.95 },
  { cat:"place", size:16, left:86, top:26, delay:3.12 },
  { cat:"place", size:16, left:14, top:42, delay:3.29 },
  { cat:"place", size:16, left:34, top:44, delay:3.46 },
  { cat:"place", size:16, left:58, top:50, delay:3.63 },
  { cat:"place", size:16, left:84, top:50, delay:3.80 },
  { cat:"place", size:16, left:16, top:62, delay:3.97 },
  { cat:"place", size:16, left:42, top:70, delay:4.14 },
  { cat:"place", size:16, left:66, top:62, delay:4.31 },
  { cat:"place", size:16, left:88, top:68, delay:4.48 },
  { cat:"place", size:16, left:20, top:78, delay:4.65 },
  { cat:"place", size:16, left:56, top:82, delay:4.82 },
  { cat:"place", size:16, left:80, top:76, delay:4.99 },
  // guide: 18 icons (2×), size 22 — 9 spread + 9 concentrated Mapo/Yongsan
  { cat:"guide", size:22, left:18, top:32, delay:0.04 },
  { cat:"guide", size:22, left:44, top:28, delay:0.34 },
  { cat:"guide", size:22, left:70, top:24, delay:0.64 },
  { cat:"guide", size:22, left:24, top:52, delay:0.94 },
  { cat:"guide", size:22, left:50, top:54, delay:1.24 },
  { cat:"guide", size:22, left:76, top:50, delay:1.54 },
  { cat:"guide", size:22, left:30, top:74, delay:1.84 },
  { cat:"guide", size:22, left:56, top:72, delay:2.14 },
  { cat:"guide", size:22, left:80, top:70, delay:2.44 },
  { cat:"guide", size:22, left:28, top:36, delay:2.74 },
  { cat:"guide", size:22, left:36, top:32, delay:3.04 },
  { cat:"guide", size:22, left:44, top:38, delay:3.34 },
  { cat:"guide", size:22, left:40, top:54, delay:3.64 },
  { cat:"guide", size:22, left:48, top:52, delay:3.94 },
  { cat:"guide", size:22, left:52, top:60, delay:4.24 },
  { cat:"guide", size:22, left:34, top:58, delay:4.54 },
  { cat:"guide", size:22, left:46, top:46, delay:4.84 },
  { cat:"guide", size:22, left:54, top:46, delay:5.14 },
  // meetup: 6 icons, size 29
  { cat:"meetup", size:29, left:34, top:44, delay:0.08 },
  { cat:"meetup", size:29, left:58, top:38, delay:0.58 },
  { cat:"meetup", size:29, left:80, top:44, delay:1.08 },
  { cat:"meetup", size:29, left:26, top:62, delay:1.58 },
  { cat:"meetup", size:29, left:46, top:60, delay:2.08 },
  { cat:"meetup", size:29, left:68, top:66, delay:2.38 },
  // place: additional 30 (×2 total=60) — concentrated Mapo/Yongsan/Myeongdong
  { cat:"place", size:16, left:25, top:32, delay:5.16 },
  { cat:"place", size:16, left:31, top:28, delay:5.33 },
  { cat:"place", size:16, left:37, top:34, delay:5.50 },
  { cat:"place", size:16, left:43, top:30, delay:5.67 },
  { cat:"place", size:16, left:29, top:40, delay:5.84 },
  { cat:"place", size:16, left:35, top:36, delay:6.01 },
  { cat:"place", size:16, left:41, top:42, delay:6.18 },
  { cat:"place", size:16, left:27, top:44, delay:6.35 },
  { cat:"place", size:16, left:33, top:46, delay:6.52 },
  { cat:"place", size:16, left:39, top:54, delay:6.69 },
  { cat:"place", size:16, left:45, top:52, delay:6.86 },
  { cat:"place", size:16, left:51, top:56, delay:7.03 },
  { cat:"place", size:16, left:57, top:54, delay:7.20 },
  { cat:"place", size:16, left:43, top:60, delay:7.37 },
  { cat:"place", size:16, left:49, top:58, delay:7.54 },
  { cat:"place", size:16, left:55, top:62, delay:7.71 },
  { cat:"place", size:16, left:41, top:66, delay:7.88 },
  { cat:"place", size:16, left:47, top:64, delay:8.05 },
  { cat:"place", size:16, left:44, top:44, delay:8.22 },
  { cat:"place", size:16, left:48, top:46, delay:8.39 },
  { cat:"place", size:16, left:52, top:44, delay:8.56 },
  { cat:"place", size:16, left:56, top:46, delay:8.73 },
  { cat:"place", size:16, left:46, top:50, delay:8.90 },
  { cat:"place", size:16, left:50, top:52, delay:9.07 },
  { cat:"place", size:16, left:54, top:50, delay:9.24 },
  { cat:"place", size:16, left:32, top:48, delay:9.41 },
  { cat:"place", size:16, left:36, top:52, delay:9.58 },
  { cat:"place", size:16, left:40, top:50, delay:9.75 },
  { cat:"place", size:16, left:42, top:46, delay:9.92 },
  { cat:"place", size:16, left:38, top:44, delay:10.09 },
  // food: additional 63 (×2 total=126) — concentrated Mapo/Yongsan/Myeongdong
  { cat:"food", size:12, left:23, top:28, delay:5.04 },
  { cat:"food", size:12, left:27, top:30, delay:5.10 },
  { cat:"food", size:12, left:31, top:28, delay:5.16 },
  { cat:"food", size:12, left:35, top:32, delay:5.22 },
  { cat:"food", size:12, left:39, top:28, delay:5.28 },
  { cat:"food", size:12, left:43, top:30, delay:5.34 },
  { cat:"food", size:12, left:24, top:34, delay:5.40 },
  { cat:"food", size:12, left:28, top:32, delay:5.46 },
  { cat:"food", size:12, left:32, top:36, delay:5.52 },
  { cat:"food", size:12, left:36, top:32, delay:5.58 },
  { cat:"food", size:12, left:40, top:36, delay:5.64 },
  { cat:"food", size:12, left:44, top:32, delay:5.70 },
  { cat:"food", size:12, left:23, top:40, delay:5.76 },
  { cat:"food", size:12, left:27, top:38, delay:5.82 },
  { cat:"food", size:12, left:31, top:42, delay:5.88 },
  { cat:"food", size:12, left:35, top:38, delay:5.94 },
  { cat:"food", size:12, left:39, top:42, delay:6.00 },
  { cat:"food", size:12, left:43, top:38, delay:6.06 },
  { cat:"food", size:12, left:25, top:46, delay:6.12 },
  { cat:"food", size:12, left:29, top:44, delay:6.18 },
  { cat:"food", size:12, left:33, top:48, delay:6.24 },
  { cat:"food", size:12, left:37, top:44, delay:6.30 },
  { cat:"food", size:12, left:37, top:52, delay:6.36 },
  { cat:"food", size:12, left:41, top:50, delay:6.42 },
  { cat:"food", size:12, left:45, top:54, delay:6.48 },
  { cat:"food", size:12, left:49, top:50, delay:6.54 },
  { cat:"food", size:12, left:53, top:54, delay:6.60 },
  { cat:"food", size:12, left:57, top:50, delay:6.66 },
  { cat:"food", size:12, left:38, top:58, delay:6.72 },
  { cat:"food", size:12, left:42, top:56, delay:6.78 },
  { cat:"food", size:12, left:46, top:60, delay:6.84 },
  { cat:"food", size:12, left:50, top:56, delay:6.90 },
  { cat:"food", size:12, left:54, top:60, delay:6.96 },
  { cat:"food", size:12, left:37, top:64, delay:7.02 },
  { cat:"food", size:12, left:41, top:62, delay:7.08 },
  { cat:"food", size:12, left:45, top:66, delay:7.14 },
  { cat:"food", size:12, left:49, top:62, delay:7.20 },
  { cat:"food", size:12, left:53, top:66, delay:7.26 },
  { cat:"food", size:12, left:39, top:68, delay:7.32 },
  { cat:"food", size:12, left:43, top:66, delay:7.38 },
  { cat:"food", size:12, left:47, top:68, delay:7.44 },
  { cat:"food", size:12, left:51, top:64, delay:7.50 },
  { cat:"food", size:12, left:55, top:66, delay:7.56 },
  { cat:"food", size:12, left:45, top:42, delay:7.62 },
  { cat:"food", size:12, left:47, top:44, delay:7.68 },
  { cat:"food", size:12, left:49, top:42, delay:7.74 },
  { cat:"food", size:12, left:51, top:44, delay:7.80 },
  { cat:"food", size:12, left:53, top:42, delay:7.86 },
  { cat:"food", size:12, left:55, top:44, delay:7.92 },
  { cat:"food", size:12, left:45, top:48, delay:8.04 },
  { cat:"food", size:12, left:47, top:50, delay:8.10 },
  { cat:"food", size:12, left:49, top:48, delay:8.16 },
  { cat:"food", size:12, left:51, top:50, delay:8.22 },
  { cat:"food", size:12, left:53, top:48, delay:8.28 },
  { cat:"food", size:12, left:55, top:50, delay:8.34 },
  { cat:"food", size:12, left:44, top:54, delay:8.40 },
  { cat:"food", size:12, left:48, top:52, delay:8.46 },
  { cat:"food", size:12, left:52, top:54, delay:8.52 },
  { cat:"food", size:12, left:56, top:52, delay:8.58 },
  { cat:"food", size:12, left:46, top:54, delay:8.64 },
  { cat:"food", size:12, left:50, top:54, delay:8.70 },
  { cat:"food", size:12, left:54, top:52, delay:8.76 },
  { cat:"food", size:12, left:35, top:50, delay:8.82 },
  { cat:"food", size:12, left:33, top:54, delay:8.88 },
  { cat:"food", size:12, left:57, top:48, delay:8.94 },
];

function SeoulMapPanel() {
  return (
    <div className="lp-seoul-wrap">
      {/* Background image */}
      <div style={{
        position:"absolute", inset:0,
        backgroundImage:"url('/seoul-map.jpeg')",
        backgroundSize:"cover",
        backgroundPosition:"center 38%",
      }} />

      {/* Bottom fade */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, height:80,
        background:"linear-gradient(to bottom, transparent, rgba(240,253,254,0.97) 85%, #f0fdfe)",
        pointerEvents:"none", zIndex:20,
      }} />

      {/* Floating pins */}
      {MAP_PINS.map((pin, i) => (
        <div key={i} style={{
          position:"absolute",
          left:`${pin.left}%`,
          top:`${pin.top}%`,
          animation:"pin-bob 2.6s ease-in-out infinite",
          animationDelay:`${pin.delay}s`,
          filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
          zIndex:10,
        }}>
          <svg width={pin.size} height={Math.round(pin.size*1.45)} viewBox="0 0 24 35"
            fill={MAP_PIN_COLORS[pin.cat]} style={{ display:"block" }}>
            <path d="M12 0C7.16 0 3 4.16 3 9C3 15.75 12 28 12 28C12 28 21 15.75 21 9C21 4.16 16.84 0 12 0ZM12 12.5C10.07 12.5 8.5 10.93 8.5 9C8.5 7.07 10.07 5.5 12 5.5C13.93 5.5 15.5 7.07 15.5 9C15.5 10.93 13.93 12.5 12 12.5Z"/>
            <ellipse cx="12" cy="32" rx="3" ry="1.5" opacity="0.2"/>
          </svg>
        </div>
      ))}

    </div>
  );
}

// ── Hero ─────────────────────────────────────────────────────
function Hero({ d }: { d: LandingData }) {
  const h = d.hero;
  return (
    <section className="lp-hero">
      <div className="lp-section lp-hero-pad">
        <div className="lp-container">
          <div className="lp-grid-2">

            {/* Left: text */}
            <div className="lp-hero-left">
              <div className="lp-badge" style={{ background:PL, color:PD }}>{h.badge}</div>

              <h1 className="lp-title" style={{ color:TX }}>
                {h.titleLight}{" "}
                <span style={{ color:P }}>{h.titleAccent}</span>
                <br />{h.titleBold}
              </h1>

              <p className="lp-subtitle" style={{ color:MU, whiteSpace:"pre-line" }}>{h.subtitle}</p>

              <div className="lp-btn-row">
                <Link href="/signup" className="lp-btn-primary"
                  style={{ background:`linear-gradient(135deg,${P},${PD})` }}>
                  {h.ctaPrimary}
                </Link>
                <a href="#features" className="lp-btn-outline">{h.ctaSecondary}</a>
              </div>

              <div className="lp-avatars">
                <div className="lp-avatar-stack">
                  {["🇺🇸","🇬🇧","🇯🇵","🇩🇪","🇨🇳","🇫🇷"].map((f, i) => (
                    <span key={i}>{f}</span>
                  ))}
                </div>
                <span style={{ fontSize:13, color:MU }}>
                  <strong style={{ color:TX }}>1,200+</strong> {h.proof}
                </span>
              </div>
            </div>

            {/* Right: Seoul map + stats below */}
            <div className="lp-hero-right">
              <SeoulMapPanel />
              <div className="lp-stat-grid" style={{ marginTop:14 }}>
                {h.stats.map(({ num, label }) => (
                  <div key={label} className="lp-stat-box">
                    <p style={{ fontSize:20, fontWeight:900, color:P, marginBottom:2 }}>{num}</p>
                    <p style={{ fontSize:10, fontWeight:600, color:MU }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

// ── HeroCards ─────────────────────────────────────────────────
function HeroCards({ d }: { d: LandingData }) {
  const { cards } = d.hero;
  return (
    <section style={{ background:"#f8fbfc" }}>
      <div className="lp-section" style={{ paddingTop:40, paddingBottom:48 }}>
        <div className="lp-container">
          <div className="lp-showcase-grid">
            {cards.map((c) => (
              <div key={c.name} style={{
                background:c.bg, border:`2px solid ${c.border}`,
                borderRadius:18, padding:"16px 14px",
                display:"flex", flexDirection:"column", gap:8,
              }}>
                <span style={{ fontSize:26 }}>{c.emoji}</span>
                <p style={{
                  fontWeight:800, fontSize:13, color:TX, lineHeight:1.3,
                  display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical",
                  overflow:"hidden",
                } as React.CSSProperties}>{c.name}</p>
                <p style={{ fontSize:11, color:MU }}>📍 {c.area}</p>
                <span style={{
                  fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:999,
                  background:"white", border:`1px solid ${c.border}`, color:c.tagColor,
                  alignSelf:"flex-start",
                }}>{c.tag}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
      <WaveDown />
    </section>
  );
}

// ── Steps ─────────────────────────────────────────────────────
function Steps({ d }: { d: LandingData }) {
  const s = d.steps;
  return (
    <section id="how" style={{ background:P }}>
      <div className="lp-section">
        <div className="lp-container">
          <div className="lp-sec-hdr">
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:PL, display:"block", marginBottom:12 }}>
              {s.label}
            </span>
            <h2 style={{ fontSize:"clamp(1.6rem,4vw,2.4rem)", fontWeight:900, color:"#ffffff", marginBottom:10, lineHeight:1.15 }}>{s.title}</h2>
            <p style={{ fontSize:"clamp(0.85rem,2vw,1rem)", color:PL, lineHeight:1.6 }}>{s.desc}</p>
          </div>

          {/* Desktop */}
          <div className="lp-steps-desktop">
            {s.items.map((step, i) => (
              <div key={step.num} style={{ display:"flex", alignItems:"flex-start" }}>
                <div className="lp-step-desktop">
                  <div className="lp-step-desktop-icon">{step.emoji}</div>
                  <span style={{ display:"inline-block", background:PD, color:"white", borderRadius:999, padding:"3px 12px", fontSize:11, fontWeight:800, marginBottom:12 }}>
                    {step.num}
                  </span>
                  <p style={{ fontWeight:800, color:"white", fontSize:15, marginBottom:6 }}>{step.title}</p>
                  <p style={{ color:PL, fontSize:13, lineHeight:1.5 }}>{step.desc}</p>
                </div>
                {i < s.items.length - 1 && <div className="lp-step-arrow">→</div>}
              </div>
            ))}
          </div>

          {/* Mobile */}
          <div className="lp-steps-mobile">
            {s.items.map((step) => (
              <div key={step.num} className="lp-step-card">
                <div className="lp-step-icon">{step.emoji}</div>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <span style={{ background:PD, color:"white", borderRadius:999, padding:"2px 10px", fontSize:10, fontWeight:800 }}>
                      {step.num}
                    </span>
                    <p style={{ fontWeight:800, color:"white", fontSize:14 }}>{step.title}</p>
                  </div>
                  <p style={{ color:PL, fontSize:12, lineHeight:1.5 }}>{step.desc}</p>
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
function Features({ d }: { d: LandingData }) {
  const f = d.features;
  return (
    <section id="features" style={{ background:"#ffffff" }}>
      <div className="lp-section">
        <div className="lp-container">
          <div className="lp-sec-hdr">
            <span className="lp-section-label" style={{ color:P }}>{f.label}</span>
            <h2 className="lp-section-title" style={{ color:TX }}>
              {f.title} <span style={{ color:P }}>{f.titleAccent}</span>
            </h2>
            <p style={{ fontSize:"clamp(0.85rem,2vw,1rem)", color:MU, lineHeight:1.6 }}>{f.desc}</p>
          </div>

          <div className="lp-grid-4">
            {f.items.map((item) => (
              <Link key={item.title} href={item.href} className="lp-card"
                style={{ background:item.bg, borderColor:item.border, textDecoration:"none", display:"block" }}>
                <div style={{
                  width:48, height:48, borderRadius:14, background:"white",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:22, border:`1px solid ${item.border}`,
                  marginBottom:16, boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
                }}>{item.emoji}</div>
                <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:item.accent, marginBottom:6 }}>{item.ko}</p>
                <p style={{ fontSize:18, fontWeight:900, color:TX, marginBottom:10 }}>{item.title}</p>
                <p style={{ fontSize:13, color:MU, lineHeight:1.6, marginBottom:16 }}>{item.desc}</p>
                <div>
                  {item.tags.map((t) => (
                    <span key={t} className="lp-feature-tag" style={{ borderColor:item.border, color:item.accent }}>{t}</span>
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
function Areas({ d }: { d: LandingData }) {
  const a = d.areas;
  return (
    <section id="areas" style={{ background:"#f8fbfc" }}>
      <div className="lp-section">
        <div className="lp-container">
          <div className="lp-sec-hdr">
            <span className="lp-section-label" style={{ color:P }}>{a.label}</span>
            <h2 className="lp-section-title" style={{ color:TX }}>
              {a.title} <span style={{ color:P }}>{a.titleAccent}</span>
            </h2>
            <p style={{ fontSize:"clamp(0.85rem,2vw,1rem)", color:MU, lineHeight:1.6 }}>{a.desc}</p>
          </div>

          <div className="lp-area-grid">
            {a.items.map((area) => (
              <div key={area.name} className="lp-card" style={{ background:area.bg, borderColor:area.border, cursor:"pointer" }}>
                <div style={{ fontSize:36, marginBottom:14 }}>{area.emoji}</div>
                <p style={{ fontSize:11, fontWeight:700, color:MU, marginBottom:4 }}>{area.ko}</p>
                <p style={{ fontSize:17, fontWeight:900, color:TX, marginBottom:6 }}>{area.name}</p>
                <p style={{ fontSize:12, color:MU, lineHeight:1.55 }}>{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Tips ──────────────────────────────────────────────────────
function Tips({ d }: { d: LandingData }) {
  const t = d.tips;
  return (
    <section style={{ background:"#ffffff" }}>
      <div className="lp-section">
        <div className="lp-container">
          <div className="lp-grid-2">
            <div>
              <span className="lp-section-label" style={{ color:P }}>{t.label}</span>
              <h2 className="lp-section-title" style={{ color:TX }}>
                {t.title} <span style={{ color:P }}>{t.titleAccent}</span>
              </h2>
              <p className="lp-tips-desc" style={{ color:MU }}>{t.desc}</p>
              <Link href="/signup" className="lp-btn-primary"
                style={{ background:`linear-gradient(135deg,${P},${PD})`, display:"inline-flex" }}>
                {t.cta}
              </Link>
            </div>

            <div className="lp-tips-box" style={{ background:PL }}>
              <div className="lp-tips-box-hdr">
                <div className="lp-tips-icon" style={{ background:P }}>💡</div>
                <div>
                  <p style={{ fontWeight:800, fontSize:15, color:TX, marginBottom:2 }}>{t.boxTitle}</p>
                  <p style={{ fontSize:12, color:MU }}>{t.boxDesc}</p>
                </div>
              </div>
              {t.items.map((tip) => (
                <div key={tip.text} className="lp-tip-item">
                  <span style={{ fontSize:15, flexShrink:0, marginTop:1 }}>{tip.emoji}</span>
                  <span style={{ color:TX, lineHeight:1.5 }}>{tip.text}</span>
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
function CTABanner({ d }: { d: LandingData }) {
  const c = d.cta;
  return (
    <section style={{ background:`linear-gradient(135deg,${P} 0%,${PD} 100%)`, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, width:320, height:320, borderRadius:"50%", background:"rgba(255,255,255,0.08)", transform:"translate(-40%,-40%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:0, right:0, width:400, height:400, borderRadius:"50%", background:"rgba(255,255,255,0.07)", transform:"translate(35%,35%)", pointerEvents:"none" }} />

      <div className="lp-section" style={{ position:"relative", zIndex:1 }}>
        <div className="lp-container">
          <div className="lp-cta-inner">
            <div className="lp-cta-icon">🗺️</div>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:PL, display:"block", marginBottom:14 }}>
              {c.label}
            </span>
            <h2 style={{
              fontWeight:900, color:"#ffffff",
              fontSize:"clamp(1.7rem,5vw,3rem)",
              lineHeight:1.1, marginBottom:14, letterSpacing:"-0.02em",
              whiteSpace:"pre-line",
            }}>{c.title}</h2>
            <p className="lp-cta-desc" style={{ color:PL }}>{c.desc}</p>
            <Link href="/signup" className="lp-cta-btn" style={{ color:PD }}>{c.btn}</Link>
            <p className="lp-cta-login" style={{ color:PL }}>
              {c.loginText}{" "}
              <Link href="/login" style={{ color:"white", fontWeight:700, textDecoration:"underline" }}>
                {c.loginLink}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────
function Footer({ d }: { d: LandingData }) {
  return (
    <footer style={{ background:TX, borderTop:"1px solid #1e293b" }}>
      <div className="lp-section lp-footer-pad">
        <div className="lp-container">
          <div className="lp-footer-inner">
            <div className="lp-footer-logo">
              <span style={{ width:30, height:30, borderRadius:8, background:P, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🗺️</span>
              <span style={{ fontWeight:900, color:"white", fontSize:16 }}>Localoop<span style={{ color:P }}>Korea</span></span>
            </div>
            <p style={{ fontSize:12, color:"#64748b", textAlign:"center" }}>{d.footer.desc}</p>
            <p style={{ fontSize:12, color:"#475569" }}>{d.footer.copy}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Template ──────────────────────────────────────────────────
export default function LandingTemplate({ data }: { data: LandingData }) {
  return (
    <div style={{ background:"#ffffff", minHeight:"100dvh" }}>
      <Nav        d={data} />
      <Hero       d={data} />
      <HeroCards  d={data} />
      <Steps      d={data} />
      <Features d={data} />
      <Areas    d={data} />
      <Tips     d={data} />
      <CTABanner d={data} />
      <Footer   d={data} />
    </div>
  );
}
