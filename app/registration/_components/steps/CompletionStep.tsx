import Image from "next/image";

type CompletionStepProps = {
    onSubmit: () => void | Promise<void>;
};

export function CompletionStep({ onSubmit }: CompletionStepProps) {
    return (
        <div className="max-w-md mx-auto h-full w-full flex flex-col gap-8">
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
                <div>
                    <Image src={"/registration_complete.svg"} alt="" width={260} height={290} />
                </div>
                <div className="text-center">
                    <h1 className="text-2xl max-w-xs font-semibold leading-snug text-woodsmoke">
                        You did it! 🎉 Small step, big shift — your mindful beauty journey starts now. 🌿
                    </h1>
                </div>
            </div>

            <button onClick={onSubmit} className="w-full py-4 rounded-full bg-black text-white text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition">
                Explore REVIBE
            </button>
        </div>
    );
}
