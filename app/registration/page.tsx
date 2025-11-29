"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    const router = useRouter();

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
            const skinType = (answers[1] as string | undefined) ?? '';
            const concerns = (answers[2] as string[] | undefined) ?? [];

            if (!profile || !profile.nickname || !profile.birthYear) {
                alert("Please complete your profile information");
                return;
            }

            // Map skin type to API enum
            const skinTypeMap: Record<string, string> = {
                normal: 'NORMAL',
                combination: 'COMBINATION',
                dry: 'DRY',
                oily: 'OILY',
                sensitive: 'SENSITIVE',
            };

            // Map concern ids (order based on prisma seed)
            const concernMap: Record<string, number> = {
                'acne-prone': 1,
                'sensitive': 2,
                'uneven-tone': 3,
                'cracking': 4,
                'dark-spots': 5,
                'dullness': 6,
                'large-pores': 7,
                'wrinkle-aging': 8,
                'dark-circles': 9,
                'hyperpigmentation': 10,
            };
            const skinConcernIds = concerns.map((k) => concernMap[k]).filter(Boolean);

            // Read onboarding answers from localStorage
            let onboardingAnswers: any[] = [];
            try {
                const raw = localStorage.getItem('revibe_onboarding_answers');
                onboardingAnswers = raw ? JSON.parse(raw) : [];
            } catch {}

            // Build FormData
            const formData = new FormData();
            formData.append('nickname', profile.nickname);
            formData.append('birth_year', String(profile.birthYear));
            if (skinType) formData.append('skin_type', skinTypeMap[skinType] ?? skinType.toUpperCase());
            formData.append('skin_concern_ids', JSON.stringify(skinConcernIds));
            formData.append('onboarding_answers', JSON.stringify(onboardingAnswers));

            // Append file
            if (profile.file) {
                formData.append('profile_image', profile.file);
            } else if (profile.photo) {
                // Fallback: convert DataURL to Blob -> File
                const res = await fetch(profile.photo);
                const blob = await res.blob();
                const file = new File([blob], `profile-${Date.now()}.png`, { type: blob.type || 'image/png' });
                formData.append('profile_image', file);
            }

            const res = await fetch('/api/auth/register', { method: 'POST', body: formData });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.error || 'Registration failed');
            }

            // Cleanup flags and go to home (user cookie is set by server)
            try {
                localStorage.removeItem('revibe_onboarding_answers');
                localStorage.removeItem('revibe_intro_seen');
            } catch {}

            router.push('/');
        } catch (err: any) {
            alert(err?.message || 'Failed to register');
        }
    };

    return (
        <main className={`min-h-screen h-full p-4 flex-center flex-col w-full ${isCompletion ? "justify-center" : "justify-start"}`}>
            {index < total && <NavigationHeader currentStep={index} totalSteps={total} onBack={handleBack} canGoBack={index > 0} />}
            <div className="flex-1 py-4 w-full flex flex-col items-center gap-4">
                {isCompletion ? (
                    <CompletionStep onNext={submitRegistration as any} />
                ) : (
                    <CurrentStep onNext={handleNext} />
                )}
            </div>
        </main>
    );
}
