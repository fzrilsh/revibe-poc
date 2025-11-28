interface StepIndicatorProps {
    totalSteps: number;
    currentStep: number;
}

export function StepIndicator({ totalSteps, currentStep }: StepIndicatorProps) {
    return (
        <div className="flex-center flex-row gap-3">
            {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                    key={index}
                    className={`w-10 h-1 rounded-full transition-colors ${
                        index === currentStep ? "bg-gray-400" : "bg-gray-300"
                    }`}
                />
            ))}
        </div>
    );
}
