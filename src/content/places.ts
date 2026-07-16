// Place-detail label/tag data, moved verbatim from places/[slug]/page.tsx.
//
// NOTE: CAT_LABEL below is a DIFFERENT vocabulary from PLACE_CATEGORIES in
// src/lib/constants.ts. They serve different surfaces (this place-detail header
// vs. the category picker) and their labels intentionally differ
// (e.g. restaurant → "음식점"/"Restaurant" here vs. "식당"/"Restaurant" there;
// bar → "바"/"Bar" here vs. "술집"/"Bar" there). They must NOT be merged.

export const CAT_LABEL: Record<string, { ko: string; en: string }> = {
  cafe:       { ko: "카페",    en: "Café" },
  restaurant: { ko: "음식점",  en: "Restaurant" },
  bar:        { ko: "바",      en: "Bar" },
  market:     { ko: "시장",    en: "Market" },
  shopping:   { ko: "쇼핑",   en: "Shopping" },
  activity:   { ko: "액티비티", en: "Activity" },
  experience: { ko: "체험",   en: "Experience" },
  health:     { ko: "헬스",   en: "Health" },
  transport:  { ko: "교통",   en: "Transport" },
  telecom:    { ko: "통신사",  en: "Telecom" },
  bank:       { ko: "은행",   en: "Bank" },
  government: { ko: "공공기관", en: "Government" },
  realestate: { ko: "부동산",  en: "Real Estate" },
};

export const WHY_TAGS: Record<string, { ko: string; en: string }[]> = {
  S: [
    { ko: "영어 완전 대응",   en: "Full English Support" },
    { ko: "외국인 리뷰 84+", en: "84+ Foreign Reviews" },
    { ko: "지하철 5분",      en: "5 min from Subway" },
    { ko: "카드 OK",         en: "Card Payment OK" },
    { ko: "혼자 방문 OK",    en: "Solo-Friendly" },
    { ko: "예약 쉬움",       en: "Easy Reservation" },
  ],
  A: [
    { ko: "영어 어느 정도 가능", en: "Some English Available" },
    { ko: "카드 결제 OK",       en: "Card Payment OK" },
    { ko: "외국인 리뷰 있음",   en: "Has Foreign Reviews" },
  ],
  B: [
    { ko: "카드 결제 OK",   en: "Card Payment OK" },
    { ko: "픽토그램 메뉴",  en: "Pictogram Menu" },
    { ko: "구글맵 정보 있음", en: "Google Maps Verified" },
  ],
  C: [
    { ko: "현금 선호",     en: "Cash Preferred" },
    { ko: "한국어 필요",   en: "Korean Required" },
    { ko: "기본 방문 가능", en: "Basic Visit OK" },
  ],
};
