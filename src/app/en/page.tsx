import LandingTemplate from "@/components/landing/LandingTemplate";
import { EN } from "@/components/landing/content";

export const metadata = {
  title: "Localoop Korea — Seoul living guide for foreigners",
  description: "Find foreigner-friendly places, food guides, life tips, and meetups in Seoul. Free.",
};

export default function EnglishLandingPage() {
  return <LandingTemplate data={EN} />;
}
