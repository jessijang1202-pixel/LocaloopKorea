// Community feed mock data, moved verbatim from community/page.tsx.

export const CAT_CHIPS = {
  ko: ["전체", "질문", "팁", "모임", "이태원"],
  en: ["All", "Q&A", "Tips", "Meetup", "Itaewon"],
};

export const CAT_COLOR: Record<string, { bg: string; fg: string }> = {
  "질문": { bg: "var(--badge-card-bg)", fg: "var(--badge-card-fg)" },
  "Q&A":  { bg: "var(--badge-card-bg)", fg: "var(--badge-card-fg)" },
  "팁":   { bg: "var(--badge-en-bg)",   fg: "var(--badge-en-fg)" },
  "Tips": { bg: "var(--badge-en-bg)",   fg: "var(--badge-en-fg)" },
  "모임": { bg: "var(--badge-res-bg)",  fg: "var(--badge-res-fg)" },
  "Meetup":{ bg: "var(--badge-res-bg)", fg: "var(--badge-res-fg)" },
};

export const POSTS = [
  { id: "p1", avatar: { initial: "S", color: "#FF5636" }, name: "Sarah", nat: "US", timestamp: { ko: "12분 전", en: "12m ago" }, cat: { ko: "질문", en: "Q&A" }, title: { ko: "이태원에서 영어 되는 치과 있나요?", en: "English-speaking dentist near Itaewon?" }, body: { ko: "갑자기 치통이 생겼는데 영어 가능한 치과를 못 찾겠어요...", en: "Sudden toothache — can't find an English-friendly dentist nearby..." }, likes: 8, comments: 12, resolved: true, attendance: null },
  { id: "p2", avatar: { initial: "민", color: "#12BFB6" }, name: "민준", nat: "KR", timestamp: { ko: "1시간 전", en: "1h ago" }, cat: { ko: "팁", en: "Tips" }, title: { ko: "신한 쏠 앱으로 외국인도 계좌 개설 가능!", en: "Foreigners can now open Shinhan account via SOL app!" }, body: { ko: "ARC 없이도 여권만으로 가능해요. 영어 지원됩니다.", en: "Works with passport only, no ARC required. English UI supported." }, likes: 34, comments: 7, resolved: false, attendance: null },
  { id: "p3", avatar: { initial: "Y", color: "#7B4DFF" }, name: "Yuki", nat: "JP", timestamp: { ko: "3시간 전", en: "3h ago" }, cat: { ko: "모임", en: "Meetup" }, title: { ko: "이태원 언어 교환 같이 가요!", en: "Language Exchange Meetup — join us!" }, body: { ko: "매주 화요일 오후 2시 이태원 카페에서 만나요.", en: "Every Tuesday 2pm at a café in Itaewon." }, likes: 15, comments: 23, resolved: false, attendance: { current: 6, max: 10 } },
  { id: "p4", avatar: { initial: "A", color: "#FFC93C" }, name: "Alex", nat: "GB", timestamp: { ko: "어제", en: "Yesterday" }, cat: { ko: "팁", en: "Tips" }, title: { ko: "지하철 앱 추천 — 카카오맵 vs 네이버지도", en: "Best subway app — KakaoMap vs Naver Maps" }, body: { ko: "둘 다 써봤는데 영어 사용자에겐 카카오가 더 편해요.", en: "Tested both — KakaoMap is better for English speakers." }, likes: 21, comments: 5, resolved: false, attendance: null },
  { id: "p5", avatar: { initial: "L", color: "#12A05A" }, name: "Léa", nat: "FR", timestamp: { ko: "2일 전", en: "2d ago" }, cat: { ko: "질문", en: "Q&A" }, title: { ko: "외국인등록증 나오는데 얼마나 걸리나요?", en: "How long does the ARC take to arrive?" }, body: { ko: "3주째 기다리고 있는데 보통 어느 정도 걸리나요?", en: "Been waiting 3 weeks — what's a typical timeline?" }, likes: 4, comments: 9, resolved: true, attendance: null },
];
