"use client";

import { StepProps } from "@type/onboarding";
import { useState } from "react";

const skinTypes = [
    { id: "normal", label: "Normal" },
    { id: "combination", label: "Combination" },
    { id: "dry", label: "Dry skin" },
    { id: "oily", label: "Oily Skin" },
    { id: "sensitive", label: "Sensitive" },
];

export function SkinTypeStep({ onNext }: StepProps<string>) {
    const [selected, setSelected] = useState<string | null>(null);

    const isValid = selected !== null;

    const handleContinue = () => {
        if (isValid) {
            onNext(selected);
        }
    };

    return (
        <div className="max-w-md mx-auto w-full h-full flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold leading-snug text-woodsmoke">What is your skin type?</h1>
                <p className="text-gray-600">Help us tailor your best experience</p>
            </div>

            <div className="flex flex-col gap-4 h-full">
                <div className="grid grid-cols-2 gap-3 w-full">
                    {skinTypes.map((type, index) => (
                        <button
                            key={type.id}
                            type="button"
                            onClick={() => setSelected(type.id)}
                            className={[
                                "px-6 py-3 rounded-full border-2 font-medium transition",
                                selected === type.id ? "bg-[#E8E7FC] border-[#958FFA]" : "bg-white border-gray-300 text-woodsmoke hover:border-[#958FFA]",
                                index === skinTypes.length - 1 && skinTypes.length % 2 !== 0 ? "col-span-2 mx-auto w-1/2" : "",
                            ].join(" ")}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>

                <button onClick={handleContinue} disabled={!isValid} className="w-full py-4 mt-auto rounded-full bg-black text-white text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition">
                    Continue
                </button>
            </div>
        </div>
    );
}
