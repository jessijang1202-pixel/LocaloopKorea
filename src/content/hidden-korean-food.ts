// "한국인만 아는 한국음식" — dishes that are everyday food for Koreans but
// rarely show up on a foreigner's radar (no K-BBQ, kimchi, or bibimbap here —
// those already have plenty of visibility). Curated, hand-authored content,
// not sourced from the collected-places dataset.
//
// Photos are Wikimedia Commons files (CC-licensed), fetched at a fixed
// Wikimedia-approved thumbnail width (500px — arbitrary widths 429/400 under
// their thumbnail policy, see https://w.wiki/GHai). Each URL was verified to
// return HTTP 200 before being added here.

import type { Bi } from "@/types/content";

export interface HiddenFoodItem {
  slug: string;
  name_ko: string;
  name_en: string; // romanization + short English gloss
  // Optional — a couple of dishes (오리주물럭) have no accurately-tagged
  // Wikimedia Commons photo, so the card falls back to a gradient/initial
  // rather than risk an inaccurate or mislabeled image.
  imageUrl?: string;
  mainIngredients: Bi; // short phrase, not a full list
  cookingMethod: Bi;
  spiceLevel: 0 | 1 | 2 | 3; // 0 not spicy .. 3 very spicy
  desc: Bi; // why it's good + why foreigners rarely encounter it
}

export const HIDDEN_KOREAN_FOODS: HiddenFoodItem[] = [
  {
    slug: "sundae-guk",
    name_ko: "순대국",
    name_en: "Sundae-guk (blood sausage soup)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Korean_blood_sausage-Sundae-01.jpg/500px-Korean_blood_sausage-Sundae-01.jpg",
    mainIngredients: { ko: "순대, 돼지 내장, 국물", en: "Blood sausage, pork offal, broth" },
    cookingMethod: { ko: "끓임", en: "Boiled" },
    spiceLevel: 1,
    desc: {
      ko: "찹쌀과 선지를 채운 순대와 돼지 내장을 푹 끓인 국. 한국인에게는 흔한 해장 메뉴지만 재료 설명만 들으면 외국인은 선뜻 시도하기 어려워해요. 관광지 식당엔 거의 없고, 동네 노포에서만 팔아요.",
      en: "A hearty soup of blood sausage and pork offal. A classic Korean hangover food, but the ingredient list alone scares most foreigners off before they try it. You won't find it in tourist-area restaurants — only in neighborhood spots.",
    },
  },
  {
    slug: "baekban",
    name_ko: "백반",
    name_en: "Baekban (daily home-style set meal)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Korean_cuisine-Baekban-01.jpg/500px-Korean_cuisine-Baekban-01.jpg",
    mainIngredients: { ko: "밥, 반찬, 국", en: "Rice, side dishes, soup" },
    cookingMethod: { ko: "다양한 조리법", en: "Mixed home cooking" },
    spiceLevel: 1,
    desc: {
      ko: "그날그날 바뀌는 밑반찬과 국이 함께 나오는 가정식 정식. 메뉴판에 사진도 없고 영어 표기도 드물어서, 정작 가장 '진짜 한국 집밥'에 가까운데도 외국인은 잘 못 찾아요.",
      en: "A home-style set meal with rotating daily side dishes and soup. No photos on the menu, rarely any English — which is exactly why it's the most authentic 'Korean home cooking' you can get, and also why foreigners walk right past it.",
    },
  },
  {
    slug: "kong-guksu",
    name_ko: "콩국수",
    name_en: "Kong-guksu (cold soybean noodle soup)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Korean_noodles-Kongguksu-01.jpg/500px-Korean_noodles-Kongguksu-01.jpg",
    mainIngredients: { ko: "콩국물, 국수", en: "Soybean broth, noodles" },
    cookingMethod: { ko: "차가운 국물", en: "Cold broth" },
    spiceLevel: 0,
    desc: {
      ko: "진한 콩국물에 국수를 말아 차갑게 먹는 여름 별미. 고소하고 든든한데, 존재 자체를 모르는 외국인이 대부분이에요. 여름 한정 메뉴라 시기를 놓치면 못 먹어요.",
      en: "Cold noodles in a thick, nutty soybean broth — a summer specialty. Most foreigners don't even know it exists, and it's seasonal, so missing the window means waiting until next summer.",
    },
  },
  {
    slug: "gamjatang",
    name_ko: "감자탕",
    name_en: "Gamjatang (pork bone & potato stew)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Korean_soup-Gamjatang-01.jpg/500px-Korean_soup-Gamjatang-01.jpg",
    mainIngredients: { ko: "돼지 등뼈, 감자, 우거지", en: "Pork spine, potatoes, napa cabbage" },
    cookingMethod: { ko: "끓임", en: "Stewed" },
    spiceLevel: 2,
    desc: {
      ko: "돼지 등뼈와 감자를 얼큰하게 끓인 탕. 술자리 다음 날 해장 메뉴로 한국인에게 인기지만, 뼈를 발라 먹는 방식이 낯설어 외국인 방문객이 적어요.",
      en: "A spicy stew of pork spine and potatoes — a go-to hangover cure for Koreans. Picking meat off the bone by hand is unfamiliar territory for most visitors, so it stays a local favorite.",
    },
  },
  {
    slug: "yukhoe",
    name_ko: "육회",
    name_en: "Yukhoe (Korean beef tartare)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Korean_seasoned_raw_beef-Yukhoe.jpg/500px-Korean_seasoned_raw_beef-Yukhoe.jpg",
    mainIngredients: { ko: "생 소고기, 배, 마늘", en: "Raw beef, pear, garlic" },
    cookingMethod: { ko: "날것 무침", en: "Raw, seasoned" },
    spiceLevel: 0,
    desc: {
      ko: "신선한 생 우육을 배·마늘·참기름과 무친 요리. 날고기라는 이유로 시도조차 안 해보는 외국인이 많은데, 잘하는 집에서 먹으면 부드럽고 고소해요.",
      en: "Fresh raw beef tossed with pear, garlic, and sesame oil. Many foreigners rule it out on sight because it's raw — but at a good restaurant it's silky and rich, closer to steak tartare than they expect.",
    },
  },
  {
    slug: "gwamegi",
    name_ko: "과메기",
    name_en: "Gwamegi (wind-dried herring or saury)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Gwamegi.jpg/500px-Gwamegi.jpg",
    mainIngredients: { ko: "청어 또는 꽁치, 미역, 쪽파", en: "Herring or saury, seaweed, scallion" },
    cookingMethod: { ko: "바람에 말림", en: "Wind-dried" },
    spiceLevel: 0,
    desc: {
      ko: "겨울에 청어나 꽁치를 얼렸다 녹였다 반복해 말린 포항 지역 별미. 향이 강해서 한국인 중에서도 호불호가 갈리는, 진짜 '로컬 중의 로컬' 메뉴예요.",
      en: "A Pohang winter specialty — fish repeatedly frozen and thawed outdoors until wind-dried. The smell is strong enough that even Koreans are split on it, which is exactly what makes it a true local's-only dish.",
    },
  },
  {
    slug: "dwaeji-gukbap",
    name_ko: "돼지국밥",
    name_en: "Dwaeji-gukbap (pork & rice soup)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Dwaeji-gukbap.jpg/500px-Dwaeji-gukbap.jpg",
    mainIngredients: { ko: "돼지고기, 뼈 육수, 밥", en: "Pork, bone broth, rice" },
    cookingMethod: { ko: "끓임", en: "Boiled" },
    spiceLevel: 1,
    desc: {
      ko: "돼지 뼈와 고기를 오래 우린 국물에 밥을 만 부산 대표 음식. 새우젓으로 간을 맞추는 게 특징인데, 낯선 향 때문에 시도를 꺼리는 외국인이 많아요.",
      en: "A Busan specialty of rice in a long-simmered pork bone broth, seasoned with salted shrimp. The unfamiliar smell alone is enough to make most foreigners hesitate before trying it.",
    },
  },
  {
    slug: "dakbal",
    name_ko: "닭발",
    name_en: "Dakbal (spicy grilled chicken feet)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Chicken_feet_2.jpg/500px-Chicken_feet_2.jpg",
    mainIngredients: { ko: "닭발, 고춧가루 양념", en: "Chicken feet, chili sauce" },
    cookingMethod: { ko: "볶음 또는 구움", en: "Stir-fried or grilled" },
    spiceLevel: 3,
    desc: {
      ko: "매콤하게 양념해 구운 닭발. 술안주로 한국인에게 인기지만, 뼈째 씹어먹는 방식과 강한 매운맛 때문에 외국인은 거의 시도하지 않아요.",
      en: "Spicy grilled chicken feet, a beloved Korean drinking snack. Gnawing meat off tiny bones and the fierce heat level keep most foreigners from ever trying it.",
    },
  },
  {
    slug: "gopchang-makchang",
    name_ko: "곱창/막창",
    name_en: "Gopchang/Makchang (grilled intestines)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Gopchang_2.jpg/500px-Gopchang_2.jpg",
    mainIngredients: { ko: "소 또는 돼지 내장", en: "Beef or pork intestines" },
    cookingMethod: { ko: "구움", en: "Grilled" },
    spiceLevel: 1,
    desc: {
      ko: "소·돼지 내장을 숯불에 구워 먹는 요리. 손질이 잘 된 곳에서 먹으면 쫄깃하고 고소한데, '내장'이라는 이유만으로 메뉴판도 못 펼쳐보는 외국인이 많아요.",
      en: "Grilled beef or pork intestines over charcoal. Done right, it's chewy and rich — but the word 'intestines' alone stops most foreigners from even opening the menu.",
    },
  },
  {
    slug: "samgyetang",
    name_ko: "삼계탕",
    name_en: "Samgyetang (ginseng chicken soup)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Dish_of_Samgyetang.jpg/500px-Dish_of_Samgyetang.jpg",
    mainIngredients: { ko: "영계, 인삼, 찹쌀, 대추", en: "Young chicken, ginseng, glutinous rice, jujube" },
    cookingMethod: { ko: "끓임", en: "Boiled" },
    spiceLevel: 0,
    desc: {
      ko: "어린 닭 속에 인삼·찹쌀·대추를 채워 끓인 보양식. 삼복더위에 뜨거운 국물을 먹는 문화 자체가 낯설어서, 이름은 알아도 실제로 먹어본 외국인은 적어요.",
      en: "A whole young chicken stuffed with ginseng, glutinous rice, and jujube, simmered as a summer vitality tonic. Eating scalding soup on the hottest days of the year is a very Korean idea — most foreigners know the name but have never actually tried it.",
    },
  },
  {
    slug: "seonji-gukbap",
    name_ko: "선지국밥",
    name_en: "Seonji-gukbap (ox blood & rice soup)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Seonji-guk.jpg/500px-Seonji-guk.jpg",
    mainIngredients: { ko: "선지, 소 육수, 밥", en: "Ox blood, beef broth, rice" },
    cookingMethod: { ko: "끓임", en: "Boiled" },
    spiceLevel: 1,
    desc: {
      ko: "소의 선지(피)를 굳혀 넣고 끓인 해장국. 순대국과 비슷해 보이지만 선지 함량이 훨씬 높아서, 재료를 알고 나면 더 도전하기 어려워하는 메뉴예요.",
      en: "A hangover soup built around coagulated ox blood. It looks similar to sundae-guk but has far more blood in it — once foreigners learn what's in the bowl, it gets even harder to talk them into a spoonful.",
    },
  },
  {
    slug: "kkomjangeo",
    name_ko: "꼼장어",
    name_en: "Kkomjangeo (grilled hagfish)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Korean_cuisine-Kkomjangeo_bokkeum-01.jpg/500px-Korean_cuisine-Kkomjangeo_bokkeum-01.jpg",
    mainIngredients: { ko: "먹장어, 고추장 양념", en: "Hagfish, gochujang sauce" },
    cookingMethod: { ko: "볶음 또는 구움", en: "Stir-fried or grilled" },
    spiceLevel: 2,
    desc: {
      ko: "껍질 벗긴 먹장어를 매콤하게 볶거나 구운 부산·경상도 명물. 장어와는 다른 미끌미끌한 식감 때문에 현지인도 호불호가 갈리는, 그야말로 로컬 중의 로컬 메뉴예요.",
      en: "Skinned hagfish, stir-fried or grilled with a spicy sauce — a Busan and Gyeongsang-do specialty. The slippery texture (different from regular eel) splits even locals, making it about as local as local food gets.",
    },
  },
  {
    slug: "hongeo",
    name_ko: "홍어",
    name_en: "Hongeo (fermented skate)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Hongeo.jpg/500px-Hongeo.jpg",
    mainIngredients: { ko: "삭힌 홍어", en: "Fermented skate" },
    cookingMethod: { ko: "발효", en: "Fermented" },
    spiceLevel: 0,
    desc: {
      ko: "삭혀서 톡 쏘는 암모니아 향이 나는 전라도 발효 음식. 한국인 중에도 못 먹는 사람이 많을 만큼 향이 강렬해서, 외국인에게는 거의 알려지지 않았어요.",
      en: "Fermented skate from Jeolla-do with a sharp ammonia bite. The smell is intense enough that plenty of Koreans can't handle it either — it barely registers on most foreigners' radar at all.",
    },
  },
  {
    slug: "samhap",
    name_ko: "삼합",
    name_en: "Samhap (skate + pork belly + kimchi)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Korean_cuisine-Samhap-01.jpg/500px-Korean_cuisine-Samhap-01.jpg",
    mainIngredients: { ko: "홍어, 삶은 돼지고기, 묵은지", en: "Fermented skate, boiled pork belly, aged kimchi" },
    cookingMethod: { ko: "조합 (찜+발효+숙성)", en: "Combined raw, steamed & fermented" },
    spiceLevel: 1,
    desc: {
      ko: "홍어·삶은 돼지고기·묵은지를 한 입에 싸 먹는 전라도 잔치 음식. 홍어의 향과 낯선 조합 때문에 외국인은 존재조차 모르는 경우가 대부분이에요.",
      en: "A Jeolla-do celebration bite combining fermented skate, boiled pork belly, and aged kimchi in one wrap. Between the skate's smell and the unusual combo, most foreigners don't even know this exists.",
    },
  },
  {
    slug: "dwaeji-kkeopdegi",
    name_ko: "돼지껍데기",
    name_en: "Dwaeji-kkeopdegi (grilled pork skin)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Kkeopdegi.jpg/500px-Kkeopdegi.jpg",
    mainIngredients: { ko: "돼지 껍데기, 고춧가루 양념", en: "Pork skin, chili sauce" },
    cookingMethod: { ko: "볶음", en: "Stir-fried" },
    spiceLevel: 2,
    desc: {
      ko: "콜라겐 가득한 돼지 껍데기를 매콤하게 볶아 먹는 술안주. 쫄깃한 식감이 매력인데, '껍데기'라는 이름만 듣고 지레 겁먹는 외국인이 많아요.",
      en: "Collagen-rich pork skin, stir-fried with a spicy glaze — a classic drinking snack. The chewy texture is the whole point, but the word 'skin' alone scares most foreigners off before they taste it.",
    },
  },
  {
    slug: "sannakji",
    name_ko: "산낙지",
    name_en: "Sannakji (live octopus)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Sannakji.jpg/500px-Sannakji.jpg",
    mainIngredients: { ko: "살아있는 낙지, 참기름", en: "Live octopus, sesame oil" },
    cookingMethod: { ko: "날것", en: "Raw" },
    spiceLevel: 0,
    desc: {
      ko: "살아 움직이는 낙지를 잘라 참기름에 버무려 먹는 요리. 빨판이 입 안에서 움직이는 느낌 때문에 유튜브로는 봤어도 직접 먹어본 외국인은 드물어요.",
      en: "Live octopus, cut and tossed in sesame oil while the suction cups are still moving. Plenty of foreigners have seen it on YouTube — almost none have actually eaten it.",
    },
  },
  {
    slug: "jjolmyeon",
    name_ko: "쫄면",
    name_en: "Jjolmyeon (chewy spicy cold noodles)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Boiled_jjolmyeon.jpg/500px-Boiled_jjolmyeon.jpg",
    mainIngredients: { ko: "쫄깃한 면, 고추장 양념, 채소", en: "Chewy noodles, gochujang sauce, vegetables" },
    cookingMethod: { ko: "비빔", en: "Tossed / mixed" },
    spiceLevel: 2,
    desc: {
      ko: "아주 쫄깃한 면발에 새콤달콤 매운 양념을 비벼 먹는 분식집 메뉴. 냉면과 헷갈려 지나치기 쉬운데, 식감부터 완전히 다른 로컬 별미예요.",
      en: "Extra-chewy noodles tossed in a sweet-spicy-tangy sauce — a snack-shop staple. Easy to mistake for naengmyeon and walk right past, but the texture alone makes it a completely different, very local dish.",
    },
  },
  {
    slug: "milmyeon",
    name_ko: "밀면",
    name_en: "Milmyeon (Busan wheat cold noodles)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Busan_Milmyeon_20200522_001.jpg/500px-Busan_Milmyeon_20200522_001.jpg",
    mainIngredients: { ko: "밀가루 면, 육수, 편육", en: "Wheat noodles, broth, sliced meat" },
    cookingMethod: { ko: "차가운 국물 또는 비빔", en: "Cold broth or tossed" },
    spiceLevel: 1,
    desc: {
      ko: "밀가루 면을 시원한 육수에 말아 먹는 부산의 여름 별미. 냉면의 사촌 격이지만 부산을 벗어나면 잘 안 보여서, 다른 지역 외국인은 접할 기회 자체가 적어요.",
      en: "Wheat noodles in a cold savory broth — a Busan summer specialty, naengmyeon's cousin. It rarely shows up outside Busan, so foreigners elsewhere simply never get the chance to try it.",
    },
  },
  {
    slug: "kalguksu",
    name_ko: "칼국수",
    name_en: "Kalguksu (hand-cut knife noodles)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Korean_noodles-Kalguksu-01.jpg/500px-Korean_noodles-Kalguksu-01.jpg",
    mainIngredients: { ko: "칼로 썬 면, 멸치 육수", en: "Knife-cut noodles, anchovy broth" },
    cookingMethod: { ko: "끓임", en: "Boiled" },
    spiceLevel: 0,
    desc: {
      ko: "밀가루 반죽을 칼로 썰어 육수에 끓인 국수. 한국인에게는 편안한 집밥 메뉴인데, 메뉴판에 사진이 드물어 외국인은 잘 주문하지 않아요.",
      en: "Wheat dough hand-cut with a knife and simmered in broth. It's ultimate comfort food for Koreans, but menus rarely have photos, so foreigners tend to order around it.",
    },
  },
  {
    slug: "jogae-gui",
    name_ko: "조개구이",
    name_en: "Jogae-gui (grilled shellfish)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Jogae-gui.jpg/500px-Jogae-gui.jpg",
    mainIngredients: { ko: "다양한 조개류", en: "Assorted shellfish" },
    cookingMethod: { ko: "구움", en: "Grilled" },
    spiceLevel: 0,
    desc: {
      ko: "다양한 조개를 불판에 올려 그대로 구워 먹는 해산물 요리. 껍데기째 손으로 까먹어야 해서, 먹는 방법을 몰라 시도 자체를 못 하는 외국인이 많아요.",
      en: "An assortment of shellfish grilled right on the table, shells and all. Not knowing how to crack them open by hand stops a lot of foreigners before they even start.",
    },
  },
  {
    slug: "gul-jjim",
    name_ko: "굴찜",
    name_en: "Gul-jjim (steamed oysters)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Steamed_oyster_%284440062341%29.jpg/500px-Steamed_oyster_%284440062341%29.jpg",
    mainIngredients: { ko: "굴, 초고추장", en: "Oysters, spicy vinegar sauce" },
    cookingMethod: { ko: "찜", en: "Steamed" },
    spiceLevel: 1,
    desc: {
      ko: "껍데기째 쪄낸 굴을 초고추장에 찍어 먹는 겨울 별미. 생굴은 알아도 찜으로 먹는 방식은 몰라서 그냥 지나치는 외국인이 많아요.",
      en: "Oysters steamed in the shell, dipped in spicy vinegar-chili sauce — a winter specialty. Foreigners know raw oysters but rarely realize steaming is even an option, and walk right past it.",
    },
  },
  {
    slug: "honggye-jjim",
    name_ko: "홍게찜",
    name_en: "Honggye-jjim (steamed red snow crab)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Boiled_Echizen_crab_%28snow_crab%29_male_and_female.jpg/500px-Boiled_Echizen_crab_%28snow_crab%29_male_and_female.jpg",
    mainIngredients: { ko: "붉은대게", en: "Red snow crab" },
    cookingMethod: { ko: "찜", en: "Steamed" },
    spiceLevel: 0,
    desc: {
      ko: "동해에서 잡은 붉은대게를 통째로 쪄낸 요리. 대게보다 저렴하면서도 맛은 비슷해 한국인에게는 가성비 별미지만, 관광지 메뉴판엔 잘 없어요.",
      en: "Red snow crab from the East Sea, steamed whole. Cheaper than king crab with similar flavor — a great-value local favorite that rarely makes it onto a tourist menu.",
    },
  },
  {
    slug: "ori-baeksuk",
    name_ko: "오리백숙",
    name_en: "Ori-baeksuk (whole duck soup)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/%EC%98%A4%EB%A6%AC%ED%83%95_%EC%82%AC%EC%A7%84.jpg/500px-%EC%98%A4%EB%A6%AC%ED%83%95_%EC%82%AC%EC%A7%84.jpg",
    mainIngredients: { ko: "오리, 한약재, 찹쌀", en: "Duck, medicinal herbs, glutinous rice" },
    cookingMethod: { ko: "끓임", en: "Boiled" },
    spiceLevel: 0,
    desc: {
      ko: "오리 한 마리를 인삼·황기 등 한약재와 통째로 푹 고아낸 보양식. 삼계탕의 오리 버전인데, 삼계탕보다도 훨씬 덜 알려져 있어요.",
      en: "A whole duck slow-simmered with ginseng and other medicinal herbs — the duck version of samgyetang, and even less known than samgyetang itself.",
    },
  },
  {
    slug: "ori-jumulleok",
    name_ko: "오리주물럭",
    name_en: "Ori-jumulleok (spicy stir-fried duck)",
    // No accurately Korea-tagged photo found on Wikimedia Commons after an
    // extensive search — omitted rather than risk a mislabeled image.
    mainIngredients: { ko: "오리고기, 고추장 양념, 채소", en: "Duck, gochujang sauce, vegetables" },
    cookingMethod: { ko: "볶음", en: "Stir-fried" },
    spiceLevel: 2,
    desc: {
      ko: "오리고기를 매콤한 양념에 재워 채소와 함께 볶아 먹는 요리. 닭갈비의 오리 버전 같은 메뉴인데, 오리고기 자체가 생소해서 외국인에게는 거의 안 알려져 있어요.",
      en: "Duck marinated in a spicy sauce and stir-fried with vegetables — think dakgalbi's duck cousin. Duck itself is an unfamiliar protein for most visitors, so this stays almost entirely off their radar.",
    },
  },
];
