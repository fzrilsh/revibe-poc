import Image from "next/image";
import { useState } from "react";

type CompletionStepProps = {
    onNext: () => void | Promise<void>;
};

export function CompletionStep({ onNext }: CompletionStepProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleNext = async () => {
        setIsLoading(true);
        if(onNext) {
            await onNext();
        } else {
            setIsLoading(false);
        }
    }

    return (
        <div className="relative max-w-md mx-auto h-full w-full flex flex-col gap-8">
            {isLoading && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-50">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                    <p className="text-lg font-medium text-gray-700">Loading...</p>
                </div>
            )}

            <div className="flex-1 flex flex-col items-center justify-center gap-6">
                <div>
                    <Image src={"/registration_complete.svg"} alt="" width={260} height={290} />
                </div>
                <div className="text-center">
                    <h1 className="text-2xl max-w-xs font-semibold leading-snug text-woodsmoke">You did it! 🎉 Small step, big shift — your mindful beauty journey starts now. 🌿</h1>
                </div>
            </div>

            <button onClick={handleNext} disabled={isLoading} className="absolute bottom-0 w-full py-4 rounded-full bg-black text-white text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition cursor-pointer">
                Explore REVIBE
            </button>
        </div>
    );
}
