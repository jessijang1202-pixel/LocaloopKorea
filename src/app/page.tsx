import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LandingTemplate from "@/components/landing/LandingTemplate";
import { KO } from "@/components/landing/content";

export const metadata = {
  title: "로컬루프 코리아 — 외국인을 위한 AI 한국 생활 내비게이션",
  description: "한국에 사는 외국인을 위한 AI 플랫폼. 외국인 친화도 S~D 등급 장소, 단계별 생활 과업 안내, 로컬 경험 코스, 실시간 커뮤니티.",
  themeColor: "#1EC8C8",
};

export default async function KoreanLandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/map");

  return <LandingTemplate data={KO} />;
}
