"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Step6() {
    // const handleComplete = () => {
    //     onNext("completed");
    //     router.push("/");
    // };

    return (
        <div className="max-w-md mx-auto h-full w-full flex-center flex-col gap-8">
            <div>
                <Image src={"/onboarding_complete.svg"} alt="" width={220} height={250} />
            </div>
            <div className="flex-center text-center gap-4">
                <h1 className="text-2xl max-w-xs font-semibold leading-snug text-woodsmoke">Nicely done! 💛 A fresh start for your skin, your shelf, and your mindset.</h1>
            </div>
        </div>
    );
}
