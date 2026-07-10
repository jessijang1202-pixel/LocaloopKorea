// Foreigner Life Task Graph — module 400 data (step-by-step guides).
//
// One TaskGuide per task node (T1..T8). Every string is bilingual (Bi).
// Content is written to be genuinely useful for a newly arrived foreigner
// living around Seoul. No emojis (project rule).

import type { Bi } from "@/types/content";
import type { TaskId } from "@/lib/engine/types";

export interface TaskGuide {
  taskId: TaskId;
  what: Bi; // 설명: 무엇을 하는 과제인지
  steps: Bi[]; // 절차: 단계별 행동 (3~6 steps)
  prepare: Bi[]; // 준비물
  cautions: Bi[]; // 유의사항 / 자주 하는 실수
}

export const TASK_GUIDES: Record<TaskId, TaskGuide> = {
  // ── T1 교통 준비 / Transport Setup ────────────────────────────────────────
  T1: {
    taskId: "T1",
    what: {
      ko: "티머니(T-money) 교통카드를 발급받아 충전하고, 버스·지하철을 자유롭게 이용할 수 있도록 준비하는 과제예요. 충전식 카드 한 장이면 전국 대부분의 대중교통과 편의점 결제까지 해결됩니다.",
      en: "Get and top up a T-money transit card so you can ride buses and the subway freely. One rechargeable card covers almost all public transit nationwide and even works at convenience stores.",
    },
    steps: [
      {
        ko: "편의점(CU·GS25·세븐일레븐)이나 지하철역 자판기에서 티머니 카드를 구매해요. 카드 값은 보통 2,500~4,000원이에요.",
        en: "Buy a T-money card at a convenience store (CU, GS25, 7-Eleven) or a subway station machine. The blank card usually costs 2,500-4,000 won.",
      },
      {
        ko: "카드에 현금을 충전해요. 편의점 계산대에서 '충전해 주세요'라고 하거나, 역의 충전 기계를 이용하면 됩니다. 처음엔 1~2만 원 정도가 적당해요.",
        en: "Load cash onto the card. Ask the convenience store cashier to top it up, or use a station recharge machine. 10,000-20,000 won is a good starting amount.",
      },
      {
        ko: "버스·지하철 탑승 시 카드를 단말기에 태그하고, 내릴 때 반드시 하차 태그도 해요.",
        en: "Tap the card on the reader when you board a bus or subway, and always tap again when you get off.",
      },
      {
        ko: "잔액이 부족하면 언제든 편의점이나 역에서 다시 충전할 수 있어요.",
        en: "Recharge again at any convenience store or station whenever the balance runs low.",
      },
    ],
    prepare: [
      { ko: "현금 (카드 구매·충전은 대부분 현금만 가능)", en: "Cash (buying and topping up usually accept cash only)" },
      { ko: "여권 또는 신분증은 필요 없어요 (익명 카드)", en: "No passport or ID needed (the card is anonymous)" },
    ],
    cautions: [
      {
        ko: "1회용 교통카드와 충전식 티머니는 달라요. 1회용은 매번 사고 보증금을 돌려받아야 해서 번거로워요. 여행·거주 모두 충전식이 편합니다.",
        en: "Single-use tickets differ from a rechargeable T-money card. Single-use tickets must be bought each time and require a deposit refund, so a rechargeable card is far more convenient.",
      },
      {
        ko: "하차 태그를 놓치면 환승 할인이 사라지고 다음 탑승 시 기본요금이 추가로 부과될 수 있어요.",
        en: "Forgetting to tap off can void your transfer discount and add a penalty base fare on your next ride.",
      },
      {
        ko: "충전은 현금만 되는 곳이 많으니 소액 현금을 미리 준비하세요.",
        en: "Many recharge points take cash only, so keep some small cash on hand.",
      },
    ],
  },

  // ── T2 통신 준비 / Connectivity Setup ─────────────────────────────────────
  T2: {
    taskId: "T2",
    what: {
      ko: "유심(USIM)을 개통해 데이터와 전화를 사용하고, Wi-Fi를 설정해 안정적으로 연결되도록 준비하는 과제예요. 지도·메신저·결제 앱 대부분이 인터넷을 필요로 하므로 도착 직후 우선순위가 높아요.",
      en: "Activate a SIM for data and calls, and set up Wi-Fi so you stay reliably connected. Maps, messaging, and payment apps all need the internet, so this is a top priority right after arrival.",
    },
    steps: [
      {
        ko: "체류 기간을 정해요. 30일 이하 단기라면 선불(prepaid) 유심, 장기라면 월 요금제나 알뜰폰(MVNO)이 유리해요.",
        en: "Decide your stay length. For 30 days or less a prepaid SIM is easiest; for longer stays a monthly plan or MVNO carrier is cheaper.",
      },
      {
        ko: "공항 1층 통신사 부스(SK텔레콤·KT·LG U+)나 편의점, 또는 온라인에서 유심을 구매해요.",
        en: "Buy a SIM at an airport carrier booth (SK Telecom, KT, LG U+), a convenience store, or online.",
      },
      {
        ko: "여권을 제시하고 개통을 요청해요. 직원이 유심을 넣고 데이터가 잡히는지 확인해 줘요.",
        en: "Show your passport and ask to activate. Staff will insert the SIM and confirm data is working.",
      },
      {
        ko: "휴대폰 설정에서 데이터 로밍·APN이 정상인지 확인하고, 집·카페의 Wi-Fi도 등록해 두세요.",
        en: "Check that mobile data and APN settings work in your phone, and save Wi-Fi networks at home and cafés.",
      },
    ],
    prepare: [
      { ko: "여권 (개통 시 본인 확인에 필요)", en: "Passport (required for activation identity check)" },
      { ko: "유심 사용 가능한(언락된) 휴대폰", en: "An unlocked phone that accepts a SIM" },
      { ko: "결제 수단 (카드 또는 현금)", en: "A payment method (card or cash)" },
    ],
    cautions: [
      {
        ko: "장기 요금제나 알뜰폰은 보통 외국인 등록증이 필요할 수 있어요. 도착 직후엔 여권만으로 되는 선불 유심으로 시작하는 게 편해요.",
        en: "Long-term or MVNO plans may require an Alien Registration Card. Right after arrival it is simplest to start with a prepaid SIM that only needs a passport.",
      },
      {
        ko: "eSIM 지원 여부를 미리 확인하세요. 지원되면 물리 유심 교체 없이 개통할 수 있어요.",
        en: "Check whether your phone supports eSIM — if so, you can activate without swapping a physical SIM.",
      },
      {
        ko: "공항 부스는 편하지만 요금이 다소 비싼 편이에요. 시간이 있다면 시내 대리점이 더 저렴할 수 있어요.",
        en: "Airport booths are convenient but a bit pricier; a city shop can be cheaper if you have time.",
      },
    ],
  },

  // ── T3 공공시설 이용 / Public Facilities ──────────────────────────────────
  T3: {
    taskId: "T3",
    what: {
      ko: "도서관, PC방, 구민체육센터 같은 공공·생활 시설에 회원가입하고 이용하는 과제예요. 무료이거나 저렴하게 공부·업무·운동 공간을 확보할 수 있어요.",
      en: "Sign up for and use public facilities like libraries, PC rooms, and district sports centers. They give you free or cheap places to study, work, and exercise.",
    },
    steps: [
      {
        ko: "가까운 구립·시립 도서관을 네이버 지도나 카카오맵에서 검색해요.",
        en: "Search for a nearby district or city library on Naver Map or Kakao Map.",
      },
      {
        ko: "도서관 방문 시 여권이나 외국인 등록증을 지참해 회원가입해요. 대부분 무료이고 열람실·Wi-Fi를 쓸 수 있어요.",
        en: "Visit with your passport or Alien Registration Card to register. Membership is usually free and includes reading rooms and Wi-Fi.",
      },
      {
        ko: "PC방은 회원가입 없이도 이용 가능해요. 자리 번호를 받고 선불 충전 후 이용하면 됩니다.",
        en: "PC rooms need no membership — get a seat number, prepay or charge credit, and start using it.",
      },
      {
        ko: "구민체육센터·수영장은 주민센터나 시설 홈페이지에서 등록해요. 외국인도 등록증이 있으면 지역 주민 요금이 적용되는 곳이 많아요.",
        en: "Register for a district gym or pool at the community center or facility website. With a registration card, foreigners often get resident rates.",
      },
    ],
    prepare: [
      { ko: "여권 또는 외국인 등록증", en: "Passport or Alien Registration Card" },
      { ko: "도서관 회원증 발급용 소액 (일부 시설)", en: "Small change for a library card fee (some facilities)" },
    ],
    cautions: [
      {
        ko: "일부 도서관 열람실은 좌석을 앱이나 키오스크로 미리 예약해야 해요. 현장 발권 방식과 다를 수 있어요.",
        en: "Some library reading rooms require booking a seat via an app or kiosk in advance rather than walk-in.",
      },
      {
        ko: "PC방은 흡연/비흡연 구역이 나뉘어 있어요. 입장 시 확인하세요.",
        en: "PC rooms are split into smoking and non-smoking zones — check when you enter.",
      },
      {
        ko: "공공 체육시설은 강습이 조기 마감되는 경우가 많으니 등록 시기를 미리 확인하세요.",
        en: "Public sports classes fill up early, so check registration timing ahead.",
      },
    ],
  },

  // ── T4 문화생활 접근 / Cultural Life ──────────────────────────────────────
  T4: {
    taskId: "T4",
    what: {
      ko: "영화 예매 앱으로 표를 예매하고, 영어 자막 상영관이나 외국인 대상 문화 공연 정보를 확인해 문화생활을 즐기는 과제예요.",
      en: "Book tickets with a movie app and find English-subtitle screenings or foreigner-friendly cultural events so you can enjoy cultural life here.",
    },
    steps: [
      {
        ko: "CGV, 롯데시네마, 메가박스 앱을 설치해요. 세 곳 모두 영어 인터페이스를 지원해요.",
        en: "Install the CGV, Lotte Cinema, or Megabox app — all three offer an English interface.",
      },
      {
        ko: "영화를 고를 때 자막 표기를 확인해요. 외화는 보통 한글 자막이지만, 한국 영화의 영어 자막 상영은 별도 표기(예: 'ENG SUB')를 찾아야 해요.",
        en: "Check the subtitle label when picking a film. Foreign films usually have Korean subtitles, but for Korean films look for an English-subtitle marker such as 'ENG SUB'.",
      },
      {
        ko: "좌석을 선택하고 앱에서 카드로 결제한 뒤, 상영관 입구 키오스크에서 티켓을 발권하거나 QR로 입장해요.",
        en: "Pick a seat, pay by card in the app, then print the ticket at a lobby kiosk or enter with the QR code.",
      },
      {
        ko: "공연·전시는 인터파크 티켓, 서울시 문화포털에서 외국인 대상 프로그램을 검색해요.",
        en: "For concerts and exhibitions, search Interpark Ticket and the Seoul culture portal for programs aimed at foreigners.",
      },
    ],
    prepare: [
      { ko: "결제 가능한 신용/체크카드", en: "A credit or debit card for payment" },
      { ko: "영화 예매 앱 (CGV·롯데시네마·메가박스)", en: "A cinema app (CGV, Lotte Cinema, or Megabox)" },
    ],
    cautions: [
      {
        ko: "한국 영화의 영어 자막 상영은 회차가 제한적이에요. 상영 정보에서 자막 언어를 꼭 확인하고 예매하세요.",
        en: "English-subtitle screenings of Korean films are limited to certain showtimes — confirm the subtitle language before booking.",
      },
      {
        ko: "일부 앱 결제는 한국 발급 카드만 되는 경우가 있어요. 해외 카드가 막히면 현장 키오스크에서 결제해 보세요.",
        en: "Some in-app payments accept only Korea-issued cards; if a foreign card is declined, try paying at the on-site kiosk.",
      },
      {
        ko: "인기 상영·공연은 빠르게 매진돼요. 주말은 미리 예매하는 게 좋아요.",
        en: "Popular showings and performances sell out fast — book weekends in advance.",
      },
    ],
  },

  // ── T5 생활 예절 이해 / Everyday Etiquette ────────────────────────────────
  T5: {
    taskId: "T5",
    what: {
      ko: "식당·지하철 매너와 분리수거 등 한국의 일상 예절을 익히는 과제예요. 사소해 보여도 지역 사회에 자연스럽게 녹아드는 데 큰 도움이 돼요.",
      en: "Learn everyday Korean etiquette — dining and subway manners, sorting recycling, and more. Small habits go a long way toward blending into the local community.",
    },
    steps: [
      {
        ko: "식당 예절을 익혀요. 물·반찬은 보통 셀프이고, 웃어른이 먼저 수저를 든 뒤 식사를 시작하는 문화가 있어요. 팁은 주지 않아요.",
        en: "Learn dining manners: water and side dishes are usually self-serve, elders often start eating first, and tipping is not expected.",
      },
      {
        ko: "지하철·버스 매너를 지켜요. 노약자석은 비워두고, 통화는 조용히, 리어카·유모차는 우측 통행을 지켜요.",
        en: "Follow transit manners: leave priority seats empty, keep phone calls quiet, and keep to the right in stations.",
      },
      {
        ko: "분리수거를 익혀요. 일반쓰레기·음식물·재활용(플라스틱·캔·유리·종이)을 나누고, 음식물은 전용 봉투나 카드로 배출해요.",
        en: "Learn recycling: separate general waste, food waste, and recyclables (plastic, cans, glass, paper); food waste needs a designated bag or card.",
      },
      {
        ko: "종량제 봉투를 동네 편의점·마트에서 구매해요. 일반쓰레기는 반드시 지정 종량제 봉투에 담아야 해요.",
        en: "Buy volume-rate trash bags at a local convenience store or mart — general waste must go in the designated bag.",
      },
    ],
    prepare: [
      { ko: "종량제 봉투 (거주 지역 지정 봉투)", en: "Volume-rate trash bags (specific to your district)" },
      { ko: "분리수거 배출 요일·장소 확인 (건물 관리실 문의)", en: "Your building's recycling day and spot (ask the management office)" },
    ],
    cautions: [
      {
        ko: "종량제 봉투는 지역(구)마다 지정 봉투가 달라요. 다른 구 봉투는 수거되지 않을 수 있어요.",
        en: "Trash bags are district-specific — bags from another district may not be collected.",
      },
      {
        ko: "음식물 쓰레기에 비닐·뼈·씨앗류를 섞으면 안 돼요. 배출 규정을 어기면 과태료가 있을 수 있어요.",
        en: "Do not mix plastic, bones, or large seeds into food waste; violating the rules can bring a fine.",
      },
      {
        ko: "지하철에서 음식 섭취·큰 소리 통화는 눈총을 받아요. 조용히 이용하는 것이 기본 예절이에요.",
        en: "Eating or loud calls on the subway draws disapproval — staying quiet is basic etiquette.",
      },
    ],
  },

  // ── T6 로컬 음식 체험 / Local Food ────────────────────────────────────────
  T6: {
    taskId: "T6",
    what: {
      ko: "로컬 음식점을 찾아가 주문 방식을 익히고, 현지인처럼 식사를 즐기는 과제예요. 키오스크 주문, 반찬 문화, 배달 앱까지 익혀 두면 식생활이 훨씬 편해져요.",
      en: "Find local eateries, learn how to order, and eat like a local. Getting comfortable with kiosk ordering, side-dish culture, and delivery apps makes daily meals much easier.",
    },
    steps: [
      {
        ko: "네이버 지도·카카오맵에서 평점과 리뷰가 많은 동네 식당을 찾아요. 사진 메뉴가 있는 곳이 처음엔 편해요.",
        en: "Use Naver Map or Kakao Map to find well-reviewed neighborhood restaurants; places with photo menus are easiest at first.",
      },
      {
        ko: "매장에서는 자리에 앉은 뒤 벨을 누르거나 '여기요'라고 불러 주문해요. 키오스크가 있으면 화면에서 언어를 영어로 바꿀 수 있는 경우가 많아요.",
        en: "Inside, sit down and order by pressing the call bell or saying 'yeogiyo'. If there is a kiosk, you can often switch the screen language to English.",
      },
      {
        ko: "반찬과 물은 대부분 무료 리필이에요. 필요하면 더 요청해도 괜찮아요.",
        en: "Side dishes and water are usually free refills — it is fine to ask for more.",
      },
      {
        ko: "배달을 원하면 배달의민족·쿠팡이츠 앱을 설치해요. 주소를 등록하고 카드로 결제하면 됩니다.",
        en: "For delivery, install the Baemin or Coupang Eats app, register your address, and pay by card.",
      },
    ],
    prepare: [
      { ko: "결제 수단 (카드 또는 현금, 소규모 식당은 현금 선호)", en: "A payment method (card or cash; small eateries may prefer cash)" },
      { ko: "간단한 주문 표현 몇 가지 ('이거 주세요', '맵지 않게')", en: "A few basic ordering phrases ('this one please', 'not spicy')" },
    ],
    cautions: [
      {
        ko: "일부 로컬 식당은 현금만 받거나 최소 주문 인원이 있어요. 1인 방문 가능 여부를 리뷰에서 확인하세요.",
        en: "Some local spots are cash-only or have a minimum party size — check reviews for solo-dining friendliness.",
      },
      {
        ko: "매운 정도가 예상보다 강할 수 있어요. 주문 시 '안 맵게' 요청이 가능한지 물어보세요.",
        en: "Spice levels can be stronger than expected — ask whether a milder version is possible when ordering.",
      },
      {
        ko: "배달 앱은 최소 주문 금액과 배달비가 있어요. 결제 전 총액을 확인하세요.",
        en: "Delivery apps have minimum order amounts and delivery fees — check the total before paying.",
      },
    ],
  },

  // ── T7 지역 탐색 / Neighborhood Exploration ───────────────────────────────
  T7: {
    taskId: "T7",
    what: {
      ko: "내가 사는 동네와 주변 지역의 명소·숨은 장소를 직접 탐색하는 과제예요. 산책 코스, 카페, 시장, 전망 좋은 장소를 알아 두면 일상이 훨씬 풍요로워져요.",
      en: "Explore the highlights and hidden spots of your neighborhood and nearby areas. Knowing walking routes, cafés, markets, and viewpoints makes daily life much richer.",
    },
    steps: [
      {
        ko: "네이버 지도·카카오맵에서 '가볼 만한 곳'이나 지역 이름 + 명소를 검색해 후보 목록을 만들어요.",
        en: "Search Naver Map or Kakao Map for places worth visiting or your area name plus 'attractions' to build a shortlist.",
      },
      {
        ko: "도보나 대중교통으로 접근 가능한 코스를 하나 정해 반나절 산책을 계획해요.",
        en: "Pick one route reachable on foot or by transit and plan a half-day walk.",
      },
      {
        ko: "동네 재래시장, 골목 카페, 공원, 전망대 등 지역색이 있는 장소를 직접 둘러봐요.",
        en: "Visit places with local character in person — traditional markets, alley cafés, parks, and viewpoints.",
      },
      {
        ko: "마음에 든 장소는 지도 앱에 즐겨찾기로 저장해 나만의 동네 지도를 만들어요.",
        en: "Save the spots you like as favorites in the map app to build your own neighborhood map.",
      },
    ],
    prepare: [
      { ko: "충전된 교통카드 (T1 완료)", en: "A topped-up transit card (complete T1 first)" },
      { ko: "지도 앱과 데이터 연결 (T2 완료)", en: "A map app with a working data connection (complete T2 first)" },
      { ko: "편한 신발과 보조배터리", en: "Comfortable shoes and a power bank" },
    ],
    cautions: [
      {
        ko: "구글맵은 한국에서 도보·대중교통 경로가 부정확할 수 있어요. 네이버 지도·카카오맵을 사용하세요.",
        en: "Google Maps can be inaccurate for walking and transit in Korea — use Naver Map or Kakao Map instead.",
      },
      {
        ko: "재래시장·소규모 상점은 현금만 받는 곳이 있어요. 약간의 현금을 챙기세요.",
        en: "Traditional markets and small shops may be cash-only — carry some cash.",
      },
      {
        ko: "인기 명소는 주말·저녁에 매우 붐벼요. 여유롭게 탐색하려면 평일 낮이 좋아요.",
        en: "Popular spots get very crowded on weekends and evenings — weekday daytime is calmer for exploring.",
      },
    ],
  },

  // ── T8 사회적 연결 / Social Connection ────────────────────────────────────
  T8: {
    taskId: "T8",
    what: {
      ko: "지역 모임에 참여하고 한국인 친구를 만들며 사회적 관계를 넓히는 과제예요. 언어 교환, 취미 모임, 동네 커뮤니티를 통해 한국 생활에 깊이 뿌리내릴 수 있어요.",
      en: "Broaden your social ties by joining local meetups and making Korean friends. Language exchanges, hobby groups, and neighborhood communities help you put down real roots.",
    },
    steps: [
      {
        ko: "관심사에 맞는 모임을 찾아요. Meetup, 밴드(BAND), 소모임 앱, 페이스북 그룹에서 지역·취미별 모임을 검색해요.",
        en: "Find groups that match your interests — search Meetup, the BAND app, the Somoim app, and Facebook groups by area and hobby.",
      },
      {
        ko: "언어 교환을 원하면 HelloTalk·Tandem 앱이나 동네 랭귀지 익스체인지 이벤트에 참여해요.",
        en: "For language exchange, use the HelloTalk or Tandem app, or join a local language-exchange event.",
      },
      {
        ko: "첫 모임에는 부담 없이 참석해 자기소개를 준비해 가요. 러닝 크루·등산·보드게임 모임은 진입장벽이 낮아요.",
        en: "Show up to a first meetup casually with a short self-introduction ready; running crews, hiking, and board-game groups are easy to enter.",
      },
      {
        ko: "카카오톡 오픈채팅으로 후속 연락을 이어가며 정기 모임에 꾸준히 참여해요.",
        en: "Keep in touch through KakaoTalk open chats and attend regular meetups consistently.",
      },
    ],
    prepare: [
      { ko: "카카오톡 계정 (모임 연락의 기본 수단)", en: "A KakaoTalk account (the standard way groups stay in touch)" },
      { ko: "관심사 기반 모임 앱 (Meetup·BAND·소모임 등)", en: "An interest-based meetup app (Meetup, BAND, Somoim, etc.)" },
      { ko: "간단한 한국어 인사·자기소개", en: "A few Korean greetings and a short self-introduction" },
    ],
    cautions: [
      {
        ko: "일부 오픈채팅·모임은 상업 광고나 스팸이 섞여 있어요. 정기적으로 운영되는 신뢰할 만한 모임을 선택하세요.",
        en: "Some open chats and groups mix in ads or spam — choose established, regularly run groups.",
      },
      {
        ko: "첫 만남은 낮 시간, 사람이 많은 공공장소를 권장해요. 안전을 우선하세요.",
        en: "Prefer daytime meetups in busy public places for first meetings — put safety first.",
      },
      {
        ko: "언어 교환은 한쪽 언어만 계속 쓰기 쉬워요. 시간을 반씩 나눠 쓰기로 미리 합의하면 좋아요.",
        en: "Language exchanges tend to drift into one language — agree upfront to split the time evenly.",
      },
    ],
  },
};
