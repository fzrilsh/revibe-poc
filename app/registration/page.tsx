"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { NavigationHeader } from "./_components/NavigationHeader";
import { ProfileSetupStep, StepData } from "./_components/steps/ProfileSetupStep";
import { SkinTypeStep } from "./_components/steps/SkinTypeStep";
import { SkinConcernsStep } from "./_components/steps/SkinConcernsStep";
import { CompletionStep } from "./_components/steps/CompletionStep";
import { AnimatePresence, motion } from "motion/react";
import { fadeIn, fadeUp } from "@/assets/animations";

const steps = [ProfileSetupStep, SkinTypeStep, SkinConcernsStep, CompletionStep];
const total = steps.length - 1;

export default function RegistrationPage() {
    const [index, setIndex] = useState(0 as number);
    const [answers, setAnswers] = useState<Record<number, StepData | string | string[]>>({});
    const [checking, setChecking] = useState(true);

    const CurrentStep = steps[index] as React.ComponentType<{ onNext: (answer: StepData | string | string[]) => void }>;
    const isCompletion = index === total;
    const router = useRouter();

    // Fast guard: authenticated -> home; require intro seen cookie -> else splash
    useEffect(() => {
        try {
            const hasToken = document.cookie.split(";").some((c) => c.trim().startsWith("rv_token="));
            if (hasToken) {
                window.location.href = "/";
                return;
            }
            const hasSeenIntroCookie = document.cookie
                .split(";")
                .some((c) => c.trim().startsWith("revibe_intro_seen="));
            if (!hasSeenIntroCookie) {
                router.push("/splash");
                return;
            }
            setTimeout(() => setChecking(false), 0);
        } catch {}
    }, [router]);

    const handleNext = (answer: StepData | string | string[]) => {
        const updatedAnswers = { ...answers, [index]: answer };
        setAnswers(updatedAnswers);
        console.log("Registration answers:", updatedAnswers);
        setIndex((i) => (i < steps.length - 1 ? i + 1 : i));
    };

    const handleBack = () => {
        setIndex((i) => (i > 0 ? i - 1 : i));
    };

    const submitRegistration = async () => {
        try {
            const profile = answers[0] as StepData | undefined;
            const skinType = (answers[1] as string | undefined) ?? "";
            const concerns = (answers[2] as string[] | undefined) ?? [];

            if (!profile?.file) {
                setChecking(false);
                setIndex(0);
                alert("Profile image is required");
                return;
            }

            if (!profile || !profile.nickname || !profile.birthYear) {
                alert("Please complete your profile information");
                return;
            }

            // Map skin type to API enum
            const skinTypeMap: Record<string, string> = {
                normal: "NORMAL",
                combination: "COMBINATION",
                dry: "DRY",
                oily: "OILY",
                sensitive: "SENSITIVE",
            };

            // Map concern ids (order based on prisma seed)
            const concernMap: Record<string, number> = {
                "acne-prone": 1,
                sensitive: 2,
                "uneven-tone": 3,
                cracking: 4,
                "dark-spots": 5,
                dullness: 6,
                "large-pores": 7,
                "wrinkle-aging": 8,
                "dark-circles": 9,
                hyperpigmentation: 10,
            };
            const skinConcernIds = concerns.map((k) => concernMap[k]).filter(Boolean);

            // Read onboarding answers from localStorage
            let onboardingAnswers: Array<{ questionId: number; answer: string }> = [];
            try {
                const raw = localStorage.getItem("revibe_onboarding_answers");
                onboardingAnswers = raw ? JSON.parse(raw) : [];
            } catch {}

            // Build FormData
            const formData = new FormData();
            formData.append("nickname", profile.nickname);
            formData.append("birth_year", String(profile.birthYear));
            formData.append("gender", profile.gender);
            if (skinType) formData.append("skin_type", skinTypeMap[skinType] ?? skinType.toUpperCase());
            formData.append("skin_concern_ids", JSON.stringify(skinConcernIds));
            formData.append("onboarding_answers", JSON.stringify(onboardingAnswers));

            // Append file
            if (profile.file) {
                formData.append("profile_image", profile.file);
            } else if (profile.photo) {
                // Fallback: convert DataURL to Blob -> File
                const res = await fetch(profile.photo);
                const blob = await res.blob();
                const file = new File([blob], `profile-${Date.now()}.png`, { type: blob.type || "image/png" });
                formData.append("profile_image", file);
            }

            const res = await fetch("/api/auth/register", { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.error || "Registration failed");
            }

            // Cleanup flags and go to home (user cookie is set by server)
            try {
                localStorage.removeItem("revibe_onboarding_answers");
            } catch {}

            router.push("/");
        } catch (err) {
            console.log((err as Error)?.message || "Failed to register");
        }
    };

    return (
        <motion.main {...fadeIn} className={`min-h-screen h-screen p-4 flex-center flex-col w-full ${isCompletion ? "justify-center" : "justify-start"}`}>
            {index < total && (
                <motion.div {...fadeUp} className="w-full">
                    <NavigationHeader currentStep={index} totalSteps={total} onBack={handleBack} canGoBack={index > 0} />
                </motion.div>
            )}
            <div className="flex-1 py-4 w-full h-full flex flex-col items-center gap-4">
                <AnimatePresence mode="wait">
                    {isCompletion ? (
                        <motion.div key="completion" {...fadeUp} className="w-full h-full">
                            <CompletionStep onNext={submitRegistration} />
                        </motion.div>
                    ) : (
                        <motion.div key={index} {...fadeUp} className="w-full h-full">
                            <CurrentStep onNext={handleNext} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {checking && (
                <motion.div {...fadeUp} className="mt-auto py-3 w-full flex items-center justify-center text-sm text-gray-500">Loading...</motion.div>
            )}
        </motion.main>
    );
}
