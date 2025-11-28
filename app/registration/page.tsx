"use client";

import { useState } from "react";

import { NavigationHeader } from "./_components/NavigationHeader";
import { ProfileSetupStep, StepData } from "./_components/steps/ProfileSetupStep";
import { SkinTypeStep } from "./_components/steps/SkinTypeStep";
import { SkinConcernsStep } from "./_components/steps/SkinConcernsStep";
import { CompletionStep } from "./_components/steps/CompletionStep";

const steps = [ProfileSetupStep, SkinTypeStep, SkinConcernsStep, CompletionStep];
const total = steps.length - 1;

export default function RegistrationPage() {
    const [index, setIndex] = useState(0 as number);
    const [answers, setAnswers] = useState<Record<number, StepData | string | string[]>>({});
    const CurrentStep = steps[index];
    const isCompletion = index === total;

    const handleNext = (answer: StepData | string | string[]) => {
        const updatedAnswers = { ...answers, [index]: answer };
        setAnswers(updatedAnswers);
        console.log("Registration answers:", updatedAnswers);
        setIndex((i) => (i < steps.length - 1 ? i + 1 : i));
    };

    const handleBack = () => {
        setIndex((i) => (i > 0 ? i - 1 : i));
    };

    return (
        <main className={`min-h-screen h-full p-4 flex-center flex-col w-full ${isCompletion ? "justify-center" : "justify-start"}`}>
            {index < total && <NavigationHeader currentStep={index} totalSteps={total} onBack={handleBack} canGoBack={index > 0} />}
            <div className="flex-1 py-4 w-full flex flex-col items-center gap-4">
                <CurrentStep onNext={handleNext} />
            </div>
        </main>
    );
}
