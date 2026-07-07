// Shared chat data for the standalone chat page (/chat) and the community
// chat tab (/community?tab=chat). These two screens are near-verbatim copies;
// the data below is identical between them EXCEPT the cv1 avatar color and the
// translation `T` dictionary, which are parameterized / exported as variants.

export type Message = { id: string; from: "me" | "other"; text: string; translation: string };

export type Conversation = {
  id: string;
  name: string;
  flag: string;
  color: string;
  initial: string;
  lastMsg: { ko: string; en: string };
  time: string;
};

// cv1's avatar color differs between the two screens: the standalone chat page
// uses "#FFD600", the community chat tab uses "#FFC93C". Pass the correct value
// per caller so each keeps its exact rendered color.
export function getConversations(cv1Color: string): Conversation[] {
  return [
    { id: "cv1", name: "민준", flag: "🇰🇷", color: cv1Color, initial: "민", lastMsg: { ko: "안녕하세요! 이태원에서 좋은 카페 추천해 주실 수 있나요?", en: "Hello! Can you recommend a good café in Itaewon?" }, time: "2m" },
    { id: "cv2", name: "Sarah", flag: "🇺🇸", color: "var(--grade-s)", initial: "S", lastMsg: { ko: "보드게임 모임 같이 가실 분?", en: "Anyone want to join the board game meetup?" }, time: "14m" },
    { id: "cv3", name: "Yuki", flag: "🇯🇵", color: "#FF7043", initial: "Y", lastMsg: { ko: "북촌 카페 같이 가요!", en: "Let's visit a Bukchon café together!" }, time: "1h" },
  ];
}

export const MESSAGES_BY_CV: Record<string, Message[]> = {
  cv1: [
    { id: "1", from: "other", text: "안녕하세요! 이태원에서 좋은 카페 추천해 주실 수 있나요?", translation: "Hello! Can you recommend a good café in Itaewon?" },
    { id: "2", from: "me", text: "Of course! Anthracite is great — it's a converted factory with amazing coffee.", translation: "물론이죠! Anthracite가 정말 좋아요. 공장을 개조한 곳인데 커피가 훌륭해요." },
    { id: "3", from: "other", text: "감사합니다! 주소가 어떻게 되나요?", translation: "Thank you! What is the address?" },
  ],
  cv2: [
    { id: "1", from: "other", text: "보드게임 모임 같이 가실 분?", translation: "Anyone want to join the board game meetup?" },
    { id: "2", from: "me", text: "Yes! What time does it start?", translation: "네! 몇 시에 시작하나요?" },
    { id: "3", from: "other", text: "금요일 오후 7시에요 :)", translation: "Friday at 7pm :)" },
  ],
  cv3: [
    { id: "1", from: "other", text: "북촌 카페 같이 가요!", translation: "Let's visit a Bukchon café together!" },
    { id: "2", from: "me", text: "Sure! Saturday morning works for me.", translation: "좋아요! 토요일 아침이 좋아요." },
  ],
};

// The standalone chat page's dictionary additionally includes `send` and `back`
// keys; the community chat tab's dictionary omits them. Neither key is actually
// rendered (the send/back buttons use glyphs), but the two dicts are kept
// separate so each screen's data matches its original exactly.
export const T_STANDALONE = {
  ko: { notice: "실시간 번역 중 · 한국어 ↔ 영어", inputPh: "메시지를 입력하세요...", send: "전송", chats: "채팅 목록", searchPh: "대화 검색...", noResults: "검색 결과가 없어요", back: "목록" },
  en: { notice: "Live translation · Korean ↔ English", inputPh: "Type a message...", send: "Send", chats: "Chats", searchPh: "Search conversations...", noResults: "No conversations found", back: "List" },
};

export const T_COMMUNITY = {
  ko: { notice: "실시간 번역 중 · 한국어 ↔ 영어", inputPh: "메시지를 입력하세요...", chats: "채팅 목록", searchPh: "대화 검색...", noResults: "검색 결과가 없어요" },
  en: { notice: "Live translation · Korean ↔ English", inputPh: "Type a message...", chats: "Chats", searchPh: "Search conversations...", noResults: "No conversations found" },
};
