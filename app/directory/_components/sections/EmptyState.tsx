"use client";

import Image from "next/image";
import { FixedActionButton } from "@ui/FixedActionButton";
import { useRouter } from "next/navigation";

export function EmptyState() {
    const router = useRouter();

    const onAddProduct = () => {
        router.push("/directory/product/add");
    };

    return (
        <>
            <div className="flex-center flex-col h-full gap-4 pb-4">
                <div className="relative w-40 h-40 mt-auto opacity-60">
                    <Image src="/directory/empty.svg" alt="Empty directory" fill className="object-contain" />
                </div>
                <div className="flex-center flex-col gap-1">
                    <p className="text-lg text-gray-500">Your directory is empty.</p>
                    <p className="text-lg text-gray-500">Start adding product now!</p>
                </div>
            </div>
            <FixedActionButton onClick={onAddProduct}>Add a product</FixedActionButton>
        </>
    );
}
