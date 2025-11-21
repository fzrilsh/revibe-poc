"use client";
import { useState } from "react";
import Step1 from "./steps/step1";
import Step2 from "./steps/step2";
import Step3 from "./steps/step3";

export default function OpeningPage() {
    const [index, setIndex] = useState(0);

    const handleNext = () => {
        setIndex((i) => Math.min(i + 1, 2));
    };

    return (
        <main className="h-screen">
            {index === 0 && <Step1 onNext={handleNext} currentStep={0} />}
            {index === 1 && <Step2 onNext={handleNext} currentStep={1} />}
            {index === 2 && <Step3 onNext={handleNext} currentStep={2} />}
        </main>
    );
}
