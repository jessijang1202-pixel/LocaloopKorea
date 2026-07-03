// Onboarding temporarily hidden for public launch — redirect to map.
// Restore the original content from git history when ready to re-enable.
import { redirect } from "next/navigation";

export default function IntroPage() {
  redirect("/map");
}
