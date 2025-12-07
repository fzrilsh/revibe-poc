"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export function CompletionStep() {
    const router = useRouter();

    const handleContinue = () => {
        localStorage.setItem("revibe_intro_seen", "true");
        router.push("/registration");
    };

    return (
        <div className="relative max-w-md mx-auto h-full w-full flex items-center flex-col justify-center scrollbar-hide">
            <div className="flex flex-col items-center gap-8">
                <div>
                    <Image src={"/onboarding_complete.svg"} alt="" width={220} height={250} />
                </div>
                <div className="flex-center text-center gap-4">
                    <h1 className="text-2xl max-w-xs font-semibold leading-snug text-woodsmoke">Nicely done! 💛 A fresh start for your skin, your shelf, and your mindset.</h1>
                </div>
            </div>

            <button onClick={handleContinue} className="absolute bottom-0 w-full py-4 rounded-full bg-black text-white text-lg hover:bg-gray-800 transition">
                Continue
            </button>
        </div>
    );
}
