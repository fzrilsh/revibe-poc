"use client";

import { StepProps } from "@type/onboarding";
import { useState } from "react";

const concerns = [
    { id: "acne-prone", label: "Acne-prone" },
    { id: "sensitive", label: "Sensitive" },
    { id: "uneven-tone", label: "Uneven tone" },
    { id: "cracking", label: "Cracking" },
    { id: "dark-spots", label: "Dark spots" },
    { id: "dullness", label: "Dullness" },
    { id: "large-pores", label: "Large pores" },
    { id: "wrinkle-aging", label: "Wrinkle/Aging" },
    { id: "dark-circles", label: "Dark circles" },
    { id: "hyperpigmentation", label: "Hyperpigmentation" },
];

export function SkinConcernsStep({ onNext }: StepProps<string[]>) {
    const [selected, setSelected] = useState<string[]>([]);

    const isValid = selected.length > 0;

    const toggleConcern = (id: string) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    };

    const handleContinue = () => {
        if (isValid) {
            onNext(selected);
        }
    };

    return (
        <div className="max-w-md mx-auto w-full flex-center h-full flex-col gap-8">
            <div className="flex-center flex-col gap-2 text-center">
                <h1 className="text-2xl font-bold leading-snug text-woodsmoke">What are your skin concerns?</h1>
                <p className="text-gray-600">You can select as many tags as you&apos;d like</p>
            </div>

            <div className="flex-center flex-col gap-4 h-full">
                <div className="grid grid-cols-2 gap-3 w-full">
                    {concerns.map((concern) => (
                        <button
                            key={concern.id}
                            type="button"
                            onClick={() => toggleConcern(concern.id)}
                            className={["px-6 py-3 min-h-12 rounded-full border-2 font-medium transition flex items-center justify-center", selected.includes(concern.id) ? "bg-[#958FFA] border-[#958FFA] text-white" : "bg-white border-gray-300 text-woodsmoke hover:border-[#958FFA]"].join(" ")}
                        >
                            {concern.label}
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
