"use client";

import { StepProps } from "@type/onboarding";
import { useState } from "react";

type Option = {
    id: string;
    emoji: string;
    label: string;
};

const options: Option[] = [
    { id: "peaceful", emoji: "👍", label: "Simple and under control" },
    { id: "sometimes", emoji: "🥺", label: "Aligned with what truly works for me, not by trends" },
    { id: "too-many", emoji: "🌱", label: "Sustainable and fulfilling — not just consuming" },
];

export function BeautyGoalStep({ onNext }: StepProps) {
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (optionId: string) => {
        setSelected(optionId);
        setTimeout(() => {
            onNext(optionId);
        }, 300);
    };

    return (
        <div className="max-w-md mx-auto w-full flex-center flex-col gap-8">
            <div className="flex-center text-center gap-4">
                <h1 className="text-2xl max-w-xs font-semibold leading-snug text-woodsmoke">
                    How do you want your beauty journey to feel?
                </h1>
            </div>
            <div className="flex-center flex-col w-full gap-4">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelect(opt.id)}
                        className={[
                            "w-full text-left flex items-center gap-3 rounded-2xl border-2 px-5 py-4 bg-white transition",
                            "hover:border-[#958FFA]",
                            selected === opt.id ? "border-[#958FFA] ring-2 ring-[#958FFA]/40" : "border-gray-300",
                        ].join(" ")}
                        aria-pressed={selected === opt.id}
                    >
                        <span className="text-2xl" aria-hidden="true">
                            {opt.emoji}
                        </span>
                        <span className="font-medium text-woodsmoke leading-snug">{opt.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
