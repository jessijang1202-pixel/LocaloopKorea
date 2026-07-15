// "한국인만 아는 한국음식" — dishes that are everyday food for Koreans but
// rarely show up on a foreigner's radar (no K-BBQ, kimchi, or bibimbap here —
// those already have plenty of visibility). Curated, hand-authored content,
// not sourced from the collected-places dataset.

import type { Bi } from "@/types/content";

export interface HiddenFoodItem {
  name_ko: string;
  name_en: string; // romanization + short English gloss
  desc: Bi; // why it's good + why foreigners rarely encounter it
}

export const HIDDEN_KOREAN_FOODS: HiddenFoodItem[] = [
  {
    name_ko: "순대국",
    name_en: "Sundae-guk (blood sausage soup)",
    desc: {
      ko: "찹쌀과 선지를 채운 순대와 돼지 내장을 푹 끓인 국. 한국인에게는 흔한 해장 메뉴지만 재료 설명만 들으면 외국인은 선뜻 시도하기 어려워해요. 관광지 식당엔 거의 없고, 동네 노포에서만 팔아요.",
      en: "A hearty soup of blood sausage and pork offal. A classic Korean hangover food, but the ingredient list alone scares most foreigners off before they try it. You won't find it in tourist-area restaurants — only in neighborhood spots.",
    },
  },
  {
    name_ko: "백반",
    name_en: "Baekban (daily home-style set meal)",
    desc: {
      ko: "그날그날 바뀌는 밑반찬과 국이 함께 나오는 가정식 정식. 메뉴판에 사진도 없고 영어 표기도 드물어서, 정작 가장 '진짜 한국 집밥'에 가까운데도 외국인은 잘 못 찾아요.",
      en: "A home-style set meal with rotating daily side dishes and soup. No photos on the menu, rarely any English — which is exactly why it's the most authentic 'Korean home cooking' you can get, and also why foreigners walk right past it.",
    },
  },
  {
    name_ko: "콩국수",
    name_en: "Kong-guksu (cold soybean noodle soup)",
    desc: {
      ko: "진한 콩국물에 국수를 말아 차갑게 먹는 여름 별미. 고소하고 든든한데, 존재 자체를 모르는 외국인이 대부분이에요. 여름 한정 메뉴라 시기를 놓치면 못 먹어요.",
      en: "Cold noodles in a thick, nutty soybean broth — a summer specialty. Most foreigners don't even know it exists, and it's seasonal, so missing the window means waiting until next summer.",
    },
  },
  {
    name_ko: "감자탕",
    name_en: "Gamjatang (pork bone & potato stew)",
    desc: {
      ko: "돼지 등뼈와 감자를 얼큰하게 끓인 탕. 술자리 다음 날 해장 메뉴로 한국인에게 인기지만, 뼈를 발라 먹는 방식이 낯설어 외국인 방문객이 적어요.",
      en: "A spicy stew of pork spine and potatoes — a go-to hangover cure for Koreans. Picking meat off the bone by hand is unfamiliar territory for most visitors, so it stays a local favorite.",
    },
  },
  {
    name_ko: "육회",
    name_en: "Yukhoe (Korean beef tartare)",
    desc: {
      ko: "신선한 생 우육을 배·마늘·참기름과 무친 요리. 날고기라는 이유로 시도조차 안 해보는 외국인이 많은데, 잘하는 집에서 먹으면 부드럽고 고소해요.",
      en: "Fresh raw beef tossed with pear, garlic, and sesame oil. Many foreigners rule it out on sight because it's raw — but at a good restaurant it's silky and rich, closer to steak tartare than they expect.",
    },
  },
  {
    name_ko: "과메기",
    name_en: "Gwamegi (wind-dried herring or saury)",
    desc: {
      ko: "겨울에 청어나 꽁치를 얼렸다 녹였다 반복해 말린 포항 지역 별미. 향이 강해서 한국인 중에서도 호불호가 갈리는, 진짜 '로컬 중의 로컬' 메뉴예요.",
      en: "A Pohang winter specialty — fish repeatedly frozen and thawed outdoors until wind-dried. The smell is strong enough that even Koreans are split on it, which is exactly what makes it a true local's-only dish.",
    },
  },
];
