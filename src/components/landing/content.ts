export interface HeroCard {
  emoji: string; name: string; area: string; tag: string;
  bg: string; border: string; tagColor: string;
}
export interface StepItem  { num: string; emoji: string; title: string; desc: string; }
export interface FeatureItem {
  emoji: string; title: string; ko: string; desc: string;
  tags: string[]; bg: string; border: string; accent: string; href: string;
}
export interface AreaItem   { name: string; ko: string; desc: string; emoji: string; bg: string; border: string; }
export interface TipItem    { emoji: string; text: string; }

export interface LandingData {
  lang: "ko" | "en";
  altLang: string;
  altLangPath: string;
  nav:      { links: { href: string; label: string }[]; login: string; cta: string; };
  hero: {
    badge: string; titleLight: string; titleBold: string; titleAccent: string;
    subtitle: string; ctaPrimary: string; ctaSecondary: string; proof: string;
    cards: HeroCard[];
    stats: { num: string; label: string }[];
  };
  steps: {
    label: string; title: string; desc: string;
    items: StepItem[];
  };
  features: {
    label: string; title: string; titleAccent: string; desc: string;
    items: FeatureItem[];
  };
  areas: {
    label: string; title: string; titleAccent: string; desc: string;
    items: AreaItem[];
  };
  tips: {
    label: string; title: string; titleAccent: string; desc: string;
    cta: string; boxTitle: string; boxDesc: string; items: TipItem[];
  };
  cta: {
    label: string; title: string; desc: string;
    btn: string; loginText: string; loginLink: string;
  };
  footer: { desc: string; copy: string; };
}

// ── Korean ────────────────────────────────────────────────────

export const KO: LandingData = {
  lang: "ko",
  altLang: "English",
  altLangPath: "/en",
  nav: {
    links: [
      { href: "#features", label: "기능" },
      { href: "#areas",    label: "지역" },
      { href: "#how",      label: "이용 방법" },
    ],
    login: "로그인",
    cta: "시작하기 →",
  },
  hero: {
    badge: "🇰🇷  외국인을 위한 한국 생활 가이드",
    titleLight:  "한국의",
    titleAccent: "진짜 로컬을",
    titleBold:   "경험하세요",
    subtitle:    "외국인 친화 장소, 음식 가이드, 생활 정보, 밋업—\n한국 생활이 편해지는 모든 것이 한 곳에.",
    ctaPrimary:   "무료로 시작하기 🚀",
    ctaSecondary: "더 알아보기",
    proof: "명의 외국인 & 로컬이 함께해요",
    cards: [
      { emoji:"☕", name:"Fritz Coffee Company",     area:"성수동 Seongsu",  tag:"영어 메뉴 OK",  bg:"#FFF7ED", border:"#FED7AA", tagColor:"#EA580C" },
      { emoji:"🍜", name:"Tteokbokki 101 가이드",    area:"음식 가이드",     tag:"초보자 추천",    bg:"#F0FDFA", border:"#99F6E4", tagColor:"#0D9488" },
      { emoji:"🤝", name:"Korean Language Exchange", area:"홍대 Hongdae",    tag:"12명 참가중",   bg:"#F5F3FF", border:"#DDD6FE", tagColor:"#7C3AED" },
      { emoji:"🍺", name:"Craftworks Taproom",       area:"이태원 Itaewon",  tag:"영어 가능",     bg:"#EFF6FF", border:"#BFDBFE", tagColor:"#2563EB" },
      { emoji:"📖", name:"한국 지하철 완전정복",      area:"교통 가이드",     tag:"필수 정보",      bg:"#EFF6FF", border:"#BFDBFE", tagColor:"#2563EB" },
      { emoji:"🍱", name:"편의점 꿀조합 가이드",      area:"음식 가이드",     tag:"가성비 최고",    bg:"#F0FDFA", border:"#99F6E4", tagColor:"#0D9488" },
      { emoji:"🏪", name:"Olive Young 쇼핑 팁",      area:"명동 Myeongdong", tag:"외국인 필수",    bg:"#FFF7ED", border:"#FED7AA", tagColor:"#EA580C" },
      { emoji:"🌙", name:"Han River Picnic Crew",    area:"한강공원",         tag:"23명 참가중",   bg:"#F5F3FF", border:"#DDD6FE", tagColor:"#7C3AED" },
      { emoji:"🍖", name:"한국 BBQ 입문 가이드",      area:"음식 가이드",     tag:"혼밥 OK",       bg:"#FFF7ED", border:"#FED7AA", tagColor:"#EA580C" },
    ],
    stats: [{ num:"200+", label:"Places" }, { num:"50+", label:"Guides" }, { num:"6", label:"Areas" }],
  },
  steps: {
    label: "How it works",
    title: "한국 탐험 순서",
    desc:  "딱 4단계면 한국 로컬처럼 생활할 수 있어요",
    items: [
      { num:"01", emoji:"📝", title:"가입하기",       desc:"이름과 관심 지역 입력 후 시작. 1분도 안 걸려요." },
      { num:"02", emoji:"📍", title:"지역 탐색",      desc:"내 근처 외국인 친화 장소와 로컬 맛집을 확인하세요." },
      { num:"03", emoji:"🍜", title:"음식 도전",      desc:"초보자 맞춤 메뉴 가이드로 자신 있게 주문하세요." },
      { num:"04", emoji:"🤝", title:"커뮤니티 참여",  desc:"밋업 참여하고 같은 관심사의 사람들을 만나요." },
    ],
  },
  features: {
    label: "What we offer",
    title: "로컬을 경험하는",
    titleAccent: "4가지 방법",
    desc: "관광객이 아닌 로컬처럼 한국을 즐기는 데 필요한 모든 것",
    items: [
      { emoji:"📍", title:"Places", ko:"로컬 스팟",      desc:"외국인 친화 태그가 달린 카페, 식당, 마켓을 지역별로 탐색하세요.",      tags:["영어 메뉴","카드 결제","혼밥 OK"],      bg:"#FFF7ED", border:"#FED7AA", accent:"#EA580C", href:"/places" },
      { emoji:"🍜", title:"Food",   ko:"음식 가이드",    desc:"매운맛 단계, 주문 팁, 메뉴 설명으로 자신 있게 도전하세요.",           tags:["초보자 추천","매운맛 표시","채식 표시"],  bg:"#F0FDFA", border:"#99F6E4", accent:"#0D9488", href:"/food"   },
      { emoji:"📖", title:"Guides", ko:"생활 가이드",    desc:"은행 개설부터 대중교통까지—한국 정착에 필요한 모든 정보.",             tags:["교통카드","병원 이용","주거 계약"],       bg:"#EFF6FF", border:"#BFDBFE", accent:"#2563EB", href:"/guides" },
      { emoji:"🤝", title:"Meetups",ko:"밋업 & 커뮤니티",desc:"언어 교환, 동네 모임, 커뮤니티 이벤트로 사람들과 연결되세요.",        tags:["언어 교환","동네 모임","무료 이벤트"],   bg:"#F5F3FF", border:"#DDD6FE", accent:"#7C3AED", href:"/meetups"},
    ],
  },
  areas: {
    label: "Korea Areas",
    title: "당신의 동네를",
    titleAccent: "찾아보세요",
    desc: "한국 주요 동네별 큐레이션 가이드",
    items: [
      { name:"Seongsu",  ko:"성수동", desc:"한국의 Brooklyn — 인디 카페, 스튜디오, 감성 맛집",          emoji:"🏭", bg:"#FFF7ED", border:"#FED7AA" },
      { name:"Hongdae",  ko:"홍대",   desc:"길거리 음식, 라이브 공연, 늦은 밤까지 활기찬 핫플",          emoji:"🎵", bg:"#F0FDFA", border:"#99F6E4" },
      { name:"Itaewon",  ko:"이태원", desc:"영어 가능한 글로벌 식당과 외국인 친화 쇼핑가",               emoji:"🌍", bg:"#EFF6FF", border:"#BFDBFE" },
      { name:"Yeonnam",  ko:"연남동", desc:"골목 카페, 브런치 맛집, 여유로운 동네 분위기",                emoji:"🌿", bg:"#F0FDF4", border:"#BBF7D0" },
      { name:"Gangnam",  ko:"강남",   desc:"깔끔하고 모던한, 처음 오는 사람도 쉽게 찾는 명소",           emoji:"🏙️", bg:"#F5F3FF", border:"#DDD6FE" },
      { name:"Bukchon",  ko:"북촌",   desc:"한옥 마을과 전통 문화 체험 — 한국의 역사를 느껴요",          emoji:"🏯", bg:"#FFF1F2", border:"#FECDD3" },
    ],
  },
  tips: {
    label: "Tips",
    title: "처음 와도",
    titleAccent: "걱정 없어요",
    desc:  "Localoop Korea는 외국인이 한국에서 실제로 겪는 불편함을 해결하기 위해 만들어졌어요. 각 장소와 음식마다 실용적인 정보가 태그로 정리되어 있어요.",
    cta:   "지금 바로 탐색하기 →",
    boxTitle: "Localoop 이용 팁",
    boxDesc:  "알아두면 좋은 것들",
    items: [
      { emoji:"✅", text:"영어 메뉴 있는 곳만 필터링해서 탐색할 수 있어요" },
      { emoji:"✅", text:"카드 결제 가능 여부를 미리 확인할 수 있어요" },
      { emoji:"✅", text:"매운맛 단계를 미리 체크하고 주문하세요" },
      { emoji:"✅", text:"혼밥·혼카페 친화 공간을 따로 표시해 두었어요" },
      { emoji:"⚠️", text:"일부 가게는 현금만 받으니 미리 확인하세요" },
      { emoji:"⚠️", text:"예약 필수 맛집은 방문 전 사전 예약이 필요해요" },
    ],
  },
  cta: {
    label: "Join Localoop Korea",
    title: "한국 생활,\n지금 시작하세요",
    desc:  "가입 무료 · 광고 없음 · 외국인을 위해 직접 큐레이션한 콘텐츠",
    btn:   "무료로 시작하기 🚀",
    loginText: "이미 계정이 있나요?",
    loginLink: "로그인",
  },
  footer: {
    desc:  "외국인과 한국인을 위한 한국 지역 기반 생활 네비게이션",
    copy:  "© 2024 Localoop Korea",
  },
};

// ── English ────────────────────────────────────────────────────

export const EN: LandingData = {
  lang: "en",
  altLang: "한국어",
  altLangPath: "/",
  nav: {
    links: [
      { href: "#features", label: "Features" },
      { href: "#areas",    label: "Areas" },
      { href: "#how",      label: "How it works" },
    ],
    login: "Log in",
    cta: "Get started →",
  },
  hero: {
    badge: "🇰🇷  Korea living guide for foreigners",
    titleLight:  "Experience",
    titleAccent: "real local",
    titleBold:   "Korea",
    subtitle:    "Foreigner-friendly spots, food guides, life tips, meetups—\neverything that makes living in Korea easier, in one place.",
    ctaPrimary:   "Get started free 🚀",
    ctaSecondary: "Learn more",
    proof: "expats & locals have already joined",
    cards: [
      { emoji:"☕", name:"Fritz Coffee Company",      area:"Seongsu, Korea",   tag:"English menu",     bg:"#FFF7ED", border:"#FED7AA", tagColor:"#EA580C" },
      { emoji:"🍜", name:"Tteokbokki 101 Guide",     area:"Food guide",        tag:"Beginner-friendly", bg:"#F0FDFA", border:"#99F6E4", tagColor:"#0D9488" },
      { emoji:"🤝", name:"Korean Language Exchange",  area:"Hongdae, Korea",   tag:"12 going",         bg:"#F5F3FF", border:"#DDD6FE", tagColor:"#7C3AED" },
      { emoji:"🍺", name:"Craftworks Taproom",        area:"Itaewon, Korea",   tag:"English OK",       bg:"#EFF6FF", border:"#BFDBFE", tagColor:"#2563EB" },
      { emoji:"📖", name:"Korea Metro Survival",      area:"Transport guide",  tag:"Must read",        bg:"#EFF6FF", border:"#BFDBFE", tagColor:"#2563EB" },
      { emoji:"🍱", name:"Convenience Store Guide",   area:"Food guide",       tag:"Budget-friendly",   bg:"#F0FDFA", border:"#99F6E4", tagColor:"#0D9488" },
      { emoji:"🏪", name:"Olive Young Shopping Tips", area:"Myeongdong, Korea",tag:"Expat favorite",    bg:"#FFF7ED", border:"#FED7AA", tagColor:"#EA580C" },
      { emoji:"🌙", name:"Han River Picnic Crew",     area:"Han River Park",   tag:"23 going",         bg:"#F5F3FF", border:"#DDD6FE", tagColor:"#7C3AED" },
      { emoji:"🍖", name:"Korean BBQ for Beginners",  area:"Food guide",       tag:"Solo-friendly",    bg:"#FFF7ED", border:"#FED7AA", tagColor:"#EA580C" },
    ],
    stats: [{ num:"200+", label:"Places" }, { num:"50+", label:"Guides" }, { num:"6", label:"Areas" }],
  },
  steps: {
    label: "How it works",
    title: "Your Korea Journey",
    desc:  "Just 4 steps to start living like a Korea local",
    items: [
      { num:"01", emoji:"📝", title:"Sign up",        desc:"Enter your name and area of interest. Takes less than a minute." },
      { num:"02", emoji:"📍", title:"Explore nearby", desc:"Discover foreigner-friendly spots and local restaurants near you." },
      { num:"03", emoji:"🍜", title:"Try local food", desc:"Order with confidence using our beginner-friendly menu guides." },
      { num:"04", emoji:"🤝", title:"Join the community", desc:"Attend meetups and connect with people who share your interests." },
    ],
  },
  features: {
    label: "What we offer",
    title: "4 ways to experience",
    titleAccent: "Korea like a local",
    desc: "Everything you need to go from tourist to local",
    items: [
      { emoji:"📍", title:"Places", ko:"Local Spots",       desc:"Browse foreigner-friendly cafés, restaurants, and markets tagged by area.",    tags:["English menu","Card OK","Solo-friendly"],   bg:"#FFF7ED", border:"#FED7AA", accent:"#EA580C", href:"/places" },
      { emoji:"🍜", title:"Food",   ko:"Food Guide",         desc:"Spice level guides, ordering tips, and menu explanations for every dish.",     tags:["Beginner picks","Spice levels","Veg options"],bg:"#F0FDFA", border:"#99F6E4", accent:"#0D9488", href:"/food"   },
      { emoji:"📖", title:"Guides", ko:"Life Guides",        desc:"From opening a bank account to riding the subway—practical tips for life in Korea.", tags:["Transit","Healthcare","Housing"],      bg:"#EFF6FF", border:"#BFDBFE", accent:"#2563EB", href:"/guides" },
      { emoji:"🤝", title:"Meetups",ko:"Meetups & Community",desc:"Language exchanges, neighborhood events, and community gatherings.",          tags:["Lang exchange","Free events","Locals"],     bg:"#F5F3FF", border:"#DDD6FE", accent:"#7C3AED", href:"/meetups"},
    ],
  },
  areas: {
    label: "Korea Areas",
    title: "Find your",
    titleAccent: "neighborhood",
    desc: "Curated guides for every major area in Korea",
    items: [
      { name:"Seongsu",  ko:"성수동", desc:"Korea's Brooklyn — indie cafés, design studios, and curated shops.", emoji:"🏭", bg:"#FFF7ED", border:"#FED7AA" },
      { name:"Hongdae",  ko:"홍대",   desc:"Street food, live music, and the best late-night spots in Korea.",   emoji:"🎵", bg:"#F0FDFA", border:"#99F6E4" },
      { name:"Itaewon",  ko:"이태원", desc:"International restaurants, English-friendly, globally connected.",   emoji:"🌍", bg:"#EFF6FF", border:"#BFDBFE" },
      { name:"Yeonnam",  ko:"연남동", desc:"Quiet alleys, brunch spots, and a relaxed local vibe.",              emoji:"🌿", bg:"#F0FDF4", border:"#BBF7D0" },
      { name:"Gangnam",  ko:"강남",   desc:"Polished and modern — easy to navigate for first-timers.",           emoji:"🏙️", bg:"#F5F3FF", border:"#DDD6FE" },
      { name:"Bukchon",  ko:"북촌",   desc:"Traditional hanok village — the best place to feel Korea's history.",emoji:"🏯", bg:"#FFF1F2", border:"#FECDD3" },
    ],
  },
  tips: {
    label: "Tips",
    title: "No worries even",
    titleAccent: "for first-timers",
    desc:  "Localoop Korea was built to solve the real inconveniences foreigners face in Korea. Every place and dish is tagged with practical information.",
    cta:   "Start exploring now →",
    boxTitle: "Localoop tips",
    boxDesc:  "Good to know before you go",
    items: [
      { emoji:"✅", text:"Filter to show only places with English menus" },
      { emoji:"✅", text:"Check card payment availability before you go" },
      { emoji:"✅", text:"See the spice level of any dish before ordering" },
      { emoji:"✅", text:"Solo-diner-friendly spots are clearly marked" },
      { emoji:"⚠️", text:"Some places are cash only — always worth checking" },
      { emoji:"⚠️", text:"Popular restaurants may require a reservation" },
    ],
  },
  cta: {
    label: "Join Localoop Korea",
    title: "Your Korea life\nstarts here",
    desc:  "Free to join · No ads · Curated by hand for foreigners",
    btn:   "Get started free 🚀",
    loginText: "Already have an account?",
    loginLink: "Log in",
  },
  footer: {
    desc:  "Region-based living navigation for foreigners and Koreans in Korea.",
    copy:  "© 2024 Localoop Korea",
  },
};
