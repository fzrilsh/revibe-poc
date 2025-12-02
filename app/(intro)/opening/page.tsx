"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WelcomeStep } from "./_components/steps/WelcomeStep";
import { FeaturesStep } from "./_components/steps/FeaturesStep";
import { CommunityStep } from "./_components/steps/CommunityStep";
import { AnimatePresence, motion } from "motion/react";
import { fadeIn, fadeUp } from "@/assets/animations";

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
            // Just show the opening steps - user came here from splash
            setTimeout(() => setChecking(false), 0);
        } catch {}
    }, [router]);

    const handleNext = () => {
        if (index < steps.length - 1) {
            setIndex((i) => i + 1);
        } else {
            // Selesai opening, lanjut ke registration
            router.push("/onboarding");
        }
    };

    const CurrentStep = steps[index];

    return (
        <motion.main {...fadeIn} className="h-screen flex flex-col">
            <AnimatePresence mode="wait">
                <motion.div key={index} {...fadeUp} className="flex-1 flex flex-col">
                    <CurrentStep onNext={handleNext} currentStep={index} />
                </motion.div>
            </AnimatePresence>
            {checking && (
                <motion.div {...fadeUp} className="mt-auto py-3 w-full flex items-center justify-center text-sm text-gray-500">
                    Loading...
                </motion.div>
            )}
        </motion.main>
    );
}
