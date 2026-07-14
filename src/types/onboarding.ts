// Onboarding form data shape.
//
// Moved out of onboarding/page.tsx (a "use client" file) so that the server
// action in onboarding/actions.ts can import the type without pulling in a
// client component. Both onboarding/page.tsx and onboarding/actions.ts import
// OnboardingData from here.

export type OnboardingData = {
  isKorean: boolean;
  displayName: string;
  nationality: string;
  mainLanguage: string;
  gender: string;
  purpose: string;
  stayDuration: string;
  arrivedDuration: string; // client-only — feeds engine UserProfile.stayDays, not persisted to Supabase
  region: string;
  living: string;
  koreanLevel: string;
  interests: string[];
  makeFriends: boolean;
  languageExchange: boolean;
  joinMeetups: boolean;
  nearbyAlerts: boolean;
  marketing: boolean;
};
