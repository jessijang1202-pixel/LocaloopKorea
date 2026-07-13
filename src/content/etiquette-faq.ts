// Etiquette FAQ knowledge base + a small local matcher, powering the guide-tab
// chatbot (src/app/(app)/guide/EtiquetteChatbot.tsx). Fully deterministic and
// offline — no network, no LLM. Answers mirror the ETIQUETTE_FULL content.

import type { Bi } from "@/types/content";

export interface EtiquetteFaq {
  id: string;
  keywords: string[]; // lowercase match tokens, Korean AND English
  question: Bi; // representative question
  answer: Bi; // 2-4 sentence practical answer
  related?: string[]; // ids of related FAQs (shown as follow-up chips)
}

export const ETIQUETTE_FAQS: EtiquetteFaq[] = [
  {
    id: "tipping",
    keywords: ["팁", "tip", "tipping", "gratuity", "service charge", "봉사료"],
    question: { ko: "한국에서 팁을 줘야 하나요?", en: "Do I need to tip in Korea?" },
    answer: {
      ko: "아니요. 한국에는 팁 문화가 없습니다. 식당, 택시, 카페 어디서든 팁을 줄 필요가 없고 오히려 직원이 거스름돈을 돌려주려 할 수 있어요. 고급 호텔에서는 봉사료가 요금에 이미 포함됩니다.",
      en: "No. Korea has no tipping culture. You don't tip at restaurants, taxis, or cafés — staff may even chase you to return the change. High-end hotels already include a service charge in the bill.",
    },
    related: ["splitting-bills", "cash-only", "calling-staff"],
  },
  {
    id: "shoes-off",
    keywords: ["신발", "shoes", "shoe", "take off", "벗", "barefoot", "slippers", "실내화"],
    question: { ko: "집에서 신발을 벗어야 하나요?", en: "Do I take my shoes off indoors?" },
    answer: {
      ko: "네, 반드시 벗으세요. 한국 가정집은 물론 일부 전통 식당, 게스트하우스, 한옥에서도 현관에서 신발을 벗습니다. 현관의 낮은 단(현관)이 신발을 벗는 경계선이며, 실내화가 준비된 경우도 많습니다.",
      en: "Yes, always. You remove shoes at the entrance of homes — and also at some traditional restaurants, guesthouses, and hanok. The small step-down at the door marks the shoes-off boundary; indoor slippers are often provided.",
    },
    related: ["home-visit", "gift-giving", "tattoos"],
  },
  {
    id: "chopsticks-rice",
    keywords: ["젓가락", "chopstick", "chopsticks", "rice", "밥", "stick", "upright", "꽂"],
    question: { ko: "젓가락을 밥에 꽂아도 되나요?", en: "Can I stick chopsticks upright in rice?" },
    answer: {
      ko: "절대 안 됩니다. 밥그릇에 수저를 꽂아 세우면 제사(장례) 상차림을 연상시켜 심각한 금기입니다. 식사 중이나 다 먹은 뒤에는 수저를 상 위에 가지런히 눕혀 두세요.",
      en: "Never. Standing chopsticks or a spoon upright in rice resembles a funeral offering and is a serious taboo. Rest them flat on the table during and after the meal.",
    },
    related: ["eating-order", "chopsticks-spoon", "blowing-nose"],
  },
  {
    id: "eating-order",
    keywords: ["어른", "elder", "elders", "first", "먼저", "wait", "senior", "start eating", "나이"],
    question: { ko: "어른보다 먼저 먹어도 되나요?", en: "Can I start eating before elders?" },
    answer: {
      ko: "아니요, 어른이 수저를 들 때까지 기다렸다가 함께 시작하세요. 어른이 '드세요'라고 권하면 그때 시작하면 됩니다. 자리에 앉는 것도 어른이 앉은 뒤가 예의입니다.",
      en: "No — wait for the eldest to pick up their spoon, then begin together. Once they say '드세요' (please eat), you're clear to start. It's also polite to sit only after elders are seated.",
    },
    related: ["chopsticks-rice", "pouring-drinks", "age-hierarchy"],
  },
  {
    id: "pouring-drinks",
    keywords: ["술", "drink", "drinks", "pour", "pouring", "two hands", "따르", "두 손", "alcohol", "soju"],
    question: { ko: "술은 어떻게 따르고 받나요?", en: "How do I pour and receive drinks?" },
    answer: {
      ko: "자기 잔은 직접 채우지 않고 옆 사람이 채워줍니다. 어른에게 따를 때는 두 손으로, 받을 때도 잔을 두 손으로 받으세요. 마시고 싶지 않으면 잔을 손으로 가볍게 덮으면 됩니다.",
      en: "You don't pour your own glass — others fill it for you. Pour for elders with two hands, and receive with two hands as well. To decline a refill, lightly rest your hand over the glass.",
    },
    related: ["cheers", "drink-turn-away", "eating-order"],
  },
  {
    id: "drink-turn-away",
    keywords: ["돌리", "turn", "turn away", "face", "얼굴", "sip", "옆으로", "drink in front"],
    question: { ko: "어른 앞에서 술 마실 때 고개를 돌려야 하나요?", en: "Do I turn away when drinking in front of elders?" },
    answer: {
      ko: "네. 웃어른 앞에서 술을 마실 때는 고개를 옆으로 살짝 돌리고 잔을 손으로 가리며 마시는 것이 예의입니다. 정면으로 마주 보며 마시는 것은 실례로 여겨집니다.",
      en: "Yes. When drinking in front of an elder, turn your head slightly to the side and shield the glass with your hand. Drinking while facing them directly is considered disrespectful.",
    },
    related: ["pouring-drinks", "cheers", "eating-order"],
  },
  {
    id: "cheers",
    keywords: ["건배", "cheers", "toast", "clink", "잔", "glass height", "위하여"],
    question: { ko: "건배할 때 예절이 있나요?", en: "Is there etiquette for toasting (cheers)?" },
    answer: {
      ko: "건배할 때는 어른보다 잔을 살짝 낮춰서 부딪치는 것이 예의입니다. 상대의 잔보다 내 잔 테두리를 낮게 두면 존경의 표시가 됩니다. '건배' 또는 '위하여'라고 외칩니다.",
      en: "When you clink glasses, hold yours slightly lower than an elder's — keeping your rim below theirs shows respect. People shout '건배' (geonbae) or '위하여' as the toast.",
    },
    related: ["pouring-drinks", "drink-turn-away", "splitting-bills"],
  },
  {
    id: "splitting-bills",
    keywords: ["계산", "bill", "bills", "split", "pay", "dutch", "더치페이", "나눠", "who pays", "계산서"],
    question: { ko: "밥값은 나눠 내나요?", en: "Do people split the bill?" },
    answer: {
      ko: "전통적으로는 한 사람이 전부 내고 다음에 다른 사람이 내는 식으로 번갈아 냅니다. 요즘 젊은 세대는 더치페이도 흔하지만, 어른이 사주겠다고 하면 감사히 받고 다음 번을 노리세요. 계산은 대개 계산대에서 합니다.",
      en: "Traditionally one person pays the whole bill and someone else covers the next outing — it rotates. Younger people now split ('더치페이') often, but if an elder offers to treat, accept graciously and get the next one. You usually pay at the counter, not the table.",
    },
    related: ["tipping", "calling-staff", "cash-only"],
  },
  {
    id: "calling-staff",
    keywords: ["여기요", "call", "staff", "waiter", "저기요", "excuse me", "server", "부르", "call button"],
    question: { ko: "식당에서 직원을 어떻게 부르나요?", en: "How do I call staff in a restaurant?" },
    answer: {
      ko: "'여기요' 또는 '저기요'라고 크게 부르거나, 테이블에 있는 호출벨을 누르세요. 조용히 손만 들고 기다리면 잘 오지 않습니다. 큰 소리로 부르는 것이 무례가 아니라 정상입니다.",
      en: "Call out '여기요' (Yeogiyo) or '저기요,' or press the call button on the table. Quietly raising a hand rarely works — calling out loud is normal here, not rude.",
    },
    related: ["banchan", "splitting-bills", "cafe-seat"],
  },
  {
    id: "banchan",
    keywords: ["반찬", "banchan", "side dish", "side dishes", "refill", "리필", "free", "더 주세요"],
    question: { ko: "반찬은 더 달라고 해도 되나요?", en: "Can I ask for more side dishes (banchan)?" },
    answer: {
      ko: "네, 반찬은 대부분 무료 리필입니다. '여기요' 하고 직원을 부른 뒤 '이거 더 주세요'라고 하거나 빈 그릇을 살짝 들어 보이면 됩니다. 추가 요금은 거의 없지만 일부 특별한 반찬은 유료일 수 있어요.",
      en: "Yes — banchan is usually free to refill. Call staff with '여기요' and say '더 주세요' (more please), or lift the empty dish slightly. There's rarely a charge, though a few premium side dishes may cost extra.",
    },
    related: ["calling-staff", "chopsticks-spoon", "splitting-bills"],
  },
  {
    id: "chopsticks-spoon",
    keywords: ["숟가락", "spoon", "soup", "국", "밥그릇", "lift bowl", "국물", "utensil"],
    question: { ko: "숟가락과 젓가락은 언제 쓰나요?", en: "When do I use the spoon vs chopsticks?" },
    answer: {
      ko: "국물과 밥은 숟가락으로, 반찬은 젓가락으로 먹습니다. 일본과 달리 밥그릇은 들지 않고 상 위에 둔 채 숟가락으로 떠먹는 것이 일반적입니다. 젓가락과 숟가락을 동시에 한 손에 쥐지 마세요.",
      en: "Use the spoon for soup and rice, chopsticks for side dishes. Unlike Japan, you leave the rice bowl on the table and eat with the spoon rather than lifting it. Don't hold spoon and chopsticks in the same hand at once.",
    },
    related: ["chopsticks-rice", "banchan", "eating-order"],
  },
  {
    id: "cafe-seat",
    keywords: ["카페", "cafe", "seat", "belongings", "laptop", "자리", "노트북", "물건", "save seat"],
    question: { ko: "카페에서 물건으로 자리를 맡아도 되나요?", en: "Can I save a café seat with my belongings?" },
    answer: {
      ko: "네, 한국 카페에서는 노트북이나 지갑, 휴대폰을 두고 자리를 맡은 뒤 주문하러 가는 것이 매우 흔하고 안전합니다. 치안이 좋아 소지품 도난이 드물지만, 그래도 고가 물품은 눈에 띄지 않게 두는 것이 좋아요.",
      en: "Yes — leaving a laptop, wallet, or phone to hold a seat while you order is very common and generally safe in Korea. Theft is rare thanks to low crime, though it's still wise to keep pricey items out of plain sight.",
    },
    related: ["study-cafe", "calling-staff", "tipping"],
  },
  {
    id: "study-cafe",
    keywords: ["스터디카페", "study cafe", "study", "공부", "독서실", "quiet", "seat time"],
    question: { ko: "스터디카페는 어떻게 이용하나요?", en: "How do study cafés work?" },
    answer: {
      ko: "스터디카페는 시간당 요금을 내고 조용히 공부하는 공간입니다. 키오스크에서 좌석을 고르고 결제하며, 대화나 통화는 금지이고 전화는 밖에서 받습니다. 음료 반입이 가능한 곳도 많아요.",
      en: "Study cafés charge by the hour for a quiet place to work. You pick a seat and pay at a kiosk; talking and phone calls are banned, so step outside to take a call. Many let you bring in your own drinks.",
    },
    related: ["cafe-seat", "phone-transit", "quiet-transit"],
  },
  {
    id: "priority-seat",
    keywords: ["노약자석", "priority seat", "priority", "pregnant", "임산부", "elderly", "배려석", "reserved seat", "노약자"],
    question: { ko: "지하철 노약자석에 앉아도 되나요?", en: "Can I sit in subway priority seats?" },
    answer: {
      ko: "비어 있어도 앉지 않는 것이 관행입니다. 노약자석(양 끝)과 임산부 배려석(분홍색)은 어른, 임산부, 몸이 불편한 분을 위해 비워둡니다. 일반석에 앉았더라도 어르신이 타면 자리를 양보하세요.",
      en: "It's customary to leave them empty even when free. The end priority seats and the pink pregnancy seat are reserved for elders, pregnant riders, and those with difficulty standing. Even in regular seats, give yours up if an elderly person boards.",
    },
    related: ["escalator", "phone-transit", "quiet-transit"],
  },
  {
    id: "escalator",
    keywords: ["에스컬레이터", "escalator", "stand", "side", "left", "right", "한 줄", "walk"],
    question: { ko: "에스컬레이터는 어느 쪽에 서나요?", en: "Which side do I stand on the escalator?" },
    answer: {
      ko: "서울에서는 오른쪽에 서고 왼쪽은 걷는 사람을 위해 비웁니다. 안전 캠페인은 '두 줄 서기'를 권장하지만 실제로는 한 줄 서기가 흔합니다. 캐리어나 큰 짐은 옆으로 굴러가지 않게 잡으세요.",
      en: "In Seoul, stand on the right and leave the left open for people walking up. Safety campaigns promote 'stand on both sides,' but one-side standing is what you'll actually see. Hold luggage so it can't roll.",
    },
    related: ["priority-seat", "taxi-door", "tmoney"],
  },
  {
    id: "phone-transit",
    keywords: ["통화", "phone", "call on subway", "loud", "speakerphone", "영상", "지하철 전화", "speaker"],
    question: { ko: "지하철에서 전화 통화를 해도 되나요?", en: "Can I talk on the phone on the subway?" },
    answer: {
      ko: "짧은 통화는 가능하지만 최대한 작은 목소리로 하세요. 스피커폰이나 영상·음악 소리를 밖으로 내는 것은 큰 실례입니다. 이어폰을 끼고 조용히 이용하는 것이 기본 매너입니다.",
      en: "A short, quiet call is tolerated, but keep your voice very low. Playing video, music, or calls on speaker is a serious faux pas. Use earphones and keep things quiet — that's the basic norm.",
    },
    related: ["quiet-transit", "priority-seat", "study-cafe"],
  },
  {
    id: "quiet-transit",
    keywords: ["조용", "quiet", "noise", "silent", "이어폰", "earphones", "볼륨", "loud transit"],
    question: { ko: "대중교통에서 얼마나 조용히 해야 하나요?", en: "How quiet should I be on public transport?" },
    answer: {
      ko: "지하철과 버스는 대체로 조용한 편이라 큰 소리로 대화하면 눈에 띕니다. 음악은 이어폰으로 듣고, 일행과는 낮은 목소리로 이야기하세요. 특히 이른 아침과 늦은 밤에는 더 조용히 하는 것이 매너입니다.",
      en: "Subways and buses are generally quiet, so loud conversation stands out. Listen to music through earphones and speak with companions in a low voice. Being extra quiet in the early morning and late night is good manners.",
    },
    related: ["phone-transit", "priority-seat", "night-noise"],
  },
  {
    id: "taxi-door",
    keywords: ["택시 문", "taxi door", "door", "automatic", "자동문", "택시", "taxi", "back seat", "뒷좌석"],
    question: { ko: "택시 문은 자동으로 열리나요?", en: "Do taxi doors open automatically?" },
    answer: {
      ko: "아니요, 한국 택시는 승객이 직접 문을 열고 닫습니다(일본과 다릅니다). 혼자 탈 때는 조수석보다 뒷좌석에 앉는 것이 일반적입니다. 내릴 때는 뒤에서 오는 오토바이나 자전거를 확인하고 문을 여세요.",
      en: "No — in Korea you open and close the taxi door yourself (unlike Japan). Riding alone, sit in the back rather than the front seat. When getting out, check for oncoming scooters and bikes before opening the door.",
    },
    related: ["kakao-taxi", "tmoney", "escalator"],
  },
  {
    id: "kakao-taxi",
    keywords: ["카카오", "kakao", "kakao t", "call taxi", "app", "콜택시", "hail", "택시 앱", "rideshare"],
    question: { ko: "택시는 앱으로 부르는 게 나을까요?", en: "Should I call a taxi with an app?" },
    answer: {
      ko: "네, 카카오T 앱이 가장 편합니다. 목적지를 미리 입력하고 등록한 카드로 자동 결제돼 언어 장벽이 거의 없습니다. 심야 할증이 붙는 시간에도 예상 요금이 미리 표시돼 바가지 걱정이 없어요.",
      en: "Yes — the Kakao T app is the easiest option. You set the destination in advance and pay with a saved card, so the language barrier nearly disappears. Even during late-night surge hours it shows the estimated fare up front, so there's no overcharging worry.",
    },
    related: ["taxi-door", "tmoney", "cash-only"],
  },
  {
    id: "tmoney",
    keywords: ["티머니", "tmoney", "t-money", "transit card", "교통카드", "transport card", "충전", "top up"],
    question: { ko: "T-money 교통카드는 어떻게 쓰나요?", en: "How does the T-money transit card work?" },
    answer: {
      ko: "편의점에서 T-money 카드를 사서 현금으로 충전하면 지하철, 버스, 택시를 모두 탈 수 있습니다. 탈 때와 내릴 때 단말기에 태그하면 환승 할인이 자동 적용됩니다. 남은 잔액은 편의점에서 환불받을 수 있어요.",
      en: "Buy a T-money card at any convenience store and top it up with cash — it works on subway, bus, and taxi. Tag the reader when boarding and alighting, and transfer discounts apply automatically. Leftover balance can be refunded at convenience stores.",
    },
    related: ["kakao-taxi", "taxi-door", "escalator"],
  },
  {
    id: "recycling",
    keywords: ["분리수거", "recycling", "recycle", "재활용", "trash", "쓰레기", "sort", "waste", "분리배출"],
    question: { ko: "쓰레기 분리수거는 어떻게 하나요?", en: "How does recycling / trash sorting work?" },
    answer: {
      ko: "한국은 분리수거가 엄격합니다. 일반쓰레기, 플라스틱, 캔/유리, 종이, 비닐을 나눠서 버려야 하고 일반쓰레기는 지정된 '종량제 봉투'에 담아야 합니다. 아파트마다 배출 요일과 장소가 정해져 있으니 확인하세요.",
      en: "Korea sorts trash strictly. You separate general waste, plastics, cans/glass, paper, and vinyl, and general waste must go in an official '종량제' pay-as-you-throw bag. Each apartment complex has set days and spots for disposal, so check the rules.",
    },
    related: ["food-waste", "night-noise", "shoes-off"],
  },
  {
    id: "food-waste",
    keywords: ["음식물", "food waste", "food", "음식물쓰레기", "compost", "먹다 남은", "leftover", "food scrap"],
    question: { ko: "음식물 쓰레기는 따로 버려야 하나요?", en: "Do I separate food waste?" },
    answer: {
      ko: "네, 음식물 쓰레기는 일반 쓰레기와 반드시 분리합니다. 전용 음식물 봉투나 아파트의 음식물 수거함에 버리며, 뼈·씨앗·티백처럼 분해되지 않는 것은 일반쓰레기로 처리합니다. 물기를 최대한 빼서 버리는 것이 좋아요.",
      en: "Yes — food waste must be separated from general trash. Put it in a designated food-waste bag or your building's food-waste bin; non-decomposable bits like bones, pits, and tea bags go in general trash. Drain off as much liquid as you can first.",
    },
    related: ["recycling", "night-noise", "banchan"],
  },
  {
    id: "night-noise",
    keywords: ["층간소음", "noise", "night noise", "quiet hours", "소음", "neighbor", "밤", "loud at night", "apartment noise"],
    question: { ko: "밤에 소음을 조심해야 하나요?", en: "Do I need to watch noise at night?" },
    answer: {
      ko: "네, 특히 아파트는 층간소음에 매우 민감합니다. 밤늦게 세탁기·청소기를 돌리거나 쿵쿵 걷는 소리, 큰 음악은 이웃 분쟁의 흔한 원인입니다. 밤 10시 이후에는 조용히 하는 것이 기본 예의입니다.",
      en: "Yes — apartments are very sensitive to inter-floor noise. Running the washer or vacuum late, heavy footsteps, or loud music are common causes of neighbor disputes. Keeping quiet after about 10pm is basic courtesy.",
    },
    related: ["quiet-transit", "recycling", "shoes-off"],
  },
  {
    id: "tattoos",
    keywords: ["문신", "tattoo", "tattoos", "타투", "bathhouse tattoo", "cover tattoo", "ink"],
    question: { ko: "문신이 있으면 목욕탕에 못 가나요?", en: "Can I use a bathhouse if I have tattoos?" },
    answer: {
      ko: "대부분은 괜찮지만, 큰 문신은 일부 목욕탕에서 시선을 받거나 입장을 제한하기도 합니다. 입구 안내를 확인하고, 걱정되면 큰 방수 반창고로 가리면 무난합니다. 젊은 층 사이에서는 문신에 대한 인식이 많이 나아지고 있어요.",
      en: "Usually fine, but large tattoos can draw stares or, at some bathhouses, be turned away. Check the entrance notice, and cover them with a large waterproof bandage if you're worried. Attitudes toward tattoos are softening, especially among younger people.",
    },
    related: ["jjimjilbang", "bathhouse-basics", "shoes-off"],
  },
  {
    id: "bathhouse-basics",
    keywords: ["목욕탕", "bathhouse", "sauna", "wash first", "naked", "탈의", "샤워", "bath", "nude", "탕"],
    question: { ko: "목욕탕에서 지켜야 할 기본 예절은?", en: "What are the basics of a Korean bathhouse?" },
    answer: {
      ko: "목욕탕(대중탕)에서는 수영복 없이 완전히 탈의하고, 탕에 들어가기 전 반드시 샤워로 몸을 씻습니다. 남탕·여탕은 분리되어 있고, 수건으로 몸을 가리며 다니는 것은 자유입니다. 탕 안에서 때를 밀거나 비누칠을 하지 마세요.",
      en: "In the wet bathing area you're fully nude (no swimsuits), and you must shower and wash before entering a soaking tub. Men's and women's sections are separate, and covering with a towel as you walk is optional. Never scrub or soap up inside the tub itself.",
    },
    related: ["jjimjilbang", "tattoos", "seshin"],
  },
  {
    id: "jjimjilbang",
    keywords: ["찜질방", "jjimjilbang", "sleeping room", "수면실", "양머리", "sheep towel", "sauna clothes", "찜질복"],
    question: { ko: "찜질방은 어떻게 이용하나요?", en: "How does a jjimjilbang work?" },
    answer: {
      ko: "찜질방 공용 구역은 남녀 공용이라 시설에서 주는 반팔·반바지를 입습니다. 수면실에서는 조용히 하고 자리를 미리 맡아두지 마세요. 24시간 운영하는 곳이 많아 저렴한 숙박 대안이 되며, 사물함 열쇠(팔찌)로 매점 요금을 나갈 때 한 번에 정산합니다.",
      en: "The jjimjilbang common area is co-ed, so you wear the shorts and T-shirt the facility hands out. Keep quiet in the sleeping room and don't reserve spots in advance. Many are open 24 hours as a cheap place to crash, and your locker wristband tracks snack-bar charges to settle on the way out.",
    },
    related: ["bathhouse-basics", "seshin", "tattoos"],
  },
  {
    id: "seshin",
    keywords: ["세신", "seshin", "body scrub", "때밀이", "scrub", "exfoliate", "때"],
    question: { ko: "세신(때밀이)은 꼭 받아야 하나요?", en: "Do I have to get a seshin (body scrub)?" },
    answer: {
      ko: "아니요, 세신은 선택 사항입니다. 전문 세신사가 각질을 밀어주는 유료 서비스로, 원하면 카운터에서 미리 신청하세요. 처음이면 조금 아플 수 있지만 피부가 매끈해지는 독특한 경험입니다.",
      en: "No — a seshin is optional. It's a paid service where an attendant scrubs off dead skin; request it at the counter if you want it. It can sting a bit the first time, but it leaves your skin remarkably smooth.",
    },
    related: ["bathhouse-basics", "jjimjilbang", "tattoos"],
  },
  {
    id: "hiking-greeting",
    keywords: ["등산", "hiking", "hike", "trail greeting", "산", "mountain", "greeting hiking", "안녕하세요 산"],
    question: { ko: "등산할 때 모르는 사람과 인사하나요?", en: "Do hikers greet strangers on the trail?" },
    answer: {
      ko: "네, 한국인은 등산을 좋아하고 산에서는 모르는 사람과도 '안녕하세요'라고 인사를 주고받습니다. 특히 어르신이 인사하면 밝게 답례하세요. 좁은 등산로에서는 올라오는 사람에게 길을 양보하는 것이 관례입니다.",
      en: "Yes — Koreans love hiking, and on the trail even strangers exchange a friendly '안녕하세요.' Return the greeting warmly, especially from older hikers. On narrow paths, it's customary to yield to those climbing up.",
    },
    related: ["hiking-trash", "summit-makgeolli", "queueing"],
  },
  {
    id: "hiking-trash",
    keywords: ["쓰레기", "leave no trace", "pack out", "hiking trash", "산 쓰레기", "carry out", "되가져"],
    question: { ko: "등산 중 쓰레기는 어떻게 하나요?", en: "What do I do with trash while hiking?" },
    answer: {
      ko: "반드시 되가져오세요. 인기 있는 산에도 쓰레기통이 거의 없기 때문에 과일 껍질, 물병, 포장지까지 모두 배낭에 넣어 내려오는 것이 기본입니다. 자연을 깨끗이 지키는 것이 등산객의 기본 매너입니다.",
      en: "Pack it all out. Even popular mountains have almost no bins, so everything — fruit peels, bottles, wrappers — goes back in your pack and down with you. Leaving the mountain clean is basic hiker etiquette.",
    },
    related: ["hiking-greeting", "summit-makgeolli", "recycling"],
  },
  {
    id: "summit-makgeolli",
    keywords: ["막걸리", "makgeolli", "summit", "정상", "rice wine", "hiking drink", "산 술"],
    question: { ko: "정상에서 막걸리를 마시나요?", en: "Do people drink makgeolli at the summit?" },
    answer: {
      ko: "네, 정상에서 막걸리(전통 쌀 술)와 김밥·간식을 나눠 먹는 문화가 있습니다. 옆 사람이 권하면 가볍게 받아도 좋지만, 음주 후 하산은 미끄러워 위험하니 조금만 드세요. 다 먹은 뒤 쓰레기는 꼭 챙겨 내려오세요.",
      en: "Yes — there's a tradition of sharing makgeolli (rice wine) and snacks like gimbap at the top. Accept a small pour if offered, but drinking before the descent is risky on slippery paths, so keep it light. Carry all your trash back down afterward.",
    },
    related: ["hiking-greeting", "hiking-trash", "pouring-drinks"],
  },
  {
    id: "gift-giving",
    keywords: ["선물", "gift", "gift giving", "both hands", "두 손", "present", "housewarming", "집들이"],
    question: { ko: "선물은 어떻게 주고받나요?", en: "How do I give and receive gifts?" },
    answer: {
      ko: "선물은 두 손으로 건네고, 받은 사람은 그 자리에서 바로 열어보지 않는 것이 예의입니다. 나중에 혼자 열어보는 경우가 많아요. 집에 초대받으면 과일, 간식, 휴지·세제 세트 같은 작은 선물을 가져가세요. 숫자 4가 든 세트는 피합니다.",
      en: "Offer gifts with both hands, and as a receiver it's polite not to open them on the spot — people often open gifts later, alone. When invited to a home, bring a small gift like fruit, snacks, or a tissue/detergent set. Avoid sets of four.",
    },
    related: ["home-visit", "both-hands", "number-four"],
  },
  {
    id: "home-visit",
    keywords: ["집 초대", "home visit", "invited", "visit home", "집들이", "guest", "방문"],
    question: { ko: "한국인 집에 초대받으면 어떻게 하나요?", en: "What do I do when invited to a Korean home?" },
    answer: {
      ko: "현관에서 신발을 벗고, 작은 선물을 두 손으로 건네세요. 과일, 케이크, 음료 같은 것이 무난합니다. 집 안을 함부로 둘러보지 말고, 식사 대접을 받으면 '잘 먹겠습니다'라고 인사하며 맛있게 먹는 것이 예의입니다.",
      en: "Take your shoes off at the door and hand over a small gift with both hands — fruit, cake, or drinks work well. Don't wander around the home uninvited, and if you're fed, say '잘 먹겠습니다' before eating and enjoy the meal heartily.",
    },
    related: ["shoes-off", "gift-giving", "eating-order"],
  },
  {
    id: "age-hierarchy",
    keywords: ["존댓말", "honorific", "formal speech", "banmal", "반말", "age", "나이", "hierarchy", "respect language", "polite speech"],
    question: { ko: "존댓말과 반말은 어떻게 구분하나요?", en: "What are 존댓말 (formal) and 반말 (casual) speech?" },
    answer: {
      ko: "처음 만나는 사람과 나이·직급이 위인 사람에게는 항상 존댓말(높임말)을 씁니다. 친해진 뒤 상대가 반말을 제안하면 그때 편하게 바꾸면 됩니다. 확실치 않으면 존댓말을 쓰는 것이 항상 안전합니다.",
      en: "Use 존댓말 (polite speech) with strangers and anyone older or senior to you. Only switch to 반말 (casual speech) once you're close and the other person suggests it. When in doubt, formal speech is always the safe choice.",
    },
    related: ["age-question", "bowing", "eating-order"],
  },
  {
    id: "age-question",
    keywords: ["몇 살", "how old", "age question", "나이 물어", "ask age", "old are you"],
    question: { ko: "나이를 물어봐도 무례하지 않나요?", en: "Is it rude to ask someone's age?" },
    answer: {
      ko: "무례하지 않습니다. 한국은 나이에 따라 호칭과 말투가 달라져서 나이를 묻는 것이 관계 설정의 자연스러운 첫 단계예요. 개인정보를 캐묻는 것이 아니라 서로 어떻게 대할지 정하기 위한 질문입니다.",
      en: "It's not rude. Because age determines titles and speech level, asking is a natural first step in setting up a relationship. It's not prying — it's how people figure out how to address each other.",
    },
    related: ["age-hierarchy", "bowing", "marriage-question"],
  },
  {
    id: "marriage-question",
    keywords: ["결혼", "married", "marriage", "personal question", "결혼했어요", "relationship status"],
    question: { ko: "결혼 여부나 사적인 질문을 받으면?", en: "What if I'm asked about marriage or personal things?" },
    answer: {
      ko: "결혼, 나이, 연애 같은 질문은 무례가 아니라 관심의 표현입니다. 불편하면 가볍게 웃으며 화제를 돌려도 실례가 되지 않아요. 굳이 자세히 답할 의무는 없습니다.",
      en: "Questions about marriage, age, or dating are expressions of interest, not rudeness. If it feels too personal, just smile and steer the conversation elsewhere — that's not impolite. You're under no obligation to give details.",
    },
    related: ["age-question", "age-hierarchy", "pda"],
  },
  {
    id: "bowing",
    keywords: ["인사", "bow", "bowing", "greeting", "nod", "고개", "절", "how to greet"],
    question: { ko: "인사할 때 고개를 얼마나 숙이나요?", en: "How deeply do I bow when greeting?" },
    answer: {
      ko: "상황에 따라 다릅니다. 가벼운 인사는 15°, 일반적인 인사는 30°, 깊은 감사나 사죄는 45° 정도 숙입니다. 일상에서는 가벼운 목례만으로도 충분하며, 눈을 살짝 내리며 숙이면 더 정중해 보입니다.",
      en: "It depends on the situation: about 15° for a light acknowledgment, 30° for a standard greeting, and 45° for deep gratitude or an apology. In daily life a small nod is plenty, and lowering your gaze slightly reads as more respectful.",
    },
    related: ["business-cards", "both-hands", "age-hierarchy"],
  },
  {
    id: "business-cards",
    keywords: ["명함", "business card", "card", "two hands", "명함 예절", "exchange card"],
    question: { ko: "명함은 어떻게 주고받나요?", en: "How do I exchange business cards?" },
    answer: {
      ko: "명함은 두 손으로 건네고 두 손으로 받으세요. 받은 명함은 바로 넣지 말고 잠시 보며 이름과 직함을 확인하는 것이 예의입니다. 회의 중이라면 명함을 테이블 위에 올려두는 것도 좋습니다.",
      en: "Offer and receive business cards with both hands. Don't pocket a card right away — glance at the name and title first as a sign of respect. In a meeting, it's fine to lay the card on the table in front of you.",
    },
    related: ["both-hands", "bowing", "age-hierarchy"],
  },
  {
    id: "both-hands",
    keywords: ["두 손", "both hands", "two hands", "receive", "give", "hand over", "한 손"],
    question: { ko: "왜 물건을 두 손으로 주고받나요?", en: "Why give and receive things with both hands?" },
    answer: {
      ko: "두 손을 쓰는 것은 상대에 대한 존중의 표시입니다. 특히 어른이나 처음 만나는 사람에게 물건, 돈, 명함, 술잔을 건넬 때 두 손을 씁니다. 한 손이 바쁘면 다른 손으로 팔뚝을 받치기만 해도 됩니다.",
      en: "Using both hands signals respect. It especially matters when handing money, cards, gifts, or a drink to elders or someone you've just met. If one hand is occupied, simply supporting your forearm with the other hand is enough.",
    },
    related: ["business-cards", "pouring-drinks", "gift-giving"],
  },
  {
    id: "blowing-nose",
    keywords: ["코", "nose", "blow nose", "코 풀", "blowing nose", "runny nose", "table nose"],
    question: { ko: "식탁에서 코를 풀어도 되나요?", en: "Can I blow my nose at the table?" },
    answer: {
      ko: "식탁에서 큰 소리로 코를 푸는 것은 실례입니다. 시선이 집중되니 화장실에 다녀오거나 조용히 처리하세요. 반면 국물이나 면을 먹을 때 나는 소리에는 비교적 관대한 편입니다.",
      en: "Blowing your nose loudly at the table is impolite — it draws stares, so step to the restroom or handle it discreetly. Ironically, slurping soup or noodles is treated more leniently.",
    },
    related: ["chopsticks-rice", "chopsticks-spoon", "pda"],
  },
  {
    id: "pda",
    keywords: ["애정표현", "pda", "public affection", "kiss", "hug", "스킨십", "couple", "hold hands"],
    question: { ko: "공공장소에서 애정 표현을 해도 되나요?", en: "Is public displays of affection okay?" },
    answer: {
      ko: "손잡기나 가벼운 포옹 정도는 괜찮지만, 진한 스킨십이나 키스 같은 과한 애정 표현은 눈총을 받습니다. 커플룩이나 손잡고 다니는 문화는 흔하니 그 정도는 자연스럽습니다.",
      en: "Hand-holding and a light hug are fine, but heavy PDA like deep kissing draws disapproving looks. Matching couple outfits and walking hand in hand are common, so that level is perfectly natural.",
    },
    related: ["marriage-question", "night-noise", "smoking"],
  },
  {
    id: "smoking",
    keywords: ["흡연", "smoking", "smoke", "cigarette", "담배", "smoking zone", "흡연구역", "vape"],
    question: { ko: "담배는 아무 데서나 피워도 되나요?", en: "Can I smoke anywhere?" },
    answer: {
      ko: "아니요, 지정된 흡연구역에서만 피워야 합니다. 길거리, 버스정류장, 공원, 카페, 음식점 실내는 대부분 금연이고 적발되면 과태료가 부과됩니다. 흡연구역 표지판을 찾거나 건물 밖 지정 장소를 이용하세요.",
      en: "No — smoke only in designated smoking zones. Streets, bus stops, parks, cafés, and indoor restaurants are mostly non-smoking, and you can be fined if caught. Look for a smoking-zone sign or use the designated spot outside a building.",
    },
    related: ["pda", "night-noise", "queueing"],
  },
  {
    id: "queueing",
    keywords: ["줄", "queue", "queueing", "line", "wait in line", "줄서기", "cut in line", "새치기"],
    question: { ko: "줄 서기 문화는 어떤가요?", en: "What's the queueing culture like?" },
    answer: {
      ko: "한국은 줄 서기 문화가 잘 정착되어 있습니다. 지하철 승강장에는 탑승 위치가 바닥에 표시되어 있고, 버스·엘리베이터·계산대에서도 줄을 섭니다. 새치기는 큰 실례이니 꼭 뒤에 서세요.",
      en: "Queueing is well established in Korea. Subway platforms mark boarding positions on the floor, and people line up for buses, elevators, and checkout too. Cutting in line is a serious breach — always join the back.",
    },
    related: ["punctuality", "escalator", "priority-seat"],
  },
  {
    id: "punctuality",
    keywords: ["시간", "punctual", "punctuality", "late", "on time", "약속 시간", "지각", "time"],
    question: { ko: "약속 시간은 얼마나 지켜야 하나요?", en: "How strict is punctuality?" },
    answer: {
      ko: "시간 약속은 비교적 엄격하게 지키는 편입니다. 특히 업무나 공식적인 자리에서는 5~10분 일찍 도착하는 것이 좋습니다. 늦을 것 같으면 미리 연락(카카오톡 메시지)을 남기는 것이 예의입니다.",
      en: "Punctuality is taken fairly seriously, especially for work or formal occasions where arriving 5–10 minutes early is ideal. If you're going to be late, it's polite to message ahead (usually via KakaoTalk).",
    },
    related: ["queueing", "business-cards", "age-hierarchy"],
  },
  {
    id: "number-four",
    keywords: ["숫자 4", "number four", "number 4", "unlucky", "4층", "death number", "사"],
    question: { ko: "숫자 4가 불길한가요?", en: "Is the number 4 unlucky?" },
    answer: {
      ko: "네, 숫자 4는 한자 '死(죽을 사)'와 발음이 같아 불길하게 여깁니다. 그래서 일부 건물은 4층을 'F'로 표기하거나 건너뛰기도 합니다. 선물을 4개 묶음으로 주는 것은 피하는 것이 좋습니다.",
      en: "Yes — 4 sounds like the word for 'death,' so it's seen as unlucky. Some buildings label the 4th floor 'F' or skip it entirely. It's best to avoid giving gifts in sets of four.",
    },
    related: ["gift-giving", "red-ink", "shoes-off"],
  },
  {
    id: "red-ink",
    keywords: ["빨간", "red ink", "red pen", "name red", "빨간 펜", "이름 빨강", "death red"],
    question: { ko: "빨간색으로 이름을 쓰면 안 되나요?", en: "Should I avoid writing names in red?" },
    answer: {
      ko: "네, 사람 이름을 빨간색으로 쓰는 것은 죽음을 연상시켜 금기입니다. 전통적으로 고인의 이름을 빨간색으로 적었기 때문이에요. 서명이나 편지, 카드에는 검정이나 파란 펜을 사용하세요.",
      en: "Yes — writing a living person's name in red is taboo because it's associated with death; the names of the deceased were traditionally written in red. Use black or blue pen for signatures, letters, and cards.",
    },
    related: ["number-four", "gift-giving", "chopsticks-rice"],
  },
  {
    id: "cash-only",
    keywords: ["현금", "cash", "cash only", "현금만", "card", "카드", "payment", "결제"],
    question: { ko: "현금만 받는 곳이 많나요?", en: "Are many places cash-only?" },
    answer: {
      ko: "대부분은 카드 결제가 되지만, 재래시장, 노점, 작은 식당은 현금만 받는 경우가 있습니다. '현금만 되나요?'라고 물어보고, 시장에 갈 때는 소액 현금을 챙기세요. 카드가 되는 곳도 소액은 현금을 선호하기도 합니다.",
      en: "Most places take cards, but traditional markets, street stalls, and small eateries can be cash-only. Ask '현금만 되나요?' (Cash only?), and carry some small bills for market trips. Even card-friendly spots sometimes prefer cash for tiny amounts.",
    },
    related: ["tmoney", "splitting-bills", "tipping"],
  },
];

const FAQ_BY_ID: Record<string, EtiquetteFaq> = Object.fromEntries(
  ETIQUETTE_FAQS.map((f) => [f.id, f]),
);

export function getFaq(id: string): EtiquetteFaq | undefined {
  return FAQ_BY_ID[id];
}

// Four solid starter questions surfaced as opening suggestion chips.
export const SUGGESTED_FAQ_IDS: string[] = [
  "tipping",
  "shoes-off",
  "chopsticks-rice",
  "tmoney",
];

// Latin token = ASCII letters/digits; Korean token = anything else (matched as a
// substring). Splitting this way lets Korean keywords match inside a longer word
// while Latin keywords match on a rough word boundary.
function isLatin(token: string): boolean {
  return /^[a-z0-9]+$/.test(token);
}

function normalize(query: string): string {
  return query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ") // strip punctuation, keep letters/numbers
    .replace(/\s+/g, " ")
    .trim();
}

function scoreFaq(faq: EtiquetteFaq, normQuery: string, queryWords: Set<string>): number {
  let score = 0;
  for (const raw of faq.keywords) {
    const kw = raw.toLowerCase().trim();
    if (!kw) continue;
    if (isLatin(kw)) {
      // Word-boundary-ish: match a whole word, or a multi-word phrase as a substring.
      if (kw.includes(" ")) {
        if (normQuery.includes(kw)) score += 2;
      } else if (queryWords.has(kw)) {
        score += 2;
      }
    } else {
      // Korean (or mixed): substring match against the normalized query.
      if (normQuery.includes(kw)) score += 2;
    }
  }
  return score;
}

export function matchFaq(query: string): { best: EtiquetteFaq | null; alternates: EtiquetteFaq[] } {
  const normQuery = normalize(query);
  if (!normQuery) return { best: null, alternates: [] };
  const queryWords = new Set(normQuery.split(" ").filter(Boolean));

  const scored = ETIQUETTE_FAQS
    .map((faq) => ({ faq, score: scoreFaq(faq, normQuery, queryWords) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) return { best: null, alternates: [] };

  const best = scored[0].faq;
  const alternates = scored.slice(1, 4).map((s) => s.faq);
  return { best, alternates };
}
