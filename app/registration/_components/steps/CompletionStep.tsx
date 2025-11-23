import Image from "next/image";

export function CompletionStep() {
    return (
        <div className="max-w-md mx-auto h-full w-full flex-center flex-col gap-8">
            <div className="mt-auto">
                <Image src={"/registration_complete.svg"} alt="" width={260} height={290} />
            </div>
            <div className="flex-center text-center gap-4">
                <h1 className="text-2xl max-w-xs font-semibold leading-snug text-woodsmoke">
                    You did it! 🎉 Small step, big shift — your mindful beauty journey starts now. 🌿
                </h1>
            </div>

            <button className="w-full py-4 mt-auto rounded-full bg-black text-white text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition">
                Explore REVIBE
            </button>
        </div>
    );
}
