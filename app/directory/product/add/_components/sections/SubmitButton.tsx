"use client";

import { useState } from "react";

interface SubmitButtonProps {
    isEnabled: boolean;
}

export default function SubmitButton({ isEnabled }: SubmitButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    };

    const isDisabled = !isEnabled || isLoading;

    return (
        <button 
            type="submit" 
            disabled={isDisabled}
            onClick={handleSubmit}
            className={`mt-2 w-full rounded-full py-3 text-sm font-medium transition flex items-center justify-center gap-2 ${
                isDisabled
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
            }`}
        >
            {isLoading ? (
                <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                </>
            ) : isEnabled ? (
                "Submit"
            ) : (
                "Fill in all required fields"
            )}
        </button>
    );
}
