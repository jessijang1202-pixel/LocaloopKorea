"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepTypeSelect } from "@/components/onboarding/StepTypeSelect";
import { StepRegionSelect } from "@/components/onboarding/StepRegionSelect";
import { StepInterestsSelect } from "@/components/onboarding/StepInterestsSelect";
import { StepBio } from "@/components/onboarding/StepBio";
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
    <main className="min-h-dvh flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-[var(--muted)]">
        <div
          className="h-full bg-[var(--primary)] transition-all duration-300"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      <div className="px-6 pt-4 pb-2">
        <p className="text-xs text-[var(--muted-foreground)]">
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
    </main>
  );
}
