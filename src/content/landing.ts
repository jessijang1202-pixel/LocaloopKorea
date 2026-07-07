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
export interface AIEngineItem { emoji: string; title: string; ko: string; desc: string; badge: string; }

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
  aiEngines: {
    label: string; title: string; titleAccent: string; desc: string;
    items: AIEngineItem[];
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
// currently unused — Korean landing content preserved for future /ko route

export const KO: LandingData = {
  lang: "ko",
  altLang: "English",
  altLangPath: "/en",
  nav: {
    links: [
      { href: "#features",  label: "기능" },
      { href: "#tasks",     label: "생활 과업" },
      { href: "#local",     label: "로컬 탐방" },
      { href: "#community", label: "커뮤니티" },
      { href: "#areas",     label: "지역" },
      { href: "#how",       label: "이용 방법" },
    ],
    login: "로그인",
    cta: "시작하기 →",
  },
  hero: {
    badge: "🇰🇷  외국인을 위한 AI 기반 한국 생활 내비게이션",
    titleLight:  "AI가 안내하는",
    titleAccent: "나의",
    titleBold:   "한국 생활",
    subtitle:    "로컬루프 코리아는 당신의 위치·언어 수준·체류 단계를 실시간으로 반영해\n지금 가장 필요한 생활 안내와 로컬 경험을 자동으로 연결합니다.",
    ctaPrimary:   "무료로 시작하기",
    ctaSecondary: "더 알아보기",
    proof: "278만+ 외국인이 한국에 산다 — 그들을 위한 AI 플랫폼",
    cards: [
      { emoji:"☕", name:"Fritz Coffee Company",     area:"성수동 Seongsu",  tag:"영어 메뉴 OK",  bg:"#FFF7ED", border:"#FED7AA", tagColor:"#EA580C" },
      { emoji:"🍜", name:"Tteokbokki 101 가이드",    area:"음식 가이드",     tag:"초보자 추천",    bg:"#F0FDFA", border:"#99F6E4", tagColor:"#0D9488" },
      { emoji:"🤝", name:"Korean Language Exchange", area:"홍대 Hongdae",    tag:"12명 참가중",   bg:"#F5F3FF", border:"#DDD6FE", tagColor:"#7C3AED" },
      { emoji:"🍺", name:"Craftworks Taproom",       area:"이태원 Itaewon",  tag:"영어 가능",     bg:"#EFF6FF", border:"#BFDBFE", tagColor:"#2563EB" },
      { emoji:"📖", name:"한국 지하철 완전정복",      area:"교통 가이드",     tag:"필수 정보",      bg:"#EFF6FF", border:"#BFDBFE", tagColor:"#2563EB" },
      { emoji:"🍱", name:"편의점 꿀조합 가이드",      area:"음식 가이드",     tag:"가성비 최고",    bg:"#F0FDFA", border:"#99F6E4", tagColor:"#0D9488" },
    ],
    stats: [{ num:"200+", label:"Places" }, { num:"50+", label:"Guides" }, { num:"6", label:"Areas" }],
  },
  aiEngines: {
    label: "AI Technology",
    title: "3종 특허 기반",
    titleAccent: "AI 엔진",
    desc: "단순 앱이 아닙니다. 당신의 상황을 읽고 필요한 것을 자동으로 연결하는 AI 시스템입니다.",
    items: [
      { emoji:"🧠", title:"Life Task Graph Engine",             ko:"생활 태스크 그래프 엔진",       desc:"위치·언어 수준·기해결 과업을 반영해 지금 해야 할 일을 동적으로 산출합니다.",                                           badge:"특허 출원 중" },
      { emoji:"📍", title:"Auto Friendliness Rating Engine",    ko:"외국인 친화도 자동 등급화 엔진", desc:"공개 웹 데이터 NLP 분석으로 장소별 외국인 친화도를 S~D 5단계로 자동 등급화합니다.",                                   badge:"특허 출원 중" },
      { emoji:"🗺️", title:"Local Course Recommendation Engine", ko:"로컬 코스 추천 엔진",           desc:"한국인 소비 데이터 기반 로컬성 지수로 언어 수준·예산·모험 성향에 맞는 개인화 코스를 자동 조합합니다.", badge:"특허 출원 중" },
    ],
  },
  steps: {
    label: "How it works",
    title: "로컬루프 코리아 이용 방법",
    desc:  "4단계로 한국 생활을 스마트하게 시작하세요",
    items: [
      { num:"01", emoji:"📲", title:"가입 & 프로필 설정",    desc:"외국인/한국인 모드 선택. 위치·언어 수준·체류 목적을 설정하면 AI가 즉시 개인화를 시작합니다." },
      { num:"02", emoji:"📋", title:"생활 과업 안내 받기",   desc:"체류 단계에 따라 지금 해야 할 일을 자동으로 안내합니다. 은행 계좌 개설부터 동네 탐색까지." },
      { num:"03", emoji:"🗺️", title:"외국인 친화 장소 탐색", desc:"S~D 등급으로 평가된 외국인 친화 장소를 탐색하세요. 언어 지원·결제 편의성·현지인 추천을 지도 한 곳에서 확인할 수 있습니다." },
      { num:"04", emoji:"👥", title:"연결 & 로컬 경험",      desc:"모임에 참여하고 언어 교환 파트너를 찾고, 나만의 로컬 경험 코스를 받아보세요. 현지인처럼 한국을 경험합니다." },
    ],
  },
  features: {
    label: "What we offer",
    title: "한국 생활을 위한",
    titleAccent: "6가지 핵심 기능",
    desc: "위치·언어·체류 단계에 맞게 자동으로 조정되는 AI 생활 플랫폼",
    items: [
      { emoji:"📍", title:"Location-Based Living Search",         ko:"위치 기반 생활정보 탐색",        desc:"주변 장소·음식점·편의시설을 탐색하고 외국어 지원·결제 방법·외국인 이용 가능 여부를 한눈에 확인하세요.",                            tags:["영어 메뉴","카드 결제","혼밥 OK"],         bg:"#FFF7ED", border:"#FED7AA", accent:"#EA580C", href:"/places"  },
      { emoji:"🏅", title:"Auto Foreigner-Friendliness Rating",   ko:"외국인 친화도 자동 등급화",       desc:"웹 데이터 NLP 분석으로 모든 장소를 S~D 5단계로 자동 등급화합니다. 방문 전에 이용 가능 여부를 미리 확인하세요.",                    tags:["S~D 등급","자동 업데이트","NLP 기반"],     bg:"#F0FDFA", border:"#99F6E4", accent:"#0D9488", href:"/places"  },
      { emoji:"📋", title:"Step-by-Step Life Task Guide",         ko:"생활 과업 단계별 안내",           desc:"도착 첫날부터 장기 정착까지 — 체류 단계에 맞게 지금 해야 할 일을 패키지 형태로 안내합니다.",                                     tags:["개인화","단계별","자동 업데이트"],          bg:"#EFF6FF", border:"#BFDBFE", accent:"#2563EB", href:"/guides"  },
      { emoji:"🗺️", title:"Personalized Local Experience Courses",ko:"개인화 로컬 경험 코스 추천",     desc:"한국인 소비 데이터 기반 로컬성 지수로, 언어 수준·예산·모험 성향에 맞는 나만의 로컬 코스를 자동으로 받아보세요.",                    tags:["AI 큐레이션","예산 맞춤","반나절·하루"],    bg:"#F0FDF4", border:"#BBF7D0", accent:"#16A34A", href:"/places"  },
      { emoji:"👥", title:"Meetup & People Connection",           ko:"Meetup · People 커뮤니티 연결",  desc:"언어 교환·취미·지역 탐방 모임을 개설하거나 참여하세요. 관심사·언어·거주 지역 기반으로 교류 상대를 자동 추천합니다.",                 tags:["언어 교환","취미 그룹","자동 매칭"],        bg:"#F5F3FF", border:"#DDD6FE", accent:"#7C3AED", href:"/meetups" },
      { emoji:"💬", title:"Real-Time Multilingual Chat",          ko:"실시간 다국어 번역 채팅",        desc:"각자의 언어로 입력하면 상대방 언어로 자동 번역됩니다. 원문과 번역문을 함께 표시해 번역 품질을 직접 확인할 수 있습니다.",             tags:["자동 번역","다국어","원문·번역 동시"],      bg:"#FFF1F2", border:"#FECDD3", accent:"#E11D48", href:"/meetups" },
    ],
  },
  areas: {
    label: "한국 지역",
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
    desc:  "가입 무료 · 광고 없음 · AI가 큐레이션한 한국 생활 콘텐츠",
    btn:   "무료로 시작하기",
    loginText: "이미 계정이 있나요?",
    loginLink: "로그인",
  },
  footer: {
    desc:  "외국인과 한국인을 위한 AI 기반 생활 내비게이션 & 커뮤니티 플랫폼. 특허 출원 3건.",
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
      { href: "#features",  label: "Features" },
      { href: "#tasks",     label: "Life Tasks" },
      { href: "#local",     label: "Local Digging" },
      { href: "#community", label: "Community" },
      { href: "#areas",     label: "Areas" },
      { href: "#how",       label: "How it works" },
    ],
    login: "Log in",
    cta: "Get started →",
  },
  hero: {
    badge: "🇰🇷  AI-powered life navigation for foreigners in Korea",
    titleLight:  "Your AI guide to",
    titleAccent: "life in",
    titleBold:   "Korea",
    subtitle:    "Localoop Korea reads your location, language level, and stage of stay —\nthen guides you to exactly what you need right now.\nPlaces, tasks, local experiences, and real connections.",
    ctaPrimary:   "Get started free",
    ctaSecondary: "Learn more",
    proof: "2.78M+ foreigners live in Korea — built for all of them",
    cards: [
      { emoji:"☕", name:"Fritz Coffee Company",      area:"Seongsu, Korea",   tag:"English menu",      bg:"#FFF7ED", border:"#FED7AA", tagColor:"#EA580C" },
      { emoji:"🍜", name:"Tteokbokki 101 Guide",     area:"Food guide",        tag:"Beginner-friendly", bg:"#F0FDFA", border:"#99F6E4", tagColor:"#0D9488" },
      { emoji:"🤝", name:"Korean Language Exchange",  area:"Hongdae, Korea",   tag:"12 going",          bg:"#F5F3FF", border:"#DDD6FE", tagColor:"#7C3AED" },
      { emoji:"🍺", name:"Craftworks Taproom",        area:"Itaewon, Korea",   tag:"English OK",        bg:"#EFF6FF", border:"#BFDBFE", tagColor:"#2563EB" },
      { emoji:"📖", name:"Korea Metro Survival",      area:"Transport guide",  tag:"Must read",         bg:"#EFF6FF", border:"#BFDBFE", tagColor:"#2563EB" },
      { emoji:"🍱", name:"Convenience Store Guide",   area:"Food guide",       tag:"Budget-friendly",   bg:"#F0FDFA", border:"#99F6E4", tagColor:"#0D9488" },
    ],
    stats: [{ num:"200+", label:"Places" }, { num:"50+", label:"Guides" }, { num:"6", label:"Areas" }],
  },
  aiEngines: {
    label: "AI Technology",
    title: "Powered by 3",
    titleAccent: "Patented AI Engines",
    desc: "Not just an app — an AI system that reads your situation and connects you to what you need.",
    items: [
      { emoji:"🧠", title:"Life Task Graph Engine",             ko:"생활 태스크 그래프 엔진",       desc:"Dynamically calculates what you need to do right now — based on your location, language level, and completed tasks.",                            badge:"Patent Pending" },
      { emoji:"📍", title:"Auto Friendliness Rating Engine",    ko:"외국인 친화도 자동 등급화 엔진", desc:"NLP analysis of public web data auto-rates every place from S to D — updated continuously.",                                                   badge:"Patent Pending" },
      { emoji:"🗺️", title:"Local Course Recommendation Engine", ko:"로컬 코스 추천 엔진",           desc:"Builds personalized local courses from Korean consumer data, matched to your language, budget, and adventure level.",                            badge:"Patent Pending" },
    ],
  },
  steps: {
    label: "How it works",
    title: "How Localoop Korea Works",
    desc:  "4 steps to start your life in Korea the smart way",
    items: [
      { num:"01", emoji:"📲", title:"Sign Up & Set Your Profile",        desc:"Choose foreigner or Korean mode. Set your location, language level, and purpose of stay. The AI starts personalizing from here." },
      { num:"02", emoji:"📋", title:"Get Your Life Task Guide",          desc:"Based on your stage of stay, the app tells you exactly what to do right now — from setting up a bank account to finding your neighborhood." },
      { num:"03", emoji:"🗺️", title:"Explore Foreigner-Friendly Places", desc:"Browse places rated S~D for foreigner friendliness. See language support, payment options, and local picks — all on one map." },
      { num:"04", emoji:"👥", title:"Connect & Experience Local Korea",  desc:"Join meetups, find language exchange partners, and get a personalized local course built just for you. Experience Korea the way locals do." },
    ],
  },
  features: {
    label: "What we offer",
    title: "6 Features Built for",
    titleAccent: "Your Life in Korea",
    desc: "An AI platform that adjusts automatically to your location, language, and stage of stay",
    items: [
      { emoji:"📍", title:"Location-Based Living Search",          ko:"Places",       desc:"Find nearby places, restaurants, and facilities — with language support, payment info, and foreigner accessibility all in one view.",                    tags:["English menu","Card OK","Solo-friendly"],        bg:"#FFF7ED", border:"#FED7AA", accent:"#EA580C", href:"/places"  },
      { emoji:"🏅", title:"Auto Foreigner-Friendliness Rating",    ko:"AI Rating",    desc:"Every place is auto-rated S~D using NLP analysis of web data — so you always know what to expect before you arrive.",                                  tags:["S~D Rating","Auto-updated","NLP-powered"],       bg:"#F0FDFA", border:"#99F6E4", accent:"#0D9488", href:"/places"  },
      { emoji:"📋", title:"Step-by-Step Life Task Guide",          ko:"Life Tasks",   desc:"From the day you arrive to long-term settlement — the app tells you what to do right now, packaged as simple task bundles.",                          tags:["Personalized","Stage-based","Auto-updated"],     bg:"#EFF6FF", border:"#BFDBFE", accent:"#2563EB", href:"/guides"  },
      { emoji:"🗺️", title:"Personalized Local Experience Courses", ko:"Local Digging",desc:"Built from real Korean consumer data, your local course is matched to your language level, budget, and sense of adventure.",                          tags:["AI-curated","Budget-matched","Half-day & full-day"],bg:"#F0FDF4",border:"#BBF7D0", accent:"#16A34A", href:"/places"  },
      { emoji:"👥", title:"Meetup & People Connection",            ko:"Community",    desc:"Join or create local meetups — language exchanges, hobby groups, neighborhood tours. Find people who match your interests and location.",              tags:["Language exchange","Hobby groups","Auto-matching"],bg:"#F5F3FF", border:"#DDD6FE", accent:"#7C3AED", href:"/meetups" },
      { emoji:"💬", title:"Real-Time Multilingual Chat",           ko:"Chat",         desc:"Type in your language — the other person reads it in theirs. Original and translated messages shown side by side for full transparency.",             tags:["Auto-translate","Multilingual","Side-by-side"],  bg:"#FFF1F2", border:"#FECDD3", accent:"#E11D48", href:"/meetups" },
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
    desc:  "Free to join · No ads · AI-curated content for foreigners in Korea",
    btn:   "Get started free",
    loginText: "Already have an account?",
    loginLink: "Log in",
  },
  footer: {
    desc:  "AI-powered life navigation & community platform for foreigners and Koreans in Korea. 3 patents pending.",
    copy:  "© 2024 Localoop Korea",
  },
};
