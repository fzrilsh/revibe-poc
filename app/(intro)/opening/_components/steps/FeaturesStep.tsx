"use client";

import Image from "next/image";
import { StepIndicator } from "../StepIndicator";
import { NextButton } from "../NextButton";

interface FeaturesStepProps {
    onNext: () => void;
    currentStep: number;
}

export function FeaturesStep({ onNext, currentStep }: FeaturesStepProps) {
    return (
        <section className="h-screen flex-center max-h-full flex-col pb-10 gap-8 justify-center">
            <div className="flex-center flex-1 w-full">
                <div className="relative overflow-hidden h-full w-full">
                    <Image src={"/opening_2.svg"} fill alt="Opening Two Images" className="object-cover" priority />
                </div>
            </div>

            <h1 className="text-2xl font-medium text-gray-900 mb-4 text-center">What You&apos;ll Get</h1>
            <div className="text-center px-10 max-w-sm mx-auto text-siam leading-relaxed space-y-1">
                <p>✅ Track product expiry & PAO</p>
                <p>💡 Join mindful beauty challenges</p>
                <p>💭 Connect and learn from others</p>
                <p>🌺 Find what truly works for you</p>
            </div>

            <StepIndicator totalSteps={3} currentStep={currentStep} />
            <NextButton onClick={onNext} />
        </section>
    );
}
