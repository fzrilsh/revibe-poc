"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function CompletionStep() {
    const router = useRouter();

    useEffect(() => {
        const handleContinue = () => {
            localStorage.setItem("revibe_intro_seen", "true");
            router.push("/registration");
        };

        const timer = setTimeout(handleContinue, 2000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="max-w-md mx-auto h-screen w-full flex items-center justify-center scrollbar-hide">
            <div className="flex flex-col items-center gap-8">
                <div>
                    <Image src={"/onboarding_complete.svg"} alt="" width={220} height={250} />
                </div>
                <div className="flex-center text-center gap-4">
                    <h1 className="text-2xl max-w-xs font-semibold leading-snug text-woodsmoke">Nicely done! 💛 A fresh start for your skin, your shelf, and your mindset.</h1>
                </div>
            </div>
        </div>
    );
}
