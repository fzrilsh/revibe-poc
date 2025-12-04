import { motion } from "motion/react";

interface StepIndicatorProps {
    totalSteps: number;
    currentStep: number;
}

export function StepIndicator({ totalSteps, currentStep }: StepIndicatorProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-center flex-row gap-3"
        >
            {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                    key={index}
                    className={`w-10 h-1 rounded-full transition-colors ${
                        index === currentStep ? "bg-gray-400" : "bg-gray-300"
                    }`}
                />
            ))}
        </motion.div>
    );
}
