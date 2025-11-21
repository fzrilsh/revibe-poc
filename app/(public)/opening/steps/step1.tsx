"use client";

import Image from "next/image";
import { LuArrowRight } from "react-icons/lu";

interface Step1Props {
    onNext: () => void;
    currentStep: number;
}

export default function Step1({ onNext, currentStep }: Step1Props) {
    return (
        <section className="h-screen flex-center max-h-full flex-col pb-10 gap-8 justify-center">
            <div className="flex-center flex-1 w-full">
                <div className="relative overflow-hidden h-full w-full">
                    <Image src={"/opening_1.svg"} fill alt="Opening One Images" className="object-cover" priority />
                </div>
            </div>

            <h1 className="text-2xl font-medium text-gray-900 mb-4 text-center">Welcome to REVIBE</h1>
            <div className="text-center px-10 max-w-sm mx-auto text-siam leading-relaxed space-y-1">
                <p>Rethink your beauty habits. Track, reflect, and revive your beauty products — one product at a time.</p>
            </div>

            <div className="flex-center flex-row gap-3">
                {[0, 1, 2].map((step) => (
                    <div
                        key={step}
                        className={`w-10 h-1 rounded-full transition-colors ${
                            step === currentStep ? "bg-gray-400" : "bg-gray-300"
                        }`}
                    />
                ))}
            </div>

            <div onClick={onNext} className="w-16 h-16 bg-black hover:bg-neutral-900 p-2 rounded-full flex-center mt-auto cursor-pointer">
                <LuArrowRight className="text-2xl rounded-full flex-center text-white transition-colors" />
            </div>
        </section>
    );
}
