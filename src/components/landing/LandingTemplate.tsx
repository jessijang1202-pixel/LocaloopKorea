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

        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {/* Language toggle */}
          <a href={d.altLangPath} style={{
            fontSize:12, fontWeight:600, color:MU,
            padding:"6px 12px", borderRadius:999,
            border:`1px solid #e2f4f7`, textDecoration:"none",
          }}>
            {d.altLang}
          </a>
          <Link href="/login" style={{
            fontSize:13, fontWeight:600, color:MU,
            padding:"8px 16px", borderRadius:999,
            border:`2px solid #e2f4f7`, textDecoration:"none",
          }}>{d.nav.login}</Link>
          <Link href="/signup" style={{
            fontSize:13, fontWeight:700, color:"#fff",
            padding:"9px 20px", borderRadius:999,
            background:`linear-gradient(135deg,${P},${PD})`,
            textDecoration:"none",
          }}>{d.nav.cta}</Link>
        </div>
      </div>
    </header>
  );
}

// ── Hero ─────────────────────────────────────────────────────
function Hero({ d }: { d: LandingData }) {
  const h = d.hero;
  return (
    <section className="lp-hero">
      <div style={{
        position:"absolute", top:0, right:0,
        width:480, height:480, borderRadius:"50%",
        background:`radial-gradient(circle,${P}28,transparent 70%)`,
        transform:"translate(30%,-20%)", pointerEvents:"none",
      }} />
      <div className="lp-section lp-hero-pad">
        <div className="lp-container">
          <div className="lp-grid-2">

            {/* Left */}
            <div>
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

            {/* Right: Cards */}
            <div>
              {h.cards.map((c) => (
                <div key={c.name} className="lp-hero-card" style={{ background:c.bg, borderColor:c.border }}>
                  <div className="lp-hero-card-icon">{c.emoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontWeight:700, fontSize:14, color:TX, marginBottom:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {c.name}
                    </p>
                    <p style={{ fontSize:12, color:MU }}>📍 {c.area}</p>
                  </div>
                  <span style={{
                    fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:999,
                    background:"white", border:`1px solid ${c.border}`, color:c.tagColor,
                    flexShrink:0, whiteSpace:"nowrap",
                  }}>{c.tag}</span>
                </div>
              ))}

              <div className="lp-stat-grid">
                {h.stats.map(({ num, label }) => (
                  <div key={label} className="lp-stat-box">
                    <p style={{ fontSize:22, fontWeight:900, color:P, marginBottom:2 }}>{num}</p>
                    <p style={{ fontSize:11, fontWeight:600, color:MU }}>{label}</p>
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
      <Nav      d={data} />
      <Hero     d={data} />
      <Steps    d={data} />
      <Features d={data} />
      <Areas    d={data} />
      <Tips     d={data} />
      <CTABanner d={data} />
      <Footer   d={data} />
    </div>
  );
}
