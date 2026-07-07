// Culture & etiquette content, shared between two screens that render the same
// kind of material with the SAME primitives but DELIBERATELY DIFFERENT copy:
//
//   ETIQUETTE_FULL      → /etiquette (standalone page) — the complete text,
//                         with extra rule rows, a dining "quick tips" grid, and
//                         a gift-culture callout in the Social section.
//   ETIQUETTE_GUIDE_TAB → /guide (Culture & Etiquette tab) — an intentionally
//                         trimmed version: several rule rows dropped, some
//                         sentences shortened, no dining grid, and no
//                         gift-culture callout.
//
// The two datasets are NOT merged on purpose. The guide tab is a condensed
// companion to the full page; unifying the copy would change what each screen
// renders. Edit each dataset independently.
//
// CATEGORIES and KEY_PHRASES are byte-for-byte identical between the two
// screens, so they are exported once and shared.

export type Bilingual = { ko: string; en: string };
export type EtqRule = { ok: boolean; ko: string; en: string };
export type EtqQA = { q: Bilingual; a: Bilingual };
// `emoji` is carried for parity with the original data shape but is not rendered.
export type EtqGridItem = { emoji: string; ko: string; en: string; desc: Bilingual };

export type EtiquetteContent = {
  greeting: { title: Bilingual; cardHeading: Bilingual; cardBody: Bilingual; rules: EtqRule[]; calloutCoral: Bilingual };
  dining: { title: Bilingual; cardHeading: Bilingual; rules: EtqRule[]; calloutYellow: Bilingual; grid: EtqGridItem[] | null };
  transport: { title: Bilingual; rules: EtqRule[]; calloutBlue: Bilingual };
  social: { title: Bilingual; cardHeading: Bilingual; cardBody: Bilingual; qaHeading: Bilingual; qa: EtqQA[]; calloutCoral: Bilingual | null };
  taboo: { title: Bilingual; calloutRed: Bilingual; rules: EtqRule[]; calloutYellow: Bilingual };
};

// Shared, identical on both screens.
export const ETIQUETTE_CATEGORIES = [
  { id: "all", ko: "전체", en: "All" },
  { id: "greeting", ko: "인사", en: "Greetings" },
  { id: "dining", ko: "식사", en: "Dining" },
  { id: "transport", ko: "교통", en: "Transport" },
  { id: "social", ko: "사회", en: "Social" },
  { id: "taboo", ko: "금기", en: "Taboos" },
];

// Shared, identical on both screens.
export const KEY_PHRASES = [
  { ko: "안녕하세요", rom: "Annyeonghaseyo", en: "Hello" },
  { ko: "감사합니다", rom: "Gamsahamnida", en: "Thank you" },
  { ko: "죄송합니다", rom: "Joesonghamnida", en: "I'm sorry" },
  { ko: "괜찮아요", rom: "Gwaenchanayo", en: "It's okay" },
  { ko: "잘 먹겠습니다", rom: "Jal meokgesseumnida", en: "I will eat well" },
  { ko: "잘 먹었습니다", rom: "Jal meogeosseumnida", en: "I ate well" },
];

// ── Full content — used by /etiquette ──────────────────────────────────────────
export const ETIQUETTE_FULL: EtiquetteContent = {
  greeting: {
    title: { ko: "인사 & 기본 예절", en: "Greetings & Basic Manners" },
    cardHeading: { ko: "인사의 나라 — 고개 숙임(절)이 핵심", en: "The Bowing Nation — the bow is everything" },
    cardBody: {
      ko: "한국에서는 처음 만나는 사람에게 가볍게 고개를 숙여 인사합니다. 각도가 클수록 더 큰 존경을 나타냅니다. 15° 가벼운 인사, 30° 일반적 인사, 45° 깊은 감사나 사죄.",
      en: "In Korea, you bow your head slightly when greeting someone for the first time. The deeper the bow, the more respect it conveys. 15° light acknowledgment, 30° standard greeting, 45° deep gratitude or apology.",
    },
    rules: [
      { ok: true, ko: "어른(나이 많은 분)을 만나면 먼저 인사하세요", en: "Greet elders (older people) first — always" },
      { ok: true, ko: "두 손으로 물건을 받거나 드릴 때 예의 바르게 보입니다", en: "Use both hands when giving or receiving things — shows respect" },
      { ok: true, ko: "'안녕하세요' 한마디만으로도 큰 호감을 얻습니다", en: "Saying '안녕하세요' (Annyeonghaseyo) earns you instant goodwill" },
      { ok: false, ko: "악수할 때 한 손만 내밀면 무례하게 보일 수 있어요", en: "Don't offer just one hand for a handshake — it looks rude" },
      { ok: false, ko: "어른 앞에서 먼저 자리에 앉거나 음식을 먹으면 실례입니다", en: "Don't sit down or start eating before elders do" },
    ],
    calloutCoral: {
      ko: "'감사합니다 (Gamsahamnida)'와 '죄송합니다 (Joesonghamnida)'만 알아도 웬만한 상황을 넘길 수 있습니다.",
      en: "'Gamsahamnida' (thank you) and 'Joesonghamnida' (I'm sorry) — learn these two and you'll handle most situations fine.",
    },
  },
  dining: {
    title: { ko: "식당 & 식사 문화", en: "Restaurant & Dining Culture" },
    cardHeading: { ko: "한국 식당의 규칙", en: "Korean Restaurant Rules" },
    rules: [
      { ok: true, ko: "반찬은 무한 리필! 직원에게 '더 주세요' 또는 손짓으로 요청하세요", en: "Side dishes (banchan) are free refills — ask for more anytime" },
      { ok: true, ko: "식사 전 어른이 수저를 들기를 기다렸다가 함께 시작하세요", en: "Wait for the eldest to pick up chopsticks before you start eating" },
      { ok: true, ko: "음식값은 보통 한 사람이 전부 내는 '더치페이' 대신 한 명이 내는 문화", en: "One person often pays the whole bill — it rotates naturally between friends" },
      { ok: false, ko: "식사 중 수저를 밥그릇에 꽂아 두면 제사(장례) 연상으로 금기", en: "Never stick chopsticks upright in rice — it resembles funeral rites" },
      { ok: false, ko: "어른보다 먼저 술잔을 마시는 건 실례입니다. 고개를 돌려서 마시세요", en: "Don't drink before elders — turn your head away when taking a sip" },
      { ok: false, ko: "남의 밥그릇에서 음식을 직접 집어먹거나 덜어주는 것은 피하세요", en: "Don't take food directly from someone else's bowl" },
    ],
    calloutYellow: {
      ko: "술자리 문화: 자신의 잔을 직접 채우지 않고 옆 사람이 채워줍니다. 마시기 싫을 땐 잔을 손으로 가볍게 덮으면 됩니다.",
      en: "Drinking culture: you don't pour for yourself — neighbors fill each other's glasses. To decline, lightly cover your glass with your hand.",
    },
    grid: [
      { emoji: "🥢", ko: "젓가락 먼저", en: "Chopsticks first", desc: { ko: "국물은 숟가락, 반찬은 젓가락", en: "Spoon for soup, chopsticks for side dishes" } },
      { emoji: "🔕", ko: "조용히 먹기", en: "Eat quietly", desc: { ko: "쩝쩝 소리는 실례", en: "Slurping food is considered rude" } },
      { emoji: "📵", ko: "전화는 잠깐", en: "Brief phone use", desc: { ko: "식사 중 통화는 양해를 구하고", en: "Excuse yourself before taking calls" } },
      { emoji: "🎁", ko: "더치페이", en: "Taking turns", desc: { ko: "번갈아 내는 것이 자연스러워요", en: "Rotating who pays is the norm" } },
    ],
  },
  transport: {
    title: { ko: "대중교통 에티켓", en: "Public Transport Etiquette" },
    rules: [
      { ok: true, ko: "노약자석(분홍/파란 시트)은 비어 있어도 어른·임산부를 위해 비워두세요", en: "Priority seats (pink/blue) should stay empty even if available" },
      { ok: true, ko: "지하철 안에서는 작게 말하거나 이어폰을 끼세요", en: "Speak quietly or use earphones on the subway" },
      { ok: true, ko: "타기 전에 내리는 사람이 다 내릴 때까지 기다리세요", en: "Wait for passengers to exit before boarding" },
      { ok: true, ko: "버스·지하철에서 통화는 가능하지만 최대한 작은 목소리로", en: "Phone calls are okay but keep your voice very low" },
      { ok: false, ko: "지하철 안에서 음식을 먹으면 눈총을 받아요", en: "Don't eat on the subway — it's frowned upon" },
      { ok: false, ko: "에스컬레이터에서 왼쪽은 서있는 줄, 오른쪽은 걷는 줄 (서울 기준)", en: "On escalators: stand on the right, walk on the left (Seoul rule)" },
    ],
    calloutBlue: {
      ko: "버스 정류장에서 버스가 오면 손을 들어 신호를 보내야 합니다. 아무 신호도 없으면 버스가 그냥 지나칠 수 있어요!",
      en: "At bus stops, you MUST wave your hand to signal the bus. If you don't signal, it may drive past without stopping!",
    },
  },
  social: {
    title: { ko: "사회생활 & 인간관계", en: "Social Life & Relationships" },
    cardHeading: { ko: "나이와 직급이 중요한 나라", en: "Age and rank matter a lot here" },
    cardBody: {
      ko: "한국은 나이와 직급에 따라 언어(존댓말/반말)와 행동이 달라지는 문화입니다. 처음 만나는 사람에게는 항상 존댓말을 사용하고, 친해진 후 상대방이 반말을 제안하면 편하게 받아들이면 됩니다.",
      en: "In Korea, language and behavior shift based on age and rank. Always use formal speech (존댓말) with strangers. If someone you've gotten close to suggests switching to casual speech (반말), that's a sign they see you as a friend.",
    },
    qaHeading: { ko: "자주 받는 질문 — 무례한 게 아니에요!", en: "Common Questions — Not Rude in Korean Culture!" },
    qa: [
      { q: { ko: "몇 살이에요?", en: "How old are you?" }, a: { ko: "한국은 나이로 호칭이 달라져서 나이를 묻는 것이 자연스럽습니다", en: "Age determines speech levels and titles in Korea — it's perfectly normal to ask" } },
      { q: { ko: "밥 먹었어요?", en: "Have you eaten?" }, a: { ko: "안부 인사예요. '네' 또는 '아직요' 정도로 답하면 됩니다", en: "This is a casual greeting like 'How are you?' — just say yes or not yet" } },
      { q: { ko: "결혼은 했어요?", en: "Are you married?" }, a: { ko: "관심의 표현이에요. 불편하면 가볍게 웃으며 넘기면 됩니다", en: "An expression of interest in you. Just smile and deflect if uncomfortable" } },
    ],
    calloutCoral: {
      ko: "선물 문화: 선물을 받으면 바로 열어보지 않는 것이 예의입니다. 나중에 혼자 열어보는 경우가 많아요.",
      en: "Gift culture: don't open a gift immediately when received — it's polite to open it later when alone.",
    },
  },
  taboo: {
    title: { ko: "절대 피해야 할 것들", en: "Things to Absolutely Avoid" },
    calloutRed: {
      ko: "아래 행동들은 한국에서 심각한 실례 또는 금기로 여겨집니다. 문화적 충격을 피하려면 꼭 기억하세요!",
      en: "The following are considered seriously rude or taboo in Korea. Keep these in mind to avoid culture shock!",
    },
    rules: [
      { ok: false, ko: "빨간색 잉크로 이름을 쓰면 안 됩니다 — 죽음과 연관된 색으로 여깁니다", en: "Never write someone's name in red ink — it's associated with death" },
      { ok: false, ko: "숫자 '4'가 들어간 선물(예: 4개 묶음)은 불길하게 여깁니다", en: "Avoid gifts in sets of 4 — the number 4 sounds like 'death' in Korean" },
      { ok: false, ko: "집 안에서 신발을 신고 들어가면 안 됩니다. 반드시 벗으세요", en: "Never wear shoes inside a Korean home — always remove them at the door" },
      { ok: false, ko: "발로 문을 열거나 물건을 밀어도 실례입니다", en: "Don't open doors or push things with your feet — considered very disrespectful" },
      { ok: false, ko: "큰 소리로 코를 풀면 시선이 집중됩니다. 화장실에서 하세요", en: "Blowing your nose loudly in public attracts stares — do it in the restroom" },
      { ok: false, ko: "웃어른 앞에서 술을 마실 때 얼굴을 돌리지 않으면 실례입니다", en: "Drinking in front of elders without turning your face away is rude" },
    ],
    calloutYellow: {
      ko: "실수해도 괜찮아요! 대부분의 한국인은 외국인의 문화 차이를 이해하고 너그럽게 받아들입니다. 진심 어린 '죄송합니다'면 충분합니다.",
      en: "It's okay to make mistakes! Most Koreans are understanding of cultural differences. A sincere '죄송합니다 (Joesonghamnida)' goes a long way.",
    },
  },
};

// ── Trimmed content — used by the /guide Culture & Etiquette tab ────────────────
// Intentionally shorter than ETIQUETTE_FULL: fewer rule rows, condensed
// sentences, no dining grid, no gift-culture callout. Do not sync with FULL.
export const ETIQUETTE_GUIDE_TAB: EtiquetteContent = {
  greeting: {
    title: { ko: "인사 & 기본 예절", en: "Greetings & Basic Manners" },
    cardHeading: { ko: "인사의 나라 — 고개 숙임(절)이 핵심", en: "The Bowing Nation — the bow is everything" },
    cardBody: {
      ko: "한국에서는 처음 만나는 사람에게 가볍게 고개를 숙여 인사합니다. 15° 가벼운 인사, 30° 일반적 인사, 45° 깊은 감사나 사죄.",
      en: "In Korea, you bow your head slightly when greeting someone new. 15° light acknowledgment, 30° standard greeting, 45° deep gratitude or apology.",
    },
    rules: [
      { ok: true, ko: "어른(나이 많은 분)을 만나면 먼저 인사하세요", en: "Greet elders (older people) first — always" },
      { ok: true, ko: "두 손으로 물건을 받거나 드릴 때 예의 바르게 보입니다", en: "Use both hands when giving or receiving things" },
      { ok: true, ko: "'안녕하세요' 한마디만으로도 큰 호감을 얻습니다", en: "Saying '안녕하세요' earns you instant goodwill" },
      { ok: false, ko: "악수할 때 한 손만 내밀면 무례하게 보일 수 있어요", en: "Don't offer just one hand for a handshake" },
      { ok: false, ko: "어른 앞에서 먼저 자리에 앉거나 음식을 먹으면 실례입니다", en: "Don't sit down or start eating before elders do" },
    ],
    calloutCoral: {
      ko: "'감사합니다'와 '죄송합니다'만 알아도 웬만한 상황을 넘길 수 있습니다.",
      en: "'Gamsahamnida' (thank you) and 'Joesonghamnida' (I'm sorry) — learn these two and you'll handle most situations.",
    },
  },
  dining: {
    title: { ko: "식당 & 식사 문화", en: "Restaurant & Dining Culture" },
    cardHeading: { ko: "한국 식당의 규칙", en: "Korean Restaurant Rules" },
    rules: [
      { ok: true, ko: "반찬은 무한 리필! 직원에게 '더 주세요'로 요청하세요", en: "Side dishes (banchan) are free refills — ask for more anytime" },
      { ok: true, ko: "식사 전 어른이 수저를 들기를 기다렸다가 함께 시작하세요", en: "Wait for the eldest to pick up chopsticks before you start eating" },
      { ok: true, ko: "음식값은 보통 한 명이 전부 내는 문화", en: "One person often pays the whole bill — it rotates naturally" },
      { ok: false, ko: "수저를 밥그릇에 꽂아 두면 제사(장례) 연상으로 금기", en: "Never stick chopsticks upright in rice — it resembles funeral rites" },
      { ok: false, ko: "어른보다 먼저 술잔을 마시는 건 실례입니다", en: "Don't drink before elders — turn your head away when sipping" },
    ],
    calloutYellow: {
      ko: "술자리 문화: 자신의 잔을 직접 채우지 않고 옆 사람이 채워줍니다. 마시기 싫을 땐 잔을 손으로 가볍게 덮으면 됩니다.",
      en: "Drinking culture: you don't pour for yourself — neighbors fill each other's glasses. To decline, lightly cover your glass with your hand.",
    },
    grid: null,
  },
  transport: {
    title: { ko: "대중교통 에티켓", en: "Public Transport Etiquette" },
    rules: [
      { ok: true, ko: "노약자석은 비어 있어도 어른·임산부를 위해 비워두세요", en: "Priority seats should stay empty even if available" },
      { ok: true, ko: "지하철 안에서는 작게 말하거나 이어폰을 끼세요", en: "Speak quietly or use earphones on the subway" },
      { ok: true, ko: "타기 전에 내리는 사람이 다 내릴 때까지 기다리세요", en: "Wait for passengers to exit before boarding" },
      { ok: false, ko: "지하철 안에서 음식을 먹으면 눈총을 받아요", en: "Don't eat on the subway — it's frowned upon" },
      { ok: false, ko: "에스컬레이터에서 왼쪽은 서있는 줄, 오른쪽은 걷는 줄", en: "Escalators: stand on the right, walk on the left (Seoul rule)" },
    ],
    calloutBlue: {
      ko: "버스 정류장에서 버스가 오면 손을 들어 신호를 보내야 합니다. 신호 없으면 버스가 그냥 지나칩니다!",
      en: "At bus stops, you MUST wave your hand to signal the bus. If you don't, it may drive past!",
    },
  },
  social: {
    title: { ko: "사회생활 & 인간관계", en: "Social Life & Relationships" },
    cardHeading: { ko: "나이와 직급이 중요한 나라", en: "Age and rank matter a lot here" },
    cardBody: {
      ko: "한국은 나이와 직급에 따라 언어(존댓말/반말)와 행동이 달라지는 문화입니다. 처음 만나는 사람에게는 항상 존댓말을 사용하세요.",
      en: "In Korea, language and behavior shift based on age and rank. Always use formal speech (존댓말) with strangers.",
    },
    qaHeading: { ko: "자주 받는 질문 — 무례한 게 아니에요!", en: "Common Questions — Not Rude in Korean Culture!" },
    qa: [
      { q: { ko: "몇 살이에요?", en: "How old are you?" }, a: { ko: "한국은 나이로 호칭이 달라져서 나이를 묻는 것이 자연스럽습니다", en: "Age determines speech levels — it's perfectly normal to ask" } },
      { q: { ko: "밥 먹었어요?", en: "Have you eaten?" }, a: { ko: "안부 인사예요. '네' 또는 '아직요' 정도로 답하면 됩니다", en: "A casual greeting like 'How are you?' — just say yes or not yet" } },
      { q: { ko: "결혼은 했어요?", en: "Are you married?" }, a: { ko: "관심의 표현이에요. 불편하면 가볍게 웃으며 넘기면 됩니다", en: "An expression of interest. Just smile and deflect if uncomfortable" } },
    ],
    calloutCoral: null,
  },
  taboo: {
    title: { ko: "절대 피해야 할 것들", en: "Things to Absolutely Avoid" },
    calloutRed: {
      ko: "아래 행동들은 한국에서 심각한 실례 또는 금기로 여겨집니다. 꼭 기억하세요!",
      en: "The following are considered seriously rude or taboo in Korea. Keep these in mind!",
    },
    rules: [
      { ok: false, ko: "빨간색 잉크로 이름을 쓰면 안 됩니다 — 죽음과 연관된 색으로 여깁니다", en: "Never write someone's name in red ink — it's associated with death" },
      { ok: false, ko: "숫자 '4'가 들어간 선물(예: 4개 묶음)은 불길하게 여깁니다", en: "Avoid gifts in sets of 4 — the number 4 sounds like 'death' in Korean" },
      { ok: false, ko: "집 안에서 신발을 신고 들어가면 안 됩니다. 반드시 벗으세요", en: "Never wear shoes inside a Korean home — always remove them at the door" },
      { ok: false, ko: "발로 문을 열거나 물건을 밀면 실례입니다", en: "Don't open doors or push things with your feet" },
      { ok: false, ko: "큰 소리로 코를 풀면 시선이 집중됩니다. 화장실에서 하세요", en: "Blowing your nose loudly in public attracts stares — do it in the restroom" },
    ],
    calloutYellow: {
      ko: "실수해도 괜찮아요! 대부분의 한국인은 외국인의 문화 차이를 이해합니다. 진심 어린 '죄송합니다'면 충분합니다.",
      en: "It's okay to make mistakes! Most Koreans understand cultural differences. A sincere '죄송합니다' goes a long way.",
    },
  },
};
