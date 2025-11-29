"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
    const [checking, setChecking] = useState(true);
    const CurrentStep = steps[index];
    const router = useRouter();

    // Fast guard: require intro seen, block authenticated users
    useEffect(() => {
        try {
            const hasToken = document.cookie.split(";").some((c) => c.trim().startsWith("rv_token="));
            if (hasToken) {
                window.location.href = "/";
                return;
            }
            const hasSeenIntro = localStorage.getItem("revibe_intro_seen");
            if (!hasSeenIntro) {
                router.push("/splash");
                return;
            }
            setTimeout(() => setChecking(false), 0);
        } catch {}
    }, [router]);

    const handleNext = (answer: string) => {
        const updatedAnswers = { ...answers, [index]: answer };
        setAnswers(updatedAnswers);
        console.log("Onboarding answers:", updatedAnswers);
        // compute next index
        setIndex((i) => {
            const nextIndex = i < steps.length - 1 ? i + 1 : i;
            // When entering CompletionStep, persist onboarding answers to localStorage
            if (nextIndex === steps.length - 1) {
                const questionCount = steps.length - 1; // exclude completion
                const arr = Array.from({ length: questionCount }, (_, q) => ({
                    questionId: q + 1,
                    answer: (q === index ? answer : updatedAnswers[q]) ?? "",
                }));
                try {
                    localStorage.setItem("revibe_onboarding_answers", JSON.stringify(arr));
                } catch {}
            }
            return nextIndex;
        });
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
            {checking && (
                <div className="mt-auto py-3 w-full flex items-center justify-center text-sm text-gray-500">Loading...</div>
            )}
        </main>
    );
}
