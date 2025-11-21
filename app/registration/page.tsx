"use client";

import { useState } from "react";
import { LuArrowLeft } from "react-icons/lu";

import Step1, { StepData } from "./steps/step1";
import Step2 from "./steps/step2";
import Step3 from "./steps/step3";
import Step4 from "./steps/step4";

const steps = [Step1, Step2, Step3, Step4];
const total = steps.length - 1;
export default function RegistrationPage() {
    const [index, setIndex] = useState(0 as number);
    const [answers, setAnswers] = useState<Record<number, StepData | string | string[]>>({});
    const progressPercent = ((index + 1) / total) * 100;
    const CurrentStep = steps[index];

    const handleNext = (answer: StepData | string | string[]) => {
        const updatedAnswers = { ...answers, [index]: answer };
        setAnswers(updatedAnswers);
        console.log("Registration answers:", updatedAnswers);
        setIndex((i) => (i < steps.length - 1 ? i + 1 : i));
    };

    return (
        <main className="h-screen px-4 flex-start justify-center flex-col">
            {index < total && (
                <header className="flex justify-between items-center py-4 gap-4 w-full">
                    <button onClick={() => setIndex((i) => (i > 0 ? i - 1 : i))} disabled={index === 0} className={index === 0 ? "opacity-40 cursor-not-allowed" : ""}>
                        <LuArrowLeft className="text-2xl text-woodsmoke" />
                    </button>
                    <div className="w-full h-1 bg-gray-300 rounded-full overflow-hidden">
                        <div className="h-full bg-[#958FFA] transition-all duration-300 ease-in-out" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <p>
                        {index + 1}/{total}
                    </p>
                </header>
            )}
            <div className="h-full py-4 flex-center flex-col gap-4">
                <CurrentStep onNext={handleNext} />
            </div>
        </main>
    );
}
