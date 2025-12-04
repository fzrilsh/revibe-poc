"use client";

import Image from "next/image";
import { StepIndicator } from "../StepIndicator";
import { NextButton } from "../NextButton";

import { motion } from "motion/react";
import { slideInDown, fadeIn } from "@/assets/animations/variants";

interface CommunityStepProps {
    onNext: () => void;
    currentStep: number;
}

export function CommunityStep({ onNext, currentStep }: CommunityStepProps) {
    return (
        <section className="h-screen flex-center max-h-full flex-col pb-10 gap-8">
            <motion.div {...slideInDown} className="flex-center flex-1 w-full">
                <div className="relative overflow-hidden h-full w-full">
                    <Image src={"/opening_3.svg"} fill alt="Opening Three Images" className="object-cover" priority />
                </div>
            </motion.div>

            <motion.h1 {...fadeIn} className="text-2xl font-medium text-gray-900 mb-4 text-center">Community</motion.h1>
            <div className="text-center px-10 max-w-sm mx-auto text-siam leading-relaxed space-y-1">
                <p>Beauty is better when shared. Exchange reviews and inspire mindful habits together. Let&apos;s revibe your beauty!</p>
            </div>

            <StepIndicator totalSteps={3} currentStep={currentStep} />
            <NextButton onClick={onNext} />
        </section>
    );
}
