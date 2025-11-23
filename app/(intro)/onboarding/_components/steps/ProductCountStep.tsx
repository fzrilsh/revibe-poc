"use client";

import { StepProps } from "@type/onboarding";
import { useState } from "react";

type Option = {
    id: string;
    emoji: string;
    label: string;
};

const options: Option[] = [
    { id: "peaceful", emoji: "💚", label: "5-10 products" },
    { id: "sometimes", emoji: "💜", label: "20-30 products" },
    { id: "too-many", emoji: "💙", label: "40-50 products" },
    { id: "love", emoji: "❤️", label: "> 50 products" },
];

export function ProductCountStep({ onNext }: StepProps) {
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
                    Roughly how many beauty products do you own right now?
                </h1>
                <p>No judgement, we only want to know you better</p>
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
