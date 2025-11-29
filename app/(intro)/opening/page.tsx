"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WelcomeStep } from "./_components/steps/WelcomeStep";
import { FeaturesStep } from "./_components/steps/FeaturesStep";
import { CommunityStep } from "./_components/steps/CommunityStep";

const steps = [WelcomeStep, FeaturesStep, CommunityStep];

export default function OpeningPage() {
    const [index, setIndex] = useState(0);
    const router = useRouter();

    const handleNext = () => {
        if (index < steps.length - 1) {
            setIndex((i) => i + 1);
        } else {
            // Selesai opening, lanjut ke onboarding
            router.push('/onboarding');
        }
    };

    const CurrentStep = steps[index];

    return (
        <main className="h-screen flex flex-col">
            <CurrentStep onNext={handleNext} currentStep={index} />
        </main>
    );
}
