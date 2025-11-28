"use client";

import { useState } from "react";
import { WelcomeStep } from "./_components/steps/WelcomeStep";
import { FeaturesStep } from "./_components/steps/FeaturesStep";
import { CommunityStep } from "./_components/steps/CommunityStep";

const steps = [WelcomeStep, FeaturesStep, CommunityStep];

export default function OpeningPage() {
    const [index, setIndex] = useState(0);

    const handleNext = () => {
        setIndex((i) => Math.min(i + 1, steps.length - 1));
    };

    const CurrentStep = steps[index];

    return (
        <main className="h-screen flex flex-col">
            <CurrentStep onNext={handleNext} currentStep={index} />
        </main>
    );
}
