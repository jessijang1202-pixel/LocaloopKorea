"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepTypeSelect } from "@/components/onboarding/StepTypeSelect";
import { StepRegionSelect } from "@/components/onboarding/StepRegionSelect";
import { StepInterestsSelect } from "@/components/onboarding/StepInterestsSelect";
import { StepBio } from "@/components/onboarding/StepBio";
import { OnboardingHero } from "@/components/onboarding/OnboardingHero";
import { SEED_REGIONS, SEED_INTERESTS } from "@/data/seed";
import { saveOnboarding } from "./actions";

export type OnboardingData = {
  userType: "foreigner" | "korean" | null;
  regionId: string | null;
  interestIds: string[];
  displayName: string;
  bio: string;
};

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    userType: null,
    regionId: null,
    interestIds: [],
    displayName: "",
    bio: "",
  });
  const [saving, setSaving] = useState(false);

  function next() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  async function finish(finalData: OnboardingData) {
    setSaving(true);
    await saveOnboarding(finalData);
    router.push("/home");
  }

  return (
    <main className="ob-shell">
      {/* ── Left panel: progress + step content ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Progress bar */}
        <div style={{ height: 4, background: "var(--muted)" }}>
          <div
            style={{
              height: "100%",
              background: "var(--primary)",
              width: `${(step / TOTAL_STEPS) * 100}%`,
              transition: "width 0.3s ease",
            }}
          />
        </div>

        {/* Hero image — mobile only */}
        <div className="ob-hero-mobile">
          <OnboardingHero />
        </div>

        {/* Step counter */}
        <div style={{ padding: "16px 24px 8px" }}>
          <p style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
            Step {step} of {TOTAL_STEPS}
          </p>
        </div>

        {step === 1 && (
          <StepTypeSelect
            value={data.userType}
            onChange={(userType) => {
              setData((d) => ({ ...d, userType }));
              next();
            }}
          />
        )}
        {step === 2 && (
          <StepRegionSelect
            regions={SEED_REGIONS}
            value={data.regionId}
            onChange={(regionId) => {
              setData((d) => ({ ...d, regionId }));
              next();
            }}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <StepInterestsSelect
            interests={SEED_INTERESTS}
            value={data.interestIds}
            onChange={(interestIds) => {
              setData((d) => ({ ...d, interestIds }));
              next();
            }}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && (
          <StepBio
            value={{ displayName: data.displayName, bio: data.bio }}
            onChange={(vals) => setData((d) => ({ ...d, ...vals }))}
            onBack={() => setStep(3)}
            onFinish={() => finish(data)}
            saving={saving}
          />
        )}
      </div>

      {/* ── Right panel: hero (PC only) ── */}
      <div className="ob-hero-desktop">
        <OnboardingHero />
      </div>
    </main>
  );
}
