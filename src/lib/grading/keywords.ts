// Module 200 data — the foreigner-friendliness keyword dictionary.
//
// Each rule ties a text pattern to one of the four sub-score axes (LS/AR/PD/LF)
// and a polarity. Korean + English are both covered; English patterns rely on
// the ignoreCase flag that extract.ts forces onto every RegExp, and string
// patterns are matched case-insensitively. RegExp `\s*` tolerates the no-space
// variants seen in the wild (e.g. "영어메뉴").
//
// AR "hard restriction" rules carry weight: 2 so a single hit (외국인 출입 불가,
// koreans only, ...) can crater the AR sub-score — see score.ts AR formula.

import type { KeywordRule } from "./types";

export const KEYWORD_RULES: KeywordRule[] = [
  // ─── LS 언어 지원 (language support) ──────────────────────────────────────
  // positive
  {
    // "영어 메뉴" / "영어메뉴" — but NOT "영어 메뉴 없음/안됨/불가"
    pattern: /영어\s*메뉴(?!\s*(없|안|불))/gi,
    category: "LS",
    polarity: "positive",
    label: { ko: "영어 메뉴", en: "English menu" },
  },
  {
    pattern: /영어\s*메뉴\s*있/gi,
    category: "LS",
    polarity: "positive",
    label: { ko: "영어 메뉴 있음", en: "English menu available" },
  },
  {
    pattern: /english\s*menu/gi,
    category: "LS",
    polarity: "positive",
    label: { ko: "영어 메뉴(English menu)", en: "English menu" },
  },
  {
    pattern: /영어\s*(응대|가능|됨|돼요|잘\s*통|소통)/gi,
    category: "LS",
    polarity: "positive",
    label: { ko: "영어 응대/영어 가능", en: "English spoken" },
  },
  {
    pattern: /다국어\s*(안내|메뉴|지원|가능)/gi,
    category: "LS",
    polarity: "positive",
    label: { ko: "다국어 안내", en: "Multilingual support" },
  },
  {
    pattern: /외국어\s*메뉴/gi,
    category: "LS",
    polarity: "positive",
    label: { ko: "외국어 메뉴", en: "Foreign-language menu" },
  },
  {
    pattern: /english\s*(ok|available|spoken|speaking|friendly)/gi,
    category: "LS",
    polarity: "positive",
    label: { ko: "영어 가능(english ok)", en: "English OK" },
  },
  // negative
  {
    pattern: /영어\s*메뉴\s*(없|불가|안\s*됨)/gi,
    category: "LS",
    polarity: "negative",
    label: { ko: "영어 메뉴 없음", en: "No English menu" },
  },
  {
    pattern: /영어\s*(안\s*통|안\s*됨|안돼|못\s*알아|불가)/gi,
    category: "LS",
    polarity: "negative",
    label: { ko: "영어 안 통함", en: "English not understood" },
  },
  {
    pattern: /한국어(로)?\s*만/gi,
    category: "LS",
    polarity: "negative",
    label: { ko: "한국어만 가능", en: "Korean only" },
  },
  {
    pattern: /no\s*english|english\s*not\s*(available|spoken)/gi,
    category: "LS",
    polarity: "negative",
    label: { ko: "영어 불가(no english)", en: "No English" },
  },

  // ─── AR 출입 제한 위험 (access restriction) ───────────────────────────────
  // negative — "hard" restrictions, weight 2 (single hit craters AR)
  {
    pattern: /외국인\s*출입\s*(불가|금지|제한|안)/gi,
    category: "AR",
    polarity: "negative",
    weight: 2,
    label: { ko: "외국인 출입 불가", en: "Foreigners not admitted" },
  },
  {
    pattern: /내국인\s*전용/gi,
    category: "AR",
    polarity: "negative",
    weight: 2,
    label: { ko: "내국인 전용", en: "Koreans only" },
  },
  {
    pattern: /회원\s*전용/gi,
    category: "AR",
    polarity: "negative",
    weight: 2,
    label: { ko: "회원 전용", en: "Members only" },
  },
  {
    pattern: /외국인\s*회원\s*(불가|불가능|안\s*됨|안됨)/gi,
    category: "AR",
    polarity: "negative",
    weight: 2,
    label: { ko: "외국인 회원 불가", en: "No foreign members" },
  },
  {
    pattern: /외국인\s*이용\s*(불가|제한|금지)/gi,
    category: "AR",
    polarity: "negative",
    weight: 2,
    label: { ko: "외국인 이용 불가", en: "Foreigners cannot use" },
  },
  {
    pattern: /(koreans?|locals?)\s*only/gi,
    category: "AR",
    polarity: "negative",
    weight: 2,
    label: { ko: "내국인 전용(koreans only)", en: "Koreans only" },
  },
  {
    pattern: /members?\s*only/gi,
    category: "AR",
    polarity: "negative",
    weight: 2,
    label: { ko: "회원 전용(members only)", en: "Members only" },
  },
  // positive
  {
    pattern: /외국인\s*환영/gi,
    category: "AR",
    polarity: "positive",
    label: { ko: "외국인 환영", en: "Foreigners welcome" },
  },
  {
    pattern: /(foreigners?|tourists?)\s*welcome/gi,
    category: "AR",
    polarity: "positive",
    label: { ko: "외국인 환영(foreigners welcome)", en: "Foreigners welcome" },
  },
  {
    pattern: /외국인\s*(손님\s*)?(많|자주\s*와|북적)/gi,
    category: "AR",
    polarity: "positive",
    label: { ko: "외국인 손님 많음", en: "Many foreign customers" },
  },
  {
    pattern: /외국인\s*(이용|출입)\s*가능/gi,
    category: "AR",
    polarity: "positive",
    label: { ko: "외국인 이용 가능", en: "Open to foreigners" },
  },

  // ─── PD 이용 절차 난이도 (procedure difficulty) ───────────────────────────
  // negative — procedure burdens
  {
    pattern: /본인\s*인증/gi,
    category: "PD",
    polarity: "negative",
    label: { ko: "본인인증 필요", en: "Identity verification required" },
  },
  {
    pattern: /회원\s*가입\s*(필수|필요|해야|하고)/gi,
    category: "PD",
    polarity: "negative",
    label: { ko: "회원가입 필수", en: "Sign-up required" },
  },
  {
    pattern: /(현금\s*결제\s*만|현금\s*만|현금만)/gi,
    category: "PD",
    polarity: "negative",
    label: { ko: "현금 결제만 가능", en: "Cash only" },
  },
  {
    pattern: /cash\s*only/gi,
    category: "PD",
    polarity: "negative",
    label: { ko: "현금만(cash only)", en: "Cash only" },
  },
  {
    pattern: /카드\s*결제\s*(불가|안\s*됨|안됨)/gi,
    category: "PD",
    polarity: "negative",
    label: { ko: "카드 결제 불가", en: "Cards not accepted" },
  },
  {
    pattern: /(외국|해외)\s*(신용)?\s*카드\s*(결제\s*)?(불가|안\s*됨|안됨|안\s*돼)/gi,
    category: "PD",
    polarity: "negative",
    label: { ko: "외국 신용카드 결제 불가", en: "Foreign cards not accepted" },
  },
  {
    pattern: /foreign\s*cards?\s*(not|no|declin)/gi,
    category: "PD",
    polarity: "negative",
    label: { ko: "외국 카드 불가(foreign card)", en: "Foreign cards not accepted" },
  },
  {
    pattern: /한국\s*(핸드폰|휴대폰|전화번호|번호|폰)/gi,
    category: "PD",
    polarity: "negative",
    label: { ko: "한국 핸드폰 필요", en: "Korean phone number required" },
  },
  {
    pattern: /korean\s*(phone|number|sim)\s*(required|needed|only)/gi,
    category: "PD",
    polarity: "negative",
    label: { ko: "한국 번호 필요(korean phone)", en: "Korean phone required" },
  },
  {
    pattern: /예약\s*(필수|필요|만\s*가능|해야)/gi,
    category: "PD",
    polarity: "negative",
    label: { ko: "예약 필수", en: "Reservation required" },
  },
  {
    pattern: /reservation\s*(required|only|needed)/gi,
    category: "PD",
    polarity: "negative",
    label: { ko: "예약 필수(reservation required)", en: "Reservation required" },
  },
  // positive
  {
    pattern: /바로\s*이용\s*가능|바로\s*입장/gi,
    category: "PD",
    polarity: "positive",
    label: { ko: "바로 이용 가능", en: "Instant access" },
  },
  {
    pattern: /카드\s*결제\s*(가능|됨|돼요)/gi,
    category: "PD",
    polarity: "positive",
    label: { ko: "카드 결제 가능", en: "Cards accepted" },
  },
  {
    pattern: /walk[\s-]*in/gi,
    category: "PD",
    polarity: "positive",
    label: { ko: "예약 없이 이용(walk-in)", en: "Walk-in" },
  },
  {
    pattern: /예약\s*(불필요|없이|안\s*해도)|no\s*reservation/gi,
    category: "PD",
    polarity: "positive",
    label: { ko: "예약 불필요", en: "No reservation needed" },
  },

  // ─── LF 로컬 경험 적합도 (local-experience fit) ───────────────────────────
  // positive
  {
    pattern: /현지인\s*맛집/gi,
    category: "LF",
    polarity: "positive",
    label: { ko: "현지인 맛집", en: "Local favorite eatery" },
  },
  {
    pattern: /로컬\s*맛집/gi,
    category: "LF",
    polarity: "positive",
    label: { ko: "로컬 맛집", en: "Local eatery" },
  },
  {
    pattern: /현지인만\s*아는/gi,
    category: "LF",
    polarity: "positive",
    label: { ko: "현지인만 아는", en: "Known only to locals" },
  },
  {
    pattern: /관광객\s*(없|거의\s*없|안\s*와)/gi,
    category: "LF",
    polarity: "positive",
    label: { ko: "관광객 없음", en: "No tourists" },
  },
  {
    pattern: /로컬\s*분위기/gi,
    category: "LF",
    polarity: "positive",
    label: { ko: "로컬 분위기", en: "Local vibe" },
  },
  {
    pattern: /동네\s*단골/gi,
    category: "LF",
    polarity: "positive",
    label: { ko: "동네 단골", en: "Neighborhood regulars" },
  },
  {
    pattern: /현지인\s*추천/gi,
    category: "LF",
    polarity: "positive",
    label: { ko: "현지인 추천", en: "Locals recommend" },
  },
  {
    pattern: /hidden\s*gem|local\s*(vibe|spot|favou?rite|hangout)/gi,
    category: "LF",
    polarity: "positive",
    label: { ko: "로컬 명소(local spot)", en: "Local spot" },
  },
  // negative
  {
    pattern: /관광객\s*(많|바글|가득|넘)/gi,
    category: "LF",
    polarity: "negative",
    label: { ko: "관광객 많음", en: "Crowded with tourists" },
  },
  {
    pattern: /관광객\s*(전용|위주|상대)/gi,
    category: "LF",
    polarity: "negative",
    label: { ko: "관광객 위주", en: "Tourist-oriented" },
  },
  {
    pattern: /(튜리스트|투어리스트)\s*트랩/gi,
    category: "LF",
    polarity: "negative",
    label: { ko: "튜리스트 트랩", en: "Tourist trap" },
  },
  {
    pattern: /tourist\s*trap/gi,
    category: "LF",
    polarity: "negative",
    label: { ko: "튜리스트 트랩(tourist trap)", en: "Tourist trap" },
  },
];
