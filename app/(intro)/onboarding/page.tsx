"use client";

import { useState } from "react";

import { NavigationHeader } from "./_components/NavigationHeader";
import { WelcomeStep } from "./_components/steps/WelcomeStep";
import { ProductCountStep } from "./_components/steps/ProductCountStep";
import { PurchaseMotivationStep } from "./_components/steps/PurchaseMotivationStep";
import { ExpiryCheckStep } from "./_components/steps/ExpiryCheckStep";
import { BeautyGoalStep } from "./_components/steps/BeautyGoalStep";
import { CompletionStep } from "./_components/steps/CompletionStep";

const steps = [WelcomeStep, ProductCountStep, PurchaseMotivationStep, ExpiryCheckStep, BeautyGoalStep, CompletionStep];
const total = steps.length - 1;

export default function OnboardingPage() {
    const [index, setIndex] = useState(0 as number);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const CurrentStep = steps[index];

    const handleNext = (answer: string) => {
        const updatedAnswers = { ...answers, [index]: answer };
        setAnswers(updatedAnswers);
        console.log("Onboarding answers:", updatedAnswers);
        setIndex((i) => (i < steps.length - 1 ? i + 1 : i));
    };

    const handleBack = () => {
        setIndex((i) => (i > 0 ? i - 1 : i));
    };

    return (
        <main className="h-screen px-4 flex flex-col bg-onboarding py-4">
            {index < total && <NavigationHeader currentStep={index} totalSteps={total} onBack={handleBack} canGoBack={index > 0} />}
            <div className="flex-1 overflow-y-auto py-4">
                <CurrentStep onNext={handleNext} />
            </div>
        </main>
    );
}
