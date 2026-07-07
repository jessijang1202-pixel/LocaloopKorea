import type { Bi } from "@/types/content";

// Single source for course data.
//
// The list page (courses/page.tsx) and detail page (courses/[slug]/page.tsx)
// previously held separate datasets (COURSES and COURSE_DATA). Their overlapping
// fields (slug, name, meta, badge, color, accent, englishOk, image) were verified
// byte-identical across all courses, so they are merged here into one superset
// array. The list page derives its lighter shape; the detail page reads the full
// record (tagline, duration, difficulty, stops).

export interface CourseStop {
  name: Bi;
  type: Bi;
  duration: Bi;
  tip: Bi;
  placeSlug?: string;
}

export interface Course {
  id: string;
  slug: string;
  name: Bi;
  tagline: Bi;
  meta: Bi;
  duration: Bi;
  difficulty: Bi;
  badge: Bi;
  color: string;
  accent: string;
  englishOk: boolean;
  filter: string;
  image?: string;
  stops: CourseStop[];
}

export const COURSES: Course[] = [
  {
    id: "c1",
    slug: "itaewon-food",
    name: { ko: "이태원 로컬 맛집 반나절 코스", en: "Itaewon Local Food Half-Day" },
    tagline: { ko: "현지인만 아는 이태원 숨은 맛집 3곳", en: "3 hidden gems only locals know in Itaewon" },
    meta: { ko: "3곳 · 약 3시간", en: "3 stops · ~3 hrs" },
    duration: { ko: "3시간", en: "3 hours" },
    difficulty: { ko: "쉬움", en: "Easy" },
    badge: { ko: "오늘의 코스", en: "Today's Pick" },
    color: "#F5D6D6", accent: "#C0350F",
    englishOk: true, filter: "Half-Day",
    image: "/itaewon_street.png",
    stops: [
      { name: { ko: "앤트러사이트 홍대", en: "Anthracite Hongdae" }, type: { ko: "카페", en: "Café" }, duration: { ko: "40분", en: "40 min" }, tip: { ko: "공장을 개조한 감성 카페. 에스프레소 추천!", en: "Factory-converted café. Try the espresso!" }, placeSlug: "anthracite-hongdae" },
      { name: { ko: "광장시장", en: "Gwangjang Market" }, type: { ko: "시장", en: "Market" }, duration: { ko: "60분", en: "60 min" }, tip: { ko: "빈대떡과 마약 김밥을 꼭 드세요", en: "Don't miss the bindaetteok and mayak kimbap" }, placeSlug: "gwangjang-market" },
      { name: { ko: "더 현대 서울", en: "The Hyundai Seoul" }, type: { ko: "쇼핑", en: "Shopping" }, duration: { ko: "60분", en: "60 min" }, tip: { ko: "지하 식품관 꼭 들러보세요", en: "The B1 food hall is a must-visit" }, placeSlug: "the-hyundai-seoul" },
    ],
  },
  {
    id: "c2",
    slug: "hannam-gallery",
    name: { ko: "한남동 갤러리 & 카페 투어", en: "Hannam Gallery & Café Tour" },
    tagline: { ko: "예술과 커피를 함께 즐기는 한남동 오후", en: "An artsy afternoon in Hannam-dong" },
    meta: { ko: "4곳 · 약 4시간", en: "4 stops · ~4 hrs" },
    duration: { ko: "4시간", en: "4 hours" },
    difficulty: { ko: "쉬움", en: "Easy" },
    badge: { ko: "문화", en: "Culture" },
    color: "#DDE4FF", accent: "#234BFF",
    englishOk: true, filter: "Culture",
    image: "/hannam_gallery.png",
    stops: [
      { name: { ko: "성수연방", en: "Seongsu Yeonbang" }, type: { ko: "복합공간", en: "Cultural Space" }, duration: { ko: "60분", en: "60 min" }, tip: { ko: "다양한 편집숍과 갤러리가 모여있어요", en: "A curated mix of boutiques and galleries" }, placeSlug: "seongsu-yeonbang" },
      { name: { ko: "갤러리 산책", en: "Gallery Walk" }, type: { ko: "갤러리", en: "Gallery" }, duration: { ko: "60분", en: "60 min" }, tip: { ko: "한남동 골목의 소규모 갤러리들을 둘러보세요", en: "Explore the small galleries in Hannam alleys" } },
      { name: { ko: "카페 브런치", en: "Café Brunch" }, type: { ko: "카페", en: "Café" }, duration: { ko: "60분", en: "60 min" }, tip: { ko: "한남동에는 감각적인 카페가 많아요", en: "Hannam has some of Seoul's most stylish cafés" } },
      { name: { ko: "이태원 쇼핑", en: "Itaewon Shopping" }, type: { ko: "쇼핑", en: "Shopping" }, duration: { ko: "60분", en: "60 min" }, tip: { ko: "개성 넘치는 빈티지숍들이 많아요", en: "Lots of unique vintage and independent shops" } },
    ],
  },
  {
    id: "c3",
    slug: "itaewon-night",
    name: { ko: "이태원 나이트 로컬 투어", en: "Itaewon Night Local Tour" },
    tagline: { ko: "이태원의 밤을 제대로 즐기는 법", en: "How to experience Itaewon after dark" },
    meta: { ko: "3곳 · 약 4시간", en: "3 stops · ~4 hrs" },
    duration: { ko: "4시간", en: "4 hours" },
    difficulty: { ko: "보통", en: "Moderate" },
    badge: { ko: "나이트", en: "Nightlife" },
    color: "#2D1F4A", accent: "#8A63FF",
    englishOk: false, filter: "Full Day",
    image: "/itaewon_night.png",
    stops: [
      { name: { ko: "이태원 한식당", en: "Korean Dinner in Itaewon" }, type: { ko: "식당", en: "Restaurant" }, duration: { ko: "90분", en: "90 min" }, tip: { ko: "삼겹살과 소주로 저녁을 시작하세요", en: "Start the evening with samgyeopsal and soju" } },
      { name: { ko: "루프탑 바", en: "Rooftop Bar" }, type: { ko: "바", en: "Bar" }, duration: { ko: "60분", en: "60 min" }, tip: { ko: "서울 야경이 보이는 루프탑을 선택하세요", en: "Pick a rooftop with Seoul skyline views" } },
      { name: { ko: "이태원 클럽 거리", en: "Itaewon Club Street" }, type: { ko: "나이트라이프", en: "Nightlife" }, duration: { ko: "90분+", en: "90 min+" }, tip: { ko: "다양한 국적의 사람들과 자유롭게 어울릴 수 있어요", en: "A truly international crowd — very welcoming" } },
    ],
  },
  {
    id: "c4",
    slug: "namsan-morning",
    name: { ko: "남산 아침 산책 코스", en: "Namsan Morning Walk" },
    tagline: { ko: "서울 전경을 보며 시작하는 하루", en: "Start your day with Seoul's best view" },
    meta: { ko: "2곳 · 약 2시간", en: "2 stops · ~2 hrs" },
    duration: { ko: "2시간", en: "2 hours" },
    difficulty: { ko: "쉬움", en: "Easy" },
    badge: { ko: "자연", en: "Nature" },
    color: "#D6F0D6", accent: "#12A05A",
    englishOk: true, filter: "Nature",
    image: "/namsan_morning.png",
    stops: [
      { name: { ko: "남산 서울타워", en: "N Seoul Tower" }, type: { ko: "명소", en: "Landmark" }, duration: { ko: "60분", en: "60 min" }, tip: { ko: "아침 일찍 가면 사람이 적어요. 자물쇠 다리도 보세요", en: "Go early to avoid crowds. See the love lock bridge" } },
      { name: { ko: "남산 산책로", en: "Namsan Trail" }, type: { ko: "자연", en: "Nature" }, duration: { ko: "60분", en: "60 min" }, tip: { ko: "케이블카 대신 걸어 올라가면 더 좋아요", en: "Walking up beats the cable car for the experience" } },
    ],
  },
  {
    id: "c5",
    slug: "seongsu-craft",
    name: { ko: "성수 공방 & 로스터리 투어", en: "Seongsu Craft & Roastery Tour" },
    tagline: { ko: "힙한 성수동의 커피와 공방 탐방", en: "Explore Seongsu's craft workshops and coffee" },
    meta: { ko: "4곳 · 약 3시간", en: "4 stops · ~3 hrs" },
    duration: { ko: "3시간", en: "3 hours" },
    difficulty: { ko: "쉬움", en: "Easy" },
    badge: { ko: "AI 추천", en: "AI Pick" },
    color: "#FFF0D6", accent: "#B87000",
    englishOk: true, filter: "Half-Day",
    image: "/seongsu_craft.png",
    stops: [
      { name: { ko: "성수연방", en: "Seongsu Yeonbang" }, type: { ko: "복합공간", en: "Cultural Space" }, duration: { ko: "45분", en: "45 min" }, tip: { ko: "성수동 힙스터 문화의 중심지", en: "The heart of Seongsu's hipster culture" }, placeSlug: "seongsu-yeonbang" },
      { name: { ko: "로스터리 카페", en: "Specialty Roastery" }, type: { ko: "카페", en: "Café" }, duration: { ko: "45분", en: "45 min" }, tip: { ko: "스페셜티 커피 한 잔은 필수", en: "A specialty coffee is non-negotiable here" } },
      { name: { ko: "가죽 공방", en: "Leather Workshop" }, type: { ko: "공방", en: "Workshop" }, duration: { ko: "45분", en: "45 min" }, tip: { ko: "간단한 체험 프로그램을 운영하는 공방들이 많아요", en: "Many workshops offer short hands-on sessions" } },
      { name: { ko: "성수 편집숍", en: "Seongsu Boutiques" }, type: { ko: "쇼핑", en: "Shopping" }, duration: { ko: "45분", en: "45 min" }, tip: { ko: "개성 있는 국내 디자이너 브랜드를 발견해보세요", en: "Discover unique Korean indie designer brands" } },
    ],
  },
];

// Detail lookup keyed by slug, derived from COURSES (preserves detail page's map access).
export const COURSE_DATA: Record<string, Course> = Object.fromEntries(
  COURSES.map((c) => [c.slug, c])
);
