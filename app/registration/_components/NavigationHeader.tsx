import { LuArrowLeft } from "react-icons/lu";
import { ProgressBar } from "./ProgressBar";

interface NavigationHeaderProps {
    currentStep: number;
    totalSteps: number;
    onBack: () => void;
    canGoBack: boolean;
}

export function NavigationHeader({ currentStep, totalSteps, onBack, canGoBack }: NavigationHeaderProps) {
    return (
        <header className="flex justify-between items-center py-4 gap-4 w-full">
            <button onClick={onBack} disabled={!canGoBack} className={!canGoBack ? "opacity-40 cursor-not-allowed" : ""}>
                <LuArrowLeft className="text-2xl text-woodsmoke" />
            </button>
            <ProgressBar current={currentStep} total={totalSteps} />
            <p>
                {currentStep + 1}/{totalSteps}
            </p>
        </header>
    );
}
