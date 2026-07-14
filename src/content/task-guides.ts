// Foreigner Life Task Graph — module 400 data (step-by-step guides).
//
// One TaskGuide per task node (T1..T17 — see task-graph.ts for the two
// expansions beyond the patent's original 8: T1-T11 split three broad stages
// into their natural sub-activities, T12-T17 add the administrative and
// healthcare tasks — ARC, visa, banking, housing, insurance, hospital/pharmacy
// — that the original graph never covered at all). Every string is bilingual
// (Bi). Content is written to be genuinely useful for a newly arrived
// foreigner living around Seoul. No emojis (project rule).

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

  // ── T4 영화·공연 관람 / Movies & Shows ────────────────────────────────────
  T4: {
    taskId: "T4",
    what: {
      ko: "영화 예매 앱으로 표를 예매하고, 영어 자막 상영관을 찾아 영화·공연을 즐기는 과제예요. 자막 표기와 결제 방식만 익히면 매주 즐길 거리가 됩니다.",
      en: "Book movie tickets with a cinema app and find English-subtitle screenings so you can enjoy films and shows regularly. Once you know how subtitles and payment work, this becomes an easy weekly outing.",
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
        ko: "조조(아침)·심야 시간대는 요금이 30~50% 저렴해요. 평일 조조 상영을 노리면 비용을 아낄 수 있어요.",
        en: "Early-morning and late-night showtimes are 30-50% cheaper — weekday early screenings are an easy way to save.",
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
        ko: "인기 상영은 빠르게 매진돼요. 주말은 미리 예매하는 게 좋아요.",
        en: "Popular showings sell out fast — book weekends in advance.",
      },
    ],
  },

  // ── T5 전시·문화행사 참여 / Exhibitions & Cultural Events ─────────────────
  T5: {
    taskId: "T5",
    what: {
      ko: "미술관·박물관 전시와 콘서트·공연을 예매하고, 외국인 대상 문화 프로그램을 찾아 참여하는 과제예요. 영화관과는 결이 다른, 더 깊은 문화 체험을 계획할 수 있어요.",
      en: "Book exhibitions and performances, and find cultural programs aimed at foreigners. This covers a deeper kind of cultural experience than a night at the movies.",
    },
    steps: [
      {
        ko: "인터파크 티켓, 서울시 문화포털에서 전시·공연 정보를 검색해요.",
        en: "Search Interpark Ticket and the Seoul culture portal for exhibitions and performances.",
      },
      {
        ko: "'영어 도슨트', '외국인 대상' 같은 키워드로 필터링하면 언어 부담 없는 프로그램을 찾기 쉬워요.",
        en: "Filter with keywords like 'English docent' or 'for foreigners' to find programs with no language barrier.",
      },
      {
        ko: "온라인 예매가 가능한 전시는 미리 결제하고, 현장 구매만 되는 곳은 오픈 시간과 대기열을 확인해요.",
        en: "Pre-pay online where booking is available; for walk-in-only venues, check opening times and expected queues.",
      },
      {
        ko: "매월 마지막 수요일 '문화가 있는 날'에는 국공립 전시관 다수가 할인 또는 무료로 개방돼요.",
        en: "On 'Culture Day' (the last Wednesday of each month), many national and public venues offer discounted or free admission.",
      },
    ],
    prepare: [
      { ko: "결제 가능한 신용/체크카드", en: "A credit or debit card for payment" },
      { ko: "인터파크 티켓 계정", en: "An Interpark Ticket account" },
    ],
    cautions: [
      {
        ko: "인기 전시·공연은 예매 오픈과 동시에 매진되는 경우가 많아요. 예매 일정을 미리 알아두세요.",
        en: "Popular exhibitions and concerts can sell out the moment booking opens — check the on-sale date in advance.",
      },
      {
        ko: "일부 전시는 사진 촬영이 금지돼요. 입구 안내를 확인하세요.",
        en: "Some exhibitions ban photography — check the signage at the entrance.",
      },
      {
        ko: "'문화가 있는 날' 할인은 시설마다 조건이 달라요. 방문 전 해당 시설의 공지를 확인하세요.",
        en: "Culture Day discount terms vary by venue — check that venue's own notice before you go.",
      },
    ],
  },

  // ── T6 식당·대중교통 매너 / Dining & Transit Manners ──────────────────────
  T6: {
    taskId: "T6",
    what: {
      ko: "식당 예절과 지하철·버스 매너를 익히는 과제예요. 사소해 보여도 지역 사회에 자연스럽게 녹아드는 데 큰 도움이 되고, 앞으로 식당·대중교통을 이용할 때마다 계속 쓰이는 기본기예요.",
      en: "Learn Korean dining etiquette and subway/bus manners. These habits seem small but go a long way toward blending into daily life, and you'll use them every time you eat out or take transit.",
    },
    steps: [
      {
        ko: "식당에 앉으면 물·기본 반찬은 셀프인 곳이 많아요. 테이블 위 벨을 누르거나 '여기요'라고 불러 주문해요.",
        en: "After sitting down, water and basic side dishes are often self-serve at many restaurants. Order by pressing the table bell or calling out 'yeogiyo'.",
      },
      {
        ko: "웃어른이 먼저 수저를 든 뒤 식사를 시작하는 문화가 있어요. 팁은 주지 않는 것이 기본이에요.",
        en: "It's customary for the eldest at the table to start eating first. Tipping is not expected.",
      },
      {
        ko: "지하철·버스에서는 노약자석을 비워두고, 통화는 조용히, 큰 짐이나 유모차는 우측 통행을 지켜요.",
        en: "On the subway or bus, leave priority seats empty, keep phone calls quiet, and keep to the right with large bags or strollers.",
      },
      {
        ko: "택시나 카카오T 호출 시 정확한 출발지·목적지를 알려주고, 하차 시 카드로 결제하면 간단해요.",
        en: "When taking a taxi or calling one via Kakao T, give a clear pickup and destination, and pay by card when you get off.",
      },
    ],
    prepare: [
      { ko: "특별한 준비물은 없어요", en: "No special items needed" },
      { ko: "'여기요', '감사합니다' 같은 기본 한국어 인사", en: "A few basic Korean phrases like 'yeogiyo' and 'thank you'" },
    ],
    cautions: [
      {
        ko: "지하철에서 음식 섭취·큰 소리 통화는 눈총을 받아요. 조용히 이용하는 것이 기본 예절이에요.",
        en: "Eating or loud calls on the subway draws disapproval — staying quiet is basic etiquette.",
      },
      {
        ko: "일부 식당은 1인 방문이나 특정 시간대 주문에 제약이 있어요. 방문 전 리뷰에서 확인하면 헛걸음을 줄일 수 있어요.",
        en: "Some restaurants restrict solo diners or certain order times — checking reviews beforehand avoids a wasted trip.",
      },
    ],
  },

  // ── T7 분리수거·생활 쓰레기 / Recycling & Waste ───────────────────────────
  T7: {
    taskId: "T7",
    what: {
      ko: "분리수거 방법과 종량제 봉투 사용법을 익히는 과제예요. 규정을 모르고 배출하면 수거가 안 되거나 과태료를 받을 수 있어서, 도착 초기에 한 번 확실히 익혀두면 계속 편해져요.",
      en: "Learn how to sort recycling and use volume-rate trash bags. Getting this wrong can mean your trash isn't collected or you're fined, so it's worth learning properly once, early on.",
    },
    steps: [
      {
        ko: "일반쓰레기·음식물·재활용(플라스틱·캔·유리·종이)을 나누는 기준을 익혀요.",
        en: "Learn the categories: general waste, food waste, and recyclables (plastic, cans, glass, paper).",
      },
      {
        ko: "음식물 쓰레기는 전용 봉투나 카드로 배출해요. 동에 따라 방식이 다르니 건물 안내를 확인하세요.",
        en: "Food waste needs a designated bag or card to dispose of — the exact method varies by neighborhood, so check your building's signage.",
      },
      {
        ko: "종량제 봉투를 동네 편의점·마트에서 구매해요. 일반쓰레기는 반드시 지정 종량제 봉투에 담아야 해요.",
        en: "Buy volume-rate trash bags at a local convenience store or mart — general waste must go in the designated bag.",
      },
      {
        ko: "거주 건물의 분리수거 배출 요일·장소를 관리실이나 집주인에게 미리 물어봐요.",
        en: "Ask your building's management office or landlord about the recycling day and drop-off spot ahead of time.",
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
    ],
  },

  // ── T8 로컬 음식 체험 / Local Food ────────────────────────────────────────
  T8: {
    taskId: "T8",
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

  // ── T9 지역 탐색 / Neighborhood Exploration ───────────────────────────────
  T9: {
    taskId: "T9",
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

  // ── T10 모임·커뮤니티 참여 / Meetups & Communities ────────────────────────
  T10: {
    taskId: "T10",
    what: {
      ko: "취미·지역 기반 모임을 찾아 참여하며 사람들과 어울리는 과제예요. 러닝 크루, 등산, 보드게임처럼 진입장벽이 낮은 모임부터 시작하면 한국 생활에 훨씬 빨리 녹아들 수 있어요.",
      en: "Find and join hobby and neighborhood meetups. Starting with low-barrier groups like running crews, hiking, or board games helps you settle into Korean life much faster.",
    },
    steps: [
      {
        ko: "관심사에 맞는 모임을 찾아요. Meetup, 밴드(BAND), 소모임 앱, 페이스북 그룹에서 지역·취미별 모임을 검색해요.",
        en: "Find groups that match your interests — search Meetup, the BAND app, the Somoim app, and Facebook groups by area and hobby.",
      },
      {
        ko: "러닝 크루·등산·보드게임 모임처럼 진입장벽이 낮은 곳부터 첫 모임에 참석해요.",
        en: "Start with easy-to-enter groups like running crews, hiking, or board-game meetups for your first outing.",
      },
      {
        ko: "부담 없이 자기소개를 준비해 가요. 관심사나 국적 이야기가 자연스러운 대화 소재가 돼요.",
        en: "Prepare a short, casual self-introduction — your interests or where you're from make easy conversation starters.",
      },
      {
        ko: "카카오톡 오픈채팅으로 후속 연락을 이어가며 정기 모임에 꾸준히 참여해요.",
        en: "Keep in touch through KakaoTalk open chats and attend regular meetups consistently.",
      },
    ],
    prepare: [
      { ko: "카카오톡 계정 (모임 연락의 기본 수단)", en: "A KakaoTalk account (the standard way groups stay in touch)" },
      { ko: "관심사 기반 모임 앱 (Meetup·BAND·소모임 등)", en: "An interest-based meetup app (Meetup, BAND, Somoim, etc.)" },
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
    ],
  },

  // ── T11 언어교환 파트너 찾기 / Find a Language Exchange Partner ───────────
  T11: {
    taskId: "T11",
    what: {
      ko: "언어교환 앱과 모임을 통해 한국어를 배우고, 동시에 나의 언어를 나눌 파트너를 찾는 과제예요. 정기적인 파트너가 생기면 한국어 실력도, 친구도 함께 늘어나요.",
      en: "Use language-exchange apps and meetups to learn Korean while sharing your own language with a partner. A regular partner grows both your Korean and your circle of friends.",
    },
    steps: [
      {
        ko: "HelloTalk·Tandem 같은 언어교환 앱을 설치하고 프로필에 관심사와 목표 언어를 적어요.",
        en: "Install a language-exchange app like HelloTalk or Tandem and fill in your interests and target language in your profile.",
      },
      {
        ko: "동네 랭귀지 익스체인지 이벤트를 모임 앱이나 SNS에서 검색해 참여해요.",
        en: "Search meetup apps and social media for local language-exchange events and join one.",
      },
      {
        ko: "첫 대화 주제를 미리 준비해요. 서로의 취미나 문화 이야기로 시작하면 자연스러워요.",
        en: "Prepare a few conversation topics in advance — starting with hobbies or culture makes it flow naturally.",
      },
      {
        ko: "시간을 반씩 나눠 쓰기로 미리 합의해요. 한쪽 언어로만 계속 대화하기 쉬우니 명확히 정해두는 게 좋아요.",
        en: "Agree upfront to split the time evenly — conversations easily drift into one language, so setting this clearly helps.",
      },
    ],
    prepare: [
      { ko: "언어교환 앱 (HelloTalk·Tandem 등)", en: "A language-exchange app (HelloTalk, Tandem, etc.)" },
      { ko: "간단한 한국어 인사·자기소개", en: "A few Korean greetings and a short self-introduction" },
    ],
    cautions: [
      {
        ko: "일부 프로필은 언어교환을 가장한 상업 광고나 과외 유도예요. 대화 목적이 불분명하면 거리를 두세요.",
        en: "Some profiles use language exchange as a front for ads or paid tutoring pitches — keep your distance if the intent seems off.",
      },
      {
        ko: "온라인에서 몇 번 대화를 나눈 뒤 오프라인으로 만나는 순서가 안전해요. 첫 만남은 낮 시간, 공공장소를 권장해요.",
        en: "It's safer to chat online a few times before meeting in person — prefer a daytime, public-place first meeting.",
      },
    ],
  },

  // ── T12 외국인 등록증 발급 / Alien Registration Card ──────────────────────
  T12: {
    taskId: "T12",
    what: {
      ko: "90일 이상 체류하는 외국인이 입국 후 90일 이내에 관할 출입국·외국인청에서 외국인 등록증(ARC)을 신청하는 과제예요. ARC는 은행 계좌, 장기 통신 요금제, 건강보험 등 이후 모든 행정 절차의 기준이 되는 신분증입니다.",
      en: "Apply for your Alien Registration Card (ARC) at the immigration office within 90 days of arrival if you're staying long-term. The ARC becomes your key ID for almost everything that follows — bank accounts, long-term phone plans, and national health insurance.",
    },
    steps: [
      {
        ko: "하이코리아(HiKorea) 웹사이트에서 관할 출입국·외국인청을 확인하고 방문 예약을 잡아요. 많은 사무소가 사전예약이 필수예요.",
        en: "Check your jurisdiction's immigration office on the HiKorea website and book a visit — many offices require an appointment.",
      },
      {
        ko: "여권, 여권용 사진, 임대차계약서 등 거주지 증빙, 수수료(약 3만 원)를 준비해요.",
        en: "Prepare your passport, a passport photo, proof of address (like a lease), and the fee (about 30,000 won).",
      },
      {
        ko: "신청서를 작성하고 지문 등록과 사진 촬영을 진행해요.",
        en: "Fill out the application and complete fingerprinting and a photo at the office.",
      },
      {
        ko: "2~3주 후 등록증이 나오면 사무소 방문 또는 우편으로 수령해요.",
        en: "The card is usually ready in 2-3 weeks — pick it up at the office or have it mailed.",
      },
    ],
    prepare: [
      { ko: "여권과 여권용 사진", en: "Passport and a passport photo" },
      { ko: "거주지 증빙 (임대차계약서 등)", en: "Proof of address (a lease contract, etc.)" },
      { ko: "수수료 (현금 또는 카드, 약 3만 원)", en: "The fee (cash or card, about 30,000 won)" },
    ],
    cautions: [
      {
        ko: "입국 후 90일을 초과하면 과태료가 부과될 수 있어요. 여유를 두고 신청하세요.",
        en: "Overstaying the 90-day window before applying can bring a fine — apply with some buffer time.",
      },
      {
        ko: "방문 예약 없이 가면 대기시간이 매우 길거나 당일 처리가 불가능할 수 있어요.",
        en: "Showing up without a reservation can mean an extremely long wait or no service that day.",
      },
      {
        ko: "등록증 수령 전까지는 은행 계좌, 휴대폰 장기 요금제 등 일부 서비스 이용이 제한될 수 있어요.",
        en: "Until the card arrives, some services like bank accounts and long-term phone plans may stay restricted.",
      },
    ],
  },

  // ── T13 비자 상태 관리 / Visa Status Management ───────────────────────────
  T13: {
    taskId: "T13",
    what: {
      ko: "본인의 체류자격(비자 종류)과 만료일을 확인하고, 연장이나 자격 변경이 필요할 때 절차를 준비하는 과제예요. 체류기간을 넘기면 불이익이 크기 때문에 정기적으로 확인하는 습관이 중요해요.",
      en: "Check your visa status and expiry date, and prepare the paperwork if you need to extend or change it. Overstaying carries real consequences, so checking this regularly matters.",
    },
    steps: [
      {
        ko: "외국인 등록증 또는 여권의 비자 스티커에서 체류자격과 만료일을 확인해요.",
        en: "Check your visa status and expiry date on your Alien Registration Card or passport visa sticker.",
      },
      {
        ko: "하이코리아(HiKorea)에서 온라인으로 체류기간 연장 신청이 가능한지 확인해요.",
        en: "Check on HiKorea whether you can apply online for a stay-period extension.",
      },
      {
        ko: "자격 변경(예: 어학연수 → 취업)이 필요하면 필요 서류를 관할 출입국사무소에 문의해요.",
        en: "If you need a status change (e.g. language student to work visa), ask your immigration office what documents it requires.",
      },
      {
        ko: "만료일 최소 2~4주 전에 연장 신청을 마쳐요.",
        en: "Finish any extension application at least 2-4 weeks before your expiry date.",
      },
    ],
    prepare: [
      { ko: "외국인등록증과 여권", en: "Alien Registration Card and passport" },
      { ko: "체류자격별 필요 서류 (재직증명서, 재학증명서 등)", en: "Documents specific to your status (employment certificate, enrollment certificate, etc.)" },
    ],
    cautions: [
      {
        ko: "체류기간을 넘기면 범칙금이나 출국명령 등 불이익이 있을 수 있어요. 만료일을 캘린더에 미리 등록하세요.",
        en: "Overstaying can bring fines or a departure order — put your expiry date in your calendar well ahead of time.",
      },
      {
        ko: "자격에 따라 필요 서류가 크게 달라요. 방문 전 하이코리아 콜센터(1345)로 확인하는 게 안전해요.",
        en: "Required documents vary a lot by status — calling the HiKorea hotline (1345) before you go is the safe move.",
      },
      {
        ko: "대행업체(행정사)를 이용하면 비용이 들지만 복잡한 자격 변경 시 시간을 아낄 수 있어요.",
        en: "A licensed agent (haengjeongsa) costs money but can save time for a complex status change.",
      },
    ],
  },

  // ── T14 은행 계좌 개설 / Bank Account Setup ───────────────────────────────
  T14: {
    taskId: "T14",
    what: {
      ko: "국내 은행 계좌를 개설하고 체크카드를 발급받아, 월급 수령·공과금 자동이체·온라인 결제를 준비하는 과제예요. 대부분의 생활 서비스가 계좌 하나를 기준으로 돌아가기 때문에 초반에 해결해두면 이후가 훨씬 편해져요.",
      en: "Open a bank account and get a debit card so you can receive pay, set up auto-billing, and pay online. Almost every other service assumes you have one account, so getting this done early makes everything after it easier.",
    },
    steps: [
      {
        ko: "외국인 친화적인 은행(KB국민·신한·우리·하나 등) 지점을 찾거나 비대면 개설이 가능한지 앱에서 확인해요.",
        en: "Find a foreigner-friendly bank (KB Kookmin, Shinhan, Woori, Hana, etc.) or check whether its app supports remote account opening.",
      },
      {
        ko: "여권, 외국인등록증, 재직증명서(있는 경우)를 지참해 지점을 방문해요.",
        en: "Visit a branch with your passport, Alien Registration Card, and employment certificate if you have one.",
      },
      {
        ko: "계좌 개설 신청서를 작성하고 체크카드, 인터넷/모바일 뱅킹을 함께 신청해요.",
        en: "Fill out the account application and apply for a debit card and internet/mobile banking at the same time.",
      },
      {
        ko: "모바일 뱅킹 앱을 설치하고 공동인증서 또는 간편 인증을 등록해요.",
        en: "Install the mobile banking app and register a digital certificate or simple authentication.",
      },
    ],
    prepare: [
      { ko: "여권과 외국인등록증", en: "Passport and Alien Registration Card" },
      { ko: "한국 휴대폰 번호", en: "A Korean phone number" },
      { ko: "재직증명서 (선택)", en: "Employment certificate (optional)" },
    ],
    cautions: [
      {
        ko: "보이스피싱 방지로 신규 계좌는 이체한도가 낮게 설정돼요. 지점에서 한도 상향을 요청할 수 있어요.",
        en: "New accounts get a low transfer limit as a fraud-prevention measure — you can ask the branch to raise it.",
      },
      {
        ko: "일부 은행은 외국인등록증 없이는 계좌 개설이 제한적이에요 (한도계좌만 가능).",
        en: "Some banks limit account opening without an ARC to a restricted 'limited account' only.",
      },
      {
        ko: "인터넷뱅킹 앱은 한국 휴대폰 번호 인증이 필수인 경우가 많아요.",
        en: "Internet banking apps often require verification via a Korean phone number.",
      },
    ],
  },

  // ── T15 집 렌트·계약 / Housing Lease ───────────────────────────────────────
  T15: {
    taskId: "T15",
    what: {
      ko: "월세 또는 전세 매물을 찾고 계약서 내용을 확인한 뒤 서명하는 과제예요. 한국의 임대 방식은 큰 보증금 구조가 독특해서, 미리 알아두면 계약 사고를 피할 수 있어요.",
      en: "Find a monthly or key-money lease and review the contract before signing. Korea's large-deposit rental system is unusual internationally, so knowing the basics up front helps you avoid a bad contract.",
    },
    steps: [
      {
        ko: "직방, 다방, 네이버부동산 앱이나 동네 공인중개사를 통해 매물을 찾아요.",
        en: "Search listings on apps like Zigbang, Dabang, or Naver Real Estate, or work with a local licensed agent.",
      },
      {
        ko: "월세(보증금+매달 임대료)와 전세(큰 보증금, 임대료 없음) 방식의 차이를 이해하고 예산에 맞는 쪽을 선택해요.",
        en: "Understand the difference between wolse (deposit + monthly rent) and jeonse (large deposit, no monthly rent), and pick what fits your budget.",
      },
      {
        ko: "마음에 드는 매물은 직접 방문해 상태를 확인하고, 공인중개사를 통해 계약을 진행해요.",
        en: "Visit any place you like in person to check its condition, then go through a licensed agent to arrange the contract.",
      },
      {
        ko: "계약서의 보증금·계약기간·특약사항을 꼼꼼히 확인하고, 서명 전 등기부등본으로 집주인을 확인해요.",
        en: "Carefully check the deposit, contract term, and special clauses, and verify the landlord against the property registry before signing.",
      },
    ],
    prepare: [
      { ko: "여권 또는 외국인등록증", en: "Passport or Alien Registration Card" },
      { ko: "보증금과 중개수수료", en: "The deposit and agent's commission" },
      { ko: "소득 증빙 (필요시)", en: "Proof of income (if required)" },
    ],
    cautions: [
      {
        ko: "등기부등본을 확인하지 않고 계약하면 이중계약이나 근저당 문제에 노출될 수 있어요. 반드시 계약 전 확인하세요.",
        en: "Skipping the property registry check can expose you to double contracts or existing liens — always check before signing.",
      },
      {
        ko: "외국인은 전세보다 월세 계약이 더 일반적이고 진행이 수월해요.",
        en: "Wolse (monthly rent) contracts are more common and easier to arrange for foreigners than jeonse.",
      },
      {
        ko: "계약 해지·보증금 반환 조건을 특약사항에 명확히 적어두세요.",
        en: "Spell out the termination and deposit-return terms clearly in the contract's special clauses.",
      },
    ],
  },

  // ── T16 국민건강보험 가입 / National Health Insurance ─────────────────────
  T16: {
    taskId: "T16",
    what: {
      ko: "국민건강보험에 가입하거나 가입 여부를 확인하고, 매달 보험료를 납부하는 방법을 익히는 과제예요. 6개월 이상 체류하는 외국인은 대부분 지역가입자로 자동 가입돼요.",
      en: "Confirm or apply for National Health Insurance and learn how to pay the monthly premium. Foreigners staying 6+ months are usually auto-enrolled as regional subscribers.",
    },
    steps: [
      {
        ko: "국민건강보험공단(1577-1000) 또는 The K 앱에서 가입 여부와 가입자 유형(직장/지역)을 확인해요.",
        en: "Check your enrollment status and type (workplace or regional) via the National Health Insurance Service (1577-1000) or The K app.",
      },
      {
        ko: "직장가입자가 아니라면 체류지 관할 공단 지사에서 지역가입자로 신청해요 (자동 가입되는 경우도 많아요).",
        en: "If you're not covered through an employer, apply as a regional subscriber at your local NHIS branch — many people are enrolled automatically.",
      },
      {
        ko: "매달 고지되는 보험료를 계좌 자동이체나 카드로 납부하도록 설정해요.",
        en: "Set up automatic bank transfer or card payment for the monthly premium bill.",
      },
      {
        ko: "건강보험증(모바일 The K 앱으로도 확인 가능)을 병원 방문 시 제시할 수 있도록 준비해요.",
        en: "Keep your insurance card (or the The K app) ready to show when you visit a hospital or clinic.",
      },
    ],
    prepare: [
      { ko: "외국인등록증", en: "Alien Registration Card" },
      { ko: "국내 계좌 (자동이체용)", en: "A Korean bank account (for auto-payment)" },
    ],
    cautions: [
      {
        ko: "보험료를 미납하면 병원에서 건강보험 혜택을 받지 못하고, 체류기간 연장에도 불이익이 있을 수 있어요.",
        en: "Missing premium payments can cost you insurance coverage at hospitals and even affect visa extensions.",
      },
      {
        ko: "지역가입자 보험료는 소득·재산 추정 기준으로 산정돼 예상보다 높게 나올 수 있어요. 이의신청 제도를 활용할 수 있어요.",
        en: "Regional-subscriber premiums are estimated from income and assets and can come out higher than expected — there's an appeal process if that happens.",
      },
      {
        ko: "유학생은 별도 가입 시기·기준이 적용될 수 있으니 학교 국제처에 확인하세요.",
        en: "Students may have different enrollment timing and rules — check with your school's international office.",
      },
    ],
  },

  // ── T17 병원·약국 이용 / Hospital & Pharmacy ──────────────────────────────
  T17: {
    taskId: "T17",
    what: {
      ko: "약국에서 상비약을 사고, 동네 병원(의원)과 응급실을 상황에 맞게 이용하는 방법을 익히는 과제예요. 보험 가입 여부와 상관없이 알아두면 급할 때 큰 도움이 돼요.",
      en: "Learn how to buy over-the-counter medicine at a pharmacy, and when to use a local clinic versus the ER. Worth knowing regardless of insurance status — it matters most exactly when you're in a hurry.",
    },
    steps: [
      {
        ko: "가벼운 증상은 동네 약국에서 증상을 설명(번역 앱 활용 가능)하고 일반의약품을 구매해요.",
        en: "For minor symptoms, describe them at a local pharmacy (a translation app helps) and buy over-the-counter medicine.",
      },
      {
        ko: "감기·통증 등은 동네 의원(내과·이비인후과 등)을 예약 없이 방문해 진료받아요.",
        en: "For colds or pain, walk into a local clinic (internal medicine, ENT, etc.) — no appointment needed.",
      },
      {
        ko: "영어 진료가 가능한 병원은 '영어 진료 병원' 검색이나 1339(질병관리청) 안내를 통해 찾아요.",
        en: "Find English-speaking clinics by searching '영어 진료 병원' or calling the 1339 public health hotline.",
      },
      {
        ko: "응급 상황에는 119에 전화하거나 대형병원 응급실로 이동해요. 야간·주말에는 '달빛어린이병원' 등 야간진료 기관을 확인해요.",
        en: "In an emergency, call 119 or head to a major hospital's ER. For nights and weekends, check night-service clinics like 'Dalbit Children's Hospital'.",
      },
    ],
    prepare: [
      { ko: "건강보험증 (가입한 경우)", en: "Insurance card (if enrolled)" },
      { ko: "여권 또는 외국인등록증", en: "Passport or Alien Registration Card" },
      { ko: "번역 앱", en: "A translation app" },
    ],
    cautions: [
      {
        ko: "응급실은 진료비가 높고 대기시간이 길 수 있어요. 경증이면 다음 날 동네 병원을 이용하는 게 나아요.",
        en: "The ER is expensive and can involve a long wait — for minor issues, a local clinic the next day is usually better.",
      },
      {
        ko: "보험 미가입 상태에서는 진료비 전액을 본인이 부담해요. 큰 병원 방문 전 예상 비용을 문의하세요.",
        en: "Without insurance you pay the full cost — ask about the expected price before visiting a large hospital.",
      },
      {
        ko: "처방전이 필요한 약은 반드시 병원 처방 후 약국에서 받아야 해요. 처방전 없이 살 수 있는 약과 구분하세요.",
        en: "Prescription medicine requires a doctor's prescription before the pharmacy can give it to you — know which medicines need one and which don't.",
      },
    ],
  },
};
