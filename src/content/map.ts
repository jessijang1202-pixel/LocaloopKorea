// Map page data, moved verbatim from map/page.tsx.

export const ITAEWON = { lat: 37.534, lng: 126.9946 };

// Incheon International Airport — the app's new default origin: where a
// newly-arrived foreigner actually lands, used for the /intro home screen
// and as the fallback origin for the task-filtered map (replacing Itaewon
// for that flow specifically; /map's own "이태원 PICK" section keeps its
// existing Itaewon anchor unchanged).
export const INCHEON_AIRPORT = { lat: 37.4602, lng: 126.4407 };

export type FilterKey = "all" | "english" | "S" | "restaurant" | "cafe";

export const CHIPS: { key: FilterKey; ko: string; en: string; hasIcon?: boolean }[] = [
  { key: "all",        ko: "전체",    en: "All" },
  { key: "english",    ko: "영어 OK", en: "English OK", hasIcon: true },
  { key: "S",          ko: "S등급",   en: "S Grade" },
  { key: "restaurant", ko: "음식점",   en: "Food" },
  { key: "cafe",       ko: "카페",    en: "Café" },
];

// Real travel times & distances from Itaewon
export const TRAVEL_INFO: Record<string, { ko: string; en: string; dist: string }> = {
  p1: { ko: "지하철 28분", en: "Subway 28 min", dist: "7.0km" },
  p2: { ko: "지하철 33분", en: "Subway 33 min", dist: "4.1km" },
  p3: { ko: "지하철 26분", en: "Subway 26 min", dist: "6.0km" },
  p4: { ko: "지하철 30분", en: "Subway 30 min", dist: "5.3km" },
  p5: { ko: "지하철 24분", en: "Subway 24 min", dist: "5.6km" },
  p6: { ko: "KTX 2시간 30분", en: "KTX 2h 30min", dist: "325km" },
  p7: { ko: "도보 12분", en: "Walk 12 min", dist: "850m" },
  p8: { ko: "도보 9분", en: "Walk 9 min", dist: "650m" },
  p9:  { ko: "도보 15분", en: "Walk 15 min",  dist: "1.1km" },
  p10: { ko: "도보 8분",  en: "Walk 8 min",   dist: "600m"  },
  p11: { ko: "도보 3분",  en: "Walk 3 min",   dist: "250m"  },
  p12: { ko: "버스 15분", en: "Bus 15 min",   dist: "2.2km" },
};

export const HOT_PLACE_IDS = ["p7", "p8", "p9", "p10", "p11", "p12"];
