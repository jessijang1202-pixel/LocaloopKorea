import LandingTemplate from "@/components/landing/LandingTemplate";
import { EN } from "@/components/landing/content";

export const metadata = {
  title: "Localoop Korea — AI Life Navigation for Foreigners in Korea",
  description: "AI-powered platform for foreigners in Korea. Foreigner-friendly places rated S~D, step-by-step life task guides, local experience courses, and real community connections.",
  themeColor: "#1EC8C8",
};

export default function EnglishLandingPage() {
  return <LandingTemplate data={EN} />;
}
