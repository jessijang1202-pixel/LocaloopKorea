import Link from "next/link";
import type { LandingData } from "./content";

const P  = "#1EC8C8";
const PD = "#17A0A0";
const PL = "#D6F5F5";
const TX = "#1A2B2C";
const MU = "#4A6467";

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

// ── Korea Map Panel ───────────────────────────────────────────
const MAP_PIN_COLORS: Record<string,string> = {
  place:  "#C2410C",
  food:   "#0F766E",
  guide:  "#1D4ED8",
  meetup: "#6D28D9",
};
type PinDef = { cat:string; size:number; left:number; top:number; delay:number };
const MAP_PINS: PinDef[] = [
  // ── Seoul Mapo (left:34-48, top:43-53) ── dense core
  { cat:"food",   size:12, left:35, top:43, delay:0.00 },
  { cat:"food",   size:12, left:37, top:45, delay:0.06 },
  { cat:"food",   size:12, left:39, top:43, delay:0.12 },
  { cat:"food",   size:12, left:41, top:45, delay:0.18 },
  { cat:"food",   size:12, left:43, top:43, delay:0.24 },
  { cat:"food",   size:12, left:45, top:45, delay:0.30 },
  { cat:"food",   size:12, left:47, top:43, delay:0.36 },
  { cat:"food",   size:12, left:34, top:47, delay:0.42 },
  { cat:"food",   size:12, left:36, top:49, delay:0.48 },
  { cat:"food",   size:12, left:38, top:47, delay:0.54 },
  { cat:"food",   size:12, left:40, top:49, delay:0.60 },
  { cat:"food",   size:12, left:42, top:47, delay:0.66 },
  { cat:"food",   size:12, left:44, top:49, delay:0.72 },
  { cat:"food",   size:12, left:46, top:47, delay:0.78 },
  { cat:"food",   size:12, left:48, top:49, delay:0.84 },
  { cat:"food",   size:12, left:35, top:51, delay:0.90 },
  { cat:"food",   size:12, left:37, top:51, delay:0.96 },
  { cat:"food",   size:12, left:39, top:51, delay:1.02 },
  { cat:"food",   size:12, left:41, top:51, delay:1.08 },
  { cat:"food",   size:12, left:43, top:51, delay:1.14 },
  { cat:"food",   size:12, left:45, top:51, delay:1.20 },
  { cat:"food",   size:12, left:47, top:51, delay:1.26 },
  { cat:"food",   size:12, left:36, top:53, delay:1.32 },
  { cat:"food",   size:12, left:38, top:53, delay:1.38 },
  { cat:"food",   size:12, left:40, top:53, delay:1.44 },
  { cat:"food",   size:12, left:42, top:53, delay:1.50 },
  { cat:"food",   size:12, left:44, top:53, delay:1.56 },
  { cat:"food",   size:12, left:46, top:53, delay:1.62 },
  { cat:"food",   size:12, left:34, top:45, delay:1.68 },
  { cat:"food",   size:12, left:36, top:45, delay:1.74 },
  { cat:"place",  size:16, left:36, top:44, delay:1.80 },
  { cat:"place",  size:16, left:39, top:46, delay:1.86 },
  { cat:"place",  size:16, left:42, top:44, delay:1.92 },
  { cat:"place",  size:16, left:45, top:46, delay:1.98 },
  { cat:"place",  size:16, left:48, top:44, delay:2.04 },
  { cat:"place",  size:16, left:35, top:48, delay:2.10 },
  { cat:"place",  size:16, left:38, top:50, delay:2.16 },
  { cat:"place",  size:16, left:41, top:48, delay:2.22 },
  { cat:"place",  size:16, left:44, top:50, delay:2.28 },
  { cat:"place",  size:16, left:47, top:48, delay:2.34 },
  { cat:"place",  size:16, left:36, top:52, delay:2.40 },
  { cat:"place",  size:16, left:39, top:52, delay:2.46 },
  { cat:"place",  size:16, left:42, top:52, delay:2.52 },
  { cat:"place",  size:16, left:45, top:52, delay:2.58 },
  { cat:"guide",  size:22, left:40, top:47, delay:2.64 },
  { cat:"meetup", size:29, left:37, top:48, delay:2.70 },
  { cat:"meetup", size:29, left:44, top:52, delay:2.76 },

  // ── Seoul Yongsan (left:43-55, top:45-55) ── dense core
  { cat:"food",   size:12, left:44, top:46, delay:2.82 },
  { cat:"food",   size:12, left:46, top:46, delay:2.88 },
  { cat:"food",   size:12, left:48, top:46, delay:2.94 },
  { cat:"food",   size:12, left:50, top:46, delay:3.00 },
  { cat:"food",   size:12, left:52, top:46, delay:3.06 },
  { cat:"food",   size:12, left:54, top:46, delay:3.12 },
  { cat:"food",   size:12, left:45, top:48, delay:3.18 },
  { cat:"food",   size:12, left:47, top:48, delay:3.24 },
  { cat:"food",   size:12, left:49, top:48, delay:3.30 },
  { cat:"food",   size:12, left:51, top:48, delay:3.36 },
  { cat:"food",   size:12, left:53, top:48, delay:3.42 },
  { cat:"food",   size:12, left:55, top:48, delay:3.48 },
  { cat:"food",   size:12, left:44, top:50, delay:3.54 },
  { cat:"food",   size:12, left:46, top:50, delay:3.60 },
  { cat:"food",   size:12, left:48, top:50, delay:3.66 },
  { cat:"food",   size:12, left:50, top:50, delay:3.72 },
  { cat:"food",   size:12, left:52, top:50, delay:3.78 },
  { cat:"food",   size:12, left:54, top:50, delay:3.84 },
  { cat:"food",   size:12, left:45, top:52, delay:3.90 },
  { cat:"food",   size:12, left:47, top:52, delay:3.96 },
  { cat:"food",   size:12, left:49, top:52, delay:4.02 },
  { cat:"food",   size:12, left:51, top:52, delay:4.08 },
  { cat:"food",   size:12, left:53, top:52, delay:4.14 },
  { cat:"food",   size:12, left:46, top:54, delay:4.20 },
  { cat:"food",   size:12, left:48, top:54, delay:4.26 },
  { cat:"place",  size:16, left:45, top:47, delay:4.32 },
  { cat:"place",  size:16, left:48, top:47, delay:4.38 },
  { cat:"place",  size:16, left:51, top:47, delay:4.44 },
  { cat:"place",  size:16, left:54, top:47, delay:4.50 },
  { cat:"place",  size:16, left:46, top:49, delay:4.56 },
  { cat:"place",  size:16, left:49, top:49, delay:4.62 },
  { cat:"place",  size:16, left:52, top:49, delay:4.68 },
  { cat:"place",  size:16, left:55, top:49, delay:4.74 },
  { cat:"place",  size:16, left:45, top:51, delay:4.80 },
  { cat:"place",  size:16, left:48, top:51, delay:4.86 },
  { cat:"place",  size:16, left:51, top:51, delay:4.92 },
  { cat:"place",  size:16, left:47, top:53, delay:4.98 },
  { cat:"guide",  size:22, left:50, top:50, delay:5.04 },

  // ── Seoul Gangnam (left:52-65, top:55-66) ──
  { cat:"food",   size:12, left:53, top:56, delay:5.10 },
  { cat:"food",   size:12, left:55, top:56, delay:5.16 },
  { cat:"food",   size:12, left:57, top:56, delay:5.22 },
  { cat:"food",   size:12, left:59, top:56, delay:5.28 },
  { cat:"food",   size:12, left:61, top:56, delay:5.34 },
  { cat:"food",   size:12, left:63, top:56, delay:5.40 },
  { cat:"food",   size:12, left:54, top:58, delay:5.46 },
  { cat:"food",   size:12, left:56, top:58, delay:5.52 },
  { cat:"food",   size:12, left:58, top:58, delay:5.58 },
  { cat:"food",   size:12, left:60, top:58, delay:5.64 },
  { cat:"food",   size:12, left:62, top:58, delay:5.70 },
  { cat:"food",   size:12, left:64, top:58, delay:5.76 },
  { cat:"food",   size:12, left:53, top:60, delay:5.82 },
  { cat:"food",   size:12, left:55, top:60, delay:5.88 },
  { cat:"food",   size:12, left:57, top:60, delay:5.94 },
  { cat:"food",   size:12, left:59, top:60, delay:6.00 },
  { cat:"food",   size:12, left:61, top:60, delay:6.06 },
  { cat:"food",   size:12, left:63, top:60, delay:6.12 },
  { cat:"food",   size:12, left:54, top:62, delay:6.18 },
  { cat:"food",   size:12, left:56, top:64, delay:6.24 },
  { cat:"place",  size:16, left:54, top:57, delay:6.30 },
  { cat:"place",  size:16, left:57, top:57, delay:6.36 },
  { cat:"place",  size:16, left:60, top:57, delay:6.42 },
  { cat:"place",  size:16, left:63, top:57, delay:6.48 },
  { cat:"place",  size:16, left:55, top:59, delay:6.54 },
  { cat:"place",  size:16, left:58, top:59, delay:6.60 },
  { cat:"place",  size:16, left:61, top:59, delay:6.66 },
  { cat:"place",  size:16, left:55, top:61, delay:6.72 },
  { cat:"place",  size:16, left:58, top:61, delay:6.78 },
  { cat:"place",  size:16, left:61, top:61, delay:6.84 },
  { cat:"place",  size:16, left:56, top:63, delay:6.90 },
  { cat:"place",  size:16, left:59, top:63, delay:6.96 },
  { cat:"guide",  size:22, left:56, top:57, delay:7.02 },
  { cat:"guide",  size:22, left:60, top:59, delay:7.08 },
  { cat:"guide",  size:22, left:58, top:63, delay:7.14 },
  { cat:"meetup", size:29, left:59, top:61, delay:7.20 },

  // ── Incheon (left:11-22, top:47-58) ──
  { cat:"food",   size:12, left:12, top:48, delay:7.26 },
  { cat:"food",   size:12, left:14, top:50, delay:7.32 },
  { cat:"food",   size:12, left:16, top:48, delay:7.38 },
  { cat:"food",   size:12, left:18, top:50, delay:7.44 },
  { cat:"food",   size:12, left:20, top:48, delay:7.50 },
  { cat:"food",   size:12, left:13, top:52, delay:7.56 },
  { cat:"food",   size:12, left:15, top:54, delay:7.62 },
  { cat:"food",   size:12, left:17, top:52, delay:7.68 },
  { cat:"food",   size:12, left:19, top:54, delay:7.74 },
  { cat:"food",   size:12, left:21, top:52, delay:7.80 },
  { cat:"food",   size:12, left:14, top:56, delay:7.86 },
  { cat:"place",  size:16, left:13, top:49, delay:7.92 },
  { cat:"place",  size:16, left:16, top:51, delay:7.98 },
  { cat:"place",  size:16, left:19, top:49, delay:8.04 },
  { cat:"place",  size:16, left:15, top:53, delay:8.10 },
  { cat:"place",  size:16, left:18, top:55, delay:8.16 },
  { cat:"guide",  size:22, left:14, top:50, delay:8.22 },
  { cat:"guide",  size:22, left:17, top:53, delay:8.28 },
  { cat:"guide",  size:22, left:20, top:51, delay:8.34 },
  { cat:"meetup", size:29, left:16, top:53, delay:8.40 },

  // ── Goyang / Ilsan (left:28-40, top:29-40) ──
  { cat:"food",   size:12, left:29, top:30, delay:8.46 },
  { cat:"food",   size:12, left:31, top:32, delay:8.52 },
  { cat:"food",   size:12, left:33, top:30, delay:8.58 },
  { cat:"food",   size:12, left:35, top:32, delay:8.64 },
  { cat:"food",   size:12, left:37, top:30, delay:8.70 },
  { cat:"food",   size:12, left:39, top:32, delay:8.76 },
  { cat:"food",   size:12, left:30, top:34, delay:8.82 },
  { cat:"food",   size:12, left:32, top:36, delay:8.88 },
  { cat:"food",   size:12, left:34, top:34, delay:8.94 },
  { cat:"place",  size:16, left:31, top:31, delay:9.00 },
  { cat:"place",  size:16, left:34, top:31, delay:9.06 },
  { cat:"place",  size:16, left:37, top:31, delay:9.12 },
  { cat:"place",  size:16, left:32, top:35, delay:9.18 },
  { cat:"guide",  size:22, left:33, top:32, delay:9.24 },
  { cat:"guide",  size:22, left:36, top:34, delay:9.30 },
  { cat:"meetup", size:29, left:34, top:33, delay:9.36 },

  // ── Bucheon (left:24-32, top:44-52) ──
  { cat:"food",   size:12, left:25, top:45, delay:9.42 },
  { cat:"food",   size:12, left:27, top:47, delay:9.48 },
  { cat:"food",   size:12, left:29, top:45, delay:9.54 },
  { cat:"food",   size:12, left:31, top:47, delay:9.60 },
  { cat:"food",   size:12, left:26, top:49, delay:9.66 },
  { cat:"place",  size:16, left:26, top:46, delay:9.72 },
  { cat:"place",  size:16, left:29, top:46, delay:9.78 },
  { cat:"place",  size:16, left:28, top:50, delay:9.84 },
  { cat:"guide",  size:22, left:28, top:47, delay:9.90 },

  // ── Uijeongbu (left:49-57, top:18-27) ──
  { cat:"food",   size:12, left:50, top:19, delay:9.96 },
  { cat:"food",   size:12, left:52, top:21, delay:10.02 },
  { cat:"food",   size:12, left:54, top:19, delay:10.08 },
  { cat:"food",   size:12, left:56, top:21, delay:10.14 },
  { cat:"food",   size:12, left:51, top:23, delay:10.20 },
  { cat:"place",  size:16, left:51, top:20, delay:10.26 },
  { cat:"place",  size:16, left:54, top:20, delay:10.32 },
  { cat:"place",  size:16, left:52, top:24, delay:10.38 },
  { cat:"guide",  size:22, left:53, top:21, delay:10.44 },
  { cat:"guide",  size:22, left:55, top:23, delay:10.50 },

  // ── Dongducheon (left:52-62, top:6-14) ──
  { cat:"food",   size:12, left:53, top:7,  delay:10.56 },
  { cat:"food",   size:12, left:56, top:9,  delay:10.62 },
  { cat:"food",   size:12, left:59, top:7,  delay:10.68 },
  { cat:"place",  size:16, left:55, top:8,  delay:10.74 },
  { cat:"guide",  size:22, left:57, top:10, delay:10.80 },

  // ── Suwon (left:47-57, top:78-84) ──
  { cat:"food",   size:12, left:48, top:79, delay:10.86 },
  { cat:"food",   size:12, left:50, top:81, delay:10.92 },
  { cat:"food",   size:12, left:52, top:79, delay:10.98 },
  { cat:"food",   size:12, left:54, top:81, delay:11.04 },
  { cat:"food",   size:12, left:56, top:79, delay:11.10 },
  { cat:"food",   size:12, left:49, top:83, delay:11.16 },
  { cat:"place",  size:16, left:49, top:80, delay:11.22 },
  { cat:"place",  size:16, left:52, top:80, delay:11.28 },
  { cat:"place",  size:16, left:55, top:80, delay:11.34 },
  { cat:"guide",  size:22, left:51, top:81, delay:11.40 },
  { cat:"guide",  size:22, left:54, top:83, delay:11.46 },
  { cat:"meetup", size:29, left:52, top:82, delay:11.52 },

  // ── Seongnam (left:55-65, top:65-73) ──
  { cat:"food",   size:12, left:56, top:66, delay:11.58 },
  { cat:"food",   size:12, left:58, top:68, delay:11.64 },
  { cat:"food",   size:12, left:60, top:66, delay:11.70 },
  { cat:"food",   size:12, left:62, top:68, delay:11.76 },
  { cat:"food",   size:12, left:64, top:66, delay:11.82 },
  { cat:"place",  size:16, left:57, top:67, delay:11.88 },
  { cat:"place",  size:16, left:61, top:67, delay:11.94 },
  { cat:"guide",  size:22, left:59, top:69, delay:12.00 },

  // ── Ansan (left:24-32, top:77-83) ──
  { cat:"food",   size:12, left:25, top:78, delay:12.06 },
  { cat:"food",   size:12, left:27, top:80, delay:12.12 },
  { cat:"food",   size:12, left:29, top:78, delay:12.18 },
  { cat:"food",   size:12, left:31, top:80, delay:12.24 },
  { cat:"guide",  size:22, left:28, top:81, delay:12.30 },

  // ── Osan (left:47-53, top:87-91) ──
  { cat:"food",   size:12, left:48, top:88, delay:12.36 },
  { cat:"food",   size:12, left:50, top:90, delay:12.42 },
  { cat:"place",  size:16, left:49, top:89, delay:12.48 },

  // ── Dongtan (left:51-58, top:92-95) ──
  { cat:"food",   size:12, left:52, top:93, delay:12.54 },

  // ── Paju (left:22-34, top:14-24) ──
  { cat:"food",   size:12, left:24, top:17, delay:12.60 },
  { cat:"food",   size:12, left:28, top:21, delay:12.66 },
  { cat:"place",  size:16, left:26, top:19, delay:12.72 },
  { cat:"place",  size:16, left:32, top:23, delay:12.78 },
  { cat:"guide",  size:22, left:30, top:20, delay:12.84 },

  // ── Gimpo (left:14-24, top:38-46) ──
  { cat:"food",   size:12, left:15, top:40, delay:12.90 },
  { cat:"food",   size:12, left:19, top:44, delay:12.96 },
  { cat:"place",  size:16, left:17, top:42, delay:13.02 },
  { cat:"place",  size:16, left:22, top:45, delay:13.08 },
  { cat:"guide",  size:22, left:20, top:41, delay:13.14 },

  // ── Gwangmyeong (left:32-40, top:60-68) ──
  { cat:"food",   size:12, left:33, top:62, delay:13.20 },
  { cat:"food",   size:12, left:37, top:65, delay:13.26 },
  { cat:"place",  size:16, left:35, top:63, delay:13.32 },
  { cat:"place",  size:16, left:39, top:67, delay:13.38 },
  { cat:"guide",  size:22, left:36, top:65, delay:13.44 },

  // ── Siheung (left:20-28, top:68-76) ──
  { cat:"food",   size:12, left:21, top:70, delay:13.50 },
  { cat:"food",   size:12, left:25, top:73, delay:13.56 },
  { cat:"place",  size:16, left:23, top:71, delay:13.62 },
  { cat:"place",  size:16, left:27, top:75, delay:13.68 },

  // ── Hanam (left:66-74, top:55-63) ──
  { cat:"food",   size:12, left:67, top:57, delay:13.74 },
  { cat:"food",   size:12, left:70, top:60, delay:13.80 },
  { cat:"place",  size:16, left:68, top:58, delay:13.86 },
  { cat:"place",  size:16, left:73, top:62, delay:13.92 },
  { cat:"guide",  size:22, left:71, top:59, delay:13.98 },

  // ── Guri / Namyangju (left:64-80, top:40-50) ──
  { cat:"food",   size:12, left:65, top:42, delay:14.04 },
  { cat:"food",   size:12, left:69, top:46, delay:14.10 },
  { cat:"food",   size:12, left:75, top:43, delay:14.16 },
  { cat:"place",  size:16, left:67, top:44, delay:14.22 },
  { cat:"place",  size:16, left:78, top:48, delay:14.28 },
  { cat:"guide",  size:22, left:73, top:45, delay:14.34 },

  // ── Yongin (left:62-72, top:72-82) ──
  { cat:"food",   size:12, left:63, top:74, delay:14.40 },
  { cat:"food",   size:12, left:67, top:78, delay:14.46 },
  { cat:"food",   size:12, left:71, top:80, delay:14.52 },
  { cat:"place",  size:16, left:65, top:76, delay:14.58 },
  { cat:"guide",  size:22, left:69, top:79, delay:14.64 },

  // ── Yangju (left:44-52, top:14-22) ──
  { cat:"food",   size:12, left:45, top:15, delay:14.70 },
  { cat:"food",   size:12, left:49, top:19, delay:14.76 },
  { cat:"place",  size:16, left:47, top:17, delay:14.82 },
  { cat:"guide",  size:22, left:51, top:20, delay:14.88 },

  // ── Hwaseong (left:43-50, top:84-92) ──
  { cat:"food",   size:12, left:44, top:86, delay:14.94 },
  { cat:"food",   size:12, left:47, top:89, delay:15.00 },
  { cat:"place",  size:16, left:45, top:87, delay:15.06 },
  { cat:"place",  size:16, left:49, top:91, delay:15.12 },

  // ── Pyeongtaek (left:39-47, top:93-99) ──
  { cat:"food",   size:12, left:40, top:94, delay:15.18 },
  { cat:"place",  size:16, left:43, top:97, delay:15.24 },
  { cat:"guide",  size:22, left:46, top:95, delay:15.30 },

  // ── Gwacheon (left:54-60, top:65-70) ──
  { cat:"food",   size:12, left:55, top:67, delay:15.36 },
  { cat:"place",  size:16, left:58, top:69, delay:15.42 },
  { cat:"guide",  size:22, left:56, top:68, delay:15.48 },

  // ── Gunpo / Uiwang (left:38-46, top:78-84) ──
  { cat:"food",   size:12, left:39, top:80, delay:15.54 },
  { cat:"place",  size:16, left:42, top:82, delay:15.60 },
  { cat:"guide",  size:22, left:44, top:79, delay:15.66 },
];

function KoreaMapPanel() {
  return (
    <div className="lp-seoul-wrap">
      {/* Background image */}
      <div style={{
        position:"absolute", inset:0,
        backgroundImage:"url('/korea-map.png')",
        backgroundSize:"cover",
        backgroundPosition:"50% 50%",
        backgroundColor:"#F0FAFA",
      }} />

      {/* Bottom fade */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, height:80,
        background:"linear-gradient(to bottom, transparent, rgba(240,253,254,0.97) 85%, #F0FAFA)",
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
                <span style={{ fontSize:13, color:MU }}>{h.proof}</span>
              </div>
            </div>

            {/* Right: Korea map + stats below */}
            <div className="lp-hero-right">
              <KoreaMapPanel />
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
    <section style={{ background:"#F0FAFA" }}>
      <div className="lp-section" style={{ paddingTop:40, paddingBottom:48 }}>
        <div className="lp-container">
          <div className="lp-showcase-grid">
            {cards.map((c) => (
              <div key={c.name} style={{
                background:c.bg, border:"2px solid white",
                borderRadius:18, padding:"16px 14px",
                display:"flex", flexDirection:"column", gap:8,
              }}>
                <p style={{
                  fontWeight:800, fontSize:13, color:TX, lineHeight:1.3,
                  display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical",
                  overflow:"hidden",
                } as React.CSSProperties}>{c.name}</p>
                <p style={{ fontSize:11, color:MU }}>{c.area}</p>
                <span style={{
                  fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:999,
                  background:"white", border:"1px solid white", color:c.tagColor,
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

// ── AI Engines ────────────────────────────────────────────────
function AIEngines({ d }: { d: LandingData }) {
  const ae = d.aiEngines;
  return (
    <section style={{ background:"#F0FAFA" }}>
      <div className="lp-section">
        <div className="lp-container">
          <div className="lp-sec-hdr">
            <span className="lp-section-label" style={{ color:P }}>{ae.label}</span>
            <h2 className="lp-section-title" style={{ color:TX }}>
              {ae.title} <span style={{ color:P }}>{ae.titleAccent}</span>
            </h2>
            <p style={{ fontSize:"clamp(0.85rem,2vw,1rem)", color:MU, lineHeight:1.6 }}>{ae.desc}</p>
          </div>

          <div className="lp-grid-3">
            {ae.items.map((item) => (
              <div key={item.title} style={{
                background:"#ffffff", border:"1.5px solid white",
                borderRadius:20, padding:"28px 24px",
                position:"relative", overflow:"hidden",
              }}>
                {/* Patent badge */}
                <span style={{
                  position:"absolute", top:16, right:16,
                  fontSize:10, fontWeight:700, letterSpacing:"0.04em",
                  background:"#fffbeb", color:"#d97706",
                  border:"1px solid #fde68a",
                  borderRadius:999, padding:"3px 10px",
                  whiteSpace:"nowrap",
                }}>{item.badge}</span>

                <p style={{ fontSize:11, fontWeight:700, color:MU, marginBottom:6, letterSpacing:"0.06em", textTransform:"uppercase" }}>{item.ko}</p>
                <p style={{ fontSize:17, fontWeight:900, color:TX, marginBottom:12, lineHeight:1.25 }}>{item.title}</p>
                <p style={{ fontSize:13, color:MU, lineHeight:1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
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

          <div id="tasks" /><div id="local" /><div id="community" />
          <div className="lp-grid-3">
            {f.items.map((item) => (
              <Link key={item.title} href={item.href} className="lp-card"
                style={{ background:item.bg, borderColor:"white", textDecoration:"none", display:"block" }}>
                <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:item.accent, marginBottom:6 }}>{item.ko}</p>
                <p style={{ fontSize:18, fontWeight:900, color:TX, marginBottom:10 }}>{item.title}</p>
                <p style={{ fontSize:13, color:MU, lineHeight:1.6, marginBottom:16 }}>{item.desc}</p>
                <div>
                  {item.tags.map((t) => (
                    <span key={t} className="lp-feature-tag" style={{ borderColor:"white", color:item.accent }}>{t}</span>
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
    <section id="areas" style={{ background:"#F0FAFA" }}>
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
              <div key={area.name} className="lp-card" style={{ background:area.bg, borderColor:"white", cursor:"pointer" }}>
                <p style={{ fontSize:11, fontWeight:700, color:MU, marginBottom:4 }}>{area.ko}</p>
                <p style={{ fontSize:17, fontWeight:900, color:TX, marginBottom:6 }}>📍 {area.name}</p>
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
                <div>
                  <p style={{ fontWeight:800, fontSize:15, color:TX, marginBottom:2 }}>{t.boxTitle}</p>
                  <p style={{ fontSize:12, color:MU }}>{t.boxDesc}</p>
                </div>
              </div>
              {t.items.map((tip) => (
                <div key={tip.text} className="lp-tip-item">
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
              <span style={{ fontWeight:900, color:"white", fontSize:16 }}>Localoop<span style={{ color:P }}>Korea</span></span>
            </div>
            <p style={{ fontSize:12, color:"#4A6467", textAlign:"center" }}>{d.footer.desc}</p>
            <p style={{ fontSize:12, color:"#4A6467" }}>{d.footer.copy}</p>
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
      <AIEngines  d={data} />
      <Steps      d={data} />
      <Features d={data} />
      <Areas    d={data} />
      <Tips     d={data} />
      <CTABanner d={data} />
      <Footer   d={data} />
    </div>
  );
}
