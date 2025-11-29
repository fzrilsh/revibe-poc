"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WelcomeStep } from "./_components/steps/WelcomeStep";
import { FeaturesStep } from "./_components/steps/FeaturesStep";
import { CommunityStep } from "./_components/steps/CommunityStep";

const steps = [WelcomeStep, FeaturesStep, CommunityStep];

export default function OpeningPage() {
    const [index, setIndex] = useState(0);
    const [checking, setChecking] = useState(true);
    const router = useRouter();

    // Fast guard without network: stay to show opening if not seen, otherwise go to onboarding
    useEffect(() => {
        try {
            const hasToken = document.cookie.split(";").some((c) => c.trim().startsWith("rv_token="));
            if (hasToken) {
                // already authenticated -> go home
                window.location.href = "/";
                return;
            }
            const hasSeenIntro = localStorage.getItem("revibe_intro_seen");
            if (hasSeenIntro) {
                // intro already seen -> skip opening, go to onboarding
                router.push("/onboarding");
                return;
            }
            // else: show opening steps, and mark seen when completed in handleNext
            setTimeout(() => setChecking(false), 0);
        } catch {}
    }, [router]);

    const handleNext = () => {
        if (index < steps.length - 1) {
            setIndex((i) => i + 1);
        } else {
            // Selesai opening, lanjut ke onboarding
            router.push("/onboarding");
        }
    };

    const CurrentStep = steps[index];

    return (
        <main className="h-screen flex flex-col">
            <CurrentStep onNext={handleNext} currentStep={index} />
            {checking && (
                <div className="mt-auto py-3 w-full flex items-center justify-center text-sm text-gray-500">
                    Loading...
                </div>
            )}
        </main>
    );
}
