"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/lib/lang";
import { useState } from "react";

type Task = {
  id: string;
  icon: string;
  ko: { name: string; desc: string; tip: string };
  en: { name: string; desc: string; tip: string };
  urgent?: boolean;
  deadline?: string;
  link?: string;
};

type Tip = { ko: string; en: string };

type StageDetail = {
  slug: string;
  stageNum: number;
  color: string;
  ko: { name: string; tagline: string };
  en: { name: string; tagline: string };
  tasks: Task[];
  tips: Tip[];
  links: { href: string; ko: string; en: string; icon: string }[];
};

const STAGES: Record<string, StageDetail> = {
  "arrival": {
    slug: "arrival", stageNum: 1,
    color: "#FF5636",
    ko: { name: "도착", tagline: "한국 첫날, 꼭 해야 할 일들" },
    en: { name: "Arrival", tagline: "Day one in Korea — get these done first" },
    tasks: [
      {
        id: "a1", icon: "🚌",
        ko: { name: "교통카드 구매", desc: "T-money 카드 · 공항, 편의점, 지하철 역 구매 가능", tip: "공항 1층 CU 편의점에서 바로 구매 가능. 1회용 교통카드보다 훨씬 편리해요." },
        en: { name: "Get a transit card", desc: "T-money card · Airport, convenience stores, subway stations", tip: "Pick one up at the CU convenience store on Level 1 of the airport. Far better than single-use tickets." },
      },
      {
        id: "a2", icon: "📱",
        ko: { name: "선불 유심 구매", desc: "공항 1층 통신사 부스 또는 편의점 이용", tip: "SK텔레콤, KT, LG U+ 공항 부스 이용. 30일권 기준 약 3~5만 원. 데이터 무제한이 편해요." },
        en: { name: "Buy a prepaid SIM", desc: "Carrier booths at airport arrivals or any convenience store", tip: "SK Telecom, KT, and LG U+ all have booths at arrivals. Around ₩30–50K for 30 days of unlimited data." },
      },
      {
        id: "a3", icon: "💵",
        ko: { name: "환전 / ATM 이용", desc: "공항 환전 창구 또는 시내 외환은행 이용 권장", tip: "공항 환율은 조금 불리해요. 급하지 않으면 시내 명동 환전소를 이용하면 더 좋아요. 외국 카드 ATM은 우리은행·신한은행이 잘 됩니다." },
        en: { name: "Get Korean won", desc: "Airport exchange booths or Woori / Shinhan ATMs", tip: "Airport rates are slightly worse. Myeongdong money changers in the city offer better rates. Woori & Shinhan ATMs work best with foreign cards." },
      },
      {
        id: "a4", icon: "🏨",
        ko: { name: "숙소 체크인", desc: "예약 확인서·여권 지참 필수", tip: "체크인 전 짐 보관 서비스를 이용하면 편해요. 호텔 대부분 무료로 보관해줍니다." },
        en: { name: "Check into accommodation", desc: "Bring your booking confirmation and passport", tip: "Luggage storage is usually free before check-in time — most hotels offer it." },
      },
      {
        id: "a5", icon: "🗺️",
        ko: { name: "네이버 지도 앱 설치", desc: "구글맵보다 한국 실정에 훨씬 정확해요", tip: "대중교통, 도보, 자전거 경로 모두 지원. 영어 지원도 됩니다. 카카오맵도 함께 깔아두면 좋아요." },
        en: { name: "Install Naver Map", desc: "Far more accurate in Korea than Google Maps", tip: "Covers transit, walking, and cycling routes — English supported. Kakao Map is a good backup too." },
      },
    ],
    tips: [
      { ko: "인천공항에서 시내까지 공항철도(AREX) 이용 시 약 43분, 요금은 약 9,000원이에요.", en: "AREX train from Incheon Airport to Seoul Station takes ~43 min and costs around ₩9,000." },
      { ko: "도착 당일 짐이 많다면 퀵서비스(짐 배송)로 먼저 보내고 가볍게 이동할 수 있어요.", en: "If you have heavy luggage on arrival, use a luggage delivery service to send bags ahead and travel light." },
      { ko: "한국 전원 콘센트는 220V / Type C, F 방식이에요. 멀티 어댑터를 준비하세요.", en: "Korean outlets are 220V / Type C and F plugs. Bring a multi-adapter if needed." },
    ],
    links: [
      { href: "/map", ko: "이태원 지도 보기", en: "View Itaewon Map", icon: "🗺️" },
      { href: "/courses/itaewon-food", ko: "첫날 먹방 코스", en: "Day 1 Food Course", icon: "🍜" },
    ],
  },
  "early-life": {
    slug: "early-life", stageNum: 2,
    color: "#234BFF",
    ko: { name: "초기 생활", tagline: "한국 생활의 기반을 만드는 단계" },
    en: { name: "Early Life", tagline: "Building the foundation for life in Korea" },
    tasks: [
      {
        id: "e1", icon: "🪪",
        ko: { name: "외국인 등록증 신청", desc: "입국 후 90일 이내 출입국사무소 방문 필수", tip: "하이코리아(Hi Korea) 앱 또는 사이트에서 사전 예약 가능. 여권·계약서·증명사진 지참." },
        en: { name: "Apply for Alien Registration Card", desc: "Must visit immigration office within 90 days of entry", tip: "Book an appointment via Hi Korea (hikorea.go.kr). Bring your passport, lease agreement, and a passport photo." },
        urgent: true, deadline: "D-23",
      },
      {
        id: "e2", icon: "🏦",
        ko: { name: "은행 계좌 개설", desc: "신한·하나 은행 추천 — 외국인 영어 지원 우수", tip: "신한은행 이태원 지점은 영어 상담 가능. 외국인 등록증 or 여권 + 비자 서류 필요. 카카오뱅크도 외국인 개설 가능." },
        en: { name: "Open a bank account", desc: "Shinhan or Hana Bank — best English support for foreigners", tip: "Shinhan Bank's Itaewon branch has English-speaking staff. Bring your ARC or passport + visa documents. Kakao Bank also works for foreigners." },
      },
      {
        id: "e3", icon: "🏥",
        ko: { name: "건강보험 가입", desc: "6개월 이상 체류 시 의무 가입 (국민건강보험공단)", tip: "직장인은 회사에서 처리. 자영업·프리랜서는 지역 가입자로 별도 신청. 월 보험료는 소득 기준으로 산정됩니다." },
        en: { name: "Enroll in health insurance", desc: "Mandatory for stays of 6+ months (NHIS)", tip: "Employees: your employer handles this. Self-employed or freelancers apply as local subscribers separately. Monthly premium is income-based." },
      },
      {
        id: "e4", icon: "📶",
        ko: { name: "장기 유심 또는 알뜰폰 계약", desc: "선불 유심에서 장기 요금제로 전환하면 더 저렴해요", tip: "SK7모바일, 알뜰모바일 등 MVNO 이용 시 월 2~3만 원대에 데이터 무제한 요금제 이용 가능." },
        en: { name: "Switch to a long-term phone plan", desc: "Cheaper than prepaid once you're settled", tip: "MVNO carriers like SK7Mobile offer unlimited data plans from ₩20–30K/month — much cheaper than major carriers." },
      },
      {
        id: "e5", icon: "🏠",
        ko: { name: "주거지 계약", desc: "월세·전세 계약 전 부동산 중개인 이용 권장", tip: "외국인은 '월세' 형태가 일반적. 계약 전 전입신고와 확정일자 개념을 꼭 이해하세요. 이태원, 마포, 성수 지역이 외국인 거주자가 많아요." },
        en: { name: "Secure your housing contract", desc: "Use a licensed real estate agent for monthly rent (wolse) contracts", tip: "Monthly rent (wolse) is most common for foreigners. Understand 'jeonip sinso' (resident registration) and 'hwakjeong illja' (priority date) before signing." },
      },
    ],
    tips: [
      { ko: "외국인 등록증이 있으면 네이버·카카오 계정 연동, 각종 정부 서비스 이용이 훨씬 쉬워요.", en: "Having an ARC makes linking Naver/Kakao accounts and using government services much easier." },
      { ko: "건강보험 가입 후 치과도 일부 보험 적용이 돼요. 미리 치과 검진을 받아두는 게 좋아요.", en: "After health insurance enrollment, some dental care is also covered — worth getting a check-up early." },
      { ko: "은행 앱은 우리은행(WON) 또는 신한 SOL이 외국인 사용자에게 가장 친화적이에요.", en: "Woori Bank's WON app and Shinhan SOL are most foreigner-friendly for mobile banking." },
    ],
    links: [
      { href: "/places/anthracite-hongdae", ko: "이태원 외국인 카페", en: "Foreigner-friendly café", icon: "☕" },
      { href: "/community", ko: "커뮤니티에서 조언 구하기", en: "Ask the community", icon: "💬" },
    ],
  },
  "settlement": {
    slug: "settlement", stageNum: 3,
    color: "#12A05A",
    ko: { name: "정착", tagline: "한국이 진짜 '집'이 되는 단계" },
    en: { name: "Settlement", tagline: "When Korea starts to feel like home" },
    tasks: [
      {
        id: "s1", icon: "📋",
        ko: { name: "전입신고 (주민등록)", desc: "거주지 이전 시 14일 이내 주민센터 신고", tip: "외국인 등록증 소지자는 외국인 전입신고도 가능. 주민센터 방문 시 임대차 계약서와 여권 지참." },
        en: { name: "Register your residence", desc: "Report your address at the local community center within 14 days of moving", tip: "ARC holders can register foreign resident changes. Bring your lease contract and passport to the community center (주민센터)." },
      },
      {
        id: "s2", icon: "🇰🇷",
        ko: { name: "한국어 학습 시작", desc: "세종학당, 사설 학원, 앱(듀오링고·클래스101) 활용", tip: "일상 한국어 200개 표현만 알아도 생활이 훨씬 편해져요. 한글 읽기는 하루~이틀이면 가능!" },
        en: { name: "Start learning Korean", desc: "King Sejong Institute, private academies, or apps like Duolingo / Class101", tip: "Knowing just 200 everyday expressions makes daily life much easier. You can learn to read Hangul in 1–2 days!" },
      },
      {
        id: "s3", icon: "💰",
        ko: { name: "세금 신고 이해", desc: "소득이 있다면 5월 종합소득세 신고 필수", tip: "외국인도 한국 소득에 대해 세금을 납부해야 해요. 국세청 홈택스(Hometax)에서 신고 가능. 복잡하면 세무사 이용 추천." },
        en: { name: "Understand tax filing", desc: "If you have income in Korea, file by May (comprehensive income tax)", tip: "Foreigners with Korean income must file taxes. Use the NTS Hometax portal. For complex situations, a tax accountant (세무사) is worth the cost." },
      },
      {
        id: "s4", icon: "🚗",
        ko: { name: "국제운전면허 또는 한국 면허 취득", desc: "국제면허는 입국 후 1년간 유효, 이후 한국 면허로 전환", tip: "한국 면허 전환은 운전면허시험장 방문. 필기시험 면제 가능 국가 목록 확인 필요. 서울에서는 차보다 대중교통이 훨씬 편해요." },
        en: { name: "Sort out your driving license", desc: "International license valid for 1 year after entry; convert to Korean license after that", tip: "License conversion is done at a driver's license exam center. Some countries are exempt from the written test. In Seoul, public transit is usually faster than driving." },
      },
      {
        id: "s5", icon: "🏋️",
        ko: { name: "동네 커뮤니티 연결", desc: "Meetup, 페이스북 그룹, 외국인 커뮤니티 참여", tip: "InterNations Korea, Facebook의 'Seoul Expats' 그룹, 이태원 토요일 플리마켓 등 외국인 커뮤니티가 활발해요." },
        en: { name: "Connect with your local community", desc: "Meetup, Facebook groups, and expat communities", tip: "InterNations Korea, the 'Seoul Expats' Facebook group, and the Itaewon Saturday flea market are great starting points." },
      },
    ],
    tips: [
      { ko: "정착 단계에서는 '단골 가게'를 만드는 게 중요해요. 동네 카페, 식당, 편의점 직원과 친해지면 생활이 훨씬 풍요로워져요.", en: "In the settlement stage, building 'regular' spots matters. Getting to know your neighborhood café, restaurant, and convenience store staff enriches daily life." },
      { ko: "서울시에서 운영하는 외국인 주민 지원센터(다누리)를 활용하면 법률·생활 상담을 무료로 받을 수 있어요.", en: "Seoul's Danuri centers offer free legal and life counseling for foreign residents — a great resource." },
      { ko: "장기 비자 갱신은 만료 4개월 전부터 준비를 시작하는 게 안전해요.", en: "Start preparing your long-term visa renewal at least 4 months before expiration." },
    ],
    links: [
      { href: "/community", ko: "커뮤니티 참여하기", en: "Join the community", icon: "👥" },
      { href: "/etiquette", ko: "한국 에티켓 가이드", en: "Korea Etiquette Guide", icon: "🇰🇷" },
    ],
  },
  "community": {
    slug: "community", stageNum: 4,
    color: "#7B4DFF",
    ko: { name: "커뮤니티", tagline: "한국에서 진짜 사람들과 연결되기" },
    en: { name: "Community", tagline: "Making real connections in Korea" },
    tasks: [
      {
        id: "c1", icon: "🤝",
        ko: { name: "언어 교환 파트너 찾기", desc: "Meetup, HelloTalk, Tandem 앱 활용", tip: "한국어를 배우면서 영어를 가르쳐줄 수 있는 파트너를 찾아보세요. 서울 곳곳에서 랭귀지 익스체인지 이벤트가 열려요." },
        en: { name: "Find a language exchange partner", desc: "Use Meetup, HelloTalk, or Tandem", tip: "Language exchange is a win-win — you teach English while learning Korean. Seoul has frequent language exchange meetup events." },
      },
      {
        id: "c2", icon: "🏃",
        ko: { name: "운동 그룹 / 클럽 참가", desc: "러닝 클럽, 등산 모임, 수영 동호회 등", tip: "한강 러닝 크루 모임이 활발해요. 'Seoul Running Crew' 등을 인스타그램에서 검색해보세요." },
        en: { name: "Join a sports club or group", desc: "Running crews, hiking clubs, swimming groups", tip: "Han River running crews are very active. Search 'Seoul Running Crew' on Instagram to find one near you." },
      },
      {
        id: "c3", icon: "🍻",
        ko: { name: "이웃과 교류하기", desc: "아파트 커뮤니티, 동네 행사 참여", tip: "한국 아파트 단지에는 입주자 카페가 있어요. 이웃들과 연결되는 좋은 방법이에요." },
        en: { name: "Get to know your neighbors", desc: "Apartment community boards and neighborhood events", tip: "Korean apartment complexes often have resident-only apps or cafes — a great way to meet neighbors." },
      },
      {
        id: "c4", icon: "🎨",
        ko: { name: "취미 클래스 등록", desc: "도예, 서예, 요리, K-pop 댄스 등", tip: "성수동의 도예 공방, 이태원의 요리 클래스, 홍대 주변 댄스 스튜디오가 인기 있어요." },
        en: { name: "Enroll in a hobby class", desc: "Pottery, calligraphy, cooking, K-pop dance, and more", tip: "Seongsu pottery studios, Itaewon cooking classes, and Hongdae dance studios are all popular." },
      },
      {
        id: "c5", icon: "📖",
        ko: { name: "한국 문화 이해하기", desc: "에티켓, 음식 문화, 명절 문화 익히기", tip: "추석(Chuseok)과 설날(Seollal) 기간에는 대부분의 가게가 문을 닫아요. 미리 준비해두세요." },
        en: { name: "Learn Korean cultural norms", desc: "Etiquette, food culture, holiday customs", tip: "During Chuseok and Seollal (Lunar New Year), most shops close. Stock up on essentials in advance." },
      },
    ],
    tips: [
      { ko: "한국에서는 첫 만남에서 명함 교환이 중요해요. 두 손으로 주고받는 예절을 지켜주세요.", en: "In Korea, exchanging business cards at first meetings matters. Use both hands when giving and receiving." },
      { ko: "카카오톡은 한국에서 가장 많이 쓰는 메신저예요. 지인과 연락할 때 꼭 필요해요.", en: "KakaoTalk is the dominant messaging app in Korea — essential for staying in touch with local contacts." },
    ],
    links: [
      { href: "/community", ko: "Localoop 커뮤니티", en: "Localoop Community", icon: "💬" },
      { href: "/etiquette", ko: "에티켓 가이드", en: "Etiquette Guide", icon: "🙏" },
    ],
  },
  "long-term": {
    slug: "long-term", stageNum: 5,
    color: "#B87000",
    ko: { name: "장기 거주", tagline: "한국을 내 나라처럼 살아가기" },
    en: { name: "Long-term", tagline: "Living in Korea like it's truly home" },
    tasks: [
      {
        id: "l1", icon: "📄",
        ko: { name: "장기 비자 갱신 또는 변경", desc: "만료 4개월 전 준비 시작 권장", tip: "비자 종류에 따라 갱신 요건이 다를 수 있어요. 하이코리아(Hi Korea) 사이트에서 정확한 요건을 확인하세요." },
        en: { name: "Renew or change your long-term visa", desc: "Start preparing at least 4 months before expiration", tip: "Requirements vary by visa type. Check the exact criteria on Hi Korea (hikorea.go.kr)." },
      },
      {
        id: "l2", icon: "🏡",
        ko: { name: "부동산 투자 또는 장기 계약", desc: "전세 계약 또는 월세 장기 협상", tip: "전세는 목돈이 필요하지만 월 임대료가 없어요. 외국인도 전세 계약 가능. 법무사를 통해 계약 검토를 받는 게 안전해요." },
        en: { name: "Long-term housing contract or investment", desc: "Jeonse (key money deposit) or long-term monthly rent negotiation", tip: "Jeonse requires a large deposit but means no monthly rent. Foreigners can use jeonse. Have a lawyer (법무사) review the contract." },
      },
      {
        id: "l3", icon: "🎓",
        ko: { name: "한국어 능력 시험 (TOPIK)", desc: "한국어 실력을 공식적으로 증명하는 시험", tip: "TOPIK 3급 이상이면 대부분의 취업·비자 요건을 충족해요. 연 2~3회 시험 기회가 있어요." },
        en: { name: "TOPIK Korean proficiency test", desc: "Official certification of your Korean language skills", tip: "TOPIK level 3+ meets most job and visa requirements. The test is offered 2–3 times a year." },
      },
      {
        id: "l4", icon: "💼",
        ko: { name: "한국 경력·네트워크 구축", desc: "링크드인, 업종별 네트워킹 행사 참여", tip: "한국에서는 인맥(인적 네트워크)이 취업에 큰 영향을 미쳐요. 업종별 모임과 세미나에 적극 참여하세요." },
        en: { name: "Build a Korean career network", desc: "LinkedIn, industry-specific networking events", tip: "Personal networks (인맥) are crucial for career growth in Korea. Actively attend industry meetups and seminars." },
      },
      {
        id: "l5", icon: "🛂",
        ko: { name: "영주권 또는 귀화 검토", desc: "F-5 영주권: 5년 이상 합법 거주 시 신청 가능", tip: "F-5 영주권 취득 후에는 비자 갱신 없이 계속 거주 가능해요. 귀화는 일반적으로 5년 이상 거주 후 신청 가능." },
        en: { name: "Explore permanent residency or naturalization", desc: "F-5 visa: eligible after 5+ years of legal residency", tip: "F-5 permanent residency means no more visa renewals. Naturalization is generally available after 5+ years of residence." },
      },
    ],
    tips: [
      { ko: "장기 거주자에게는 재외동포 커뮤니티보다 현지 한국인 커뮤니티에 녹아드는 것이 더 중요해요.", en: "For long-term residents, integrating into local Korean communities matters more than sticking to expat circles." },
      { ko: "한국 부동산 시장은 복잡해요. 계약 전 반드시 법무사 또는 공인중개사의 도움을 받으세요.", en: "Korea's real estate market is complex. Always consult a licensed agent (공인중개사) or legal scrivener (법무사) before signing." },
    ],
    links: [
      { href: "/community", ko: "장기 거주자 커뮤니티", en: "Long-term resident community", icon: "🏠" },
      { href: "/etiquette", ko: "한국 문화 심화 가이드", en: "Deep dive: Korean culture", icon: "📖" },
    ],
  },
};

const STAGE_ORDER = ["arrival", "early-life", "settlement", "community", "long-term"];
const STAGE_LABEL_KO = ["도착", "초기 생활", "정착", "커뮤니티", "장기 거주"];
const STAGE_LABEL_EN = ["Arrival", "Early Life", "Settlement", "Community", "Long-term"];

export default function StageDetailPage() {
  const { stage } = useParams<{ stage: string }>();
  const router = useRouter();
  const isKo = useLang();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const detail = STAGES[stage];

  if (!detail) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, padding: 24 }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>{isKo ? "페이지를 찾을 수 없어요" : "Page not found"}</p>
        <Link href="/tasks" style={{ color: "var(--grade-s)", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>← {isKo ? "태스크 목록" : "All Tasks"}</Link>
      </div>
    );
  }

  const tasks = detail.tasks;
  const doneCount = tasks.filter(t => checked[t.id] ?? false).length;
  const stageIdx = STAGE_ORDER.indexOf(stage);

  function toggle(id: string) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div style={{ background: "var(--background)", minHeight: "100%", paddingBottom: 40 }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(160deg, #1A0E14 0%, #120A0F 100%)",
        padding: "20px 20px 22px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,86,54,0.07)" }} />
        <div style={{ position: "absolute", bottom: -20, right: 40, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,86,54,0.04)" }} />

        {/* Back + stage nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, position: "relative" }}>
          <button
            onClick={() => router.back()}
            style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
            STAGE {String(detail.stageNum).padStart(2, "0")} · {isKo ? detail.ko.name : detail.en.name}
          </span>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-0.6px", marginBottom: 6, position: "relative" }}>
          {isKo ? detail.ko.tagline : detail.en.tagline}
        </h1>

        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, position: "relative" }}>
          <div style={{ flex: 1, height: 5, borderRadius: 99, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(doneCount / tasks.length) * 100}%`, background: "#FF6A4D", borderRadius: 99, transition: "width 0.4s" }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.75)", flexShrink: 0 }}>
            {doneCount}/{tasks.length} {isKo ? "완료" : "done"}
          </span>
        </div>
      </div>

      {/* Stage nav chips */}
      <div style={{ display: "flex", gap: 6, padding: "12px 16px 4px", overflowX: "auto", scrollbarWidth: "none" }}>
        {STAGE_ORDER.map((s, i) => {
          const active = s === stage;
          return (
            <Link key={s} href={`/tasks/${s}`} style={{ textDecoration: "none", flexShrink: 0 }}>
              <span style={{
                display: "inline-block", fontSize: 11, fontWeight: active ? 700 : 500,
                padding: "5px 12px", borderRadius: 999,
                background: active ? "var(--grade-s)" : "var(--card)",
                color: active ? "#fff" : "var(--foreground-muted)",
                border: active ? "none" : "1px solid var(--border)",
              }}>
                {isKo ? STAGE_LABEL_KO[i] : STAGE_LABEL_EN[i]}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Task list */}
      <div style={{ padding: "14px 16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground-sub)", letterSpacing: "0.04em", marginBottom: 4 }}>
          {isKo ? "체크리스트" : "CHECKLIST"}
        </div>
        {tasks.map((task) => {
          const done = checked[task.id] ?? false;
          const info = isKo ? task.ko : task.en;
          return (
            <div key={task.id} style={{
              background: "var(--card)", borderRadius: 16,
              border: task.urgent && !done ? "1.5px solid var(--grade-s)" : "1px solid var(--border)",
              padding: "14px 14px 12px",
              boxShadow: task.urgent && !done ? "0 2px 12px -4px rgba(255,86,54,0.2)" : "0 1px 4px rgba(0,0,0,0.04)",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                {/* Checkbox */}
                <button
                  onClick={() => toggle(task.id)}
                  style={{
                    width: 26, height: 26, borderRadius: 8, flexShrink: 0, marginTop: 1,
                    background: done ? "var(--grade-s)" : "transparent",
                    border: done ? "none" : task.urgent ? "2px solid var(--grade-s)" : "2px solid var(--border)",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {done && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>}
                </button>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 16 }}>{task.icon}</span>
                    <span style={{
                      fontSize: 14, fontWeight: 700,
                      color: done ? "var(--foreground-muted)" : "var(--foreground)",
                      textDecoration: done ? "line-through" : "none",
                    }}>
                      {info.name}
                    </span>
                    {task.urgent && !done && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "var(--grade-s)", color: "#fff", flexShrink: 0 }}>
                        {task.deadline ?? "긴급"}
                      </span>
                    )}
                    {done && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "var(--badge-en-bg)", color: "var(--badge-en-fg)", flexShrink: 0 }}>
                        {isKo ? "완료" : "Done"}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--foreground-muted)", marginBottom: 8 }}>{info.desc}</div>
                  {/* Tip */}
                  <div style={{ fontSize: 11, color: "var(--foreground-muted)", background: "var(--content-bg)", borderRadius: 10, padding: "8px 10px", lineHeight: 1.55, borderLeft: "3px solid var(--grade-s)" }}>
                    💡 {info.tip}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips section */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground-sub)", letterSpacing: "0.04em", marginBottom: 10 }}>
          {isKo ? "알아두면 좋은 것들" : "GOOD TO KNOW"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {detail.tips.map((tip, i) => (
            <div key={i} style={{ background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)", padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>📌</span>
              <p style={{ fontSize: 13, color: "var(--foreground)", lineHeight: 1.55, flex: 1 }}>
                {isKo ? tip.ko : tip.en}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      {detail.links.length > 0 && (
        <div style={{ padding: "20px 16px 0" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground-sub)", letterSpacing: "0.04em", marginBottom: 10 }}>
            {isKo ? "관련 페이지" : "RELATED"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {detail.links.map((link) => (
              <Link key={link.href} href={link.href} style={{ textDecoration: "none" }}>
                <div style={{ background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)", padding: "13px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{link.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)", flex: 1 }}>
                    {isKo ? link.ko : link.en}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--grade-s)" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom nav between stages */}
      <div style={{ display: "flex", gap: 10, padding: "24px 16px 0" }}>
        {stageIdx > 0 && (
          <Link href={`/tasks/${STAGE_ORDER[stageIdx - 1]}`} style={{ flex: 1, textDecoration: "none" }}>
            <div style={{ background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
              <div>
                <div style={{ fontSize: 10, color: "var(--foreground-muted)", marginBottom: 1 }}>{isKo ? "이전 단계" : "Previous"}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>
                  {isKo ? STAGE_LABEL_KO[stageIdx - 1] : STAGE_LABEL_EN[stageIdx - 1]}
                </div>
              </div>
            </div>
          </Link>
        )}
        {stageIdx < STAGE_ORDER.length - 1 && (
          <Link href={`/tasks/${STAGE_ORDER[stageIdx + 1]}`} style={{ flex: 1, textDecoration: "none" }}>
            <div style={{ background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: "var(--foreground-muted)", marginBottom: 1 }}>{isKo ? "다음 단계" : "Next"}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>
                  {isKo ? STAGE_LABEL_KO[stageIdx + 1] : STAGE_LABEL_EN[stageIdx + 1]}
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--grade-s)" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
