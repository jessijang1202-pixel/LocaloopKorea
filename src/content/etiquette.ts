// Culture & etiquette content.
//
//   ETIQUETTE_FULL      → the complete text: every section, every rule row,
//                         the dining "quick tips" grid, and the gift-culture
//                         callout in the Social section. Historically this fed a
//                         standalone /etiquette page (now an orphan / data-only).
//   ETIQUETTE_GUIDE_TAB → the /guide (Culture & Etiquette tab) dataset.
//
// MERGE DECISION (2026-07-12): the product decision is that the guide tab now
// shows the FULL content. The previously separate, intentionally-trimmed guide
// dataset has been RETIRED; ETIQUETTE_GUIDE_TAB is now a straight alias of
// ETIQUETTE_FULL. The export name is kept so the orphan-page relationship stays
// documented and existing imports keep working. Edit ETIQUETTE_FULL only.
//
// CATEGORIES and KEY_PHRASES are shared and exported once.

export type Bilingual = { ko: string; en: string };
export type EtqRule = { ok: boolean; ko: string; en: string };
export type EtqQA = { q: Bilingual; a: Bilingual };
// `emoji` is carried for parity with the original data shape but is not rendered.
export type EtqGridItem = { emoji: string; ko: string; en: string; desc: Bilingual };
// Shape shared by the three appended sections (taxi / bathhouse / hiking):
// a title, a set of rule rows, and a single blue info callout — modelled on the
// existing `transport` section shape.
export type EtqSection = { title: Bilingual; rules: EtqRule[]; calloutBlue: Bilingual };

export type EtiquetteContent = {
  greeting: { title: Bilingual; cardHeading: Bilingual; cardBody: Bilingual; rules: EtqRule[]; calloutCoral: Bilingual };
  dining: { title: Bilingual; cardHeading: Bilingual; rules: EtqRule[]; calloutYellow: Bilingual; grid: EtqGridItem[] | null };
  transport: { title: Bilingual; rules: EtqRule[]; calloutBlue: Bilingual };
  social: { title: Bilingual; cardHeading: Bilingual; cardBody: Bilingual; qaHeading: Bilingual; qa: EtqQA[]; calloutCoral: Bilingual | null };
  taboo: { title: Bilingual; calloutRed: Bilingual; rules: EtqRule[]; calloutYellow: Bilingual };
  drinking: EtqSection;
  payment: EtqSection;
  taxi: EtqSection;
  bathhouse: EtqSection;
  hiking: EtqSection;
};

// Shared, identical on both screens.
export const ETIQUETTE_CATEGORIES = [
  { id: "all", ko: "전체", en: "All" },
  { id: "greeting", ko: "인사", en: "Greetings" },
  { id: "dining", ko: "식사", en: "Dining" },
  { id: "drinking", ko: "술자리", en: "Drinking" },
  { id: "transport", ko: "교통", en: "Transport" },
  { id: "social", ko: "사회", en: "Social" },
  { id: "payment", ko: "결제", en: "Payment" },
  { id: "taboo", ko: "금기", en: "Taboos" },
  { id: "bathhouse", ko: "찜질방", en: "Bathhouse" },
  { id: "hiking", ko: "등산", en: "Outdoors" },
];

// Shared, identical on both screens.
export const KEY_PHRASES = [
  { ko: "안녕하세요", rom: "Annyeonghaseyo", en: "Hello" },
  { ko: "감사합니다", rom: "Gamsahamnida", en: "Thank you" },
  { ko: "죄송합니다", rom: "Joesonghamnida", en: "I'm sorry" },
  { ko: "괜찮아요", rom: "Gwaenchanayo", en: "It's okay" },
  { ko: "잘 먹겠습니다", rom: "Jal meokgesseumnida", en: "I will eat well" },
  { ko: "잘 먹었습니다", rom: "Jal meogeosseumnida", en: "I ate well" },
  { ko: "여기요", rom: "Yeogiyo", en: "Excuse me (to call staff)" },
  { ko: "포장해 주세요", rom: "Pojanghae juseyo", en: "To go, please" },
  { ko: "계산서 주세요", rom: "Gyesanseo juseyo", en: "Check, please" },
  { ko: "영어 메뉴 있어요?", rom: "Yeongeo menyu isseoyo?", en: "Do you have an English menu?" },
  { ko: "현금만 되나요?", rom: "Hyeongeumman doenayo?", en: "Is it cash only?" },
  { ko: "화장실 어디예요?", rom: "Hwajangsil eodiyeyo?", en: "Where is the restroom?" },
  { ko: "얼마예요?", rom: "Eolmayeyo?", en: "How much is it?" },
  { ko: "천천히 말해 주세요", rom: "Cheoncheonhi malhae juseyo", en: "Please speak slowly" },
  { ko: "이거 매워요?", rom: "Igeo maewoyo?", en: "Is this spicy?" },
  { ko: "안 매운 거 있어요?", rom: "An maeun geo isseoyo?", en: "Do you have something not spicy?" },
  { ko: "영수증 주세요", rom: "Yeongsujeung juseyo", en: "Receipt, please" },
  { ko: "카드 되나요?", rom: "Kadeu doenayo?", en: "Do you take cards?" },
  { ko: "물 좀 주세요", rom: "Mul jom juseyo", en: "Some water, please" },
  { ko: "이거 주세요", rom: "Igeo juseyo", en: "I'll have this one" },
  { ko: "도와주세요", rom: "Dowajuseyo", en: "Please help me" },
  { ko: "잘 부탁드립니다", rom: "Jal butakdeurimnida", en: "Nice to meet you (please take care of me)" },
];

// ── Full content — the single source of truth for both screens ─────────────────
export const ETIQUETTE_FULL: EtiquetteContent = {
  greeting: {
    title: { ko: "인사 & 기본 예절", en: "Greetings & Basic Manners" },
    cardHeading: { ko: "인사의 나라 — 고개 숙임(절)이 핵심", en: "The Bowing Nation — the bow is everything" },
    cardBody: {
      ko: "한국에서는 처음 만나는 사람에게 가볍게 고개를 숙여 인사합니다. 각도가 클수록 더 큰 존경을 나타냅니다. 15° 가벼운 인사, 30° 일반적 인사, 45° 깊은 감사나 사죄.",
      en: "In Korea, you bow your head slightly when greeting someone for the first time. The deeper the bow, the more respect it conveys. 15° light acknowledgment, 30° standard greeting, 45° deep gratitude or apology.",
    },
    rules: [
      { ok: true, ko: "어른(나이 많은 분)을 만나면 먼저 인사하세요. 눈을 살짝 내리며 고개를 숙이면 더 정중해 보입니다.", en: "Greet elders (older people) first — always. Lowering your gaze slightly as you bow reads as extra polite." },
      { ok: true, ko: "물건을 주고받을 때는 두 손을 쓰세요. 한 손이 바쁠 땐 다른 손으로 팔뚝을 받치면 예의 바르게 보입니다.", en: "Give and receive things with both hands. If one hand is busy, support your forearm with the other — it still shows respect." },
      { ok: true, ko: "'안녕하세요' 한마디만으로도 큰 호감을 얻습니다. 발음이 서툴러도 시도 자체를 반깁니다.", en: "Saying '안녕하세요' (Annyeonghaseyo) earns instant goodwill. Even shaky pronunciation is welcomed — the effort counts." },
      { ok: true, ko: "명함은 두 손으로 건네고 두 손으로 받으세요. 받은 명함은 바로 넣지 말고 잠시 보며 이름을 확인하는 것이 예의입니다.", en: "Offer and receive business cards with both hands. Don't pocket a card immediately — glance at it and read the name first." },
      { ok: false, ko: "악수할 때 한 손만 내밀면 무례하게 보일 수 있어요. 왼손으로 오른쪽 팔뚝을 가볍게 받치세요.", en: "Don't offer just one hand for a handshake — support your right forearm with your left hand." },
      { ok: false, ko: "어른 앞에서 먼저 자리에 앉거나 음식을 먹으면 실례입니다. 어른이 앉은 뒤에 앉으세요.", en: "Don't sit down or start eating before elders do — wait until they are seated." },
      { ok: false, ko: "어른을 손가락으로 가리키거나 손짓으로 부르지 마세요. 손바닥을 아래로 향해 흔드는 것이 정중한 부름입니다.", en: "Don't point at or beckon an elder with a finger — wave with your palm facing down instead." },
      { ok: true, ko: "어른이나 상사는 이름 대신 직함(부장님, 선생님, 사장님)으로 부르세요. 이름만 부르는 것은 친한 또래 사이에서만 자연스럽습니다.", en: "Address elders and superiors by their title (부장님/manager, 선생님/teacher, 사장님/boss) rather than their name — first names alone are only natural between close peers." },
      { ok: false, ko: "실내나 어른 앞에서 모자·선글라스를 쓴 채 있는 것은 무례해 보일 수 있어요. 인사할 때는 벗는 것이 정중합니다.", en: "Keeping a hat or sunglasses on indoors or in front of elders can read as rude — take them off when greeting someone." },
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
      { ok: true, ko: "반찬은 무한 리필! 직원에게 '여기요' 하고 부른 뒤 '더 주세요'라고 하거나 손짓으로 요청하세요. 추가 요금은 없습니다.", en: "Side dishes (banchan) are free refills. Call staff with '여기요' (Yeogiyo) then ask for more — there's no extra charge." },
      { ok: true, ko: "식사 전 어른이 수저를 들기를 기다렸다가 함께 시작하세요. 어른이 '드세요'라고 권하면 그때 시작하면 됩니다.", en: "Wait for the eldest to pick up their spoon before you start. Once they say '드세요' (please eat), you're clear to begin." },
      { ok: true, ko: "직원을 부를 때는 '여기요' 또는 '저기요'라고 부르거나 테이블의 호출벨을 누르세요. 조용히 기다리면 아무도 오지 않습니다.", en: "Summon staff by calling '여기요' / '저기요' or pressing the table call button. Waiting quietly rarely works — you must call out." },
      { ok: true, ko: "국물은 숟가락, 반찬은 젓가락으로 먹습니다. 밥그릇은 들지 않고 상 위에 둔 채 먹는 것이 일반적입니다.", en: "Use the spoon for soup and rice, chopsticks for side dishes. Unlike Japan, you leave the rice bowl on the table rather than lifting it." },
      { ok: false, ko: "식사 중 수저를 밥그릇에 꽂아 두면 제사(장례)를 연상시켜 금기입니다. 다 먹은 뒤엔 상 위에 가지런히 놓으세요.", en: "Never stick chopsticks or a spoon upright in rice — it resembles funeral rites. Rest them flat on the table when done." },
      { ok: false, ko: "어른보다 먼저 술잔을 비우거나 정면으로 마시는 건 실례입니다. 고개를 옆으로 살짝 돌려서 마시세요.", en: "Don't drink before elders or face them while sipping alcohol — turn your head slightly away when you drink." },
      { ok: false, ko: "남의 밥그릇에서 음식을 직접 집어먹거나 자기 젓가락으로 덜어주는 것은 피하세요. 앞접시나 공용 집게를 쓰세요.", en: "Don't take food from someone else's bowl or serve others with your own chopsticks — use a shared spoon or the serving tongs." },
      { ok: true, ko: "물, 물컵, 수저, 물티슈는 대부분 셀프서비스입니다. 정수기나 테이블 위 물병에서 직접 따라 마시고, 수저는 서랍이나 통에서 꺼내 세팅하세요.", en: "Water, cups, cutlery, and wet wipes are usually self-serve. Pour your own water from the dispenser or the bottle on the table, and set out spoons and chopsticks from the drawer or holder." },
      { ok: true, ko: "밥그릇은 상 위에 둔 채 숟가락으로 떠먹습니다. 일본처럼 그릇을 입 가까이 들어 올리는 것은 한국에서는 어색하게 보입니다.", en: "Keep the rice bowl on the table and eat with a spoon. Lifting the bowl toward your mouth as in Japan looks out of place in Korea." },
    ],
    calloutYellow: {
      ko: "술자리 문화: 자신의 잔을 직접 채우지 않고 옆 사람이 채워줍니다. 어른에게 따를 땐 두 손으로, 받을 땐 잔을 두 손으로 받으세요. 마시기 싫을 땐 잔을 손으로 가볍게 덮으면 됩니다.",
      en: "Drinking culture: you don't pour for yourself — neighbors fill each other's glasses. Pour for elders with two hands and receive with two hands. To decline, lightly cover your glass with your hand.",
    },
    grid: [
      { emoji: "", ko: "젓가락 먼저", en: "Chopsticks first", desc: { ko: "국물은 숟가락, 반찬은 젓가락", en: "Spoon for soup, chopsticks for side dishes" } },
      { emoji: "", ko: "조용히 먹기", en: "Eat quietly", desc: { ko: "쩝쩝 소리는 실례", en: "Slurping food is considered rude" } },
      { emoji: "", ko: "전화는 잠깐", en: "Brief phone use", desc: { ko: "식사 중 통화는 양해를 구하고", en: "Excuse yourself before taking calls" } },
      { emoji: "", ko: "번갈아 내기", en: "Taking turns", desc: { ko: "번갈아 내는 것이 자연스러워요", en: "Rotating who pays is the norm" } },
    ],
  },
  transport: {
    title: { ko: "대중교통 에티켓", en: "Public Transport Etiquette" },
    rules: [
      { ok: true, ko: "노약자석(분홍/파란 시트)은 비어 있어도 어른·임산부를 위해 비워두세요. 임산부 배려석(분홍색)은 특히 젊은 사람이 앉지 않는 것이 관행입니다.", en: "Priority seats (pink/blue) should stay empty even if free — they're for elders and pregnant riders. The pink pregnancy seat is customarily left open by younger passengers." },
      { ok: true, ko: "지하철·버스 안에서는 작게 말하거나 이어폰을 끼세요. 스피커폰이나 영상 소리를 켜두는 것은 큰 실례입니다.", en: "Speak quietly or use earphones on the subway and bus. Playing video or music on speaker is a serious faux pas." },
      { ok: true, ko: "타기 전에 내리는 사람이 다 내릴 때까지 문 양옆에서 기다리세요. 문이 열리자마자 밀고 들어가면 눈총을 받습니다.", en: "Wait beside the doors and let everyone exit before you board. Pushing in the moment doors open earns dirty looks." },
      { ok: true, ko: "T-money(티머니) 교통카드를 편의점에서 사서 충전하면 지하철·버스·택시를 모두 탈 수 있습니다. 환승 할인도 자동 적용됩니다.", en: "Buy and top up a T-money card at any convenience store — it works on subway, bus, and taxi, and applies transfer discounts automatically." },
      { ok: false, ko: "지하철 안에서 음식을 먹으면 눈총을 받아요. 냄새가 강한 음식이나 뜨거운 음료는 특히 피하세요.", en: "Don't eat on the subway — it's frowned upon, especially strong-smelling food or hot drinks." },
      { ok: false, ko: "에스컬레이터에서는 오른쪽에 서고 왼쪽은 걷는 사람을 위해 비웁니다(서울 기준). 안전 캠페인상 '두 줄 서기'를 권장하기도 하지만 실제로는 한 줄 서기가 흔합니다.", en: "On escalators, stand on the right and leave the left for walkers (Seoul convention). Safety campaigns push 'stand on both sides,' but one-side standing is what you'll actually see." },
      { ok: true, ko: "붐비는 지하철·버스에서는 배낭을 앞으로 메거나 손에 들어 발밑에 두세요. 뒤로 멘 가방이 다른 승객을 치기 쉬워 매너로 여겨집니다.", en: "In a crowded subway or bus, wear your backpack on your front or hold it at your feet — a pack on your back easily bumps others, so switching it round is seen as good manners." },
      { ok: false, ko: "지하철 안에서는 전화 통화를 거의 하지 않습니다. 꼭 받아야 하면 짧게, 작은 목소리로 하고 긴 통화는 내려서 하세요.", en: "People almost never take phone calls on the subway. If you must answer, keep it short and quiet — save longer calls for after you get off." },
    ],
    calloutBlue: {
      ko: "버스 정류장에서 원하는 버스가 오면 손을 들어 신호를 보내야 합니다. 아무 신호도 없으면 버스가 그냥 지나칠 수 있어요!",
      en: "At bus stops, wave your hand to flag the bus you want. If you don't signal, it may drive right past!",
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
      { q: { ko: "몇 살이에요?", en: "How old are you?" }, a: { ko: "한국은 나이로 호칭과 말투가 달라져서 나이를 묻는 것이 자연스럽습니다. 개인정보 캐묻기가 아니라 관계 설정의 첫 단계예요.", en: "Age sets speech levels and titles in Korea, so asking is normal — it's how people calibrate the relationship, not nosiness." } },
      { q: { ko: "밥 먹었어요?", en: "Have you eaten?" }, a: { ko: "안부 인사예요. 실제로 밥을 챙기려는 게 아니라 '잘 지내요?' 같은 말이니 '네' 또는 '아직요' 정도로 답하면 됩니다.", en: "This is a casual greeting like 'How are you?' — no one is really offering food. Just answer 'yes' or 'not yet.'" } },
      { q: { ko: "결혼은 했어요?", en: "Are you married?" }, a: { ko: "관심의 표현이에요. 불편하면 가볍게 웃으며 화제를 돌려도 무례하지 않습니다.", en: "An expression of interest in you. If it feels too personal, smile and change the subject — that's perfectly fine." } },
      { q: { ko: "형/누나/오빠/언니라고 불러도 돼요?", en: "Can I call you by a sibling term?" }, a: { ko: "나이가 조금 많은 친한 사람을 형·누나·오빠·언니로 부르는 건 친밀함의 표시입니다. 이름 대신 이런 호칭을 쓰자고 하면 가까워졌다는 뜻이에요.", en: "Calling a slightly older friend by a sibling term (hyung/nuna/oppa/eonni) signals closeness. Being invited to use one means they consider you family-close." } },
      { q: { ko: "커플이 커플룩을 입고 다니는 게 이상한가요?", en: "Is it weird that couples wear matching outfits?" }, a: { ko: "전혀요! 한국에서는 커플룩(맞춰 입기), 100일·200일 기념, 커플 폰케이스 같은 커플 문화가 활발합니다. 다만 공공장소에서 진한 스킨십은 삼가는 분위기예요.", en: "Not at all! Couple culture is big in Korea — matching outfits, 100-day and 200-day anniversaries, matching phone cases. That said, heavy public affection is still kept low-key." } },
      { q: { ko: "약속 시간에 꼭 맞춰 가야 하나요?", en: "Do I really need to be on time?" }, a: { ko: "네, 특히 업무·공식 자리에서는 정시나 5분 전 도착이 기본입니다. 늦을 것 같으면 미리 연락(카톡)하는 것이 예의입니다. 친구 사이에는 조금 더 여유롭습니다.", en: "Yes — for work and formal settings, arriving on time or 5 minutes early is expected. If you'll be late, message ahead (KakaoTalk) as a courtesy. Among friends it's a bit more relaxed." } },
    ],
    calloutCoral: {
      ko: "선물 문화: 선물을 받으면 그 자리에서 바로 열어보지 않는 것이 예의입니다. 나중에 혼자 열어보는 경우가 많아요. 처음 집에 초대받아 갈 땐 과일, 간식, 휴지 세트 같은 작은 선물을 두 손으로 건네세요.",
      en: "Gift culture: it's polite not to open a gift in front of the giver — Koreans often open it later, alone. When first invited to someone's home, bring a small gift (fruit, snacks, even a tissue set) and hand it over with both hands.",
    },
  },
  taboo: {
    title: { ko: "절대 피해야 할 것들", en: "Things to Absolutely Avoid" },
    calloutRed: {
      ko: "아래 행동들은 한국에서 심각한 실례 또는 금기로 여겨집니다. 문화적 충격을 피하려면 꼭 기억하세요!",
      en: "The following are considered seriously rude or taboo in Korea. Keep these in mind to avoid culture shock!",
    },
    rules: [
      { ok: false, ko: "빨간색 잉크로 사람 이름을 쓰면 안 됩니다 — 죽음과 연관된 색으로 여깁니다. 서명이나 편지에서는 검정·파랑 펜을 쓰세요.", en: "Never write someone's name in red ink — it's linked to death. Use black or blue pen for signatures and letters." },
      { ok: false, ko: "숫자 '4'는 '死(죽을 사)'와 발음이 같아 불길하게 여깁니다. 선물을 4개 묶음으로 주는 것은 피하세요.", en: "The number 4 sounds like the word for 'death,' so it's seen as unlucky — avoid giving gifts in sets of four." },
      { ok: false, ko: "집이나 일부 식당·게스트하우스에서는 신발을 신고 들어가면 안 됩니다. 현관에서 반드시 벗으세요.", en: "Never wear shoes inside a home — or many traditional restaurants and guesthouses. Always remove them at the entrance." },
      { ok: false, ko: "발로 문을 열거나 물건을 밀거나 사람을 가리키면 큰 실례입니다. 발은 '더러운 것'으로 여겨집니다.", en: "Opening doors, pushing things, or pointing with your feet is very disrespectful — feet are seen as unclean." },
      { ok: false, ko: "식탁에서 큰 소리로 코를 풀면 시선이 집중됩니다. 화장실에 다녀오거나 조용히 처리하세요.", en: "Blowing your nose loudly at the table draws stares — step to the restroom or handle it discreetly." },
      { ok: false, ko: "웃어른 앞에서 술을 마실 때 얼굴을 돌리지 않거나, 한 손으로 술을 따르면 실례입니다.", en: "Drinking in front of elders without turning away — or pouring their drink with one hand — is rude." },
      { ok: false, ko: "공공장소에서 과한 애정 표현(진한 스킨십)은 눈총을 받습니다. 손잡기나 가벼운 포옹 정도는 괜찮습니다.", en: "Heavy public displays of affection draw disapproval. Hand-holding and a light hug are fine; more than that is frowned upon." },
      { ok: false, ko: "쓰레기 분리수거를 지키지 않으면 큰 실례이자 종종 과태료 대상입니다. 일반쓰레기·음식물·재활용(플라스틱/캔/유리/종이)을 반드시 분리하세요.", en: "Ignoring recycling separation is a serious faux pas — and sometimes a fine. Always sort general waste, food waste, and recyclables (plastic, cans, glass, paper) separately." },
      { ok: false, ko: "아파트·빌라에서 밤늦게 쿵쿵거리거나 큰 소리를 내면 '층간소음' 갈등으로 번집니다. 밤에는 발소리, 세탁기, 음악 소리를 특히 조심하세요.", en: "Stomping or making noise late at night in an apartment leads to serious 'floor-noise' (층간소음) disputes with neighbors. Be especially careful with footsteps, laundry machines, and music after dark." },
    ],
    calloutYellow: {
      ko: "실수해도 괜찮아요! 대부분의 한국인은 외국인의 문화 차이를 이해하고 너그럽게 받아들입니다. 진심 어린 '죄송합니다'면 충분합니다.",
      en: "It's okay to make mistakes! Most Koreans are understanding of cultural differences. A sincere '죄송합니다 (Joesonghamnida)' goes a long way.",
    },
  },
  drinking: {
    title: { ko: "술자리 문화", en: "Drinking Culture" },
    rules: [
      { ok: true, ko: "자기 잔은 스스로 채우지 않습니다. 잔이 비면 옆 사람이 채워주고, 상대의 잔이 비면 내가 채워주는 것이 기본 예절입니다.", en: "You don't fill your own glass. When it's empty a neighbor tops you up, and you keep an eye on theirs — mutual pouring is the core ritual." },
      { ok: true, ko: "어른에게 술을 따를 때는 두 손으로 병을 잡고 따르세요. 받을 때도 두 손으로 잔을 받쳐 듭니다. 한 손이 바쁘면 다른 손으로 팔을 받치면 됩니다.", en: "Pour for elders holding the bottle with both hands, and receive with both hands supporting the glass. If one hand is busy, support your forearm with the other." },
      { ok: true, ko: "어른 앞에서 마실 때는 고개를 옆으로 살짝 돌리고 잔을 손으로 가리며 마시는 것이 예의입니다. 정면으로 마주 보며 마시지 않습니다.", en: "When drinking in front of an elder, turn your head slightly away and shield the glass with your hand — you don't face them head-on as you sip." },
      { ok: true, ko: "'건배(乾杯, geonbae)'는 '잔을 비우자', '위하여(wihayeo)'는 '~를 위하여'라는 뜻의 대표 건배사입니다. 잔을 부딪칠 때 어른의 잔보다 살짝 낮게 부딪치면 더 정중합니다.", en: "'건배 (geonbae)' means 'empty your glass' and '위하여 (wihayeo)' means 'to (our health/success)' — the two go-to toasts. Clinking your glass slightly lower than an elder's shows extra respect." },
      { ok: true, ko: "회식은 보통 1차(식사+술), 2차(호프·노래방), 3차로 이어집니다. 끝까지 함께하면 좋지만, 다음 차수는 정중히 빠져도 괜찮습니다.", en: "A work dinner (회식) often moves in rounds — 1차 (meal and drinks), 2차 (pub or karaoke), sometimes 3차. Staying is appreciated, but politely bowing out of the next round is fine." },
      { ok: false, ko: "술을 못 마셔도 괜찮습니다. 잔을 손으로 가볍게 덮거나 '저는 오늘 안 마실게요', '운전해야 해서요'라고 하면 대부분 존중해 줍니다. 억지로 원샷할 필요는 없어요.", en: "It's okay not to drink. Lightly cover your glass or say '저는 안 마실게요' (I won't drink) or '운전해야 해서요' (I'm driving) — most people respect it. You never have to force a shot." },
    ],
    calloutBlue: {
      ko: "첫 잔은 대개 함께 '원샷'하는 분위기지만, 이후에는 자기 속도로 마셔도 됩니다. 상대가 잔을 채워주면 최소한 입만 대는 것이 예의이고, 더 이상 원치 않으면 잔을 반쯤 채워둔 채로 두면 권하지 않습니다.",
      en: "The first glass is often a shared 'one shot,' but after that you can pace yourself. If someone fills your glass, at least touch it to your lips out of courtesy — and leaving it half-full signals you're done, so no one keeps refilling.",
    },
  },
  payment: {
    title: { ko: "결제 · 팁 문화", en: "Payment & Tipping" },
    rules: [
      { ok: false, ko: "한국에는 팁 문화가 없습니다. 식당·카페·택시·미용실 어디서도 팁을 주지 않으며, 팁을 억지로 건네면 오히려 상대가 당황하거나 거절합니다.", en: "Korea has no tipping culture. You don't tip at restaurants, cafés, taxis, or salons — pressing a tip on someone usually causes confusion or is politely refused." },
      { ok: true, ko: "카드 결제가 거의 모든 곳에서 됩니다. 편의점·포장마차·재래시장 일부만 현금을 선호하니, 소액 현금과 교통카드만 있으면 충분합니다.", en: "Card payment works almost everywhere. Only some convenience-store stalls, street carts, and traditional markets prefer cash — a little cash plus a transit card covers those." },
      { ok: true, ko: "식당에서는 보통 자리에서 계산하지 않고, 다 먹은 뒤 입구 카운터로 가서 계산합니다. 영수증이나 테이블 번호를 가지고 나가면 됩니다.", en: "At most restaurants you don't pay at the table — you take the bill (or note your table number) to the counter by the entrance and pay on the way out." },
      { ok: true, ko: "젊은 세대에서는 '더치페이(각자 내기)'가 흔합니다. 카카오페이·토스 같은 앱으로 1/N을 바로 송금하거나, 한 명이 계산하고 나중에 나눠 보내는 경우가 많습니다.", en: "Among younger Koreans, splitting the bill ('더치페이', going Dutch) is common. People split 1/N instantly via apps like Kakao Pay or Toss, or one person pays and the rest transfer their share afterward." },
      { ok: true, ko: "어른·상사·초대한 사람이 전체를 사는 관습도 여전히 강합니다. 얻어먹었다면 '다음엔 제가 살게요' 하고 다음 자리에서 커피나 밥을 사는 것이 자연스러운 답례입니다.", en: "The convention that the elder, the boss, or the person who invited you covers the whole bill is still strong. If you're treated, say '다음엔 제가 살게요' (I'll get it next time) and reciprocate with coffee or a meal later." },
      { ok: false, ko: "계산할 때 서로 내겠다고 실랑이하는 모습은 흔한 정(情) 표현입니다. 한두 번 사양한 뒤 '그럼 잘 먹겠습니다' 하고 받아들이거나, 다음을 기약하면 됩니다.", en: "A friendly tussle over who gets to pay is a normal show of warmth (정). Decline once or twice, then either accept graciously ('그럼 잘 먹겠습니다') or promise to get the next one." },
    ],
    calloutBlue: {
      ko: "많은 식당·주점에는 '봉사료'나 자릿세가 따로 없지만, 일부 술집·룸에서는 안주(기본 안주)나 자릿세가 붙기도 합니다. 계산서에 처음 보는 항목이 있으면 '이건 뭐예요?'라고 편하게 물어보세요.",
      en: "Most restaurants and bars add no service charge or cover fee, though some pubs and private rooms charge for a mandatory side dish (기본 안주) or a seat fee. If you see an unfamiliar line on the bill, just ask '이건 뭐예요?' (what is this?).",
    },
  },
  taxi: {
    title: { ko: "택시 · 교통 심화", en: "Taxi & Transport (Advanced)" },
    rules: [
      { ok: true, ko: "택시는 길에서 잡기 어려울 때 카카오T 앱으로 부르면 편합니다. 목적지를 미리 입력하고 결제도 앱에 등록한 카드로 자동 처리돼 언어 장벽이 크게 줄어듭니다.", en: "When street-hailing is hard, use the Kakao T app to call a taxi. You enter the destination in advance and pay with a saved card, which removes most of the language barrier." },
      { ok: true, ko: "택시를 혼자 탈 때는 조수석보다 뒷좌석에 앉는 것이 일반적입니다. 조수석은 보통 일행이 많을 때만 사용합니다.", en: "Riding a taxi alone, sit in the back rather than the front passenger seat. The front seat is usually only used when your group is full." },
      { ok: true, ko: "택시 문은 대부분 승객이 직접 열고 닫습니다. 일본과 달리 자동문이 아니니 내릴 때 뒤에서 오는 오토바이·자전거를 확인하고 여세요.", en: "In Korea you open and close the taxi door yourself — unlike Japan, doors are not automatic. Check for oncoming bikes and scooters before opening." },
      { ok: true, ko: "버스에서 내릴 때는 미리 하차벨을 누르세요. 벨을 누르지 않으면 정류장을 그냥 지나칠 수 있습니다. 뒷문으로 내리는 것이 일반적입니다.", en: "Press the stop bell before your bus stop — if no one presses it, the driver may skip the stop. Exit through the rear door." },
      { ok: true, ko: "심야(자정~새벽 4시)에는 택시 할증 요금이 20~40% 붙습니다. 앱으로 부르면 예상 요금이 미리 표시돼 바가지 걱정이 없습니다.", en: "Late at night (midnight–4am) taxis add a 20–40% surcharge. Calling via app shows the estimated fare up front, so there's no fear of being overcharged." },
      { ok: false, ko: "택시 기사에게 팁을 줄 필요가 없습니다. 미터기 요금(또는 앱 표시 요금)만 내면 되고, 팁을 억지로 건네면 오히려 당황스러워합니다. 잔돈은 '괜찮아요' 하고 안 받아도 됩니다.", en: "You don't tip taxi drivers. Just pay the metered fare (or the app fare) — pressing a tip on them usually causes confusion. You can wave off small change with '괜찮아요' (it's okay)." },
      { ok: true, ko: "짐이 많으면 트렁크를 열어 달라고 부탁하세요. 기사가 직접 실어주기도 하지만, 스스로 싣고 내리는 경우도 많으니 무거운 짐은 미리 말하는 것이 좋습니다.", en: "With lots of luggage, ask the driver to pop the trunk. Some drivers load it for you, but often you do it yourself — mention heavy bags in advance." },
    ],
    calloutBlue: {
      ko: "지하철 에스컬레이터에서는 '한 줄 서기'가 오래된 관행입니다. 급한 사람이 왼쪽으로 걸어 올라갈 수 있게 오른쪽에 서세요. 임산부·노약자석은 한산해도 비워두는 것이 매너입니다.",
      en: "On subway escalators, standing on one side is the long-standing habit — keep right so people in a hurry can walk up the left. And leave priority seats open even when the car is empty.",
    },
  },
  bathhouse: {
    title: { ko: "찜질방 · 목욕탕", en: "Jjimjilbang & Bathhouse" },
    rules: [
      { ok: true, ko: "목욕탕(대중탕) 안에서는 수영복 없이 완전히 탈의해야 합니다. 남탕·여탕이 분리되어 있고 수건으로 몸을 가리며 다니는 것은 자유지만, 옷을 입고 들어가는 것은 허용되지 않습니다.", en: "Inside the wet bathing area you must be fully nude — no swimsuits. Men's and women's areas are separate; covering with a towel as you walk is optional, but wearing clothing into the baths is not allowed." },
      { ok: true, ko: "탕에 들어가기 전에 반드시 샤워로 몸을 씻으세요. 비누칠을 하고 깨끗이 헹군 뒤 탕에 들어가는 것이 기본 예절입니다.", en: "Always shower and wash before entering a soaking tub. Soaping up and rinsing thoroughly first is basic etiquette." },
      { ok: true, ko: "찜질방(공용 구역)에서는 시설에서 주는 반팔·반바지를 입습니다. 이곳은 남녀 공용이라 옷을 꼭 입어야 하며, 수면실에서는 조용히 하고 자리를 맡아두지 마세요.", en: "In the jjimjilbang (mixed common area) you wear the shorts and T-shirt the facility provides — clothing is required here since it's co-ed. In the sleeping room, stay quiet and don't reserve spots." },
      { ok: true, ko: "'양머리' 수건 접기는 찜질방의 상징입니다. 긴 수건을 양쪽으로 말아 머리에 쓰는 것으로, 꼭 해야 하는 건 아니지만 재미로 시도해보세요.", en: "The rolled 'sheep-head' towel is a jjimjilbang icon — you fold a towel and wear it on your head. It's not required, but it's a fun local ritual to try." },
      { ok: true, ko: "세신(때밀이)은 전문 세신사가 각질을 밀어주는 유료 서비스입니다. 원하지 않으면 안 받아도 되고, 받고 싶으면 카운터에서 미리 신청하세요.", en: "Seshin (a body scrub) is a paid service where an attendant exfoliates your skin. It's entirely optional — request it at the counter if you want it." },
      { ok: false, ko: "문신이 크면 일부 목욕탕에서 시선을 받거나 입장을 제한하기도 합니다. 입구 안내를 확인하거나 큰 반창고로 가리면 무난합니다.", en: "Large tattoos can draw stares or, at some bathhouses, be turned away. Check the entrance notice, or cover them with a large bandage to be safe." },
      { ok: false, ko: "탕 안에서 수건을 담그거나 물에 넣지 마세요. 수건은 물 밖에 두거나 머리 위에 올려두는 것이 예절입니다.", en: "Don't dip your towel into the soaking tub. Keep it out of the water — resting it on the tub edge or on your head is the norm." },
      { ok: false, ko: "수면실이나 조용한 구역에서는 통화·영상 소리를 삼가세요. 찜질방은 밤새 자는 사람이 많아 큰 소리는 큰 실례입니다.", en: "In the sleeping room and quiet zones, avoid phone calls and playing video out loud. Many people sleep through the night in a jjimjilbang, so noise is a real intrusion." },
    ],
    calloutBlue: {
      ko: "찜질방은 24시간 운영하는 곳이 많아 저렴한 숙박 대안이 됩니다. 입장 시 받은 사물함 열쇠(팔찌)로 매점·식당 요금을 계산하고 나갈 때 한 번에 정산합니다.",
      en: "Many jjimjilbangs are open 24 hours and double as a cheap place to sleep. The locker key (a wristband) you get on entry tracks snack-bar and cafeteria charges, which you settle all at once on the way out.",
    },
  },
  hiking: {
    title: { ko: "등산 · 야외", en: "Hiking & Outdoors" },
    rules: [
      { ok: true, ko: "한국인은 등산을 정말 좋아하고, 산에서는 모르는 사람과도 '안녕하세요'라고 인사를 주고받습니다. 특히 어르신이 인사하면 밝게 답례하세요.", en: "Koreans love hiking, and on the trail strangers greet each other with '안녕하세요.' If an older hiker greets you, return it warmly." },
      { ok: true, ko: "쓰레기는 반드시 되가져오세요. 인기 있는 산에도 쓰레기통이 거의 없으므로 껍질·물병까지 모두 배낭에 넣어 내려오는 것이 기본입니다.", en: "Pack out all your trash. Even popular mountains have almost no bins, so everything — peels, bottles — goes back in your pack and down with you." },
      { ok: true, ko: "정상에서 막걸리(전통 쌀 술)와 김밥·간식을 나눠 먹는 문화가 있습니다. 옆 사람이 권하면 가볍게 받아도 좋지만, 음주 후 하산은 위험하니 조금만 드세요.", en: "There's a tradition of sharing makgeolli (rice wine) and snacks like gimbap at the summit. It's fine to accept a small pour if offered, but drinking before the descent is risky — keep it light." },
      { ok: true, ko: "좁은 등산로에서는 올라오는 사람에게 길을 양보하는 것이 관례입니다. 오르는 사람이 체력 소모가 크기 때문에 우선권을 줍니다.", en: "On narrow trails, yield to those climbing up — uphill hikers have the right of way because they're working harder." },
      { ok: true, ko: "단체 산행 시에는 큰 소리로 음악을 틀지 말고, 뒤 사람을 위해 가지나 문을 잡아주는 등 서로 배려하세요. 좁은 구간에서는 한 줄로 걷습니다.", en: "In a group, don't blast music, and look out for one another — hold back branches or gates for the person behind you. Walk single file on narrow stretches." },
      { ok: true, ko: "날씨가 변덕스러우니 얇은 겉옷과 물을 꼭 챙기세요. 정상은 도심보다 훨씬 춥고 바람이 강할 수 있습니다.", en: "Weather shifts fast — always pack a light jacket and water. Summits can be much colder and windier than the city below." },
      { ok: false, ko: "정해진 등산로를 벗어나 지름길로 가지 마세요. 등산로 이탈은 위험할 뿐 아니라 국립공원에서는 자연 훼손으로 과태료가 부과될 수 있습니다.", en: "Don't leave the marked trail to take shortcuts. Going off-trail is dangerous and, in national parks, can bring a fine for damaging protected nature." },
    ],
    calloutBlue: {
      ko: "북한산·관악산 같은 도심 근교 산은 지하철로 접근할 수 있어 초보자도 쉽게 도전할 수 있습니다. 등산화와 물만 챙기면 충분하고, 대부분 입구에 등산로 안내도가 있습니다.",
      en: "City-edge mountains like Bukhansan and Gwanaksan are subway-accessible and beginner-friendly. Hiking shoes and water are enough, and most trailheads have a route map at the entrance.",
    },
  },
};

// ── Guide-tab dataset — now a straight alias of the full content ────────────────
// See the MERGE DECISION note at the top of this file (2026-07-12): the trimmed
// guide-tab variant was retired and this now points at ETIQUETTE_FULL.
export const ETIQUETTE_GUIDE_TAB: EtiquetteContent = ETIQUETTE_FULL;
